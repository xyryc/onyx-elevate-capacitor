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

import { poses as yogaPoses, type Pose } from "@/data/yogaPoses";
export const poses = yogaPoses;

import articleMorningAsset from "@/assets/yoga/article-morning-reset-new.png.asset.json";
import articleMobilityAsset from "@/assets/yoga/article-mobility-new.png.asset.json";
import articleSlowImg from "@/assets/yoga/article-slow-practice.jpg";
import articleBreathingImg from "@/assets/yoga/article-breathing.jpg";

export const Route = createFileRoute("/yoga-mobility")({
  head: () => ({
    meta: [
      { title: "Yoga & Stretching - A Calm Corner | Onyx Elevate" },
      {
        name: "description",
        content:
          "A calm home for yoga and stretching at Onyx Elevate - featured guided practice, foundational poses, and thoughtful reads on breath, recovery, and mindful movement.",
      },
      { property: "og:title", content: "Yoga & Stretching - Onyx Elevate" },
      {
        property: "og:description",
        content: "A calm space for yoga and stretching - practice, breathe, recover.",
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
              src={`https://vz-3d635cd8-505.b-cdn.net/${p.guid}/thumbnail.jpg`}
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

      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 pt-[env(safe-area-inset-top,0px)] sm:pt-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <DialogCloseX className="absolute right-3 top-[calc(12px+env(safe-area-inset-top,0px))] sm:top-3 z-50" />
        <div className="relative aspect-[16/9] overflow-hidden rounded-none sm:rounded-t-2xl bg-black border-b border-border/60">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/709339/${p.guid}?autoplay=true&loop=false&muted=false&preload=true`}
            title={p.name}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
          <span className="absolute top-3 left-3 rounded-md border border-electric/40 bg-onyx-50/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric z-10">
            {p.focus}
          </span>
        </div>

        <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold">
              {p.name}
            </DialogTitle>
            {p.sanskrit && (
              <DialogDescription className="text-sm italic text-muted-foreground">
                {p.sanskrit}
              </DialogDescription>
            )}
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
            Yoga & <span className="text-gradient-electric">Stretching</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            A quiet space to breathe, stretch, and recover. Start with a featured practice,
            learn the foundational poses and stretches, and explore short reads on mindful movement.
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
              Daily flows. A lifetime of health.
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              You don't need a hundred exercises — you need a handful of high-quality moves, practiced with attention.
              Explore the video library below, learn the postures, and feel the difference.
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
              Library
            </span>
            <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold">
              Foundational poses & stretches
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
              <DialogHeader className="relative sticky top-0 z-10 bg-onyx-50/95 backdrop-blur border-b border-border/60 px-4 sm:px-6 pb-4 pt-[calc(16px+env(safe-area-inset-top,0px))] sm:pt-4 text-left">
                <DialogTitle className="font-display text-xl md:text-2xl font-bold">
                  Yoga & Stretching Library
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Every video, one place. Tap any video for the full guide.
                </DialogDescription>
                <DialogCloseX className="absolute right-3 top-[calc(18px+env(safe-area-inset-top,0px))] sm:top-1/2 sm:-translate-y-1/2" />
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
          {poses.slice(0, 10).map((p) => (
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

                <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-2xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 pt-[env(safe-area-inset-top,0px)] sm:pt-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
                  <DialogCloseX className="absolute right-3 top-[calc(12px+env(safe-area-inset-top,0px))] sm:top-3 z-50" />
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
