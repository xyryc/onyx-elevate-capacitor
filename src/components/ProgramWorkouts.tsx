import { useState, useMemo } from "react";
import { Zap, Check } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { findExercise, findExerciseSlugByName } from "@/data/exercises";
import { type WorkoutDay } from "@/data/programs";
import { useT } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { GlossaryText } from "@/components/GlossaryText";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { LiveWorkoutPlayer } from "@/components/LiveWorkoutPlayer";
import { todayISO } from "@/components/DatePickerRow";
import { getLoggedTrainingToday, markSingleTrainingDayComplete } from "@/lib/engagement";
import type { QuickWorkout } from "@/data/quickWorkouts";

function openLoginSplash() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem("onyx.loginSplash.forceOpen", "1");
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent("onyx:open-login-splash"));
}

const OPTIONAL_CORE_RE = /optional\s*core/i;

/** Convert a program's WorkoutDay into the QuickWorkout shape the
 *  LiveWorkoutPlayer expects, so free-week program days can run as guided
 *  live sessions with the same premium video experience.
 */
function programDayToQuickWorkout(
  w: {
    day: string;
    title: string;
    focus?: string;
    exercises: { name: string; sets: string; reps: string; rest: string }[];
  },
  liveSlug: string,
): QuickWorkout {
  const clean = w.exercises.filter((ex) => !ex.name.startsWith("- "));
  return {
    slug: liveSlug,
    title: w.title,
    minutes: Math.max(15, Math.round(clean.length * 3.5)),
    tag: "fullbody",
    focus: w.focus ?? "",
    intro: w.focus ?? "",
    equipment: "-",
    blocks: [
      {
        title: w.title,
        minutes: Math.max(15, Math.round(clean.length * 3.5)),
        exercises: clean.map((ex) => {
          const slug = findExerciseSlugByName(ex.name) ?? undefined;
          return {
            slug,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest,
          };
        }),
      },
    ],
  };
}

