import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import programMuscle from "@/assets/program-muscle.jpg";
import programBeginner from "@/assets/program-beginner.jpg";
import programLower from "@/assets/program-lower.jpg";
import { WorkoutCard } from "@/components/ProgramWorkouts";
import { useAccess } from "@/hooks/useAccess";
import { useT } from "@/i18n/LanguageProvider";

type Ex = { name: string; sets: string; reps: string; rest: string };
type Day = { day: string; title: string; focus?: string; exercises: Ex[] };

const REST_STD = "90 sec";
const REST_LONG = "2-3 min";
const REST_SHORT = "60 sec";

const muscleBuildingWeek1: Day[] = [
  { day: "Day 1", title: "Upper Push", focus: "Chest · Shoulders · Triceps", exercises: [
    { name: "Barbell Bench Press", sets: "4", reps: "6-8", rest: REST_LONG },
    { name: "Incline Dumbbell Press", sets: "3", reps: "8-10", rest: REST_LONG },
    { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "8-10", rest: REST_STD },
    { name: "Cable Lateral Raise", sets: "3", reps: "12-15", rest: REST_SHORT },
    { name: "Triceps Rope Pushdown", sets: "3", reps: "12-15", rest: REST_SHORT },
  ]},
  { day: "Day 2", title: "Lower, Quad Focus", focus: "Squat pattern dominant", exercises: [
    { name: "Back Squat", sets: "4", reps: "5-7", rest: "3 min" },
    { name: "Bulgarian Split Squat", sets: "3", reps: "8/leg", rest: REST_LONG },
    { name: "Leg Press", sets: "3", reps: "10-12", rest: REST_LONG },
    { name: "Leg Extension", sets: "3", reps: "12-15", rest: REST_SHORT },
    { name: "Standing Calf Raise", sets: "4", reps: "10-12", rest: REST_SHORT },
  ]},
  { day: "Day 3", title: "Active Recovery", focus: "Zone 2 + mobility", exercises: [
    { name: "Treadmill Walking", sets: "1", reps: "30-40 min", rest: "-" },
    { name: "Stationary Cycle", sets: "1", reps: "10 min easy", rest: "-" },
  ]},
  { day: "Day 4", title: "Upper Pull", focus: "Back · Biceps", exercises: [
    { name: "Pull Up", sets: "4", reps: "AMRAP", rest: REST_LONG },
    { name: "Barbell Row", sets: "4", reps: "6-8", rest: REST_LONG },
    { name: "Seated Cable Row", sets: "3", reps: "10-12", rest: REST_STD },
    { name: "Face Pull", sets: "3", reps: "15", rest: REST_SHORT },
    { name: "Dumbbell Bicep Curl", sets: "3", reps: "10-12", rest: REST_SHORT },
  ]},
  { day: "Day 5", title: "Lower, Posterior Chain", focus: "Hinge dominant", exercises: [
    { name: "Conventional Deadlift", sets: "4", reps: "4-5", rest: "3 min" },
    { name: "Romanian Deadlift", sets: "3", reps: "8", rest: REST_LONG },
    { name: "Hip Thrust", sets: "3", reps: "10", rest: REST_LONG },
    { name: "Lying Leg Curl", sets: "3", reps: "12", rest: REST_SHORT },
    { name: "Hanging Knee Raise", sets: "3", reps: "12", rest: REST_SHORT },
  ]},
  { day: "Day 6", title: "Upper, Hypertrophy Pump", focus: "Volume + isolation", exercises: [
    { name: "Incline Dumbbell Press", sets: "4", reps: "10", rest: REST_STD },
    { name: "Chest Fly", sets: "3", reps: "12-15", rest: REST_SHORT },
    { name: "Lat Pulldown", sets: "4", reps: "10-12", rest: REST_STD },
    { name: "Dumbbell Lateral Raise", sets: "4", reps: "12", rest: REST_SHORT },
    { name: "Hammer Curl", sets: "3", reps: "12", rest: REST_SHORT },
  ]},
  { day: "Day 7", title: "Rest", focus: "Full rest or 20 min walk", exercises: [
    { name: "Treadmill Walking", sets: "1", reps: "Optional 20 min", rest: "-" },
  ]},
];

