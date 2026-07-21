import { useState } from "react";
import { type Program, type WorkoutDay } from "@/data/programs";
import { useT } from "@/i18n/LanguageProvider";
import { WorkoutCard, expandWeekToSevenDays } from "@/components/ProgramWorkouts";
import { useCheckout } from "@/hooks/useCheckout";
import { useAccess } from "@/hooks/useAccess";
import { usePrice, useStripePriceId } from "@/lib/pricing";

export function inferWeekCount(p: Program): number {
  const m = p.duration.match(/(\d+)\s*week/i);
  return m ? Number(m[1]) : 1;
}

/** Long strength plans (10+ weeks) are built around heavy barbell work with
 *  long rest periods and percentage-based progression. The guided live
 *  player is a poor fit there, so we disable it for those programs only. */
function disableLiveWorkout(p: Program): boolean {
  const isStrength = p.category === "Strongman" || p.category === "Powerlifting";
  return isStrength && inferWeekCount(p) >= 10;
}

type ProgramExercise = WorkoutDay["exercises"][number];

type SmartWeekPhase = {
  label: string;
  mainSets: string;
  mainReps: string;
  accessoryMode: "base" | "build" | "peak" | "density" | "deload" | "test";
  restShift: number;
};

const EXERCISE_VARIATIONS: Record<string, string[]> = {
  "Smith Machine Reverse Lunge": [
    "Smith Machine Reverse Lunge",
    "Smith Machine Bulgarian Split Squat",
    "Walking Lunge",
    "Dumbbell Bulgarian Split Squat",
  ],
  "Smith Machine Bulgarian Split Squat": [
    "Smith Machine Bulgarian Split Squat",
    "Smith Machine Reverse Lunge",
    "Walking Lunge",
    "Leg Press",
  ],
  "Leg Press": [
    "Leg Press",
    "Hack Squat Machine",
    "Smith Machine Squats",
    "Dumbbell Bulgarian Split Squat",
  ],
  "Seated Leg Curl": [
    "Seated Leg Curl",
    "Lying Leg Curl",
    "Romanian Deadlift",
    "Single-Leg Romanian Deadlift",
  ],
  "Standing Calf Raise": ["Standing Calf Raise", "Seated Calf Raise", "Single-Leg Calf Raise"],
  "Romanian Deadlift": [
    "Romanian Deadlift",
    "Single-Leg Romanian Deadlift",
    "Barbell Hip Thrust",
    "Cable Pull Through",
  ],
  "Bulgarian Split Squat": ["Bulgarian Split Squat", "Walking Lunge", "Reverse Lunge", "Leg Press"],
  "Cable Pull Through": ["Cable Pull Through", "Barbell Hip Thrust", "Romanian Deadlift"],
  "Incline Dumbbell Bench Press": [
    "Incline Dumbbell Bench Press",
    "Flat Dumbbell Press",
    "Cable Chest Fly",
    "Dips",
  ],
  "Incline Dumbbell Press": [
    "Incline Dumbbell Press",
    "Flat Dumbbell Press",
    "Cable Chest Fly",
    "Dips",
  ],
  "Seated Dumbbell Shoulder Press": [
    "Seated Dumbbell Shoulder Press",
    "Arnold Press",
    "Standing Overhead Press",
  ],
  "Cable Chest Fly": ["Cable Chest Fly", "Pec Deck Machine", "Cable Crossover (low to high)"],
  "Dumbbell Lateral Raise": [
    "Dumbbell Lateral Raise",
    "Cable Lateral Raise",
    "Rear Delt Fly Machine",
  ],
  "Cable Lateral Raise": ["Cable Lateral Raise", "Dumbbell Lateral Raise", "Rear Delt Fly Machine"],
  "Cable Tricep Pushdown": [
    "Cable Tricep Pushdown",
    "Overhead Rope Triceps",
    "Skull Crusher",
    "Bench Tricep Dips",
  ],
  "Triceps Pushdown": ["Triceps Pushdown", "Overhead Rope Triceps", "Skull Crusher"],
  "Barbell Bent Over Row": [
    "Barbell Bent Over Row",
    "Chest Supported Row Machine",
    "Seated Cable Row",
    "Pendlay Row",
  ],
  "Lat Pulldown Wide Grip": [
    "Lat Pulldown Wide Grip",
    "Pull Up",
    "Seated Cable Row",
    "Straight Arm Cable Pulldown",
  ],
  "Chest Supported Row Machine": [
    "Chest Supported Row Machine",
    "Seated Cable Row",
    "One-Arm Row",
    "Barbell Bent Over Row",
  ],
  "Straight Arm Cable Pulldown": [
    "Straight Arm Cable Pulldown",
    "Lat Pulldown Wide Grip",
    "Cable Face Pull",
  ],
  "Dumbbell Bicep Curl": [
    "Dumbbell Bicep Curl",
    "Dumbbell Hammer Curl",
    "Cable Bicep Curl",
    "Preacher Curl",
  ],
  "Cable Bicep Curl": ["Cable Bicep Curl", "Dumbbell Hammer Curl", "Preacher Curl"],
  "Face Pull": ["Face Pull", "Cable Face Pull", "Rear Delt Fly Machine"],
  "EZ Bar Curl": ["EZ Bar Curl", "Preacher Curl", "Cable Bicep Curl", "Dumbbell Hammer Curl"],
  "Skull Crusher": ["Skull Crusher", "Overhead Tricep Extension", "Cable Tricep Pushdown"],
  "Overhead Tricep Extension": [
    "Overhead Tricep Extension",
    "Skull Crusher",
    "Cable Tricep Pushdown",
  ],
  "Hanging Leg Raise": [
    "Hanging Leg Raise",
    "Hanging Knee Raise",
    "Kneeling Cable Crunch",
    "Side Plank",
  ],
  "Sit Ups": ["Sit Ups", "Kneeling Cable Crunch", "Weighted Russian Twist"],
  Plank: ["Plank", "Side Plank", "Weighted Plank"],
};

