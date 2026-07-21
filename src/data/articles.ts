import imgOverload from "@/assets/article-progressive-overload.jpg";
import imgNutrition from "@/assets/article-nutrition.jpg";
import imgRecovery from "@/assets/article-recovery.jpg";
import imgDeadlift from "@/assets/article-deadlift.jpg";
import imgBench from "@/assets/article-bench.jpg";
import imgSquat from "@/assets/article-squat.jpg";

import imgOverloadMid from "@/assets/article-overload-mid.jpg";
import imgNutritionMid from "@/assets/article-nutrition-mid.jpg";
import imgRecoveryMid from "@/assets/article-recovery-mid.jpg";
import coachSimenAsset from "@/assets/coach-simen-new.jpg.asset.json";
const coachSimenImg = coachSimenAsset.url;
import coachLarsAsset from "@/assets/coach-lars.jpg.asset.json";
const coachLarsImg = coachLarsAsset.url;
import coachThiagoAsset from "@/assets/coach-thiago-1.jpg.asset.json";
const coachThiagoImg = coachThiagoAsset.url;

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "image"; src: string; caption?: string };

export interface ArticleSection {
  heading: string;
  kicker?: string;
  blocks: Block[];
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  authorRole: string;
  authorImg?: string;
  publishedOn: string;
  img: string;
  excerpt: string;
  lead: string;
  stats: { label: string; value: string }[];
  sections: ArticleSection[];
  takeaways: string[];
}

