import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, isValidElement, cloneElement, type ReactNode, type ReactElement, type MouseEvent, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { nutritionPlans, type NutritionPlan } from "@/data/nutritionPlans";
import { AllAccessBundle } from "@/components/AllAccessBundle";
import { usePrice } from "@/lib/pricing";
import { useAccess } from "@/hooks/useAccess";
import { useT } from "@/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { MealPlanDetailView } from "./meal-plans.$slug";
import nutritionBg from "@/assets/nutrition-bg.jpg";

export const Route = createFileRoute("/meal-plans/")({
  component: MealPlansIndex,
  head: () => ({
    meta: [
      { title: "Meal Plans - 8 Week Nutrition Programs | Onyx Elevate" },
      {
        name: "description",
        content:
          "Choose your 8-week meal plan: Lean Cut, Lean Muscle, or Mass Bulk. Daily plates, full recipes, macros, and a coach-built progression. R$ 14,99 each.",
      },
      { property: "og:title", content: "Onyx Meal Plans - 8 Weeks of Real Food" },
      {
        property: "og:description",
        content: "Three 8-week meal plans built by Onyx coaches. Fat loss, lean muscle, mass bulk.",
      },
    ],
  }),
});

function MealPlansIndex() {
  const t = useT();
  const mealPrice = usePrice("mealPlan");
  const access = useAccess();
  const hasAllAccess = access.loading || access.hasBundle || access.hasSubscription;
  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${nutritionBg})` }}
        aria-hidden="true"
      />
      <div className="container-onyx relative py-10 sm:py-16 lg:py-24">

      <div className="max-w-3xl">
        <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-electric">
          {t("mealPlans.eyebrow")}
        </div>
        <h1 className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.05] sm:leading-[0.95]">
          {t("mealPlans.heroTitle")}
          <span className="text-electric">.</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t("mealPlans.heroDesc")}
        </p>
        <div className="mt-3 text-sm text-muted-foreground min-h-[1.25rem]">
          {access.loading ? null : hasAllAccess
            ? t("mealPlans.access.all")
            : <>{t("mealPlans.access.allPlans")} · <span className="font-semibold text-foreground">{mealPrice}</span> {t("mealPlans.access.oneTime")} · {t("mealPlans.access.freePreview")}</>}
        </div>
      </div>

      {!access.loading && !hasAllAccess && (
        <div id="all-access" className="mt-8 sm:mt-10 scroll-mt-24">
          <AllAccessBundle />
        </div>
      )}

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {nutritionPlans.map((plan) => {
          const unlocked = hasAllAccess || access.hasPlan(plan.slug);
          return (
          <MealPlanDialog key={plan.slug} plan={plan}>
            <article
              role="button"
              tabIndex={0}
              aria-label={`${t("mealPlans.viewPlan")} ${plan.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") e.preventDefault();
              }}
              className="group relative rounded-xl border border-border/60 bg-onyx-100/80 backdrop-blur-sm overflow-hidden hover:border-electric/60 hover:shadow-lg hover:shadow-electric/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-onyx-200 shrink-0">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-electric via-cyan-300 to-electric z-10" />
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/90 via-onyx-50/30 to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-electric/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-onyx-50">
                  {t(plan.goal)}
                </div>
                {unlocked ? (
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-400/90 backdrop-blur border border-emerald-400 font-bold text-onyx-50">
                    {t("mealPlans.unlocked")}
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-onyx-50/90 backdrop-blur border border-border font-bold text-foreground">
                    {mealPrice}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-electric">
                    {plan.calorieRange} {t("mealPlans.kcalPerDay")}
                  </div>
                  <div className="mt-0.5 font-display text-xl font-bold text-foreground leading-tight">
                    {t(plan.title)}
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{t(plan.tagline)}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-onyx-50/60 px-2 py-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-electric"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    {plan.durationWeeks} {t("mealPlans.weeks")}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-onyx-50/60 px-2 py-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-electric"><path d="M15.4 15.4a5.3 5.3 0 0 1-7.8-1.4 5.3 5.3 0 0 1 1.4-7.8l5.6-5.6a5.3 5.3 0 0 1 7.8 7.8l-2.8 2.8"/><path d="M8.6 8.6a5.3 5.3 0 0 1 7.8 1.4 5.3 5.3 0 0 1-1.4 7.8l-5.6 5.6a5.3 5.3 0 0 1-7.8-7.8l2.8-2.8"/></svg>
                    {plan.calorieRange}
                  </span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  {unlocked ? (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 6 9 17l-5-5"/></svg>
                      {t("mealPlans.unlocked")}
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-foreground">
                      {mealPrice}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-electric group-hover:gap-2 transition-all">
                    {t("mealPlans.viewPlan")}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </article>
          </MealPlanDialog>
          );
        })}
      </div>

      {!hasAllAccess && (
        <div className="mt-12 sm:mt-16 rounded-2xl border border-border/60 bg-onyx-100 p-6 sm:p-8 lg:p-10">
          <h2 className="font-display text-xl sm:text-2xl font-bold">{t("mealPlans.howItWorks.title")}</h2>
          <div className="mt-6 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: t("mealPlans.howItWorks.step1.title"), d: t("mealPlans.howItWorks.step1.desc") },
              { n: "02", t: t("mealPlans.howItWorks.step2.title"), d: t("mealPlans.howItWorks.step2.desc") },
              { n: "03", t: t("mealPlans.howItWorks.step3.title"), d: `${t("mealPlans.access.oneTime")} ${mealPrice}. ${t("mealPlans.howItWorks.step3.desc")}` },
              { n: "04", t: t("mealPlans.howItWorks.step4.title"), d: t("mealPlans.howItWorks.step4.desc") },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border/60 bg-onyx-50 p-5">
                <div className="text-xs font-bold text-electric">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function MealPlanDialog({ plan, children }: { plan: NutritionPlan; children: ReactNode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const skipClearRef = useRef(false);
  const STORAGE_KEY = "mealPlans:openDialog";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === plan.slug) {
        setOpen(true);
      }
    } catch {}
  }, [plan.slug]);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (typeof window === "undefined") return;
    try {
      if (v) {
        sessionStorage.setItem(STORAGE_KEY, plan.slug);
      } else if (skipClearRef.current) {
        skipClearRef.current = false;
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  type TriggerElement = ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    "aria-haspopup"?: "dialog";
    "aria-expanded"?: boolean;
  }>;
  const trigger = isValidElement(children)
    ? cloneElement(children as TriggerElement, {
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (children as TriggerElement).props.onClick?.(event);
          if (!event.defaultPrevented) handleOpenChange(true);
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          const shouldOpen = event.key === "Enter" || event.key === " ";
          (children as TriggerElement).props.onKeyDown?.(event);
          if (shouldOpen) {
            event.preventDefault();
            handleOpenChange(true);
          }
        },
      })
    : children;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 right-0 z-50 h-0 pointer-events-none">
          <DialogClose className="absolute right-3 top-3 pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
          <X className="h-4 w-4" />
          <span className="sr-only">{t("common.close")}</span>
          </DialogClose>
        </div>
        <MealPlanDetailView plan={plan} />
      </DialogContent>
    </Dialog>
  );
}
