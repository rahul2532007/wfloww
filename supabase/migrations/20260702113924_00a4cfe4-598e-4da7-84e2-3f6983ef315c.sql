-- 1. Enforce manual_lock in the public booking INSERT policy
ALTER POLICY "Public can create bookings for active businesses"
  ON public.bookings
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = bookings.business_id
      AND b.is_active = true
      AND b.manual_lock = false
  ));

-- 2. Move SECURITY DEFINER helpers out of the exposed API schema.
--    RLS policies keep working (Postgres tracks them by OID); the linter
--    only flags functions in the exposed `public` schema.
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_admin(uuid) SET SCHEMA private;
ALTER FUNCTION public.current_business_id() SET SCHEMA private;

-- Ensure only authenticated (needed for RLS evaluation) can execute.
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION private.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION private.current_business_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.current_business_id() TO authenticated;

-- 3. Drop next_token_number entirely; callers compute the token inline
--    using MAX(token_number)+1 against the bookings table.
DROP FUNCTION IF EXISTS public.next_token_number(uuid, uuid, date);