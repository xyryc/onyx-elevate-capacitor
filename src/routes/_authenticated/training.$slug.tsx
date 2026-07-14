import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, CheckCircle2, Flame, Info, Lock, Zap } from "lucide-react";
import { toast } from "sonner";
import { getProgram, type Program, type WorkoutDay } from "@/data/programs";
import { findExerciseSlugByName } from "@/data/exercises";
import { getLoggedTrainingToday, getProgress, markSingleTrainingDayComplete, setDayCompletion } from "@/lib/engagement";
import { logActivity } from "@/lib/engagement-extra";
import { getMyPurchases } from "@/lib/purchases.functions";
import { useAccess } from "@/hooks/useAccess";
import { Progress } from "@/components/ui/progress";
import { LiveWorkoutPlayer } from "@/components/LiveWorkoutPlayer";
import { useT } from "@/i18n/LanguageProvider";
import type { QuickWorkout } from "@/data/quickWorkouts";

function programDayToQuickWorkout(
  w: WorkoutDay,
  liveSlug: string,
): QuickWorkout {
  const clean = w.exercises.filter((ex) => !ex.name.startsWith("- "));
  const minutes = Math.max(15, Math.round(clean.length * 3.5));
  return {
    slug: liveSlug,
    title: w.title,
    minutes,
    tag: "fullbody",
    focus: w.focus ?? "",
    intro: w.focus ?? "",
    equipment: "-",
    blocks: [
      {
        title: w.title,
        minutes,
        exercises: clean.map((ex) => ({
          slug: findExerciseSlugByName(ex.name) ?? undefined,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
        })),
      },
    ],
  };
}

export const Route = createFileRoute("/_authenticated/training/$slug")({
  loader: ({ params }): { program: Program } => {
    const program = getProgram(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.program ? `Training · ${loaderData.program.title}` : "Training" }],
  }),
  notFoundComponent: () => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Program not found</h1>
      <Link to="/my-library" className="mt-6 inline-block text-electric font-semibold">← Back to dashboard</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load training.</h1>
      <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">Try again</button>
    </div>
  ),
  component: TrainingView,
});

// ---- Recovery templates (kept in sync with programs.$slug.tsx) ----
const RECOVERY_TEMPLATES: WorkoutDay[] = [
  {
    day: "Active recovery",
    title: "Zone-2 Walk",
    focus: "Easy 30-40 min walk, conversational pace.",
    exercises: [
      { name: "Treadmill Walking", sets: "1", reps: "30-40 min", rest: "-" },
      { name: "Treadmill Incline Walking", sets: "Optional", reps: "2 × 5 min @ 6%", rest: "2 min" },
    ],
  },
  {
    day: "Active recovery",
    title: "Bike + Mobility",
    focus: "Light spin to flush the legs + core stability.",
    exercises: [
      { name: "Stationary Cycle", sets: "1", reps: "25-30 min easy", rest: "-" },
      { name: "Plank", sets: "3", reps: "30 sec", rest: "45 sec" },
      { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "60 sec" },
    ],
  },
  {
    day: "Active recovery",
    title: "Row + Core",
    focus: "Low-intensity rowing intervals + core.",
    exercises: [
      { name: "Rowing Machine", sets: "5", reps: "3 min easy / 1 min rest", rest: "1 min" },
      { name: "Side Plank", sets: "3", reps: "30 sec/side", rest: "45 sec" },
      { name: "Bicycle Crunches Easy", sets: "3", reps: "20", rest: "45 sec" },
    ],
  },
  {
    day: "Rest day",
    title: "Full Rest or Light Walk",
    focus: "Recovery is when the gains happen.",
    exercises: [{ name: "Treadmill Walking", sets: "Optional", reps: "20-30 min easy", rest: "-" }],
  },
];

const TRAINING_POSITIONS: Record<number, number[]> = {
  1: [0], 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6],
};

type Slot = { workout: WorkoutDay; optional: boolean };

