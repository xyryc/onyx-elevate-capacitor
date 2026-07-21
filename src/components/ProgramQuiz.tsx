import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { programs, type Program, type ProgramCategory } from "@/data/programs";

type Q = {
  id: string;
  title: string;
  subtitle: string;
  options: { label: string; value: string; hint?: string }[];
};

const QUESTIONS: Q[] = [
  {
    id: "goal",
    title: "What's your #1 goal right now?",
    subtitle: "Pick the one that excites you most. We'll build around it.",
    options: [
      { label: "Build muscle & size", value: "hypertrophy", hint: "Hypertrophy focused" },
      {
        label: "Get strong (squat / bench / deadlift)",
        value: "powerlifting",
        hint: "Powerlifting",
      },
      { label: "Lose fat & lean out", value: "fatloss", hint: "Body recomp" },
      { label: "Run faster / go longer", value: "running", hint: "Running & endurance" },
      { label: "Hyrox / CrossFit / conditioning", value: "conditioning", hint: "Mixed engine" },
      { label: "Look stage-ready (bodybuilding)", value: "bodybuilding", hint: "Physique" },
      { label: "I'm new - just want to start", value: "beginner", hint: "Foundations" },
    ],
  },
  {
    id: "level",
    title: "How experienced are you?",
    subtitle: "Honest answers get better recommendations.",
    options: [
      { label: "Brand new (0 - 6 months)", value: "new" },
      { label: "Some experience (6 - 24 months)", value: "intermediate" },
      { label: "Advanced (2+ years consistent)", value: "advanced" },
    ],
  },
  {
    id: "days",
    title: "How many days a week can you realistically train?",
    subtitle: "Be honest - consistency beats ambition.",
    options: [
      { label: "2 - 3 days", value: "low" },
      { label: "4 days", value: "mid" },
      { label: "5 - 6 days", value: "high" },
    ],
  },
  {
    id: "equipment",
    title: "Where will you train?",
    subtitle: "We'll match equipment to your reality.",
    options: [
      { label: "Full commercial gym", value: "gym" },
      { label: "Home gym (barbell + rack)", value: "homegym" },
      { label: "Minimal equipment / bodyweight", value: "home" },
      { label: "CrossFit box / Hyrox setup", value: "box" },
      { label: "Outdoors / road / track", value: "outdoor" },
    ],
  },
  {
    id: "focus",
    title: "Which area do you want to prioritize?",
    subtitle: "Pick what matters most for the next block - we'll bias the plan toward it.",
    options: [
      { label: "Upper body (chest, back, arms, shoulders)", value: "upper" },
      { label: "Lower body & glutes", value: "lower" },
      { label: "Full body - balanced development", value: "full" },
      { label: "Core, posture & midline", value: "core" },
      { label: "Cardio engine & endurance", value: "engine" },
      { label: "Women 40+ - joint-friendly programming", value: "women40" },
      { label: "Postpartum recomp & rebuild", value: "postpartum" },
    ],
  },
  {
    id: "time",
    title: "How long can each session be?",
    subtitle: "Quality > length. Both work.",
    options: [
      { label: "30 - 45 min", value: "short" },
      { label: "45 - 75 min", value: "mid" },
      { label: "75 - 120 min", value: "long" },
    ],
  },
  {
    id: "commitment",
    title: "How committed are you to the next 8 - 12 weeks?",
    subtitle: "This sets your expectation - and ours.",
    options: [
      { label: "All-in. I'll follow it day by day.", value: "all" },
      { label: "Pretty solid - life happens though.", value: "solid" },
      { label: "I need flexibility & optional days.", value: "flex" },
    ],
  },
];

type NutritionRec = { slug: string; title: string; why: string };

type ScoredProgram = { program: Program; score: number; reasons: string[] };

