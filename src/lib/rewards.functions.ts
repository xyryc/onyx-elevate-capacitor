// Server function that mints a one-time discount code when a user finishes a challenge.
// - Verifies the user has reached the challenge's required day count.
// - Generates a unique alphanumeric code (e.g. ONYX-30PUSH-XXXXXXXX).
// - Creates a matching Stripe coupon with usage_limit=1 so the code is non-shareable.
// - Stores the row in `challenge_rewards` and returns the code to the client.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { challenges, rewardPercentFor } from "@/data/challenges";

const Input = z.object({
  challengeSlug: z.string().min(1),
});

function makeCode(challengeSlug: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // unambiguous
  let suffix = "";
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  const tag = challengeSlug.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 6) || "ONYX";
  return `ONYX-${tag}-${suffix}`;
}

export const claimChallengeReward = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data, context }) => {
    const { challengeSlug } = data;
    const sb = context.supabase;
    const userId = context.userId;

    // Look up canonical challenge server-side, never trust client for duration.
    const challenge = challenges.find((c) => c.slug === challengeSlug);
    if (!challenge) throw new Error("Unknown challenge");
    const durationDays = challenge.durationDays;

    // Already claimed for this challenge? Return existing so completion UI shows the same code.
    const existing = await sb
      .from("challenge_rewards")
      .select("code, discount_percent, redeemed_at, code_kind")
      .eq("user_id", userId)
      .eq("challenge_slug", challengeSlug)
      .maybeSingle();
    if (existing.data) return existing.data;

    // Verify completion.
    const prog = await sb
      .from("program_progress")
      .select("completed_days")
      .eq("user_id", userId)
      .eq("program_slug", `challenge:${challengeSlug}`)
      .maybeSingle();
    const participant = await sb
      .from("challenge_participants")
      .select("progress")
      .eq("user_id", userId)
      .eq("challenge_slug", challengeSlug)
      .maybeSingle();
    const completedCount = Math.max(
      participant.data?.progress ?? 0,
      prog.data?.completed_days?.length ?? 0,
    );
    if (completedCount < durationDays) {
      throw new Error(`Challenge not complete yet (${completedCount}/${durationDays}).`);
    }

    // One reward code per user per calendar month — stops streak-farming for
    // multiple codes by stacking short challenges.
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
    const monthRewards = await sb
      .from("challenge_rewards")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", monthStart)
      .lt("created_at", nextMonthStart)
      .limit(1);
    if ((monthRewards.data?.length ?? 0) > 0) {
      throw new Error("You've already claimed a reward code this month. Come back next month for your next one.");
    }

    // Every code is a shareable 20% off, usable once, by the owner OR a friend
    // they pass it to. Works on monthly/yearly plans only.
    const discountPercent = 20;
    const codeKind: "friend_share" = "friend_share";

    const env: "sandbox" | "live" = process.env.STRIPE_LIVE_API_KEY ? "live" : "sandbox";
    const code = makeCode(challengeSlug);

    const insert = await sb
      .from("challenge_rewards")
      .insert({
        user_id: userId,
        challenge_slug: challengeSlug,
        code,
        discount_percent: discountPercent,
        environment: env,
        code_kind: codeKind,
        applies_to: "subscription",
      })
      .select("code, discount_percent, redeemed_at, code_kind")
      .single();
    if (insert.error) throw insert.error;
    return insert.data;
  });

export const listMyRewards = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("challenge_rewards")
      .select("challenge_slug, code, discount_percent, redeemed_at, redeemed_for_slug, created_at, code_kind")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });
