DROP POLICY IF EXISTS "Redeemer can view shared reward" ON public.challenge_rewards;
CREATE POLICY "Redeemer can view shared reward"
ON public.challenge_rewards
FOR SELECT
TO authenticated
USING (code_kind = 'friend_share' AND redeemed_by_user_id = auth.uid());