import coachSimenAsset from "@/assets/coach-simen-new.jpg.asset.json";
const coachSimen = coachSimenAsset.url;
import coachLarsAsset from "@/assets/coach-lars.jpg.asset.json";
import coachLars2Asset from "@/assets/coach-lars-2.jpg.asset.json";
const coach2 = coachLarsAsset.url;
const coach2b = coachLars2Asset.url;
import coachThiagoAsset from "@/assets/coach-thiago.png.asset.json";
import coachThiago1Asset from "@/assets/coach-thiago-1.jpg.asset.json";
import coachThiago2Asset from "@/assets/coach-thiago-2.jpg.asset.json";
import coachThiago3Asset from "@/assets/coach-thiago-3.jpg.asset.json";
const coachThiago = coachThiagoAsset.url;
const coachThiago1 = coachThiago1Asset.url;
const coachThiago2 = coachThiago2Asset.url;
const coachThiago3 = coachThiago3Asset.url;
import coachTrymAsset from "@/assets/coach-trym-new.jpg.asset.json";
const coachTrym = coachTrymAsset.url;
import coachMichaelAsset from "@/assets/coach-michael-new.jpg.asset.json";
const coachMichael = coachMichaelAsset.url;
import coachNickAsset from "@/assets/coach-nick-new.jpg.asset.json";
const coachNick = coachNickAsset.url;
import coachJorgenAsset from "@/assets/coach-jorgen.png.asset.json";
const coachJorgen = coachJorgenAsset.url;

export interface Coach {
  slug: string;
  name: string;
  role: string;
  tag: string;
  img: string;
  gallery?: string[];
  competes: boolean;
  bio: string;
  longBio?: string[];
  achievements?: string[];
  yearsTraining?: number;
  weightClass?: string;
  specialties: string[];
  signatureLifts: string[];
  weeklySplit: { day: string; focus: string }[];
  philosophy: string;
  tips: string[];
  coaching: {
    title: string;
    summary: string;
    includes: string[];
    price: string;
  };
  instagram?: string;
}

