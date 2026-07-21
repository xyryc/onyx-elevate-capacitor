import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Apple, CreditCard, Crown, ExternalLink, Loader2, RefreshCw, Shield, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  cancelMySubscription,
  createPortalSession,
  getMyMembership,
  getMyPaymentHistory,
} from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";
import { looksLikeRealName } from "@/lib/displayName";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n/LanguageProvider";
import {
  isIOSNative,
  rcGetSubscriptionInfo,
  rcOpenManageSubscriptions,
  type RCSubscriptionInfo,
} from "@/lib/revenuecat";

function formatMoney(cents: number | null, currency: string | null) {
  if (cents == null) return "-";
  const cur = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${cur}`;
  }
}

export function MembershipBillingCard() {
  const t = useT();
  const qc = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [rcInfo, setRcInfo] = useState<RCSubscriptionInfo | null | undefined>(undefined);
  const { user } = useAuth();
  const onIOS = isIOSNative();
  let env: "sandbox" | "live" | null = null;
  try { env = getStripeEnvironment(); } catch { env = null; }

  // On iOS load subscription info from RevenueCat (local cache — no network call)
  useEffect(() => {
    if (!onIOS) return;
    rcGetSubscriptionInfo().then(setRcInfo).catch(() => setRcInfo(null));
  }, [onIOS]);

  const { data: profile } = useQuery({
    queryKey: ["membership-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const nameCandidates = [
    profile?.display_name,
    (user?.user_metadata as any)?.full_name,
    (user?.user_metadata as any)?.name,
    user?.email?.split("@")[0],
  ];
  const displayName = nameCandidates.find((n) => looksLikeRealName(n)) || t("Onyx Member");

  const { data: membership } = useQuery({
    queryKey: ["membership", env],
    queryFn: () => getMyMembership({ data: { environment: env! } }),
    enabled: !!env,
  });
  const { data: history = [] } = useQuery({
    queryKey: ["payment-history", env],
    queryFn: () => getMyPaymentHistory({ data: { environment: env! } }),
    enabled: !!env,
  });

  const openPortal = useMutation({
    mutationFn: async () => {
      const res = await createPortalSession({
        data: { returnUrl: window.location.href, environment: env! },
      });
      if ("error" in res) throw new Error(res.error);
      return res.url;
    },
    onSuccess: (url) => window.open(url, "_blank", "noopener"),
    onError: (e: any) => toast.error(e?.message || "Could not open billing portal."),
  });

  const cancel = useMutation({
    mutationFn: async () => {
      const res = await cancelMySubscription({ data: { environment: env! } });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onSuccess: (res) => {
      toast.success(
        res.endsAt
          ? `Subscription cancelled. Access continues until ${new Date(res.endsAt).toLocaleDateString()}.`
          : "Subscription cancelled.",
      );
      qc.invalidateQueries({ queryKey: ["membership"] });
      qc.invalidateQueries({ queryKey: ["payment-history"] });
      setConfirmCancel(false);
    },
    onError: (e: any) => toast.error(e?.message || "Could not cancel subscription."),
  });

  const tier = membership?.tier ?? "none";
  const isMember = tier !== "none";
  const durationLabel =
    tier === "lifetime" ? t("Lifetime access")
    : tier === "yearly" ? t("1-year subscription")
    : tier === "monthly" ? t("1-month subscription")
    : t("No active subscription");
  const tierBadge =
    tier === "lifetime" ? t("Lifetime")
    : tier === "yearly" ? t("Yearly")
    : tier === "monthly" ? t("Monthly")
    : t("Free");

  const hasActiveSubscription = !!membership?.stripeSubscriptionId && !membership.cancelAtPeriodEnd
    && (membership.status === "active" || membership.status === "trialing" || membership.status === "past_due");

  // ── iOS Apple subscription panel ─────────────────────────────────────────
  if (onIOS) {
    const rcLoading = rcInfo === undefined;
    const rcActive = rcInfo?.isActive === true;
    const rcTier = rcActive ? (rcInfo?.tier ?? null) : null;
    const rcTierBadge =
      rcTier === "lifetime" ? t("Lifetime")
      : rcTier === "yearly" ? t("Yearly")
      : rcTier === "monthly" ? t("Monthly")
      : t("Free");
    const rcDurationLabel =
      rcTier === "lifetime" ? t("Lifetime access")
      : rcTier === "yearly" ? t("1-year subscription")
      : rcTier === "monthly" ? t("1-month subscription")
      : t("No active subscription");
    const expiryDate = rcActive && rcInfo?.expirationDate ? new Date(rcInfo.expirationDate) : null;

    return (
      <section className="mt-8 rounded-xl border border-border bg-onyx-100 p-6">
        <div className="flex items-center gap-2">
          <Apple className="h-4 w-4 text-electric" />
          <h2 className="font-display text-xl font-bold">{t("Membership")}</h2>
        </div>

        {rcLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("Loading subscription info…")}
          </div>
        ) : (
          <div className={`mt-4 rounded-lg border p-4 flex flex-wrap items-start justify-between gap-3 ${
            rcActive ? "border-electric/40 bg-electric/5" : "border-border bg-onyx-50"
          }`}>
            <div className="flex items-start gap-3">
              <Crown className={`h-5 w-5 mt-0.5 ${rcActive ? "text-electric" : "text-muted-foreground"}`} />
              <div>
                <div className={`text-[11px] uppercase tracking-widest font-bold ${
                  rcActive ? "text-electric" : "text-muted-foreground"
                }`}>
                  {rcActive ? t("Active") : t("Inactive")}
                </div>
                <div className="font-display text-lg font-bold leading-tight">{displayName}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest ${
                    rcActive ? "bg-electric/20 text-electric" : "bg-onyx-200 text-muted-foreground"
                  }`}>
                    {rcTierBadge}
                  </span>
                  <span className="text-sm text-foreground/85">{rcDurationLabel}</span>
                </div>
                {expiryDate && rcTier !== "lifetime" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {rcInfo?.willRenew ? t("Renews on") : t("Expires on")} {expiryDate.toLocaleDateString()}
                  </div>
                )}
                {rcTier === "lifetime" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {t("Never expires, you own Onyx for life.")}
                  </div>
                )}
                {rcInfo?.isSandbox && (
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    <Sparkles className="h-2.5 w-2.5" /> {t("Sandbox / Test")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {rcActive && (
                <Button
                  variant="outline"
                  onClick={() => rcOpenManageSubscriptions()}
                  className="gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t("Manage in App Store")}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => rcGetSubscriptionInfo().then(setRcInfo).catch(() => setRcInfo(null))}
                className="gap-1 text-muted-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-onyx-50 p-4 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 mt-0.5 text-electric shrink-0" />
          <p>{t("Your subscription is managed by Apple. To cancel or change your plan, tap \"Manage in App Store\" above.")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-border bg-onyx-100 p-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-electric" />
        <h2 className="font-display text-xl font-bold">{t("Membership & Billing")}</h2>
      </div>

      <div className={`mt-4 rounded-lg border p-4 flex flex-wrap items-start justify-between gap-3 ${isMember ? "border-electric/40 bg-electric/5" : "border-border bg-onyx-50"}`}>
        <div className="flex items-start gap-3">
          <Crown className={`h-5 w-5 mt-0.5 ${isMember ? "text-electric" : "text-muted-foreground"}`} />
          <div>
            <div className={`text-[11px] uppercase tracking-widest font-bold ${isMember ? "text-electric" : "text-muted-foreground"}`}>
              {isMember ? t("Active") : t("Inactive")}
            </div>
            <div className="font-display text-lg font-bold leading-tight">{displayName}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest ${isMember ? "bg-electric/20 text-electric" : "bg-onyx-200 text-muted-foreground"}`}>
                {tierBadge}
              </span>
              <span className="text-sm text-foreground/85">{durationLabel}</span>
            </div>
            {membership?.currentPeriodEnd && tier !== "lifetime" && tier !== "none" && (
              <div className="text-xs text-muted-foreground mt-1">
                {membership.cancelAtPeriodEnd ? t("Ends") : t("Renews")} {t("on")} {new Date(membership.currentPeriodEnd).toLocaleDateString()}
              </div>
            )}
            {tier === "lifetime" && (
              <div className="text-xs text-muted-foreground mt-1">
                {t("Never expires, you own Onyx for life.")}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isMember && (
            <Button
              variant="outline"
              onClick={() => openPortal.mutate()}
              disabled={openPortal.isPending}
              className="gap-1"
            >
              {openPortal.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
              {t("Manage billing")}
            </Button>
          )}
          {hasActiveSubscription && (
            <Button
              variant="outline"
              onClick={() => setConfirmCancel(true)}
              className="gap-1 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <XCircle className="h-3.5 w-3.5" />
              {t("Cancel subscription")}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">{t("Payment history")}</div>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("No payments yet.")}</p>
        ) : (
          <ul className="mt-2 divide-y divide-border rounded-md border border-border bg-onyx-50">
            {history.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-sm">
                <div>
                  <div className="font-semibold">{h.description}</div>
                  <div className="text-xs text-muted-foreground">{new Date(h.date).toLocaleString()}</div>
                </div>
                <div className="font-mono text-sm">{formatMoney(h.amountCents, h.currency)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Cancel your Onyx subscription?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("You'll keep full access until the end of your current billing period")}
              {membership?.currentPeriodEnd ? ` (${new Date(membership.currentPeriodEnd).toLocaleDateString()})` : ""}.
              {" "}{t("After that your membership will not renew.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancel.isPending}>{t("Keep subscription")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={cancel.isPending}
              onClick={(e) => { e.preventDefault(); cancel.mutate(); }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {cancel.isPending ? t("Cancelling…") : t("Yes, cancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
