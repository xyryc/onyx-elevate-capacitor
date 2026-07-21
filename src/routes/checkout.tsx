import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession } from "@/utils/payments.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Search = {
  priceId?: string;
  slug?: string;
  successUrl?: string;
  intro?: string;
  reward?: string;
};

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    priceId: typeof s.priceId === "string" ? s.priceId : undefined,
    slug: typeof s.slug === "string" ? s.slug : undefined,
    successUrl: typeof s.successUrl === "string" ? s.successUrl : undefined,
    intro: typeof s.intro === "string" ? s.intro : undefined,
    reward: typeof s.reward === "string" ? s.reward : undefined,
  }),
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout, Onyx Elevate" },
      {
        name: "description",
        content: "Complete your purchase to unlock your Onyx Elevate training.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function CheckoutPage() {
  const { priceId, slug, successUrl, intro, reward } = Route.useSearch();
  const navigate = useNavigate();

  const options = useMemo(() => {
    if (!priceId) return null;
    return {
      fetchClientSecret: async (): Promise<string> => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const returnUrl =
          successUrl ||
          `${window.location.origin}/checkout/success?slug=${encodeURIComponent(slug ?? "")}&session_id={CHECKOUT_SESSION_ID}`;
        const result = await createCheckoutSession({
          data: {
            priceId,
            productSlug: slug,
            customerEmail: session?.user?.email ?? undefined,
            returnUrl,
            environment: getStripeEnvironment(),
            firstMonthDiscount: intro === "1",
            rewardCode: reward,
          },
        });
        if ("error" in result) throw new Error(result.error);
        if (!result.clientSecret) throw new Error("No client secret returned");
        // Clear reward code from local storage once consumed by session creation.
        if (reward && typeof window !== "undefined") {
          window.localStorage.removeItem("onyx.rewardCode");
        }
        return result.clientSecret;
      },
    };
  }, [priceId, slug, successUrl, intro, reward]);

  if (!priceId || !options) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Missing checkout details</h1>
          <p className="text-muted-foreground mb-4">No price was specified for this checkout.</p>
          <Button onClick={() => navigate({ to: "/" })}>Go home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="rounded-lg overflow-hidden bg-card">
          <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
