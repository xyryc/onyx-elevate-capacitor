CREATE TABLE public.fasting_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  plan_key text NOT NULL DEFAULT '16:8',
  fast_hours integer NOT NULL DEFAULT 16,
  eat_hours integer NOT NULL DEFAULT 8,
  start_time text NOT NULL DEFAULT '20:00',
  end_time text NOT NULL DEFAULT '12:00',
  weekly_days integer[] NOT NULL DEFAULT ARRAY[0,1,2,3,4,5,6],
  reminders_enabled boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fasting_plans TO authenticated;
GRANT ALL ON public.fasting_plans TO service_role;
ALTER TABLE public.fasting_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own fasting plan" ON public.fasting_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER fasting_plans_set_updated_at BEFORE UPDATE ON public.fasting_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.daily_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  note_date date NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, note_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_notes TO authenticated;
GRANT ALL ON public.daily_notes TO service_role;
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notes" ON public.daily_notes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER daily_notes_set_updated_at BEFORE UPDATE ON public.daily_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();