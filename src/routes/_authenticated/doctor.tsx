import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Forbidden } from "@/components/staff-nav";
import { markBookingCompleted } from "@/lib/doctor.functions";
import { formatMoney } from "@/lib/currency";
import { toast } from "sonner";
import { LogOut, Loader2, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/doctor")({
  component: DoctorPage,
  head: () => ({
    meta: [
      { title: "Doctor Panel — Qfloww" },
      { name: "description", content: "Doctor's daily queue and earnings overview." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Section = "today" | "earnings";

function DoctorPage() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("today");

  if (profile && profile.role !== "doctor") return <Forbidden />;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="flex">
        <aside className="hidden md:block w-56 border-r bg-paper min-h-dvh p-4">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-warm-5">Doctor</div>
            <div className="font-semibold">{profile?.display_name ?? profile?.email}</div>
          </div>
          <nav className="space-y-1 text-sm">
            <button onClick={() => setSection("today")} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left ${section === "today" ? "bg-accent" : "hover:bg-accent/50"}`}>
              <Calendar className="h-4 w-4" /> Queue
            </button>
            <button onClick={() => setSection("earnings")} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left ${section === "earnings" ? "bg-accent" : "hover:bg-accent/50"}`}>
              <TrendingUp className="h-4 w-4" /> Earnings
            </button>
          </nav>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="mt-8 inline-flex items-center gap-2 text-xs text-warm-5 hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </aside>
        <main className="flex-1 p-6">
          <div className="md:hidden mb-4 flex gap-2">
            <button onClick={() => setSection("today")} className={`rounded-md border px-3 py-1.5 text-sm ${section === "today" ? "bg-primary text-primary-foreground" : ""}`}>Queue</button>
            <button onClick={() => setSection("earnings")} className={`rounded-md border px-3 py-1.5 text-sm ${section === "earnings" ? "bg-primary text-primary-foreground" : ""}`}>Earnings</button>
          </div>
          {section === "today" && <QueueSection />}
          {section === "earnings" && <EarningsSection />}
        </main>
      </div>
    </div>
  );
}

function useBusiness() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["doctor-biz", profile?.business_id],
    enabled: !!profile?.business_id,
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("id, name, slug, currency").eq("id", profile!.business_id!).maybeSingle();
      return data;
    },
  });
}

