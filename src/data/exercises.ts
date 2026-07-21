export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Mechanics = "Compound" | "Isolation";
export type ForceType = "Push" | "Pull" | "Static" | "Hinge";
export type ExerciseType = "Strength" | "Cardio" | "Mobility" | "Power";

export type MuscleGroup =
  | "Hamstrings"
  | "Glutes"
  | "Quads"
  | "Calves"
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Core"
  | "Forearms"
  | "Full Body"
  | "Cardio";

export type Category =
  | "Home Gym"
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Quads"
  | "Glutes & Hamstrings"
  | "Calves"
  | "Core"
  | "Cardio & Conditioning"
  | "Hyrox"
  | "Yoga & Stretching";

export interface CategoryInfo {
  id: Category;
  label: string;
  blurb: string;
  /** Optional MP4 / WebM URL - when present the category panel autoplays this. */
  videoUrl?: string;
  /** Poster image used while the video loads (or as a fallback when no video). */
  poster?: string;
  accent: string; // tailwind class fragment for the colored chip
}

export const categories: CategoryInfo[] = [
  {
    id: "Home Gym",
    label: "Home Gym",
    blurb: "Train anywhere - bodyweight, bands and a single dumbbell.",
    accent: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  },
  {
    id: "Chest",
    label: "Chest",
    blurb: "Press, fly and push every angle of the pecs.",
    accent: "bg-red-400/10 text-red-300 border-red-400/30",
  },
  {
    id: "Back",
    label: "Back",
    blurb: "Build width and thickness with pulls, rows and hinges.",
    accent: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  },
  {
    id: "Shoulders",
    label: "Shoulders",
    blurb: "Caps, rear delts and overhead pressing strength.",
    accent: "bg-yellow-400/10 text-yellow-300 border-yellow-400/30",
  },
  {
    id: "Biceps",
    label: "Biceps",
    blurb: "Every curl pattern to grow the long and short head.",
    accent: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  },
  {
    id: "Triceps",
    label: "Triceps",
    blurb: "Pushdowns, extensions and close-grip pressing.",
    accent: "bg-orange-400/10 text-orange-300 border-orange-400/30",
  },
  {
    id: "Quads",
    label: "Quads",
    blurb: "Squat patterns, lunges and unilateral leg work.",
    accent: "bg-purple-400/10 text-purple-300 border-purple-400/30",
  },
  {
    id: "Glutes & Hamstrings",
    label: "Glutes & Hammies",
    blurb: "Hinge, bridge and abduct to develop the posterior chain.",
    accent: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  {
    id: "Calves",
    label: "Calves",
    blurb: "Standing and seated raises for soleus + gastroc.",
    accent: "bg-zinc-400/10 text-zinc-300 border-zinc-400/30",
  },
  {
    id: "Core",
    label: "Core",
    blurb: "Crunches, planks, raises and rotation - our biggest category.",
    accent: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  },
  {
    id: "Cardio & Conditioning",
    label: "Cardio",
    blurb: "Treadmill, bike, rower and machine conditioning.",
    accent: "bg-green-400/10 text-green-300 border-green-400/30",
  },
  {
    id: "Hyrox",
    label: "Hyrox / Functional",
    blurb: "Sleds, ropes, burpees and box jumps - race-prep work.",
    accent: "bg-orange-400/10 text-orange-300 border-orange-400/30",
  },
  {
    id: "Yoga & Stretching",
    label: "Yoga & Stretching",
    blurb: "Quiet poses and deep stretches for flexibility and recovery.",
    accent: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  },
];

export interface Exercise {
  slug: string;
  name: string;
  category: Category;
  shortDescription: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  exerciseType: ExerciseType;
  equipment: string;
  mechanics: Mechanics;
  forceType: ForceType;
  level: Difficulty;
  videoUrl?: string;
  thumbnailUrl?: string;
  overview: string;
  steps: { title: string; body: string }[];
  proTips: string[];
  commonMistakes: string[];
  alternatives: string[];
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const inferEquipment = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("smith")) return "Smith Machine";
  if (n.includes("barbell")) return "Barbell";
  if (n.includes("dumbbell")) return "Dumbbell";
  if (n.includes("cable")) return "Cable";
  if (n.includes("machine")) return "Machine";
  if (n.includes("band")) return "Resistance Band";
  if (n.includes("rope") && !n.includes("battle")) return "Cable";
  if (n.includes("battle rope")) return "Battle Rope";
  if (n.includes("bosu")) return "Bosu Ball";
  if (n.includes("sled")) return "Sled";
  if (n.includes("box jump")) return "Plyo Box";
  if (n.includes("treadmill")) return "Treadmill";
  if (n.includes("cycle") || n.includes("bike")) return "Stationary Bike";
  if (n.includes("rowing")) return "Rowing Machine";
  if (n.includes("stair")) return "Stair Climber";
  if (n.includes("cross trainer") || n.includes("elliptical")) return "Cross Trainer";
  if (n.includes("hanging")) return "Pull-up Bar";
  if (n.includes("pull up") || n.includes("chin up")) return "Pull-up Bar";
  if (n.includes("bench")) return "Bench";
  return "Bodyweight";
};

const inferLevel = (name: string): Difficulty => {
  const n = name.toLowerCase();
  if (
    n.includes("advanced") ||
    n.includes("hard") ||
    n.includes("weighted") ||
    n.includes("pistol")
  )
    return "Advanced";
  if (
    n.includes("easy") ||
    n.includes("assisted") ||
    n.includes("on knees") ||
    n.includes("beginner")
  )
    return "Beginner";
  return "Intermediate";
};

interface Mini {
  name: string;
  primary: MuscleGroup;
  secondary?: MuscleGroup[];
  type?: ExerciseType;
  mechanics?: Mechanics;
  force?: ForceType;
  level?: Difficulty;
}

const forceVerb = (f: ForceType) => {
  switch (f) {
    case "Push":
      return "press";
    case "Pull":
      return "pull";
    case "Hinge":
      return "hinge";
    case "Static":
      return "hold";
  }
};

const make = (m: Mini, category: Category): Exercise => {
  const equipment = inferEquipment(m.name);
  const force = m.force ?? "Push";
  const type = m.type ?? "Strength";
  const mechanics = m.mechanics ?? "Compound";
  const primary = m.primary;
  const verb = forceVerb(force);

  const overview =
    type === "Cardio"
      ? `${m.name} is a conditioning movement that elevates heart rate and trains the ${primary.toLowerCase()} for sustained output. Use it for steady-state work, intervals, or as a warm-up to prime the body for heavier training.`
      : `${m.name} is a ${mechanics.toLowerCase()} ${verb} that primarily develops the ${primary.toLowerCase()}${m.secondary && m.secondary.length ? ` while recruiting the ${m.secondary.map((s) => s.toLowerCase()).join(" and ")}` : ""}. Performed with ${equipment.toLowerCase()}, it builds strength, stability and control through a full range of motion when programmed with intent.`;

  const steps =
    type === "Cardio"
      ? [
          {
            title: "Setup",
            body: `Step onto / mount the ${equipment.toLowerCase()} with a tall posture and a relaxed grip. Set a pace you can hold for the full work interval.`,
          },
          {
            title: "Warm-up",
            body: "Spend the first 2–3 minutes building intensity gradually - never start at full effort cold.",
          },
          {
            title: "Work pace",
            body: "Settle into a rhythm where breathing is controlled (nose-in, mouth-out) and form stays clean.",
          },
          {
            title: "Cooldown",
            body: "Reduce intensity for the final minutes and finish with light mobility for the working joints.",
          },
        ]
      : [
          {
            title: "Set up",
            body: `Take a stable stance and grip the ${equipment.toLowerCase()} with the lift positioned over your base of support. Brace the core and pack the shoulders before the first rep.`,
          },
          {
            title: "Initiate the rep",
            body: `Begin the movement by ${force === "Hinge" ? "sending the hips back" : force === "Pull" ? "driving the elbows" : force === "Static" ? "creating full-body tension and holding the position" : "controlling the descent"}, keeping the target muscle (${primary.toLowerCase()}) loaded throughout.`,
          },
          {
            title: "Working range",
            body: `Move through the full available range without losing position. Avoid bouncing out of the stretched position - use a controlled tempo.`,
          },
          {
            title: "Finish the rep",
            body: `${force === "Static" ? "Hold the brace for the prescribed time, then release with control." : `Return to the start position by reversing the movement under control and squeezing the ${primary.toLowerCase()} at the top.`}`,
          },
          {
            title: "Breathing",
            body: "Inhale and brace before the rep, exhale on the hardest portion of the lift.",
          },
        ];

  const proTips =
    type === "Cardio"
      ? [
          "Build duration before intensity - get 20–30 minutes comfortable before pushing pace.",
          "Track heart rate zones to keep easy days easy and hard days hard.",
          "Stay tall through the torso - slumping shortens breathing capacity.",
        ]
      : [
          `Think about the ${primary.toLowerCase()} doing the work, not just moving the load from A to B.`,
          "Match weight to clean technique - leave 1–2 reps in reserve until form is dialed.",
          "Control the eccentric (lowering) phase - that's where the muscle grows.",
          force === "Hinge"
            ? "Keep the bar/dumbbells close to the body to protect the lower back."
            : force === "Pull"
              ? "Initiate every rep with the back, not the biceps."
              : force === "Push"
                ? "Drive through the full foot / planted base, not just the toes."
                : "Brace 360° around the spine - front, sides and back all engaged.",
        ];

  const commonMistakes =
    type === "Cardio"
      ? [
          "Going too hard, too soon - burns out the session early.",
          "Holding the rails for support, which removes the training stimulus.",
          "Skipping the warm-up and cooldown.",
        ]
      : [
          "Using momentum to move the weight instead of muscular tension.",
          "Cutting the range of motion short to handle heavier loads.",
          "Losing the brace or letting the lower back round at the bottom of the rep.",
          force === "Push"
            ? "Flaring the elbows aggressively, stressing the shoulder joint."
            : force === "Pull"
              ? "Shrugging the shoulders to the ears instead of pulling with the lats."
              : force === "Hinge"
                ? "Turning the lift into a squat by bending the knees too much."
                : "Holding your breath - keep airflow controlled.",
        ];

  return {
    slug: slugify(m.name),
    name: m.name,
    category,
    shortDescription: `${m.name} - a ${type.toLowerCase()} movement targeting the ${primary.toLowerCase()}.`,
    primaryMuscle: primary,
    secondaryMuscles: m.secondary ?? [],
    exerciseType: type,
    equipment,
    mechanics,
    forceType: force,
    level: m.level ?? inferLevel(m.name),
    overview,
    steps,
    proTips,
    commonMistakes,
    alternatives: [],
  };
};

