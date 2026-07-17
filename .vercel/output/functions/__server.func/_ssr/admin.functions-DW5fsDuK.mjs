import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DzLKseBS.mjs";
import { a as stringType, i as objectType, r as numberType, t as booleanType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DW5fsDuK.js
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	if (error || !data) throw new Error("Forbidden");
}
var adminActivateBusiness_createServerFn_handler = createServerRpc({
	id: "6d82330c760397fca7f441338bbe069a8b066c60b1bfd197e361727360b72f66",
	name: "adminActivateBusiness",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminActivateBusiness.__executeServer(opts));
var adminActivateBusiness = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	duration_days: numberType().int().min(1).max(3650)
}).parse(raw)).handler(adminActivateBusiness_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const now = /* @__PURE__ */ new Date();
	const expires = new Date(now.getTime() + data.duration_days * 24 * 60 * 60 * 1e3);
	const { error } = await supabaseAdmin.from("businesses").update({
		activated_at: now.toISOString(),
		expires_at: expires.toISOString(),
		is_active: true,
		manual_lock: false
	}).eq("id", data.business_id);
	if (error) throw new Error(error.message);
	await supabaseAdmin.from("activation_requests").update({ status: "approved" }).eq("business_id", data.business_id).eq("status", "pending");
	return {
		ok: true,
		expires_at: expires.toISOString()
	};
});
var adminSetBusinessLock_createServerFn_handler = createServerRpc({
	id: "e0cd088c1be81960849e279341ffc71cedc7087b80561287759ea6dd23b2c434",
	name: "adminSetBusinessLock",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetBusinessLock.__executeServer(opts));
var adminSetBusinessLock = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	locked: booleanType()
}).parse(raw)).handler(adminSetBusinessLock_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { error } = await supabaseAdmin.from("businesses").update({ manual_lock: data.locked }).eq("id", data.business_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var bootstrapAdmin_createServerFn_handler = createServerRpc({
	id: "8b5e87060261a59e92bcd5e92ce4cf6afa0ee8e3737aa66e7c16f0be951897c6",
	name: "bootstrapAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => bootstrapAdmin.__executeServer(opts));
var bootstrapAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(bootstrapAdmin_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { count } = await supabaseAdmin.from("user_roles").select("*", {
		count: "exact",
		head: true
	}).eq("role", "admin");
	if ((count ?? 0) > 0) throw new Error("Admin already exists");
	const { error } = await supabaseAdmin.from("user_roles").insert({
		user_id: context.userId,
		role: "admin"
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminSetBusinessCurrency_createServerFn_handler = createServerRpc({
	id: "6e41b9d407d112cd94464b86723b36191294141d37a4b758a1a7a5ffca42b348",
	name: "adminSetBusinessCurrency",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetBusinessCurrency.__executeServer(opts));
var adminSetBusinessCurrency = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	currency: stringType().length(3)
}).parse(raw)).handler(adminSetBusinessCurrency_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { error } = await supabaseAdmin.from("businesses").update({ currency: data.currency.toUpperCase() }).eq("id", data.business_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminInviteDoctor_createServerFn_handler = createServerRpc({
	id: "da976b1246e9c440b101da848ade6b5543fdc4207a242d41cb4acb500cabfbf7",
	name: "adminInviteDoctor",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminInviteDoctor.__executeServer(opts));
var adminInviteDoctor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	email: stringType().email()
}).parse(raw)).handler(adminInviteDoctor_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const email = data.email.trim().toLowerCase();
	await supabaseAdmin.from("doctor_invites").update({ status: "revoked" }).eq("business_id", data.business_id).eq("email", email).eq("status", "pending");
	const { data: inv, error } = await supabaseAdmin.from("doctor_invites").insert({
		business_id: data.business_id,
		email,
		invited_by: context.userId
	}).select("token, business_id").maybeSingle();
	if (error || !inv) throw new Error(error?.message ?? "Failed to create invite");
	const { data: biz } = await supabaseAdmin.from("businesses").select("name").eq("id", inv.business_id).maybeSingle();
	try {
		const { sendTransactionalEmailServer } = await import("./send-server-Cb1XHhwj.mjs");
		const acceptUrl = `${process.env.PUBLIC_SITE_URL || "https://qfloww.pridemarketing.co.in"}/doctor-invite/accept?token=${inv.token}`;
		await sendTransactionalEmailServer({
			templateName: "doctor-invite",
			recipientEmail: email,
			idempotencyKey: `doctor-invite-${inv.token}`,
			templateData: {
				businessName: biz?.name ?? "Your clinic",
				acceptUrl,
				recipient: email
			}
		});
	} catch (e) {
		console.error("Doctor invite email failed:", e);
	}
	return {
		ok: true,
		token: inv.token
	};
});
var adminRevokeDoctorInvite_createServerFn_handler = createServerRpc({
	id: "f1155a703592c3ca691a32705b3e6e95ca3acc0c89e3dd78f8da82a8a988f698",
	name: "adminRevokeDoctorInvite",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminRevokeDoctorInvite.__executeServer(opts));
var adminRevokeDoctorInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({ invite_id: stringType().uuid() }).parse(raw)).handler(adminRevokeDoctorInvite_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { error } = await supabaseAdmin.from("doctor_invites").update({ status: "revoked" }).eq("id", data.invite_id).eq("status", "pending");
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminRemoveDoctor_createServerFn_handler = createServerRpc({
	id: "6423dcdeacad7b43149850ddefbdb8a426713364d29ca74e45c14b99bf6e2962",
	name: "adminRemoveDoctor",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminRemoveDoctor.__executeServer(opts));
var adminRemoveDoctor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	user_id: stringType().uuid(),
	business_id: stringType().uuid()
}).parse(raw)).handler(adminRemoveDoctor_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BiUsLbOd.mjs");
	const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", "doctor").eq("business_id", data.business_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { adminActivateBusiness_createServerFn_handler, adminInviteDoctor_createServerFn_handler, adminRemoveDoctor_createServerFn_handler, adminRevokeDoctorInvite_createServerFn_handler, adminSetBusinessCurrency_createServerFn_handler, adminSetBusinessLock_createServerFn_handler, bootstrapAdmin_createServerFn_handler };
