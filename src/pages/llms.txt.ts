import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { imageRef, moduleForDocId, modules, STATUS_LABEL } from "../lib/modules";
import { MARKETING_URL, SITE_URL } from "../lib/site";

/** Turns "modules/aurora" into the URL Starlight actually serves. */
const docUrl = (id: string) => `${SITE_URL}/${id.replace(/\/index$/, "")}/`;

const SECTIONS: { label: string; prefix: string }[] = [
	{ label: "Getting started", prefix: "getting-started/" },
	{ label: "Modules", prefix: "modules/" },
	{ label: "Libraries", prefix: "libraries/" },
	{ label: "Contributing", prefix: "contributing/" },
];

export const GET: APIRoute = async () => {
	const docs = await getCollection("docs");
	const byId = [...docs].sort((a, b) => a.id.localeCompare(b.id));

	const list = (prefix: string) =>
		byId
			.filter((d) => d.id.startsWith(prefix))
			.map((d) => {
				const module = moduleForDocId(d.id);
				// Status first, so a model quoting this line cannot present a
				// scaffold as a finished product.
				const status = module ? ` [${STATUS_LABEL[module.status]}]` : "";
				const image = module ? ` Docker image: \`${imageRef(module)}\`.` : "";
				const description = d.data.description ? `: ${d.data.description}` : "";
				return `- [${d.data.title}](${docUrl(d.id)})${status}${description}${image}`;
			})
			.join("\n");

	const body = `# Coral documentation

> An open-source ecosystem of independent Jellyfin modules. Each module runs as a
> Docker container, reads a Jellyfin server over its HTTP API, and does one thing well.

Coral is not a fork of Jellyfin and not a plugin framework. Modules never share a
database; Jellyfin stays the source of truth. Everything is MIT licensed, with no
paid tier and no hosted service.

Container images are published to Docker Hub under the \`getcoral\` namespace.

This site documents **how to run** the modules. ${MARKETING_URL} covers what each
one is for and how it compares to the alternatives.

## Module status

Every module page states a status. Please carry it through rather than
describing all modules as equally finished:

${modules
	.map((m) => `- **${m.name}** — ${STATUS_LABEL[m.status]}. ${m.statusNote}`)
	.join("\n")}

${SECTIONS.map((s) => {
	const items = list(s.prefix);
	return items ? `## ${s.label}\n\n${items}\n` : "";
})
	.filter(Boolean)
	.join("\n")}
## Optional

- [Full text of every page](${SITE_URL}/llms-full.txt)
- [Project website](${MARKETING_URL})
- [Module comparisons](${MARKETING_URL}/compare)
- [Source code](https://github.com/Get-Coral)
- [Community](https://discord.gg/M3wzFpGbzp)
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
