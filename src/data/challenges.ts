import imgPushup from "@/assets/ch-pushup.jpg";
import imgWalking from "@/assets/ch-walking.jpg";
import img75hard from "@/assets/ch-75hard.jpg";
import imgDiscipline from "@/assets/ch-discipline.jpg";
import imgMobility from "@/assets/ch-mobility.jpg";
import imgZone2 from "@/assets/ch-zone2.jpg";
import imgPullup from "@/assets/ch-pullup.jpg";
import imgPlank from "@/assets/ch-plank.jpg";
import imgDry30 from "@/assets/ch-dry30.jpg";
import imgC25k from "@/assets/ch-c25k.jpg";
import imgCold from "@/assets/ch-cold.jpg";
import img20kWeekend from "@/assets/ch-20kweekend.jpg";
import imgSquat from "@/assets/ch-squat.jpg";
import imgNoSugar from "@/assets/ch-nosugar.jpg";
import img5am from "@/assets/ch-5am.jpg";
import imgGallon from "@/assets/ch-gallon.jpg";
import imgSplits from "@/assets/ch-splits.jpg";
import imgPistol from "@/assets/ch-pistol.jpg";
import imgHandstand from "@/assets/ch-handstand.jpg";
import imgNoPhone from "@/assets/ch-nophone.jpg";
import imgBurpee from "@/assets/ch-burpee.jpg";
import imgSleep from "@/assets/ch-sleep.jpg";
import imgDeadlift from "@/assets/ch-deadlift.jpg";
import imgVeggies from "@/assets/ch-veggies.jpg";
import img365 from "@/assets/ch-365.jpg";

export interface ProtocolStep {
  label: string;
  detail: string;
}

export interface Challenge {
  slug: string;
  title: string;
  tagline: string;
  category:
    "Strength" | "Conditioning" | "Mobility" | "Discipline" | "Steps" | "Mindset" | "Nutrition";
  durationDays: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  summary: string;
  rules: string[];
  dailyTask: string;
  reward: string;
  /** Step-by-step technique / form cues. */
  howTo: string[];
  /** Progressive schedule so people know exactly what to do each block. */
  protocol: ProtocolStep[];
  /** When to do it, morning, evening, anytime, split. */
  timing: string;
  /** Common mistakes to avoid. */
  mistakes: string[];
}

/**
 * Every finished challenge unlocks a single 20% off code, capped at one code
 * per user per calendar month. The code works on monthly or yearly plans and
 * can be used by the athlete themselves or shared with a friend — one use total.
 */
export function rewardPercentFor(_c: Pick<Challenge, "difficulty" | "durationDays">): number {
  return 20;
}

