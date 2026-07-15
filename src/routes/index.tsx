import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { CollapsibleChips } from "@/components/CollapsibleChips";
import heroImg from "@/assets/athlete-power.jpg";
import hypertrophyImg from "@/assets/hypertrophy-couple.png.asset.json";
import strengthImg from "@/assets/athlete-strength.jpg";
import coachImg from "@/assets/athlete-coach.jpg";
import conditioningImg from "@/assets/athlete-conditioning.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import ogHome from "@/assets/og-home.jpg";
import nutritionBg from "@/assets/nutrition-bg.jpg";
import { useImageOverrides } from "@/hooks/useImageOverrides";
import { ExerciseCard } from "@/components/ExerciseCard";
import { exercises, muscleGroups } from "@/data/exercises";
import { programs, type Program } from "@/data/programs";
import { ProgramsStrip } from "@/components/ProgramsStrip";
import { SupplementsCarousel } from "@/components/SupplementsCarousel";
import { coaches } from "@/data/coaches";
import { articles } from "@/data/articles";
import { MembershipModal } from "@/components/MembershipModal";
import { CoachDialog } from "@/components/CoachDialog";
import { ArticleDialog } from "@/components/ArticleDialog";
import { ShimmerButton } from "@/components/ShimmerButton";
import { useAccess } from "@/hooks/useAccess";
import { useT } from "@/i18n/LanguageProvider";
import { CompactCard } from "@/components/ProgramDialog";
import { GoalDialog } from "@/components/GoalDialog";
import { goalsBySlug } from "@/data/goals";

const SITE_URL = "https://onyx-movements-hub.lovable.app";
const OG_IMAGE = `${SITE_URL}${ogHome}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Onyx Elevate - Free Exercise Library & Programs" },
      {
        name: "description",
        content:
          "Free exercise database with step-by-step instructions, pro tips and common mistakes, plus premium strength, hypertrophy and conditioning programs.",
      },
      {
        name: "keywords",
        content:
          "exercise library, free workout database, strength training programs, hypertrophy, powerlifting coaching, fitness app",
      },
      { property: "og:title", content: "Onyx Elevate - Elite Training for Every Athlete" },
      {
        property: "og:description",
        content:
          "Free exercise library + premium programs built by competitive coaches. Strength, hypertrophy and conditioning, all in one app.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Onyx Elevate - Elite Training for Every Athlete" },
      { property: "og:site_name", content: "Onyx Elevate" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Onyx Elevate - Elite Training for Every Athlete" },
      {
        name: "twitter:description",
        content: "Free exercise library + premium programs built by competitive coaches.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      // Preload the LCP hero so it starts downloading alongside HTML.
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Onyx Elevate",
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.ico`,
          description: "Premium exercise library and elite training programs.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Onyx Elevate",
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/exercises?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          name: "Onyx Elevate App",
          operatingSystem: "iOS, Android",
          applicationCategory: "HealthApplication",
          offers: { "@type": "Offer", price: "29", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Home,
});

