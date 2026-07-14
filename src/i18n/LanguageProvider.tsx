import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n, { APP_TO_I18N, detectPreferredI18nLanguage, I18N_STORAGE_KEY, I18N_TO_APP, type Lang } from "@/i18n";
import { purgeStaleTranslationCache } from "./translationCache";

if (typeof window !== "undefined") purgeStaleTranslationCache();

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export const LanguageContext = createContext<Ctx | null>(null);

function InnerProvider({ children }: { children: ReactNode }) {
  const { t: i18nT, i18n: i18nInstance } = useTranslation();
  const [lang, setLangState] = useState<Lang>(
    () => I18N_TO_APP[i18nInstance.language] ?? "en",
  );

  useEffect(() => {
    const onChange = (lng: string) => {
      const mapped = I18N_TO_APP[lng] ?? "en";
      setLangState(mapped);
      if (typeof document !== "undefined") {
        document.documentElement.lang = mapped === "pt-BR" ? "pt-BR" : mapped;
      }
    };
    i18nInstance.on("languageChanged", onChange);
    onChange(i18nInstance.language);
    return () => {
      i18nInstance.off("languageChanged", onChange);
    };
  }, [i18nInstance]);

  useEffect(() => {
    const preferred = detectPreferredI18nLanguage();
    if (preferred !== i18nInstance.language) {
      void i18nInstance.changeLanguage(preferred);
    }
  }, [i18nInstance]);

  const setLang = useCallback((l: Lang) => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(I18N_STORAGE_KEY, l);
    } catch {}
    void i18nInstance.changeLanguage(APP_TO_I18N[l] ?? "en");
  }, [i18nInstance]);

  const t = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      const value = i18nT(key, { defaultValue: key, ...(options ?? {}) });
      return typeof value === "string" ? value : key;
    },
    [i18nT],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <InnerProvider>{children}</InnerProvider>
    </I18nextProvider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}
