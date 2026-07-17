// Doctor-scoped server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getDoctorBusinessId(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from("user_roles")
    .select("business_id")
    .eq("user_id", userId)
    .eq("role", "doctor")
    .maybeSingle();
  if (!data?.business_id) throw new Error("Forbidden");
  return data.business_id as string;
}

// Mark a booking completed and record the payment (amount + method).
// Usable by both the owner (management) and the doctor. RLS enforces business scope.
export const markBookingCompleted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      booking_id: z.string().uuid(),
      amount_paid: z.number().min(0).max(10_000_000),
      payment_method: z.enum(["cash", "card", "upi", "other"]),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({
        status: "completed",
        amount_paid: data.amount_paid,
        payment_method: data.payment_method,
      })
      .eq("id", data.booking_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Attach or update payment info without changing status (backfill / correction).
export const setBookingPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      booking_id: z.string().uuid(),
      amount_paid: z.number().min(0).max(10_000_000),
      payment_method: z.enum(["cash", "card", "upi", "other"]),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({
        amount_paid: data.amount_paid,
        payment_method: data.payment_method,
      })
      .eq("id", data.booking_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Doctor: fetch business summary (currency, name).
export const doctorBusinessInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const bizId = await getDoctorBusinessId(context.supabase, context.userId);
    const { data } = await context.supabase
      .from("businesses")
      .select("id, name, slug, currency")
      .eq("id", bizId)
      .maybeSingle();
    return data;
  });
