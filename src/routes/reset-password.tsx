import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
  head: () => ({
    meta: [
      { title: "Set New Password — Qfloww" },
      { name: "description", content: "Set a new password for your Qfloww account." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase automatically handles the recovery hash on load
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/login" });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm border border-rule bg-paper p-10">
        <p className="section-marker">Password reset</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">Set new password</h1>
        {!ready ? (
          <p className="mt-6 text-sm text-warm-5">Validating your reset link…</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="section-marker">New password</span>
              <input required autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
            </label>
            <label className="block">
              <span className="section-marker">Confirm password</span>
              <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none" />
            </label>
            <button type="submit" disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
