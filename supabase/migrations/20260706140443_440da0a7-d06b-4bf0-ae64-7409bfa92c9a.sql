ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS active_session_id text,
  ADD COLUMN IF NOT EXISTS active_session_at timestamptz;