// ---------- Hand-authored detail entry ----------
const romanianDeadlift: Exercise = {
  slug: "romanian-deadlift",
  name: "Romanian Deadlift",
  category: "Glutes & Hamstrings",
  shortDescription:
    "A hip-hinge movement that loads the hamstrings and glutes through a controlled eccentric stretch.",
  primaryMuscle: "Hamstrings",
  secondaryMuscles: ["Glutes", "Back", "Core"],
  exerciseType: "Strength",
  equipment: "Barbell",
  mechanics: "Compound",
  forceType: "Hinge",
  level: "Intermediate",
  overview:
    "The Romanian Deadlift (RDL) is a posterior-chain staple that develops the hamstrings, glutes and erector spinae through a controlled hip hinge. Unlike a conventional deadlift, the bar travels along the legs while the knees stay only softly bent, keeping continuous tension on the hamstrings. It builds the kind of hinge strength that transfers directly to sprinting, jumping and heavier pulling variations.",
  steps: [
    {
      title: "Starting position",
      body: "Stand tall with feet hip-width apart, bar over mid-foot. Grip just outside the hips, shoulders packed, ribcage stacked over pelvis.",
    },
    {
      title: "Execution",
      body: "Push the hips back as you lower the bar down the front of the thighs. Keep the bar in contact with the legs and the back flat throughout.",
    },
    {
      title: "Bottom position",
      body: "Stop when you feel a deep stretch in the hamstrings - typically just below the knee. Do not chase floor depth at the cost of a neutral spine.",
    },
    {
      title: "Return",
      body: "Drive the hips forward and squeeze the glutes hard to lock out, finishing tall without hyperextending the lower back.",
    },
    {
      title: "Breathing",
      body: "Inhale and brace at the top, hold pressure through the descent, exhale as you complete the lockout.",
    },
    {
      title: "Tempo",
      body: "Aim for 3 seconds down, a brief pause, and a controlled 1–2 second drive up.",
    },
  ],
  proTips: [
    "Think 'push the wall behind you' with your hips, not 'bend forward'.",
    "Keep the lats engaged - imagine crushing oranges in your armpits to keep the bar close.",
    "Soft knees, not bent knees. Knee angle should barely change.",
    "Stop the rep when your hamstring flexibility runs out, not when the bar hits the floor.",
  ],
  commonMistakes: [
    "Rounding the lower back at the bottom of the rep",
    "Turning the lift into a squat by bending the knees",
    "Letting the bar drift forward away from the legs",
    "Using a weight that forces the hips to shoot up faster than the chest",
  ],
  alternatives: ["dumbbell-rdl", "single-leg-rdl", "good-morning", "hamstring-curl"],
};

