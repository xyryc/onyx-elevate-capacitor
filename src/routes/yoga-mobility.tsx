import { createFileRoute } from "@tanstack/react-router";
import { Clock, Leaf, Wind, Heart, Sunrise, Waves, Flower2, BookOpen, CheckCircle2, AlertTriangle, Sparkles, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import yogaHeroAsset from "@/assets/yoga/yoga-hero-class.png.asset.json";
import yogaMatAsset from "@/assets/yoga/yoga-lake.png.asset.json";

import poseDownwardDogAsset from "@/assets/yoga/pose-downward-dog-new.png.asset.json";
import poseChildsPoseAsset from "@/assets/yoga/pose-childs-pose-new.png.asset.json";
import poseCobraAsset from "@/assets/yoga/pose-cobra-new.png.asset.json";
import poseWarriorAsset from "@/assets/yoga/pose-warrior-new.png.asset.json";
import posePigeonAsset from "@/assets/yoga/pose-pigeon-new.png.asset.json";
import poseForwardFoldAsset from "@/assets/yoga/pose-forward-fold-new.png.asset.json";
import poseCatCowAsset from "@/assets/yoga/pose-cat-cow-new.png.asset.json";
import poseBridgeAsset from "@/assets/yoga/pose-bridge-new.png.asset.json";
import poseTreeAsset from "@/assets/yoga/pose-tree-new.png.asset.json";
import poseLotusAsset from "@/assets/yoga/pose-lotus-new.png.asset.json";
import poseSavasanaAsset from "@/assets/yoga/pose-savasana-new.png.asset.json";
import poseLowLunge from "@/assets/yoga/pose-low-lunge.jpg";

import articleMorningAsset from "@/assets/yoga/article-morning-reset-new.png.asset.json";
import articleMobilityAsset from "@/assets/yoga/article-mobility-new.png.asset.json";
import articleSlowImg from "@/assets/yoga/article-slow-practice.jpg";
import articleBreathingImg from "@/assets/yoga/article-breathing.jpg";

export const Route = createFileRoute("/yoga-mobility")({
  head: () => ({
    meta: [
      { title: "Yoga & Mobility - A Calm Corner | Onyx Elevate" },
      {
        name: "description",
        content:
          "A calm home for yoga and mobility at Onyx Elevate - featured guided practice, foundational poses, and thoughtful reads on breath, recovery, and mindful movement.",
      },
      { property: "og:title", content: "Yoga & Mobility - Onyx Elevate" },
      {
        property: "og:description",
        content: "A calm space for yoga and mobility - practice, breathe, recover.",
      },
    ],
  }),
  component: YogaMobilityPage,
});

const FEATURED_VIDEO_ID = "af7kn8gkafs";

export const introCards = [
  {
    icon: Leaf,
    title: "Move Gently",
    body: "Yoga is a conversation with your body, not a performance. Start slow, breathe deep, and let each pose meet you where you are.",
  },
  {
    icon: Wind,
    title: "Breathe First",
    body: "Every practice begins with the breath. Long, quiet inhales through the nose - the body follows the breath, not the other way around.",
  },
  {
    icon: Heart,
    title: "Recover Better",
    body: "Mobility work between hard sessions helps your joints, tissues, and nervous system return to balance so you can train again tomorrow.",
  },
];

function DialogCloseX({ className }: { className?: string }) {
  return (
    <DialogClose asChild>
      <button
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-onyx-50/85 backdrop-blur-md text-foreground shadow-sm hover:bg-onyx-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric",
          className
        )}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </DialogClose>
  );
}

type Pose = {
  image: string;
  name: string;
  focus: string;
  description: string;
  sanskrit: string;
  level: "Beginner" | "Beginner–Intermediate" | "Intermediate";
  hold: string;
  benefits: string[];
  steps: string[];
  breathing: string;
  mistakes: string[];
  modifications: string[];
};

