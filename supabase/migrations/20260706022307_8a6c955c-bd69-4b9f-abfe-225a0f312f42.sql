-- Drop overly-broad SELECT policies. Public reads for the shared feed and
-- leaderboard already go through SECURITY DEFINER functions
-- (get_activity_feed, get_challenge_leaderboard) which return only the safe
-- projected columns. Owner-only policies on the base tables remain in place.

DROP POLICY IF EXISTS "Authenticated can view activity feed" ON public.activity_events;
DROP POLICY IF EXISTS "Authenticated can view challenge leaderboard" ON public.challenge_participants;