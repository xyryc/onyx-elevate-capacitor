import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook, createStripeClient } from "@/lib/stripe.server";

/**
 * Onyx Pro, Yearly (3 payments): a monthly subscription that must auto-cancel
 * after 3 successful charges so the customer gets 1 year of access for 3
 * monthly payments and is never billed a 4th time.
 */
async function maybeAutoCancelYearly3x(invoice: any, env: StripeEnv) {
  const subscriptionId: string | undefined =
    typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  if (!subscriptionId) return;
  const line = invoice.lines?.data?.[0];
  const lookupKey: string | undefined = line?.price?.lookup_key;
  if (!lookupKey || !lookupKey.startsWith("all_access_yearly")) return;

  try {
    const stripe = createStripeClient(env);
    // Count successful invoices for this subscription.
    let paidCount = 0;
    for await (const inv of stripe.invoices.list({ subscription: subscriptionId, limit: 100 })) {
      if (inv.status === "paid") paidCount += 1;
    }
    if (paidCount >= 3) {
      await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
      console.log(`[stripe] yearly-3x subscription ${subscriptionId} scheduled to cancel after 3rd payment`);
    }
  } catch (err) {
    console.error("[stripe] maybeAutoCancelYearly3x failed", err);
  }
}

function resolvePurchase(productSlug: string | undefined): {
  kind: "bundle" | "program" | "plan";
  slug: string;
} | null {
  if (!productSlug) return null;
  if (
    productSlug === "__all_access__" ||
    productSlug === "all-access" ||
    productSlug === "bundle" ||
    productSlug === "all_access_lifetime"
  ) {
    return { kind: "bundle", slug: "__all_access__" };
  }
  if (productSlug.startsWith("program:")) return { kind: "program", slug: productSlug.slice(8) };
  if (productSlug.startsWith("plan:")) return { kind: "plan", slug: productSlug.slice(5) };
  return { kind: "plan", slug: productSlug };
}

async function handleOneTime(session: any, env: StripeEnv) {
  const userId: string | undefined = session.metadata?.userId;
  const productSlug: string | undefined = session.metadata?.productSlug;
  if (!userId) {
    console.warn("[stripe] checkout.session.completed without userId");
    return;
  }
  const purchase = resolvePurchase(productSlug);
  if (!purchase) {
    console.warn("[stripe] could not resolve productSlug:", productSlug);
    return;
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("purchases").upsert({
    user_id: userId,
    product_kind: purchase.kind,
    product_slug: purchase.slug,
    product_title: null,
    amount_cents: session.amount_total ?? null,
    currency: (session.currency ?? "usd").toUpperCase(),
    transaction_id: session.id,
    environment: env,
  }, { onConflict: "user_id,product_kind,product_slug" });
  if (error) console.error("[stripe] purchase upsert failed", error);
}

async function handleSubscriptionUpsert(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.warn("[stripe] subscription without userId metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.lookup_key
    || item?.price?.metadata?.lovable_external_id
    || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function sendPurchaseEmail(session: any) {
  try {
    const email: string | undefined =
      session.customer_details?.email || session.customer_email || session.metadata?.customerEmail;
    if (!email) {
      console.warn("[stripe] no email on session; skipping confirmation email");
      return;
    }
    const productSlug: string | undefined = session.metadata?.productSlug;
    const purchase = resolvePurchase(productSlug);
    const isLifetime =
      productSlug === "all_access_lifetime" ||
      productSlug === "__all_access__" ||
      productSlug === "all-access" ||
      productSlug === "bundle";
    const isSubscription = session.mode === "subscription";
    const amountCents = session.amount_total ?? 0;
    const currency = (session.currency ?? "usd").toUpperCase();
    const amount = amountCents
      ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountCents / 100)
      : undefined;
    const planName = isLifetime
      ? "Onyx Lifetime, All Access"
      : isSubscription
        ? "Onyx Pro membership"
        : purchase?.kind === "program"
          ? `Program: ${purchase.slug}`
          : purchase?.kind === "plan"
            ? `Meal plan: ${purchase.slug}`
            : "Onyx purchase";

    const { enqueueTransactionalEmail } = await import("@/lib/email/send.server");
    await enqueueTransactionalEmail({
      templateName: "purchase-confirmation",
      recipientEmail: email,
      idempotencyKey: `purchase-confirm-${session.id}`,
      templateData: { planName, amount, isSubscription, isLifetime },
    });
  } catch (err) {
    console.error("[stripe] sendPurchaseEmail failed", err);
  }
}

async function handle(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed": {
      const session: any = event.data.object;
      if (session.mode === "payment") await handleOneTime(session, env);
      await sendPurchaseEmail(session);
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "invoice.payment_succeeded":
    case "invoice.paid":
      await maybeAutoCancelYearly3x(event.data.object, env);
      break;
    default:
      console.log("[stripe] unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  // @ts-expect-error, `server` route options exist at runtime but the type
  // augmentation from @tanstack/react-start isn't applied in this version.
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handle(request, rawEnv as StripeEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("[stripe webhook]", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
