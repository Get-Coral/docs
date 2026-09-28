import type { APIRoute } from "astro";
import { MARKETING_URL, GITHUB_ORG_URL, SITE_URL } from "../../lib/site";
import { marketingUrl, modules, repoUrl } from "../../lib/modules";

/**
 * RFC 9727 linkset. getcoral.dev already publishes one naming this host as its
 * `service-doc`; until now nothing here acknowledged the relationship, so the
 * link was one-directional.
 */
export const GET: APIRoute = () => {
	const catalog = {
		linkset: [
			{
				anchor: SITE_URL,
				describedby: [
					{ href: `${SITE_URL}/llms.txt`, type: "text/plain" },
					{ href: `${SITE_URL}/llms-full.txt`, type: "text/plain" },
					{ href: GITHUB_ORG_URL },
				],
				related: [{ href: MARKETING_URL }],
				item: modules.map((module) => ({
					href: `${SITE_URL}/modules/${module.slug}/`,
					title: `${module.name} — ${module.summary}`,
				})),
			},
			{
				anchor: MARKETING_URL,
				"service-doc": [{ href: SITE_URL }],
				item: modules.map((module) => ({
					href: marketingUrl(module),
					title: module.name,
				})),
			},
			...modules.map((module) => ({
				anchor: `${SITE_URL}/modules/${module.slug}/`,
				describedby: [{ href: repoUrl(module) }],
				related: [{ href: marketingUrl(module) }],
			})),
		],
	};

	return new Response(JSON.stringify(catalog), {
		headers: { "Content-Type": "application/linkset+json" },
	});
};