function getSmartWeekPhase(p: Program, week: number): SmartWeekPhase {
  if (p.slug.includes("5-3-1")) {
    const phases: SmartWeekPhase[] = [
      {
        label: "5s wave · 65/75/85% TM",
        mainSets: "3",
        mainReps: "5 / 5 / 5+ @ RPE 7",
        accessoryMode: "base",
        restShift: 0,
      },
      {
        label: "3s wave · 70/80/90% TM",
        mainSets: "3",
        mainReps: "3 / 3 / 3+ @ RPE 8",
        accessoryMode: "build",
        restShift: 15,
      },
      {
        label: "5/3/1 wave · 75/85/95% TM",
        mainSets: "3",
        mainReps: "5 → 3 → 1+ @ RPE 9",
        accessoryMode: "peak",
        restShift: 30,
      },
      {
        label: "Deload · 40/50/60% TM",
        mainSets: "3",
        mainReps: "5 / 5 / 5 easy",
        accessoryMode: "deload",
        restShift: -30,
      },
      {
        label: "2nd wave 5s · TM +2.5/5 kg",
        mainSets: "3",
        mainReps: "5 / 5 / 5+ @ RPE 7-8",
        accessoryMode: "density",
        restShift: -10,
      },
      {
        label: "2nd wave 3s · heavier TM",
        mainSets: "3",
        mainReps: "3 / 3 / 3+ @ RPE 8",
        accessoryMode: "build",
        restShift: 15,
      },
      {
        label: "2nd 5/3/1 · PR set",
        mainSets: "3",
        mainReps: "5 → 3 → 1+ @ RPE 9",
        accessoryMode: "peak",
        restShift: 30,
      },
      {
        label: "Deload · speed reps",
        mainSets: "3",
        mainReps: "5 / 5 / 5 @ fast bar speed",
        accessoryMode: "deload",
        restShift: -30,
      },
      {
        label: "Anchor week · heavy triples",
        mainSets: "4",
        mainReps: "3 / 3 / 3+ then 1 backoff AMRAP",
        accessoryMode: "density",
        restShift: 15,
      },
      {
        label: "Retest week · clean singles",
        mainSets: "4",
        mainReps: "5 / 3 / 1 / 1+ if bar speed is good",
        accessoryMode: "test",
        restShift: 45,
      },
    ];
    return phases[Math.min(week, phases.length) - 1];
  }

  const block = (week - 1) % 4;
  const wave = Math.floor((week - 1) / 4) + 1;
  if (block === 0)
    return {
      label: `Wave ${wave} base · RPE 7`,
      mainSets: "4",
      mainReps: "6 @ RPE 7",
      accessoryMode: "base",
      restShift: 0,
    };
  if (block === 1)
    return {
      label: `Wave ${wave} build · RPE 8`,
      mainSets: "4",
      mainReps: "5 @ RPE 8",
      accessoryMode: "build",
      restShift: 15,
    };
  if (block === 2)
    return {
      label: `Wave ${wave} peak · RPE 9`,
      mainSets: "5",
      mainReps: "3-5 @ RPE 9",
      accessoryMode: "peak",
      restShift: 30,
    };
  return {
    label: `Wave ${wave} deload`,
    mainSets: "2",
    mainReps: "6 easy @ RPE 6",
    accessoryMode: "deload",
    restShift: -30,
  };
}

