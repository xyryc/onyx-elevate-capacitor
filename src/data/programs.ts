import programWomen40 from "@/assets/program-women40.jpg";
import programGluteSpec from "@/assets/program-glute-specialization.jpg";
import programPowerlifting from "@/assets/program-powerlifting.jpg";
import programRunning from "@/assets/program-running.jpg";
import programBodybuilding from "@/assets/program-bodybuilding.jpg";
import programFatloss from "@/assets/program-fatloss.jpg";
import programMuscle from "@/assets/program-muscle.jpg";
import programBeginner from "@/assets/program-beginner.jpg";
import programLower from "@/assets/program-lower.jpg";
import programStretchHypertrophyAsset from "@/assets/programs/program-stretch-hypertrophy.jpg.asset.json";
import programOnyx531Asset from "@/assets/onyx-531-lat-pulldown.png.asset.json";
import programStrengthUpperLowerAsset from "@/assets/strength-upper-lower-deadlift.png.asset.json";
import programPplVolumeAsset from "@/assets/programs/program-ppl-volume.jpg.asset.json";
import programUpperLowerMassAsset from "@/assets/programs/program-upper-lower-mass.jpg.asset.json";

import programLeanEngineAsset from "@/assets/programs/program-lean-engine.jpg.asset.json";
import programMetconCutAsset from "@/assets/programs/program-metcon-cut.jpg.asset.json";
import programHomeGarageAsset from "@/assets/programs/program-home-garage.jpg.asset.json";
import programHomeDumbbellAsset from "@/assets/programs/program-home-dumbbell.jpg.asset.json";
import programHomeBandsAsset from "@/assets/programs/program-home-bands.jpg.asset.json";
import programWomenIronGraceAsset from "@/assets/programs/program-women-iron-grace.jpg.asset.json";
import programWomenGluteSpecAsset from "@/assets/programs/program-women-glute-spec.jpg.asset.json";
import programWomenPostpartumAsset from "@/assets/programs/program-women-postpartum.jpg.asset.json";
import programBeginnerFirstRepAsset from "@/assets/programs/program-beginner-first-rep.jpg.asset.json";
import programBeginnerBodyweightAsset from "@/assets/programs/program-beginner-bodyweight.jpg.asset.json";
import programBeginnerFullbodyAsset from "@/assets/programs/program-beginner-fullbody.jpg.asset.json";

// CrossFit removed — keep Hyrox as the sole hybrid category for now.
import programHyroxDoublesAsset from "@/assets/programs/program-hyrox-doubles.png.asset.json";
import programHyroxRacePrepAsset from "@/assets/programs/program-hyrox-race-prep.png.asset.json";
import programPowerliftingRawAsset from "@/assets/programs/program-powerlifting-raw.jpg.asset.json";
import programPowerliftingMeetAsset from "@/assets/programs/program-powerlifting-meet.jpg.asset.json";
import programPowerliftingRpeAsset from "@/assets/programs/program-powerlifting-rpe.jpg.asset.json";
import programFreeHyroxRowerAsset from "@/assets/programs/program-free-hyrox-rower.png.asset.json";
const programFreeHyroxRower = programFreeHyroxRowerAsset.url;
import programFreeStrengthAsset from "@/assets/programs/program-free-strength.png.asset.json";
const programFreeStrength = programFreeStrengthAsset.url;
const programStretchHypertrophy = programStretchHypertrophyAsset.url;
const programPplVolume = programPplVolumeAsset.url;
const programUpperLowerMass = programUpperLowerMassAsset.url;

const programLeanEngine = programLeanEngineAsset.url;
const programMetconCut = programMetconCutAsset.url;
const programHomeGarage = programHomeGarageAsset.url;
const programHomeDumbbell = programHomeDumbbellAsset.url;
const programHomeBands = programHomeBandsAsset.url;
const programWomenIronGrace = programWomenIronGraceAsset.url;
const programWomenGluteSpec = programWomenGluteSpecAsset.url;
const programWomenPostpartum = programWomenPostpartumAsset.url;

