import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B4tl1Mhw.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DzLKseBS.mjs";
import { a as stringType, i as objectType, r as numberType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-BCUmJvgO.js
var adminActivateBusiness = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	duration_days: numberType().int().min(1).max(3650)
}).parse(raw)).handler(createSsrRpc("6d82330c760397fca7f441338bbe069a8b066c60b1bfd197e361727360b72f66"));
var adminSetBusinessLock = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	locked: booleanType()
}).parse(raw)).handler(createSsrRpc("e0cd088c1be81960849e279341ffc71cedc7087b80561287759ea6dd23b2c434"));
var bootstrapAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8b5e87060261a59e92bcd5e92ce4cf6afa0ee8e3737aa66e7c16f0be951897c6"));
var adminSetBusinessCurrency = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	currency: stringType().length(3)
}).parse(raw)).handler(createSsrRpc("6e41b9d407d112cd94464b86723b36191294141d37a4b758a1a7a5ffca42b348"));
var adminInviteDoctor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	business_id: stringType().uuid(),
	email: stringType().email()
}).parse(raw)).handler(createSsrRpc("da976b1246e9c440b101da848ade6b5543fdc4207a242d41cb4acb500cabfbf7"));
var adminRevokeDoctorInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({ invite_id: stringType().uuid() }).parse(raw)).handler(createSsrRpc("f1155a703592c3ca691a32705b3e6e95ca3acc0c89e3dd78f8da82a8a988f698"));
var adminRemoveDoctor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => objectType({
	user_id: stringType().uuid(),
	business_id: stringType().uuid()
}).parse(raw)).handler(createSsrRpc("6423dcdeacad7b43149850ddefbdb8a426713364d29ca74e45c14b99bf6e2962"));
//#endregion
export { adminSetBusinessCurrency as a, adminRevokeDoctorInvite as i, adminInviteDoctor as n, adminSetBusinessLock as o, adminRemoveDoctor as r, bootstrapAdmin as s, adminActivateBusiness as t };
