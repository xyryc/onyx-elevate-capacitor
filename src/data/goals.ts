import heroImg from "@/assets/athlete-power.jpg";
import strengthImg from "@/assets/athlete-strength.jpg";
import coachImg from "@/assets/athlete-coach.jpg";
import conditioningImg from "@/assets/athlete-conditioning.jpg";

export interface GoalPhase {
  weeks: string;
  name: string;
  focus: string;
  details: string;
}

export interface GoalSession {
  day: string;
  title: string;
  lifts: string[];
}

export interface GoalFAQ {
  q: string;
  a: string;
}

export interface Goal {
  slug: string;
  title: string;
  tag: string;
  img: string;
  tagline: string;
  desc: string;
  comingSoon: boolean;
  ctaTo: "/programs" | "/app" | "/exercises";
  ctaLabel: string;
  stats: { label: string; value: string }[];
  overview: string;
  whyItWorks: string;
  highlights: string[];
  structure: GoalPhase[];
  sampleWeek: GoalSession[];
  principles: { title: string; body: string }[];
  nutrition: string[];
  recovery: string[];
  whoFor: string;
  notFor: string;
  faqs: GoalFAQ[];
  relatedExercises: string[];
}

export const goals: Goal[] = [
  {
    slug: "build-muscle",
    title: "Build Muscle",
    tag: "Hypertrophy",
    img: heroImg,
    tagline: "Engineered size. Visible every 4 weeks.",
    desc: "Volume, intensity and progression engineered for visible size.",
    comingSoon: false,
    ctaTo: "/programs",
    ctaLabel: "Explore hypertrophy programs",
    stats: [
      { label: "Length", value: "8–16 weeks" },
      { label: "Sessions / wk", value: "4–6" },
      { label: "Avg sets / muscle", value: "12–18" },
      { label: "Deload", value: "Every 5th wk" },
    ],
    overview:
      "Hypertrophy is a numbers game - total weekly hard sets, proximity to failure, and progressive overload across structured blocks. Onyx hypertrophy plans push 10–20 hard sets per muscle group per week with planned deloads and exercise rotation to keep every fibre under productive stimulus.",
    whyItWorks:
      "Muscle grows when a fibre is challenged close to failure with enough total volume to drive protein synthesis above breakdown for ~36–72 hours. Onyx blocks hit that window twice per muscle per week, with intensity techniques layered in only where they outperform straight sets.",
    highlights: [
      "Upper/Lower or Push/Pull/Legs splits with optional arm/weak-point days",
      "Rep ranges 6–15 on compounds, 10–20 on isolations, RIR 1–3 on top sets",
      "Built-in deload every 5th week to manage systemic fatigue",
      "Exercise swaps for every machine - train at any commercial gym",
      "Progression logged by reps, load and RIR - not just weight added",
      "Mechanical drop sets, myo-reps and lengthened-partial finishers programmed in",
    ],
    structure: [
      {
        weeks: "Wk 1–2",
        name: "Accumulation A",
        focus: "Volume ramp",
        details:
          "Establish baseline loads. Sets per muscle 10–12. Stop 2–3 reps shy of failure. Movement quality and mind-muscle connection are the priority.",
      },
      {
        weeks: "Wk 3–4",
        name: "Accumulation B",
        focus: "Add density",
        details:
          "Sets per muscle 12–16. Tighten rest periods on isolations to 60–90s. Add one intensity technique per session (myo-reps or mechanical drop).",
      },
      {
        weeks: "Wk 5",
        name: "Deload",
        focus: "Recover & re-test",
        details:
          "Cut volume 40%, keep intensity. Re-test a top set on the main lift of each session. Sleep and food go up, stimulants come down.",
      },
      {
        weeks: "Wk 6–8",
        name: "Intensification",
        focus: "Bring failure closer",
        details:
          "Sets per muscle 14–18, RIR drops to 0–1 on the last set of each exercise. Progressive overload measured weekly.",
      },
      {
        weeks: "Wk 9+",
        name: "Specialisation",
        focus: "Bring up weak points",
        details:
          "One muscle group gets a third weekly session. Volume on maintenance groups drops to a minimum effective dose.",
      },
    ],
    sampleWeek: [
      {
        day: "Mon",
        title: "Upper - Chest & Back Focus",
        lifts: [
          "Incline DB Press 4×8",
          "Chest-Supported Row 4×10",
          "Cable Fly 3×12",
          "Lat Pulldown 3×12",
          "Triceps Pushdown 3×15",
          "Hammer Curl 3×12",
        ],
      },
      {
        day: "Tue",
        title: "Lower - Quad Focus",
        lifts: [
          "Back Squat 4×6",
          "Hack Squat 3×10",
          "Walking Lunge 3×12/leg",
          "Leg Extension 3×15",
          "Standing Calf Raise 4×12",
          "Hanging Knee Raise 3×15",
        ],
      },
      {
        day: "Thu",
        title: "Upper - Shoulders & Arms",
        lifts: [
          "Seated DB Press 4×8",
          "Lateral Raise 4×15",
          "Cable Row 4×10",
          "Preacher Curl 3×10",
          "Skull Crusher 3×10",
          "Face Pull 3×15",
        ],
      },
      {
        day: "Fri",
        title: "Lower - Posterior Chain",
        lifts: [
          "Romanian Deadlift 4×8",
          "Hip Thrust 4×10",
          "Seated Leg Curl 3×12",
          "Bulgarian Split Squat 3×10/leg",
          "Seated Calf Raise 4×15",
          "Pallof Press 3×12/side",
        ],
      },
      {
        day: "Sat",
        title: "Optional Pump Day",
        lifts: ["Cable-only chest/back/arm circuit, 45 min, RIR 0–1, 60s rest"],
      },
    ],
    principles: [
      {
        title: "Stimulus, not destruction",
        body: "The goal of every set is the smallest dose that grows muscle, not the biggest pile of fatigue. Train hard, recover harder.",
      },
      {
        title: "Two exposures per week",
        body: "Every muscle group gets at least two trainings per week, separated by 48–72 hours, to keep protein synthesis elevated.",
      },
      {
        title: "Progress is multi-variable",
        body: "Reps in reserve, load, range of motion, and tempo all count as progress. A clean 8 today beats a sloppy 10.",
      },
      {
        title: "Rotate, don't rebuild",
        body: "Swap one exercise per block, not the whole program. Continuity drives long-term adaptation.",
      },
    ],
    nutrition: [
      "Calories: maintenance + 200–400 kcal for a clean lean bulk",
      "Protein: 1.6–2.2 g per kg of bodyweight, spread across 4–5 feedings",
      "Carbs: 4–6 g per kg on training days, biased around the session",
      "Creatine 5 g daily, electrolytes pre-session, whey peri-workout if appetite is low",
    ],
    recovery: [
      "7.5–9 hours of sleep - non-negotiable for hypertrophy",
      "One full rest day per week minimum, two if life stress is high",
      "Zone-2 cardio 1–2× per week to support recovery, not burn calories",
      "Soft-tissue work on lagging body parts, 5 minutes pre-session",
    ],
    whoFor:
      "Lifters with 6+ months of consistent training who want measurable size gains in chest, back, arms and legs over a full 12-week block.",
    notFor:
      "Total beginners (start with the Beginner Strength program first) and anyone in the last 6 weeks of a fat-loss cut.",
    faqs: [
      {
        q: "How fast will I see size gains?",
        a: "Visible changes in the mirror by week 4, photo-comparable changes by week 8, measurable tape changes (1–2cm on arms, 2–4cm on legs) across a full 12-week block.",
      },
      {
        q: "Can I run cardio alongside this?",
        a: "Yes - 2× weekly zone-2 sessions of 30–40 minutes support recovery. Avoid high-intensity intervals within 24h of a leg day.",
      },
      {
        q: "What if I miss a session?",
        a: "Push the week back by one day. Never compress two hard sessions into 24 hours - recovery is where growth happens.",
      },
      {
        q: "Do I need a coach to run this?",
        a: "No. The program self-regulates via RIR. A coach helps if you're prepping for the stage or have a stubborn weak point.",
      },
    ],
    relatedExercises: ["romanian-deadlift"],
  },
  {
    slug: "get-strong",
    title: "Get Strong",
    tag: "Strength",
    img: strengthImg,
    tagline: "Heavy. Programmed. Peaked.",
    desc: "Big lifts, low reps, peaking blocks built by competitive lifters.",
    comingSoon: false,
    ctaTo: "/programs",
    ctaLabel: "Explore strength programs",
    stats: [
      { label: "Length", value: "10–14 weeks" },
      { label: "Sessions / wk", value: "3–5" },
      { label: "Main lift sets", value: "3–5 / week" },
      { label: "Peak", value: "Week 12" },
    ],
    overview:
      "Strength work centres the squat, bench, deadlift and overhead press. Heavy doubles, triples and singles programmed in waves so you peak fresh on test day, not buried under junk volume. Every accessory has a job - fix a weak point or support the next main-lift PR.",
    whyItWorks:
      "Maximal strength is a skill. The neural system needs heavy exposures (>85% 1RM) programmed at the right density, while connective tissue and technique are built with sub-maximal volume work between peaks. Onyx blocks separate those two jobs cleanly.",
    highlights: [
      "% 1RM based programming with weekly auto-regulation by RPE",
      "Compound primary lifts + targeted assistance for sticking points",
      "Wave-loaded peaking blocks that build to a true 1RM test",
      "Form-check protocols on every main lift, every week",
      "Built-in technique work for the rack pull, paused bench and tempo squat",
      "Deload weeks every 4th week - volume cut, intensity preserved",
    ],
    structure: [
      {
        weeks: "Wk 1–3",
        name: "Hypertrophy base",
        focus: "Build connective tissue",
        details:
          "Main lifts 5×5 at 70–77% 1RM. Heavy back, hamstring and triceps assistance. RPE 7–8 cap.",
      },
      {
        weeks: "Wk 4",
        name: "Deload",
        focus: "Recover",
        details:
          "Volume cut 50%. One easy top single at 80% to maintain pattern. Sleep, food, mobility.",
      },
      {
        weeks: "Wk 5–8",
        name: "Strength accumulation",
        focus: "Add intensity",
        details:
          "Main lifts 4×3 at 80–87%. Pause work and tempo variations as second movement. Accessories drop to 3×8.",
      },
      {
        weeks: "Wk 9–11",
        name: "Peaking",
        focus: "Express strength",
        details:
          "Singles at 88–95%, doubles at 85%. Competition commands on squat and bench. Accessories halved.",
      },
      {
        weeks: "Wk 12",
        name: "Test week",
        focus: "Hit PRs",
        details:
          "Open the week with one easy day, then attempt new 1RMs on squat, bench and deadlift with full warm-up protocol.",
      },
    ],
    sampleWeek: [
      {
        day: "Mon",
        title: "Squat Day",
        lifts: [
          "Back Squat 4×3 @ 82%",
          "Paused Squat 3×3 @ 70%",
          "Bulgarian Split Squat 3×8/leg",
          "Leg Curl 3×10",
          "Standing Ab Wheel 3×8",
        ],
      },
      {
        day: "Wed",
        title: "Bench Day",
        lifts: [
          "Comp Bench 5×3 @ 80%",
          "Close-Grip Bench 3×6",
          "Incline DB Press 3×8",
          "Chest-Supported Row 4×8",
          "DB Triceps Extension 3×12",
        ],
      },
      {
        day: "Fri",
        title: "Deadlift Day",
        lifts: [
          "Conventional Deadlift 3×2 @ 85%",
          "Deficit Deadlift 3×4 @ 70%",
          "Barbell Row 4×6",
          "Glute Ham Raise 3×8",
          "Heavy Carry 3×40m",
        ],
      },
      {
        day: "Sat",
        title: "Overhead / Upper Back",
        lifts: [
          "Strict OHP 4×5",
          "Push Press 3×3",
          "Weighted Pull-Up 4×5",
          "Face Pull 3×15",
          "Hammer Curl 3×10",
        ],
      },
    ],
    principles: [
      {
        title: "Skill before grind",
        body: "Every rep at sub-maximal weight is a chance to rehearse the perfect rep you'll need at 95%. Treat 70% like 100%.",
      },
      {
        title: "Specificity wins",
        body: "If you want a big squat, squat - often, heavy, and with the bar position you'll compete in. Accessories support; they don't replace.",
      },
      {
        title: "Manage fatigue ruthlessly",
        body: "Singles at 90%+ are a withdrawal from a small bank. Earn them with volume work, then cash in during peak weeks.",
      },
      {
        title: "Bar speed is feedback",
        body: "If the bar slows more than 20% rep-to-rep at the same weight, the set is done. RPE caps protect the next session.",
      },
    ],
    nutrition: [
      "Calories: maintenance to +10% - strength needs fuel, not a surplus",
      "Protein: 1.8–2.2 g/kg, spread across the day",
      "Carbs: 5–7 g/kg on heavy main-lift days",
      "Sodium and electrolytes pre-session for pump and pressure on heavy singles",
    ],
    recovery: [
      "8+ hours of sleep - CNS recovery limits peak weeks",
      "Foam roll and band work daily, 5–10 minutes",
      "No high-intensity cardio in the 48h before squat or deadlift day",
      "Track resting HR weekly - a 5 bpm spike is a deload signal",
    ],
    whoFor:
      "Intermediate to advanced lifters with a clean technical base on the squat, bench and deadlift, chasing real PRs or prepping for a first meet.",
    notFor:
      "Lifters in their first year of training - build technique and base strength with linear progression first.",
    faqs: [
      {
        q: "Do I need to compete to run this?",
        a: "No. The program is built around peaking principles, but you can test your 1RMs in-gym in week 12 with a partner spotting.",
      },
      {
        q: "What if my technique breaks under heavy singles?",
        a: "Cap the set at the last clean rep, drop 5%, and rebuild over the next two weeks. Form is the speed limit.",
      },
      {
        q: "Can I add conditioning?",
        a: "Two short sled or bike sessions per week, on non-lifting days, max 20 minutes each. Don't burn recovery.",
      },
      {
        q: "What if I miss a peak week?",
        a: "Replace the missed singles with doubles at 85% the following week, then test in week 13 instead of 12.",
      },
    ],
    relatedExercises: ["romanian-deadlift"],
  },
  {
    slug: "conditioning",
    title: "Conditioning",
    tag: "Endurance",
    img: conditioningImg,
    tagline: "Build the engine. Keep the muscle.",
    desc: "Engine-building protocols for athletes who refuse to gas out.",
    comingSoon: false,
    ctaTo: "/programs",
    ctaLabel: "Explore conditioning programs",
    stats: [
      { label: "Length", value: "8–12 weeks" },
      { label: "Sessions / wk", value: "4–6" },
      { label: "Aerobic mins / wk", value: "120–180" },
      { label: "Intervals / wk", value: "2 sessions" },
    ],
    overview:
      "Mixed-modal conditioning that builds a real aerobic base, then layers lactate threshold and alactic power on top. Designed for hybrid athletes who still want to keep their strength - programmed alongside lifting with zero interference effect.",
    whyItWorks:
      "An aerobic base lowers resting heart rate, speeds inter-set recovery in the gym, and lets harder energy systems express themselves cleanly. Without it, intervals just dig a hole. Onyx conditioning starts with zone-2 volume and earns the right to go hard.",
    highlights: [
      "Zone-2 base work paired with weekly threshold and alactic intervals",
      "Sled, bike, row, sprint and loaded-carry options for every session",
      "Programmed alongside lifting - no interference effect",
      "Heart-rate and RPE targets on every session, not just 'go hard'",
      "Capacity tests every 4 weeks (5k row, 1-mile run, sled gauntlet)",
      "Mobility and breathing work woven into warm-ups",
    ],
    structure: [
      {
        weeks: "Wk 1–3",
        name: "Aerobic base",
        focus: "Build the engine",
        details:
          "120–180 min/wk at 60–70% max HR, broken into 3–4 sessions. One short tempo session. No high intensity.",
      },
      {
        weeks: "Wk 4",
        name: "Test & deload",
        focus: "Recalibrate",
        details: "5k row or 1-mile run test. Volume cut 40%. Re-set zone-2 paces from new HR data.",
      },
      {
        weeks: "Wk 5–7",
        name: "Threshold",
        focus: "Raise the ceiling",
        details:
          "2× weekly threshold intervals (e.g. 4×6 min @ 85%). Maintain 1–2 zone-2 sessions to protect the base.",
      },
      {
        weeks: "Wk 8–10",
        name: "Alactic power",
        focus: "Sharpen the top",
        details:
          "Short max-effort intervals (10–15s) with 1:6 work:rest. Sled, hill or bike sprints. One threshold + one base session weekly.",
      },
      {
        weeks: "Wk 11–12",
        name: "Mixed test block",
        focus: "Express it all",
        details:
          "Mixed-modal benchmark workouts that combine strength, intervals and base work. Compare to baseline.",
      },
    ],
    sampleWeek: [
      {
        day: "Mon",
        title: "Threshold Intervals",
        lifts: [
          "Warm-up 10 min",
          "4 × 6 min on bike or row @ RPE 8, 2 min easy between",
          "Cool-down 10 min zone-2",
        ],
      },
      {
        day: "Tue",
        title: "Zone 2",
        lifts: ["45 min steady on bike, ruck or jog at 60–70% max HR", "Nose-breathing throughout"],
      },
      {
        day: "Thu",
        title: "Alactic Power",
        lifts: [
          "8 × 15s sled push at max effort, 90s rest",
          "3 × 40m heavy carry",
          "5 min easy cool-down",
        ],
      },
      {
        day: "Sat",
        title: "Long Aerobic",
        lifts: [
          "60–75 min outdoor ruck, run or bike at conversational pace",
          "Optional 20 min mobility after",
        ],
      },
      {
        day: "Sun",
        title: "Mixed Finisher",
        lifts: ["20-min AMRAP: 400m row + 10 burpees + 10 KB swings", "Pace for steady, not max"],
      },
    ],
    principles: [
      {
        title: "Earn the right to go hard",
        body: "Intervals without a base are just suffering. Three weeks of zone-2 makes the next eight weeks of hard work actually productive.",
      },
      {
        title: "Strength is the floor, not the ceiling",
        body: "Lifting stays in the week. We just sequence it so heavy days and hard intervals never collide.",
      },
      {
        title: "Nose breathing as a governor",
        body: "If you can't hold nasal breathing in zone-2, the pace is too high. Slow down - that's where the adaptation lives.",
      },
      {
        title: "Test, don't guess",
        body: "Re-test the same benchmark every 4 weeks. Numbers tell you whether the block worked.",
      },
    ],
    nutrition: [
      "Calories: maintenance - conditioning blocks are not the time to cut hard",
      "Carbs: 5–8 g/kg on interval days, 3–5 g/kg on zone-2 days",
      "Electrolytes (sodium 800–1500 mg) before every session over 45 minutes",
      "Protein stays at 1.8–2.2 g/kg to protect muscle through the volume",
    ],
    recovery: [
      "Track morning resting HR - a 5+ bpm spike means swap a hard session for zone-2",
      "Cold exposure post-interval is fine; avoid it post-strength",
      "One full rest day per week, plus one active-mobility-only day",
      "Sleep 8h+, especially in weeks 8–10 when intensity peaks",
    ],
    whoFor:
      "Hybrid athletes, tactical operators, combat-sport athletes, and lifters who want to stop gassing out by minute three of a hard set or a long set of stairs.",
    notFor: "Anyone in a strength peak - finish the meet first, then layer conditioning back in.",
    faqs: [
      {
        q: "Will conditioning kill my gains?",
        a: "Not when programmed correctly. The block protects strength sessions with 24h spacing and keeps total weekly running under 12 km in most weeks.",
      },
      {
        q: "I don't have a sled. What do I use?",
        a: "Substitute with a heavy ruck march, hill walk, or bike sprints. The energy-system target matters more than the tool.",
      },
      {
        q: "Can I run this prepping for a Hyrox or military selection?",
        a: "Yes - start with the base block 12 weeks out, then weight the mixed-modal phase heavier in the final 4 weeks.",
      },
      {
        q: "How fast will my resting HR drop?",
        a: "Most athletes see a 5–10 bpm drop in resting HR across 8 weeks of consistent zone-2 plus weekly threshold work.",
      },
    ],
    relatedExercises: ["romanian-deadlift"],
  },
  {
    slug: "1-on-1-coaching",
    title: "1-on-1 Coaching",
    tag: "Coached",
    img: coachImg,
    tagline: "A coach in your corner. Not another template.",
    desc: "Get programmed by an Onyx coach with weekly check-ins and form review.",
    comingSoon: true,
    ctaTo: "/app",
    ctaLabel: "Join the waitlist",
    stats: [
      { label: "Coach load", value: "Max 25 athletes" },
      { label: "Check-ins", value: "Weekly" },
      { label: "Form review", value: "Unlimited" },
      { label: "Response time", value: "< 24h" },
    ],
    overview:
      "Fully custom programming written for you, every week, by a competitive Onyx coach. Weekly written check-ins, unlimited video form review on the big lifts, and direct messaging inside the app. Your training plan adapts to your sleep, stress, travel and progress - not the other way around.",
    whyItWorks:
      "Templates can't see your last sleep score, your tight left hip, or the meeting that wrecked your Wednesday. A coach can. We blend block periodisation with weekly auto-regulation so the program survives real life and still moves the needle.",
    highlights: [
      "Custom block periodisation built around your schedule and equipment",
      "Weekly written check-in with adjustments for the next 7 days",
      "Unlimited video form review on squat, bench, deadlift and OHP",
      "Direct chat with your coach inside the Onyx app, < 24h response",
      "Nutrition macros and feeding strategy reviewed monthly",
      "Recovery, sleep and travel protocols built into the plan",
    ],
    structure: [
      {
        weeks: "Wk 0",
        name: "Onboarding",
        focus: "Diagnose",
        details:
          "Movement screen, training history, goal-setting call, baseline 1RMs or estimated maxes. Plan written within 72 hours.",
      },
      {
        weeks: "Wk 1–4",
        name: "Block 1",
        focus: "Build the base",
        details:
          "First block tuned to your weak points. Form review on every main lift. Weekly tweaks based on RPE and recovery.",
      },
      {
        weeks: "Wk 5",
        name: "Re-assessment",
        focus: "Adjust",
        details:
          "Compare baseline to current. Coach rewrites the next block with new targets, splits, or volume.",
      },
      {
        weeks: "Wk 6–12",
        name: "Block 2 & 3",
        focus: "Specialise",
        details:
          "Programming sharpens toward your specific goal - peak, photo shoot, event, or sport season. Cross-discipline support (mobility, conditioning) layered in as needed.",
      },
      {
        weeks: "Ongoing",
        name: "Long-term",
        focus: "Compound progress",
        details:
          "Most coached athletes stay 6–12 months. Quarterly strategy reviews keep the long arc on track.",
      },
    ],
    sampleWeek: [
      {
        day: "Mon",
        title: "Coach-built session 1",
        lifts: [
          "Plan delivered in the app the night before with notes on intent, RPE caps and rest",
        ],
      },
      {
        day: "Tue",
        title: "Coach-built session 2",
        lifts: ["Form-review uploads reviewed within 24h with timestamped feedback"],
      },
      {
        day: "Wed",
        title: "Active recovery",
        lifts: ["Mobility, breathing or zone-2 if recovery markers allow"],
      },
      {
        day: "Thu/Fri",
        title: "Sessions 3 & 4",
        lifts: ["Adjusted in real time if you message your coach about sleep, stress or pain"],
      },
      {
        day: "Sun",
        title: "Check-in",
        lifts: [
          "You answer a short structured form. Coach responds with the next week's plan and notes.",
        ],
      },
    ],
    principles: [
      {
        title: "Individualisation beats optimisation",
        body: "The best program on paper loses to the second-best program you'll actually follow. Coaching keeps it fitted to your life.",
      },
      {
        title: "Data + dialogue",
        body: "Numbers in the app, conversation in chat. Neither alone gives the full picture.",
      },
      {
        title: "Long arcs, short loops",
        body: "12-month vision, 4-week blocks, 7-day adjustments, daily session intent. Every layer feeds the one above it.",
      },
      {
        title: "Honest accountability",
        body: "Your coach will push when you need pushing and pull back when you need recovery. No vanity programming.",
      },
    ],
    nutrition: [
      "Monthly macro review based on bodyweight, performance and photos",
      "Pre/intra/post-workout fuelling tuned to your session times",
      "Travel and eating-out playbooks built collaboratively",
      "Supplement stack recommendations grounded in your bloodwork (if available)",
    ],
    recovery: [
      "Weekly recovery score tracked alongside training",
      "Sleep, HRV and stress flagged in the check-in form",
      "Programmed deloads - your coach calls them before you crash",
      "Travel weeks pre-planned with hotel-gym or bodyweight alternatives",
    ],
    whoFor:
      "Serious athletes who want a coach in their corner - first meet, first show, first selection, or just done templating their own training.",
    notFor:
      "Beginners with under 6 months of training history - start with the structured Onyx programs to build context first.",
    faqs: [
      {
        q: "When does coaching open?",
        a: "Onyx 1-on-1 coaching opens in waves as coach capacity allows. Join the waitlist and you'll be invited as a spot opens with a coach matched to your goal.",
      },
      {
        q: "How much does it cost?",
        a: "Pricing is set per coach based on experience and athlete load. Expect $200–400/month, billed monthly with no long-term contract.",
      },
      {
        q: "How do I get matched with a coach?",
        a: "After you join the waitlist, we send a short questionnaire on goals, schedule and history, then match you with a coach whose specialty fits.",
      },
      {
        q: "What if I don't click with my coach?",
        a: "Re-match anytime in the first 30 days, no questions. Long-term fit matters more than starting fast.",
      },
    ],
    relatedExercises: ["romanian-deadlift"],
  },
];

export const goalsBySlug: Record<string, Goal> = Object.fromEntries(goals.map((g) => [g.slug, g]));
