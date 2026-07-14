ALTER TABLE public.challenge_rewards
  ADD COLUMN IF NOT EXISTS code_kind text NOT NULL DEFAULT 'self_discount',
  ADD COLUMN IF NOT EXISTS applies_to text NOT NULL DEFAULT 'subscription',
  ADD COLUMN IF NOT EXISTS redeemed_by_user_id uuid;

ALTER TABLE public.challenge_rewards
  DROP CONSTRAINT IF EXISTS challenge_rewards_code_kind_check;
ALTER TABLE public.challenge_rewards
  ADD CONSTRAINT challenge_rewards_code_kind_check
  CHECK (code_kind IN ('self_discount', 'friend_share'));

ALTER TABLE public.challenge_rewards
  DROP CONSTRAINT IF EXISTS challenge_rewards_applies_to_check;
ALTER TABLE public.challenge_rewards
  ADD CONSTRAINT challenge_rewards_applies_to_check
  CHECK (applies_to IN ('subscription', 'any'));

DROP POLICY IF EXISTS "Redeemer can view shared reward" ON public.challenge_rewards;
CREATE POLICY "Redeemer can view shared reward"
  ON public.challenge_rewards FOR SELECT
  TO authenticated
  USING (code_kind = 'friend_share');