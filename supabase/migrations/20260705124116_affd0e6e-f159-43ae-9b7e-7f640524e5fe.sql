
-- =========================================================================
-- 1. Tables
-- =========================================================================

CREATE TABLE public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('group','dm')),
  name text,
  avatar_url text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_members (
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);
CREATE INDEX chat_members_user_id_idx ON public.chat_members(user_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text,
  image_path text,
  attachment jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
CREATE INDEX chat_messages_room_created_idx ON public.chat_messages(room_id, created_at DESC);

CREATE TABLE public.chat_reactions (
  message_id uuid NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id, emoji)
);
CREATE INDEX chat_reactions_message_idx ON public.chat_reactions(message_id);

-- =========================================================================
-- 2. Grants
-- =========================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_rooms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_reactions TO authenticated;
GRANT ALL ON public.chat_rooms TO service_role;
GRANT ALL ON public.chat_members TO service_role;
GRANT ALL ON public.chat_messages TO service_role;
GRANT ALL ON public.chat_reactions TO service_role;

-- =========================================================================
-- 3. Helper (security definer avoids RLS recursion on chat_members)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.is_room_member(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_members
    WHERE room_id = _room_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_room_owner(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_members
    WHERE room_id = _room_id AND user_id = _user_id AND role = 'owner'
  );
$$;

-- =========================================================================
-- 4. Row-level security
-- =========================================================================
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_reactions ENABLE ROW LEVEL SECURITY;

-- chat_rooms: members can read; anyone signed in can create (server fn checks premium);
-- only owners can update/delete
CREATE POLICY "rooms_select_members" ON public.chat_rooms FOR SELECT TO authenticated
  USING (public.is_room_member(id, auth.uid()));
CREATE POLICY "rooms_insert_self" ON public.chat_rooms FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "rooms_update_owner" ON public.chat_rooms FOR UPDATE TO authenticated
  USING (public.is_room_owner(id, auth.uid()))
  WITH CHECK (public.is_room_owner(id, auth.uid()));
CREATE POLICY "rooms_delete_owner" ON public.chat_rooms FOR DELETE TO authenticated
  USING (public.is_room_owner(id, auth.uid()));

-- chat_members: users see rows of rooms they are in; owners add/remove; users can update
-- their own membership (last_read_at) and leave rooms
CREATE POLICY "members_select_same_room" ON public.chat_members FOR SELECT TO authenticated
  USING (public.is_room_member(room_id, auth.uid()));
CREATE POLICY "members_insert_owner_or_self_new_room" ON public.chat_members FOR INSERT TO authenticated
  WITH CHECK (
    -- Creator adding themselves as owner right after creating a room
    (user_id = auth.uid() AND EXISTS (
      SELECT 1 FROM public.chat_rooms r
      WHERE r.id = room_id AND r.created_by = auth.uid()
    ))
    OR public.is_room_owner(room_id, auth.uid())
  );
CREATE POLICY "members_update_self" ON public.chat_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "members_delete_owner_or_self" ON public.chat_members FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_room_owner(room_id, auth.uid()));

-- chat_messages: members read; members insert as themselves; only sender edits/deletes own
CREATE POLICY "messages_select_members" ON public.chat_messages FOR SELECT TO authenticated
  USING (public.is_room_member(room_id, auth.uid()));
CREATE POLICY "messages_insert_members" ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.is_room_member(room_id, auth.uid()));
CREATE POLICY "messages_update_sender" ON public.chat_messages FOR UPDATE TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());
CREATE POLICY "messages_delete_sender" ON public.chat_messages FOR DELETE TO authenticated
  USING (sender_id = auth.uid());

-- chat_reactions: members read; users toggle their own
CREATE POLICY "reactions_select_members" ON public.chat_reactions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.chat_messages m
    WHERE m.id = message_id AND public.is_room_member(m.room_id, auth.uid())
  ));
CREATE POLICY "reactions_insert_self" ON public.chat_reactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.chat_messages m
    WHERE m.id = message_id AND public.is_room_member(m.room_id, auth.uid())
  ));
CREATE POLICY "reactions_delete_self" ON public.chat_reactions FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- =========================================================================
-- 5. updated_at triggers
-- =========================================================================
CREATE TRIGGER chat_rooms_set_updated_at
  BEFORE UPDATE ON public.chat_rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- 6. Realtime
-- =========================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_members;

-- Ensure full row data is emitted for UPDATE/DELETE events
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.chat_members REPLICA IDENTITY FULL;

-- =========================================================================
-- 7. Read profiles of chat participants (avatar + display name)
-- Currently profiles RLS restricts SELECT to the owner. Add a policy to let
-- users read profiles of people they share a chat room with.
-- =========================================================================
CREATE POLICY "profiles_select_chat_peers" ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.chat_members m1
      JOIN public.chat_members m2 ON m1.room_id = m2.room_id
      WHERE m1.user_id = auth.uid()
        AND m2.user_id = profiles.id
    )
  );
