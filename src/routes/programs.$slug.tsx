import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getProgram, warmupByCategory, type Program, type WarmupBlock, type WarmupStep, type WorkoutDay } from "@/data/programs";
import { useT } from "@/i18n/LanguageProvider";
import {
  WorkoutCard,
  expandWeekToSevenDays,
} from "@/components/ProgramWorkouts";
import {
  GluteProgressionTimeline,
  hasProgressionTimeline,
} from "@/components/GluteProgressionTimeline";
import { useCheckout } from "@/hooks/useCheckout";
import { useAccess } from "@/hooks/useAccess";
import { WorkoutsByWeek, inferWeekCount, buildDayKeys } from "@/components/WorkoutsByWeek";

import { usePrice, useStripePriceId } from "@/lib/pricing";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareToChatButton } from "@/components/ShareToChatButton";

import { ReviewsSection } from "@/components/ReviewsSection";
import { ProgramStats } from "@/components/ProgramStats";
import { ProgressTracker } from "@/components/ProgressTracker";
import { MobileCollapse } from "@/components/MobileCollapse";
import { GlossaryText } from "@/components/GlossaryText";
import { MembershipModal } from "@/components/MembershipModal";
import { ShimmerButton } from "@/components/ShimmerButton";


function ProgramNotFound() {
  const t = useT();
  return (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-3xl font-bold">{t("Program not found")}</h1>
      <Link to="/programs" className="mt-6 inline-block text-electric font-semibold">← {t("Back to programs")}</Link>
    </div>
  );
}

function ProgramError({ error, reset }: { error: Error; reset: () => void }) {
  const t = useT();
  return (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">{t("Couldn't load this program.")}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">{t("Try again")}</button>
    </div>
  );
}

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }): { program: Program } => {
    const program = getProgram(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.program;
    if (!p) return {};
    const title = `${p.title} | Onyx Programs`;
    return {
      meta: [
        { title },
        { name: "description", content: p.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: p.tagline },
        { property: "og:image", content: p.image },
      ],
      links: [{ rel: "preload", as: "image" as const, href: p.image }],
    };
  },
  notFoundComponent: ProgramNotFound,
  errorComponent: ProgramError,
  component: ProgramDetail,
});

