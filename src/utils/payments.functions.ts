import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALLOWED_RETURN_ORIGINS = [
  "https://onyxperformance.app",
  "https://www.onyxperformance.app",
  "https://onyx-movements-hub.lovable.app",
];

function isAllowedReturnUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (ALLOWED_RETURN_ORIGINS.includes(u.origin)) return true;
    // Allow Lovable preview subdomains and localhost dev.
    if (/\.lovable\.app$/.test(u.hostname) && u.protocol === "https:") return true;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}

type CheckoutSessionResult = { clientSecret: string } | { error: string };

const FIRST_MONTH_COUPON_ID = "onyx_first_month_50";

async function ensureFirstMonthCoupon(
  stripe: ReturnType<typeof createStripeClient>,
): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(FIRST_MONTH_COUPON_ID);
    if (existing && !existing.deleted) return existing.id;
  } catch {
    // not found, create it below
  }
  const created = await stripe.coupons.create({
    id: FIRST_MONTH_COUPON_ID,
    percent_off: 50,
    duration: "once",
    name: "First month 50% off",
  });
  return created.id;
}

async function ensureRewardCoupon(
  stripe: ReturnType<typeof createStripeClient>,
  percent: number,
): Promise<string> {
  const id = `onyx_reward_${percent}`;
  try {
    const existing = await stripe.coupons.retrieve(id);
    if (existing && !existing.deleted) return existing.id;
  } catch {
    // create
  }
  const created = await stripe.coupons.create({
    id,
    percent_off: percent,
    duration: "once",
    name: `Onyx Reward ${percent}% off`,
  });
  return created.id;
}

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      priceId: string;
      quantity?: number;
      customerEmail?: string;
      productSlug?: string;
      returnUrl: string;
      environment: StripeEnv;
      firstMonthDiscount?: boolean;
      rewardCode?: string;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (data.rewardCode && !/^[A-Z0-9-]{4,64}$/.test(data.rewardCode)) {
        throw new Error("Invalid reward code");
      }
      if (!isAllowedReturnUrl(data.returnUrl)) {
        throw new Error("Invalid return URL");
      }
      return data;
    },
  )
  .handler(
    async ({ data, context }): Promise<CheckoutSessionResult & { rewardApplied?: number }> => {
      try {
        // Trust the verified session user id, never the client.
        const userId = context.userId;
        const customerEmail = data.customerEmail ?? context.claims?.email;
        const stripe = createStripeClient(data.environment);

        const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
        if (!prices.data.length) throw new Error("Price not found");
        const stripePrice = prices.data[0];
        const isRecurring = stripePrice.type === "recurring";
        const isMonthly = isRecurring && stripePrice.recurring?.interval === "month";
        const applyIntroDiscount = data.firstMonthDiscount === true && isMonthly;

        // Prevent purchasing a second membership when one is already active.
        if (isRecurring) {
          // Lifetime bundle owners already have full access, block new subs.
          const { data: bundle } = await context.supabase
            .from("purchases")
            .select("id")
            .eq("user_id", userId)
            .eq("product_kind", "bundle")
            .limit(1);
          if ((bundle?.length ?? 0) > 0) {
            return {
              error: "You already have lifetime access, no additional membership is needed.",
            };
          }
          const { data: activeSub } = await context.supabase
            .from("subscriptions")
            .select("stripe_subscription_id, status, cancel_at_period_end")
            .eq("user_id", userId)
            .eq("environment", data.environment)
            .in("status", ["active", "trialing", "past_due"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (activeSub?.stripe_subscription_id && !activeSub.cancel_at_period_end) {
            return {
              error:
                "You already have an active membership. Manage or cancel it from Billing before switching plans.",
            };
          }
        }

        const customerId = await resolveOrCreateCustomer(stripe, {
          email: customerEmail,
          userId,
        });

        let productDescription: string | undefined;
        if (!isRecurring) {
          const productId =
            typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id;
          const product = await stripe.products.retrieve(productId);
          productDescription = product.name;
        }

        const commonMetadata: Record<string, string> = {
          userId,
          ...(data.productSlug && { productSlug: data.productSlug }),
        };

        // Resolve reward code (challenge reward). Rules:
        //   - Codes only apply to recurring subscriptions (monthly/yearly), never to
        //     one-time products like the lifetime bundle.
        //   - "self_discount" codes must be owned by the redeeming user.
        //   - "friend_share" codes can be redeemed by anyone (except the owner),
        //     once — enforced by redeemed_at.
        let rewardPercent: number | undefined;
        let rewardRowId: string | undefined;
        if (data.rewardCode) {
          if (!isRecurring) {
            return {
              error:
                "Reward codes only apply to monthly or yearly memberships, not one-time purchases.",
            };
          }
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const row = await supabaseAdmin
            .from("challenge_rewards")
            .select("id, discount_percent, redeemed_at, user_id, code_kind")
            .eq("code", data.rewardCode)
            .maybeSingle();
          if (row.data && !row.data.redeemed_at) {
            const kind = (row.data as any).code_kind ?? "self_discount";
            const ownerOk = row.data.user_id === userId;
            const shareOk = kind === "friend_share" && row.data.user_id !== userId;
            if (ownerOk || shareOk) {
              rewardPercent = row.data.discount_percent;
              rewardRowId = row.data.id;
              commonMetadata.rewardCode = data.rewardCode;
            }
          }
        }

        let couponId: string | undefined;
        if (applyIntroDiscount) {
          couponId = await ensureFirstMonthCoupon(stripe);
        } else if (rewardPercent) {
          couponId = await ensureRewardCoupon(stripe, rewardPercent);
        }

        const session = await stripe.checkout.sessions.create({
          line_items: [{ price: stripePrice.id, quantity: data.quantity || 1 }],
          mode: isRecurring ? "subscription" : "payment",
          ui_mode: "embedded_page",
          return_url: data.returnUrl,
          ...(customerId && { customer: customerId }),
          ...(!isRecurring && {
            payment_intent_data: { description: productDescription, metadata: commonMetadata },
          }),
          ...(couponId && { discounts: [{ coupon: couponId }] }),
          metadata: commonMetadata,
          ...(isRecurring && { subscription_data: { metadata: commonMetadata } }),
        });

        // Mark reward as redeemed as soon as session is created, prevents reuse.
        if (rewardRowId && data.productSlug) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("challenge_rewards")
            .update({
              redeemed_at: new Date().toISOString(),
              redeemed_for_slug: data.productSlug,
              redeemed_by_user_id: userId,
            })
            .eq("id", rewardRowId)
            .is("redeemed_at", null);
        }

        return { clientSecret: session.client_secret ?? "", rewardApplied: rewardPercent };
      } catch (error) {
        return { error: getStripeErrorMessage(error) };
      }
    },
  );

// ────────────────────────────────────────────────────────────
// Billing: current membership, payment history, cancel/manage
// ────────────────────────────────────────────────────────────

export type MembershipInfo = {
  tier: "none" | "monthly" | "yearly" | "lifetime";
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
};

export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<MembershipInfo> => {
    const { supabase, userId } = context;

    // Lifetime = purchase of bundle
    const { data: purch } = await supabase
      .from("purchases")
      .select("id, product_kind")
      .eq("user_id", userId)
      .eq("product_kind", "bundle")
      .limit(1);
    if ((purch?.length ?? 0) > 0) {
      return {
        tier: "lifetime",
        status: "active",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: null,
        stripeCustomerId: null,
      };
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select(
        "stripe_subscription_id, stripe_customer_id, price_id, status, current_period_end, cancel_at_period_end",
      )
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return {
        tier: "none",
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: null,
        stripeCustomerId: null,
      };
    }

    const status = sub.status ?? "";
    const endsAt = sub.current_period_end ? new Date(sub.current_period_end) : null;
    const now = new Date();
    const stillInPeriod = !endsAt || endsAt > now;

    const isActive =
      (["active", "trialing", "past_due"].includes(status) && stillInPeriod) ||
      (status === "canceled" && endsAt && endsAt > now);

    if (!isActive) {
      return {
        tier: "none",
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
        stripeSubscriptionId: sub.stripe_subscription_id,
        stripeCustomerId: sub.stripe_customer_id,
      };
    }

    const priceId = (sub.price_id ?? "").toLowerCase();
    const tier: MembershipInfo["tier"] = priceId.includes("year") ? "yearly" : "monthly";

    return {
      tier,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      stripeSubscriptionId: sub.stripe_subscription_id,
      stripeCustomerId: sub.stripe_customer_id,
    };
  });