export const poses: Pose[] = [
  {
    image: poseDownwardDogAsset.url,
    name: "Downward Dog",
    focus: "Full body",
    description:
      "A foundational inversion that lengthens the hamstrings, opens the shoulders, and decompresses the spine. Press the floor away and let your heels reach the ground.",
    sanskrit: "Adho Mukha Svanasana",
    level: "Beginner",
    hold: "5–8 slow breaths",
    benefits: [
      "Lengthens hamstrings, calves and spine",
      "Opens shoulders and upper back",
      "Builds strength in arms and core",
      "Calms the nervous system",
    ],
    steps: [
      "Start on hands and knees. Wrists under shoulders, knees under hips.",
      "Spread your fingers wide and press the whole hand firmly into the mat, especially the base of the index finger and thumb.",
      "Tuck your toes under and, on an exhale, lift your hips up and back toward the ceiling.",
      "Keep a soft bend in the knees at first. Focus on lengthening the spine - not on getting heels down.",
      "Draw your shoulder blades down your back, ears in line with your upper arms.",
      "Slowly start to straighten the legs and press the heels toward the floor. It's okay if they don't touch.",
    ],
    breathing:
      "Inhale to lengthen the spine, exhale to root through the hands and press the hips higher. Long, quiet nasal breathing throughout.",
    mistakes: [
      "Locking the elbows and dumping weight into the wrists.",
      "Rounding the upper back trying to force heels down.",
      "Hands too close to the feet - this shortens the pose.",
    ],
    modifications: [
      "Bend the knees generously if hamstrings are tight.",
      "Place a folded blanket under the wrists for support.",
      "Take Puppy Pose (forearms down) if wrists are sensitive.",
    ],
  },
  {
    image: poseChildsPoseAsset.url,
    name: "Child's Pose",
    focus: "Rest • Hips",
    description:
      "A restorative pose to return to whenever you need a breath. Knees wide, big toes touching, forehead soft on the mat. Breathe into your lower back.",
    sanskrit: "Balasana",
    level: "Beginner",
    hold: "1–3 minutes",
    benefits: [
      "Gently opens the hips, thighs and ankles",
      "Releases tension in the lower back",
      "Calms the mind and slows the breath",
      "A safe reset between any two poses",
    ],
    steps: [
      "Kneel on the mat with your big toes touching and knees as wide as the mat.",
      "Sit your hips back toward your heels.",
      "On an exhale, walk your hands forward and lower your torso between your thighs.",
      "Rest your forehead on the mat (or on a block/fist if it doesn't reach).",
      "Let your arms be long in front of you, palms down, or rest them alongside your body, palms up.",
      "Soften your jaw, shoulders and belly. Stay as long as you need.",
    ],
    breathing:
      "Breathe slowly into the back of the ribs and lower back - feel the body expand behind you on the inhale and settle on the exhale.",
    mistakes: [
      "Tensing the shoulders up toward the ears.",
      "Holding the breath instead of letting it deepen.",
    ],
    modifications: [
      "Place a bolster or folded blanket between the thighs and rest the torso on it.",
      "Bring the knees together if wide knees strain the hips.",
      "Put a cushion under the ankles if the tops of the feet are tight.",
    ],
  },
  {
    image: poseCobraAsset.url,
    name: "Cobra",
    focus: "Spine • Chest",
    description:
      "A gentle backbend that strengthens the low back and opens the chest. Keep your elbows soft and lift only as high as your body allows without strain.",
    sanskrit: "Bhujangasana",
    level: "Beginner",
    hold: "3–5 breaths, repeat 2–3 times",
    benefits: [
      "Strengthens the spine, glutes and back of the shoulders",
      "Opens the chest and front of the body",
      "Counters the effect of sitting all day",
    ],
    steps: [
      "Lie face down. Legs straight, tops of the feet on the mat, hip-width apart.",
      "Place your hands flat under your shoulders, elbows tucked close to the ribs.",
      "Press the pubic bone and tops of the feet firmly into the mat.",
      "On an inhale, gently peel your chest off the floor using your back muscles first.",
      "Only then press lightly into the hands to lift a little higher - keep a bend in the elbows.",
      "Draw the shoulders down and back. Gaze forward or slightly up without crunching the neck.",
    ],
    breathing:
      "Inhale to lift and lengthen, exhale to lower. Never hold your breath in a backbend.",
    mistakes: [
      "Pushing up with the arms and dumping into the low back.",
      "Crunching the neck by throwing the head back.",
      "Letting the elbows flare out to the sides.",
    ],
    modifications: [
      "Start with Sphinx Pose (forearms down) if the low back is sensitive.",
      "Keep the lift low - inches off the floor is plenty.",
    ],
  },
  {
    image: poseCatCowAsset.url,
    name: "Cat–Cow",
    focus: "Spine mobility",
    description:
      "A slow flow linking breath to movement. Inhale, drop the belly and lift the chest; exhale, round the spine. The best warm-up for any session.",
    sanskrit: "Marjaryasana–Bitilasana",
    level: "Beginner",
    hold: "8–12 slow rounds",
    benefits: [
      "Mobilises every segment of the spine",
      "Warms up the shoulders, hips and core",
      "Syncs breath with movement to settle the mind",
    ],
    steps: [
      "Come to hands and knees. Wrists under shoulders, knees under hips, spine neutral.",
      "Inhale (Cow): drop the belly, lift the chest and tailbone, gaze gently forward.",
      "Exhale (Cat): tuck the tailbone, round the spine toward the ceiling, chin toward chest.",
      "Move slowly - let each breath drive the movement, not the other way around.",
      "Repeat 8–12 rounds, exploring side-to-side and circular movement in the final rounds.",
    ],
    breathing:
      "One breath per movement. Inhale opens the front body, exhale opens the back body.",
    mistakes: [
      "Rushing through the movement without matching the breath.",
      "Collapsing into the shoulders - keep the arms actively pressing the floor away.",
    ],
    modifications: [
      "Pad the knees with a folded blanket.",
      "Do the same movement seated in a chair if kneeling isn't available.",
    ],
  },
  {
    image: poseWarriorAsset.url,
    name: "Warrior II",
    focus: "Legs • Focus",
    description:
      "A grounding standing pose that builds leg strength, hip mobility, and mental steadiness. Front knee tracks the middle toes, gaze soft over the front hand.",
    sanskrit: "Virabhadrasana II",
    level: "Beginner–Intermediate",
    hold: "5–8 breaths per side",
    benefits: [
      "Builds strength in legs, glutes and core",
      "Opens the hips and inner thighs",
      "Improves focus, stamina and balance",
    ],
    steps: [
      "Step your feet wide apart, about one leg-length.",
      "Turn your right foot out 90°. Turn your left toes slightly in.",
      "Align the right heel with the arch of the left foot.",
      "Bend the right knee to 90°, stacking it directly over the ankle. The knee tracks toward the middle toes.",
      "Press the outer edge of the back foot firmly into the mat and straighten the back leg.",
      "Extend your arms parallel to the floor, palms down. Shoulders relaxed.",
      "Turn your head to gaze softly over the front middle finger.",
      "Hold, then switch sides.",
    ],
    breathing:
      "Steady, even breathing. Inhale to lengthen the spine taller; exhale to sink the hips lower.",
    mistakes: [
      "Front knee collapsing inward - actively press it out toward the pinky toe.",
      "Front knee traveling past the ankle.",
      "Leaning the torso forward over the front leg. Keep the shoulders stacked over the hips.",
    ],
    modifications: [
      "Shorten your stance if the front knee wobbles.",
      "Rest hands on hips if the shoulders fatigue.",
    ],
  },
  {
    image: posePigeonAsset.url,
    name: "Pigeon Pose",
    focus: "Hip opener",
    description:
      "A deep hip opener that releases tension in the glutes and outer hip. Move in slowly, support the front hip with a folded blanket if needed.",
    sanskrit: "Eka Pada Rajakapotasana (prep)",
    level: "Intermediate",
    hold: "1–3 minutes per side",
    benefits: [
      "Deep release for the outer hip, glutes and piriformis",
      "Opens hip flexors of the back leg",
      "Relieves lower-back tightness caused by tight hips",
    ],
    steps: [
      "Start in Downward Dog. Bring your right knee forward toward your right wrist.",
      "Angle the right shin toward the left wrist - the more parallel to the front of the mat, the deeper the stretch.",
      "Slide the left leg straight back. Top of the left foot pressing into the mat, hips square to the front.",
      "Support the right hip with a folded blanket or block so both hips are level.",
      "Stay tall through the chest for a lighter version, or walk the hands forward and rest the forehead down for a deeper release.",
      "Breathe long and slow. Switch sides.",
    ],
    breathing:
      "Slow nasal breathing. Each exhale, invite the front hip to soften - never force the stretch.",
    mistakes: [
      "Letting the front hip collapse to the floor - this twists the knee.",
      "Forcing the shin parallel before the hip is open enough.",
      "Holding tension in the jaw and shoulders.",
    ],
    modifications: [
      "Always support the front-side hip with a blanket, bolster or block.",
      "Try Figure-4 (Reclined Pigeon) on your back if the knee is sensitive.",
    ],
  },
  {
    image: poseForwardFoldAsset.url,
    name: "Seated Forward Fold",
    focus: "Hamstrings",
    description:
      "A calming forward fold that stretches the entire back line of the body. Lead with the chest, not the head, and let the breath deepen the pose over time.",
    sanskrit: "Paschimottanasana",
    level: "Beginner",
    hold: "1–3 minutes",
    benefits: [
      "Stretches hamstrings, calves and the entire back body",
      "Calms the mind and quiets the nervous system",
      "Gently massages the abdominal organs",
    ],
    steps: [
      "Sit on the floor with legs straight in front, feet flexed. Sit on a folded blanket if your low back rounds.",
      "Inhale, reach both arms overhead and lengthen the spine tall.",
      "Exhale, hinge forward from the hips (not the waist), reaching the chest toward the toes.",
      "Take hold of your shins, ankles or feet - wherever you can reach without rounding.",
      "Keep the front of the spine long. Lead with the sternum, not the forehead.",
      "Let each exhale melt you a little deeper. Never force.",
    ],
    breathing:
      "Inhale to lengthen the spine, exhale to fold a little deeper. Breath is the pose.",
    mistakes: [
      "Rounding the back to try to touch the toes.",
      "Locking the knees hard - keep a micro-bend.",
      "Pulling with the arms instead of hinging from the hips.",
    ],
    modifications: [
      "Bend the knees generously and place a rolled blanket under them.",
      "Loop a strap around the feet and hold the strap with a tall spine.",
    ],
  },
  {
    image: poseBridgeAsset.url,
    name: "Bridge Pose",
    focus: "Glutes • Back",
    description:
      "A gentle backbend that strengthens the glutes and hamstrings while opening the front of the hips. Press evenly through both feet and lift with control.",
    sanskrit: "Setu Bandha Sarvangasana",
    level: "Beginner",
    hold: "5–8 breaths, repeat 2–3 times",
    benefits: [
      "Strengthens glutes, hamstrings and back",
      "Opens the chest, shoulders and hip flexors",
      "Counters the effects of sitting",
    ],
    steps: [
      "Lie on your back. Bend the knees, feet flat, hip-width apart, close to the sit bones.",
      "Arms alongside the body, palms down.",
      "On an inhale, press evenly through both feet and lift the hips toward the ceiling.",
      "Roll the shoulders under one at a time and interlace the fingers beneath your back if it's available.",
      "Keep the thighs parallel - don't let the knees splay outward.",
      "Lift the chest toward the chin, but keep the chin slightly away from the chest.",
      "To release, unclasp the hands and lower down one vertebra at a time.",
    ],
    breathing:
      "Inhale to lift, breathe steadily while holding, exhale to lower slowly.",
    mistakes: [
      "Knees splaying outward - squeeze a block between the thighs to feel the alignment.",
      "Turning the head from side to side while lifted (protect the neck).",
      "Pushing too high and dumping into the low back.",
    ],
    modifications: [
      "Place a yoga block on any height under the sacrum for Supported Bridge - a passive, restorative version.",
    ],
  },
  {
    image: poseTreeAsset.url,
    name: "Tree Pose",
    focus: "Balance",
    description:
      "A single-leg balance that builds ankle stability and mental focus. Fix your gaze on one point and root down through the standing foot.",
    sanskrit: "Vrksasana",
    level: "Beginner",
    hold: "30 seconds – 1 minute per side",
    benefits: [
      "Builds ankle, knee and hip stability",
      "Strengthens the standing leg and core",
      "Improves focus and balance",
    ],
    steps: [
      "Stand tall in Mountain Pose, feet together, weight even.",
      "Shift weight into the left foot. Feel all four corners of that foot press down.",
      "Pick up the right foot and place the sole on the inside of the left ankle, calf or inner thigh - never on the knee.",
      "Press foot and inner leg into each other equally.",
      "Bring the hands to prayer at the heart, or extend them overhead like branches.",
      "Fix your gaze on one still point (a drishti) about eye level.",
      "Breathe. Switch sides.",
    ],
    breathing:
      "Slow, even breathing. If the breath speeds up, you're gripping - soften and re-root.",
    mistakes: [
      "Placing the foot on the standing knee - always above or below.",
      "Letting the standing hip pop out to the side.",
      "Looking at a moving object (this kills balance).",
    ],
    modifications: [
      "Keep the toes of the lifted foot on the floor with the heel against the ankle.",
      "Stand near a wall for a fingertip touch of support.",
    ],
  },
  {
    image: poseLotusAsset.url,
    name: "Easy Seat",
    focus: "Meditation",
    description:
      "A simple cross-legged seat for breathwork and meditation. Sit tall, crown lifted, shoulders soft. Let the breath settle before you begin.",
    sanskrit: "Sukhasana",
    level: "Beginner",
    hold: "3–10 minutes for meditation",
    benefits: [
      "Grounds the body for breathwork and meditation",
      "Opens the hips gently over time",
      "Encourages upright, effortless posture",
    ],
    steps: [
      "Sit on a folded blanket or cushion so the hips are higher than the knees.",
      "Cross the shins loosely in front of you, one foot in front of the other.",
      "Root down through both sit bones evenly.",
      "Stack the shoulders over the hips, ears over the shoulders, crown of the head lifting.",
      "Rest the hands on the thighs or knees, palms up or down.",
      "Soften the eyes, jaw and shoulders. Begin to breathe.",
    ],
    breathing:
      "Slow, even nasal breathing. A 4-count inhale and 6-count exhale is a calming place to start.",
    mistakes: [
      "Sitting flat on the floor with hips lower than the knees - the low back will round.",
      "Tilting the pelvis backward and slumping.",
    ],
    modifications: [
      "Sit against a wall for support.",
      "Sit in a chair with both feet flat on the floor, spine tall - meditation is about the mind, not the shape.",
    ],
  },
  {
    image: poseSavasanaAsset.url,
    name: "Savasana",
    focus: "Rest • Integration",
    description:
      "The final pose of every practice. Lie flat, palms facing up, and let everything soften. This is where the work is absorbed into the body.",
    sanskrit: "Savasana",
    level: "Beginner",
    hold: "5–10 minutes",
    benefits: [
      "Allows the nervous system to fully downshift",
      "Integrates the benefits of the practice",
      "Reduces stress and mental fatigue",
    ],
    steps: [
      "Lie on your back. Let the legs fall out to the sides, feet wider than the hips.",
      "Arms rest away from the body, palms facing up.",
      "Roll the shoulders down and back so the chest is open.",
      "Slightly tuck the chin so the back of the neck is long.",
      "Close the eyes. Let the whole body get heavy - no muscle is doing anything.",
      "Stay 5–10 minutes. To come out, wiggle fingers and toes, then roll to your right side before sitting up slowly.",
    ],
    breathing:
      "Let the breath return to its natural rhythm. No effort, no counting - just observe.",
    mistakes: [
      "Skipping it. Savasana is not a bonus - it's part of the practice.",
      "Falling asleep every time. Aim for restful awareness.",
    ],
    modifications: [
      "Place a bolster or rolled blanket under the knees for the low back.",
      "Cover the eyes with an eye pillow or folded towel.",
      "Cover the body with a blanket - the body cools quickly in stillness.",
    ],
  },
  {
    image: poseLowLunge,
    name: "Low Lunge",
    focus: "Hips • Legs",
    description:
      "A grounding lunge that opens the hip flexors, lengthens the front body, and builds steady lower-body control. Keep the chest lifted and breathe into the stretch.",
    sanskrit: "Anjaneyasana",
    level: "Beginner",
    hold: "5–8 breaths per side",
    benefits: [
      "Deep stretch for the hip flexors and psoas",
      "Strengthens the front leg and glutes",
      "Opens the chest and shoulders",
    ],
    steps: [
      "From Downward Dog, step your right foot forward between your hands.",
      "Lower the left knee to the mat and untuck the back toes (top of the foot on the floor).",
      "Slide the back knee back until you feel a stretch across the front of the left hip.",
      "Stack the right knee directly over the right ankle.",
      "On an inhale, sweep the arms up overhead. Reach the fingertips up as the tailbone lengthens down.",
      "Draw the low belly in slightly to protect the low back. Gaze forward or slightly up.",
      "Hold, then switch sides.",
    ],
    breathing:
      "Inhale to lift and lengthen, exhale to root the back knee down and sink the hips slightly.",
    mistakes: [
      "Letting the front knee travel past the ankle.",
      "Cranking the low back by pushing the hips too far forward.",
      "Collapsing the shoulders up around the ears.",
    ],
    modifications: [
      "Pad the back knee with a folded blanket.",
      "Keep the hands on the front thigh or on blocks either side of the front foot if reaching up is too intense.",
    ],
  },
];