function ProgramDetail() {
  const { program: p } = Route.useLoaderData() as { program: Program };
  const t = useT();
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/programs" });
    }
  };
  const isBeginner = p.level === "Beginner";
  // For beginner programs, wrap prose in a tap-to-define glossary; other levels render plain text.
  const Prose = ({ children, className }: { children: string; className?: string }) =>
    isBeginner ? <GlossaryText className={className}>{children}</GlossaryText> : <span className={className}>{children}</span>;

  const sections = [
    { id: "overview", label: t("program.workoutSummary") },
    { id: "warmup", label: t("Warm-up Protocol") },
    { id: "nutrition", label: t("program.nutrition") },
    { id: "supplementation", label: t("program.supplementation") },
    { id: "recovery", label: t("program.recovery") },
    { id: "training", label: t("program.trainingOverview") },
    { id: "progression", label: t("program.progression") },
    { id: "schedule", label: t("program.weeklySchedule") },
    { id: "workouts", label: t("program.workouts") },
    { id: "faq", label: t("program.faq") },
  ];

  const warmup: WarmupBlock = p.warmup ?? warmupByCategory[p.category];

  return (
    <div>
      {/* Breadcrumb — desktop only (mobile opens fullscreen like a modal) */}
      <div className="container-onyx pt-8 hidden md:block">
        <nav className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-foreground">{t("Home")}</Link>
          <span className="text-border">/</span>
          <Link to="/programs" className="hover:text-foreground">{t("Programs")}</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">{t(p.category)}</span>
        </nav>
      </div>

      {/* Hero — image on top, content below (matches recipe-card modal) */}
      <section className="md:container-onyx md:pt-4 md:pb-10">
        <div className="md:surface-card md:rounded-2xl overflow-hidden md:glow-ring">
          <div className="relative aspect-[16/9] md:aspect-[21/9] bg-onyx-200">
            <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} loading="eager" decoding="sync" fetchPriority="high" />
            {/* Floating back button — top-left on every screen */}
            <button
              type="button"
              onClick={goBack}
              className="absolute top-4 left-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-onyx-950/70 text-white backdrop-blur border border-white/10 shadow-lg hover:bg-onyx-950/90 transition"
              aria-label={t("Go back to previous page")}
            >
              ←
            </button>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50 to-transparent" />
          </div>

          <div className="p-6 md:p-10">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
                <span className="px-2 py-1 rounded-md bg-electric text-onyx-50 font-bold">{p.category}</span>
                <span className="px-2 py-1 rounded-md bg-onyx-100 border border-border text-muted-foreground">{p.duration}</span>
                <span className="px-2 py-1 rounded-md bg-onyx-100 border border-border text-muted-foreground">{p.daysPerWeek} {t("programs.daysFull")}</span>
                <span className="px-2 py-1 rounded-md bg-onyx-100 border border-border text-muted-foreground">{p.level}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05]">{p.title}</h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl"><Prose>{p.tagline}</Prose></p>
              <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/training/$slug"
                  params={{ slug: p.slug }}
                  className="inline-flex items-center gap-2 rounded-md bg-electric px-5 md:px-6 py-3 text-sm md:text-base font-bold text-onyx-50 hover:bg-electric-glow transition-all shadow-[0_0_24px_rgba(0,180,255,0.35)]"
                >
                  + Add to my workout
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </Link>
                <a
                  href="#workouts"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-onyx-100 px-4 py-3 text-sm font-semibold hover:border-electric/60 hover:text-electric transition-all"
                >
                  See the workouts
                </a>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Adds the plan to <span className="text-electric font-semibold">My Library</span> so you can check off each day as you train.</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label={t("program.goal")} value={p.goal} />
          <Stat label={t("program.duration")} value={p.duration} />
          <Stat label={t("program.frequency")} value={`${p.daysPerWeek} ${t("programs.daysFull")}`} />
          <Stat label={t("program.level")} value={p.level} />
        </div>

        {/* Live program stats + save */}
        <div className="mt-4 space-y-3">
          <ProgramStats slug={p.slug} />
          <div className="flex justify-end gap-2">
            <ShareToChatButton
              variant="outline"
              size="sm"
              target={{
                url: `/programs/${p.slug}`,
                title: p.title,
                subtitle: `${p.duration} · ${p.category}`,
                image: p.image,
                kind: "program",
              }}
            />
            <FavoriteButton type="program" slug={p.slug} />
          </div>

        </div>


        {/* Mobile purchase card (sidebar shows it on desktop) */}
        <div className="lg:hidden mt-6">
          <PurchaseCard p={p} />
        </div>
      </section>



      <div className="container-onyx grid lg:grid-cols-[260px_1fr] gap-10 pb-24">
        {/* TOC + purchase */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <PurchaseCard p={p} />
            <div className="surface-card rounded-xl p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-3">{t("program.onThisPage")}</p>
              <ul className="space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-muted-foreground hover:text-electric transition-colors">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>


        {/* Body */}
        <div className="min-w-0 space-y-14">
          <Section id="overview" eyebrow={t("program.workoutSummary")} title={p.title}>
            <p className="text-base md:text-lg text-foreground/85 leading-relaxed"><Prose>{p.summary}</Prose></p>
            <div className="mt-6 grid md:grid-cols-2 gap-5">
              <Panel title={t("program.whoFor")}>
                <ul className="space-y-2">
                  {p.whoItsFor.map((x) => <Bullet key={x}>{x}</Bullet>)}
                </ul>
              </Panel>
              <Panel title={t("program.whatYouGet")}>
                <ul className="space-y-2">
                  {p.whatYouGet.map((x) => <Bullet key={x}>{x}</Bullet>)}
                </ul>
              </Panel>
            </div>
          </Section>

          <Section id="warmup" eyebrow="Pre-session protocol" title="Warm-up · do this before every workout">
            <MobileCollapse
              eyebrow="Warm-up protocol"
              title="Do this before every workout"
              subtitle="3-stage warm-up + non-negotiable rules"
            >
              <p className="text-foreground/85 leading-relaxed">{warmup.intro}</p>
              <div className="mt-6 grid lg:grid-cols-3 gap-4">
                <WarmupColumn title="1 · General prep" subtitle="Raise temperature" steps={warmup.generalPrep} />
                <WarmupColumn title="2 · Specific prep" subtitle="Rehearse the lift" steps={warmup.specificPrep} />
                <WarmupColumn title="3 · Activation" subtitle="Fire the prime movers" steps={warmup.activation} />
              </div>
              <div className="mt-5 surface-card rounded-xl p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-3">Non-negotiable rules</p>
                <ul className="space-y-2">
                  {warmup.rules.map((r) => (
                    <li key={r} className="flex gap-2.5 text-sm text-foreground/85">
                      <svg className="h-4 w-4 text-electric shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MobileCollapse>
          </Section>

          <Section id="nutrition" eyebrow={t("program.nutrition")} title={`${t("program.nutrition")} · ${p.category}`}>

            <p className="text-foreground/85 leading-relaxed"><Prose>{p.nutrition}</Prose></p>
          </Section>

          <Section id="supplementation" eyebrow={t("program.supplementation")} title={t("program.supplementation")}>
            <p className="text-foreground/85 leading-relaxed"><Prose>{p.supplementation}</Prose></p>
          </Section>

          <Section id="recovery" eyebrow={t("program.recovery")} title={t("program.recovery")}>
            <p className="text-foreground/85 leading-relaxed"><Prose>{p.recovery}</Prose></p>
          </Section>

          <Section id="training" eyebrow={t("program.trainingOverview")} title={t("program.trainingOverview")}>
            <p className="text-foreground/85 leading-relaxed"><Prose>{p.trainingOverview}</Prose></p>
          </Section>

          <Section id="progression" eyebrow={`${p.duration} · ${t("program.progression")}`} title={t("program.progression")}>
            <p className="text-foreground/85 leading-relaxed"><Prose>{p.progression}</Prose></p>
            {hasProgressionTimeline(p.slug) && <GluteProgressionTimeline slug={p.slug} />}
          </Section>


          <Section id="schedule" eyebrow={t("program.weeklySchedule")} title={t("program.weeklySchedule")}>
            <details className="group surface-card rounded-2xl border border-electric/20 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer gap-4 p-5 md:p-6 hover:bg-onyx-100/30 transition-colors">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("Weekly schedule")}</p>
                  <h3 className="mt-1.5 font-display text-lg md:text-xl font-bold">{t("Your 7-day training split")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("Tap to see which day trains what")}</p>
                </div>
                <svg className="h-6 w-6 text-electric shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <ul className="divide-y divide-border border-t border-border">
                {p.weeklySchedule.map((d, i) => {
                  const isRest = /^rest$/i.test(d.session.trim());
                  const isLightRest = /rest\s*\/\s*walk|optional|walk|mobility/i.test(d.session);
                  const display = isRest
                      ? t("Rest · optional 20-30 min walk or light mobility")
                    : isLightRest
                      ? `${t(d.session)} · ${t("keep it easy (Zone 1, nasal-breath pace)")}`
                      : t(d.session);
                  return (
                    <li key={`${d.day}-${i}`} className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3.5">
                      <span className="text-xs uppercase tracking-wider text-electric font-semibold">{t(d.day)}</span>
                      <span className="text-sm">{display}</span>
                    </li>
                  );
                })}
              </ul>
            </details>
          </Section>



          {p.category === "Endurance" && (
            <section className="surface-card rounded-2xl p-6 md:p-8 border border-electric/20">
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Heart rate zones</p>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">How to read your zones</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Every endurance session is built around heart-rate zones so you train the right system on the right day. Use a watch, chest strap, or the talk-test to stay in the target band.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { z: "Zone 1", label: "Recovery / Warm-up", feel: "Very easy. You can sing while moving.", hr: "~50-60% max HR", use: "Warm-ups, cool-downs, recovery days." },
                  { z: "Zone 2", label: "Aerobic Base", feel: "Conversational pace. Nasal breathing possible.", hr: "~60-70% max HR", use: "Easy runs, long runs, base-building." },
                  { z: "Zone 3", label: "Tempo", feel: "Comfortably hard. Short sentences only.", hr: "~70-80% max HR", use: "Steady-state tempo, progressive runs." },
                  { z: "Zone 4", label: "Threshold", feel: "Hard. Only a few words at a time.", hr: "~80-90% max HR", use: "Intervals, lactate-threshold work." },
                  { z: "Zone 5", label: "VO2 Max", feel: "Maximum effort. Talking is impossible.", hr: "~90-100% max HR", use: "Sprints, short intervals, race finish." },
                ].map((zone) => (
                  <div key={zone.z} className="rounded-xl bg-onyx-100/50 p-4 border border-border">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-bold">{zone.z}</div>
                    <div className="mt-1 font-display text-sm font-bold">{zone.label}</div>
                    <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="text-foreground/90 font-medium">Feel:</span> {zone.feel}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      <span className="text-foreground/90 font-medium">HR:</span> {zone.hr}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      <span className="text-foreground/90 font-medium">Use:</span> {zone.use}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                <span className="text-electric font-semibold">Tip:</span> Estimate your max heart rate with 220 minus your age, then match the percentages above. Adjust by feel - the talk-test never lies.
              </p>
            </section>
          )}

          <Section id="workouts" eyebrow={t("program.workouts")} title={p.title}>
            <div className="mb-5">
              <ProgressTracker
                slug={p.slug}
                dayKeys={buildDayKeys(p)}
                weekCount={inferWeekCount(p)}
              />
            </div>

            {/* Weekly prep tips - click to expand */}
            <div className="mb-8">
              <details className="group surface-card rounded-2xl border border-electric/20 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer gap-4 p-6 hover:bg-onyx-100/30 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">Prep tips for the week</p>
                    <h3 className="mt-1.5 font-display text-xl md:text-2xl font-bold">Win the day before you step in the gym</h3>
                    <p className="mt-1 text-sm text-muted-foreground">8 quick habits that make every session count</p>
                  </div>
                  <svg className="h-6 w-6 text-electric shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </summary>
                <div className="px-6 pb-6 pt-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PREP_TIPS.map((tip) => (
                    <div key={tip.title} className="rounded-xl bg-onyx-100/50 p-4 border border-border">
                      <div className="font-display text-sm font-bold">{tip.title}</div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{tip.body}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>


            <WorkoutsByWeek p={p} />
          </Section>

          <Section id="reviews" eyebrow="Reviews & Ratings" title="What athletes are saying">
            <ReviewsSection slug={p.slug} />
          </Section>

          <Section id="faq" eyebrow={t("program.faq")} title={t("program.faq")}>
            <div className="space-y-3">
              {p.faqs.map((f) => (
                <details key={f.question} className="group surface-card rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer gap-4">
                    <h3 className="font-display font-semibold text-base">{f.question}</h3>
                    <svg className="h-5 w-5 text-electric shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </summary>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </Section>


          {/* Cross promo */}
          <section className="surface-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.7_0.22_240/0.25),_transparent_60%)]" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{t("program.cross.eyebrow")}</p>
                <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold">{t("program.cross.title")}</h3>
                <p className="mt-2 text-muted-foreground">{t("program.cross.desc")}</p>
              </div>
              <Link to="/app" className="inline-flex items-center justify-center rounded-md bg-electric px-5 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-colors">{t("cta.getApp")}</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}




function PurchaseCard({ p }: { p: Program }) {
  const isFree = !!p.isFree;
  return <PurchaseCardInner p={p} isFree={isFree} />;
}

function PurchaseCardInner({ p, isFree }: { p: Program; isFree: boolean }) {
  const t = useT();
  const access = useAccess();
  const unlocked = access.hasProgram(p.slug);
  const bundle = access.hasBundle || access.hasSubscription;
  const { loading: _loading } = useCheckout();
  void _loading;


  if (unlocked || bundle) {
    return (
      <div className="surface-card rounded-xl p-5 border border-electric/40">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-electric">✓ {bundle ? t("purchase.allAccess") : t("purchase.unlocked")}</p>
        <p className="mt-3 font-display text-2xl font-bold">{t("purchase.fullUnlocked")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("purchase.fullUnlockedDesc")}</p>
      </div>
    );
  }

  return (
    <div className={`surface-card rounded-xl p-5 ${isFree ? "" : "glow-ring"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-electric">
          {isFree ? t("purchase.freeSample") : t("purchase.fullProgram")}
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${isFree ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30" : "bg-electric/15 text-electric border border-electric/30"}`}>
          {isFree ? t("purchase.free") : t("purchase.premium")}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">
        {isFree ? t("purchase.free") : t("Become a member")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {isFree ? t("purchase.freeDesc") : t("purchase.subDesc")}
      </p>

      {p.includes && p.includes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {p.includes.map((x: string) => (
            <li key={x} className="flex gap-2 text-xs text-foreground/85">
              <svg className="h-4 w-4 text-electric shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      )}
      {!isFree && (
        <MembershipModal
          trigger={
            <ShimmerButton className="mt-5 w-full">
              {t("Become a member")}
            </ShimmerButton>
          }
        />
      )}

    </div>
  );
}
function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card rounded-xl p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-3">{title}</p>
      {children}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-sm text-foreground/85">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function WarmupColumn({ title, subtitle, steps }: { title: string; subtitle: string; steps: WarmupStep[] }) {
  return (
    <div className="surface-card rounded-xl p-5 h-full">
      <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      <ul className="mt-4 space-y-3">
        {steps.map((s) => (
          <li key={s.name} className="border-l-2 border-electric/40 pl-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-semibold text-sm">{s.name}</p>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{s.duration}</span>
            </div>
            <p className="text-xs text-foreground/75 mt-1 leading-relaxed">{s.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display font-bold text-base md:text-lg">{value}</p>
    </div>
  );
}


const PREP_TIPS = [
  { title: "Pack your bag the night before", body: "Shaker, belt, straps, sleeves, headphones. Zero friction in the morning = zero excuses." },
  { title: "Eat 60-90 min before lifting", body: "Slow carb + lean protein (oats + whey, rice + chicken). Fuels heavy work without sitting heavy in the stomach." },
  { title: "Hydrate early", body: "500 ml water + a pinch of salt 30 min before training. Cramping and brain-fog usually = dehydration, not weakness." },
  { title: "Warm-up is non-negotiable", body: "Run the full 3-stage protocol above. Skipping it is the fastest way to leave 10% on the platform." },
  { title: "Log every set", body: "Weight, reps, RPE. If you don't track it, you can't progress it. Use the Onyx app or a notebook, just log." },
  { title: "Cap rest with a timer", body: "Set the rest column as a timer on your watch. Drifting past rest kills intensity and stretches sessions 2x." },
  { title: "Protein within 90 min post-session", body: "0.4 g/kg bodyweight. Whey + banana works, real meal works better. Recovery starts here." },
  { title: "Plan deload weeks", body: "Every 4-6 weeks drop volume 40%. Strength is built in recovery, not in extra sets." },
];




