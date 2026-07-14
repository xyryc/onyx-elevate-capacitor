import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { unlockFromSuccessSlug, BUNDLE_KEY } from "@/lib/nutritionAccess";
import { findNutritionPlan } from "@/data/nutritionPlans";
import { programs as PROGRAMS } from "@/data/programs";
import { refreshAccess } from "@/hooks/useAccess";

export const Route = createFileRoute("/checkout_/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    slug: typeof search.slug === "string" ? search.slug : undefined,
  }),
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  const { slug } = Route.useSearch();
  const [done, setDone] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (slug) {
      unlockFromSuccessSlug(slug);
      setDone(true);
      qc.invalidateQueries({ queryKey: ["purchases"] });
    }
    // Poll a few times so we pick up the webhook-written subscription /
    // purchase row even if it lands a couple seconds after this page loads.
    refreshAccess();
    const timers = [1500, 4000, 8000, 15000].map((ms) =>
      window.setTimeout(() => refreshAccess(), ms),
    );
    return () => { timers.forEach((id) => window.clearTimeout(id)); };
  }, [slug, qc]);


  const isMonthly = slug === "all_access_monthly";
  const isYearly = slug === "all_access_yearly";
  const isLifetime = slug === BUNDLE_KEY || slug === "all-access" || slug === "bundle" || slug === "all_access_lifetime";
  const isMembership = isMonthly || isYearly;
  const isBundle = isLifetime || isMembership;
  const programSlug = slug?.startsWith("program:") ? slug.slice(8) : undefined;
  const planSlug = slug && !isBundle && !programSlug
    ? (slug.startsWith("plan:") ? slug.slice(5) : slug)
    : undefined;

  const plan = planSlug ? findNutritionPlan(planSlug) : undefined;
  const program = programSlug ? PROGRAMS.find((p) => p.slug === programSlug) : undefined;

  const membershipCopy = isLifetime
    ? {
        title: "Onyx All Access, Lifetime",
        body: "is unlocked forever. Every training program, every meal plan, and every future release is yours, no renewals, no extra charges.",
      }
    : isYearly
      ? {
          title: "Onyx All Access, Yearly",
          body: "is unlocked for the next 12 months. Every training program and every meal plan is available to you until your membership renews or ends.",
        }
      : isMonthly
        ? {
            title: "Onyx All Access, Monthly",
            body: "is unlocked for the next 30 days. Every training program and every meal plan is available to you while your membership is active.",
          }
        : null;

  return (
    <div className="container-onyx py-24 text-center max-w-xl">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-electric/10 text-3xl text-electric">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl lg:text-4xl font-bold">
        {done ? "You're in." : "Confirming your purchase..."}
      </h1>

      {isBundle && membershipCopy && (
        <>
          <p className="mt-4 text-muted-foreground">
            <span className="text-foreground font-semibold">{membershipCopy.title}</span> {membershipCopy.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/programs" className="rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all">Open programs →</Link>
            <Link to="/meal-plans" className="rounded-md border border-border bg-onyx-100 px-6 py-3 text-sm font-bold hover:border-electric transition-all">Open meal plans</Link>
          </div>
        </>
      )}


      {plan && (
        <>
          <p className="mt-4 text-muted-foreground">
            All 8 weeks of <span className="text-foreground font-semibold">{plan.title}</span> are now unlocked on this device.
          </p>
          <Link
            to="/meal-plans/$slug"
            params={{ slug: plan.slug }}
            className="mt-8 inline-flex items-center justify-center rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all"
          >
            Open the plan →
          </Link>
        </>
      )}

      {program && (
        <>
          <p className="mt-4 text-muted-foreground">
            <span className="text-foreground font-semibold">{program.title}</span> is now fully unlocked. Every week, every exercise, every video.
          </p>
          <Link
            to="/programs/$slug"
            params={{ slug: program.slug }}
            className="mt-8 inline-flex items-center justify-center rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all"
          >
            Open the program →
          </Link>
        </>
      )}

      {!isBundle && !plan && !program && (
        <p className="mt-4 text-muted-foreground">Thanks for your purchase. Your access is unlocked on this device.</p>
      )}

      <div className="mt-8 text-xs text-muted-foreground">
        Want to find this again from any device? <Link to="/my-library" className="text-electric font-semibold hover:underline">Open My Library →</Link>
      </div>
    </div>
  );
}
