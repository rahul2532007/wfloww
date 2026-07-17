DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM public.profiles WHERE role = 'reception' OR username LIKE '%_reception');
DELETE FROM public.profiles WHERE role = 'reception' OR username LIKE '%_reception';
DELETE FROM auth.users WHERE email LIKE '%\_reception@queueflow.internal' ESCAPE '\';