export const articles: Article[] = [
  {
    slug: "progressive-overload-blueprint",
    title: "The Progressive Overload Blueprint: How to Actually Get Stronger Every Week",
    category: "Strength Science",
    readTime: "9 min read",
    author: "Thiago Deschamps",
    authorRole: "Head Powerlifting Coach",
    authorImg: coachThiagoImg,
    publishedOn: "June 2026",
    img: imgOverload,
    excerpt:
      "Progressive overload is the only law in the gym. But adding 2.5 kg every week is not a plan - it's wishful thinking. Here's how to overload intelligently across reps, sets, tempo, range of motion and frequency so your strength keeps climbing for years, not weeks.",
    lead: "Everyone talks about progressive overload. Almost nobody applies it correctly. The gap between a lifter who adds weight to the bar for 15 years and one who stalls after 12 months is almost never talent - it is a system for pushing the right variable at the right time. This is that system.",
    stats: [
      { label: "Levers to push", value: "6" },
      { label: "Typical stall window", value: "8-12 wks" },
      { label: "Sleep floor", value: "7 hrs" },
      { label: "Protein floor", value: "1.6 g/kg" },
    ],
    sections: [
      {
        kicker: "The principle",
        heading: "What progressive overload actually means",
        blocks: [
          {
            type: "p",
            text: "Progressive overload is the principle that your body adapts to a training stress only when that stress increases over time. The mistake most lifters make is thinking it just means 'add weight to the bar.' Weight is one of at least six variables you can push - and if you only chase load, you'll plateau inside a year.",
          },
          {
            type: "p",
            text: "Your body doesn't care about the number on the plate. It cares about how much tension your muscles produced, how close to failure you got, how many hard sets they accumulated across the week, and how repeatable that stimulus was. Load is just one input into that equation.",
          },
          { type: "h3", text: "The six levers you can actually push" },
          {
            type: "list",
            items: [
              "Load - weight on the bar",
              "Reps - more reps at the same load",
              "Sets - more hard sets per muscle per week",
              "Range of motion - deeper positions, longer stretch",
              "Tempo - slower eccentrics, controlled concentrics",
              "Frequency - hitting a muscle 2 or 3 times per week instead of once",
            ],
          },
          {
            type: "quote",
            text: "You are not stuck. You just stopped pushing the lever that still had room to move.",
            cite: "Thiago Deschamps",
          },
        ],
      },
      {
        kicker: "For size",
        heading: "The double progression model",
        blocks: [
          {
            type: "p",
            text: "This is the cleanest hypertrophy method ever invented. Pick a rep range - 8 to 12 is the sweet spot for most lifts. Keep the same weight until you can hit the top of the range on every prescribed set with 1 rep in reserve. Then, and only then, add 2.5 to 5% weight and start the cycle again at the bottom of the range.",
          },
          {
            type: "callout",
            title: "Worked example - bench press",
            text: "80 kg for 3 sets of 8-12. Week 1: 9, 8, 8. Week 2: 10, 9, 8. Week 3: 11, 10, 9. Week 4: 12, 12, 11. Add weight - 82.5 kg for 3 x 8. Repeat. This is boring, undramatic, and adds ~10 kg to your bench per year for a natural lifter. That is the point.",
          },
          {
            type: "image",
            src: imgOverloadMid,
            caption: "Overload is measurable, patient, and boring. That is why it works.",
          },
          {
            type: "p",
            text: "The reason double progression beats 'just add weight' is that it self-regulates. On a bad day you don't miss reps - you just log the same weight and try again. On a great day you don't jump too much - you just add reps. The bar moves when you're ready, not when the spreadsheet says so.",
          },
        ],
      },
      {
        kicker: "For strength",
        heading: "The wave model",
        blocks: [
          {
            type: "p",
            text: "Strength athletes overload differently. Heavy work north of 85% of your one-rep max drains your central nervous system faster than muscle. If you try to add weight every session forever, you will not plateau - you will crash.",
          },
          {
            type: "p",
            text: "Waves solve this. You accumulate stress over 3 building weeks, then deload on week 4. Each new wave starts slightly higher than the last, but the deload lets fatigue dissipate before it becomes a hole you can't dig out of.",
          },
          { type: "h3", text: "A simple 4-week wave for squat" },
          {
            type: "list",
            items: [
              "Week 1: 4 x 5 @ 75%",
              "Week 2: 5 x 4 @ 80%",
              "Week 3: 5 x 3 @ 85%",
              "Week 4 (deload): 3 x 3 @ 65-70%",
              "Week 5: restart at 77.5% - fresh, stronger, ready to push again",
            ],
          },
          {
            type: "p",
            text: "This is the single most reliable strength-building structure in the world. Every top powerlifter and weightlifter uses some version of it. The math changes, the shape doesn't.",
          },
        ],
      },
      {
        kicker: "The killers",
        heading: "What quietly stops your progress",
        blocks: [
          {
            type: "p",
            text: "Programs rarely fail on paper. They fail because a lifter is under-slept, under-fed, and constantly rotating exercises they can't measure. Fix these three before you blame the split.",
          },
          {
            type: "callout",
            title: "Sleep",
            text: "Below 7 hours a night, strength on heavy days drops measurably inside a week. Cold, dark room. No screens 60 min before bed. Same wake time on weekends. The weekend sleep-in does not fix Tuesday's deficit.",
          },
          {
            type: "callout",
            title: "Protein",
            text: "Below 1.6 g/kg of body weight per day, muscle protein synthesis is capped. Aim for 1.8-2.2 g/kg split across 3-5 meals. This is not optional for a lifter.",
          },
          {
            type: "callout",
            title: "Exercise rotation",
            text: "You cannot progressively overload a lift you swap out every 2 weeks. Lock your main lifts (squat, bench, deadlift, overhead press, one pull variation, one hinge) for 8-12 weeks minimum. Rotate accessories, never the anchors.",
          },
        ],
      },
      {
        kicker: "The wrap",
        heading: "Put it together",
        blocks: [
          {
            type: "p",
            text: "Progressive overload is not a hack. It is a decade-long compounding habit. Push one lever at a time. Measure it. Sleep on it. Eat for it. When one lever stops moving, push a different one for a block before you force it.",
          },
          {
            type: "p",
            text: "The lifters who look genetically gifted 10 years in are the ones who did the boring version of this for 10 years. That is the entire trick.",
          },
        ],
      },
    ],
    takeaways: [
      "Push one variable at a time - load, reps, sets, ROM, tempo or frequency",
      "Use double progression for hypertrophy, waves for strength",
      "Lock main lifts in for 8-12 weeks before swapping",
      "Sleep 7+ hours and eat 1.8 g/kg protein or the program is wasted",
      "Boring, patient overload beats dramatic, inconsistent overload every time",
    ],
  },
  {
    slug: "athlete-nutrition-foundations",
    title:
      "Athlete Nutrition Foundations: Protein, Carbs and the Meals That Actually Move You Forward",
    category: "Nutrition",
    readTime: "11 min read",
    author: "Simen Christiansen",
    authorRole: "Onyx Head Coach",
    authorImg: coachSimenImg,
    publishedOn: "June 2026",
    img: imgNutrition,
    excerpt:
      "Forget cleanses, 'clean eating' and shake-only diets. Real athletes win on boring fundamentals - protein at every meal, carbs around training, micronutrients from real food. Here's the playbook we give every Onyx athlete on day one.",
    lead: "Nutrition is where most training programs quietly die. Not because people eat 'badly' - because they eat randomly. No protein target. No carbs around training. No plan for the weekend. Fix that and your program starts working like it was supposed to from week one.",
    stats: [
      { label: "Protein target", value: "1.6-2.2 g/kg" },
      { label: "Meals per day", value: "3-5" },
      { label: "Carbs (training day)", value: "3-5 g/kg" },
      { label: "Adherence rule", value: "80/20" },
    ],
    sections: [
      {
        kicker: "Macro 1",
        heading: "Protein - the non-negotiable",
        blocks: [
          {
            type: "p",
            text: "Every credible study on hypertrophy and recovery in the last decade lands in the same place: 1.6 to 2.2 grams of protein per kilogram of body weight, per day, split across 3 to 5 meals. Below that range, you leave gains on the table. Above it, no extra benefit. It is one of the tightest ranges in sports science.",
          },
          {
            type: "p",
            text: "A 80 kg lifter needs 130-175 g daily. That's roughly 30-40 g per meal, four times a day. Not complicated - just consistent.",
          },
          { type: "h3", text: "Best sources per gram" },
          {
            type: "list",
            items: [
              "Chicken breast, turkey breast - lean, cheap, high leucine",
              "Lean beef and bison - iron and creatine bonus",
              "Salmon, sardines, mackerel - protein + omega-3s in one shot",
              "Whole eggs - the gold standard amino acid profile",
              "Greek yogurt, cottage cheese, skyr - slow-digesting, gut-friendly",
              "Whey isolate - the fastest way to hit a target when time is tight",
            ],
          },
          {
            type: "quote",
            text: "Nobody has ever failed at building muscle because their food wasn't 'clean' enough. Thousands have failed because they didn't hit their protein.",
            cite: "Simen Christiansen",
          },
          {
            type: "callout",
            title: "Why split it across meals",
            text: "Muscle protein synthesis peaks for about 3 hours after a protein feeding, then returns to baseline. Hitting 30-40 g every 3-4 hours keeps the signal on all day. One 150 g steak at dinner doesn't - most of that protein is oxidised for energy instead of building tissue.",
          },
        ],
      },
      {
        kicker: "Macro 2",
        heading: "Carbs - the most misunderstood macro",
        blocks: [
          {
            type: "p",
            text: "Carbs are not the enemy. For a training athlete, they refill muscle glycogen, drive high-intensity output, protect your hormones, and let you recover between sessions. Going low-carb 'to lean out' is a tax on your training quality, and usually a tax you don't need to pay.",
          },
          {
            type: "image",
            src: imgNutritionMid,
            caption:
              "Real athlete meals: protein, starch, colour, and enough on the plate to train hard tomorrow.",
          },
          { type: "h3", text: "Practical targets" },
          {
            type: "list",
            items: [
              "Training days: 3-5 g/kg body weight",
              "Rest days: 2-3 g/kg body weight",
              "Fat loss phase: keep training-day carbs high, cut on rest days first",
              "Peak week / competition: increase progressively - not the day of",
            ],
          },
          {
            type: "callout",
            title: "The workout window",
            text: "Pre-training: 40-80 g of easy carbs (oats, fruit, rice, rice cakes) 60-90 min before you lift. Post-training: 50-100 g with your protein meal inside 2 hours. This is where most of your daily carbs should land.",
          },
        ],
      },
      {
        kicker: "Macro 3",
        heading: "Fats, fibre, micros",
        blocks: [
          {
            type: "p",
            text: "Set dietary fat at 0.8-1.2 g/kg minimum. Push below that for more than a few weeks and hormones start to slide - testosterone, thyroid, menstrual cycle regularity for female athletes.",
          },
          {
            type: "p",
            text: "Prioritise omega-3 rich sources: salmon, sardines, walnuts, extra-virgin olive oil, chia and flax. If you don't eat fatty fish twice a week, a 2 g EPA + DHA supplement earns its price.",
          },
          {
            type: "p",
            text: "Micronutrients come from food, not pills. Aim for four colours on the plate every day - leafy greens, berries, peppers, citrus, tomatoes, carrots. Most lifters also under-eat fibre. Target 30-40 g a day for digestion and gut health.",
          },
        ],
      },
      {
        kicker: "The template",
        heading: "The 80/20 meal template",
        blocks: [
          {
            type: "p",
            text: "Forget weighing every gram forever. Build every plate with your hands as the ruler:",
          },
          {
            type: "list",
            items: [
              "1 palm of protein (chicken, fish, meat, eggs, tofu)",
              "1-2 cupped hands of carbs (rice, potato, pasta, oats, fruit)",
              "1 fist of vegetables (any colour, any way you'll actually eat them)",
              "1 thumb of fat (olive oil, nuts, avocado, cheese)",
            ],
          },
          {
            type: "p",
            text: "Build four of those a day. Hit your protein. The rest is noise. This one template covers 90% of what your body needs to train hard, recover, and grow.",
          },
          {
            type: "callout",
            title: "The 20% rule",
            text: "Pizza, ice cream, beer, birthday cake - eat what you love, roughly 20% of the time. Diets that don't leave room for these fail inside 6 months. Diets that do work for decades. Adherence beats perfection every single time.",
          },
        ],
      },
      {
        kicker: "Common mistakes",
        heading: "What we fix first with new Onyx athletes",
        blocks: [
          {
            type: "list",
            items: [
              "Under-eating protein at breakfast - fix with 3 eggs + Greek yogurt",
              "Training fasted 'to burn fat' - kills output, doesn't burn more fat over the day",
              "Zero carbs on lift days - wrecks last-set performance",
              "Weekend blowouts that erase Mon-Fri - use the 20% rule, not the 200% rule",
              "Chasing 'clean' instead of chasing enough - clean 1200 kcal is still 1200 kcal",
            ],
          },
        ],
      },
    ],
    takeaways: [
      "Protein 1.6-2.2 g/kg, spread across 3-5 meals of 30-40 g",
      "Carbs 3-5 g/kg on training days, mostly around the workout",
      "Fats 0.8-1.2 g/kg minimum, prioritise omega-3s",
      "Palm-hand-fist-thumb template - stop weighing everything",
      "Adherence beats perfection - leave room for the foods you love",
    ],
  },
  {
    slug: "recovery-secrets-elite-athletes",
    title: "The Recovery Secrets Elite Athletes Use (And Most Lifters Ignore)",
    category: "Recovery",
    readTime: "8 min read",
    author: "Lars Lie",
    authorRole: "Bodybuilding Coach",
    authorImg: coachLarsImg,
    publishedOn: "June 2026",
    img: imgRecovery,
    excerpt:
      "You don't grow in the gym - you grow in bed, on the couch and at the dinner table. Sleep, stress management, nutrition timing and active recovery are the four pillars that separate athletes who keep progressing from those who stall every six months.",
    lead: "Training is the stimulus. Recovery is the adaptation. If the adaptation side of the equation is broken, more stimulus just digs a deeper hole. Elite athletes treat recovery like a training variable - measured, planned, and defended. Weekend warriors treat it like an afterthought. Then wonder why they plateau.",
    stats: [
      { label: "Sleep floor", value: "7 hrs" },
      { label: "Zone 2 per week", value: "1-2 x" },
      { label: "Post-training window", value: "2 hrs" },
      { label: "Deload frequency", value: "every 4-6 wks" },
    ],
    sections: [
      {
        kicker: "Pillar 1",
        heading: "Sleep - the king of recovery",
        blocks: [
          {
            type: "p",
            text: "There is no supplement, protocol, or piece of tech that comes close to sleep. Seven hours is a floor. Eight is the goal. Below seven, growth hormone drops, testosterone drops, insulin sensitivity tanks, and measurable strength on heavy days falls inside 4-5 days.",
          },
          {
            type: "image",
            src: imgRecoveryMid,
            caption:
              "The most anabolic thing in the room is a dark, cool bedroom and a locked screen.",
          },
          { type: "h3", text: "The non-negotiables that actually work" },
          {
            type: "list",
            items: [
              "Cold, dark room (17-19 °C, blackout curtains)",
              "No screens 60 minutes before bed - or blue-light glasses if you must",
              "No caffeine after 14:00 (caffeine half-life is 5-7 hours)",
              "Same sleep and wake window 7 days a week",
              "Alcohol before bed shreds REM - keep it away from training weeks",
            ],
          },
          {
            type: "quote",
            text: "You cannot out-train, out-supplement, or out-caffeinate a sleep deficit. Sleep is the training program.",
            cite: "Lars Lie",
          },
        ],
      },
      {
        kicker: "Pillar 2",
        heading: "Stress is a training variable",
        blocks: [
          {
            type: "p",
            text: "Your nervous system cannot tell the difference between a heavy deadlift, an argument with your boss, three coffees on an empty stomach, and a bad night's sleep. They all draw from the same recovery account, and that account is finite.",
          },
          {
            type: "p",
            text: "This is why 'the exact same program' produces gains one month and plateaus the next. The program didn't change - your life did.",
          },
          {
            type: "callout",
            title: "The 20-30% rule",
            text: "When life stress spikes - work deadline, poor sleep week, illness, big travel - cut training volume by 20-30% for that week. Keep intensity, cut the number of sets. You come back stronger than if you'd forced through and dug a 6-week hole.",
          },
        ],
      },
      {
        kicker: "Pillar 3",
        heading: "Active recovery beats passive recovery",
        blocks: [
          {
            type: "p",
            text: "'Rest day' does not mean 'couch day.' Blood flow is what clears metabolic waste and shuttles nutrients into damaged tissue. Sitting on the couch does very little of either. Walking, gentle mobility, and easy cardio do a lot.",
          },
          { type: "h3", text: "What to do on an off-day" },
          {
            type: "list",
            items: [
              "30-60 minute walk outside, ideally morning sunlight",
              "10 minutes of full-body mobility (hips, thoracic spine, shoulders)",
              "Foam roll or lacrosse-ball the hot spots for 5 minutes",
              "One Zone 2 session per week (60-70% max HR, 30-45 min) - builds an aerobic base that speeds recovery between hard lifts",
            ],
          },
          {
            type: "p",
            text: "Zone 2 is the single most underused tool in strength sports. It drops resting heart rate, improves work capacity, and makes your heavy days feel easier without stealing recovery from them.",
          },
        ],
      },
      {
        kicker: "Pillar 4",
        heading: "Nutrition timing for recovery",
        blocks: [
          {
            type: "p",
            text: "Total daily food matters most. But within that, two windows carry disproportionate weight for recovery: the 2 hours after training, and the meal before bed.",
          },
          {
            type: "callout",
            title: "Post-training (within 2 hours)",
            text: "30-50 g of protein plus 50-100 g of carbs. This is when muscle glycogen replaces fastest and muscle protein synthesis is most sensitive. Rice + chicken + veg + a piece of fruit is enough - no fancy shake required.",
          },
          {
            type: "callout",
            title: "Pre-bed",
            text: "A slow-digesting protein - Greek yogurt, cottage cheese, or casein - gives a slow amino acid drip while you sleep. Small edge, but a real one over months and years of hypertrophy work.",
          },
        ],
      },
      {
        kicker: "Pillar 5 (bonus)",
        heading: "Deload before you need to",
        blocks: [
          {
            type: "p",
            text: "Every 4 to 6 weeks, take a planned deload week. Half the volume, keep the movements, drop intensity 15-20%. This is not weakness - it is what lets you train hard for the next 12 months instead of the next 6.",
          },
          {
            type: "p",
            text: "The lifters who never deload are the same lifters who take 4-8 unplanned weeks off every year with a tweaked back, elbow, or knee. Choose which 'week off' you'd rather have.",
          },
        ],
      },
    ],
    takeaways: [
      "Sleep 7-8 hours, cold dark room, consistent schedule",
      "Stressful week? Drop training volume 20-30% - don't be a hero",
      "Walk, mobilise, Zone 2 - active recovery beats the couch every time",
      "Post-training and pre-bed protein hits are easy, cheap wins",
      "Deload every 4-6 weeks by plan, not by injury",
    ],
  },
  {
    slug: "how-to-deadlift-complete-breakdown",
    title: "The Deadlift: A Complete Technical Breakdown of the King of Lifts",
    category: "Big 3 · Technique",
    readTime: "12 min read",
    author: "Thiago Deschamps",
    authorRole: "Head Powerlifting Coach",
    authorImg: coachThiagoImg,
    publishedOn: "July 2026",
    img: imgDeadlift,
    excerpt:
      "The deadlift is the most honest lift in the gym. There is no bounce, no rack, no help - just you, the bar, and gravity. Here is the millimetre-by-millimetre breakdown of how to pull safely, powerfully, and for the next 20 years of your training life.",
    lead: "No lift builds more full-body strength than a properly executed deadlift. And no lift punishes sloppy execution faster. Get the setup right and the pull almost lifts itself. Get it wrong and you are one bad rep away from a six-month back rehab. This is the setup, the pull, and the lockout - taught the way we teach it inside Onyx.",
    stats: [
      { label: "Setup checkpoints", value: "7" },
      { label: "Bar path", value: "Vertical" },
      { label: "Bar over midfoot", value: "Always" },
      { label: "Reset every rep", value: "Yes" },
    ],
    sections: [
      {
        kicker: "Before you pull",
        heading: "The setup - where 90% of deadlifts are won or lost",
        blocks: [
          {
            type: "p",
            text: "The deadlift is not an explosive lift. It is a precise lift executed with intent. The setup takes 6-8 seconds and locks in every mechanical advantage your body has. Rush it and you leak force everywhere. Own it and the pull becomes a formality.",
          },
          { type: "h3", text: "The 7-point setup checklist" },
          {
            type: "list",
            items: [
              "Feet hip-width, toes slightly out (5-15°), bar directly over midfoot",
              "Shins 2-3 cm from the bar - do NOT push shins into it yet",
              "Hinge at the hips, grip the bar just outside the knees",
              "Drop the hips down until the shins meet the bar - not the other way around",
              "Chest tall, lats packed (imagine squeezing oranges in your armpits)",
              "Take a diaphragmatic breath into the belt (360° pressure), brace hard",
              "Pull the slack out of the bar - you should hear a soft click as plates settle",
            ],
          },
          {
            type: "callout",
            title: "The slack pull",
            text: "This is the most under-taught detail in the sport. Before you initiate the lift, pull up on the bar with just enough force to remove the play between the bar and the plates. Now every ounce of force you produce goes straight into moving weight instead of taking up slack. This alone adds 5-10 kg to most people's max on day one.",
          },
          {
            type: "quote",
            text: "The bar doesn't come off the floor until the setup tells it to. If your setup is wrong, no amount of trying harder fixes the pull.",
            cite: "Thiago Deschamps",
          },
        ],
      },
      {
        kicker: "The pull",
        heading: "Off the floor - drive, don't yank",
        blocks: [
          {
            type: "p",
            text: "The most common failure mode is yanking the bar. Your hips shoot up, your back rounds, and the lift becomes a stiff-leg deadlift with a rounded spine. That is how backs get hurt.",
          },
          {
            type: "p",
            text: "Instead, think push. Push the floor away with your legs while keeping your chest facing forward, not down. The bar should break the floor smoothly, not jerk off it. If it jerks, your slack was still in the bar.",
          },
          { type: "h3", text: "Key cues off the floor" },
          {
            type: "list",
            items: [
              "'Push the floor away' - drives quads and keeps hips from shooting up",
              "'Long arms, tight lats' - arms are ropes, lats are cables",
              "'Chest proud' - not chest up, chest forward",
              "'Bar drags the shin' - a scraped shin means a vertical bar path (wear long socks)",
              "'Hips and shoulders rise together' - if hips rise first, the weight is too heavy or the setup collapsed",
            ],
          },
        ],
      },
      {
        kicker: "Mid-pull to lockout",
        heading: "Through the knees and finish tall",
        blocks: [
          {
            type: "p",
            text: "Once the bar passes the knees, the lift becomes a hip extension. The quads have done their job. Now the glutes and hamstrings drive the hips forward under the bar until you are standing tall.",
          },
          {
            type: "p",
            text: "Do NOT hyperextend at the top. Do NOT lean back. A proper lockout is: knees straight, hips fully extended, glutes squeezed, ribs stacked over pelvis. Standing tall with the bar. Nothing more.",
          },
          {
            type: "callout",
            title: "The controlled negative",
            text: "Every rep gets lowered under control - not dropped, not slammed. Hinge the hips back first, then bend the knees once the bar clears them. Two seconds down. This is where 40% of your hypertrophy stimulus lives, and it teaches you the exact reverse of the setup for the next rep.",
          },
        ],
      },
      {
        kicker: "Common mistakes",
        heading: "What we fix in every new lifter",
        blocks: [
          {
            type: "list",
            items: [
              "Bar starts too far from the shins - creates a forward-moving bar path and back-dominant lift",
              "Hips too low (squat-style deadlift) - wastes quad range, hips shoot up anyway",
              "Rounded upper back with a neutral lower back is FINE - rounded lower back with a heavy load is not",
              "No brace - looking up, holding breath in the chest, no belly pressure. Fix with a belt cue: 'push the belly into the belt 360°'",
              "Bouncing reps off the floor - resets create honest reps and better skill transfer",
            ],
          },
        ],
      },
      {
        kicker: "Programming",
        heading: "How to actually get stronger at it",
        blocks: [
          {
            type: "p",
            text: "The deadlift responds best to lower volume, higher intensity, and religious technical practice. You cannot 'bodybuild' a deadlift up the way you can a squat. It is a skill lift as much as a strength lift.",
          },
          {
            type: "list",
            items: [
              "1 heavy deadlift session per week - top set of 1-5 reps @ RPE 7-8, then 2-3 backoff sets at 85-90% of the top set",
              "1 lighter posterior chain session - Romanian deadlifts, block pulls, or good mornings, 3-4 sets of 6-10",
              "Never train deadlifts fresh after 4+ hours of sleep debt - the CNS cost is too high",
              "Deload deadlifts every 4th week - halve the volume, drop intensity 15%",
            ],
          },
        ],
      },
    ],
    takeaways: [
      "Setup owns the lift - bar over midfoot, shins to bar last, slack pulled out",
      "Push the floor, don't yank - hips and shoulders rise together",
      "Lockout means standing tall, never leaning back",
      "Control the descent every rep, reset every rep",
      "One heavy deadlift day per week, deload every fourth",
    ],
  },
  {
    slug: "how-to-bench-press-complete-breakdown",
    title: "The Bench Press: The Full-Body Skill Everyone Treats Like an Arm Exercise",
    category: "Big 3 · Technique",
    readTime: "11 min read",
    author: "Lars Lie",
    authorRole: "Bodybuilding Coach",
    authorImg: coachLarsImg,
    publishedOn: "July 2026",
    img: imgBench,
    excerpt:
      "The bench press looks like you push a bar off your chest. Actually you push yourself into the bench and let the arch, leg drive, and shoulder pack do most of the work. Here is why 220 kg benchers look effortless and 100 kg benchers look like they're being crushed.",
    lead: "Everyone thinks the bench press is a chest exercise. It is a full-body strength expression. Feet, glutes, upper back, and grip do at least half the work of moving the bar. Learn the setup and you'll add 10-15 kg without gaining a kilogram of muscle. Skip it and you'll live on the fringe of chest injuries and stalled progress forever.",
    stats: [
      { label: "Contact points", value: "5" },
      { label: "Bar path", value: "J-curve" },
      { label: "Grip width", value: "1.5x shoulders" },
      { label: "Tuck the elbows", value: "45-70°" },
    ],
    sections: [
      {
        kicker: "The setup",
        heading: "Five points of contact - all the time",
        blocks: [
          {
            type: "p",
            text: "A safe, strong bench uses five points of contact: both feet flat on the floor, glutes on the bench, upper back on the bench, and head on the bench. Lose any one of them mid-rep and the lift becomes unstable and dangerous.",
          },
          { type: "h3", text: "The bench setup, step by step" },
          {
            type: "list",
            items: [
              "Lie under the bar with your eyes directly below it",
              "Grip 1.3-1.5x shoulder width, wrists stacked over elbows (not bent back)",
              "Retract and depress the shoulder blades - 'put them in your back pockets'",
              "Slide feet back, plant them flat, drive knees slightly outward",
              "Arch the upper back - not the lower back - to bring your chest to the bar",
              "Take a huge breath into the belly, brace, unrack with straight arms",
              "Let the bar settle over the shoulder joint - not over the chest yet",
            ],
          },
          {
            type: "callout",
            title: "Why the arch matters (and isn't cheating)",
            text: "The upper-back arch shortens the range the bar has to travel and puts your shoulder in a stable, packed position with the shoulder blades pinned. It is not lower-back hyperextension. Done properly it protects the shoulder and lets the pecs and triceps produce more force. Every world-class bencher does it.",
          },
        ],
      },
      {
        kicker: "The descent",
        heading: "Lower the bar to you - do not chase it down",
        blocks: [
          {
            type: "p",
            text: "The most common mistake in the bench press is treating the descent as recovery time. It is not. The eccentric is where you build the stretch reflex, groove the bar path, and set up a powerful drive off the chest.",
          },
          {
            type: "list",
            items: [
              "Elbows tuck to about 45-70° from the torso - not flared to 90°, not glued to sides",
              "Bar meets the sternum or just below the nipple line",
              "Bar path is slightly diagonal - a 'J' from over the shoulders down to the sternum",
              "Take 1.5-2 seconds to lower it - not a drop, not a 5-second grind",
              "Pause 0.5-1 second on the chest for real chest development and safer joints",
            ],
          },
          {
            type: "quote",
            text: "The bar comes down at your speed. The moment it dictates the speed, you have already lost the lift.",
            cite: "Lars Lie",
          },
        ],
      },
      {
        kicker: "The press",
        heading: "Leg drive, elbows in, bar back",
        blocks: [
          {
            type: "p",
            text: "Off the chest, drive the feet into the floor - not to lift the hips off the bench, but to create a rigid chain from the ground through the upper back into the bar. This is leg drive. Done right it feels like a slingshot.",
          },
          {
            type: "p",
            text: "As the bar rises, it travels back toward the shoulders - not straight up. Ending directly over the shoulders puts the load in the strongest mechanical position for lockout.",
          },
          {
            type: "callout",
            title: "The exhale",
            text: "Beginners exhale on the way up. Strong benchers exhale AFTER lockout. Air pressure inside a braced core is what keeps the ribcage rigid and the arch supported. Bleed it out at the bottom and the whole structure collapses.",
          },
        ],
      },
      {
        kicker: "Common mistakes",
        heading: "What kills benches and shoulders",
        blocks: [
          {
            type: "list",
            items: [
              "Elbows flared to 90° - crushes the anterior shoulder capsule over months of reps",
              "Bouncing off the chest - looks strong, teaches nothing, blows out sternums",
              "Feet up on the bench (unless rehabbing) - kills leg drive and stability",
              "Grip so wide the wrists bend back - inch it in until the wrist stacks over the elbow at the bottom",
              "No arch, shoulders un-retracted - the shoulder joint takes the entire load",
              "Pressing without a spotter or safety arms when going near max - always have one or the other",
            ],
          },
        ],
      },
      {
        kicker: "Programming",
        heading: "Bench like a lifter, not a bro",
        blocks: [
          {
            type: "list",
            items: [
              "Bench 2-3x per week - it responds well to frequency because it is skill-heavy",
              "One heavy day (3-5 reps @ RPE 7-8), one volume day (6-10 reps for 3-4 sets), one variation day (paused, close-grip, or incline)",
              "Rotate a horizontal press variation every 6-8 weeks to keep shoulders healthy",
              "Pair every pressing day with 2x the pulling volume - rows and face pulls save shoulders",
              "Add board presses or spoto presses when lockout is the weak point; add paused bench when off-the-chest strength is the weak point",
            ],
          },
        ],
      },
    ],
    takeaways: [
      "Five points of contact, upper-back arch, shoulder blades locked",
      "Elbows 45-70° tuck, bar meets sternum, controlled descent",
      "Leg drive is a strength tool, not cheating",
      "J-shaped bar path: down to sternum, back over shoulders",
      "Bench 2-3x per week and pull twice as much as you press",
    ],
  },
  {
    slug: "how-to-squat-complete-breakdown",
    title: "The Back Squat: The One Lift That Rewrites Your Body From the Ground Up",
    category: "Big 3 · Technique",
    readTime: "12 min read",
    author: "Simen Christiansen",
    authorRole: "Onyx Head Coach",
    authorImg: coachSimenImg,
    publishedOn: "July 2026",
    img: imgSquat,
    excerpt:
      "No exercise builds more total-body strength, size, and grit than a heavy back squat. And no exercise gets more misinterpreted. Here's the exact stance, brace, descent and drive we teach every Onyx lifter, from first-week beginners to seasoned powerlifters.",
    lead: "The back squat is the most demanding lift in the gym. Not because it is complicated - it isn't - but because it demands full-body coordination under real load. Learn to squat well and every other lower-body movement gets easier. Learn to squat badly and your knees, back, and hips will remind you for years.",
    stats: [
      { label: "Stance width", value: "Shoulders-1.5x" },
      { label: "Depth", value: "Hip crease < knee" },
      { label: "Brace 360°", value: "Every rep" },
      { label: "Bar path", value: "Vertical over midfoot" },
    ],
    sections: [
      {
        kicker: "The setup",
        heading: "Rack height, bar position, and the unrack",
        blocks: [
          {
            type: "p",
            text: "The lift begins before you unrack. J-hooks should sit so the bar is roughly at mid-sternum height when you're standing tall. Too high and you tiptoe out. Too low and you burn a quarter-squat of energy just clearing the rack.",
          },
          { type: "h3", text: "Bar position - high bar vs low bar" },
          {
            type: "list",
            items: [
              "High bar: bar on top of the traps, torso more upright, more quad-dominant, easier to learn",
              "Low bar: bar across the rear delts, more forward lean, more hip-dominant, moves the most weight",
              "Beginners: start high bar for 6-12 months. Migrate to low bar only if the sport demands it",
            ],
          },
          {
            type: "callout",
            title: "The walkout",
            text: "Unrack with a full brace, take 2-3 short steps back, plant your feet, and don't fidget. Every extra step you take wastes energy and shifts your setup. Watch a world-class squatter: they walk it out in 3 steps, take one breath, and squat. That is the standard.",
          },
        ],
      },
      {
        kicker: "Stance and brace",
        heading: "Where your feet go, and how to breathe into a belt",
        blocks: [
          {
            type: "list",
            items: [
              "Feet roughly shoulder-width to 1.5x shoulder-width for most lifters",
              "Toes turned out 15-30° - pick the angle where your hip lets you sink to depth without the knee caving",
              "Weight distributed across the whole foot: heel, ball, pinky toe - the 'tripod'",
              "Big toe glued to the floor at all times - it drives external rotation of the hip",
            ],
          },
          {
            type: "callout",
            title: "The 360° brace",
            text: "Take a huge breath into your belly - not your chest. Feel your obliques and lower back push out against a belt or your waistband. This creates intra-abdominal pressure, the single most important spine-protection mechanism you have. Hold the breath through the entire rep. Exhale only at lockout.",
          },
          {
            type: "quote",
            text: "You cannot squat heavy weights with a weak brace. The brace is not optional. It is the lift.",
            cite: "Simen Christiansen",
          },
        ],
      },
      {
        kicker: "The descent",
        heading: "Sit between the hips, not down onto the knees",
        blocks: [
          {
            type: "p",
            text: "The most common cue in the gym - 'sit back' - is only half right. Sit back too much and you turn a squat into a good morning. Sit straight down and your knees track over your toes but you fold at the hips.",
          },
          {
            type: "p",
            text: "The correct feeling: sit BETWEEN your hips. Break at the hips and knees at the same time. Push the knees out over the pinky toes as you descend. Your torso will lean forward - that's fine and correct. Keep the bar directly over the midfoot the entire way down.",
          },
          { type: "h3", text: "Depth - what actually counts" },
          {
            type: "list",
            items: [
              "Powerlifting standard: hip crease breaks parallel to the top of the knee",
              "Bodybuilding standard: as deep as your hips let you go without the pelvis tucking (butt wink)",
              "If the pelvis tucks under - stop there, that is your true depth. Force depth beyond it and the lumbar spine takes load it shouldn't",
            ],
          },
        ],
      },
      {
        kicker: "The drive",
        heading: "Chest up, hips and shoulders rise together",
        blocks: [
          {
            type: "p",
            text: "Out of the hole, the mistake is letting the hips shoot up first. Your torso pitches forward, the squat becomes a good morning, and your lower back becomes the primary mover of a heavy weight. Fix it with a single cue: 'chest up as you drive'. The hips and shoulders should rise at exactly the same rate.",
          },
          {
            type: "list",
            items: [
              "Drive the whole foot into the floor - never rock forward onto the toes",
              "Push the knees out through the ascent too, not just the descent",
              "Keep the bar over the midfoot the whole way up",
              "Finish tall, glutes squeezed, brace still held - THEN exhale",
            ],
          },
        ],
      },
      {
        kicker: "Common mistakes",
        heading: "The four squat killers we see every week",
        blocks: [
          {
            type: "list",
            items: [
              "Knees caving in (valgus) - fix with 'spread the floor' cue and glute med work",
              "Heels lifting - ankle mobility issue, use lifting shoes or squat wedges until it improves",
              "Butt wink at depth - stop at the depth your pelvis stays neutral, and mobilise the hips outside of training",
              "Hips shoot up out of the hole - the weight is too heavy OR the brace collapsed. Both call for a lighter working weight and better bracing",
            ],
          },
        ],
      },
      {
        kicker: "Programming",
        heading: "How to squat for the next 10 years, not the next 10 weeks",
        blocks: [
          {
            type: "list",
            items: [
              "Squat 2x per week for most lifters - one heavier day (3-5 reps @ RPE 7-8) and one lighter/volume day (5-8 reps for 3-4 sets)",
              "Rotate a squat variation every 6-8 weeks - pause squats, front squats, tempo squats - to keep hips and knees healthy",
              "Never redline squats for more than 3 weeks in a row without a deload",
              "Pair every squat day with dedicated hip and ankle mobility - 10 minutes before, 5 minutes after",
              "Warm-up sets: empty bar x 8, then 40% x 5, 60% x 3, 75% x 2, 85% x 1 before working sets",
            ],
          },
        ],
      },
    ],
    takeaways: [
      "Bar over midfoot from the walkout to the final rep - always",
      "Brace 360° into the belly, hold through the rep, exhale at the top",
      "Sit between the hips, knees push out, chest stays proud",
      "Depth stops where the pelvis stops staying neutral",
      "Squat twice a week, deload every fourth, rotate variations every 6-8 weeks",
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
