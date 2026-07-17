import { r as __toESM } from "../_runtime.mjs";
import { _ as Link, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { E as Check, N as ArrowUpRight, T as ChevronDown, b as Copy, m as LogOut, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { u as Wordmark } from "./primitives-Dd79A7HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-nav-PtY9WxNB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffTopNav({ title, extra, addLabel, onAdd, businessSlug, slots }) {
	const { profile } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location?.pathname ?? "" });
	const [panelOpen, setPanelOpen] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const panelRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!panelOpen) return;
		const onDoc = (e) => {
			if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [panelOpen]);
	const tabs = profile?.role === "admin" ? [
		{
			href: "/admin",
			label: "Admin"
		},
		{
			href: "/management",
			label: "Bookings"
		},
		{
			href: "/management/history",
			label: "History"
		}
	] : profile?.role === "owner" ? [{
		href: "/management",
		label: "Bookings"
	}, {
		href: "/management/history",
		label: "History"
	}] : [];
	const isActive = (href) => {
		if (href === "/management") return pathname === "/management" || pathname === "/management/";
		return pathname === href || pathname.startsWith(`${href}/`);
	};
	const publicUrl = businessSlug ? typeof window !== "undefined" ? `${window.location.origin}/book/${businessSlug}` : `/book/${businessSlug}` : null;
	const copy = async () => {
		if (!publicUrl) return;
		try {
			await navigator.clipboard.writeText(publicUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-20 border-b border-rule bg-paper/85 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "Home",
							className: "flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "hidden h-4 w-px bg-rule sm:block"
						}),
						!!businessSlug ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							ref: panelRef,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPanelOpen((v) => !v),
								"aria-expanded": panelOpen,
								"aria-haspopup": "dialog",
								className: "hidden items-center gap-1 font-display text-sm text-warm-5 transition-colors hover:text-ink sm:inline-flex",
								children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
									className: `h-3.5 w-3.5 transition-transform ${panelOpen ? "rotate-180" : ""}`,
									"aria-hidden": "true"
								})]
							}), panelOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "dialog",
								"aria-label": "Business booking link and slots",
								className: "absolute left-0 top-full z-30 mt-3 w-[min(92vw,26rem)] border border-rule bg-paper p-4 shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "section-marker",
										children: "Public booking link"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-stretch gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												readOnly: true,
												value: publicUrl ?? "",
												onFocus: (e) => e.currentTarget.select(),
												className: "min-w-0 flex-1 rounded-none border border-rule bg-warm-1 px-2 py-1.5 text-xs text-ink",
												"aria-label": "Public booking URL"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: copy,
												className: "inline-flex items-center gap-1 rounded-none border border-rule px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper",
												"aria-label": "Copy link",
												children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
													className: "h-3.5 w-3.5",
													"aria-hidden": "true"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
													className: "h-3.5 w-3.5",
													"aria-hidden": "true"
												}), copied ? "Copied" : "Copy"]
											}),
											publicUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: publicUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center rounded-none border border-rule px-2 py-1.5 text-warm-5 transition-colors hover:bg-ink hover:text-paper",
												"aria-label": "Open booking page",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
													className: "h-3.5 w-3.5",
													"aria-hidden": "true"
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "section-marker mt-5",
										children: "Slots"
									}),
									!slots || slots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-warm-5",
										children: "No active slots configured."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 divide-y divide-rule border border-rule",
										children: slots.map((s) => {
											const time = s.start_time || s.end_time ? `${(s.start_time ?? "").slice(0, 5) || "—"}–${(s.end_time ?? "").slice(0, 5) || "—"}` : null;
											const cap = s.max_capacity ?? null;
											const booked = s.booked_today ?? 0;
											const full = cap != null && booked >= cap;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center justify-between gap-3 px-3 py-2 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "truncate font-medium text-ink",
														children: s.name
													}), time && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-warm-5",
														children: time
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${full ? "border-amber bg-amber/10 text-amber" : "border-rule bg-warm-1 text-warm-5"}`,
													children: [cap != null ? `${booked}/${cap}` : `${booked}`, " today"]
												})]
											}, s.id);
										})
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden font-display text-sm text-warm-5 sm:block",
							children: title
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Staff sections",
					className: "flex items-center gap-6",
					children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: t.href,
						className: `text-sm transition-colors ${isActive(t.href) ? "text-ink" : "text-warm-5 hover:text-ink"}`,
						children: t.label
					}, t.href))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					extra,
					onAdd && addLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onAdd,
						className: "inline-flex items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-90",
						children: ["+ ", addLabel]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							await supabase.auth.signOut();
							navigate({
								to: "/login",
								replace: true
							});
						},
						"aria-label": "Log out",
						title: "Log out",
						className: "inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-xs text-warm-5 hover:bg-ink hover:text-paper",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}), " Sign out"]
					})
				]
			})]
		})
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${{
			booked: "border-rule bg-warm-1 text-warm-5",
			arrived: "border-rule bg-warm-1 text-ink",
			ongoing: "border-amber bg-amber/10 text-amber",
			completed: "border-ink bg-ink text-paper",
			cancelled: "border-rule bg-warm-1 text-warm-4 line-through",
			no_show: "border-rule bg-warm-1 text-warm-4"
		}[status] ?? "border-rule bg-warm-1 text-warm-5"}`,
		children: status.replace("_", " ")
	});
}
function Forbidden() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-marker",
				children: "403 — Forbidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl tracking-[-0.02em]",
				children: "Not your desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-warm-5",
				children: "You don't have permission to view this page."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/login",
				className: "mt-6 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition",
				children: ["Sign in with a different account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
					className: "h-3.5 w-3.5",
					"aria-hidden": true
				})]
			})
		] })
	});
}
//#endregion
export { StaffTopNav as n, StatusBadge as r, Forbidden as t };
