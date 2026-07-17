// Public/staff booking server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Fetches business, active services, active slots for a slug (public booking page).
export const getPublicBookingData = createServerFn({ method: "GET" })
  .inputValidator((raw) => z.object({ slug: z.string() }).parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: biz } = await supabaseAdmin
      .from("businesses")
      .select("id, name, slug, type, plan, plan_start, is_active, manual_lock, expires_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!biz) return { business: null, services: [], slots: [] };
    const [{ data: services }, { data: slots }] = await Promise.all([
      supabaseAdmin.from("services").select("id, name").eq("business_id", biz.id).eq("is_active", true).order("name"),
      supabaseAdmin.from("slots").select("id, name, start_time, end_time, days_of_week").eq("business_id", biz.id).eq("is_active", true).order("start_time"),
    ]);
    return { business: biz, services: services ?? [], slots: slots ?? [] };
  });


// Returns counts per slot for a given date so the public page can mark slots as full.
// Does NOT expose max_capacity to the client — only a { slot_id, count, full } shape.
export const getSlotAvailability = createServerFn({ method: "GET" })
  .inputValidator((raw) =>
    z.object({ business_id: z.string().uuid(), date: z.string() }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: slots } = await supabaseAdmin
      .from("slots")
      .select("id, max_capacity")
      .eq("business_id", data.business_id)
      .eq("is_active", true);
    if (!slots) return [];
    const { data: bookings } = await supabaseAdmin
      .from("bookings")
      .select("slot_id, status")
      .eq("business_id", data.business_id)
      .eq("date", data.date)
      .neq("status", "cancelled");
    const counts = new Map<string, number>();
    (bookings ?? []).forEach((b) => { if (b.slot_id) counts.set(b.slot_id, (counts.get(b.slot_id) ?? 0) + 1); });
    return slots.map((s) => ({
      slot_id: s.id,
      count: counts.get(s.id) ?? 0,
      full: (counts.get(s.id) ?? 0) >= s.max_capacity,
    }));
  });

// Create a public booking (anonymous, no auth). Validates capacity server-side.
export const createPublicBooking = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        slug: z.string(),
        service_id: z.string().uuid().nullable(),
        slot_id: z.string().uuid(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        client_name: z.string().min(1).max(120),
        client_phone: z.string().min(4).max(40),
        client_email: z.string().email().max(200).optional().nullable(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: biz } = await supabaseAdmin
      .from("businesses")
      .select("id, name, is_active, plan, plan_start, manual_lock")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!biz) throw new Error("Business not found");
    if (!biz.is_active || biz.manual_lock) throw new Error("Bookings are not available");

    // Enforce date range: today → today+45
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = new Date(today);
    max.setDate(max.getDate() + 45);
    const d = new Date(data.date + "T00:00:00");
    if (d < today || d > max) throw new Error("Date out of range");

    // Capacity check
    const { data: slot } = await supabaseAdmin
      .from("slots")
      .select("id, name, start_time, end_time, max_capacity, is_active, business_id")
      .eq("id", data.slot_id)
      .maybeSingle();
    if (!slot || slot.business_id !== biz.id || !slot.is_active) throw new Error("Slot unavailable");

    const { count: taken } = await supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("business_id", biz.id)
      .eq("slot_id", slot.id)
      .eq("date", data.date)
      .neq("status", "cancelled");
    if ((taken ?? 0) >= slot.max_capacity) throw new Error("This slot is fully booked");

    // Allocate token
    const { data: lastRow, error: tokenErr } = await supabaseAdmin
      .from("bookings")
      .select("token_number")
      .eq("business_id", biz.id)
      .eq("slot_id", slot.id)
      .eq("date", data.date)
      .order("token_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (tokenErr) {
      console.error("createPublicBooking token lookup failed:", tokenErr);
      throw new Error("Booking failed, please try again");
    }
    const tokenRes = (lastRow?.token_number ?? 0) + 1;

    const emailNormalized = data.client_email?.trim().toLowerCase() || null;

    const { data: booking, error: insErr } = await supabaseAdmin
      .from("bookings")
      .insert({
        business_id: biz.id,
        slot_id: slot.id,
        service_id: data.service_id,
        date: data.date,
        token_number: tokenRes as unknown as number,
        client_name: data.client_name,
        client_phone: data.client_phone,
        client_email: emailNormalized,
        status: "booked",
        is_walkin: false,
      })
      .select("id, token_number, date, client_name, client_phone, client_email")
      .single();
    if (insErr || !booking) {
      if (insErr) console.error("createPublicBooking insert failed:", insErr);
      throw new Error("Booking failed, please try again");
    }

    // Fire-and-forget: enqueue confirmation email if provided.
    if (emailNormalized) {
      let serviceName: string | null = null;
      if (data.service_id) {
        const { data: svc } = await supabaseAdmin
          .from("services")
          .select("name")
          .eq("id", data.service_id)
          .maybeSingle();
        serviceName = svc?.name ?? null;
      }
      const fmt = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : null);
      const slotTime = slot.start_time || slot.end_time
        ? `${fmt(slot.start_time as unknown as string) ?? "—"} – ${fmt(slot.end_time as unknown as string) ?? "—"}`
        : null;
      try {
        const { sendTransactionalEmailServer } = await import("@/lib/email/send-server");
        await sendTransactionalEmailServer({
          templateName: "booking-confirmation",
          recipientEmail: emailNormalized,
          idempotencyKey: `booking-${booking.id}`,
          templateData: {
            business_name: biz.name,
            client_name: booking.client_name,
            token_number: booking.token_number,
            date: booking.date,
            slot_name: (slot as any).name ?? null,
            slot_time: slotTime,
            service_name: serviceName,
          },
        });
      } catch (e) {
        console.error("booking confirmation email failed", e);
      }
    }

    return booking;
  });

