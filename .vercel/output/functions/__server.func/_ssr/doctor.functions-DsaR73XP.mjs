import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DzLKseBS.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor.functions-DsaR73XP.js
async function getDoctorBusinessId(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("business_id").eq("user_id", userId).eq("role", "doctor").maybeSingle();
	if (!data?.business_id) throw new Error("Forbidden");
	return data.business_id;
}
var markBookingCompleted_createServerFn_handler = createServerRpc({
	id: "1c6feb2d4374aa11a2ab69a31db8e9192ca6c81d8ef539060e5df5b40e6e0857",
	name: "markBookingCompleted",
	filename: "src/lib/doctor.functions.ts"
}, (opts) => markBookingCompleted.__executeServer(opts));
var markBookingCompleted = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	booking_id: stringType().uuid(),
	amount_paid: numberType().min(0).max(1e7),
	payment_method: enumType([
		"cash",
		"card",
		"upi",
		"other"
	])
}).parse(raw)).handler(markBookingCompleted_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("bookings").update({
		status: "completed",
		amount_paid: data.amount_paid,
		payment_method: data.payment_method
	}).eq("id", data.booking_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setBookingPayment_createServerFn_handler = createServerRpc({
	id: "06741bfcf006bd584dd50d23babe8e1e9907056b448d0e39f1908004e8ea8603",
	name: "setBookingPayment",
	filename: "src/lib/doctor.functions.ts"
}, (opts) => setBookingPayment.__executeServer(opts));
var setBookingPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	booking_id: stringType().uuid(),
	amount_paid: numberType().min(0).max(1e7),
	payment_method: enumType([
		"cash",
		"card",
		"upi",
		"other"
	])
}).parse(raw)).handler(setBookingPayment_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("bookings").update({
		amount_paid: data.amount_paid,
		payment_method: data.payment_method
	}).eq("id", data.booking_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var doctorBusinessInfo_createServerFn_handler = createServerRpc({
	id: "1ff8c2a3981a953806fe38ae408f8b54538922945e61317a5c8b1121a7b00d55",
	name: "doctorBusinessInfo",
	filename: "src/lib/doctor.functions.ts"
}, (opts) => doctorBusinessInfo.__executeServer(opts));
var doctorBusinessInfo = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(doctorBusinessInfo_createServerFn_handler, async ({ context }) => {
	const bizId = await getDoctorBusinessId(context.supabase, context.userId);
	const { data } = await context.supabase.from("businesses").select("id, name, slug, currency").eq("id", bizId).maybeSingle();
	return data;
});
//#endregion
export { doctorBusinessInfo_createServerFn_handler, markBookingCompleted_createServerFn_handler, setBookingPayment_createServerFn_handler };
