-- Explicitly forbid all client-side writes on invite_codes.
-- All creation/redemption goes through service_role in server functions.
REVOKE INSERT, UPDATE, DELETE ON public.invite_codes FROM authenticated, anon;

CREATE POLICY "invite_codes_no_client_insert" ON public.invite_codes
  FOR INSERT TO authenticated, anon WITH CHECK (false);

CREATE POLICY "invite_codes_no_client_update" ON public.invite_codes
  FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);

CREATE POLICY "invite_codes_no_client_delete" ON public.invite_codes
  FOR DELETE TO authenticated, anon USING (false);