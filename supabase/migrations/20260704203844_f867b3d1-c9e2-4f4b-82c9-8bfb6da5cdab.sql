
-- Lock down SECURITY DEFINER functions: revoke from PUBLIC, grant only where needed.

REVOKE ALL ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_activity_feed(integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_challenge_leaderboard(text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_challenge_participant_count(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Re-grant to authenticated for functions the app calls via RPC
GRANT EXECUTE ON FUNCTION public.get_activity_feed(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_challenge_leaderboard(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_challenge_participant_count(text) TO authenticated;
