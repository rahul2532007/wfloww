import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { bootstrapAdmin } from "@/lib/admin.functions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/bootstrap-admin")({
  component: BootstrapAdminPage,
  head: () => ({
    meta: [
      { title: "Bootstrap Admin — Qfloww" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function BootstrapAdminPage() {
  const { session, profile, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const run = useServerFn(bootstrapAdmin);
  const [submitting, setSubmitting] = useState(false);

  const handleClaim = async () => {
    setSubmitting(true);
    try {
      await run();
      await refresh();
      toast.success("You are now the master admin.");
      navigate({ to: "/admin" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to bootstrap admin");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <Loader2 className="h-6 w-6 animate-spin text-warm-4" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-lg border border-rule bg-paper p-10">
        <p className="section-marker">Admin bootstrap</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">Claim the master admin role</h1>
        <p className="mt-3 text-sm text-warm-5">
          One-time setup. Promotes the currently signed-in account to the platform admin role.
          Disabled once an admin exists.
        </p>

        {!session ? (
          <div className="mt-8 border border-rule p-6 text-sm">
            <p className="text-warm-5">You need to sign in first with the account you want to promote.</p>
            <Button asChild className="mt-4 rounded-full bg-ink text-paper hover:opacity-90">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <dl className="mt-8 grid gap-4 border-y border-rule py-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="section-marker">Signed in as</dt>
                <dd className="mt-1 font-display text-base">{session.user.email}</dd>
              </div>
              <div>
                <dt className="section-marker">Current role</dt>
                <dd className="mt-1 font-display text-base">{profile?.role ?? "none"}</dd>
              </div>
            </dl>
            {profile?.role === "admin" ? (
              <div className="mt-6 text-sm text-warm-5">
                You are already an admin.{" "}
                <button onClick={() => navigate({ to: "/admin" })} className="underline hover:text-ink">
                  Go to admin →
                </button>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Claiming…" : "Claim master admin role"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

