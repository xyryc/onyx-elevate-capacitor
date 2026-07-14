
CREATE TABLE public.activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  kind text NOT NULL,
  title text NOT NULL,
  detail text,
  item_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activity_events_created_idx ON public.activity_events (created_at DESC);
CREATE INDEX activity_events_user_idx ON public.activity_events (user_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.activity_events TO authenticated;
GRANT ALL ON public.activity_events TO service_role;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_select_all" ON public.activity_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "activity_insert_own" ON public.activity_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activity_delete_own" ON public.activity_events FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  measured_on date NOT NULL DEFAULT current_date,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  waist_cm numeric(5,1),
  chest_cm numeric(5,1),
  arms_cm numeric(5,1),
  thighs_cm numeric(5,1),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX body_measurements_user_date_idx ON public.body_measurements (user_id, measured_on DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.body_measurements TO authenticated;
GRANT ALL ON public.body_measurements TO service_role;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "measurements_own" ON public.body_measurements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.challenge_participants ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.challenge_participants ADD COLUMN IF NOT EXISTS avatar_url text;
CREATE POLICY "participants_leaderboard" ON public.challenge_participants FOR SELECT TO authenticated USING (true);