// ---------- HOME GYM ----------
const homeGym: Mini[] = [
  // Upper Body
  { name: "Push Ups", primary: "Chest", secondary: ["Triceps", "Shoulders"] },
  { name: "Wide Push Ups", primary: "Chest", secondary: ["Shoulders"] },
  { name: "Close Grip Push Ups", primary: "Triceps", secondary: ["Chest"] },
  { name: "Diamond Push Ups", primary: "Triceps", secondary: ["Chest"] },
  {
    name: "Negative Push Ups On Knees",
    primary: "Chest",
    secondary: ["Triceps"],
    level: "Beginner",
  },
  { name: "Negative Push Ups On Toes", primary: "Chest", secondary: ["Triceps"] },
  { name: "Push Up On Knees", primary: "Chest", secondary: ["Triceps"], level: "Beginner" },
  { name: "Push Up On Toes", primary: "Chest", secondary: ["Triceps"] },
  { name: "Bench Tricep Dips", primary: "Triceps", secondary: ["Chest"], level: "Beginner" },
  { name: "Assisted Tricep Dips", primary: "Triceps", level: "Beginner" },
  { name: "Advanced Tricep Bench Dips", primary: "Triceps", level: "Advanced" },
  { name: "Advanced Weighted Tricep Bench Dips", primary: "Triceps", level: "Advanced" },
  {
    name: "Assisted Wide Grip Pull Up",
    primary: "Back",
    secondary: ["Biceps"],
    force: "Pull",
    level: "Beginner",
  },
  {
    name: "Assisted Underhand Chin Up",
    primary: "Back",
    secondary: ["Biceps"],
    force: "Pull",
    level: "Beginner",
  },
  {
    name: "Assisted Hammer Grip Chin Up",
    primary: "Back",
    secondary: ["Biceps"],
    force: "Pull",
    level: "Beginner",
  },
  // Lower Body
  { name: "Bodyweight Squats", primary: "Quads", secondary: ["Glutes"] },
  { name: "Bodyweight Sumo Squat", primary: "Quads", secondary: ["Glutes"] },
  { name: "Bodyweight Bulgarian Squats", primary: "Quads", secondary: ["Glutes"] },
  { name: "Alternating Bodyweight Reverse Lunges", primary: "Quads", secondary: ["Glutes"] },
  { name: "Stationary Bodyweight Alternating Lunges", primary: "Quads", secondary: ["Glutes"] },
  { name: "Split Squats Bodyweight", primary: "Quads", secondary: ["Glutes"] },
  { name: "Step-Ups Bodyweight", primary: "Quads", secondary: ["Glutes"] },
  {
    name: "Single-Leg Bodyweight Glute Bridge",
    primary: "Glutes",
    secondary: ["Hamstrings"],
    force: "Hinge",
  },
  { name: "Single Leg Calve Raises", primary: "Calves", mechanics: "Isolation" },
  {
    name: "Standing Bodyweight Calve Raises",
    primary: "Calves",
    mechanics: "Isolation",
    level: "Beginner",
  },
  { name: "Donkey Kicks", primary: "Glutes", mechanics: "Isolation", level: "Beginner" },
  { name: "Straight Leg Donkey Kick", primary: "Glutes", mechanics: "Isolation" },
  {
    name: "Clamshells With Resistance Band",
    primary: "Glutes",
    mechanics: "Isolation",
    level: "Beginner",
  },
  { name: "Banded Side Steps", primary: "Glutes", mechanics: "Isolation", level: "Beginner" },
  // Core & Mobility
  { name: "Ab Crunches", primary: "Core", mechanics: "Isolation" },
  {
    name: "Assisted Machine Ab Crunch",
    primary: "Core",
    mechanics: "Isolation",
    level: "Beginner",
  },
  { name: "Weighted Ab Crunch", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Bench V-Up", primary: "Core", mechanics: "Isolation" },
  { name: "V-Up", primary: "Core", mechanics: "Isolation" },
  { name: "Toe Touch Crunches", primary: "Core", mechanics: "Isolation" },
  { name: "Side Crunches", primary: "Core", mechanics: "Isolation" },
  { name: "Bicycle Crunches Easy", primary: "Core", mechanics: "Isolation", level: "Beginner" },
  { name: "Bicycle Crunches Hard", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  {
    name: "One Sided Bicycle Crunch Easy",
    primary: "Core",
    mechanics: "Isolation",
    level: "Beginner",
  },
  {
    name: "One Sided Bicycle Crunch Hard",
    primary: "Core",
    mechanics: "Isolation",
    level: "Advanced",
  },
  { name: "Reverse Crunch", primary: "Core", mechanics: "Isolation" },
  { name: "Single Leg Reverse Crunch", primary: "Core", mechanics: "Isolation" },
  { name: "Window Wipers Hard", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Flutter Kicks", primary: "Core", mechanics: "Isolation" },
  { name: "Bench Flutter Kicks", primary: "Core", mechanics: "Isolation" },
  { name: "Sit Ups", primary: "Core", mechanics: "Isolation" },
  { name: "Weighted Sit Ups", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Overhead Weighted Sit Ups", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Butterfly Sit Ups", primary: "Core", mechanics: "Isolation" },
  { name: "Starfish Sit Ups Easy", primary: "Core", mechanics: "Isolation", level: "Beginner" },
  { name: "Starfish Sit Ups Hard", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Starfish Opposite Alternating Crunch", primary: "Core", mechanics: "Isolation" },
  { name: "Leg Raises", primary: "Core", mechanics: "Isolation" },
  { name: "Leg Raise Hip Lift", primary: "Core", mechanics: "Isolation" },
  { name: "Hanging Knee Raise", primary: "Core", mechanics: "Isolation" },
  { name: "Hanging Leg Raise", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Jackknives", primary: "Core", mechanics: "Isolation" },
  { name: "Bench Jackknife", primary: "Core", mechanics: "Isolation" },
  { name: "Scissor Leg Lift", primary: "Core", mechanics: "Isolation" },
  { name: "Russian Twist", primary: "Core", mechanics: "Isolation" },
  { name: "Weighted Russian Twist", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  {
    name: "Plank",
    primary: "Core",
    secondary: ["Shoulders"],
    force: "Static",
    mechanics: "Isolation",
    level: "Beginner",
  },
  { name: "Side Plank", primary: "Core", force: "Static", mechanics: "Isolation" },
  { name: "Plank With Shoulder Tap", primary: "Core", force: "Static", mechanics: "Isolation" },
  {
    name: "Mountain Climbers",
    primary: "Core",
    secondary: ["Cardio"],
    type: "Cardio",
    mechanics: "Compound",
  },
  { name: "Slow Mountain Climbers", primary: "Core", mechanics: "Isolation", level: "Beginner" },
  { name: "Cross Body Mountain Climbers", primary: "Core", mechanics: "Isolation" },
];

// ---------- CHEST ----------
const chest: Mini[] = [
  { name: "Barbell Bench Press", primary: "Chest", secondary: ["Triceps", "Shoulders"] },
  { name: "Barbell Wide Grip Bench Press", primary: "Chest", secondary: ["Shoulders"] },
  { name: "Close Grip Bench Press", primary: "Triceps", secondary: ["Chest"] },
  { name: "Dumbbell Chest Press", primary: "Chest", secondary: ["Triceps", "Shoulders"] },
  { name: "Dumbbell Alternating Chest Press", primary: "Chest", secondary: ["Triceps"] },
  { name: "Dumbbell Hammer Grip Chest Press", primary: "Chest", secondary: ["Triceps"] },
  { name: "Dumbbell Hammer Grip Incline Chest Press", primary: "Chest", secondary: ["Shoulders"] },
  { name: "Dumbbell Incline Chest Press", primary: "Chest", secondary: ["Shoulders"] },
  {
    name: "Incline Dumbbell Single Arm Chest Press",
    primary: "Chest",
    secondary: ["Shoulders", "Core"],
  },
  { name: "Dumbbell Single Arm Chest Press", primary: "Chest", secondary: ["Core"] },
  { name: "Dumbbell Incline Alternating Chest Press", primary: "Chest", secondary: ["Shoulders"] },
  { name: "Smith Machine Chest Press", primary: "Chest", secondary: ["Triceps"] },
  { name: "Smith Machine Incline Chest Press", primary: "Chest", secondary: ["Shoulders"] },
  { name: "Smith Machine Decline Chest Press", primary: "Chest", secondary: ["Triceps"] },
  { name: "Machine Chest Press", primary: "Chest", secondary: ["Triceps"], level: "Beginner" },
  { name: "Dumbbell Chest Fly", primary: "Chest", mechanics: "Isolation" },
  { name: "Incline Dumbbell Chest Fly", primary: "Chest", mechanics: "Isolation" },
  { name: "Decline Dumbbell Chest Fly", primary: "Chest", mechanics: "Isolation" },
  { name: "Cable Chest Fly", primary: "Chest", mechanics: "Isolation" },
  { name: "Dips", primary: "Chest", secondary: ["Triceps"], force: "Push", level: "Advanced" },
];

// ---------- BACK ----------
const back: Mini[] = [
  {
    name: "Barbell Deadlift",
    primary: "Back",
    secondary: ["Hamstrings", "Glutes"],
    force: "Hinge",
    level: "Advanced",
  },
  {
    name: "Barbell Sumo Deadlift",
    primary: "Glutes",
    secondary: ["Back", "Hamstrings"],
    force: "Hinge",
    level: "Advanced",
  },
  { name: "Rack Pull", primary: "Back", secondary: ["Hamstrings"], force: "Hinge" },
  {
    name: "Smith Machine Romanian Deadlift",
    primary: "Hamstrings",
    secondary: ["Glutes", "Back"],
    force: "Hinge",
  },
  {
    name: "Barbell Stiff Leg Deadlift",
    primary: "Hamstrings",
    secondary: ["Glutes", "Back"],
    force: "Hinge",
  },
  { name: "Seated Cable Rope Pullover", primary: "Back", mechanics: "Isolation", force: "Pull" },
  { name: "Incline Cable Rope Pullover", primary: "Back", mechanics: "Isolation", force: "Pull" },
  {
    name: "Dumbbell Pull Over",
    primary: "Back",
    secondary: ["Chest"],
    mechanics: "Isolation",
    force: "Pull",
  },
  { name: "Pull Ups", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Chin Ups", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  {
    name: "Assisted Pull Ups",
    primary: "Back",
    secondary: ["Biceps"],
    force: "Pull",
    level: "Beginner",
  },
  { name: "Seated Cable Row", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Wide Grip Cable Row", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Single Arm Cable Row", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Single Arm Dumbbell Row", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "High Row Machine", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Rear Delt Row", primary: "Shoulders", secondary: ["Back"], force: "Pull" },
  {
    name: "Cable Face Pulls",
    primary: "Shoulders",
    secondary: ["Back"],
    force: "Pull",
    mechanics: "Isolation",
  },
  { name: "Bent Over Smith Row", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Single Dumbbell Bent Over Row", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Lat Pulldown Wide Grip", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Lat Pulldown Close Grip", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Lat Pulldown Underhand Grip", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Lat Pulldown With Dual Handles", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Lat Pulldown With V Bar", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  {
    name: "Behind The Head Lat Pulldown",
    primary: "Back",
    secondary: ["Biceps"],
    force: "Pull",
    level: "Advanced",
  },
  { name: "Alternating Lat Pulldown", primary: "Back", secondary: ["Biceps"], force: "Pull" },
  { name: "Straight Arm Pulldown", primary: "Back", mechanics: "Isolation", force: "Pull" },
  {
    name: "Seated Cable Crossover Lat Pulldown",
    primary: "Back",
    secondary: ["Biceps"],
    force: "Pull",
  },
];

// ---------- SHOULDERS ----------
const shoulders: Mini[] = [
  { name: "Barbell Overhead Press", primary: "Shoulders", secondary: ["Triceps", "Core"] },
  { name: "Seated Dumbbell Shoulder Press", primary: "Shoulders", secondary: ["Triceps"] },
  { name: "Dual Cable Shoulder Press", primary: "Shoulders", secondary: ["Triceps"] },
  { name: "Seated Smith Machine Front Press", primary: "Shoulders", secondary: ["Triceps"] },
  { name: "Dumbbell Lateral Raises", primary: "Shoulders", mechanics: "Isolation" },
  {
    name: "Barbell Lateral Raises",
    primary: "Shoulders",
    mechanics: "Isolation",
    level: "Advanced",
  },
  { name: "Cable Side Raises", primary: "Shoulders", mechanics: "Isolation" },
  { name: "Dumbbell Front Raises", primary: "Shoulders", mechanics: "Isolation" },
  { name: "Cable Front Raises", primary: "Shoulders", mechanics: "Isolation" },
  { name: "Plate Front Raises", primary: "Shoulders", mechanics: "Isolation" },
  { name: "Barbell Upright Rows", primary: "Shoulders", secondary: ["Back"], force: "Pull" },
  { name: "Dumbbell Upright Rows", primary: "Shoulders", secondary: ["Back"], force: "Pull" },
  { name: "Cable Upright Rows", primary: "Shoulders", secondary: ["Back"], force: "Pull" },
  { name: "Dumbbell Rear Delt Flys", primary: "Shoulders", mechanics: "Isolation", force: "Pull" },
  { name: "Cable Rear Delt Flys", primary: "Shoulders", mechanics: "Isolation", force: "Pull" },
  { name: "Dumbbell Shrugs", primary: "Back", mechanics: "Isolation", force: "Pull" },
  { name: "Barbell Shrugs", primary: "Back", mechanics: "Isolation", force: "Pull" },
];

// ---------- BICEPS ----------
const biceps: Mini[] = [
  { name: "Barbell Curl", primary: "Biceps", mechanics: "Isolation", force: "Pull" },
  {
    name: "Barbell 21s",
    primary: "Biceps",
    mechanics: "Isolation",
    force: "Pull",
    level: "Advanced",
  },
  { name: "Barbell Spider Curl", primary: "Biceps", mechanics: "Isolation", force: "Pull" },
  { name: "Dumbbell Spider Curl", primary: "Biceps", mechanics: "Isolation", force: "Pull" },
  {
    name: "Dumbbell Alternating Spider Curl",
    primary: "Biceps",
    mechanics: "Isolation",
    force: "Pull",
  },
  {
    name: "Dumbbell Hammer Curls",
    primary: "Biceps",
    secondary: ["Forearms"],
    mechanics: "Isolation",
    force: "Pull",
  },
  {
    name: "Alternating Dumbbell Hammer Curls",
    primary: "Biceps",
    secondary: ["Forearms"],
    mechanics: "Isolation",
    force: "Pull",
  },
  {
    name: "Incline Hammer Curls",
    primary: "Biceps",
    secondary: ["Forearms"],
    mechanics: "Isolation",
    force: "Pull",
  },
  { name: "Cable Curls", primary: "Biceps", mechanics: "Isolation", force: "Pull" },
  { name: "Dual Cable Bicep Curls", primary: "Biceps", mechanics: "Isolation", force: "Pull" },
  { name: "High Cable Curls", primary: "Biceps", mechanics: "Isolation", force: "Pull" },
  {
    name: "Squat Cable Bar Curl",
    primary: "Biceps",
    mechanics: "Isolation",
    force: "Pull",
    level: "Advanced",
  },
];

// ---------- TRICEPS ----------
const triceps: Mini[] = [
  { name: "Skull Crushers", primary: "Triceps", mechanics: "Isolation" },
  { name: "Dumbbell Skull Crushers", primary: "Triceps", mechanics: "Isolation" },
  { name: "Barbell Skull Crushers", primary: "Triceps", mechanics: "Isolation" },
  { name: "Cable Rope Pushdowns", primary: "Triceps", mechanics: "Isolation" },
  {
    name: "Assisted Machine Tricep Pushdown",
    primary: "Triceps",
    mechanics: "Isolation",
    level: "Beginner",
  },
  { name: "Cable Overhead Tricep Extensions", primary: "Triceps", mechanics: "Isolation" },
  { name: "Dumbbell Overhead Tricep Extensions", primary: "Triceps", mechanics: "Isolation" },
  { name: "Single Arm Overhead Tricep Extension", primary: "Triceps", mechanics: "Isolation" },
];

// ---------- QUADS ----------
const quads: Mini[] = [
  { name: "Barbell Back Squat", primary: "Quads", secondary: ["Glutes", "Hamstrings", "Core"] },
  { name: "Barbell Sumo Squat", primary: "Quads", secondary: ["Glutes"] },
  { name: "Box Squat", primary: "Quads", secondary: ["Glutes"] },
  { name: "Pistol Box Squat", primary: "Quads", secondary: ["Glutes", "Core"], level: "Advanced" },
  { name: "Dumbbell Bulgarian Split Squat", primary: "Quads", secondary: ["Glutes"] },
  {
    name: "Barbell Bulgarian Split Squat",
    primary: "Quads",
    secondary: ["Glutes"],
    level: "Advanced",
  },
  { name: "Walking Lunges", primary: "Quads", secondary: ["Glutes"] },
  { name: "Dumbbell Walking Lunges", primary: "Quads", secondary: ["Glutes"] },
  { name: "Dumbbell Reverse Lunge", primary: "Quads", secondary: ["Glutes"] },
  { name: "Barbell Forward Lunge", primary: "Quads", secondary: ["Glutes"] },
  { name: "Dumbbell Step Ups", primary: "Quads", secondary: ["Glutes"] },
  { name: "Barbell Step Ups", primary: "Quads", secondary: ["Glutes"], level: "Advanced" },
  { name: "Leg Press", primary: "Quads", secondary: ["Glutes"], mechanics: "Compound" },
  { name: "Single Leg Press", primary: "Quads", secondary: ["Glutes"] },
  { name: "Hack Squat Machine", primary: "Quads", secondary: ["Glutes"] },
  { name: "Raised Heel Squats", primary: "Quads", secondary: ["Glutes"] },
  { name: "Bosu Ball Squats", primary: "Quads", secondary: ["Core"] },
  { name: "Leg Extension", primary: "Quads", mechanics: "Isolation", level: "Beginner" },
];

// ---------- GLUTES & HAMSTRINGS ----------
const glutesHams: Mini[] = [
  {
    name: "Barbell Hip Thrust",
    primary: "Glutes",
    secondary: ["Hamstrings"],
    force: "Hinge",
    level: "Beginner",
  },
  { name: "Dumbbell Hip Thrust", primary: "Glutes", secondary: ["Hamstrings"], force: "Hinge" },
  { name: "Single Leg Hip Thrust", primary: "Glutes", secondary: ["Hamstrings"], force: "Hinge" },
  {
    name: "Smith Machine Hip Thrust",
    primary: "Glutes",
    secondary: ["Hamstrings"],
    force: "Hinge",
  },
  {
    name: "Glute Bridge",
    primary: "Glutes",
    secondary: ["Hamstrings"],
    force: "Hinge",
    level: "Beginner",
  },
  { name: "Banded Glute Bridge", primary: "Glutes", force: "Hinge", level: "Beginner" },
  { name: "Glute Bridge Pulse", primary: "Glutes", force: "Hinge", level: "Beginner" },
  { name: "Cable Glute Kickbacks", primary: "Glutes", mechanics: "Isolation", force: "Hinge" },
  { name: "Standing Cable Hip Abduction", primary: "Glutes", mechanics: "Isolation" },
  {
    name: "Seated Hip Abduction Machine",
    primary: "Glutes",
    mechanics: "Isolation",
    level: "Beginner",
  },
  { name: "Lying Hip Abduction", primary: "Glutes", mechanics: "Isolation", level: "Beginner" },
  { name: "Clamshells", primary: "Glutes", mechanics: "Isolation", level: "Beginner" },
  {
    name: "Romanian Deadlifts",
    primary: "Hamstrings",
    secondary: ["Glutes", "Back"],
    force: "Hinge",
  },
  {
    name: "Dumbbell Romanian Deadlift",
    primary: "Hamstrings",
    secondary: ["Glutes"],
    force: "Hinge",
    level: "Beginner",
  },
  { name: "Single Leg RDL", primary: "Hamstrings", secondary: ["Glutes", "Core"], force: "Hinge" },
  {
    name: "Good Morning",
    primary: "Hamstrings",
    secondary: ["Glutes", "Back"],
    force: "Hinge",
    level: "Advanced",
  },
  {
    name: "Lying Hamstring Curl",
    primary: "Hamstrings",
    mechanics: "Isolation",
    force: "Pull",
    level: "Beginner",
  },
  {
    name: "Seated Hamstring Curl",
    primary: "Hamstrings",
    mechanics: "Isolation",
    force: "Pull",
    level: "Beginner",
  },
  { name: "Back Extensions", primary: "Back", secondary: ["Glutes", "Hamstrings"], force: "Hinge" },
  {
    name: "Weighted Back Extensions",
    primary: "Back",
    secondary: ["Glutes", "Hamstrings"],
    force: "Hinge",
    level: "Advanced",
  },
];

// ---------- CALVES ----------
const calves: Mini[] = [
  { name: "Smith Machine Calve Raises", primary: "Calves", mechanics: "Isolation" },
  { name: "Standing Machine Calve Raises", primary: "Calves", mechanics: "Isolation" },
  {
    name: "Seated Calf Raise Machine",
    primary: "Calves",
    mechanics: "Isolation",
    level: "Beginner",
  },
];

// ---------- CORE ----------
const core: Mini[] = [
  { name: "Cable Crunch", primary: "Core", mechanics: "Isolation" },
  { name: "Ab Wheel Rollout", primary: "Core", mechanics: "Isolation", level: "Advanced" },
  { name: "Standing Cable Wood Chop", primary: "Core", mechanics: "Isolation" },
  { name: "Pallof Press", primary: "Core", force: "Static", mechanics: "Isolation" },
  { name: "Dead Bug", primary: "Core", force: "Static", mechanics: "Isolation", level: "Beginner" },
  { name: "Bird Dog", primary: "Core", force: "Static", mechanics: "Isolation", level: "Beginner" },
  { name: "Hollow Body Hold", primary: "Core", force: "Static", mechanics: "Isolation" },
  { name: "L-Sit", primary: "Core", force: "Static", mechanics: "Isolation", level: "Advanced" },
  { name: "Dragon Flag", primary: "Core", mechanics: "Isolation", level: "Advanced" },
];

// ---------- CARDIO ----------
const cardio: Mini[] = [
  {
    name: "Treadmill Walking",
    primary: "Cardio",
    type: "Cardio",
    mechanics: "Compound",
    level: "Beginner",
  },
  { name: "Treadmill Incline Walking", primary: "Cardio", type: "Cardio", mechanics: "Compound" },
  { name: "Treadmill Jogging", primary: "Cardio", type: "Cardio", mechanics: "Compound" },
  { name: "Treadmill Incline Jogging", primary: "Cardio", type: "Cardio", mechanics: "Compound" },
  {
    name: "Treadmill Sprinting",
    primary: "Cardio",
    type: "Cardio",
    mechanics: "Compound",
    level: "Advanced",
  },
  {
    name: "Stationary Cycle",
    primary: "Cardio",
    type: "Cardio",
    mechanics: "Compound",
    level: "Beginner",
  },
  {
    name: "Cross Trainer",
    primary: "Cardio",
    type: "Cardio",
    mechanics: "Compound",
    level: "Beginner",
  },
  { name: "Stair Climber", primary: "Cardio", type: "Cardio", mechanics: "Compound" },
  {
    name: "Rowing Machine",
    primary: "Cardio",
    secondary: ["Back", "Full Body"],
    type: "Cardio",
    mechanics: "Compound",
  },
];

// ---------- HYROX ----------
const hyrox: Mini[] = [
  {
    name: "Sled Push",
    primary: "Full Body",
    secondary: ["Quads", "Glutes"],
    type: "Power",
    level: "Advanced",
  },
  {
    name: "Battle Rope Waves",
    primary: "Shoulders",
    secondary: ["Cardio", "Core"],
    type: "Cardio",
    mechanics: "Compound",
  },
  {
    name: "Battle Rope Alternating",
    primary: "Shoulders",
    secondary: ["Cardio"],
    type: "Cardio",
    mechanics: "Compound",
  },
  {
    name: "Battle Rope Slams",
    primary: "Shoulders",
    secondary: ["Core"],
    type: "Power",
    mechanics: "Compound",
  },
  {
    name: "Single Arm Battle Rope",
    primary: "Shoulders",
    secondary: ["Core"],
    type: "Cardio",
    mechanics: "Compound",
  },
  {
    name: "Box Jumps",
    primary: "Quads",
    secondary: ["Glutes", "Calves"],
    type: "Power",
    mechanics: "Compound",
  },
  {
    name: "Dumbbell Box Jumps",
    primary: "Quads",
    secondary: ["Glutes"],
    type: "Power",
    mechanics: "Compound",
    level: "Advanced",
  },
  {
    name: "Burpees",
    primary: "Full Body",
    secondary: ["Cardio"],
    type: "Cardio",
    mechanics: "Compound",
  },
  {
    name: "Half Burpees",
    primary: "Full Body",
    secondary: ["Cardio"],
    type: "Cardio",
    mechanics: "Compound",
    level: "Beginner",
  },
  {
    name: "Easy Burpees",
    primary: "Full Body",
    type: "Cardio",
    mechanics: "Compound",
    level: "Beginner",
  },
  {
    name: "Burpee Curl And Press",
    primary: "Full Body",
    secondary: ["Shoulders", "Biceps"],
    type: "Power",
    mechanics: "Compound",
    level: "Advanced",
  },
  {
    name: "Commandos",
    primary: "Core",
    secondary: ["Shoulders"],
    force: "Static",
    mechanics: "Compound",
  },
  {
    name: "Bosu Ball Plank Jumps",
    primary: "Core",
    secondary: ["Shoulders"],
    type: "Power",
    mechanics: "Compound",
    level: "Advanced",
  },
];

import {
  bunnyVideoMap,
  bunnyExtrasByCategory,
  getBunnyEmbedUrl,
  getBunnyThumbnail,
} from "./bunnyVideos";
import { poses as yogaPoses } from "./yogaPoses";

// Build extras from Bunny library (videos that don't match any hand-authored exercise).
type ForceLite = ForceType;
type MechLite = Mechanics;
type TypeLite = ExerciseType;
const extras: { mini: Mini; category: Category }[] = [];
for (const [cat, items] of Object.entries(bunnyExtrasByCategory)) {
  for (const it of items) {
    extras.push({
      category: cat as Category,
      mini: {
        name: it.name,
        primary: it.primary as MuscleGroup,
        type: it.type as TypeLite,
        force: it.force as ForceLite,
        mechanics: it.mechanics as MechLite,
      },
    });
  }
}

const all: Exercise[] = [
  romanianDeadlift,
  ...homeGym.map((m) => make(m, "Home Gym")),
  ...chest.map((m) => make(m, "Chest")),
  ...back.map((m) => make(m, "Back")),
  ...shoulders.map((m) => make(m, "Shoulders")),
  ...biceps.map((m) => make(m, "Biceps")),
  ...triceps.map((m) => make(m, "Triceps")),
  ...quads.map((m) => make(m, "Quads")),
  ...glutesHams.map((m) => make(m, "Glutes & Hamstrings")),
  ...calves.map((m) => make(m, "Calves")),
  ...core.map((m) => make(m, "Core")),
  ...cardio.map((m) => make(m, "Cardio & Conditioning")),
  ...hyrox.map((m) => make(m, "Hyrox")),
  ...extras.map((e) => make(e.mini, e.category)),
];

// Manual fallback images for exercises whose Bunny Stream thumbnail is missing/broken.
const thumbnailOverrides: Record<string, string> = {
  "smith-machine-chest-press": "/exercises/smith-machine-chest-press.jpg",
};

// Keep ONLY exercises that have a matching Bunny video (the 400 in the library).
// Dedupe by slug, attach video + thumbnail URL.
const seen = new Set<string>();
const mappedYogaExercises: Exercise[] = yogaPoses.map((p) => {
  let primaryMuscle: MuscleGroup = "Full Body";
  const focus = p.focus.toLowerCase();
  if (focus.includes("neck")) primaryMuscle = "Shoulders";
  else if (focus.includes("hip")) primaryMuscle = "Glutes";
  else if (focus.includes("hamstring")) primaryMuscle = "Hamstrings";
  else if (focus.includes("calf")) primaryMuscle = "Calves";
  else if (focus.includes("forearm")) primaryMuscle = "Forearms";
  else if (focus.includes("shoulder")) primaryMuscle = "Shoulders";
  else if (focus.includes("back") || focus.includes("spine")) primaryMuscle = "Back";
  else if (focus.includes("core")) primaryMuscle = "Core";

  return {
    slug: `yoga-${p.guid}`,
    name: p.name,
    category: "Yoga & Stretching",
    shortDescription: p.description,
    primaryMuscle,
    secondaryMuscles: [],
    exerciseType: "Mobility",
    equipment: "Bodyweight",
    mechanics: "Isolation",
    forceType: "Static",
    level: p.level === "Beginner–Intermediate" ? "Intermediate" : p.level,
    videoUrl: `https://iframe.mediadelivery.net/embed/709339/${p.guid}?autoplay=false&loop=false&muted=true&preload=true`,
    thumbnailUrl: `https://vz-3d635cd8-505.b-cdn.net/${p.guid}/thumbnail.jpg`,
    overview: p.description,
    steps: p.steps.map((s, idx) => ({ title: `Step ${idx + 1}`, body: s })),
    proTips: p.modifications || [],
    commonMistakes: p.mistakes || [],
    alternatives: [],
  };
});

export const exercises: Exercise[] = [
  ...all
    .filter((e) => {
      if (seen.has(e.slug)) return false;
      seen.add(e.slug);
      return true;
    })
    .flatMap<Exercise>((e) => {
      const guid = bunnyVideoMap[e.slug];
      if (!guid) return [];
      return [
        {
          ...e,
          videoUrl: getBunnyEmbedUrl(guid),
          thumbnailUrl: thumbnailOverrides[e.slug] ?? getBunnyThumbnail(guid),
        },
      ];
    }),
  ...mappedYogaExercises,
];

export const muscleGroups: MuscleGroup[] = [
  "Hamstrings",
  "Glutes",
  "Quads",
  "Calves",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Core",
  "Forearms",
  "Full Body",
  "Cardio",
];

export const equipmentOptions = Array.from(new Set(exercises.map((e) => e.equipment))).sort();
export const difficultyOptions: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
export const typeOptions: ExerciseType[] = ["Strength", "Cardio", "Mobility", "Power"];
export const categoryOptions: Category[] = categories.map((c) => c.id);

export const findExercise = (slug: string) => exercises.find((e) => e.slug === slug);
export const findCategory = (id: string) => categories.find((c) => c.id === id);

// Name → slug lookup for wiring program/workout rows to the library detail pages (with videos).
// Tries an exact slugify match, then a few common alias normalizations.
const _slugByName = new Map<string, string>();
for (const ex of exercises) {
  _slugByName.set(ex.name.toLowerCase(), ex.slug);
  _slugByName.set(ex.slug, ex.slug);
}
const _aliasReplacements: [RegExp, string][] = [
  [/[-‑–—]/g, " "],
  // TOP-PRIORITY 2026-07 audit: high-frequency unlinked names. Values are exercise SLUGS.
  // These must fire BEFORE the generic "db → dumbbell" and other rewrites below.
  [/\bsuperman( hold)?\b/g, "bodyweight-hyperextension"],
  [/\beasy walks?\b/g, "treadmill-walking"],
  [/\btreadmill walk or very easy runs?\b/g, "treadmill-walking"],
  [/\bcool[\s-]?down jogs?\b/g, "treadmill-jogging"],
  [/\bwarm[\s-]?up jogs?( \(zone 2\))?\b/g, "treadmill-jogging"],
  [/\brear delt fly machine\b/g, "dual-cable-high-rear-delt-row"],
  [/\bdb rear delt fly\b/g, "dual-cable-high-rear-delt-row"],
  [/\bpec deck( machine)?\b/g, "decline-dumbbell-chest-fly"],
  [/\bhack squat( machine)?( \(deep stretch\))?\b/g, "bodyweight-squats"],
  [/\bsingle[\s-]?leg bodyweight glute bridges?\b/g, "single-leg-glute-bridge-thrust"],
  [/\bbanded glute bridges?\b/g, "glute-bridge-pulse"],
  [/\breverse snow angels?( \(floor\))?\b/g, "seated-cable-rope-face-pull"],
  [/\bprone [yt][\s-]?raises?\b/g, "seated-cable-rope-face-pull"],
  [/\bplank with shoulder taps?\b/g, "plank-shoulder-taps"],
  [/\bslow mountain climbers?\b/g, "mountain-climbers"],
  [/\brenegade rows?\b/g, "single-arm-dumbbell-bent-over-row"],
  [/\browing machine intervals?\b/g, "treadmill-jogging"],
  [/\bstrides\b/g, "treadmill-sprinting"],
  [/\bhip( \/)?[\s-]?calf mobility\b/g, "banded-side-steps"],
  [/\bfull body stretch\b/g, "banded-side-steps"],
  [/\bbarbell bicep curls?\b/g, "squat-cable-bar-curl"],
  [/\bbanded front squats?\b/g, "bodyweight-squats"],
  [/\bbanded romanian deadlifts?\b/g, "smith-machine-romanian-deadlift"],
  [/\bbanded push press\b/g, "burpee-with-dumbbell-shoulder-press"],
  [
    /\bband(ed)?( )(chest press|overhead press|chest fly|triceps? pushdown|lateral raise|row|face pull|bicep curl|push ups?|pull[\s-]?aparts?)( \(.*\))?\b/g,
    "banded-side-steps",
  ],
  [/\bdips?\b/g, "bench-tricep-dips"],
  [/\b(dumbbell|db) thrusters?( \(.*\))?\b/g, "burpee-with-dumbbell-shoulder-press"],
  [/\bdumbbell push press\b/g, "burpee-with-dumbbell-shoulder-press"],
  [/\bstraight[\s-]?arm cable pullovers?\b/g, "straight-arm-pulldown"],
  [/\bbodyweight good mornings?\b/g, "weighted-hyperextension"],
  [/\bbodyweight rows?( \(.*\))?\b/g, "assisted-band-chin-up"],
  [/\bbear crawls?\b/g, "burpees"],
  [/\bsandbag.*(shoulder|carry|bear hug)\b/g, "burpees"],
  [/\bassault bike( sprints?)?\b/g, "treadmill-sprinting"],
  [/\btrap bar deadlifts?( \(.*\))?\b/g, "smith-machine-romanian-deadlift"],
  [/\bpause deadlifts?\b/g, "smith-machine-romanian-deadlift"],
  [/\bdb goblet squats?\b/g, "bodyweight-squats"],
  [/\bdb reverse lunges?( \(.*\))?\b/g, "alternating-dumbbell-reverse-lunges"],
  [/\bdb farmer carry\b/g, "burpees"],
  [/\btotal rounds.*\b/g, "burpees"],
  [/\bbox squat or step up.*\b/g, "pistol-box-squat"],
  [/\blateral lunges?( \(.*\))?\b/g, "walking-bodyweight-lunges"],
  [/\bpike push ups?\b/g, "burpee-with-dumbbell-shoulder-press"],
  [/\bassault bike intervals?\b/g, "treadmill-sprinting"],
  [/\breverse pec deck\b/g, "dual-cable-high-rear-delt-row"],
  [/\bbroad jumps?\b/g, "burpees"],

  // TOP-PRIORITY: Smith-machine + specific glute/hip patterns must fire BEFORE any generic
  // "reverse lunge", "bulgarian split squat", "hip thrust" or "rdl" alias below.
  [/\bsmith machine (alternating )?reverse lunges?\b/g, "smith machine reverse single leg lunges"],
  [/\bsmith machine (dumbbell )?bulgarian split squats?\b/g, "smith machine squats"],
  [/\bsmith machine hip thrusts?\b/g, "barbell glute hip thrusts on bench"],
  [
    /\bsmith machine (romanian |stiff[\s-]?leg |rdl )deadlifts?\b/g,
    "smith machine stiff leg deadlift",
  ],
  [/\bsmith machine squats?\b/g, "smith machine squats"],
  [/\bchest[\s-]?supported row (machine)?\b/g, "dumbbell hammer grip row"],
  [/\bstraight[\s-]?arm (cable )?pulldowns?\b/g, "straight arm pulldown"],
  [/\bhip abductor machine\b/g, "glute kickbacks on machine"],
  [/\bhip abduction machine\b/g, "glute kickbacks on machine"],
  [/\bstanding cable hip abductions?\b/g, "glute kickbacks on machine"],
  [/\bseated hip abductions?( machine)?\b/g, "glute kickbacks on machine"],
  // Cable pull-through: no dedicated video, closest hinge/glute-drive pattern is the RDL.
  [/\bcable pull[\s-]?throughs?\b/g, "dumbbell stiff leg deadlifts"],
  // Banded lateral walks / monster walks share the banded-side-steps video.
  [/\bbanded (lateral|side) walks?\b/g, "banded side steps"],
  [/\bmonster walks?\b/g, "banded side steps"],
  [/\bclamshells?\b/g, "banded side steps"],
  // Strength sample-week specifics, MUST fire before generic deadlift/overhead-press aliases.
  [/\bconventional deadlifts?\b/g, "barbell deadlifts"],
  [/\bdeficit deadlifts?\b/g, "barbell deadlifts"],
  [/\b(standing )?ab wheel( rollouts?)?\b/g, "ab rollout"],
  [/\bbulgarian split squats?\b/g, "dumbbell bulgarian squats"],
  [/\b(strict ohp|push press|strict overhead press)\b/g, "barbell front press"],
  // Week-2 variation swaps, must fire BEFORE generic push-ups / plank / squat rules.
  [/\bdecline push[\s-]?ups?\b/g, "push ups"],
  [/\bincline push[\s-]?ups?\b/g, "push ups"],
  [/\bside plank\b/g, "side plank dip"],
  [/\bsingle[\s-]?leg romanian deadlifts?\b/g, "dumbbell stiff leg deadlifts"],
  [/\bsingle[\s-]?leg rdl\b/g, "dumbbell stiff leg deadlifts"],
  [/\bstanding overhead press\b/g, "barbell front press"],
  [/\barnold press\b/g, "seated dumbbell shoulder press"],
  [/\breverse lunges?\b/g, "alternating bodyweight reverse lunges"],
  [/\b(seated calf raises?|seated calf)\b/g, "seated calf raise machine"],
  [/\bdumbbell lateral raises?\b/g, "dumbbell side raise"],
  [/\btriceps? pushdowns?\b/g, "tricep cable pushdowns"],
  [/\brear delt (fly|flys|flies|raise)s?\b/g, "seated cable face pulls"],
  [/\bfront squats?\b/g, "goblet squats"],
  [/\bpendlay rows?\b/g, "bent over smith row"],
  [/\bsuitcase carr(y|ies)\b/g, "sled push"],
  [/\bthrusters?\b/g, "barbell front press"],
  [/\bjump squats?\b/g, "burpee hard"],
  [/\bpush[\s-]?ups?\b/g, "push ups"],

  [/\bpull[\s-]?ups?\b/g, "pull ups"],
  [/\bchin[\s-]?ups?\b/g, "chin ups"],
  [/\bsit[\s-]?ups?\b/g, "sit ups"],
  [/\bdb\b/g, "dumbbell"],
  [/\bbb\b/g, "barbell"],
  [/\brdl\b/g, "romanian deadlift"],
  [/\bohp\b/g, "overhead press"],
  [/\blunges\b/g, "lunge"],
  [/\brows?\b/g, "row"],
  [/\bsquats\b/g, "squat"],
  [/\bcurls\b/g, "curl"],
  [/\bpresses\b/g, "press"],
  [/\bcarry\b/g, "carries"],
  [/\bair squats?\b/g, "bodyweight squat"],
  [/\bbroad jump\b/g, "burpees"],
  [/\bwall balls?\b/g, "slam ball squats"],
  [/\bburpees?\b/g, "burpee hard"],

  // No cycle/bike video in the library → swap to Burpee Hard for the same conditioning stimulus
  [/\bassault bike intervals?\b/g, "burpee hard"],
  [/\bassault bike\b/g, "burpee hard"],
  [/\bstationary cycle intervals?\b/g, "burpee hard"],
  [/\bstationary cycle\b/g, "burpee hard"],
  [/\btreadmill run\b/g, "treadmill jogging"],
  [/\browing machine\b/g, "rowing machine"],
  // Back Squat → Barbell Squat (library name)
  [/\b(pause |paused |tempo )?back squat( backoffs?)?\b/g, "barbell squat"],
  // Farmer's Carry has no library entry → swap to Sled Push (closest loaded conditioning)
  [/\bfarmer'?s?\s+(carry|carries)\b/g, "sled push"],
  [/\bloaded carr(y|ies)\b/g, "sled push"],

  // "Dumbbell Bench Press" → library uses "Dumbbell Chest Press"
  [/\bincline dumbbell bench press\b/g, "dumbbell incline chest press"],
  [/\bdecline dumbbell bench press\b/g, "dumbbell chest press"],
  [/\bdumbbell bench press\b/g, "dumbbell chest press"],
  // "One-Arm Row" / "One Arm Row" → "Single Arm Dumbbell Bent Over Row"
  [/\bone[\s-]?arm(ed)?[\s-]?(dumbbell )?rows?\b/g, "single arm dumbbell bent over row"],
  [/\bsingle[\s-]?arm row\b/g, "single arm dumbbell bent over row"],
  // Barbell Bent Over Row (Stangroing) → Bent Over Smith Row (closest true barbell-row video)
  [/\bbarbell bent[\s-]?over rows?\b/g, "bent over smith row"],
  [/\bbent[\s-]?over barbell rows?\b/g, "bent over smith row"],
  [/\bbent[\s-]?over dumbbell rows?\b/g, "single arm dumbbell bent over row"],
  [/\bbent[\s-]?over rows?\b/g, "bent over smith row"],
  // Romanian Deadlift / RDL → Smith Machine Romanian Deadlift (the actual RDL video in our library)
  [/\bbarbell romanian deadlifts?\b/g, "smith-machine-romanian-deadlift"],
  [/\bdumbbell romanian deadlifts?\b/g, "dumbbell stiff leg deadlifts"],
  [/\bromanian deadlifts?\b/g, "smith-machine-romanian-deadlift"],
  // Seated Barbell (Shoulder/Military) Press → Barbell Front Press
  [/\bseated barbell (shoulder |military )?press\b/g, "barbell front press"],
  [/\bbarbell (shoulder|military|overhead) press\b/g, "barbell front press"],
  [/\bmilitary press\b/g, "barbell front press"],
  // Goblet Squat → Goblet Squats (we have both box and regular; prefer regular)
  [/\bgoblet squat\b/g, "goblet squats"],
  // Lat Pull Down variations
  [/\blat[\s-]?pull[\s-]?downs?\b/g, "lat pulldown wide grip"],
  [/(?<!arm )\bpulldowns?\b/g, "lat pulldown wide grip"],
  // Seated Cable Row → Seated Dual Handle Cable Row
  [/\bseated cable row\b/g, "seated dual handle cable row"],
  // Standing Calf Raise
  [/\bstanding calf raises?\b/g, "standing smith machine calf raise"],
  // Walking Lunge
  [/\bwalking lunges?\b/g, "walking bodyweight lunges"],
  // Plank → Plank Hold
  [/\bplank\b(?!\s)/g, "plank hold"],
  // Hanging Leg Raise stays as is (exists)

  // --- Bodybuilding / hypertrophy program wiring (mapped to slugs that exist in bunnyVideoMap) ---
  [/\bflat (dumbbell|db) (press|bench press)\b/g, "dumbbell chest press"],
  [/\bdb floor press\b/g, "dumbbell floor chest press"],
  [/\b(deep |stretch |flat )?(dumbbell|db) flys?\b/g, "dumbbell chest flys"],
  [/\bcable crossovers?\b/g, "middle cable chest flys"],
  [/\blow to high cable\b/g, "low cable chest flys"],
  [/\bhigh to low cable\b/g, "high cable chest flys"],
  [/\bincline (barbell|bb) (bench )?press\b/g, "incline barbell bench press"],
  [/\bincline (dumbbell|db) (bench )?press\b/g, "incline dumbbell chest press"],
  [/\bdecline (barbell|bb) (bench )?press\b/g, "decline barbell bench press"],
  [/\bpush ups? (burnout|finisher|primer|amrap)\b/g, "push ups"],
  [/\bcable hammer curls?\b/g, "high cable bar bicep curls"],
  [/\bcable lateral raises?\b/g, "dual cable lateral"],
  [/\bcable glute kickbacks?\b/g, "glute kickbacks on machine"],
  [/\bincline (dumbbell|db) curls?\b/g, "incline hammer curls"],
  [/\b(dumbbell|db) z[\s-]?press\b/g, "seated dumbbell shoulder press"],
  [/\bseated (dumbbell|db) shoulder press\b/g, "seated dumbbell shoulder press"],
  [/\bchest[\s-]?supported rows?\b/g, "dumbbell hammer grip row"],
  [/\bbarbell rows?\b/g, "bent over smith row"],
  [/\bt[\s-]?bar rows?\b/g, "t bar row"],
  [/\bhollow holds?\b/g, "plank hold"],
  [/\bpause(d)? squats?\b/g, "barbell squat"],
  [/\bbox squats?\b/g, "goblet box squats"],
  [/\bdeficit deadlifts?\b/g, "barbell deadlifts"],
  [/(?<!stiff leg |barbell )deadlifts?( backoffs?)?/g, "barbell deadlifts"],
  [/\bbench press( backoffs?)?\b/g, "barbell bench press"],
  [/\boverhead press\b/g, "barbell front press"],
  [/\blateral raises?\b/g, "dumbbell side raise"],
  [/\bface pulls?\b/g, "seated cable face pulls"],
  [/\bpreacher curls?\b/g, "dumbbell preacher curls"],
  [/\bskull crushers?\b/g, "barbell skull crushers"],
  [/\brope tricep extensions?\b/g, "overhead cable rope tricep extension"],
  [/\b(triceps?\s+)?rope pushdowns?\b/g, "cable rope tricep pressdown"],
  [/\b(triceps?\s+)?rope pressdowns?\b/g, "cable rope tricep pressdown"],
  [/\boverhead rope triceps?\b/g, "overhead cable rope tricep extension"],
  [/\b(seated |lying |single )?leg curls?\b/g, "seated machine hamstring curls"],
  [/\bhip thrusts?\b/g, "barbell glute hip thrusts"],
  [/\bkettlebell swings?\b/g, "kettlebell swings"],
  [/\bweighted pull[\s-]?ups?\b/g, "chin up"],
  [/\bweighted plank\b/g, "plank hold"],
  [/\bcalf raises?\b/g, "standing smith machine calf raise"],
  [/\bsled pulls?\b/g, "sled push"],
  [/\bbattle ropes?\b/g, "battle rope"],
  [/\btreadmill runs?\b/g, "treadmill jogging"],
  [/\b1[\s-]?arm (dumbbell|db) rows?\b/g, "single arm dumbbell bent over row"],

  // --- Strength / powerlifting sample-week wiring ---
  [/\bbulgarian split squats?\b/g, "dumbbell bulgarian split squat"],
  [/\b(standing )?ab wheel( rollouts?)?\b/g, "ab wheel rollout"],
  [/\bcomp(etition)?[\s-]?bench( press)?\b/g, "barbell bench press"],
  [/\bclose[\s-]?grip bench( press)?\b/g, "close grip bench press"],
  [/\b(dumbbell|db) tricep(s)? extensions?\b/g, "dumbbell overhead tricep extensions"],
  [/\boverhead tricep(s)? extensions?\b/g, "dumbbell overhead tricep extensions"],
  [/\bglute[\s-]?ham raises?\b/g, "dumbbell stiff leg deadlifts"],
  [/\bghr\b/g, "dumbbell stiff leg deadlifts"],
  [/\bheavy carr(y|ies)\b/g, "sled push"],
  [/\bpush press\b/g, "barbell front press"],
  [/\bstrict ohp\b/g, "barbell front press"],
  [/\bhammer curls?\b/g, "dumbbell hammer curls"],
  [/\bconventional deadlifts?\b/g, "barbell deadlifts"],
  [/\bhack squats?\b/g, "barbell squat"],
  [/\bcable fly\b/g, "middle cable chest flys"],
  [/\bhanging knee raises?\b/g, "hanging leg raise"],
  [/\bpallof press(es)?\b/g, "plank hip twists"],
  [/\bbird[\s-]?dogs?\b/g, "kneeling plank hold"],
  [/\bstair ?master\b/g, "stair climber"],
  [/\bstair ?walk( finisher)?\b/g, "stair climber"],
  [/\bdead ?bugs?\b/g, "plank shoulder taps"],

  // --- Week-2 swap coverage (extra aliases so swapped names still resolve to a video) ---
  [/\bspoto press( backoffs?)?\b/g, "barbell bench press"],
  [/\bsingle[\s-]?leg romanian deadlifts?\b/g, "dumbbell stiff leg deadlifts"],
  [/\bsingle[\s-]?leg glute bridges?\b/g, "barbell glute hip thrusts"],
  [/\bdecline (dumbbell|db) (bench )?press\b/g, "decline barbell bench press"],
  [/\bdecline push ups?\b/g, "push ups"],
  [/\boutdoor runs?\b/g, "treadmill jogging"],
  [/\bhill sprints?\b/g, "treadmill jogging"],
  [/\bmedicine ball slams?\b/g, "battle rope"],
  [/\breverse lunges?\b/g, "walking bodyweight lunges"],
  [/\btriceps? pushdowns?\b/g, "tricep cable pushdowns"],
  [/\bdumbbell lateral raises?\b/g, "dumbbell side raise"],
  [/\barnold press\b/g, "seated dumbbell shoulder press"],
  [/\bstanding overhead press\b/g, "barbell front press"],
  [/\bpendlay rows?\b/g, "bent over smith row"],
  [/\bfront squats?\b/g, "goblet squats"],
  [/\bseated calf raises?\b/g, "standing smith machine calf raise"],
  [/\brear delt fly?s?\b/g, "seated cable face pulls"],
  [/\bsuitcase carr(y|ies)\b/g, "sled push"],
  [/\bdeficit push ups?\b/g, "push ups"],
  [/\bbroad jumps?\b/g, "burpee broad jump"],
  [/\bburpee broad jumps?\b/g, "burpee broad jump"],
  [/\bjump squats?\b/g, "goblet box squats"],
  [/\bthrusters?\b/g, "barbell front press"],

  // --- Extra women/glute + machine wiring (2026-07 additions) — patterns not already
  // covered by the TOP-PRIORITY block above ---
  [/\blying hip abductions?\b/g, "glute kickbacks on machine"],
  [/\bcable pull[\s-]?throughs?\b/g, "barbell glute hip thrusts"],
  [/\breverse pec deck\b/g, "machine rear delt flys"],
  [/\brear delt (dumbbell |cable )?raise\b/g, "machine rear delt flys"],
  [/\bfarmer'?s?\s+walks?\b/g, "sled push"],
  [/\bdead[\s-]?hangs?\b/g, "hanging leg raise"],
  [/\bzercher squats?\b/g, "barbell squat"],
  [/\byoke walks?( \(.*\))?\b/g, "sled push"],
  [/\bhip adductor machine\b/g, "dumbbell bulgarian split squat"],
  [/\bfrog pumps?\b/g, "body weight glute hip thrusts"],
  [/\bstep[\s-]?ups?\b/g, "single leg body weight step ups"],
  [/\bhyperextensions?\b/g, "weighted hyperextension"],
  [/\bglute bridges?\b/g, "body weight glute hip thrusts"],
  [/\bkas glute bridges?\b/g, "barbell glute hip thrusts"],
  [/\bb[\s-]?stance (hip thrust|rdl)\b/g, "single leg hip thrust"],
];

export function findExerciseSlugByName(name: string): string | undefined {
  if (!name) return undefined;
  // Strip parentheticals and trailing modifiers ("(each side)", " - Top Single...").
  const cleaned = name
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+[-–—]\s+.*$/, "")
    .replace(/\s+@.*$/, "")
    .trim();
  const raw = cleaned.toLowerCase();
  const direct = _slugByName.get(raw);
  if (direct) return direct;
  let normalized = raw;
  for (const [re, rep] of _aliasReplacements) {
    normalized = normalized.replace(re, rep);
    // Short-circuit: if the intermediate normalized string is already a known
    // slug or exercise name, return it before later rules mutate it further.
    const s = slugify(normalized);
    const hit = _slugByName.get(s) ?? _slugByName.get(normalized);
    if (hit) return hit;
  }
  const slug = slugify(normalized);
  if (_slugByName.get(slug)) return slug;

  // Fuzzy: try matching by all major words present in an exercise name
  const tokens = normalized.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length >= 2) {
    for (const ex of exercises) {
      const en = ex.name.toLowerCase();
      if (tokens.every((t) => en.includes(t))) return ex.slug;
    }
  }
  // Last resort: single distinctive token
  if (tokens.length === 1 && tokens[0].length > 4) {
    for (const ex of exercises) if (ex.name.toLowerCase().includes(tokens[0])) return ex.slug;
  }
  return undefined;
}

export const programs = [
  {
    slug: "12-week-muscle",
    title: "12 Week Muscle Building Program",
    description: "Progressive hypertrophy plan engineered to add visible muscle in 12 weeks.",
    image: "/src/assets/program-muscle.jpg",
    cta: "View Program",
  },
  {
    slug: "beginner-strength",
    title: "Beginner Strength Program",
    description: "Master the big lifts with linear progression and zero guesswork.",
    image: "/src/assets/program-beginner.jpg",
    cta: "Download in App",
  },
  {
    slug: "lower-body",
    title: "Lower Body Specialization",
    description: "An 8-week block built to bring up lagging legs and glutes.",
    image: "/src/assets/program-lower.jpg",
    cta: "View Program",
  },
];
