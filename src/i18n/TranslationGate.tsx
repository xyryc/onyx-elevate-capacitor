import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";
import { hasPreparedTranslations } from "./translationCache";

function hasCompletedLanguageSplash() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("onyx.languageSplash.done") === "1" || window.localStorage.getItem("onyx.splash.dismissed") === "1";
}

const MESSAGES = {
  en: "Preparing your experience…",
  "pt-BR": "Preparando sua experiência…",
  es: "Preparando tu experiencia…",
  no: "Forbereder opplevelsen din…",
};

type ReadyState = { lang: string; at: number; startedAt?: number };

export function TranslationGate() {
  const { lang } = useLang();
  const [blocking, setBlocking] = useState(false);
  const waitStartedAt = useRef(0);
  const timerRef = useRef<number | null>(null);
  const lastLangRef = useRef(lang);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (hasCompletedLanguageSplash()) {
      setBlocking(false);
      lastLangRef.current = lang;
      return;
    }
    if (lang === "en") {
      setBlocking(false);
      lastLangRef.current = lang;
      return;
    }
    // Only block when the language actually changes and that language has not
    // been fully prepared yet, never on normal route navigation.
    if (lastLangRef.current === lang) return;
    lastLangRef.current = lang;
    if (hasPreparedTranslations(lang)) {
      setBlocking(false);
      return;
    }

    waitStartedAt.current = Date.now();
    setBlocking(true);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [lang]);

  useEffect(() => {
    const onStart = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (hasCompletedLanguageSplash()) {
        setBlocking(false);
        return;
      }
      if (detail?.lang === lang && lang !== "en" && detail?.blocking === true && !hasPreparedTranslations(lang)) {
        waitStartedAt.current = detail.startedAt ?? Date.now();
        setBlocking(true);
      }
    };

    const onReady = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.lang !== lang) return;
      if (lang !== "en" && waitStartedAt.current > 0 && !hasPreparedTranslations(lang)) return;
      if ((detail.startedAt ?? Date.now()) < waitStartedAt.current - 50) return;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setBlocking(false);
    };

    window.addEventListener("onyx:translation-start", onStart as EventListener);
    window.addEventListener("onyx:translation-ready", onReady as EventListener);

    const lastReady = (window as unknown as { __onyxTranslationReady?: ReadyState }).__onyxTranslationReady;
    if (lastReady?.lang === lang && Date.now() - lastReady.at < 600 && (lastReady.startedAt ?? 0) >= waitStartedAt.current - 50) {
      setBlocking(false);
    }

    return () => {
      window.removeEventListener("onyx:translation-start", onStart as EventListener);
      window.removeEventListener("onyx:translation-ready", onReady as EventListener);
    };
  }, [lang]);

  if (!blocking || lang === "en") return null;

  return (
    <div
      data-no-translate
      className="fixed inset-0 z-[190] flex items-center justify-center bg-onyx-50/95 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full border-2 border-electric/20 border-t-electric animate-spin" />
        <p className="text-[11px] uppercase tracking-[0.25em] text-electric font-semibold">
          {MESSAGES[lang] ?? MESSAGES.en}
        </p>
      </div>
    </div>
  );
}