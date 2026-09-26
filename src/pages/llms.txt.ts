import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const SITE = "https://docs.getcoral.dev";

/** Turns "modules/aurora" into the URL Starlight actually serves. */
const docUrl = (id: string) => `${SITE}/${id.replace(/\/index$/, "")}/`;

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
			.map(
				(d) =>
					`- [${d.data.title}](${docUrl(d.id)})${d.data.description ? `: ${d.data.description}` : ""}`,
			)
			.join("\n");

	const body = `# Coral documentation

> An open-source ecosystem of independent Jellyfin modules. Each module runs as a
> Docker container, reads a Jellyfin server over its HTTP API, and does one thing well.

Coral is not a fork of Jellyfin and not a plugin framework. Modules never share a
database; Jellyfin stays the source of truth. Everything is MIT licensed, with no
paid tier and no hosted service.

Container images are published to Docker Hub under the \`getcoral\` namespace.

${SECTIONS.map((s) => {
	const items = list(s.prefix);
	return items ? `## ${s.label}\n\n${items}\n` : "";
})
	.filter(Boolean)
	.join("\n")}
## Optional

- [Project website](https://getcoral.dev)
- [Module overview](https://getcoral.dev/apps)
- [Docker Compose stack guide](https://getcoral.dev/guides/jellyfin-docker-compose-stack)
- [Full site text](https://getcoral.dev/llms-full.txt)
- [Source code](https://github.com/Get-Coral)
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
