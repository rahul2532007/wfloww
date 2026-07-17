
-- 1. businesses: add ownership + simple activation window
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS activated_at timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_owner_user_id_key
  ON public.businesses(owner_user_id) WHERE owner_user_id IS NOT NULL;

-- Link existing business to the former management user so nothing is orphaned
UPDATE public.businesses
   SET owner_user_id = 'cebd71f8-228d-4737-847e-963501587abd'
 WHERE id = 'a1050c29-42d7-40e8-8fcd-b2e8445d6f68'
   AND owner_user_id IS NULL;

-- 2. Drop legacy staff-scoped policies that reference profiles.role/business_id
DROP POLICY IF EXISTS "Staff update own business bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff insert own business bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff view own business bookings"   ON public.bookings;
DROP POLICY IF EXISTS "Staff view own business"            ON public.businesses;
DROP POLICY IF EXISTS "Staff views own business services"  ON public.services;
DROP POLICY IF EXISTS "Admin manages services"             ON public.services;
DROP POLICY IF EXISTS "Staff views own business slots"     ON public.slots;
DROP POLICY IF EXISTS "Admin manages slots"                ON public.slots;
DROP POLICY IF EXISTS "Admin deletes bookings"             ON public.bookings;
DROP POLICY IF EXISTS "User views own profile"             ON public.profiles;
DROP POLICY IF EXISTS "Admin manages profiles"             ON public.profiles;

-- 3. profiles: strip staff fields, add owner-oriented fields
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS username,
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS business_id,
  DROP COLUMN IF EXISTS is_active,
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Backfill email cache from auth.users
UPDATE public.profiles p
   SET email = u.email
  FROM auth.users u
 WHERE u.id = p.id AND p.email IS NULL;

-- 4. Prune non-admin user_roles rows (staff concept removed)
DELETE FROM public.user_roles WHERE role <> 'admin';

-- 5. Rewrite current_business_id() to derive from ownership
CREATE OR REPLACE FUNCTION private.current_business_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.businesses WHERE owner_user_id = auth.uid() LIMIT 1;
$$;

-- 6. New RLS policies (owner-scoped + admin)

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR private.is_admin(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Admin manages profiles" ON public.profiles
  FOR ALL USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()));

-- businesses
CREATE POLICY "Owner views own business" ON public.businesses
  FOR SELECT USING (owner_user_id = auth.uid() OR private.is_admin(auth.uid()));
CREATE POLICY "Owner updates own business" ON public.businesses
  FOR UPDATE USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "Owner inserts own business" ON public.businesses
  FOR INSERT WITH CHECK (owner_user_id = auth.uid());

-- services
CREATE POLICY "Owner manages own services" ON public.services
  FOR ALL
  USING (private.is_admin(auth.uid()) OR business_id = private.current_business_id())
  WITH CHECK (private.is_admin(auth.uid()) OR business_id = private.current_business_id());

-- slots
CREATE POLICY "Owner manages own slots" ON public.slots
  FOR ALL
  USING (private.is_admin(auth.uid()) OR business_id = private.current_business_id())
  WITH CHECK (private.is_admin(auth.uid()) OR business_id = private.current_business_id());

-- bookings
CREATE POLICY "Owner views own business bookings" ON public.bookings
  FOR SELECT
  USING (private.is_admin(auth.uid()) OR business_id = private.current_business_id());
CREATE POLICY "Owner inserts own business bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    private.is_admin(auth.uid()) OR (
      business_id = private.current_business_id()
      AND EXISTS (
        SELECT 1 FROM public.businesses b
         WHERE b.id = bookings.business_id AND b.is_active = true AND b.manual_lock = false
      )
    )
  );
CREATE POLICY "Owner updates own business bookings" ON public.bookings
  FOR UPDATE
  USING (private.is_admin(auth.uid()) OR business_id = private.current_business_id())
  WITH CHECK (private.is_admin(auth.uid()) OR business_id = private.current_business_id());
CREATE POLICY "Owner deletes own business bookings" ON public.bookings
  FOR DELETE
  USING (private.is_admin(auth.uid()) OR business_id = private.current_business_id());

-- 7. activation_requests table
CREATE TABLE public.activation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  message text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.activation_requests TO authenticated;
GRANT ALL ON public.activation_requests TO service_role;

ALTER TABLE public.activation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner views own activation requests" ON public.activation_requests
  FOR SELECT USING (requested_by = auth.uid() OR private.is_admin(auth.uid()));
CREATE POLICY "Owner creates activation requests" ON public.activation_requests
  FOR INSERT WITH CHECK (
    requested_by = auth.uid()
    AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid())
  );
CREATE POLICY "Admin updates activation requests" ON public.activation_requests
  FOR UPDATE USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()));
CREATE POLICY "Admin deletes activation requests" ON public.activation_requests
  FOR DELETE USING (private.is_admin(auth.uid()));

CREATE TRIGGER activation_requests_set_updated_at
  BEFORE UPDATE ON public.activation_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER businesses_set_updated_at2
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
