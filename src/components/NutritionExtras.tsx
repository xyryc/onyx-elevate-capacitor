import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Clock,
  Settings2,
  Trash2,
  Bell,
  BellOff,
  X,
  Save,
  Scale,
  StickyNote,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  CalendarDays,
  Flame,
  Pencil,
} from "lucide-react";

import {
  getFastingPlan,
  upsertFastingPlan,
  deleteFastingPlan,
  getDailyNote,
  upsertDailyNote,
  type FastingPlan,
} from "@/lib/wellbeing";
import { listMeasurements, addMeasurement, type MeasurementRow } from "@/lib/engagement-extra";
import { useLang } from "@/i18n/LanguageProvider";

const DAYS_NO = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];
const PRESETS: { key: string; fast: number; eat: number }[] = [
  { key: "16:8", fast: 16, eat: 8 },
  { key: "12:12", fast: 12, eat: 12 },
  { key: "14:10", fast: 14, eat: 10 },
];

const EXTRAS_COPY = {
  en: {
    fasting: "Intermittent fasting",
    notSet: "Not set up",
    setupPlan: "Set up fasting plan",
    edit: "Edit",
    setup: "Set up",
    fastStarts: "Fast starts",
    fastEnds: "Fast ends",
    remindersOn: "Reminder on",
    remindersOff: "Reminder off",
    allDays: "All days",
    fastingEmpty:
      "Choose a plan (16:8, 12:12, 14:10 or custom), set your fasting and eating window, and get phone reminders.",
    body: "Body metrics",
    weight: "Weight",
    logWeight: "Log weight",
    noWeight: "No weight logged yet. Tap “Log weight” to get started.",
    sincePrevious: "since previous",
    notes: "Notes",
    todayNote: "Today’s note",
    writeNote: "Write a note",
    noteHint: "Tap to log energy, sleep or mood",
    log: "Log",
    close: "Close",
    save: "Save",
    saving: "Saving…",
    date: "Date",
    weightKg: "Weight (kg)",
    note: "Note",
    notePlaceholder: "How did the day feel? Energy, sleep, mood…",
    saveNote: "Save note",
    custom: "Custom",
    weeklyPlan: "Weekly plan",
    fastingWindow: "Fasting time",
    fastingHours: "Fasting hours",
    eatingHours: "Eating hours",
    enableReminder: "Enable fasting reminder",
    fastingPlan: "Fasting plan",
    remove: "Remove",
    confirmRemove: "Remove fasting plan?",
    yes: "Yes, remove",
    no: "Cancel",
    reminderHint:
      "Reminders show as browser notifications while the app is open. For an alarm sound when the app is closed, also set an alarm in your phone’s clock app.",
    fastingSummary: (fast: number, eat: number) => `Fast for ${fast} hours, eat for ${eat} hours`,
  },
  "pt-BR": {
    fasting: "Jejum intermitente",
    notSet: "Não configurado",
    setupPlan: "Configurar jejum",
    edit: "Editar",
    setup: "Configurar",
    fastStarts: "Jejum começa",
    fastEnds: "Jejum termina",
    remindersOn: "Lembrete ativo",
    remindersOff: "Lembrete desativado",
    allDays: "Todos os dias",
    fastingEmpty:
      "Escolha um plano (16:8, 12:12, 14:10 ou personalizado), defina a janela de jejum e alimentação, e receba lembretes no telefone.",
    body: "Medidas corporais",
    weight: "Peso",
    logWeight: "Registrar peso",
    noWeight: "Nenhum peso registrado ainda. Toque em “Registrar peso” para começar.",
    sincePrevious: "desde o anterior",
    notes: "Notas",
    todayNote: "Nota de hoje",
    writeNote: "Escrever uma nota",
    noteHint: "Toque para registrar energia, sono ou humor",
    log: "Registrar",
    close: "Fechar",
    save: "Salvar",
    saving: "Salvando…",
    date: "Data",
    weightKg: "Peso (kg)",
    note: "Nota",
    notePlaceholder: "Como foi o dia? Energia, sono, humor…",
    saveNote: "Salvar nota",
    custom: "Personalizado",
    weeklyPlan: "Plano semanal",
    fastingWindow: "Horário do jejum",
    fastingHours: "Horas de jejum",
    eatingHours: "Horas de alimentação",
    enableReminder: "Ativar lembrete de jejum",
    fastingPlan: "Plano de jejum",
    remove: "Remover",
    confirmRemove: "Remover plano de jejum?",
    yes: "Sim, remover",
    no: "Cancelar",
    reminderHint:
      "Os lembretes aparecem como notificações do navegador enquanto o app está aberto. Para tocar um alarme com o app fechado, defina também um alarme no relógio do telefone.",
    fastingSummary: (fast: number, eat: number) =>
      `Jejum por ${fast} horas, alimentação por ${eat} horas`,
  },
  es: {
    fasting: "Ayuno intermitente",
    notSet: "No configurado",
    setupPlan: "Configurar plan de ayuno",
    edit: "Editar",
    setup: "Configurar",
    fastStarts: "Ayuno empieza",
    fastEnds: "Ayuno termina",
    remindersOn: "Recordatorio activo",
    remindersOff: "Recordatorio desactivado",
    allDays: "Todos los días",
    fastingEmpty:
      "Elige un plan (16:8, 12:12, 14:10 o personalizado), define la ventana de ayuno y comida, y recibe recordatorios en el teléfono.",
    body: "Medidas corporales",
    weight: "Peso",
    logWeight: "Registrar peso",
    noWeight: "Aún no hay peso registrado. Toca “Registrar peso” para empezar.",
    sincePrevious: "desde el anterior",
    notes: "Notas",
    todayNote: "Nota de hoy",
    writeNote: "Escribir una nota",
    noteHint: "Toca para registrar energía, sueño o ánimo",
    log: "Registrar",
    close: "Cerrar",
    save: "Guardar",
    saving: "Guardando…",
    date: "Fecha",
    weightKg: "Peso (kg)",
    note: "Nota",
    notePlaceholder: "¿Cómo se sintió el día? Energía, sueño, ánimo…",
    saveNote: "Guardar nota",
    custom: "Personalizado",
    weeklyPlan: "Plan semanal",
    fastingWindow: "Horario de ayuno",
    fastingHours: "Horas de ayuno",
    eatingHours: "Horas para comer",
    enableReminder: "Activar recordatorio de ayuno",
    fastingPlan: "Plan de ayuno",
    remove: "Eliminar",
    confirmRemove: "¿Eliminar plan de ayuno?",
    yes: "Sí, eliminar",
    no: "Cancelar",
    reminderHint:
      "Los recordatorios aparecen como notificaciones del navegador mientras la app está abierta. Para escuchar una alarma con la app cerrada, pon también una alarma en el reloj del teléfono.",
    fastingSummary: (fast: number, eat: number) => `Ayuna ${fast} horas, come durante ${eat} horas`,
  },
  no: {
    fasting: "Periodisk faste",
    notSet: "Ikke satt opp",
    setupPlan: "Oppsett av fasteplan",
    edit: "Rediger",
    setup: "Sett opp",
    fastStarts: "Faste starter",
    fastEnds: "Faste slutter",
    remindersOn: "Påminnelse på",
    remindersOff: "Påminnelse av",
    allDays: "Alle dager",
    fastingEmpty:
      "Velg en plan (16:8, 12:12, 14:10 eller tilpasset), sett faste- og spisevinduet, og få varsel på telefonen.",
    body: "Kroppsmål",
    weight: "Vekt",
    logWeight: "Logg vekt",
    noWeight: "Ingen vekt logget enda. Trykk «Logg vekt» for å komme i gang.",
    sincePrevious: "siden forrige",
    notes: "Notater",
    todayNote: "Dagens notat",
    writeNote: "Skriv et notat",
    noteHint: "Trykk for å logge energi, søvn eller humør",
    log: "Logg",
    close: "Lukk",
    save: "Lagre",
    saving: "Lagrer…",
    date: "Dato",
    weightKg: "Vekt (kg)",
    note: "Notat",
    notePlaceholder: "Hvordan føltes dagen? Energi, søvn, humør…",
    saveNote: "Lagre notat",
    custom: "Tilpasset",
    weeklyPlan: "Ukentlig plan",
    fastingWindow: "Fastetid",
    fastingHours: "Fastetimer",
    eatingHours: "Spisetimer",
    enableReminder: "Aktiver fastepåminnelse",
    fastingPlan: "Fasteplan",
    remove: "Fjern",
    confirmRemove: "Fjerne fasteplanen?",
    yes: "Ja, fjern",
    no: "Avbryt",
    reminderHint:
      "Påminnelser vises som varsler i nettleseren mens appen er åpen. For alarmlyd når appen er lukket, sett også en alarm i klokke-appen på telefonen.",
    fastingSummary: (fast: number, eat: number) => `Fast i ${fast} timer, spis i ${eat} timer`,
  },
} as const;

