import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Gift, Ticket, Users, Check } from "lucide-react";
import { listMyRewards } from "@/lib/rewards.functions";
import { getMyInviteInfo, redeemCode } from "@/lib/redeem.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n/LanguageProvider";

export function RewardsAndInviteCard() {
  const t = useT();
  const qc = useQueryClient();
  const { data: rewards = [] } = useQuery({
    queryKey: ["my-rewards"],
    queryFn: () => listMyRewards(),
  });
  const { data: invite } = useQuery({
    queryKey: ["my-invite"],
    queryFn: () => getMyInviteInfo(),
  });

  const [code, setCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const redeem = useMutation({
    mutationFn: async (raw: string) => redeemCode({ data: { code: raw } }),
    onSuccess: (result: any) => {
      if (result.kind === "free_month") {
        toast.success(t("rewards.toastFreeMonth"));
        qc.invalidateQueries({ queryKey: ["my-invite"] });
        qc.invalidateQueries({ queryKey: ["purchases"] });
      } else if (result.kind === "discount") {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("onyx.rewardCode", result.code);
        }
        toast.success(t("rewards.toastDiscount").replace("{{percent}}", String(result.discountPercent)));
        qc.invalidateQueries({ queryKey: ["my-rewards"] });
      }
      setCode("");
    },
    onError: (err: any) => {
      toast.error(err?.message || t("rewards.toastError"));
    },
  });

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 1500);
    });
  }

  const shareLink = typeof window !== "undefined" && invite?.code
    ? `${window.location.origin}/auth?invite=${encodeURIComponent(invite.code)}`
    : "";

  return (
    <section className="mt-8 rounded-xl border border-border bg-onyx-100 p-6">
      <div className="flex items-center gap-2">
        <Gift className="h-4 w-4 text-electric" />
        <h2 className="font-display text-xl font-bold">{t("rewards.title")}</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("rewards.subtitle")}
      </p>

      {/* Redeem input */}
      <div className="mt-5">
        <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          {t("rewards.haveCode")}
        </label>
        <div className="mt-2 flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t("rewards.placeholder")}
            className="uppercase"
          />
          <Button
            onClick={() => redeem.mutate(code.trim())}
            disabled={!code.trim() || redeem.isPending}
            className="bg-electric text-onyx-50 hover:bg-electric-glow font-bold"
          >
            {redeem.isPending ? t("rewards.redeeming") : t("rewards.redeem")}
          </Button>
        </div>
      </div>

      {/* Invite code this user redeemed from someone else */}
      {invite?.redeemedInvite && (
        <div className="mt-4 rounded-lg border border-border bg-onyx-50 p-3">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
            {t("rewards.friendInviteRedeemed")}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[180px] rounded-md border border-border bg-onyx-100 px-3 py-2 font-mono text-sm font-bold line-through opacity-60">
              {invite.redeemedInvite.code}
            </div>
            <span className="rounded-md bg-electric/20 px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-electric">
              {t("rewards.used")}
            </span>
          </div>
          {invite.redeemedInvite.redeemedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("rewards.redeemedOnOnce").replace("{{date}}", new Date(invite.redeemedInvite.redeemedAt).toLocaleDateString())}
            </p>
          )}
        </div>
      )}

      {/* Challenge reward codes */}
      {rewards.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-electric font-bold">
            <Ticket className="h-3.5 w-3.5" /> {t("rewards.challengeRewards")}
          </div>
          <div className="mt-2 space-y-2">
            {rewards.map((r: any) => (
              <div
                key={r.code}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-onyx-50 p-3"
              >
                <div>
                  <div className="font-mono text-sm font-bold">{r.code}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("rewards.discountFrom").replace("{{percent}}", String(r.discount_percent)).replace("{{challenge}}", r.challenge_slug)}
                    {r.redeemed_at ? ` · ${t("rewards.usedOn").replace("{{date}}", new Date(r.redeemed_at).toLocaleDateString())}` : ""}
                  </div>
                </div>
                {!r.redeemed_at && (
                  <button
                    onClick={() => copy(r.code)}
                    className="inline-flex items-center gap-1 text-xs text-electric font-semibold hover:underline"
                  >
                    {copiedCode === r.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedCode === r.code ? t("rewards.copied") : t("rewards.copy")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite a friend */}
      <div className="mt-6 rounded-lg border border-electric/30 bg-electric/5 p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-electric font-bold">
          <Users className="h-3.5 w-3.5" /> {t("rewards.inviteFriend")}
        </div>
        {invite?.hasPurchase && invite.code ? (
          invite.redeemedAt ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("rewards.inviteUsed")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[180px] rounded-md border border-border bg-onyx-50 px-3 py-2 font-mono text-sm font-bold line-through opacity-60">
                  {invite.code}
                </div>
                <span className="rounded-md bg-electric/20 px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-electric">
                  {t("rewards.used")}
                </span>
              </div>
              <p className="mt-3 text-xs text-electric font-semibold">
                {t("rewards.inviteRedeemedNote").replace("{{date}}", new Date(invite.redeemedAt).toLocaleDateString())}
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("rewards.shareInvite")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[180px] rounded-md border border-border bg-onyx-50 px-3 py-2 font-mono text-sm font-bold">
                  {invite.code}
                </div>
                <Button
                  variant="outline"
                  onClick={() => copy(invite.code!)}
                  className="gap-1"
                >
                  {copiedCode === invite.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {t("rewards.copyCode")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copy(shareLink)}
                  className="gap-1"
                >
                  {copiedCode === shareLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {t("rewards.copyLink")}
                </Button>
              </div>
            </>
          )
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("rewards.unlockInvite")}
          </p>
        )}
      </div>
    </section>
  );
}
