-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Image overrides
CREATE TABLE IF NOT EXISTS public.image_overrides (
  slot_key text PRIMARY KEY,
  image_url text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.image_overrides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.image_overrides TO authenticated;
GRANT ALL ON public.image_overrides TO service_role;
ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read image overrides" ON public.image_overrides;
CREATE POLICY "Public read image overrides" ON public.image_overrides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins write image overrides" ON public.image_overrides;
CREATE POLICY "Admins write image overrides" ON public.image_overrides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS image_overrides_updated_at ON public.image_overrides;
CREATE TRIGGER image_overrides_updated_at BEFORE UPDATE ON public.image_overrides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();