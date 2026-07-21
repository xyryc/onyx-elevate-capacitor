import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isIOSNative, rcPurchase, type RCProductKind } from "@/lib/revenuecat";
import { toast } from "sonner";
import { refreshAccess } from "@/hooks/useAccess";

interface OpenCheckoutOptions {
  priceId: string;
  productSlug: string;
  successUrl?: string;
  discountCode?: string;
  firstMonthDiscount?: boolean;
}

/**
 * Backwards-compatible hook name, now uses Stripe on Web and RevenueCat on iOS.
 * Navigates to /checkout which mounts Stripe Embedded Checkout, or starts RC purchase.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openCheckout = useCallback(
    async (options: OpenCheckoutOptions) => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          const next = `${window.location.pathname}${window.location.search}`;
          window.location.href = `/auth?redirect=${encodeURIComponent(next)}`;
          return;
        }

        // On iOS native, intercept checkout and run Apple In-App Purchase via RevenueCat.
        if (isIOSNative()) {
          // Map productSlug to RevenueCat product kind
          let rcKind: RCProductKind | null = null;
          if (
            options.productSlug.includes("monthly") ||
            options.productSlug.startsWith("program:") ||
            options.productSlug.startsWith("plan:")
          ) {
            rcKind = "monthly";
          } else if (options.productSlug.includes("yearly")) {
            rcKind = "yearly";
          } else if (
            options.productSlug.includes("lifetime") ||
            options.productSlug === "bundle" ||
            options.productSlug === "__all_access__"
          ) {
            rcKind = "lifetime";
          }

          if (!rcKind) {
            toast.error("Invalid purchase option selected for this app.");
            return;
          }

          toast.loading("Opening App Store checkout...", { id: "rc-checkout" });
          const success = await rcPurchase(rcKind);
          if (success) {
            toast.success("🎉 Purchase successful! Access unlocked.", { id: "rc-checkout" });
            // Refresh access state reactively — NO hard reload, NO successUrl navigation.
            // successUrl is a web-only Stripe redirect path (e.g. /checkout/success?…)
            // that doesn't exist in the native router and causes a "Not Found" screen.
            // refreshAccess() updates useAccess across the whole app so gated content
            // unlocks immediately without leaving the current page.
            refreshAccess();
            // Poll a couple more times in case the RevenueCat→Supabase webhook takes a moment.
            [1500, 4000].forEach((ms) => window.setTimeout(refreshAccess, ms));
          } else {
            toast.dismiss("rc-checkout");
          }
          return;
        }

        await navigate({
          to: "/checkout",
          search: {
            priceId: options.priceId,
            slug: options.productSlug,
            ...(options.successUrl ? { successUrl: options.successUrl } : {}),
            ...(options.firstMonthDiscount ? { intro: "1" } : {}),
            ...(typeof window !== "undefined" && window.localStorage.getItem("onyx.rewardCode")
              ? { reward: window.localStorage.getItem("onyx.rewardCode") as string }
              : {}),
          },
        });
      } catch (err: any) {
        toast.error(err?.message || "An error occurred during checkout.");
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return { openCheckout, loading };
}
