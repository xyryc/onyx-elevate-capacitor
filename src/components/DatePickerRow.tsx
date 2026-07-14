import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { Lang } from "@/i18n";

const LOCALE: Record<Lang, string> = {
  en: "en-US",
  no: "nb-NO",
  es: "es-ES",
  "pt-BR": "pt-BR",
};

export function localDateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoToLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function todayISO(): string {
  return localDateToISO(new Date());
}

export function DatePickerRow({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (iso: string) => void;
  label?: string;
}) {
  const { lang, t } = useLang();
  const locale = LOCALE[lang] ?? "en-US";
  const date = isoToLocalDate(value);
  const today = todayISO();
  const yesterday = localDateToISO(new Date(Date.now() - 86400000));
  const tomorrow = localDateToISO(new Date(Date.now() + 86400000));

  const shift = (days: number) => {
    const d = isoToLocalDate(value);
    d.setDate(d.getDate() + days);
    onChange(localDateToISO(d));
  };

  let display = date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  if (value === today) display = t("datePicker.today");
  else if (value === yesterday) display = `${t("datePicker.yesterday")}, ${display}`;
  else if (value === tomorrow) display = `${t("datePicker.tomorrow")}, ${display}`;

  return (
    <div className="rounded-lg border border-border/60 bg-onyx-50 p-2">
      {label && (
        <div className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label={t("datePicker.prev")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-onyx-100 hover:border-electric/60 hover:text-electric transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <label className="relative flex flex-1 items-center justify-center gap-2 rounded-md border border-border/60 bg-onyx-100 px-2 py-2 text-sm font-semibold cursor-pointer hover:border-electric/60 transition-colors">
          <Calendar className="h-4 w-4 text-electric" />
          <span>{display}</span>
          <input
            type="date"
            value={value}
            onChange={(e) => e.target.value && onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label={t("datePicker.next")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-onyx-100 hover:border-electric/60 hover:text-electric transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
