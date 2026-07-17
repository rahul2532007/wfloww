import { r as __toESM } from "../_runtime.mjs";
import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-B4tl1Mhw.mjs";
import { _ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as markBookingCompleted, t as Dialog } from "./dialog-DM5mPuDe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor-D8JKEcNU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./doctor-CXqgnKN3.mjs");
var Route = createFileRoute("/_authenticated/doctor")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "Doctor Panel — Qfloww" },
		{
			name: "description",
			content: "Doctor's daily queue and earnings overview."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
function PaymentDialog({ booking, currency, onClose, onDone }) {
	const complete = useServerFn(markBookingCompleted);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useMemo)(() => {
		if (booking) {
			setAmount(booking.amount_paid != null ? String(booking.amount_paid) : "");
			setMethod(booking.payment_method || "cash");
		}
	}, [booking?.id]);
	const submit = async () => {
		const amt = Number(amount);
		if (!isFinite(amt) || amt < 0) {
			toast.error("Enter a valid amount");
			return;
		}
		setSubmitting(true);
		try {
			await complete({ data: {
				booking_id: booking.id,
				amount_paid: amt,
				payment_method: method
			} });
			toast.success("Payment recorded");
			onDone();
		} catch (e) {
			toast.error(e?.message ?? "Failed");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!booking,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record payment" }) }),
			booking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-warm-5",
						children: [
							"Token #",
							booking.token_number,
							" · ",
							booking.client_name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs uppercase tracking-wider text-warm-5",
							children: [
								"Amount (",
								currency,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							type: "number",
							step: "0.01",
							min: 0,
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-wider text-warm-5",
							children: "Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: method,
							onChange: (e) => setMethod(e.target.value),
							className: "mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "cash",
									children: "Cash"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "card",
									children: "Card"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "upi",
									children: "UPI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "other",
									children: "Other"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "rounded-md border border-rule px-3 py-1.5 text-sm",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: submit,
				disabled: submitting,
				className: "inline-flex items-center gap-2 rounded-md bg-ink px-3 py-1.5 text-sm text-paper disabled:opacity-50",
				children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Save"]
			})] })
		] })
	});
}
//#endregion
export { Route as n, PaymentDialog as t };
