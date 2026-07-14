
-- 1) push_subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth TEXT,
  platform TEXT NOT NULL DEFAULT 'web',
  timezone TEXT,
  streak_reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON public.push_subscriptions(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own push subscriptions"
  ON public.push_subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2) Streak helper RPC
CREATE OR REPLACE FUNCTION public.get_my_streak(days_back INT DEFAULT 120)
RETURNS TABLE(current_streak INT, longest_streak INT, last_logged_date DATE, days_this_week INT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT 0, 0, NULL::DATE, 0;
    RETURN;
  END IF;

  RETURN QUERY
  WITH day_set AS (
    SELECT DISTINCT (created_at AT TIME ZONE 'UTC')::DATE AS d
    FROM public.activity_events
    WHERE user_id = uid
      AND kind = 'program_day'
      AND created_at >= (now() - make_interval(days => GREATEST(1, days_back)))
  ),
  ordered AS (
    SELECT d, ROW_NUMBER() OVER (ORDER BY d DESC) AS rn
    FROM day_set
  ),
  streak_calc AS (
    SELECT d, rn, (CURRENT_DATE - (rn - 1)) AS expected
    FROM ordered
  ),
  cur AS (
    SELECT COUNT(*)::INT AS cnt
    FROM streak_calc
    WHERE d = expected
      AND rn <= (SELECT MIN(rn) FROM streak_calc WHERE d <> expected)
  ),
  cur_fallback AS (
    -- If every logged day matches (no gaps), the CTE above returns 0; use all rows.
    SELECT CASE WHEN (SELECT COUNT(*) FROM streak_calc WHERE d <> expected) = 0
                THEN (SELECT COUNT(*) FROM streak_calc)::INT
                ELSE (SELECT cnt FROM cur)
           END AS cnt
  ),
  runs AS (
    SELECT d - (ROW_NUMBER() OVER (ORDER BY d))::INT AS grp
    FROM day_set
  ),
  longest AS (
    SELECT COALESCE(MAX(c), 0)::INT AS cnt
    FROM (SELECT COUNT(*) AS c FROM runs GROUP BY grp) x
  ),
  week_start AS (
    SELECT (CURRENT_DATE - ((EXTRACT(ISODOW FROM CURRENT_DATE)::INT - 1)))::DATE AS d
  ),
  this_week AS (
    SELECT COUNT(*)::INT AS cnt FROM day_set, week_start WHERE day_set.d >= week_start.d
  )
  SELECT
    (SELECT cnt FROM cur_fallback),
    (SELECT cnt FROM longest),
    (SELECT MAX(d) FROM day_set),
    (SELECT cnt FROM this_week);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_streak(INT) TO authenticated;
