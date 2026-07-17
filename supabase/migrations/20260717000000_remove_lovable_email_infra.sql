-- Remove the unused legacy email queue infrastructure.
-- Business tables, RLS, roles, and booking indexes are intentionally untouched.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'process-email-queue';
  END IF;
END $$;

-- CASCADE removes any dynamic trigger that used the queue wake function.
DROP FUNCTION IF EXISTS public.email_queue_wake() CASCADE;
DROP FUNCTION IF EXISTS public.email_queue_dispatch() CASCADE;
DROP FUNCTION IF EXISTS public.enqueue_email(text, jsonb);
DROP FUNCTION IF EXISTS public.read_email_batch(text, integer, integer);
DROP FUNCTION IF EXISTS public.delete_email(text, bigint);
DROP FUNCTION IF EXISTS public.move_to_dlq(text, text, bigint, jsonb);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgmq') THEN
    BEGIN PERFORM pgmq.drop_queue('auth_emails'); EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN PERFORM pgmq.drop_queue('transactional_emails'); EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN PERFORM pgmq.drop_queue('auth_emails_dlq'); EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN PERFORM pgmq.drop_queue('transactional_emails_dlq'); EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
END $$;

DROP TABLE IF EXISTS public.email_send_log;
DROP TABLE IF EXISTS public.email_send_state;
DROP TABLE IF EXISTS public.email_unsubscribe_tokens;
DROP TABLE IF EXISTS public.suppressed_emails;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'supabase_vault') THEN
    DELETE FROM vault.secrets WHERE name = 'email_queue_service_role_key';
  END IF;
END $$;

DROP EXTENSION IF EXISTS pgmq;
DROP EXTENSION IF EXISTS pg_cron;
DROP EXTENSION IF EXISTS pg_net;