export function WorkoutCard({
  w,
  dayNum,
  dayLabel,
  optional,
  enableLive,
  liveSlugPrefix,
}: {
  w: {
    day: string;
    title: string;
    focus?: string;
    exercises: { name: string; sets: string; reps: string; rest: string }[];
  };
  dayNum: number;
  dayLabel?: string;
  optional?: boolean;
  /** When true, show a "Start live workout" button that opens the guided
   *  video-driven player used by Quick Workouts. */
  enableLive?: boolean;
  /** Prefix used to build the workout slug the live player logs against
   *  (e.g. the program slug), so favorites and history stay unique per day. */
  liveSlugPrefix?: string;
}) {
  const t = useT();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [liveOpen, setLiveOpen] = useState(false);
  const [logging, setLogging] = useState(false);
  const [loggedNow, setLoggedNow] = useState(false);
  const liveWorkout = useMemo(
    () =>
      enableLive
        ? programDayToQuickWorkout(w, `${liveSlugPrefix ?? "program"}-day-${dayNum}`)
        : null,
    [enableLive, liveSlugPrefix, dayNum, w],
  );

  const daySlug = `qw-${liveSlugPrefix ?? "program"}-day-${dayNum}`;
  const today = todayISO();
  const logDayKey = `log-${today}`;
  const progressQuery = useQuery({
    queryKey: ["training-logged-today"],
    queryFn: () => getLoggedTrainingToday(),
    enabled: Boolean(enableLive && liveWorkout),
  });
  const dailyLocked = Boolean(progressQuery.data);
  const logged = loggedNow || progressQuery.data?.item_slug === daySlug;
  const loggedMessage = `${t("live.dayLoggedPrefix") || "Day logged"}: ${t(w.title)}`;
  const comeBackMessage = t("live.comeBackTomorrow") || "Come back tomorrow to log another day.";

  async function logDay() {
    if (logging) return;
    if (logged || dailyLocked) {
      toast.info(
        progressQuery.data?.title
          ? `${comeBackMessage} ${progressQuery.data.title}`
          : comeBackMessage,
      );
      return;
    }
    setLogging(true);
    try {
      const result = await markSingleTrainingDayComplete(daySlug, logDayKey, w.title);
      if (result.alreadyLoggedToday) {
        queryClient.invalidateQueries({ queryKey: ["training-logged-today"] });
        toast.info(comeBackMessage);
        return;
      }
      setLoggedNow(true);
      queryClient.invalidateQueries({ queryKey: ["training-logged-today"] });
      queryClient.invalidateQueries({ queryKey: ["program-progress"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(loggedMessage);
    } catch (e: any) {
      toast.error(e?.message || "Could not log workout");
    } finally {
      setLogging(false);
    }
  }

  // Detect indices for the "Optional core" divider and where that section ends
  // (either the next "- " divider, or the end of the list). Users can toggle
  // that segment on/off from the card header.
  const { hasOptionalCore, coreStart, coreEnd } = useMemo(() => {
    const start = w.exercises.findIndex(
      (ex) => ex.name.startsWith("- ") && OPTIONAL_CORE_RE.test(ex.name),
    );
    if (start === -1) return { hasOptionalCore: false, coreStart: -1, coreEnd: -1 };
    let end = w.exercises.length;
    for (let i = start + 1; i < w.exercises.length; i++) {
      if (w.exercises[i].name.startsWith("- ")) {
        end = i;
        break;
      }
    }
    return { hasOptionalCore: true, coreStart: start, coreEnd: end };
  }, [w.exercises]);

  const [showCore, setShowCore] = useState(false);
  const translateSectionLabel = (name: string) => t(name).replace(/-/g, "").trim();

  const visibleExercises = useMemo(() => {
    if (!hasOptionalCore || showCore) return w.exercises;
    return w.exercises.filter((_, i) => i < coreStart || i >= coreEnd);
  }, [w.exercises, hasOptionalCore, showCore, coreStart, coreEnd]);

  return (
    <div
      className={`surface-card rounded-xl overflow-hidden ${optional ? "border border-dashed border-border/70" : ""}`}
    >
      <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-gradient-to-br from-onyx-100/60 to-onyx-50">
        <div className="min-w-0 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold ${optional ? "text-muted-foreground" : "text-electric"}`}
            >
              {dayLabel ?? `${t("Day")} ${dayNum}`}
            </p>
            {optional && (
              <span className="rounded-md bg-onyx-100 px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/80 border border-border">
                {t("Optional")}
              </span>
            )}
          </div>
          <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold mt-1 leading-tight break-words">
            {t(w.title)}
          </h3>
          {w.focus && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">
              {t(w.focus)}
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {enableLive && liveWorkout && (
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  toast.info(t("live.guestLoginRequired") || "Sign in to start a live workout.");
                  openLoginSplash();
                  return;
                }
                setLiveOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-electric px-4 py-2 text-xs font-bold text-onyx-50 hover:bg-electric-glow shadow-[0_0_16px_rgba(0,180,255,0.35)] whitespace-nowrap"
              aria-label={t("live.start") || "Start live workout"}
            >
              <Zap className="h-3.5 w-3.5" fill="currentColor" /> {t("live.start") || "Live"}
            </button>
          )}
          {hasOptionalCore && (
            <button
              type="button"
              onClick={() => setShowCore((v) => !v)}
              aria-pressed={showCore}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                showCore
                  ? "bg-electric text-onyx-900 border-electric"
                  : "border-border text-foreground/80 hover:border-electric/60 hover:text-electric"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${showCore ? "bg-onyx-900" : "bg-muted-foreground"}`}
              />
              <span className="hidden sm:inline">
                {showCore ? t("Core: On") : t("Add optional core")}
              </span>
              <span className="sm:hidden">{showCore ? t("Core") : t("+ Core")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile: compact stacked cards */}
      <ul className="sm:hidden divide-y divide-border">
        {visibleExercises.map((ex) => {
          if (ex.name.startsWith("- ")) {
            return (
              <li
                key={ex.name}
                className="bg-electric/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-electric font-bold"
              >
                {translateSectionLabel(ex.name)}
              </li>
            );
          }
          const slug = findExerciseSlugByName(ex.name);
          const exObj = slug ? findExercise(slug) : undefined;
          const nameContent = (
            <span
              className="group inline-flex items-center gap-2 text-foreground min-w-0 cursor-pointer"
              title={t("Watch demo video")}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-electric/15 border border-electric/30 shrink-0">
                <svg
                  className="h-3 w-3 text-electric translate-x-[1px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="truncate font-medium">{t(ex.name)}</span>
            </span>
          );
          const NameEl = exObj ? (
            <ExerciseDialog exercise={exObj}>
              <button type="button" className="text-left min-w-0">
                {nameContent}
              </button>
            </ExerciseDialog>
          ) : (
            <span className="font-medium truncate">{t(ex.name)}</span>
          );
          return (
            <li key={ex.name} className="px-4 py-3">
              <div className="min-w-0">{NameEl}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-md bg-onyx-100/60 border border-border/60 px-2 py-1.5">
                  <p
                    data-no-translate
                    className="text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t("program.table.sets")}
                  </p>
                  <p className="text-foreground font-semibold">
                    <GlossaryText>{t(ex.sets)}</GlossaryText>
                  </p>
                </div>
                <div className="rounded-md bg-onyx-100/60 border border-border/60 px-2 py-1.5">
                  <p
                    data-no-translate
                    className="text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t("program.table.reps")}
                  </p>
                  <p className="text-foreground font-semibold">
                    <GlossaryText>{t(ex.reps)}</GlossaryText>
                  </p>
                </div>
                <div className="rounded-md bg-onyx-100/60 border border-border/60 px-2 py-1.5">
                  <p
                    data-no-translate
                    className="text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t("program.table.rest")}
                  </p>
                  <p className="text-foreground font-semibold">
                    <GlossaryText>{t(ex.rest)}</GlossaryText>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-onyx-100 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th data-no-translate className="text-left px-5 py-3 font-semibold">
                {t("program.table.exercise")}
              </th>
              <th data-no-translate className="text-left px-3 py-3 font-semibold w-16">
                {t("program.table.sets")}
              </th>
              <th data-no-translate className="text-left px-3 py-3 font-semibold w-32">
                {t("program.table.reps")}
              </th>
              <th data-no-translate className="text-left px-5 py-3 font-semibold w-28">
                {t("program.table.rest")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleExercises.map((ex) => {
              if (ex.name.startsWith("- ")) {
                return (
                  <tr key={ex.name} className="bg-electric/5">
                    <td
                      colSpan={4}
                      className="px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-electric font-bold"
                    >
                      {translateSectionLabel(ex.name)}
                    </td>
                  </tr>
                );
              }
              const slug = findExerciseSlugByName(ex.name);
              const exObj = slug ? findExercise(slug) : undefined;
              return (
                <tr key={ex.name} className="hover:bg-onyx-100/50 transition-colors">
                  <td className="px-5 py-3 font-medium">
                    {exObj ? (
                      <ExerciseDialog exercise={exObj}>
                        <button
                          type="button"
                          className="group inline-flex items-center gap-2 text-foreground hover:text-electric transition-colors text-left"
                          title={t("Watch demo video")}
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-electric/15 border border-electric/30 group-hover:bg-electric/30 transition-colors shrink-0">
                            <svg
                              className="h-3 w-3 text-electric translate-x-[1px]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                          <span className="underline-offset-4 group-hover:underline">
                            {t(ex.name)}
                          </span>
                        </button>
                      </ExerciseDialog>
                    ) : (
                      <span>{t(ex.name)}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    <GlossaryText>{t(ex.sets)}</GlossaryText>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    <GlossaryText>{t(ex.reps)}</GlossaryText>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <GlossaryText>{t(ex.rest)}</GlossaryText>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {enableLive && liveWorkout && (
        <LiveWorkoutPlayer workout={liveWorkout} open={liveOpen} onOpenChange={setLiveOpen} />
      )}
    </div>
  );
}

// ---------- Active recovery templates (have linked video exercises) ----------
export type WorkoutSlot = { workout: WorkoutDay; optional: boolean };

export const RECOVERY_TEMPLATES: WorkoutDay[] = [
  {
    day: "Active recovery",
    title: "Zone-2 Walk",
    focus:
      "Easy 30-40 min walk, outdoor or treadmill. Conversational pace, builds aerobic base and speeds recovery.",
    exercises: [
      { name: "Treadmill Walking", sets: "1", reps: "30-40 min", rest: "-" },
      {
        name: "Treadmill Incline Walking",
        sets: "Optional finisher",
        reps: "2 × 5 min @ 6% incline",
        rest: "2 min",
      },
    ],
  },
  {
    day: "Active recovery",
    title: "Bike + Mobility",
    focus:
      "Light spin to flush the legs, then core and mobility to protect the joints for tomorrow's lift.",
    exercises: [
      {
        name: "Stationary Cycle",
        sets: "1",
        reps: "25-30 min easy",
        rest: "-",
      },
      { name: "Plank", sets: "3", reps: "30 sec", rest: "45 sec" },
      {
        name: "Hanging Leg Raise",
        sets: "3",
        reps: "10",
        rest: "60 sec",
      },
    ],
  },
  {
    day: "Active recovery",
    title: "Row + Core",
    focus:
      "Low-intensity rowing intervals + core stability. Keeps you moving without taxing the nervous system.",
    exercises: [
      {
        name: "Rowing Machine",
        sets: "5",
        reps: "3 min easy / 1 min rest",
        rest: "1 min",
      },
      {
        name: "Side Plank",
        sets: "3",
        reps: "30 sec/side",
        rest: "45 sec",
      },
      {
        name: "Bicycle Crunches Easy",
        sets: "3",
        reps: "20",
        rest: "45 sec",
      },
    ],
  },
  {
    day: "Rest day",
    title: "Full Rest or Light Walk",
    focus:
      "Take the day off, or just walk 20-30 min and stretch. Recovery is when the gains happen.",
    exercises: [
      {
        name: "Treadmill Walking",
        sets: "Optional",
        reps: "20-30 min easy",
        rest: "-",
      },
    ],
  },
];

/** Layout positions (Mon..Sun = index 0..6) where TRAINING days land, based on how many training days the program has. The rest become optional active-recovery slots. */
export const TRAINING_POSITIONS: Record<number, number[]> = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

export function expandWeekToSevenDays(currentDays: WorkoutDay[], weekIdx: number): WorkoutSlot[] {
  const n = Math.min(currentDays.length, 7);
  const positions = TRAINING_POSITIONS[n] ?? TRAINING_POSITIONS[3];
  const slots: WorkoutSlot[] = new Array(7).fill(null);
  positions.forEach((pos, i) => {
    if (currentDays[i]) slots[pos] = { workout: currentDays[i], optional: false };
  });
  // Fill empties with recovery templates, rotating and offset by week so Week 2 != Week 1.
  let r = weekIdx - 1;
  for (let i = 0; i < 7; i++) {
    if (!slots[i]) {
      // Sunday (index 6) gets the "Rest day" template to feel like a real week.
      const template = i === 6 ? RECOVERY_TEMPLATES[3] : RECOVERY_TEMPLATES[r % 3];
      slots[i] = { workout: template, optional: true };
      r++;
    }
  }
  return slots;
}
