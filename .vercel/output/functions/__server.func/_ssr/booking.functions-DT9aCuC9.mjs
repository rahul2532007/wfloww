import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/booking.functions-DT9aCuC9.js
var getPublicBookingData_createServerFn_handler = createServerRpc({
	id: "e15ba3a9af73ee4a2029aa9f88f52741c69ca7a68e136d4f097b9ae24f1f44db",
	name: "getPublicBookingData",
	filename: "src/lib/booking.functions.ts"
}, (opts) => getPublicBookingData.__executeServer(opts));
var getPublicBookingData = createServerFn({ method: "GET" }).inputValidator((raw) => objectType({ slug: stringType() }).parse(raw)).handler(getPublicBookingData_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { data: biz } = await supabaseAdmin.from("businesses").select("id, name, slug, type, plan, plan_start, is_active, manual_lock, expires_at").eq("slug", data.slug).maybeSingle();
	if (!biz) return {
		business: null,
		services: [],
		slots: []
	};
	const [{ data: services }, { data: slots }] = await Promise.all([supabaseAdmin.from("services").select("id, name").eq("business_id", biz.id).eq("is_active", true).order("name"), supabaseAdmin.from("slots").select("id, name, start_time, end_time, days_of_week").eq("business_id", biz.id).eq("is_active", true).order("start_time")]);
	return {
		business: biz,
		services: services ?? [],
		slots: slots ?? []
	};
});
var getSlotAvailability_createServerFn_handler = createServerRpc({
	id: "3ccd4792fda377ca78b050571f7d6f896098d4fa3936f2d9c0bef8d55c466848",
	name: "getSlotAvailability",
	filename: "src/lib/booking.functions.ts"
}, (opts) => getSlotAvailability.__executeServer(opts));
var getSlotAvailability = createServerFn({ method: "GET" }).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	date: stringType()
}).parse(raw)).handler(getSlotAvailability_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { data: slots } = await supabaseAdmin.from("slots").select("id, max_capacity").eq("business_id", data.business_id).eq("is_active", true);
	if (!slots) return [];
	const { data: bookings } = await supabaseAdmin.from("bookings").select("slot_id, status").eq("business_id", data.business_id).eq("date", data.date).neq("status", "cancelled");
	const counts = /* @__PURE__ */ new Map();
	(bookings ?? []).forEach((b) => {
		if (b.slot_id) counts.set(b.slot_id, (counts.get(b.slot_id) ?? 0) + 1);
	});
	return slots.map((s) => ({
		slot_id: s.id,
		count: counts.get(s.id) ?? 0,
		full: (counts.get(s.id) ?? 0) >= s.max_capacity
	}));
});
var createPublicBooking_createServerFn_handler = createServerRpc({
	id: "a7a4f1db48be91055373e7006f2d7e6f0f7a3173698533b6bbd7b8ee4e522cad",
	name: "createPublicBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => createPublicBooking.__executeServer(opts));
var createPublicBooking = createServerFn({ method: "POST" }).inputValidator((raw) => objectType({
	slug: stringType(),
	service_id: stringType().uuid().nullable(),
	slot_id: stringType().uuid(),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	client_name: stringType().min(1).max(120),
	client_phone: stringType().min(4).max(40),
	client_email: stringType().email().max(200).optional().nullable()
}).parse(raw)).handler(createPublicBooking_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { data: biz } = await supabaseAdmin.from("businesses").select("id, name, is_active, plan, plan_start, manual_lock").eq("slug", data.slug).maybeSingle();
	if (!biz) throw new Error("Business not found");
	if (!biz.is_active || biz.manual_lock) throw new Error("Bookings are not available");
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const max = new Date(today);
	max.setDate(max.getDate() + 45);
	const d = /* @__PURE__ */ new Date(data.date + "T00:00:00");
	if (d < today || d > max) throw new Error("Date out of range");
	const { data: slot } = await supabaseAdmin.from("slots").select("id, name, start_time, end_time, max_capacity, is_active, business_id").eq("id", data.slot_id).maybeSingle();
	if (!slot || slot.business_id !== biz.id || !slot.is_active) throw new Error("Slot unavailable");
	const { count: taken } = await supabaseAdmin.from("bookings").select("*", {
		count: "exact",
		head: true
	}).eq("business_id", biz.id).eq("slot_id", slot.id).eq("date", data.date).neq("status", "cancelled");
	if ((taken ?? 0) >= slot.max_capacity) throw new Error("This slot is fully booked");
	const { data: lastRow, error: tokenErr } = await supabaseAdmin.from("bookings").select("token_number").eq("business_id", biz.id).eq("slot_id", slot.id).eq("date", data.date).order("token_number", { ascending: false }).limit(1).maybeSingle();
	if (tokenErr) {
		console.error("createPublicBooking token lookup failed:", tokenErr);
		throw new Error("Booking failed, please try again");
	}
	const tokenRes = (lastRow?.token_number ?? 0) + 1;
	const emailNormalized = data.client_email?.trim().toLowerCase() || null;
	const { data: booking, error: insErr } = await supabaseAdmin.from("bookings").insert({
		business_id: biz.id,
		slot_id: slot.id,
		service_id: data.service_id,
		date: data.date,
		token_number: tokenRes,
		client_name: data.client_name,
		client_phone: data.client_phone,
		client_email: emailNormalized,
		status: "booked",
		is_walkin: false
	}).select("id, token_number, date, client_name, client_phone, client_email").single();
	if (insErr || !booking) {
		if (insErr) console.error("createPublicBooking insert failed:", insErr);
		throw new Error("Booking failed, please try again");
	}
	if (emailNormalized) {
		let serviceName = null;
		if (data.service_id) {
			const { data: svc } = await supabaseAdmin.from("services").select("name").eq("id", data.service_id).maybeSingle();
			serviceName = svc?.name ?? null;
		}
		const fmt = (t) => t ? String(t).slice(0, 5) : null;
		const slotTime = slot.start_time || slot.end_time ? `${fmt(slot.start_time) ?? "—"} – ${fmt(slot.end_time) ?? "—"}` : null;
		try {
			const { sendTransactionalEmailServer } = await import("./send-server-Cb1XHhwj.mjs");
			await sendTransactionalEmailServer({
				templateName: "booking-confirmation",
				recipientEmail: emailNormalized,
				idempotencyKey: `booking-${booking.id}`,
				templateData: {
					business_name: biz.name,
					client_name: booking.client_name,
					token_number: booking.token_number,
					date: booking.date,
					slot_name: slot.name ?? null,
					slot_time: slotTime,
					service_name: serviceName
				}
			});
		} catch (e) {
			console.error("booking confirmation email failed", e);
		}
	}
	return booking;
});
//#endregion
export { createPublicBooking_createServerFn_handler, getPublicBookingData_createServerFn_handler, getSlotAvailability_createServerFn_handler };
