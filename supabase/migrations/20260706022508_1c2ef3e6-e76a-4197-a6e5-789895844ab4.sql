CREATE OR REPLACE FUNCTION public.claim_ai_coach_slot(
  _user_id uuid,
  _daily_limit integer,
  _throttle_seconds integer,
  _timezone text DEFAULT 'UTC'
)
RETURNS TABLE(ok boolean, reason text, new_count integer, seconds_until_ok integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  tz text := COALESCE(NULLIF(_timezone, ''), 'UTC');
  today date;
  existing_count int;
  existing_last timestamptz;
  wait_secs int;
BEGIN
  -- Compute "today" in the caller's local timezone. Fall back to UTC if the
  -- provided timezone is not recognized by Postgres.
  BEGIN
    today := (now() AT TIME ZONE tz)::date;
  EXCEPTION WHEN OTHERS THEN
    today := (now() AT TIME ZONE 'UTC')::date;
  END;

  INSERT INTO public.ai_chat_usage (user_id, usage_date, message_count, last_message_at)
  VALUES (_user_id, today, 0, NULL)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  SELECT message_count, last_message_at
    INTO existing_count, existing_last
  FROM public.ai_chat_usage
  WHERE user_id = _user_id AND usage_date = today
  FOR UPDATE;

  IF existing_count >= _daily_limit THEN
    RETURN QUERY SELECT false, 'limit'::text, existing_count, 0;
    RETURN;
  END IF;

  IF existing_last IS NOT NULL THEN
    wait_secs := _throttle_seconds - EXTRACT(EPOCH FROM (now() - existing_last))::int;
    IF wait_secs > 0 THEN
      RETURN QUERY SELECT false, 'throttle'::text, existing_count, wait_secs;
      RETURN;
    END IF;
  END IF;

  UPDATE public.ai_chat_usage
  SET message_count = message_count + 1,
      last_message_at = now()
  WHERE user_id = _user_id AND usage_date = today;

  RETURN QUERY SELECT true, 'ok'::text, existing_count + 1, 0;
END;
$function$;

-- Keep the same execution scope as before: authenticated + service_role only.
REVOKE EXECUTE ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_ai_coach_slot(uuid, integer, integer, text) TO authenticated, service_role;