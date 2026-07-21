import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { getRecipeBySlug, type Recipe } from "@/data/recipes";
import { useT } from "@/i18n/LanguageProvider";
import { detectAllergens, allergenSummary } from "@/lib/allergens";
import { LogMealButton } from "@/components/LogMealButton";
import { ShareToChatButton } from "@/components/ShareToChatButton";

export const Route = createFileRoute("/recipes/$slug")({
  loader: ({ params }) => {
    const recipe = getRecipeBySlug(params.slug);
    if (!recipe) throw notFound();
    return { recipe };
  },
  head: ({ loaderData }) => {
    const r = (loaderData as { recipe: Recipe } | undefined)?.recipe;
    if (!r) return {};
    return {
      meta: [
        { title: `${r.title} - Onyx Recipes` },
        { name: "description", content: r.tagline },
        { property: "og:title", content: r.title },
        { property: "og:description", content: r.tagline },
        { property: "og:image", content: r.image },
        { property: "twitter:image", content: r.image },
      ],
      links: [{ rel: "preload", as: "image" as const, href: r.image }],
    };
  },
  notFoundComponent: () => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Recipe not found</h1>
      <Link to="/recipes" className="mt-4 inline-block text-electric">
        Back to recipes
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="mt-4 text-electric">
        Try again
      </button>
    </div>
  ),
  component: RecipePage,
});

