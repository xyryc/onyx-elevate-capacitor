import creatineImg from "@/assets/supp-creatine.jpg";
import wheyImg from "@/assets/supp-whey.jpg";
import pwoImg from "@/assets/supp-pwo.jpg";
import multiImg from "@/assets/supp-multi.jpg";
import omegaImg from "@/assets/supp-omega.jpg";
import magnesiumImg from "@/assets/supp-magnesium.jpg";
import electrolytesImg from "@/assets/supp-electrolytes.jpg";

export type SuppBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string };

export interface SuppSection {
  kicker?: string;
  heading: string;
  blocks: SuppBlock[];
}

export interface Supplement {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  intro: string;
  whatIsIt: string;
  benefits: string[];
  howToUse: string[];
  important: string[];
  faqs: { q: string; a: string }[];
  // Rich article-style fields
  lead: string;
  stats: { label: string; value: string }[];
  sections: SuppSection[];
  takeaways: string[];
  pullQuote?: { text: string; cite?: string };
}

export const supplements: Supplement[] = [
  {
    slug: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    tagline: "The most researched supplement for strength, power, and muscle growth.",
    image: creatineImg,
    intro:
      "Creatine monohydrate is the single most studied performance supplement on the planet - proven safe and effective in hundreds of peer-reviewed trials.",
    lead:
      "If you could pick one supplement and throw the rest away, this is the one worth keeping. Creatine has more peer-reviewed backing than every trendy powder on the shelf combined - and it costs less than your morning coffee.",
    stats: [
      { label: "Daily dose", value: "3-5 g" },
      { label: "Strength gain", value: "5-15%" },
      { label: "Peer-reviewed studies", value: "700+" },
      { label: "Cost per day", value: "~1 kr" },
    ],
    pullQuote: {
      text: "Creatine is the only supplement in sports nutrition with an evidence base thick enough to be considered basic athletic infrastructure.",
      cite: "International Society of Sports Nutrition",
    },
    sections: [
      {
        kicker: "The science",
        heading: "How creatine actually works",
        blocks: [
          { type: "p", text: "Every explosive movement you make - a heavy triple, a 40m sprint, a jump - is powered by ATP. Your body can only store a few seconds of it at a time. Creatine phosphate is the recycling system that regenerates ATP so you can keep firing." },
          { type: "p", text: "Supplementing simply topping up the tank. Fully saturated muscles produce more force, resist fatigue longer, and recover between sets faster. That is the whole story." },
          { type: "callout", title: "Bottom line", text: "More stored creatine = more reps at the same weight, and heavier weight at the same reps. Over months, that math adds up to real muscle." },
        ],
      },
      {
        kicker: "Dosing",
        heading: "How to take it (spoiler: it's boring)",
        blocks: [
          { type: "p", text: "You do not need timing hacks, cycling protocols, or fancy delivery systems. Consistency wins." },
          { type: "list", items: [
            "3-5 g every single day, including rest days",
            "Mix with water, juice, protein shake - it does not matter",
            "Loading phase (20 g/day for a week) is optional, not required",
            "Full saturation with 5 g/day takes about 3-4 weeks",
          ]},
          { type: "quote", text: "The lifter who takes 3 g of creatine every day for a year beats the one who loads twice, forgets it for three months, and starts over.", cite: "Thiago D., Head Coach" },
        ],
      },
      {
        kicker: "Myths",
        heading: "What creatine does not do",
        blocks: [
          { type: "p", text: "The internet has decided creatine causes hair loss, kidney damage, and bloating. The research says otherwise, but the myths outlive the studies." },
          { type: "list", items: [
            "It does not damage healthy kidneys - decades of data confirm this",
            "It does not cause hair loss - the single 2009 study everyone cites has never been replicated",
            "It does not make women 'bulky' - dose and effect are identical across sexes",
            "The 'water weight' is inside your muscles, not under your skin",
          ]},
        ],
      },
    ],
    takeaways: [
      "Take 3-5 g every day, forever - this is the floor of any serious stack",
      "Monohydrate is the only form worth buying - all the fancy versions are marketing",
      "Full saturation takes 3-4 weeks - be patient, do not judge results before then",
      "Drink your normal water intake - the 'creatine dehydrates you' claim is false",
    ],
    whatIsIt:
      "Creatine is a naturally occurring compound stored in your muscles as phosphocreatine. It helps regenerate ATP - your body's primary energy currency - during short, explosive efforts like sprinting, lifting and jumping. Supplementing simply saturates your muscle stores so you can train harder and recover faster.",
    benefits: [
      "Increased strength and 1-rep max",
      "Better power output and explosive performance",
      "Improved muscle growth and lean mass",
      "Enhanced recovery between sets and sessions",
      "Potential cognitive and brain-health benefits",
    ],
    howToUse: [
      "Recommended dose: 3-5 g daily",
      "Can be taken at any time of day - pre, post, or with a meal",
      "Drink plenty of water (3-4 L/day)",
      "Consistency is more important than timing - take it every day, including rest days",
      "A loading phase (20 g/day for 5-7 days) is optional, not required",
    ],
    important: [
      "Stay properly hydrated throughout the day",
      "Do not exceed recommended doses",
      "Supplements should complement, not replace, a healthy diet",
      "Consult a healthcare professional if you have kidney issues or are on medication",
    ],
    faqs: [
      { q: "Do I need a loading phase?", a: "No. Loading saturates muscles faster (~1 week vs ~3-4 weeks), but the end result is identical. 3-5 g daily works perfectly." },
      { q: "Is creatine safe?", a: "Yes. Decades of research show it's safe for healthy adults at the standard 3-5 g daily dose." },
      { q: "Can women use creatine?", a: "Absolutely. The benefits and dosing are the same. It does not cause bulkiness." },
      { q: "Can teenagers use creatine?", a: "Research suggests it's safe for adolescent athletes, but check with a doctor or coach first." },
      { q: "Will creatine make me bloated?", a: "Some people retain a little water inside the muscle, not under the skin. This typically settles within the first 2 weeks." },
    ],
  },
  {
    slug: "whey-protein",
    name: "Whey Protein",
    tagline: "An easy and effective way to reach your daily protein intake.",
    image: wheyImg,
    intro:
      "Whey is a fast-digesting, complete protein derived from milk. It's the most practical way to hit your daily protein target when whole-food meals aren't convenient.",
    lead:
      "Whey is not magic. It is a tool. And like any tool, its value depends on what you build with it. For most lifters, that value comes down to one boring, unglamorous truth: you probably are not eating enough protein, and a shaker bottle fixes it in 30 seconds.",
    stats: [
      { label: "Protein target", value: "1.6-2.2 g/kg" },
      { label: "Per scoop", value: "20-25 g" },
      { label: "Digestion time", value: "~90 min" },
      { label: "Leucine per serving", value: "2-3 g" },
    ],
    pullQuote: {
      text: "The best protein source is the one you actually eat consistently. Chicken you skip beats whey you drink zero times per week.",
      cite: "Onyx nutrition team",
    },
    sections: [
      {
        kicker: "First principles",
        heading: "Why protein matters more than any powder",
        blocks: [
          { type: "p", text: "Muscle protein synthesis - the process that repairs and builds muscle tissue - runs on amino acids from the protein you eat. Miss the target, and no amount of training progresses you the way it should." },
          { type: "p", text: "Whole food should always come first. Chicken, fish, eggs, dairy, tofu, lentils. Whey exists for the days when whole food is not practical - the 6am start, the flight, the meeting that ate your lunch." },
          { type: "callout", title: "The rule", text: "Whey fills the gap between what you ate today and what your body needs. It does not replace meals." },
        ],
      },
      {
        kicker: "Types",
        heading: "Concentrate vs isolate vs hydrolysate",
        blocks: [
          { type: "list", items: [
            "Concentrate - 70-80% protein, cheapest, works for 90% of people",
            "Isolate - 90%+ protein, near-zero lactose, better for sensitive stomachs",
            "Hydrolysate - pre-digested, absorbs fastest, most expensive, marginal benefit",
          ]},
          { type: "p", text: "Unless you have a specific reason to spend more, concentrate is the correct default. It is the same amino acid profile at a fraction of the price." },
        ],
      },
      {
        kicker: "Timing",
        heading: "The anabolic window is bigger than you think",
        blocks: [
          { type: "p", text: "For years everyone believed you had 30 minutes post-workout to slam a shake or your gains evaporated. That was wrong. Meta-analyses now put the effective window at several hours on either side of training." },
          { type: "quote", text: "Total daily protein and consistency across meals matter far more than shaking a bottle within 45 minutes of your last set.", cite: "Reviewed in JISSN, 2018" },
          { type: "p", text: "Aim for 4-5 protein-rich feedings spaced across the day, 0.3-0.4 g/kg per feeding. Use whey to fill in whichever slots your kitchen cannot cover." },
        ],
      },
    ],
    takeaways: [
      "Hit 1.6-2.2 g/kg per day - the number matters more than the source",
      "Split protein across 4-5 feedings for optimal muscle protein synthesis",
      "Concentrate is the default - only upgrade to isolate if lactose bothers you",
      "Choose third-party tested brands (Informed Sport, NSF) to avoid contamination",
    ],
    whatIsIt:
      "Whey is one of the two proteins found in milk (the other is casein). It contains all nine essential amino acids and is particularly high in leucine - the amino acid most responsible for triggering muscle protein synthesis.",
    benefits: [
      "Convenient way to hit daily protein targets",
      "Fast absorption - ideal post-workout",
      "Supports muscle repair and growth",
      "High in leucine for maximal MPS response",
      "Helps with satiety and body composition",
    ],
    howToUse: [
      "20-40 g per serving, 1-3 times daily as needed",
      "Mix with water, milk or a smoothie",
      "Great post-workout or between meals",
      "Use it to fill the gap between food intake and your daily target (typically 1.6-2.2 g/kg)",
    ],
    important: [
      "Whey is not a meal replacement - prioritise whole foods",
      "Avoid if lactose intolerant - try whey isolate or a plant-based alternative",
      "Look for third-party tested products (Informed Sport, NSF)",
    ],
    faqs: [
      { q: "Whey concentrate vs isolate?", a: "Isolate is more filtered, lower in lactose and slightly higher in protein per scoop. Concentrate is cheaper and works for most people." },
      { q: "Do I need protein powder?", a: "No - but it makes hitting your target dramatically easier, especially on busy days." },
      { q: "Is whey only for men?", a: "No. Protein needs are based on bodyweight and activity, not gender." },
    ],
  },
  {
    slug: "pre-workout",
    name: "Pre-Workout (PWO)",
    tagline: "Increase energy, focus, and training performance.",
    image: pwoImg,
    intro:
      "A well-formulated pre-workout helps you push harder, focus deeper, and squeeze more quality reps out of every session.",
    lead:
      "Pre-workout is the most oversold product in fitness. Half of what's in a scoop is theatrics - fizzing color, tingling skin, a psychological edge. But the other half is real, measurable performance you can feel by rep three. The trick is knowing which half you are paying for.",
    stats: [
      { label: "Caffeine range", value: "150-300 mg" },
      { label: "Beta-alanine", value: "3.2 g" },
      { label: "Citrulline", value: "6-8 g" },
      { label: "Kick-in time", value: "20-30 min" },
    ],
    pullQuote: {
      text: "A quality pre-workout is a small ergogenic edge. Sleep, food and a warm-up beat any scoop ever formulated.",
      cite: "Simen, strength coach",
    },
    sections: [
      {
        kicker: "The ingredients that actually work",
        heading: "Read the label, not the marketing",
        blocks: [
          { type: "p", text: "Most pre-workout formulas hide low doses of real ingredients behind proprietary blends. If the label does not tell you exactly how many milligrams of each active you are getting, keep walking." },
          { type: "list", items: [
            "Caffeine (150-300 mg) - the single most effective ingredient in the industry",
            "Beta-alanine (3.2 g) - buffers acid, extends muscular endurance in the 30-90 sec range",
            "Citrulline malate (6-8 g) - improves blood flow, that is where the pump comes from",
            "Electrolytes - keep you firing on longer sessions",
          ]},
          { type: "callout", title: "Watch out for", text: "Under-dosed formulas, exotic 'proprietary blends,' and stimulant stacks that make you feel wired without actually improving performance." },
        ],
      },
      {
        kicker: "How to use it",
        heading: "Save it for the sessions that matter",
        blocks: [
          { type: "p", text: "Use pre-workout on your hardest sessions - heavy lower body, a big pull day, a competition warm-up. If you take it every session, your tolerance climbs and the effect fades." },
          { type: "quote", text: "The best time to use pre-workout is when you feel like you should not train. It is not a daily driver - it is a rescue vehicle.", cite: "Onyx coaching floor" },
        ],
      },
      {
        kicker: "Warnings",
        heading: "When to skip it entirely",
        blocks: [
          { type: "list", items: [
            "Anything after 3pm if you value your sleep",
            "If you already had coffee - stacking caffeine is where jitters live",
            "Pregnancy, high blood pressure, or heart conditions",
            "Athletes under 18 - your baseline nervous system is already firing on all cylinders",
          ]},
        ],
      },
    ],
    takeaways: [
      "Use it on your two hardest sessions per week, not every workout",
      "Fully-dosed formulas beat proprietary blends every time - read the mg",
      "Cycle off every 6-8 weeks to keep caffeine effective",
      "If in doubt, black coffee + a banana gets you 90% there",
    ],
    whatIsIt:
      "Pre-workout blends typically combine caffeine (energy + focus), beta-alanine (muscular endurance), citrulline malate (pump + nitric oxide) and electrolytes. The result is a noticeable lift in training intensity.",
    benefits: [
      "Increased energy and alertness",
      "Sharper mental focus and mind-muscle connection",
      "Better muscular endurance (more reps before failure)",
      "Improved pump and blood flow",
    ],
    howToUse: [
      "1 scoop, 20-30 minutes before training",
      "Start with a half scoop to assess tolerance",
      "Mix with 300-500 ml water",
      "Don't use within 6 hours of bedtime",
    ],
    important: [
      "Caffeine sensitive? Look for a stim-free formula",
      "Don't stack with other caffeine sources",
      "Cycle off every 6-8 weeks to keep it effective",
      "Not recommended under 18 or during pregnancy",
    ],
    faqs: [
      { q: "Do I really need a pre-workout?", a: "No. Black coffee + a pre-training meal gets you 90% of the way there. PWO is a convenience and edge, not a requirement." },
      { q: "Why does my skin tingle?", a: "That's beta-alanine. It's harmless and fades after 20 minutes." },
    ],
  },
  {
    slug: "multivitamin",
    name: "Multivitamin",
    tagline: "Support overall health and cover nutritional gaps.",
    image: multiImg,
    intro:
      "A daily multivitamin acts as nutritional insurance - filling the small gaps that even a well-planned diet can leave behind.",
    lead:
      "A multivitamin is not going to build you a body. It is going to keep the small deficiencies that quietly stall your progress from ever developing. Think of it as an oil change - unglamorous, cheap, and the reason the engine still runs at 100,000 km.",
    stats: [
      { label: "Nutrients covered", value: "20+" },
      { label: "Cost per day", value: "~2 kr" },
      { label: "Weekly compliance", value: "7/7 days" },
      { label: "Best time", value: "With a meal" },
    ],
    pullQuote: {
      text: "You cannot out-supplement a bad diet, but the right multivitamin can rescue a good one that has small holes in it.",
      cite: "Onyx nutrition team",
    },
    sections: [
      {
        kicker: "The context",
        heading: "Why even careful eaters have gaps",
        blocks: [
          { type: "p", text: "The soil is more depleted than it was fifty years ago. The average diet varies less week to week than we like to admit. Training athletes chew through more micronutrients than sedentary adults. All of it stacks." },
          { type: "list", items: [
            "Vitamin D - most people north of Barcelona are low six months a year",
            "Magnesium - training and sweat losses outpace typical intake",
            "Zinc - critical for immune function and hormones",
            "B-vitamins - burned through faster the harder you train",
          ]},
          { type: "callout", title: "Reality check", text: "A multi will not turn a diet of takeaway pizza into a healthy one. It is insurance on top of decent eating, not a substitute for it." },
        ],
      },
      {
        kicker: "What to look for",
        heading: "Reading a label without the marketing haze",
        blocks: [
          { type: "p", text: "Good multivitamins share three traits: sensible doses, well-absorbed forms of each nutrient, and third-party testing you can verify online." },
          { type: "list", items: [
            "Doses at or near RDA, not 5000% mega-doses",
            "Methylated B-vitamins where possible (B12 as methylcobalamin)",
            "Chelated minerals (glycinate, bisglycinate) - much better absorbed than oxide",
            "Third-party tested - Informed Sport, NSF, or equivalent",
          ]},
          { type: "quote", text: "More is not better. A multi that dumps 5000% of every vitamin is a marketing product, not a health product.", cite: "Reviewed in the Journal of Nutrition, 2021" },
        ],
      },
    ],
    takeaways: [
      "Take it with your biggest meal so fat-soluble vitamins absorb properly",
      "Consistency beats intensity - a mid-tier multi every day beats a premium one you forget",
      "Get blood work every 1-2 years so you know what your baseline actually is",
      "Third-party testing matters - the supplement industry is barely regulated",
    ],
    whatIsIt:
      "Multivitamins combine essential vitamins (A, C, D, E, K, B-complex) and minerals (zinc, magnesium, iron, selenium) in one convenient dose. They're not a replacement for whole foods - they're a safety net.",
    benefits: [
      "Covers common micronutrient gaps",
      "Supports immune function",
      "Supports energy metabolism",
      "Supports hormone health and recovery",
    ],
    howToUse: [
      "1 serving daily, usually with a meal for best absorption",
      "Take fat-soluble vitamins (A, D, E, K) with food containing fat",
      "Consistency beats megadosing",
    ],
    important: [
      "Choose third-party tested brands",
      "Don't exceed daily upper limits - more is not better",
      "If you have specific deficiencies, get blood work first",
    ],
    faqs: [
      { q: "Do I need a multivitamin if I eat well?", a: "Maybe not, but most people fall short on at least 2-3 micronutrients. A multi is cheap insurance." },
      { q: "Best time to take it?", a: "With your largest meal of the day." },
    ],
  },
  {
    slug: "omega-3",
    name: "Omega-3",
    tagline: "Essential fats that support the heart, brain, and joints.",
    image: omegaImg,
    intro:
      "EPA and DHA - the two key omega-3 fatty acids - are vital for heart health, brain function and managing inflammation.",
    lead:
      "Omega-3 is one of the quietest, most researched supplements in the game. It does not give you a pump. It does not spike your energy. But over years, it is the difference between joints that feel 30 at age 45, and joints that feel 45 at 30.",
    stats: [
      { label: "Combined EPA+DHA", value: "1-3 g/day" },
      { label: "Time to effect", value: "8-12 weeks" },
      { label: "Fatty fish weekly", value: "2-3 servings" },
      { label: "TOTOX target", value: "<10" },
    ],
    pullQuote: {
      text: "You cannot feel omega-3 working the way you feel caffeine. You feel it working ten years from now when your knees still track your goals.",
      cite: "Head Coach Lars",
    },
    sections: [
      {
        kicker: "Why it matters",
        heading: "The ratio nobody talks about",
        blocks: [
          { type: "p", text: "Modern diets are drowning in omega-6 (seed oils, processed foods) and starved of omega-3. The ratio matters as much as the raw intake - and it drives a huge portion of chronic inflammation in Western populations." },
          { type: "callout", title: "The signal", text: "You want the ratio of omega-6 to omega-3 in your diet to sit around 4:1. Most people are closer to 20:1 or worse." },
        ],
      },
      {
        kicker: "Sourcing",
        heading: "Fish oil vs krill vs algae",
        blocks: [
          { type: "list", items: [
            "Fish oil - cheapest, highest EPA/DHA per capsule, standard choice",
            "Krill oil - smaller doses, phospholipid form absorbs slightly better, more expensive",
            "Algae oil - plant-based, sustainable, works well for vegans and vegetarians",
          ]},
          { type: "p", text: "Whatever you buy, check for oxidation. Rancid fish oil is worse than no fish oil. Look for a TOTOX (total oxidation) score under 10 on the manufacturer certificate." },
          { type: "quote", text: "A cheap, oxidized fish oil is closer to poison than to a supplement. Spend the extra kroner on quality.", cite: "Onyx sourcing standards" },
        ],
      },
    ],
    takeaways: [
      "Aim for 1-3 g combined EPA + DHA daily, with a meal that contains fat",
      "Store your bottle in the fridge - light and heat oxidize the oil fast",
      "Freeze softgels if you get fish burps - the shell dissolves lower in the gut",
      "Give it 8-12 weeks of consistency before judging the effect",
    ],
    whatIsIt:
      "Omega-3 fish oil delivers EPA and DHA, two long-chain fatty acids that your body cannot produce efficiently on its own. They support virtually every system in the body.",
    benefits: [
      "Supports heart and cardiovascular health",
      "Supports brain function and mood",
      "Reduces exercise-induced inflammation",
      "Supports joint health and recovery",
    ],
    howToUse: [
      "1-3 g combined EPA + DHA daily",
      "Take with a meal containing fat",
      "Store in the fridge to prevent oxidation",
    ],
    important: [
      "Look for products tested for heavy metals and oxidation (TOTOX score)",
      "Burping fishy taste? Try enteric-coated softgels or freeze them",
      "Consult a doctor if you're on blood thinners",
    ],
    faqs: [
      { q: "Fish oil vs algae oil?", a: "Algae is the plant-based source - great for vegans, slightly more expensive." },
      { q: "How long until I notice benefits?", a: "Usually 8-12 weeks of consistent daily use." },
    ],
  },
  {
    slug: "magnesium",
    name: "Magnesium",
    tagline: "Important for recovery, muscle function, and sleep quality.",
    image: magnesiumImg,
    intro:
      "Magnesium is involved in over 300 enzymatic reactions, yet most lifters are mildly deficient. Supplementing can transform sleep, recovery and training output.",
    lead:
      "Nothing sabotages a training block quite like bad sleep and cramping calves at 3am. Magnesium is not a sleeping pill. It is not a muscle relaxant. But if you are low - and most lifters are - correcting it feels like both.",
    stats: [
      { label: "Adult RDA", value: "310-420 mg" },
      { label: "Sweet spot", value: "200-400 mg" },
      { label: "Reactions involved", value: "300+" },
      { label: "Est. deficiency rate", value: "~50%" },
    ],
    pullQuote: {
      text: "Magnesium is the mineral that separates 'I feel wrecked all week' from 'I felt fine by Wednesday' for a huge percentage of athletes.",
      cite: "Onyx recovery protocol",
    },
    sections: [
      {
        kicker: "Forms matter",
        heading: "Not all magnesium is created equal",
        blocks: [
          { type: "list", items: [
            "Glycinate - best for sleep and anxiety, gentlest on the gut",
            "Citrate - decent absorption, mild laxative effect, good if you struggle with regularity",
            "Malate - pairs well with muscular fatigue and daytime energy",
            "Oxide - avoid, poor absorption, mostly causes diarrhea",
            "Threonate - only form that crosses the blood-brain barrier well, premium price",
          ]},
          { type: "callout", title: "Default pick", text: "For most lifters, magnesium glycinate 200-400 mg taken 30-60 minutes before bed is the highest-return-per-krone move in the entire supplement stack." },
        ],
      },
      {
        kicker: "The signs",
        heading: "How to know you are low",
        blocks: [
          { type: "list", items: [
            "Muscle cramps and twitches, especially at night",
            "Difficulty falling asleep or staying asleep",
            "Elevated resting heart rate on tough training weeks",
            "Anxiety spikes without a clear cause",
            "Restless legs, jumpy nervous system",
          ]},
          { type: "quote", text: "If you can only add one supplement to your evening routine, magnesium glycinate is the one that changes the most for the smallest cost.", cite: "Coach Simen" },
        ],
      },
    ],
    takeaways: [
      "Glycinate at night is the highest-impact single change most lifters can make",
      "Start at 200 mg and add another 100-200 mg only if you tolerate it well",
      "Elemental magnesium is what matters - read the label carefully",
      "Skip oxide - it is cheap because your body barely absorbs it",
    ],
    whatIsIt:
      "Magnesium is a vital mineral for muscle contraction, nervous system regulation, sleep quality and energy metabolism. Glycinate, citrate and malate are the most bioavailable forms.",
    benefits: [
      "Improves sleep quality and depth",
      "Reduces muscle cramps and tension",
      "Supports recovery between sessions",
      "Supports a calm nervous system",
    ],
    howToUse: [
      "200-400 mg of elemental magnesium daily",
      "Take in the evening for sleep benefits",
      "Glycinate for sleep, citrate for digestion, malate for energy",
    ],
    important: [
      "Avoid magnesium oxide - poor absorption, often causes diarrhoea",
      "Start at the lower dose to assess tolerance",
    ],
    faqs: [
      { q: "Will it actually help my sleep?", a: "Most people report deeper sleep within 1-2 weeks, especially with glycinate." },
      { q: "Can I take it with calcium?", a: "Yes, but space them by a few hours for best absorption." },
    ],
  },
  {
    slug: "electrolytes",
    name: "Electrolytes",
    tagline: "Maintain hydration and improve endurance performance.",
    image: electrolytesImg,
    intro:
      "Sodium, potassium and magnesium are lost through sweat. Replacing them keeps energy, focus and performance high in long or hot sessions.",
    lead:
      "Water alone does not hydrate you. It sounds absurd until you understand what your body is actually doing with fluid - moving sodium in, potassium out, keeping the electrical system firing. Drink plain water on a long summer session and you can end up more dehydrated than when you started.",
    stats: [
      { label: "Sodium per L sweat", value: "300-1500 mg" },
      { label: "Heavy-sweater dose", value: "800-1000 mg" },
      { label: "Session threshold", value: "60+ min" },
      { label: "Cramps drop by", value: "significantly" },
    ],
    pullQuote: {
      text: "Sports drinks are dessert with a pinch of salt. Real electrolytes are salt with a pinch of flavour. Do not confuse the two.",
      cite: "Onyx conditioning coach",
    },
    sections: [
      {
        kicker: "Who actually needs them",
        heading: "Not every session needs a scoop",
        blocks: [
          { type: "list", items: [
            "45 min gym session, cool room - plain water is fine",
            "60+ min session or heavy sweat - electrolytes start to matter",
            "90+ min endurance, hot climate, or 2-a-days - electrolytes become non-negotiable",
            "Fasted training, keto, or low-carb - you lose electrolytes faster, top up sooner",
          ]},
          { type: "callout", title: "Rule of thumb", text: "If your shirt has a white salt ring at the end of a session, you are a heavy sweater and probably underdosing sodium." },
        ],
      },
      {
        kicker: "The formula",
        heading: "What a good electrolyte product looks like",
        blocks: [
          { type: "p", text: "The bulk of the value in an electrolyte drink is sodium. Everything else is supporting cast. If your scoop is 60 mg sodium and 20 g sugar, you bought candy." },
          { type: "list", items: [
            "800-1000 mg sodium per serving for heavy sweaters",
            "200-400 mg potassium",
            "50-100 mg magnesium",
            "Low or zero sugar - unless you are also training long endurance",
          ]},
          { type: "quote", text: "You cannot fix cramping with a banana. Bananas are a decent snack, but muscle cramps are almost always a sodium problem.", cite: "Reviewed in the British Journal of Sports Medicine" },
        ],
      },
    ],
    takeaways: [
      "Under 60 minutes indoors - water is enough, save your scoops for real sessions",
      "Sodium is the star - do not buy products that under-dose it",
      "Sip across the session, do not slam a full serving in one go",
      "On hot days or two-a-days, use a serving before and after training too",
    ],
    whatIsIt:
      "Electrolytes are mineral salts that conduct electricity in the body. They regulate hydration, muscle contraction and nerve signalling. Plain water alone can actually dilute them.",
    benefits: [
      "Sustains hydration during long or hot training",
      "Reduces cramping and fatigue",
      "Supports endurance and intra-workout focus",
      "Speeds rehydration post-session",
    ],
    howToUse: [
      "1 serving sipped during training",
      "Add a second serving on hot days or 90+ min sessions",
      "Look for 800-1,000 mg sodium per serving for heavy sweaters",
    ],
    important: [
      "Most products are over-sweetened - choose low-sugar options",
      "If you have blood pressure issues, consult your doctor before high-sodium products",
    ],
    faqs: [
      { q: "Do I need electrolytes for a 45 min lifting session?", a: "Usually no - water is fine unless it's hot or you sweat heavily." },
      { q: "Are sports drinks the same?", a: "No - most are mostly sugar with minimal sodium. Dedicated electrolyte products are far better." },
    ],
  },
];

export function getSupplement(slug: string) {
  return supplements.find((s) => s.slug === slug);
}
