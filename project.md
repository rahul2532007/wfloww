# Qfloww

Qfloww is a multi-tenant booking and queue-management SaaS for clinics, salons, and consulting firms. It is a single TanStack Start application with public booking, business-owner management, doctor, and platform-admin surfaces.

## Stack

- React 19, TypeScript, TanStack Start/Router/Query, Vite, Nitro, Tailwind CSS, shadcn/Radix UI, Zod.
- Vercel hosts the Nitro server output in its Node.js runtime.
- Supabase provides Postgres, Auth, RLS, and the Data API. Schema changes are in `supabase/migrations`.
- Resend sends booking confirmations and doctor invitations synchronously. Email delivery is best-effort: missing or failing Resend configuration is logged but never fails a booking or invitation.

## Runtime architecture

`src/server.ts` is the SSR fetch entry and preserves the application error fallback. `src/start.ts` installs request error handling and client bearer-token attachment for protected server functions. The browser client uses public Vite Supabase variables; `client.server.ts` loads the service-role key only inside trusted server handlers.

The principal routes are `/book/$slug`, `/signup`, `/login`, `/management`, `/doctor`, `/admin`, and `/bootstrap-admin`. Multi-tenancy is enforced by Postgres RLS and private helper functions; do not weaken those policies as part of application work.

## Environment

Copy `.env.example` for local development. Configure these same values in Vercel:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` — public browser values.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — server-only values.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — optional at first; email sends safely no-op with an error log until configured.

## First deployment

1. Create the owned Supabase project and install/login to the Supabase CLI.
2. Run `supabase link --project-ref <project-ref>`, then `supabase db push` to apply every migration, including the legacy email-infrastructure cleanup migration.
3. Run `npm run db:types` to regenerate `src/integrations/supabase/types.ts` from that project.
4. Create the Vercel project, set the four required Supabase variables, and deploy with `npm run build`.
5. In Supabase Auth, set the production Site URL and allowed redirect URLs for the Vercel/custom domain.

## Resend and Supabase Auth

When ready to send email, verify a sending domain in Resend, create an API key, and set `RESEND_API_KEY` plus `RESEND_FROM_EMAIL` in Vercel. Configure Resend SMTP in Supabase Auth, then copy the preserved templates from `supabase/auth-email-templates.md` into the Supabase Email Templates dashboard. Disable Resend click tracking for Auth emails so Supabase confirmation URLs remain valid.

Supabase Free projects pause after seven days without database activity; periodic manual demo bookings are sufficient during testing. Vercel Hobby is suitable for this non-commercial pilot only; move to Vercel Pro before serving paying clients.

## Validation

Run `npm run typecheck`, `npm run lint`, and `npm run build`. At the expected pilot volume, the existing business/date booking indexes are adequate, but token allocation still uses `MAX(token_number) + 1`; concurrent bookings for the same slot/date can conflict and should be redesigned only when product requirements call for it.
