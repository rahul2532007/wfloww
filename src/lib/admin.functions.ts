// Admin-only server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

// ---------- ACTIVATE BUSINESS ----------
export const adminActivateBusiness = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      business_id: z.string().uuid(),
      duration_days: z.number().int().min(1).max(3650),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date();
    const expires = new Date(now.getTime() + data.duration_days * 24 * 60 * 60 * 1000);
    const { error } = await supabaseAdmin
      .from("businesses")
      .update({
        activated_at: now.toISOString(),
        expires_at: expires.toISOString(),
        is_active: true,
        manual_lock: false,
      })
      .eq("id", data.business_id);
    if (error) throw new Error(error.message);

    // Mark any pending activation requests as approved
    await supabaseAdmin
      .from("activation_requests")
      .update({ status: "approved" })
      .eq("business_id", data.business_id)
      .eq("status", "pending");

    return { ok: true, expires_at: expires.toISOString() };
  });

// ---------- DEACTIVATE / LOCK BUSINESS ----------
export const adminSetBusinessLock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({ business_id: z.string().uuid(), locked: z.boolean() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("businesses")
      .update({ manual_lock: data.locked })
      .eq("id", data.business_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- SEED / ENSURE PLATFORM ADMIN ----------
// One-shot bootstrap: promotes the currently signed-in user to admin
// if no admin exists yet.
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("Admin already exists");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- SET BUSINESS CURRENCY ----------
export const adminSetBusinessCurrency = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      business_id: z.string().uuid(),
      currency: z.string().length(3),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("businesses")
      .update({ currency: data.currency.toUpperCase() })
      .eq("id", data.business_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- INVITE DOCTOR ----------
export const adminInviteDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      business_id: z.string().uuid(),
      email: z.string().email(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const email = data.email.trim().toLowerCase();

    // Revoke any existing pending invite for the same business+email so tokens don't accumulate.
    await supabaseAdmin
      .from("doctor_invites")
      .update({ status: "revoked" })
      .eq("business_id", data.business_id)
      .eq("email", email)
      .eq("status", "pending");

    const { data: inv, error } = await supabaseAdmin
      .from("doctor_invites")
      .insert({
        business_id: data.business_id,
        email,
        invited_by: context.userId,
      })
      .select("token, business_id")
      .maybeSingle();
    if (error || !inv) throw new Error(error?.message ?? "Failed to create invite");

    const { data: biz } = await supabaseAdmin
      .from("businesses")
      .select("name")
      .eq("id", inv.business_id)
      .maybeSingle();

    // Send the invite email via the transactional queue.
    try {
      const { sendTransactionalEmailServer } = await import("@/lib/email/send-server");
      const origin = "https://reception.pridemarketing.co.in";
      const acceptUrl = `${origin}/doctor-invite/accept?token=${inv.token}`;
      await sendTransactionalEmailServer({
        templateName: "doctor-invite",
        recipientEmail: email,
        idempotencyKey: `doctor-invite-${inv.token}`,
        templateData: {
          businessName: biz?.name ?? "Your clinic",
          acceptUrl,
          recipient: email,
        },
      });
    } catch (e) {
      console.error("Doctor invite email failed:", e);
    }

    return { ok: true, token: inv.token };
  });

// ---------- REVOKE DOCTOR INVITE ----------
export const adminRevokeDoctorInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => z.object({ invite_id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("doctor_invites")
      .update({ status: "revoked" })
      .eq("id", data.invite_id)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- REMOVE DOCTOR ----------
export const adminRemoveDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({ user_id: z.string().uuid(), business_id: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role", "doctor")
      .eq("business_id", data.business_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
