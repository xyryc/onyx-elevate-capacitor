
-- Public foods catalog
CREATE TABLE public.foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  serving_size_g numeric,
  serving_label text,
  kcal_per_100g numeric NOT NULL,
  protein_g_per_100g numeric NOT NULL DEFAULT 0,
  carbs_g_per_100g numeric NOT NULL DEFAULT 0,
  fat_g_per_100g numeric NOT NULL DEFAULT 0,
  category text,
  source text DEFAULT 'seed',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX foods_name_idx ON public.foods USING gin (to_tsvector('simple', name));
GRANT SELECT ON public.foods TO anon, authenticated;
GRANT ALL ON public.foods TO service_role;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read foods" ON public.foods FOR SELECT TO anon, authenticated USING (true);

-- User-created custom foods
CREATE TABLE public.custom_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  kcal_per_100g numeric NOT NULL,
  protein_g_per_100g numeric NOT NULL DEFAULT 0,
  carbs_g_per_100g numeric NOT NULL DEFAULT 0,
  fat_g_per_100g numeric NOT NULL DEFAULT 0,
  serving_size_g numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX custom_foods_user_idx ON public.custom_foods(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_foods TO authenticated;
GRANT ALL ON public.custom_foods TO service_role;
ALTER TABLE public.custom_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own custom foods" ON public.custom_foods FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Food log entries
CREATE TABLE public.food_log_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  logged_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  meal_slot text NOT NULL DEFAULT 'snack',
  food_kind text,
  food_id uuid,
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
CREATE INDEX food_log_user_date_idx ON public.food_log_entries(user_id, logged_date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_log_entries TO authenticated;
GRANT ALL ON public.food_log_entries TO service_role;
ALTER TABLE public.food_log_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own food log" ON public.food_log_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Nutrition targets
CREATE TABLE public.nutrition_targets (
  user_id uuid PRIMARY KEY,
  kcal numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nutrition_targets TO authenticated;
GRANT ALL ON public.nutrition_targets TO service_role;
ALTER TABLE public.nutrition_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own targets" ON public.nutrition_targets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
