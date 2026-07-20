/**
 * HealthKit helpers — iOS Apple Health integration.
 * Wraps `@capgo/capacitor-health` with lazy loading and safety guards.
 * On non-iOS platforms, all functions resolve gracefully without crashing.
 */

import { Capacitor } from "@capacitor/core";

// ─── Platform guard ──────────────────────────────────────────────────────────

/** True only when running as a native iOS Capacitor app. */
export function isIOSNative(): boolean {
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  console.log(`[HealthKit] Platform check: isNative=${isNative}, platform=${platform}`);
  return isNative && platform === "ios";
}

// ─── Lazy Health import (only on iOS) ────────────────────────────────────────

async function getHealth() {
  console.log("[HealthKit] Attempting lazy import of '@capgo/capacitor-health'...");
  try {
    const { Health } = await import("@capgo/capacitor-health");
    console.log("[HealthKit] Successfully imported '@capgo/capacitor-health' plugin.");
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
  if (!isIOSNative()) {
    console.log("[HealthKit] Availability check bypassed: not on iOS native.");
    return false;
  }
  try {
    const Health = await getHealth();
    console.log("[HealthKit] Calling Health.isAvailable()...");
    const available = await Health.isAvailable();
    console.log(`[HealthKit] Health.isAvailable() result: ${available}`);
    return available;
  } catch (err) {
    console.error("[HealthKit] Availability check failed with error:", err);
    return false;
  }
}

/**
 * Request read/write permissions for fitness and body metrics.
 * Shows the native Apple Health permission sheet.
 */
export async function hkRequestPermissions(): Promise<boolean> {
  if (!isIOSNative()) {
    console.log("[HealthKit] Permission request bypassed: not on iOS native.");
    return false;
  }
  try {
    console.log("[HealthKit] Requesting permissions...");
    const Health = await getHealth();
    
    // We request permissions for weight, height, body fat, active calories (energy), steps, and workouts.
    const options = {
      read: ["steps", "calories", "weight", "height"],
      write: ["weight", "calories"]
    };
    console.log("[HealthKit] Calling Health.requestAuthorization with options:", JSON.stringify(options));
    
    const promise = Health.requestAuthorization(options);
    console.log("[HealthKit] requestAuthorization promise created, waiting for user response...");
    
    await promise;
    console.log("[HealthKit] requestAuthorization completed successfully (user answered sheet or already authorized).");
    return true;
  } catch (err: any) {
    console.error("[HealthKit] Authorization failed with error:", err);
    return false;
  }
}

/**
 * Checks if the user is already authorized for HealthKit.
 * Note: Apple Health does not reveal if permissions are denied (for privacy reasons),
 * so requestAuthorization is safe to call repeatedly as it will only show the popup if needed.
 */
export async function hkIsConnected(): Promise<boolean> {
  if (!isIOSNative()) return false;
  try {
    // Check if the user has enabled Apple Health sync in local preferences
    if (typeof window !== "undefined") {
      const enabled = window.localStorage.getItem("onyx.healthkit.enabled") === "true";
      console.log(`[HealthKit] hkIsConnected check from localStorage: ${enabled}`);
      return enabled;
    }
    return false;
  } catch (err) {
    console.error("[HealthKit] hkIsConnected check failed:", err);
    return false;
  }
}

/**
 * Enable or disable HealthKit sync in the user's settings.
 */
export async function hkSetEnabled(enabled: boolean): Promise<void> {
  console.log(`[HealthKit] hkSetEnabled called with: ${enabled}`);
  if (typeof window === "undefined") return;
  if (enabled) {
    window.localStorage.setItem("onyx.healthkit.enabled", "true");
  } else {
    window.localStorage.removeItem("onyx.healthkit.enabled");
  }
}

