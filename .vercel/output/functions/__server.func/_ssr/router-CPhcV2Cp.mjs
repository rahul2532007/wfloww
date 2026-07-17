import { r as __toESM } from "../_runtime.mjs";
import { b as useRouter, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth, t as AuthProvider } from "./use-auth-Czf69ghy.mjs";
import { a as SITE_CONTACT } from "./primitives-Dd79A7HO.mjs";
import { n as StaffTopNav, r as StatusBadge, t as Forbidden } from "./staff-nav-PtY9WxNB.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { t as Route$20 } from "./book._slug-D9FVdcSJ.mjs";
import { n as Route$21 } from "./doctor-D8JKEcNU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CPhcV2Cp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-ZwTUD4YM.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl tracking-[-0.02em] text-ink",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-warm-5",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "mt-6 inline-block text-ink underline decoration-amber decoration-2 underline-offset-4",
					children: "Home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		console.error("TanStack root error boundary", error);
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl tracking-[-0.02em] text-ink",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-warm-5",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "mt-6 rounded-none bg-ink px-5 py-2 text-sm text-paper hover:bg-warm-5",
					children: "Try again"
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Qfloww — Editorial booking & queue management" },
			{
				name: "description",
				content: "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios."
			},
			{
				property: "og:site_name",
				content: "Qfloww"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:title",
				content: "Qfloww — Editorial booking & queue management"
			},
			{
				name: "twitter:title",
				content: "Qfloww — Editorial booking & queue management"
			},
			{
				property: "og:description",
				content: "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios."
			},
			{
				name: "twitter:description",
				content: "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2d693c79-8516-4181-955f-e6d1393a11b1"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2d693c79-8516-4181-955f-e6d1393a11b1"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "preconnect",
				href: "https://api.fontshare.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif&display=swap"
			},
			{
				rel: "stylesheet",
				href: "https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": [{
					"@type": "Organization",
					name: "Qfloww",
					url: "https://qfloww.pridemarketing.co.in/",
					description: "Booking and queue management for clinics, salons, and consulting firms."
				}, {
					"@type": "WebSite",
					name: "Qfloww",
					url: "https://qfloww.pridemarketing.co.in/"
				}]
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$16 = () => import("./virtual-queue-guide-4xz2VT1b.mjs");
var CANONICAL$5 = "https://qfloww.pridemarketing.co.in/virtual-queue-guide";
var Route$18 = createFileRoute("/virtual-queue-guide")({
	component: lazyRouteComponent($$splitComponentImporter$16, "component"),
	head: () => ({
		meta: [
			{ title: "Virtual Queue Management System Guide — Qfloww" },
			{
				name: "description",
				content: "How virtual queue management systems work and how clinics, salons, and consulting firms use them to replace physical waiting rooms with slot-based online booking."
			},
			{
				property: "og:title",
				content: "Virtual Queue Management System Guide"
			},
			{
				property: "og:description",
				content: "A practical guide to virtual queues: how they work, why waiting rooms are shrinking, and how small businesses roll one out in a week."
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				property: "og:url",
				content: CANONICAL$5
			}
		],
		links: [{
			rel: "canonical",
			href: CANONICAL$5
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Article",
				headline: "Virtual Queue Management System Guide",
				about: "Virtual queue management system for clinics, salons, and consulting firms",
				author: {
					"@type": "Organization",
					name: "Qfloww"
				},
				mainEntityOfPage: CANONICAL$5
			})
		}]
	})
});
var $$splitComponentImporter$15 = () => import("./terms-BoDagqLI.mjs");
var CANONICAL$4 = "https://qfloww.pridemarketing.co.in/terms";
var Route$17 = createFileRoute("/terms")({
	component: lazyRouteComponent($$splitComponentImporter$15, "component"),
	head: () => ({
		meta: [
			{ title: "Terms & Conditions — Qfloww" },
			{
				name: "description",
				content: "The terms on which Pride Marketing offers Qfloww — a SaaS booking and queue management platform — to businesses in India. Governed by the laws of India."
			},
			{
				property: "og:title",
				content: "Terms & Conditions — Qfloww"
			},
			{
				property: "og:description",
				content: "The user agreement governing your access to and use of Qfloww, drafted for compliance with Indian law."
			},
			{
				property: "og:url",
				content: CANONICAL$4
			}
		],
		links: [{
			rel: "canonical",
			href: CANONICAL$4
		}]
	})
});
var BASE_URL = "https://qfloww.pridemarketing.co.in";
var Route$16 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/virtual-queue-guide",
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/blog/virtual-vs-physical-queues",
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/contact",
				changefreq: "monthly",
				priority: "0.6"
			},
			{
				path: "/privacy",
				changefreq: "yearly",
				priority: "0.4"
			},
			{
				path: "/terms",
				changefreq: "yearly",
				priority: "0.4"
			},
			{
				path: "/login",
				changefreq: "yearly",
				priority: "0.3"
			},
			{
				path: "/signup",
				changefreq: "yearly",
				priority: "0.3"
			},
			{
				path: "/forgot-password",
				changefreq: "yearly",
				priority: "0.2"
			},
			{
				path: "/reset-password",
				changefreq: "yearly",
				priority: "0.2"
			},
			{
				path: "/bootstrap-admin",
				changefreq: "yearly",
				priority: "0.2"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$14 = () => import("./signup-Bd_V5oWI.mjs");
var Route$15 = createFileRoute("/signup")({
	component: lazyRouteComponent($$splitComponentImporter$14, "component"),
	head: () => ({ meta: [
		{ title: "Create Your Business — Qfloww" },
		{
			name: "description",
			content: "Create your Qfloww business account. Own your public booking page in minutes."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var $$splitComponentImporter$13 = () => import("./reset-password-DsedH0pg.mjs");
var Route$14 = createFileRoute("/reset-password")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [
		{ title: "Set New Password — Qfloww" },
		{
			name: "description",
			content: "Set a new password for your Qfloww account."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var $$splitComponentImporter$12 = () => import("./privacy-D85XH_QI.mjs");
var CANONICAL$3 = "https://qfloww.pridemarketing.co.in/privacy";
var Route$13 = createFileRoute("/privacy")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({
		meta: [
			{ title: "Privacy Policy — Qfloww" },
			{
				name: "description",
				content: "How Qfloww and Pride Marketing collect, use, store, and protect personal data. Compliant with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000."
			},
			{
				property: "og:title",
				content: "Privacy Policy — Qfloww"
			},
			{
				property: "og:description",
				content: "Qfloww's privacy policy under Indian law: what data we collect, why, how long we keep it, and your rights as a Data Principal."
			},
			{
				property: "og:url",
				content: CANONICAL$3
			}
		],
		links: [{
			rel: "canonical",
			href: CANONICAL$3
		}]
	})
});
var $$splitComponentImporter$11 = () => import("./login-B7POPyHj.mjs");
var Route$12 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	head: () => ({ meta: [
		{ title: "Sign In — Qfloww" },
		{
			name: "description",
			content: "Sign in to your Qfloww account with your email and password."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var $$splitComponentImporter$10 = () => import("./forgot-password-NVdRDcIm.mjs");
var Route$11 = createFileRoute("/forgot-password")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [
		{ title: "Reset Password — Qfloww" },
		{
			name: "description",
			content: "Request a password reset link for your Qfloww account."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var $$splitComponentImporter$9 = () => import("./contact-B1oEZySW.mjs");
var CANONICAL$2 = "https://qfloww.pridemarketing.co.in/contact";
var Route$10 = createFileRoute("/contact")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: () => ({
		meta: [
			{ title: "Contact Qfloww — Pride Marketing" },
			{
				name: "description",
				content: "Reach the Qfloww team by email, phone, or WhatsApp. Onboarding, support, billing, and partnership queries — one address, one number."
			},
			{
				property: "og:title",
				content: "Contact Qfloww"
			},
			{
				property: "og:description",
				content: "Talk to the team behind Qfloww by email, phone, or WhatsApp."
			},
			{
				property: "og:url",
				content: CANONICAL$2
			}
		],
		links: [{
			rel: "canonical",
			href: CANONICAL$2
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ContactPage",
				url: CANONICAL$2,
				mainEntity: {
					"@type": "Organization",
					name: SITE_CONTACT.legalEntity,
					url: SITE_CONTACT.parentUrl,
					email: SITE_CONTACT.email,
					telephone: SITE_CONTACT.phone,
					address: {
						"@type": "PostalAddress",
						addressLocality: "Bhopal",
						addressRegion: "Madhya Pradesh",
						addressCountry: "IN"
					}
				}
			})
		}]
	})
});
var $$splitComponentImporter$8 = () => import("./bootstrap-admin-CWWyM6EO.mjs");
var Route$9 = createFileRoute("/bootstrap-admin")({
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({ meta: [{ title: "Bootstrap Admin — Qfloww" }, {
		name: "robots",
		content: "noindex,nofollow"
	}] })
});
var $$splitComponentImporter$7 = () => import("./route-CkKC0rWS.mjs");
var Route$8 = createFileRoute("/_authenticated")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./routes-zIljdq0R.mjs");
var CANONICAL$1 = "https://qfloww.pridemarketing.co.in/";
var Route$7 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({
		meta: [
			{ title: "Qfloww — Editorial booking & queue management" },
			{
				name: "description",
				content: "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios."
			},
			{
				property: "og:title",
				content: "Qfloww — Editorial booking & queue management"
			},
			{
				property: "og:description",
				content: "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios."
			},
			{
				property: "og:url",
				content: CANONICAL$1
			}
		],
		links: [{
			rel: "canonical",
			href: CANONICAL$1
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: [
					{
						"@type": "Question",
						name: "Do clients need an account?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "No. The public booking page takes a name and a phone number — that's the whole flow."
						}
					},
					{
						"@type": "Question",
						name: "Can I sign up my business directly?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes. Create an account at /signup, confirm your email, and your booking page goes live after activation. Manual concierge onboarding is available if you prefer."
						}
					},
					{
						"@type": "Question",
						name: "Do you send booking confirmations?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes. Clients who share an email get a branded confirmation with their token, slot, and date. Your team sees the same booking live on the panel."
						}
					},
					{
						"@type": "Question",
						name: "What happens if a plan expires?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "You get a soft warning strip first, a grace period next, and only then a locked owner view. The public booking page stays polite either way."
						}
					},
					{
						"@type": "Question",
						name: "Who can staff the front desk?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Two staff roles: reception (check-ins and queue) and management (owner view with billing and history). Platform admin is handled by Pride Marketing."
						}
					}
				]
			})
		}]
	})
});
var $$splitComponentImporter$5 = () => import("./doctor-invite.accept-mJKWAkBx.mjs");
var Route$6 = createFileRoute("/doctor-invite/accept")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	validateSearch: (s) => objectType({ token: stringType().uuid().optional() }).parse(s),
	head: () => ({ meta: [{ title: "Accept doctor invitation — Qfloww" }, {
		name: "robots",
		content: "noindex,nofollow"
	}] })
});
var $$splitComponentImporter$4 = () => import("./blog.virtual-vs-physical-queues-bX5fK-_x.mjs");
var CANONICAL = "https://qfloww.pridemarketing.co.in/blog/virtual-vs-physical-queues";
var Route$5 = createFileRoute("/blog/virtual-vs-physical-queues")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({
		meta: [
			{ title: "Virtual Queues vs Physical Waiting Rooms — Qfloww" },
			{
				name: "description",
				content: "Compare virtual queue management systems with traditional physical waiting rooms. See how predictable arrivals, no-show reduction, and slot capacity change how clinics, salons, and consulting firms run their day."
			},
			{
				property: "og:title",
				content: "Virtual Queues vs Physical Waiting Rooms"
			},
			{
				property: "og:description",
				content: "Physical lines waste hours and floor space. Virtual queues turn arrivals into a predictable schedule. Here's how the two compare — and what to switch first."
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				property: "og:url",
				content: CANONICAL
			}
		],
		links: [{
			rel: "canonical",
			href: CANONICAL
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Article",
				headline: "Virtual Queues vs Physical Waiting Rooms",
				about: "Queue management system comparison — virtual queue vs physical waiting room",
				author: {
					"@type": "Organization",
					name: "Qfloww"
				},
				mainEntityOfPage: CANONICAL
			})
		}]
	})
});
var $$splitComponentImporter$3 = () => import("./pending-activation-CoyHbpF9.mjs");
var Route$4 = createFileRoute("/_authenticated/pending-activation")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [
		{ title: "Awaiting Activation — Qfloww" },
		{
			name: "description",
			content: "Your Qfloww business is awaiting activation."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var $$splitComponentImporter$2 = () => import("./management-B7nin2qD.mjs");
var Route$3 = createFileRoute("/_authenticated/management")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin-C6NfClo8.mjs");
var Route$2 = createFileRoute("/_authenticated/admin")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [
		{ title: "Admin Control Center — Qfloww" },
		{
			name: "description",
			content: "Platform admin panel for activating businesses, managing slots and services, and reviewing activation requests."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var $$splitComponentImporter = () => import("./management.index-DRwh1my_.mjs");
var Route$1 = createFileRoute("/_authenticated/management/")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (search) => objectType({ as: stringType().optional() }).parse(search),
	head: () => ({ meta: [
		{ title: "Management — Today's Queue — Qfloww" },
		{
			name: "description",
			content: "Owner view of today's queue: live arrivals, ongoing tokens, completions, and billing status for your business."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
var Route = createFileRoute("/_authenticated/management/history")({
	component: HistoryPage,
	head: () => ({ meta: [
		{ title: "Booking History — Qfloww" },
		{
			name: "description",
			content: "Searchable history of past bookings for your business: filter by date and look up clients by name, phone, or token."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] })
});
function HistoryPage() {
	const { profile } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("");
	const { data: bookings } = useQuery({
		queryKey: [
			"history",
			profile?.business_id,
			dateFilter
		],
		enabled: !!profile?.business_id,
		queryFn: async () => {
			let q = supabase.from("bookings").select("*").eq("business_id", profile.business_id).order("date", { ascending: false }).order("token_number").limit(500);
			if (dateFilter) q = q.eq("date", dateFilter);
			const { data } = await q;
			return data ?? [];
		}
	});
	const { data: services } = useQuery({
		queryKey: ["services", profile?.business_id],
		enabled: !!profile?.business_id,
		queryFn: async () => (await supabase.from("services").select("id, name").eq("business_id", profile.business_id)).data ?? []
	});
	const { data: slots } = useQuery({
		queryKey: ["slots-full", profile?.business_id],
		enabled: !!profile?.business_id,
		queryFn: async () => (await supabase.from("slots").select("id, name, start_time, end_time, max_capacity, day_of_week").eq("business_id", profile.business_id).eq("is_active", true).order("start_time")).data ?? []
	});
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const todayDow = (/* @__PURE__ */ new Date()).getDay();
	const { data: todayBookings } = useQuery({
		queryKey: [
			"today-counts",
			profile?.business_id,
			today
		],
		enabled: !!profile?.business_id,
		queryFn: async () => (await supabase.from("bookings").select("slot_id, status").eq("business_id", profile.business_id).eq("date", today).neq("status", "cancelled")).data ?? []
	});
	const slotInfo = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		(todayBookings ?? []).forEach((b) => {
			if (b.slot_id) counts.set(b.slot_id, (counts.get(b.slot_id) ?? 0) + 1);
		});
		return (slots ?? []).filter((s) => s.day_of_week === todayDow).map((s) => ({
			id: s.id,
			name: s.name,
			start_time: s.start_time,
			end_time: s.end_time,
			max_capacity: s.max_capacity,
			booked_today: counts.get(s.id) ?? 0
		}));
	}, [
		slots,
		todayBookings,
		todayDow
	]);
	const filtered = (0, import_react.useMemo)(() => {
		if (!bookings) return [];
		const q = search.trim().toLowerCase();
		if (!q) return bookings;
		return bookings.filter((b) => [
			b.client_name ?? "",
			b.client_phone ?? "",
			String(b.token_number)
		].some((v) => v.toLowerCase().includes(q)));
	}, [bookings, search]);
	if (profile && !["owner", "admin"].includes(profile.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffTopNav, {
			title: "Management",
			businessSlug: profile?.business_slug ?? void 0,
			slots: slotInfo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-6 py-10 lg:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-marker",
						children: "Archive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl",
						children: "Booking history"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Search bookings",
							placeholder: "Search name, phone, token…",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "flex-1 min-w-[220px] rounded-none border border-rule bg-paper text-ink px-3 py-1.5 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							"aria-label": "Filter by date",
							value: dateFilter,
							onChange: (e) => setDateFilter(e.target.value),
							className: "rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
						}),
						dateFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setDateFilter(""),
							className: "rounded-full border border-rule px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper",
							children: "Clear"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden border border-rule bg-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-rule bg-warm-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "text-left text-[11px] uppercase tracking-[0.14em] text-warm-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Token"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Phone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Service"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Slot"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Type"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 8,
								className: "px-4 py-10 text-center text-warm-5",
								children: "No history"
							}) }), filtered.map((b) => {
								const svc = services?.find((s) => s.id === b.service_id)?.name ?? "—";
								const slot = slots?.find((s) => s.id === b.slot_id)?.name ?? "—";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-rule hover:bg-warm-1/60 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: format(/* @__PURE__ */ new Date(b.date + "T00:00:00"), "PP")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 font-semibold",
											children: b.token_number
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: b.client_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: b.client_phone
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: svc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: slot
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: b.is_walkin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-amber/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber",
												children: "Walk-in"
											}) : ""
										})
									]
								}, b.id);
							})] })]
						})
					})
				})
			]
		})]
	});
}
var VirtualQueueGuideRoute = Route$18.update({
	id: "/virtual-queue-guide",
	path: "/virtual-queue-guide",
	getParentRoute: () => Route$19
});
var TermsRoute = Route$17.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$19
});
var SitemapDotxmlRoute = Route$16.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$19
});
var SignupRoute = Route$15.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$19
});
var ResetPasswordRoute = Route$14.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$19
});
var PrivacyRoute = Route$13.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$19
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$19
});
var ForgotPasswordRoute = Route$11.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$10.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var BootstrapAdminRoute = Route$9.update({
	id: "/bootstrap-admin",
	path: "/bootstrap-admin",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRoute = Route$8.update({
	id: "/_authenticated",
	getParentRoute: () => Route$19
});
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var DoctorInviteAcceptRoute = Route$6.update({
	id: "/doctor-invite/accept",
	path: "/doctor-invite/accept",
	getParentRoute: () => Route$19
});
var BookSlugRoute = Route$20.update({
	id: "/book/$slug",
	path: "/book/$slug",
	getParentRoute: () => Route$19
});
var BlogVirtualVsPhysicalQueuesRoute = Route$5.update({
	id: "/blog/virtual-vs-physical-queues",
	path: "/blog/virtual-vs-physical-queues",
	getParentRoute: () => Route$19
});
var AuthenticatedPendingActivationRoute = Route$4.update({
	id: "/pending-activation",
	path: "/pending-activation",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedManagementRoute = Route$3.update({
	id: "/management",
	path: "/management",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDoctorRoute = Route$21.update({
	id: "/doctor",
	path: "/doctor",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$2.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedManagementIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedManagementRoute
});
var AuthenticatedManagementRouteChildren = {
	AuthenticatedManagementHistoryRoute: Route.update({
		id: "/history",
		path: "/history",
		getParentRoute: () => AuthenticatedManagementRoute
	}),
	AuthenticatedManagementIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedDoctorRoute,
	AuthenticatedManagementRoute: AuthenticatedManagementRoute._addFileChildren(AuthenticatedManagementRouteChildren),
	AuthenticatedPendingActivationRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	BootstrapAdminRoute,
	ContactRoute,
	ForgotPasswordRoute,
	LoginRoute,
	PrivacyRoute,
	ResetPasswordRoute,
	SignupRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	VirtualQueueGuideRoute,
	BlogVirtualVsPhysicalQueuesRoute,
	BookSlugRoute,
	DoctorInviteAcceptRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
