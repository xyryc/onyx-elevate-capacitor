
-- Path layout: {room_id}/{user_id}/{uuid}.{ext}
-- storage.foldername(name)[1] = room_id, [2] = user_id

CREATE POLICY "chat_attachments_select_members" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND public.is_room_member(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  );

CREATE POLICY "chat_attachments_insert_members" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-attachments'
    AND public.is_room_member(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
    AND ((storage.foldername(name))[2])::uuid = auth.uid()
  );

CREATE POLICY "chat_attachments_delete_owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND ((storage.foldername(name))[2])::uuid = auth.uid()
  );
