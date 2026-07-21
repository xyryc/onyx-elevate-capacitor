import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
  exercises,
  categories,
  findCategory,
  type Category,
  type MuscleGroup,
} from "@/data/exercises";
import { ExerciseCard } from "@/components/ExerciseCard";
import { MembershipModal } from "@/components/MembershipModal";
import { CollapsibleChips } from "@/components/CollapsibleChips";

import { useAccess } from "@/hooks/useAccess";
import { isFreePreviewExercise } from "@/lib/exercisePreview";
import { Lock } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import nutritionBg from "@/assets/nutrition-bg.jpg";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  muscle: fallback(z.string(), "").default(""),
  equipment: fallback(z.string(), "").default(""),
  level: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/exercises/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Exercise Library - Onyx Elevate" },
      {
        name: "description",
        content:
          "Search and filter Onyx's premium exercise library by muscle group, equipment, difficulty and type.",
      },
      { property: "og:title", content: "Exercise Library - Onyx Elevate" },
      { property: "og:description", content: "Search and filter the Onyx exercise library." },
      { property: "og:url", content: "https://onyxperformance.app/exercises" },
    ],
    links: [{ rel: "canonical", href: "https://onyxperformance.app/exercises" }],
  }),
  component: ExerciseLibrary,
});

// Category → muscle groups it broadly includes (so e.g. Chest pulls in push-ups
// even though they're filed under Home Gym).
const categoryMuscles: Record<Category, MuscleGroup[]> = {
  "Home Gym": [],
  Chest: ["Chest"],
  Back: ["Back"],
  Shoulders: ["Shoulders"],
  Biceps: ["Biceps"],
  Triceps: ["Triceps"],
  Quads: ["Quads"],
  "Glutes & Hamstrings": ["Glutes", "Hamstrings"],
  Calves: ["Calves"],
  Core: ["Core"],
  "Cardio & Conditioning": ["Cardio"],
  Hyrox: ["Full Body"],
  "Yoga & Stretching": [],
};

function matchesCategory(e: (typeof exercises)[number], cat: Category) {
  if (e.category === cat) return true;
  const muscles = categoryMuscles[cat];
  if (!muscles?.length) return false;
  if (muscles.includes(e.primaryMuscle)) return true;
  return e.secondaryMuscles.some((m) => muscles.includes(m));
}

function ExerciseLibrary() {
  const t = useT();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q);
  const access = useAccess();
  const hasAccess = access.hasBundle || access.hasSubscription;
  const showLocks = !access.loading && !hasAccess;

  const activeCategory = findCategory(search.category);

  const filtered = useMemo(() => {
    const list = exercises.filter((e) => {
      if (search.category && !matchesCategory(e, search.category as Category)) return false;
      if (
        search.muscle &&
        e.primaryMuscle !== search.muscle &&
        !e.secondaryMuscles.includes(search.muscle as never)
      )
        return false;
      if (search.equipment && e.equipment !== search.equipment) return false;
      if (search.level && e.level !== search.level) return false;
      if (search.type && e.exerciseType !== search.type) return false;
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    // Keep the preview exercises floating to the top for locked users so the
    // library still leads with the same recognizable cards it did pre-login.
    if (showLocks) {
      return [...list].sort((a, b) => {
        const af = isFreePreviewExercise(a) ? 0 : 1;
        const bf = isFreePreviewExercise(b) ? 0 : 1;
        return af - bf;
      });
    }
    return list;
  }, [search, q, showLocks]);

  // Progressive (lazy) render - load more as the sentinel scrolls into view.
  const PAGE = 48;
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setVisibleCount(PAGE);
  }, [search, q]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE, filtered.length));
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);
  const visible = filtered.slice(0, visibleCount);

  const updateFilter = (key: keyof typeof search, value: string) => {
    navigate({
      search: (prev: typeof search) => ({ ...prev, [key]: prev[key] === value ? "" : value }),
    });
  };

  const clearAll = () => {
    setQ("");
    navigate({ search: {} as never });
  };

  const hasAnything = !!search.category || !!q;

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${nutritionBg})` }}
        aria-hidden="true"
      />
      <div className="container-onyx relative z-10 py-10 md:py-14">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
            {t("Exercise library")}
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold">
            {t("Every lift, broken down.")}
          </h1>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            {t("500+ exercises across")} {categories.length}{" "}
            {t("categories. Search and filter to find your next lift.")}
          </p>
        </div>

        {/* Category tabs, collapsible on mobile */}
        <div className="mt-6">
          <CollapsibleChips
            label={t("Category")}
            activeLabel={
              search.category
                ? t(categories.find((c) => c.id === search.category)?.label ?? "All")
                : t("All")
            }
          >
            <button
              onClick={() => updateFilter("category", "")}
              className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                !search.category
                  ? "border-electric bg-electric/10 text-electric"
                  : "border-border bg-onyx-100 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("All")}
            </button>
            {categories.map((c) => {
              const isActive = search.category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => updateFilter("category", c.id)}
                  className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-electric bg-electric/10 text-electric"
                      : "border-border bg-onyx-100 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {t(c.label)}
                </button>
              );
            })}
          </CollapsibleChips>
        </div>

        {/* Search bar with embedded filter button */}
        <div className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Search exercises…")}
              className="w-full rounded-xl border border-border bg-onyx-100 pl-11 pr-4 py-3.5 text-sm md:text-base placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20"
            />
          </div>
        </div>

        {/* Locked-user gate banner (guests + logged-in users without membership) */}
        {showLocks && (
          <div className="mt-5 rounded-2xl surface-card px-4 py-3 flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-electric/10">
              <Lock className="h-4 w-4 text-electric" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {t("exercises.membersOnly")}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {t("exercises.unlockSubtitle")}
              </p>
            </div>
            <MembershipModal
              trigger={
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-electric px-4 py-2 text-xs font-bold text-onyx-50 hover:bg-electric-glow transition-colors"
                >
                  {t("Unlock")}
                </button>
              }
            />
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mt-6 mb-4 text-sm">
          <span className="text-muted-foreground">
            <span className="text-foreground font-semibold">{filtered.length}</span>{" "}
            {filtered.length === 1 ? t("exercise") : t("exercises")}
            {activeCategory ? (
              <>
                {" "}
                · <span className="text-foreground">{t(activeCategory.label)}</span>
              </>
            ) : null}
          </span>
          {hasAnything && (
            <button onClick={clearAll} className="text-xs text-electric hover:text-electric-glow">
              {t("Clear")}
            </button>
          )}
        </div>

        {/* Grid - denser */}
        {filtered.length === 0 ? (
          <div className="surface-card rounded-xl p-12 text-center">
            <p className="font-display text-lg">{t("No exercises match these filters.")}</p>
            <button
              onClick={clearAll}
              className="mt-4 text-sm text-electric hover:text-electric-glow font-semibold"
            >
              {t("Clear filters →")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {visible.map((e) => (
                <ExerciseCard
                  key={e.slug}
                  exercise={e}
                  locked={showLocks && !isFreePreviewExercise(e)}
                />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div ref={sentinelRef} className="mt-8 text-center text-xs text-muted-foreground">
                {t("Loading more")} ({visibleCount} {t("of")} {filtered.length})...
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          {t("Don't see an exercise yet?")}{" "}
          <Link to="/app" className="text-electric hover:text-electric-glow">
            {t("It's in the Onyx app →")}
          </Link>
        </p>
      </div>
    </div>
  );
}

