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
      return value ?? null;
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      const { Preferences } = await loadPreferences();
      await Preferences.set({ key, value });
    } catch {
      // Silently fail — storage is non-critical for SSR/edge cases
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      const { Preferences } = await loadPreferences();
      await Preferences.remove({ key });
    } catch {
      // Silently fail
    }
  },
};

/**
 * Checks whether the code is running inside a Capacitor native WebView.
 */
export function isCapacitorNative(): boolean {
  if (typeof window === "undefined") return false;
  return (window as unknown as { Capacitor?: { isNative?: boolean } }).Capacitor?.isNative === true;
}
