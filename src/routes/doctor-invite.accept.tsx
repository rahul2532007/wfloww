import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/doctor-invite/accept")({
  component: AcceptInvitePage,
  validateSearch: (s) => z.object({ token: z.string().uuid().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Accept doctor invitation — Qfloww" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type InviteInfo = { email: string; business_name: string; status: string; expires_at: string };

function AcceptInvitePage() {
  const { token } = useSearch({ from: "/doctor-invite/accept" });
  const { session, refresh } = useAuth();
  const navigate = useNavigate();

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setLoading(false); setLoadErr("Missing invitation token."); return; }
    (async () => {
      const { data, error } = await supabase.rpc("get_doctor_invite_by_token", { _token: token });
      if (error) { setLoadErr(error.message); }
      else if (!data || (Array.isArray(data) && data.length === 0)) { setLoadErr("Invitation not found."); }
      else {
        const row = Array.isArray(data) ? data[0] : data;
        setInvite(row);
        if (row.status !== "pending") setLoadErr(`This invitation is ${row.status}.`);
        else if (new Date(row.expires_at).getTime() < Date.now()) setLoadErr("This invitation has expired.");
      }
      setLoading(false);
    })();
  }, [token]);

  const emailMatches = !!(session && invite && session.user.email?.toLowerCase() === invite.email.toLowerCase());

  const handleSignUp = async () => {
    if (!invite || !token) return;
    setSubmitting(true);
    try {
      const { error: signErr } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/doctor-invite/accept?token=${token}`,
          data: { display_name: displayName },
        },
      });
      if (signErr) {
        // If already registered, try sign-in instead.
        if (/already|registered/i.test(signErr.message)) {
          const { error: siErr } = await supabase.auth.signInWithPassword({ email: invite.email, password });
          if (siErr) throw siErr;
        } else {
          throw signErr;
        }
      }
      // If a session exists now, immediately accept.
      const { data: s } = await supabase.auth.getSession();
      if (s.session) {
        await acceptInvite();
      } else {
        toast.success("Check your inbox to confirm your email, then return to this page.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  const acceptInvite = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.rpc("accept_doctor_invite", { _token: token, _display_name: displayName || "" });
      if (error) throw error;
      await refresh();
      toast.success("Welcome!");
      navigate({ to: "/doctor" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to accept invitation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center bg-paper"><Loader2 className="h-6 w-6 animate-spin text-warm-5" /></div>;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-lg border border-rule bg-paper p-10">
        <p className="section-marker">Doctor invitation</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">
          {invite ? <>Join <span className="text-amber">{invite.business_name}</span></> : "Invitation"}
        </h1>

        {loadErr && (
          <div className="mt-6 border border-rule bg-warm-1 p-4 text-sm text-warm-5">{loadErr}</div>
        )}

        {invite && !loadErr && (
          <>
            <p className="mt-3 text-sm text-warm-5">
              You've been invited as a doctor at <strong>{invite.business_name}</strong>.
              This invitation is tied to <strong>{invite.email}</strong>.
            </p>

            {session && !emailMatches && (
              <div className="mt-6 border border-rule bg-warm-1 p-4 text-sm">
                You're signed in as <strong>{session.user.email}</strong>, which doesn't match the invite address.
                {" "}
                <button className="underline" onClick={async () => { await supabase.auth.signOut(); }}>Sign out</button> and try again.
              </div>
            )}

            {session && emailMatches && (
              <div className="mt-6 space-y-3">
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-wider text-warm-5">Your name</span>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm" placeholder="Dr. Jane Doe" />
                </label>
                <button onClick={acceptInvite} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Accept & continue
                </button>
              </div>
            )}

            {!session && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-warm-5">Set your name and password to activate your account.</p>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-wider text-warm-5">Email</span>
                  <input value={invite.email} disabled className="mt-1 w-full rounded-none border border-rule bg-warm-1 px-3 py-2 text-sm text-warm-5" />
                </label>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-wider text-warm-5">Your name</span>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm" placeholder="Dr. Jane Doe" />
                </label>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-wider text-warm-5">Password</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} className="mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm" placeholder="At least 8 characters" />
                </label>
                <button onClick={handleSignUp} disabled={submitting || password.length < 8 || !displayName} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Create account & join
                </button>
                <p className="text-xs text-warm-5">
                  Already have an account? <Link to="/login" className="underline">Sign in first</Link>, then reopen this invite link.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
