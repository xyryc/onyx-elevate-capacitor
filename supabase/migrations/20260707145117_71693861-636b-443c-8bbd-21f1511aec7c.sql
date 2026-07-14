
CREATE TABLE public.food_log_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  logged_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  meal_slot text NOT NULL DEFAULT 'snack',
  name text NOT NULL,
  grams numeric,
  servings numeric,
  kcal numeric NOT NULL DEFAULT 0,
  protein_g numeric NOT NULL DEFAULT 0,
  carbs_g numeric NOT NULL DEFAULT 0,
  fat_g numeric NOT NULL DEFAULT 0,
  source text DEFAULT 'manual',
  source_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX food_log_drafts_user_date_idx ON public.food_log_drafts (user_id, logged_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_log_drafts TO authenticated;
GRANT ALL ON public.food_log_drafts TO service_role;

ALTER TABLE public.food_log_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own food drafts"
  ON public.food_log_drafts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
