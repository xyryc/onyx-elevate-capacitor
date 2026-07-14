import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CalendarPlus, Check, X, Users, CheckCircle2, ChefHat, ShoppingBasket, Flame, Calendar } from "lucide-react";

import {
  findNutritionPlan,
  getDayById,
  getMealById,
  sumDayMacros,
  type Meal,
  type NutritionPlan,
  type WeekPlan,
} from "@/data/nutritionPlans";

import { useAccess } from "@/hooks/useAccess";
import { useAuth } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCheckout";
import { usePrice, useStripePriceId } from "@/lib/pricing";
import { ShareToChatButton } from "@/components/ShareToChatButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useT } from "@/i18n/LanguageProvider";
import { logDraftBatch, listSourceRefDates } from "@/lib/nutrition.functions";
import { DatePickerRow, todayISO } from "@/components/DatePickerRow";
import nutritionBg from "@/assets/nutrition-bg.jpg.asset.json";




export const Route = createFileRoute("/meal-plans/$slug")({
  loader: ({ params }) => {
    const plan = findNutritionPlan(params.slug);
    if (!plan) throw notFound();
    return { plan };
  },
  component: MealPlanDetail,
  head: ({ loaderData }) => {
    const p = loaderData?.plan;
    if (!p) return {};
    return {
      meta: [
        { title: `${p.title} - 8 Week ${p.goal} Plan | Onyx Elevate` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: `${p.title} - ${p.calorieRange}` },
        { property: "og:description", content: p.heroPitch },
      ],
    };
  },
  notFoundComponent: () => {
    const t = useT();
    return (
      <div className="container-onyx py-32 text-center">
        <h1 className="font-display text-3xl font-bold">{t("mealPlan.planNotFound")}</h1>
        <Link to="/meal-plans" className="mt-6 inline-block text-electric">
          ← {t("mealPlan.backAll")}
        </Link>
      </div>
    );
  },
});


function MealPlanDetail() {
  const { plan } = Route.useLoaderData() as { plan: NutritionPlan };
  return <MealPlanDetailView plan={plan} />;
}

