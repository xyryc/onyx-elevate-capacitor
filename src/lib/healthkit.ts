/**
 * HealthKit helpers — iOS Apple Health integration.
 * Wraps `@capgo/capacitor-health` with lazy loading and safety guards.
 * On non-iOS platforms, all functions resolve gracefully without crashing.
 */

import { Capacitor } from "@capacitor/core";

// ─── Platform guard ──────────────────────────────────────────────────────────

// Cache the result so we don't spam logs on every render.
let _isIOSNativeCache: boolean | null = null;

/** True only when running as a native iOS Capacitor app. */
export function isIOSNative(): boolean {
  if (_isIOSNativeCache !== null) return _isIOSNativeCache;
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  _isIOSNativeCache = isNative && platform === "ios";
  return _isIOSNativeCache;
}

// ─── Lazy Health import (only on iOS) ────────────────────────────────────────

let _healthModule: Awaited<ReturnType<typeof import("@capgo/capacitor-health")>>["Health"] | null =
  null;

async function getHealth() {
  if (_healthModule) return _healthModule;
  try {
    const { Health } = await import("@capgo/capacitor-health");
    _healthModule = Health;
    return Health;
  } catch (err) {
    console.error("[HealthKit] Failed to import '@capgo/capacitor-health' plugin:", err);
    throw err;
  }
}

// ─── Native HealthKit Operations ─────────────────────────────────────────────

/**
 * Check if the Apple Health SDK is supported on the current device.
 */
export async function hkIsAvailable(): Promise<boolean> {
  if (!isIOSNative()) return false;
  try {
    const Health = await getHealth();
    const available = await Health.isAvailable();
    console.log(`[HealthKit] isAvailable: ${available}`);
    return !!available;
  } catch (err) {
    console.error("[HealthKit] isAvailable() failed:", err);
    return false;
  }
}

/**
 * Request read/write permissions for fitness and body metrics.
 * Shows the native Apple Health permission sheet.
 *
 * NOTE: requires a fresh Xcode build after `pod install` so that the
 * CapgoCapacitorHealth native framework is linked into the binary.
 */
export async function hkRequestPermissions(): Promise<boolean> {
  if (!isIOSNative()) return false;

  // Safety timeout — if the native bridge doesn't respond in 10s, resolve false
  // rather than hanging the UI forever. This can happen if the plugin class is
  // stripped by the linker (requires import CapgoCapacitorHealth in AppDelegate).
  const timeoutPromise = new Promise<boolean>((resolve) =>
    setTimeout(() => {
      console.warn(
        "[HealthKit] Native bridge timed out (10s). " +
          "Ensure `import CapgoCapacitorHealth` is in AppDelegate.swift and rebuild from Xcode.",
      );
      resolve(false);
    }, 10000),
  );

  const authPromise = (async (): Promise<boolean> => {
    try {
      console.log("[HealthKit] Requesting permissions...");
      const Health = await getHealth();

      // Fast-fail if HealthKit is not available on this device/simulator.
      const available = await Health.isAvailable();
      if (!available) {
        console.warn("[HealthKit] HealthKit is not available on this device.");
        return false;
      }
      console.log("[HealthKit] HealthKit available — calling requestAuthorization...");

      const options = {
        read: ["steps", "calories", "weight", "height"],
        write: ["weight", "calories"],
      };
      await Health.requestAuthorization(options);
      console.log("[HealthKit] requestAuthorization resolved — permission sheet answered.");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Failed to execute") || msg.includes("not implemented")) {
        console.error(
          "[HealthKit] Native plugin not linked. Rebuild from Xcode after adding import.",
          err,
        );
      } else {
        console.error("[HealthKit] Authorization failed:", err);
      }
      return false;
    }
  })();

  return Promise.race([authPromise, timeoutPromise]);
}

/**
 * Checks if the user has enabled Apple Health sync in their settings.
 * Apple does not expose the actual HK authorization status for privacy reasons,
 * so we track this ourselves via local preferences.
 */
export async function hkIsConnected(): Promise<boolean> {
  if (!isIOSNative()) return false;
  try {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("onyx.healthkit.enabled") === "true";
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Enable or disable HealthKit sync in the user's settings.
 */
export async function hkSetEnabled(enabled: boolean): Promise<void> {
  if (typeof window === "undefined") return;
  if (enabled) {
    window.localStorage.setItem("onyx.healthkit.enabled", "true");
  } else {
    window.localStorage.removeItem("onyx.healthkit.enabled");
  }
}
