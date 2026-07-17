-- SECURITY DEFINER functions receive EXECUTE from PUBLIC by default. Keep the
-- invite preview public, but require an authenticated session to accept it and
-- keep the RLS event-trigger implementation off the Data API.
REVOKE EXECUTE ON FUNCTION public.accept_doctor_invite(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_doctor_invite(uuid, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
