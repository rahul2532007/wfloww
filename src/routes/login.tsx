import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, homeForRole } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign In — Qfloww" },
      { name: "description", content: "Sign in to your Qfloww account with your email and password." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && profile) navigate({ to: homeForRole(profile.role), replace: true });
  }, [profile, authLoading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    router.invalidate();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border border-rule bg-paper p-10">
        <p className="section-marker">Sign in</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">Welcome back</h1>
        <p className="mt-2 text-sm text-warm-5">Enter your email and password.</p>
        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="section-marker">Email</span>
            <input autoFocus type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none"
              placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="section-marker">Password</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none" />
          </label>
          <button type="submit" disabled={submitting || !email || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
          <div className="flex items-center justify-between text-xs text-warm-4">
            <Link to="/forgot-password" className="underline hover:text-ink">Forgot password?</Link>
            <Link to="/signup" className="underline hover:text-ink">Create account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
