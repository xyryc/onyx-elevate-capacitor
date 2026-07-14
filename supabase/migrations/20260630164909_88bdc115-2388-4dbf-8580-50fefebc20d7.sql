REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Storage policies for site-images
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;
CREATE POLICY "Public read site-images" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admins write site-images" ON storage.objects;
CREATE POLICY "Admins write site-images" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(),'admin'));