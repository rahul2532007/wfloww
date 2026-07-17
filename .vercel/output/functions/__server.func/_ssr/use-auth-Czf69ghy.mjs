import { r as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-Czf69ghy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthCtx = (0, import_react.createContext)(void 0);
async function fetchProfile(userId, email) {
	const [{ data: prof }, { data: roles }, { data: biz }] = await Promise.all([
		supabase.from("profiles").select("id, email, display_name").eq("id", userId).maybeSingle(),
		supabase.from("user_roles").select("role, business_id").eq("user_id", userId),
		supabase.from("businesses").select("id, slug, is_active, manual_lock, expires_at").eq("owner_user_id", userId).maybeSingle()
	]);
	const rolesArr = roles ?? [];
	const isAdmin = rolesArr.some((r) => r.role === "admin");
	const doctorRow = rolesArr.find((r) => r.role === "doctor");
	const role = isAdmin ? "admin" : doctorRow ? "doctor" : "owner";
	let businessId = biz?.id ?? null;
	let businessSlug = biz?.slug ?? null;
	let businessActive = !!(biz && biz.is_active && !biz.manual_lock && biz.expires_at && new Date(biz.expires_at).getTime() > Date.now());
	if (role === "doctor" && doctorRow?.business_id) {
		businessId = doctorRow.business_id;
		const { data: docBiz } = await supabase.from("businesses").select("id, slug, is_active, manual_lock, expires_at").eq("id", doctorRow.business_id).maybeSingle();
		businessSlug = docBiz?.slug ?? null;
		businessActive = !!(docBiz && docBiz.is_active && !docBiz.manual_lock && docBiz.expires_at && new Date(docBiz.expires_at).getTime() > Date.now());
	}
	return {
		id: userId,
		email: prof?.email ?? email,
		display_name: prof?.display_name ?? null,
		role,
		business_id: businessId,
		business_slug: businessSlug,
		business_active: businessActive
	};
}
function readPendingFromMetadata(meta) {
	if (!meta) return null;
	const name = meta.pending_business_name;
	const slug = meta.pending_business_slug;
	const type = meta.pending_business_type;
	if (typeof name !== "string" || typeof slug !== "string" || typeof type !== "string") return null;
	if (![
		"clinic",
		"salon",
		"consulting"
	].includes(type)) return null;
	return {
		display_name: typeof meta.display_name === "string" ? meta.display_name : null,
		business_name: name,
		slug,
		type
	};
}
function readPendingFromLocalStorage(email) {
	if (typeof window === "undefined") return null;
	const emailKey = email.trim().toLowerCase();
	let raw = localStorage.getItem(`qfloww:pending-signup:${emailKey}`);
	if (!raw) {
		const last = localStorage.getItem("qfloww:pending-signup:last");
		if (last) try {
			if (JSON.parse(last)?.email === emailKey) raw = last;
		} catch {}
	}
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
async function finalizePendingSignup(userId, email, displayNameFallback, userMeta) {
	const pending = readPendingFromMetadata(userMeta) ?? readPendingFromLocalStorage(email);
	if (!pending) return false;
	try {
		await supabase.from("profiles").upsert({
			id: userId,
			email,
			display_name: pending.display_name ?? displayNameFallback
		}, { onConflict: "id" });
		const { data: bizRow, error: bizErr } = await supabase.from("businesses").insert({
			name: pending.business_name,
			slug: pending.slug,
			type: pending.type,
			owner_user_id: userId,
			is_active: false,
			manual_lock: true
		}).select("id").maybeSingle();
		let businessId = bizRow?.id ?? null;
		if (bizErr && !/duplicate/i.test(bizErr.message)) {
			console.error("Finalize signup failed:", bizErr.message);
			return false;
		}
		if (!businessId) {
			const { data: existing } = await supabase.from("businesses").select("id").eq("owner_user_id", userId).maybeSingle();
			businessId = existing?.id ?? null;
		}
		if (businessId) {
			const { data: existingReq } = await supabase.from("activation_requests").select("id").eq("business_id", businessId).eq("requested_by", userId).eq("status", "pending").maybeSingle();
			if (!existingReq) {
				const { error: reqErr } = await supabase.from("activation_requests").insert({
					business_id: businessId,
					requested_by: userId,
					message: "Auto-created on signup"
				});
				if (reqErr) console.error("Activation request insert failed:", reqErr.message);
			}
		}
		try {
			await supabase.auth.updateUser({ data: {
				pending_business_name: null,
				pending_business_slug: null,
				pending_business_type: null
			} });
		} catch {}
		if (typeof window !== "undefined") {
			localStorage.removeItem(`qfloww:pending-signup:${email.trim().toLowerCase()}`);
			localStorage.removeItem("qfloww:pending-signup:last");
		}
		return true;
	} catch (e) {
		console.error("Finalize signup error:", e);
		return false;
	}
}
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async (s) => {
		setSession(s);
		if (!s) {
			setProfile(null);
			setLoading(false);
			return;
		}
		let prof = await fetchProfile(s.user.id, s.user.email ?? "");
		if (!prof.business_id) {
			if (await finalizePendingSignup(s.user.id, s.user.email ?? "", prof.display_name, s.user.user_metadata)) prof = await fetchProfile(s.user.id, s.user.email ?? "");
		}
		setProfile(prof);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data }) => {
			if (mounted) load(data.session);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load(s);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const value = {
		session,
		profile,
		loading,
		refresh: async () => {
			if (session) setProfile(await fetchProfile(session.user.id, session.user.email ?? ""));
		},
		signOut: async () => {
			await supabase.auth.signOut();
			setProfile(null);
			setSession(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCtx.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthCtx);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
function homeForRole(role) {
	if (role === "admin") return "/admin";
	if (role === "doctor") return "/doctor";
	return "/management";
}
//#endregion
export { homeForRole as n, useAuth as r, AuthProvider as t };
