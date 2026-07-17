import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { N as ArrowUpRight, f as MapPin, l as Phone, p as Mail, u as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as SITE_CONTACT, c as SiteFooter, l as SiteHeader, n as PageHeader, o as Section, r as Reveal } from "./primitives-Dd79A7HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-B1oEZySW.js
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const channels = [
		{
			icon: Mail,
			label: "Email",
			value: SITE_CONTACT.email,
			href: `mailto:${SITE_CONTACT.email}`,
			note: "Best for onboarding, billing, and detailed questions. We reply within one business day.",
			external: false
		},
		{
			icon: Phone,
			label: "Phone",
			value: SITE_CONTACT.phone,
			href: `tel:${SITE_CONTACT.phoneTel}`,
			note: "Mon – Sat, 10:00 – 19:00 IST. Voice calls only.",
			external: false
		},
		{
			icon: MessageCircle,
			label: "WhatsApp",
			value: SITE_CONTACT.phone,
			href: SITE_CONTACT.whatsapp,
			note: "Quickest way to reach us. Send a message and we'll pick it up.",
			external: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				index: "01",
				eyebrow: "Contact",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Three ways in.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					" One team on the other side."
				] }),
				lede: "Whether you're onboarding a business, sorting out billing, or asking whether Qfloww fits your front desk — pick the channel that suits you."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3",
				children: channels.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 100,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: c.href,
						...c.external ? {
							target: "_blank",
							rel: "noreferrer noopener"
						} : {},
						className: "group flex h-full flex-col bg-paper p-8 transition-colors hover:bg-warm-1 lg:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, {
									className: "h-5 w-5 text-warm-4 transition-colors group-hover:text-ink",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
									className: "h-4 w-4 text-warm-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink",
									"aria-hidden": "true"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "section-marker mt-8",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-2xl tracking-tight",
								children: c.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-warm-5",
								children: c.note
							})
						]
					})
				}, c.label))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 grid gap-10 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "lg:col-span-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-marker",
						children: "02 — Studio"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "lg:col-span-8",
					delay: 120,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-3xl leading-[1.1] tracking-[-0.02em] md:text-4xl",
							children: [
								"Built and run by ",
								SITE_CONTACT.legalEntity,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 max-w-2xl text-warm-5",
							children: [
								"Qfloww is a product of ",
								SITE_CONTACT.legalEntity,
								", a design and technology studio based in ",
								SITE_CONTACT.jurisdiction,
								". We onboard a small list of businesses at a time so setup, slot configuration, and billing stay clean."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex items-start gap-3 text-sm text-warm-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "mt-0.5 h-4 w-4 shrink-0 text-warm-4",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: SITE_CONTACT.address })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: SITE_CONTACT.parentUrl,
							target: "_blank",
							rel: "noreferrer noopener",
							className: "mt-8 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-all hover:bg-ink hover:text-paper hover:-translate-y-0.5",
							children: ["Visit Pride Marketing ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							})]
						})
					]
				})]
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { ContactPage as component };
