import { createFileRoute } from "@tanstack/react-router";

/**
 * RevenueCat Webhook Handler
 * Route: POST /api/public/payments/rc-webhook
 *
 * Configure this URL in the RevenueCat dashboard:
 *   Project Settings → Integrations → Webhooks → Add new endpoint
 *   URL: https://yourdomain.com/api/public/payments/rc-webhook
 *   Set the webhook secret in REVENUECAT_WEBHOOK_SECRET env variable.
 *
 * Handled events:
 *   INITIAL_PURCHASE      → creates active subscription or lifetime purchase
 *   RENEWAL               → extends current_period_end on existing subscription
 *   PRODUCT_CHANGE        → updates plan tier on subscription
 *   CANCELLATION          → marks cancel_at_period_end = true
 *   EXPIRATION            → marks status = 'canceled'
 *   UNCANCELLATION        → re-activates a cancelled subscription
 *   NON_RENEWING_PURCHASE → upserts lifetime / non-consumable purchase row
 *   BILLING_ISSUE         → marks status = 'past_due'
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Map a RevenueCat product_id to a human-readable tier. */
function resolveTier(productId: string | undefined): "monthly" | "yearly" | "lifetime" | null {
  if (!productId) return null;
  if (productId.includes("lifetime")) return "lifetime";
  if (productId.includes("yearly") || productId.includes("annual")) return "yearly";
  if (productId.includes("monthly")) return "monthly";
  return null;
}

/** Map a RevenueCat event type to a Stripe-compatible subscription status. */
function resolveStatus(eventType: string): string {
  switch (eventType) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "UNCANCELLATION":
    case "PRODUCT_CHANGE":
      return "active";
    case "CANCELLATION":
      return "active"; // still active until period end, cancel_at_period_end = true
    case "EXPIRATION":
      return "canceled";
    case "BILLING_ISSUE":
      return "past_due";
    default:
      return "active";
  }
}

// ─── Verify RevenueCat webhook authenticity ───────────────────────────────────

async function verifyRC(req: Request): Promise<any> {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  const body = await req.text();

  if (secret) {
    // RevenueCat sends the secret as an Authorization header: "Bearer <secret>"
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token !== secret) {
      throw new Error("RevenueCat webhook secret mismatch");
    }
  } else {
    console.warn("[rc-webhook] REVENUECAT_WEBHOOK_SECRET not set — skipping signature check");
  }

  return JSON.parse(body);
}

// ─── Event handlers ───────────────────────────────────────────────────────────

async function handleSubscriptionEvent(event: any) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const eventType: string = event.type;
  const appUserId: string | undefined = event.app_user_id; // This is our Supabase user ID (set via rcLogIn)
  const productId: string | undefined = event.product_id;
  const originalTransactionId: string | undefined =
    event.original_transaction_id ?? event.transaction_id;
  const expirationAtMs: number | undefined = event.expiration_at_ms;
  const purchasedAtMs: number | undefined = event.purchased_at_ms;
  const environment: string = event.environment === "PRODUCTION" ? "live" : "sandbox";

  if (!appUserId) {
    console.warn("[rc-webhook] Missing app_user_id — cannot process event:", eventType);
    return;
  }

  const periodEnd = expirationAtMs ? new Date(expirationAtMs).toISOString() : null;
  const periodStart = purchasedAtMs ? new Date(purchasedAtMs).toISOString() : null;
  const status = resolveStatus(eventType);
  const cancelAtPeriodEnd = eventType === "CANCELLATION";
  const tier = resolveTier(productId);

  console.log(
    `[rc-webhook] ${eventType} | user=${appUserId} | product=${productId} | env=${environment}`,
  );

  // ── Handle lifetime / non-consumable purchases ────────────────────────────
  if (eventType === "NON_RENEWING_PURCHASE" || tier === "lifetime") {
    const { error } = await supabaseAdmin.from("purchases").upsert(
      {
        user_id: appUserId,
        product_kind: "bundle",
        product_slug: "__all_access__",
        product_title: "Onyx Lifetime Access",
        transaction_id: originalTransactionId ?? null,
        amount_cents: event.price_in_purchased_currency
          ? Math.round(event.price_in_purchased_currency * 100)
          : null,
        currency: (event.currency ?? "USD").toUpperCase(),
        environment,
        provider: "apple",
      },
      { onConflict: "user_id,product_kind,product_slug" },
    );
    if (error) console.error("[rc-webhook] lifetime purchase upsert failed:", error);
    else console.log(`[rc-webhook] Lifetime purchase recorded for user ${appUserId}`);
    return;
  }

  // ── Handle auto-renewable subscription events ────────────────────────────
  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: appUserId,
      rc_original_transaction_id: originalTransactionId,
      // Stripe columns are nullable after our migration — leave them null for Apple
      stripe_subscription_id: null,
      stripe_customer_id: null,
      product_id: productId ?? null,
      price_id: productId ?? null, // RevenueCat uses product_id as identifier
      status,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      environment,
      provider: "apple",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "rc_original_transaction_id" },
  );
  if (error) console.error("[rc-webhook] subscription upsert failed:", error);
  else
    console.log(`[rc-webhook] Subscription ${status} for user ${appUserId}, expires ${periodEnd}`);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

async function handle(req: Request) {
  const event = await verifyRC(req);
  const eventType: string = event.type;

  const subscriptionEvents = [
    "INITIAL_PURCHASE",
    "RENEWAL",
    "CANCELLATION",
    "UNCANCELLATION",
    "EXPIRATION",
    "PRODUCT_CHANGE",
    "BILLING_ISSUE",
    "NON_RENEWING_PURCHASE",
  ];

  if (subscriptionEvents.includes(eventType)) {
    await handleSubscriptionEvent(event);
  } else {
    console.log("[rc-webhook] unhandled event type:", eventType);
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/api/public/payments/rc-webhook")({
  // @ts-expect-error, `server` route options exist at runtime but the type
  // augmentation from @tanstack/react-start isn't applied in this version.
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          await handle(request);
          return Response.json({ received: true });
        } catch (e: any) {
          console.error("[rc-webhook]", e?.message ?? e);
          // Return 200 for auth failures to avoid RevenueCat retry storms,
          // but 400 for genuine processing errors.
          const isAuthError = e?.message?.includes("secret mismatch");
          return new Response(isAuthError ? "Unauthorized" : "Webhook error", {
            status: isAuthError ? 401 : 400,
          });
        }
      },
    },
  },
});