type ArticleSection = { heading: string; body: string; bullets?: string[] };
type Article = {
  icon: typeof Sunrise;
  image: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  intro: string;
  sections: ArticleSection[];
  takeaway: string;
};

export const articles: Article[] = [
  {
    icon: Sunrise,
    image: articleMorningAsset.url,
    tag: "Morning",
    title: "The 5-Minute Morning Reset: Wake Your Body Without Coffee",
    excerpt:
      "No hour-long class required. Four intentional movements in five minutes can shift your nervous system from sleep mode to ready mode before your first cup.",
    readTime: "3 min read",
    intro:
      "Most mornings start with a phone scroll and a groggy shuffle to the kitchen. Five minutes of deliberate movement before anything else gives your spine, hips and breath a head start on the day. You do not need flexibility, experience or a yoga mat — just enough floor space to kneel and stand.",
    sections: [
      {
        heading: "1. Cat–Cow • 1 minute",
        body:
          "Start on hands and knees. Inhale, drop the belly and lift the chest; exhale, round the spine toward the ceiling. Move slowly for 10–12 rounds. This wakes every segment of the spine and warms the shoulders and hips at the same time.",
      },
      {
        heading: "2. Low Lunge (both sides) • 2 minutes",
        body:
          "Step one foot forward, lower the back knee, and sink the hips gently until you feel a stretch across the front of the back hip. Reach the arms overhead if it feels good. Hold for 5–8 breaths per side. This opens the hip flexors that shorten from sleeping and sitting.",
      },
      {
        heading: "3. Standing Forward Fold • 1 minute",
        body:
          "Stand tall, hinge from the hips, and let the upper body hang. Keep a soft bend in the knees. Hold opposite elbows and sway gently side to side. Feel the spine decompress and the hamstrings wake up.",
      },
      {
        heading: "4. Three long breaths • 1 minute",
        body:
          "Roll up to standing one vertebra at a time. Stand still, close the eyes, and take three long nasal breaths — 4 counts in, 6 counts out. This is where the reset actually lands.",
      },
    ],
    takeaway:
      "Do this on the days you do not want to. Those are the days it matters most.",
  },
  {
    icon: Waves,
    image: articleMobilityAsset.url,
    tag: "Recovery",
    title: "Mobility Beats Stretching: Why Active Range Wins",
    excerpt:
      "Static stretching relaxes a muscle. Mobility teaches a joint to move with control. One feels good in the moment; the other changes how you lift, run and age.",
    readTime: "4 min read",
    intro:
      "Stretching and mobility are not the same thing, even though the words get swapped around. Understanding the difference is one of the fastest ways to make your warm-ups matter and your joints last. If you want a body that moves well when it counts, train the range — do not just wait for it.",
    sections: [
      {
        heading: "Stretching is passive. Mobility is active.",
        body:
          "A hamstring stretch is you sitting still and waiting for the muscle to lengthen. Mobility work is you actively controlling a joint through its full available range — with strength, not just gravity.",
      },
      {
        heading: "Why active range matters more",
        body:
          "Your body will only let you use the range it trusts. If you can passively touch your toes but cannot lift your leg to hip height under control, your nervous system treats the upper part of that range as unsafe — and locks you out of it during squats, deadlifts and sprints.",
      },
      {
        heading: "A simple weekly template",
        body:
          "Three mobility drills, three times a week, is enough to see a change in 4–6 weeks. Focus on the joints you actually use.",
        bullets: [
          "Hips: 90/90 transitions, controlled hip circles",
          "Ankles: knee-to-wall drills, tibialis raises",
          "Shoulders: prone Y-T-W raises, scapular CARs",
        ],
      },
      {
        heading: "Keep stretching too",
        body:
          "Static stretching still has a place — after a session, before bed, or when a specific muscle is chronically tight. Just do not rely on it alone if the goal is a body that moves well when it matters.",
      },
    ],
    takeaway:
      "Train the range. Own it. Then let it show up in your lifts.",
  },
  {
    icon: Flower2,
    image: articleSlowImg,
    tag: "Mindset",
    title: "The Case for Slowing Down: Quiet Sessions, Stronger Athletes",
    excerpt:
      "In a culture obsessed with PRs and output, the most underrated recovery tool is a quiet, breath-led session with no metrics at all.",
    readTime: "5 min read",
    intro:
      "Everything in modern training is measured — sets, reps, tempo, PRs, splits, macros. That measurement is useful, but it teaches your nervous system to always be pushing. A slow, quiet practice is where that same nervous system learns how to come back down.",
    sections: [
      {
        heading: "Recovery is a skill, not a rest day",
        body:
          "Real recovery is not the absence of training — it is an active downshift of the nervous system. Sleep does most of the work, but the hours you are awake matter too. A slow practice teaches your body that it is safe to un-clench.",
      },
      {
        heading: "What 'slow' actually looks like",
        body:
          "No metrics. No music with a BPM. No pose you are chasing. You move at the pace of a full inhale and a longer exhale, and you let each shape settle before moving to the next one. If you finish and cannot remember the sequence, you did it right.",
      },
      {
        heading: "The training carryover",
        body:
          "Athletes who add 2–3 slow sessions per week often report better sleep, less nagging joint pain, faster warm-ups, and — the one nobody expects — better focus under a heavy bar. A calmer baseline makes the loud moments easier to handle.",
      },
      {
        heading: "How to start",
        body:
          "Pick a 15-minute window. Roll out a mat. Move through Cat–Cow, Child's Pose, Low Lunge, Seated Forward Fold and Savasana. Stay in each one long enough to feel bored — then stay one breath longer.",
      },
    ],
    takeaway:
      "Slow is not the opposite of strong. It is what makes strong sustainable.",
  },
  {
    icon: BookOpen,
    image: articleBreathingImg,
    tag: "Foundations",
    title: "Breathe Like You Train: Three Techniques That Actually Work",
    excerpt:
      "Nasal breathing, diaphragm work and the box breath are free, portable and immediate. Here is how to use each one when it matters.",
    readTime: "4 min read",
    intro:
      "Breathing is the one system in the body that runs automatically and can also be consciously controlled. That makes it the fastest lever you have for changing how you feel, how you perform, and how you recover.",
    sections: [
      {
        heading: "1. Nasal breathing (default it)",
        body:
          "Breathe through the nose whenever possible — at rest, walking, and through the first two-thirds of most workouts. Nasal breathing filters and warms the air, produces nitric oxide (which helps oxygen delivery), and forces a slower, deeper breath. Mouth breathing is for the last hard reps, not the whole session.",
      },
      {
        heading: "2. Diaphragmatic breathing",
        body:
          "Lie on your back with one hand on your chest and one on your belly. Breathe in through the nose so only the belly hand rises. Exhale slowly. Ten breaths like this drops your heart rate, lowers stress hormones, and reminds your body which muscle is supposed to be running the show.",
      },
      {
        heading: "3. The box breath",
        body:
          "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat for 2–5 minutes. Used by Navy SEALs before missions and by lifters before max attempts. It is a fast, portable way to steady the nervous system when the moment matters.",
      },
      {
        heading: "When to use each",
        body:
          "Nasal breathing all day. Diaphragmatic breathing before bed and during cooldowns. Box breath before a heavy lift, a hard conversation, or any moment you want to walk into calmer than you feel.",
      },
    ],
    takeaway:
      "You already breathe 20,000 times a day. A few of them on purpose changes everything.",
  },
];