function expandWeek(days: WorkoutDay[], weekIdx: number): Slot[] {
  const n = Math.min(days.length, 7);
  const positions = TRAINING_POSITIONS[n] ?? TRAINING_POSITIONS[3];
  const slots: Slot[] = new Array(7).fill(null);
  positions.forEach((pos, i) => { if (days[i]) slots[pos] = { workout: days[i], optional: false }; });
  let r = weekIdx - 1;
  for (let i = 0; i < 7; i++) {
    if (!slots[i]) {
      const template = i === 6 ? RECOVERY_TEMPLATES[3] : RECOVERY_TEMPLATES[r % 3];
      slots[i] = { workout: template, optional: true };
      r++;
    }
  }
  return slots;
}

function inferWeekCount(p: Program): number {
  const m = p.duration.match(/(\d+)\s*week/i);
  return m ? Number(m[1]) : 1;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function TrainingView() {
  const { program: p } = Route.useLoaderData() as { program: Program };
  return <TrainingBody program={p} variant="route" />;
}

export function TrainingBody({ program: p, variant = "route", exactDays = false }: { program: Program; variant?: "route" | "dialog"; exactDays?: boolean }) {
  const router = useRouter();
  const qc = useQueryClient();
  const totalWeeks = inferWeekCount(p);

  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => getMyPurchases(),
  });
  const access = useAccess();
  const hasBundle = access.hasBundle || access.hasSubscription || purchases.some((x) => x.product_kind === "bundle");
  const hasProgram = access.hasProgram(p.slug) || purchases.some(
    (x) => x.product_kind === "program" && x.product_slug === p.slug,
  );
  const hasAccess = p.isFree === true || hasBundle || hasProgram;

  const availableWeeks = hasAccess ? totalWeeks : 1;
  const [activeWeek, setActiveWeek] = useState(1);
  useEffect(() => {
    if (activeWeek > availableWeeks) setActiveWeek(1);
  }, [availableWeeks, activeWeek]);

  const weekMap: Record<number, WorkoutDay[]> = {};
  p.workouts.forEach((w) => {
    const m = w.day.match(/Week\s*(\d+)/i);
    const k = m ? Number(m[1]) : 1;
    (weekMap[k] ||= []).push(w);
  });
  const currentDays = weekMap[activeWeek] ?? weekMap[1] ?? [];
  const slots = useMemo(
    () => exactDays
      ? currentDays.map((w) => ({ workout: w, optional: false }))
      : expandWeek(currentDays, activeWeek),
    [currentDays, activeWeek, exactDays],
  );
  const hasDistinctWeeks = Object.keys(weekMap).length > 1;

  const { data: progress, refetch } = useQuery({
    queryKey: ["progress", p.slug],
    queryFn: () => getProgress(p.slug),
  });
  const { data: loggedToday, refetch: refetchLoggedToday } = useQuery({
    queryKey: ["training-logged-today"],
    queryFn: () => getLoggedTrainingToday(),
  });
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    setCompleted(new Set(progress?.completed_days ?? []));
  }, [progress]);

  const totalDays = exactDays
    ? Object.values(weekMap).slice(0, availableWeeks).reduce((s, arr) => s + arr.length, 0) || slots.length
    : availableWeeks * 7;
  const pct = totalDays ? Math.round((completed.size / totalDays) * 100) : 0;

  async function markDay(key: string, workoutTitle: string) {
    try {
      if (exactDays) {
        // Custom user-built program: free logging, no daily gate, every session
        // shows up in Økter (activity feed).
        const next = await setDayCompletion(p.slug, key, true);
        setCompleted(new Set(next));
        await logActivity({
          kind: "program_day",
          title: workoutTitle ? `Trained: ${workoutTitle}` : `Completed ${key.replace(/-/g, " ")}`,
          detail: `Program: ${p.title}`,
          item_slug: p.slug,
        });
        toast.success(`Dag logget: ${workoutTitle}`);
      } else {
        const result = await markSingleTrainingDayComplete(p.slug, key, workoutTitle);
        setCompleted(new Set(result.completedDays));
        if (result.alreadyLoggedToday) {
          toast.success(`Dag markert: ${workoutTitle}`, {
            description: "Streaken teller kun én registrering per dag.",
          });
        } else {
          toast.success(`Dag logget: ${workoutTitle}`);
        }
      }
      refetch();
      refetchLoggedToday();
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["activity-feed"] });
      qc.invalidateQueries({ queryKey: ["training-log"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Couldn't log this day.");
    }
  }

  const isDialog = variant === "dialog";

  return (
    <div className={isDialog ? "" : "min-h-screen bg-background"}>
      {!isDialog && (
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="container-onyx py-4 flex items-center justify-between gap-3">
            <button
              onClick={() => router.history.back()}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-electric font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Go back
            </button>
            <div className="text-center min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">Under trening</p>
              <p className="font-display font-bold text-sm md:text-base truncate">{p.title}</p>
            </div>
            <Link to="/programs/$slug" params={{ slug: p.slug }} className="text-xs text-muted-foreground hover:text-electric font-semibold">
              Full info
            </Link>
          </div>

          <div className="container-onyx pb-3">
            <div className="flex items-end justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-electric" />
                <span className="font-bold">{completed.size}</span>
                <span className="text-muted-foreground">/ {totalDays} dager trent</span>
              </div>
              <span className="text-electric font-bold">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-1.5 h-1.5" />
          </div>
        </div>
      )}

      {isDialog && (
        <div className="px-4 sm:px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-3 border-b border-border bg-background/95">
          <div className="text-center min-w-0 pr-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">Under trening</p>
            <p className="font-display font-bold text-sm md:text-base truncate">{p.title}</p>
          </div>
          <div className="mt-3 flex items-end justify-between text-xs">
            <div className="flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-electric" />
              <span className="font-bold">{completed.size}</span>
              <span className="text-muted-foreground">/ {totalDays} dager trent</span>
            </div>
            <span className="text-electric font-bold">{pct}%</span>
          </div>
          <Progress value={pct} className="mt-1.5 h-1.5" />
        </div>
      )}


      <div className={`${isDialog ? "px-4 sm:px-6 py-6" : "container-onyx py-6 md:py-8"} space-y-6`}>
        {/* Locked banner, paid program, user hasn't purchased */}
        {!hasAccess && !purchasesLoading && (
          <div className="rounded-xl border border-electric/50 bg-electric/[0.08] p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Lock className="h-5 w-5 text-electric shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-base md:text-lg leading-tight">
                  You're previewing Week 1 for free
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Unlock all {totalWeeks} weeks, progression, and full logging by purchasing this program or the All Access bundle.
                </p>
              </div>
            </div>
            <Link
              to="/programs/$slug"
              params={{ slug: p.slug }}
              className="shrink-0 inline-flex items-center justify-center rounded-md bg-electric px-5 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all shadow-[0_0_20px_rgba(0,180,255,0.35)]"
            >
              Unlock full program
            </Link>
          </div>
        )}

        {/* Reminder banner */}
        <div className="rounded-xl border border-electric/30 bg-electric/[0.06] px-4 py-3 flex items-start gap-3">
          <Info className="h-4 w-4 text-electric shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/85 leading-relaxed">
            <span className="font-bold text-electric">Trykk på haken</span> på økten du har fullført.
            Du kan åpne alle dagene, men streaken teller bare én registrering per dag.
            <span className="block mt-1 text-muted-foreground">Velg riktig økt · markering kan ikke angres, så trykk først når du faktisk har trent.</span>
          </p>
        </div>

        {/* Progressive-overload note when data is a single template repeated per week */}
        {hasAccess && totalWeeks > 1 && !hasDistinctWeeks && (
          <div className="rounded-xl border border-border bg-onyx-100/40 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
            This {totalWeeks}-week block repeats the same weekly template, <span className="text-foreground font-semibold">add a little weight or a rep each week</span> to drive progressive overload.
          </div>
        )}

        {/* Week selector */}
        {availableWeeks > 1 && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((wk) => {
              const active = wk === activeWeek;
              const locked = wk > availableWeeks;
              const weekDone = Array.from({ length: 7 }).every((_, d) => completed.has(`w${wk}-d${d + 1}`));
              return (
                <button
                  key={wk}
                  onClick={() => !locked && setActiveWeek(wk)}
                  disabled={locked}
                  className={`relative rounded-md border px-4 py-2 text-sm font-semibold transition-all ${
                    locked
                      ? "border-border bg-onyx-100/30 text-muted-foreground/60 cursor-not-allowed"
                      : active
                        ? "border-electric bg-electric text-onyx-50"
                        : "border-border bg-onyx-100/60 hover:border-electric/60"
                  }`}
                >
                  {locked && <Lock className="mr-1 inline h-3 w-3" />}
                  Week {wk}
                  {!locked && weekDone && <CheckCircle2 className="ml-1.5 inline h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Locked weeks preview (paid program, locked users) */}
        {!hasAccess && totalWeeks > 1 && (
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-electric bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">Week 1</span>
            {Array.from({ length: totalWeeks - 1 }, (_, i) => i + 2).map((wk) => (
              <span
                key={wk}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-onyx-100/30 px-4 py-2 text-sm font-semibold text-muted-foreground/60"
              >
                <Lock className="h-3 w-3" /> Week {wk}
              </span>
            ))}
          </div>
        )}

        {/* Day cards, sequential unlock: only the next uncompleted day is markable */}
        <div className="space-y-4">
          {(() => {
            let nextUnlockKey: string | null = null;
            outer: for (let wk = 1; wk <= availableWeeks; wk++) {
              const wkDays = weekMap[wk] ?? weekMap[1] ?? [];
              const wkSlots = exactDays ? wkDays.map((w) => ({ workout: w, optional: false })) : expandWeek(wkDays, wk);
              for (let d = 0; d < wkSlots.length; d++) {
                const k = `w${wk}-d${d + 1}`;
                if (!completed.has(k)) { nextUnlockKey = k; break outer; }
              }
            }
            return slots.map((slot, i) => {
              const dayNum = i + 1;
              const key = `w${activeWeek}-d${dayNum}`;
              const done = completed.has(key);
              const isNext = key === nextUnlockKey;
              const locked = exactDays ? false : (!done && !isNext);
              return (
                <DayCard
                  key={key}
                  slot={slot}
                  dayNum={dayNum}
                  dayLabel={DAY_LABELS[i]}
                  done={done}
                  loggedToday={Boolean(loggedToday)}
                  locked={locked}
                  programSlug={p.slug}
                  weekNum={activeWeek}
                  onMark={() => markDay(key, slot.workout.title)}
                />
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

function DayCard({
  slot, dayNum, dayLabel, done, loggedToday, locked, programSlug, weekNum, onMark,
}: { slot: Slot; dayNum: number; dayLabel: string; done: boolean; loggedToday: boolean; locked: boolean; programSlug: string; weekNum: number; onMark: () => void }) {
  const w = slot.workout;
  const t = useT();
  const [liveOpen, setLiveOpen] = useState(false);
  const liveWorkout = useMemo(
    () => programDayToQuickWorkout(w, `${programSlug}-w${weekNum}-day-${dayNum}`),
    [programSlug, weekNum, dayNum, w],
  );
  return (
    <div
      className={`surface-card rounded-xl overflow-hidden transition-all ${
        done ? "border-2 border-electric bg-electric/[0.04]" : locked ? "border border-border/60 opacity-60" : slot.optional ? "border border-dashed border-border/70" : "border border-border"
      }`}
    >
      <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3 bg-onyx-100/40">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-[11px] uppercase tracking-[0.25em] font-bold ${slot.optional ? "text-muted-foreground" : "text-electric"}`}>
              {dayLabel} · Day {dayNum}
            </p>
            {slot.optional && (
              <span className="rounded-md bg-onyx-100 px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/70 border border-border">
                Optional
              </span>
            )}
            {done && (
              <span className="inline-flex items-center gap-1 rounded-md bg-electric/15 border border-electric/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-electric font-bold">
                <CheckCircle2 className="h-3 w-3" /> Logged
              </span>
            )}
            {locked && !done && (
              <span className="inline-flex items-center gap-1 rounded-md bg-onyx-100 border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
          </div>
          <h3 className="font-display text-lg md:text-xl font-bold mt-1 leading-tight">{w.title}</h3>
          {w.focus && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{w.focus}</p>}
        </div>

        {/* Checkmark button, smaller top-right */}
        <button
          onClick={done || locked ? undefined : onMark}
          disabled={done || locked}
          className={`shrink-0 grid place-items-center h-8 w-8 rounded-full border-2 transition-all ${
            done
              ? "border-electric bg-electric text-onyx-50 shadow-[0_0_16px_rgba(0,180,255,0.35)] cursor-default"
              : locked
                ? "border-border bg-onyx-100/40 text-muted-foreground/50 cursor-not-allowed"
                : "border-dashed border-electric/50 bg-background text-electric hover:bg-electric hover:text-onyx-50 hover:border-electric hover:shadow-[0_0_16px_rgba(0,180,255,0.35)]"
          }`}
          title={done ? "Allerede markert" : loggedToday ? "Kom tilbake i morgen for å logge en ny dag" : "Marker denne økten som fullført"}
          aria-label={done ? "Allerede markert" : loggedToday ? "Kom tilbake i morgen for å logge en ny dag" : "Marker økt fullført"}
        >
          {locked && !done ? <Lock className="h-3.5 w-3.5" /> : <Check className="h-4 w-4" strokeWidth={3} />}
        </button>
      </div>

      {/* Start live workout row */}
      {!locked && liveWorkout.blocks[0].exercises.length > 0 && (
        <div className="px-5 py-3 border-b border-border bg-background/40">
          <button
            type="button"
            onClick={() => setLiveOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-electric px-4 py-2 text-xs font-bold text-onyx-50 hover:bg-electric-glow shadow-[0_0_16px_rgba(0,180,255,0.35)] whitespace-nowrap"
            aria-label={t("live.start") || "Start live workout"}
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" /> {t("live.start") || "Start live økt"}
          </button>
        </div>
      )}

      <LiveWorkoutPlayer workout={liveWorkout} open={liveOpen} onOpenChange={setLiveOpen} />


      <div>
        <table className="w-full text-sm table-fixed">
          <thead className="bg-onyx-100 text-[9px] sm:text-[11px] uppercase tracking-normal sm:tracking-wider text-muted-foreground">
            <tr>
              <th data-no-translate className="text-left px-2 py-2 sm:px-5 sm:py-2.5 font-semibold w-[43%] sm:w-auto whitespace-nowrap">Øvelse</th>
              <th data-no-translate className="text-left px-1 py-2 sm:px-3 sm:py-2.5 font-semibold w-[13%] sm:w-14 whitespace-nowrap">Sett</th>
              <th data-no-translate className="text-left px-1 py-2 sm:px-3 sm:py-2.5 font-semibold w-[22%] sm:w-28 whitespace-nowrap">Reps</th>
              <th data-no-translate className="text-left px-1 py-2 sm:px-5 sm:py-2.5 font-semibold w-[22%] sm:w-24 whitespace-nowrap">Hvile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {w.exercises.map((ex) => {
              const slug = findExerciseSlugByName(ex.name);
              return (
                <tr key={ex.name} className="hover:bg-onyx-100/50">
                  <td className="px-2 py-2 sm:px-5 sm:py-2.5 font-medium overflow-hidden">
                    {slug ? (
                      <Link
                        to="/exercises/$slug"
                        params={{ slug }}
                        className="group flex items-start gap-1.5 sm:gap-2 hover:text-electric min-w-0"
                      >
                        <span className="grid h-4 w-4 sm:h-5 sm:w-5 shrink-0 place-items-center rounded-full bg-electric/15 border border-electric/30 mt-0.5">
                          <svg className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-electric translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                        <span className="min-w-0 break-words underline-offset-4 group-hover:underline">{ex.name}</span>
                      </Link>
                    ) : (
                      <span className="block break-words">{ex.name}</span>
                    )}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-2.5 text-muted-foreground break-words">{ex.sets}</td>
                  <td className="px-1 py-2 sm:px-3 sm:py-2.5 text-muted-foreground break-words">{ex.reps}</td>
                  <td className="px-1 py-2 sm:px-5 sm:py-2.5 text-muted-foreground break-words">{ex.rest}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