function goalToCategories(goal: string): ProgramCategory[] {
  switch (goal) {
    case "hypertrophy":
      return ["Hypertrophy", "Bodybuilding"];
    case "powerlifting":
      return ["Powerlifting", "Strength"];
    case "fatloss":
      return ["Fat Loss"];
    case "running":
      return ["Endurance"];
    case "conditioning":
      return ["Hyrox"];
    case "bodybuilding":
      return ["Bodybuilding", "Hypertrophy"];
    case "beginner":
      return ["Beginner"];
    default:
      return [];
  }
}

function focusToCategories(focus: string): ProgramCategory[] {
  switch (focus) {
    case "women40":
    case "postpartum":
      return ["Women"];
    case "lower":
      return ["Women", "Bodybuilding", "Powerlifting"];
    case "upper":
      return ["Bodybuilding", "Hypertrophy"];
    case "core":
      return ["Beginner", "Women"];
    case "engine":
      return ["Endurance", "Hyrox"];
    case "full":
      return ["Strength", "Hypertrophy", "Beginner"];
    default:
      return [];
  }
}

function equipmentToCategories(eq: string): ProgramCategory[] {
  switch (eq) {
    case "home":
    case "homegym":
      return ["Home Training"];
    case "box":
      return ["Hyrox"];
    case "outdoor":
      return ["Endurance"];
    default:
      return [];
  }
}

function levelMatch(a: string, programLevel: Program["level"]): boolean {
  if (a === "new") return programLevel === "Beginner";
  if (a === "intermediate") return programLevel === "Beginner" || programLevel === "Intermediate";
  if (a === "advanced") return programLevel === "Intermediate" || programLevel === "Advanced";
  return true;
}

function daysMatch(a: string, dpw: number): boolean {
  if (a === "low") return dpw <= 3;
  if (a === "mid") return dpw === 3 || dpw === 4 || dpw === 5;
  if (a === "high") return dpw >= 5;
  return true;
}

