import { r as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-B4tl1Mhw.mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { E as Check, _ as LoaderCircle, b as Copy, g as LockOpen, h as Lock, i as Trash2, m as LogOut, n as UserX, p as Mail, v as Eye, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as Forbidden } from "./staff-nav-PtY9WxNB.mjs";
import { a as adminSetBusinessCurrency, i as adminRevokeDoctorInvite, n as adminInviteDoctor, o as adminSetBusinessLock, r as adminRemoveDoctor, t as adminActivateBusiness } from "./admin.functions-BCUmJvgO.mjs";
import { t as CURRENCY_OPTIONS } from "./currency-2G69NBBN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C6NfClo8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { profile, signOut } = useAuth();
	const navigate = useNavigate();
	const [section, setSection] = (0, import_react.useState)("businesses");
	const [activeBiz, setActiveBiz] = (0, import_react.useState)(null);
	if (profile && profile.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden md:block w-56 border-r bg-paper min-h-dvh p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-warm-5",
							children: "Admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: "Control center"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "space-y-1 text-sm",
						children: [
							"businesses",
							"requests",
							"slots",
							"services",
							"doctors"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSection(s),
							className: `block w-full rounded-md px-3 py-2 text-left capitalize ${section === s ? "bg-accent" : "hover:bg-accent/50"}`,
							children: s
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							await signOut();
							navigate({ to: "/login" });
						},
						className: "mt-8 inline-flex items-center gap-2 text-xs text-warm-5 hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3 w-3" }), " Sign out"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:hidden mb-4 flex gap-2 overflow-x-auto",
						children: [
							"businesses",
							"requests",
							"slots",
							"services",
							"doctors"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSection(s),
							className: `whitespace-nowrap rounded-md border px-3 py-1.5 text-sm capitalize ${section === s ? "bg-primary text-primary-foreground" : ""}`,
							children: s
						}, s))
					}),
					section === "businesses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessesSection, { onSelect: (id) => {
						setActiveBiz(id);
						setSection("slots");
					} }),
					section === "requests" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivationRequestsSection, {}),
					section === "slots" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotsSection, {
						activeBiz,
						setActiveBiz
					}),
					section === "services" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesSection, {
						activeBiz,
						setActiveBiz
					}),
					section === "doctors" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorsSection, {
						activeBiz,
						setActiveBiz
					})
				]
			})]
		})
	});
}
function useBusinesses() {
	return useQuery({
		queryKey: ["admin-businesses"],
		queryFn: async () => {
			const { data } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
}
function BusinessSelector({ activeBiz, setActiveBiz }) {
	const { data: bizs } = useBusinesses();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: activeBiz ?? "",
		onChange: (e) => setActiveBiz(e.target.value),
		className: "rounded-none border border-rule bg-paper px-3 py-1.5 text-sm text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "— Select business —"
		}), (bizs ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: b.id,
			children: b.name
		}, b.id))]
	});
}
function statusFor(b) {
	const now = Date.now();
	if (b.manual_lock || !b.is_active) return {
		label: "Locked",
		color: "bg-warm-2 text-destructive border border-rule"
	};
	if (!b.activated_at || !b.expires_at) return {
		label: "Pending",
		color: "bg-warm-1 text-warm-5 border border-rule"
	};
	const exp = new Date(b.expires_at).getTime();
	const daysLeft = Math.ceil((exp - now) / 864e5);
	if (daysLeft <= 0) return {
		label: "Expired",
		color: "bg-warm-2 text-destructive border border-rule"
	};
	if (daysLeft <= 7) return {
		label: `Expires in ${daysLeft}d`,
		color: "bg-amber/15 text-ink border border-amber/40"
	};
	return {
		label: `Active (${daysLeft}d left)`,
		color: "bg-warm-1 text-ink border border-rule"
	};
}
function BusinessesSection({ onSelect }) {
	const qc = useQueryClient();
	const { data: bizs } = useBusinesses();
	const activate = useServerFn(adminActivateBusiness);
	const setLock = useServerFn(adminSetBusinessLock);
	const mActivate = useMutation({
		mutationFn: ({ id, days }) => activate({ data: {
			business_id: id,
			duration_days: days
		} }),
		onSuccess: () => {
			toast.success("Business activated");
			qc.invalidateQueries({ queryKey: ["admin-businesses"] });
			qc.invalidateQueries({ queryKey: ["activation-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const mLock = useMutation({
		mutationFn: ({ id, locked }) => setLock({ data: {
			business_id: id,
			locked
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-businesses"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-[-0.02em]",
				children: "Business Accounts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-warm-5",
				children: [
					"Owners sign up themselves at ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "rounded bg-warm-1 px-1",
						children: "/signup"
					}),
					". Activate an account by giving it a duration."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-rule bg-paper p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "All businesses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [(bizs ?? []).map((b) => {
						const s = statusFor(b);
						const bookingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${b.slug}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 rounded-md border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: b.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-warm-5",
								children: [
									"/",
									b.slug,
									" · ",
									b.type,
									b.expires_at && ` · expires ${format(new Date(b.expires_at), "PP")}`
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded px-2 py-0.5 text-xs ${s.color}`,
										children: s.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyPicker, { business: b }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingLinkActions, { url: bookingUrl }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/management",
										search: { as: b.slug },
										className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent",
										title: "View this client's management page",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " View as"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onSelect(b.id),
										className: "rounded-md border px-2 py-1 text-xs hover:bg-accent",
										children: "Manage"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivateMenu, {
										onActivate: (days) => mActivate.mutate({
											id: b.id,
											days
										}),
										pending: mActivate.isPending
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => mLock.mutate({
											id: b.id,
											locked: !b.manual_lock
										}),
										className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
										title: b.manual_lock ? "Unlock" : "Lock",
										children: b.manual_lock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-3 w-3" }), " Unlock"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " Lock"] })
									})
								]
							})]
						}, b.id);
					}), (!bizs || bizs.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-warm-5",
						children: "No businesses yet. Owners can sign up at /signup."
					})]
				})]
			})
		]
	});
}
function ActivateMenu({ onActivate, pending }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [days, setDays] = (0, import_react.useState)(30);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setOpen(!open),
			className: "rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground",
			children: "Activate"
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-10 mt-1 w-56 border border-rule bg-paper p-3 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-warm-5",
					children: "Duration (days)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 1,
					max: 3650,
					value: days,
					onChange: (e) => setDays(Number(e.target.value)),
					className: "mt-1 w-full rounded-none border border-rule bg-paper text-ink px-2 py-1 text-xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-1",
					children: [
						7,
						30,
						90,
						365
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setDays(d),
						className: "rounded-md border px-2 py-0.5 text-xs hover:bg-accent",
						children: [d, "d"]
					}, d))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: pending,
					onClick: () => {
						onActivate(days);
						setOpen(false);
					},
					className: "mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-50",
					children: [pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Confirm activation"]
				})
			]
		})]
	});
}
function BookingLinkActions({ url }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => navigator.clipboard.writeText(url).then(() => toast.success("Booking link copied")),
			"aria-label": "Copy booking link",
			title: "Copy booking link",
			className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
				className: "h-3 w-3",
				"aria-hidden": "true"
			}), " Copy"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: url,
			target: "_blank",
			rel: "noreferrer",
			"aria-label": "Open booking page in new tab",
			title: "Open booking page in new tab",
			className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
				className: "h-3 w-3",
				"aria-hidden": "true"
			}), " Open"]
		})]
	});
}
function ActivationRequestsSection() {
	const qc = useQueryClient();
	const activate = useServerFn(adminActivateBusiness);
	const { data: requests } = useQuery({
		queryKey: ["activation-requests"],
		queryFn: async () => {
			const { data } = await supabase.from("activation_requests").select("*, businesses(name, slug)").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const mApprove = useMutation({
		mutationFn: ({ id, days }) => activate({ data: {
			business_id: id,
			duration_days: days
		} }),
		onSuccess: () => {
			toast.success("Activated");
			qc.invalidateQueries({ queryKey: ["activation-requests"] });
			qc.invalidateQueries({ queryKey: ["admin-businesses"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const mReject = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("activation_requests").update({ status: "rejected" }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["activation-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl tracking-[-0.02em]",
			children: "Activation Requests"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [(requests ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border border-rule bg-paper p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold",
						children: [
							r.businesses?.name ?? "—",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-warm-5",
								children: ["/", r.businesses?.slug]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-warm-5",
						children: [
							format(new Date(r.created_at), "PPp"),
							" · ",
							r.status
						]
					}),
					r.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: r.message
					})
				] }), r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => mApprove.mutate({
							id: r.business_id,
							days: 30
						}),
						className: "inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Approve 30d"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => mReject.mutate(r.id),
						className: "rounded-md border px-2 py-1 text-xs text-destructive",
						children: "Reject"
					})]
				})]
			}, r.id)), (!requests || requests.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-warm-5",
				children: "No activation requests."
			})]
		})]
	});
}
var DAYS = [
	{
		idx: 1,
		label: "Mon"
	},
	{
		idx: 2,
		label: "Tue"
	},
	{
		idx: 3,
		label: "Wed"
	},
	{
		idx: 4,
		label: "Thu"
	},
	{
		idx: 5,
		label: "Fri"
	},
	{
		idx: 6,
		label: "Sat"
	},
	{
		idx: 0,
		label: "Sun"
	}
];
function SlotsSection({ activeBiz, setActiveBiz }) {
	const qc = useQueryClient();
	const [day, setDay] = (0, import_react.useState)(1);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		start_time: "09:00",
		end_time: "12:00",
		max_capacity: 10
	});
	const { data: slots } = useQuery({
		queryKey: ["slots-admin", activeBiz],
		enabled: !!activeBiz,
		queryFn: async () => (await supabase.from("slots").select("*").eq("business_id", activeBiz).order("start_time")).data ?? []
	});
	const create = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("slots").insert({
				business_id: activeBiz,
				name: form.name,
				start_time: form.start_time + ":00",
				end_time: form.end_time + ":00",
				max_capacity: form.max_capacity,
				day_of_week: day,
				days_of_week: [day]
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["slots-admin"] });
			setForm({
				name: "",
				start_time: "09:00",
				end_time: "12:00",
				max_capacity: 10
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("slots").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Slot deleted");
			qc.invalidateQueries({ queryKey: ["slots-admin"] });
		},
		onError: (e) => {
			const msg = String(e?.message ?? e);
			if (msg.includes("violates foreign key") || e?.code === "23503") toast.error("Can't delete: this slot has existing bookings. Disable it instead.");
			else toast.error(msg || "Failed to delete slot");
		}
	});
	const toggle = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("slots").update({ is_active: !row.is_active }).eq("id", row.id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["slots-admin"] })
	});
	const copyDay = useMutation({
		mutationFn: async (targetDay) => {
			const source = (slots ?? []).filter((s) => s.day_of_week === day);
			if (source.length === 0) throw new Error("No slots to copy from this day.");
			const rows = source.map((s) => ({
				business_id: activeBiz,
				name: s.name,
				start_time: s.start_time,
				end_time: s.end_time,
				max_capacity: s.max_capacity,
				is_active: s.is_active,
				day_of_week: targetDay,
				days_of_week: [targetDay]
			}));
			const { error } = await supabase.from("slots").insert(rows);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Copied");
			qc.invalidateQueries({ queryKey: ["slots-admin"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const daySlots = (slots ?? []).filter((s) => s.day_of_week === day);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-[-0.02em]",
				children: "Weekly Slots"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warm-5",
				children: "Set slots per weekday. They recur every week."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessSelector, {
				activeBiz,
				setActiveBiz
			}),
			activeBiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1 border-b border-rule pb-2",
					children: DAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setDay(d.idx),
						className: `rounded-md px-3 py-1.5 text-sm ${day === d.idx ? "bg-ink text-paper" : "border border-rule bg-paper hover:bg-warm-1"}`,
						children: [
							d.label,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-xs opacity-60",
								children: (slots ?? []).filter((s) => s.day_of_week === d.idx).length
							})
						]
					}, d.idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-rule bg-paper p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-2 font-semibold",
						children: ["Add slot to ", DAYS.find((d) => d.idx === day)?.label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 md:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Slot name",
								placeholder: "Name",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								className: "rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Start time",
								type: "time",
								value: form.start_time,
								onChange: (e) => setForm({
									...form,
									start_time: e.target.value
								}),
								className: "rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "End time",
								type: "time",
								value: form.end_time,
								onChange: (e) => setForm({
									...form,
									end_time: e.target.value
								}),
								className: "rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Capacity",
								type: "number",
								min: 1,
								value: form.max_capacity,
								onChange: (e) => setForm({
									...form,
									max_capacity: Number(e.target.value)
								}),
								className: "rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
								placeholder: "Capacity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: !form.name,
								onClick: () => create.mutate(),
								"aria-label": "Add slot",
								className: "rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50",
								children: "Add"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs text-warm-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy this day to:" }), DAYS.filter((d) => d.idx !== day).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => copyDay.mutate(d.idx),
						className: "rounded-md border border-rule px-2 py-1 hover:bg-warm-1",
						children: d.label
					}, d.idx))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-rule bg-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-warm-1 text-xs uppercase text-warm-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Capacity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [daySlots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: s.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2",
									children: [
										s.start_time ? String(s.start_time).slice(0, 5) : "—",
										" – ",
										s.end_time ? String(s.end_time).slice(0, 5) : "—"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: s.max_capacity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: s.is_active ? "Active" : "Off"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggle.mutate(s),
										className: "mr-1 rounded-md border px-2 py-1 text-xs",
										children: s.is_active ? "Disable" : "Enable"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											if (window.confirm(`Delete slot "${s.name}"?`)) del.mutate(s.id);
										},
										"aria-label": `Delete slot ${s.name}`,
										className: "rounded-md border px-2 py-1 text-xs text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "h-3 w-3",
											"aria-hidden": "true"
										})
									})]
								})
							]
						}, s.id)), daySlots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-3 py-6 text-center text-warm-5",
							children: "No slots on this day"
						}) })] })]
					})
				})
			] })
		]
	});
}
function ServicesSection({ activeBiz, setActiveBiz }) {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const { data: services } = useQuery({
		queryKey: ["services-admin", activeBiz],
		enabled: !!activeBiz,
		queryFn: async () => (await supabase.from("services").select("*").eq("business_id", activeBiz).order("name")).data ?? []
	});
	const create = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("services").insert({
				business_id: activeBiz,
				name
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["services-admin"] });
			setName("");
		}
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("services").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["services-admin"] })
	});
	const toggle = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("services").update({ is_active: !row.is_active }).eq("id", row.id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["services-admin"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-[-0.02em]",
				children: "Services Manager"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessSelector, {
				activeBiz,
				setActiveBiz
			}),
			activeBiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Service name",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Service name",
					className: "flex-1 rounded-none border border-rule bg-paper text-ink px-3 py-1.5 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: !name,
					onClick: () => create.mutate(),
					className: "rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground disabled:opacity-50",
					children: "Add"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-1",
				children: (services ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border border-rule bg-paper px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						s.name,
						" ",
						!s.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-warm-5",
							children: "(hidden)"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggle.mutate(s),
							className: "rounded-md border px-2 py-1 text-xs",
							children: s.is_active ? "Hide" : "Show"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => del.mutate(s.id),
							"aria-label": `Delete service ${s.name}`,
							className: "rounded-md border px-2 py-1 text-xs text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "h-3 w-3",
								"aria-hidden": "true"
							})
						})]
					})]
				}, s.id))
			})] })
		]
	});
}
function CurrencyPicker({ business }) {
	const qc = useQueryClient();
	const setCurrency = useServerFn(adminSetBusinessCurrency);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value: business.currency ?? "INR",
		onChange: async (e) => {
			try {
				await setCurrency({ data: {
					business_id: business.id,
					currency: e.target.value
				} });
				toast.success("Currency updated");
				qc.invalidateQueries({ queryKey: ["admin-businesses"] });
			} catch (err) {
				toast.error(err?.message ?? "Failed");
			}
		},
		className: "rounded-none border border-rule bg-paper px-2 py-1 text-xs",
		"aria-label": "Business currency",
		children: CURRENCY_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: c.code,
			children: c.code
		}, c.code))
	});
}
function DoctorsSection({ activeBiz, setActiveBiz }) {
	const qc = useQueryClient();
	const invite = useServerFn(adminInviteDoctor);
	const revoke = useServerFn(adminRevokeDoctorInvite);
	const remove = useServerFn(adminRemoveDoctor);
	const [email, setEmail] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const { data: invites } = useQuery({
		queryKey: ["doctor-invites", activeBiz],
		enabled: !!activeBiz,
		queryFn: async () => (await supabase.from("doctor_invites").select("*").eq("business_id", activeBiz).order("created_at", { ascending: false })).data ?? []
	});
	const { data: doctorRoles } = useQuery({
		queryKey: ["doctor-roles", activeBiz],
		enabled: !!activeBiz,
		queryFn: async () => (await supabase.from("user_roles").select("user_id").eq("business_id", activeBiz).eq("role", "doctor")).data ?? []
	});
	const doctorIds = (doctorRoles ?? []).map((r) => r.user_id);
	const { data: doctors } = useQuery({
		queryKey: ["doctor-profiles", doctorIds.join(",")],
		enabled: doctorIds.length > 0,
		queryFn: async () => (await supabase.from("profiles").select("id, email, display_name").in("id", doctorIds)).data ?? []
	});
	const submit = async () => {
		if (!activeBiz || !email) return;
		setSending(true);
		try {
			await invite({ data: {
				business_id: activeBiz,
				email: email.trim().toLowerCase()
			} });
			toast.success("Invitation sent");
			setEmail("");
			qc.invalidateQueries({ queryKey: ["doctor-invites"] });
		} catch (e) {
			toast.error(e?.message ?? "Failed to send invite");
		} finally {
			setSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-[-0.02em]",
				children: "Doctors"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessSelector, {
				activeBiz,
				setActiveBiz
			}),
			activeBiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-rule bg-paper p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 font-semibold",
							children: "Invite a doctor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								placeholder: "doctor@example.com",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "flex-1 min-w-[220px] rounded-none border border-rule bg-paper px-3 py-1.5 text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: !email || sending,
								onClick: submit,
								className: "inline-flex items-center gap-2 rounded-md bg-ink px-4 py-1.5 text-sm text-paper disabled:opacity-50",
								children: [sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), "Send invite"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-warm-5",
							children: "The doctor receives an email with a link to set their password and join. Invitations expire in 14 days."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-sm font-semibold uppercase tracking-wider text-warm-5",
					children: "Active doctors"
				}), doctorIds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-warm-5",
					children: "No doctors yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: (doctors ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border border-rule bg-paper px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: d.display_name || d.email }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-warm-5",
							children: d.email
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								if (!confirm(`Remove ${d.email} from this clinic?`)) return;
								try {
									await remove({ data: {
										user_id: d.id,
										business_id: activeBiz
									} });
									toast.success("Removed");
									qc.invalidateQueries({ queryKey: ["doctor-roles"] });
									qc.invalidateQueries({ queryKey: ["doctor-profiles"] });
								} catch (e) {
									toast.error(e?.message ?? "Failed");
								}
							},
							className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-3 w-3" }), " Remove"]
						})]
					}, d.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-sm font-semibold uppercase tracking-wider text-warm-5",
					children: "Invitations"
				}), (invites ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-warm-5",
					children: "No invitations sent."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-rule bg-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-warm-1 text-xs uppercase text-warm-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Expires"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (invites ?? []).map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: inv.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 capitalize",
									children: inv.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-warm-5",
									children: format(new Date(inv.expires_at), "PP")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right",
									children: inv.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: async () => {
											try {
												await revoke({ data: { invite_id: inv.id } });
												toast.success("Revoked");
												qc.invalidateQueries({ queryKey: ["doctor-invites"] });
											} catch (e) {
												toast.error(e?.message ?? "Failed");
											}
										},
										className: "rounded-md border px-2 py-1 text-xs",
										children: "Revoke"
									})
								})
							]
						}, inv.id)) })]
					})
				})] })
			] })
		]
	});
}
//#endregion
export { AdminPage as component };
