
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_business_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.next_token_number(UUID, UUID, DATE) FROM PUBLIC, anon, authenticated;

-- Allow token allocator to be called by anon (public booking) and authenticated (staff walk-in).
GRANT EXECUTE ON FUNCTION public.next_token_number(UUID, UUID, DATE) TO anon, authenticated;

-- has_role / is_admin / current_business_id are only used inside RLS policies (executed by definer/postgres role) — no direct client access needed.
