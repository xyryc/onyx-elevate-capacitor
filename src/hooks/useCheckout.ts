import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

interface OpenCheckoutOptions {
  priceId: string;
  productSlug: string;
  successUrl?: string;
  discountCode?: string;
  firstMonthDiscount?: boolean;
}

/**
 * Backwards-compatible hook name, now uses Stripe under the hood.
 * Navigates to /checkout which mounts Stripe Embedded Checkout.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openCheckout = useCallback(
    async (options: OpenCheckoutOptions) => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          const next = `${window.location.pathname}${window.location.search}`;
          window.location.href = `/auth?redirect=${encodeURIComponent(next)}`;
          return;
        }
        await navigate({
          to: "/checkout",
          search: {
            priceId: options.priceId,
            slug: options.productSlug,
            ...(options.successUrl ? { successUrl: options.successUrl } : {}),
            ...(options.firstMonthDiscount ? { intro: "1" } : {}),
            ...(typeof window !== "undefined" && window.localStorage.getItem("onyx.rewardCode")
              ? { reward: window.localStorage.getItem("onyx.rewardCode") as string }
              : {}),
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return { openCheckout, loading };
}

