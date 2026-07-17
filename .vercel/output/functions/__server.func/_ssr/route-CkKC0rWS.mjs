import { r as __toESM } from "../_runtime.mjs";
import { l as useLocation, p as Outlet, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useAuth } from "./use-auth-Czf69ghy.mjs";
import { _ as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CkKC0rWS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthGate() {
	const { loading, profile } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!profile) {
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (profile.role !== "admin" && !profile.business_active) {
			if (location.pathname !== "/pending-activation") navigate({
				to: "/pending-activation",
				replace: true
			});
		}
	}, [
		loading,
		profile,
		navigate,
		location.pathname
	]);
	if (loading || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-warm-5" })
	});
	if (profile.role !== "admin" && !profile.business_active && location.pathname !== "/pending-activation") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-warm-5" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
//#endregion
export { AuthGate as component };
