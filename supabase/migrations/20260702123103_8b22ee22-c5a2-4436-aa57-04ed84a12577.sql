
-- 1) Bookings SELECT: add explicit NOT NULL guard on current_business_id()
DROP POLICY IF EXISTS "Staff view own business bookings" ON public.bookings;
CREATE POLICY "Staff view own business bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  private.is_admin(auth.uid())
  OR (
    private.current_business_id() IS NOT NULL
    AND business_id = private.current_business_id()
  )
);

-- 2) user_roles: explicit admin-only write policies (defense in depth)
DROP POLICY IF EXISTS "Admins insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins update user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins delete user_roles" ON public.user_roles;

CREATE POLICY "Admins insert user_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin(auth.uid()));

CREATE POLICY "Admins update user_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

CREATE POLICY "Admins delete user_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (private.is_admin(auth.uid()));
