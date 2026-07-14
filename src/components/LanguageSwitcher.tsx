import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { LANGUAGES, type Lang } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { updateMyProfile } from "@/lib/purchases.functions";

async function persistLanguageToProfile(code: Lang) {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await updateMyProfile({ data: { preferred_language: code } });
  } catch {
    // non-critical, localStorage already has it
  }
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function handlePick(code: Lang) {
    setOpen(false);
    if (code === lang) return;
    // Instant switch, react-i18next updates all subscribed components synchronously.
    setLang(code);
    void persistLanguageToProfile(code);
  }

  return (
    <div ref={ref} data-no-translate className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-onyx-100 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-electric/40 hover:text-foreground transition-colors"
      >
        <span aria-hidden className="text-base leading-none">{current.flag}</span>
        <span>{current.short}</span>
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-52 rounded-md border border-border bg-onyx-100 shadow-card p-1 z-50"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handlePick(l.code)}
                  className={`w-full flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm transition-colors ${
                    active ? "bg-electric/10 text-electric" : "text-foreground hover:bg-onyx-200"
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">{l.flag}</span>
                  <span className="flex-1 text-left">{l.label}</span>
                  {active && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
