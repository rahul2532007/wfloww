
-- =========================================================
-- 2. businesses.currency
-- =========================================================
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR';

-- =========================================================
-- 3. bookings payment fields
-- =========================================================
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS amount_paid numeric(10,2),
  ADD COLUMN IF NOT EXISTS payment_method text
    CHECK (payment_method IN ('cash','card','upi','other'));

-- =========================================================
-- 4. slots: single day_of_week + backfill from days_of_week jsonb
-- =========================================================
ALTER TABLE public.slots
  ADD COLUMN IF NOT EXISTS day_of_week smallint
    CHECK (day_of_week BETWEEN 0 AND 6);

-- Expand rows: for each existing slot with multiple days, insert extra rows,
-- then set day_of_week on the original row to the first day in the array.
DO $$
DECLARE
  r record;
  d int;
  first_day int;
BEGIN
  FOR r IN SELECT * FROM public.slots WHERE day_of_week IS NULL LOOP
    first_day := NULL;
    FOR d IN SELECT (v)::int FROM jsonb_array_elements_text(r.days_of_week) v LOOP
      IF first_day IS NULL THEN
        first_day := d;
      ELSE
        INSERT INTO public.slots (business_id, name, start_time, end_time, days_of_week, max_capacity, is_active, day_of_week)
        VALUES (r.business_id, r.name, r.start_time, r.end_time, to_jsonb(ARRAY[d]), r.max_capacity, r.is_active, d);
      END IF;
    END LOOP;
    IF first_day IS NULL THEN
      first_day := 1; -- default to Monday if empty array
    END IF;
    UPDATE public.slots
      SET day_of_week = first_day,
          days_of_week = to_jsonb(ARRAY[first_day])
      WHERE id = r.id;
  END LOOP;
END $$;

-- Enforce non-null going forward
ALTER TABLE public.slots
  ALTER COLUMN day_of_week SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_slots_business_day ON public.slots(business_id, day_of_week) WHERE is_active;

-- =========================================================
-- 5. doctor_invites table
-- =========================================================
CREATE TABLE IF NOT EXISTS public.doctor_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email text NOT NULL,
  token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','revoked','expired')),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctor_invites_business ON public.doctor_invites(business_id);
CREATE INDEX IF NOT EXISTS idx_doctor_invites_email ON public.doctor_invites(email);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_invites TO authenticated;
GRANT ALL ON public.doctor_invites TO service_role;

ALTER TABLE public.doctor_invites ENABLE ROW LEVEL SECURITY;

-- Admin manages all invites; business owner reads their own
CREATE POLICY "Admin manages doctor_invites" ON public.doctor_invites
  FOR ALL TO authenticated
  USING (private.is_admin(auth.uid()))
  WITH CHECK (private.is_admin(auth.uid()));

CREATE POLICY "Owner views own business invites" ON public.doctor_invites
  FOR SELECT TO authenticated
  USING (business_id = private.current_business_id());

CREATE TRIGGER doctor_invites_set_updated_at
  BEFORE UPDATE ON public.doctor_invites
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- 6. Public RPC: fetch invite by token (anon-safe, minimal fields)
-- =========================================================
CREATE OR REPLACE FUNCTION public.get_doctor_invite_by_token(_token uuid)
RETURNS TABLE(email text, business_name text, status text, expires_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT di.email, b.name AS business_name, di.status, di.expires_at
  FROM public.doctor_invites di
  JOIN public.businesses b ON b.id = di.business_id
  WHERE di.token = _token;
$$;

GRANT EXECUTE ON FUNCTION public.get_doctor_invite_by_token(uuid) TO anon, authenticated;

-- =========================================================
-- 7. Accept doctor invite RPC (auth required)
-- =========================================================
CREATE OR REPLACE FUNCTION public.accept_doctor_invite(_token uuid, _display_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.doctor_invites%ROWTYPE;
  v_uid uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_invite FROM public.doctor_invites WHERE token = _token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invalid invite'; END IF;
  IF v_invite.status <> 'pending' THEN RAISE EXCEPTION 'Invite is not pending'; END IF;
  IF v_invite.expires_at < now() THEN RAISE EXCEPTION 'Invite expired'; END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  IF lower(v_email) <> lower(v_invite.email) THEN
    RAISE EXCEPTION 'Signed-in email does not match invite';
  END IF;

  INSERT INTO public.profiles (id, email, display_name)
  VALUES (v_uid, v_email, _display_name)
  ON CONFLICT (id) DO UPDATE SET display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name);

  INSERT INTO public.user_roles (user_id, role, business_id)
  VALUES (v_uid, 'doctor', v_invite.business_id)
  ON CONFLICT (user_id, role) DO UPDATE SET business_id = EXCLUDED.business_id;

  UPDATE public.doctor_invites
    SET status = 'accepted', accepted_user_id = v_uid, updated_at = now()
    WHERE id = v_invite.id;

  RETURN v_invite.business_id;
END $$;

GRANT EXECUTE ON FUNCTION public.accept_doctor_invite(uuid, text) TO authenticated;

-- =========================================================
-- 8. Doctor helpers + RLS updates
-- =========================================================
CREATE OR REPLACE FUNCTION private.current_doctor_business_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_id FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'doctor'
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION private.is_doctor_of(_business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'doctor' AND business_id = _business_id
  );
$$;

-- Extend bookings SELECT for doctors of that business
DROP POLICY IF EXISTS "Owner views own business bookings" ON public.bookings;
CREATE POLICY "Owner or doctor views business bookings" ON public.bookings
  FOR SELECT
  USING (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
    OR private.is_doctor_of(business_id)
  );

DROP POLICY IF EXISTS "Owner updates own business bookings" ON public.bookings;
CREATE POLICY "Owner or doctor updates business bookings" ON public.bookings
  FOR UPDATE
  USING (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
    OR private.is_doctor_of(business_id)
  )
  WITH CHECK (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
    OR private.is_doctor_of(business_id)
  );

-- Slots and services SELECT: allow doctors of that business
DROP POLICY IF EXISTS "Owner manages own slots" ON public.slots;
CREATE POLICY "Owner manages own slots" ON public.slots
  FOR ALL
  USING (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
  )
  WITH CHECK (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
  );

CREATE POLICY "Doctor views business slots" ON public.slots
  FOR SELECT TO authenticated
  USING (private.is_doctor_of(business_id));

DROP POLICY IF EXISTS "Owner manages own services" ON public.services;
CREATE POLICY "Owner manages own services" ON public.services
  FOR ALL
  USING (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
  )
  WITH CHECK (
    private.is_admin(auth.uid())
    OR business_id = private.current_business_id()
  );

CREATE POLICY "Doctor views business services" ON public.services
  FOR SELECT TO authenticated
  USING (private.is_doctor_of(business_id));

-- Businesses: doctor can read their own business
DROP POLICY IF EXISTS "Owner views own business" ON public.businesses;
CREATE POLICY "Owner or doctor views own business" ON public.businesses
  FOR SELECT
  USING (
    owner_user_id = auth.uid()
    OR private.is_admin(auth.uid())
    OR private.is_doctor_of(id)
  );
