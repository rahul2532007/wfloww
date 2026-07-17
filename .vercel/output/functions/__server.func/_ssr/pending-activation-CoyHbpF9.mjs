import { r as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { _ as LoaderCircle, m as LogOut, p as Mail } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pending-activation-CoyHbpF9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CONTACT_EMAIL = "pride.pma@gmail.com";
function PendingPage() {
	const { profile, signOut, refresh } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [message, setMessage] = (0, import_react.useState)("");
	const { data: biz } = useQuery({
		queryKey: ["my-biz", profile?.business_id],
		enabled: !!profile?.business_id,
		queryFn: async () => (await supabase.from("businesses").select("*").eq("id", profile.business_id).maybeSingle()).data,
		refetchInterval: 15e3
	});
	const { data: requests } = useQuery({
		queryKey: ["my-activation-requests", profile?.business_id],
		enabled: !!profile?.business_id,
		queryFn: async () => (await supabase.from("activation_requests").select("*").eq("business_id", profile.business_id).order("created_at", { ascending: false })).data ?? []
	});
	const isActive = biz && biz.is_active && !biz.manual_lock && biz.expires_at && new Date(biz.expires_at).getTime() > Date.now();
	(0, import_react.useEffect)(() => {
		if (!isActive) return;
		(async () => {
			await refresh();
			navigate({
				to: "/management",
				replace: true
			});
		})();
	}, [
		isActive,
		navigate,
		refresh
	]);
	const request = useMutation({
		mutationFn: async () => {
			if (!profile?.business_id) throw new Error("No business");
			const { error } = await supabase.from("activation_requests").insert({
				business_id: profile.business_id,
				requested_by: profile.id,
				message: message || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Request sent to admin");
			setMessage("");
			qc.invalidateQueries({ queryKey: ["my-activation-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!profile) return null;
	const hasBusiness = !!profile.business_id;
	const pendingReq = (requests ?? []).find((r) => r.status === "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg border border-rule bg-paper p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Account status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl tracking-[-0.02em]",
					children: hasBusiness ? "Awaiting activation" : "No business linked"
				}),
				hasBusiness ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-warm-5",
						children: [
							"Your business ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: biz?.name }),
							" is created but not yet active. Reach out to activate billing."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-md border border-rule bg-warm-1 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-warm-5",
							children: "Contact us"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${CONTACT_EMAIL}`,
							className: "mt-2 inline-flex items-center gap-2 text-base underline",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
								" ",
								CONTACT_EMAIL
							]
						})]
					}),
					pendingReq ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 rounded-none border border-amber/40 bg-amber/10 p-3 text-sm text-ink",
						children: [
							"Activation request sent ",
							new Date(pendingReq.created_at).toLocaleString(),
							". We'll email you when it's approved."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "section-marker",
								children: "Optional message to admin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: message,
								onChange: (e) => setMessage(e.target.value),
								rows: 3,
								className: "mt-2 w-full rounded-md border border-rule bg-transparent p-2 text-sm focus:border-ink focus:outline-none",
								placeholder: "Anything the admin should know…"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => request.mutate(),
							disabled: request.isPending,
							className: "inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40",
							children: [request.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Request activation"]
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-warm-5",
					children: [
						"No business is linked to your account. Please contact ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline",
							href: `mailto:${CONTACT_EMAIL}`,
							children: CONTACT_EMAIL
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: async () => {
						await signOut();
						navigate({ to: "/login" });
					},
					className: "mt-8 inline-flex items-center gap-2 text-xs text-warm-5 hover:text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3 w-3" }), " Sign out"]
				})
			]
		})
	});
}
//#endregion
export { PendingPage as component };
