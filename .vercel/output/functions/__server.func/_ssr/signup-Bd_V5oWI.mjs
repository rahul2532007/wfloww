import { r as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { _ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-Bd_V5oWI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function slugify(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
function SignupPage() {
	const navigate = useNavigate();
	const { profile, loading: authLoading } = useAuth();
	const [form, setForm] = (0, import_react.useState)({
		email: "",
		password: "",
		display_name: "",
		business_name: "",
		slug: "",
		type: "clinic"
	});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [slugTouched, setSlugTouched] = (0, import_react.useState)(false);
	const [sentToEmail, setSentToEmail] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!authLoading && profile) navigate({
			to: "/pending-activation",
			replace: true
		});
	}, [
		profile,
		authLoading,
		navigate
	]);
	async function onSubmit(e) {
		e.preventDefault();
		if (!form.email || !form.password || !form.business_name || !form.slug) return;
		if (!/^[a-z0-9-]{2,40}$/.test(form.slug)) return toast.error("Slug: 2-40 lowercase letters, numbers or dashes");
		if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
		setSubmitting(true);
		const pending = {
			business_name: form.business_name,
			slug: form.slug,
			type: form.type
		};
		try {
			localStorage.setItem(`qfloww:pending-signup:${form.email.trim().toLowerCase()}`, JSON.stringify({
				...pending,
				email: form.email.trim().toLowerCase(),
				display_name: form.display_name || null
			}));
			localStorage.setItem("qfloww:pending-signup:last", JSON.stringify({
				...pending,
				email: form.email.trim().toLowerCase(),
				display_name: form.display_name || null
			}));
		} catch {}
		const { data: authData, error: authErr } = await supabase.auth.signUp({
			email: form.email.trim(),
			password: form.password,
			options: {
				emailRedirectTo: `${window.location.origin}/login`,
				data: {
					display_name: form.display_name,
					pending_business_name: pending.business_name,
					pending_business_slug: pending.slug,
					pending_business_type: pending.type
				}
			}
		});
		if (authErr || !authData.user) {
			setSubmitting(false);
			return toast.error(authErr?.message ?? "Signup failed");
		}
		if (!!!authData.session) {
			setSubmitting(false);
			setSentToEmail(form.email.trim());
			return;
		}
		const uid = authData.user.id;
		await supabase.from("profiles").insert({
			id: uid,
			email: form.email.trim(),
			display_name: form.display_name || null
		});
		const { error: bizErr } = await supabase.from("businesses").insert({
			name: form.business_name,
			slug: form.slug,
			type: form.type,
			owner_user_id: uid,
			is_active: false,
			manual_lock: true
		});
		setSubmitting(false);
		if (bizErr) {
			toast.error(bizErr.message.includes("duplicate") ? "That slug is taken — try another" : bizErr.message);
			return;
		}
		toast.success("Account created. Waiting for activation.");
		navigate({ to: "/pending-activation" });
	}
	if (sentToEmail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-6 pt-24 pb-24 lg:px-10 lg:pt-40 lg:pb-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-rule pt-10 lg:pt-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 lg:grid-cols-12 lg:gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "section-marker",
							children: ["01 — Action required", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-1 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-amber align-middle" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-warm-5",
							children: "A verification link is waiting in your inbox. Your account isn't active until you open it."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl",
								children: ["Check your email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-8 max-w-2xl text-lg text-warm-5",
								children: "We sent a confirmation link to"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 break-all font-display text-2xl tracking-[-0.01em] md:text-3xl",
								children: sentToEmail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12 border-t border-rule pt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-8 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "section-marker",
										children: "Next step"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-base text-ink",
										children: [
											"Open the email from ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Qfloww" }),
											" and click the confirmation link. You cannot sign in before that."
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "section-marker",
										children: "Can't find it?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-base text-warm-5",
										children: [
											"Check your ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink",
												children: "Spam"
											}),
											" or ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink",
												children: "Promotions"
											}),
											" folder. Delivery usually takes under a minute."
										]
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-12 flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90",
									children: "I've confirmed — sign in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSentToEmail(null),
									className: "inline-flex items-center justify-center rounded-full border border-rule px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper",
									children: "Use a different email"
								})]
							})
						]
					})]
				})
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "w-full max-w-md border border-rule bg-paper p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Sign up"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl tracking-[-0.02em]",
					children: "Create your business"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-warm-5",
					children: "One account. One business. Full control."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Your name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.display_name,
								onChange: (e) => setForm({
									...form,
									display_name: e.target.value
								}),
								className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								autoComplete: "email",
								value: form.email,
								onChange: (e) => setForm({
									...form,
									email: e.target.value
								}),
								className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Password (min 8 chars)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								autoComplete: "new-password",
								value: form.password,
								onChange: (e) => setForm({
									...form,
									password: e.target.value
								}),
								className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Business name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.business_name,
								onChange: (e) => {
									const next = {
										...form,
										business_name: e.target.value
									};
									if (!slugTouched) next.slug = slugify(e.target.value);
									setForm(next);
								},
								className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Booking URL slug",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-1 border-b border-rule",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-warm-5",
									children: "/book/"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.slug,
									onChange: (e) => {
										setSlugTouched(true);
										setForm({
											...form,
											slug: e.target.value.toLowerCase()
										});
									},
									className: "w-full bg-transparent py-2 text-base focus:outline-none"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Business type",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.type,
								onChange: (e) => setForm({
									...form,
									type: e.target.value
								}),
								className: "mt-2 w-full border-0 border-b border-rule bg-transparent py-2 text-base focus:border-ink focus:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "clinic",
										children: "Clinic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "salon",
										children: "Salon"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "consulting",
										children: "Consulting"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: submitting,
							className: "inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40",
							children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Create account"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs text-warm-4",
							children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "underline",
								children: "Sign in"
							})]
						})
					]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "section-marker",
			children: label
		}), children]
	});
}
//#endregion
export { SignupPage as component };
