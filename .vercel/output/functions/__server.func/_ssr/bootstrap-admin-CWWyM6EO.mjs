import { r as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-B4tl1Mhw.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { _ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { s as bootstrapAdmin } from "./admin.functions-BCUmJvgO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bootstrap-admin-CWWyM6EO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BootstrapAdminPage() {
	const { session, profile, loading, refresh } = useAuth();
	const navigate = useNavigate();
	const run = useServerFn(bootstrapAdmin);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const handleClaim = async () => {
		setSubmitting(true);
		try {
			await run();
			await refresh();
			toast.success("You are now the master admin.");
			navigate({ to: "/admin" });
		} catch (e) {
			toast.error(e?.message ?? "Failed to bootstrap admin");
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-warm-4" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg border border-rule bg-paper p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Admin bootstrap"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl tracking-[-0.02em]",
					children: "Claim the master admin role"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-warm-5",
					children: "One-time setup. Promotes the currently signed-in account to the platform admin role. Disabled once an admin exists."
				}),
				!session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 border border-rule p-6 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-warm-5",
						children: "You need to sign in first with the account you want to promote."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4 rounded-full bg-ink text-paper hover:opacity-90",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Sign in"
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid gap-4 border-y border-rule py-6 text-sm sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "section-marker",
						children: "Signed in as"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-display text-base",
						children: session.user.email
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "section-marker",
						children: "Current role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-display text-base",
						children: profile?.role ?? "none"
					})] })]
				}), profile?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 text-sm text-warm-5",
					children: [
						"You are already an admin.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/admin" }),
							className: "underline hover:text-ink",
							children: "Go to admin →"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleClaim,
					disabled: submitting,
					className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40",
					children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), submitting ? "Claiming…" : "Claim master admin role"]
				})] })
			]
		})
	});
}
//#endregion
export { BootstrapAdminPage as component };
