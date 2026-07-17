//#region node_modules/.nitro/vite/services/ssr/assets/plan-3nosrRGP.js
var PLAN_RULES = {
	trial: {
		active: 7,
		grace: 0
	},
	monthly: {
		active: 31,
		grace: 7
	},
	yearly: {
		active: 365,
		grace: 31
	}
};
function computePlanStatus(b, now = /* @__PURE__ */ new Date()) {
	const rules = PLAN_RULES[b.plan];
	let expiry;
	if (b.expires_at) expiry = new Date(b.expires_at);
	else {
		const start = /* @__PURE__ */ new Date(b.plan_start + "T00:00:00");
		expiry = new Date(start);
		expiry.setDate(expiry.getDate() + rules.active);
	}
	const lockout = new Date(expiry);
	lockout.setDate(lockout.getDate() + rules.grace);
	const msPerDay = 1440 * 60 * 1e3;
	const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / msPerDay);
	const daysUntilLockout = Math.ceil((lockout.getTime() - now.getTime()) / msPerDay);
	let state;
	if (b.manual_lock || !b.is_active) state = "locked";
	else if (daysUntilLockout <= 0) state = "locked";
	else if (daysUntilExpiry <= 0) state = "grace";
	else if (daysUntilExpiry <= 5) state = "warning";
	else state = "active";
	return {
		state,
		daysUntilExpiry,
		daysUntilLockout,
		expiryDate: expiry,
		lockoutDate: lockout
	};
}
//#endregion
export { computePlanStatus as t };
