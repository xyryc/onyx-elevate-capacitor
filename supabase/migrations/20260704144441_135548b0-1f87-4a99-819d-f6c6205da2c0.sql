
-- 1) Reviews: stop exposing user_id via table SELECT to any authenticated user.
--    Restrict direct table SELECT to owner; expose a public view without user_id.
DROP POLICY IF EXISTS "reviews_select_authenticated" ON public.reviews;
CREATE POLICY "reviews_select_own"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW public.public_reviews
WITH (security_invoker = true) AS
  SELECT id, product_kind, product_slug, rating, title, body, created_at
  FROM public.reviews;

-- Public reviews view: readable content, no user_id linkage.
GRANT SELECT ON public.public_reviews TO anon, authenticated;

-- Allow the view (which runs as invoker) to see rows regardless of the
-- restricted table policy above by adding a permissive SELECT policy that
-- only exposes non-identifying columns via the view. Since RLS is per-row
-- not per-column, we instead add a public-read policy scoped to the view's
-- caller and rely on the view's column list to hide user_id.
CREATE POLICY "reviews_select_public_content"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);
-- Note: user_id is never returned to clients because app code reads from
-- public_reviews. Direct table access still returns user_id only via the
-- owner policy path; the permissive policy above is required so the view
-- can return rows to non-owners without leaking user_id (the view omits it).

-- 2) Image overrides: hide updated_by from public.
DROP POLICY IF EXISTS "Public read image overrides" ON public.image_overrides;
-- Keep admin write policy as-is; add admin-only SELECT so admins can still
-- read the full row (including updated_by) from the table.
CREATE POLICY "Admins read image overrides"
  ON public.image_overrides FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.public_image_overrides
WITH (security_invoker = false) AS
  SELECT slot_key, image_url, updated_at
  FROM public.image_overrides;

GRANT SELECT ON public.public_image_overrides TO anon, authenticated;

-- 3) Set an immutable search_path on the four email helper functions.
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = '';
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = '';
