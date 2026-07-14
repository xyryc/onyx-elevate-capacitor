import type { Lang } from "./translations";

export const TRANSLATION_CACHE_VERSION = "v11";

// One-time cleanup: older versions persisted the full generated dictionary
// (~1 MB per language) into localStorage, blowing past the ~5 MB quota so
// nothing new could be written (including the Supabase auth token). Remove
// any onyx.tx.* keys that are not on the current version.
export function purgeStaleTranslationCache() {
  if (typeof window === "undefined") return;
  try {
    const prefix = "onyx.tx.";
    const keep = `onyx.tx.${TRANSLATION_CACHE_VERSION}.`;
    const remove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix) && !k.startsWith(keep)) remove.push(k);
    }
    remove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export function translationCacheKey(lang: string) {
  return `onyx.tx.${TRANSLATION_CACHE_VERSION}.${lang}`;
}

export function translationReadyKey(lang: string) {
  return `onyx.tx.${TRANSLATION_CACHE_VERSION}.${lang}.ready`;
}

export function hasPreparedTranslations(lang: Lang | string) {
  if (lang === "en") return true;
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(translationReadyKey(lang)) === "1";
  } catch {
    return false;
  }
}

export function markPreparedTranslations(lang: Lang | string) {
  if (lang === "en" || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(translationReadyKey(lang), "1");
  } catch {
    // non-critical; the in-memory cache still prevents repeat blocking
  }
}

export function clearPreparedTranslations(lang: Lang | string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(translationReadyKey(lang));
  } catch {
    // non-critical
  }
}