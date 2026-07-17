import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Forbidden } from "@/components/staff-nav";
import { adminActivateBusiness, adminSetBusinessLock, adminSetBusinessCurrency, adminInviteDoctor, adminRevokeDoctorInvite, adminRemoveDoctor } from "@/lib/admin.functions";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { toast } from "sonner";
import { Loader2, LogOut, Copy, Trash2, Lock, Unlock, ExternalLink, Check, Eye, Mail, UserX } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Control Center — Qfloww" },
      { name: "description", content: "Platform admin panel for activating businesses, managing slots and services, and reviewing activation requests." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Section = "businesses" | "requests" | "slots" | "services" | "doctors";

function AdminPage() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("businesses");
  const [activeBiz, setActiveBiz] = useState<string | null>(null);

  if (profile && profile.role !== "admin") return <Forbidden />;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="flex">
        <aside className="hidden md:block w-56 border-r bg-paper min-h-dvh p-4">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-warm-5">Admin</div>
            <div className="font-semibold">Control center</div>
          </div>
          <nav className="space-y-1 text-sm">
            {(["businesses", "requests", "slots", "services", "doctors"] as Section[]).map((s) => (
              <button key={s} onClick={() => setSection(s)}
                className={`block w-full rounded-md px-3 py-2 text-left capitalize ${section === s ? "bg-accent" : "hover:bg-accent/50"}`}>
                {s}
              </button>
            ))}
          </nav>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="mt-8 inline-flex items-center gap-2 text-xs text-warm-5 hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </aside>
        <main className="flex-1 p-6">
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto">
            {(["businesses", "requests", "slots", "services", "doctors"] as Section[]).map((s) => (
              <button key={s} onClick={() => setSection(s)} className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-sm capitalize ${section === s ? "bg-primary text-primary-foreground" : ""}`}>{s}</button>
            ))}
          </div>
          {section === "businesses" && <BusinessesSection onSelect={(id) => { setActiveBiz(id); setSection("slots"); }} />}
          {section === "requests" && <ActivationRequestsSection />}
          {section === "slots" && <SlotsSection activeBiz={activeBiz} setActiveBiz={setActiveBiz} />}
          {section === "services" && <ServicesSection activeBiz={activeBiz} setActiveBiz={setActiveBiz} />}
          {section === "doctors" && <DoctorsSection activeBiz={activeBiz} setActiveBiz={setActiveBiz} />}
        </main>
      </div>
    </div>
  );
}

function useBusinesses() {
  return useQuery({
    queryKey: ["admin-businesses"],
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
}

function BusinessSelector({ activeBiz, setActiveBiz }: { activeBiz: string | null; setActiveBiz: (id: string) => void }) {
  const { data: bizs } = useBusinesses();
  return (
    <select value={activeBiz ?? ""} onChange={(e) => setActiveBiz(e.target.value)} className="rounded-none border border-rule bg-paper px-3 py-1.5 text-sm text-ink">
      <option value="">— Select business —</option>
      {(bizs ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
    </select>
  );
}

function statusFor(b: any) {
  const now = Date.now();
  if (b.manual_lock || !b.is_active) return { label: "Locked", color: "bg-warm-2 text-destructive border border-rule" };
  if (!b.activated_at || !b.expires_at) return { label: "Pending", color: "bg-warm-1 text-warm-5 border border-rule" };
  const exp = new Date(b.expires_at).getTime();
  const daysLeft = Math.ceil((exp - now) / 86400000);
  if (daysLeft <= 0) return { label: "Expired", color: "bg-warm-2 text-destructive border border-rule" };
  if (daysLeft <= 7) return { label: `Expires in ${daysLeft}d`, color: "bg-amber/15 text-ink border border-amber/40" };
  return { label: `Active (${daysLeft}d left)`, color: "bg-warm-1 text-ink border border-rule" };
}

function BusinessesSection({ onSelect }: { onSelect: (id: string) => void }) {
  const qc = useQueryClient();
  const { data: bizs } = useBusinesses();
  const activate = useServerFn(adminActivateBusiness);
  const setLock = useServerFn(adminSetBusinessLock);

  const mActivate = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => activate({ data: { business_id: id, duration_days: days } }),
    onSuccess: () => { toast.success("Business activated"); qc.invalidateQueries({ queryKey: ["admin-businesses"] }); qc.invalidateQueries({ queryKey: ["activation-requests"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mLock = useMutation({
    mutationFn: ({ id, locked }: { id: string; locked: boolean }) => setLock({ data: { business_id: id, locked } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-businesses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl tracking-[-0.02em]">Business Accounts</h1>
      <p className="text-sm text-warm-5">
        Owners sign up themselves at <code className="rounded bg-warm-1 px-1">/signup</code>. Activate an account by giving it a duration.
      </p>

      <div className="border border-rule bg-paper p-6">
        <h2 className="mb-3 font-semibold">All businesses</h2>
        <div className="space-y-2">
          {(bizs ?? []).map((b) => {
            const s = statusFor(b);
            const bookingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${b.slug}`;
            return (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-warm-5">
                    /{b.slug} · {b.type}
                    {b.expires_at && ` · expires ${format(new Date(b.expires_at), "PP")}`}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs ${s.color}`}>{s.label}</span>
                  <CurrencyPicker business={b} />
                  <BookingLinkActions url={bookingUrl} />
                  <Link
                    to="/management"
                    search={{ as: b.slug }}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                    title="View this client's management page"
                  >
                    <Eye className="h-3 w-3" /> View as
                  </Link>
                  <button onClick={() => onSelect(b.id)} className="rounded-md border px-2 py-1 text-xs hover:bg-accent">Manage</button>
                  <ActivateMenu onActivate={(days) => mActivate.mutate({ id: b.id, days })} pending={mActivate.isPending} />
                  <button
                    onClick={() => mLock.mutate({ id: b.id, locked: !b.manual_lock })}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                    title={b.manual_lock ? "Unlock" : "Lock"}
                  >
                    {b.manual_lock ? <><Unlock className="h-3 w-3" /> Unlock</> : <><Lock className="h-3 w-3" /> Lock</>}
                  </button>
                </div>
              </div>
            );
          })}
          {(!bizs || bizs.length === 0) && <div className="text-sm text-warm-5">No businesses yet. Owners can sign up at /signup.</div>}
        </div>
      </div>
    </div>
  );
}

function ActivateMenu({ onActivate, pending }: { onActivate: (days: number) => void; pending: boolean }) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(30);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
        Activate
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-56 border border-rule bg-paper p-3 shadow-lg">
          <label className="text-xs text-warm-5">Duration (days)</label>
          <input type="number" min={1} max={3650} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 w-full rounded-none border border-rule bg-paper text-ink px-2 py-1 text-xs" />
          <div className="mt-2 flex flex-wrap gap-1">
            {[7, 30, 90, 365].map((d) => (
              <button key={d} onClick={() => setDays(d)} className="rounded-md border px-2 py-0.5 text-xs hover:bg-accent">{d}d</button>
            ))}
          </div>
          <button
            disabled={pending}
            onClick={() => { onActivate(days); setOpen(false); }}
            className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-50"
          >
            {pending && <Loader2 className="h-3 w-3 animate-spin" />} Confirm activation
          </button>
        </div>
      )}
    </div>
  );
}

function BookingLinkActions({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Booking link copied"))} aria-label="Copy booking link" title="Copy booking link" className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent">
        <Copy className="h-3 w-3" aria-hidden="true" /> Copy
      </button>
      <a href={url} target="_blank" rel="noreferrer" aria-label="Open booking page in new tab" title="Open booking page in new tab" className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent">
        <ExternalLink className="h-3 w-3" aria-hidden="true" /> Open
      </a>
    </div>
  );
}

function ActivationRequestsSection() {
  const qc = useQueryClient();
  const activate = useServerFn(adminActivateBusiness);
  const { data: requests } = useQuery({
    queryKey: ["activation-requests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("activation_requests")
        .select("*, businesses(name, slug)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const mApprove = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => activate({ data: { business_id: id, duration_days: days } }),
    onSuccess: () => { toast.success("Activated"); qc.invalidateQueries({ queryKey: ["activation-requests"] }); qc.invalidateQueries({ queryKey: ["admin-businesses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mReject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("activation_requests").update({ status: "rejected" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["activation-requests"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl tracking-[-0.02em]">Activation Requests</h1>
      <div className="space-y-2">
        {(requests ?? []).map((r: any) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 border border-rule bg-paper p-3">
            <div>
              <div className="font-semibold">{r.businesses?.name ?? "—"} <span className="text-xs text-warm-5">/{r.businesses?.slug}</span></div>
              <div className="text-xs text-warm-5">{format(new Date(r.created_at), "PPp")} · {r.status}</div>
              {r.message && <p className="mt-1 text-sm">{r.message}</p>}
            </div>
            {r.status === "pending" && (
              <div className="flex items-center gap-1">
                <button onClick={() => mApprove.mutate({ id: r.business_id, days: 30 })} className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"><Check className="h-3 w-3" /> Approve 30d</button>
                <button onClick={() => mReject.mutate(r.id)} className="rounded-md border px-2 py-1 text-xs text-destructive">Reject</button>
              </div>
            )}
          </div>
        ))}
        {(!requests || requests.length === 0) && <div className="text-sm text-warm-5">No activation requests.</div>}
      </div>
    </div>
  );
}

const DAYS = [
  { idx: 1, label: "Mon" }, { idx: 2, label: "Tue" }, { idx: 3, label: "Wed" },
  { idx: 4, label: "Thu" }, { idx: 5, label: "Fri" }, { idx: 6, label: "Sat" },
  { idx: 0, label: "Sun" },
];

function SlotsSection({ activeBiz, setActiveBiz }: { activeBiz: string | null; setActiveBiz: (id: string) => void }) {
  const qc = useQueryClient();
  const [day, setDay] = useState<number>(1);
  const [form, setForm] = useState({ name: "", start_time: "09:00", end_time: "12:00", max_capacity: 10 });
  const { data: slots } = useQuery({
    queryKey: ["slots-admin", activeBiz], enabled: !!activeBiz,
    queryFn: async () => (await supabase.from("slots").select("*").eq("business_id", activeBiz!).order("start_time")).data ?? [],
  });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("slots").insert({
        business_id: activeBiz!, name: form.name,
        start_time: form.start_time + ":00", end_time: form.end_time + ":00",
        max_capacity: form.max_capacity,
        day_of_week: day,
        days_of_week: [day],
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["slots-admin"] }); setForm({ name: "", start_time: "09:00", end_time: "12:00", max_capacity: 10 }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("slots").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Slot deleted"); qc.invalidateQueries({ queryKey: ["slots-admin"] }); },
    onError: (e: any) => {
      const msg = String(e?.message ?? e);
      if (msg.includes("violates foreign key") || e?.code === "23503") toast.error("Can't delete: this slot has existing bookings. Disable it instead.");
      else toast.error(msg || "Failed to delete slot");
    },
  });
  const toggle = useMutation({
    mutationFn: async (row: any) => { const { error } = await supabase.from("slots").update({ is_active: !row.is_active }).eq("id", row.id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slots-admin"] }),
  });
  const copyDay = useMutation({
    mutationFn: async (targetDay: number) => {
      const source = (slots ?? []).filter((s: any) => s.day_of_week === day);
      if (source.length === 0) throw new Error("No slots to copy from this day.");
      const rows = source.map((s: any) => ({
        business_id: activeBiz!, name: s.name,
        start_time: s.start_time, end_time: s.end_time,
        max_capacity: s.max_capacity, is_active: s.is_active,
        day_of_week: targetDay, days_of_week: [targetDay],
      }));
      const { error } = await supabase.from("slots").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Copied"); qc.invalidateQueries({ queryKey: ["slots-admin"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const daySlots = (slots ?? []).filter((s: any) => s.day_of_week === day);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl tracking-[-0.02em]">Weekly Slots</h1>
      <p className="text-sm text-warm-5">Set slots per weekday. They recur every week.</p>
      <BusinessSelector activeBiz={activeBiz} setActiveBiz={setActiveBiz} />
      {activeBiz && (
        <>
          <div className="flex flex-wrap gap-1 border-b border-rule pb-2">
            {DAYS.map((d) => (
              <button key={d.idx} onClick={() => setDay(d.idx)}
                className={`rounded-md px-3 py-1.5 text-sm ${day === d.idx ? "bg-ink text-paper" : "border border-rule bg-paper hover:bg-warm-1"}`}>
                {d.label} <span className="ml-1 text-xs opacity-60">{(slots ?? []).filter((s: any) => s.day_of_week === d.idx).length}</span>
              </button>
            ))}
          </div>

          <div className="border border-rule bg-paper p-4">
            <h3 className="mb-2 font-semibold">Add slot to {DAYS.find(d => d.idx === day)?.label}</h3>
            <div className="grid gap-2 md:grid-cols-5">
              <input aria-label="Slot name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
              <input aria-label="Start time" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
              <input aria-label="End time" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
              <input aria-label="Capacity" type="number" min={1} value={form.max_capacity} onChange={(e) => setForm({ ...form, max_capacity: Number(e.target.value) })} className="rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" placeholder="Capacity" />
              <button disabled={!form.name} onClick={() => create.mutate()} aria-label="Add slot" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50">Add</button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-warm-5">
            <span>Copy this day to:</span>
            {DAYS.filter(d => d.idx !== day).map((d) => (
              <button key={d.idx} onClick={() => copyDay.mutate(d.idx)} className="rounded-md border border-rule px-2 py-1 hover:bg-warm-1">{d.label}</button>
            ))}
          </div>

          <div className="border border-rule bg-paper">
            <table className="w-full text-sm">
              <thead className="bg-warm-1 text-xs uppercase text-warm-5">
                <tr><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">Capacity</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {daySlots.map((s: any) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2">{s.start_time ? String(s.start_time).slice(0, 5) : "—"} – {s.end_time ? String(s.end_time).slice(0, 5) : "—"}</td>
                    <td className="px-3 py-2">{s.max_capacity}</td>
                    <td className="px-3 py-2">{s.is_active ? "Active" : "Off"}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => toggle.mutate(s)} className="mr-1 rounded-md border px-2 py-1 text-xs">{s.is_active ? "Disable" : "Enable"}</button>
                      <button onClick={() => { if (window.confirm(`Delete slot "${s.name}"?`)) del.mutate(s.id); }} aria-label={`Delete slot ${s.name}`} className="rounded-md border px-2 py-1 text-xs text-destructive"><Trash2 className="h-3 w-3" aria-hidden="true" /></button>
                    </td>
                  </tr>
                ))}
                {daySlots.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-warm-5">No slots on this day</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}


function ServicesSection({ activeBiz, setActiveBiz }: { activeBiz: string | null; setActiveBiz: (id: string) => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data: services } = useQuery({
    queryKey: ["services-admin", activeBiz], enabled: !!activeBiz,
    queryFn: async () => (await supabase.from("services").select("*").eq("business_id", activeBiz!).order("name")).data ?? [],
  });
  const create = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("services").insert({ business_id: activeBiz!, name }); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services-admin"] }); setName(""); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("services").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-admin"] }),
  });
  const toggle = useMutation({
    mutationFn: async (row: any) => { const { error } = await supabase.from("services").update({ is_active: !row.is_active }).eq("id", row.id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-admin"] }),
  });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl tracking-[-0.02em]">Services Manager</h1>
      <BusinessSelector activeBiz={activeBiz} setActiveBiz={setActiveBiz} />
      {activeBiz && (
        <>
          <div className="flex gap-2">
            <input aria-label="Service name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" className="flex-1 rounded-none border border-rule bg-paper text-ink px-3 py-1.5 text-sm" />
            <button disabled={!name} onClick={() => create.mutate()} className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground disabled:opacity-50">Add</button>
          </div>
          <div className="space-y-1">
            {(services ?? []).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between border border-rule bg-paper px-3 py-2 text-sm">
                <span>{s.name} {!s.is_active && <span className="ml-2 text-xs text-warm-5">(hidden)</span>}</span>
                <div className="flex gap-1">
                  <button onClick={() => toggle.mutate(s)} className="rounded-md border px-2 py-1 text-xs">{s.is_active ? "Hide" : "Show"}</button>
                  <button onClick={() => del.mutate(s.id)} aria-label={`Delete service ${s.name}`} className="rounded-md border px-2 py-1 text-xs text-destructive"><Trash2 className="h-3 w-3" aria-hidden="true" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CurrencyPicker({ business }: { business: any }) {
  const qc = useQueryClient();
  const setCurrency = useServerFn(adminSetBusinessCurrency);
  return (
    <select
      value={business.currency ?? "INR"}
      onChange={async (e) => {
        try {
          await setCurrency({ data: { business_id: business.id, currency: e.target.value } });
          toast.success("Currency updated");
          qc.invalidateQueries({ queryKey: ["admin-businesses"] });
        } catch (err: any) {
          toast.error(err?.message ?? "Failed");
        }
      }}
      className="rounded-none border border-rule bg-paper px-2 py-1 text-xs"
      aria-label="Business currency"
    >
      {CURRENCY_OPTIONS.map((c) => (
        <option key={c.code} value={c.code}>{c.code}</option>
      ))}
    </select>
  );
}

function DoctorsSection({ activeBiz, setActiveBiz }: { activeBiz: string | null; setActiveBiz: (id: string) => void }) {
  const qc = useQueryClient();
  const invite = useServerFn(adminInviteDoctor);
  const revoke = useServerFn(adminRevokeDoctorInvite);
  const remove = useServerFn(adminRemoveDoctor);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const { data: invites } = useQuery({
    queryKey: ["doctor-invites", activeBiz],
    enabled: !!activeBiz,
    queryFn: async () => (await supabase.from("doctor_invites").select("*").eq("business_id", activeBiz!).order("created_at", { ascending: false })).data ?? [],
  });
  const { data: doctorRoles } = useQuery({
    queryKey: ["doctor-roles", activeBiz],
    enabled: !!activeBiz,
    queryFn: async () => (await supabase.from("user_roles").select("user_id").eq("business_id", activeBiz!).eq("role", "doctor")).data ?? [],
  });
  const doctorIds = (doctorRoles ?? []).map((r: any) => r.user_id);
  const { data: doctors } = useQuery({
    queryKey: ["doctor-profiles", doctorIds.join(",")],
    enabled: doctorIds.length > 0,
    queryFn: async () => (await supabase.from("profiles").select("id, email, display_name").in("id", doctorIds)).data ?? [],
  });

  const submit = async () => {
    if (!activeBiz || !email) return;
    setSending(true);
    try {
      await invite({ data: { business_id: activeBiz, email: email.trim().toLowerCase() } });
      toast.success("Invitation sent");
      setEmail("");
      qc.invalidateQueries({ queryKey: ["doctor-invites"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl tracking-[-0.02em]">Doctors</h1>
      <BusinessSelector activeBiz={activeBiz} setActiveBiz={setActiveBiz} />
      {activeBiz && (
        <>
          <div className="border border-rule bg-paper p-4">
            <h3 className="mb-2 font-semibold">Invite a doctor</h3>
            <div className="flex flex-wrap gap-2">
              <input type="email" placeholder="doctor@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 min-w-[220px] rounded-none border border-rule bg-paper px-3 py-1.5 text-sm" />
              <button disabled={!email || sending} onClick={submit} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-1.5 text-sm text-paper disabled:opacity-50">
                {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                Send invite
              </button>
            </div>
            <p className="mt-2 text-xs text-warm-5">The doctor receives an email with a link to set their password and join. Invitations expire in 14 days.</p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-warm-5">Active doctors</h3>
            {doctorIds.length === 0 ? (
              <p className="text-sm text-warm-5">No doctors yet.</p>
            ) : (
              <div className="space-y-1">
                {(doctors ?? []).map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between border border-rule bg-paper px-3 py-2 text-sm">
                    <div>
                      <div>{d.display_name || d.email}</div>
                      <div className="text-xs text-warm-5">{d.email}</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm(`Remove ${d.email} from this clinic?`)) return;
                        try {
                          await remove({ data: { user_id: d.id, business_id: activeBiz } });
                          toast.success("Removed");
                          qc.invalidateQueries({ queryKey: ["doctor-roles"] });
                          qc.invalidateQueries({ queryKey: ["doctor-profiles"] });
                        } catch (e: any) { toast.error(e?.message ?? "Failed"); }
                      }}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-destructive"
                    >
                      <UserX className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-warm-5">Invitations</h3>
            {(invites ?? []).length === 0 ? (
              <p className="text-sm text-warm-5">No invitations sent.</p>
            ) : (
              <div className="border border-rule bg-paper">
                <table className="w-full text-sm">
                  <thead className="bg-warm-1 text-xs uppercase text-warm-5">
                    <tr><th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-left">Expires</th><th className="px-3 py-2 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {(invites ?? []).map((inv: any) => (
                      <tr key={inv.id} className="border-t">
                        <td className="px-3 py-2">{inv.email}</td>
                        <td className="px-3 py-2 capitalize">{inv.status}</td>
                        <td className="px-3 py-2 text-xs text-warm-5">{format(new Date(inv.expires_at), "PP")}</td>
                        <td className="px-3 py-2 text-right">
                          {inv.status === "pending" && (
                            <button
                              onClick={async () => {
                                try {
                                  await revoke({ data: { invite_id: inv.id } });
                                  toast.success("Revoked");
                                  qc.invalidateQueries({ queryKey: ["doctor-invites"] });
                                } catch (e: any) { toast.error(e?.message ?? "Failed"); }
                              }}
                              className="rounded-md border px-2 py-1 text-xs"
                            >Revoke</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
