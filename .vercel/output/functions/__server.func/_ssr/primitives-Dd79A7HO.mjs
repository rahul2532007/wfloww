import { r as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { N as ArrowUpRight, d as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/primitives-Dd79A7HO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SITE_CONTACT = {
	email: "contact@pridemarketing.co.in",
	phone: "+91 8349021100",
	phoneTel: "+918349021100",
	whatsapp: "https://wa.me/918349021100/",
	legalEntity: "Pride Marketing",
	jurisdiction: "Bhopal, Madhya Pradesh, India",
	address: "Bhopal, Madhya Pradesh, India",
	productName: "Qfloww",
	productUrl: "https://qfloww.pridemarketing.co.in",
	parentUrl: "https://pridemarketing.co.in",
	effectiveDate: "12 July 2026"
};
/**
* Subtle fade + rise on scroll. Respects prefers-reduced-motion.
* SSR-safe: content renders visible by default; hidden state only applied
* after mount when the element is still below the fold.
*/
function Reveal({ children, as: Tag = "div", className = "", delay = 0, y = 16, once = true, style }) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const node = ref.current;
		if (!node) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setVisible(true);
			setArmed(true);
			return;
		}
		const belowFold = node.getBoundingClientRect().top > window.innerHeight * .9;
		setArmed(true);
		if (!belowFold) {
			setVisible(true);
			return;
		}
		const io = new IntersectionObserver((entries) => {
			for (const entry of entries) if (entry.isIntersecting) {
				setVisible(true);
				if (once) io.disconnect();
			} else if (!once) setVisible(false);
		}, {
			threshold: .12,
			rootMargin: "0px 0px -8% 0px"
		});
		io.observe(node);
		return () => io.disconnect();
	}, [once]);
	const hidden = armed && !visible;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className,
		style: {
			...style,
			transition: "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
			transitionDelay: `${delay}ms`,
			opacity: hidden ? 0 : 1,
			transform: hidden ? `translate3d(0, ${y}px, 0)` : "translate3d(0, 0, 0)",
			willChange: "opacity, transform"
		},
		children
	});
}
/** Convenience wrapper that staggers the reveal delay of each direct child. */
function RevealGroup({ children, className = "", stagger = 80, initialDelay = 0, y = 16 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: children.map((child, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
		className,
		delay: initialDelay + i * stagger,
		y,
		children: child
	}, i)) });
}
function Wordmark({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `font-display font-semibold tracking-tight ${className}`,
		children: ["Qfloww", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "brand-dot",
			children: "."
		})]
	});
}
function Section({ id, children, className = "", bordered = true, as: As = "section" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
		id,
		className: `${bordered ? "border-t border-rule" : ""} py-24 lg:py-32 ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-6 lg:px-10",
			children
		})
	});
}
function SectionHeader({ index, eyebrow, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			className: "lg:col-span-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "section-marker",
				children: [
					index,
					" — ",
					eyebrow
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
			className: "lg:col-span-8",
			delay: 100,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl",
				children: title
			}), lede && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-2xl text-lg text-warm-5",
				children: lede
			})]
		})]
	});
}
function PageHeader({ index, eyebrow, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-rule",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				index,
				eyebrow,
				title,
				lede
			})
		})
	});
}
var NAV_LINKS = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/virtual-queue-guide",
		label: "Guide"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Primary",
					className: "hidden items-center gap-8 md:flex",
					children: NAV_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: "text-sm text-warm-5 transition-colors hover:text-ink",
						activeProps: { className: "text-sm text-ink" },
						activeOptions: { exact: true },
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "inline-flex items-center gap-1.5 rounded-full border border-rule px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper",
						children: "Sign Up"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						className: "inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90",
						children: ["Login ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule md:hidden",
					onClick: () => setOpen((v) => !v),
					"aria-label": open ? "Close menu" : "Open menu",
					"aria-expanded": open,
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-rule bg-paper md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4",
				children: [NAV_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					onClick: () => setOpen(false),
					className: "rounded-md px-2 py-2 text-sm text-warm-5 hover:bg-warm-1 hover:text-ink",
					children: l.label
				}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-col gap-2 border-t border-rule pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						onClick: () => setOpen(false),
						className: "rounded-md px-2 py-2 text-sm text-warm-5 hover:bg-warm-1 hover:text-ink",
						children: "Sign Up"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						onClick: () => setOpen(false),
						className: "inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper",
						children: ["Login ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						})]
					})]
				})]
			})
		})]
	});
}
function CTASection({ eyebrow = "05 — GET STARTED", title, ctaLabel = "Talk to us", ctaHref = `mailto:${SITE_CONTACT.email}` }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "dark border-t border-rule bg-ink text-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "lg:col-span-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: eyebrow
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "lg:col-span-8",
				delay: 120,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: ctaHref,
						className: "inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-all hover:opacity-90 hover:-translate-y-0.5",
						children: [
							ctaLabel,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							})
						]
					})
				})]
			})]
		})
	});
}
var GEOS = [
	"Mumbai",
	"Bengaluru",
	"Delhi NCR",
	"Pune",
	"Hyderabad",
	"Chennai",
	"Kolkata",
	"Ahmedabad",
	"Jaipur",
	"Kochi",
	"Chandigarh",
	"Indore"
];
function SiteFooter() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-rule bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden border-b border-rule py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "geo-marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl text-warm-4",
					children: [...GEOS, ...GEOS].map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-10",
						children: [g, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "text-warm-3",
							children: "·"
						})]
					}, `${g}-${i}`))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-8 lg:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "text-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xs text-sm text-warm-5",
								children: "Bookings and calm reception desks for clinics, salons, and consulting firms."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `mailto:${SITE_CONTACT.email}`,
								className: "mt-6 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper",
								children: ["Book a consultation ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Product",
						links: [
							{
								label: "Overview",
								to: "/"
							},
							{
								label: "Guide",
								to: "/virtual-queue-guide"
							},
							{
								label: "Create account",
								to: "/signup"
							},
							{
								label: "Staff sign in",
								to: "/login"
							}
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Company",
						links: [
							{
								label: "Contact",
								to: "/contact"
							},
							{
								label: "Privacy Policy",
								to: "/privacy"
							},
							{
								label: "Terms & Conditions",
								to: "/terms"
							},
							{
								label: "Pride Marketing",
								href: SITE_CONTACT.parentUrl
							}
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Contact",
						links: [
							{
								label: SITE_CONTACT.email,
								href: `mailto:${SITE_CONTACT.email}`
							},
							{
								label: SITE_CONTACT.phone,
								href: `tel:${SITE_CONTACT.phoneTel}`
							},
							{
								label: "WhatsApp",
								href: SITE_CONTACT.whatsapp
							}
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-rule",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-warm-4 md:flex-row md:items-center lg:px-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						year,
						" ",
						SITE_CONTACT.legalEntity,
						". All rights reserved."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Made with restraint in ",
						SITE_CONTACT.jurisdiction.split(",").slice(-1)[0].trim(),
						"."
					] })]
				})
			})
		]
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "section-marker",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2 text-sm",
			children: links.map((l) => {
				const external = l.href && /^https?:\/\//.test(l.href);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: l.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					className: "text-warm-5 transition-colors hover:text-ink",
					children: l.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: l.href,
					className: "text-warm-5 transition-colors hover:text-ink",
					...external ? {
						target: "_blank",
						rel: "noreferrer noopener"
					} : {},
					children: l.label
				}) }, l.label);
			})
		})]
	});
}
//#endregion
export { SITE_CONTACT as a, SiteFooter as c, RevealGroup as i, SiteHeader as l, PageHeader as n, Section as o, Reveal as r, SectionHeader as s, CTASection as t, Wordmark as u };
