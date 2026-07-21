import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import es from "./locales/es.json";
import no from "./locales/no.json";
import generatedNo from "./i18n/generated/no.json";
import generatedEs from "./i18n/generated/es.json";
import generatedPt from "./i18n/generated/pt-BR.json";
import { SEED } from "./i18n/seedDictionary";

// react-i18next setup with all translations bundled at build time.
// No network fetch, no async loading, switching language is instant.
export const I18N_STORAGE_KEY = "onyx.lang";

// App-internal language codes (kept for backward-compat with the rest of the app).
export type Lang = "en" | "pt-BR" | "es" | "no";

// Map our app codes to i18next language codes (i18next prefers short codes).
export const APP_TO_I18N: Record<Lang, string> = {
  en: "en",
  "pt-BR": "pt",
  es: "es",
  no: "no",
};
export const I18N_TO_APP: Record<string, Lang> = {
  en: "en",
  pt: "pt-BR",
  "pt-BR": "pt-BR",
  es: "es",
  no: "no",
};

function seedBundle(appLang: Exclude<Lang, "en">): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [source, map] of Object.entries(SEED)) {
    const translated = map[appLang];
    if (translated) out[source] = translated;
  }
  return out;
}

export function detectPreferredI18nLanguage(): string {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(I18N_STORAGE_KEY);
    if (stored && APP_TO_I18N[stored as Lang]) return APP_TO_I18N[stored as Lang];
  } catch {}
  // Never auto-pick from the browser/device language. The user chooses manually.
  return "en";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      pt: {
        translation: { ...(generatedPt as Record<string, string>), ...seedBundle("pt-BR"), ...pt },
      },
      es: {
        translation: { ...(generatedEs as Record<string, string>), ...seedBundle("es"), ...es },
      },
      no: {
        translation: { ...(generatedNo as Record<string, string>), ...seedBundle("no"), ...no },
      },
    },
    // Keep the first client render identical to SSR to avoid hydration errors.
    // LanguageProvider switches to the stored/browser language immediately after mount.
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "pt", "es", "no"],
    preload: ["en", "pt", "es", "no"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnNull: false,
    returnEmptyString: false,
    keySeparator: false,
    nsSeparator: false,
  });
}

export default i18n;
