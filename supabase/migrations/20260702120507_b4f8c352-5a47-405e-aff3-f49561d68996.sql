-- 1) Remove bookings from realtime publication (no client subscribes; eliminates PII broadcast risk)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'bookings'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.bookings';
  END IF;
END $$;

-- 2) Tighten staff INSERT policy: require business active + not locked
DROP POLICY IF EXISTS "Staff insert own business bookings" ON public.bookings;

CREATE POLICY "Staff insert own business bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  private.is_admin(auth.uid())
  OR (
    business_id = private.current_business_id()
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id
        AND b.is_active = true
        AND b.manual_lock = false
    )
  )
);