function QueueSection() {
  const { data: biz } = useBusiness();
  const [dateStr, setDateStr] = useState(format(new Date(), "yyyy-MM-dd"));
  const qc = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["doctor-bookings", biz?.id, dateStr],
    enabled: !!biz?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, business_id, slot_id, service_id, date, token_number, client_name, client_phone, status, is_walkin, amount_paid, payment_method, notes")
        .eq("business_id", biz!.id)
        .eq("date", dateStr)
        .order("token_number");
      return data ?? [];
    },
  });

  const { data: slots } = useQuery({
    queryKey: ["doctor-slots", biz?.id],
    enabled: !!biz?.id,
    queryFn: async () => {
      const { data } = await supabase.from("slots").select("id, name, start_time, end_time, day_of_week").eq("business_id", biz!.id);
      return data ?? [];
    },
  });
  const { data: services } = useQuery({
    queryKey: ["doctor-services", biz?.id],
    enabled: !!biz?.id,
    queryFn: async () => {
      const { data } = await supabase.from("services").select("id, name").eq("business_id", biz!.id);
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    const b = bookings ?? [];
    return {
      total: b.length,
      completed: b.filter((x: any) => x.status === "completed").length,
      pending: b.filter((x: any) => x.status === "booked" || x.status === "arrived" || x.status === "ongoing").length,
      no_show: b.filter((x: any) => x.status === "no_show").length,
      cancelled: b.filter((x: any) => x.status === "cancelled").length,
      walkins: b.filter((x: any) => x.is_walkin).length,
      earnings: b.filter((x: any) => x.status === "completed").reduce((s: number, x: any) => s + Number(x.amount_paid ?? 0), 0),
    };
  }, [bookings]);

  const [paying, setPaying] = useState<any | null>(null);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "no_show" | "cancelled" }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctor-bookings"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const slotName = (id: string | null) => slots?.find((s: any) => s.id === id)?.name ?? "—";
  const serviceName = (id: string | null) => services?.find((s: any) => s.id === id)?.name ?? "—";

  const shiftDay = (n: number) => {
    const d = new Date(dateStr + "T00:00:00");
    setDateStr(format(addDays(d, n), "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl tracking-[-0.02em]">{biz?.name ?? "Clinic"}</h1>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => shiftDay(-1)} className="rounded-md border border-rule px-2 py-1.5" aria-label="Previous day"><ChevronLeft className="h-4 w-4" /></button>
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="rounded-none border border-rule bg-paper px-3 py-1.5 text-sm" />
          <button onClick={() => shiftDay(1)} className="rounded-md border border-rule px-2 py-1.5" aria-label="Next day"><ChevronRight className="h-4 w-4" /></button>
          <button onClick={() => setDateStr(format(new Date(), "yyyy-MM-dd"))} className="ml-1 rounded-md border border-rule px-3 py-1.5 text-sm">Today</button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-6">
        <Stat label="Bookings" value={stats.total} />
        <Stat label="Completed" value={stats.completed} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="No-show" value={stats.no_show} />
        <Stat label="Cancelled" value={stats.cancelled} />
        <Stat label="Earnings" value={formatMoney(stats.earnings, biz?.currency ?? "INR")} />
      </div>

      <div className="border border-rule bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-warm-1 text-xs uppercase text-warm-5">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-left">Slot</th>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Paid</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(bookings ?? []).map((b: any) => (
              <tr key={b.id} className="border-t">
                <td className="px-3 py-2 font-medium">{b.token_number}</td>
                <td className="px-3 py-2">
                  <div>{b.client_name}</div>
                  <div className="text-xs text-warm-5">{b.client_phone}</div>
                </td>
                <td className="px-3 py-2">{slotName(b.slot_id)}</td>
                <td className="px-3 py-2">{serviceName(b.service_id)}</td>
                <td className="px-3 py-2 capitalize">{b.status.replace("_", " ")}</td>
                <td className="px-3 py-2">
                  {b.amount_paid != null
                    ? <>{formatMoney(Number(b.amount_paid), biz?.currency ?? "INR")} <span className="text-xs text-warm-5">· {b.payment_method}</span></>
                    : "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  {b.status !== "completed" && b.status !== "cancelled" && (
                    <button onClick={() => setPaying(b)} className="mr-1 rounded-md bg-ink px-2 py-1 text-xs text-paper">Complete + payment</button>
                  )}
                  {b.status === "completed" && b.amount_paid == null && (
                    <button onClick={() => setPaying(b)} className="mr-1 rounded-md border px-2 py-1 text-xs">Add payment</button>
                  )}
                  {b.status !== "no_show" && b.status !== "cancelled" && (
                    <button onClick={() => updateStatus.mutate({ id: b.id, status: "no_show" })} className="mr-1 rounded-md border px-2 py-1 text-xs">No-show</button>
                  )}
                  {b.status !== "cancelled" && (
                    <button onClick={() => { if (confirm("Cancel this booking?")) updateStatus.mutate({ id: b.id, status: "cancelled" }); }} className="rounded-md border px-2 py-1 text-xs text-destructive">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {(!bookings || bookings.length === 0) && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-warm-5">{isLoading ? "Loading…" : "No bookings for this day."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <PaymentDialog
        booking={paying}
        currency={biz?.currency ?? "INR"}
        onClose={() => setPaying(null)}
        onDone={() => { qc.invalidateQueries({ queryKey: ["doctor-bookings"] }); setPaying(null); }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border border-rule bg-paper p-3">
      <div className="text-xs uppercase tracking-wider text-warm-5">{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
    </div>
  );
}

export function PaymentDialog({
  booking, currency, onClose, onDone,
}: {
  booking: any | null;
  currency: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const complete = useServerFn(markBookingCompleted);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<"cash" | "card" | "upi" | "other">("cash");
  const [submitting, setSubmitting] = useState(false);

  // Reset when booking changes
  useMemo(() => {
    if (booking) {
      setAmount(booking.amount_paid != null ? String(booking.amount_paid) : "");
      setMethod((booking.payment_method as any) || "cash");
    }
  }, [booking?.id]);

  const submit = async () => {
    const amt = Number(amount);
    if (!isFinite(amt) || amt < 0) { toast.error("Enter a valid amount"); return; }
    setSubmitting(true);
    try {
      await complete({ data: { booking_id: booking.id, amount_paid: amt, payment_method: method } });
      toast.success("Payment recorded");
      onDone();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!booking} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
        </DialogHeader>
        {booking && (
          <div className="space-y-3">
            <div className="text-sm text-warm-5">Token #{booking.token_number} · {booking.client_name}</div>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-warm-5">Amount ({currency})</span>
              <input autoFocus type="number" step="0.01" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-warm-5">Method</span>
              <select value={method} onChange={(e) => setMethod(e.target.value as any)} className="mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        )}
        <DialogFooter>
          <button onClick={onClose} className="rounded-md border border-rule px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-1.5 text-sm text-paper disabled:opacity-50">
            {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EarningsSection() {
  const { data: biz } = useBusiness();
  type Preset = "today" | "week" | "month" | "custom";
  const [preset, setPreset] = useState<Preset>("week");
  const today = new Date();
  const [from, setFrom] = useState(format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"));

  const applyPreset = (p: Preset) => {
    setPreset(p);
    const now = new Date();
    if (p === "today") { const d = format(now, "yyyy-MM-dd"); setFrom(d); setTo(d); }
    else if (p === "week") { setFrom(format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd")); setTo(format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd")); }
    else if (p === "month") { setFrom(format(startOfMonth(now), "yyyy-MM-dd")); setTo(format(endOfMonth(now), "yyyy-MM-dd")); }
  };

  const { data: rows } = useQuery({
    queryKey: ["doctor-earnings", biz?.id, from, to],
    enabled: !!biz?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, date, service_id, amount_paid, payment_method, status")
        .eq("business_id", biz!.id)
        .eq("status", "completed")
        .gte("date", from)
        .lte("date", to);
      return data ?? [];
    },
  });

  const { data: services } = useQuery({
    queryKey: ["doctor-services-earn", biz?.id],
    enabled: !!biz?.id,
    queryFn: async () => (await supabase.from("services").select("id, name").eq("business_id", biz!.id)).data ?? [],
  });

  const totals = useMemo(() => {
    const r = rows ?? [];
    const gross = r.reduce((s: number, x: any) => s + Number(x.amount_paid ?? 0), 0);
    const count = r.length;
    const avg = count ? gross / count : 0;
    const byMethod: Record<string, number> = {};
    const byService: Record<string, number> = {};
    const byDate: Record<string, number> = {};
    r.forEach((x: any) => {
      const m = x.payment_method || "other";
      byMethod[m] = (byMethod[m] ?? 0) + Number(x.amount_paid ?? 0);
      const sid = x.service_id ?? "unassigned";
      byService[sid] = (byService[sid] ?? 0) + Number(x.amount_paid ?? 0);
      byDate[x.date] = (byDate[x.date] ?? 0) + Number(x.amount_paid ?? 0);
    });
    return { gross, count, avg, byMethod, byService, byDate };
  }, [rows]);

  const dateKeys = Object.keys(totals.byDate).sort();
  const maxDaily = Math.max(1, ...Object.values(totals.byDate));
  const cur = biz?.currency ?? "INR";
  const serviceName = (id: string) => id === "unassigned" ? "Unassigned" : services?.find((s: any) => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl tracking-[-0.02em]">Earnings</h1>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          {(["today","week","month","custom"] as Preset[]).map((p) => (
            <button key={p} onClick={() => applyPreset(p)} className={`rounded-md px-3 py-1.5 text-sm capitalize ${preset === p ? "bg-ink text-paper" : "border border-rule bg-paper"}`}>{p}</button>
          ))}
          {preset === "custom" && (
            <>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-none border border-rule bg-paper px-2 py-1.5 text-sm" />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-none border border-rule bg-paper px-2 py-1.5 text-sm" />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Gross" value={formatMoney(totals.gross, cur)} />
        <Stat label="Completed bookings" value={totals.count} />
        <Stat label="Average ticket" value={formatMoney(totals.avg, cur)} />
      </div>

      <div className="border border-rule bg-paper p-4">
        <h3 className="mb-3 text-sm font-semibold">Daily earnings</h3>
        {dateKeys.length === 0 ? (
          <div className="text-sm text-warm-5">No earnings in this range.</div>
        ) : (
          <div className="space-y-2">
            {dateKeys.map((d) => (
              <div key={d} className="flex items-center gap-3 text-xs">
                <div className="w-24 shrink-0 text-warm-5">{format(parseISO(d), "EEE, MMM d")}</div>
                <div className="flex-1 bg-warm-1">
                  <div className="h-4 bg-ink" style={{ width: `${(totals.byDate[d] / maxDaily) * 100}%` }} />
                </div>
                <div className="w-28 text-right tabular-nums">{formatMoney(totals.byDate[d], cur)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-rule bg-paper p-4">
          <h3 className="mb-2 text-sm font-semibold">By payment method</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(totals.byMethod).map(([k, v]) => (
              <li key={k} className="flex justify-between"><span className="capitalize">{k}</span><span className="tabular-nums">{formatMoney(v, cur)}</span></li>
            ))}
            {Object.keys(totals.byMethod).length === 0 && <li className="text-warm-5">—</li>}
          </ul>
        </div>
        <div className="border border-rule bg-paper p-4">
          <h3 className="mb-2 text-sm font-semibold">By service</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(totals.byService).map(([k, v]) => (
              <li key={k} className="flex justify-between"><span>{serviceName(k)}</span><span className="tabular-nums">{formatMoney(v, cur)}</span></li>
            ))}
            {Object.keys(totals.byService).length === 0 && <li className="text-warm-5">—</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
