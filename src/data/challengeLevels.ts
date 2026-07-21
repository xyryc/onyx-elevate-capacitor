import type { Challenge } from "./challenges";

export type DayPlan = {
  day: number;
  title: string;
  sets?: string[];
  note?: string;
  rest?: boolean;
};

export type Level = {
  name: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  days: DayPlan[];
};

/* ----------------------------- helpers ----------------------------- */

type RepTotal = number | "rest" | "max" | "for-time";

/** Split a total rep count into roughly equal sets of `perSet` reps. */
function splitReps(total: number, perSet: number): string[] {
  if (total <= 0) return [];
  const full = Math.floor(total / perSet);
  const remainder = total - full * perSet;
  const sets: number[] = Array(full).fill(perSet);
  if (remainder > 0) sets.push(remainder);
  return sets.map((r, i) => `Set ${i + 1}: ${r} reps`);
}

/** Build a 7-day week schedule with custom rep totals + rest days. */
function repWeek(
  weekOffset: number,
  totals: RepTotal[],
  perSet: number,
  exercise: string,
  restBetween: string,
): DayPlan[] {
  return totals.map((t, i) => {
    const day = weekOffset + i + 1;
    if (t === "rest") {
      return {
        day,
        title: `Active recovery, technique day`,
        sets: [
          "5 min easy warm-up (arm circles, cat-cow, hip openers)",
          `10 slow-tempo ${exercise} (3s down, 1s up), focus on perfect form`,
          "5 min stretch: chest, shoulders, hip flexors",
        ],
        note: "Light day, but still log it. Recovery is part of the work.",
      };
    }

    if (t === "max") {
      return {
        day,
        title: `Max unbroken set, ${exercise}`,
        sets: ["Set 1: as many reps as possible in one go", "Log your number"],
        note: "Full warm-up first. One all-out set. No partial reps.",
      };
    }
    if (t === "for-time") {
      return {
        day,
        title: `100 ${exercise} for time`,
        sets: ["Start the clock", "Finish 100 reps as fast as possible", "Log total time"],
        note: "Beat your previous best. Form first, speed second.",
      };
    }
    return {
      day,
      title: `${t} total ${exercise}`,
      sets: splitReps(t, perSet),
      note: `Rest ${restBetween} between sets.`,
    };
  });
}

function buildRepLevels(opts: {
  exercise: string;
  beginner: { totalsPerWeek: RepTotal[][]; perSet: number; rest: string; summary: string };
  intermediate: { totalsPerWeek: RepTotal[][]; perSet: number; rest: string; summary: string };
  advanced: { totalsPerWeek: RepTotal[][]; perSet: number; rest: string; summary: string };
}): Level[] {
  const make = (
    name: Level["name"],
    cfg: { totalsPerWeek: RepTotal[][]; perSet: number; rest: string; summary: string },
  ): Level => {
    const days: DayPlan[] = [];
    cfg.totalsPerWeek.forEach((week, wi) =>
      days.push(...repWeek(wi * 7, week, cfg.perSet, opts.exercise, cfg.rest)),
    );
    return { name, summary: cfg.summary, days };
  };
  return [
    make("Beginner", opts.beginner),
    make("Intermediate", opts.intermediate),
    make("Advanced", opts.advanced),
  ];
}

