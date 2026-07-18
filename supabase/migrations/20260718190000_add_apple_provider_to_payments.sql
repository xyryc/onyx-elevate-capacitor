-- Migration: Add Apple / RevenueCat support to subscriptions and purchases tables
-- Run this against your Supabase project via the dashboard SQL editor or Supabase CLI.

-- 1. Create the purchases table (if missing)
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_kind text NOT NULL, -- 'bundle' | 'program' | 'plan'
  product_slug text NOT NULL,
  product_title text,
  amount_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  transaction_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  provider text NOT NULL DEFAULT 'stripe' CHECK (provider IN ('stripe', 'apple')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT purchases_user_product_unique UNIQUE (user_id, product_kind, product_slug)
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
GRANT SELECT ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'purchases' AND policyname = 'Users can view own purchases'
  ) THEN
    CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 2. Add provider column to subscriptions (stripe | apple)
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'stripe'
    CHECK (provider IN ('stripe', 'apple'));

-- 3. Make Stripe-specific columns nullable so Apple rows can be inserted without them
ALTER TABLE public.subscriptions
  ALTER COLUMN stripe_subscription_id DROP NOT NULL;

ALTER TABLE public.subscriptions
  ALTER COLUMN stripe_customer_id DROP NOT NULL;

-- 4. Add rc_original_transaction_id for Apple subscriptions (RevenueCat original transaction ID)
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS rc_original_transaction_id TEXT UNIQUE;

-- 5. Update has_active_subscription to work for both Stripe and Apple rows
CREATE OR REPLACE FUNCTION public.has_active_subscription(
  user_uuid uuid,
  check_env text DEFAULT 'live'
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid
      AND environment = check_env
      AND (
        (status IN ('active', 'trialing') AND (current_period_end IS NULL OR current_period_end > now()))
        OR (status = 'canceled' AND current_period_end > now())
      )
  );
$$;
