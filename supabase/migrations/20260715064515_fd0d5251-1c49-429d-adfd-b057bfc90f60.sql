-- Re-affirm Data API grants on public.businesses so authenticated clients can read/write
-- their own business rows (RLS still enforces row-level checks). Explicit grants are
-- idempotent; this closes any gap that could cause intermittent 42501 "permission denied".

GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

-- Also ensure the anonymous role can never reach this table through the Data API.
REVOKE ALL ON public.businesses FROM anon;