import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { recipes, RECIPE_CATEGORIES, type Recipe, type RecipeCategory } from "@/data/recipes";
import { useT } from "@/i18n/LanguageProvider";
import { CollapsibleChips } from "@/components/CollapsibleChips";
import { RecipeDialog } from "@/components/RecipeDialog";
import recipesHeroImg from "@/assets/recipes-hero.jpg";
import nutritionBg from "@/assets/nutrition-bg.jpg";

export const Route = createFileRoute("/recipes/")({
  head: () => ({
    meta: [
      { title: "Healthy Recipes - Onyx Elevate" },
      { name: "description", content: "Free high-protein recipes built for athletes: post-workout meals, breakfasts, smoothies, snacks, vegan and low-carb options. Macros and prep times included." },
      { property: "og:title", content: "Healthy Recipes - Onyx Elevate" },
      { property: "og:description", content: "Athlete-built recipes with full macros, prep times and pro tips. All free." },
    ],
  }),
  component: RecipesPage,
});

function RecipesPage() {
  const t = useT();
  const [category, setCategory] = useState<RecipeCategory | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesCat = category === "All" || r.category === category;
      const matchesQ = !q || r.title.toLowerCase().includes(q) || r.tagline.toLowerCase().includes(q) || r.diets.some(d => d.toLowerCase().includes(q));
      return matchesCat && matchesQ;
    });
  }, [category, query]);

  const grouped = useMemo(() => {
    const map = new Map<RecipeCategory, Recipe[]>();
    for (const r of filtered) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return RECIPE_CATEGORIES.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c)! }));
  }, [filtered]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(ellipse_at_top,_oklch(0.7_0.22_240/0.18),_transparent_60%)]">
        <div className="absolute inset-y-0 right-0 w-full md:w-[45%] lg:w-[42%]">
          <img
            src={recipesHeroImg}
            alt="Athlete meal prep"
            width={800}
            height={600}
            className="h-full w-full object-cover object-center [mask-image:linear-gradient(to_left,black_40%,transparent)]"
            loading="eager"
          />
        </div>
        <div className="container-onyx relative pt-10 md:pt-16 pb-6 md:pb-8">
          <div className="max-w-2xl lg:max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{t("recipes.eyebrow")}</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              {t("recipes.heroTitle1")} <span className="text-gradient-electric">{t("recipes.heroTitle2")}</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{t("recipes.heroDesc")}</p>
          </div>

          <div className="mt-6 bg-onyx-50/70 backdrop-blur-md border border-border/60 rounded-2xl p-4 md:p-5">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("recipes.searchPlaceholder")}
                className="w-full bg-onyx-100 border border-border rounded-md pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-electric/60"
              />
            </div>
            <div className="mt-4">
              <CollapsibleChips
                label={t("Filter by category")}
                activeLabel={category === "All" ? t("recipes.all") : category}
              >
                <Chip active={category === "All"} onClick={() => setCategory("All")}>{t("recipes.all")}</Chip>
                {RECIPE_CATEGORIES.map((c) => (
                  <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{t(c)}</Chip>
                ))}
              </CollapsibleChips>
            </div>
          </div>
        </div>
      </section>

      {/* Grouped categories */}
      <section className="relative">
        <img
          src={nutritionBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-onyx-950/30" aria-hidden="true" />
        <div className="container-onyx relative mt-6 md:mt-8 pb-8 md:pb-16 space-y-8 md:space-y-10">
        {grouped.length === 0 && <p className="text-muted-foreground">{t("recipes.empty")}</p>}

        {grouped.map(({ category: cat, items }) => {
          const avgP = Math.round(items.reduce((s, r) => s + r.macrosPerServing.protein, 0) / items.length);
          const avgC = Math.round(items.reduce((s, r) => s + r.macrosPerServing.carbs, 0) / items.length);
          const avgF = Math.round(items.reduce((s, r) => s + r.macrosPerServing.fat, 0) / items.length);
          const kcalLow = Math.min(...items.map((r) => r.macrosPerServing.calories));
          const kcalHigh = Math.max(...items.map((r) => r.macrosPerServing.calories));
          return (
            <div key={cat}>
              {/* Category header row */}
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-2">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">{t(cat)}</h2>
                  <span className="text-xs text-muted-foreground">({items.length} {items.length === 1 ? t("recipe") : t("recipes.suffixRecipes")})</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] uppercase tracking-wider">
                  <span className="font-bold text-foreground">{kcalLow === kcalHigh ? `${kcalLow} kcal` : `${kcalLow}–${kcalHigh} kcal`}</span>
                  <MacroPill color="electric" label={t("Protein")} value={`${avgP}g`} />
                  <MacroPill color="amber" label={t("Carbs")} value={`${avgC}g`} />
                  <MacroPill color="yellow" label={t("Fat")} value={`${avgF}g`} />
                </div>
              </div>

              {/* Cards row - horizontal scroll on mobile/tablet, grid on desktop */}
              <div className="mt-3 -mx-4 px-4 flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0">
                {items.map((r) => (
                  <div key={r.slug} className="w-[58%] sm:w-[42%] shrink-0 snap-start lg:w-auto lg:shrink flex">
                    <RecipeCard recipe={r} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
      </section>
    </div>
  );
}

function RecipeCard({ recipe: r }: { recipe: Recipe }) {
  const t = useT();
  const [imageReady, setImageReady] = useState(false);

  return (
    <RecipeDialog recipe={r}>
      <article
        role="button"
        tabIndex={0}
        aria-label={`${t("Open")} ${t(r.title)}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget as HTMLElement).click();
          }
        }}
        className="group surface-card rounded-xl overflow-hidden hover:border-electric/40 md:transition-colors flex flex-col w-full h-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-onyx-200">
          {!imageReady && <CardImageSkeleton />}
          <img
            src={r.image}
            alt={t(r.title)}
            loading="lazy"
            width={800}
            height={600}
            className={`absolute inset-0 h-full w-full object-cover md:group-hover:scale-[1.04] md:transition-transform md:duration-500 ${imageReady ? "opacity-100" : "opacity-0"}`}
            decoding="async"
            onLoad={() => setImageReady(true)}
            onError={() => setImageReady(true)}
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-onyx-50/70 to-transparent pointer-events-none" />
          <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
            {r.diets.slice(0, 2).map((d) => (
              <span key={d} className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-onyx-50/70 backdrop-blur border border-border/60 text-foreground/90">{t(d)}</span>
            ))}
            {r.diets.length > 2 && (
              <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-onyx-50/70 backdrop-blur border border-border/60 text-foreground/90">+{r.diets.length - 2}</span>
            )}
          </div>
        </div>
        <div className="p-3 flex flex-col flex-1 bg-onyx-50/95">
          <h3 className="font-display text-sm font-bold leading-snug group-hover:text-electric transition-colors line-clamp-2 min-h-[2.5rem]">{t(r.title)}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{r.macrosPerServing.calories} kcal</p>
          <div className="mt-2 flex items-center gap-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Dot color="electric" /><span>{r.macrosPerServing.protein}g <span className="text-foreground">P</span></span></span>
            <span className="inline-flex items-center gap-1"><Dot color="amber" /><span>{r.macrosPerServing.carbs}g <span className="text-foreground">C</span></span></span>
            <span className="inline-flex items-center gap-1"><Dot color="yellow" /><span>{r.macrosPerServing.fat}g <span className="text-foreground">F</span></span></span>
          </div>
        </div>
      </article>
    </RecipeDialog>
  );
}

function CardImageSkeleton() {
  return (
    <div className="absolute inset-0 z-20 overflow-hidden bg-onyx-200" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-onyx-200 via-onyx-100 to-onyx-200" />
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-electric/10 to-transparent" />
    </div>
  );
}

function Dot({ color }: { color: "electric" | "amber" | "yellow" }) {
  const cls = color === "electric" ? "bg-electric" : color === "amber" ? "bg-orange-400" : "bg-yellow-300";
  return <span className={`h-1.5 w-1.5 rounded-full ${cls}`} />;
}

function MacroPill({ color, label, value }: { color: "electric" | "amber" | "yellow"; label: string; value: string }) {
  const cls = color === "electric" ? "bg-electric" : color === "amber" ? "bg-orange-400" : "bg-yellow-300";
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${cls}`} />
      <span>{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </span>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${active ? "bg-electric text-onyx-50 border-electric" : "bg-onyx-100 border-border text-muted-foreground hover:text-foreground hover:border-electric/40"}`}
    >
      {children}
    </button>
  );
}
