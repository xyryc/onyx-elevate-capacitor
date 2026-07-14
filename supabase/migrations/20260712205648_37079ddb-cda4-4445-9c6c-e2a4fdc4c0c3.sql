
-- Revoke public/anon EXECUTE on SECURITY DEFINER functions; grant only to intended roles.

-- Auth-only user helpers
REVOKE ALL ON FUNCTION public.get_my_streak(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_streak(integer) TO authenticated;

REVOKE ALL ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.is_room_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_room_member(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_room_owner(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_room_owner(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer) TO authenticated;

REVOKE ALL ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer, text) TO authenticated;

-- Public read helpers (leaderboard/feed/participant count) — allow anon since app uses them for public views
REVOKE ALL ON FUNCTION public.get_activity_feed(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_activity_feed(integer) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_challenge_participant_count(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_challenge_participant_count(text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_challenge_leaderboard(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_challenge_leaderboard(text, integer) TO anon, authenticated;

-- Trigger + internal functions — service_role / postgres only
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
