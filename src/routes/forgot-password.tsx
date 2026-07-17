import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
  head: () => ({
    meta: [
      { title: "Reset Password — Qfloww" },
      { name: "description", content: "Request a password reset link for your Qfloww account." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSent(true);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm border border-rule bg-paper p-10">
        <p className="section-marker">Password reset</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">Forgot password</h1>
        {sent ? (
          <p className="mt-6 text-sm text-warm-5">
            If an account exists for <strong>{email}</strong>, we've sent a reset link. Check your inbox.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="section-marker">Email</span>
              <input required autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
            </label>
            <button type="submit" disabled={submitting || !email}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-xs text-warm-4">
          <Link to="/login" className="underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