function RecipePage() {
  const { recipe: r } = Route.useLoaderData() as { recipe: Recipe };
  const t = useT();
  const router = useRouter();
  const totalTime = r.prepTime + r.cookTime;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/recipes" });
    }
  };

  const sections = [
    { id: "overview", label: t("recipe.overview") },
    { id: "ingredients", label: t("recipe.ingredients") },
    { id: "instructions", label: t("recipe.instructions") },
    { id: "tips", label: t("recipe.proTips") },
    { id: "storage", label: t("recipe.storageSwaps") },
  ];

  return (
    <div className="min-h-[100dvh] bg-background pb-12 md:pb-14">
      <div className="container-onyx pt-3 md:pt-8">
        <div className="hidden md:block">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground flex items-center gap-2">
            <Link to="/" className="hover:text-foreground">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <Link to="/recipes" className="hover:text-foreground">
              {t("nav.recipes")}
            </Link>
            <span>/</span>
            <span className="text-foreground">{r.title}</span>
          </nav>

          <button
            type="button"
            onClick={goBack}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-onyx-100/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-electric hover:text-electric transition"
            aria-label="Go back to previous page"
          >
            ← Go back
          </button>
        </div>

        {/* Hero */}
        <section className="grid md:mt-6 md:grid-cols-[1.05fr_1fr] gap-4 md:gap-8 items-stretch">
          <div
            className="relative rounded-xl overflow-hidden surface-card w-full min-h-[260px] aspect-[4/3] bg-onyx-200 md:rounded-2xl md:aspect-auto md:min-h-[420px]"
            style={{
              backgroundImage: `linear-gradient(to top, var(--onyx-50), transparent 40%), url(${r.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src={r.image}
              alt={r.title}
              width={1280}
              height={1024}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50/70 to-transparent pointer-events-none" />
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] font-bold px-2.5 py-1 rounded-md bg-electric text-onyx-50 shadow-lg">
              {r.category}
            </span>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-onyx-100/60 px-3 py-1.5 text-xs font-semibold text-foreground"
              aria-label="Go back to previous page"
            >
              ← Go back
            </button>
          </div>
          <div className="surface-card rounded-2xl p-5 md:p-8 flex flex-col">
            <div className="flex flex-wrap gap-1.5">
              {r.diets.map((d) => (
                <span
                  key={d}
                  className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-onyx-100 border border-border text-muted-foreground"
                >
                  {d}
                </span>
              ))}
            </div>
            <h1 className="mt-4 font-display text-2xl md:text-5xl font-bold leading-[1.1]">
              {r.title}
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">{r.tagline}</p>

            <div className="mt-6 grid grid-cols-4 gap-2">
              <Stat label={t("recipe.prep")} value={`${r.prepTime}m`} />
              <Stat label={t("recipe.cook")} value={`${r.cookTime}m`} />
              <Stat label={t("recipe.total")} value={`${totalTime}m`} />
              <Stat label={t("recipe.servings")} value={`${r.servings}`} />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <Stat label="kcal" value={`${r.macrosPerServing.calories}`} accent />
              <Stat label={t("recipe.protein")} value={`${r.macrosPerServing.protein}g`} accent />
              <Stat label={t("recipe.carbs")} value={`${r.macrosPerServing.carbs}g`} accent />
              <Stat label={t("recipe.fat")} value={`${r.macrosPerServing.fat}g`} accent />
            </div>

            <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("recipe.perServing")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <LogMealButton
                name={r.title}
                kcal={r.macrosPerServing.calories}
                protein_g={r.macrosPerServing.protein}
                carbs_g={r.macrosPerServing.carbs}
                fat_g={r.macrosPerServing.fat}
                sourceRef={`recipe:${r.slug}`}
              />
              <ShareToChatButton
                variant="outline"
                target={{
                  url: `/recipes/${r.slug}`,
                  title: r.title,
                  subtitle: `${r.macrosPerServing.calories} kcal · ${r.macrosPerServing.protein}g P`,
                  image: r.image,
                  kind: "recipe",
                }}
              />
            </div>

            <AllergenPanel recipe={r} />
          </div>
        </section>
      </div>

      {/* Body */}
      <div className="container-onyx mt-12 md:mt-16 grid md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-12">
        <aside className="hidden md:block">
          <div className="sticky top-24 surface-card rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold mb-3">
              {t("recipe.onThisPage")}
            </p>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-muted-foreground hover:text-electric transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 space-y-14">
          <Section id="overview" eyebrow={t("recipe.overview")} title={t("recipe.whyItWorks")}>
            <p className="text-foreground/85 leading-relaxed">{r.summary}</p>
            <ul className="mt-5 space-y-2">
              {r.whyItWorks.map((w) => (
                <Bullet key={w}>{w}</Bullet>
              ))}
            </ul>
          </Section>

          <Section
            id="ingredients"
            eyebrow={t("recipe.ingredients")}
            title={`${t("recipe.ingredients")} · ${r.servings} ${t("recipe.servings").toLowerCase()}`}
          >
            <div className="space-y-5">
              {r.ingredients.map((g, i) => (
                <div key={i} className="surface-card rounded-xl p-5">
                  {g.title && (
                    <p className="text-xs uppercase tracking-wider text-electric font-semibold mb-3">
                      {g.title}
                    </p>
                  )}
                  <ul className="space-y-2 text-sm">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="instructions"
            eyebrow={t("recipe.instructions")}
            title={t("recipe.stepByStep")}
          >
            <ol className="space-y-4">
              {r.instructions.map((step, i) => (
                <li key={i} className="flex gap-4 surface-card rounded-xl p-5">
                  <span className="grid place-items-center h-8 w-8 rounded-md bg-electric/15 text-electric font-display font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-foreground/85 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="tips" eyebrow={t("recipe.proTips")} title={t("recipe.eliteAdvice")}>
            <ul className="space-y-2">
              {r.proTips.map((tp) => (
                <Bullet key={tp}>{tp}</Bullet>
              ))}
            </ul>
          </Section>

          <Section id="storage" eyebrow={t("recipe.storageSwaps")} title={t("recipe.makeItYours")}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="surface-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-electric font-semibold">
                  {t("recipe.storage")}
                </p>
                <ul className="mt-2 space-y-2">
                  {buildStorageBullets(r.storage).map((s) => (
                    <Bullet key={s}>{s}</Bullet>
                  ))}
                </ul>
              </div>
              <div className="surface-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-electric font-semibold">
                  {t("recipe.swaps")}
                </p>
                <ul className="mt-2 space-y-2">
                  {r.swaps.map((s) => (
                    <Bullet key={s}>{s}</Bullet>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Cross promo */}
          <section className="surface-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.7_0.22_240/0.25),_transparent_60%)]" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                  {t("recipe.cross.eyebrow")}
                </p>
                <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold">
                  {t("recipe.cross.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">{t("recipe.cross.desc")}</p>
              </div>
              <Link
                to="/programs"
                className="inline-flex items-center justify-center rounded-md bg-electric px-5 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-colors"
              >
                {t("recipe.cross.cta")}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function buildStorageBullets(storage: string): string[] {
  const parts = storage
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const defaults = [
    "Label containers with the prep date.",
    "Reheat gently or bring to room temp before serving.",
    "Freeze single portions for up to 1 month for quick meals.",
  ];
  const out = [...parts];
  for (const d of defaults) {
    if (out.length >= 3) break;
    out.push(d);
  }
  return out.slice(0, 3);
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-foreground/85">
      <svg
        className="h-4 w-4 mt-0.5 text-electric shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-2 py-2 text-center ${accent ? "bg-electric/10 border-electric/30" : "bg-onyx-100 border-border"}`}
    >
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground leading-tight">
        {label}
      </p>
      <p className={`mt-0.5 font-display font-bold text-sm ${accent ? "text-electric" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function AllergenPanel({ recipe }: { recipe: Recipe }) {
  const allergens = detectAllergens(recipe);
  const hasNuts = allergens.includes("Peanuts") || allergens.includes("Tree Nuts");
  return (
    <div
      className={`mt-6 rounded-xl border p-4 ${hasNuts ? "bg-red-500/10 border-red-500/40" : "bg-amber-500/5 border-amber-500/25"}`}
    >
      <div className="flex items-start gap-3">
        <svg
          className={`h-5 w-5 mt-0.5 shrink-0 ${hasNuts ? "text-red-400" : "text-amber-400"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div className="min-w-0">
          <p
            className={`text-[10px] uppercase tracking-[0.2em] font-bold ${hasNuts ? "text-red-300" : "text-amber-300"}`}
          >
            {hasNuts ? "Allergen warning" : "Allergen info"}
          </p>
          <p className="mt-1 text-sm text-foreground/90 font-semibold">
            {allergenSummary(allergens)}
          </p>
          {allergens.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {allergens.map((a) => {
                const nut = a === "Peanuts" || a === "Tree Nuts";
                return (
                  <span
                    key={a}
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${nut ? "bg-red-500/20 border-red-500/50 text-red-200" : "bg-onyx-100 border-border text-muted-foreground"}`}
                  >
                    {a}
                  </span>
                );
              })}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Auto-detected from the ingredient list. Always double-check labels on packaged items
            (e.g. protein powders, sauces, breads), many are produced in facilities that also handle
            nuts, soy, milk, wheat or eggs. If you have a severe allergy, do not rely on this list
            alone.
          </p>
        </div>
      </div>
    </div>
  );
}