function useExtrasCopy() {
  const { lang } = useLang();
  return EXTRAS_COPY[lang] ?? EXTRAS_COPY.en;
}

// ---------- Reminder scheduling (in-tab Notifications API) ----------
function scheduleFastingReminders(plan: FastingPlan) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  // Clear previously scheduled timeouts stored on window
  const w = window as unknown as { __fastingTimers?: number[] };
  (w.__fastingTimers ?? []).forEach((t) => clearTimeout(t));
  w.__fastingTimers = [];
  if (!plan.reminders_enabled || Notification.permission !== "granted") return;

  const now = new Date();
  const schedule = (hhmm: string, title: string, body: string) => {
    const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
    for (let i = 0; i < 2; i++) {
      const t = new Date(now);
      t.setDate(t.getDate() + i);
      t.setHours(h, m, 0, 0);
      if (!plan.weekly_days.includes(t.getDay())) continue;
      const delay = t.getTime() - now.getTime();
      if (delay <= 0 || delay > 1000 * 60 * 60 * 26) continue;
      const id = window.setTimeout(() => {
        try {
          new Notification(title, { body, icon: "/icon-192.png" });
        } catch {}
      }, delay);
      w.__fastingTimers!.push(id);
    }
  };
  schedule(
    plan.start_time,
    "Faste starter nå",
    `${plan.fast_hours} t faste, spis igjen ${plan.end_time}`,
  );
  schedule(plan.end_time, "Fasten er over", `Nå kan du spise i ${plan.eat_hours} timer`);
}

