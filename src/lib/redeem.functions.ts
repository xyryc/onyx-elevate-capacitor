// Redeem system: invite codes (1 free month) + challenge reward codes (discount at checkout).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function makeInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `ONYX-FRIEND-${out}`;
}

function currentEnv(): "sandbox" | "live" {
  return process.env.STRIPE_LIVE_API_KEY ? "live" : "sandbox";
}

/**
 * Get (or create) the current user's personal invite code.
 * Only users who have made at least one purchase get an invite code.
 */
export const getMyInviteInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const userId = context.userId;

    // Any invite code THIS user redeemed from someone else (shown as "Used"
    // on their profile so they can't reshare it).
    const { supabaseAdmin: sbAdmin } = await import("@/integrations/supabase/client.server");
    const redeemedByMe = await sbAdmin
      .from("invite_codes")
      .select("code, redeemed_at")
      .eq("redeemed_by_user_id", userId)
      .maybeSingle();
    const redeemedInvite = redeemedByMe.data
      ? { code: redeemedByMe.data.code, redeemedAt: redeemedByMe.data.redeemed_at }
      : null;

    // Only real, paid purchases unlock an invite code.
    const [purchases, subs] = await Promise.all([
      sb.from("purchases").select("id").eq("user_id", userId).limit(1),
      sb.from("subscriptions").select("id, product_id, price_id").eq("user_id", userId),
    ]);
    const paidSubs = (subs.data ?? []).filter(
      (s: any) => s.price_id !== "invite_free_month" && s.product_id !== "invite_free_month",
    );
    const hasPurchase = (purchases.data?.length ?? 0) + paidSubs.length > 0;

    if (!hasPurchase) {
      return {
        hasPurchase: false,
        code: null as string | null,
        redeemedAt: null as string | null,
        redeemedInvite,
      };
    }

    // Look up existing invite
    const existing = await sb
      .from("invite_codes")
      .select("code, redeemed_at, redeemed_by_user_id")
      .eq("owner_user_id", userId)
      .maybeSingle();

    if (existing.data) {
      return {
        hasPurchase: true,
        code: existing.data.code,
        redeemedAt: existing.data.redeemed_at,
        redeemedInvite,
      };
    }

    let code = makeInviteCode();
    for (let i = 0; i < 4; i++) {
      const ins = await sbAdmin
        .from("invite_codes")
        .insert({
          owner_user_id: userId,
          code,
          environment: currentEnv(),
        })
        .select("code, redeemed_at")
        .single();
      if (!ins.error && ins.data) {
        return {
          hasPurchase: true,
          code: ins.data.code,
          redeemedAt: ins.data.redeemed_at,
          redeemedInvite,
        };
      }
      code = makeInviteCode();
    }
    throw new Error("Could not create invite code");
  });

const RedeemInput = z.object({
  code: z
    .string()
    .min(4)
    .max(64)
    .transform((s) => s.trim().toUpperCase()),
});

/**
 * Redeem any code. Returns the kind of redemption so the client can react.
 *  - "free_month": grants a 1-month subscription (invite code from another user)
 *  - "discount":   returns discount info; client stores it and applies at checkout
 */
export const redeemCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => RedeemInput.parse(d))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const userId = context.userId;
    const code = data.code;

    // 1) Try invite code
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const inv = await supabaseAdmin
      .from("invite_codes")
      .select("id, owner_user_id, redeemed_by_user_id, code")
      .eq("code", code)
      .maybeSingle();

    if (inv.data) {
      if (inv.data.owner_user_id === userId) {
        throw new Error("You can't redeem your own invite code.");
      }
      if (inv.data.redeemed_by_user_id) {
        throw new Error("This invite code has already been used.");
      }
      // caller must not already have an active subscription or bundle
      const purchases = await sb.from("purchases").select("id, product_kind").eq("user_id", userId);
      const hasBundle = (purchases.data ?? []).some((p) => p.product_kind === "bundle");
      if (hasBundle)
        throw new Error("You already have All Access, no need to redeem a free month.");
      const activeSub = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .in("status", ["active", "trialing"])
        .limit(1);
      if ((activeSub.data?.length ?? 0) > 0) {
        throw new Error("You already have an active subscription.");
      }

      // Check for prior invite redemption by this user
      const priorInvite = await supabaseAdmin
        .from("invite_codes")
        .select("id")
        .eq("redeemed_by_user_id", userId)
        .limit(1);
      if ((priorInvite.data?.length ?? 0) > 0) {
        throw new Error("You have already redeemed a friend invite.");
      }

      const env = currentEnv();
      const now = new Date();
      const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Mark invite redeemed
      const upd = await supabaseAdmin
        .from("invite_codes")
        .update({ redeemed_by_user_id: userId, redeemed_at: now.toISOString() })
        .eq("id", inv.data.id)
        .is("redeemed_by_user_id", null)
        .select("id")
        .maybeSingle();
      if (!upd.data) throw new Error("This invite code has already been used.");

      // Grant a free-month subscription record
      await supabaseAdmin.from("subscriptions").insert({
        user_id: userId,
        stripe_subscription_id: `invite:${inv.data.id}`,
        stripe_customer_id: `invite:${userId}`,
        product_id: "invite_free_month",
        price_id: "invite_free_month",
        status: "trialing",
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: true,
        environment: env,
      });

      return { kind: "free_month" as const, endsAt: end.toISOString() };
    }

    // 2) Try challenge reward code. Owner may redeem their own self_discount;
    //    friend_share codes can be redeemed by anyone who isn't the owner.
    const { supabaseAdmin: sbAdmin2 } = await import("@/integrations/supabase/client.server");
    const rew = await sbAdmin2
      .from("challenge_rewards")
      .select("id, discount_percent, redeemed_at, code, code_kind, user_id")
      .eq("code", code)
      .maybeSingle();

    if (rew.data) {
      if (rew.data.redeemed_at) {
        throw new Error("This reward code has already been used.");
      }
      // 20% off code — usable once by the owner or a friend they share it with.
      return {
        kind: "discount" as const,
        code: rew.data.code,
        discountPercent: rew.data.discount_percent,
      };
    }

    throw new Error("Code not recognized. Check your rewards or your invite from a friend.");
  });
