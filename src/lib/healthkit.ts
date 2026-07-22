/**
 * HealthKit helpers — iOS Apple Health integration.
 * Wraps the app's native HealthPlugin with safety guards.
 * On non-iOS platforms, all functions resolve gracefully without crashing.
 */

import { Capacitor, registerPlugin } from "@capacitor/core";

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

type HealthDataType = "steps" | "calories" | "weight" | "height";

export interface HkSummary {
  steps?: number;
  calories?: number;
  weightKg?: number;
  heightCm?: number;
}

interface HealthPlugin {
  isAvailable(): Promise<{ available: boolean; platform: "ios" }>;
  requestAuthorization(options: {
    read: HealthDataType[];
    write: HealthDataType[];
  }): Promise<unknown>;
  getTodaySummary(): Promise<HkSummary>;
}

const Health = registerPlugin<HealthPlugin>("Health");

// ─── Native HealthKit Operations ─────────────────────────────────────────────

/**
 * Check if the Apple Health SDK is supported on the current device.
 */
export async function hkIsAvailable(): Promise<boolean> {
  if (!isIOSNative()) return false;
  try {
    const res = await Health.isAvailable();
    console.log("[HealthKit] isAvailable result:", JSON.stringify(res));
    return typeof res === "object" && res !== null ? !!res.available : !!res;
  } catch (err) {
    console.error("[HealthKit] isAvailable() failed:", err);
    return false;
  }
}

/**
 * Request read/write permissions for fitness and body metrics.
 * Shows the native Apple Health permission sheet.
 */
export async function hkRequestPermissions(): Promise<boolean> {
  if (!isIOSNative()) return false;

  // Safety timeout — if the native bridge doesn't respond in 15s, resolve false
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<boolean>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(
        "[HealthKit] Native bridge timed out. Rebuild the iOS app so BridgeViewController can register HealthPlugin.",
      );
      resolve(false);
    }, 15000);
  });

  const authPromise = (async (): Promise<boolean> => {
    try {
      console.log("[HealthKit] Requesting permissions...");
      const isAvail = await hkIsAvailable();
      if (!isAvail) {
        console.warn("[HealthKit] HealthKit is not available on this device.");
        return false;
      }
      console.log("[HealthKit] HealthKit available — calling requestAuthorization...");

      const options = {
        read: ["steps" as const, "calories" as const, "weight" as const, "height" as const],
        write: ["weight" as const, "calories" as const],
      };
      await Health.requestAuthorization(options);
      console.log("[HealthKit] requestAuthorization resolved — permission sheet answered.");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[HealthKit] Authorization failed:", msg);
      return false;
    }
  })();

  try {
    return await Promise.race([authPromise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Fetch today's summary metrics from Apple Health:
 * steps, active calories, latest weight (kg), latest height (cm).
 */
export async function hkGetTodaySummary(): Promise<HkSummary | null> {
  if (!isIOSNative()) return null;
  try {
    const summary = await Health.getTodaySummary();
    console.log("[HealthKit] getTodaySummary result:", JSON.stringify(summary));
    return summary;
  } catch (err) {
    console.error("[HealthKit] getTodaySummary failed:", err);
    return null;
  }
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
