
-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE public.business_type AS ENUM ('clinic', 'salon', 'consulting');
CREATE TYPE public.plan_type AS ENUM ('trial', 'monthly', 'yearly');
CREATE TYPE public.app_role AS ENUM ('reception', 'management', 'admin');
CREATE TYPE public.booking_status AS ENUM ('booked', 'arrived', 'ongoing', 'completed', 'no_show', 'cancelled');

-- =========================================================================
-- BUSINESSES
-- =========================================================================
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.business_type NOT NULL,
  plan public.plan_type NOT NULL DEFAULT 'trial',
  plan_start DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  manual_lock BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- PROFILES (1:1 with auth.users)
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  role public.app_role NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- USER ROLES (dedicated table for secure role checks)
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- HELPER FUNCTIONS
-- =========================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_business_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid();
$$;

-- =========================================================================
-- SLOTS
-- =========================================================================
CREATE TABLE public.slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week JSONB NOT NULL DEFAULT '[0,1,2,3,4,5,6]'::jsonb,
  max_capacity INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.slots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.slots TO authenticated;
GRANT ALL ON public.slots TO service_role;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- SERVICES
-- =========================================================================
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- BOOKINGS
-- =========================================================================
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE RESTRICT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  token_number INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'booked',
  is_walkin BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, slot_id, date, token_number)
);
GRANT SELECT, INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_bookings_bsd ON public.bookings (business_id, slot_id, date);
CREATE INDEX idx_bookings_business_date ON public.bookings (business_id, date);

-- =========================================================================
-- TOKEN NUMBER ALLOCATOR
-- =========================================================================
CREATE OR REPLACE FUNCTION public.next_token_number(_business_id UUID, _slot_id UUID, _date DATE)
RETURNS INTEGER
LANGUAGE SQL
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(token_number), 0) + 1
  FROM public.bookings
  WHERE business_id = _business_id AND slot_id = _slot_id AND date = _date;
$$;

-- =========================================================================
-- updated_at TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================================
-- RLS POLICIES
-- =========================================================================

-- businesses
CREATE POLICY "Public can view active businesses"
  ON public.businesses FOR SELECT TO anon
  USING (is_active = true);
CREATE POLICY "Staff view own business"
  ON public.businesses FOR SELECT TO authenticated
  USING (id = public.current_business_id() OR public.is_admin(auth.uid()));
CREATE POLICY "Admin manages businesses"
  ON public.businesses FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- profiles
CREATE POLICY "User views own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Admin manages profiles"
  ON public.profiles FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- user_roles
CREATE POLICY "User views own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- slots
CREATE POLICY "Public views active slots of active businesses"
  ON public.slots FOR SELECT TO anon
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.businesses b WHERE b.id = slots.business_id AND b.is_active = true
  ));
CREATE POLICY "Staff views own business slots"
  ON public.slots FOR SELECT TO authenticated
  USING (business_id = public.current_business_id() OR public.is_admin(auth.uid()));
CREATE POLICY "Admin manages slots"
  ON public.slots FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- services
CREATE POLICY "Public views active services of active businesses"
  ON public.services FOR SELECT TO anon
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.businesses b WHERE b.id = services.business_id AND b.is_active = true
  ));
CREATE POLICY "Staff views own business services"
  ON public.services FOR SELECT TO authenticated
  USING (business_id = public.current_business_id() OR public.is_admin(auth.uid()));
CREATE POLICY "Admin manages services"
  ON public.services FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- bookings
CREATE POLICY "Public can create bookings for active businesses"
  ON public.bookings FOR INSERT TO anon
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.businesses b WHERE b.id = bookings.business_id AND b.is_active = true
  ));
-- (Public SELECT for bookings intentionally NOT granted; confirmation returns the row via server function or trusted insert response.)
CREATE POLICY "Staff view own business bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (business_id = public.current_business_id() OR public.is_admin(auth.uid()));
CREATE POLICY "Staff insert own business bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (business_id = public.current_business_id() OR public.is_admin(auth.uid()));
CREATE POLICY "Staff update own business bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (business_id = public.current_business_id() OR public.is_admin(auth.uid()))
  WITH CHECK (business_id = public.current_business_id() OR public.is_admin(auth.uid()));
CREATE POLICY "Admin deletes bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- =========================================================================
-- REALTIME on bookings (for management→reception completion toast)
-- =========================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
