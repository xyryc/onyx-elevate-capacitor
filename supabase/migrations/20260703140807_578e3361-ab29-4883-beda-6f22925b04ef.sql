CREATE TABLE public.custom_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Program',
  weeks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_programs TO authenticated;
GRANT ALL ON public.custom_programs TO service_role;

ALTER TABLE public.custom_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own custom programs"
  ON public.custom_programs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER custom_programs_set_updated_at
  BEFORE UPDATE ON public.custom_programs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX custom_programs_user_id_idx ON public.custom_programs(user_id);