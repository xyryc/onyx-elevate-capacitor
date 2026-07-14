CREATE TABLE public.ai_meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  days JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ai_meal_plans_user_id_created_at_idx ON public.ai_meal_plans (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_meal_plans TO authenticated;
GRANT ALL ON public.ai_meal_plans TO service_role;

ALTER TABLE public.ai_meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own ai meal plans"
ON public.ai_meal_plans
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_ai_meal_plans_updated_at
BEFORE UPDATE ON public.ai_meal_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();