export function MealPlanDetailView({ plan }: { plan: NutritionPlan }) {
  const access = useAccess();
  const unlocked = access.hasPlan(plan.slug);
  const [activeWeek, setActiveWeek] = useState(1);
  const { openCheckout, loading } = useCheckout();
  const mealPrice = usePrice("mealPlan");
  const monthlyIntro = usePrice("monthlyIntro");
  const t = useT();



  // (unlock state now derives from useAccess, no local state needed)


  const week = plan.weeks.find((w) => w.week === activeWeek) ?? plan.weeks[0];
  const isLocked = activeWeek > 1 && !unlocked;

  const monthlyPriceId = useStripePriceId("monthly");
  const handleUnlock = () => {
    openCheckout({
      priceId: monthlyPriceId,
      productSlug: `plan:${plan.slug}`,
      firstMonthDiscount: true,
    });
  };



  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url(${nutritionBg.url})` }}
        aria-hidden="true"
      />
      {/* HERO IMAGE — always on top */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-onyx-200">
        <img src={plan.image} alt={plan.title} className="h-full w-full object-cover" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/40 to-transparent" />
      </div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="container-onyx relative py-8 sm:py-12 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-10">
            <div className="rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md p-5 sm:p-7 shadow-card">
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-electric">
                <span className="inline-flex items-center gap-1 rounded-full border border-electric/30 bg-electric/10 px-2 py-0.5">
                  <Flame className="h-3 w-3" /> {plan.goal}
                </span>
                <span className="text-muted-foreground">·</span>
                <span>{plan.durationWeeks} {t("mealPlan.weeks")}</span>
                <span className="text-muted-foreground">·</span>
                <span>{plan.difficulty}</span>
              </div>

              <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.05] sm:leading-[0.95]">
                {plan.title}
                <span className="text-electric">.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {plan.heroPitch}
              </p>
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2">
                {[plan.calorieRange, `Protein ${plan.targetMacros.protein}`, `Carbs ${plan.targetMacros.carbs}`, `Fat ${plan.targetMacros.fat}`].map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full border border-border/60 bg-onyx-50/70 px-3 py-1 text-[11px] sm:text-xs font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <FavoriteButton type="meal-plan" slug={plan.slug} size="sm" />
                <ShareToChatButton
                  variant="outline"
                  size="sm"
                  target={{
                    url: `/meal-plans/${plan.slug}`,
                    title: plan.title,
                    subtitle: `${plan.goal} · ${plan.calorieRange}`,
                    image: (plan as any).heroImage ?? (plan as any).image ?? null,
                    kind: "meal-plan",
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-electric/40 bg-onyx-100/80 backdrop-blur-md p-5 sm:p-6 shadow-electric/20">
              {unlocked ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> {t("mealPlan.unlocked")}
                  </div>
                  <div className="mt-2 font-display text-xl sm:text-2xl font-bold">{t("mealPlan.allWeeksUnlocked")}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("mealPlan.unlockedNote")}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wider text-electric">
                    {t("mealPlan.tryFreeEyebrow")}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold">{monthlyIntro}</span>
                    <span className="text-base font-normal text-muted-foreground">{t("mealPlan.firstMonth")}</span>
                    <span className="text-sm text-muted-foreground line-through">{mealPrice}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {t("mealPlan.thenPrefix")} {mealPrice}{t("mealPlan.thenSuffix")}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("mealPlan.unlockBenefit")}
                  </p>
                  <button
                    onClick={handleUnlock}
                    disabled={loading}
                    className="mt-4 w-full inline-flex items-center justify-center rounded-md bg-electric px-5 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 transition-all"
                  >
                    {loading ? t("mealPlan.openingCheckout") : `${t("mealPlan.unlockFor")} ${monthlyIntro}`}
                  </button>
                  <div className="mt-3 text-[11px] text-center text-muted-foreground">
                    {t("mealPlan.secureCheckout")}
                  </div>
                </>

              )}
            </div>

          </div>
        </div>
      </section>

      {/* WHO + WHAT YOU GET */}
      <section className="container-onyx py-10 sm:py-12 grid gap-5 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md p-5 sm:p-6 shadow-card">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-electric/30 bg-electric/10 text-electric">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold">{t("mealPlan.whoFor")}</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {plan.whoItsFor.map((x) => (
              <li key={x} className="flex gap-3 rounded-lg border border-border/40 bg-onyx-50/50 px-3 py-2">
                <span className="text-electric mt-0.5">→</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md p-5 sm:p-6 shadow-card">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-electric/30 bg-electric/10 text-electric">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold">{t("mealPlan.whatYouGet")}</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {plan.whatYouGet.map((x) => (
              <li key={x} className="flex gap-3 rounded-lg border border-border/40 bg-onyx-50/50 px-3 py-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WEEKS NAV */}
      <section id="weeks" className="container-onyx pb-16 sm:pb-20 scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-electric/30 bg-electric/10 text-electric">
              <Calendar className="h-4 w-4" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold">{t("mealPlan.schedule")}</h2>
          </div>
          <div className="text-[11px] sm:text-xs text-muted-foreground">
            {t("mealPlan.freePreview")}
          </div>

        </div>
        <div className="mt-5 sm:mt-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {plan.weeks.map((w) => {
            const locked = w.week > 1 && !unlocked;
            const isActive = w.week === activeWeek;
            return (
              <button
                key={w.week}
                onClick={() => setActiveWeek(w.week)}
                className={`relative shrink-0 rounded-lg border px-3 sm:px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "border-electric bg-electric text-onyx-50 shadow-[0_0_16px_rgba(0,180,255,0.25)]"
                    : "border-border/60 bg-onyx-100/60 backdrop-blur-sm hover:border-electric/60"
                }`}
              >
                {t("mealPlan.week")} {w.week}
                {locked && <span className="ml-1.5 text-[10px]">🔒</span>}
                {w.week === 1 && !unlocked && (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-80">{t("mealPlan.free")}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* WEEK FOCUS */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md p-5 sm:p-6 shadow-card">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-electric">
                {t("mealPlan.week")} {week.week} · {week.focus}
              </div>
              <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold">{t("mealPlan.coachNotes")}</h3>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{week.coachNote}</p>
        </div>


        {/* WEEK CONTENT */}
        {isLocked ? (
          <LockedWeekCard plan={plan} loading={loading} onUnlock={handleUnlock} />
        ) : (
          <WeekDays plan={plan} week={week} />
        )}
      </section>

      {/* STAPLES + TIPS */}
      <section className="border-t border-border/60 bg-onyx-100/30 backdrop-blur-sm">
        <div className="container-onyx py-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md p-5 sm:p-6 shadow-card">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-electric/30 bg-electric/10 text-electric">
                <ShoppingBasket className="h-4 w-4" />
              </div>
              <h2 className="font-display text-xl font-bold">{t("mealPlan.groceryStaples")}</h2>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {plan.groceryStaples.map((g) => (
                <li key={g} className="flex gap-3 rounded-lg border border-border/40 bg-onyx-50/50 px-3 py-2">
                  <span className="text-electric">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md p-5 sm:p-6 shadow-card">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-electric/30 bg-electric/10 text-electric">
                <ChefHat className="h-4 w-4" />
              </div>
              <h2 className="font-display text-xl font-bold">{t("mealPlan.cookingTips")}</h2>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {plan.cookingTips.map((g) => (
                <li key={g} className="flex gap-3 rounded-lg border border-border/40 bg-onyx-50/50 px-3 py-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function WeekDays({ plan, week }: { plan: NutritionPlan; week: WeekPlan }) {
  const t = useT();
  const dayLabels = [
    t("mealPlan.dayShort.mon"),
    t("mealPlan.dayShort.tue"),
    t("mealPlan.dayShort.wed"),
    t("mealPlan.dayShort.thu"),
    t("mealPlan.dayShort.fri"),
    t("mealPlan.dayShort.sat"),
    t("mealPlan.dayShort.sun"),
  ];
  return (
    <div className="mt-6 grid gap-5">
      {week.dayIds.map((dayId, idx) => {
        const day = getDayById(plan, dayId);
        if (!day) return null;
        const totals = sumDayMacros(plan, dayId);
        return (
          <div
            key={`${week.week}-${idx}`}
            className="rounded-2xl border border-border/60 bg-onyx-100/70 backdrop-blur-md overflow-hidden shadow-card"
          >
            {/* Day header */}
            <div className="flex flex-col gap-3 border-b border-border/60 bg-onyx-100/80 px-4 sm:px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="min-w-0 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-foreground">
                  <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-electric">
                    {dayLabels[idx]}
                  </span>
                  <span className="font-display text-lg font-bold leading-none mt-0.5 text-foreground">{idx + 1}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {t("mealPlan.day")} {idx + 1}
                  </div>
                  <div className="font-display text-base sm:text-lg font-bold truncate">{day.label}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <Stat label="kcal" value={totals.kcal} tone="kcal" />
                  <Stat label="P" value={`${totals.p}g`} tone="p" />
                  <Stat label="C" value={`${totals.c}g`} tone="c" />
                  <Stat label="F" value={`${totals.f}g`} tone="f" />
                </div>
                <AddDayButton plan={plan} dayId={dayId} dayLabel={day.label} />
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {day.mealIds.map((mealId) => {
                const meal = getMealById(plan, mealId);
                if (!meal) return null;
                return <MealItem key={mealId} meal={meal} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AddDayButton({ plan, dayId, dayLabel }: { plan: NutritionPlan; dayId: string; dayLabel: string }) {
  const t = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>(() => todayISO());
  const logBatch = useServerFn(logDraftBatch);
  const listRefDatesFn = useServerFn(listSourceRefDates);
  const qc = useQueryClient();

  const sourceRef = `${plan.slug}:${dayId}`;
  const loggedQ = useQuery({
    queryKey: ["plan-day-logged", sourceRef, user?.id ?? "anon"],
    queryFn: () => listRefDatesFn({ data: { source_ref: sourceRef } }),
    enabled: !!user && open,
    staleTime: 30_000,
  });
  const takenDates = new Set([
    ...(loggedQ.data?.logged ?? []),
    ...(loggedQ.data?.drafted ?? []),
  ]);
  const alreadyLogged = takenDates.has(date);


  const SLOT_MAP: Record<string, "breakfast" | "lunch" | "dinner" | "snack"> = {
    Breakfast: "breakfast",
    Lunch: "lunch",
    Dinner: "dinner",
    Snack: "snack",
  };

  const mut = useMutation({
    mutationFn: async () => {
      const day = getDayById(plan, dayId);
      if (!day) throw new Error("Day not found");
      const meals = day.mealIds
        .map((mid) => getMealById(plan, mid))
        .filter((m): m is Meal => !!m);
      const items = meals.map((m) => ({
        meal_slot: SLOT_MAP[m.slot] ?? "snack",
        name: m.name,
        kcal: m.macros.kcal,
        protein_g: m.macros.p,
        carbs_g: m.macros.c,
        fat_g: m.macros.f,
      }));
      const totals = meals.reduce(
        (acc, m) => ({
          kcal: acc.kcal + m.macros.kcal,
          p: acc.p + m.macros.p,
          c: acc.c + m.macros.c,
          f: acc.f + m.macros.f,
        }),
        { kcal: 0, p: 0, c: 0, f: 0 },
      );
      await logBatch({
        data: {
          date,
          source: "meal-plan",
          source_ref: sourceRef,
          items,
        },
      });
      // Do NOT touch global nutrition_targets here. The daily ring on
      // My Nutrition auto-treats meal-plan totals as that day's goal, so
      // the circle shows 100% for the added date without changing any
      // other day the user has already logged.
      void totals;
    },
    onSuccess: () => {
      toast.success(t("mealPlan.addDay.success"));
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
      qc.invalidateQueries({ queryKey: ["nutrition-day"] });
      qc.invalidateQueries({ queryKey: ["nutrition-drafts", date] });
      qc.invalidateQueries({ queryKey: ["nutrition-drafts"] });
      qc.invalidateQueries({ queryKey: ["nutrition-week"] });
      qc.invalidateQueries({ queryKey: ["nutrition-range"] });
      qc.invalidateQueries({ queryKey: ["plan-day-logged", sourceRef] });
      // Land on My Nutrition with the exact date the user chose, so the
      // ring/macros they see are for that day.
      navigate({ to: "/my-nutrition", search: { date } });
    },

    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : t("mealPlan.addDay.failed")),
  });

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-1.5 rounded-md border border-electric/40 bg-onyx-50 px-3 py-1.5 text-xs font-semibold text-electric hover:border-electric transition-all"
      >
        <CalendarPlus className="h-3.5 w-3.5" /> {t("mealPlan.addDay.cta")}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md bg-electric px-3 py-1.5 text-xs font-bold text-onyx-50 hover:bg-electric-glow transition-all shadow-[0_0_14px_rgba(0,180,255,0.25)]"
      >
        <CalendarPlus className="h-3.5 w-3.5" /> {t("mealPlan.addDay.cta")}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={() => !mut.isPending && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-electric/30 bg-onyx-100 shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">{t("mealPlan.addDay.confirmTitle")}</p>
              <button onClick={() => setOpen(false)} aria-label="Close" disabled={mut.isPending}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t("mealPlan.addDay.confirmBody").replace("{day}", dayLabel)}
            </p>
            <div className="mb-2">
              <DatePickerRow value={date} onChange={setDate} label={t("datePicker.logOn")} />
            </div>
            {alreadyLogged ? (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                <Check className="h-4 w-4" />
                <span>{t("mealPlan.addDay.alreadyLogged")}</span>
              </div>
            ) : takenDates.size > 0 ? (
              <p className="mb-4 text-[11px] text-muted-foreground">
                {t("mealPlan.addDay.otherDatesLogged").replace(
                  "{count}",
                  String(takenDates.size),
                )}
              </p>
            ) : (
              <div className="mb-4" />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={mut.isPending}
                className="flex-1 rounded-md border border-border/60 bg-onyx-50 px-3 py-2 text-sm font-semibold hover:bg-onyx-100 transition-colors disabled:opacity-60"
              >
                {t("mealPlan.addDay.cancel")}
              </button>
              <button
                type="button"
                onClick={() => mut.mutate()}
                disabled={mut.isPending || alreadyLogged}
                className="flex-1 rounded-md bg-electric text-onyx-50 px-3 py-2 text-sm font-bold hover:bg-electric-glow transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mut.isPending
                  ? t("mealPlan.addDay.saving")
                  : alreadyLogged
                    ? t("mealPlan.addDay.alreadyLoggedShort")
                    : t("mealPlan.addDay.confirm")}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

type StatTone = "kcal" | "p" | "c" | "f";

const STAT_TONE: Record<StatTone, { value: string }> = {
  kcal: { value: "text-electric" },
  p: { value: "text-emerald-300" },
  c: { value: "text-amber-300" },
  f: { value: "text-rose-300" },
};

function Stat({ label, value, tone = "kcal" }: { label: string; value: string | number; tone?: StatTone }) {
  const c = STAT_TONE[tone];
  return (
    <div className="rounded-md border border-border/60 bg-onyx-50/70 px-2.5 py-1 shadow-sm">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label} </span>
      <span className={`font-bold ${c.value}`}>{value}</span>
    </div>
  );
}

function LockedWeekCard({
  plan,
  loading,
  onUnlock,
}: {
  plan: NutritionPlan;
  loading: boolean;
  onUnlock: () => void;
}) {
  const mealPrice = usePrice("mealPlan");
  const monthlyIntro = usePrice("monthlyIntro");
  const t = useT();
  return (
    <div className="mt-6 rounded-2xl border border-electric/40 bg-onyx-100/70 backdrop-blur-md p-8 lg:p-12 text-center shadow-card">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-2xl">
        🔒
      </div>
      <h3 className="mt-4 font-display text-2xl lg:text-3xl font-bold">
        {t("mealPlan.lockedTitlePrefix")} {plan.title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
        {t("mealPlan.lockedBlurb")}
      </p>
      <div className="mt-6 flex items-baseline justify-center gap-2">
        <span className="font-display text-3xl font-bold">{monthlyIntro}</span>
        <span className="text-sm text-muted-foreground">{t("mealPlan.firstMonth")}</span>
        <span className="text-sm text-muted-foreground line-through">{mealPrice}</span>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">
        {t("mealPlan.thenPrefix")} {mealPrice}{t("mealPlan.thenSuffix")}
      </div>
      <button
        onClick={onUnlock}
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 transition-all"
      >
        {loading ? t("mealPlan.openingCheckout") : `${t("mealPlan.unlockFor")} ${monthlyIntro}`}
      </button>
      <div className="mt-3 text-[11px] text-muted-foreground">
        {t("mealPlan.secureCheckout")}
      </div>
    </div>
  );
}


// Slot theming — keep emoji, drop strong background colors
const SLOT_STYLE: Record<string, { icon: string }> = {
  Breakfast: { icon: "☀️" },
  Lunch: { icon: "🥗" },
  Snack: { icon: "🍎" },
  Dinner: { icon: "🍽️" },
};

// Parse an ingredient into a quantity prefix + name suffix for richer display.
function parseIngredient(raw: string): { qty: string; name: string } {
  const match = raw.match(
    /^\s*((?:\d+(?:[.,/]\d+)?\s*)+(?:cup|cups|tbsp|tsp|g|kg|ml|l|oz|can|scoop|scoops|slice|slices|piece|pieces|medium|small|large|handful)?\.?)\s+(.+)$/i,
  );
  if (match) return { qty: match[1].trim(), name: match[2].trim() };
  return { qty: "", name: raw.trim() };
}

// Keep step text as a single text node so the auto-translator can match the
// full sentence against the shipped translation bundles.
function decorateStep(text: string): React.ReactNode {
  return text;
}



function MealItem({ meal }: { meal: Meal }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const steps = (meal.recipe ?? "")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
  const slot = SLOT_STYLE[meal.slot] ?? SLOT_STYLE.Dinner;
  const slotLabel = t(`mealPlan.slots.${meal.slot}`);

  return (
    <div className="p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full border border-electric/30 bg-electric/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-electric">
              <span aria-hidden>{slot.icon}</span> {slotLabel}
            </span>
            <div className="mt-1.5 font-display text-base sm:text-lg font-bold flex items-center gap-2">
              {meal.name}
              <span
                className={`text-electric text-xs transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▼
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Stat label="kcal" value={meal.macros.kcal} tone="kcal" />
            <Stat label="P" value={`${meal.macros.p}g`} tone="p" />
            <Stat label="C" value={`${meal.macros.c}g`} tone="c" />
            <Stat label="F" value={`${meal.macros.f}g`} tone="f" />
          </div>
        </div>
        <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-electric">
          {open ? t("mealPlan.hideRecipe") : t("mealPlan.tapForRecipe")}
        </div>
      </button>

      {/* Ingredient preview chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {meal.ingredients.slice(0, 6).map((ing) => (
          <span
            key={ing}
            className="inline-flex items-center rounded-full border border-border/60 bg-onyx-50/70 px-2.5 py-0.5 text-[11px] text-foreground/80"
          >
            {ing}
          </span>
        ))}
        {meal.ingredients.length > 6 && (
          <span className="inline-flex items-center rounded-full border border-border/60 bg-onyx-50/70 px-2.5 py-0.5 text-[11px] text-muted-foreground">
            +{meal.ingredients.length - 6} {t("mealPlan.more")}
          </span>
        )}
      </div>


      {open && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* How to make */}
          <div className="rounded-xl border border-border/60 bg-onyx-100/60 backdrop-blur-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-electric/30 bg-electric/10 text-electric text-xs">
                👨‍🍳
              </span>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("mealPlan.howToMake")}
              </div>
            </div>
            {steps.length > 1 ? (
              <ol className="space-y-3 text-sm text-foreground/90 leading-relaxed">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-[11px] font-bold text-electric">
                      {i + 1}
                    </span>
                    <span>{decorateStep(s)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-foreground/90 leading-relaxed">
                {decorateStep(meal.recipe ?? t("mealPlan.recipeFallback"))}
              </p>
            )}
          </div>

          {/* Ingredients checklist */}
          <div className="rounded-xl border border-border/60 bg-onyx-100/60 backdrop-blur-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-electric/30 bg-electric/10 text-electric text-xs">
                🛒
              </span>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("mealPlan.ingredients")} ({meal.ingredients.length})
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              {meal.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="flex items-baseline gap-2 border-b border-border/40 pb-1.5 last:border-0"
                >
                  <span className="text-electric text-xs">▸</span>
                  <span className="text-foreground/90">{ing}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      )}
    </div>
  );
}