function isDividerExercise(ex: ProgramExercise): boolean {
  return ex.name.startsWith("- ");
}

function isMainLift(ex: ProgramExercise): boolean {
  const name = ex.name
    .toLowerCase()
    .replace(/\s*\(.*\)\s*$/, "")
    .trim();
  return new Set([
    "barbell back squat",
    "back squat",
    "front squat",
    "barbell bench press",
    "bench press",
    "barbell deadlift",
    "deadlift",
    "standing overhead press",
    "standing military press",
    "military press",
    "barbell bent over row",
  ]).has(name);
}

function isCardioExercise(ex: ProgramExercise): boolean {
  return /treadmill|\brun\b|running|\bjog\b|walk|walking|cycle|cycling|bike|biking|row(ing)?|erg|ski erg|assault|sprint|stride|zone\s*[1-5]|km|meter|mile|marathon|tempo run|long run|interval run/i.test(
    ex.name + " " + ex.reps,
  );
}

function shiftRest(rest: string, deltaSeconds: number): string {
  if (!rest || rest === "-" || rest === "-") return rest;
  const sec = rest.match(/^(\d+)\s*sec$/i);
  if (sec) return `${Math.max(30, Number(sec[1]) + deltaSeconds)} sec`;
  const min = rest.match(/^(\d+(?:\.\d+)?)\s*min$/i);
  if (min) {
    const seconds = Math.max(45, Math.round(Number(min[1]) * 60 + deltaSeconds));
    return seconds % 60 === 0 ? `${seconds / 60} min` : `${seconds} sec`;
  }
  const range = rest.match(/^(\d+)\s*-\s*(\d+)\s*min$/i);
  if (range) {
    const low = Math.max(1, Number(range[1]) + Math.round(deltaSeconds / 60));
    const high = Math.max(low, Number(range[2]) + Math.round(deltaSeconds / 60));
    return `${low}-${high} min`;
  }
  return rest;
}

function adjustSimpleReps(reps: string, delta: number): string {
  const match = reps.match(/^(\d+)(?:[--](\d+))?(.*)$/);
  if (!match) return reps;
  const low = Math.max(1, Number(match[1]) + delta);
  if (match[2]) return `${low}-${Math.max(low + 1, Number(match[2]) + delta)}${match[3]}`;
  return `${low}${match[3]}`;
}

function adjustSimpleSets(sets: string, delta: number): string {
  const value = Number(sets);
  if (!Number.isFinite(value)) return sets;
  return String(Math.max(1, value + delta));
}

function stripRpeNote(reps: string): string {
  return reps.replace(/\s*@\s*RPE\s*[\d-\-]+/gi, "").trim();
}

function variedExerciseName(
  name: string,
  week: number,
  dayIndex: number,
  exerciseIndex: number,
): string {
  const options = EXERCISE_VARIATIONS[name];
  if (!options?.length) return name;
  return options[(week + dayIndex + exerciseIndex) % options.length];
}