export const coaches: Coach[] = [
  {
    slug: "simen",
    name: "Simen",
    role: "Founder · Strongman",
    tag: "Strongman",
    img: coachSimen,
    competes: false,
    bio: "Founder of Onyx Elevate and the engine behind the whole ecosystem. Simen trains as a strongman, heavy carries, log press, stones, deadlifts, and built Onyx to give everyone access to the same kind of programming that took him from gym lifter to platform athlete.",
    specialties: [
      "Strongman event prep",
      "Maximal strength",
      "Conditioning under load",
      "Mental toughness",
    ],
    signatureLifts: ["Axle deadlift", "Log clean & press", "Atlas stones", "Yoke walk"],
    weeklySplit: [
      { day: "Mon", focus: "Heavy lower, squat / deadlift variations" },
      { day: "Tue", focus: "Overhead pressing + event prep (log, axle)" },
      { day: "Wed", focus: "Conditioning, sled, prowler, loaded carries" },
      { day: "Thu", focus: "Pulling day, rows, pulldowns, biceps" },
      { day: "Fri", focus: "Strongman events, moving medleys, stones" },
      { day: "Sat", focus: "Active recovery + mobility" },
      { day: "Sun", focus: "Rest" },
    ],
    philosophy:
      "Train hard, train smart, never skip the boring stuff. Real strength is built on years of quiet work, heavy carries, mobility, sleep and food.",
    tips: [
      "Brace before you load, your belt is not your spine",
      "If your warm-up is a joke, your max attempt will be too",
      "Sleep is the cheapest performance enhancer on earth",
      "Train the events that challenge you twice as often as the ones you enjoy",
    ],
    coaching: {
      title: "Strongman & Raw Strength Coaching with Simen",
      summary:
        "Custom strongman or raw strength programming with weekly check-ins. Built for athletes who want to compete or just lift heavy stuff for the rest of their lives.",
      includes: [
        "Custom 4-week training blocks",
        "Weekly video form review",
        "Event-specific programming (log, stones, yoke, deadlift)",
        "Nutrition framework + recovery plan",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "",
    },
  },
  {
    slug: "lars",
    name: "Lars",
    role: "Bodybuilder · Norwegian Champion",
    tag: "Bodybuilding",
    img: coach2,
    gallery: [coach2, coach2b],
    competes: true,
    yearsTraining: 10,
    weightClass: "Men's Classic Physique",
    bio: "Norwegian bodybuilder with 10+ years under the bar and a long list of titles in his weight class. Lars treats every offseason like a science project and every prep like a championship campaign, because for him, it usually is.",
    longBio: [
      "Lars has been training seriously for over a decade and competing in Norwegian bodybuilding federations for most of that time. He's stood on top of the podium in his weight class at multiple regional and national-level shows across Norway, and he knows exactly what separates a placing physique from a winning one.",
      "His approach is built on what actually works in a real prep: precise volume landmarks, brutal mind-muscle connection, strict tempo, and food/training data tracked to the gram. No guesswork, no 'vibes', just a system refined over 10+ years of stepping on stage.",
      "If you want to build a stage-ready physique, or just want to look like you actually lift, Lars brings championship-level programming and the lived experience of someone who has done the work, peaked on the day, and walked off with the trophy.",
    ],
    achievements: [
      "Multiple-time Norwegian bodybuilding champion in his weight class",
      "10+ years of competitive training and stage experience",
      "Repeat top-3 placings at regional and national-level shows",
      "Coaches athletes through full contest prep, peak week and posing",
      "Built a decade-long competitive physique through consistent training",
    ],
    specialties: [
      "Hypertrophy programming",
      "Contest prep",
      "Posing",
      "Peak week protocols",
      "Mind-muscle connection",
    ],
    signatureLifts: ["Incline DB press", "Pendulum squat", "Cable row variations", "Hack squat"],

    weeklySplit: [
      { day: "Mon", focus: "Chest + side delts" },
      { day: "Tue", focus: "Back width + rear delts" },
      { day: "Wed", focus: "Quad-dominant lower" },
      { day: "Thu", focus: "Arms + abs" },
      { day: "Fri", focus: "Back thickness + shoulders" },
      { day: "Sat", focus: "Hamstrings, glutes + calves" },
      { day: "Sun", focus: "Cardio + posing practice" },
    ],
    philosophy:
      "Hypertrophy is volume, proximity to failure and consistency over years. There is no magic split, just hard sets in the right rep range, eaten and slept on.",
    tips: [
      "Take the last 1, 2 sets to true failure on isolations",
      "Stretch under load matters more than peak contraction",
      "Track everything, weight, reps, RIR and notes",
      "Eat protein every 3, 4 hours, no exceptions",
    ],
    coaching: {
      title: "Hypertrophy & Physique Coaching with Lars",
      summary:
        "Science-based bodybuilding programming with weekly check-ins, physique photo review and full nutrition plan. From offseason mass to stage-ready conditioning.",
      includes: [
        "Custom hypertrophy split + exercise selection",
        "Weekly physique check-ins (photos + measurements)",
        "Macro targets that adjust with progress",
        "Posing feedback for competitors",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "",
    },
  },
  {
    slug: "thiago-deschamps",
    name: "Thiago Deschamps",
    role: "Powerlifter · Strongman · Brazil",
    tag: "Powerlifting",
    img: coachThiago1,
    gallery: [coachThiago1, coachThiago2, coachThiago3],
    competes: true,
    yearsTraining: 10,
    weightClass: "Open / Heavyweight",
    bio: "The only Brazilian on the Onyx coaching team, the rest of us are Norwegian. Thiago competes in both powerlifting and strongman events across Brazil, bringing platform precision together with the brutal conditioning of the strongman circuit.",
    longBio: [
      "Born and raised in Brazil, Thiago is Onyx Elevate's South American anchor, the only Brazilian coach on a roster of Norwegians. He competes year-round in both powerlifting meets and strongman shows like Copa SC Strongman, where he goes head-to-head with the country's best in events like log press, axle deadlift and frame carries.",
      "What makes Thiago rare is the combination: most lifters pick one side. He runs full powerlifting peaks for the squat, bench and deadlift, then turns around and trains stones, yokes and overhead medleys with the same intensity. That dual experience is exactly what he brings into his coaching, athletes built strong on the platform and strong in the real world.",
      "If you want to squat 3 plates clean, pull a heavy axle and walk away with a stone in your hands, Thiago is the coach who has actually done it, in competition, in Brazil, against the best.",
    ],
    achievements: [
      "Active competitor in Brazilian powerlifting federations",
      "Copa SC Strongman 2025 competitor (heavyweight class)",
      "10+ years of platform and strongman training experience",
      "Competes in both raw powerlifting and strongman events nationally",
      "Coaches Brazilian and international athletes through Onyx",
    ],
    specialties: ["Squat / Bench / Deadlift", "Meet prep", "Strongman crossover", "Peaking blocks"],
    signatureLifts: ["Low-bar squat", "Conventional deadlift", "Log press", "Axle deadlift"],
    weeklySplit: [
      { day: "Mon", focus: "Squat, main + accessories" },
      { day: "Tue", focus: "Bench, competition + variation" },
      { day: "Wed", focus: "Deadlift, pulls + back work" },
      { day: "Thu", focus: "Bench variation + overhead" },
      { day: "Fri", focus: "Squat variation + events" },
      { day: "Sat", focus: "Strongman conditioning" },
      { day: "Sun", focus: "Rest" },
    ],
    philosophy:
      "Big lifts make big lifters. Everything else is a supporting cast. Train the competition lifts often, peak when it counts, eat to recover.",
    tips: [
      "Bar speed on top sets tells you everything, film every working set",
      "Don't chase a max every week, chase volume PRs",
      "Glutes drive the squat, lats drive the deadlift, legs drive the bench",
      "If your back can't hold position, no amount of leg drive saves you",
    ],
    coaching: {
      title: "Powerlifting & Hybrid Strength with Thiago",
      summary:
        "Meet-prep periodization and hybrid strongman programming. RPE/percentage based, with weekly bar-speed review and a clear peaking plan toward your platform date.",
      includes: [
        "12, 16 week meet-prep blocks",
        "RPE auto-regulation + percentage waves",
        "Weekly video form review on the big three",
        "Attempt selection and meet-day strategy",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "",
    },
    instagram: "https://www.instagram.com/deschamps.thiago/",
  },
  {
    slug: "nick",
    name: "Nick",
    role: "Bodybuilder · Brazil · Men's Physique",
    tag: "Bodybuilding",
    img: coachNick,
    competes: true,
    yearsTraining: 10,
    weightClass: "Men's Physique",
    bio: "Brazilian bodybuilder with 10+ years under the bar. Nick built his physique the long way, heavy sets, strict tempo, real food and stubborn consistency. If you want to look like you actually lift, he's your guy.",
    longBio: [
      "Nick is the second Brazilian on the Onyx coaching team and a lifelong lifter. He's been training seriously for over 10 years, building every inch of his physique through progressive overload, smart nutrition and stubborn consistency.",
      "His coaching is built around what actually works: enough volume to grow, not so much that you can't recover. Proper rep tempo. High-quality protein. Sleep treated like training. The boring fundamentals, executed at a high level for a decade.",
      "If you want a coach who will hold you to real standards on technique, food and recovery, Nick brings 10+ years of results and the patience to take you the same way.",
    ],
    achievements: [
      "10+ years of dedicated hypertrophy training",
      "Active Brazilian physique competitor",
      "Specializes in hypertrophy and body recomposition",
      "Coaches clients through long-term lean gaining phases",
      "Built physique through training, food and sleep",
    ],
    specialties: [
      "Hypertrophy",
      "Lean gaining",
      "Recomposition",
      "Long-term progression",
      "Nutrition",
    ],
    signatureLifts: ["Incline barbell press", "Pull-up", "Romanian deadlift", "Pendulum squat"],
    weeklySplit: [
      { day: "Mon", focus: "Push, chest, shoulders, triceps" },
      { day: "Tue", focus: "Pull, back, rear delts, biceps" },
      { day: "Wed", focus: "Legs, quad focus" },
      { day: "Thu", focus: "Upper, hypertrophy volume" },
      { day: "Fri", focus: "Legs, posterior chain" },
      { day: "Sat", focus: "Arms + weak points" },
      { day: "Sun", focus: "Rest + walking" },
    ],
    philosophy:
      "You can't out-train recovery. You grow with hard sets, full sleep and consistent food, over years, not weeks. Patience wins.",
    tips: [
      "Take working sets to 1, 2 reps in reserve, not failure on everything",
      "Eat in a small surplus for months, not a huge one for weeks",
      "Sleep 8 hours, it's the difference between progress and plateau",
      "Track lifts and bodyweight, if neither moves, change something",
    ],
    coaching: {
      title: "Bodybuilding Coaching with Nick",
      summary:
        "Hypertrophy programming and nutrition built for long-term physique development. Lean gaining, smart cutting and honest expectations.",
      includes: [
        "Custom hypertrophy split",
        "Macro targets tuned for slow, lean gains",
        "Weekly physique check-ins (photos + weight trend)",
        "Long-term progression plan (6, 12 months)",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "",
    },
  },
  {
    slug: "trym",
    name: "Trym",
    role: "Fat Loss · Boxer",
    tag: "Fat Loss",
    img: coachTrym,
    competes: false,
    bio: "Trym trains like a boxer and eats like an athlete, and he's lost (and kept off) over 30 kg doing it. He's the coach you want if your goal is sustainable fat loss without losing muscle, energy or your sanity around food.",
    specialties: [
      "Sustainable fat loss",
      "Boxing conditioning",
      "Habit building",
      "Daily step targets",
    ],
    signatureLifts: ["Trap-bar deadlift", "Push press", "Heavy bag rounds", "Goblet squat"],
    weeklySplit: [
      { day: "Mon", focus: "Full body strength + 30 min Z2" },
      { day: "Tue", focus: "Boxing, pads + bag work" },
      { day: "Wed", focus: "Lower body strength + core" },
      { day: "Thu", focus: "Boxing conditioning rounds" },
      { day: "Fri", focus: "Upper body strength" },
      { day: "Sat", focus: "Long walk / hike (10k+ steps)" },
      { day: "Sun", focus: "Mobility + rest" },
    ],
    philosophy:
      "Fat loss is daily steps, protein and 3, 4 honest training sessions a week. Forget cleanses and 90-day shreds. Build a body you can keep for life.",
    tips: [
      "Hit 10k steps before you touch a single cardio machine",
      "Protein at every meal, 30g minimum",
      "Train for performance, let fat loss be a side effect",
      "Drink water, sleep 8 hours, walk a lot, boring works",
    ],
    coaching: {
      title: "Fat Loss & Boxing Conditioning with Trym",
      summary:
        "Realistic fat-loss coaching paired with boxing-style conditioning. Built around your real schedule, not a magazine routine you'll abandon in two weeks.",
      includes: [
        "Custom 3, 4 day training split",
        "Calorie + protein targets that adjust weekly",
        "Boxing conditioning workouts (gym or home)",
        "Habit and step-count tracking",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "",
    },
  },
  {
    slug: "michael",
    name: "Michael",
    role: "Boxer · Endurance Runner",
    tag: "Hybrid",
    img: coachMichael,
    competes: false,
    bio: "Michael is the hybrid athlete every gym needs, he boxes, he runs long, he lifts smart. He knows how to keep your lungs and your strength on the same team without one killing the other.",
    specialties: [
      "Hybrid training",
      "Running programming",
      "Boxing footwork",
      "Aerobic base building",
    ],
    signatureLifts: ["Front squat", "Strict press", "Tempo runs", "Heavy bag intervals"],
    weeklySplit: [
      { day: "Mon", focus: "Strength, full body" },
      { day: "Tue", focus: "Boxing, technique + sparring drills" },
      { day: "Wed", focus: "Zone 2 run (45, 60 min)" },
      { day: "Thu", focus: "Strength, push/pull" },
      { day: "Fri", focus: "Boxing conditioning + intervals" },
      { day: "Sat", focus: "Long run (75, 90 min easy)" },
      { day: "Sun", focus: "Mobility + rest" },
    ],
    philosophy:
      "Strong lungs, strong legs, strong hands. Don't pick one, build them all in the right order and you'll outlast anyone in the room.",
    tips: [
      "80% of your runs should be easy enough to talk through",
      "Footwork before power, always",
      "Lift twice a week minimum, even in a running block",
      "Breathe through the nose on every easy run, it changes everything",
    ],
    coaching: {
      title: "Hybrid Performance Coaching with Michael",
      summary:
        "Programming for athletes who want to lift heavy, run long and box hard, without burning out. Smart concurrent training built around your schedule.",
      includes: [
        "Hybrid strength + endurance programming",
        "Heart rate / pace-based zones",
        "Boxing technique drills (video-based)",
        "Race or event-specific peaking",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "R$ 249/month",
    },
  },
  {
    slug: "jorgen",
    name: 'Jørgen "Jet" Johnsen',
    role: "Personal Trainer · Core & Conditioning · Norway",
    tag: "Personal Training",
    img: coachJorgen,
    competes: false,
    yearsTraining: 8,
    bio: 'Norwegian personal trainer, coach and former professional dancer. Jørgen, known as "Jet" abroad, blends 8+ years of strength training with a decade of movement and athletic experience to help everyday clients get seriously strong, lean and mobile.',
    longBio: [
      "Jørgen is one of Onyx's Norway-based personal trainers and one of the most well-rounded athletes on the team. He has 8+ years of dedicated strength training behind him, 5+ years of competitive basketball, and 5+ years as a professional dancer and dance instructor, a background that shows up in how he moves, coaches and cues technique.",
      "He is AFPT-certified in Personal Training, Coaching and Nutritional Guidance, and EREPS registered, meeting the European professional standard for personal trainers. On top of that he specializes in core strength: bracing, anti-rotation, real ab work that transfers to squats, deadlifts and everyday life, not just crunches.",
      "Based in Norway, Jørgen has coached a long list of clients toward real, lasting results, fat loss, first pull-ups, first 100 kg squat, better posture, less back pain. He is known for reading people quickly, communicating clearly, and building programs that clients actually stick to. If you want a coach who is technically sharp, athletic, and genuinely great with people, Jørgen is your guy.",
    ],
    achievements: [
      "AFPT-certified Personal Trainer, Coach and Nutrition Advisor",
      "EREPS registered (European Register of Exercise Professionals)",
      "8+ years of strength training experience",
      "5+ years competing in basketball",
      "5+ years as a professional dancer and dance instructor",
      "Coached a wide range of clients in Norway to fat loss, strength and mobility goals",
    ],
    specialties: [
      "Core strength & anti-rotation",
      "1-on-1 personal training",
      "Nutrition coaching",
      "Athletic conditioning",
      "Mobility & movement quality",
    ],
    signatureLifts: [
      "Front squat",
      "Trap-bar deadlift",
      "Hanging leg raise",
      "Ab wheel rollout",
      "Turkish get-up",
    ],
    weeklySplit: [
      { day: "Mon", focus: "Full body strength + heavy core" },
      { day: "Tue", focus: "Conditioning + mobility flow" },
      { day: "Wed", focus: "Lower body strength, squat focus" },
      { day: "Thu", focus: "Upper body strength + anti-rotation core" },
      { day: "Fri", focus: "Athletic circuits, jumps, carries, sprints" },
      { day: "Sat", focus: "Long walk / active recovery + stretching" },
      { day: "Sun", focus: "Rest" },
    ],
    philosophy:
      "A strong core is the difference between training and just moving weights. Build the middle, own your posture, and everything else, squat, deadlift, life, gets easier and safer.",
    tips: [
      "Train your core like a muscle, not an afterthought, 2-3 hard sessions a week",
      "Brace before you press, pull or squat, ribs down, breathe into your belt",
      "Mobility isn't stretching, it's controlled strength in end range",
      "Sleep, walk, eat protein, the boring stuff wins every time",
    ],
    coaching: {
      title: "1-on-1 Personal Training with Jørgen",
      summary:
        "Personalized coaching from a certified Norwegian PT with a strong core and athletic background. Built for real people who want to get stronger, leaner and move better, without living in the gym.",
      includes: [
        "Custom 3-5 day training program",
        "Dedicated core & mobility work",
        "Nutrition guidance (AFPT-certified)",
        "Weekly check-ins and progress reviews",
        "Unlimited messaging inside the Onyx app",
      ],
      price: "",
    },
    instagram: "https://www.instagram.com/shenanigains.pt/",
  },
];

export const coachBySlug = (slug: string) => coaches.find((c) => c.slug === slug);
