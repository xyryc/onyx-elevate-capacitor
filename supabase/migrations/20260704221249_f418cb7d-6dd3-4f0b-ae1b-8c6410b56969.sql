
CREATE TABLE public.user_trusted_devices (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_hash text NOT NULL,
  label text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, device_hash)
);
GRANT ALL ON public.user_trusted_devices TO service_role;
ALTER TABLE public.user_trusted_devices ENABLE ROW LEVEL SECURITY;
-- No client policies; access is only via privileged server functions.

CREATE TABLE public.user_device_challenges (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_hash text NOT NULL,
  code_hash text NOT NULL,
  label text,
  attempts int NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, device_hash)
);
GRANT ALL ON public.user_device_challenges TO service_role;
ALTER TABLE public.user_device_challenges ENABLE ROW LEVEL SECURITY;
