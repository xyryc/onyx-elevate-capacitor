DROP POLICY IF EXISTS members_insert_owner_or_self_new_room ON public.chat_members;

-- Users can only add themselves as a member (self-join), unless they are creating
-- a brand-new room they own. Room owners can no longer force-add arbitrary users;
-- invite flows should insert self-membership after the invitee accepts.
CREATE POLICY members_insert_self_only
ON public.chat_members
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    -- self-join a room the current user owns/created
    EXISTS (
      SELECT 1 FROM public.chat_rooms r
      WHERE r.id = chat_members.room_id AND r.created_by = auth.uid()
    )
    -- or self-join any room (accepting an invite / joining a room)
    OR TRUE
  )
);