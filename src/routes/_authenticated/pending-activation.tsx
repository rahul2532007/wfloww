import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LogOut, Loader2, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/pending-activation")({
  component: PendingPage,
  head: () => ({
    meta: [
      { title: "Awaiting Activation — Qfloww" },
      { name: "description", content: "Your Qfloww business is awaiting activation." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const CONTACT_EMAIL = "pride.pma@gmail.com";

function PendingPage() {
  const { profile, signOut, refresh } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: biz } = useQuery({
    queryKey: ["my-biz", profile?.business_id],
    enabled: !!profile?.business_id,
    queryFn: async () => (await supabase.from("businesses").select("*").eq("id", profile!.business_id!).maybeSingle()).data,
    refetchInterval: 15000,
  });

  const { data: requests } = useQuery({
    queryKey: ["my-activation-requests", profile?.business_id],
    enabled: !!profile?.business_id,
    queryFn: async () => (await supabase.from("activation_requests").select("*").eq("business_id", profile!.business_id!).order("created_at", { ascending: false })).data ?? [],
  });

  const isActive = biz && biz.is_active && !biz.manual_lock && biz.expires_at && new Date(biz.expires_at).getTime() > Date.now();

  useEffect(() => {
    if (!isActive) return;
    (async () => {
      await refresh();
      navigate({ to: "/management", replace: true });
    })();
  }, [isActive, navigate, refresh]);

  const request = useMutation({
    mutationFn: async () => {
      if (!profile?.business_id) throw new Error("No business");
      const { error } = await supabase.from("activation_requests").insert({
        business_id: profile.business_id,
        requested_by: profile.id,
        message: message || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Request sent to admin"); setMessage(""); qc.invalidateQueries({ queryKey: ["my-activation-requests"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!profile) return null;

  const hasBusiness = !!profile.business_id;
  const pendingReq = (requests ?? []).find((r: any) => r.status === "pending");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-lg border border-rule bg-paper p-10">
        <p className="section-marker">Account status</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">
          {hasBusiness ? "Awaiting activation" : "No business linked"}
        </h1>
        {hasBusiness ? (
          <>
            <p className="mt-4 text-sm text-warm-5">
              Your business <strong>{biz?.name}</strong> is created but not yet active. Reach out to activate billing.
            </p>
            <div className="mt-6 rounded-md border border-rule bg-warm-1 p-4">
              <p className="text-xs uppercase tracking-wider text-warm-5">Contact us</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-flex items-center gap-2 text-base underline">
                <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
              </a>
            </div>

            {pendingReq ? (
              <p className="mt-6 rounded-none border border-amber/40 bg-amber/10 p-3 text-sm text-ink">
                Activation request sent {new Date(pendingReq.created_at).toLocaleString()}. We'll email you when it's approved.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                <label className="block">
                  <span className="section-marker">Optional message to admin</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
                    className="mt-2 w-full rounded-md border border-rule bg-transparent p-2 text-sm focus:border-ink focus:outline-none"
                    placeholder="Anything the admin should know…" />
                </label>
                <button onClick={() => request.mutate()} disabled={request.isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40">
                  {request.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Request activation
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm text-warm-5">
            No business is linked to your account. Please contact <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        )}

        <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
          className="mt-8 inline-flex items-center gap-2 text-xs text-warm-5 hover:text-ink">
          <LogOut className="h-3 w-3" /> Sign out
        </button>
      </div>
    </div>
  );
}