const goals = [
  {
    title: "Build Muscle",
    tag: "Hypertrophy",
    img: hypertrophyImg.url,
    desc: "Volume, intensity and progression engineered for visible size.",
    comingSoon: false,
    ctaTo: "/programs" as const,
    ctaLabel: "Explore hypertrophy programs",
    overview:
      "Hypertrophy is a numbers game - total weekly sets, proximity to failure, and progressive overload across 8-16 week blocks. Onyx hypertrophy plans push 10-20 hard sets per muscle group per week with planned deloads.",
    highlights: [
      "4-6 sessions per week, upper/lower or push/pull/legs splits",
      "Rep ranges 6-15 with RIR 1-3 on top sets",
      "Built-in deload every 5th week to manage fatigue",
      "Exercise swaps for every machine - train at any gym",
    ],
    bestFor:
      "Lifters wanting visible size gains in chest, back, arms and legs over a full training block.",
  },
  {
    title: "Get Strong",
    tag: "Strength",
    img: strengthImg,
    desc: "Big lifts, low reps, peaking blocks built by competitive lifters.",
    comingSoon: false,
    ctaTo: "/programs" as const,
    ctaLabel: "Explore strength programs",
    overview:
      "Strength work centers the squat, bench, deadlift and press - heavy doubles, triples and singles programmed in waves so you peak fresh on test day, not exhausted from accessory junk volume.",
    highlights: [
      "% 1RM based programming with weekly auto-regulation",
      "Compound primary lifts + targeted accessories",
      "Peaking blocks for meet day or strength PRs",
      "Form-check protocols on every main lift",
    ],
    bestFor:
      "Intermediate to advanced lifters chasing real PRs on the big three or prepping for a first meet.",
  },
  {
    title: "Conditioning",
    tag: "Endurance",
    img: conditioningImg,
    desc: "Engine-building protocols for athletes who refuse to gas out.",
    comingSoon: false,
    ctaTo: "/programs" as const,
    ctaLabel: "Explore conditioning programs",
    overview:
      "Mixed-modal conditioning that builds a real aerobic base, then layers lactate threshold and alactic power on top. Designed for hybrid athletes who still want to keep their strength.",
    highlights: [
      "Zone 2 base work paired with weekly intervals",
      "Sled, bike, row, sprint and loaded carry options",
      "Programmed alongside lifting - no interference effect",
      "Built-in heart-rate and RPE targets",
    ],
    bestFor:
      "Hybrid athletes, tactical operators and lifters who want to stop gassing out by minute three.",
  },
  {
    title: "1-on-1 Coaching",
    tag: "Coached",
    img: coachImg,
    desc: "Get programmed by an Onyx coach with weekly check-ins and form review.",
    comingSoon: true,
    ctaTo: "/app" as const,
    ctaLabel: "Join the waitlist",
    overview:
      "Fully custom programming written for you by a competitive Onyx coach. Weekly check-ins, video form review on every main lift, and unlimited messaging inside the app.",
    highlights: [
      "Custom block periodization built around your schedule",
      "Weekly written check-ins + adjustments",
      "Unlimited video form review on the big lifts",
      "Nutrition and recovery guidance included",
    ],
    bestFor: "Serious athletes who want a coach in their corner, not another template.",
  },
] as const;

const stories = [
  {
    name: "Alex M.",
    result: "+18 lbs lean mass · 14 weeks",
    quote:
      "The Onyx library taught me what every lift actually does. I stopped guessing and started growing.",
    img: testimonial1,
  },
  {
    name: "Sara K.",
    result: "405 lb deadlift · first comp",
    quote:
      "I followed the strength block and pulled a PR I didn't think was possible this year. Hooked.",
    img: testimonial2,
  },
  {
    name: "David L.",
    result: "Down 32 lbs · up 50% on lifts",
    quote:
      "Coaches who actually answer. Programming that respects my time. Onyx changed how I train.",
    img: testimonial3,
  },
];

