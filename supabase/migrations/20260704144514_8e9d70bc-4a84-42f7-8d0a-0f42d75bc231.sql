
-- Undo prior attempt
DROP VIEW IF EXISTS public.public_reviews;
DROP VIEW IF EXISTS public.public_image_overrides;
DROP POLICY IF EXISTS "reviews_select_public_content" ON public.reviews;
DROP POLICY IF EXISTS "reviews_select_own" ON public.reviews;
DROP POLICY IF EXISTS "Admins read image overrides" ON public.image_overrides;

-- Reviews: content is public across the app, but reviewer identity is hidden.
CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);

REVOKE SELECT ON public.reviews FROM anon, authenticated;
GRANT SELECT (id, product_kind, product_slug, rating, title, body, created_at, updated_at)
  ON public.reviews TO anon, authenticated;
-- Owners still write/delete their own rows via existing INSERT/UPDATE/DELETE policies
-- (RLS predicates on user_id do not require column SELECT grant).
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

-- Image overrides: public reads keep working but updated_by is hidden.
CREATE POLICY "Public read image overrides"
  ON public.image_overrides FOR SELECT
  TO anon, authenticated
  USING (true);

REVOKE SELECT ON public.image_overrides FROM anon, authenticated;
GRANT SELECT (slot_key, image_url, updated_at)
  ON public.image_overrides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.image_overrides TO authenticated;
GRANT ALL ON public.image_overrides TO service_role;
