
-- 1) Lock down challenge_rewards updates to specific columns via column-level grants
REVOKE UPDATE ON public.challenge_rewards FROM authenticated;
GRANT UPDATE(redeemed_at, redeemed_for_slug) ON public.challenge_rewards TO authenticated;

-- 2) Drop email column from profiles (authoritative copy lives in auth.users)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- 3) Update handle_new_user to no longer write email into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NULLIF(NEW.raw_user_meta_data->>'preferred_language', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET preferred_language = COALESCE(public.profiles.preferred_language, EXCLUDED.preferred_language);
  RETURN NEW;
END;
$function$;
