import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getPublicBookingData,
  getSlotAvailability,
  createPublicBooking,
} from "@/lib/booking.functions";
import { computePlanStatus } from "@/lib/plan";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/book/$slug")({
  head: ({ params }) => {
    const desc = `Book an appointment online with ${params.slug} on Qfloww — pick a time, confirm your details, and receive a token by SMS or email in seconds.`;
    return {
      meta: [
        { title: `Book an appointment — ${params.slug}` },
        { name: "description", content: desc },
        { property: "og:title", content: `Book an appointment — ${params.slug}` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: BookPage,
});

function BookPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getData = useServerFn(getPublicBookingData);
  const getAvail = useServerFn(getSlotAvailability);
  const create = useServerFn(createPublicBooking);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [date, setDate] = useState<Date>(today);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState<{ token_number: number; name: string; phone: string; email: string | null } | null>(null);
  const [pageStart, setPageStart] = useState(0);
  const PAGE_SIZE = 16; // 4 rows × 4 cols on mobile
  const TOTAL_DAYS = 46;

  const { data, isLoading } = useQuery({
    queryKey: ["book", slug],
    queryFn: () => getData({ data: { slug } }),
  });

  const dateStr = format(date, "yyyy-MM-dd");
  const dow = date.getDay();

  const { data: availability } = useQuery({
    queryKey: ["availability", data?.business?.id, dateStr],
    enabled: !!data?.business?.id,
    queryFn: () => getAvail({ data: { business_id: data!.business!.id, date: dateStr } }),
  });

  const submit = useMutation({
    mutationFn: async () =>
      create({
        data: {
          slug,
          service_id: serviceId,
          slot_id: slotId!,
          date: dateStr,
          client_name: name.trim(),
          client_phone: phone.trim(),
          client_email: email.trim() ? email.trim() : null,
        },
      }),
    onSuccess: (b) => {
      setConfirmed({ token_number: b.token_number, name: b.client_name, phone: b.client_phone, email: b.client_email });
      qc.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <Loader2 className="h-6 w-6 animate-spin text-warm-4" />
      </div>
    );
  }
  if (!data?.business) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper px-4 text-center">
        <div>
          <p className="section-marker">404 — Not found</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.02em]">This booking page doesn't exist.</h1>
        </div>
      </div>
    );
  }
  const status = computePlanStatus(data.business as any);
  if (status.state === "locked") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper px-4 text-center">
        <div className="max-w-md">
          <p className="section-marker">Temporarily paused</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.02em]">{data.business.name}</h1>
          <p className="mt-6 text-warm-5">Contact us to continue your service.</p>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
        <div className="w-full max-w-md border border-rule bg-paper p-10 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-amber" aria-hidden="true" />
          <p className="section-marker mt-6">Confirmed</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.02em]">You're booked.</h1>
          <p className="mt-3 text-sm text-warm-5">Please arrive on time. Save this token number.</p>
          <div className="mt-8 border-y border-rule py-8">
            <div className="section-marker">Token</div>
            <div className="font-display text-7xl leading-none tracking-[-0.03em]">{confirmed.token_number}</div>
          </div>
          <dl className="mt-6 space-y-2 text-left text-sm">
            <Row label="Name" value={confirmed.name} />
            <Row label="Phone" value={confirmed.phone} />
            {confirmed.email && <Row label="Email" value={confirmed.email} />}
            <Row label="Date" value={format(date, "PPP")} />
          </dl>
          {confirmed.email && (
            <p className="mt-4 text-xs text-warm-4">A confirmation with your token has been sent to your email.</p>
          )}
          <button
            onClick={() => { setConfirmed(null); setName(""); setPhone(""); setEmail(""); setSlotId(null); setServiceId(null); navigate({ to: "/book/$slug", params: { slug } }); }}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rule px-4 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Book another
          </button>
        </div>
      </div>
    );
  }

  const nowMs = Date.now();
  const isToday = date.toDateString() === today.toDateString();
  const availableSlots = (data.slots ?? []).filter((s) => {
    const days = Array.isArray(s.days_of_week) ? (s.days_of_week as number[]) : [];
    if (days.length > 0 && !days.includes(dow)) return false;
    if (isToday && s.start_time) {
      const [hh, mm] = String(s.start_time).split(":").map((x) => parseInt(x, 10) || 0);
      const slotStart = new Date();
      slotStart.setHours(hh, mm, 0, 0);
      if (slotStart.getTime() <= nowMs) return false;
    }
    return true;
  });

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">
          <p className="section-marker">Book with</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.02em] md:text-5xl">{data.business.name}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <p className="section-marker">01 — Date</p>
                <h2 className="mt-2 flex items-center gap-2 font-display text-3xl tracking-[-0.02em]">
                  <CalendarDays className="h-5 w-5 text-warm-4" /> Pick a date
                </h2>

              </div>
              <div className="flex items-center gap-1 sm:hidden">
                <button
                  type="button"
                  onClick={() => setPageStart((p) => Math.max(0, p - PAGE_SIZE))}
                  disabled={pageStart === 0}
                  aria-label="Previous dates"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rule text-warm-5 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPageStart((p) => Math.min(TOTAL_DAYS - PAGE_SIZE, p + PAGE_SIZE))}
                  disabled={pageStart + PAGE_SIZE >= TOTAL_DAYS}
                  aria-label="Next dates"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rule text-warm-5 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-5">
              {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
                const d = addDays(today, i);
                const active = d.toDateString() === date.toDateString();
                const inMobilePage = i >= pageStart && i < pageStart + PAGE_SIZE;
                return (
                  <button
                    key={i}
                    onClick={() => { setDate(d); setSlotId(null); }}
                    className={`${inMobilePage ? "" : "hidden sm:block"} p-3 text-center text-xs transition-colors ${
                      active ? "bg-ink text-paper" : "bg-paper hover:bg-warm-1"
                    }`}
                  >
                    <div className="section-marker" style={{ color: active ? "var(--paper)" : undefined, opacity: active ? 0.7 : 1 }}>{format(d, "EEE")}</div>
                    <div className="mt-1 font-display text-lg leading-none">{format(d, "d")}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider opacity-60">{format(d, "MMM")}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="section-marker">02 — Details</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.02em]">Your details</h2>
            <div className="mt-8 space-y-8">
              <label className="block">
                <span className="section-marker">Service</span>
                <select
                  value={serviceId ?? ""}
                  onChange={(e) => setServiceId(e.target.value || null)}
                  className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none"
                >
                  <option value="">Choose a service…</option>
                  {(data.services ?? []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <div>
                <span className="section-marker">Slot</span>
                <div className="mt-3 divide-y divide-rule border-y border-rule">
                  {availableSlots.length === 0 && (
                    <div className="py-6 text-sm text-warm-5">No slots on this day.</div>
                  )}
                  {availableSlots.map((s) => {
                    const av = availability?.find((a) => a.slot_id === s.id);
                    const full = av?.full ?? false;
                    const active = slotId === s.id;
                    return (
                      <button
                        key={s.id}
                        disabled={full}
                        onClick={() => setSlotId(s.id)}
                        className={`flex w-full items-center justify-between gap-4 py-4 text-left transition-colors ${
                          full
                            ? "cursor-not-allowed text-warm-4"
                            : active
                              ? "text-ink"
                              : "text-ink hover:opacity-70"
                        }`}
                      >
                        <div>
                          <div className="font-display text-lg">{s.name}</div>
                          <div className="mt-0.5 text-xs text-warm-5">
                            {s.start_time ? String(s.start_time).slice(0, 5) : "—"} – {s.end_time ? String(s.end_time).slice(0, 5) : "—"}
                          </div>
                        </div>
                        {full ? (
                          <span className="text-[10px] uppercase tracking-[0.14em] text-warm-4">Full</span>
                        ) : (
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${active ? "border-ink bg-ink text-paper" : "border-rule text-warm-4"}`}>
                            {active ? "✓" : "→"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="block">
                <span className="section-marker">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none" />
              </label>
              <label className="block">
                <span className="section-marker">Phone</span>
                <input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none" />
              </label>
              <label className="block">
                <span className="section-marker">Email <span className="normal-case text-warm-4">(optional — we'll email your token)</span></span>
                <input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none" />
              </label>
              <div className="pt-2">
                <p className="section-marker">03 — Confirm</p>
                <button
                  onClick={() => submit.mutate()}
                  disabled={!slotId || !name || !phone || submit.isPending}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Confirm booking
                </button>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-warm-4">
                  We'll hold your token the moment you confirm.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-rule pb-2">
      <span className="section-marker">{label}</span>
      <span className="font-display text-sm text-ink">{value}</span>
    </div>
  );
}

