
-- Revoke public/anon EXECUTE on SECURITY DEFINER functions; grant only to needed roles.
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_activity_feed(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_activity_feed(integer) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_challenge_participant_count(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_challenge_participant_count(text) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_challenge_leaderboard(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_challenge_leaderboard(text, integer) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_room_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_room_member(uuid, uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_room_owner(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_room_owner(uuid, uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer) TO authenticated, service_role;

-- Email/queue infrastructure functions: only service_role/cron.
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;

REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO service_role;

REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;

-- Allow signed-in users to view the shared activity feed (non-sensitive social feed).
CREATE POLICY "Authenticated can view activity feed"
  ON public.activity_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow signed-in users to view challenge leaderboard entries (non-sensitive).
CREATE POLICY "Authenticated can view challenge leaderboard"
  ON public.challenge_participants
  FOR SELECT
  TO authenticated
  USING (true);
