import { r as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-B4tl1Mhw.mjs";
import { C as ChevronRight, O as CalendarDays, S as CircleCheck, _ as LoaderCircle, w as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format, s as addDays } from "../_libs/date-fns.mjs";
import { t as Route } from "./book._slug-D9FVdcSJ.mjs";
import { t as computePlanStatus } from "./plan-3nosrRGP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._slug-Dbqb7dUV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getPublicBookingData = createServerFn({ method: "GET" }).inputValidator((raw) => objectType({ slug: stringType() }).parse(raw)).handler(createSsrRpc("e15ba3a9af73ee4a2029aa9f88f52741c69ca7a68e136d4f097b9ae24f1f44db"));
var getSlotAvailability = createServerFn({ method: "GET" }).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	date: stringType()
}).parse(raw)).handler(createSsrRpc("3ccd4792fda377ca78b050571f7d6f896098d4fa3936f2d9c0bef8d55c466848"));
var createPublicBooking = createServerFn({ method: "POST" }).inputValidator((raw) => objectType({
	slug: stringType(),
	service_id: stringType().uuid().nullable(),
	slot_id: stringType().uuid(),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	client_name: stringType().min(1).max(120),
	client_phone: stringType().min(4).max(40),
	client_email: stringType().email().max(200).optional().nullable()
}).parse(raw)).handler(createSsrRpc("a7a4f1db48be91055373e7006f2d7e6f0f7a3173698533b6bbd7b8ee4e522cad"));
function BookPage() {
	const { slug } = Route.useParams();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const getData = useServerFn(getPublicBookingData);
	const getAvail = useServerFn(getSlotAvailability);
	const create = useServerFn(createPublicBooking);
	const today = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);
	const [date, setDate] = (0, import_react.useState)(today);
	const [serviceId, setServiceId] = (0, import_react.useState)(null);
	const [slotId, setSlotId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [confirmed, setConfirmed] = (0, import_react.useState)(null);
	const [pageStart, setPageStart] = (0, import_react.useState)(0);
	const PAGE_SIZE = 16;
	const TOTAL_DAYS = 46;
	const { data, isLoading } = useQuery({
		queryKey: ["book", slug],
		queryFn: () => getData({ data: { slug } })
	});
	const dateStr = format(date, "yyyy-MM-dd");
	const dow = date.getDay();
	const { data: availability } = useQuery({
		queryKey: [
			"availability",
			data?.business?.id,
			dateStr
		],
		enabled: !!data?.business?.id,
		queryFn: () => getAvail({ data: {
			business_id: data.business.id,
			date: dateStr
		} })
	});
	const submit = useMutation({
		mutationFn: async () => create({ data: {
			slug,
			service_id: serviceId,
			slot_id: slotId,
			date: dateStr,
			client_name: name.trim(),
			client_phone: phone.trim(),
			client_email: email.trim() ? email.trim() : null
		} }),
		onSuccess: (b) => {
			setConfirmed({
				token_number: b.token_number,
				name: b.client_name,
				phone: b.client_phone,
				email: b.client_email
			});
			qc.invalidateQueries({ queryKey: ["availability"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-warm-4" })
	});
	if (!data?.business) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "section-marker",
			children: "404 — Not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-4xl tracking-[-0.02em]",
			children: "This booking page doesn't exist."
		})] })
	});
	if (computePlanStatus(data.business).state === "locked") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Temporarily paused"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl tracking-[-0.02em]",
					children: data.business.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-warm-5",
					children: "Contact us to continue your service."
				})
			]
		})
	});
	if (confirmed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md border border-rule bg-paper p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
					className: "mx-auto h-8 w-8 text-amber",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker mt-6",
					children: "Confirmed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl tracking-[-0.02em]",
					children: "You're booked."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-warm-5",
					children: "Please arrive on time. Save this token number."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 border-y border-rule py-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "section-marker",
						children: "Token"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-7xl leading-none tracking-[-0.03em]",
						children: confirmed.token_number
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 space-y-2 text-left text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Name",
							value: confirmed.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: confirmed.phone
						}),
						confirmed.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Email",
							value: confirmed.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Date",
							value: format(date, "PPP")
						})
					]
				}),
				confirmed.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-warm-4",
					children: "A confirmation with your token has been sent to your email."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setConfirmed(null);
						setName("");
						setPhone("");
						setEmail("");
						setSlotId(null);
						setServiceId(null);
						navigate({
							to: "/book/$slug",
							params: { slug }
						});
					},
					className: "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rule px-4 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper",
					children: "Book another"
				})
			]
		})
	});
	const nowMs = Date.now();
	const isToday = date.toDateString() === today.toDateString();
	const availableSlots = (data.slots ?? []).filter((s) => {
		const days = Array.isArray(s.days_of_week) ? s.days_of_week : [];
		if (days.length > 0 && !days.includes(dow)) return false;
		if (isToday && s.start_time) {
			const [hh, mm] = String(s.start_time).split(":").map((x) => parseInt(x, 10) || 0);
			const slotStart = /* @__PURE__ */ new Date();
			slotStart.setHours(hh, mm, 0, 0);
			if (slotStart.getTime() <= nowMs) return false;
		}
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-rule bg-paper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Book with"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl tracking-[-0.02em] md:text-5xl",
					children: data.business.name
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-marker",
						children: "01 — Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-2 flex items-center gap-2 font-display text-3xl tracking-[-0.02em]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-5 w-5 text-warm-4" }), " Pick a date"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 sm:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPageStart((p) => Math.max(0, p - PAGE_SIZE)),
							disabled: pageStart === 0,
							"aria-label": "Previous dates",
							className: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-rule text-warm-5 disabled:opacity-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPageStart((p) => Math.min(TOTAL_DAYS - PAGE_SIZE, p + PAGE_SIZE)),
							disabled: pageStart + PAGE_SIZE >= TOTAL_DAYS,
							"aria-label": "Next dates",
							className: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-rule text-warm-5 disabled:opacity-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-5",
					children: Array.from({ length: TOTAL_DAYS }).map((_, i) => {
						const d = addDays(today, i);
						const active = d.toDateString() === date.toDateString();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setDate(d);
								setSlotId(null);
							},
							className: `${i >= pageStart && i < pageStart + PAGE_SIZE ? "" : "hidden sm:block"} p-3 text-center text-xs transition-colors ${active ? "bg-ink text-paper" : "bg-paper hover:bg-warm-1"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "section-marker",
									style: {
										color: active ? "var(--paper)" : void 0,
										opacity: active ? .7 : 1
									},
									children: format(d, "EEE")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-display text-lg leading-none",
									children: format(d, "d")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] uppercase tracking-wider opacity-60",
									children: format(d, "MMM")
								})
							]
						}, i);
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-marker",
						children: "02 — Details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl tracking-[-0.02em]",
						children: "Your details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "section-marker",
									children: "Service"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: serviceId ?? "",
									onChange: (e) => setServiceId(e.target.value || null),
									className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Choose a service…"
									}), (data.services ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.name
									}, s.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "section-marker",
								children: "Slot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 divide-y divide-rule border-y border-rule",
								children: [availableSlots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-6 text-sm text-warm-5",
									children: "No slots on this day."
								}), availableSlots.map((s) => {
									const full = (availability?.find((a) => a.slot_id === s.id))?.full ?? false;
									const active = slotId === s.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: full,
										onClick: () => setSlotId(s.id),
										className: `flex w-full items-center justify-between gap-4 py-4 text-left transition-colors ${full ? "cursor-not-allowed text-warm-4" : active ? "text-ink" : "text-ink hover:opacity-70"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-lg",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-xs text-warm-5",
											children: [
												s.start_time ? String(s.start_time).slice(0, 5) : "—",
												" – ",
												s.end_time ? String(s.end_time).slice(0, 5) : "—"
											]
										})] }), full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-[0.14em] text-warm-4",
											children: "Full"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${active ? "border-ink bg-ink text-paper" : "border-rule text-warm-4"}`,
											children: active ? "✓" : "→"
										})]
									}, s.id);
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "section-marker",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "section-marker",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "tel",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "section-marker",
									children: ["Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "normal-case text-warm-4",
										children: "(optional — we'll email your token)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									autoComplete: "email",
									placeholder: "you@example.com",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base text-ink focus:border-ink focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "section-marker",
										children: "03 — Confirm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => submit.mutate(),
										disabled: !slotId || !name || !phone || submit.isPending,
										className: "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40",
										children: [submit.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Confirm booking"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-warm-4",
										children: "We'll hold your token the moment you confirm."
									})
								]
							})
						]
					})
				] })]
			})
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between border-b border-rule pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "section-marker",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-sm text-ink",
			children: value
		})]
	});
}
//#endregion
export { BookPage as component };
