//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DXULLt-1.js
var manifest = {
	"06741bfcf006bd584dd50d23babe8e1e9907056b448d0e39f1908004e8ea8603": {
		functionName: "setBookingPayment_createServerFn_handler",
		importer: () => import("./_ssr/doctor.functions-DsaR73XP.mjs")
	},
	"1c6feb2d4374aa11a2ab69a31db8e9192ca6c81d8ef539060e5df5b40e6e0857": {
		functionName: "markBookingCompleted_createServerFn_handler",
		importer: () => import("./_ssr/doctor.functions-DsaR73XP.mjs")
	},
	"1ff8c2a3981a953806fe38ae408f8b54538922945e61317a5c8b1121a7b00d55": {
		functionName: "doctorBusinessInfo_createServerFn_handler",
		importer: () => import("./_ssr/doctor.functions-DsaR73XP.mjs")
	},
	"3ccd4792fda377ca78b050571f7d6f896098d4fa3936f2d9c0bef8d55c466848": {
		functionName: "getSlotAvailability_createServerFn_handler",
		importer: () => import("./_ssr/booking.functions-DT9aCuC9.mjs")
	},
	"6423dcdeacad7b43149850ddefbdb8a426713364d29ca74e45c14b99bf6e2962": {
		functionName: "adminRemoveDoctor_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	},
	"6d82330c760397fca7f441338bbe069a8b066c60b1bfd197e361727360b72f66": {
		functionName: "adminActivateBusiness_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	},
	"6e41b9d407d112cd94464b86723b36191294141d37a4b758a1a7a5ffca42b348": {
		functionName: "adminSetBusinessCurrency_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	},
	"8b5e87060261a59e92bcd5e92ce4cf6afa0ee8e3737aa66e7c16f0be951897c6": {
		functionName: "bootstrapAdmin_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	},
	"a7a4f1db48be91055373e7006f2d7e6f0f7a3173698533b6bbd7b8ee4e522cad": {
		functionName: "createPublicBooking_createServerFn_handler",
		importer: () => import("./_ssr/booking.functions-DT9aCuC9.mjs")
	},
	"da976b1246e9c440b101da848ade6b5543fdc4207a242d41cb4acb500cabfbf7": {
		functionName: "adminInviteDoctor_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	},
	"e0cd088c1be81960849e279341ffc71cedc7087b80561287759ea6dd23b2c434": {
		functionName: "adminSetBusinessLock_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	},
	"e15ba3a9af73ee4a2029aa9f88f52741c69ca7a68e136d4f097b9ae24f1f44db": {
		functionName: "getPublicBookingData_createServerFn_handler",
		importer: () => import("./_ssr/booking.functions-DT9aCuC9.mjs")
	},
	"f1155a703592c3ca691a32705b3e6e95ca3acc0c89e3dd78f8da82a8a988f698": {
		functionName: "adminRevokeDoctorInvite_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DW5fsDuK.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