const lowerBodyWeek1: Day[] = [
  { day: "Day 1", title: "Heavy Squat Day", focus: "Strength · quad emphasis", exercises: [
    { name: "Back Squat", sets: "5", reps: "5", rest: "3 min" },
    { name: "Bulgarian Split Squat", sets: "3", reps: "8/leg", rest: REST_LONG },
    { name: "Leg Press", sets: "3", reps: "12", rest: REST_LONG },
    { name: "Standing Calf Raise", sets: "4", reps: "10", rest: REST_SHORT },
  ]},
  { day: "Day 2", title: "Upper Maintenance", focus: "Keep pressing & pulling sharp", exercises: [
    { name: "Barbell Bench Press", sets: "4", reps: "6", rest: REST_LONG },
    { name: "Pull Up", sets: "4", reps: "8", rest: REST_LONG },
    { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10", rest: REST_STD },
  ]},
  { day: "Day 3", title: "Glute / Hamstring Day", focus: "Posterior chain", exercises: [
    { name: "Romanian Deadlift", sets: "4", reps: "8", rest: REST_LONG },
    { name: "Hip Thrust", sets: "4", reps: "10", rest: REST_LONG },
    { name: "Lying Leg Curl", sets: "3", reps: "12", rest: REST_SHORT },
    { name: "Cable Pull Through", sets: "3", reps: "12", rest: REST_SHORT },
  ]},
  { day: "Day 4", title: "Active Recovery", focus: "Blood flow + mobility", exercises: [
    { name: "Incline Treadmill Walking", sets: "1", reps: "30 min", rest: "-" },
    { name: "Stationary Cycle", sets: "1", reps: "10 min easy", rest: "-" },
  ]},
  { day: "Day 5", title: "Quad Hypertrophy", focus: "Volume work", exercises: [
    { name: "Front Squat", sets: "4", reps: "6", rest: REST_LONG },
    { name: "Walking Lunge", sets: "3", reps: "10/leg", rest: REST_STD },
    { name: "Leg Extension", sets: "4", reps: "15", rest: REST_SHORT },
    { name: "Seated Calf Raise", sets: "4", reps: "12", rest: REST_SHORT },
  ]},
  { day: "Day 6", title: "Posterior Pump", focus: "Glutes & hamstrings", exercises: [
    { name: "Conventional Deadlift", sets: "3", reps: "5", rest: "3 min" },
    { name: "Barbell Hip Thrust", sets: "4", reps: "8", rest: REST_LONG },
    { name: "Seated Leg Curl", sets: "4", reps: "12", rest: REST_SHORT },
    { name: "Hanging Knee Raise", sets: "3", reps: "12", rest: REST_SHORT },
  ]},
  { day: "Day 7", title: "Rest", focus: "Full recovery", exercises: [
    { name: "Treadmill Walking", sets: "1", reps: "Optional 20 min", rest: "-" },
  ]},
];

type ProgramMeta = {
  goal: string;
  level: string;
  daysPerWeek: string;
  overview: string;
  whoFor: string[];
  whatYouGet: string[];
  progression: string;
};

function ProgramPreviewDialog({ title, subtitle, image, week1, lengthLabel, focus, totalWeeks, meta }: {
  title: string; subtitle: string; image: string; week1: Day[]; lengthLabel: string; focus: string; totalWeeks: number; meta: ProgramMeta;
}) {
  const [week, setWeek] = useState<number>(1);
  const access = useAccess();
  const unlocked = access.loading || access.hasBundle || access.hasSubscription;
  const locked = week !== 1 && !unlocked;

  return (
    <DialogContent className="block! sm:grid! left-0! top-0! translate-x-0! translate-y-0! w-full h-[100dvh] max-w-none max-h-[100dvh] rounded-none border-0 sm:left-[50%]! sm:top-[50%]! sm:translate-x-[-50%]! sm:translate-y-[-50%]! sm:w-[calc(100vw-2rem)] sm:max-w-4xl sm:h-auto sm:max-h-[92vh] sm:rounded-lg sm:border overflow-y-auto overflow-x-hidden bg-onyx-50 border-border p-0">
      {/* Hero */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] overflow-hidden rounded-t-lg">
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/70 to-onyx-50/10" />
        <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8">
          <div className="min-w-0 w-full">
            <div className="flex flex-wrap gap-1.5 text-[10px] uppercase tracking-wider">
              <span className="px-2 py-1 rounded-md bg-electric text-onyx-50 font-bold">{unlocked ? "Unlocked · Premium" : "Premium · Onyx Program"}</span>
              <span className="px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border">{lengthLabel}</span>
              <span className="px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border">{focus}</span>
              <span className="px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border">{meta.daysPerWeek}</span>
            </div>
            <DialogHeader className="space-y-1 mt-2 sm:mt-3 text-left">
              <DialogTitle className="font-display text-xl sm:text-2xl md:text-4xl font-bold leading-tight break-words">{title}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-2xl line-clamp-3 sm:line-clamp-none">{subtitle}</DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-5 sm:pt-6 space-y-6 sm:space-y-8">
        {/* Quick stats, same as program page */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Goal", value: meta.goal },
            { label: "Duration", value: lengthLabel },
            { label: "Frequency", value: meta.daysPerWeek },
            { label: "Level", value: meta.level },
          ].map((s) => (
            <div key={s.label} className="surface-card rounded-xl p-3 sm:p-4">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">{s.label}</p>
              <p className="mt-1 font-display text-sm sm:text-base font-bold leading-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Overview */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">Workout summary</p>
          <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-bold leading-tight">What this program is</h3>
          <p className="mt-2 text-sm sm:text-base text-foreground/85 leading-relaxed">{meta.overview}</p>
          <div className="mt-4 grid md:grid-cols-2 gap-3 sm:gap-4">
            <div className="surface-card rounded-xl p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-2.5">Who it's for</p>
              <ul className="space-y-2">
                {meta.whoFor.map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-foreground/85">
                    <svg className="h-4 w-4 text-electric shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card rounded-xl p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-2.5">What you get</p>
              <ul className="space-y-2">
                {meta.whatYouGet.map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-foreground/85">
                    <svg className="h-4 w-4 text-electric shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Progression */}
        <section className="surface-card rounded-xl p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{lengthLabel} · Progression</p>
          <h3 className="mt-1.5 font-display text-lg sm:text-xl font-bold leading-tight">How the weeks build on each other</h3>
          <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{meta.progression}</p>
        </section>

        {/* Warm-up */}
        <section className="surface-card rounded-xl p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-2">Warm-up · every session</p>
          <p className="text-sm text-foreground/85">5 min light cardio · 2 rounds of band pull-aparts, hip openers, scap push-ups · ramp the first big lift in 3-4 progressive sets.</p>
        </section>

        {/* Weekly schedule header */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">Weekly schedule</p>
          <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-bold leading-tight">Day-by-day breakdown</h3>
          <p className="mt-1 text-sm text-muted-foreground">{unlocked ? "Every week is included with your Onyx membership. Open the app to start training." : "Week 1 is free to preview. Unlock the rest with Onyx Pro or the All Access bundle."}</p>
        </section>

        {/* Week tabs */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((wk) => {
              const active = wk === week;
              const isFree = wk === 1;
              const badge = unlocked ? "Unlocked" : isFree ? "Free" : "🔒";
              return (
                <button
                  key={wk}
                  onClick={() => setWeek(wk)}
                  className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold transition-all ${active ? "border-electric bg-electric text-onyx-50" : "border-border bg-onyx-100/60 hover:border-electric/60"}`}
                >
                  Week {wk}
                  <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-80">{badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workout days */}
        {locked ? (
          <div className="rounded-xl border border-dashed border-electric/40 bg-onyx-100/40 p-10 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-display text-xl font-bold">Week {week} is a premium week</h4>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Unlock weeks 2-{totalWeeks} with Onyx Pro or the All Access bundle, video for every exercise, RPE targets, wave-loaded progression, streak tracking and PR logging.
            </p>
            <Link to="/app" className="mt-5 inline-flex items-center rounded-md bg-electric px-6 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow">
              Unlock in the Onyx app
            </Link>
          </div>
        ) : unlocked && week !== 1 ? (
          <div className="rounded-xl border border-electric/40 bg-onyx-100/40 p-10 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="font-display text-xl font-bold">Week {week} is unlocked</h4>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Open the Onyx app to start Week {week}, day-by-day workouts, videos and progression are all synced to your account.
            </p>
            <Link to="/app" className="mt-5 inline-flex items-center rounded-md bg-electric px-6 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow">
              Open the Onyx app
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {week1.map((d, i) => (
              <WorkoutCard
                key={d.day}
                w={d}
                dayNum={i + 1}
                dayLabel={d.day}
                optional={/Rest|Recovery/i.test(d.title)}
              />
            ))}
          </div>
        )}




        {/* CTA */}
        <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-onyx-100/60 to-onyx-50 p-6 text-center">
          <h3 className="font-display text-xl font-bold">Unlock the full program inside the Onyx app</h3>
          <p className="mt-2 text-sm text-muted-foreground">Week-by-week progressions, video for every exercise, streak tracking and PR logging.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/programs" className="inline-flex items-center rounded-md bg-electric px-5 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow">
              Browse all programs
            </Link>
            <Link to="/app" className="inline-flex items-center rounded-md border border-border bg-onyx-100/60 px-5 py-2.5 text-sm font-semibold hover:bg-onyx-200">
              Get the Onyx app
            </Link>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export function ProgramsStrip({ heading }: { heading?: string }) {
  const t = useT();
  const headingText = heading ?? t("Train this with an Onyx program");
  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{t("Onyx programs")}</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-2">{headingText}</h2>
        </div>
      </div>
      <div className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory md:mx-0 md:px-0 md:grid md:gap-5 md:grid-cols-3 md:overflow-visible scrollbar-none [&>*]:shrink-0 [&>*]:snap-start [&>*]:w-[82%] md:[&>*]:w-auto md:[&>*]:shrink">
        {/* 12 Week Muscle Building */}
        <Dialog>
          <DialogTrigger asChild>
            <article className="surface-card rounded-xl overflow-hidden group hover:border-electric/40 transition-all text-left cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={programMuscle} alt={t("12 Week Muscle Building")} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute top-2 left-2 rounded-md bg-electric text-onyx-50 text-[10px] uppercase tracking-wider px-2 py-1 font-bold shadow-lg">{t("Premium Onyx")}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{t("12 Week Muscle Building")}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t("Progressive hypertrophy plan engineered to add visible muscle.")}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric group-hover:text-electric-glow">
                  {t("See what's inside")}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </span>
              </div>
            </article>
          </DialogTrigger>
          <ProgramPreviewDialog
            title={t("12 Week Muscle Building")}
            subtitle={t("A six-day upper/lower hybrid built for steady, visible hypertrophy. Wave-loaded so weeks never repeat.")}
            image={programMuscle}
            week1={muscleBuildingWeek1}
            lengthLabel={t("12 weeks")}
            focus={t("Hypertrophy")}
            totalWeeks={12}
            meta={{
              goal: t("Build muscle"),
              level: t("Intermediate"),
              daysPerWeek: t("6 days / wk"),
              overview: t("A 12-week upper/lower hybrid split that alternates strength and pump work. You'll press, pull, squat and hinge twice per week with wave-loaded intensity so each block pushes past the last, engineered for steady, visible muscle gain without burning out."),
              whoFor: [
                t("Lifters with 6+ months of consistent training"),
                t("Anyone chasing visible size without living in the gym"),
                t("Intermediate athletes ready for structured progression"),
              ],
              whatYouGet: [
                t("12 weeks of day-by-day workouts"),
                t("Video demo for every exercise"),
                t("RPE targets, wave-loaded intensity, deload weeks"),
                t("Streak tracking + PR logging in the Onyx app"),
              ],
              progression: t("Weeks 1-4 build volume at moderate intensity. Weeks 5-8 push heavier compounds while trimming assistance volume. Weeks 9-12 peak intensity with a light deload before the final wave, so you finish stronger and bigger than you started."),
            }}
          />

        </Dialog>

        {/* Beginner Strength → /app */}
        <Link to="/app" className="surface-card rounded-xl overflow-hidden group hover:border-electric/40 transition-all block">
          <div className="aspect-[16/10] overflow-hidden">
            <img src={programBeginner} alt={t("Beginner Strength")} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg font-semibold">{t("Beginner Strength")}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("Master the big lifts with linear progression and zero guesswork.")}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric group-hover:text-electric-glow">
              {t("Download in App")}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </span>
          </div>
        </Link>

        {/* Lower Body Specialization */}
        <Dialog>
          <DialogTrigger asChild>
            <article className="surface-card rounded-xl overflow-hidden group hover:border-electric/40 transition-all text-left cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={programLower} alt={t("Lower Body Specialization")} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute top-2 left-2 rounded-md bg-electric text-onyx-50 text-[10px] uppercase tracking-wider px-2 py-1 font-bold shadow-lg">{t("Premium Onyx")}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{t("Lower Body Specialization")}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t("An 8-week block to bring up lagging legs and glutes.")}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric group-hover:text-electric-glow">
                  {t("See what's inside")}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </span>
              </div>
            </article>
          </DialogTrigger>
          <ProgramPreviewDialog
            title={t("Lower Body Specialization")}
            subtitle={t("8-week leg & glute focus with maintained upper-body work. Two pulling waves drive serious posterior development.")}
            image={programLower}
            week1={lowerBodyWeek1}
            lengthLabel={t("8 weeks")}
            focus={t("Legs & Glutes")}
            totalWeeks={8}
            meta={{
              goal: t("Grow legs & glutes"),
              level: t("Intermediate"),
              daysPerWeek: t("6 days / wk"),
              overview: t("An 8-week specialization block that puts legs and glutes at the front of every week. Squat and hinge patterns run twice on heavy days, with a dedicated glute/hamstring session and quad hypertrophy day, while upper-body work is trimmed to just enough to maintain strength."),
              whoFor: [
                t("Lifters with lagging legs or underdeveloped glutes"),
                t("Anyone chasing a stronger squat, deadlift and hip thrust"),
                t("Athletes who want serious lower-body size in 8 weeks"),
              ],
              whatYouGet: [
                t("8 weeks of leg- and glute-focused workouts"),
                t("Video demo for every exercise"),
                t("Two heavy waves for squat and posterior chain"),
                t("Progression tracking and PR logging in the app"),
              ],
              progression: t("Weeks 1-3 accumulate volume on squat and hinge patterns. Weeks 4-6 shift toward heavier top sets on the main lifts while adding intensifiers on isolation work. Weeks 7-8 peak posterior-chain strength and finish with a pump-focused hypertrophy wave."),
            }}
          />

        </Dialog>
      </div>
    </section>
  );
}
