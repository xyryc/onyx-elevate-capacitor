import { Capacitor } from "@capacitor/core";

/**
 * Capacitor-native storage adapter for Supabase auth.
 *
 * On Android/iOS, the WebView's localStorage is not guaranteed to survive
 * app restarts. This adapter uses @capacitor/preferences which maps to
 * SharedPreferences (Android) / UserDefaults (iOS) for reliable persistence.
 *
 * @capacitor/preferences is loaded lazily so this module is safe to import
 * during SSR (server-side rendering) where Capacitor APIs don't exist.
 */

interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

let preferencesModule: Promise<typeof import("@capacitor/preferences")> | undefined;

function loadPreferences(): Promise<typeof import("@capacitor/preferences")> {
  if (!preferencesModule) {
    preferencesModule = import("@capacitor/preferences").catch((err) => {
      // Reset so a subsequent call retries the import instead of
      // permanently returning the same rejection.
      preferencesModule = undefined;
      throw err;
    });
  }
  return preferencesModule;
}

/**
 * A persistent storage adapter backed by @capacitor/preferences.
 * Works in both Capacitor native (SharedPreferences/UserDefaults)
 * and browser (web-fallback uses localStorage) environments.
 *
 * Methods are safe to call on the server — they return the value
 * gracefully without crashing.
 */
export const capacitorStorage: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      const { Preferences } = await loadPreferences();
      const { value } = await Preferences.get({ key });
      console.log(
        `[Storage] getItem for key: ${key}, value size: ${value ? value.length : 0} bytes`,
      );
      return value ?? null;
    } catch (e) {
      console.error(`[Storage] Failed to getItem for key: ${key}:`, e);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      const { Preferences } = await loadPreferences();
      await Preferences.set({ key, value });
      console.log(`[Storage] setItem native Preferences saved for key: ${key}`);
      // Also write synchronously to localStorage as a fallback/mirror for instant route-gate validation
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
        console.log(`[Storage] setItem mirrored to localStorage for key: ${key}`);
      }
    } catch (e) {
      console.error(`[Storage] Failed to setItem for key: ${key}:`, e);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      const { Preferences } = await loadPreferences();
      await Preferences.remove({ key });
      console.log(`[Storage] removeItem native Preferences removed for key: ${key}`);
      // Also remove synchronously from localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        console.log(`[Storage] removeItem cleared from localStorage for key: ${key}`);
      }
    } catch (e) {
      console.error(`[Storage] Failed to removeItem for key: ${key}:`, e);
    }
  },
};

/**
 * Checks whether the code is running inside a Capacitor native WebView.
 */
export function isCapacitorNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function hasSavedBrowserSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as {
        access_token?: string;
        expires_at?: number;
        currentSession?: { access_token?: string; expires_at?: number };
      };
      const session = parsed.currentSession ?? parsed;
      if (!session.access_token) continue;
      if (session.expires_at && session.expires_at * 1000 < Date.now()) continue;
      console.log("[Auth] Synchronous localStorage session check succeeded for key:", key);
      return true;
    }
  } catch (e) {
    console.error("[Auth] Error parsing localStorage:", e);
    return false;
  }
  return false;
}

export async function hasSavedSession(): Promise<boolean> {
  console.log("[Auth] Starting session validation...");
  // 1. First try synchronous localStorage check (instant fallback)
  if (hasSavedBrowserSession()) {
    return true;
  }

  // 2. If running natively and localStorage is empty/purged, check Capacitor native preferences
  if (typeof window !== "undefined" && isCapacitorNative()) {
    console.log("[Auth] Local storage empty, attempting native preferences read...");
    try {
      const { Preferences } = await import("@capacitor/preferences");
      const { keys } = await Preferences.keys();
      console.log("[Auth] Retrieved native preferences keys:", keys);
      for (const key of keys) {
        if (!key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
        const { value } = await Preferences.get({ key });
        if (!value) {
          console.log("[Auth] Native key has empty value:", key);
          continue;
        }

        const parsed = JSON.parse(value) as {
          access_token?: string;
          expires_at?: number;
          currentSession?: { access_token?: string; expires_at?: number };
        };
        const session = parsed.currentSession ?? parsed;
        if (!session.access_token) {
          console.log("[Auth] Native session missing access_token");
          continue;
        }
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
          console.log("[Auth] Native session has expired");
          continue;
        }

        // Found valid native session! Mirror it to localStorage to prevent future checks
        console.log("[Auth] Valid native session found! Restoring to localStorage:", key);
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.error("[Auth] Failed to parse native session:", e);
    }
  }

  console.log("[Auth] No active session found.");
  return false;
}
