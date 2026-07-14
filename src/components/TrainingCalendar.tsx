import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { listMyTrainingLog } from "@/lib/engagement";
import { useLang, useT } from "@/i18n/LanguageProvider";

const DOW_KEYS = ["calendar.mon", "calendar.tue", "calendar.wed", "calendar.thu", "calendar.fri", "calendar.sat", "calendar.sun"];
const DATE_LOCALE = { en: "en-US", "pt-BR": "pt-BR", es: "es-ES", no: "nb-NO" } as const;

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function TrainingCalendar() {
  const t = useT();
  const { lang } = useLang();
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const { data: log = [] } = useQuery({
    queryKey: ["training-log"],
    queryFn: () => listMyTrainingLog(180),
  });

  // Map YMD -> list of entries
  const byDay = useMemo(() => {
    const map: Record<string, { title: string; detail: string | null; created_at: string }[]> = {};
    log.forEach((e) => {
      const d = new Date(e.created_at);
      const key = ymd(d);
      (map[key] ||= []).push({ title: e.title, detail: e.detail, created_at: e.created_at });
    });
    return map;
  }, [log]);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const dow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr: ({ date: Date; key: string } | null)[] = [];
    for (let i = 0; i < dow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(view.y, view.m, d);
      arr.push({ date: dt, key: ymd(dt) });
    }
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [view]);

  const monthCount = cells.filter((c) => c && byDay[c.key]).length;
  const todayKey = ymd(today);
  const selectedEntries = selectedKey ? byDay[selectedKey] : null;
  const locale = DATE_LOCALE[lang] ?? "en-US";
  const monthName = new Date(view.y, view.m, 1).toLocaleDateString(locale, { month: "long" });

  function nav(delta: number) {
    const nm = view.m + delta;
    const y = view.y + Math.floor(nm / 12);
    const m = ((nm % 12) + 12) % 12;
    setView({ y, m });
    setSelectedKey(null);
  }

  return (
    <div className="rounded-xl border border-border bg-onyx-100 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{t("calendar.title")}</div>
          <div className="mt-1 font-display text-lg font-bold">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {view.y}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => nav(-1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border hover:border-electric hover:text-electric"
            aria-label={t("calendar.previousMonth")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setView({ y: today.getFullYear(), m: today.getMonth() }); setSelectedKey(todayKey); }}
            className="px-2 h-8 rounded-md border border-border text-xs font-semibold hover:border-electric hover:text-electric"
          >
            {t("calendar.today")}
          </button>
          <button
            onClick={() => nav(1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border hover:border-electric hover:text-electric"
            aria-label={t("calendar.nextMonth")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wider text-muted-foreground text-center">
        {DOW_KEYS.map((d) => <div key={d} className="py-1">{t(d)}</div>)}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <div key={i} className="aspect-square" />;
          const entries = byDay[c.key];
          const trained = !!entries;
          const isToday = c.key === todayKey;
          const isSelected = c.key === selectedKey;
          return (
            <button
              type="button"
              key={c.key}
              onClick={() => setSelectedKey(isSelected ? null : c.key)}
              className={`relative aspect-square rounded-md border text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "border-electric bg-electric/25 text-electric font-bold ring-2 ring-electric/40"
                  : trained
                  ? "border-electric bg-electric/15 text-electric font-bold hover:bg-electric/20"
                  : isToday
                  ? "border-electric/50 text-foreground hover:border-electric"
                  : "border-border/60 text-muted-foreground hover:border-border hover:bg-onyx-50"
              }`}
            >
              <span>{c.date.getDate()}</span>
              {trained && <Flame className="absolute bottom-1 right-1 h-2.5 w-2.5" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="text-muted-foreground">
          {t(monthCount === 1 ? "calendar.monthCountSingular" : "calendar.monthCountPlural").replace("{{count}}", String(monthCount))}
        </div>
        <div className="text-muted-foreground">{t("calendar.tapDay")}</div>
      </div>

      {/* Selected day details */}
      <div className="mt-5 border-t border-border/60 pt-4">
        {!selectedKey ? (
          <div className="text-xs text-muted-foreground">
            {t("calendar.pickDay")}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">
                 {new Date(selectedKey).toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={() => setSelectedKey(null)}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-electric"
              >
                {t("calendar.clear")}
              </button>
            </div>
            {selectedEntries && selectedEntries.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {selectedEntries.map((e, i) => (
                  <li key={i} className="flex items-baseline gap-2 text-xs">
                    <Flame className="h-3 w-3 text-electric shrink-0 self-center" />
                    <span className="flex-1">
                      <span className="text-foreground font-medium">{e.title}</span>
                      {e.detail && <span className="text-muted-foreground">, {e.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-xs text-muted-foreground">
                {t("calendar.restDay")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

