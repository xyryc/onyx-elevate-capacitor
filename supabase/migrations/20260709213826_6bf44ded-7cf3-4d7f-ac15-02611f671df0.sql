
CREATE TABLE public.nutrition_targets_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_date date NOT NULL,
  kcal numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nutrition_targets_daily TO authenticated;
GRANT ALL ON public.nutrition_targets_daily TO service_role;
ALTER TABLE public.nutrition_targets_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own daily targets" ON public.nutrition_targets_daily FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER nutrition_targets_daily_updated_at
  BEFORE UPDATE ON public.nutrition_targets_daily
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
