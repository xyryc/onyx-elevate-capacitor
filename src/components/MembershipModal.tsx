import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCheckout } from "@/hooks/useCheckout";
import { usePrice, useStripePriceId } from "@/lib/pricing";
import { BUNDLE_KEY } from "@/lib/nutritionAccess";
import { useT } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  trigger: React.ReactNode;
}

type PlanKey = "monthly" | "yearly" | "lifetime";

export function MembershipModal({ trigger }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<PlanKey | null>(null);
  const { openCheckout } = useCheckout();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingPlan, setPendingPlan] = useState<PlanKey | null>(null);

  const monthlyPrice = usePrice("monthly");
  const monthlyIntro = usePrice("monthlyIntro");
  const yearlyPrice = usePrice("yearly");
  const lifetimePrice = usePrice("lifetime");
  const bundleOriginal = usePrice("bundleOriginal");

  const monthlyId = useStripePriceId("monthly");
  const yearlyId = useStripePriceId("yearly");
  const lifetimeId = useStripePriceId("lifetime");

  const start = async (plan: PlanKey) => {
    if (!authLoading && !user) {
      setPendingPlan(plan);
      return;
    }

    setBusy(plan);
    try {
      if (plan === "monthly") {
        await openCheckout({
          priceId: monthlyId,
          productSlug: "all_access_monthly",
          firstMonthDiscount: true,
        });
      } else if (plan === "yearly") {
        await openCheckout({
          priceId: yearlyId,
          productSlug: "all_access_yearly",
        });
      } else {
        await openCheckout({
          priceId: lifetimeId,
          productSlug: BUNDLE_KEY,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setPendingPlan(null);
      }}
    >
      <div onClick={() => setOpen(true)} className="contents">
        {trigger}
      </div>
      <DialogContent className="max-w-3xl max-h-[90dvh] overflow-y-auto overflow-x-hidden overscroll-contain">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t("membership.title")}</DialogTitle>
          <DialogDescription>{t("membership.description")}</DialogDescription>
        </DialogHeader>

        {pendingPlan ? (
          <div className="mt-2 rounded-xl border border-border bg-onyx-100 p-6 text-center">
            <h3 className="font-display text-xl font-bold">{t("membership.guest.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("membership.guest.desc")}</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate({
                    to: "/auth",
                    search: {
                      mode: "signup",
                      redirect:
                        typeof window !== "undefined" ? window.location.pathname : undefined,
                    },
                  });
                }}
                className="rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow"
              >
                {t("membership.guest.signUp")}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate({
                    to: "/auth",
                    search: {
                      mode: "signin",
                      redirect:
                        typeof window !== "undefined" ? window.location.pathname : undefined,
                    },
                  });
                }}
                className="rounded-md border border-electric bg-transparent px-4 py-3 text-sm font-bold text-electric hover:bg-electric hover:text-onyx-50"
              >
                {t("membership.guest.signIn")}
              </button>
            </div>
            <button
              onClick={() => setPendingPlan(null)}
              className="mt-4 text-xs text-muted-foreground underline hover:text-foreground"
            >
              {t("membership.guest.back")}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            {/* Monthly */}
            <div className="relative flex flex-col rounded-xl border border-border bg-onyx-50/60 p-5">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-lg font-bold">
                  {t("membership.monthly.eyebrow")}
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold">{monthlyIntro}</span>
                <span className="text-xs text-muted-foreground">
                  {t("membership.monthly.firstMonth")}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("membership.monthly.then")}{" "}
                <span className="text-foreground/80">
                  {monthlyPrice}
                  {t("membership.monthly.perMo")}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.cancelAnytime")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.allPrograms")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.quickWorkouts")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.everyVideo")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.nutritionTracker")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.aiCoach")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.yoga")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.groupsMonthly")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.challenges")}</span>
                </li>
              </ul>
              <button
                onClick={() => start("monthly")}
                disabled={busy !== null}
                className="mt-5 inline-flex items-center justify-center rounded-md border border-electric/40 px-4 py-2.5 text-sm font-semibold text-electric hover:bg-electric/10 disabled:opacity-60"
              >
                {busy === "monthly" ? t("membership.opening") : t("membership.monthly.cta")}
              </button>
              <div className="mt-2 text-[10px] text-center text-emerald-300 font-semibold">
                {t("membership.monthly.discountBadge")}
              </div>
            </div>

            {/* Yearly, highlighted */}
            <div className="relative flex flex-col rounded-xl border border-electric bg-onyx-50/80 ring-1 ring-electric/40 p-5">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-electric px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-onyx-50 shadow-electric whitespace-nowrap">
                {t("membership.mostPopular")}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-lg font-bold">
                  {t("membership.yearly.eyebrow")}
                </div>
                <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric whitespace-nowrap">
                  {t("membership.yearly.savings")}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold">{yearlyPrice}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t("membership.yearly.billed")}</div>
              <ul className="mt-3 space-y-1.5 text-sm flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.everythingMonthly")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.save2Months")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.quickWorkouts")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.groupsYearly")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.unlimitedGroups")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.priorityCoach")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.earlyAccess")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.nutritionTracker")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.aiCoachShort")}</span>
                </li>
              </ul>
              <button
                onClick={() => start("yearly")}
                disabled={busy !== null}
                className="mt-5 inline-flex items-center justify-center rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow shadow-electric disabled:opacity-60"
              >
                {busy === "yearly" ? t("membership.opening") : t("membership.yearly.cta")}
              </button>
            </div>

            {/* Lifetime */}
            <div className="relative flex flex-col rounded-xl border border-border bg-onyx-50/60 p-5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-lg font-bold">
                  {t("membership.lifetime.eyebrow")}
                </div>
                <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric whitespace-nowrap">
                  {t("membership.lifetime.savings")}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground line-through">{bundleOriginal}</span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold">{lifetimePrice}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("membership.lifetime.oneTime")}
              </div>
              <ul className="mt-3 space-y-1.5 text-sm flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.everythingForever")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.futureIncluded")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.quickWorkouts")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.groupsLifetime")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.sharePartners")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.nutritionTracker")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.aiCoachShort")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.yogaEvery")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric mt-0.5">✓</span>
                  <span>{t("membership.f.priorityLife")}</span>
                </li>
              </ul>
              <button
                onClick={() => start("lifetime")}
                disabled={busy !== null}
                className="mt-5 inline-flex items-center justify-center rounded-md border border-electric/40 px-4 py-2.5 text-sm font-semibold text-electric hover:bg-electric/10 disabled:opacity-60"
              >
                {busy === "lifetime" ? t("membership.opening") : t("membership.lifetime.cta")}
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">{t("membership.footer")}</p>
      </DialogContent>
    </Dialog>
  );
}
