// Quick workout catalog, full workouts unlocked with an active membership.
// Every exercise references an actual entry in `@/data/exercises` by its slug
// so the demo video link goes to the correct exercise. Names are copied
// verbatim from the exercise library, do not paraphrase them or the label
// will disagree with the exercise page title after auto-translation.
//
// Every exercise MUST have a real rest value (min 15s in circuits, 30s+ for
// heavy sets). "0s" is only used inside true AMRAP blocks where "rest as
// needed" is intended, and even there we prefer explicit rest cues.

export type QuickWorkoutTag = "core" | "home" | "gym" | "conditioning" | "fullbody" | "hyrox";

export interface QuickExercise {
  slug?: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  note?: string;
}

export interface QuickBlock {
  title: string;
  minutes: number;
  note?: string;
  exercises: QuickExercise[];
}

export interface QuickWorkout {
  slug: string;
  title: string;
  minutes: number;
  tag: QuickWorkoutTag;
  focus: string;
  intro: string;
  equipment: string;
  image?: string;
  blocks: QuickBlock[];
}

export const quickWorkouts: QuickWorkout[] = [
  {
    slug: "core-crusher-20",
    title: "Core Crusher",
    minutes: 20,
    tag: "core",
    focus: "Planks, shoulder taps, burpees between",
    intro: "Twenty explosive minutes. Deep core bracing paired with burpees between every set to keep the heart rate high. Simple, hard, effective.",
    equipment: "Mat only",
    image: "/__l5e/assets-v1/8f6c0a7a-7e4f-4e5e-8c78-65f0e58d5816/core-crusher.png",
    blocks: [
      { title: "Warm-up", minutes: 3, exercises: [
        { slug: "plank-hold", name: "Plank Hold", sets: "1", reps: "30s", rest: "20s" },
        { slug: "mountain-climbers", name: "Mountain Climbers", sets: "1", reps: "40s", rest: "20s" },
      ]},
      { title: "Core + burpees circuit", minutes: 12, note: "3 rounds, one core exercise, then 10 burpees. Rest between every move.", exercises: [
        { slug: "plank-shoulder-taps", name: "Plank Shoulder Taps", sets: "3", reps: "20 total", rest: "30s" },
        { slug: "burpees", name: "Burpees", sets: "3", reps: "10", rest: "45s" },
        { slug: "side-plank-dip", name: "Side Plank Dip", sets: "3", reps: "30s/side", rest: "30s" },
        { slug: "burpees", name: "Burpees", sets: "3", reps: "10", rest: "45s" },
        { slug: "bicycle-crunches-hard", name: "Bicycle Crunches Hard", sets: "3", reps: "20 total", rest: "30s" },
        { slug: "burpees", name: "Burpees", sets: "3", reps: "10", rest: "45s" },
      ]},
      { title: "Core finisher", minutes: 5, note: "AMRAP 5 minutes, rest 15s between exercises, then repeat.", exercises: [
        { slug: "plank-hold", name: "Plank Hold", sets: "AMRAP", reps: "30s", rest: "15s" },
        { slug: "ab-crunches", name: "Ab Crunches", sets: "AMRAP", reps: "30s", rest: "15s" },
        { slug: "leg-raises", name: "Leg Raises", sets: "AMRAP", reps: "30s", rest: "15s" },
      ]},
    ],
  },
  {
    slug: "core-burn-5",
    title: "5-Minute Core Burn",
    minutes: 5,
    tag: "core",
    focus: "5-minute pure core burnout",
    intro: "Five minutes, mat only, pure core. No burpees, no fluff, just back-to-back ab work. Perfect finisher after any session.",
    equipment: "Mat only",
    image: "/__l5e/assets-v1/9eed9ea9-3d27-4dd8-bf42-75199cc15e5b/core-burn.png",
    blocks: [
      { title: "5 minute core circuit", minutes: 5, note: "3 rounds, 30 seconds work, 15 seconds rest between each exercise.", exercises: [
        { slug: "ab-crunches", name: "Ab Crunches", sets: "3", reps: "30s", rest: "15s" },
        { slug: "leg-raises", name: "Leg Raises", sets: "3", reps: "30s", rest: "15s" },
        { slug: "plank-hold", name: "Plank Hold", sets: "3", reps: "30s", rest: "15s" },
        { slug: "weighted-russian-twists-easy", name: "Russian Twists", sets: "3", reps: "30s", rest: "20s" },
      ]},
    ],
  },
  {
    slug: "gym-chest-blast-40",
    title: "Chest Pump, Gym",
    minutes: 40,
    tag: "gym",
    focus: "Bench, incline, fly, full chest pump",
    intro: "Forty minutes of pure chest work with full gym equipment. Heavy compound press, incline hypertrophy, and a cable-fly burnout.",
    equipment: "Barbell, dumbbells, cable stack, bench",
    image: "/__l5e/assets-v1/c4f88cd4-003e-43c7-88b8-6c5cbe3e4936/chest-pump-gym.png",
    blocks: [
      { title: "Warm-up", minutes: 5, exercises: [
        { slug: "push-ups", name: "Push Ups", sets: "2", reps: "10", rest: "45s" },
        { slug: "barbell-bench-press", name: "Barbell Bench Press", sets: "3", reps: "5", rest: "60s", note: "Empty bar → ramp up to working weight." },
      ]},
      { title: "Main press", minutes: 22, note: "Heavy compound work. Rest fully between top sets.", exercises: [
        { slug: "barbell-bench-press", name: "Barbell Bench Press", sets: "4", reps: "6-8", rest: "2 min" },
        { slug: "incline-dumbbell-chest-press", name: "Incline Dumbbell Chest Press", sets: "4", reps: "10", rest: "90s" },
        { slug: "machine-chest-press", name: "Machine Chest Press", sets: "3", reps: "12", rest: "60s" },
      ]},
      { title: "Isolation finisher", minutes: 13, note: "Superset, 3 rounds, rest 60s between rounds.", exercises: [
        { slug: "high-cable-chest-flys", name: "High Cable Chest Flys", sets: "3", reps: "12", rest: "45s" },
        { slug: "bench-dips-advanced", name: "Bench Dips", sets: "3", reps: "AMRAP", rest: "60s" },
      ]},
    ],
  },
  {
    slug: "gym-back-attack-40",
    title: "Back Attack, Gym",
    minutes: 40,
    tag: "gym",
    focus: "Deadlift, pulldown, rows, face pulls",
    intro: "Complete back day at the gym. One heavy hinge, vertical pull, horizontal pull, and rear delts. Everything a strong back needs in 40 minutes.",
    equipment: "Barbell, lat pulldown, cable stack, dumbbells",
    image: "/__l5e/assets-v1/62e1442f-8566-4802-be18-68edaef1266b/back-attack-gym.png",
    blocks: [
      { title: "Warm-up", minutes: 5, exercises: [
        { slug: "standing-cable-face-pulls", name: "Standing Cable Face Pulls", sets: "2", reps: "15", rest: "30s" },
        { slug: "lat-pulldown-wide-grip", name: "Lat Pulldown Wide Grip", sets: "2", reps: "10", rest: "45s", note: "Light, grease the pattern." },
      ]},
      { title: "Main lifts", minutes: 25, note: "Rest 2 min between heavy sets.", exercises: [
        { slug: "barbell-deadlift", name: "Barbell Deadlift", sets: "4", reps: "5", rest: "2 min" },
        { slug: "lat-pulldown-wide-grip", name: "Lat Pulldown Wide Grip", sets: "4", reps: "8", rest: "90s" },
        { slug: "seated-dual-handle-cable-row", name: "Seated Cable Row", sets: "3", reps: "10", rest: "90s" },
      ]},
      { title: "Rear delts + arms", minutes: 10, note: "Superset, 3 rounds, rest 45s between rounds.", exercises: [
        { slug: "standing-cable-face-pulls", name: "Standing Cable Face Pulls", sets: "3", reps: "15", rest: "45s" },
        { slug: "barbell-curls", name: "Barbell Curls", sets: "3", reps: "10", rest: "60s" },
      ]},
    ],
  },
  {
    slug: "gym-shoulder-sculpt-40",
    title: "Shoulder Sculpt, Gym",
    minutes: 40,
    tag: "gym",
    focus: "Overhead press, laterals, rear delts",
    intro: "Build round, capped shoulders. Heavy overhead press first, then all three delt heads with lateral raises, front raises, and face pulls.",
    equipment: "Barbell, dumbbells, cable stack",
    image: "/__l5e/assets-v1/a8a20d81-780b-4a40-a86b-8036bdef834d/shoulder-sculpt-gym.png",
    blocks: [
      { title: "Warm-up", minutes: 5, exercises: [
        { slug: "dumbbell-lateral-raise", name: "Dumbbell Lateral Raise", sets: "2", reps: "15", rest: "30s", note: "Light, wake the delts up." },
        { slug: "standing-cable-face-pulls", name: "Standing Cable Face Pulls", sets: "2", reps: "15", rest: "30s" },
      ]},
      { title: "Main press", minutes: 22, note: "Rest 90 sec to 2 minutes between working sets.", exercises: [
        { slug: "barbell-overhead-press", name: "Barbell Overhead Press", sets: "4", reps: "6-8", rest: "2 min" },
        { slug: "seated-dumbbell-shoulder-press", name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90s" },
        { slug: "dumbbell-lateral-raise", name: "Dumbbell Lateral Raise", sets: "4", reps: "12", rest: "60s" },
      ]},
      { title: "Delt burnout", minutes: 13, note: "Giant set, 3 rounds, rest 60s between rounds.", exercises: [
        { slug: "dumbbell-front-raises", name: "Dumbbell Front Raises", sets: "3", reps: "12", rest: "30s" },
        { slug: "standing-cable-face-pulls", name: "Standing Cable Face Pulls", sets: "3", reps: "15", rest: "30s" },
        { slug: "single-arm-cable-side-raise", name: "Single-Arm Cable Side Raise", sets: "3", reps: "12/side", rest: "60s" },
      ]},
    ],
  },
  {
    slug: "gym-leg-day-40",
    title: "Leg Day, Gym",
    minutes: 40,
    tag: "gym",
    focus: "Squat, RDL, hip thrust, calves",
    intro: "Full leg day at the gym in 40 minutes. Heavy squat, hinge for hamstrings, glute thrusts, and a brutal calf finisher.",
    equipment: "Barbell, leg press, hip thrust bench, calf machine",
    image: "/__l5e/assets-v1/6d6411a4-d4d6-49eb-88bc-ed5a9392175a/leg-day-gym.png",
    blocks: [
      { title: "Warm-up", minutes: 5, exercises: [
        { slug: "bodyweight-squats", name: "Bodyweight Squats", sets: "1", reps: "15", rest: "30s" },
        { slug: "barbell-squat", name: "Barbell Squat", sets: "3", reps: "5", rest: "60s", note: "Ramp up to working weight." },
      ]},
      { title: "Main lifts", minutes: 22, note: "Rest 2 min between top sets.", exercises: [
        { slug: "barbell-squat", name: "Barbell Squat", sets: "4", reps: "6", rest: "2 min" },
        { slug: "barbell-stiff-leg-deadlifts", name: "Barbell Stiff-Leg Deadlift", sets: "3", reps: "8", rest: "90s" },
        { slug: "seated-incline-leg-press", name: "Seated Leg Press", sets: "3", reps: "12", rest: "90s" },
      ]},
      { title: "Glutes + calves", minutes: 13, note: "3 rounds, rest 45s between exercises.", exercises: [
        { slug: "barbell-glute-hip-thrusts", name: "Barbell Glute Hip Thrust", sets: "3", reps: "10", rest: "60s" },
        { slug: "smith-machine-calve-raises", name: "Smith Machine Calve Raises", sets: "3", reps: "15", rest: "45s" },
      ]},
    ],
  },
  {
    slug: "home-shoulder-burn-25",
    title: "Shoulder Burn, Home",
    minutes: 25,
    tag: "home",
    focus: "Dumbbell delts, no gym needed",
    intro: "Round out your shoulders at home with just a pair of dumbbells. Press, raise all three delt heads, and finish with a shoulder-tap burnout.",
    equipment: "One pair of dumbbells, mat",
    image: "/__l5e/assets-v1/fbbbb7ab-6dbc-4811-a786-f917f81166de/shoulder-burn-home.png",
    blocks: [
      { title: "Warm-up", minutes: 4, exercises: [
        { slug: "push-ups", name: "Push Ups", sets: "2", reps: "10", rest: "30s" },
        { slug: "dumbbell-lateral-raise", name: "Dumbbell Lateral Raise", sets: "2", reps: "12", rest: "30s", note: "Light, wake the delts up." },
      ]},
      { title: "Shoulder circuit", minutes: 15, note: "3 rounds, rest 45s between exercises.", exercises: [
        { slug: "seated-dumbbell-shoulder-press", name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "45s" },
        { slug: "dumbbell-lateral-raise", name: "Dumbbell Lateral Raise", sets: "3", reps: "12", rest: "45s" },
        { slug: "dumbbell-front-raises", name: "Dumbbell Front Raises", sets: "3", reps: "12", rest: "45s" },
        { slug: "dumbbell-bent-over-rear-delt-fly", name: "Dumbbell Bent-Over Rear Delt Fly", sets: "3", reps: "12", rest: "45s" },
      ]},
      { title: "Finisher", minutes: 6, note: "AMRAP 5 minutes, rest 20s between exercises.", exercises: [
        { slug: "plank-shoulder-taps", name: "Plank Shoulder Taps", sets: "AMRAP", reps: "20 total", rest: "20s" },
        { slug: "push-ups", name: "Push Ups", sets: "AMRAP", reps: "10", rest: "20s" },
      ]},
    ],
  },
  {
    slug: "home-leg-burn-25",
    title: "Leg Burn, Home",
    minutes: 25,
    tag: "home",
    focus: "Bodyweight + dumbbell leg burn",
    intro: "Torch your legs at home. Squats, lunges, hip thrusts and a jump-squat finisher. Dumbbells help but bodyweight works.",
    equipment: "One pair of dumbbells (optional), mat",
    image: "/__l5e/assets-v1/54e5f988-3d66-442c-a215-9f61d64e1565/leg-burn-home.png",
    blocks: [
      { title: "Warm-up", minutes: 3, exercises: [
        { slug: "bodyweight-squats", name: "Bodyweight Squats", sets: "2", reps: "15", rest: "20s" },
        { slug: "glute-bridge-pulse", name: "Glute Bridge Pulse", sets: "2", reps: "12", rest: "20s" },
      ]},
      { title: "Leg circuit", minutes: 15, note: "3 rounds, rest 45s between exercises.", exercises: [
        { slug: "bodyweight-bulgarian-squats", name: "Bodyweight Bulgarian Squats", sets: "3", reps: "10/side", rest: "45s" },
        { slug: "alternating-bodyweight-reverse-lunges", name: "Alternating Bodyweight Reverse Lunges", sets: "3", reps: "10/side", rest: "45s" },
        { slug: "single-leg-body-weight-glute-hip-thrusts", name: "Single-Leg Glute Hip Thrust", sets: "3", reps: "12/side", rest: "45s" },
        { slug: "standing-bodyweight-calve-raises", name: "Standing Bodyweight Calve Raises", sets: "3", reps: "20", rest: "30s" },
      ]},
      { title: "Explosive finisher", minutes: 7, note: "AMRAP 6 minutes, rest 30s between exercises.", exercises: [
        { slug: "box-jumps", name: "Box Jumps", sets: "AMRAP", reps: "8", rest: "30s", note: "No box? Jump squats." },
        { slug: "burpees", name: "Burpees", sets: "AMRAP", reps: "5", rest: "30s" },
      ]},
    ],
  },
  {
    slug: "hyrox-burner-40",
    title: "Hyrox Burner",
    minutes: 40,
    tag: "hyrox",
    focus: "Sled, rower, burpees, box jumps",
    intro: "Full race-day feel. Sled push, rower, kettlebell swings and box jumps in a big engine circuit. Distances are in meters, row 500 m means row until the machine display reads 500 meters. Bring water.",
    equipment: "Sled, rower, kettlebell, box",
    image: "/__l5e/assets-v1/7ba2711c-5b63-4737-9349-82680dd45f70/hyrox-burner.png",
    blocks: [
      { title: "Warm-up", minutes: 5, exercises: [
        { slug: "rowing-machine", name: "Rowing Machine", sets: "1", reps: "3 min", rest: "45s", note: "Easy pace." },
        { slug: "half-burpees", name: "Half Burpees", sets: "2", reps: "10", rest: "30s" },
      ]},
      { title: "Hyrox stations", minutes: 30, note: "Work through the stations in order, top to bottom, one time only. Rest as noted between stations. Distances are meters, row 500 m means row until the screen reads 500 meters, sled 20 m means push the sled 20 meters down the floor and walk back.", exercises: [
        { slug: "rowing-machine", name: "Rowing Machine", sets: "1", reps: "500 m", rest: "60s", note: "Steady, hard pace. Row until the screen shows 500 meters." },
        { slug: "sled-push", name: "Sled Push", sets: "3", reps: "20 m", rest: "45s", note: "Push 20 meters, walk back, rest, repeat 3 times." },
        { slug: "burpees", name: "Burpees", sets: "1", reps: "15 reps", rest: "45s" },
        { slug: "rowing-machine", name: "Rowing Machine", sets: "1", reps: "500 m", rest: "60s", note: "Second row. Same pace if you can hold it." },
        { slug: "kettlebell-swings", name: "Kettlebell Swings", sets: "3", reps: "15 reps", rest: "30s", note: "3 sets of 15, rest 30s between." },
        { slug: "box-jumps", name: "Box Jumps", sets: "3", reps: "10 reps", rest: "30s" },
        { slug: "burpees", name: "Burpees", sets: "1", reps: "15 reps", rest: "60s", note: "Finisher. Empty the tank." },
      ]},
      { title: "Cool-down", minutes: 5, exercises: [
        { slug: "rowing-machine", name: "Rowing Machine", sets: "1", reps: "4 min", rest: "-", note: "Slow, breathe." },
      ]},
    ],
  },
  {
    slug: "gym-arm-day-40",
    title: "Arm Day, Gym",
    minutes: 40,
    tag: "gym",
    focus: "Barbell curls, cable pushdowns, preacher",
    intro: "Full arm day with the whole gym. Heavy barbell curls, preacher curls and cable pushdowns for a real pump.",
    equipment: "Barbell, dumbbells, cable stack, preacher bench",
    image: "/__l5e/assets-v1/7e318141-17f2-4d1c-a68d-b099a6a76a76/arm-day-gym.png",
    blocks: [
      { title: "Warm-up", minutes: 5, exercises: [
        { slug: "bench-tricep-dips", name: "Bench Tricep Dips", sets: "2", reps: "12", rest: "30s", note: "Bodyweight, warm the elbow." },
        { slug: "seated-dumbbell-bicep-curl", name: "Seated Dumbbell Bicep Curl", sets: "2", reps: "10", rest: "30s", note: "Light dumbbells." },
      ]},
      { title: "Biceps + triceps", minutes: 25, note: "Alternate biceps and triceps, rest 60-90s between working sets.", exercises: [
        { slug: "barbell-curls", name: "Barbell Curls", sets: "4", reps: "8-10", rest: "90s" },
        { slug: "cable-rope-tricep-pressdown", name: "Cable Rope Tricep Pressdown", sets: "4", reps: "12", rest: "60s" },
        { slug: "dumbbell-preacher-curls", name: "Dumbbell Preacher Curls", sets: "3", reps: "10", rest: "60s" },
        { slug: "cable-rope-overhead-tricep-extensions", name: "Cable Rope Overhead Tricep Extensions", sets: "3", reps: "12", rest: "60s" },
      ]},
      { title: "Arm pump finisher", minutes: 10, note: "Superset, 3 rounds, rest 45s between rounds.", exercises: [
        { slug: "incline-alternating-hammer-curls", name: "Incline Alternating Hammer Curls", sets: "3", reps: "10/side", rest: "45s" },
        { slug: "dumbbell-tricep-kickbacks", name: "Dumbbell Tricep Kickbacks", sets: "3", reps: "12", rest: "45s" },
      ]},
    ],
  },
];

export function findQuickWorkout(slug: string): QuickWorkout | undefined {
  return quickWorkouts.find((w) => w.slug === slug);
}