// ---------- Fasting card ----------
export function FastingCard({ date }: { date: string }) {
  const copy = useExtrasCopy();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const { data: plan } = useQuery({ queryKey: ["fasting-plan"], queryFn: getFastingPlan });

  const delMut = useMutation({
    mutationFn: async () => {
      await deleteFastingPlan();
    },
    onSuccess: () => {
      toast.success(copy.remove);
      qc.invalidateQueries({ queryKey: ["fasting-plan"] });
      setConfirmDel(false);
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  useEffect(() => {
    if (plan) scheduleFastingReminders(plan);
  }, [
    plan?.id,
    plan?.start_time,
    plan?.end_time,
    plan?.reminders_enabled,
    plan?.weekly_days?.join(","),
  ]);

  const nextStart = useMemo(
    () => (plan ? nextOccurrence(plan.start_time, plan.weekly_days) : null),
    [plan],
  );
  const nextEnd = useMemo(
    () => (plan ? nextOccurrence(plan.end_time, plan.weekly_days) : null),
    [plan],
  );

  return (
    <section
      aria-label={copy.fasting}
      className="surface-card rounded-2xl p-4 sm:p-5 border border-border/60 relative"
    >
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 mb-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric ring-1 ring-electric/25">
          <Clock className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-electric font-bold">
            {copy.fasting}
          </p>
          <h3 className="truncate font-display font-bold text-base sm:text-lg leading-tight">
            {plan ? `${plan.plan_key} · ${plan.fast_hours}t / ${plan.eat_hours}t` : copy.notSet}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-electric/40 bg-electric/10 px-3 py-1.5 text-xs font-bold text-electric hover:bg-electric/20 transition-colors"
            aria-label={copy.setupPlan}
          >
            <Settings2 className="h-3.5 w-3.5" /> {plan ? copy.edit : copy.setup}
          </button>
          {plan && (
            <button
              onClick={() => setConfirmDel(true)}
              className="rounded-full border border-border bg-onyx-100 p-1.5 text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 transition-colors"
              aria-label={copy.remove}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>
      {plan ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-onyx-100 p-3 border border-border/40">
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
              <Flame className="h-3 w-3" /> {copy.fastStarts}
            </p>
            <p className="font-display text-xl font-bold mt-0.5">{plan.start_time}</p>
            {nextStart && (
              <p className="text-[10px] text-muted-foreground">{formatWhen(nextStart)}</p>
            )}
          </div>
          <div className="rounded-xl bg-onyx-100 p-3 border border-border/40">
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
              <Clock className="h-3 w-3" /> {copy.fastEnds}
            </p>
            <p className="font-display text-xl font-bold mt-0.5">{plan.end_time}</p>
            {nextEnd && <p className="text-[10px] text-muted-foreground">{formatWhen(nextEnd)}</p>}
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-xl bg-onyx-100/60 px-3 py-2 text-[11px] text-muted-foreground border border-border/40">
            <span className="inline-flex items-center gap-1.5">
              {plan.reminders_enabled ? (
                <Bell className="h-3.5 w-3.5 text-electric" />
              ) : (
                <BellOff className="h-3.5 w-3.5" />
              )}
              {plan.reminders_enabled ? copy.remindersOn : copy.remindersOff}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {plan.weekly_days.length === 7
                ? copy.allDays
                : plan.weekly_days.map((d) => DAYS_NO[d]).join(" ")}
            </span>
          </div>
          {plan.reminders_enabled && (
            <p className="col-span-2 text-[10px] leading-snug text-muted-foreground/80 px-1">
              {copy.reminderHint}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{copy.fastingEmpty}</p>
      )}

      {confirmDel && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-onyx-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-xl border border-border bg-onyx-50 p-4 text-center">
            <p className="font-display font-bold text-sm mb-3">{copy.confirmRemove}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirmDel(false)}
                className="rounded-lg border border-border bg-onyx-100 px-3 py-2 text-xs font-bold hover:bg-onyx-200"
              >
                {copy.no}
              </button>
              <button
                onClick={() => delMut.mutate()}
                disabled={delMut.isPending}
                className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 disabled:opacity-60"
              >
                {copy.yes}
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <FastingDialog
          initial={plan ?? null}
          onClose={() => setOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["fasting-plan"] });
            setOpen(false);
          }}
        />
      )}
    </section>
  );
}

function nextOccurrence(hhmm: string, days: number[]) {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const t = new Date(now);
    t.setDate(t.getDate() + i);
    t.setHours(h, m, 0, 0);
    if (t.getTime() > now.getTime() && days.includes(t.getDay())) return t;
  }
  return null;
}
function formatWhen(d: Date) {
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const tmw = new Date(now);
  tmw.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tmw.toDateString();
  if (isToday) return "i dag";
  if (isTomorrow) return "i morgen";
  return d.toLocaleDateString("no-NO", { weekday: "short", day: "numeric", month: "short" });
}

function FastingDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: FastingPlan | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const copy = useExtrasCopy();
  const [planKey, setPlanKey] = useState(initial?.plan_key ?? "16:8");
  const [fastHours, setFastHours] = useState(initial?.fast_hours ?? 16);
  const [eatHours, setEatHours] = useState(initial?.eat_hours ?? 8);
  const [startTime, setStartTime] = useState(initial?.start_time ?? "20:00");
  const [endTime, setEndTime] = useState(initial?.end_time ?? "12:00");
  const [days, setDays] = useState<number[]>(initial?.weekly_days ?? [0, 1, 2, 3, 4, 5, 6]);
  const [reminders, setReminders] = useState(initial?.reminders_enabled ?? true);
  const [delConfirm, setDelConfirm] = useState(false);

  const applyPreset = (key: string) => {
    setPlanKey(key);
    const p = PRESETS.find((x) => x.key === key);
    if (p) {
      setFastHours(p.fast);
      setEatHours(p.eat);
    }
  };
  const toggleDay = (d: number) =>
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()));

  const saveMut = useMutation({
    mutationFn: async () => {
      if (reminders && typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") toast.info("Aktiver varsler i nettleseren for påminnelser.");
        }
      }
      await upsertFastingPlan({
        plan_key: planKey,
        fast_hours: fastHours,
        eat_hours: eatHours,
        start_time: startTime,
        end_time: endTime,
        weekly_days: days,
        reminders_enabled: reminders,
        active: true,
      });
    },
    onSuccess: () => {
      toast.success("Fasteplan lagret");
      onSaved();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Kunne ikke lagre"),
  });

  const delMut = useMutation({
    mutationFn: async () => {
      await deleteFastingPlan();
    },
    onSuccess: () => {
      toast.success("Fasteplan fjernet");
      onSaved();
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-onyx-950/70 backdrop-blur-sm p-4 grid place-items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-onyx-50 p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold">{copy.setupPlan}</h3>
          <div className="flex items-center gap-2">
            {initial && (
              <button
                onClick={() => setDelConfirm(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                aria-label={copy.remove}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-md p-1.5 hover:bg-onyx-100"
              aria-label={copy.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {delConfirm && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3">
            <p className="text-sm font-semibold text-rose-100 mb-2">{copy.confirmRemove}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDelConfirm(false)}
                className="rounded-lg border border-border bg-onyx-100 px-3 py-2 text-xs font-bold hover:bg-onyx-200"
              >
                {copy.no}
              </button>
              <button
                onClick={() => delMut.mutate()}
                disabled={delMut.isPending}
                className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 disabled:opacity-60"
              >
                {copy.yes}
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold mb-1.5">
          {copy.fastingPlan}
        </p>
        <div className="grid grid-cols-4 gap-1.5 mb-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={`rounded-lg border px-2 py-2 text-sm font-bold transition-colors ${planKey === p.key ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-foreground"}`}
            >
              {p.key}
            </button>
          ))}
          <button
            onClick={() => setPlanKey("custom")}
            className={`rounded-lg border px-2 py-2 text-sm font-bold transition-colors ${planKey === "custom" ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-foreground"}`}
          >
            {copy.custom}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          {copy.fastingSummary(fastHours, eatHours)}
        </p>

        {planKey === "custom" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="text-xs">
              <span className="block text-muted-foreground mb-1">{copy.fastingHours}</span>
              <input
                type="number"
                min={1}
                max={23}
                value={fastHours}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(23, +e.target.value || 0));
                  setFastHours(v);
                  setEatHours(24 - v);
                }}
                className="w-full rounded-md border border-border bg-onyx-100 px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs">
              <span className="block text-muted-foreground mb-1">{copy.eatingHours}</span>
              <input
                type="number"
                min={1}
                max={23}
                value={eatHours}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(23, +e.target.value || 0));
                  setEatHours(v);
                  setFastHours(24 - v);
                }}
                className="w-full rounded-md border border-border bg-onyx-100 px-2 py-2 text-sm"
              />
            </label>
          </div>
        )}

        <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold mb-1.5">
          {copy.fastingWindow}
        </p>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="rounded-lg bg-onyx-100 border border-border px-2 py-3 text-center font-display text-lg font-bold"
          />
          <span className="text-muted-foreground">→</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="rounded-lg bg-onyx-100 border border-border px-2 py-3 text-center font-display text-lg font-bold"
          />
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold mb-1.5">
          {copy.weeklyPlan}
        </p>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAYS_NO.map((label, i) => (
            <button
              key={i}
              onClick={() => toggleDay(i)}
              className={`rounded-lg border px-1 py-2 text-xs font-bold transition-colors ${days.includes(i) ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-muted-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center justify-between rounded-lg bg-onyx-100 px-3 py-3 mb-4">
          <span className="text-sm font-semibold inline-flex items-center gap-2">
            <Bell className="h-4 w-4" /> {copy.enableReminder}
          </span>
          <input
            type="checkbox"
            checked={reminders}
            onChange={(e) => setReminders(e.target.checked)}
            className="h-5 w-9 appearance-none rounded-full bg-onyx-200 checked:bg-electric relative transition-colors before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
          />
        </label>
        {reminders && (
          <p className="text-[11px] leading-snug text-muted-foreground -mt-2 mb-4 px-1">
            {copy.reminderHint}
          </p>
        )}

        <button
          onClick={() => saveMut.mutate()}
          disabled={saveMut.isPending}
          className="w-full rounded-xl bg-electric px-4 py-3 font-display font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
        >
          {saveMut.isPending ? copy.saving : copy.save}
        </button>
      </div>
    </div>
  );
}

// ---------- Weight card ----------
export function WeightCard() {
  const copy = useExtrasCopy();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: measurements = [] } = useQuery({
    queryKey: ["measurements"],
    queryFn: () => listMeasurements(),
  });

  const withWeight = measurements.filter((m) => m.weight_kg != null);
  const latest = withWeight[0];
  const previous = withWeight[1];
  const diff = latest && previous ? Number(latest.weight_kg) - Number(previous.weight_kg) : 0;
  const trend = diff > 0.05 ? "up" : diff < -0.05 ? "down" : "flat";

  return (
    <section
      aria-label={copy.body}
      className="surface-card rounded-2xl p-4 sm:p-5 border border-border/60"
    >
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 mb-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric ring-1 ring-electric/25">
          <Scale className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-electric font-bold">
            {copy.body}
          </p>
          <h3 className="truncate font-display font-bold text-base sm:text-lg leading-tight">
            {copy.weight}
          </h3>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-electric px-3 py-1.5 text-xs font-bold text-onyx-50 hover:bg-electric-glow transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> {copy.logWeight}
        </button>
      </header>
      {latest ? (
        <div className="rounded-xl bg-onyx-100 p-3 border border-border/40">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-3xl font-bold leading-none">
                {Number(latest.weight_kg).toFixed(1)}
                <span className="text-base font-semibold text-muted-foreground ml-1">kg</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {new Date(latest.measured_on).toLocaleDateString("no-NO", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div
              className={`text-right ${trend === "down" ? "text-emerald-500" : trend === "up" ? "text-rose-500" : "text-muted-foreground"}`}
            >
              <p className="inline-flex items-center gap-1 font-display text-lg font-bold">
                {trend === "down" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
                {previous ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)} kg` : "-"}
              </p>
              <p className="text-[11px] text-muted-foreground">{copy.sincePrevious}</p>
            </div>
          </div>
          {withWeight.length >= 2 && (
            <MiniSparkline
              points={withWeight
                .slice(0, 12)
                .reverse()
                .map((m) => Number(m.weight_kg))}
            />
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{copy.noWeight}</p>
      )}

      {open && (
        <WeightDialog
          onClose={() => setOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["measurements"] });
            setOpen(false);
          }}
        />
      )}
    </section>
  );
}

function MiniSparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 200;
  const h = 40;
  const step = w / (points.length - 1);
  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - ((p - min) / range) * h).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-10 w-full">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        className="text-electric"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WeightDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const copy = useExtrasCopy();
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const mut = useMutation({
    mutationFn: async () => {
      const w = parseFloat(weight.replace(",", "."));
      if (!w || w < 20 || w > 400) throw new Error("Skriv inn en gyldig vekt i kg");
      await addMeasurement({ measured_on: date, weight_kg: w });
    },
    onSuccess: () => {
      toast.success("Vekt lagret");
      onSaved();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Kunne ikke lagre"),
  });
  return (
    <div
      className="fixed inset-0 z-50 bg-onyx-950/70 backdrop-blur-sm p-4 grid place-items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-onyx-50 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold">{copy.logWeight}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-onyx-100"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="block text-xs mb-3">
          <span className="block text-muted-foreground mb-1">{copy.date}</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs mb-4">
          <span className="block text-muted-foreground mb-1">{copy.weightKg}</span>
          <input
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="f.eks. 82.4"
            className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-lg font-display font-bold"
            autoFocus
          />
        </label>
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending || !weight}
          className="w-full rounded-xl bg-electric px-4 py-3 font-display font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
        >
          {mut.isPending ? copy.saving : copy.save}
        </button>
      </div>
    </div>
  );
}