function smartAccessory(
  ex: ProgramExercise,
  phase: SmartWeekPhase,
  week: number,
  dayIndex: number,
  exerciseIndex: number,
): ProgramExercise {
  // Cardio / running / rowing / walking: never tag with RPE. RPE is a
  // strength-training scale, running uses pace and heart-rate zones instead.
  // Just apply the rest shift and leave name/sets/reps untouched.
  if (isCardioExercise(ex)) {
    return { ...ex, rest: shiftRest(ex.rest, phase.restShift) };
  }

  if (phase.accessoryMode === "deload") {
    return {
      ...ex,
      sets: adjustSimpleSets(ex.sets, -1),
      reps: /amrap/i.test(ex.reps) ? "easy reps, stop 4 short" : adjustSimpleReps(ex.reps, -2),
      rest: shiftRest(ex.rest, phase.restShift),
    };
  }

  const name = variedExerciseName(ex.name, week, dayIndex, exerciseIndex);
  if (phase.accessoryMode === "peak" || phase.accessoryMode === "test") {
    return {
      ...ex,
      name,
      sets: adjustSimpleSets(ex.sets, phase.accessoryMode === "test" ? -1 : 0),
      reps: /amrap/i.test(ex.reps)
        ? ex.reps
        : `${adjustSimpleReps(stripRpeNote(ex.reps), -1)} @ RPE 8-9`,
      rest: shiftRest(ex.rest, phase.restShift),
    };
  }
  if (phase.accessoryMode === "density") {
    return {
      ...ex,
      name,
      reps: adjustSimpleReps(stripRpeNote(ex.reps), 1),
      rest: shiftRest(ex.rest, -15),
    };
  }
  if (phase.accessoryMode === "build") {
    return {
      ...ex,
      name,
      sets: adjustSimpleSets(ex.sets, 1),
      reps: /amrap/i.test(ex.reps) ? ex.reps : `${stripRpeNote(ex.reps)} @ RPE 8`,
      rest: shiftRest(ex.rest, phase.restShift),
    };
  }
  return {
    ...ex,
    name,
    reps: /amrap/i.test(ex.reps) ? ex.reps : `${stripRpeNote(ex.reps)} @ RPE 7`,
    rest: shiftRest(ex.rest, phase.restShift),
  };
}

function buildSmartWeek(p: Program, sourceDays: WorkoutDay[], week: number): WorkoutDay[] {
  const phase = getSmartWeekPhase(p, week);
  return sourceDays.map((workout, dayIndex) => ({
    ...workout,
    day: `Week ${week} · Day ${dayIndex + 1}`,
    focus: workout.focus ? `${workout.focus} · ${phase.label}` : phase.label,
    exercises: workout.exercises.map((ex, exerciseIndex) => {
      if (isDividerExercise(ex)) {
        if (/main lift/i.test(ex.name)) return { ...ex, name: `- Main lift · ${phase.label} -` };
        if (phase.accessoryMode === "deload" && /accessories|finisher|pump|core/i.test(ex.name))
          return { ...ex, name: `${ex.name.replace(/-/g, "").trim()} · deload volume -` };
        return ex;
      }
      if (isMainLift(ex) && !isCardioExercise(ex)) {
        return {
          ...ex,
          sets: phase.mainSets,
          reps: phase.mainReps,
          rest: shiftRest(ex.rest, phase.restShift),
        };
      }
      return smartAccessory(ex, phase, week, dayIndex, exerciseIndex);
    }),
  }));
}

// Always 7 days per calendar week. Training days + optional walk/mobility days
// are all trackable so users build the daily habit, not just gym sessions.
export function buildDayKeys(p: Program): string[] {
  const weeks = inferWeekCount(p);
  const keys: string[] = [];
  for (let w = 1; w <= weeks; w++) {
    for (let d = 1; d <= 7; d++) keys.push(`w${w}-d${d}`);
  }
  return keys;
}

