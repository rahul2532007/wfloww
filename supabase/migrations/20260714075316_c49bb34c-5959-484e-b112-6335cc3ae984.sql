
-- 1. Extend app_role enum with 'doctor'
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'doctor';
