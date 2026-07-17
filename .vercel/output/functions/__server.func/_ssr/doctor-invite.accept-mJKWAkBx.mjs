import { r as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-Dm9IyzOR.mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { _ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor-invite.accept-mJKWAkBx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AcceptInvitePage() {
	const { token } = useSearch({ from: "/doctor-invite/accept" });
	const { session, refresh } = useAuth();
	const navigate = useNavigate();
	const [invite, setInvite] = (0, import_react.useState)(null);
	const [loadErr, setLoadErr] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!token) {
			setLoading(false);
			setLoadErr("Missing invitation token.");
			return;
		}
		(async () => {
			const { data, error } = await supabase.rpc("get_doctor_invite_by_token", { _token: token });
			if (error) setLoadErr(error.message);
			else if (!data || Array.isArray(data) && data.length === 0) setLoadErr("Invitation not found.");
			else {
				const row = Array.isArray(data) ? data[0] : data;
				setInvite(row);
				if (row.status !== "pending") setLoadErr(`This invitation is ${row.status}.`);
				else if (new Date(row.expires_at).getTime() < Date.now()) setLoadErr("This invitation has expired.");
			}
			setLoading(false);
		})();
	}, [token]);
	const emailMatches = !!(session && invite && session.user.email?.toLowerCase() === invite.email.toLowerCase());
	const handleSignUp = async () => {
		if (!invite || !token) return;
		setSubmitting(true);
		try {
			const { error: signErr } = await supabase.auth.signUp({
				email: invite.email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/doctor-invite/accept?token=${token}`,
					data: { display_name: displayName }
				}
			});
			if (signErr) if (/already|registered/i.test(signErr.message)) {
				const { error: siErr } = await supabase.auth.signInWithPassword({
					email: invite.email,
					password
				});
				if (siErr) throw siErr;
			} else throw signErr;
			const { data: s } = await supabase.auth.getSession();
			if (s.session) await acceptInvite();
			else toast.success("Check your inbox to confirm your email, then return to this page.");
		} catch (e) {
			toast.error(e?.message ?? "Sign up failed");
		} finally {
			setSubmitting(false);
		}
	};
	const acceptInvite = async () => {
		if (!token) return;
		setSubmitting(true);
		try {
			const { error } = await supabase.rpc("accept_doctor_invite", {
				_token: token,
				_display_name: displayName || ""
			});
			if (error) throw error;
			await refresh();
			toast.success("Welcome!");
			navigate({ to: "/doctor" });
		} catch (e) {
			toast.error(e?.message ?? "Failed to accept invitation");
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-warm-5" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg border border-rule bg-paper p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-marker",
					children: "Doctor invitation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl tracking-[-0.02em]",
					children: invite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Join ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-amber",
						children: invite.business_name
					})] }) : "Invitation"
				}),
				loadErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 border border-rule bg-warm-1 p-4 text-sm text-warm-5",
					children: loadErr
				}),
				invite && !loadErr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-warm-5",
						children: [
							"You've been invited as a doctor at ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: invite.business_name }),
							". This invitation is tied to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: invite.email }),
							"."
						]
					}),
					session && !emailMatches && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border border-rule bg-warm-1 p-4 text-sm",
						children: [
							"You're signed in as ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session.user.email }),
							", which doesn't match the invite address.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "underline",
								onClick: async () => {
									await supabase.auth.signOut();
								},
								children: "Sign out"
							}),
							" and try again."
						]
					}),
					session && emailMatches && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider text-warm-5",
								children: "Your name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								className: "mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm",
								placeholder: "Dr. Jane Doe"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: acceptInvite,
							disabled: submitting,
							className: "inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50",
							children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Accept & continue"]
						})]
					}),
					!session && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-warm-5",
								children: "Set your name and password to activate your account."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase tracking-wider text-warm-5",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: invite.email,
									disabled: true,
									className: "mt-1 w-full rounded-none border border-rule bg-warm-1 px-3 py-2 text-sm text-warm-5"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase tracking-wider text-warm-5",
									children: "Your name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: displayName,
									onChange: (e) => setDisplayName(e.target.value),
									className: "mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm",
									placeholder: "Dr. Jane Doe"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase tracking-wider text-warm-5",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									minLength: 8,
									className: "mt-1 w-full rounded-none border border-rule bg-paper px-3 py-2 text-sm",
									placeholder: "At least 8 characters"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleSignUp,
								disabled: submitting || password.length < 8 || !displayName,
								className: "inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50",
								children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Create account & join"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-warm-5",
								children: [
									"Already have an account? ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										className: "underline",
										children: "Sign in first"
									}),
									", then reopen this invite link."
								]
							})
						]
					})
				] })
			]
		})
	});
}
//#endregion
export { AcceptInvitePage as component };
