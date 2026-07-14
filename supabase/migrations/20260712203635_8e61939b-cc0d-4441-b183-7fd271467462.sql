
CREATE POLICY "Users upload own avatar to site-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-images'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Users update own avatar in site-images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'site-images'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Users delete own avatar in site-images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'site-images'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);
