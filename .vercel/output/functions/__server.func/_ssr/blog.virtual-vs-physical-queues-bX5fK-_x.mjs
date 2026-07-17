import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as SiteFooter, l as SiteHeader, n as PageHeader, o as Section, t as CTASection } from "./primitives-Dd79A7HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.virtual-vs-physical-queues-bX5fK-_x.js
var import_jsx_runtime = require_jsx_runtime();
function BlogPost() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					index: "B1",
					eyebrow: "Blog · 5 min read",
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Virtual queues vs",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						" physical waiting rooms."
					] }),
					lede: "Physical waiting rooms convert floor space into idle time. A virtual queue management system converts the same demand into a predictable schedule — and gives clients back their morning."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mx-auto grid max-w-4xl gap-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "section-marker",
									children: "01 — The problem with the physical line"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl tracking-[-0.02em]",
									children: "Physical queues optimise for the venue, not the client."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-warm-5",
									children: "A physical waiting room asks every client to arrive early, sit down, and outlast the people ahead of them. The venue absorbs the uncertainty — chairs, floor space, front-desk attention, air conditioning — and the client absorbs the wait. It only looks efficient because the cost is hidden inside somebody else's calendar."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-warm-5",
									children: "Peaks are the worst of it. When ten people show up in the same fifteen minutes, the room fills; the ninth person waits an hour for a five-minute service. Nobody planned it, and there's no way to smooth it out after the fact."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "section-marker",
									children: "02 — What a virtual queue changes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl tracking-[-0.02em]",
									children: "Virtual queues optimise for arrival capacity."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-warm-5",
									children: "A virtual queue management system publishes your day as discrete slots — morning, afternoon, evening — with a cap per slot. Clients book a token online, receive it by SMS or email, and only walk in when their number is close. The waiting happens at home, on their phone, and the front desk sees a steady trickle instead of a wave."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "ml-4 list-disc space-y-2 text-warm-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Arrivals become predictable — you know how many tokens are already sold before the day starts." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Floor space stops being the bottleneck; you can run out of a smaller room without turning people away." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No-shows drop because the token itself is a commitment: clients picked the slot, not you." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Staff plan breaks around real gaps in the schedule instead of hoping for a quiet moment." })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "section-marker",
								children: "03 — Head to head"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden border border-rule",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-rule bg-warm-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-left font-medium",
												children: "Dimension"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-left font-medium",
												children: "Physical waiting room"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-left font-medium",
												children: "Virtual queue"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
										className: "[&>tr]:border-b [&>tr]:border-rule",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Where clients wait"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-warm-5",
													children: "On your chairs"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "On their phone, anywhere"
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Arrival control"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-warm-5",
													children: "First-come, first-served chaos"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Slot-based capacity caps"
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Peak handling"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-warm-5",
													children: "Overflow, standing room"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Slot fills, next slot offered"
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "No-shows"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-warm-5",
													children: "Common, invisible"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Tracked, reduced by commitment"
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Setup cost"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-warm-5",
													children: "Rent, chairs, coffee, staff"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "A booking link on your phone"
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Client experience"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-warm-5",
													children: "Sit and wait"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: "Arrive and get seen"
												})
											] })
										]
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "section-marker",
									children: "04 — When physical still wins"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl tracking-[-0.02em]",
									children: "A waiting room isn't always wrong."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-warm-5",
									children: "Walk-in emergencies, pharmacies, and services that genuinely can't be scheduled still need a physical queue — the friction of booking would turn people away. Even then, a virtual queue works alongside the room: walk-ins get a token, sit down if they want, and the screen tells them when to move."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "section-marker",
									children: "05 — What to switch first"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl tracking-[-0.02em]",
									children: "Start with the busiest hour, not the whole day."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-warm-5",
									children: "Pick the single slot that overflows most often — the Saturday morning at the salon, the 6pm consult at the clinic — and cap it. Publish the booking link. Everyone else keeps walking in the way they always have. Once the peak calms down, extend the caps to the rest of the day."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-warm-5",
									children: [
										"A queue management system pays for itself the first weekend the room doesn't overflow. See our",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/virtual-queue-guide",
											className: "underline underline-offset-4 hover:text-ink",
											children: "virtual queue guide"
										}),
										" ",
										"for the mechanics of slots, tokens, and rollout."
									]
								})
							]
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, { title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Replace your waiting room",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					" with a queue that respects time."
				] }) })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { BlogPost as component };