export function WorkoutsByWeek({ p }: { p: Program }) {
  const t = useT();
  const [activeWeek, setActiveWeek] = useState(1);
  const access = useAccess();
  const unlocked = access.hasProgram(p.slug);
  const bundle = access.hasBundle || access.hasSubscription;
  const { openCheckout, loading } = useCheckout();
  const programPrice = usePrice("program");
  const monthlyPriceId = useStripePriceId("monthly");

  const fullAccess = !!p.isFree || unlocked || bundle;

  // Group workouts by week. If no week prefix, treat the whole list as Week 1.
  const weekMap: Record<number, typeof p.workouts> = {};
  let hasExplicitWeeks = false;
  p.workouts.forEach((w) => {
    const m = w.day.match(/Week\s*(\d+)/i);
    if (m) hasExplicitWeeks = true;
    const k = m ? Number(m[1]) : 1;
    (weekMap[k] ||= []).push(w);
  });
  const weekNumbers = Object.keys(weekMap)
    .map(Number)
    .sort((a, b) => a - b);
  // For paid programs we always want to show the full duration in the tab strip
  // even when the data only carries a couple of sample weeks.
  const durationWeeks = (() => {
    const m = p.duration.match(/(\d+)\s*week/i);
    return m ? Number(m[1]) : weekNumbers.length;
  })();
  const totalWeeks = Math.max(durationWeeks, weekNumbers[weekNumbers.length - 1] ?? 1);

  const allWeeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  // If a program only stores a base template, generate a smart week from it:
  // different RPE, sets/reps, rest targets and accessory variations each week.
  const currentDays = (() => {
    if (!hasExplicitWeeks && (weekMap[1]?.length ?? 0) > 0 && totalWeeks > 1) {
      return buildSmartWeek(p, weekMap[1], activeWeek);
    }
    const direct = weekMap[activeWeek];
    if (direct && direct.length > 0) return direct;
    const baseWeek =
      hasExplicitWeeks && weekMap[2] && activeWeek % 2 === 0 ? weekMap[2] : (weekMap[1] ?? []);
    return baseWeek.length > 0 ? buildSmartWeek(p, baseWeek, activeWeek) : [];
  })();
  const isLocked = activeWeek > 1 && !fullAccess;
  const hasContentForWeek = currentDays.length > 0;

  const onUnlock = () => {
    openCheckout({ priceId: monthlyPriceId, productSlug: `program:${p.slug}` });
  };

  return (
    <div className="space-y-6">
      {/* Header line */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">
          {p.isFree
            ? `${t("Week")} 1 ${t("free preview")}`
            : fullAccess
              ? `${t("All")} ${totalWeeks} ${t("weeks unlocked")} · ${t("Day-by-day schedule below")}`
              : `${t("Week")} 1 ${t("free preview")} · ${t("Weeks")} 2-${totalWeeks} ${t("unlock after purchase")}`}
        </p>
        {hasExplicitWeeks && (
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {totalWeeks === 1 ? t("1 week plan") : `${totalWeeks} ${t("week plan plural")}`}
          </p>
        )}
      </div>

      {/* Week tabs */}
      {totalWeeks > 1 && (
        <div className="-mx-4 px-4 flex gap-2 overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:flex-wrap lg:overflow-visible lg:pb-0">
          {allWeeks.map((wk) => {
            const locked = wk > 1 && !fullAccess;
            const active = wk === activeWeek;
            return (
              <button
                key={wk}
                onClick={() => setActiveWeek(wk)}
                className={`relative shrink-0 snap-start rounded-md border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "border-electric bg-electric text-onyx-50"
                    : "border-border bg-onyx-100/60 hover:border-electric/60"
                }`}
              >
                {t("Week")} {wk}
                {locked && <span className="ml-1.5 text-[10px]">🔒</span>}
                {wk === 1 && !fullAccess && (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-80">
                    {t("Free")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Week content */}
      {isLocked ? (
        <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-onyx-100/60 to-onyx-50 p-8 lg:p-12 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-electric/10 text-2xl">
            🔒
          </div>
          <h3 className="mt-4 font-display text-2xl lg:text-3xl font-bold">
            {t("Unlock Week")} {activeWeek} {t("of")} {t(p.title)}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            {t("Weeks")} 2-{totalWeeks}{" "}
            {t(
              "include progressive overload, intensity tweaks and new exercise variations so you never repeat the same week twice. One payment. Lifetime access on your account.",
            )}
          </p>
          <div className="mt-6 font-display text-3xl font-bold">{programPrice}</div>
          <button
            onClick={onUnlock}
            disabled={loading}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 transition-all"
          >
            {loading ? t("Opening checkout…") : t("Unlock full program")}
          </button>
          <p className="mt-3 text-[11px] text-muted-foreground">
            {t("Secure checkout")} · {t("Instant access")} · {t("No subscription")}
          </p>
        </div>
      ) : hasContentForWeek ? (
        expandWeekToSevenDays(currentDays, activeWeek).map((slot, i) => (
          <WorkoutCard
            key={`${activeWeek}-${i}-${slot.workout.title}`}
            w={slot.workout}
            dayNum={i + 1}
            dayLabel={`${t("Week")} ${activeWeek} · ${t("Day")} ${i + 1}`}
            optional={slot.optional}
            enableLive={!slot.optional && !disableLiveWorkout(p)}
            liveSlugPrefix={`${p.slug}-w${activeWeek}`}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-border bg-onyx-100/40 p-8 text-center text-sm text-muted-foreground">
          {t("Week")} {activeWeek}{" "}
          {t(
            "follows the same template as Week 1 with progressive overload applied, open the Onyx app to log your sets and see the exact loads for this week.",
          )}
        </div>
      )}
    </div>
  );
}