// ---------- Notes card (click to log) ----------
export function NotesCard({ date }: { date: string }) {
  const copy = useExtrasCopy();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: note } = useQuery({
    queryKey: ["daily-note", date],
    queryFn: () => getDailyNote(date),
  });
  const hasNote = !!note?.content?.trim();
  const preview = (note?.content ?? "").trim().slice(0, 90);

  return (
    <>
      <button
        type="button"
        aria-label={copy.notes}
        onClick={() => setOpen(true)}
        className="w-full text-left surface-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-electric/40 hover:bg-onyx-100/40 transition-colors"
      >
        <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric ring-1 ring-electric/25">
            <StickyNote className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-electric font-bold">
              {copy.notes}
            </p>
            <h3 className="truncate font-display font-bold text-base sm:text-lg leading-tight">
              {hasNote ? copy.todayNote : copy.writeNote}
            </h3>
            {hasNote ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {preview}
                {note!.content.length > 90 ? "…" : ""}
              </p>
            ) : (
              <p className="mt-1 truncate text-xs text-muted-foreground">{copy.noteHint}</p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-electric/40 bg-electric/10 px-3 py-1.5 text-xs font-bold text-electric">
            {hasNote ? (
              <>
                <Pencil className="h-3.5 w-3.5" /> {copy.edit}
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> {copy.log}
              </>
            )}
          </span>
        </header>
      </button>
      {open && (
        <NoteDialog
          date={date}
          initial={note?.content ?? ""}
          onClose={() => setOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["daily-note", date] });
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function NoteDialog({
  date,
  initial,
  onClose,
  onSaved,
}: {
  date: string;
  initial: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const copy = useExtrasCopy();
  const [content, setContent] = useState(initial);
  const mut = useMutation({
    mutationFn: async () => {
      await upsertDailyNote(date, content);
    },
    onSuccess: () => {
      toast.success("Notat lagret");
      onSaved();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Kunne ikke lagre"),
  });
  return (
    <div
      className="fixed inset-0 z-50 bg-onyx-950/70 backdrop-blur-sm p-4 grid place-items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-onyx-50 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-electric font-bold">
              {copy.note}
            </p>
            <h3 className="font-display text-lg font-bold">
              {new Date(date).toLocaleDateString("no-NO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-onyx-100"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={copy.notePlaceholder}
          rows={6}
          autoFocus
          className="mb-4 w-full resize-y rounded-lg border border-border bg-onyx-100 px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-electric/30"
        />
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-4 py-3 font-display font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {mut.isPending ? copy.saving : copy.saveNote}
        </button>
      </div>
    </div>
  );
}
