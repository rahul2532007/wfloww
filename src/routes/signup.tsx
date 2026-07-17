import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create Your Business — Qfloww" },
      { name: "description", content: "Create your Qfloww business account. Own your public booking page in minutes." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function SignupPage() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    email: "", password: "", display_name: "",
    business_name: "", slug: "", type: "clinic" as "clinic" | "salon" | "consulting",
  });
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && profile) navigate({ to: "/pending-activation", replace: true });
  }, [profile, authLoading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password || !form.business_name || !form.slug) return;
    if (!/^[a-z0-9-]{2,40}$/.test(form.slug)) return toast.error("Slug: 2-40 lowercase letters, numbers or dashes");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    setSubmitting(true);

    const pending = {
      business_name: form.business_name,
      slug: form.slug,
      type: form.type,
    };
    try {
      localStorage.setItem(`qfloww:pending-signup:${form.email.trim().toLowerCase()}`, JSON.stringify({ ...pending, email: form.email.trim().toLowerCase(), display_name: form.display_name || null }));
      localStorage.setItem("qfloww:pending-signup:last", JSON.stringify({ ...pending, email: form.email.trim().toLowerCase(), display_name: form.display_name || null }));
    } catch {}

    // 1. Sign up — store pending business details in user_metadata so finalize
    // works from any device/origin, not just the one that ran signup.
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          display_name: form.display_name,
          pending_business_name: pending.business_name,
          pending_business_slug: pending.slug,
          pending_business_type: pending.type,
        },
      },
    });
    if (authErr || !authData.user) { setSubmitting(false); return toast.error(authErr?.message ?? "Signup failed"); }

    // If email confirmation is required, session may be null
    const hasSession = !!authData.session;
    if (!hasSession) {
      setSubmitting(false);
      setSentToEmail(form.email.trim());
      return;
    }

    // 2. Create profile + business (RLS scoped to auth.uid())
    const uid = authData.user.id;
    await supabase.from("profiles").insert({ id: uid, email: form.email.trim(), display_name: form.display_name || null });

    const { error: bizErr } = await supabase.from("businesses").insert({
      name: form.business_name,
      slug: form.slug,
      type: form.type,
      owner_user_id: uid,
      is_active: false,
      manual_lock: true,
    });
    setSubmitting(false);
    if (bizErr) {
      toast.error(bizErr.message.includes("duplicate") ? "That slug is taken — try another" : bizErr.message);
      return;
    }

    toast.success("Account created. Waiting for activation.");
    navigate({ to: "/pending-activation" });
  }

  if (sentToEmail) {
    return (
      <div className="min-h-dvh bg-paper">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-24 lg:px-10 lg:pt-40 lg:pb-32">
          <div className="border-t border-rule pt-10 lg:pt-14">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <p className="section-marker">
                  01 — Action required
                  <span className="ml-1 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-amber align-middle" />
                </p>
                <p className="mt-6 text-sm text-warm-5">
                  A verification link is waiting in your inbox. Your account isn't active until you open it.
                </p>
              </div>
              <div className="lg:col-span-8">
                <h1 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl">
                  Check your email
                  <span className="text-amber">.</span>
                </h1>
                <p className="mt-8 max-w-2xl text-lg text-warm-5">
                  We sent a confirmation link to
                </p>
                <p className="mt-2 break-all font-display text-2xl tracking-[-0.01em] md:text-3xl">
                  {sentToEmail}
                </p>

                <div className="mt-12 border-t border-rule pt-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <p className="section-marker">Next step</p>
                      <p className="mt-3 text-base text-ink">
                        Open the email from <strong>Qfloww</strong> and click the confirmation link. You cannot sign in before that.
                      </p>
                    </div>
                    <div>
                      <p className="section-marker">Can't find it?</p>
                      <p className="mt-3 text-base text-warm-5">
                        Check your <span className="text-ink">Spam</span> or <span className="text-ink">Promotions</span> folder. Delivery usually takes under a minute.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    I've confirmed — sign in
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSentToEmail(null)}
                    className="inline-flex items-center justify-center rounded-full border border-rule px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-rule bg-paper p-10">
        <p className="section-marker">Sign up</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">Create your business</h1>
        <p className="mt-2 text-sm text-warm-5">One account. One business. Full control.</p>
        <div className="mt-8 space-y-5">
          <Field label="Your name">
            <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
          </Field>
          <Field label="Email">
            <input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
          </Field>
          <Field label="Password (min 8 chars)">
            <input required type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
          </Field>
          <Field label="Business name">
            <input required value={form.business_name}
              onChange={(e) => {
                const next = { ...form, business_name: e.target.value };
                if (!slugTouched) next.slug = slugify(e.target.value);
                setForm(next);
              }}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
          </Field>
          <Field label="Booking URL slug">
            <div className="mt-2 flex items-center gap-1 border-b border-rule">
              <span className="text-sm text-warm-5">/book/</span>
              <input required value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: e.target.value.toLowerCase() }); }}
                className="w-full bg-transparent py-2 text-base focus:outline-none" />
            </div>
          </Field>
          <Field label="Business type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none">
              <option value="clinic">Clinic</option>
              <option value="salon">Salon</option>
              <option value="consulting">Consulting</option>
            </select>
          </Field>
          <button type="submit" disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Create account
          </button>
          <p className="text-center text-xs text-warm-4">
            Already have an account? <Link to="/login" className="underline">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="section-marker">{label}</span>{children}</label>;
}
