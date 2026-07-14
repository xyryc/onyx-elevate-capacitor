import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Sparkles } from "lucide-react";
import { MembershipBillingCard } from "@/components/MembershipBillingCard";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription & billing — Onyx Elevate" },
      { name: "description", content: "Manage your Onyx membership, billing details, invoices and cancellation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const t = useT();
  return (
    <div className="container-onyx py-6 md:py-10 max-w-3xl">
      <Link
        to="/my-library"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("Go back")}
      </Link>

      <header className="mt-4 rounded-2xl border border-electric/30 bg-gradient-to-br from-electric/10 via-onyx-100 to-onyx-100 p-6 md:p-8">
        <div className="flex items-center gap-2 text-electric text-[11px] uppercase tracking-[0.24em] font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          {t("Membership")}
        </div>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">
          {t("Subscription & billing")}
        </h1>
        <p className="mt-2 max-w-xl text-sm md:text-base text-muted-foreground">
          {t("Manage your plan, update payment details, view invoices, and cancel any time. Full control in one place.")}
        </p>
      </header>

      <MembershipBillingCard />

      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-onyx-50 p-4 text-xs text-muted-foreground">
        <Shield className="h-4 w-4 mt-0.5 text-electric shrink-0" />
        <p>{t("Payments are handled securely by Stripe. Onyx never stores your card details.")}</p>
      </div>
    </div>
  );
}