function Home() {
  const t = useT();
  const featured = exercises.slice(0, 6);
  const { hasBundle, hasSubscription, loading: accessLoading } = useAccess();
  // While access is still resolving (fresh login, no cache yet), assume the
  // user might be a member so the "Become a member" CTA doesn't flash for
  // paid users before Supabase responds.
  const hasMembership = accessLoading || hasBundle || hasSubscription;
  const { data: imgOverrides } = useImageOverrides();
  const pick = (key: string, fallback: string) => imgOverrides?.[key] ?? fallback;
  const heroSrc = pick("home.hero", heroImg);
  const strengthSrc = pick("home.card.strength", strengthImg);
  const conditioningSrc = pick("home.card.conditioning", conditioningImg);
  const coachSrc = pick("home.card.coach", coachImg);
  const goalImg: Record<string, string> = {
    "Build Muscle": pick("home.card.hypertrophy", hypertrophyImg.url),
    "Get Strong": strengthSrc,
    Conditioning: conditioningSrc,
    "1-on-1 Coaching": coachSrc,
  };

  const popularSlugs = [
    "marathon-prep-12-week",
    "shredded-8-week-fat-loss",
    "onyx-hypertrophy-12-week",
    "raw-power-12-week-powerlifting",
  ];
  const popularPrograms = popularSlugs
    .map((slug) => programs.find((p) => p.slug === slug))
    .filter((p): p is Program => !!p);

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 700px at 85% -10%, color-mix(in oklab, var(--electric) 22%, transparent), transparent 60%), radial-gradient(900px 600px at -10% 110%, color-mix(in oklab, var(--electric) 14%, transparent), transparent 65%), var(--onyx-50)",
        }}
        aria-hidden="true"
      />
      {/* HERO */}
      <section className="relative z-10 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-y-0 right-0 w-full md:w-[55%]">
          <img
            src={heroSrc}
            alt=""
            width={1024}
            height={1280}
            // @ts-expect-error fetchpriority is valid HTML
            fetchpriority="high"
            className="h-full w-full object-cover object-center [mask-image:linear-gradient(to_left,black_30%,transparent)]"
            decoding="async"
          />
        </div>
        <div className="container-onyx relative py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-electric">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              {t("Onyx Elevate")}
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-7xl font-bold leading-[1.02] text-white">
              {t("Elite training")} <br /> {t("for")}{" "}
              <span className="text-gradient-electric">{t("every athlete.")}</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-xl">
              {t(
                "From competitive powerlifting to off-season conditioning - find the expert plan, coach and exercise breakdown that fits your goal, in minutes.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-onyx-50 transition-all hover:bg-electric-glow hover:shadow-electric"
              >
                {t("Find your program")}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              {!hasMembership && (
                <MembershipModal
                  trigger={
                    <ShimmerButton className="inline-flex items-center px-5 py-3 text-sm font-semibold">
                      {t("Become a member")}
                    </ShimmerButton>
                  }
                />
              )}
            </div>
            <Link
              to="/quiz"
              className="mt-4 inline-flex items-center gap-2 group text-sm text-muted-foreground hover:text-electric transition-colors"
            >
              <span>
                {t("Not sure where to start?")}{" "}
                <span className="underline underline-offset-4 font-semibold">
                  {t("Take the 60-second quiz →")}
                </span>
              </span>
            </Link>
            <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-md">
              {[
                { v: "500+", l: t("exercises") },
                { v: "7", l: t("Elite coaches") },
                { v: "12+", l: t("training programs") },
              ].map((s) => (
                <div key={String(s.l)} className="min-w-0">
                  <dt className="font-display text-2xl md:text-3xl font-bold text-electric">
                    {s.v}
                  </dt>
                  <dd
                    className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1 hyphens-auto break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                  >
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* TRAINING STYLE CHIPS */}
      <section className="border-b border-border/60 bg-onyx-100/40">
        <div className="container-onyx py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold text-center mb-8">
            {t("Explore by training style")}
          </p>
          <CollapsibleChips label={t("Choose a training style")}>
            {[
              { label: "All Programs", cat: undefined },
              { label: "Bodybuilding", cat: "Bodybuilding" as const },
              { label: "Powerlifting", cat: "Powerlifting" as const },
              { label: "Strength", cat: "Strength" as const },
              { label: "Hypertrophy", cat: "Hypertrophy" as const },
              { label: "Fat Loss", cat: "Fat Loss" as const },
              { label: "Endurance", cat: "Endurance" as const },
              { label: "Hybrid · Hyrox & CrossFit", cat: "Hybrid" as const },
              { label: "Home Gym", cat: "Home Training" as const },
              { label: "Glutes", cat: "Women" as const },
              { label: "Beginner", cat: "Beginner" as const },
              { label: "Yoga", href: "/yoga-mobility" as const },
            ].map((s) =>
              "href" in s ? (
                <Link
                  key={s.label}
                  to={s.href}
                  className="rounded-full border border-border bg-onyx-100 px-3 py-2 text-xs md:text-sm text-center hover:border-electric/50 hover:bg-electric/5 hover:text-electric transition-colors"
                >
                  {t(s.label)}
                </Link>
              ) : (
                <Link
                  key={s.label}
                  to="/programs"
                  search={{ cat: s.cat }}
                  className="rounded-full border border-border bg-onyx-100 px-3 py-2 text-xs md:text-sm text-center hover:border-electric/50 hover:bg-electric/5 hover:text-electric transition-colors"
                >
                  {t(s.label)}
                </Link>
              ),
            )}
          </CollapsibleChips>
        </div>
      </section>

      {/* GOALS / BROWSE BY OUTCOME */}
      <section className="container-onyx py-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("What's your goal?")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              {t("Built for the way you train.")}
            </h2>
          </div>
        </div>
        <div className="-mx-4 px-4 flex md:mx-0 md:px-0 gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-4 scrollbar-none">
          {goals.map((g) => {
            const slug = g.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            const goalData = goalsBySlug[slug];
            const card = (
              <button
                type="button"
                className="group relative aspect-[16/10] overflow-hidden rounded-xl surface-card text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric block shrink-0 snap-start w-[82%] lg:w-auto lg:shrink"
              >
                <img
                  src={goalImg[g.title] ?? g.img}
                  alt={`Athlete training for ${g.title.toLowerCase()}`}
                  width={1024}
                  height={640}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/50 to-transparent" />
                {g.comingSoon && (
                  <span className="absolute top-3 right-3 rounded-full bg-electric/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">
                    Coming soon
                  </span>
                )}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <span className="self-start rounded-full border border-electric/40 bg-onyx-50/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-electric backdrop-blur">
                    {g.tag}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold">{g.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{g.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-electric">
                    Read more
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
              </button>
            );
            if (!goalData) {
              return <div key={g.title}>{card}</div>;
            }
            return (
              <GoalDialog key={g.title} goal={{ ...goalData, img: goalImg[g.title] ?? g.img ?? goalData.img }}>
                {card}
              </GoalDialog>
            );
          })}
        </div>
      </section>

      {/* POPULAR PROGRAMS */}
      <section className="container-onyx pb-20">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("home.popularProgramsEyebrow")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              {t("home.popularProgramsTitle")}
            </h2>
          </div>
          <Link
            to="/programs"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:underline"
          >
            {t("home.browseAllPrograms")}
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="-mx-4 px-4 flex md:mx-0 md:px-0 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
          {popularPrograms.map((p) => (
            <div
              key={p.slug}
              className="snap-start shrink-0 w-[82%] md:w-auto md:flex-1 min-w-[260px]"
            >
              <CompactCard p={p} fluid />
            </div>
          ))}
        </div>
      </section>

      {/* COACHES - Onyx athletes */}
      <section className="container-onyx pb-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              Meet the Onyx coaches
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Our athletes. Your coaches.
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              From strongman platforms to boxing rings - every Onyx coach trains hard, competes (or
              grinds) every week, and brings real-world experience to your programming.
            </p>
          </div>
        </div>
        <div className="-mx-4 px-4 flex md:mx-0 md:px-0 gap-4 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-3 scrollbar-none">
          {[...coaches]
            .sort((a, b) => Number(b.competes) - Number(a.competes))
            .map((c) => (
              <CoachDialog key={c.slug} coach={c}>
                <button
                  type="button"
                  className="text-left group surface-card rounded-xl overflow-hidden hover:border-electric/40 transition-all block shrink-0 snap-start w-[78%] lg:w-auto lg:shrink"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={c.img}
                      alt={`Coach ${c.name}, ${c.role}`}
                      width={800}
                      height={1024}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${c.slug === "simen" ? "object-top" : ""}`}
                      decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-onyx-50 via-onyx-50/70 to-transparent" />
                    {c.competes && (
                      <span className="absolute top-3 left-3 rounded-full bg-electric/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">
                        Competitor
                      </span>
                    )}
                    <span className="absolute top-3 right-3 rounded-full bg-onyx-50/80 backdrop-blur px-2 py-0.5 text-[10px] uppercase tracking-wider text-electric border border-electric/30">
                      {c.tag}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-lg font-bold leading-tight">{c.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.role}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.bio}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-electric">
                      Personal training · {c.coaching.price}
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
                </button>
              </CoachDialog>
            ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="border-y border-border/60 bg-onyx-100/30">
        <div className="container-onyx py-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                {t("Trending in articles")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
                {t("Deep dives. No fluff.")}
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl">
                {t(
                  "Coach-written breakdowns on the science that actually drives results - overload, fuel, recovery and the boring stuff that wins.",
                )}
              </p>
            </div>
          </div>
          <div className="-mx-4 px-4 flex md:mx-0 md:px-0 gap-5 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-3 scrollbar-none">
            {articles
              .filter((a) => a.category !== "Big 3 · Technique")
              .map((a) => (
                <ArticleDialog key={a.slug} article={a}>
                  <button
                    type="button"
                    className="group surface-card rounded-xl overflow-hidden hover:border-electric/40 transition-all flex flex-col shrink-0 snap-start w-[82%] lg:w-auto lg:shrink text-left"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={a.img}
                        alt={a.title}
                        width={1200}
                        height={800}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        decoding="async"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-electric/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">
                        {a.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display text-lg font-bold leading-snug group-hover:text-electric transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                        {a.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{a.readTime}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-electric">
                          {t("Read article")}
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
                  </button>
                </ArticleDialog>
              ))}
          </div>
        </div>
      </section>

      {/* BIG 3 TECHNIQUE BREAKDOWNS */}
      <section className="border-b border-border/60">
        <div className="container-onyx py-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                {t("The Big 3 · Technique")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
                {t("Squat. Bench. Deadlift.")}
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl">
                {t(
                  "Millimetre-by-millimetre breakdowns of the three lifts that build every strong body. Written by the coaches who teach them.",
                )}
              </p>
            </div>
          </div>
          <div className="-mx-4 px-4 flex md:mx-0 md:px-0 gap-5 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-3 scrollbar-none">
            {articles
              .filter((a) => a.category === "Big 3 · Technique")
              .map((a) => (
                <ArticleDialog key={a.slug} article={a}>
                  <button
                    type="button"
                    className="group surface-card rounded-xl overflow-hidden hover:border-electric/40 transition-all flex flex-col shrink-0 snap-start w-[82%] lg:w-auto lg:shrink text-left"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={a.img}
                        alt={a.title}
                        width={1200}
                        height={800}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        decoding="async"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-electric/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">
                        {a.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display text-lg font-bold leading-snug group-hover:text-electric transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                        {a.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{a.readTime}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-electric">
                          {t("Read breakdown")}
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
                  </button>
                </ArticleDialog>
              ))}
          </div>
        </div>
      </section>

      {/* STORIES / TESTIMONIALS */}
      <section className="border-y border-border/60 bg-onyx-100/30">
        <div className="container-onyx py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("Athlete stories")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              {t("Real lifters. Real numbers.")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("The Onyx ecosystem turns months of training into measurable progress.")}
            </p>
          </div>
          <div className="mt-10 -mx-4 px-4 flex md:mx-0 md:px-0 gap-5 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-3 scrollbar-none">
            {stories.map((s) => (
              <figure
                key={s.name}
                className="surface-card rounded-xl p-6 flex flex-col shrink-0 snap-start w-[82%] lg:w-auto lg:shrink"
              >
                <svg className="h-6 w-6 text-electric/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h4v10H3V11c0-2.2 1.8-4 4-4zm10 0h4v10h-8V11c0-2.2 1.8-4 4-4z" />
                </svg>
                <blockquote className="mt-4 text-base leading-relaxed text-foreground/90 flex-1">
                  "{s.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                  <img
                    src={s.img}
                    alt={s.name}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                    decoding="async"
                  />
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-electric">{s.result}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* NUTRITION & SUPPLEMENTS */}
      <SupplementsCarousel />

      {/* MUSCLE GROUPS + FEATURED EXERCISES */}
      <div className="container-onyx pt-6 pb-8 md:pb-12">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
            {t("Free exercise library")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            {t("Every lift, broken down.")}
          </h2>
          <div className="-mx-4 px-4 mb-6 flex gap-2 overflow-x-auto scrollbar-none sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
            {muscleGroups.slice(0, 6).map((m) => (
              <Link
                key={m}
                to="/exercises"
                search={{ muscle: m }}
                className="shrink-0 whitespace-nowrap rounded-full border border-border bg-onyx-100 px-4 py-2 text-sm hover:border-electric/50 hover:bg-electric/5 hover:text-electric transition-colors"
              >
                {m}
              </Link>
            ))}
          </div>
          <div className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:gap-5 sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 scrollbar-none">
            {featured.map((e) => (
              <div key={e.slug} className="shrink-0 snap-start w-[82%] sm:w-auto sm:shrink">
                <ExerciseCard exercise={e} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/exercises"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-onyx-100 px-5 py-3 text-sm font-semibold hover:border-electric/50 hover:text-electric"
            >
              {t("Browse all exercises")} →
            </Link>
          </div>
        </section>

        <ProgramsStrip heading={t("Premium programs in the Onyx app")} />

        {/* FINAL CTA */}
        {!hasMembership && (
          <section className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl surface-card">
            <img
              src={conditioningSrc}
              alt=""
              width={1024}
              height={1280}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-onyx-50 via-onyx-50/80 to-onyx-50/40" />
            <div className="relative p-10 md:p-16 max-w-2xl">
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                {t("Stop guessing.")} <br />{" "}
                <span className="text-gradient-electric">{t("Start performing.")}</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t(
                  "Download the Onyx app and get your first program, exercise library and coach check-in - free for 7 days.",
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <MembershipModal
                  trigger={
                    <ShimmerButton className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                      {t("Become a member")}
                    </ShimmerButton>
                  }
                />
                <Link
                  to="/exercises"
                  className="inline-flex items-center rounded-md border border-border bg-onyx-100/60 px-5 py-3 text-sm font-semibold hover:bg-onyx-200"
                >
                  {t("Browse the library")}
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
