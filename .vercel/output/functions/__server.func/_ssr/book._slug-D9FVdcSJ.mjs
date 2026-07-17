import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._slug-D9FVdcSJ.js
var $$splitComponentImporter = () => import("./book._slug-Dbqb7dUV.mjs");
var Route = createFileRoute("/book/$slug")({
	head: ({ params }) => {
		const desc = `Book an appointment online with ${params.slug} on Qfloww — pick a time, confirm your details, and receive a token by SMS or email in seconds.`;
		return { meta: [
			{ title: `Book an appointment — ${params.slug}` },
			{
				name: "description",
				content: desc
			},
			{
				property: "og:title",
				content: `Book an appointment — ${params.slug}`
			},
			{
				property: "og:description",
				content: desc
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
