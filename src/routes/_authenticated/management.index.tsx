import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { StaffTopNav, StatusBadge, Forbidden } from "@/components/staff-nav";
import { computePlanStatus } from "@/lib/plan";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Loader2, X, CalendarClock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PaymentDialog } from "./doctor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/management/")({
  component: ManagementPage,
  validateSearch: (search) =>
    z.object({ as: z.string().optional() }).parse(search),
  head: () => ({
    meta: [
      { title: "Management — Today's Queue — Qfloww" },
      { name: "description", content: "Owner view of today's queue: live arrivals, ongoing tokens, completions, and billing status for your business." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Booking = {
  id: string; business_id: string; slot_id: string; service_id: string | null;
  date: string; token_number: number; client_name: string; client_phone: string;
  status: "booked" | "arrived" | "ongoing" | "completed" | "no_show" | "cancelled";
  is_walkin: boolean;
  amount_paid?: number | null;
  payment_method?: string | null;
};

const todayStr = () => format(new Date(), "yyyy-MM-dd");

function ManagementPage() {
  const { profile } = useAuth();
  const { as: asSlug } = useSearch({ from: "/_authenticated/management/" });
  const qc = useQueryClient();
  const [dateStr, setDateStr] = useState(todayStr());
  const [search, setSearch] = useState("");
  const [add, setAdd] = useState({ name: "", phone: "", service_id: "", slot_id: "", date: todayStr() });
  const [reschedule, setReschedule] = useState<{ booking: Booking; date: string; slot_id: string; service_id: string } | null>(null);
  const [revert, setRevert] = useState<{ booking: Booking; to: Booking["status"] } | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<Booking | null>(null);
  const [paying, setPaying] = useState<Booking | null>(null);

  // Admin impersonation: when an admin visits /management?as=<slug>, load that
  // business instead of the signed-in user's own. Non-admins ignore the param.
  const isAdmin = profile?.role === "admin";
  const impersonateSlug = isAdmin ? asSlug : undefined;

  const { data: impersonatedBiz } = useQuery({
    queryKey: ["mg-impersonate", impersonateSlug],
    enabled: !!impersonateSlug,
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("slug", impersonateSlug!).maybeSingle();
      return data;
    },
  });

  const bizId: string | null = impersonatedBiz?.id ?? profile?.business_id ?? null;

  const { data: ownBiz } = useQuery({
    queryKey: ["biz", bizId, !!impersonateSlug],
    enabled: !!bizId && !impersonateSlug,
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("id", bizId!).maybeSingle();
      return data;
    },
  });

  const biz = impersonatedBiz ?? ownBiz;

  const status = biz ? computePlanStatus(biz as any) : null;

  const { data: bookings } = useQuery({
    queryKey: ["mg-bookings", bizId, dateStr],
    enabled: !!bizId,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings").select("*")
        .eq("business_id", bizId!)
        .eq("date", dateStr)
        .in("status", ["booked", "arrived", "ongoing", "completed"])
        .order("token_number");
      return (data ?? []) as Booking[];
    },
  });


  const { data: allToday } = useQuery({
    queryKey: ["mg-today-all", bizId, todayStr()],
    enabled: !!bizId,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings").select("*")
        .eq("business_id", bizId!)
        .eq("date", todayStr());
      return (data ?? []) as Booking[];
    },
  });

  const { data: services } = useQuery({
    queryKey: ["services", bizId], enabled: !!bizId,
    queryFn: async () => (await supabase.from("services").select("id, name").eq("business_id", bizId!).eq("is_active", true).order("name")).data ?? [],
  });
  const { data: slots } = useQuery({
    queryKey: ["slots", bizId], enabled: !!bizId,
    queryFn: async () => (await supabase.from("slots").select("id, name, start_time, end_time, max_capacity, day_of_week").eq("business_id", bizId!).eq("is_active", true).order("start_time")).data ?? [],
  });
  const todayDow = new Date().getDay();
  const addDow = add?.date ? new Date(add.date + "T00:00:00").getDay() : todayDow;
  const todayStrLocal = format(new Date(), "yyyy-MM-dd");
  const isSlotPast = (dateStr: string, startTime: string | null | undefined) => {
    if (!startTime || dateStr !== todayStrLocal) return false;
    const [hh, mm] = String(startTime).split(":").map((x) => parseInt(x, 10) || 0);
    const slotDate = new Date();
    slotDate.setHours(hh, mm, 0, 0);
    return slotDate.getTime() <= Date.now();
  };
  const todaySlots = useMemo(() => (slots ?? []).filter((s: any) => s.day_of_week === todayDow), [slots, todayDow]);
  const addDateSlots = useMemo(
    () => (slots ?? []).filter((s: any) => s.day_of_week === addDow && !isSlotPast(add.date, s.start_time)),
    [slots, addDow, add.date, todayStrLocal],
  );

  const filtered = useMemo(() => {
    if (!bookings) return [];
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => [b.client_name ?? "", b.client_phone ?? "", String(b.token_number)].some((v) => v.toLowerCase().includes(q)));
  }, [bookings, search]);


  const counts = useMemo(() => {
    const c = { total: 0, added: 0, arrived: 0, ongoing: 0, completed: 0, no_show: 0 };
    (allToday ?? []).forEach((b) => {
      c.total++;
      if (b.is_walkin) c.added++;
      if (b.status === "arrived") c.arrived++;
      if (b.status === "ongoing") c.ongoing++;
      if (b.status === "completed") c.completed++;
      if (b.status === "no_show") c.no_show++;
    });
    return c;
  }, [allToday]);

  const slotInfo = useMemo(() => {
    const counts = new Map<string, number>();
    (allToday ?? []).forEach((b) => {
      if (b.status !== "cancelled" && b.slot_id) counts.set(b.slot_id, (counts.get(b.slot_id) ?? 0) + 1);
    });
    return (todaySlots ?? []).map((s: any) => ({
      id: s.id,
      name: s.name,
      start_time: s.start_time,
      end_time: s.end_time,
      max_capacity: s.max_capacity,
      booked_today: counts.get(s.id) ?? 0,
    }));
  }, [todaySlots, allToday]);

  const nextStatus: Record<string, Booking["status"]> = { booked: "arrived", arrived: "ongoing", ongoing: "completed" };
  const prevStatus: Record<string, Booking["status"]> = { arrived: "booked", ongoing: "arrived", completed: "ongoing" };
  const advance = useMutation({
    mutationFn: async (b: Booking) => {
      const next = nextStatus[b.status];
      if (!next) return;
      // Intercept the transition to "completed" so we can collect payment info.
      if (next === "completed") {
        setPaying(b);
        return;
      }
      const { error } = await supabase.from("bookings").update({ status: next as any }).eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mg-bookings"] }),
    onError: (e: Error) => toast.error(e.message),
  });
  const revertMut = useMutation({
    mutationFn: async ({ booking, to }: { booking: Booking; to: Booking["status"] }) => {
      const { error } = await supabase.from("bookings").update({ status: to as any }).eq("id", booking.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mg-bookings"] });
      qc.invalidateQueries({ queryKey: ["mg-today-all"] });
      toast.success("Status reverted");
      setRevert(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mg-bookings"] });
      qc.invalidateQueries({ queryKey: ["mg-today-all"] });
      toast.success("Booking cancelled");
      setCancelConfirm(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const doReschedule = useMutation({
    mutationFn: async () => {
      if (!reschedule) throw new Error("No booking");
      const { booking, date, slot_id, service_id } = reschedule;
      if (!slot_id) throw new Error("Choose a slot");
      const rDow = new Date(date + "T00:00:00").getDay();
      const rSlot = (slots ?? []).find((s: any) => s.id === slot_id);
      if (!rSlot || rSlot.day_of_week !== rDow) throw new Error("Selected slot is not available on the chosen date");
      if (isSlotPast(date, rSlot.start_time)) throw new Error("This slot has already started — pick a later time");
      const { data: lastRow, error: tErr } = await supabase.from("bookings")
        .select("token_number").eq("business_id", booking.business_id)
        .eq("slot_id", slot_id).eq("date", date)
        .order("token_number", { ascending: false }).limit(1).maybeSingle();
      if (tErr) throw tErr;
      const token = (lastRow?.token_number ?? 0) + 1;
      const { error: insErr } = await supabase.from("bookings").insert({
        business_id: booking.business_id, slot_id, service_id: service_id || null, date,
        token_number: token as unknown as number,
        client_name: booking.client_name, client_phone: booking.client_phone,
        status: "booked", is_walkin: booking.is_walkin,
      });
      if (insErr) throw insErr;
      const { error: updErr } = await supabase.from("bookings").update({ status: "cancelled" as any }).eq("id", booking.id);
      if (updErr) throw updErr;
      return { token, date };
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["mg-bookings"] });
      qc.invalidateQueries({ queryKey: ["mg-today-all"] });
      toast.success(`Rescheduled to ${res?.date} — Token ${res?.token}`);
      setReschedule(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const doAdd = useMutation({
    mutationFn: async () => {
      if (!bizId) throw new Error("No business selected");
      if (!add.slot_id) throw new Error("Choose a slot");
      const aDow = new Date(add.date + "T00:00:00").getDay();
      const aSlot = (slots ?? []).find((s: any) => s.id === add.slot_id);
      if (!aSlot || aSlot.day_of_week !== aDow) throw new Error("Selected slot is not available on the chosen date");
      if (isSlotPast(add.date, aSlot.start_time)) throw new Error("This slot has already started — pick a later time");
      const { data: lastRow, error: tErr } = await supabase.from("bookings")
        .select("token_number").eq("business_id", bizId)
        .eq("slot_id", add.slot_id).eq("date", add.date)
        .order("token_number", { ascending: false }).limit(1).maybeSingle();
      if (tErr) throw tErr;
      const token = (lastRow?.token_number ?? 0) + 1;
      const { error } = await supabase.from("bookings").insert({
        business_id: bizId, slot_id: add.slot_id,
        service_id: add.service_id || null, date: add.date,
        token_number: token,
        client_name: add.name, client_phone: add.phone,
        status: "booked", is_walkin: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mg-bookings"] });
      qc.invalidateQueries({ queryKey: ["mg-today-all"] });
      setAdd({ name: "", phone: "", service_id: "", slot_id: "", date: todayStr() });
      toast.success("Booking added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (profile && !["owner", "admin"].includes(profile.role)) return <Forbidden />;

  // Admin with no biz and no ?as=<slug> selected — direct them to the admin panel.
  if (isAdmin && !bizId) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper px-4 text-center">
        <div className="max-w-md space-y-4">
          <p className="section-marker">Nothing selected</p>
          <h1 className="font-display text-4xl tracking-[-0.02em] text-ink">No client selected</h1>
          <p className="text-sm text-warm-5">
            Open the admin panel to pick a client and view their management page.
          </p>
          <Link to="/admin" className="mt-2 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper">
            Go to admin
          </Link>
        </div>
      </div>
    );
  }



  if (status?.state === "locked") {
    return (
      <div className="flex min-h-dvh flex-col">
        <StaffTopNav title={biz?.name ?? "Management"} />
        <div className="flex flex-1 items-center justify-center bg-warm-1 px-4 text-center">
          <div className="max-w-md">
            <h1 className="font-display text-4xl tracking-[-0.02em]">Plan Expired</h1>
            <p className="mt-3 text-warm-5">Contact us to continue your service.</p>
            <p className="mt-1 text-sm text-warm-5">[contact details]</p>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <StaffTopNav title={biz?.name ?? "Management"} businessSlug={biz?.slug} slots={slotInfo} />
      {impersonateSlug && (
        <div className="border-b border-rule bg-ink px-4 py-2 text-center text-xs uppercase tracking-[0.14em] text-paper">
          Viewing as admin · client <span className="font-semibold normal-case tracking-normal">{biz?.name ?? impersonateSlug}</span> ·{" "}
          <Link to="/admin" className="underline decoration-amber decoration-2 underline-offset-4">back to admin</Link>
        </div>
      )}
      {status && (status.state === "warning" || status.state === "grace") && (
        <div className={`border-b border-rule px-4 py-2 text-center text-xs uppercase tracking-[0.14em] ${status.state === "grace" ? "bg-amber/15 text-ink" : "bg-warm-1 text-warm-5"}`}>
          Plan expires in <span className="font-semibold">{Math.max(0, status.daysUntilExpiry)} days</span> — please contact us to renew.
        </div>
      )}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <p className="section-marker">Today</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl">Today&rsquo;s queue</h1>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Card label="Today" value={counts.total} />
            <Card label="Added" value={counts.added} />
            <Card label="Arrived" value={counts.arrived} />
            <Card label="Ongoing" value={counts.ongoing} />
            <Card label="Completed" value={counts.completed} />
            <Card label="No show" value={counts.no_show} />
          </div>
          <div className="border border-rule bg-paper p-5">
            <p className="section-marker">+ Add booking</p>

            <div className="mt-4 space-y-2">
              <label className="block">
                <span className="sr-only">Booking date</span>
                <input type="date" value={add.date} min={format(today, "yyyy-MM-dd")} max={format(addDays(today, 45), "yyyy-MM-dd")}
                  onChange={(e) => setAdd({ ...add, date: e.target.value, slot_id: "" })}
                  aria-label="Booking date"
                  className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
              </label>
              <select aria-label="Service" className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" value={add.service_id} onChange={(e) => setAdd({ ...add, service_id: e.target.value })}>
                <option value="">Service (optional)</option>
                {(services ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select aria-label="Slot" className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" value={add.slot_id} onChange={(e) => setAdd({ ...add, slot_id: e.target.value })}>
                <option value="">Choose slot</option>
                {(addDateSlots ?? []).map((s: any) => <option key={s.id} value={s.id}>{s.name}{s.start_time ? ` (${String(s.start_time).slice(0,5)})` : ""}</option>)}
              </select>
              <input aria-label="Client name" className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" placeholder="Name" value={add.name} onChange={(e) => setAdd({ ...add, name: e.target.value })} />
              <input aria-label="Client phone" className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" placeholder="Phone" value={add.phone} onChange={(e) => setAdd({ ...add, phone: e.target.value })} />
              <button disabled={!add.name || !add.phone || !add.slot_id || doAdd.isPending}
                onClick={() => doAdd.mutate()}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40">
                {doAdd.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Add booking"}
              </button>
            </div>
          </div>
        </div>


        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {Array.from({ length: 8 }).map((_, i) => {
              const d = addDays(today, i); const s = format(d, "yyyy-MM-dd"); const active = s === dateStr;
              return (
                <button key={s} onClick={() => setDateStr(s)}
                  className={`shrink-0 rounded-none border px-3 py-2 text-xs transition-colors ${active ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:bg-warm-1"}`}>
                  <div className="section-marker" style={{ color: active ? "var(--paper)" : undefined, opacity: active ? 0.7 : 1 }}>{format(d, "EEE")}</div>
                  <div className="mt-1 font-display text-sm tracking-tight">{format(d, "MMM d")}</div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-2">
            <input type="date" aria-label="Filter by date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
            <input aria-label="Search bookings" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-[160px] flex-1 rounded-none border border-rule bg-paper text-ink px-3 py-1.5 text-sm" />
          </div>
        </div>

        {/* Desktop / tablet table */}
        <div className="mt-4 hidden overflow-hidden border border-rule bg-paper md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-rule bg-warm-1">
                <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-warm-5">
                  <th className="px-4 py-3 font-medium">Token</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Slot</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (<tr><td colSpan={7} className="px-4 py-10 text-center text-warm-5">No bookings</td></tr>)}
                {filtered.map((b) => {
                  const svc = services?.find((s) => s.id === b.service_id)?.name ?? "—";
                  const slot = slots?.find((s) => s.id === b.slot_id);
                  const canAdvance = ["booked", "arrived", "ongoing"].includes(b.status);
                  const canRevert = !!prevStatus[b.status];
                  return (
                    <tr key={b.id} className="border-t border-rule hover:bg-warm-1/60 transition-colors">
                      <td className="px-4 py-3 font-semibold">
                        {b.token_number}{b.is_walkin && <span className="ml-1 rounded bg-amber/15 px-1 text-[10px] font-bold text-amber">W</span>}
                      </td>
                      <td className="px-4 py-3">{b.client_name}</td>
                      <td className="px-4 py-3">{b.client_phone}</td>
                      <td className="px-4 py-3">{svc}</td>
                      <td className="px-4 py-3">{slot?.name ?? "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1">
                          {canRevert && (
                            <button onClick={() => setRevert({ booking: b, to: prevStatus[b.status] })} aria-label={`Revert token ${b.token_number}`} title={`Back to ${prevStatus[b.status]}`} className="rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                          )}
                          {canAdvance && (
                            <button onClick={() => advance.mutate(b)} aria-label={`Advance token ${b.token_number}`} title={`Mark ${nextStatus[b.status]}`} className="rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                          )}
                          {canAdvance && (
                            <button onClick={() => setReschedule({ booking: b, date: b.date, slot_id: b.slot_id, service_id: b.service_id ?? "" })} aria-label={`Reschedule token ${b.token_number}`} title="Reschedule" className="rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><CalendarClock className="h-4 w-4" aria-hidden="true" /></button>
                          )}
                          {canAdvance && (
                            <button onClick={() => setCancelConfirm(b)} aria-label={`Cancel token ${b.token_number}`} title="Cancel" className="rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><X className="h-4 w-4" aria-hidden="true" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-2 md:hidden">
          {filtered.length === 0 && (
            <div className="border border-rule bg-paper px-3 py-8 text-center text-sm text-warm-5">No bookings</div>
          )}
          {filtered.map((b) => {
            const svc = services?.find((s) => s.id === b.service_id)?.name ?? "—";
            const slot = slots?.find((s) => s.id === b.slot_id);
            const canAdvance = ["booked", "arrived", "ongoing"].includes(b.status);
            const canRevert = !!prevStatus[b.status];
            return (
              <div key={b.id} className="border border-rule bg-paper p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">#{b.token_number}</span>
                      {b.is_walkin && <span className="rounded bg-amber/15 px-1 text-[10px] font-bold text-amber">W</span>}
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{b.client_name}</div>
                    <div className="truncate text-xs text-warm-5">{b.client_phone}</div>
                    <div className="mt-1 truncate text-xs text-warm-5">
                      {svc}{slot?.name ? ` · ${slot.name}` : ""}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    {canRevert && (
                      <button onClick={() => setRevert({ booking: b, to: prevStatus[b.status] })} aria-label={`Revert token ${b.token_number}`} title={`Back to ${prevStatus[b.status]}`} className="rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                    )}
                    {canAdvance && (
                      <button onClick={() => advance.mutate(b)} aria-label={`Advance token ${b.token_number}`} title={`Mark ${nextStatus[b.status]}`} className="rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                    )}
                    {canAdvance && (
                      <button onClick={() => setReschedule({ booking: b, date: b.date, slot_id: b.slot_id, service_id: b.service_id ?? "" })} aria-label={`Reschedule token ${b.token_number}`} title="Reschedule" className="rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><CalendarClock className="h-4 w-4" aria-hidden="true" /></button>
                    )}
                    {canAdvance && (
                      <button onClick={() => setCancelConfirm(b)} aria-label={`Cancel token ${b.token_number}`} title="Cancel" className="rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors"><X className="h-4 w-4" aria-hidden="true" /></button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>


      <Dialog open={!!reschedule} onOpenChange={(o) => { if (!o) setReschedule(null); }}>
        <DialogContent className="max-w-sm">
          {reschedule && (
            <>
              <DialogHeader>
                <DialogTitle>Reschedule token {reschedule.booking.token_number}</DialogTitle>
                <DialogDescription>{reschedule.booking.client_name} · {reschedule.booking.client_phone}</DialogDescription>
              </DialogHeader>
              <div className="mt-3 space-y-2">
                <input type="date" aria-label="New date" value={reschedule.date}
                  min={format(today, "yyyy-MM-dd")} max={format(addDays(today, 45), "yyyy-MM-dd")}
                  onChange={(e) => setReschedule({ ...reschedule, date: e.target.value, slot_id: "" })}
                  className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
                <select aria-label="Service" value={reschedule.service_id} onChange={(e) => setReschedule({ ...reschedule, service_id: e.target.value })}
                  className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm">
                  <option value="">Service (optional)</option>
                  {(services ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select aria-label="Slot" value={reschedule.slot_id} onChange={(e) => setReschedule({ ...reschedule, slot_id: e.target.value })}
                  className="w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm">
                  <option value="">Choose slot</option>
                  {(slots ?? []).filter((s: any) => s.day_of_week === new Date(reschedule.date + "T00:00:00").getDay() && !isSlotPast(reschedule.date, s.start_time)).map((s: any) => <option key={s.id} value={s.id}>{s.name}{s.start_time ? ` (${String(s.start_time).slice(0,5)})` : ""}</option>)}
                </select>
              </div>
              <DialogFooter className="mt-4">
                <button onClick={() => setReschedule(null)} className="rounded-full border border-rule px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper">Cancel</button>
                <button disabled={!reschedule.slot_id || doReschedule.isPending} onClick={() => doReschedule.mutate()}
                  className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40">
                  {doReschedule.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Confirm"}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!revert} onOpenChange={(o) => { if (!o) setRevert(null); }}>
        <AlertDialogContent>
          {revert && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Revert status?</AlertDialogTitle>
                <AlertDialogDescription>
                  Token {revert.booking.token_number} · {revert.booking.client_name}
                  <br />
                  Change status from <span className="font-semibold">{revert.booking.status.replace("_", " ")}</span> back to <span className="font-semibold">{revert.to.replace("_", " ")}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={revertMut.isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={revertMut.isPending} onClick={(e) => { e.preventDefault(); revertMut.mutate(revert); }}>
                  {revertMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Revert"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!cancelConfirm} onOpenChange={(o) => { if (!o) setCancelConfirm(null); }}>
        <AlertDialogContent>
          {cancelConfirm && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  Token {cancelConfirm.token_number} · {cancelConfirm.client_name}
                  <br />
                  This will mark the booking as <span className="font-semibold">cancelled</span> and cannot be undone from here.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={cancel.isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={cancel.isPending} onClick={(e) => { e.preventDefault(); cancel.mutate(cancelConfirm.id); }}>
                  {cancel.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Confirm Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <PaymentDialog
        booking={paying}
        currency={(impersonatedBiz?.currency ?? ownBiz?.currency) || "INR"}
        onClose={() => setPaying(null)}
        onDone={() => { qc.invalidateQueries({ queryKey: ["mg-bookings"] }); qc.invalidateQueries({ queryKey: ["mg-today-all"] }); setPaying(null); }}
      />
    </div>
  );
}


function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-rule bg-paper p-4 transition-colors hover:bg-warm-1">
      <div className="section-marker">{label}</div>
      <div className="mt-2 font-display text-4xl tracking-[-0.02em] text-ink">{value}</div>
    </div>
  );
}