export const challenges: Challenge[] = [
  {
    slug: "30-day-pushup",
    title: "30-Day Push-Up Challenge",
    tagline: "From 10 to 100 reps in a single set. No gear. No excuses.",
    category: "Strength",
    durationDays: 30,
    difficulty: "Beginner",
    image: imgPushup,
    summary:
      "A progressive push-up ladder that adds volume every 48 hours. Builds chest, triceps, shoulders and core endurance, anywhere.",
    rules: [
      "Every push-up must reach full lockout and chest within a fist of the floor.",
      "Rest as needed between sets, but log the total reps for the day.",
      "If you miss a day, repeat the last day. Do not skip ahead.",
    ],
    dailyTask: "Hit the day's target reps in as few sets as possible.",
    reward: "Onyx Push-Up Badge on your profile + 15% off your next program.",
    timing: "Morning or before bed, split across the day in mini-sets if needed.",
    howTo: [
      "Hands shoulder-width, fingers spread, index fingers pointing forward.",
      "Squeeze glutes and brace abs, body is one straight line from ear to ankle.",
      "Lower for 2 seconds until chest is a fist from the floor, elbows ~45°.",
      "Press up explosively, fully locking out the elbows without flaring shoulders.",
      "Breathe in on the way down, exhale hard on the press.",
    ],
    protocol: [
      {
        label: "Week 1 (Days 1–7)",
        detail: "20 / 25 / 30 / rest / 35 / 40 / 45 total reps. Sets of 5–10.",
      },
      {
        label: "Week 2 (Days 8–14)",
        detail: "50 / 55 / 60 / rest / 65 / 70 / 75 total reps. Try sets of 10–15.",
      },
      {
        label: "Week 3 (Days 15–21)",
        detail: "80 / 85 / 90 / rest / 90 / 95 / 100 reps. Aim for ≤4 sets.",
      },
      {
        label: "Week 4 (Days 22–30)",
        detail: "Daily 100 reps. Last day: max unbroken set, log your number.",
      },
    ],
    mistakes: [
      "Sagging hips or piked butt, break form = stop the set.",
      "Hands too wide flaring elbows out 90°, kills the shoulders.",
      "Half reps to hit the number. Quality over quantity, always.",
    ],
  },
  {
    slug: "75-hard-onyx",
    title: "Onyx 75 Hard",
    tagline: "Two workouts. Clean diet. Read. Walk. 75 brutal days.",
    category: "Discipline",
    durationDays: 75,
    difficulty: "Advanced",
    image: img75hard,
    summary:
      "The hardest mental challenge on the platform. Five non-negotiables for 75 days straight. Miss one, restart from Day 1.",
    rules: [
      "Two 45-min workouts daily, one MUST be outdoors.",
      "Follow a diet you set in writing. Zero alcohol. Zero cheat meals.",
      "Drink 4 L of water. Read 10 pages of a non-fiction book.",
      "Take a daily progress photo.",
    ],
    dailyTask: "Check off all 5 daily non-negotiables.",
    reward: "Onyx 75 Hard Badge + permanent leaderboard spot.",
    timing: "Plan the day the night before. Workouts AM + PM, 4h+ apart.",
    howTo: [
      "Pre-load: write your diet rules, buy the book, schedule both workouts in your calendar.",
      "Outdoor workout = anything raining, snowing, freezing or sunny. Garage doesn't count.",
      "Water: 2 L by lunch, 4 L by 8 PM, stop drinking 2h before bed.",
      "Photo: same spot, same light, same outfit every day.",
    ],
    protocol: [
      {
        label: "Phase 1 (Days 1–25)",
        detail: "Survive. Focus only on hitting all 5 tasks, performance comes later.",
      },
      {
        label: "Phase 2 (Days 26–50)",
        detail: "Optimise. Improve workout quality and food choices. Strength gains start.",
      },
      {
        label: "Phase 3 (Days 51–75)",
        detail: "Refine. Add intent to every task, heavier lifts, longer walks, deeper reading.",
      },
    ],
    mistakes: [
      "Treating the outdoor workout as a leisurely walk, it must be 45 min of intent.",
      "Skipping the progress photo, it's the single best motivator on Day 60.",
      "Defining 'cheat meal' loosely. One bite of birthday cake = Day 1 tomorrow.",
    ],
  },
  {
    slug: "100-pullup-month",
    title: "100 Pull-Ups a Day",
    tagline: "Own your bodyweight. Build a back that turns heads.",
    category: "Strength",
    durationDays: 30,
    difficulty: "Advanced",
    image: imgPullup,
    summary:
      "Greasing the groove with 100 strict pull-ups every day. Split into as many sets as you need.",
    rules: [
      "Strict reps only, full hang to chin above the bar.",
      "Bands allowed for the first week, then strict only.",
      "Log total reps and number of sets each day.",
    ],
    dailyTask: "Hit 100 strict pull-ups (split however you want).",
    reward: "Bar Beast Badge + leaderboard placement.",
    timing: "Grease the groove: 10 reps every hour you're awake.",
    howTo: [
      "Dead hang start: arms straight, shoulders packed down.",
      "Pull until chin clearly above the bar, no chin reach.",
      "Lower under control for 2s. No drops, no kipping.",
      "Mix grips daily: pronated, supinated, neutral, wide.",
    ],
    protocol: [
      { label: "Week 1", detail: "Use bands if needed. 100 reps = 10 sets of 10 or 20 sets of 5." },
      { label: "Week 2", detail: "Drop the band. Sets of 5–8. Add 60–90s rest." },
      { label: "Week 3", detail: "Push sets of 8–12. Track your biggest single set." },
      { label: "Week 4", detail: "Mix grips daily. End the month with a max unbroken set test." },
    ],
    mistakes: [
      "Kipping to hit numbers, defeats the back-building purpose.",
      "Same grip every day, leads to elbow tendonitis.",
      "No deload. If shoulders ache 3+ days, cut volume 50%.",
    ],
  },
  {
    slug: "30-day-plank",
    title: "30-Day Plank Builder",
    tagline: "From 30 seconds to 5 minutes of dead-still core.",
    category: "Strength",
    durationDays: 30,
    difficulty: "Beginner",
    image: imgPlank,
    summary:
      "A progressive plank protocol that builds an iron core for every lift, run and posture.",
    rules: [
      "Hard-style plank, squeeze glutes, brace abs, no sagging hips.",
      "Time stops the moment form breaks.",
      "Log each day's max hold.",
    ],
    dailyTask: "Hit today's plank time in one unbroken hold.",
    reward: "Iron Core Badge + bonus 6-week ab program.",
    timing: "Once in the morning, once before bed, bookend your day with bracing.",
    howTo: [
      "Elbows directly under shoulders, forearms parallel.",
      "Body in a straight line: ear, shoulder, hip, knee, ankle.",
      "Squeeze glutes maximally and brace abs as if about to be punched.",
      "Tuck the chin slightly, eyes look down at your hands.",
      "Breathe shallow through the nose, never hold breath.",
    ],
    protocol: [
      { label: "Week 1 (Days 1–7)", detail: "30s → 45s → 60s → rest → 75s → 90s → 90s. AM only." },
      {
        label: "Week 2 (Days 8–14)",
        detail: "2 min → 2:15 → 2:30 → rest → 2:30 → 2:45 → 3 min. Add PM hold of 1 min.",
      },
      {
        label: "Week 3 (Days 15–21)",
        detail: "3 → 3:15 → 3:30 → rest → 3:30 → 3:45 → 4 min. Add side planks 30s each side.",
      },
      {
        label: "Week 4 (Days 22–30)",
        detail: "4 → 4:15 → 4:30 → rest → 4:30 → 4:45 → 5 min. Final 3 days: max hold test.",
      },
    ],
    mistakes: [
      "Hips sagging = lower back doing the work. Stop and reset.",
      "Butt in the air = cheating. Drop the hips down level.",
      "Looking forward, strains the neck. Keep eyes on your hands.",
      "Holding breath, guarantees you tap out 30s early.",
    ],
  },
  {
    slug: "dry-30",
    title: "Dry 30, Zero Alcohol",
    tagline: "30 days alcohol-free. Sleep better. Train harder. Think clearer.",
    category: "Nutrition",
    durationDays: 30,
    difficulty: "Intermediate",
    image: imgDry30,
    summary:
      "Cut alcohol for 30 days and feel what your body is actually capable of. The single biggest performance upgrade most people never try.",
    rules: [
      "Zero alcohol of any kind, including beer, wine, kombucha alcohol.",
      "Log sleep hours and morning energy 1-10 each day.",
      "Replace the social ritual with sparkling water + lime.",
    ],
    dailyTask: "Log an alcohol-free day + energy score.",
    reward: "Clear Mind Badge + Onyx Sleep Guide unlock.",
    timing: "Evening is the hardest, pre-plan a replacement ritual at 7 PM.",
    howTo: [
      "Tell 3 people: accountability cuts relapse rate in half.",
      "Stock the fridge with non-alc options before Day 1.",
      "Pre-decide your answer when offered a drink, practise it out loud.",
      "When cravings hit (always around Day 4 and Day 10), walk 10 minutes.",
    ],
    protocol: [
      {
        label: "Days 1–7",
        detail: "Worst sleep ever. Push through. Energy crash around Day 4 is normal.",
      },
      { label: "Days 8–14", detail: "Sleep deepens. Mornings get sharp. Cravings drop hard." },
      { label: "Days 15–21", detail: "Body composition starts visibly changing. Lifts go up." },
      {
        label: "Days 22–30",
        detail: "Decide your post-30 relationship with alcohol, write it down.",
      },
    ],
    mistakes: [
      "'I'll just have one', restart the streak.",
      "Avoiding all social events, learn to be sober in them instead.",
      "Replacing booze with sugar. You're trading one crutch for another.",
    ],
  },
  {
    slug: "5k-couch-to",
    title: "Couch to 5K",
    tagline: "From 0 to running 5 km without stopping in 8 weeks.",
    category: "Conditioning",
    durationDays: 56,
    difficulty: "Beginner",
    image: imgC25k,
    summary:
      "The classic beginner-friendly running protocol. Walk-run intervals that build to a non-stop 5 km finish.",
    rules: [
      "Run 3 days per week minimum (M / W / F).",
      "Follow the day's run-walk intervals exactly.",
      "Strength train or walk on off days, no full rest.",
    ],
    dailyTask: "Run today's scheduled interval or log active recovery.",
    reward: "5K Finisher Badge + Onyx Running plan discount.",
    timing: "Morning before work or evening to wind down. Same time = better adherence.",
    howTo: [
      "Warm up with 5 min brisk walk before every session.",
      "Land mid-foot under the hip, not heel-first out in front.",
      "Cadence ~170 steps/min, short, light steps. No bouncing.",
      "Cool down with 5 min walk + calf and hip stretches.",
    ],
    protocol: [
      { label: "Week 1", detail: "8 rounds of: 60s jog + 90s walk. 20 min total." },
      { label: "Week 2", detail: "6 rounds of: 90s jog + 2 min walk." },
      { label: "Week 3", detail: "2 rounds of: 90s jog, 90s walk, 3 min jog, 3 min walk." },
      {
        label: "Week 4",
        detail: "3 min jog, 90s walk, 5 min jog, 2:30 walk, 3 min jog, 90s walk, 5 min jog.",
      },
      {
        label: "Week 5",
        detail: "Day 1: 5/3/5 jog. Day 2: 8/5/8 jog. Day 3: 20 min straight jog.",
      },
      { label: "Week 6", detail: "Day 1: 5/8/5. Day 2: 10/3/10. Day 3: 25 min straight." },
      { label: "Week 7", detail: "3 sessions of 25-min nonstop run." },
      { label: "Week 8", detail: "Day 1: 28 min. Day 2: 28 min. Day 3: 5K finish line, go." },
    ],
    mistakes: [
      "Starting too fast. Run at conversation pace, not race pace.",
      "Skipping warm-up = shin splints by Week 3.",
      "Running on consecutive days early on, needs 48h recovery.",
    ],
  },
  {
    slug: "cold-shower-30",
    title: "30 Cold Showers",
    tagline: "Two minutes of cold every day. Become uncomfortable on purpose.",
    category: "Mindset",
    durationDays: 30,
    difficulty: "Intermediate",
    image: imgCold,
    summary:
      "End every shower with 2 minutes of cold water for 30 days. Build stress tolerance, kill brain fog, sleep like a rock.",
    rules: [
      "Cold = the coldest your tap goes, no warm-up cheats.",
      "Minimum 2 minutes uninterrupted.",
      "Breathe slow through the nose, no panic breathing.",
    ],
    dailyTask: "Finish today's shower with 2+ minutes of cold.",
    reward: "Cold Warrior Badge + entry to monthly draw.",
    timing: "Morning for energy + focus. Avoid within 4h of training (blunts gains).",
    howTo: [
      "Start with the chest, not the head. Let breathing settle for 10s.",
      "Then back of neck, then full body. Rotate slowly.",
      "Box breath: 4s in, 4s hold, 4s out, 4s hold. Repeat.",
      "Step out, don't towel off frantically, let body re-warm itself.",
    ],
    protocol: [
      {
        label: "Week 1",
        detail: "30s on Day 1, +15s each day until you hit 2:00. Pure shock survival.",
      },
      { label: "Week 2", detail: "Hold 2:00 every day. Focus on calm nasal breathing." },
      { label: "Week 3", detail: "Push to 3:00. Add a contrast: 60s hot, 90s cold × 2." },
      { label: "Week 4", detail: "3-min finishers. Final day: 5 min, log how you feel after." },
    ],
    mistakes: [
      "Hyperventilating through the mouth, triggers panic. Nose only.",
      "Tensing every muscle. Relax shoulders, drop jaw, surrender to it.",
      "Doing it right before bed, too stimulating, ruins sleep.",
    ],
  },
  {
    slug: "100-squat-day",
    title: "100 Squats Every Day",
    tagline: "Bulletproof knees, stronger glutes, no equipment.",
    category: "Strength",
    durationDays: 30,
    difficulty: "Beginner",
    image: imgSquat,
    summary:
      "100 bodyweight squats every single day for 30 days. Hits below parallel, chest tall, no momentum.",
    rules: [
      "Full depth, hip crease below the knee.",
      "Split into as many sets as you need.",
      "Add a backpack of books from Week 3 if too easy.",
    ],
    dailyTask: "Knock out 100 full-depth squats.",
    reward: "Iron Legs Badge + free Lower Body program week.",
    timing: "Best in 4 sets of 25 across the day, protects the knees.",
    howTo: [
      "Feet shoulder-width, toes slightly out, weight in mid-foot.",
      "Sit back and down, chest stays tall, knees track over toes.",
      "Descend until hip crease passes below the knee.",
      "Drive through whole foot, squeeze glutes at the top.",
    ],
    protocol: [
      { label: "Week 1", detail: "100 reps = 4 × 25 across the day. Focus: depth + tempo." },
      { label: "Week 2", detail: "2 × 50 or 100 unbroken. Add 3s descent." },
      { label: "Week 3", detail: "Add a backpack (10–15 kg). 4 × 25." },
      { label: "Week 4", detail: "Backpack 100 unbroken. Day 30: max set test." },
    ],
    mistakes: [
      "Knees caving in, film yourself and check from the front.",
      "Heels lifting, work ankle mobility before adding load.",
      "Half reps to hit 100, defeats the entire challenge.",
    ],
  },
  {
    slug: "1-gallon-water",
    title: "30 Days, 1 Gallon a Day",
    tagline: "3.8 L of water daily. Better skin, better sleep, better lifts.",
    category: "Nutrition",
    durationDays: 30,
    difficulty: "Beginner",
    image: imgGallon,
    summary:
      "A simple, savage hydration challenge. Get a 1 gallon jug and finish it every single day for 30 days.",
    rules: [
      "Plain water only, tea and coffee don't count.",
      "Finish before bed or it doesn't count.",
      "Add a pinch of salt + lemon if it tastes flat.",
    ],
    dailyTask: "Finish 1 gallon (3.8 L) of water.",
    reward: "Hydrated Badge + Electrolyte protocol unlock.",
    timing: "1 L by 10 AM · 2 L by 2 PM · 3 L by 6 PM · 3.8 L by 8 PM. Cut off 2h before bed.",
    howTo: [
      "Buy an actual 1-gallon jug, visual progress beats math.",
      "Drink 500 ml on waking, before coffee.",
      "Add electrolytes once a day, pure water washes out sodium.",
      "Eat your water: cucumber, watermelon, soup count as bonus.",
    ],
    protocol: [
      { label: "Week 1", detail: "You'll pee every 30 min. Normal. Body adapts by Day 5." },
      { label: "Week 2", detail: "Energy climbs. Skin clears. Hunger drops." },
      { label: "Week 3", detail: "Add electrolytes daily. Sleep deepens noticeably." },
      {
        label: "Week 4",
        detail: "Test the impact, skip one day on Day 31 and feel the difference.",
      },
    ],
    mistakes: [
      "Chugging 2 L at 8 PM to catch up, guarantees broken sleep.",
      "Skipping electrolytes, leads to headaches and cramps.",
      "Counting coffee. It doesn't count.",
    ],
  },
  {
    slug: "split-stretch",
    title: "60 Days to the Splits",
    tagline: "Daily PNF stretching to unlock full middle splits.",
    category: "Mobility",
    durationDays: 60,
    difficulty: "Advanced",
    image: imgSplits,
    summary:
      "Two months of progressive stretching protocol used by gymnasts and martial artists. Measure depth weekly.",
    rules: [
      "Warm up 5 min before any stretching.",
      "Hold each position 60–90 seconds, breathe slow.",
      "Photo measurement every 7 days.",
    ],
    dailyTask: "Complete today's 15-minute split routine.",
    reward: "Bendy Badge + Mobility program 20% off.",
    timing: "Evening, body is warmest, range is widest. Or after a workout.",
    howTo: [
      "Warm-up: 5 min light cardio + leg swings, never stretch cold.",
      "PNF: contract the stretched muscle 6s at 50%, then relax and sink deeper.",
      "Breathe out as you sink. Never bounce.",
      "Use blocks under the hands as your range improves.",
    ],
    protocol: [
      {
        label: "Weeks 1–2",
        detail: "Pancake fold + butterfly + half-split. 60s holds × 3 rounds.",
      },
      { label: "Weeks 3–4", detail: "Add box stretch + PNF contractions on the side splits." },
      { label: "Weeks 5–6", detail: "Hands-free middle split attempts daily. Measure weekly." },
      {
        label: "Weeks 7–8 (Days 49–60)",
        detail: "Hold final position 2 min × 3. Test full split on Day 60.",
      },
    ],
    mistakes: [
      "Stretching cold, fastest path to injury.",
      "Ego-stretching, sinking past pain triggers a guard reflex and you lose range.",
      "Skipping the photo, the only honest measure of progress.",
    ],
  },
  {
    slug: "30-pistol-squat",
    title: "30 Days to a Pistol Squat",
    tagline: "Single-leg squat to depth. Bodyweight mastery.",
    category: "Strength",
    durationDays: 30,
    difficulty: "Advanced",
    image: imgPistol,
    summary:
      "Progressions for ankle mobility, single-leg balance, and eccentric strength until you nail a clean pistol both sides.",
    rules: [
      "Train 5 days per week, rest 2.",
      "Film every Sunday for form check.",
      "No half-reps, full depth, hands free.",
    ],
    dailyTask: "Hit today's pistol progression set.",
    reward: "Single-Leg King/Queen Badge.",
    timing: "Before lower-body workouts or as a 15-min standalone session.",
    howTo: [
      "Ankle prep: wall dorsiflexion 30 reps before every session.",
      "Counterweight: hold a 5 kg plate at chest, keeps you balanced.",
      "Sit straight down, free leg straight forward, parallel to floor.",
      "Drive up through whole foot, no twisting.",
    ],
    protocol: [
      { label: "Week 1", detail: "Box pistols (sit to bench). 4 × 5 each leg." },
      { label: "Week 2", detail: "Lower box. Add 3s eccentric (lower for 3 sec)." },
      { label: "Week 3", detail: "Counterweight pistols, full depth, both legs." },
      { label: "Week 4", detail: "Bodyweight only. End of Week 4 = full pistol both sides." },
    ],
    mistakes: [
      "Skipping ankle mobility, heels will lift and you'll faceplant.",
      "Letting the knee cave in, film and check from the front.",
      "Training one leg more, always do equal reps both sides.",
    ],
  },
  {
    slug: "handstand-30",
    title: "30 Days to a Freestanding Handstand",
    tagline: "Five minutes of practice a day to hold a 10-second freestanding handstand.",
    category: "Strength",
    durationDays: 30,
    difficulty: "Advanced",
    image: imgHandstand,
    summary:
      "Daily wall holds, shoulder prep and balance drills. By Day 30, you're holding 10s freestanding.",
    rules: [
      "5 minutes of practice every day, no off days.",
      "Wrist prep before every session, non-negotiable.",
      "Film your best hold once per week.",
    ],
    dailyTask: "5 min of structured handstand practice.",
    reward: "Upside Down Badge + Mobility program unlock.",
    timing: "Morning when fresh, never tired or fatigued. Carpeted floor or grass.",
    howTo: [
      "Wrist prep: 2 min, knuckle push-ups, wrist circles, palm pulses.",
      "Hands shoulder-width, fingers spread, fingertips slightly clawing.",
      "Hollow body: ribs down, glutes squeezed, legs together pointing up.",
      "Balance with fingertips, not whole hand, like piano keys.",
    ],
    protocol: [
      {
        label: "Week 1",
        detail: "Wall facing handstand holds 3 × 30s. Build straight-line shape.",
      },
      { label: "Week 2", detail: "Back-to-wall holds 3 × 45s. Practise toe-taps off the wall." },
      {
        label: "Week 3",
        detail: "Freestanding kick-ups from wall. Catch yourself in balance for 2–5s.",
      },
      { label: "Week 4", detail: "Freestanding holds. Day 30: film a 10-second hold." },
    ],
    mistakes: [
      "Skipping wrist prep, guaranteed wrist pain by Day 5.",
      "Banana back, break this with hollow-body drills daily.",
      "Fear of falling, learn the cartwheel exit on Day 1.",
    ],
  },
  {
    slug: "no-phone-morning",
    title: "30 Phone-Free Mornings",
    tagline: "No phone for the first hour you're awake. For 30 days.",
    category: "Mindset",
    durationDays: 30,
    difficulty: "Intermediate",
    image: imgNoPhone,
    summary:
      "The simplest dopamine reset there is. First 60 minutes of every day, the phone stays face down. Watch your focus return.",
    rules: [
      "Alarm clock OK, phone stays in another room or face down.",
      "No social, no email, no news for the first 60 min.",
      "Replace with: water, walk, stretch, journal, train.",
    ],
    dailyTask: "Log a phone-free morning.",
    reward: "Deep Focus Badge.",
    timing: "Anchor it: wake up → water → 60-min no-phone window → first phone use.",
    howTo: [
      "Buy a real alarm clock. Charge phone in another room.",
      "Pre-write your morning schedule on paper the night before.",
      "Use the time for ONE chosen activity, not aimless wandering.",
      "Make the first phone interaction intentional: not unlocking on autopilot.",
    ],
    protocol: [
      { label: "Week 1", detail: "Survive. Twitch will be intense. Replace it with water + walk." },
      { label: "Week 2", detail: "Stack one habit: 15 min reading, journaling or stretching." },
      { label: "Week 3", detail: "Push to 90 min phone-free. Notice the mental sharpness." },
      { label: "Week 4", detail: "Extend the rule to: no phone during meals + after 9 PM." },
    ],
    mistakes: [
      "'Just checking the weather', it's never just the weather.",
      "Sleeping with phone as alarm, too tempting. Move it.",
      "Replacing phone with TV. Same dopamine trap.",
    ],
  },
  {
    slug: "burpee-100",
    title: "100 Burpees a Day",
    tagline: "The most hated, most effective full-body conditioning challenge.",
    category: "Conditioning",
    durationDays: 30,
    difficulty: "Advanced",
    image: imgBurpee,
    summary:
      "100 burpees every day for 30 days. Chest to floor, full jump, clap overhead. Split however you need.",
    rules: [
      "Chest must touch the floor every rep.",
      "Vertical jump with hands overhead at the top.",
      "Log total time each day, race yourself.",
    ],
    dailyTask: "Finish 100 strict burpees.",
    reward: "Engine Badge + Conditioning program discount.",
    timing: "Best as one all-out session, or 10 every hour grease-the-groove style.",
    howTo: [
      "Squat down, hands flat on floor shoulder-width.",
      "Kick legs back to a plank, chest fully to floor.",
      "Snap legs forward under hips.",
      "Explode up, full vertical jump, clap overhead.",
    ],
    protocol: [
      { label: "Week 1", detail: "10 every hour for 10 hours. Or 10 × 10 with 90s rest." },
      { label: "Week 2", detail: "10 × 10 with 60s rest. Track total time." },
      { label: "Week 3", detail: "5 × 20 with 90s rest. Push pace." },
      { label: "Week 4", detail: "100 unbroken, beat your Week 1 time by 50%." },
    ],
    mistakes: [
      "Skipping the chest-to-floor, that's not a burpee, that's a thing.",
      "Skipping the jump, same.",
      "Going to failure on Day 1, pace it or you'll quit by Day 5.",
    ],
  },
  {
    slug: "8h-sleep-30",
    title: "30 Nights of 8-Hour Sleep",
    tagline: "The simplest, most powerful performance upgrade on earth.",
    category: "Mindset",
    durationDays: 30,
    difficulty: "Intermediate",
    image: imgSleep,
    summary:
      "Eight hours of sleep every night for 30 nights. Phone off, room cold, dark, quiet. Watch every other metric improve.",
    rules: [
      "8h minimum in bed, lights off.",
      "Phone in airplane mode by 10 PM.",
      "Log sleep score from your tracker each morning.",
    ],
    dailyTask: "Log 8+ hours of sleep.",
    reward: "Rested Badge + Sleep Optimisation guide.",
    timing:
      "Work backwards from wake time: 7 AM wake = lights out 10:30 PM (sleep latency ~30 min).",
    howTo: [
      "Bedroom: 17–19 °C, blackout dark, completely silent.",
      "No screens 60 min before bed, read paper or stretch.",
      "Last caffeine 10h before bed. Last meal 3h before bed.",
      "Same wake time every day, including weekends.",
    ],
    protocol: [
      { label: "Week 1", detail: "Sleep debt repayment. Naps allowed. Body will demand 9–10h." },
      { label: "Week 2", detail: "Routine stabilises. Morning energy noticeably better." },
      { label: "Week 3", detail: "Lifts go up. Hunger normalises. Skin clears." },
      { label: "Week 4", detail: "You'll wake before the alarm. That's the win." },
    ],
    mistakes: [
      "Weekend sleep-ins, destroys the rhythm.",
      "Phone in bed 'just for 5 min', kills sleep latency.",
      "Alcohol in the evening, wrecks deep sleep even at 1 drink.",
    ],
  },
  {
    slug: "deadlift-bodyweight",
    title: "Deadlift Your Bodyweight × 2",
    tagline: "12 weeks to a double-bodyweight pull. Strength milestone unlocked.",
    category: "Strength",
    durationDays: 84,
    difficulty: "Advanced",
    image: imgDeadlift,
    summary:
      "Linear progression program to hit a 2x bodyweight deadlift. Three lifts per week, programmed pulls and accessories.",
    rules: [
      "Follow the percentage chart exactly.",
      "Eat in surplus or maintenance, no aggressive cuts.",
      "Film your top set every session.",
    ],
    dailyTask: "Hit today's prescribed lifting session or rest.",
    reward: "2x BW Pull Badge + permanent leaderboard.",
    timing: "Monday / Wednesday / Friday. Heaviest day after the most rest.",
    howTo: [
      "Bar over mid-foot. Shins ~2 cm from the bar.",
      "Hinge to grip, shoulders just in front of the bar.",
      "Big breath, brace, slack pulled out, push the floor away.",
      "Lock out hips and knees together, no hyperextension.",
    ],
    protocol: [
      {
        label: "Weeks 1–4 (Foundation)",
        detail: "3 × 5 @ 70% 1RM. Pause deadlifts on Wednesdays.",
      },
      { label: "Weeks 5–8 (Volume)", detail: "5 × 3 @ 80%. Add deficit deadlifts and RDLs." },
      {
        label: "Weeks 9–11 (Intensity)",
        detail: "Work up to a top single @ 90%. Back-off sets at 80%.",
      },
      { label: "Week 12 (Peak)", detail: "Light deload Mon/Wed. Friday: attempt 2× bodyweight." },
    ],
    mistakes: [
      "Bar drifting forward, keep it dragging up the shins.",
      "Rounding the upper back under heavy load, reset, brace harder.",
      "Cutting weight to look lean, kills the lift. Eat to lift heavy.",
    ],
  },
  {
    slug: "veggie-everyday",
    title: "Vegetables Every Meal",
    tagline: "30 days, vegetables at every single meal. Yes, breakfast too.",
    category: "Nutrition",
    durationDays: 30,
    difficulty: "Beginner",
    image: imgVeggies,
    summary:
      "Most adults eat zero vegetables before dinner. Fix that for 30 days and rebuild your gut, energy and recovery.",
    rules: [
      "At least one fist-sized portion of veg every meal.",
      "Fries don't count. Sorry.",
      "Photo log encouraged.",
    ],
    dailyTask: "Log 3 meals with vegetables.",
    reward: "Green Plate Badge + Recipes pack.",
    timing: "Prep on Sunday, 5 portions per day means 35 portions a week.",
    howTo: [
      "Breakfast trick: spinach in eggs, peppers in omelette, tomato on toast.",
      "Lunch trick: half plate of mixed salad before the main.",
      "Dinner trick: roast a tray of veg with everything you cook.",
      "Variety beats quantity, aim for 5 different colours per week.",
    ],
    protocol: [
      { label: "Week 1", detail: "Easy wins: add spinach, tomato, cucumber to existing meals." },
      {
        label: "Week 2",
        detail: "Add a roasted veg tray to your weekly prep. Use it on everything.",
      },
      { label: "Week 3", detail: "Try 2 new vegetables you've never cooked." },
      { label: "Week 4", detail: "Hit 30+ unique plant foods over 7 days for gut microbiome." },
    ],
    mistakes: [
      "Counting potato as a veg, it's a starch.",
      "Drowning veg in cheese sauce, defeats the win.",
      "Same 2 veg every day, variety drives gut health.",
    ],
  },
  {
    slug: "365-day-streak",
    title: "365-Day Streak",
    tagline: "One full year. One workout a day. No missed days.",
    category: "Discipline",
    durationDays: 365,
    difficulty: "Advanced",
    image: img365,
    summary:
      "The Onyx flagship challenge. Train every single day for a full year, log one session, walk, mobility flow, or strength workout. Miss a day, the streak restarts at zero. Finish it and you unlock 1 free Onyx program of your choice, permanent founder badge, and a leaderboard slot.",
    rules: [
      "Log at least one session every day for 365 days straight.",
      "Minimum 20 minutes, strength, cardio, mobility, or walking all count.",
      "Miss a day and the streak resets to Day 1. No freezes, no excuses.",
      "Travel days: a 30-minute walk counts. Sick days: 10 minutes mobility counts.",
    ],
    dailyTask: "Log today's session before midnight.",
    reward: "Founder 365 Badge + 1 FREE Onyx program of your choice + permanent leaderboard.",
    timing:
      "Anytime. Build it into the same slot every day so it becomes identity, not motivation.",
    howTo: [
      "Plan the week on Sunday, block 30 min every day in your calendar.",
      "Lower the bar on bad days: a 20-min walk preserves the streak.",
      "Stack the habit on something existing (post-coffee, post-work, pre-shower).",
      "Track in the Onyx app, the visible streak is the strongest motivator you have.",
    ],
    protocol: [
      {
        label: "Month 1 (Days 1–30)",
        detail:
          "Build the habit. Easy sessions, low pressure. Hit Day 30 = halfway-home psychologically.",
      },
      {
        label: "Months 2–3 (Days 31–90)",
        detail:
          "Add structure. Run an Onyx program inside the streak. Don't chase intensity, chase consistency.",
      },
      {
        label: "Months 4–6 (Days 91–180)",
        detail: "Test progress. Re-test a benchmark from Month 1 (5K time, bench, pull-up max).",
      },
      {
        label: "Months 7–9 (Days 181–270)",
        detail:
          "Danger zone. Most people quit here. Schedule lighter weeks, more walks, more mobility.",
      },
      {
        label: "Months 10–12 (Days 271–365)",
        detail: "Finish strong. Final 30 days = a peak block of your choosing. Document Day 365.",
      },
    ],
    mistakes: [
      "Going too hard in Month 1, burnout kills 90% of streaks before Day 60.",
      "No backup plan for travel / sick days, pre-decide what counts.",
      "Skipping recovery weeks, schedule a deload every 6–8 weeks within the streak.",
      "Not logging same-day, the app's streak counter resets if you forget. Log before bed, every night.",
    ],
  },
];

export function getChallenge(slug: string) {
  return challenges.find((c) => c.slug === slug);
}
