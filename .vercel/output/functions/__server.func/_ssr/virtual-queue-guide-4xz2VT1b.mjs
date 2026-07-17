import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { N as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { c as SiteFooter, l as SiteHeader, n as PageHeader, o as Section, t as CTASection } from "./primitives-Dd79A7HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/virtual-queue-guide-4xz2VT1b.js
var import_jsx_runtime = require_jsx_runtime();
function GuidePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				index: "G1",
				eyebrow: "Guide · 6 min read",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Virtual queue systems,",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					" plainly explained."
				] }),
				lede: "Waiting rooms used to be a design constraint. A virtual queue moves the wait onto the client's phone — your front desk only sees people ready to be served."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "grid gap-8 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "lg:col-span-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-marker",
						children: "Contents"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-warm-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#what",
								className: "hover:text-ink",
								children: "What it is"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#how",
								className: "hover:text-ink",
								children: "How it works"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#why",
								className: "hover:text-ink",
								children: "Why businesses switch"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#fit",
								className: "hover:text-ink",
								children: "Who it fits"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#rollout",
								className: "hover:text-ink",
								children: "Rolling it out in a week"
							}) })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-16 lg:col-span-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							id: "what",
							n: "01",
							title: "What is a virtual queue system?",
							children: "A virtual queue management system replaces a physical line, a paper token roll, or a chalkboard with software. Clients pick a time slot from a public booking page, receive a token number, and get called in when it's their turn — without standing in a waiting area."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							id: "how",
							n: "02",
							title: "How the queue works",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "mt-2 list-decimal space-y-3 pl-5 text-warm-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The business publishes slots — 9:00, 11:00, 14:00 — each with a capacity." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Clients open a branded booking page, pick a date and slot, and get a token number." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"At the front desk, reception marks arrivals, moves the current client from ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "arrived" }),
										" to ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ongoing" }),
										" to ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "completed" }),
										", and adds walk-ins as new tokens."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The owner sees the same day from a quieter angle — live counts and any no-shows auto-flipped overnight." })
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							id: "why",
							n: "03",
							title: "Why businesses switch",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2",
								children: [
									{
										t: "Predictable arrivals",
										b: "Slots cap how many clients can be present at the same time."
									},
									{
										t: "Walk-ins in the same line",
										b: "Walk-ins still get tokens — inside the same queue as booked clients."
									},
									{
										t: "Less phone friction",
										b: "Clients self-serve on their own time; the desk stops copying names from voicemails."
									},
									{
										t: "Grounded wait times",
										b: "Estimates come from what actually happened today, not from guesses."
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-paper p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg",
										children: c.t
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-warm-5",
										children: c.b
									})]
								}, c.t))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							id: "fit",
							n: "04",
							title: "Who it fits (and who it doesn't)",
							children: "Qfloww is built for small, appointment-driven service businesses — dental and eye clinics, salons, physiotherapy practices, tax consultants, immigration advisors. It's not built for high-volume retail counters or ticketed events; those need different tooling."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							id: "rollout",
							n: "05",
							title: "Rolling it out in a week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-2 list-disc space-y-3 pl-5 text-warm-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Day 1 — define slots, capacities, and services." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Day 2 — share the public booking link with your existing clients." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Day 3-5 — the front desk works both channels (phone + queue) until phone volume drops naturally." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Day 6-7 — publish the link on Google Business Profile and social; monitor no-show rates." })
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-rule pt-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper",
								children: ["Back to home ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								})]
							})
						})
					]
				})]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {
				eyebrow: "G9 — READY?",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Let's set up your booking page this week." }),
				ctaLabel: "Talk to Pride"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Block({ id, n, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "section-marker",
				children: [n, " — Section"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-3xl leading-[1.1] tracking-[-0.02em] md:text-4xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-warm-5",
				children
			})
		]
	});
}
//#endregion
export { GuidePage as component };