/** For time-based challenges (plank). Seconds per day. */
function buildTimeLevels(opts: {
  exercise: string;
  beginner: { weeks: (number | "rest")[][]; rounds: number; summary: string };
  intermediate: { weeks: (number | "rest")[][]; rounds: number; summary: string };
  advanced: { weeks: (number | "rest")[][]; rounds: number; summary: string };
}): Level[] {
  const fmt = (s: number) =>
    s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `${s}s`;
  const make = (
    name: Level["name"],
    cfg: { weeks: (number | "rest")[][]; rounds: number; summary: string },
  ): Level => {
    const days: DayPlan[] = [];
    cfg.weeks.forEach((week, wi) =>
      week.forEach((t, i) => {
        const day = wi * 7 + i + 1;
        if (t === "rest") {
          days.push({
            day,
            title: `Active recovery, mobility day`,
            sets: [
              "5 min easy warm-up",
              `2 × 20s easy ${opts.exercise} hold, focus on breathing`,
              "5 min stretch: hips, shoulders, lower back",
            ],
            note: "Light day, but still log it. Recovery is part of the work.",
          });
        } else {
          days.push({
            day,
            title: `${fmt(t)} ${opts.exercise}`,
            sets: Array.from({ length: cfg.rounds }, (_, r) => `Round ${r + 1}: hold ${fmt(t)}`),
            note: `Rest 60s between rounds. Stop the clock the moment form breaks.`,
          });
        }
      }),
    );
    return { name, summary: cfg.summary, days };
  };
  return [
    make("Beginner", opts.beginner),
    make("Intermediate", opts.intermediate),
    make("Advanced", opts.advanced),
  ];
}

/** For habit/streak challenges where every day is the same task with rising commitment. */
function buildHabitLevels(opts: {
  durationDays: number;
  beginner: { summary: string; perDay: (d: number) => string };
  intermediate: { summary: string; perDay: (d: number) => string };
  advanced: { summary: string; perDay: (d: number) => string };
}): Level[] {
  const make = (
    name: Level["name"],
    cfg: { summary: string; perDay: (d: number) => string },
  ): Level => ({
    name,
    summary: cfg.summary,
    days: Array.from({ length: opts.durationDays }, (_, i) => ({
      day: i + 1,
      title: cfg.perDay(i + 1),
    })),
  });
  return [
    make("Beginner", opts.beginner),
    make("Intermediate", opts.intermediate),
    make("Advanced", opts.advanced),
  ];
}

/* ----------------------- per-challenge builders ----------------------- */

