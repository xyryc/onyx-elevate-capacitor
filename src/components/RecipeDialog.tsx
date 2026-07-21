import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { Recipe } from "@/data/recipes";
import { useT } from "@/i18n/LanguageProvider";
import { detectAllergens, allergenSummary } from "@/lib/allergens";
import { LogMealButton } from "@/components/LogMealButton";
import { ShareToChatButton } from "@/components/ShareToChatButton";

/**
 * Wraps a recipe card as a Dialog trigger. Clicking the card opens the
 * full recipe content in a smooth modal overlay (matches yoga tab).
 */
export function RecipeDialog({ recipe, children }: { recipe: Recipe; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 right-0 z-50 h-0 pointer-events-none">
          <DialogClose className="absolute right-3 top-3 pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <RecipeDialogBody recipe={recipe} />
      </DialogContent>
    </Dialog>
  );
}

function RecipeDialogBody({ recipe: r }: { recipe: Recipe }) {
  const t = useT();
  const totalTime = r.prepTime + r.cookTime;

  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-none sm:rounded-t-2xl bg-onyx-100 border-b border-border/60">
        <img
          src={r.image}
          alt={r.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50 to-transparent" />
        <span className="absolute top-3 left-3 rounded-md bg-onyx-50/90 border border-border/60 text-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
          {r.category}
        </span>
      </div>

      <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
        <DialogHeader className="text-left">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {r.diets.map((d) => (
              <span
                key={d}
                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-onyx-100 border border-border text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>
          <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
            {r.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {r.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label={t("recipe.prep")} value={`${r.prepTime}m`} />
          <Stat label={t("recipe.cook")} value={`${r.cookTime}m`} />
          <Stat label={t("recipe.total")} value={`${totalTime}m`} />
          <Stat label={t("recipe.servings")} value={`${r.servings}`} />
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="kcal" value={`${r.macrosPerServing.calories}`} tone="kcal" />
          <Stat label={t("recipe.protein")} value={`${r.macrosPerServing.protein}g`} tone="p" />
          <Stat label={t("recipe.carbs")} value={`${r.macrosPerServing.carbs}g`} tone="c" />
          <Stat label={t("recipe.fat")} value={`${r.macrosPerServing.fat}g`} tone="f" />
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
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

        <div className="mt-8">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("recipe.overview")}
          </h3>
          <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{r.summary}</p>
          <ul className="mt-4 space-y-2">
            {r.whyItWorks.map((w) => (
              <Bullet key={w}>{w}</Bullet>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("recipe.ingredients")} · {r.servings} {t("recipe.servings").toLowerCase()}
          </h3>
          <div className="mt-3 space-y-4">
            {r.ingredients.map((g, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-onyx-100/40 p-4">
                {g.title && (
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    {g.title}
                  </p>
                )}
                <ul className="space-y-2 text-sm">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("recipe.instructions")}
          </h3>
          <ol className="mt-3 space-y-3">
            {r.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                <span className="grid h-6 w-6 place-items-center shrink-0 rounded-full border border-border/60 bg-onyx-100 text-xs font-bold text-foreground">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("recipe.proTips")}
            </h4>
            <ul className="mt-3 space-y-2">
              {r.proTips.map((tp) => (
                <Bullet key={tp}>{tp}</Bullet>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("recipe.swaps")}
            </h4>
            <ul className="mt-3 space-y-2">
              {r.swaps.map((s) => (
                <Bullet key={s}>{s}</Bullet>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border/60 bg-onyx-100/40 p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {t("recipe.storage")}
          </p>
          <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{r.storage}</p>
        </div>
      </div>
    </>
  );
}

type StatTone = "kcal" | "p" | "c" | "f";
const STAT_TONE: Record<StatTone, string> = {
  kcal: "text-electric",
  p: "text-emerald-300",
  c: "text-amber-300",
  f: "text-rose-300",
};

function Stat({ label, value, tone }: { label: string; value: string; tone?: StatTone }) {
  return (
    <div className="min-w-0 rounded-md border border-border/60 bg-onyx-100 px-2 py-2 text-center">
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground leading-tight">
        {label}
      </p>
      <p className={`mt-0.5 font-display font-bold text-sm ${tone ? STAT_TONE[tone] : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-foreground/85">
      <svg
        className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0"
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

function AllergenPanel({ recipe }: { recipe: Recipe }) {
  const allergens = detectAllergens(recipe);
  const hasNuts = allergens.includes("Peanuts") || allergens.includes("Tree Nuts");
  return (
    <div
      className={`mt-4 rounded-xl border p-3 ${hasNuts ? "bg-red-500/10 border-red-500/40" : "bg-amber-500/5 border-amber-500/25"}`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.2em] font-bold ${hasNuts ? "text-red-300" : "text-amber-300"}`}
      >
        {hasNuts ? "Allergen warning" : "Allergen info"}
      </p>
      <p className="mt-1 text-xs text-foreground/90 font-semibold">{allergenSummary(allergens)}</p>
    </div>
  );
}
