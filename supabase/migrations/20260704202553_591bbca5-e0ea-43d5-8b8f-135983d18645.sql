
-- 1) activity_events: replace public SELECT with owner-only + explicit no-update
DROP POLICY IF EXISTS "activity_select_all" ON public.activity_events;

CREATE POLICY "activity_select_own"
  ON public.activity_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "activity_no_update"
  ON public.activity_events FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Safe public feed function — returns only feed-safe columns
CREATE OR REPLACE FUNCTION public.get_activity_feed(feed_limit integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  display_name text,
  avatar_url text,
  kind text,
  title text,
  detail text,
  item_slug text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, display_name, avatar_url, kind, title, detail, item_slug, created_at
  FROM public.activity_events
  ORDER BY created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(feed_limit, 50), 200));
$$;

REVOKE ALL ON FUNCTION public.get_activity_feed(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_activity_feed(integer) TO authenticated;

-- 2) challenge_participants: drop public leaderboard SELECT; owner-only remains via participants_own (FOR ALL)
DROP POLICY IF EXISTS "participants_leaderboard" ON public.challenge_participants;

-- Safe leaderboard function — exposes only leaderboard columns for a specific challenge
CREATE OR REPLACE FUNCTION public.get_challenge_leaderboard(slug text, lim integer DEFAULT 25)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  progress integer,
  completed_at timestamptz,
  joined_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, display_name, avatar_url, progress, completed_at, joined_at
  FROM public.challenge_participants
  WHERE challenge_slug = slug
  ORDER BY progress DESC, completed_at ASC NULLS LAST
  LIMIT GREATEST(1, LEAST(COALESCE(lim, 25), 200));
$$;

REVOKE ALL ON FUNCTION public.get_challenge_leaderboard(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_challenge_leaderboard(text, integer) TO authenticated;

-- Safe participant count for a challenge
CREATE OR REPLACE FUNCTION public.get_challenge_participant_count(slug text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.challenge_participants WHERE challenge_slug = slug;
$$;

REVOKE ALL ON FUNCTION public.get_challenge_participant_count(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_challenge_participant_count(text) TO authenticated;