function scoreAllPrograms(a: Record<string, string>): ScoredProgram[] {
  const goalCats = new Set(goalToCategories(a.goal));
  const focusCats = new Set(focusToCategories(a.focus));
  const eqCats = new Set(equipmentToCategories(a.equipment));

  return programs
    .map<ScoredProgram>((p) => {
      let score = 0;
      const reasons: string[] = [];

      if (goalCats.has(p.category)) {
        score += 5;
        reasons.push(`Matches your goal (${p.category})`);
      }
      if (focusCats.has(p.category)) {
        score += 3;
        reasons.push(`Fits your focus area`);
      }
      if (eqCats.has(p.category)) {
        score += 4;
        reasons.push(`Works with your setup`);
      }

      // Equipment strong constraints
      if ((a.equipment === "home" || a.equipment === "homegym") && p.category !== "Home Training") {
        score -= 2;
      }
      if (a.equipment === "outdoor" && p.category !== "Endurance") score -= 2;
      if (a.equipment === "box" && p.category !== "Hyrox") score -= 1;

      if (levelMatch(a.level, p.level)) {
        score += 2;
      } else {
        score -= 2;
      }

      if (daysMatch(a.days, p.daysPerWeek)) {
        score += 2;
        reasons.push(`${p.daysPerWeek} days/week fits your schedule`);
      } else {
        score -= 1;
      }

      // Beginner boosts
      if ((a.goal === "beginner" || a.level === "new") && p.category === "Beginner") {
        score += 3;
      }

      // Women focus overrides
      if ((a.focus === "women40" || a.focus === "postpartum") && p.category !== "Women") {
        score -= 3;
      }

      // Free samplers always deserve to appear if the category is in the mix
      const relevantCats = new Set<ProgramCategory>([...goalCats, ...focusCats, ...eqCats]);
      if (p.isFree && relevantCats.has(p.category)) {
        score += 2;
      }

      return { program: p, score, reasons };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
}

function recommendNutrition(a: Record<string, string>): NutritionRec {
  const goal = a.goal;
  const focus = a.focus;

  if (goal === "fatloss" || goal === "running" || focus === "engine") {
    return {
      slug: "lean-cut-8-week",
      title: "Onyx Lean Cut · 8 Week Meal Plan",
      why: "Aggressive but sustainable deficit - keeps strength while the bodyfat drops.",
    };
  }
  if (goal === "powerlifting" || (goal === "hypertrophy" && a.level === "advanced")) {
    return {
      slug: "mass-bulk-8-week",
      title: "Onyx Mass Bulk · 8 Week Meal Plan",
      why: "Calorie-dense, performance-first nutrition to support heavy lifts and serious growth.",
    };
  }
  return {
    slug: "lean-muscle-8-week",
    title: "Onyx Lean Muscle · 8 Week Meal Plan",
    why: "Slight surplus, high protein - builds quality muscle without the fat gain.",
  };
}

export function ProgramQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];
  const progress = ((step + (done ? 1 : 0)) / QUESTIONS.length) * 100;

  function pick(v: string) {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setTimeout(() => setStep(step + 1), 180);
    } else {
      setTimeout(() => setDone(true), 180);
    }
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  if (done) {
    const scored = scoreAllPrograms(answers);
    const top = scored[0];
    const rest = scored.slice(1);
    const freeMatches = rest.filter((s) => s.program.isFree === true).slice(0, 2);
    const paidMatches = rest.filter((s) => s.program.isFree !== true).slice(0, 3);
    const shownCount = (top ? 1 : 0) + freeMatches.length + paidMatches.length;
    const nutrition = recommendNutrition(answers);
    return (
      <div className="relative min-h-screen bg-onyx-50">
        <Link
          to="/"
          className="fixed right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-50 grid h-10 w-10 place-items-center rounded-full bg-onyx-950/80 text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-onyx-950/95 transition-colors focus:outline-none focus:ring-2 focus:ring-electric shadow-lg"
          aria-label="Close quiz"
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="container-onyx py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Your matches
              </span>
              <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-tight">
                We built these for you<span className="text-electric">.</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Your top {shownCount} recommendations based on your answers. Browse every program
                for more.
              </p>
            </div>

            {top && (
              <Link
                to="/programs/$slug"
                params={{ slug: top.program.slug }}
                className="mt-8 group block overflow-hidden rounded-2xl border border-electric/40 bg-onyx-100 text-left shadow-electric transition-all hover:border-electric hover:bg-onyx-200"
              >
                <div className="relative aspect-[21/9] overflow-hidden">
                  <img
                    src={top.program.image}
                    alt={top.program.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-100 via-onyx-100/40 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-md bg-electric px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-onyx-50 shadow-lg">
                    Top match
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="font-display text-xl md:text-2xl font-bold leading-tight group-hover:text-electric">
                    {top.program.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {top.program.tagline}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-border bg-onyx-50 px-2 py-0.5">
                      {top.program.category}
                    </span>
                    <span className="rounded-full border border-border bg-onyx-50 px-2 py-0.5">
                      {top.program.level}
                    </span>
                    <span className="rounded-full border border-border bg-onyx-50 px-2 py-0.5">
                      {top.program.duration}
                    </span>
                    <span className="rounded-full border border-border bg-onyx-50 px-2 py-0.5">
                      {top.program.daysPerWeek}x / week
                    </span>
                    {top.program.isFree ? (
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-semibold">
                        Free
                      </span>
                    ) : (
                      <span className="rounded-full border border-electric/40 bg-electric/10 px-2 py-0.5 text-electric font-semibold">
                        {top.program.price}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-electric group-hover:underline">
                    Open program <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            )}

            {freeMatches.length > 0 && (
              <div className="mt-10">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-bold">Free plans to start today</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                    {freeMatches.length} free
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {freeMatches.map(({ program }) => (
                    <Link
                      key={program.slug}
                      to="/programs/$slug"
                      params={{ slug: program.slug }}
                      className="group overflow-hidden rounded-xl border border-emerald-500/30 bg-onyx-100 text-left transition-all hover:border-emerald-400 hover:bg-onyx-200"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 rounded-md bg-emerald-500 text-onyx-50 text-[10px] uppercase tracking-wider px-2 py-1 font-bold shadow-lg">
                          Free · {program.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{program.level}</span>
                          <span>{program.daysPerWeek}x/wk</span>
                        </div>
                        <h4 className="mt-1 font-display text-base font-bold leading-tight group-hover:text-electric">
                          {program.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {program.tagline}
                        </p>
                        <div className="mt-2 text-xs text-electric font-semibold">Start free →</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {paidMatches.length > 0 && (
              <div className="mt-10">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-bold">Full programs matched to you</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                    {paidMatches.length} programs
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {paidMatches.map(({ program }) => (
                    <Link
                      key={program.slug}
                      to="/programs/$slug"
                      params={{ slug: program.slug }}
                      className="group overflow-hidden rounded-xl border border-border bg-onyx-100 text-left transition-all hover:border-electric hover:bg-onyx-200"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 rounded-md bg-electric text-onyx-50 text-[10px] uppercase tracking-wider px-2 py-1 font-bold shadow-lg">
                          {program.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {program.level} · {program.daysPerWeek}x/wk
                          </span>
                          <span>{program.duration}</span>
                        </div>
                        <h4 className="mt-1 font-display text-base font-bold leading-tight group-hover:text-electric">
                          {program.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {program.tagline}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-electric font-semibold">
                            {program.price ?? "Premium"} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 rounded-2xl border border-border bg-onyx-100 p-6 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                Pair it with nutrition
              </p>
              <h4 className="mt-2 font-display text-xl font-bold leading-tight">
                {nutrition.title}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">{nutrition.why}</p>
              <Link
                to="/meal-plans/$slug"
                params={{ slug: nutrition.slug }}
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-electric/50 bg-electric/10 px-5 py-3 text-sm font-bold text-electric hover:bg-electric hover:text-onyx-50 transition-all"
              >
                See meal plan →
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              <button
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                  setDone(false);
                }}
                className="inline-flex items-center rounded-md border border-border bg-onyx-100 px-5 py-3 font-semibold hover:bg-onyx-200"
              >
                Retake quiz
              </button>
              <Link to="/programs" className="text-electric font-semibold hover:underline">
                Browse every program →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-onyx-50">
      <Link
        to="/"
        className="fixed right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-50 grid h-10 w-10 place-items-center rounded-full bg-onyx-950/80 text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-onyx-950/95 transition-colors focus:outline-none focus:ring-2 focus:ring-electric shadow-lg"
        aria-label="Close quiz"
      >
        <X className="h-5 w-5" />
      </Link>
      <div className="container-onyx py-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="text-electric font-semibold hover:underline">
              ← Back home
            </Link>
            <span>
              Question {step + 1} of {QUESTIONS.length}
            </span>
          </div>

          <div className="mt-4 h-1 w-full rounded-full bg-onyx-200 overflow-hidden">
            <div
              className="h-full bg-electric transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{q.title}</h1>
            <p className="mt-2 text-muted-foreground">{q.subtitle}</p>

            <div className="mt-8 grid gap-3">
              {q.options.map((o) => {
                const active = answers[q.id] === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => pick(o.value)}
                    className={`group flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-all ${active ? "border-electric bg-electric/10" : "border-border bg-onyx-100 hover:border-electric/60 hover:bg-onyx-200"}`}
                  >
                    <div>
                      <div className="font-semibold">{o.label}</div>
                      {o.hint && (
                        <div className="text-xs text-muted-foreground mt-0.5">{o.hint}</div>
                      )}
                    </div>
                    <svg
                      className="h-5 w-5 text-muted-foreground transition-all group-hover:text-electric group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>

            {step > 0 && (
              <button
                onClick={back}
                className="mt-8 text-sm text-muted-foreground hover:text-foreground"
              >
                ← Previous question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
