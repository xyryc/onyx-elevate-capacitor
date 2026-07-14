
-- 1) Move has_role into a private schema so it is not callable via the Data API
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO postgres, service_role;

-- 2) Repoint policies that referenced public.has_role
DROP POLICY IF EXISTS "Admins write image overrides" ON public.image_overrides;
CREATE POLICY "Admins write image overrides"
ON public.image_overrides
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write site-images" ON storage.objects;
CREATE POLICY "Admins write site-images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Drop the public-schema function now that nothing references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 4) Explicit safeguard on user_roles: block writes from anon/authenticated.
-- RLS already blocks writes (no INSERT/UPDATE/DELETE policies exist), but we
-- add restrictive policies so the intent is documented and enforced even if
-- a permissive policy is added later.
CREATE POLICY "Block role writes from clients - insert"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block role writes from clients - update"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block role writes from clients - delete"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);
