import { r as __toESM } from "../_runtime.mjs";
import { _ as Link, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action, v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { F as ArrowLeft, P as ArrowRight, _ as LoaderCircle, k as CalendarClock, t as X } from "../_libs/lucide-react.mjs";
import { n as StaffTopNav, r as StatusBadge, t as Forbidden } from "./staff-nav-PtY9WxNB.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format, s as addDays } from "../_libs/date-fns.mjs";
import { t as computePlanStatus } from "./plan-3nosrRGP.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as buttonVariants } from "./button-BkEeRci-.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DM5mPuDe.mjs";
import { t as PaymentDialog } from "./doctor-D8JKEcNU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/management.index-DRwh1my_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var todayStr = () => format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
function ManagementPage() {
	const { profile } = useAuth();
	const { as: asSlug } = useSearch({ from: "/_authenticated/management/" });
	const qc = useQueryClient();
	const [dateStr, setDateStr] = (0, import_react.useState)(todayStr());
	const [search, setSearch] = (0, import_react.useState)("");
	const [add, setAdd] = (0, import_react.useState)({
		name: "",
		phone: "",
		service_id: "",
		slot_id: "",
		date: todayStr()
	});
	const [reschedule, setReschedule] = (0, import_react.useState)(null);
	const [revert, setRevert] = (0, import_react.useState)(null);
	const [cancelConfirm, setCancelConfirm] = (0, import_react.useState)(null);
	const [paying, setPaying] = (0, import_react.useState)(null);
	const isAdmin = profile?.role === "admin";
	const impersonateSlug = isAdmin ? asSlug : void 0;
	const { data: impersonatedBiz } = useQuery({
		queryKey: ["mg-impersonate", impersonateSlug],
		enabled: !!impersonateSlug,
		queryFn: async () => {
			const { data } = await supabase.from("businesses").select("*").eq("slug", impersonateSlug).maybeSingle();
			return data;
		}
	});
	const bizId = impersonatedBiz?.id ?? profile?.business_id ?? null;
	const { data: ownBiz } = useQuery({
		queryKey: [
			"biz",
			bizId,
			!!impersonateSlug
		],
		enabled: !!bizId && !impersonateSlug,
		queryFn: async () => {
			const { data } = await supabase.from("businesses").select("*").eq("id", bizId).maybeSingle();
			return data;
		}
	});
	const biz = impersonatedBiz ?? ownBiz;
	const status = biz ? computePlanStatus(biz) : null;
	const { data: bookings } = useQuery({
		queryKey: [
			"mg-bookings",
			bizId,
			dateStr
		],
		enabled: !!bizId,
		queryFn: async () => {
			const { data } = await supabase.from("bookings").select("*").eq("business_id", bizId).eq("date", dateStr).in("status", [
				"booked",
				"arrived",
				"ongoing",
				"completed"
			]).order("token_number");
			return data ?? [];
		}
	});
	const { data: allToday } = useQuery({
		queryKey: [
			"mg-today-all",
			bizId,
			todayStr()
		],
		enabled: !!bizId,
		queryFn: async () => {
			const { data } = await supabase.from("bookings").select("*").eq("business_id", bizId).eq("date", todayStr());
			return data ?? [];
		}
	});
	const { data: services } = useQuery({
		queryKey: ["services", bizId],
		enabled: !!bizId,
		queryFn: async () => (await supabase.from("services").select("id, name").eq("business_id", bizId).eq("is_active", true).order("name")).data ?? []
	});
	const { data: slots } = useQuery({
		queryKey: ["slots", bizId],
		enabled: !!bizId,
		queryFn: async () => (await supabase.from("slots").select("id, name, start_time, end_time, max_capacity, day_of_week").eq("business_id", bizId).eq("is_active", true).order("start_time")).data ?? []
	});
	const todayDow = (/* @__PURE__ */ new Date()).getDay();
	const addDow = add?.date ? (/* @__PURE__ */ new Date(add.date + "T00:00:00")).getDay() : todayDow;
	const todayStrLocal = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const isSlotPast = (dateStr, startTime) => {
		if (!startTime || dateStr !== todayStrLocal) return false;
		const [hh, mm] = String(startTime).split(":").map((x) => parseInt(x, 10) || 0);
		const slotDate = /* @__PURE__ */ new Date();
		slotDate.setHours(hh, mm, 0, 0);
		return slotDate.getTime() <= Date.now();
	};
	const todaySlots = (0, import_react.useMemo)(() => (slots ?? []).filter((s) => s.day_of_week === todayDow), [slots, todayDow]);
	const addDateSlots = (0, import_react.useMemo)(() => (slots ?? []).filter((s) => s.day_of_week === addDow && !isSlotPast(add.date, s.start_time)), [
		slots,
		addDow,
		add.date,
		todayStrLocal
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
	const counts = (0, import_react.useMemo)(() => {
		const c = {
			total: 0,
			added: 0,
			arrived: 0,
			ongoing: 0,
			completed: 0,
			no_show: 0
		};
		(allToday ?? []).forEach((b) => {
			c.total++;
			if (b.is_walkin) c.added++;
			if (b.status === "arrived") c.arrived++;
			if (b.status === "ongoing") c.ongoing++;
			if (b.status === "completed") c.completed++;
			if (b.status === "no_show") c.no_show++;
		});
		return c;
	}, [allToday]);
	const slotInfo = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		(allToday ?? []).forEach((b) => {
			if (b.status !== "cancelled" && b.slot_id) counts.set(b.slot_id, (counts.get(b.slot_id) ?? 0) + 1);
		});
		return (todaySlots ?? []).map((s) => ({
			id: s.id,
			name: s.name,
			start_time: s.start_time,
			end_time: s.end_time,
			max_capacity: s.max_capacity,
			booked_today: counts.get(s.id) ?? 0
		}));
	}, [todaySlots, allToday]);
	const nextStatus = {
		booked: "arrived",
		arrived: "ongoing",
		ongoing: "completed"
	};
	const prevStatus = {
		arrived: "booked",
		ongoing: "arrived",
		completed: "ongoing"
	};
	const advance = useMutation({
		mutationFn: async (b) => {
			const next = nextStatus[b.status];
			if (!next) return;
			if (next === "completed") {
				setPaying(b);
				return;
			}
			const { error } = await supabase.from("bookings").update({ status: next }).eq("id", b.id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["mg-bookings"] }),
		onError: (e) => toast.error(e.message)
	});
	const revertMut = useMutation({
		mutationFn: async ({ booking, to }) => {
			const { error } = await supabase.from("bookings").update({ status: to }).eq("id", booking.id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["mg-bookings"] });
			qc.invalidateQueries({ queryKey: ["mg-today-all"] });
			toast.success("Status reverted");
			setRevert(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const cancel = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["mg-bookings"] });
			qc.invalidateQueries({ queryKey: ["mg-today-all"] });
			toast.success("Booking cancelled");
			setCancelConfirm(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const doReschedule = useMutation({
		mutationFn: async () => {
			if (!reschedule) throw new Error("No booking");
			const { booking, date, slot_id, service_id } = reschedule;
			if (!slot_id) throw new Error("Choose a slot");
			const rDow = (/* @__PURE__ */ new Date(date + "T00:00:00")).getDay();
			const rSlot = (slots ?? []).find((s) => s.id === slot_id);
			if (!rSlot || rSlot.day_of_week !== rDow) throw new Error("Selected slot is not available on the chosen date");
			if (isSlotPast(date, rSlot.start_time)) throw new Error("This slot has already started — pick a later time");
			const { data: lastRow, error: tErr } = await supabase.from("bookings").select("token_number").eq("business_id", booking.business_id).eq("slot_id", slot_id).eq("date", date).order("token_number", { ascending: false }).limit(1).maybeSingle();
			if (tErr) throw tErr;
			const token = (lastRow?.token_number ?? 0) + 1;
			const { error: insErr } = await supabase.from("bookings").insert({
				business_id: booking.business_id,
				slot_id,
				service_id: service_id || null,
				date,
				token_number: token,
				client_name: booking.client_name,
				client_phone: booking.client_phone,
				status: "booked",
				is_walkin: booking.is_walkin
			});
			if (insErr) throw insErr;
			const { error: updErr } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id);
			if (updErr) throw updErr;
			return {
				token,
				date
			};
		},
		onSuccess: (res) => {
			qc.invalidateQueries({ queryKey: ["mg-bookings"] });
			qc.invalidateQueries({ queryKey: ["mg-today-all"] });
			toast.success(`Rescheduled to ${res?.date} — Token ${res?.token}`);
			setReschedule(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const doAdd = useMutation({
		mutationFn: async () => {
			if (!bizId) throw new Error("No business selected");
			if (!add.slot_id) throw new Error("Choose a slot");
			const aDow = (/* @__PURE__ */ new Date(add.date + "T00:00:00")).getDay();
			const aSlot = (slots ?? []).find((s) => s.id === add.slot_id);
			if (!aSlot || aSlot.day_of_week !== aDow) throw new Error("Selected slot is not available on the chosen date");
			if (isSlotPast(add.date, aSlot.start_time)) throw new Error("This slot has already started — pick a later time");
			const { data: lastRow, error: tErr } = await supabase.from("bookings").select("token_number").eq("business_id", bizId).eq("slot_id", add.slot_id).eq("date", add.date).order("token_number", { ascending: false }).limit(1).maybeSingle();
			if (tErr) throw tErr;
			const token = (lastRow?.token_number ?? 0) + 1;
			const { error } = await supabase.from("bookings").insert({
				business_id: bizId,
				slot_id: add.slot_id,
				service_id: add.service_id || null,
				date: add.date,
				token_number: token,
				client_name: add.name,
				client_phone: add.phone,
				status: "booked",
				is_walkin: true
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["mg-bookings"] });
			qc.invalidateQueries({ queryKey: ["mg-today-all"] });
			setAdd({
				name: "",
				phone: "",
				service_id: "",
				slot_id: "",
				date: todayStr()
			});
			toast.success("Booking added");
		},
		onError: (e) => toast.error(e.message)
	});
	if (profile && !["owner", "admin"].includes(profile.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
	if (isAdmin && !bizId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Nothing selected"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-[-0.02em] text-ink",
					children: "No client selected"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-warm-5",
					children: "Open the admin panel to pick a client and view their management page."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "mt-2 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper",
					children: "Go to admin"
				})
			]
		})
	});
	if (status?.state === "locked") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffTopNav, { title: biz?.name ?? "Management" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-1 items-center justify-center bg-warm-1 px-4 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-[-0.02em]",
						children: "Plan Expired"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-warm-5",
						children: "Contact us to continue your service."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-warm-5",
						children: "[contact details]"
					})
				]
			})
		})]
	});
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffTopNav, {
				title: biz?.name ?? "Management",
				businessSlug: biz?.slug,
				slots: slotInfo
			}),
			impersonateSlug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-rule bg-ink px-4 py-2 text-center text-xs uppercase tracking-[0.14em] text-paper",
				children: [
					"Viewing as admin · client ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold normal-case tracking-normal",
						children: biz?.name ?? impersonateSlug
					}),
					" ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "underline decoration-amber decoration-2 underline-offset-4",
						children: "back to admin"
					})
				]
			}),
			status && (status.state === "warning" || status.state === "grace") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `border-b border-rule px-4 py-2 text-center text-xs uppercase tracking-[0.14em] ${status.state === "grace" ? "bg-amber/15 text-ink" : "bg-warm-1 text-warm-5"}`,
				children: [
					"Plan expires in ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold",
						children: [Math.max(0, status.daysUntilExpiry), " days"]
					}),
					" — please contact us to renew."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-6 py-10 lg:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "section-marker",
							children: "Today"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl",
							children: "Today’s queue"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									label: "Today",
									value: counts.total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									label: "Added",
									value: counts.added
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									label: "Arrived",
									value: counts.arrived
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									label: "Ongoing",
									value: counts.ongoing
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									label: "Completed",
									value: counts.completed
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									label: "No show",
									value: counts.no_show
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-rule bg-paper p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "section-marker",
								children: "+ Add booking"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sr-only",
											children: "Booking date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: add.date,
											min: format(today, "yyyy-MM-dd"),
											max: format(addDays(today, 45), "yyyy-MM-dd"),
											onChange: (e) => setAdd({
												...add,
												date: e.target.value,
												slot_id: ""
											}),
											"aria-label": "Booking date",
											className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": "Service",
										className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
										value: add.service_id,
										onChange: (e) => setAdd({
											...add,
											service_id: e.target.value
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Service (optional)"
										}), (services ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s.id,
											children: s.name
										}, s.id))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": "Slot",
										className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
										value: add.slot_id,
										onChange: (e) => setAdd({
											...add,
											slot_id: e.target.value
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Choose slot"
										}), (addDateSlots ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s.id,
											children: [s.name, s.start_time ? ` (${String(s.start_time).slice(0, 5)})` : ""]
										}, s.id))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Client name",
										className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
										placeholder: "Name",
										value: add.name,
										onChange: (e) => setAdd({
											...add,
											name: e.target.value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Client phone",
										className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
										placeholder: "Phone",
										value: add.phone,
										onChange: (e) => setAdd({
											...add,
											phone: e.target.value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										disabled: !add.name || !add.phone || !add.slot_id || doAdd.isPending,
										onClick: () => doAdd.mutate(),
										className: "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40",
										children: doAdd.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											className: "h-4 w-4 animate-spin",
											"aria-hidden": "true"
										}) : "Add booking"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0",
							children: Array.from({ length: 8 }).map((_, i) => {
								const d = addDays(today, i);
								const s = format(d, "yyyy-MM-dd");
								const active = s === dateStr;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setDateStr(s),
									className: `shrink-0 rounded-none border px-3 py-2 text-xs transition-colors ${active ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:bg-warm-1"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "section-marker",
										style: {
											color: active ? "var(--paper)" : void 0,
											opacity: active ? .7 : 1
										},
										children: format(d, "EEE")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 font-display text-sm tracking-tight",
										children: format(d, "MMM d")
									})]
								}, s);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								"aria-label": "Filter by date",
								value: dateStr,
								onChange: (e) => setDateStr(e.target.value),
								className: "rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Search bookings",
								placeholder: "Search…",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "min-w-[160px] flex-1 rounded-none border border-rule bg-paper text-ink px-3 py-1.5 text-sm"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 hidden overflow-hidden border border-rule bg-paper md:block",
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
												className: "px-4 py-3 text-right font-medium",
												children: "Actions"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "px-4 py-10 text-center text-warm-5",
									children: "No bookings"
								}) }), filtered.map((b) => {
									const svc = services?.find((s) => s.id === b.service_id)?.name ?? "—";
									const slot = slots?.find((s) => s.id === b.slot_id);
									const canAdvance = [
										"booked",
										"arrived",
										"ongoing"
									].includes(b.status);
									const canRevert = !!prevStatus[b.status];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-rule hover:bg-warm-1/60 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 font-semibold",
												children: [b.token_number, b.is_walkin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-1 rounded bg-amber/15 px-1 text-[10px] font-bold text-amber",
													children: "W"
												})]
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
												children: slot?.name ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex flex-wrap justify-end gap-1",
													children: [
														canRevert && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setRevert({
																booking: b,
																to: prevStatus[b.status]
															}),
															"aria-label": `Revert token ${b.token_number}`,
															title: `Back to ${prevStatus[b.status]}`,
															className: "rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
																className: "h-4 w-4",
																"aria-hidden": "true"
															})
														}),
														canAdvance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => advance.mutate(b),
															"aria-label": `Advance token ${b.token_number}`,
															title: `Mark ${nextStatus[b.status]}`,
															className: "rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
																className: "h-4 w-4",
																"aria-hidden": "true"
															})
														}),
														canAdvance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setReschedule({
																booking: b,
																date: b.date,
																slot_id: b.slot_id,
																service_id: b.service_id ?? ""
															}),
															"aria-label": `Reschedule token ${b.token_number}`,
															title: "Reschedule",
															className: "rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
																className: "h-4 w-4",
																"aria-hidden": "true"
															})
														}),
														canAdvance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setCancelConfirm(b),
															"aria-label": `Cancel token ${b.token_number}`,
															title: "Cancel",
															className: "rounded-none border border-rule p-1.5 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
																className: "h-4 w-4",
																"aria-hidden": "true"
															})
														})
													]
												})
											})
										]
									}, b.id);
								})] })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2 md:hidden",
						children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border border-rule bg-paper px-3 py-8 text-center text-sm text-warm-5",
							children: "No bookings"
						}), filtered.map((b) => {
							const svc = services?.find((s) => s.id === b.service_id)?.name ?? "—";
							const slot = slots?.find((s) => s.id === b.slot_id);
							const canAdvance = [
								"booked",
								"arrived",
								"ongoing"
							].includes(b.status);
							const canRevert = !!prevStatus[b.status];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border border-rule bg-paper p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-base font-bold",
														children: ["#", b.token_number]
													}),
													b.is_walkin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded bg-amber/15 px-1 text-[10px] font-bold text-amber",
														children: "W"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 truncate text-sm font-medium",
												children: b.client_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-warm-5",
												children: b.client_phone
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 truncate text-xs text-warm-5",
												children: [svc, slot?.name ? ` · ${slot.name}` : ""]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 flex-wrap justify-end gap-1",
										children: [
											canRevert && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setRevert({
													booking: b,
													to: prevStatus[b.status]
												}),
												"aria-label": `Revert token ${b.token_number}`,
												title: `Back to ${prevStatus[b.status]}`,
												className: "rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												})
											}),
											canAdvance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => advance.mutate(b),
												"aria-label": `Advance token ${b.token_number}`,
												title: `Mark ${nextStatus[b.status]}`,
												className: "rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												})
											}),
											canAdvance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setReschedule({
													booking: b,
													date: b.date,
													slot_id: b.slot_id,
													service_id: b.service_id ?? ""
												}),
												"aria-label": `Reschedule token ${b.token_number}`,
												title: "Reschedule",
												className: "rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												})
											}),
											canAdvance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setCancelConfirm(b),
												"aria-label": `Cancel token ${b.token_number}`,
												title: "Cancel",
												className: "rounded-none border border-rule p-2 text-warm-5 hover:border-ink hover:bg-ink hover:text-paper transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												})
											})
										]
									})]
								})
							}, b.id);
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!reschedule,
				onOpenChange: (o) => {
					if (!o) setReschedule(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-sm",
					children: reschedule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Reschedule token ", reschedule.booking.token_number] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							reschedule.booking.client_name,
							" · ",
							reschedule.booking.client_phone
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									"aria-label": "New date",
									value: reschedule.date,
									min: format(today, "yyyy-MM-dd"),
									max: format(addDays(today, 45), "yyyy-MM-dd"),
									onChange: (e) => setReschedule({
										...reschedule,
										date: e.target.value,
										slot_id: ""
									}),
									className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Service",
									value: reschedule.service_id,
									onChange: (e) => setReschedule({
										...reschedule,
										service_id: e.target.value
									}),
									className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Service (optional)"
									}), (services ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.name
									}, s.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Slot",
									value: reschedule.slot_id,
									onChange: (e) => setReschedule({
										...reschedule,
										slot_id: e.target.value
									}),
									className: "w-full rounded-none border border-rule bg-paper text-ink px-2 py-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Choose slot"
									}), (slots ?? []).filter((s) => s.day_of_week === (/* @__PURE__ */ new Date(reschedule.date + "T00:00:00")).getDay() && !isSlotPast(reschedule.date, s.start_time)).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: s.id,
										children: [s.name, s.start_time ? ` (${String(s.start_time).slice(0, 5)})` : ""]
									}, s.id))]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setReschedule(null),
								className: "rounded-full border border-rule px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: !reschedule.slot_id || doReschedule.isPending,
								onClick: () => doReschedule.mutate(),
								className: "rounded-full bg-ink px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40",
								children: doReschedule.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									className: "h-4 w-4 animate-spin",
									"aria-hidden": "true"
								}) : "Confirm"
							})]
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!revert,
				onOpenChange: (o) => {
					if (!o) setRevert(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent, { children: revert && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Revert status?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Token ",
					revert.booking.token_number,
					" · ",
					revert.booking.client_name,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Change status from ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: revert.booking.status.replace("_", " ")
					}),
					" back to ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: revert.to.replace("_", " ")
					}),
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: revertMut.isPending,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					disabled: revertMut.isPending,
					onClick: (e) => {
						e.preventDefault();
						revertMut.mutate(revert);
					},
					children: revertMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-4 w-4 animate-spin",
						"aria-hidden": "true"
					}) : "Revert"
				})] })] }) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!cancelConfirm,
				onOpenChange: (o) => {
					if (!o) setCancelConfirm(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent, { children: cancelConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Cancel booking?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Token ",
					cancelConfirm.token_number,
					" · ",
					cancelConfirm.client_name,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"This will mark the booking as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "cancelled"
					}),
					" and cannot be undone from here."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: cancel.isPending,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					disabled: cancel.isPending,
					onClick: (e) => {
						e.preventDefault();
						cancel.mutate(cancelConfirm.id);
					},
					children: cancel.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-4 w-4 animate-spin",
						"aria-hidden": "true"
					}) : "Confirm Cancel"
				})] })] }) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
				booking: paying,
				currency: (impersonatedBiz?.currency ?? ownBiz?.currency) || "INR",
				onClose: () => setPaying(null),
				onDone: () => {
					qc.invalidateQueries({ queryKey: ["mg-bookings"] });
					qc.invalidateQueries({ queryKey: ["mg-today-all"] });
					setPaying(null);
				}
			})
		]
	});
}
function Card({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-rule bg-paper p-4 transition-colors hover:bg-warm-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-marker",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-display text-4xl tracking-[-0.02em] text-ink",
			children: value
		})]
	});
}
//#endregion
export { ManagementPage as component };
