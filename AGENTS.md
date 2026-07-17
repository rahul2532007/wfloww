# Qfloww repository guidance

Qfloww is deployed as a TanStack Start/Nitro application on Vercel. Supabase hosts
Postgres and Auth; Resend is used for best-effort transactional email.

- Keep multi-tenant RLS policies, roles, and business schema changes deliberate and migration-backed.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` after application changes.
- Use `supabase link`, `supabase db push`, and `npm run db:types` against the owned Supabase project.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and Resend credentials server-only.