function PoseCard({ pose: p }: { pose: Pose }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <article
          className="group surface-card rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-electric/40 hover:shadow-electric text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              (e.currentTarget as HTMLElement).click();
            }
          }}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-onyx-100">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/80 via-onyx-50/10 to-transparent" />
            <span className="absolute top-3 left-3 rounded-md border border-electric/40 bg-onyx-50/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric">
              {p.focus}
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="font-display text-base sm:text-lg font-semibold group-hover:text-electric transition-colors">
              {p.name}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {p.description}
            </p>
          </div>
        </article>
      </DialogTrigger>

      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <DialogCloseX className="absolute right-3 top-3 z-50" />
        <div className="relative aspect-[16/9] overflow-hidden rounded-none sm:rounded-t-2xl bg-onyx-50 border-b border-border/60">
          <img
            src={p.image}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50 to-transparent" />
          <span className="absolute top-3 left-3 rounded-md border border-electric/40 bg-onyx-50/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric">
            {p.focus}
          </span>
        </div>

        <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold">
              {p.name}
            </DialogTitle>
            <DialogDescription className="text-sm italic text-muted-foreground">
              {p.sanskrit}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1 rounded-md border border-electric/30 bg-electric/10 px-2 py-1 text-electric">
              <Sparkles className="h-3 w-3" />
              {p.level}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-onyx-100 px-2 py-1 text-muted-foreground">
              <Timer className="h-3 w-3" />
              Hold: {p.hold}
            </span>
          </div>

          <p className="mt-4 text-sm md:text-base text-foreground/85 leading-relaxed">
            {p.description}
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric">
                Benefits
              </h4>
              <ul className="mt-3 space-y-2">
                {p.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-foreground/85">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-electric" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-electric/20 bg-electric/5 p-4">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Breathing
              </h4>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                {p.breathing}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric">
              Step by step
            </h4>
            <ol className="mt-3 space-y-3">
              {p.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                  <span className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-electric text-onyx-50 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Common mistakes
              </h4>
              <ul className="mt-3 space-y-2">
                {p.mistakes.map((m) => (
                  <li key={m} className="flex gap-2 text-sm text-foreground/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric/70" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Modifications
              </h4>
              <ul className="mt-3 space-y-2">
                {p.modifications.map((m) => (
                  <li key={m} className="flex gap-2 text-sm text-foreground/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric/70" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/80 border-t border-border/60 pt-4">
            If a pose causes sharp pain, come out slowly. Yoga should challenge, not injure.
            Consult a health professional if you have injuries or medical concerns.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function YogaMobilityPage() {
  return (
    <div className="min-h-screen bg-onyx-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <img
            src={yogaHeroAsset.url}
            alt="Serene yoga studio with soft light"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx-50/70 via-onyx-50/60 to-onyx-50" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container-onyx relative py-20 md:py-28 text-center">
          <span className="inline-block rounded-full border border-electric/40 bg-electric/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-electric">
            Free • A calm corner of Onyx
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
            Yoga & <span className="text-gradient-electric">Mobility</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            A quiet space to breathe, stretch, and recover. Start with a featured practice,
            learn the foundational poses, and explore short reads on mindful movement.
          </p>
        </div>
      </section>

      {/* Featured Practice - text left, smaller video right */}
      <section className="container-onyx py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-electric font-semibold">
              Featured Practice
            </span>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold leading-tight">
              Start here - a gentle guided session
            </h2>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~20 minutes • All levels</span>
            </div>
            <p className="mt-5 text-base text-foreground/80 leading-relaxed">
              A gentle, accessible session to ease into your practice. Follow along at your own
              pace - modify freely and let the breath lead each movement. This is the perfect
              starting point whether you're brand new to yoga or returning after time away.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Roll out a mat, dim the lights, and give yourself these twenty minutes.
              Consistency beats intensity - even a short daily practice will move you further
              than a long session once a week.
            </p>
            <div className="mt-6 rounded-md border border-border/60 bg-onyx-100/60 p-4 text-xs text-muted-foreground">
              This video is provided by the original creator and embedded from YouTube. All
              rights belong to the respective channel.
            </div>
          </div>

          <div className="relative">
            {/* soft glow behind the frame */}
            <div className="absolute -inset-4 rounded-3xl bg-electric/10 blur-2xl pointer-events-none" />
            <div className="relative surface-card glow-ring rounded-2xl overflow-hidden">
              {/* player chrome bar */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-onyx-100/80 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-electric/70 shadow-[0_0_8px_var(--electric)]" />
                <span className="h-2 w-2 rounded-full bg-onyx-300" />
                <span className="h-2 w-2 rounded-full bg-onyx-300" />
                <span className="ml-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Onyx Player
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-electric">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                  Featured
                </span>
              </div>
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}?rel=0`}
                  title="Featured Yoga Practice"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* corner accents */}
                <span className="pointer-events-none absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-electric/70 rounded-tl-md" />
                <span className="pointer-events-none absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-electric/70 rounded-tr-md" />
                <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-electric/70 rounded-bl-md" />
                <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-electric/70 rounded-br-md" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Intro Cards */}
      <section className="container-onyx pb-6 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {introCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="surface-card rounded-xl p-6 transition-all hover:-translate-y-1 hover:border-electric/40 hover:shadow-electric"
              >
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-electric/15 border border-electric/30">
                  <Icon className="h-5 w-5 text-electric" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Split banner with mat image */}
      <section className="container-onyx py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] items-stretch">
          <div className="surface-card rounded-2xl p-8 md:p-10 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-wider text-electric font-semibold">
              The Practice
            </span>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">
              Ten poses. A lifetime of practice.
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              You don't need a hundred postures - you need a handful, practiced with attention.
              Below are the foundational shapes that most yoga sessions return to. Learn them
              slowly, feel them deeply, and let them become old friends.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-border/60 min-h-[220px]">
            <img
              src={yogaMatAsset.url}
              alt="Rolled yoga mats"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-onyx-50/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Foundational Poses */}
      <section className="container-onyx py-6 md:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs uppercase tracking-wider text-electric font-semibold">
              Foundational Poses
            </span>
            <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold">
              The shapes worth knowing
            </h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="shrink-0 text-sm font-semibold text-electric hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded"
              >
                See all →
              </button>
            </DialogTrigger>
            <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-5xl h-[100dvh] sm:h-[92dvh] max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
              <DialogHeader className="relative sticky top-0 z-10 bg-onyx-50/95 backdrop-blur border-b border-border/60 px-4 sm:px-6 py-4 text-left">
                <DialogTitle className="font-display text-xl md:text-2xl font-bold">
                  Foundational Poses
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Every shape, one place. Tap any pose for the full guide.
                </DialogDescription>
                <DialogCloseX className="absolute right-3 top-1/2 -translate-y-1/2" />
              </DialogHeader>
              <div className="px-4 sm:px-6 py-6 grid grid-cols-2 gap-4">
                {poses.map((p) => (
                  <PoseCard key={`all-${p.name}`} pose={p} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {poses.map((p) => (
            <PoseCard key={p.name} pose={p} />
          ))}
        </div>
      </section>


      {/* Articles */}
      <section className="container-onyx py-14 md:py-20">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider text-electric font-semibold">
            Read & Reflect
          </span>
          <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold">
            Short reads for a calmer practice
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {articles.map((a) => (
              <Dialog key={a.title}>
                <DialogTrigger asChild>
                  <article
                    className="group surface-card rounded-xl overflow-hidden hover:border-electric/40 transition-all flex flex-col text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric h-full"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).click();
                      }
                    }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-onyx-100">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-electric/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">
                        {a.tag}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display text-lg font-bold leading-snug group-hover:text-electric transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {a.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{a.readTime}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-electric">
                          Read article
                          <svg
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </DialogTrigger>

                <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-2xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
                  <DialogCloseX className="absolute right-3 top-3 z-50" />
                  <div className="relative aspect-[16/9] overflow-hidden rounded-none sm:rounded-t-2xl bg-onyx-100">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/40 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-electric/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-50 backdrop-blur-sm">
                      {a.tag}
                    </span>
                  </div>

                  <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
                    <DialogHeader className="text-left">
                      <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
                        {a.title}
                      </DialogTitle>
                      <DialogDescription className="text-xs uppercase tracking-wider text-muted-foreground">
                        {a.readTime} • {a.tag}
                      </DialogDescription>
                    </DialogHeader>

                    <p className="mt-4 text-base text-foreground/90 leading-relaxed">
                      {a.intro}
                    </p>

                    <div className="mt-6 space-y-6">
                      {a.sections.map((s) => (
                        <div key={s.heading}>
                          <h4 className="font-display text-base md:text-lg font-semibold text-electric">
                            {s.heading}
                          </h4>
                          <p className="mt-2 text-sm md:text-base text-foreground/85 leading-relaxed">
                            {s.body}
                          </p>
                          {s.bullets && (
                            <ul className="mt-3 space-y-2">
                              {s.bullets.map((b) => (
                                <li key={b} className="flex gap-2 text-sm text-foreground/85">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-lg border border-electric/30 bg-electric/10 p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-electric">
                        Takeaway
                      </span>
                      <p className="mt-1 text-sm md:text-base text-foreground/90 leading-relaxed italic">
                        {a.takeaway}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
          ))}
        </div>


        <p className="mt-12 text-xs text-muted-foreground/80 text-center max-w-2xl mx-auto">
          Onyx Elevate does not own the third-party videos embedded on this page. They are
          curated for educational and wellness purposes.
        </p>
      </section>
    </div>
  );
}
