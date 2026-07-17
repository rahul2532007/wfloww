-- 1) Restrict anonymous access to businesses (was exposing contact_email/phone/owner_user_id)
DROP POLICY IF EXISTS "Public can view active businesses" ON public.businesses;
REVOKE SELECT ON public.businesses FROM anon;

-- 2) Lock search_path on SECURITY DEFINER pgmq wrapper functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;