import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { StaffTopNav, StatusBadge, Forbidden } from "@/components/staff-nav";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/management/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Booking History — Qfloww" },
      { name: "description", content: "Searchable history of past bookings for your business: filter by date and look up clients by name, phone, or token." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

export function HistoryPage() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { data: bookings } = useQuery({
    queryKey: ["history", profile?.business_id, dateFilter],
    enabled: !!profile?.business_id,
    queryFn: async () => {
      let q = supabase.from("bookings").select("*").eq("business_id", profile!.business_id!).order("date", { ascending: false }).order("token_number").limit(500);
      if (dateFilter) q = q.eq("date", dateFilter);
      const { data } = await q;
      return data ?? [];
    },
  });
  const { data: services } = useQuery({
    queryKey: ["services", profile?.business_id], enabled: !!profile?.business_id,
    queryFn: async () => (await supabase.from("services").select("id, name").eq("business_id", profile!.business_id!)).data ?? [],
  });
  const { data: slots } = useQuery({
    queryKey: ["slots-full", profile?.business_id], enabled: !!profile?.business_id,
    queryFn: async () => (await supabase.from("slots").select("id, name, start_time, end_time, max_capacity, day_of_week").eq("business_id", profile!.business_id!).eq("is_active", true).order("start_time")).data ?? [],
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDow = new Date().getDay();
  const { data: todayBookings } = useQuery({
    queryKey: ["today-counts", profile?.business_id, today], enabled: !!profile?.business_id,
    queryFn: async () => (await supabase.from("bookings").select("slot_id, status").eq("business_id", profile!.business_id!).eq("date", today).neq("status", "cancelled")).data ?? [],
  });
  const slotInfo = useMemo(() => {
    const counts = new Map<string, number>();
    (todayBookings ?? []).forEach((b: any) => { if (b.slot_id) counts.set(b.slot_id, (counts.get(b.slot_id) ?? 0) + 1); });
    return (slots ?? []).filter((s: any) => s.day_of_week === todayDow).map((s: any) => ({
      id: s.id, name: s.name, start_time: s.start_time, end_time: s.end_time,
      max_capacity: s.max_capacity, booked_today: counts.get(s.id) ?? 0,
    }));
  }, [slots, todayBookings, todayDow]);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b: any) => [b.client_name ?? "", b.client_phone ?? "", String(b.token_number)].some((v) => v.toLowerCase().includes(q)));
  }, [bookings, search]);

  if (profile && !["owner", "admin"].includes(profile.role)) return <Forbidden />;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <StaffTopNav title="Management" businessSlug={profile?.business_slug ?? undefined} slots={slotInfo} />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <p className="section-marker">Archive</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl">Booking history</h1>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <input aria-label="Search bookings" placeholder="Search name, phone, token…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-[220px] rounded-none border border-rule bg-paper text-ink px-3 py-1.5 text-sm" />
          <input type="date" aria-label="Filter by date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm" />
          {dateFilter && <button onClick={() => setDateFilter("")} className="rounded-full border border-rule px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper">Clear</button>}
        </div>
        <div className="overflow-hidden border border-rule bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-rule bg-warm-1">
                <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-warm-5">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Token</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Slot</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-warm-5">No history</td></tr>}
                {filtered.map((b: any) => {
                  const svc = services?.find((s: any) => s.id === b.service_id)?.name ?? "—";
                  const slot = slots?.find((s: any) => s.id === b.slot_id)?.name ?? "—";
                  return (
                    <tr key={b.id} className="border-t border-rule hover:bg-warm-1/60 transition-colors">
                      <td className="px-4 py-3">{format(new Date(b.date + "T00:00:00"), "PP")}</td>
                      <td className="px-4 py-3 font-semibold">{b.token_number}</td>
                      <td className="px-4 py-3">{b.client_name}</td>
                      <td className="px-4 py-3">{b.client_phone}</td>
                      <td className="px-4 py-3">{svc}</td>
                      <td className="px-4 py-3">{slot}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">{b.is_walkin ? <span className="rounded bg-amber/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber">Walk-in</span> : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

