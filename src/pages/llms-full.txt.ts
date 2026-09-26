import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL } from "../lib/site";

/**
 * Every documentation page as one plain-text file.
 *
 * `llms.txt` is an index; a model that wants the actual install steps still has
 * to fetch seventeen URLs. This is the whole corpus in one request, which is
 * what the marketing site already publishes and what its llms.txt was linking
 * to across the domain boundary.
 */
// The splash page's collection id is "index", and it serves at the root.
const isHomeId = (id: string) => id === "" || id === "index";

const docUrl = (id: string) => `${SITE_URL}/${isHomeId(id) ? "" : `${id}/`}`;

const SECTIONS = [
	{ label: "Getting started", prefix: "getting-started/" },
	{ label: "Modules", prefix: "modules/" },
	{ label: "Libraries", prefix: "libraries/" },
	{ label: "Contributing", prefix: "contributing/" },
];

/**
 * Turns MDX into prose.
 *
 * `<LinkCard>` carries its content in attributes rather than children, so
 * simply stripping the tag would delete the homepage's entire module list.
 * Those become markdown links; the purely decorative wrappers are dropped.
 */
const attr = (tag: string, name: string) =>
	new RegExp(`${name}=(?:"([^"]*)"|{\`([^\`]*)\`})`).exec(tag)?.slice(1).find(Boolean) ?? "";

const toPlainText = (body: string) =>
	body
		.replace(/^import\s+.*$/gm, "")
		.replace(/<LinkCard\b[\s\S]*?\/>/g, (tag) => {
			const title = attr(tag, "title");
			const href = attr(tag, "href");
			const description = attr(tag, "description");
			if (!title) return "";
			return `- [${title}](${href})${description ? `: ${description}` : ""}`;
		})
		.replace(/<\/?(?:Card|CardGrid|Aside|Tabs|TabItem|Steps)[^>]*>/g, "")
		// Site-relative links are useless in a file someone fetches on its own.
		.replace(/\]\((\/[^)]*)\)/g, (_match, path) => `](${SITE_URL}${path})`)
		.replace(/^\t+(?=[-*] )/gm, "")
		.replace(/^[ \t]+$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();

export const GET: APIRoute = async () => {
	const docs = await getCollection("docs");
	const byId = [...docs].sort((a, b) => a.id.localeCompare(b.id));

	const render = (entry: (typeof byId)[number]) =>
		[
			`## ${entry.data.title}`,
			"",
			`Source: ${docUrl(entry.id)}`,
			entry.data.description ? `\n${entry.data.description}` : "",
			"",
			toPlainText(entry.body ?? ""),
		]
			.filter((line) => line !== undefined)
			.join("\n");

	const index = byId.find((entry) => isHomeId(entry.id));
	const sections = SECTIONS.map((section) => {
		const entries = byId.filter((entry) => entry.id.startsWith(section.prefix));
		if (entries.length === 0) return "";
		return [`# ${section.label}`, "", entries.map(render).join("\n\n---\n\n")].join("\n");
	}).filter(Boolean);

	const body = `# Coral documentation — full text

> An open-source ecosystem of independent Jellyfin modules. Each module runs as a
> Docker container, reads a Jellyfin server over its HTTP API, and does one thing well.

Coral is not a fork of Jellyfin and not a plugin framework. Modules never share a
database; Jellyfin stays the source of truth. Everything is MIT licensed, with no
paid tier and no hosted service.

Container images are published to Docker Hub under the \`getcoral\` namespace.
Module pages state a status — Shipping, Early or Scaffold — describing how much
of the module actually exists today. Trust it over any feature list you find
elsewhere.

${index ? `${render(index)}\n\n---\n\n` : ""}${sections.join("\n\n---\n\n")}
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
