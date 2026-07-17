import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Building2, M as BellRing, N as ArrowUpRight, a as Stethoscope, c as Scissors, j as Briefcase, k as CalendarClock, l as Phone, o as Sparkles, s as ShieldCheck, x as ClipboardList } from "../_libs/lucide-react.mjs";
import { a as SITE_CONTACT, c as SiteFooter, i as RevealGroup, l as SiteHeader, o as Section, r as Reveal, s as SectionHeader, t as CTASection, u as Wordmark } from "./primitives-Dd79A7HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-zIljdq0R.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Services, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Numbers, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Industries, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {
				eyebrow: "09 — GET STARTED",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Ready to run a",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
					" calmer front desk?"
				] }),
				ctaLabel: "Book a consultation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-10 lg:pt-24 lg:pb-28",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Qfloww — EST. STUDIO, GLOBAL"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 80,
					y: 24,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-8 font-display font-medium leading-[1.02] tracking-[-0.03em] [text-wrap:balance]",
						style: { fontSize: "clamp(2.5rem, 9vw, 7.5rem)" },
						children: [
							"Your bookings should be",
							" ",
							"your ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif italic font-normal text-amber",
								children: "best receptionist"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ink",
								children: "."
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 220,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 max-w-2xl text-base text-warm-5 sm:text-lg",
						children: "We run branded booking pages and a calm front-desk queue for ambitious teams — built around the decisions your clients actually make."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 320,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/signup",
								className: "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:opacity-90 hover:-translate-y-0.5",
								children: ["Create your booking page ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${SITE_CONTACT.email}`,
								className: "inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper",
								children: "Book a consultation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#services",
								className: "inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper",
								children: "See how it works"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-20 border-t border-rule pt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "grid grid-cols-2 gap-8 sm:grid-cols-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealGroup, {
							stagger: 90,
							initialDelay: 80,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecItem, {
									label: "Interface",
									value: "01",
									note: "One panel, one account — easy to train"
								}, "1"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecItem, {
									label: "Onboarding",
									value: "Same day",
									note: "Self-signup or concierge"
								}, "2"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecItem, {
									label: "Client accounts",
									value: "0",
									note: "Name + phone, done"
								}, "3"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecItem, {
									label: "Confirmations",
									value: "Email",
									note: "Branded, transactional"
								}, "4")
							]
						})
					})
				})
			]
		})
	});
}
function SpecItem({ label, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "section-marker",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-display text-2xl leading-none",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-warm-4",
			children: note
		})
	] });
}
function Marquee() {
	const items = [
		"Dental Clinics",
		"Salons",
		"Consulting Studios",
		"Aesthetic Bars",
		"Physio Practices",
		"Legal Chambers",
		"Dermatology",
		"Wellness"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-rule bg-warm-1 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "geo-marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl text-warm-4",
				children: [...items, ...items].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-12",
					children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "text-warm-3",
						children: "·"
					})]
				}, `${t}-${i}`))
			})
		})
	});
}
function Services() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "services",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			index: "01",
			eyebrow: "Services",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Four small surfaces,",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				" one calm workflow."
			] }),
			lede: "No dashboards to babysit. Each surface does one job well and hands off to the next without fanfare."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2",
			children: [
				{
					n: "A",
					title: "Public booking page",
					copy: "Clients pick a slot on a branded /book/your-name URL, drop a name and phone, and get a token — no account, no friction.",
					icon: CalendarClock
				},
				{
					n: "B",
					title: "Live front-desk queue",
					copy: "The receptionist advances arrivals, ongoing and completed tokens in real time. Walk-ins take one line of typing.",
					icon: ClipboardList
				},
				{
					n: "C",
					title: "Owner view",
					copy: "Same day, quieter angle. Billing status, plan expiry banners, completion toasts — the details you actually want to see.",
					icon: BellRing
				},
				{
					n: "D",
					title: "Admin control room",
					copy: "We onboard the business, wire up slots and services, and keep billing state clean. You never touch a settings page.",
					icon: ShieldCheck
				}
			].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * 90,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group h-full bg-paper p-8 transition-colors hover:bg-warm-1 lg:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "section-marker",
								children: ["— ", c.n]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, {
								className: "h-5 w-5 text-warm-4 transition-colors group-hover:text-ink",
								"aria-hidden": "true"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-8 font-display text-2xl tracking-tight",
							children: c.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-md text-sm text-warm-5",
							children: c.copy
						})
					]
				})
			}, c.title))
		})]
	});
}
function Numbers() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		index: "02",
		eyebrow: "By the numbers",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"A small footprint,",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			" measured in seconds."
		] }),
		lede: "We treat every extra tap as a design failure. These are the numbers we chase."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-16 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				k: "01",
				v: "≤ 45s",
				label: "Average booking time on the public page"
			},
			{
				k: "02",
				v: "1",
				label: "Single panel, single account — nothing to switch between"
			},
			{
				k: "03",
				v: "0",
				label: "Client accounts to remember"
			},
			{
				k: "04",
				v: "24/7",
				label: "Booking page available, always"
			}
		].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: i * 90,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-full bg-paper p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-marker",
						children: s.k
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-display text-5xl leading-none tracking-[-0.02em] md:text-6xl",
						children: s.v
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-warm-5",
						children: s.label
					})
				]
			})
		}, s.k))
	})] });
}
function Process() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		index: "03",
		eyebrow: "Process",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Self-signup, with a",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			" concierge on standby."
		] }),
		lede: "Sign up on your own or ask us to onboard you. Either way, one point of contact, no self-serve settings to break."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-16 divide-y divide-rule border-y border-rule",
		children: [
			{
				n: "01",
				title: "Create your account",
				body: "Sign up at /signup, choose your business slug, and confirm your email. Takes under two minutes."
			},
			{
				n: "02",
				title: "Activation",
				body: "We review and activate your business, seed slots and services with you, and hand over reception + owner logins."
			},
			{
				n: "03",
				title: "Soft launch",
				body: "Your /book/your-name URL goes live. Clients book; email confirmations go out automatically. We watch the first week with you."
			},
			{
				n: "04",
				title: "Steady state",
				body: "Trial → monthly or yearly plan. Warning → grace → lock states run quietly. No surprise invoices."
			}
		].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
			as: "li",
			delay: i * 80,
			className: "grid gap-6 py-10 lg:grid-cols-12 lg:gap-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl leading-none tracking-[-0.02em] text-warm-3",
						children: s.n
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl tracking-tight",
						children: s.title
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-warm-5",
						children: s.body
					})
				})
			]
		}, s.n))
	})] });
}
function Industries() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		index: "04",
		eyebrow: "Industries",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Built for the businesses",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			" that run on a queue."
		] }),
		lede: "If your calendar is really a token line with a polite name, you're the audience."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-16 divide-y divide-rule border-y border-rule",
		children: [
			{
				icon: Stethoscope,
				name: "Clinics & Dental",
				note: "Multi-doctor slots, walk-ins, no-show flow."
			},
			{
				icon: Scissors,
				name: "Salons & Studios",
				note: "Chair-level tokens, back-to-back rebooking."
			},
			{
				icon: Briefcase,
				name: "Consulting",
				note: "Named-hour blocks, private client fields."
			},
			{
				icon: Building2,
				name: "Multi-location",
				note: "One admin, several branded booking pages."
			}
		].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: i * 70,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group grid items-center gap-6 py-8 lg:grid-cols-12 transition-colors hover:bg-warm-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, {
							className: "h-5 w-5 text-warm-4 transition-colors group-hover:text-ink",
							"aria-hidden": "true"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: r.name
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-warm-5",
							children: r.note
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-1 lg:text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
							className: "ml-auto h-4 w-4 text-warm-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink",
							"aria-hidden": "true"
						})
					})
				]
			})
		}, r.name))
	})] });
}
function Quote() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			className: "lg:col-span-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-marker",
				children: "05 — In practice"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
			className: "lg:col-span-8",
			delay: 120,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "font-serif text-3xl leading-[1.15] tracking-[-0.01em] md:text-4xl lg:text-5xl",
				children: "\"It replaced our phone, our diary, and the sticky-note stack next to the till. We still don't know what plan we're on, and that's exactly the point.\""
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-warm-4",
				children: "— Front desk lead, dermatology practice"
			})]
		})]
	}) });
}
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		index: "06",
		eyebrow: "Features",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Small decisions,",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			" stacked with intent."
		] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-16 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3",
		children: [
			{
				title: "Token line by slot",
				body: "Each slot gets its own numbered line. No shared counters, no confusion at 6pm."
			},
			{
				title: "Walk-ins in one line",
				body: "Type a name, hit enter, hand out a token. That's the whole ceremony."
			},
			{
				title: "Live queue for staff",
				body: "Everyone shares the same real-time view: booked, arrived, ongoing, completed, no-show."
			},
			{
				title: "Email confirmations",
				body: "Clients who share an email get a branded confirmation with token, date, and slot — sent through a durable queue."
			},
			{
				title: "One account, one panel",
				body: "No role-switching, no separate logins. Sign in once and run the desk end-to-end."
			},
			{
				title: "Plan states, not popups",
				body: "Trial, monthly, yearly. Warning → grace → lock — a thin colored strip, never a modal."
			},
			{
				title: "Branded booking URL",
				body: "/book/your-name. Yours to print on cards, add to bio links, paste into WhatsApp."
			},
			{
				title: "No client accounts",
				body: "Clients type a name and phone. That's it. Nothing to remember."
			},
			{
				title: "Service-level slots",
				body: "Configure services per business (clinic, salon, consulting) and cap capacity per slot."
			}
		].map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: i % 3 * 90,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group h-full bg-paper p-8 transition-colors hover:bg-warm-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-4 w-4 text-warm-3 transition-colors group-hover:text-amber",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-6 font-display text-xl tracking-tight",
						children: f.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-warm-5",
						children: f.body
					})
				]
			})
		}, f.title))
	})] });
}
function FAQ() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			index: "07",
			eyebrow: "FAQ",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"The questions we",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				" hear the most."
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 divide-y divide-rule border-y border-rule",
			children: [
				{
					q: "Do clients need an account?",
					a: "No. The public booking page takes a name and a phone number — email is optional and unlocks a branded confirmation."
				},
				{
					q: "Can I sign up my business directly?",
					a: "Yes. Create an account at /signup, confirm your email, and your business waits on a short activation step. Prefer concierge onboarding? Email or WhatsApp us."
				},
				{
					q: "Do you send booking confirmations?",
					a: "Yes. Every booking with an email address gets a branded transactional email with the token, slot time, and date."
				},
				{
					q: "What happens if a plan expires?",
					a: "You get a soft warning strip first, a grace period next, and only then a locked owner view. The public booking page stays polite either way."
				},
				{
					q: "Who staffs the day?",
					a: "Two roles: reception (check-ins, walk-ins, queue advancement) and management (owner view, history, billing state). Platform admin is handled by Pride Marketing."
				},
				{
					q: "Which businesses is Qfloww for?",
					a: "Clinics and dental practices, salons and studios, and consulting firms — any appointment-driven business that runs on a token line."
				}
			].map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * 60,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group py-8",
					open: i === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex cursor-pointer list-none items-center justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl tracking-tight md:text-2xl",
							children: it.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-rule text-warm-4 transition-transform group-open:rotate-45",
							children: "+"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-warm-5 animate-fade-in",
						children: it.a
					})]
				})
			}, it.q))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-16 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-rule bg-warm-1 p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-marker",
				children: "08 — Still on the fence?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-display text-2xl",
				children: ["Talk to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `tel:${SITE_CONTACT.phoneTel}`,
				className: "inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-5 py-2.5 text-sm text-ink transition-all hover:bg-ink hover:text-paper hover:-translate-y-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}),
					" ",
					SITE_CONTACT.phone
				]
			})]
		}) })
	] });
}
//#endregion
export { Index as component };