const BUILDERS: Record<string, () => Level[]> = {
  "30-day-pushup": () =>
    buildRepLevels({
      exercise: "push-ups",
      beginner: {
        summary: "Knee or incline push-ups OK. Tiny sets, lots of rest, never to failure.",
        perSet: 3,
        rest: "60–90s",
        totalsPerWeek: [
          [10, 12, 15, "rest", 15, 18, 20],
          [22, 25, 25, "rest", 28, 30, 30],
          [32, 35, 35, "rest", 38, 40, 40],
          [45, 45, 50, "rest", 50, 55, 60, 60, 65],
        ],
      },
      intermediate: {
        summary: "Standard push-ups, chest to fist from floor, sets of 5–10.",
        perSet: 8,
        rest: "45–60s",
        totalsPerWeek: [
          [20, 25, 30, "rest", 35, 40, 45],
          [50, 55, 60, "rest", 65, 70, 75],
          [80, 85, 90, "rest", 90, 95, 100],
          [100, 100, 100, "rest", 100, 100, 100, 100, "rest"],
        ],
      },
      advanced: {
        summary: "Slow tempo push-ups (3s down, 1s up). Bigger sets, shorter rest.",
        perSet: 15,
        rest: "30–45s",
        totalsPerWeek: [
          [40, 50, 60, "rest", 70, 80, 90],
          [100, 110, 120, "rest", 130, 140, 150],
          [150, 160, 170, "rest", 170, 180, 200],
          [200, 200, 200, "rest", 200, 200, "max", "max", "max"],
        ],
      },
    }),

  "30-day-plank": () =>
    buildTimeLevels({
      exercise: "plank hold",
      beginner: {
        summary: "Knee plank if needed. Stop the second hips sag.",
        rounds: 2,
        weeks: [
          [15, 20, 25, "rest", 30, 35, 40],
          [45, 50, 55, "rest", 60, 65, 70],
          [75, 80, 90, "rest", 90, 100, 105],
          [110, 120, 130, "rest", 140, 150, 165, 180, 180],
        ],
      },
      intermediate: {
        summary: "Hard-style plank. Add a PM hold once weekly target hits 2 min.",
        rounds: 2,
        weeks: [
          [30, 45, 60, "rest", 75, 90, 90],
          [120, 135, 150, "rest", 150, 165, 180],
          [180, 195, 210, "rest", 210, 225, 240],
          [240, 255, 270, "rest", 270, 285, 300, 300, 300],
        ],
      },
      advanced: {
        summary: "Hard-style + side planks each side after the main hold.",
        rounds: 3,
        weeks: [
          [60, 75, 90, "rest", 105, 120, 135],
          [150, 165, 180, "rest", 195, 210, 225],
          [240, 255, 270, "rest", 285, 300, 315],
          [330, 345, 360, "rest", 360, 375, 390, 420, 420],
        ],
      },
    }),

  "100-squat-day": () =>
    buildRepLevels({
      exercise: "bodyweight squats",
      beginner: {
        summary: "Box squat to a chair if needed. Tempo over speed.",
        perSet: 10,
        rest: "60s",
        totalsPerWeek: [
          [30, 40, 50, "rest", 50, 60, 60],
          [70, 70, 75, "rest", 75, 80, 80],
          [80, 90, 90, "rest", 90, 100, 100],
          [100, 100, 100, "rest", 100, 100, 100, 100, 100],
        ],
      },
      intermediate: {
        summary: "Full depth, 4 × 25 across the day, add 3s descent in Week 2.",
        perSet: 25,
        rest: "60–90s",
        totalsPerWeek: [
          [100, 100, 100, "rest", 100, 100, 100],
          [100, 100, 100, "rest", 100, 100, 100],
          [100, 100, 100, "rest", 100, 100, 100],
          [100, 100, 100, "rest", 100, 100, 100, "max", 100],
        ],
      },
      advanced: {
        summary: "Backpack 10–15 kg from Day 1. Add a tempo pause at the bottom.",
        perSet: 50,
        rest: "60s",
        totalsPerWeek: [
          [150, 150, 150, "rest", 150, 150, 150],
          [175, 175, 175, "rest", 175, 175, 175],
          [200, 200, 200, "rest", 200, 200, 200],
          [200, 200, 200, "rest", 200, 200, "max", 200, 200],
        ],
      },
    }),

  "100-pullup-month": () =>
    buildRepLevels({
      exercise: "pull-ups",
      beginner: {
        summary: "Bands or jumping negatives. 5s descent on every rep.",
        perSet: 3,
        rest: "2–3 min",
        totalsPerWeek: [
          [10, 12, 15, "rest", 15, 18, 20],
          [22, 25, 25, "rest", 28, 30, 30],
          [35, 35, 40, "rest", 40, 45, 45],
          [50, 50, 50, "rest", 55, 60, 60, 60, 60],
        ],
      },
      intermediate: {
        summary: "Strict reps. Mix grips daily. Grease-the-groove style.",
        perSet: 5,
        rest: "90s",
        totalsPerWeek: [
          [40, 50, 60, "rest", 60, 70, 70],
          [80, 80, 90, "rest", 90, 100, 100],
          [100, 100, 100, "rest", 100, 100, 100],
          [100, 100, 100, "rest", 100, 100, "max", 100, 100],
        ],
      },
      advanced: {
        summary: "Strict + weighted Friday session (+10 kg for 5×5).",
        perSet: 10,
        rest: "60–90s",
        totalsPerWeek: [
          [100, 100, 100, "rest", 100, 100, 100],
          [120, 120, 120, "rest", 120, 120, 120],
          [150, 150, 150, "rest", 150, 150, 150],
          [150, 150, 150, "rest", 150, 150, "max", 150, 150],
        ],
      },
    }),

  "burpee-100": () =>
    buildRepLevels({
      exercise: "burpees",
      beginner: {
        summary: "Step-back burpees (no jump back). Hands on bench if needed.",
        perSet: 5,
        rest: "90s",
        totalsPerWeek: [
          [20, 25, 30, "rest", 35, 40, 40],
          [45, 50, 55, "rest", 55, 60, 60],
          [65, 65, 70, "rest", 70, 75, 75],
          [80, 80, 85, "rest", 90, 90, 100, 100, 100],
        ],
      },
      intermediate: {
        summary: "Full chest-to-floor + jump. Race the clock from Week 2.",
        perSet: 10,
        rest: "60–90s",
        totalsPerWeek: [
          [60, 70, 80, "rest", 80, 90, 100],
          [100, 100, 100, "rest", 100, 100, 100],
          [100, 100, 100, "rest", 100, 100, 100],
          [100, 100, 100, "rest", 100, 100, "for-time", 100, 100],
        ],
      },
      advanced: {
        summary: "Chest-to-floor + clap overhead. Beat yesterday's time daily.",
        perSet: 20,
        rest: "30–45s",
        totalsPerWeek: [
          [120, 130, 140, "rest", 150, 160, 175],
          [175, 175, 175, "rest", 200, 200, 200],
          [200, 200, 200, "rest", 200, 200, 200],
          [200, 200, 200, "rest", 200, 200, "for-time", 200, 200],
        ],
      },
    }),

  "30-pistol-squat": () =>
    buildRepLevels({
      exercise: "pistol squat work (per leg)",
      beginner: {
        summary: "Box pistols (sit to a high bench). Counterweight at chest.",
        perSet: 3,
        rest: "90s",
        totalsPerWeek: [
          [12, 12, "rest", 15, 15, "rest", 18],
          [18, 20, "rest", 20, 22, "rest", 22],
          [24, 24, "rest", 25, 25, "rest", 25],
          [25, 25, "rest", 25, 25, "rest", 30, 30, 30],
        ],
      },
      intermediate: {
        summary: "Lower the box weekly. Tempo: 3s eccentric, 1s pause, drive up.",
        perSet: 5,
        rest: "75s",
        totalsPerWeek: [
          [20, 20, "rest", 25, 25, "rest", 25],
          [25, 30, "rest", 30, 30, "rest", 30],
          [30, 35, "rest", 35, 35, "rest", 35],
          [35, 35, "rest", 35, 35, "rest", 40, 40, 40],
        ],
      },
      advanced: {
        summary: "Full-depth, hands-free. Add 5–10 kg goblet from Week 3.",
        perSet: 8,
        rest: "60s",
        totalsPerWeek: [
          [40, 40, "rest", 48, 48, "rest", 48],
          [48, 56, "rest", 56, 56, "rest", 56],
          [56, 64, "rest", 64, 64, "rest", 64],
          [64, 64, "rest", 64, 64, "rest", 80, 80, 80],
        ],
      },
    }),

  "handstand-30": () =>
    buildTimeLevels({
      exercise: "handstand wall practice",
      beginner: {
        summary: "Wall-walk + chest-to-wall holds. Wrist prep first, always.",
        rounds: 3,
        weeks: [
          [10, 12, 15, "rest", 15, 18, 20],
          [20, 22, 25, "rest", 25, 28, 30],
          [30, 30, 30, "rest", 35, 35, 40],
          [40, 40, 45, "rest", 45, 45, 60, 60, 60],
        ],
      },
      intermediate: {
        summary: "Back-to-wall + toe-tap balance reps off the wall.",
        rounds: 3,
        weeks: [
          [30, 30, 35, "rest", 35, 40, 40],
          [45, 45, 50, "rest", 50, 55, 60],
          [60, 60, 60, "rest", 60, 75, 75],
          [75, 75, 90, "rest", 90, 90, 120, 120, 120],
        ],
      },
      advanced: {
        summary: "Freestanding kick-ups. Add 5 min of straddle holds at the end.",
        rounds: 4,
        weeks: [
          [60, 60, 60, "rest", 75, 75, 90],
          [90, 90, 90, "rest", 90, 105, 105],
          [120, 120, 120, "rest", 120, 120, 135],
          [135, 135, 150, "rest", 150, 150, 180, 180, 180],
        ],
      },
    }),

  "10k-steps-daily": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "Build the floor: 6k → 10k over four weeks.",
        perDay: (d) => {
          if (d <= 7) return `Hit 6,000 steps (any pace).`;
          if (d <= 14) return `Hit 7,500 steps + one 15-min brisk walk.`;
          if (d <= 21) return `Hit 9,000 steps + a 20-min post-meal walk.`;
          return `Hit 10,000 steps.`;
        },
      },
      intermediate: {
        summary: "10k a day, every day. Add one brisk session.",
        perDay: (d) => {
          const brisk = d % 2 === 0 ? "Include 20 min brisk pace (110 spm)." : "Steady pace OK.";
          return `Hit 10,000 steps. ${brisk}`;
        },
      },
      advanced: {
        summary: "12–15k daily with weekly long-walk progression.",
        perDay: (d) => {
          if (d % 7 === 0) return `Long walk day, 18,000 steps outdoors.`;
          return `Hit 12,000 steps + 30 min brisk.`;
        },
      },
    }),

  "20k-steps-week": () =>
    buildHabitLevels({
      durationDays: 2,
      beginner: {
        summary: "Two laid-back walking days. Split into 3–4 walks.",
        perDay: (d) =>
          d === 1
            ? "Saturday: hit 15,000 steps split into 3 walks (morning, lunch, sunset)."
            : "Sunday: hit 15,000 steps including one 60-min outdoor walk.",
      },
      intermediate: {
        summary: "Two solid 20k days. Pace yourself across the day.",
        perDay: (d) =>
          d === 1
            ? "Saturday: 20,000 steps. Morning 10k + afternoon errands + evening walk."
            : "Sunday: 20,000 steps. One 90-min scenic walk + closer walks.",
      },
      advanced: {
        summary: "Marathon-style weekend. 25k both days, weighted vest optional.",
        perDay: (d) =>
          d === 1
            ? "Saturday: 25,000 steps. Include a 2-hour ruck (10 kg vest)."
            : "Sunday: 25,000 steps. Hilly route + 30-min recovery walk after.",
      },
    }),

  "7-day-zone2": () =>
    buildHabitLevels({
      durationDays: 7,
      beginner: {
        summary: "Walking-led. Build the habit first.",
        perDay: (d) => `Day ${d}: ${25 + d * 5} min easy walk or bike. RPE 4/10.`,
      },
      intermediate: {
        summary: "Mixed-modality 30–60 min, strict zone 2.",
        perDay: (d) => `Day ${d}: ${30 + d * 5} min run/bike/row. HR 60–70% of max.`,
      },
      advanced: {
        summary: "60–90 min daily, engine building.",
        perDay: (d) => `Day ${d}: ${60 + d * 5} min nasal-breathing only. Log avg HR.`,
      },
    }),

  "75-hard-onyx": () =>
    buildHabitLevels({
      durationDays: 75,
      beginner: {
        summary: "Soft 75: skip the second workout if you're new to training.",
        perDay: () =>
          "1 × 45-min workout (one outdoors if possible) · diet on plan · 3 L water · 10 pages · progress photo.",
      },
      intermediate: {
        summary: "Standard 75 Hard.",
        perDay: () =>
          "2 × 45-min workouts (1 outdoors) · strict diet · 4 L water · 10 pages · progress photo.",
      },
      advanced: {
        summary: "75 Hard + daily mobility and zero processed food.",
        perDay: () =>
          "2 × 45-min workouts (1 outdoors) · whole-food diet · 4 L water · 20 pages · 10-min mobility · progress photo.",
      },
    }),

  "21-day-discipline": () =>
    buildHabitLevels({
      durationDays: 21,
      beginner: {
        summary: "One thing well: a 20-min walk and a clean meal.",
        perDay: () => "20-min walk · 1 protein-rich whole-food meal · 8 glasses of water.",
      },
      intermediate: {
        summary: "Train + clean meal + walk every day.",
        perDay: () => "30-min training · 1 clean meal · 10-min walk phone-free.",
      },
      advanced: {
        summary: "60-min training + 2 clean meals + sunset walk.",
        perDay: () => "60-min training · 2 clean meals · 30-min outdoor walk + 10-min mobility.",
      },
    }),

  "14-day-mobility": () =>
    buildHabitLevels({
      durationDays: 14,
      beginner: {
        summary: "5-min daily flows. Pick comfort over depth.",
        perDay: (d) => `Day ${d}: 5-min flow, pick the joint that feels worst today.`,
      },
      intermediate: {
        summary: "10-min targeted block by region.",
        perDay: (d) => {
          if (d <= 4) return `Day ${d}: 10-min HIPS block (90/90, deep squat, pigeon).`;
          if (d <= 8) return `Day ${d}: 10-min SHOULDERS block (wall slides, dislocates, prayer).`;
          if (d <= 11) return `Day ${d}: 10-min ANKLES & T-SPINE block.`;
          return `Day ${d}: 10-min FULL FLOW. Retest deep squat.`;
        },
      },
      advanced: {
        summary: "15-min routine + PNF contractions in end-ranges.",
        perDay: (d) => `Day ${d}: 15-min full flow + 2 PNF rounds in worst-feeling joint.`,
      },
    }),

  "5k-couch-to": () =>
    buildHabitLevels({
      durationDays: 56,
      beginner: {
        summary: "Walk-run intervals 3× per week. Mostly walking.",
        perDay: (d) => {
          const w = Math.ceil(d / 7);
          const onDay = (d - 1) % 7 < 3;
          if (!onDay) return `Day ${d}: Rest or 20-min walk.`;
          if (w <= 2) return `Day ${d}: 20 min, 60s jog / 90s walk × 8.`;
          if (w <= 4) return `Day ${d}: 25 min, 90s jog / 2 min walk × 6.`;
          return `Day ${d}: 25 min, 3 min jog / 90s walk repeats.`;
        },
      },
      intermediate: {
        summary: "Standard C25K progression to a 30-min non-stop run.",
        perDay: (d) => {
          const w = Math.ceil(d / 7);
          const onDay = (d - 1) % 7 < 3;
          if (!onDay) return `Day ${d}: Easy 30-min walk + 10-min mobility.`;
          if (w <= 2) return `Day ${d}: 90s jog / 2 min walk × 6 (20 min).`;
          if (w <= 4) return `Day ${d}: Build to 5-min jog / 90s walk × 4.`;
          if (w <= 6) return `Day ${d}: 10-min jog / 2-min walk × 2.`;
          return `Day ${d}: 25–30 min continuous easy run.`;
        },
      },
      advanced: {
        summary: "C25K + tempo + long run weekly.",
        perDay: (d) => {
          const mod = (d - 1) % 7;
          if (mod === 0) return `Day ${d}: Easy 30-min run.`;
          if (mod === 2) return `Day ${d}: Tempo, 5 × 3 min @ 5K pace, 90s jog rest.`;
          if (mod === 4) return `Day ${d}: Hill repeats 6 × 60s + easy 20 min.`;
          if (mod === 5) return `Day ${d}: Long run, building to 8 km easy.`;
          return `Day ${d}: Strength + 30-min walk.`;
        },
      },
    }),

  "cold-shower-30": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "Gradual ramp: 30s → 2 min over the month.",
        perDay: (d) =>
          `End shower with ${Math.min(30 + (d - 1) * 5, 120)}s of cold. Nasal breathing.`,
      },
      intermediate: {
        summary: "2 min daily. Add weekly contrast finishers.",
        perDay: (d) => {
          if (d % 7 === 0) return `Day ${d}: Contrast, 60s hot / 90s cold × 3.`;
          return `Day ${d}: 2 min uninterrupted cold finish.`;
        },
      },
      advanced: {
        summary: "3 min daily + cold immersion 2× per week if available.",
        perDay: (d) => {
          if (d % 4 === 0) return `Day ${d}: 5-min ice bath or 4-min cold shower.`;
          return `Day ${d}: 3 min cold finish + box-breathing.`;
        },
      },
    }),

  "dry-30": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "Zero alcohol + replacement ritual.",
        perDay: () => "Zero alcohol. Replace the 7 PM ritual with sparkling water + lime.",
      },
      intermediate: {
        summary: "Zero alcohol + log sleep + energy score.",
        perDay: () => "Zero alcohol · log sleep hours · rate morning energy 1–10.",
      },
      advanced: {
        summary: "Zero alcohol + zero caffeine after 12 PM + 8h sleep window.",
        perDay: () => "Zero alcohol · no caffeine after noon · 8h in bed · log sleep, HRV, energy.",
      },
    }),

  "no-sugar-14": () =>
    buildHabitLevels({
      durationDays: 14,
      beginner: {
        summary: "No desserts, sodas or sweetened drinks. Whole fruit OK.",
        perDay: () => "Skip all sweets, sodas and sweetened drinks today. Whole fruit allowed.",
      },
      intermediate: {
        summary: "Zero added sugar, read every label.",
        perDay: () =>
          "Zero added sugar (sucrose, dextrose, syrup, maltose). Log craving score 1–10.",
      },
      advanced: {
        summary: "Zero added sugar + zero artificial sweeteners + low-glycaemic carbs only.",
        perDay: () =>
          "No added sugar OR sweeteners. Carbs only from whole sources. Track cravings + energy.",
      },
    }),

  "5am-club": () =>
    buildHabitLevels({
      durationDays: 21,
      beginner: {
        summary: "Up at 6 AM with a phone-free 30-min start.",
        perDay: () => "Out of bed by 6:00 · 30 min phone-free · water + light walk.",
      },
      intermediate: {
        summary: "5 AM wake + 60-min phone-free deep work or training.",
        perDay: () => "Up at 5:00 · 60 min phone-free · one habit (train / read / journal).",
      },
      advanced: {
        summary: "5 AM + cold + train + deep work, full operator stack.",
        perDay: () =>
          "Up at 5:00 · cold splash · 30-min training · 30-min deep work, phone after 7 AM.",
      },
    }),

  "1-gallon-water": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "2 L per day, build the habit.",
        perDay: () => "Drink 2 L (~half gallon). Log when you finish.",
      },
      intermediate: {
        summary: "1 gallon (3.8 L) per day, spread evenly.",
        perDay: () => "1 L by 10 AM · 2 L by 2 PM · 3 L by 6 PM · 3.8 L by 8 PM.",
      },
      advanced: {
        summary: "1 gallon + electrolytes daily + morning 500 ml on waking.",
        perDay: () =>
          "500 ml on waking · 1 gallon by 8 PM · electrolytes mid-morning + post-training.",
      },
    }),

  "split-stretch": () =>
    buildHabitLevels({
      durationDays: 60,
      beginner: {
        summary: "10-min static flows. Pancake + butterfly + half splits.",
        perDay: () => "10 min: 3 rounds × 60s pancake + butterfly + half-split each side.",
      },
      intermediate: {
        summary: "15-min flows with PNF contractions.",
        perDay: () =>
          "15 min: pancake + box stretch + half splits + 2 PNF contractions in deepest position.",
      },
      advanced: {
        summary: "20-min flows + weighted holds + middle split attempts.",
        perDay: () =>
          "20 min: full flow + 90s middle-split attempt + weighted pancake hold (5–10 kg plate).",
      },
    }),

  "no-phone-morning": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "30 min phone-free on waking.",
        perDay: () => "First 30 min phone-free.",
      },
      intermediate: {
        summary: "60 min phone-free + one chosen habit.",
        perDay: () => "First 60 min phone-free + one chosen habit.",
      },
      advanced: {
        summary: "90 min phone-free + no phone at meals.",
        perDay: () => "First 90 min phone-free · no phone at any meal today.",
      },
    }),

  "8h-sleep-30": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "7 hours in bed minimum.",
        perDay: () => "7+ hours in bed, lights off.",
      },
      intermediate: {
        summary: "8h in bed + no screens 30 min pre-bed.",
        perDay: () => "8h in bed · no screens 30 min before sleep · log sleep score.",
      },
      advanced: {
        summary: "8h + bedroom 18°C + last caffeine by 12 PM.",
        perDay: () =>
          "8h in bed · room 17–19°C · last caffeine before noon · last meal 3h pre-bed.",
      },
    }),

  "deadlift-bodyweight": () =>
    buildHabitLevels({
      durationDays: 84,
      beginner: {
        summary: "Build to bodyweight pull in 12 weeks (3 days/week).",
        perDay: (d) => {
          const mod = (d - 1) % 7;
          if (mod === 0) return `Day ${d}: Deadlift 5 × 5 @ 60% · row 4 × 8 · plank.`;
          if (mod === 2)
            return `Day ${d}: Romanian DL 4 × 8 · split squat 3 × 8 · hanging knee raise.`;
          if (mod === 4) return `Day ${d}: Deadlift 3 × 5 @ 70% · pull-ups · loaded carry.`;
          return `Day ${d}: Rest or 30-min walk + mobility.`;
        },
      },
      intermediate: {
        summary: "1.5× bodyweight target over 12 weeks.",
        perDay: (d) => {
          const mod = (d - 1) % 7;
          if (mod === 0) return `Day ${d}: Deadlift 3 × 5 @ 75% · row 4 × 6 · core.`;
          if (mod === 2) return `Day ${d}: Pause DL 4 × 3 @ 70% · front squat · RDL.`;
          if (mod === 4) return `Day ${d}: Heavy single @ 85% + back-off 3 × 5 @ 70%.`;
          return `Day ${d}: Rest or zone-2 cardio + mobility.`;
        },
      },
      advanced: {
        summary: "2× bodyweight target, strict periodisation.",
        perDay: (d) => {
          const mod = (d - 1) % 7;
          if (mod === 0) return `Day ${d}: DL 5 × 3 @ 80% · weighted pull-up 4 × 5 · loaded carry.`;
          if (mod === 2) return `Day ${d}: Deficit DL 4 × 3 @ 75% · front squat 4 × 5 · GHR.`;
          if (mod === 4) return `Day ${d}: Top single @ 90% + 3 × 3 @ 80% · row.`;
          if (mod === 6) return `Day ${d}: Strongman accessories or sled work.`;
          return `Day ${d}: Mobility + zone-2 30 min.`;
        },
      },
    }),

  "veggie-everyday": () =>
    buildHabitLevels({
      durationDays: 30,
      beginner: {
        summary: "1 fist of veg at dinner.",
        perDay: () => "1 fist-sized portion of vegetables at dinner today.",
      },
      intermediate: {
        summary: "Veg at lunch + dinner.",
        perDay: () => "Vegetables at lunch AND dinner, photo one of them.",
      },
      advanced: {
        summary: "Veg at every meal + 30 plant species this week.",
        perDay: () => "Vegetables at all 3 meals · log unique plant foods toward 30/week.",
      },
    }),
};

/* ----------------------------- API ----------------------------- */

// Performance challenges need a detailed set-by-set / time-based daily schedule.
// Habit-style challenges (steps, water, sugar-free, sleep, etc.) just need a
// daily log, the howTo + daily task already explain everything.
export const PERFORMANCE_CHALLENGE_SLUGS = new Set<string>([
  "30-day-pushup",
  "30-day-plank",
  "100-squat-day",
  "100-pullup-month",
  "burpee-100",
  "30-pistol-squat",
  "handstand-30",
]);

export function isPerformanceChallenge(slug: string): boolean {
  return PERFORMANCE_CHALLENGE_SLUGS.has(slug);
}

export function getLevelsFor(challenge: Challenge): Level[] | null {
  if (!PERFORMANCE_CHALLENGE_SLUGS.has(challenge.slug)) return null;
  const fn = BUILDERS[challenge.slug];
  return fn ? fn() : null;
}
