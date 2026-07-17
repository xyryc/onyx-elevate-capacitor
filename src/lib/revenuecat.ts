/**
 * RevenueCat helpers — iOS In-App Purchase integration.
 *
 * On iOS (Capacitor), all subscription & purchase flows must go through
 * Apple's StoreKit 2 via RevenueCat.  On web, Stripe continues to handle
 * payments and RevenueCat is never initialised.
 *
 * Usage:
 *   import { isIOSNative, rcConfigure, rcLogIn, rcGetOfferings, rcPurchase } from "@/lib/revenuecat";
 *
 * Set VITE_RC_IOS_API_KEY in your .env (RevenueCat → Project → API Keys → Public app-specific keys → iOS)
 */

import { Capacitor } from "@capacitor/core";

// ─── Platform guard ──────────────────────────────────────────────────────────

/** True only when running as a native iOS Capacitor app. */
export function isIOSNative(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";
}

// ─── Lazy RevenueCat import (only on iOS) ────────────────────────────────────

async function getRC() {
  const { Purchases, LOG_LEVEL } = await import("@revenuecat/purchases-capacitor");
  return { Purchases, LOG_LEVEL };
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

let _configured = false;

/**
 * Call once at app start (inside a useEffect in __root.tsx) when on iOS.
 * The API key must be your RevenueCat *iOS* public key.
 */
export async function rcConfigure(): Promise<void> {
  if (!isIOSNative() || _configured) return;
  const apiKey = import.meta.env.VITE_RC_IOS_API_KEY as string | undefined;
  if (!apiKey) {
    console.warn("[RevenueCat] VITE_RC_IOS_API_KEY is not set — iOS IAP will not work.");
    return;
  }
  const { Purchases, LOG_LEVEL } = await getRC();
  await Purchases.configure({ apiKey });
  // Show debug logs only in non-production builds.
  if (import.meta.env.DEV) {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
  }
  _configured = true;
}

/**
 * Link the RevenueCat anonymous ID to the signed-in Supabase user.
 * Call this after the user signs in.
 */
export async function rcLogIn(userId: string): Promise<void> {
  if (!isIOSNative()) return;
  const { Purchases } = await getRC();
  await Purchases.logIn({ appUserID: userId });
}

/**
 * Reset to anonymous on sign-out so the next user starts fresh.
 */
export async function rcLogOut(): Promise<void> {
  if (!isIOSNative()) return;
  const { Purchases } = await getRC();
  await Purchases.logOut();
}

// ─── Product IDs (must match App Store Connect exactly) ──────────────────────

export const RC_PRODUCT_IDS = {
  monthly: "com.onyxelevate.app.all_access_monthly",
  yearly: "com.onyxelevate.app.all_access_yearly",
  lifetime: "com.onyxelevate.app.all_access_lifetime",
} as const;

export type RCProductKind = keyof typeof RC_PRODUCT_IDS;

// ─── Purchase flow ───────────────────────────────────────────────────────────

/**
 * Trigger a native App Store purchase sheet for the given plan.
 * Returns true if the purchase completed successfully, false if the user
 * cancelled. Throws on unexpected errors so callers can show a toast.
 */
export async function rcPurchase(kind: RCProductKind): Promise<boolean> {
  if (!isIOSNative()) return false;
  const { Purchases } = await getRC();

  console.log(`[RevenueCat] rcPurchase called for kind="${kind}"`);

  // Fetch the current offerings.
  const offerings = await Purchases.getOfferings();
  console.log("[RevenueCat] getOfferings result:", JSON.stringify(offerings?.current?.availablePackages?.map((p: any) => ({
    identifier: p.identifier,
    packageType: p.packageType,
    productId: p.product?.identifier ?? p.storeProduct?.productIdentifier,
  }))));

  const current = offerings?.current;
  if (!current) {
    throw new Error("No current offering is configured in the RevenueCat dashboard. Set a Current Offering under Monetization → Offerings.");
  }

  const targetProductId = RC_PRODUCT_IDS[kind];
  console.log(`[RevenueCat] Looking for productId="${targetProductId}" in ${current.availablePackages?.length ?? 0} packages`);

  // Primary match: by product identifier.
  let pkg = current.availablePackages?.find(
    (p: any) =>
      (p.product?.identifier ?? p.storeProduct?.productIdentifier) === targetProductId,
  );

  // Fallback match: by RevenueCat package type string (MONTHLY / ANNUAL / LIFETIME).
  if (!pkg) {
    const typeMap: Record<RCProductKind, string[]> = {
      monthly:  ["MONTHLY", "$rc_monthly"],
      yearly:   ["ANNUAL", "YEARLY", "$rc_annual"],
      lifetime: ["LIFETIME", "$rc_lifetime"],
    };
    const types = typeMap[kind];
    pkg = current.availablePackages?.find(
      (p: any) => types.includes(p.packageType) || types.includes(p.identifier),
    );
    if (pkg) {
      console.log(`[RevenueCat] Matched package via type fallback: ${pkg.identifier} (${pkg.packageType})`);
    }
  }

  if (!pkg) {
    console.error("[RevenueCat] Available packages:", JSON.stringify(current.availablePackages));
    throw new Error(
      `Could not find a package for "${kind}" in your RevenueCat offering. ` +
      `Make sure your Offering contains a package linked to "${targetProductId}".`,
    );
  }

  console.log(`[RevenueCat] Purchasing package: ${pkg.identifier} (${pkg.packageType})`);

  try {
    const result = await Purchases.purchasePackage({ aPackage: pkg });
    console.log("[RevenueCat] purchasePackage result:", JSON.stringify(result?.customerInfo?.entitlements));
    const entitlement = result?.customerInfo?.entitlements?.all?.["all_access"];
    const success = entitlement?.isActive === true;
    console.log(`[RevenueCat] all_access entitlement active: ${success}`);
    return success;
  } catch (err: any) {
    const code = String(err?.code ?? "");
    const msg  = String(err?.message ?? err?.userInfo?.NSLocalizedDescription ?? "");
    console.log(`[RevenueCat] purchasePackage error code="${code}" message="${msg}"`);

    // Code 1 = user cancelled; SKErrorDomain 2 = user cancelled on device.
    if (code === "1" || code === "2" || msg.toLowerCase().includes("cancel")) {
      console.log("[RevenueCat] Purchase cancelled by user.");
      return false;
    }

    // Re-throw so useCheckout.ts can surface this in a toast.
    throw new Error(`Purchase failed: ${msg || code}`);
  }
}

/**
 * Check if the current user has an active "all_access" entitlement in RevenueCat.
 * Use this after app launch to restore purchases (e.g., after re-install).
 */
export async function rcCheckEntitlement(): Promise<boolean> {
  if (!isIOSNative()) return false;
  const { Purchases } = await getRC();
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.all["all_access"]?.isActive === true;
  } catch {
    return false;
  }
}