export type ProgramCategory =
  | "Strength"
  | "Hypertrophy"
  | "Bodybuilding"
  | "Fat Loss"
  | "Powerlifting"
  | "Strongman"
  | "Endurance"
  | "Home Training"
  | "Women"
  | "Beginner"
  | "Hyrox";

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export interface WorkoutDay {
  day: string;
  title: string;
  focus?: string;
  exercises: WorkoutExercise[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Program {
  slug: string;
  title: string;
  tagline: string;
  category: ProgramCategory;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  daysPerWeek: number;
  goal: string;
  image: string;
  reads: string;
  comments: number;
  summary: string;
  whoItsFor: string[];
  whatYouGet: string[];
  nutrition: string;
  supplementation: string;
  recovery: string;
  trainingOverview: string;
  progression: string;
  weeklySchedule: { day: string; session: string }[];
  workouts: WorkoutDay[];
  faqs: FaqItem[];
  /** Optional explicit warm-up; otherwise a category-tailored default is rendered on the detail page. */
  warmup?: WarmupBlock;
  /** Pricing model - defaults to premium R$ 29,99 when omitted. */
  isFree?: boolean;
  /** Display price, e.g. "R$ 29,99" or "Grátis". */
  price?: string;
  /** Highlight bullets shown on the purchase card. */
  includes?: string[];
}

export interface WarmupStep {
  name: string;
  detail: string;
  duration: string;
}

export interface WarmupBlock {
  intro: string;
  generalPrep: WarmupStep[];
  specificPrep: WarmupStep[];
  activation: WarmupStep[];
  rules: string[];
}

/**
 * Category-tailored warm-up protocols. Used as the default on the program detail page
 * when a program does not define its own `warmup`. Every program is guaranteed to show
 * a complete, high-quality warm-up: general prep → specific prep → activation.
 */
export const warmupByCategory: Record<ProgramCategory, WarmupBlock> = {
  Strength: {
    intro:
      "Strength sessions live or die on the warm-up. The goal is a hot CNS, lubricated joints, and crisp movement patterns before the first working set. Total time: 10-12 minutes.",
    generalPrep: [
      {
        name: "Easy bike or row",
        detail: "Zone 1, nasal breathing only, raise core temperature without fatigue.",
        duration: "3-4 min",
      },
      {
        name: "World's greatest stretch",
        detail: "Hip flexor, T-spine rotation, hamstring sweep - 3 reps per side.",
        duration: "1 min",
      },
      {
        name: "Cat-camel + dead bug",
        detail: "Spine segmentation then 6 slow dead bugs to lock the brace.",
        duration: "1 min",
      },
    ],
    specificPrep: [
      {
        name: "Empty bar x 8 reps",
        detail: "Groove the exact pattern of the first main lift, perfect bar path.",
        duration: "1 set",
      },
      {
        name: "Ramping sets",
        detail:
          "Add 10-20 kg at a time, 3-5 reps, until ~85% of working weight. Last warm-up is a single.",
        duration: "4-6 sets",
      },
    ],
    activation: [
      {
        name: "Band pull-apart",
        detail: "20 reps to wake the upper back before pressing or pulling.",
        duration: "2 sets",
      },
      {
        name: "Glute bridge or hip airplane",
        detail: "10 reps each side - fires glutes for squat/deadlift day.",
        duration: "2 sets",
      },
    ],
    rules: [
      "Never jump straight to working weight - your first work set should feel like a 7/10, not a max.",
      "If a warm-up rep grinds, add another ramp set instead of pushing through.",
      "Mobility work goes BEFORE specific prep - never between heavy sets.",
    ],
  },
  Powerlifting: {
    intro:
      "Heavy singles demand a deliberate, ramped warm-up. The aim is full neural drive without burning sets. Total time: 12-15 minutes.",
    generalPrep: [
      {
        name: "Bike, sled, or jump rope",
        detail: "Light pace, get a thin sweat. Heart rate ~120 bpm.",
        duration: "4 min",
      },
      {
        name: "90/90 hip switch + ankle rocks",
        detail: "Open the hips and ankles for squat depth.",
        duration: "1 min",
      },
      {
        name: "T-spine foam roll",
        detail:
          "60 seconds on the upper back - critical for bench arch and bar position on squats.",
        duration: "1 min",
      },
    ],
    specificPrep: [
      { name: "Bar x 10", detail: "Two empty bar sets, then start ramping.", duration: "2 sets" },
      {
        name: "Pyramid up",
        detail: "40% x 5, 60% x 3, 75% x 2, 85% x 1, 92% x 1 - then first work set.",
        duration: "5 sets",
      },
    ],
    activation: [
      {
        name: "Banded good morning",
        detail: "15 reps to load the posterior chain on squat/deadlift day.",
        duration: "2 sets",
      },
      {
        name: "Scap push-up + face pull",
        detail: "10 + 15 reps to stabilize the shoulder on bench day.",
        duration: "2 sets",
      },
    ],
    rules: [
      "Rest 2-3 minutes between heavy ramp singles - treat them like work sets.",
      "Belt and wraps go on around 80%, not before.",
      "If the top set feels heavier than the prescribed RPE, drop 5% on the next set rather than grinding a rep.",
    ],
  },
  Strongman: {
    intro:
      "Strongman days blend maximal loading with odd-object work and locomotion. Warm the whole body, then rehearse the implements. Total time: 12-15 minutes.",
    generalPrep: [
      {
        name: "Sled drag (light)",
        detail: "2 lengths of 20 m, easy pace, raise core temperature and prime the hips.",
        duration: "3 min",
      },
      {
        name: "Hip flow + T-spine opener",
        detail: "90/90, cossack, thoracic reach.",
        duration: "2 min",
      },
    ],
    specificPrep: [
      {
        name: "Empty implement rehearsal",
        detail: "Log, axle, or yoke - 2 reps at the empty weight to groove the path.",
        duration: "2 sets",
      },
      {
        name: "Ramp to opener",
        detail: "40 → 60 → 75 → 88% before the first working set / carry.",
        duration: "4 sets",
      },
    ],
    activation: [
      {
        name: "Farmer carry (light)",
        detail: "20 m at 40% load - fires grip, traps, and midline.",
        duration: "2 sets",
      },
      {
        name: "Banded pull-apart",
        detail: "20 reps to prepare the upper back for pressing and carrying.",
        duration: "2 sets",
      },
    ],
    rules: [
      "Warm the grip specifically - if the grip fails, the lift fails.",
      "Sled and carries first, then implements, then any pressing or hinging.",
      "If a carry or press feels off, cut distance/weight by 20% rather than skipping.",
    ],
  },
  Hypertrophy: {
    intro:
      "For hypertrophy the warm-up should drive blood into the target tissue and rehearse the mind-muscle connection - not exhaust it. Total time: 8-10 minutes.",
    generalPrep: [
      {
        name: "Cross-trainer or rower",
        detail: "Easy pace, raise temperature without lactate.",
        duration: "3 min",
      },
      {
        name: "Dynamic mobility circuit",
        detail: "Arm circles, scap CARs, hip CARs - 10 reps each.",
        duration: "2 min",
      },
    ],
    specificPrep: [
      {
        name: "Feeder sets",
        detail:
          "2 light sets at 40-50% of working weight, slow tempo, focus on stretch and squeeze.",
        duration: "2 sets",
      },
      {
        name: "Primer set",
        detail: "First working set stopped 3 reps shy of failure - second set is the real opener.",
        duration: "1 set",
      },
    ],
    activation: [
      {
        name: "Pre-exhaust isolation",
        detail:
          "Lateral raises before pressing, cable curl before back, leg extension before squats - 15 light reps.",
        duration: "1 set",
      },
    ],
    rules: [
      "Quality of the contraction beats load on hypertrophy work - earn the weight.",
      "Don't chase a pump in the warm-up; save it for the working sets.",
      "Pair antagonists (push/pull) on warm-up to save time without losing quality.",
    ],
  },
  Bodybuilding: {
    intro:
      "Bodybuilding warm-ups are about quality reps, not heat. Wake the target muscle, rehearse the path, then attack the working sets. Total time: 8-10 minutes.",
    generalPrep: [
      {
        name: "Stair climber or incline walk",
        detail: "Light pace, nasal breathing, raise temperature.",
        duration: "3 min",
      },
      {
        name: "Foam roll target area",
        detail: "30-60 seconds on the muscle being trained today.",
        duration: "1 min",
      },
    ],
    specificPrep: [
      {
        name: "2 ramp sets per first exercise",
        detail: "50% x 10 then 70% x 6 with a 3-second eccentric - feel every rep.",
        duration: "2 sets",
      },
    ],
    activation: [
      {
        name: "Mind-muscle primer",
        detail: "Lightest possible variation (band, cable) x 20 reps, deliberate squeeze at peak.",
        duration: "1 set",
      },
    ],
    rules: [
      "Warm-up sets do not count toward your working volume.",
      "If a joint clicks or pinches during warm-up, change exercise - do not push through.",
      "On a second muscle group in the same session, do ONE specific warm-up before jumping to working weight.",
    ],
  },
  "Fat Loss": {
    intro:
      "On a deficit your joints, tendons and CNS are more fragile. A real warm-up protects everything you've built while priming you to push intensity. Total time: 8 minutes.",
    generalPrep: [
      {
        name: "Steady cardio",
        detail: "Bike, row or jog at zone 1 - get the engine spinning.",
        duration: "3 min",
      },
      {
        name: "Dynamic full-body flow",
        detail: "Inchworm, lunge with rotation, scap push-up - 5 reps each.",
        duration: "2 min",
      },
    ],
    specificPrep: [
      {
        name: "Movement rehearsal",
        detail: "First exercise with bodyweight or empty bar x 10 - perfect tempo.",
        duration: "1 set",
      },
      {
        name: "Ramp to working weight",
        detail: "60% x 8, 80% x 5 before the first hard set.",
        duration: "2 sets",
      },
    ],
    activation: [
      {
        name: "Glute and core pulse",
        detail: "Glute bridge x 15 + dead bug x 10 to lock the brace under fatigue.",
        duration: "1 set",
      },
    ],
    rules: [
      "Hydrate AND get electrolytes in before training - cutting calories cuts performance fast otherwise.",
      "If energy is low, extend general prep by 2 minutes rather than skipping it.",
      "Warm-up is non-negotiable on deficit days - injury risk is higher.",
    ],
  },
  Endurance: {
    intro:
      "Running and conditioning warm-ups must raise temperature, open the hips and ankles, and rehearse stride mechanics. Total time: 10 minutes.",
    generalPrep: [
      {
        name: "Brisk walk into easy jog",
        detail: "Start walking, gradually transition to an easy aerobic jog.",
        duration: "5 min",
      },
      {
        name: "Leg swings + ankle circles",
        detail: "10 each direction per leg.",
        duration: "1 min",
      },
    ],
    specificPrep: [
      {
        name: "Form drills",
        detail: "A-skips, B-skips, butt kicks, high knees - 20 m of each.",
        duration: "3 min",
      },
      {
        name: "Strides",
        detail: "4 × 60-80 m at ~80% of top speed with full recovery walk back.",
        duration: "3 min",
      },
    ],
    activation: [
      {
        name: "Single-leg glute bridge",
        detail: "10 reps per side to stabilize the hip before loaded miles.",
        duration: "1 set",
      },
    ],
    rules: [
      "Never start a session cold - even on easy days do 5 minutes of building pace.",
      "On interval days, the last stride should feel like the first interval will be easy.",
      "Cool down with 5 minutes of easy walking to drop heart rate gradually.",
    ],
  },
  Hyrox: {
    intro:
      "Hyrox sessions blend heavy carries, sleds and running - the warm-up must prep ALL three. Total time: 12 minutes.",
    generalPrep: [
      {
        name: "Row 500 m easy",
        detail: "Steady pace, target around 2:15/500m. Get the engine warm.",
        duration: "2 min",
      },
      {
        name: "Dynamic flow",
        detail: "Inchworm, lunge with twist, scap push-up, squat to stand - 5 each.",
        duration: "3 min",
      },
    ],
    specificPrep: [
      {
        name: "Sled push primer",
        detail: "Empty sled or light load x 20 m - practice low athletic position.",
        duration: "2 sets",
      },
      {
        name: "Wall ball x 10",
        detail: "Light medicine ball, rehearse squat depth and target.",
        duration: "1 set",
      },
      {
        name: "Burpee broad jump x 5",
        detail: "Half intensity - wake the hips and shoulders.",
        duration: "1 set",
      },
    ],
    activation: [
      {
        name: "Glute bridge + band pull-apart",
        detail: "15 + 20 reps to fire posterior chain and upper back.",
        duration: "2 sets",
      },
    ],
    rules: [
      "Always include sled and carry prep - these positions are where most people get hurt cold.",
      "Final warm-up move should be at race pace for 30 seconds so the first work piece doesn't shock you.",
      "Sip electrolytes during the warm-up - Hyrox sessions deplete fast.",
    ],
  },
  "Home Training": {
    intro:
      "No gym, no excuses - but no warm-up means injury. Body-weight prep elevates temperature and grooves patterns in 8 minutes.",
    generalPrep: [
      {
        name: "Jumping jacks + high knees",
        detail: "30 seconds each, 2 rounds.",
        duration: "2 min",
      },
      { name: "Inchworm to push-up", detail: "5 reps, slow and controlled.", duration: "1 min" },
    ],
    specificPrep: [
      {
        name: "Bodyweight squat x 10",
        detail: "Slow tempo, full depth, hands overhead.",
        duration: "2 sets",
      },
      {
        name: "Push-up x 8",
        detail: "Knees if needed - perfect plank position.",
        duration: "2 sets",
      },
    ],
    activation: [
      {
        name: "Glute bridge + bird dog",
        detail: "15 + 10 per side, lock the brace.",
        duration: "1 set",
      },
    ],
    rules: [
      "Use household objects (backpack, water jugs) for resistance during warm-up if the workout is loaded.",
      "Warm up in the same space you'll train - no transitions.",
      "Listen to the body - add 2 more minutes on cold mornings.",
    ],
  },
  Women: {
    intro:
      "Designed around female physiology - extra time on hips, T-spine, and pelvic floor activation to support every lift. Total time: 10 minutes.",
    generalPrep: [
      {
        name: "Incline walk or bike",
        detail: "Easy pace, build a light sweat.",
        duration: "4 min",
      },
      {
        name: "90/90 hip switch",
        detail: "10 per side, focus on internal rotation.",
        duration: "1 min",
      },
      {
        name: "T-spine open book",
        detail: "8 per side - frees the upper back for pressing.",
        duration: "1 min",
      },
    ],
    specificPrep: [
      {
        name: "Empty bar / light DB rehearsal",
        detail: "10 reps of the first lift, full range of motion.",
        duration: "2 sets",
      },
      {
        name: "Ramp set",
        detail: "60% of working weight x 5 with a 2-second pause at the bottom.",
        duration: "1 set",
      },
    ],
    activation: [
      {
        name: "Glute bridge + clamshell",
        detail: "15 + 12 per side. Fires glute medius before squats and lunges.",
        duration: "2 sets",
      },
      {
        name: "Pelvic floor breathing",
        detail: "5 slow breaths - exhale on the lift to coordinate the brace.",
        duration: "1 min",
      },
    ],
    rules: [
      "Track menstrual cycle - add 2 minutes of warm-up during luteal phase when joints feel stiffer.",
      "Never skip glute activation - it's the difference between feeling squats in your knees vs your hips.",
      "Hydrate well before lifting; women dehydrate faster than men relative to training intensity.",
    ],
  },
  Beginner: {
    intro:
      "Beginners need MORE warm-up, not less - patterns aren't grooved yet. This 10-minute protocol builds skill while it warms.",
    generalPrep: [
      {
        name: "Easy bike or brisk walk",
        detail: "Just enough to feel warm - no fatigue.",
        duration: "4 min",
      },
      {
        name: "World's greatest stretch",
        detail: "3 per side, slow and controlled.",
        duration: "2 min",
      },
    ],
    specificPrep: [
      {
        name: "Movement rehearsal",
        detail: "Bodyweight version of every lift in today's session, 8 reps each.",
        duration: "3 min",
      },
      {
        name: "Empty bar / light DB ramp",
        detail: "10 reps at 50% of working weight before each main lift.",
        duration: "1 set",
      },
    ],
    activation: [
      {
        name: "Glute bridge + dead bug",
        detail: "10 reps each - these two moves prevent 80% of beginner back pain.",
        duration: "1 set",
      },
    ],
    rules: [
      "Form first, weight second - your warm-up is also your skill practice.",
      "Film one warm-up set per week to check positions.",
      "If you can't hit depth in warm-up, you won't hit it under load - fix mobility first.",
    ],
  },
};

/** Default price for premium programs across the catalog. */
export const PREMIUM_PRICE = "R$ 29,99";

export const programs: Program[] = [
  {
    slug: "iron-grace-women-40-plus",
    title: "Iron & Grace: 10-Week Strength Build for Women 40+",
    tagline: "Build lean muscle, restore strength, and feel powerful again.",
    category: "Women",
    level: "Intermediate",
    duration: "10 Weeks",
    daysPerWeek: 4,
    goal: "Lean muscle + fat loss",
    image: programWomenIronGrace,
    reads: "21.4K",
    comments: 14,
    summary:
      "A four-day resistance plan engineered around how women's bodies actually respond after 40 - hormonally, neurologically, and structurally. Each phase pairs progressive strength work with deliberate recovery to keep joints healthy while building visibly stronger glutes, back and arms.",
    whoItsFor: [
      "Women 40+ returning to the gym after a break",
      "Lifters tired of generic 'bikini' templates",
      "Anyone juggling work, family, and limited recovery bandwidth",
    ],
    whatYouGet: [
      "10-week progressive block periodization",
      "4 strength sessions + 2 conditioning days",
      "PDF download with logging sheets (inside the Onyx app)",
      "Joint-friendly substitutions for every lift",
    ],
    nutrition:
      "Aim for 0.8-1.0 g of protein per pound of goal bodyweight. Center meals around whole-food carbs (oats, rice, potatoes, fruit), 25-35 g of fiber daily, and 2-3 servings of healthy fats. A slight deficit (200-400 kcal) supports fat loss without crushing strength or sleep.",
    supplementation:
      "Creatine monohydrate (5 g/day), vitamin D3 (2,000-4,000 IU), omega-3 (2 g EPA+DHA), and magnesium glycinate at night. A whey or plant protein helps hit daily protein goals; everything else is optional.",
    recovery:
      "Prioritize 7-9 hours of sleep, get sunlight within an hour of waking, and protect a true rest day. Track cycle or perimenopause symptoms - deload the week strength dips. Walking 7-10k steps/day moves more body comp than extra cardio sessions.",
    trainingOverview:
      "Each week alternates Upper / Lower / Upper / Lower with Zone 2 cardio between strength days. Top sets use a 12-10-8 descending rep scheme to develop both work capacity and pure strength without joint pounding.",
    progression:
      "Weeks 1-3 establish technique and baseline loads. Weeks 4-7 progressively overload the top set every week. Weeks 8-9 push intensity. Week 10 is a deload + retest of key lifts.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Body Workout A" },
      { day: "Tuesday", session: "Lower Body Workout A" },
      { day: "Wednesday", session: "Zone 2 Cardio + Core" },
      { day: "Thursday", session: "Upper Body Workout B" },
      { day: "Friday", session: "Lower Body Workout B" },
      { day: "Saturday", session: "Active Recovery (walk, mobility, yoga)" },
      { day: "Sunday", session: "Rest or light Zone 2" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Body A",
        focus: "Vertical push & pull + light core",
        exercises: [
          { name: "Seated Barbell Press", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Lat Pull Down", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "One-Arm Row (each side)", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Face Pulls", sets: "3", reps: "12, 10, 8", rest: "60-90 sec" },
          { name: "Push Ups (any variation)", sets: "2", reps: "AMRAP", rest: "90-120 sec" },
          { name: "Dead Bug", sets: "2", reps: "10/side", rest: "45 sec" },
          { name: "Treadmill Incline Walking", sets: "1", reps: "10 min @ 6% incline", rest: "-" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Body A",
        focus: "Quad & glute focus - joint-friendly",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Barbell Hip Thrust", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Leg Press", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Single Leg Curl (each side)", sets: "3", reps: "12, 10, 8", rest: "60-90 sec" },
          { name: "Calf Raise (any variation)", sets: "2", reps: "AMRAP", rest: "60-90 sec" },
          { name: "Pallof Press", sets: "2", reps: "10/side", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Upper Body B",
        focus: "Horizontal push, arms & core",
        exercises: [
          { name: "Dumbbell Bench Press", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Seated Cable Row", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Lateral Raise", sets: "3", reps: "12, 10, 8", rest: "60-90 sec" },
          { name: "Rope Tricep Extension", sets: "3", reps: "12, 10, 8", rest: "60-90 sec" },
          { name: "Preacher Curl", sets: "3", reps: "12, 10, 8", rest: "60-90 sec" },
          { name: "Plank", sets: "3", reps: "30-45 sec", rest: "45 sec" },
          { name: "Treadmill Incline Walking", sets: "1", reps: "10 min @ 6% incline", rest: "-" },
        ],
      },
      {
        day: "Day 5",
        title: "Lower Body B",
        focus: "Posterior chain & core - hamstring emphasis",
        exercises: [
          { name: "Romanian Deadlift", sets: "3", reps: "12, 10, 8", rest: "2-3 min" },
          { name: "Lateral Lunge (each side)", sets: "3", reps: "12, 10, 8", rest: "90-120 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60-90 sec" },
          { name: "Cable Pull Through", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Pallof Press (each side)", sets: "3", reps: "12, 10, 8", rest: "45-75 sec" },
          { name: "Box Squat or Step Up (tempo)", sets: "2", reps: "AMRAP", rest: "90-120 sec" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I adjust the split to fit my schedule?",
        answer:
          "Yes. The weekly layout is a recommendation. Consistency beats perfection - just avoid stacking four heavy resistance days back-to-back so recovery doesn't fall behind.",
      },
      {
        question: "Should I add more cardio if I have weight to lose?",
        answer:
          "Usually no. More cardio rarely improves results past a point and can blunt recovery. Anchor fat loss with resistance training, daily steps, and nutrition. Add a Zone 2 session only if recovery allows.",
      },
      {
        question: "I have joint issues - can I swap exercises?",
        answer:
          "Absolutely. Keep the movement pattern (push, pull, hinge, squat) and use joint-friendly variations: cables instead of free weights, supported rows, leg press in place of deep squats.",
      },
    ],
  },
  {
    slug: "onyx-hypertrophy-12-week",
    title: "Onyx Hypertrophy: 12-Week Muscle Construction",
    tagline: "Visible muscle in the mirror, week after week.",
    category: "Hypertrophy",
    level: "Intermediate",
    duration: "12 Weeks",
    daysPerWeek: 5,
    goal: "Maximum lean mass",
    image: programMuscle,
    reads: "48.2K",
    comments: 62,
    summary:
      "A push / pull / legs split engineered around mechanical tension and metabolite accumulation. Compounds drive the heavy work, isolations sculpt the detail, and weekly volume rises in deliberate waves so you grow without burning out.",
    whoItsFor: [
      "Lifters with 6+ months of consistent training",
      "Anyone tired of program-hopping without visible change",
      "People who want a real plan, not a YouTube split",
    ],
    whatYouGet: [
      "12 weeks of wave-loaded hypertrophy",
      "5 sessions per week, fits a 60-minute slot",
      "Built-in deload and PR test week",
      "Substitutions for every machine and cable",
    ],
    nutrition:
      "Lean bulk: +200-300 kcal over maintenance, 1 g protein per pound, carbs centered around training. Track weekly bodyweight average and adjust monthly.",
    supplementation:
      "Creatine (5 g), whey or blend protein, electrolytes around training, and caffeine pre-workout if tolerated. Skip the pre-workout cocktails.",
    recovery:
      "8 hours of sleep, one full rest day, and a deload every fourth week. Soft tissue work post-leg-day pays off mid-program.",
    trainingOverview:
      "Push / Pull / Legs / Upper / Lower with an emphasis on the bench, squat, and weighted pull-up as anchor lifts. Accessory volume scales up through week 8 before the deload + retest block.",
    progression:
      "Weeks 1-4 build base volume. Weeks 5-8 intensify with top sets at RPE 8-9. Weeks 9-11 add a fifth working set on key lifts. Week 12 is a deload and 1-3RM retest.",
    weeklySchedule: [
      { day: "Monday", session: "Push (Chest, Shoulders, Triceps)" },
      { day: "Tuesday", session: "Pull (Back, Rear Delts, Biceps)" },
      { day: "Wednesday", session: "Legs (Quad bias)" },
      { day: "Thursday", session: "Upper Body Pump" },
      { day: "Friday", session: "Legs (Posterior bias)" },
      { day: "Saturday", session: "Optional arms + cardio" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Push",
        focus: "Chest / Shoulders / Triceps",
        exercises: [
          { name: "Barbell Bench Press", sets: "4", reps: "8, 8, 6, 6", rest: "2-3 min" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", rest: "90 sec" },
          { name: "Seated DB Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Lateral Raise", sets: "4", reps: "12-15", rest: "60 sec" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Pull",
        focus: "Back / Biceps",
        exercises: [
          { name: "Weighted Pull-Up", sets: "4", reps: "6-8", rest: "2-3 min" },
          { name: "Barbell Row", sets: "3", reps: "8", rest: "2 min" },
          { name: "Chest-Supported Row", sets: "3", reps: "10-12", rest: "90 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "60 sec" },
          { name: "Incline DB Curl", sets: "3", reps: "10-12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Legs - Quad Bias",
        focus: "Squat focus",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "6, 6, 5, 5", rest: "3 min" },
          { name: "Leg Press", sets: "3", reps: "10-12", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "90 sec" },
          { name: "Leg Extension", sets: "3", reps: "12-15", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Upper Body Pump",
        focus: "Higher-rep chest, back and delt work with short rest",
        exercises: [
          { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", rest: "75 sec" },
          { name: "Chest-Supported Row", sets: "4", reps: "10-12", rest: "75 sec" },
          { name: "Cable Chest Fly", sets: "3", reps: "12-15", rest: "60 sec" },
          { name: "Straight-Arm Cable Pulldown", sets: "3", reps: "12-15", rest: "60 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Cable Bicep Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Legs - Posterior Bias",
        focus: "Hinge, hamstrings and glutes",
        exercises: [
          { name: "Romanian Deadlift", sets: "4", reps: "6-8", rest: "3 min" },
          { name: "Barbell Hip Thrust", sets: "4", reps: "8", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "90 sec" },
          { name: "Seated Leg Curl", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Cable Pull Through", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I run this on a cut?",
        answer:
          "Yes, but expect strength to plateau. Keep volume the same and reduce intensity techniques in the last 3 weeks.",
      },
      {
        question: "What if I miss a session?",
        answer:
          "Push it to the next day and shift the rest of the week back. Don't double up - recovery is the variable that grows you.",
      },
    ],
  },
  {
    slug: "raw-power-12-week-powerlifting",
    title: "Raw Power: 12-Week Squat, Bench & Deadlift",
    tagline: "Add real pounds to the only three lifts that matter.",
    category: "Powerlifting",
    level: "Intermediate",
    duration: "12 Weeks",
    daysPerWeek: 4,
    goal: "Total strength PRs",
    image: programPowerliftingRawAsset.url,
    reads: "33.6K",
    comments: 41,
    summary:
      "A DUP (daily undulating periodization) approach to the big three. Every week hits each lift twice - once for strength, once for volume - with carefully spaced accessories that bulletproof the joints and grow the prime movers.",
    whoItsFor: [
      "Lifters with at least a year of squat / bench / deadlift practice",
      "Athletes preparing for a first meet or a PR retest",
      "Anyone who wants their lifts to actually move again",
    ],
    whatYouGet: [
      "12 weeks of DUP with autoregulated top sets",
      "RPE-based loading prescription",
      "Detailed warm-up and bar speed cues",
      "Peak week + meet-day plan",
    ],
    nutrition:
      "Slight surplus (+150-300 kcal). Protein at 0.9-1 g/lb. Keep carbs high on heavy days. Hydration and sodium drive bar speed more than people admit.",
    supplementation:
      "Creatine (5 g), caffeine 200 mg pre, electrolytes intra-workout, and collagen + vitamin C 30 min pre-training for connective tissue.",
    recovery:
      "Hard squat and pull days demand 8+ hours of sleep. Schedule a real deload at weeks 4 and 8. Avoid heavy conditioning the day before main lifts.",
    trainingOverview:
      "Heavy Squat Monday, Heavy Bench Tuesday, Heavy Deadlift Thursday, Volume Bench Friday. Each session opens with the main lift, then 2-3 directly supportive accessories.",
    progression:
      "Weeks 1-3 base at RPE 7. Weeks 4-7 climb to RPE 8.5 on top sets. Weeks 8-10 introduce singles at RPE 9. Week 11 peaks. Week 12 deload + test.",
    weeklySchedule: [
      { day: "Monday", session: "Heavy Squat + Accessories" },
      { day: "Tuesday", session: "Heavy Bench + Triceps" },
      { day: "Wednesday", session: "Mobility / Zone 2" },
      { day: "Thursday", session: "Heavy Deadlift + Back" },
      { day: "Friday", session: "Volume Bench + Shoulders" },
      { day: "Saturday", session: "Optional GPP" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Heavy Squat",
        focus: "Max strength",
        exercises: [
          {
            name: "Back Squat",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8 on final set)",
            rest: "3 min",
          },
          { name: "Pause Squat", sets: "3", reps: "5", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "8 / leg", rest: "90 sec" },
          { name: "Leg Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Heavy Bench",
        focus: "Bench + triceps",
        exercises: [
          {
            name: "Barbell Bench Press",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8 on final set)",
            rest: "3 min",
          },
          { name: "Close-Grip Bench Press", sets: "3", reps: "6", rest: "2 min" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Heavy Deadlift",
        focus: "Posterior chain",
        exercises: [
          {
            name: "Deadlift",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8 on final set)",
            rest: "3 min",
          },
          { name: "Deficit Deadlift", sets: "3", reps: "5", rest: "2 min" },
          { name: "Barbell Row", sets: "4", reps: "6", rest: "2 min" },
          { name: "Weighted Pull Up", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Back Extension", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Weighted Plank", sets: "3", reps: "30 sec", rest: "60 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Volume Bench + Shoulders",
        focus: "Hypertrophy for pressers",
        exercises: [
          { name: "Barbell Bench Press", sets: "5", reps: "8 @ RPE 7", rest: "2 min" },
          { name: "Seated Dumbbell Shoulder Press", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
    faqs: [
      {
        question: "I don't compete - is RPE still worth using?",
        answer:
          "Yes. RPE autoregulates loads to how recovered you actually are, which is far more honest than a fixed percentage.",
      },
    ],
  },
  {
    slug: "shredded-8-week-fat-loss",
    title: "Shredded: 8-Week Fat Loss Engine",
    tagline: "Lift heavy. Move often. Watch the mirror change.",
    category: "Fat Loss",
    level: "Intermediate",
    duration: "8 Weeks",
    daysPerWeek: 6,
    goal: "Drop body fat, keep muscle",
    image: programFatloss,
    reads: "27.9K",
    comments: 33,
    summary:
      "An 8-week fat-loss protocol built around six hard sessions a week. Every day combines a big lift with a full-body finisher so you burn, pump, and sweat in under 60 minutes. Weeks 1 & 2 use two different templates and then repeat (W3 = W1, W4 = W2 …) with progressive overload each cycle.",
    whoItsFor: [
      "Anyone wanting visible fat loss in under two months",
      "Lifters dealing with a stalled cut",
      "People who want intense, short sessions - not endless cardio",
    ],
    whatYouGet: [
      "6 hard sessions per week - only Sunday is a light walk",
      "Full-body finishers on every day (cable flies, arm supersets, sled, ropes)",
      "2-week rotation that alternates volume and density blocks",
      "Progressive overload built into every repeat cycle",
    ],
    nutrition:
      "Target a 400-600 kcal deficit. Protein at 1 g/lb minimum, fiber at 30+ g, water at 0.5 oz per lb. Schedule one higher-carb day per week to support training output.",
    supplementation:
      "Caffeine for training, creatine for output, whey for protein gaps, and a multivitamin. Skip fat burners - they don't burn fat.",
    recovery:
      "Walking volume (8-12k steps) matters more than the conditioning sessions. Sleep is the single biggest variable for adherence.",
    trainingOverview:
      "Six sessions a week: Push, Pull, Conditioning A, Legs, Full-Body Pump, Conditioning B. Every strength day ends with a metabolic finisher (fly burnout, arm combo, sled sprint). Sessions cap at 55 minutes so intensity stays high.",
    progression:
      "Weeks 1-2 are the base templates. W3 repeats W1 with +2.5% on main lifts and -5 sec on intervals. W4 repeats W2 with the same jump. W5-6 add a top set. W7-8 push AMRAP finishers to failure. Week 4 mid-cycle refeed, Week 8 body-comp checkpoint.",
    weeklySchedule: [
      { day: "Monday", session: "Push Strength + Chest Fly Burnout" },
      { day: "Tuesday", session: "Pull Strength + Biceps Combo" },
      { day: "Wednesday", session: "Conditioning A - Bike + Carries + KB" },
      { day: "Thursday", session: "Legs Strength + Full-Body Finisher" },
      { day: "Friday", session: "Full-Body Pump / MetCon" },
      { day: "Saturday", session: "Conditioning B - Sled + Ropes + Slams" },
      { day: "Sunday", session: "Optional - Zone-2 walk / mobility" },
    ],
    workouts: [
      // ============ WEEK 1 - VOLUME BLOCK ============
      {
        day: "Week 1 · Day 1",
        title: "Push + Chest Fly Burnout",
        focus: "Chest, shoulders, triceps · finisher pump",
        exercises: [
          { name: "- Main Strength", sets: "", reps: "", rest: "" },
          { name: "Barbell Bench Press", sets: "4", reps: "6-8", rest: "120 sec" },
          { name: "Standing Overhead Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10", rest: "75 sec" },
          { name: "- Finisher - Fly Burnout", sets: "", reps: "", rest: "" },
          { name: "Cable Chest Fly", sets: "3", reps: "15", rest: "30 sec" },
          { name: "Tricep Rope Pushdown", sets: "3", reps: "15", rest: "30 sec" },
          { name: "Push-Up (to failure)", sets: "2", reps: "AMRAP", rest: "45 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 1 · Day 2",
        title: "Pull + Biceps Combo",
        focus: "Back, rear delts, biceps · dense supersets",
        exercises: [
          { name: "- Main Strength", sets: "", reps: "", rest: "" },
          { name: "Barbell Deadlift", sets: "4", reps: "5", rest: "150 sec" },
          { name: "Pull-Up (or Lat Pulldown)", sets: "4", reps: "8-10", rest: "90 sec" },
          { name: "Dumbbell Row", sets: "3", reps: "10/side", rest: "75 sec" },
          { name: "- Finisher - Arm Combo", sets: "", reps: "", rest: "" },
          { name: "Hammer Curl", sets: "3", reps: "12", rest: "30 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "30 sec" },
          { name: "Barbell 21s", sets: "2", reps: "21", rest: "60 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 1 · Day 3",
        title: "Conditioning A - Engine + Grip",
        focus: "Full-body sweat · 25 min cap",
        exercises: [
          { name: "Assault Bike Intervals", sets: "8", reps: "20 sec on / 40 sec off", rest: "-" },
          { name: "Farmer Carry", sets: "4", reps: "40 m", rest: "60 sec" },
          { name: "Kettlebell Swing", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Hollow Hold", sets: "3", reps: "30 sec", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 1 · Day 4",
        title: "Legs Strength + Full-Body Finisher",
        focus: "Quads, hamstrings, glutes · burpee closer",
        exercises: [
          { name: "- Main Strength", sets: "", reps: "", rest: "" },
          { name: "Back Squat", sets: "4", reps: "6-8", rest: "150 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Walking Lunge", sets: "3", reps: "12/leg", rest: "75 sec" },
          { name: "- Finisher - MetCon", sets: "", reps: "", rest: "" },
          { name: "Burpee to Broad Jump", sets: "4", reps: "8", rest: "45 sec" },
          { name: "Plank", sets: "3", reps: "45 sec", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 1 · Day 5",
        title: "Full-Body Pump - Chest / Back / Arms",
        focus: "Superset circuit · 45 min sweat",
        exercises: [
          {
            name: "- Superset A · 3 rounds (do both exercises back-to-back, then rest 60 sec, repeat 3x)",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Incline Dumbbell Press", sets: "3", reps: "12", rest: "10 sec" },
          { name: "Dumbbell Row", sets: "3", reps: "12/side", rest: "60 sec" },
          {
            name: "- Superset B · 3 rounds (do both exercises back-to-back, then rest 60 sec, repeat 3x)",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Cable Chest Fly", sets: "3", reps: "15", rest: "10 sec" },
          { name: "Cable Face Pull", sets: "3", reps: "15", rest: "45 sec" },
          {
            name: "- Arm Finisher · 3 rounds (do both exercises back-to-back, then rest 45 sec, repeat 3x)",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Barbell Curl", sets: "3", reps: "12", rest: "10 sec" },
          { name: "Tricep Rope Pushdown", sets: "3", reps: "15", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 1 · Day 6",
        title: "Conditioning B - Sled + Ropes",
        focus: "Anaerobic burn · 22 min cap",
        exercises: [
          { name: "Sled Push", sets: "6", reps: "20 m heavy", rest: "60 sec" },
          { name: "Battle Ropes", sets: "5", reps: "30 sec on / 30 sec off", rest: "-" },
          { name: "Wall Ball", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Bicycle Crunches Easy", sets: "3", reps: "20/side", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      // ============ WEEK 2 - DENSITY BLOCK ============
      {
        day: "Week 2 · Day 1",
        title: "Push Density - Bench 5x5 + Fly Combo",
        focus: "Heavier chest, tris · shorter rest",
        exercises: [
          { name: "- Main Strength", sets: "", reps: "", rest: "" },
          { name: "Barbell Bench Press", sets: "5", reps: "5", rest: "120 sec" },
          { name: "Close Grip Bench Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Standing Overhead Press", sets: "3", reps: "6", rest: "90 sec" },
          { name: "- Finisher - Chest / Tri Density", sets: "", reps: "", rest: "" },
          { name: "Cable Chest Fly", sets: "4", reps: "12", rest: "30 sec" },
          { name: "Tricep Rope Pushdown", sets: "4", reps: "12", rest: "30 sec" },
          { name: "Dip", sets: "2", reps: "AMRAP", rest: "60 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 2 · Day 2",
        title: "Pull Density - Deadlift 5x3 + Back/Biceps",
        focus: "Max effort pull · heavy back day",
        exercises: [
          { name: "- Main Strength", sets: "", reps: "", rest: "" },
          { name: "Barbell Deadlift", sets: "5", reps: "3", rest: "180 sec" },
          { name: "Pull-Up (Weighted if possible)", sets: "4", reps: "6", rest: "120 sec" },
          { name: "Chest Supported Row", sets: "3", reps: "10", rest: "75 sec" },
          { name: "- Finisher - Biceps Density", sets: "", reps: "", rest: "" },
          { name: "Barbell Curl", sets: "4", reps: "8", rest: "45 sec" },
          { name: "Hammer Curl", sets: "3", reps: "10", rest: "30 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 2 · Day 3",
        title: "Conditioning A - Row + KB Ladder",
        focus: "Anaerobic threshold · 25 min cap",
        exercises: [
          { name: "Rowing Machine", sets: "6", reps: "500 m / 90 sec rest", rest: "90 sec" },
          { name: "Kettlebell Swing", sets: "5", reps: "20", rest: "45 sec" },
          { name: "Push-Up", sets: "4", reps: "AMRAP", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 2 · Day 4",
        title: "Legs Power + Sled Finisher",
        focus: "Speed strength · burn out with sprints",
        exercises: [
          { name: "- Main Strength", sets: "", reps: "", rest: "" },
          { name: "Front Squat", sets: "5", reps: "5", rest: "150 sec" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "8/leg", rest: "90 sec" },
          { name: "Barbell Hip Thrust", sets: "3", reps: "10", rest: "75 sec" },
          { name: "- Finisher - Sled Sprint", sets: "", reps: "", rest: "" },
          { name: "Sled Push", sets: "5", reps: "15 m sprint", rest: "60 sec" },
          { name: "Side Plank", sets: "3", reps: "30 sec/side", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 2 · Day 5",
        title: "Full-Body MetCon Complex",
        focus: "Dumbbell complex · 40 min sweat storm",
        exercises: [
          {
            name: "- Complex A · 5 rounds (all 4 moves in a row = 1 round, rest 90 sec after, repeat 5x)",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Dumbbell Thruster", sets: "5", reps: "10", rest: "10 sec" },
          { name: "Dumbbell Row", sets: "5", reps: "10/side", rest: "10 sec" },
          { name: "Hammer Curl", sets: "5", reps: "10", rest: "10 sec" },
          { name: "Standing Overhead Press", sets: "5", reps: "10", rest: "90 sec" },
          { name: "- Finisher", sets: "", reps: "", rest: "" },
          { name: "Burpee to Broad Jump", sets: "3", reps: "10", rest: "45 sec" },
          { name: "Flutter Kicks", sets: "3", reps: "30 sec", rest: "30 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
      {
        day: "Week 2 · Day 6",
        title: "Conditioning B - Triathlon + Slams",
        focus: "Bike / row / ski + core · 24 min cap",
        exercises: [
          {
            name: "Assault Bike Intervals",
            sets: "4",
            reps: "60 sec hard / 60 sec easy",
            rest: "-",
          },
          { name: "Rowing Machine", sets: "4", reps: "60 sec hard / 60 sec easy", rest: "-" },
          { name: "Wall Ball", sets: "4", reps: "12", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "45 sec" },
          { name: "- Optional Cool-Down", sets: "", reps: "", rest: "" },
          { name: "Treadmill Walk", sets: "1", reps: "10-15 min", rest: "-" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a gym?",
        answer:
          "A commercial gym makes it easier, but every session has dumbbell-only substitutions inside the Onyx app.",
      },
      {
        question: "Why do Weeks 3-8 look like Weeks 1-2?",
        answer:
          "The plan runs a 2-week rotation on purpose. W3 = W1 + progressive overload, W4 = W2 + progressive overload, and so on. Same movements, heavier loads, shorter rests - that's how fat-loss training actually works.",
      },
    ],
  },
  {
    slug: "garage-built-home-training",
    title: "Garage Built: 6-Week Home Training Stack",
    tagline: "Two dumbbells, a band, a doorway. No excuses.",
    category: "Home Training",
    level: "Beginner",
    duration: "6 Weeks",
    daysPerWeek: 4,
    goal: "Maintain strength, build conditioning",
    image: programHomeGarage,
    reads: "18.5K",
    comments: 22,
    summary:
      "A six-week home plan that respects how little equipment most people actually own. Each session pairs a strength block with a metabolic finisher, all in 35 minutes or less.",
    whoItsFor: [
      "Anyone training from a small home setup",
      "Frequent travelers who want a portable plan",
      "Parents working around tight time windows",
    ],
    whatYouGet: [
      "4 sessions per week, 35 minutes each",
      "Tempo prescriptions to amplify light loads",
      "Resistance band substitutions for every lift",
      "Optional 10-minute mobility add-on",
    ],
    nutrition: "Maintenance kcal, protein 0.8 g/lb, plenty of vegetables. Keep it simple.",
    supplementation: "Creatine + whey is enough for this block.",
    recovery:
      "Two rest days per week. Walking on rest days speeds recovery without taxing the joints.",
    trainingOverview:
      "Upper / Lower / Conditioning / Full Body, repeated weekly. Tempo and unilateral work make light dumbbells feel heavy.",
    progression:
      "Add one rep per set per week. Week 4 swaps to slower tempos. Week 6 retests reps at week-1 weights.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Body Dumbbell" },
      { day: "Tuesday", session: "Lower Body + Bands" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Conditioning Circuit" },
      { day: "Friday", session: "Full Body Strength" },
      { day: "Saturday", session: "Optional Mobility" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Body Dumbbell",
        focus: "Push / Pull",
        exercises: [
          { name: "DB Floor Press", sets: "4", reps: "10", rest: "60 sec" },
          { name: "1-Arm DB Row", sets: "3", reps: "10/side", rest: "60 sec" },
          { name: "DB Z-Press", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Band Pull-Apart", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Push-Up Finisher", sets: "2", reps: "AMRAP", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Body + Bands",
        focus: "Squat, hinge and glute work with dumbbells and loop bands",
        exercises: [
          { name: "Goblet Squat (slow 3-sec eccentric)", sets: "4", reps: "10", rest: "75 sec" },
          { name: "DB Romanian Deadlift", sets: "4", reps: "10", rest: "75 sec" },
          { name: "Reverse Lunge (DB in each hand)", sets: "3", reps: "10/leg", rest: "60 sec" },
          { name: "Banded Glute Bridge", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Banded Side Steps", sets: "3", reps: "15/side", rest: "45 sec" },
          { name: "Standing Calf Raise (DB)", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Conditioning Circuit",
        focus: "EMOM 20 min · one movement per minute, rest the remainder",
        exercises: [
          { name: "Burpees", sets: "5", reps: "10", rest: "-" },
          { name: "DB Thrusters", sets: "5", reps: "10", rest: "-" },
          { name: "Push Ups", sets: "5", reps: "12", rest: "-" },
          { name: "Mountain Climbers", sets: "5", reps: "30 sec", rest: "-" },
        ],
      },
      {
        day: "Day 5",
        title: "Full Body Strength",
        focus: "Compound-heavy circuit, longer rest",
        exercises: [
          { name: "Goblet Squat", sets: "4", reps: "8", rest: "90 sec" },
          { name: "DB Floor Press", sets: "4", reps: "8", rest: "90 sec" },
          { name: "1-Arm DB Row", sets: "4", reps: "10/side", rest: "60 sec" },
          { name: "DB Romanian Deadlift", sets: "3", reps: "10", rest: "75 sec" },
          { name: "DB Z-Press", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Hanging Leg Raise (or Reverse Crunch)", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
    faqs: [
      {
        question: "What dumbbell weights do I need?",
        answer:
          "One light pair (10-20 lb) and one moderate pair (25-40 lb) covers everything. Adjustables work even better.",
      },
    ],
  },
  {
    slug: "classic-physique-bodybuilding",
    title: "Classic Physique: 10-Week Bodybuilding Block",
    tagline: "Old-school splits. Modern volume science. Real growth.",
    category: "Bodybuilding",
    level: "Advanced",
    duration: "10 Weeks",
    daysPerWeek: 6,
    goal: "Sculpted, balanced physique",
    image: programBodybuilding,
    reads: "29.8K",
    comments: 47,
    summary:
      "A six-day bro-split rebuilt with current evidence on volume, frequency, and effective reps. Each muscle group gets two stimulating exposures per week - one heavy, one pump - so you grow without joints crying.",
    whoItsFor: [
      "Lifters with 2+ years of training",
      "Anyone prepping for a physique photoshoot",
      "Athletes wanting the bro-split feel with smart programming",
    ],
    whatYouGet: [
      "10 weeks of dual-frequency split programming",
      "Built-in pre-exhaust and stretch-mediated sets",
      "Photo-day peak protocol",
      "Posing and conditioning notes",
    ],
    nutrition: "Lean bulk, 250-500 kcal surplus, protein 1 g/lb, carbs around training.",
    supplementation: "Creatine, whey, EAAs intra (optional), citrulline pre, magnesium at night.",
    recovery: "One rest day, deload at week 5, prioritize sleep over everything else.",
    trainingOverview:
      "Chest / Back / Legs / Shoulders+Arms / Weak Point / Pump Day. The first four are heavy. Day 5 hammers your lagging muscle. Day 6 is pure pump.",
    progression:
      "Add one rep per set weekly. After 4 weeks, add a set to your top exercise. Deload at week 5, repeat through week 10.",
    weeklySchedule: [
      { day: "Monday", session: "Chest" },
      { day: "Tuesday", session: "Back" },
      { day: "Wednesday", session: "Legs" },
      { day: "Thursday", session: "Shoulders + Arms" },
      { day: "Friday", session: "Weak Point" },
      { day: "Saturday", session: "Full Body Pump" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Monday",
        title: "Chest",
        focus: "Heavy compounds + cable flyes",
        exercises: [
          { name: "Incline Barbell Press", sets: "4", reps: "6-8", rest: "2 min" },
          { name: "Flat Dumbbell Press", sets: "3", reps: "8-10", rest: "90 sec" },
          { name: "Chest Press Machine", sets: "3", reps: "10-12", rest: "90 sec" },
          { name: "Low Cable Chest Fly", sets: "3", reps: "12-15", rest: "60 sec" },
          { name: "Dumbbell Chest Fly", sets: "3", reps: "12-15", rest: "60 sec" },
          { name: "Pec Deck Machine", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Tuesday",
        title: "Back",
        focus: "Width + thickness",
        exercises: [
          { name: "Weighted Pull Up", sets: "4", reps: "6-8", rest: "2 min" },
          { name: "Chest-Supported Row Machine", sets: "4", reps: "8-10", rest: "90 sec" },
          { name: "Lat Pull Down", sets: "3", reps: "10-12", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "10-12", rest: "60 sec" },
          { name: "Straight-Arm Cable Pullover", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Wednesday",
        title: "Legs",
        focus: "Quad + posterior chain",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "6-8", rest: "3 min" },
          { name: "Hack Squat Machine", sets: "3", reps: "10", rest: "2 min" },
          { name: "Leg Press", sets: "3", reps: "12", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "2 min" },
          { name: "Seated Leg Curl", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Leg Extension", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Thursday",
        title: "Shoulders + Arms",
        focus: "Delts + sleeves",
        exercises: [
          { name: "Seated Dumbbell Shoulder Press", sets: "4", reps: "8", rest: "2 min" },
          { name: "Cable Lateral Raise", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Rear Delt Fly Machine", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Preacher Curl", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Cable Hammer Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Friday",
        title: "Weak Point",
        focus: "Pick your lagging area, extra volume, machines only",
        exercises: [
          { name: "Chest Press Machine", sets: "4", reps: "10", rest: "75 sec" },
          { name: "Low Cable Chest Fly", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Seated Cable Row", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Leg Extension", sets: "4", reps: "15", rest: "60 sec" },
          { name: "Seated Leg Curl", sets: "4", reps: "15", rest: "60 sec" },
        ],
      },
      {
        day: "Saturday",
        title: "Full Body Pump",
        focus: "Cables + machines, short rest",
        exercises: [
          { name: "Middle Cable Chest Fly", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Lat Pull Down", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Cable Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Leg Press", sets: "3", reps: "15", rest: "60 sec" },
          { name: "Cable Curl", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
    ],
    faqs: [
      {
        question: "Six days is a lot - can I run five?",
        answer:
          "Yes. Merge Day 5 and Day 6 into a single weak-point + pump session and take Sunday off.",
      },
    ],
  },
  {
    slug: "first-rep-beginner-strength",
    title: "First Rep: 8-Week Beginner Strength",
    tagline: "Master the big lifts. Build the body that earns them.",
    category: "Beginner",
    level: "Beginner",
    duration: "8 Weeks",
    daysPerWeek: 3,
    goal: "Foundational strength + form",
    image: programBeginnerFirstRepAsset.url,
    reads: "41.7K",
    comments: 56,
    summary:
      "A three-day full-body program built on the squat, bench, deadlift, and overhead press. Linear progression, careful warm-ups, and accessory work that protects the lower back and shoulders.",
    whoItsFor: [
      "Anyone in their first year of lifting",
      "Returners coming back after months off",
      "People intimidated by complicated splits",
    ],
    whatYouGet: [
      "3 sessions per week, 50 minutes each",
      "Linear loading with video form cues",
      "Two simple accessory finishers",
      "First-deload trigger explained",
    ],
    nutrition: "Maintenance to slight surplus, protein at 0.8 g/lb, lots of whole foods.",
    supplementation: "Creatine + whey. That's it.",
    recovery: "Two rest days minimum. Add walks. Sleep 8 hours.",
    trainingOverview:
      "Three full-body days alternating between Workout A and Workout B every other session.",
    progression:
      "Add 5 lb to lower-body lifts and 2.5 lb to upper-body lifts every session until a failed rep. Then deload 10% and continue.",
    weeklySchedule: [
      { day: "Monday", session: "Workout A" },
      { day: "Tuesday", session: "Rest / Walk" },
      { day: "Wednesday", session: "Workout B" },
      { day: "Thursday", session: "Rest / Walk" },
      { day: "Friday", session: "Workout A" },
      { day: "Saturday", session: "Rest" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Workout A",
        title: "Full Body A",
        focus: "Squat focus",
        exercises: [
          { name: "Back Squat", sets: "3", reps: "5", rest: "3 min" },
          { name: "Bench Press", sets: "3", reps: "5", rest: "2-3 min" },
          { name: "Barbell Row", sets: "3", reps: "5", rest: "2 min" },
          { name: "Plank", sets: "3", reps: "30-45 sec", rest: "60 sec" },
        ],
      },
      {
        day: "Workout B",
        title: "Full Body B",
        focus: "Pull focus",
        exercises: [
          { name: "Back Squat", sets: "3", reps: "5", rest: "3 min" },
          { name: "Overhead Press", sets: "3", reps: "5", rest: "2-3 min" },
          { name: "Deadlift", sets: "1", reps: "5", rest: "-" },
          { name: "Chin-Up (assisted ok)", sets: "3", reps: "AMRAP", rest: "90 sec" },
        ],
      },
    ],
    faqs: [
      {
        question: "I can't squat to depth yet.",
        answer:
          "Box squat to a bench, then progressively lower the box. Mobility comes with practice.",
      },
    ],
  },
];

// ------------------------------------------------------------
// Lightweight builder for the additional programs below.
// Keeps the file readable while filling out every category.
// ------------------------------------------------------------
type NewProg = Partial<Program> &
  Pick<
    Program,
    | "slug"
    | "title"
    | "tagline"
    | "category"
    | "level"
    | "duration"
    | "daysPerWeek"
    | "goal"
    | "image"
    | "summary"
    | "weeklySchedule"
    | "workouts"
  >;

// ------------------------------------------------------------
// Week-2 variation engine
// Week 2 is NOT a copy of Week 1. Each day gets a different
// "wave" (strength / volume / density / set-progression /
// tempo) so the same body part is hit from a new angle, and
// one exercise per day is swapped for a related variation
// from the Onyx library.
// ------------------------------------------------------------

// Swap map: Week-1 exercise -> a smart Week-2 alternative that
// targets the same pattern with a fresh stimulus.
const WEEK2_SWAPS: Record<string, string> = {
  // ----- Squat / hinge patterns -----
  "Goblet Squat": "Front Squat",
  "Back Squat": "Front Squat",
  "Back Squat Backoffs": "Pause Squat Backoffs",
  "Front Squat": "Back Squat",
  Deadlift: "Deficit Deadlift",
  "Deadlift Backoffs": "Romanian Deadlift",
  "Romanian Deadlift": "Single-Leg Romanian Deadlift",
  "Leg Press": "Bulgarian Split Squat",
  "Walking Lunge": "Reverse Lunge",
  "Bulgarian Split Squat": "Walking Lunge",
  "Standing Calf Raise": "Seated Calf Raise",
  "Glute Bridge": "Single-Leg Glute Bridge",

  // ----- Press patterns -----
  "Dumbbell Bench Press": "Incline Dumbbell Press",
  "Flat Dumbbell Press": "Cable Chest Fly",
  "Barbell Bench Press": "Incline Barbell Press",
  "Bench Press Backoffs": "Spoto Press Backoffs",
  "Incline Barbell Press": "Incline Dumbbell Press",
  "Incline Dumbbell Press": "Decline Dumbbell Press",
  "Close-Grip Bench Press": "Dips",
  "Push Ups": "Decline Push Ups",
  "Seated Barbell Press": "Standing Overhead Press",
  "Seated Dumbbell Shoulder Press": "Arnold Press",
  "Cable Lateral Raise": "Dumbbell Lateral Raise",
  "Overhead Rope Triceps": "Triceps Pushdown",

  // ----- Pull / row patterns -----
  "One-Arm Row": "Chest-Supported Row",
  "Chest-Supported Row": "Seated Cable Row",
  "Seated Cable Row": "Bent-Over Barbell Row",
  "Barbell Row": "Pendlay Row",
  "Lat Pull Down": "Pull Ups",
  "Pull Ups": "Lat Pull Down",
  "Preacher Curl": "Hammer Curl",
  "Face Pulls": "Rear Delt Fly",

  // ----- Core -----
  Plank: "Side Plank",
  "Hanging Leg Raise": "Hanging Knee Raise",

  // ----- Conditioning / Hyrox / CrossFit -----
  "Air Squats": "Jump Squats",
  "Box Jumps": "Broad Jumps",
  "Wall Balls": "Thrusters",
  "Farmer Carry": "Suitcase Carry",
  Burpees: "Burpee Broad Jump",
  "Burpee Broad Jump": "Burpees",
  "Assault Bike Intervals": "Rowing Machine Intervals",
  "Rowing Machine Intervals": "Assault Bike Intervals",
  "Rowing Machine": "Assault Bike",
  "Battle Rope Slams": "Medicine Ball Slams",
  "Sled Push": "Rowing Machine",
  "Treadmill Run": "Outdoor Run",
  "Treadmill Run (Zone 3)": "Treadmill Run (Zone 4)",
  Strides: "Hill Sprints",
};

const bumpReps = (reps: string, delta: number): string => {
  const m = reps.match(/^(\d+)(?:[--](\d+))?(.*)$/);
  if (!m) return reps;
  const a = Math.max(1, Number(m[1]) + delta);
  if (m[2]) return `${a}-${Math.max(a + 1, Number(m[2]) + delta)}${m[3]}`;
  return `${a}${m[3]}`;
};

const bumpSets = (sets: string, delta: number): string => {
  const n = Number(sets);
  if (!Number.isFinite(n)) return sets;
  return String(Math.max(1, n + delta));
};

const trimRest = (rest: string, secondsDelta: number): string => {
  if (!rest || rest === "-") return rest;
  const sec = rest.match(/^(\d+)\s*sec$/i);
  if (sec) {
    const v = Math.max(20, Number(sec[1]) + secondsDelta);
    return `${v} sec`;
  }
  const min = rest.match(/^(\d+(?:\.\d+)?)\s*min$/i);
  if (min) {
    const totalSec = Math.max(45, Number(min[1]) * 60 + secondsDelta);
    return totalSec >= 60 && totalSec % 60 === 0 ? `${totalSec / 60} min` : `${totalSec} sec`;
  }
  return rest;
};

type WaveKey = "strength" | "volume" | "density" | "progress" | "tempo";
const DAY_WAVES: WaveKey[] = ["strength", "volume", "density", "progress", "tempo"];
const WAVE_FOCUS: Record<WaveKey, string> = {
  strength: "Heavier · lower reps",
  volume: "Volume push · +reps",
  density: "Density · shorter rest",
  progress: "+1 set progression",
  tempo: "Tempo finisher",
};

const applyWave = (
  exercises: { name: string; sets: string; reps: string; rest: string }[],
  wave: WaveKey,
) => {
  // Week 2 swaps EVERY mapped exercise so the session feels genuinely new -
  // same body part, same day theme, fresh stimulus from the Onyx library.
  return exercises.map((ex) => {
    const swappedName = WEEK2_SWAPS[ex.name] ?? ex.name;
    let { sets, reps, rest } = ex;
    switch (wave) {
      case "strength":
        reps = bumpReps(reps, -2);
        sets = bumpSets(sets, +1);
        break;
      case "volume":
        reps = bumpReps(reps, +2);
        break;
      case "density":
        reps = bumpReps(reps, +1);
        rest = trimRest(rest, -15);
        break;
      case "progress":
        sets = bumpSets(sets, +1);
        reps = bumpReps(reps, -1);
        break;
      case "tempo":
        reps = bumpReps(reps, +1);
        rest = trimRest(rest, -10);
        break;
    }
    return { ...ex, name: swappedName, sets, reps, rest };
  });
};

const buildProgram = (p: NewProg): Program => {
  let workouts = p.workouts ?? [];
  let weeklySchedule = p.weeklySchedule ?? [];
  return {
    reads: "-",
    comments: 0,
    whoItsFor: [
      "Lifters who want a clear plan with zero guesswork",
      "Athletes returning from a layoff or chasing a new PR",
      "Anyone tired of stitching together random YouTube workouts",
    ],
    whatYouGet: [
      "Full week-by-week progression",
      "Every session with sets, reps and rest",
      "Substitutions from the Onyx exercise library",
      "Nutrition, supplementation and recovery guidance",
    ],
    nutrition:
      "Hit a daily protein target of 0.8-1 g per pound of bodyweight, anchor meals around whole-food carbs, and stay within ±300 kcal of the goal (surplus, maintenance or deficit) for the duration of the block.",
    supplementation:
      "Creatine monohydrate (5 g/day), a quality whey or plant protein to backfill daily protein, electrolytes around training, and vitamin D3 + magnesium for recovery.",
    recovery:
      "Sleep 7-9 hours, walk 8-10k steps/day, protect one true rest day, and reduce intensity any week sleep or stress fall off a cliff.",
    trainingOverview:
      "Sessions pair the highest-return compound from the Onyx library with focused accessory work. Volume rises in waves and deloads on schedule so nothing breaks down.",
    progression:
      "Weeks 1-2 build technique and baseline loads. Mid-block (weeks 3-5) progressively overload top sets. Final weeks intensify, then deload + retest in the closing week.",
    faqs: [
      {
        question: "Can I move sessions around to fit my schedule?",
        answer:
          "Yes - keep the order of training days but swap which calendar day they land on. Avoid stacking the two hardest sessions back-to-back.",
      },
      {
        question: "What if I miss a workout?",
        answer:
          "Slide the week back by one day rather than doubling up. Recovery is the variable that creates progress.",
      },
    ],
    includes: [
      `${p.duration} of programming`,
      `${p.daysPerWeek}× sessions per week`,
      "Every exercise wired to a video walkthrough",
      "Nutrition, supplementation & recovery guide",
      "Lifetime updates inside the Onyx app",
    ],
    isFree: false,
    price: PREMIUM_PRICE,
    ...p,
    workouts,
    weeklySchedule,
  };
};

// ------------------------------------------------------------
// FREE - 1 WEEK SAMPLERS (one per major category)
// Each sampler is a single week pulled straight from the Onyx
// library so users can try the system before purchasing.
// ------------------------------------------------------------
const freeSamplers: Program[] = [
  buildProgram({
    slug: "free-beginner-1-week",
    title: "Free 1-Week Beginner Sampler",
    tagline: "Three full-body sessions to test the Onyx method - no cost.",
    category: "Beginner",
    level: "Beginner",
    duration: "1 Week",
    daysPerWeek: 3,
    goal: "Learn the lifts, feel the system",
    image: programBeginner,
    summary:
      "A full-body intro week built on the squat, bench, deadlift and row. Use it to learn the Onyx programming style before committing to the full 8-week plan.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Full Body A" },
      { day: "Tuesday", session: "Rest / Walk" },
      { day: "Wednesday", session: "Full Body B" },
      { day: "Thursday", session: "Rest / Walk" },
      { day: "Friday", session: "Full Body C" },
      { day: "Saturday", session: "Rest" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Full Body A",
        focus: "Squat focus",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "8-10", rest: "20 sec" },
          { name: "Dumbbell Bench Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "One-Arm Row", sets: "3", reps: "10/side", rest: "2 min" },
          { name: "V-Up", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Full Body B",
        focus: "Hinge focus",
        exercises: [
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Push Ups", sets: "3", reps: "AMRAP", rest: "90 sec" },
          { name: "Lat Pull Down", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Full Body C",
        focus: "Overhead + lunge",
        exercises: [
          { name: "Standing Overhead Press", sets: "3", reps: "8", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Standing Calf Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-bodybuilding-1-week",
    title: "Free 1-Week Bodybuilding Sampler",
    tagline: "Push, Pull, Legs - one week of pure hypertrophy on us.",
    category: "Bodybuilding",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 3,
    goal: "Pump, growth, mind-muscle",
    image: programBodybuilding,
    summary:
      "Three sessions of classic Push / Pull / Legs work pulled from the Onyx library. A quick taste of the 10-week Classic Physique program.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Push" },
      { day: "Tuesday", session: "Rest" },
      { day: "Wednesday", session: "Pull" },
      { day: "Thursday", session: "Rest" },
      { day: "Friday", session: "Legs" },
      { day: "Saturday", session: "Optional Pump" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Push",
        focus: "Chest / Shoulders / Triceps",
        exercises: [
          { name: "Incline Barbell Press", sets: "4", reps: "8", rest: "2 min" },
          { name: "Flat Dumbbell Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Lateral Raise", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Pull",
        focus: "Back / Biceps",
        exercises: [
          { name: "Lat Pull Down", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Chest-Supported Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "60 sec" },
          { name: "Preacher Curl", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Legs",
        focus: "Quad + posterior",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "8", rest: "3 min" },
          { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "2 min" },
          { name: "Leg Press", sets: "3", reps: "12", rest: "90 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-powerlifting-1-week",
    title: "Free 1-Week Powerlifting Sampler",
    tagline: "Squat, bench and pull - one week of the Raw Power method.",
    category: "Powerlifting",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Feel the DUP system",
    image: programPowerlifting,
    summary:
      "Four sessions hitting each main lift with a strength and a volume exposure - the same pattern the full 12-week Raw Power block uses.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Heavy Squat" },
      { day: "Tuesday", session: "Heavy Bench" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Heavy Deadlift" },
      { day: "Friday", session: "Volume Bench" },
      { day: "Saturday", session: "Rest" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Heavy Squat",
        focus: "Squat + posterior chain",
        exercises: [
          {
            name: "Back Squat",
            sets: "5",
            reps: "5 (add weight when all 5 sets complete)",
            rest: "3 min",
          },
          { name: "Goblet Squat", sets: "3", reps: "6", rest: "2 min" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "8 / leg", rest: "90 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Heavy Bench",
        focus: "Bench + upper body pressing",
        exercises: [
          {
            name: "Barbell Bench Press",
            sets: "5",
            reps: "5 (add weight when all 5 sets complete)",
            rest: "3 min",
          },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8", rest: "2 min" },
          { name: "Close-Grip Bench Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Heavy Deadlift",
        focus: "Pull + back thickness",
        exercises: [
          {
            name: "Deadlift",
            sets: "4",
            reps: "5 (build to top set of 5 across sets)",
            rest: "3 min",
          },
          { name: "Barbell Row", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Pull Up", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Volume Bench",
        focus: "Pump + shoulders",
        exercises: [
          { name: "Dumbbell Bench Press", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-fat-loss-1-week",
    title: "Free 1-Week Fat Loss Sampler",
    tagline: "Lift heavy, condition smart - one week from the Shredded block.",
    category: "Fat Loss",
    level: "Beginner",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Burn fat, keep muscle",
    image: programFatloss,
    summary:
      "One strength day, one conditioning circuit, one full-body finisher. Built to drop body fat without losing the muscle you've earned.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Upper Strength" },
      { day: "Tuesday", session: "Conditioning A" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Lower Strength" },
      { day: "Friday", session: "Full Body Finisher" },
      { day: "Saturday", session: "Walk" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Strength",
        focus: "Push/Pull",
        exercises: [
          { name: "Barbell Bench Press", sets: "4", reps: "6", rest: "2 min" },
          { name: "Lat Pull Down", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Conditioning A",
        focus: "Engine + grip",
        exercises: [
          { name: "Assault Bike Intervals", sets: "8", reps: "20 sec on / 40 sec off", rest: "-" },
          { name: "Farmer Carry", sets: "4", reps: "40 m", rest: "60 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Lower Strength",
        focus: "Squat + hinge",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "6", rest: "3 min" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "90 sec" },
          { name: "Bicycle Crunches Easy", sets: "3", reps: "20/side", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Full Body Finisher",
        focus: "Density circuit",
        exercises: [
          { name: "Goblet Squat", sets: "4", reps: "12", rest: "30 sec" },
          { name: "Push Ups", sets: "4", reps: "AMRAP", rest: "30 sec" },
          { name: "One-Arm Row", sets: "4", reps: "10/side", rest: "30 sec" },
          { name: "Battle Rope Slams", sets: "4", reps: "20 sec", rest: "40 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-hyrox-1-week",
    title: "Free 1-Week Hyrox Sampler",
    tagline: "Run, sled, row - race-prep work for one full week.",
    category: "Hyrox",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Test race readiness",
    image: programFreeHyroxRower,
    summary:
      "A mixed-modal week pulled directly from our Hyrox prep block: running intervals, sled work, rowing pieces and core stability.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Run + Sled" },
      { day: "Tuesday", session: "Strength" },
      { day: "Wednesday", session: "Row + Burpees" },
      { day: "Thursday", session: "Rest" },
      { day: "Friday", session: "Compromised Running" },
      { day: "Saturday", session: "Mixed Race Sim" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Run + Sled + Row",
        focus: "Single-pass stations, move in order, rest as listed",
        exercises: [
          { name: "Treadmill Run (Zone 3)", sets: "1", reps: "1 km", rest: "2 min" },
          { name: "Sled Push (heavy)", sets: "3", reps: "20 m", rest: "90 sec" },
          { name: "Rowing Machine", sets: "1", reps: "500 m", rest: "2 min" },
          { name: "Burpee Broad Jump", sets: "3", reps: "10", rest: "90 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Strength",
        focus: "Race-specific · straight sets",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Back Squat",
            sets: "4",
            reps: "5 @ RPE 7 (add load if last set feels ≤ RPE 6)",
            rest: "2 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "3", reps: "8 @ RPE 7-8", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "20/side", rest: "90 sec" },
          { name: "Farmer Carry", sets: "4", reps: "40 m heavy", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Row + Burpees + Wall Balls",
        focus: "Single-pass stations, move in order",
        exercises: [
          {
            name: "Rowing Machine (500 m @ ~2:00/500 m pace)",
            sets: "1",
            reps: "500 m",
            rest: "2 min",
          },
          { name: "Burpee Broad Jump", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Wall Balls", sets: "3", reps: "15", rest: "90 sec" },
          { name: "Rowing Machine", sets: "1", reps: "500 m", rest: "2 min" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Compromised Running (Race Sim)",
        focus: "For Time · complete in order, rest only where listed",
        exercises: [
          { name: "- 1 Round For Time -", sets: "", reps: "", rest: "" },
          { name: "Treadmill Run", sets: "1", reps: "1 km", rest: "90 sec" },
          { name: "Wall Balls", sets: "1", reps: "30", rest: "90 sec" },
          { name: "Treadmill Run", sets: "1", reps: "1 km", rest: "90 sec" },
          { name: "Sled Push (heavy)", sets: "1", reps: "30 m", rest: "90 sec" },
          { name: "Treadmill Run", sets: "1", reps: "1 km", rest: "-" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-running-1-week",
    title: "Free 1-Week Runner Sampler",
    tagline: "Easy run, tempo, long - taste the Runner Foundations plan.",
    category: "Endurance",
    level: "Beginner",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Build aerobic base",
    image: programRunning,
    summary:
      "One easy run, one tempo, one long run and a runner-specific strength session - the exact pattern of the 8-week 5K build.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Strength for Runners" },
      { day: "Tuesday", session: "Easy Run + Strides" },
      { day: "Wednesday", session: "Mobility / Rest" },
      { day: "Thursday", session: "Tempo Run" },
      { day: "Friday", session: "Rest" },
      { day: "Saturday", session: "Long Run (or Optional Recovery)" },
      { day: "Sunday", session: "Optional Walk / Full Rest" },
    ],
    workouts: [
      {
        day: "Mon",
        title: "Strength for Runners",
        focus: "Single-leg base",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Tue",
        title: "Easy Run + Strides",
        focus: "Zone 2 aerobic",
        exercises: [
          {
            name: "Treadmill Run (Zone 2)",
            sets: "1",
            reps: "30 min (conversational pace)",
            rest: "-",
          },
          {
            name: "Strides",
            sets: "6",
            reps: "20 sec (near full sprint)",
            rest: "60 sec easy jog",
          },
        ],
      },
      {
        day: "Wed",
        title: "Mobility / Full Rest",
        focus: "Recovery",
        exercises: [
          { name: "Treadmill Walk", sets: "1", reps: "20-30 min", rest: "-" },
          { name: "Hip / Calf Mobility", sets: "1", reps: "10 min", rest: "-" },
        ],
      },
      {
        day: "Thu",
        title: "Tempo Run",
        focus: "Threshold",
        exercises: [
          { name: "Treadmill Run (warm-up)", sets: "1", reps: "10 min", rest: "-" },
          {
            name: "Treadmill Run (Zone 3-4)",
            sets: "1",
            reps: "20 min (comfortably hard)",
            rest: "-",
          },
          { name: "Treadmill Run (cooldown)", sets: "1", reps: "10 min", rest: "-" },
        ],
      },
      {
        day: "Fri",
        title: "Rest Day",
        focus: "Full recovery",
        exercises: [{ name: "Treadmill Walk", sets: "1", reps: "20 min", rest: "-" }],
      },
      {
        day: "Sat",
        title: "Long Run",
        focus: "Endurance · Zone 2",
        exercises: [
          {
            name: "Treadmill Run (Zone 2)",
            sets: "1",
            reps: "40-50 min (conversational pace)",
            rest: "-",
          },
        ],
      },
      {
        day: "Sun (Optional)",
        title: "Recovery Walk",
        focus: "Optional · skip if tired",
        exercises: [
          { name: "Treadmill Walk", sets: "1", reps: "30-45 min", rest: "-" },
          { name: "Full Body Stretch", sets: "1", reps: "10 min", rest: "-" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-home-training-1-week",
    title: "Free 1-Week Home Training Sampler",
    tagline: "Two dumbbells, a band - one week to prove you don't need a gym.",
    category: "Home Training",
    level: "Beginner",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Train anywhere",
    image: programBeginner,
    summary:
      "Four short, dense sessions you can run from a bedroom or garage - pulled straight from the Garage Built 6-week block.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Upper Body Dumbbell" },
      { day: "Tuesday", session: "Lower + Bands" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Conditioning Circuit" },
      { day: "Friday", session: "Full Body" },
      { day: "Saturday", session: "Mobility" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Body Dumbbell",
        focus: "Push/Pull",
        exercises: [
          { name: "Dumbbell Bench Press", sets: "4", reps: "10", rest: "60 sec" },
          { name: "One-Arm Row", sets: "3", reps: "10/side", rest: "60 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Push Ups", sets: "2", reps: "AMRAP", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower + Bands",
        focus: "Glutes + quads",
        exercises: [
          { name: "Goblet Squat", sets: "4", reps: "12", rest: "75 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "75 sec" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "60 sec" },
          { name: "Glute Bridge", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Conditioning Circuit",
        focus: "EMOM 20 min",
        exercises: [
          { name: "Burpees", sets: "5", reps: "10", rest: "-" },
          { name: "Goblet Squat", sets: "5", reps: "12", rest: "-" },
          { name: "Push Ups", sets: "5", reps: "12", rest: "-" },
          { name: "Reverse Crunch", sets: "5", reps: "15", rest: "-" },
        ],
      },
      {
        day: "Day 5",
        title: "Full Body",
        focus: "Strength",
        exercises: [
          { name: "Goblet Squat", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Dumbbell Bench Press", sets: "4", reps: "8", rest: "90 sec" },
          { name: "One-Arm Row", sets: "4", reps: "10/side", rest: "90 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-glute-1-week",
    title: "Free 1-Week Glute Builder",
    tagline: "Squat-led glute program with three focused leg days and a stair finisher.",
    category: "Women",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 6,
    goal: "Build round, strong glutes",
    image: programWomenGluteSpec,
    summary:
      "Three glute-priority leg days (squat, hip thrust, glute pump) drive the whole week. Two shorter upper-body days keep the body balanced without stealing recovery. Every leg day ends on the stair machine, and the weekend is a light core + walk session.",
    progression:
      "This single week is the on-ramp. Every glute main lift stays @ RPE 7 (3 reps in reserve) so you can groove the pattern and squeeze hard at the top. Stop every set 2-3 reps shy of failure. If any main lift feels ≥ RPE 9, hold the same load next time. The full 8-week glute specialization runs the full 3-week wave (RPE 7 → 8 → 9) with a Week 4 deload.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Squat Day (Machines) + Stair Finisher" },
      { day: "Tuesday", session: "Back + Biceps + Core (short)" },
      { day: "Wednesday", session: "Glute-Focused Leg Day (Hip Thrust)" },
      { day: "Thursday", session: "Chest + Shoulders + Triceps (short)" },
      { day: "Friday", session: "Glute Pump Day + Stair Finisher" },
      { day: "Saturday", session: "Core + Stair Climber" },
      { day: "Sunday", session: "Optional Walk" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Squat Day (Machines) + Stair Finisher",
        focus: "Main squat + quad/glute machines",
        exercises: [
          { name: "- Band activation -", sets: "", reps: "", rest: "" },
          { name: "Banded Side Steps", sets: "2", reps: "15/side", rest: "30 sec" },
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          { name: "Barbell Back Squat", sets: "4", reps: "8 · see weekly plan", rest: "2-3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Smith Machine Squats", sets: "3", reps: "10", rest: "2 min" },
          { name: "Dumbbell Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "90 sec" },
          {
            name: "Glute Kickbacks on Machine",
            sets: "3",
            reps: "15/side (pause 1 sec at top)",
            rest: "60 sec",
          },
          { name: "Banded Side Steps", sets: "3", reps: "20/side (low, deep)", rest: "45 sec" },
          { name: "- Optional core -", sets: "", reps: "", rest: "" },
          { name: "Toe Touch Crunches", sets: "2", reps: "15", rest: "30 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 10 min steady (level 5-7) · Advanced 15 min (level 8-10, no rails)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 2",
        title: "Back + Biceps + Core (short)",
        focus: "Quick pull day - in and out",
        exercises: [
          { name: "- Main pull -", sets: "", reps: "", rest: "" },
          { name: "Lat Pulldown Wide Grip", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Dumbbell Hammer Curls", sets: "3", reps: "10/side", rest: "45 sec" },
          { name: "Butterfly Sit Ups", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Glute-Focused Leg Day (Hip Thrust)",
        focus: "Posterior chain + hinge",
        exercises: [
          { name: "- Band activation -", sets: "", reps: "", rest: "" },
          { name: "Banded Side Steps", sets: "2", reps: "15/side", rest: "30 sec" },
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Glute Hip Thrusts on Bench",
            sets: "4",
            reps: "8 · see weekly plan (2-sec squeeze at top)",
            rest: "2-3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "4", reps: "10", rest: "2 min" },
          {
            name: "Single Leg Body Weight Glute Hip Thrusts",
            sets: "3",
            reps: "10/leg",
            rest: "60 sec",
          },
          { name: "Glute Kickbacks on Machine", sets: "3", reps: "12/side", rest: "45 sec" },
          { name: "Banded Side Steps", sets: "3", reps: "15/side", rest: "45 sec" },
          { name: "- Optional core -", sets: "", reps: "", rest: "" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10", rest: "45 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 8 min easy (level 4-6) · Advanced 12 min (level 7-9)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 4",
        title: "Chest + Shoulders + Triceps (short)",
        focus: "Quick upper push",
        exercises: [
          { name: "- Main press -", sets: "", reps: "", rest: "" },
          { name: "Barbell Bench Press", sets: "4", reps: "8", rest: "2 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Bench Tricep Dips", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Glute Pump Day + Stair Finisher",
        focus: "High-volume glute isolation",
        exercises: [
          { name: "- Band activation -", sets: "", reps: "", rest: "" },
          { name: "Banded Side Steps", sets: "3", reps: "20/side", rest: "30 sec" },
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Glute Hip Thrusts",
            sets: "4",
            reps: "12 · see weekly plan (slow 3-sec eccentric)",
            rest: "90 sec",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          {
            name: "Smith Machine Reverse Lunge",
            sets: "3",
            reps: "10/leg (long stride)",
            rest: "75 sec",
          },
          {
            name: "Single Leg Body Weight Step Ups",
            sets: "3",
            reps: "12/leg (deep, push through heel)",
            rest: "60 sec",
          },
          { name: "Glute Kickbacks on Machine", sets: "4", reps: "15/side", rest: "45 sec" },
          {
            name: "Body Weight Glute Hip Thrusts",
            sets: "3",
            reps: "20 (squeeze glutes hard)",
            rest: "45 sec",
          },
          { name: "Banded Side Steps", sets: "3", reps: "20/side (burnout)", rest: "30 sec" },
          { name: "- Optional core -", sets: "", reps: "", rest: "" },
          { name: "Kneeling Cable Crunch", sets: "3", reps: "15", rest: "45 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 12 min steady (level 5-7) · Advanced 15-20 min intervals (2 min steady / 1 min side steps, level 8-10)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 6",
        title: "Core + Stair Climber",
        focus: "Midline + easy conditioning",
        exercises: [
          { name: "- Core circuit -", sets: "", reps: "", rest: "" },
          { name: "Plank", sets: "3", reps: "45 sec", rest: "45 sec" },
          { name: "Side Plank", sets: "3", reps: "30 sec/side", rest: "30 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 15 min Zone 2 (level 4-6, conversational) · Advanced 25 min Zone 2 (level 6-8)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 7",
        title: "Optional Walk",
        focus: "Recovery + steps",
        exercises: [
          {
            name: "Treadmill Incline Walking",
            sets: "1",
            reps: "30-45 min at 5-8% incline, easy pace",
            rest: "-",
          },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-strength-1-week",
    title: "Free 1-Week Strength Sampler",
    tagline: "Upper/Lower split with heavy main lifts, per-week RPE and an optional arms day.",
    category: "Strength",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Build raw strength on Squat, Bench, Deadlift and Military Press",
    image: programFreeStrength,
    summary:
      "Four-day upper/lower block anchored on the four kings: Barbell Bench Press on bench day, Barbell Back Squat on squat day, Barbell Deadlift on deadlift day and Standing Military Press on shoulder day. Chest+shoulders+triceps share the push day, back+biceps share the pull day. This one-week sampler opens at RPE 7 to groove technique. Optional weekend arms + core if fresh, full rest if not.",
    progression:
      "This sampler week keeps every main lift @ RPE 7 (3 reps in reserve). Stop each set with clean technique and 2-3 reps left in the tank. If any main lift feels ≥ RPE 9, hold the same load next time. This is the on-ramp, the full 5/3/1 or Upper/Lower 12-week program handles the deload wave after Week 3.",
    recovery:
      "Sleep 7-9 h, keep Wednesday and Sunday as true rest days, and skip Saturday's optional arms day entirely if any main lift moved slower than expected. The optional day is a bonus, never mandatory.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Upper A · Bench Day (Chest + Shoulders + Triceps)" },
      { day: "Tuesday", session: "Lower A · Squat Day" },
      { day: "Wednesday", session: "Rest / Walk 8k" },
      { day: "Thursday", session: "Upper B · Overhead Day (Back + Biceps)" },
      { day: "Friday", session: "Lower B · Deadlift Day" },
      { day: "Saturday", session: "Optional Arms + Core (skip if fatigued)" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      // ---------------- WEEK 1 · RPE 7 (groove) ----------------
      {
        day: "Week 1 · Day 1",
        title: "Upper A · Bench Day",
        focus: "Barbell Bench Press top set + upper push",
        exercises: [
          { name: "- Main lift · Week 1 @ RPE 7 -", sets: "", reps: "", rest: "" },
          { name: "Barbell Bench Press", sets: "4", reps: "5 @ RPE 7", rest: "2-3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "8 @ RPE 7", rest: "90 sec" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Dumbbell Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Cable Tricep Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Week 1 · Day 2",
        title: "Lower A · Squat Day",
        focus: "Barbell Back Squat top set + quad work",
        exercises: [
          { name: "- Main lift · Week 1 @ RPE 7 -", sets: "", reps: "", rest: "" },
          { name: "Barbell Back Squat", sets: "4", reps: "5 @ RPE 7", rest: "3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Smith Machine Reverse Lunge", sets: "3", reps: "8/leg", rest: "90 sec" },
          { name: "Leg Press", sets: "3", reps: "10 @ RPE 7", rest: "90 sec" },
          { name: "Leg Extension", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Week 1 · Day 3",
        title: "Upper B · Overhead Day",
        focus: "Standing Military Press + heavy pulling",
        exercises: [
          { name: "- Main lift · Week 1 @ RPE 7 -", sets: "", reps: "", rest: "" },
          { name: "Standing Overhead Press", sets: "4", reps: "5 @ RPE 7", rest: "2-3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Barbell Bent Over Row", sets: "3", reps: "6 @ RPE 7", rest: "2 min" },
          { name: "Pull Up", sets: "3", reps: "AMRAP (stop 2 short of failure)", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Dumbbell Bicep Curl", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Week 1 · Day 4",
        title: "Lower B · Deadlift Day",
        focus: "Barbell Deadlift top set + hamstrings",
        exercises: [
          { name: "- Main lift · Week 1 @ RPE 7 -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Deadlift",
            sets: "4",
            reps: "3 @ RPE 7 (cut a rep if the bar slows)",
            rest: "3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "3", reps: "8 @ RPE 7", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "90 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Week 1 · Day 5",
        title: "Optional Arms + Core",
        focus: "Skip if any main lift was ≥ RPE 8 this week",
        exercises: [
          { name: "EZ Bar Curl", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Skull Crusher", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Dumbbell Hammer Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Weighted Russian Twist", sets: "3", reps: "20/side", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-hypertrophy-1-week",
    title: "Free 1-Week Hypertrophy Sampler",
    tagline: "Chest+Shoulders and Back+Biceps splits with an optional pump day.",
    category: "Hypertrophy",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Volume, pump, muscle growth",
    image: programMuscle,
    summary:
      "Classic bodybuilding-style hypertrophy split: chest+shoulders+triceps together, back+biceps together, plus a leg day and an optional weekend pump session. Heavy on machines, cables and dumbbells - built to grow.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Chest + Shoulders + Triceps" },
      { day: "Tuesday", session: "Back + Biceps" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Legs + Glutes" },
      { day: "Friday", session: "Rest" },
      { day: "Saturday", session: "Optional Arms + Shoulders Pump" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Chest + Shoulders + Triceps",
        focus: "Push - machines & dumbbells",
        exercises: [
          { name: "- Main press -", sets: "", reps: "", rest: "" },
          { name: "Incline Dumbbell Bench Press", sets: "4", reps: "8", rest: "2 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Chest Press Machine", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Cable Tricep Pushdown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Overhead Tricep Extension", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Back + Biceps",
        focus: "Pull - width + thickness",
        exercises: [
          { name: "- Main pull -", sets: "", reps: "", rest: "" },
          { name: "Lat Pulldown Wide Grip", sets: "4", reps: "10", rest: "90 sec" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Chest Supported Row Machine", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Straight Arm Cable Pulldown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Dumbbell Bicep Curl", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Cable Bicep Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Legs + Glutes",
        focus: "Squat + hip thrust",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          { name: "Smith Machine Squats", sets: "4", reps: "8", rest: "2-3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Barbell Hip Thrust", sets: "3", reps: "10", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "90 sec" },
          { name: "Leg Extension", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Optional Arms + Shoulders Pump",
        focus: "Skip if fatigued",
        exercises: [
          { name: "EZ Bar Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Skull Crusher", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Dumbbell Hammer Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Cable Lateral Raise", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Reverse Pec Deck", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "free-strongman-1-week",
    title: "Free 1-Week Strongman Sampler",
    tagline: "Heavy carries, presses and pulls - a taste of event training.",
    category: "Strongman",
    level: "Intermediate",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Build brute strength + event capacity",
    image: programPowerlifting,
    summary:
      "Four sessions built around strongman staples: yoke-style squats, overhead pressing, deadlift + stone work, and a sled/carry medley. Chest+shoulders share the pressing day, back+biceps share the pull day, and an optional grip session closes the week.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Heavy Lower + Yoke Carry" },
      { day: "Tuesday", session: "Overhead + Chest + Shoulders" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Deadlift + Back + Biceps" },
      { day: "Friday", session: "Sled + Grip Medley" },
      { day: "Saturday", session: "Optional Grip + Core" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Heavy Lower + Yoke Carry",
        focus: "Squat + loaded carry",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          { name: "Barbell Back Squat", sets: "5", reps: "5", rest: "3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Zercher Squat", sets: "3", reps: "6", rest: "2 min" },
          { name: "Yoke Walk (or Heavy Barbell Carry)", sets: "4", reps: "20 m", rest: "2 min" },
          { name: "Standing Calf Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Overhead + Chest + Shoulders",
        focus: "Log/overhead pressing",
        exercises: [
          { name: "- Main press -", sets: "", reps: "", rest: "" },
          { name: "Standing Overhead Press", sets: "5", reps: "5", rest: "3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Push Press", sets: "4", reps: "5", rest: "2 min" },
          { name: "Incline Dumbbell Bench Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Dumbbell Lateral Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Cable Tricep Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Deadlift + Back + Biceps",
        focus: "Hinge + heavy pulling",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          { name: "Barbell Deadlift", sets: "5", reps: "3", rest: "3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Barbell Bent Over Row", sets: "4", reps: "6", rest: "2 min" },
          { name: "Pull Up", sets: "3", reps: "AMRAP", rest: "90 sec" },
          { name: "Barbell Bicep Curl", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Sled + Grip Medley",
        focus: "Carry + conditioning",
        exercises: [
          { name: "Sled Push", sets: "5", reps: "30 m heavy", rest: "2 min" },
          { name: "Farmer's Walk", sets: "4", reps: "30 m", rest: "2 min" },
          { name: "Dumbbell Bicep Curl", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Dead Hang", sets: "3", reps: "45 sec", rest: "60 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Optional Grip + Core",
        focus: "Skip if fatigued",
        exercises: [
          { name: "Dead Hang", sets: "3", reps: "45 sec", rest: "60 sec" },
          { name: "Farmer's Walk", sets: "3", reps: "20 m", rest: "90 sec" },
          { name: "Jackknives", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),
];

// ------------------------------------------------------------
// PREMIUM - Additional full programs (R$ 29,99)
// Fills out Hyrox, CrossFit and adds more options per category.
// ------------------------------------------------------------
const morePremium: Program[] = [
  buildProgram({
    slug: "hyrox-race-prep-8-week",
    title: "Hyrox Race Prep: 8-Week Engine Build",
    tagline: "Run faster, push heavier sleds, finish strong.",
    category: "Hyrox",
    level: "Intermediate",
    duration: "8 Weeks",
    daysPerWeek: 5,
    goal: "Hyrox PR",
    image: programHyroxRacePrepAsset.url,
    summary:
      "An 8-week mixed-modal block targeting every Hyrox station - sled push/pull, sandbag lunges, wall balls, burpee broad jumps and 1 km runs - alongside the strength base needed to hold pace.",
    weeklySchedule: [
      { day: "Monday", session: "Run Intervals + Sled" },
      { day: "Tuesday", session: "Hyrox Strength" },
      { day: "Wednesday", session: "Row + Burpee Couplet" },
      { day: "Thursday", session: "Long Easy Run" },
      { day: "Friday", session: "Race Sim (mini)" },
      { day: "Saturday", session: "Mobility / Walk" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Run Intervals + Sled",
        focus: "Lactate threshold",
        exercises: [
          { name: "Treadmill Run (Zone 4)", sets: "6", reps: "800 m", rest: "90 sec" },
          { name: "Sled Push", sets: "6", reps: "25 m", rest: "60 sec" },
          { name: "Rowing Machine", sets: "6", reps: "300 m", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Hyrox Strength",
        focus: "Lunge + carry",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "5", rest: "2 min" },
          { name: "Walking Lunge", sets: "5", reps: "20/side", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Farmer Carry", sets: "5", reps: "40 m", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Row + Burpee Couplet",
        focus: "Engine · 6 rounds for pace",
        exercises: [
          { name: "- 6 Rounds -", sets: "", reps: "", rest: "" },
          { name: "Rowing Machine", sets: "6", reps: "500 m @ ~2:00/500 m pace", rest: "60 sec" },
          { name: "Burpee Broad Jump", sets: "6", reps: "10", rest: "90 sec (end of round)" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Long Easy Run",
        focus: "Zone 2 aerobic base",
        exercises: [
          {
            name: "Treadmill Run (Zone 2, nasal-only if possible)",
            sets: "1",
            reps: "45-60 min",
            rest: "-",
          },
          {
            name: "Treadmill Incline Walk (cool-down)",
            sets: "1",
            reps: "5-10 min at 6% incline",
            rest: "-",
          },
        ],
      },
      {
        day: "Day 5",
        title: "Race Sim (mini)",
        focus: "Compromised running",
        exercises: [
          { name: "Treadmill Run", sets: "1", reps: "1 km", rest: "-" },
          { name: "Sled Push", sets: "1", reps: "50 m", rest: "-" },
          { name: "Treadmill Run", sets: "1", reps: "1 km", rest: "-" },
          { name: "Wall Balls", sets: "1", reps: "75", rest: "-" },
          { name: "Treadmill Run", sets: "1", reps: "1 km", rest: "-" },
          { name: "Burpee Broad Jump", sets: "1", reps: "40", rest: "-" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "push-pull-legs-6-week",
    title: "Push / Pull / Legs: 6-Week Volume Block",
    tagline: "The classic 6-day split, programmed properly.",
    category: "Hypertrophy",
    level: "Intermediate",
    duration: "6 Weeks",
    daysPerWeek: 5,
    goal: "Lean muscle gain",
    image: programPplVolume,
    summary:
      "Five focused sessions Monday to Friday - Push, Pull, Legs, Push, Pull with a second leg exposure baked in. Dumbbell and machine-heavy so joints stay happy and the stretch is loaded. Weekends are optional arms + core or full rest.",
    weeklySchedule: [
      { day: "Monday", session: "Push A - Chest Focus" },
      { day: "Tuesday", session: "Pull A - Back Width" },
      { day: "Wednesday", session: "Legs A - Quad Focus" },
      { day: "Thursday", session: "Push B - Shoulder Focus" },
      { day: "Friday", session: "Pull B - Back Thickness + Hamstrings" },
      { day: "Saturday", session: "Optional: Arms + Core Pump" },
      { day: "Sunday", session: "Optional: Zone-2 Cardio or Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Push A - Chest Focus",
        focus: "Incline dumbbell + stretch flyes",
        exercises: [
          { name: "Incline Dumbbell Press", sets: "4", reps: "8", rest: "2 min" },
          { name: "Chest Press Machine", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Low Cable Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Cable Lateral Raise", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Pull A - Back Width",
        focus: "Vertical pulling + lats",
        exercises: [
          { name: "Lat Pull Down", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Chest-Supported Row Machine", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Rear Delt Fly Machine", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Preacher Curl", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Legs A - Quad Focus",
        focus: "Heavy barbell squat + machine mass",
        exercises: [
          { name: "- Main lift · heavy -", sets: "", reps: "", rest: "" },
          { name: "Barbell Back Squat", sets: "5", reps: "5 @ RPE 8-9", rest: "3 min" },
          { name: "- Machine work -", sets: "", reps: "", rest: "" },
          { name: "Hack Squat Machine", sets: "4", reps: "8", rest: "2 min" },
          { name: "Leg Press", sets: "4", reps: "10 (deep, drive through heels)", rest: "2 min" },
          { name: "Smith Machine Reverse Lunge", sets: "3", reps: "10/leg", rest: "90 sec" },
          { name: "Leg Extension", sets: "4", reps: "12 (last set drop set)", rest: "60 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Push B - Shoulder Focus",
        focus: "Overhead + dumbbell pump",
        exercises: [
          { name: "Seated Dumbbell Shoulder Press", sets: "4", reps: "8", rest: "2 min" },
          { name: "Dumbbell Bench Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "High Cable Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Pull B - Back Thickness + Hamstrings",
        focus: "Rows, hinge, curls",
        exercises: [
          { name: "Romanian Deadlift", sets: "4", reps: "8", rest: "2 min" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Chest-Supported Row Machine", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Dumbbell Bicep Curl", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 6",
        title: "Optional: Arms + Core Pump",
        focus: "Skip if fatigued - keep it light",
        exercises: [
          { name: "Preacher Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Cable Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Kneeling Cable Crunch", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "glute-specialization-8-week",
    title: "Glute Specialization: 8-Week Build",
    tagline:
      "Smith machine, hip thrusts and Bulgarian split squats - full glute build with optional upper days.",
    category: "Women",
    level: "Intermediate",
    duration: "8 Weeks",
    daysPerWeek: 4,
    goal: "Glute hypertrophy",
    image: programWomenGluteSpec,
    summary:
      "Two heavy glute-priority leg days (hip thrust day + squat/Bulgarian day) plus a dedicated Smith Machine glute pump day drive the whole block. Two shorter optional upper days pair chest+shoulders+triceps and back+biceps so you stay balanced without frying recovery. Every main leg day ends with a stair or incline walk finisher.",
    progression:
      "Two identical 4-week waves that ramp consistently across the cycle. Wave 1 (Weeks 1-4) · Wk1 all glute main lifts @ RPE 7 (groove) → Wk2 @ RPE 8 (build) → Wk3 @ RPE 9 (peak, drop 1-2 reps per set) → Wk4 DELOAD (60% load, RPE 5, same reps to keep the pattern crisp). Wave 2 (Weeks 5-8) repeats the same RPE 7 → 8 → 9 → deload ladder but adds 2.5-5 kg to every main lift's starting load, Barbell Hip Thrust, Smith Machine Squats and Smith Machine Reverse Lunge should all be visibly stronger by Week 7 peak. Never skip the deload, it's what lets Wave 2 hit heavier than Wave 1.",

    weeklySchedule: [
      { day: "Monday", session: "Glute + Leg Day A - Hip Thrust Priority" },
      { day: "Tuesday", session: "Optional: Back + Biceps + Core" },
      { day: "Wednesday", session: "Glute + Leg Day B - Squat & Bulgarian" },
      { day: "Thursday", session: "Optional: Chest + Shoulders + Triceps" },
      { day: "Friday", session: "Smith Machine Glute Pump Day" },
      { day: "Saturday", session: "Optional Core + Stair Climber" },
      { day: "Sunday", session: "Rest or easy walk" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Glute + Leg Day A - Hip Thrust Priority",
        focus: "Heavy hip thrust + posterior chain",
        exercises: [
          { name: "- Band activation -", sets: "", reps: "", rest: "" },
          { name: "Banded Side Steps", sets: "2", reps: "20/side", rest: "30 sec" },
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Hip Thrust",
            sets: "4",
            reps: "8 · see weekly plan (2-sec squeeze at top)",
            rest: "2-3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "4", reps: "10", rest: "2 min" },
          { name: "Smith Machine Reverse Lunge", sets: "3", reps: "10/leg", rest: "90 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Cable Glute Kickback", sets: "3", reps: "15/side", rest: "45 sec" },
          { name: "Banded Side Steps", sets: "3", reps: "20/side (low, deep)", rest: "30 sec" },
          { name: "- Optional core -", sets: "", reps: "", rest: "" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 10 min steady (level 5-7, no rails) · Advanced 15 min (level 8-10)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 2",
        title: "Optional: Back + Biceps + Core",
        focus: "Light pull day, skip if fatigued",
        exercises: [
          { name: "Lat Pulldown Wide Grip", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Dumbbell Hammer Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Kneeling Cable Crunch", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Glute + Leg Day B - Squat & Bulgarian",
        focus: "Smith squat + split squat priority",
        exercises: [
          { name: "- Band activation -", sets: "", reps: "", rest: "" },
          { name: "Banded Side Steps", sets: "2", reps: "20/side", rest: "30 sec" },
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          { name: "Smith Machine Squats", sets: "4", reps: "8 · see weekly plan", rest: "2-3 min" },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Dumbbell Bulgarian Split Squat", sets: "4", reps: "10/leg", rest: "90 sec" },
          { name: "Hip Abduction Machine", sets: "4", reps: "15 (pause 1 sec)", rest: "45 sec" },
          { name: "Leg Extension", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Cable Pull Through", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Banded Side Steps", sets: "3", reps: "15/side", rest: "30 sec" },
          { name: "- Optional core -", sets: "", reps: "", rest: "" },
          { name: "Leg Raises", sets: "3", reps: "12", rest: "45 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Treadmill Incline Walking",
            sets: "1",
            reps: "10 min at 10-12% incline",
            rest: "-",
          },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 8 min steady (level 4-6) · Advanced 12 min (level 7-9, no rails)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 4",
        title: "Optional: Chest + Shoulders + Triceps",
        focus: "Light push day, skip if fatigued",
        exercises: [
          { name: "Dumbbell Bench Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Dumbbell Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Cable Tricep Pushdown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Dead Bug", sets: "3", reps: "10/side", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Smith Machine Glute Pump Day",
        focus: "High-volume Smith work + kickbacks",
        exercises: [
          { name: "- Band activation -", sets: "", reps: "", rest: "" },
          { name: "Banded Side Steps", sets: "3", reps: "20/side", rest: "30 sec" },
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Smith Machine Reverse Lunge",
            sets: "4",
            reps: "12/leg · see weekly plan (long stride, push through heel)",
            rest: "90 sec",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          {
            name: "Smith Machine Hip Thrust",
            sets: "4",
            reps: "12 (slow eccentric)",
            rest: "90 sec",
          },
          {
            name: "Smith Machine Bulgarian Split Squat",
            sets: "3",
            reps: "10/leg",
            rest: "75 sec",
          },
          { name: "Cable Glute Kickback", sets: "4", reps: "15/side", rest: "45 sec" },
          {
            name: "Hip Abduction Machine",
            sets: "3",
            reps: "20 (drop set on last)",
            rest: "45 sec",
          },
          { name: "Banded Side Steps", sets: "3", reps: "25/side (burnout)", rest: "30 sec" },
          { name: "- Optional core -", sets: "", reps: "", rest: "" },
          { name: "Kneeling Cable Crunch", sets: "3", reps: "15", rest: "45 sec" },
          { name: "- Finisher -", sets: "", reps: "", rest: "" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 10 min steady (level 5-7) · Advanced 15 min intervals (2 min steady / 1 min side steps, level 8-10)",
            rest: "2 min between sets",
          },
        ],
      },
      {
        day: "Day 6",
        title: "Optional Core + Stair Climber",
        focus: "Midline + easy conditioning",
        exercises: [
          { name: "Kneeling Cable Crunch", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Side Plank", sets: "3", reps: "30 sec/side", rest: "30 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
          {
            name: "Stair Climber",
            sets: "Beginner 1 · Advanced 2",
            reps: "Beginner 15 min Zone 2 (level 4-6) · Advanced 25 min Zone 2 (level 6-8)",
            rest: "2 min between sets",
          },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "marathon-prep-12-week",
    title: "Marathon Prep: 12-Week Foundation",
    tagline: "Build the engine to finish 42 km - strong, not surviving.",
    category: "Endurance",
    level: "Intermediate",
    duration: "12 Weeks",
    daysPerWeek: 5,
    goal: "Complete a strong marathon",
    image: programRunning,
    summary:
      "Five running days plus two short strength sessions. Long runs build to 32 km, with weekly tempo and interval work to lift threshold pace.",
    weeklySchedule: [
      { day: "Monday", session: "Strength for Runners" },
      { day: "Tuesday", session: "Intervals" },
      { day: "Wednesday", session: "Easy Run" },
      { day: "Thursday", session: "Tempo Run" },
      { day: "Friday", session: "Rest" },
      { day: "Saturday", session: "Long Run" },
      { day: "Sunday", session: "Recovery Run / Walk" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Strength for Runners",
        focus: "Single-leg",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Walking Lunge", sets: "3", reps: "12/side", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Intervals",
        focus: "VO2 max · 800 m repeats",
        exercises: [
          { name: "Warm-Up Jog (Zone 2)", sets: "1", reps: "10 min easy", rest: "-" },
          { name: "Treadmill Run (Zone 5)", sets: "6", reps: "800 m @ 5K pace", rest: "2 min jog" },
          { name: "Cool-Down Jog", sets: "1", reps: "10 min easy", rest: "-" },
        ],
      },
      {
        day: "Day 3",
        title: "Easy Run",
        focus: "Zone 2 aerobic base",
        exercises: [
          {
            name: "Treadmill Run (Zone 2, conversational)",
            sets: "1",
            reps: "40-50 min",
            rest: "-",
          },
        ],
      },
      {
        day: "Day 4",
        title: "Tempo Run",
        focus: "Lactate threshold · comfortably hard",
        exercises: [
          { name: "Warm-Up Jog", sets: "1", reps: "10 min easy", rest: "-" },
          {
            name: "Treadmill Run (Zone 4)",
            sets: "1",
            reps: "25-35 min at threshold pace",
            rest: "-",
          },
          { name: "Cool-Down Jog", sets: "1", reps: "10 min easy", rest: "-" },
        ],
      },
      {
        day: "Day 6",
        title: "Long Run",
        focus: "Endurance build · adds 1-2 km per week",
        exercises: [
          {
            name: "Treadmill Run (Zone 2)",
            sets: "1",
            reps: "90-150 min at conversational pace",
            rest: "-",
          },
          { name: "Treadmill Walk (cool-down)", sets: "1", reps: "5-10 min flat", rest: "-" },
        ],
      },
      {
        day: "Day 7",
        title: "Recovery Run / Walk",
        focus: "Blood flow · nothing hard",
        exercises: [
          {
            name: "Treadmill Walk or Very Easy Run",
            sets: "1",
            reps: "20-30 min at Zone 1",
            rest: "-",
          },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "fat-loss-12-week-advanced",
    title: "Lean Engine: 12-Week Advanced Fat Loss",
    tagline: "Hold strength while body fat keeps dropping.",
    category: "Fat Loss",
    level: "Intermediate",
    duration: "12 Weeks",
    daysPerWeek: 5,
    goal: "Visible body recomposition",
    image: programLeanEngine,
    summary:
      "Three heavy strength sessions plus two conditioning days. Built for lifters who already train and want a longer, smarter cut without losing muscle.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Strength" },
      { day: "Tuesday", session: "Conditioning A" },
      { day: "Wednesday", session: "Lower Strength" },
      { day: "Thursday", session: "Rest" },
      { day: "Friday", session: "Full Body Strength" },
      { day: "Saturday", session: "Conditioning B" },
      { day: "Sunday", session: "Walk" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Strength",
        focus: "Push/Pull",
        exercises: [
          { name: "Barbell Bench Press", sets: "4", reps: "5", rest: "3 min" },
          { name: "Pull Ups", sets: "4", reps: "6", rest: "2 min" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Conditioning A",
        focus: "Bike + carries",
        exercises: [
          { name: "Assault Bike Intervals", sets: "10", reps: "20 sec on / 40 off", rest: "-" },
          { name: "Farmer Carry", sets: "5", reps: "40 m", rest: "60 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Lower Strength",
        focus: "Squat + hinge",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "5", rest: "3 min" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "90 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Full Body Strength",
        focus: "Compound circuit · protect muscle in a deficit",
        exercises: [
          {
            name: "Trap Bar Deadlift (or Barbell Deadlift)",
            sets: "4",
            reps: "5 @ RPE 7-8",
            rest: "2 min",
          },
          { name: "Incline Dumbbell Press", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Chest-Supported Row", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "75 sec" },
          { name: "Dumbbell Lateral Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 6",
        title: "Conditioning B",
        focus: "Sled + rope density · 20 min AMRAP",
        exercises: [
          {
            name: "- 20 min AMRAP · rest as needed between rounds -",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Sled Push (moderate)", sets: "AMRAP", reps: "20 m", rest: "-" },
          { name: "Battle Rope Slams", sets: "AMRAP", reps: "30 sec", rest: "-" },
          { name: "Kettlebell Swing", sets: "AMRAP", reps: "20", rest: "-" },
          { name: "Rowing Machine", sets: "AMRAP", reps: "250 m", rest: "-" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "raw-strength-meet-prep",
    title: "Meet Prep: 10-Week Powerlifting Peak",
    tagline: "Walk onto the platform ready for a 9-for-9 day.",
    category: "Powerlifting",
    level: "Advanced",
    duration: "10 Weeks",
    daysPerWeek: 4,
    goal: "Peak SBD total",
    image: programPowerliftingMeetAsset.url,
    summary:
      "Ten weeks built around your meet date. Hypertrophy block, intensity block, peak week and rehearsal singles at meet attempts.",
    weeklySchedule: [
      { day: "Monday", session: "Squat (Heavy)" },
      { day: "Tuesday", session: "Bench (Heavy)" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Deadlift (Heavy)" },
      { day: "Friday", session: "Bench (Volume)" },
      { day: "Saturday", session: "Mobility" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Squat (Heavy)",
        focus: "Ramp to a hard top set of 3",
        exercises: [
          {
            name: "Back Squat",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8.5 on final set)",
            rest: "3 min",
          },
          { name: "Front Squat", sets: "3", reps: "5", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "10 / leg", rest: "90 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Bench (Heavy)",
        focus: "Bench top set + comp accessories",
        exercises: [
          {
            name: "Barbell Bench Press",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8.5 on final set)",
            rest: "3 min",
          },
          { name: "Spoto Press", sets: "3", reps: "5", rest: "2 min" },
          { name: "Close-Grip Bench Press", sets: "3", reps: "6", rest: "2 min" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Deadlift (Heavy)",
        focus: "Pull + back",
        exercises: [
          {
            name: "Deadlift",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8.5 on final set)",
            rest: "3 min",
          },
          { name: "Pause Deadlift", sets: "3", reps: "3", rest: "2 min" },
          { name: "Barbell Row", sets: "4", reps: "6", rest: "2 min" },
          { name: "Weighted Pull Up", sets: "3", reps: "6", rest: "90 sec" },
          { name: "Back Extension", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Bench (Volume)",
        focus: "Volume + shoulders",
        exercises: [
          { name: "Barbell Bench Press", sets: "5", reps: "6 @ RPE 7", rest: "2 min" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Lateral Raise", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),
];

// ------------------------------------------------------------
// Extra premium fillers - guarantees 3 cards per visible category.
// ------------------------------------------------------------
const extraPremium: Program[] = [
  // BEGINNER (+2)
  buildProgram({
    slug: "beginner-bodyweight-foundation",
    title: "Bodyweight Foundation: 6-Week Starter",
    tagline: "Zero equipment, zero excuses - build a real base.",
    category: "Beginner",
    level: "Beginner",
    duration: "6 Weeks",
    daysPerWeek: 4,
    goal: "General fitness + technique",
    image: programBeginnerBodyweightAsset.url,
    summary:
      "Six weeks of progressive bodyweight training that prepares you to walk into any gym and actually lift. Push-up, squat, hinge and pull patterns taught from scratch.",
    weeklySchedule: [
      { day: "Monday", session: "Push + Core" },
      { day: "Tuesday", session: "Lower" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Pull + Carry" },
      { day: "Friday", session: "Full Body Flow" },
      { day: "Saturday", session: "Walk 30 min" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Push + Core",
        exercises: [
          { name: "Push Ups (incline ok)", sets: "4", reps: "6-10", rest: "90 sec" },
          { name: "Ab Wheel Roll Outs", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Glute Bridge", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower",
        exercises: [
          { name: "Air Squats", sets: "4", reps: "15", rest: "60 sec" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "60 sec" },
          { name: "Single Leg Glute Bridge", sets: "3", reps: "10/side", rest: "45 sec" },
          { name: "Bodyweight Good Morning", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Calf Raise (bodyweight)", sets: "3", reps: "20", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Pull + Carry",
        focus: "Back and grip using bodyweight only",
        exercises: [
          { name: "Superman Hold", sets: "3", reps: "20 sec", rest: "45 sec" },
          { name: "Reverse Snow Angels (floor)", sets: "3", reps: "12", rest: "45 sec" },
          {
            name: "Bodyweight Row (under a sturdy table or low bar)",
            sets: "4",
            reps: "8-10",
            rest: "60 sec",
          },
          { name: "Y-Raise (prone, floor)", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Bear Crawl", sets: "3", reps: "20 m forward + 20 m back", rest: "60 sec" },
          { name: "Dead Bug", sets: "3", reps: "10/side", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Full Body Flow",
        focus: "Movement quality · continuous circuit",
        exercises: [
          { name: "- 4 Rounds · rest 60 sec between rounds -", sets: "", reps: "", rest: "" },
          { name: "Push Ups (any variation)", sets: "4", reps: "8", rest: "-" },
          { name: "Air Squats", sets: "4", reps: "12", rest: "-" },
          { name: "Bird Dog", sets: "4", reps: "8/side", rest: "-" },
          { name: "Glute Bridge", sets: "4", reps: "12", rest: "-" },
          { name: "Mountain Climbers", sets: "4", reps: "30 sec", rest: "60 sec (end of round)" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "beginner-3-day-full-body",
    title: "3-Day Full Body: 8-Week Linear Progression",
    tagline: "The classic Mon-Wed-Fri plan that built a generation of lifters.",
    category: "Beginner",
    level: "Beginner",
    duration: "8 Weeks",
    daysPerWeek: 3,
    goal: "Master the big 5 lifts",
    image: programBeginnerFullbodyAsset.url,
    summary:
      "Three full-body sessions per week, alternating workout A and B. Add weight every single session you can - that's the entire program.",
    weeklySchedule: [
      { day: "Monday", session: "Workout A" },
      { day: "Tuesday", session: "Rest" },
      { day: "Wednesday", session: "Workout B" },
      { day: "Thursday", session: "Rest" },
      { day: "Friday", session: "Workout A" },
      { day: "Saturday", session: "Walk" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Workout A",
        exercises: [
          { name: "Back Squat", sets: "3", reps: "5", rest: "3 min" },
          { name: "Barbell Bench Press", sets: "3", reps: "5", rest: "2-3 min" },
          { name: "Barbell Row", sets: "3", reps: "5", rest: "2 min" },
        ],
      },
      {
        day: "Day 3",
        title: "Workout B",
        exercises: [
          { name: "Back Squat", sets: "3", reps: "5", rest: "3 min" },
          { name: "Overhead Press", sets: "3", reps: "5", rest: "2-3 min" },
          { name: "Deadlift", sets: "1", reps: "5", rest: "-" },
        ],
      },
    ],
  }),

  // BODYBUILDING (+2)
  buildProgram({
    slug: "bodybuilding-upper-lower-5",
    title: "Upper / Lower: 5-Day Mass Block",
    tagline: "Two upper, two lower, one arms day - visible growth in 8 weeks.",
    category: "Bodybuilding",
    level: "Intermediate",
    duration: "8 Weeks",
    daysPerWeek: 5,
    goal: "Pure muscle gain",
    image: programUpperLowerMass,
    summary:
      "Upper/lower split with an extra arms day. Each compound is paired with high-quality isolation work in the 8-15 rep range.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Heavy" },
      { day: "Tuesday", session: "Lower Heavy" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Upper Pump" },
      { day: "Friday", session: "Lower Pump" },
      { day: "Saturday", session: "Arms + Calves" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Heavy",
        exercises: [
          { name: "Barbell Bench Press", sets: "4", reps: "6", rest: "3 min" },
          { name: "Barbell Row", sets: "4", reps: "6", rest: "2 min" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "8", rest: "2 min" },
          { name: "Chest-Supported Row Machine", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Lateral Raise", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Heavy",
        exercises: [
          { name: "- Main lift · heavy -", sets: "", reps: "", rest: "" },
          { name: "Barbell Back Squat", sets: "5", reps: "5 @ RPE 8-9", rest: "3 min" },
          { name: "- Machine mass -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "4", reps: "6", rest: "2-3 min" },
          { name: "Hack Squat Machine", sets: "4", reps: "8", rest: "2 min" },
          { name: "Leg Press", sets: "3", reps: "10", rest: "2 min" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Upper Pump",
        exercises: [
          { name: "Incline Dumbbell Press", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Lat Pull Down", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Chest Press Machine", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Low Cable Chest Fly", sets: "3", reps: "15", rest: "60 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Rear Delt Fly Machine", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Lower Pump",
        exercises: [
          { name: "- Machine volume -", sets: "", reps: "", rest: "" },
          { name: "Smith Machine Squats", sets: "4", reps: "10", rest: "2 min" },
          { name: "Leg Press", sets: "4", reps: "12 (feet low, quad focus)", rest: "90 sec" },
          { name: "Smith Machine Reverse Lunge", sets: "3", reps: "10/leg", rest: "75 sec" },
          { name: "Leg Extension", sets: "4", reps: "15 (last set drop)", rest: "45 sec" },
          { name: "Seated Leg Curl", sets: "4", reps: "12", rest: "45 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 6",
        title: "Arms + Calves",
        exercises: [
          { name: "Preacher Curl", sets: "4", reps: "10", rest: "60 sec" },
          { name: "Cable Hammer Curl", sets: "4", reps: "12", rest: "45 sec" },
          { name: "Overhead Rope Triceps", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Triceps Pushdown", sets: "4", reps: "12", rest: "45 sec" },
          { name: "Standing Calf Raise", sets: "5", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),

  // STRONGMAN (+1)
  buildProgram({
    slug: "strongman-foundations-10-week",
    title: "Strongman Foundations: 10-Week Build",
    tagline: "Sled, yoke, carries and stones - the real-world power block.",
    category: "Strongman",
    level: "Intermediate",
    duration: "10 Weeks",
    daysPerWeek: 4,
    goal: "Build max strength + odd-object capacity",
    image: programPowerlifting,
    summary:
      "Two heavy barbell days plus two dedicated events days. Sled push/pull, farmer carries, log press and stone-to-shoulder work drive the specific capacity that no bodybuilding split can build.",
    weeklySchedule: [
      { day: "Monday", session: "Heavy Lower + Yoke" },
      { day: "Tuesday", session: "Overhead + Carry" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Deadlift + Stone" },
      { day: "Friday", session: "Sled + Grip Medley" },
      { day: "Saturday", session: "Rest / Mobility" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Heavy Lower + Yoke",
        exercises: [
          {
            name: "Back Squat",
            sets: "5",
            reps: "3 (ramp: light → RPE 7 → RPE 8 on final set)",
            rest: "3 min",
          },
          { name: "Front Squat", sets: "3", reps: "5", rest: "2 min" },
          { name: "Yoke Walk (or heavy Zercher carry)", sets: "4", reps: "20 m", rest: "2 min" },
          { name: "Standing Calf Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Weighted Plank", sets: "3", reps: "30 sec", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Overhead + Carry",
        exercises: [
          {
            name: "Overhead Press (log or axle)",
            sets: "5",
            reps: "3 (ramp to RPE 8 top set)",
            rest: "3 min",
          },
          { name: "Push Press", sets: "3", reps: "5", rest: "2 min" },
          { name: "Farmer Carry (heavy)", sets: "4", reps: "20 m", rest: "2 min" },
          { name: "Chest-Supported Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Cable Lateral Raise", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Deadlift + Stone",
        exercises: [
          { name: "Deadlift", sets: "5", reps: "3 (ramp to RPE 8 top set)", rest: "3 min" },
          { name: "Deficit Deadlift", sets: "3", reps: "5", rest: "2 min" },
          { name: "Sandbag / Atlas Stone to Shoulder", sets: "5", reps: "3 / side", rest: "2 min" },
          { name: "Barbell Row", sets: "4", reps: "6", rest: "2 min" },
          { name: "Back Extension", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Sled + Grip Medley",
        exercises: [
          { name: "Sled Push (heavy)", sets: "6", reps: "15 m", rest: "90 sec" },
          { name: "Rowing Machine", sets: "4", reps: "300 m", rest: "90 sec" },
          { name: "Farmer Carry (moderate)", sets: "4", reps: "30 m", rest: "90 sec" },
          { name: "Sandbag Bear Hug Carry", sets: "3", reps: "20 m", rest: "90 sec" },
          { name: "Dead Hang", sets: "3", reps: "max time", rest: "90 sec" },
        ],
      },
    ],
  }),

  // POWERLIFTING (+1)
  buildProgram({
    slug: "powerlifting-rpe-9-week",
    title: "RPE-Based Powerlifting: 9-Week Build",
    tagline: "Auto-regulate every session and add to your total.",
    category: "Powerlifting",
    level: "Intermediate",
    duration: "9 Weeks",
    daysPerWeek: 4,
    goal: "Add 10-20 kg to your total",
    image: programPowerliftingRpeAsset.url,
    summary:
      "Top sets called by RPE so you never grind a bad day. Volume backoffs drive the hypertrophy that keeps the strength coming.",
    weeklySchedule: [
      { day: "Monday", session: "Squat + Accessories" },
      { day: "Tuesday", session: "Bench (Heavy)" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Deadlift + Back" },
      { day: "Friday", session: "Bench (Volume)" },
      { day: "Saturday", session: "Rest" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Squat + Accessories",
        exercises: [
          {
            name: "Back Squat",
            sets: "4",
            reps: "5 (ramp: light → RPE 7 → RPE 8 on top set, then 3 backoffs matching load)",
            rest: "3 min",
          },
          { name: "Pause Squat", sets: "3", reps: "5", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "8 / leg", rest: "90 sec" },
          { name: "Leg Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Standing Calf Raise", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Bench (Heavy)",
        exercises: [
          {
            name: "Barbell Bench Press",
            sets: "4",
            reps: "5 (ramp to RPE 8 top set, then 3 backoffs)",
            rest: "3 min",
          },
          { name: "Close-Grip Bench Press", sets: "3", reps: "6", rest: "2 min" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Chest-Supported Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Overhead Rope Triceps", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Deadlift + Back",
        exercises: [
          { name: "Deadlift", sets: "3", reps: "3 (ramp to RPE 8 top set)", rest: "3 min" },
          { name: "Romanian Deadlift", sets: "3", reps: "6", rest: "2 min" },
          { name: "Barbell Row", sets: "4", reps: "6", rest: "2 min" },
          { name: "Lat Pull Down", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Bench (Volume)",
        exercises: [
          { name: "Barbell Bench Press", sets: "5", reps: "8 @ RPE 7", rest: "2 min" },
          { name: "Seated Dumbbell Shoulder Press", sets: "4", reps: "10", rest: "90 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Cable Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),

  // HYPERTROPHY (+1)
  buildProgram({
    slug: "hypertrophy-stretch-mediated-8",
    title: "Stretch-Mediated Hypertrophy: 8-Week Block",
    tagline: "Train every muscle through its longest range - grow faster.",
    category: "Hypertrophy",
    level: "Intermediate",
    duration: "8 Weeks",
    daysPerWeek: 5,
    goal: "Lean tissue + range",
    image: programStretchHypertrophy,
    summary:
      "Every session leads with the lengthened-position variation (deficit RDL, incline curl, overhead triceps) for the strongest hypertrophy stimulus.",
    weeklySchedule: [
      { day: "Monday", session: "Chest + Triceps" },
      { day: "Tuesday", session: "Back + Biceps" },
      { day: "Wednesday", session: "Legs" },
      { day: "Thursday", session: "Shoulders + Arms" },
      { day: "Friday", session: "Posterior Chain" },
      { day: "Saturday", session: "Rest" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Chest + Triceps",
        focus: "Lengthened-position pressing and stretch flyes",
        exercises: [
          {
            name: "Incline Dumbbell Press (deep stretch at bottom)",
            sets: "4",
            reps: "8-10 @ RPE 8",
            rest: "2 min",
          },
          { name: "Flat Dumbbell Press", sets: "3", reps: "10", rest: "90 sec" },
          {
            name: "Cable Chest Fly (low to high, deep stretch)",
            sets: "4",
            reps: "12",
            rest: "60 sec",
          },
          { name: "Pec Deck Machine", sets: "3", reps: "12", rest: "60 sec" },
          {
            name: "Overhead Rope Triceps (elbows overhead)",
            sets: "4",
            reps: "12",
            rest: "60 sec",
          },
          { name: "Skull Crusher (behind head)", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Back + Biceps",
        focus: "Lat stretch on every set",
        exercises: [
          {
            name: "Lat Pulldown (dead-hang stretch each rep)",
            sets: "4",
            reps: "10 @ RPE 8",
            rest: "2 min",
          },
          { name: "Chest-Supported Row Machine", sets: "3", reps: "10", rest: "90 sec" },
          {
            name: "Straight-Arm Cable Pulldown (long lever)",
            sets: "3",
            reps: "12",
            rest: "60 sec",
          },
          {
            name: "Incline Dumbbell Curl (arms hanging, stretched)",
            sets: "4",
            reps: "10",
            rest: "60 sec",
          },
          { name: "Cable Bicep Curl (behind the body)", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Legs",
        focus: "Squat below parallel, hip flexion emphasis",
        exercises: [
          {
            name: "Barbell Back Squat (below parallel)",
            sets: "4",
            reps: "6-8 @ RPE 8",
            rest: "3 min",
          },
          { name: "Hack Squat Machine (deep stretch)", sets: "3", reps: "10", rest: "2 min" },
          {
            name: "Bulgarian Split Squat (deep front knee flex)",
            sets: "3",
            reps: "10/leg",
            rest: "90 sec",
          },
          { name: "Leg Extension (pause at top)", sets: "3", reps: "12", rest: "60 sec" },
          {
            name: "Standing Calf Raise (full stretch at bottom)",
            sets: "4",
            reps: "12",
            rest: "45 sec",
          },
        ],
      },
      {
        day: "Day 4",
        title: "Shoulders + Arms",
        focus: "Lateral raise stretch + overhead triceps",
        exercises: [
          {
            name: "Seated Dumbbell Shoulder Press (below chin)",
            sets: "4",
            reps: "8 @ RPE 8",
            rest: "2 min",
          },
          {
            name: "Cable Lateral Raise (behind body, stretched)",
            sets: "4",
            reps: "12",
            rest: "60 sec",
          },
          { name: "Rear Delt Fly Machine", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Incline Dumbbell Curl", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Overhead Rope Triceps Extension", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Cable Hammer Curl", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Posterior Chain",
        focus: "Hamstring stretch + heavy hinge",
        exercises: [
          { name: "Deficit Deadlift", sets: "3", reps: "6", rest: "3 min" },
          { name: "Romanian Deadlift (long ROM)", sets: "3", reps: "10", rest: "2 min" },
          {
            name: "Seated Leg Curl (pause at full contraction)",
            sets: "4",
            reps: "12",
            rest: "60 sec",
          },
          { name: "Barbell Hip Thrust", sets: "3", reps: "10", rest: "90 sec" },
          {
            name: "Back Extension (rounded to loaded stretch)",
            sets: "3",
            reps: "12",
            rest: "60 sec",
          },
        ],
      },
    ],
  }),

  // FAT LOSS (+1)
  buildProgram({
    slug: "fat-loss-metcon-6-week",
    title: "MetCon Cut: 6-Week Conditioning Burn",
    tagline: "Short, brutal circuits that protect muscle and shred fat.",
    category: "Fat Loss",
    level: "Intermediate",
    duration: "6 Weeks",
    daysPerWeek: 5,
    goal: "Visible recomp + GPP",
    image: programMetconCut,
    summary:
      "Three lift days plus two pure MetCon sessions - each finisher under 20 minutes, designed to spike heart rate without trashing the next session.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Lift + MetCon" },
      { day: "Tuesday", session: "Lower Lift + MetCon" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Pure MetCon" },
      { day: "Friday", session: "Full Body Lift" },
      { day: "Saturday", session: "Pure MetCon" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Lift + MetCon",
        focus: "Push/pull strength, then a 10-minute burner",
        exercises: [
          { name: "- Strength -", sets: "", reps: "", rest: "" },
          { name: "Barbell Bench Press", sets: "4", reps: "6 @ RPE 8", rest: "2 min" },
          { name: "Chest-Supported Row", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "- MetCon · 10 min AMRAP -", sets: "", reps: "", rest: "" },
          { name: "Dumbbell Push Press", sets: "AMRAP", reps: "8", rest: "-" },
          { name: "Renegade Row", sets: "AMRAP", reps: "10", rest: "-" },
          { name: "Burpees", sets: "AMRAP", reps: "6", rest: "-" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Lift + MetCon",
        focus: "Squat + hinge, then a short bike burner",
        exercises: [
          { name: "- Strength -", sets: "", reps: "", rest: "" },
          { name: "Back Squat", sets: "4", reps: "6 @ RPE 8", rest: "3 min" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "75 sec" },
          { name: "- MetCon · 8 rounds -", sets: "", reps: "", rest: "" },
          { name: "Assault Bike Sprint", sets: "8", reps: "20 sec all-out", rest: "40 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Pure MetCon",
        focus: "EMOM 20 · one movement each minute, rest the remainder",
        exercises: [
          { name: "Kettlebell Swing", sets: "5", reps: "15", rest: "-" },
          { name: "Burpees", sets: "5", reps: "10", rest: "-" },
          { name: "Goblet Squat", sets: "5", reps: "15", rest: "-" },
          { name: "Push Ups", sets: "5", reps: "12", rest: "-" },
        ],
      },
      {
        day: "Day 5",
        title: "Full Body Lift",
        focus: "Compound circuit · muscle-protective volume",
        exercises: [
          { name: "Trap Bar Deadlift", sets: "4", reps: "6 @ RPE 8", rest: "2 min" },
          { name: "Incline Dumbbell Press", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Weighted Pull Up (or Lat Pulldown)", sets: "4", reps: "8", rest: "90 sec" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "75 sec" },
          { name: "Farmer Carry", sets: "3", reps: "40 m heavy", rest: "60 sec" },
        ],
      },
      {
        day: "Day 6",
        title: "Pure MetCon (Saturday)",
        focus: "For Time · sub-20 min chipper",
        exercises: [
          { name: "- 1 Round For Time -", sets: "", reps: "", rest: "" },
          { name: "Rowing Machine", sets: "1", reps: "1000 m", rest: "-" },
          { name: "Wall Balls", sets: "1", reps: "50", rest: "-" },
          { name: "Kettlebell Swing", sets: "1", reps: "40", rest: "-" },
          { name: "Box Jumps", sets: "1", reps: "30", rest: "-" },
          { name: "Burpees", sets: "1", reps: "20", rest: "-" },
        ],
      },
    ],
  }),

  // WOMEN (+1)
  buildProgram({
    slug: "women-postpartum-recomp-10",
    title: "Postpartum Recomp: 10-Week Rebuild",
    tagline: "Re-engage the core, rebuild glutes, and lift again - safely.",
    category: "Women",
    level: "Beginner",
    duration: "10 Weeks",
    daysPerWeek: 4,
    goal: "Core + glute rebuild",
    image: programWomenPostpartum,
    summary:
      "Cleared-for-exercise mothers progress from breath work and pelvic floor activation into loaded hinging and squatting over ten weeks.",
    weeklySchedule: [
      { day: "Monday", session: "Core + Glutes (Light)" },
      { day: "Tuesday", session: "Walk 30 min" },
      { day: "Wednesday", session: "Lower Strength" },
      { day: "Thursday", session: "Rest" },
      { day: "Friday", session: "Upper Strength" },
      { day: "Saturday", session: "Full Body Light" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Core + Glutes (Light)",
        focus: "Reconnect pelvic floor, activate glutes",
        exercises: [
          { name: "Glute Bridge", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Dead Bug", sets: "3", reps: "8/side", rest: "45 sec" },
          { name: "Bird Dog", sets: "3", reps: "8/side", rest: "45 sec" },
          { name: "Clamshell", sets: "3", reps: "12/side", rest: "45 sec" },
          { name: "Pallof Press", sets: "3", reps: "10/side", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Strength",
        focus: "Loaded hinge + squat, still light",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Walking Lunge", sets: "3", reps: "10/side", rest: "60 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Bench Flutter Kicks", sets: "3", reps: "30 sec", rest: "45 sec" },
          { name: "Treadmill Walking", sets: "1", reps: "10 min easy", rest: "-" },
        ],
      },
      {
        day: "Day 3",
        title: "Upper Strength",
        focus: "Back + shoulder posture rebuild",
        exercises: [
          { name: "Lat Pull Down", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Seated Cable Row", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Face Pulls", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Dumbbell Bicep Curl", sets: "2", reps: "12", rest: "60 sec" },
          { name: "Side Plank", sets: "3", reps: "20 sec/side", rest: "30 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Full Body Light + Core",
        focus: "Movement quality + core stability",
        exercises: [
          { name: "Barbell Hip Thrust", sets: "3", reps: "12", rest: "90 sec" },
          { name: "Push Ups (any variation)", sets: "3", reps: "AMRAP", rest: "60 sec" },
          { name: "Cable Pull Through", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Bird Dog", sets: "3", reps: "8/side", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "8", rest: "45 sec" },
          { name: "Treadmill Walking", sets: "1", reps: "15 min easy", rest: "-" },
        ],
      },
    ],
  }),

  // ENDURANCE (+2 - including the 3K run program the user asked for)
  buildProgram({
    slug: "endurance-3k-run-6-week",
    title: "Sub-12 Minute 3K: 6-Week Speed Build",
    tagline: "The shortest fast race - and the hardest to pace right.",
    category: "Endurance",
    level: "Intermediate",
    duration: "6 Weeks",
    daysPerWeek: 4,
    goal: "Run a fast 3K",
    image: programRunning,
    summary:
      "Six weeks built around the 3K - VO2 max intervals, threshold work, and one weekly time trial so you learn exactly what 3K pace feels like.",
    weeklySchedule: [
      { day: "Monday", session: "VO2 Intervals (400s)" },
      { day: "Tuesday", session: "Easy Run 30 min" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Threshold (1K reps)" },
      { day: "Friday", session: "Rest" },
      { day: "Saturday", session: "Time Trial / Long Run" },
      { day: "Sunday", session: "Walk / Mobility" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "VO2 Intervals",
        focus: "400 m repeats",
        exercises: [
          { name: "Treadmill Run (Zone 5)", sets: "8", reps: "400 m", rest: "75 sec jog" },
        ],
      },
      {
        day: "Day 4",
        title: "Threshold",
        focus: "1K reps",
        exercises: [{ name: "Treadmill Run (Zone 4)", sets: "4", reps: "1 km", rest: "2 min" }],
      },
      {
        day: "Day 6",
        title: "3K Time Trial",
        focus: "Race pace",
        exercises: [{ name: "Treadmill Run", sets: "1", reps: "3 km all-out", rest: "-" }],
      },
    ],
  }),
  buildProgram({
    slug: "endurance-5k-pr-8-week",
    title: "5K PR: 8-Week Build",
    tagline: "Drop 60+ seconds off your 5K with smart progression.",
    category: "Endurance",
    level: "Intermediate",
    duration: "8 Weeks",
    daysPerWeek: 4,
    goal: "Faster 5K",
    image: programRunning,
    summary:
      "Eight weeks of 5K-specific work: intervals, tempos, long runs and one weekly strength session to bulletproof the legs.",
    weeklySchedule: [
      { day: "Monday", session: "Strength for Runners" },
      { day: "Tuesday", session: "Intervals (800s)" },
      { day: "Wednesday", session: "Easy Run" },
      { day: "Thursday", session: "Tempo Run" },
      { day: "Friday", session: "Rest" },
      { day: "Saturday", session: "Long Run" },
      { day: "Sunday", session: "Recovery Walk" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Strength for Runners",
        focus: "Single-leg strength + calves to bulletproof the legs",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "90 sec" },
          { name: "Walking Lunge", sets: "3", reps: "12/side", rest: "60 sec" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Intervals",
        focus: "800 m repeats @ 5K pace",
        exercises: [
          { name: "Warm-Up Jog (Zone 2)", sets: "1", reps: "10 min easy", rest: "-" },
          { name: "Treadmill Run (Zone 5)", sets: "6", reps: "800 m @ 5K pace", rest: "2 min jog" },
          { name: "Cool-Down Jog", sets: "1", reps: "10 min easy", rest: "-" },
        ],
      },
      {
        day: "Day 3",
        title: "Easy Run",
        focus: "Zone 2 aerobic base",
        exercises: [
          {
            name: "Treadmill Run (Zone 2, conversational)",
            sets: "1",
            reps: "35-45 min",
            rest: "-",
          },
        ],
      },
      {
        day: "Day 4",
        title: "Tempo Run",
        focus: "Lactate threshold · comfortably hard",
        exercises: [
          { name: "Warm-Up Jog", sets: "1", reps: "10 min easy", rest: "-" },
          {
            name: "Treadmill Run (Zone 4)",
            sets: "1",
            reps: "20-25 min at threshold pace",
            rest: "-",
          },
          { name: "Cool-Down Jog", sets: "1", reps: "10 min easy", rest: "-" },
        ],
      },
      {
        day: "Day 6",
        title: "Long Run",
        focus: "Endurance base · builds 1-2 km per week",
        exercises: [
          {
            name: "Treadmill Run (Zone 2)",
            sets: "1",
            reps: "60-90 min at conversational pace",
            rest: "-",
          },
        ],
      },
    ],
  }),

  // HOME TRAINING (+2)
  buildProgram({
    slug: "home-dumbbell-only-6-week",
    title: "Dumbbell-Only: 6-Week Full Body Build",
    tagline: "One pair of dumbbells. Six weeks. Real results.",
    category: "Home Training",
    level: "Beginner",
    duration: "6 Weeks",
    daysPerWeek: 4,
    goal: "Lean muscle anywhere",
    image: programHomeDumbbell,
    summary:
      "Four short sessions a week using nothing but a single adjustable dumbbell pair. Every exercise pulled from the Onyx home library.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Push" },
      { day: "Tuesday", session: "Lower" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Upper Pull" },
      { day: "Friday", session: "Full Body" },
      { day: "Saturday", session: "Walk" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Push",
        focus: "Chest, shoulders, triceps with one dumbbell pair",
        exercises: [
          { name: "Dumbbell Bench Press", sets: "4", reps: "10", rest: "75 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "75 sec" },
          { name: "Dumbbell Lateral Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Push Ups", sets: "3", reps: "AMRAP", rest: "60 sec" },
          { name: "Overhead Dumbbell Triceps Extension", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower",
        focus: "Squat, hinge, unilateral quad/glute",
        exercises: [
          { name: "DB Goblet Squat", sets: "4", reps: "10", rest: "90 sec" },
          { name: "DB Romanian Deadlift", sets: "4", reps: "10", rest: "90 sec" },
          { name: "DB Reverse Lunge", sets: "3", reps: "10/leg", rest: "60 sec" },
          { name: "DB Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "60 sec" },
          { name: "Standing Calf Raise (DB)", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Upper Pull",
        focus: "Back and biceps · use a sturdy table for rows",
        exercises: [
          { name: "1-Arm DB Row", sets: "4", reps: "10/side", rest: "75 sec" },
          { name: "DB Bent Over Row (both arms)", sets: "3", reps: "10", rest: "75 sec" },
          { name: "DB Rear Delt Fly", sets: "3", reps: "12", rest: "45 sec" },
          { name: "DB Bicep Curl", sets: "3", reps: "10", rest: "45 sec" },
          { name: "DB Hammer Curl", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Full Body",
        focus: "Compound circuit · full-body pump",
        exercises: [
          { name: "DB Thruster (squat to press)", sets: "4", reps: "10", rest: "75 sec" },
          { name: "Renegade Row", sets: "3", reps: "8/side", rest: "60 sec" },
          { name: "DB Romanian Deadlift", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Push Ups", sets: "3", reps: "AMRAP", rest: "60 sec" },
          { name: "DB Farmer Carry", sets: "3", reps: "40 m", rest: "60 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "home-resistance-band-8-week",
    title: "Resistance Band Build: 8-Week Travel Plan",
    tagline: "A set of bands and 30 minutes. That's it.",
    category: "Home Training",
    level: "Beginner",
    duration: "8 Weeks",
    daysPerWeek: 4,
    goal: "Maintain on the road",
    image: programHomeBands,
    summary:
      "Designed for travel - every session uses only loop and tube bands. Anchor to a door, a sturdy post, or your own foot.",
    weeklySchedule: [
      { day: "Monday", session: "Push + Core" },
      { day: "Tuesday", session: "Pull + Lower" },
      { day: "Wednesday", session: "Rest" },
      { day: "Thursday", session: "Push + Core" },
      { day: "Friday", session: "Full Body Circuit" },
      { day: "Saturday", session: "Walk" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Push + Core",
        focus: "Anchor the band to a door for pressing",
        exercises: [
          { name: "Band Chest Press", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Band Overhead Press", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Band Triceps Pushdown", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Band Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Starfish Sit Ups Easy", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Pull + Lower",
        focus: "Row from the door anchor + banded squats",
        exercises: [
          { name: "Banded Row (door anchor)", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Banded Front Squat", sets: "4", reps: "12", rest: "60 sec" },
          { name: "Banded Romanian Deadlift", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Banded Face Pull", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Banded Bicep Curl", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Push + Core (variation)",
        focus: "Slower tempo pressing, higher volume core",
        exercises: [
          {
            name: "Banded Push Ups (band across upper back)",
            sets: "4",
            reps: "12",
            rest: "60 sec",
          },
          { name: "Band Overhead Press (split stance)", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Band Chest Fly", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Reverse Crunch", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Bicycle Crunches Easy", sets: "3", reps: "20/side", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Full Body Circuit",
        focus: "5 rounds · 45 sec on / 15 sec off per movement",
        exercises: [
          { name: "- 5 Rounds -", sets: "", reps: "", rest: "" },
          { name: "Banded Front Squat", sets: "5", reps: "45 sec", rest: "15 sec" },
          { name: "Banded Row", sets: "5", reps: "45 sec", rest: "15 sec" },
          { name: "Banded Push Press", sets: "5", reps: "45 sec", rest: "15 sec" },
          { name: "Banded Romanian Deadlift", sets: "5", reps: "45 sec", rest: "15 sec" },
          { name: "Mountain Climbers", sets: "5", reps: "45 sec", rest: "60 sec (end of round)" },
        ],
      },
    ],
  }),

  // HYROX (+2)
  buildProgram({
    slug: "hyrox-doubles-6-week",
    title: "Hyrox Doubles: 6-Week Partner Prep",
    tagline: "Race-prep block built for the doubles division.",
    category: "Hyrox",
    level: "Intermediate",
    duration: "6 Weeks",
    daysPerWeek: 5,
    goal: "Hyrox doubles ready",
    image: programHyroxDoublesAsset.url,
    summary:
      "Compromised running, station handoffs, and pace rehearsal for the doubles format. Trains both partners independently and together.",
    weeklySchedule: [
      { day: "Monday", session: "Run + Sled" },
      { day: "Tuesday", session: "Strength" },
      { day: "Wednesday", session: "Row + Burpee" },
      { day: "Thursday", session: "Long Easy Run" },
      { day: "Friday", session: "Handoff Sim" },
      { day: "Saturday", session: "Mobility" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Run + Sled (Doubles Style)",
        focus: "Partner A runs while Partner B pushes · 5 rounds",
        exercises: [
          { name: "- 5 Rounds · switch after each rep -", sets: "", reps: "", rest: "" },
          { name: "Treadmill Run (Partner A)", sets: "5", reps: "1 km", rest: "-" },
          {
            name: "Sled Push (Partner B, heavy)",
            sets: "5",
            reps: "50 m",
            rest: "60 sec (both rest before switching)",
          },
        ],
      },
      {
        day: "Day 2",
        title: "Strength",
        focus: "Lower + carry base · trained solo",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "5 @ RPE 8", rest: "3 min" },
          { name: "Walking Lunge", sets: "4", reps: "20/side", rest: "90 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "8", rest: "2 min" },
          { name: "Farmer Carry (heavy)", sets: "4", reps: "40 m", rest: "60 sec" },
          { name: "Weighted Pull Up (or Pull Up)", sets: "3", reps: "6-8", rest: "90 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Row + Burpee (Doubles)",
        focus: "Partners alternate 250 m rows · 6 rounds",
        exercises: [
          {
            name: "- 6 Rounds ·  Partner A rows while Partner B burpees, then switch -",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Rowing Machine (Partner A)", sets: "6", reps: "250 m all-out", rest: "-" },
          {
            name: "Burpee Broad Jump (Partner B)",
            sets: "6",
            reps: "10 while partner rows",
            rest: "60 sec (end of round)",
          },
        ],
      },
      {
        day: "Day 4",
        title: "Long Easy Run",
        focus: "Zone 2 aerobic base · run together at conversational pace",
        exercises: [
          {
            name: "Treadmill Run or Outdoor Run (Zone 2)",
            sets: "1",
            reps: "45-60 min",
            rest: "-",
          },
        ],
      },
      {
        day: "Day 5",
        title: "Handoff Sim (Race Rehearsal)",
        focus: "Doubles pacing · alternate every 100 reps or 50 m",
        exercises: [
          { name: "- 1 Round For Time · practice handoffs -", sets: "", reps: "", rest: "" },
          { name: "Treadmill Run (Partner A)", sets: "1", reps: "1 km", rest: "-" },
          { name: "Wall Balls (split at 50/50)", sets: "1", reps: "100", rest: "-" },
          { name: "Treadmill Run (Partner B)", sets: "1", reps: "1 km", rest: "-" },
          { name: "Sled Push (split at 25 m each)", sets: "1", reps: "50 m", rest: "-" },
          { name: "Treadmill Run (either)", sets: "1", reps: "1 km", rest: "-" },
          { name: "Burpee Broad Jump (split at 50/50)", sets: "1", reps: "40", rest: "-" },
        ],
      },
    ],
  }),

  // STRENGTH (paid), fills the Strength category with two premium programs
  buildProgram({
    slug: "strength-5-3-1-10-week",
    title: "Onyx 5/3/1: 10-Week Strength Cycle",
    tagline: "Wave-loaded 5/3/1 built around squat, bench, deadlift and overhead press.",
    category: "Strength",
    level: "Intermediate",
    duration: "10 Weeks",
    daysPerWeek: 4,
    goal: "Add real weight to the big four lifts",
    image: programOnyx531Asset.url,
    summary:
      "A four-day upper/lower rotation built on the 5/3/1 template. Each main lift waves through 5s, 3s and 1+ AMRAP weeks at a percentage of your Training Max, then deloads. Chest+shoulders share the pressing day, back+biceps share the pull day, and every session opens with a called RPE target so you never grind a bad day.",
    trainingOverview:
      "Four training days per week: Squat, Bench, Deadlift, Overhead Press each get their own main day. Weeks cycle 5s (RPE 7), 3s (RPE 8), 5/3/1+ AMRAP (RPE 9 on the top set), then deload. Assistance work stays in the 8-12 rep range at RPE 7-8 so recovery holds up.",
    progression:
      "Week 1: 65/75/85% x5 · Week 2: 70/80/90% x3 · Week 3: 75/85/95% x5/3/1+ AMRAP · Week 4 deload. Repeat the wave, add 2.5 kg (upper) / 5 kg (lower) to your Training Max each cycle. If the AMRAP set drops below the target, hold the TM the next cycle.",
    weeklySchedule: [
      { day: "Monday", session: "Squat Day + Lower Accessories" },
      { day: "Tuesday", session: "Bench Day - Chest + Shoulders + Triceps" },
      { day: "Wednesday", session: "Rest / Walk 8k" },
      { day: "Thursday", session: "Deadlift Day + Lower Accessories" },
      { day: "Friday", session: "Overhead Day - Back + Biceps" },
      { day: "Saturday", session: "Optional Arms + Core Pump" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Squat Day",
        focus: "Main squat + quad/glute accessories",
        exercises: [
          { name: "- Main lift (5/3/1 wave) -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Back Squat",
            sets: "3",
            reps: "5 → 3 → 1+ (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          {
            name: "Smith Machine Reverse Lunge",
            sets: "3",
            reps: "10/leg @ RPE 8",
            rest: "90 sec",
          },
          { name: "Leg Press", sets: "3", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12 @ RPE 8", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "12", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Bench Day - Chest + Shoulders + Triceps",
        focus: "Main press + upper push",
        exercises: [
          { name: "- Main lift (5/3/1 wave) -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Bench Press",
            sets: "3",
            reps: "5 → 3 → 1+ (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Incline Dumbbell Bench Press", sets: "4", reps: "8 @ RPE 8", rest: "90 sec" },
          { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Cable Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Cable Tricep Pushdown", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Deadlift Day",
        focus: "Main pull + posterior chain",
        exercises: [
          { name: "- Main lift (5/3/1 wave) -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Deadlift",
            sets: "3",
            reps: "5 → 3 → 1+ (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3-4 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "3", reps: "8 @ RPE 8", rest: "2 min" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg @ RPE 8", rest: "90 sec" },
          { name: "Cable Pull Through", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Sit Ups", sets: "3", reps: "20", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Overhead Day - Back + Biceps",
        focus: "Main overhead + pulling",
        exercises: [
          { name: "- Main lift (5/3/1 wave) -", sets: "", reps: "", rest: "" },
          {
            name: "Standing Overhead Press",
            sets: "3",
            reps: "5 → 3 → 1+ (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Barbell Bent Over Row", sets: "4", reps: "6 @ RPE 8", rest: "2 min" },
          { name: "Lat Pulldown Wide Grip", sets: "3", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Chest Supported Row Machine", sets: "3", reps: "10", rest: "60 sec" },
          { name: "Dumbbell Bicep Curl", sets: "3", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Face Pull", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Optional Arms + Core Pump",
        focus: "Skip on deload week or if fatigued",
        exercises: [
          { name: "EZ Bar Curl", sets: "4", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Skull Crusher", sets: "4", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Cable Bicep Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Overhead Tricep Extension", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Cable Lateral Raise", sets: "3", reps: "15", rest: "45 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
    ],
  }),
  buildProgram({
    slug: "strength-upper-lower-12-week",
    title: "Strength Upper/Lower: 12-Week Progressive Overload",
    tagline: "Four-day upper/lower with RPE-progressed main lifts and dedicated accessory pumps.",
    category: "Strength",
    level: "Intermediate",
    duration: "12 Weeks",
    daysPerWeek: 4,
    goal: "Get stronger and add lean muscle at the same time",
    image: programStrengthUpperLowerAsset.url,
    summary:
      "A 12-week upper/lower split with two heavy days and two volume days. Main lifts climb an RPE ladder every three weeks - RPE 7 → 8 → 9 → deload - so loads rise honestly without grinding. Chest+shoulders together on push days, back+biceps together on pull days, plus an optional weekend arms + core session.",
    trainingOverview:
      "Two heavy days (Upper Heavy, Lower Heavy) drive strength on the main lifts. Two volume days (Upper Volume, Lower Volume) drive hypertrophy with dumbbells, cables and machines. Every third week peaks intensity, then week 4 of each block is a deload.",
    progression:
      "3-week waves for 4 total blocks. Wave 1: RPE 7 (base). Wave 2: RPE 8 (build). Wave 3: RPE 9 top set + backoffs. Wave 4: deload week (60% loads, half the sets). Add 2.5 kg (upper) / 5 kg (lower) to the main lifts every completed wave.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Heavy - Chest + Shoulders + Triceps" },
      { day: "Tuesday", session: "Lower Heavy - Squat Focus" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Upper Volume - Back + Biceps" },
      { day: "Friday", session: "Lower Volume - Hinge + Glutes" },
      { day: "Saturday", session: "Optional Arms + Core" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Heavy - Chest + Shoulders + Triceps",
        focus: "Bench top set + pressing accessories",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Bench Press",
            sets: "4",
            reps: "5 (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Seated Dumbbell Shoulder Press", sets: "4", reps: "8 @ RPE 8", rest: "90 sec" },
          { name: "Incline Dumbbell Bench Press", sets: "3", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Cable Chest Fly", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Dumbbell Lateral Raise", sets: "4", reps: "15", rest: "45 sec" },
          { name: "Skull Crusher", sets: "3", reps: "10", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Heavy - Squat Focus",
        focus: "Squat top set + quad work",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Back Squat",
            sets: "4",
            reps: "5 (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          {
            name: "Smith Machine Reverse Lunge",
            sets: "3",
            reps: "10/leg @ RPE 8",
            rest: "90 sec",
          },
          { name: "Leg Press", sets: "3", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Leg Extension", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Upper Volume - Back + Biceps",
        focus: "Pump-focused pulling",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Bent Over Row",
            sets: "4",
            reps: "6 (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "2 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Lat Pulldown Wide Grip", sets: "4", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Chest Supported Row Machine", sets: "3", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Straight Arm Cable Pulldown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Dumbbell Bicep Curl", sets: "3", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Cable Bicep Curl", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Lower Volume - Hinge + Glutes",
        focus: "Deadlift top set + posterior chain",
        exercises: [
          { name: "- Main lift -", sets: "", reps: "", rest: "" },
          {
            name: "Barbell Deadlift",
            sets: "4",
            reps: "3 (RPE 7 → 8 → 9, Wk4 deload)",
            rest: "3-4 min",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Romanian Deadlift", sets: "4", reps: "8 @ RPE 8", rest: "2 min" },
          { name: "Barbell Hip Thrust", sets: "3", reps: "10 @ RPE 8", rest: "90 sec" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "90 sec" },
          { name: "Seated Leg Curl", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: "Day 5",
        title: "Optional Arms + Core",
        focus: "Skip during deload week or if fatigued",
        exercises: [
          { name: "EZ Bar Curl", sets: "4", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Overhead Tricep Extension", sets: "4", reps: "10 @ RPE 8", rest: "60 sec" },
          { name: "Dumbbell Hammer Curl", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Cable Tricep Pushdown", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Side Crunches", sets: "3", reps: "15/side", rest: "45 sec" },
          { name: "Kneeling Cable Crunch", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
    ],
  }),
];

programs.push(...extraPremium);

programs.push(...freeSamplers, ...morePremium);

// ------------------------------------------------------------
// BODYWEIGHT-ONLY HOME PROGRAMS
// Zero equipment. One free 1-week on-ramp + one full 8-week build.
// ------------------------------------------------------------
const bodyweightHomePrograms: Program[] = [
  buildProgram({
    slug: "free-bodyweight-home-1-week",
    title: "Free 1-Week Bodyweight Home Plan",
    tagline: "No equipment. No excuses. Four short sessions a week you can run in a hotel room.",
    category: "Home Training",
    level: "Beginner",
    duration: "1 Week",
    daysPerWeek: 4,
    goal: "Build a bodyweight base at home",
    image: programBeginnerBodyweightAsset.url,
    summary:
      "Four 25-35 minute sessions using nothing but your own bodyweight and the floor. Push/pull-style split with a lower day and a full-body finisher. This one-week sampler grooves the movement pattern and stops every set 2-3 reps shy of failure.",
    progression:
      "Groove the pattern this week, stop 2-3 reps shy of failure on every set, and focus on tempo and full range of motion. If every set felt in control, add 1-2 reps per set next time you run the session. This is the on-ramp, the 8-Week Bodyweight Home Build takes over from here.",
    isFree: true,
    price: "Grátis",
    weeklySchedule: [
      { day: "Monday", session: "Upper Push + Core" },
      { day: "Tuesday", session: "Lower Body + Glutes" },
      { day: "Wednesday", session: "Rest / Walk" },
      { day: "Thursday", session: "Upper Pull + Core" },
      { day: "Friday", session: "Full-Body Circuit" },
      { day: "Saturday", session: "Optional Walk 30-45 min" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Push + Core",
        focus: "Push patterns from the floor",
        exercises: [
          { name: "- Warm-up -", sets: "", reps: "", rest: "" },
          { name: "Mountain Climbers", sets: "2", reps: "30 sec", rest: "30 sec" },
          { name: "- Main work -", sets: "", reps: "", rest: "" },
          { name: "Push Up On Toes", sets: "4", reps: "8-12", rest: "75 sec" },
          { name: "Diamond Push Ups", sets: "3", reps: "6-10", rest: "75 sec" },
          { name: "Wide Push Ups", sets: "3", reps: "10-12", rest: "60 sec" },
          {
            name: "Bench Tricep Dips",
            sets: "3",
            reps: "10-12 (use a chair or couch edge)",
            rest: "60 sec",
          },
          { name: "- Core finisher -", sets: "", reps: "", rest: "" },
          { name: "Scissor Leg Lift", sets: "3", reps: "20", rest: "45 sec" },
          { name: "Slow Mountain Climbers", sets: "3", reps: "20 total", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Body + Glutes",
        focus: "Squat, lunge, single-leg",
        exercises: [
          { name: "- Warm-up -", sets: "", reps: "", rest: "" },
          { name: "Bodyweight Squats", sets: "2", reps: "15 (slow tempo)", rest: "30 sec" },
          { name: "- Main work -", sets: "", reps: "", rest: "" },
          { name: "Bodyweight Squats", sets: "4", reps: "15-20 (3-sec eccentric)", rest: "75 sec" },
          {
            name: "Alternating Bodyweight Reverse Lunges",
            sets: "3",
            reps: "10/leg",
            rest: "75 sec",
          },
          {
            name: "Bodyweight Bulgarian Squats",
            sets: "3",
            reps: "8-10/leg (rear foot on chair)",
            rest: "60 sec",
          },
          {
            name: "Single-Leg Bodyweight Glute Bridge",
            sets: "3",
            reps: "12/side (2-sec squeeze at top)",
            rest: "45 sec",
          },
          { name: "Standing Bodyweight Calve Raises", sets: "3", reps: "20", rest: "30 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Upper Pull + Core",
        focus: "Pulling patterns without a bar",
        exercises: [
          { name: "- Warm-up -", sets: "", reps: "", rest: "" },
          { name: "Superman", sets: "2", reps: "10 (1-sec hold at top)", rest: "30 sec" },
          { name: "- Main work -", sets: "", reps: "", rest: "" },
          { name: "Superman", sets: "4", reps: "12 (2-sec hold)", rest: "45 sec" },
          { name: "Reverse Snow Angels", sets: "3", reps: "12 (slow, floor)", rest: "45 sec" },
          { name: "Prone Y-Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Plank With Shoulder Tap", sets: "3", reps: "20 total taps", rest: "45 sec" },
          { name: "- Core finisher -", sets: "", reps: "", rest: "" },
          { name: "Reverse Crunch", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Side Plank", sets: "3", reps: "30 sec/side", rest: "30 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Full-Body Circuit",
        focus: "Conditioning + full-body strength",
        exercises: [
          {
            name: "- Circuit: 4 rounds, 45 sec work / 20 sec rest -",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Bodyweight Squats", sets: "4", reps: "45 sec", rest: "20 sec" },
          { name: "Push Up On Toes", sets: "4", reps: "45 sec", rest: "20 sec" },
          {
            name: "Alternating Bodyweight Reverse Lunges",
            sets: "4",
            reps: "45 sec",
            rest: "20 sec",
          },
          { name: "Mountain Climbers", sets: "4", reps: "45 sec", rest: "20 sec" },
          { name: "Plank", sets: "4", reps: "45 sec", rest: "60 sec between rounds" },
        ],
      },
    ],
  }),

  buildProgram({
    slug: "home-bodyweight-only-8-week",
    title: "Bodyweight-Only: 8-Week Home Build",
    tagline:
      "Zero equipment. Eight weeks. A real strength and conditioning block you can run anywhere.",
    category: "Home Training",
    level: "Beginner",
    duration: "8 Weeks",
    daysPerWeek: 5,
    goal: "Build strength, muscle and conditioning with zero equipment",
    image: programBeginnerBodyweightAsset.url,
    summary:
      "Five short sessions a week, Push, Lower, Pull, Full-Body Circuit and a Core + Conditioning finisher, built entirely from the Onyx bodyweight library. Loads rise honestly through added reps, slower tempos and harder push-up / squat variations rather than added weight.",
    trainingOverview:
      "Two strength-biased days (Upper Push, Lower Body) drive skill and strength on the hardest bodyweight patterns. Two volume days (Upper Pull + Core, Full-Body Circuit) drive hypertrophy and work capacity. A short Core + Conditioning finisher on day 5 caps the week without stealing recovery.",
    progression:
      "Weeks 1-3 · groove the pattern with 2-3 reps in reserve, add 1 rep per set as the week climbs. Week 4 · deload (cut every set to about 60% of your Week 3 reps, half effort). Weeks 5-7 · repeat the ramp with +2 reps per set vs Wave 1. Week 8 · deload + retest your max push-up and squat on the final session. Move up a harder variation (Push Up On Knees → On Toes → Diamond → Deficit) any time a set exceeds 15 clean reps.",
    weeklySchedule: [
      { day: "Monday", session: "Upper Push + Core" },
      { day: "Tuesday", session: "Lower Body + Glutes" },
      { day: "Wednesday", session: "Rest / Walk 30-45 min" },
      { day: "Thursday", session: "Upper Pull + Core" },
      { day: "Friday", session: "Full-Body Circuit" },
      { day: "Saturday", session: "Core + Conditioning Finisher" },
      { day: "Sunday", session: "Rest" },
    ],
    workouts: [
      {
        day: "Day 1",
        title: "Upper Push + Core",
        focus: "Push patterns · add reps as you get stronger",
        exercises: [
          { name: "- Warm-up -", sets: "", reps: "", rest: "" },
          { name: "Mountain Climbers", sets: "2", reps: "30 sec", rest: "30 sec" },
          { name: "Push Up On Knees", sets: "2", reps: "10 (primer)", rest: "30 sec" },
          { name: "- Main work -", sets: "", reps: "", rest: "" },
          {
            name: "Push Up On Toes",
            sets: "4",
            reps: "8-15 (stop 2 shy of failure)",
            rest: "90 sec",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Diamond Push Ups", sets: "3", reps: "6-10", rest: "75 sec" },
          { name: "Wide Push Ups", sets: "3", reps: "10-12", rest: "60 sec" },
          { name: "Advanced Tricep Bench Dips", sets: "3", reps: "10-12", rest: "60 sec" },
          {
            name: "Pike Push Ups",
            sets: "3",
            reps: "6-10 (feet elevated for overhead)",
            rest: "60 sec",
          },
          { name: "- Core finisher -", sets: "", reps: "", rest: "" },
          { name: "Plank", sets: "3", reps: "45-60 sec", rest: "45 sec" },
          { name: "Plank With Shoulder Tap", sets: "3", reps: "20 total taps", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Lower Body + Glutes",
        focus: "Squat + single-leg · add reps as you get stronger",
        exercises: [
          { name: "- Warm-up -", sets: "", reps: "", rest: "" },
          { name: "Bodyweight Squats", sets: "2", reps: "15 (slow tempo)", rest: "30 sec" },
          {
            name: "Banded Side Steps",
            sets: "2",
            reps: "15/side (bodyweight walk if no band)",
            rest: "30 sec",
          },
          { name: "- Main work -", sets: "", reps: "", rest: "" },
          {
            name: "Bodyweight Squats",
            sets: "4",
            reps: "15-25 (3-sec eccentric + 2-sec pause)",
            rest: "90 sec",
          },
          { name: "- Accessories -", sets: "", reps: "", rest: "" },
          { name: "Bodyweight Bulgarian Squats", sets: "3", reps: "8-12/leg", rest: "75 sec" },
          {
            name: "Alternating Bodyweight Reverse Lunges",
            sets: "3",
            reps: "10/leg",
            rest: "75 sec",
          },
          {
            name: "Step-Ups Bodyweight",
            sets: "3",
            reps: "10/leg (use a sturdy chair)",
            rest: "60 sec",
          },
          {
            name: "Single-Leg Bodyweight Glute Bridge",
            sets: "3",
            reps: "12/side (2-sec squeeze at top)",
            rest: "45 sec",
          },
          { name: "Standing Bodyweight Calve Raises", sets: "4", reps: "20", rest: "30 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Upper Pull + Core",
        focus: "Pulling patterns without a bar + midline",
        exercises: [
          { name: "- Warm-up -", sets: "", reps: "", rest: "" },
          { name: "Superman", sets: "2", reps: "10 (1-sec hold)", rest: "30 sec" },
          { name: "- Main work -", sets: "", reps: "", rest: "" },
          { name: "Superman", sets: "4", reps: "12-15 (2-3-sec hold at top)", rest: "60 sec" },
          { name: "Reverse Snow Angels", sets: "3", reps: "12 slow (floor)", rest: "45 sec" },
          { name: "Prone Y-Raise", sets: "3", reps: "12", rest: "45 sec" },
          { name: "Prone T-Raise", sets: "3", reps: "12", rest: "45 sec" },
          {
            name: "Bird Dog",
            sets: "3",
            reps: "10/side (2-sec pause at extension)",
            rest: "45 sec",
          },
          { name: "- Core finisher -", sets: "", reps: "", rest: "" },
          { name: "Reverse Crunch", sets: "3", reps: "12-15", rest: "45 sec" },
          { name: "Side Plank", sets: "3", reps: "30-45 sec/side", rest: "30 sec" },
        ],
      },
      {
        day: "Day 4",
        title: "Full-Body Circuit",
        focus: "Density + conditioning",
        exercises: [
          {
            name: "- Circuit: 5 rounds, 40 sec work / 20 sec rest, 90 sec between rounds -",
            sets: "",
            reps: "",
            rest: "",
          },
          { name: "Bodyweight Squats", sets: "5", reps: "40 sec (steady tempo)", rest: "20 sec" },
          {
            name: "Push Up On Toes",
            sets: "5",
            reps: "40 sec (drop to knees to keep the tempo)",
            rest: "20 sec",
          },
          {
            name: "Alternating Bodyweight Reverse Lunges",
            sets: "5",
            reps: "40 sec",
            rest: "20 sec",
          },
          { name: "Mountain Climbers", sets: "5", reps: "40 sec", rest: "20 sec" },
          { name: "Leg Raise Hip Lift", sets: "5", reps: "12", rest: "90 sec between rounds" },
        ],
      },
      {
        day: "Day 5",
        title: "Core + Conditioning Finisher",
        focus: "Short, sharp cap on the week, skip on deload weeks (4 & 8)",
        exercises: [
          { name: "- Core circuit · 3 rounds -", sets: "", reps: "", rest: "" },
          { name: "Hanging Knee Raise", sets: "3", reps: "12", rest: "30 sec" },
          { name: "Side Plank", sets: "3", reps: "30 sec/side", rest: "30 sec" },
          { name: "Reverse Crunch", sets: "3", reps: "12-15", rest: "30 sec" },
          { name: "Bird Dog", sets: "3", reps: "10/side", rest: "30 sec" },
          { name: "- EMOM 10 min · alternate every minute -", sets: "", reps: "", rest: "" },
          { name: "Mountain Climbers", sets: "5", reps: "30 sec on the minute", rest: "30 sec" },
          {
            name: "Bodyweight Squats",
            sets: "5",
            reps: "15 reps on the minute",
            rest: "rest of minute",
          },
        ],
      },
    ],
  }),
];

programs.push(...bodyweightHomePrograms);

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export const programCategories: ProgramCategory[] = [
  "Strength",
  "Hypertrophy",
  "Bodybuilding",
  "Fat Loss",
  "Powerlifting",
  "Strongman",
  "Endurance",
  "Home Training",
  "Women",
  "Beginner",
  "Hyrox",
];