export type PaymentHistoryItem = {
  id: string;
  date: string;
  description: string;
  amountCents: number | null;
  currency: string | null;
  kind: "purchase" | "subscription";
};

export const getMyPaymentHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<PaymentHistoryItem[]> => {
    const { supabase, userId } = context;
    const items: PaymentHistoryItem[] = [];

    const { data: purchases } = await supabase
      .from("purchases")
      .select("id, product_kind, product_slug, product_title, amount_cents, currency, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    for (const p of purchases ?? []) {
      const label =
        p.product_kind === "bundle"
          ? "Onyx All Access (Lifetime)"
          : p.product_title || `${p.product_kind}: ${p.product_slug}`;
      items.push({
        id: `purchase:${p.id}`,
        date: p.created_at ?? new Date(0).toISOString(),
        description: label,
        amountCents: p.amount_cents ?? null,
        currency: p.currency ?? null,
        kind: "purchase",
      });
    }

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id, price_id, status, current_period_start, created_at, environment")
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false });
    for (const s of subs ?? []) {
      const label = (s.price_id ?? "").toLowerCase().includes("year")
        ? "Onyx Membership, Yearly"
        : (s.price_id ?? "").toLowerCase().includes("month")
          ? "Onyx Membership, Monthly"
          : `Onyx Membership (${s.price_id ?? "subscription"})`;
      items.push({
        id: `sub:${s.id}`,
        date: s.created_at ?? new Date(0).toISOString(),
        description: `${label} · ${s.status}`,
        amountCents: null,
        currency: null,
        kind: "subscription",
      });
    }

    items.sort((a, b) => (a.date < b.date ? 1 : -1));
    return items;
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl: string; environment: StripeEnv }) => {
    if (!isAllowedReturnUrl(data.returnUrl)) throw new Error("Invalid return URL");
    return data;
  })
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    try {
      const { supabase, userId } = context;
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let customerId = sub?.stripe_customer_id;
      if (!customerId || customerId.startsWith("invite:")) {
        // Fall back to Stripe search by userId metadata (covers one-time purchases with no sub row)
        const stripe = createStripeClient(data.environment);
        const found = await stripe.customers.search({
          query: `metadata['userId']:'${userId}'`,
          limit: 1,
        });
        if (!found.data.length) throw new Error("No Stripe customer found for this account.");
        customerId = found.data[0].id;
      }

      const stripe = createStripeClient(data.environment);
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: data.returnUrl,
      });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const cancelMySubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => data)
  .handler(
    async ({ data, context }): Promise<{ ok: true; endsAt: string | null } | { error: string }> => {
      try {
        const { supabase, userId } = context;
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("stripe_subscription_id")
          .eq("user_id", userId)
          .eq("environment", data.environment)
          .in("status", ["active", "trialing", "past_due"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!sub?.stripe_subscription_id || sub.stripe_subscription_id.startsWith("invite:")) {
          throw new Error("No active subscription to cancel.");
        }
        const stripe = createStripeClient(data.environment);
        const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
          cancel_at_period_end: true,
        });
        const endsAt =
          (updated.items?.data?.[0] as any)?.current_period_end ??
          (updated as any).current_period_end ??
          null;
        return { ok: true, endsAt: endsAt ? new Date(endsAt * 1000).toISOString() : null };
      } catch (error) {
        return { error: getStripeErrorMessage(error) };
      }
    },
  );
