import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { programs, programCategories, type ProgramCategory, type Program } from "@/data/programs";
import { useT } from "@/i18n/LanguageProvider";
import { MembershipModal } from "@/components/MembershipModal";
import { CollapsibleChips } from "@/components/CollapsibleChips";
import { usePrice } from "@/lib/pricing";
import { useAccess } from "@/hooks/useAccess";
import { quickWorkouts, type QuickWorkout } from "@/data/quickWorkouts";
import { QuickWorkoutDialog } from "@/components/QuickWorkoutDialog";
import { CompactCard } from "@/components/ProgramDialog";

const VALID_CATS = new Set<string>([
  "Strength",
  "Hypertrophy",
  "Bodybuilding",
  "Fat Loss",
  "Powerlifting",
  "Endurance",
  "Home Training",
  "Women",
  "Beginner",
  "Hyrox",
]);

export const Route = createFileRoute("/programs/")({
  validateSearch: (search: Record<string, unknown>) => ({
    cat:
      typeof search.cat === "string" && VALID_CATS.has(search.cat)
        ? (search.cat as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Training Programs - Onyx Elevate" },
      {
        name: "description",
        content:
          "Free 1-week samplers plus full premium training programs from Onyx: bodybuilding, powerlifting, Hyrox, running, fat loss and more. Every exercise is wired to a video demo. R$ 29,99 each.",
      },
      { property: "og:title", content: "Training Programs - Onyx Elevate" },
      {
        property: "og:description",
        content: "Try one free week, then unlock the full program for R$ 29,99.",
      },
    ],
  }),
  component: ProgramsPage,
});

const FILTER_CHIPS: { label: string; cat?: string; href?: string }[] = [
  { label: "All Programs", cat: undefined },
  { label: "Bodybuilding", cat: "Bodybuilding" },
  { label: "Powerlifting", cat: "Powerlifting" },
  { label: "Strength", cat: "Strength" },
  { label: "Hypertrophy", cat: "Hypertrophy" },
  { label: "Fat Loss", cat: "Fat Loss" },
  { label: "Endurance", cat: "Endurance" },
  { label: "Hyrox", cat: "Hyrox" },
  { label: "Home Gym", cat: "Home Training" },
  { label: "Glute", cat: "Women" },
  { label: "Beginner", cat: "Beginner" },
  { label: "Yoga", href: "/yoga-mobility" },
];

function ProgramsPage() {
  const t = useT();
  const { cat } = Route.useSearch();
  const [query, setQuery] = useState("");
  const programPrice = usePrice("monthlyIntro");
  const access = useAccess();
  const hasMembership = access.loading || access.hasBundle || access.hasSubscription;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = programs;
    if (cat) {
      list = list.filter((p) => p.category === cat);
    }
    if (!q) return list;
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.goal.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [query, cat]);

  const freePrograms = filtered.filter((p) => p.isFree);
  const premiumPrograms = filtered.filter((p) => !p.isFree);

  const byCategory: {
    key: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Program[];
  }[] = [];
  for (const c of programCategories) {
    const items = premiumPrograms.filter((p) => p.category === c);
    if (items.length === 0) continue;
    byCategory.push({
      key: c,
      eyebrow: c === "Women" ? "Glute" : c,
      title: c === "Women" ? "Glute Specialization" : `${c} Programs`,
      subtitle: categoryBlurb(c),
      items,
    });
  }

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border/60 bg-[radial-gradient(ellipse_at_top,_oklch(0.7_0.22_240/0.18),_transparent_60%)]">
        <div className="container-onyx py-10 md:py-14">
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
            {t("programs.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold leading-[1.05] max-w-3xl">
            {t("programs.heroTitle1")}{" "}
            <span className="text-gradient-electric">{t("programs.heroTitle2")}</span>
          </h1>
          {!hasMembership && (
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">
              {t("programs.heroTaglinePre")}{" "}
              <span className="text-electric font-semibold">{programPrice}</span>{" "}
              {t("programs.heroTaglinePost")}
            </p>
          )}

          <div className="mt-6 max-w-xl">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("programs.searchPlaceholder")}
                className="w-full bg-onyx-100 border border-border rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-electric/60"
              />
            </div>
          </div>

          <div className="mt-6">
            <CollapsibleChips
              label="Filter by category"
              activeLabel={FILTER_CHIPS.find((c) => (c.cat ?? "") === (cat ?? ""))?.label}
            >
              {FILTER_CHIPS.map((c) => {
                const active = (c.cat ?? "") === (cat ?? "");
                if (c.href) {
                  return (
                    <Link
                      key={c.label}
                      to={c.href}
                      className="rounded-full border px-3 py-2 text-xs font-medium text-center transition-colors bg-onyx-100 border-border hover:border-electric/50 hover:text-electric"
                    >
                      {c.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={c.label}
                    to="/programs"
                    search={{ cat: c.cat }}
                    className={`rounded-full border px-3 py-2 text-xs font-medium text-center transition-colors ${active ? "bg-electric text-onyx-50 border-electric" : "bg-onyx-100 border-border hover:border-electric/50 hover:text-electric"}`}
                  >
                    {c.label}
                  </Link>
                );
              })}
            </CollapsibleChips>
          </div>
        </div>
      </section>

      {filtered.length === 0 && (
        <div className="container-onyx py-16 text-center text-muted-foreground">
          No programs match this filter yet.{" "}
          <Link to="/programs" search={{ cat: undefined }} className="text-electric font-semibold">
            Clear filter
          </Link>
        </div>
      )}

      {/* FREE 1 WEEK SECTION - shown first so people try before they buy */}
      {freePrograms.length > 0 && (
        <Row
          eyebrow={t("programs.freeEyebrow")}
          title={t("programs.freeTitle")}
          subtitle={t("programs.freeSubtitle")}
          items={freePrograms}
          accent="emerald"
          layout="scroll"
        />
      )}

      {/* Membership CTA - after the free samplers */}
      {!hasMembership && (
        <section id="all-access" className="container-onyx pt-8 scroll-mt-24">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-electric/30 bg-gradient-to-r from-electric/10 via-onyx-100/60 to-onyx-100/60 px-5 py-4 md:px-6 md:py-5 shadow-electric/10">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-electric">
                {t("programs.members.eyebrow")}
              </p>
              <p className="mt-1 text-sm md:text-base text-foreground/90 line-clamp-2">
                {t("programs.members.subtitle")}
              </p>
            </div>
            <MembershipModal
              trigger={
                <button
                  type="button"
                  className="shrink-0 rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric transition-all"
                >
                  {t("programs.members.cta")}
                </button>
              }
            />
          </div>
        </section>
      )}

      {/* Quick Workouts - visible to all, locked for non-members */}
      <QuickWorkoutsRow locked={!hasMembership} />

      {byCategory.map((row) => (
        <Row
          key={row.key}
          eyebrow={row.eyebrow}
          title={row.title}
          subtitle={row.subtitle}
          items={row.items}
          layout="grid"
        />
      ))}

      <div className="h-20" />
    </div>
  );
}

function QuickWorkoutsRow({ locked = false }: { locked?: boolean }) {
  const t = useT();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section className="container-onyx mt-10 md:mt-14">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-electric font-semibold">
          {t("programs.quick.divider")}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex items-end justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl md:text-2xl font-bold truncate">
            {t("programs.quick.title")}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {t("programs.quick.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            {quickWorkouts.length} {t("programs.quick.count")}
          </span>
          <div className="hidden md:flex items-center gap-1">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="h-8 w-8 grid place-items-center rounded-full border border-border bg-onyx-100 hover:border-electric/50 hover:text-electric transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="h-8 w-8 grid place-items-center rounded-full border border-border bg-onyx-100 hover:border-electric/50 hover:text-electric transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="-mx-4 px-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:[scrollbar-width:thin] md:[&::-webkit-scrollbar]:block md:[&::-webkit-scrollbar]:h-2"
      >
        <div className="flex gap-3 items-stretch min-w-min">
          {quickWorkouts.map((w) => (
            <div
              key={w.slug}
              className="w-[75vw] max-w-[280px] sm:w-[240px] shrink-0 snap-start flex"
            >
              <QuickWorkoutCard w={w} locked={locked} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickWorkoutCard({ w, locked = false }: { w: QuickWorkout; locked?: boolean }) {
  const t = useT();
  const tagLabel = t(`programs.quick.tag.${w.tag}`);
  return (
    <QuickWorkoutDialog workout={w}>
      <article
        role="button"
        tabIndex={0}
        aria-label={`${t("Open") || "Open"} ${t(`programs.quick.item.${w.slug}.title`) || w.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget as HTMLElement).click();
          }
        }}
        className="group surface-card rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-electric/40 hover:shadow-electric flex flex-col h-full w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-electric/30 via-onyx-100 to-onyx-50">
          {w.image && (
            <img
              src={w.image}
              alt={w.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/80 via-onyx-50/10 to-transparent" />
          {locked ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-9 w-9 rounded-full bg-onyx-50/70 backdrop-blur border border-border/60 flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-electric"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          ) : (
            <span className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/90 text-onyx-50 font-bold">
              {t("programs.quick.unlocked") || "Unlocked"}
            </span>
          )}
          <span className="absolute top-1.5 right-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-onyx-50/80 backdrop-blur border border-border">
            {w.minutes} {t("programs.quick.min")}
          </span>
        </div>
        <div className="p-2.5 flex flex-col flex-1">
          <h3 className="font-display text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-electric transition-colors">
            {t(`programs.quick.item.${w.slug}.title`)}
          </h3>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="px-1 py-[1px] rounded bg-onyx-200 border border-border">
              {tagLabel}
            </span>
            <span className="px-1 py-[1px] rounded bg-onyx-200 border border-border">
              {w.minutes} {t("programs.quick.min")}
            </span>
          </div>
        </div>
      </article>
    </QuickWorkoutDialog>
  );
}

function categoryBlurb(c: ProgramCategory): string {
  switch (c) {
    case "Bodybuilding":
      return "Classic splits, dual frequency, real growth.";
    case "Powerlifting":
      return "Squat, bench, deadlift - and the meet day plan.";
    case "Hypertrophy":
      return "Volume science applied to the muscles you actually want.";
    case "Fat Loss":
      return "Lift heavy, condition smart, keep the muscle.";
    case "Endurance":
      return "From your first 5K all the way to a marathon.";
    case "Hyrox":
      return "Race-prep work for every Hyrox station.";
    case "Home Training":
      return "Two dumbbells and a band - no excuses.";
    case "Women":
      return "Glute-focused programming built for growth, shape and strength.";
    case "Beginner":
      return "Master the lifts. Build the body that earns them.";
    case "Strength":
      return "Pure barbell strength, anchored on the big three.";
    case "Strongman":
      return "Sled, yoke, carries and stones - built for real-world power.";
  }
}

function Row({
  eyebrow,
  title,
  subtitle,
  items,
  accent,
  layout = "grid",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Program[];
  accent?: "emerald";
  layout?: "grid" | "scroll";
}) {
  return (
    <section className="container-onyx mt-8 md:mt-10">
      <div className="flex items-end justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p
            className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${accent === "emerald" ? "text-emerald-300" : "text-electric"}`}
          >
            {eyebrow}
          </p>
          <h2 className="mt-1 font-display text-xl md:text-2xl font-bold truncate">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {items.length} program{items.length !== 1 && "s"}
        </span>
      </div>
      {layout === "scroll" ? (
        <div className="-mx-4 px-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
          <div className="flex gap-4 min-w-min items-stretch">
            {items.map((p) => (
              <CompactCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      ) : (
        <div className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 items-stretch [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible lg:pb-0">
          {items.map((p) => (
            <div key={p.slug} className="w-[46%] shrink-0 snap-start flex lg:w-auto lg:shrink">
              <CompactCard p={p} fluid />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
