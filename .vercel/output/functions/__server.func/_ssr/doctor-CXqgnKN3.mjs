import { r as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-B4tl1Mhw.mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { C as ChevronRight, D as Calendar, _ as LoaderCircle, m as LogOut, r as TrendingUp, w as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as Forbidden } from "./staff-nav-PtY9WxNB.mjs";
import { n as formatMoney } from "./currency-2G69NBBN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as endOfMonth, i as startOfMonth, n as format, o as startOfWeek, r as endOfWeek, s as addDays, t as parseISO } from "../_libs/date-fns.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as markBookingCompleted, t as Dialog } from "./dialog-DM5mPuDe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor-CXqgnKN3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DoctorPage() {
	const { profile, signOut } = useAuth();
	const navigate = useNavigate();
	const [section, setSection] = (0, import_react.useState)("today");
	if (profile && profile.role !== "doctor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
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
							children: "Doctor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: profile?.display_name ?? profile?.email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "space-y-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSection("today"),
							className: `flex w-full items-center gap-2 rounded-md px-3 py-2 text-left ${section === "today" ? "bg-accent" : "hover:bg-accent/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }), " Queue"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSection("earnings"),
							className: `flex w-full items-center gap-2 rounded-md px-3 py-2 text-left ${section === "earnings" ? "bg-accent" : "hover:bg-accent/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }), " Earnings"]
						})]
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:hidden mb-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSection("today"),
							className: `rounded-md border px-3 py-1.5 text-sm ${section === "today" ? "bg-primary text-primary-foreground" : ""}`,
							children: "Queue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSection("earnings"),
							className: `rounded-md border px-3 py-1.5 text-sm ${section === "earnings" ? "bg-primary text-primary-foreground" : ""}`,
							children: "Earnings"
						})]
					}),
					section === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueSection, {}),
					section === "earnings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EarningsSection, {})
				]
			})]
		})
	});
}
function useBusiness() {
	const { profile } = useAuth();
	return useQuery({
		queryKey: ["doctor-biz", profile?.business_id],
		enabled: !!profile?.business_id,
		queryFn: async () => {
			const { data } = await supabase.from("businesses").select("id, name, slug, currency").eq("id", profile.business_id).maybeSingle();
			return data;
		}
	});
}
function QueueSection() {
	const { data: biz } = useBusiness();
	const [dateStr, setDateStr] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const qc = useQueryClient();
	const { data: bookings, isLoading } = useQuery({
		queryKey: [
			"doctor-bookings",
			biz?.id,
			dateStr
		],
		enabled: !!biz?.id,
		queryFn: async () => {
			const { data } = await supabase.from("bookings").select("id, business_id, slot_id, service_id, date, token_number, client_name, client_phone, status, is_walkin, amount_paid, payment_method, notes").eq("business_id", biz.id).eq("date", dateStr).order("token_number");
			return data ?? [];
		}
	});
	const { data: slots } = useQuery({
		queryKey: ["doctor-slots", biz?.id],
		enabled: !!biz?.id,
		queryFn: async () => {
			const { data } = await supabase.from("slots").select("id, name, start_time, end_time, day_of_week").eq("business_id", biz.id);
			return data ?? [];
		}
	});
	const { data: services } = useQuery({
		queryKey: ["doctor-services", biz?.id],
		enabled: !!biz?.id,
		queryFn: async () => {
			const { data } = await supabase.from("services").select("id, name").eq("business_id", biz.id);
			return data ?? [];
		}
	});
	const stats = (0, import_react.useMemo)(() => {
		const b = bookings ?? [];
		return {
			total: b.length,
			completed: b.filter((x) => x.status === "completed").length,
			pending: b.filter((x) => x.status === "booked" || x.status === "arrived" || x.status === "ongoing").length,
			no_show: b.filter((x) => x.status === "no_show").length,
			cancelled: b.filter((x) => x.status === "cancelled").length,
			walkins: b.filter((x) => x.is_walkin).length,
			earnings: b.filter((x) => x.status === "completed").reduce((s, x) => s + Number(x.amount_paid ?? 0), 0)
		};
	}, [bookings]);
	const [paying, setPaying] = (0, import_react.useState)(null);
	const updateStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["doctor-bookings"] }),
		onError: (e) => toast.error(e.message)
	});
	const slotName = (id) => slots?.find((s) => s.id === id)?.name ?? "—";
	const serviceName = (id) => services?.find((s) => s.id === id)?.name ?? "—";
	const shiftDay = (n) => {
		setDateStr(format(addDays(/* @__PURE__ */ new Date(dateStr + "T00:00:00"), n), "yyyy-MM-dd"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-[-0.02em]",
					children: biz?.name ?? "Clinic"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => shiftDay(-1),
							className: "rounded-md border border-rule px-2 py-1.5",
							"aria-label": "Previous day",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: dateStr,
							onChange: (e) => setDateStr(e.target.value),
							className: "rounded-none border border-rule bg-paper px-3 py-1.5 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => shiftDay(1),
							className: "rounded-md border border-rule px-2 py-1.5",
							"aria-label": "Next day",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setDateStr(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")),
							className: "ml-1 rounded-md border border-rule px-3 py-1.5 text-sm",
							children: "Today"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Bookings",
						value: stats.total
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Completed",
						value: stats.completed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pending",
						value: stats.pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "No-show",
						value: stats.no_show
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cancelled",
						value: stats.cancelled
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Earnings",
						value: formatMoney(stats.earnings, biz?.currency ?? "INR")
					})
				]
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
								children: "#"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left",
								children: "Patient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left",
								children: "Slot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left",
								children: "Service"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left",
								children: "Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(bookings ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium",
								children: b.token_number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: b.client_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-warm-5",
									children: b.client_phone
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: slotName(b.slot_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: serviceName(b.service_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 capitalize",
								children: b.status.replace("_", " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: b.amount_paid != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									formatMoney(Number(b.amount_paid), biz?.currency ?? "INR"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-warm-5",
										children: ["· ", b.payment_method]
									})
								] }) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-right",
								children: [
									b.status !== "completed" && b.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setPaying(b),
										className: "mr-1 rounded-md bg-ink px-2 py-1 text-xs text-paper",
										children: "Complete + payment"
									}),
									b.status === "completed" && b.amount_paid == null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setPaying(b),
										className: "mr-1 rounded-md border px-2 py-1 text-xs",
										children: "Add payment"
									}),
									b.status !== "no_show" && b.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => updateStatus.mutate({
											id: b.id,
											status: "no_show"
										}),
										className: "mr-1 rounded-md border px-2 py-1 text-xs",
										children: "No-show"
									}),
									b.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											if (confirm("Cancel this booking?")) updateStatus.mutate({
												id: b.id,
												status: "cancelled"
											});
										},
										className: "rounded-md border px-2 py-1 text-xs text-destructive",
										children: "Cancel"
									})
								]
							})
						]
					}, b.id)), (!bookings || bookings.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "px-3 py-8 text-center text-warm-5",
						children: isLoading ? "Loading…" : "No bookings for this day."
					}) })] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
				booking: paying,
				currency: biz?.currency ?? "INR",
				onClose: () => setPaying(null),
				onDone: () => {
					qc.invalidateQueries({ queryKey: ["doctor-bookings"] });
					setPaying(null);
				}
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-rule bg-paper p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wider text-warm-5",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-2xl",
			children: value
		})]
	});
}
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
function EarningsSection() {
	const { data: biz } = useBusiness();
	const [preset, setPreset] = (0, import_react.useState)("week");
	const today = /* @__PURE__ */ new Date();
	const [from, setFrom] = (0, import_react.useState)(format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"));
	const [to, setTo] = (0, import_react.useState)(format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"));
	const applyPreset = (p) => {
		setPreset(p);
		const now = /* @__PURE__ */ new Date();
		if (p === "today") {
			const d = format(now, "yyyy-MM-dd");
			setFrom(d);
			setTo(d);
		} else if (p === "week") {
			setFrom(format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"));
			setTo(format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"));
		} else if (p === "month") {
			setFrom(format(startOfMonth(now), "yyyy-MM-dd"));
			setTo(format(endOfMonth(now), "yyyy-MM-dd"));
		}
	};
	const { data: rows } = useQuery({
		queryKey: [
			"doctor-earnings",
			biz?.id,
			from,
			to
		],
		enabled: !!biz?.id,
		queryFn: async () => {
			const { data } = await supabase.from("bookings").select("id, date, service_id, amount_paid, payment_method, status").eq("business_id", biz.id).eq("status", "completed").gte("date", from).lte("date", to);
			return data ?? [];
		}
	});
	const { data: services } = useQuery({
		queryKey: ["doctor-services-earn", biz?.id],
		enabled: !!biz?.id,
		queryFn: async () => (await supabase.from("services").select("id, name").eq("business_id", biz.id)).data ?? []
	});
	const totals = (0, import_react.useMemo)(() => {
		const r = rows ?? [];
		const gross = r.reduce((s, x) => s + Number(x.amount_paid ?? 0), 0);
		const count = r.length;
		const avg = count ? gross / count : 0;
		const byMethod = {};
		const byService = {};
		const byDate = {};
		r.forEach((x) => {
			const m = x.payment_method || "other";
			byMethod[m] = (byMethod[m] ?? 0) + Number(x.amount_paid ?? 0);
			const sid = x.service_id ?? "unassigned";
			byService[sid] = (byService[sid] ?? 0) + Number(x.amount_paid ?? 0);
			byDate[x.date] = (byDate[x.date] ?? 0) + Number(x.amount_paid ?? 0);
		});
		return {
			gross,
			count,
			avg,
			byMethod,
			byService,
			byDate
		};
	}, [rows]);
	const dateKeys = Object.keys(totals.byDate).sort();
	const maxDaily = Math.max(1, ...Object.values(totals.byDate));
	const cur = biz?.currency ?? "INR";
	const serviceName = (id) => id === "unassigned" ? "Unassigned" : services?.find((s) => s.id === id)?.name ?? "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-[-0.02em]",
					children: "Earnings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex flex-wrap items-center gap-1",
					children: [[
						"today",
						"week",
						"month",
						"custom"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => applyPreset(p),
						className: `rounded-md px-3 py-1.5 text-sm capitalize ${preset === p ? "bg-ink text-paper" : "border border-rule bg-paper"}`,
						children: p
					}, p)), preset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value),
						className: "rounded-none border border-rule bg-paper px-2 py-1.5 text-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value),
						className: "rounded-none border border-rule bg-paper px-2 py-1.5 text-sm"
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Gross",
						value: formatMoney(totals.gross, cur)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Completed bookings",
						value: totals.count
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Average ticket",
						value: formatMoney(totals.avg, cur)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-rule bg-paper p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-semibold",
					children: "Daily earnings"
				}), dateKeys.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-warm-5",
					children: "No earnings in this range."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: dateKeys.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-24 shrink-0 text-warm-5",
								children: format(parseISO(d), "EEE, MMM d")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 bg-warm-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-4 bg-ink",
									style: { width: `${totals.byDate[d] / maxDaily * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-28 text-right tabular-nums",
								children: formatMoney(totals.byDate[d], cur)
							})
						]
					}, d))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-rule bg-paper p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold",
						children: "By payment method"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1 text-sm",
						children: [Object.entries(totals.byMethod).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatMoney(v, cur)
							})]
						}, k)), Object.keys(totals.byMethod).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-warm-5",
							children: "—"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-rule bg-paper p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold",
						children: "By service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1 text-sm",
						children: [Object.entries(totals.byService).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: serviceName(k) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatMoney(v, cur)
							})]
						}, k)), Object.keys(totals.byService).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-warm-5",
							children: "—"
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { PaymentDialog, DoctorPage as component };
