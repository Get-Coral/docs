import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";
import { moduleForDocId, STATUS_LABEL } from "../../lib/modules";
import { ogCardSvg } from "../../lib/ogCard";

/**
 * One 1200x630 card per documentation page, rasterised at build time.
 *
 * Deliberately not satori/@vercel/og: `sharp` is already a dependency here
 * (Astro's image service pulls it in), and the marketing site proved the SVG
 * approach is enough for a card that is mostly two lines of text.
 */
export async function getStaticPaths() {
	const docs = await getCollection("docs");
	return docs.map((entry) => ({
		// The index page has id "", which Astro renders at /og.png.
		params: { slug: entry.id || undefined },
		props: { entry },
	}));
}

const SECTION_EYEBROW: Record<string, string> = {
	"getting-started": "Getting started",
	modules: "Coral module",
	libraries: "Coral library",
	contributing: "Contributing",
};

export const GET: APIRoute = async ({ props }) => {
	const { entry } = props as { entry: { id: string; data: { title: string; description?: string } } };
	const module = moduleForDocId(entry.id);
	const section = entry.id.split("/")[0] ?? "";

	const svg = ogCardSvg({
		eyebrow: SECTION_EYEBROW[section] ?? "Coral docs",
		title: entry.data.title,
		subtitle: entry.data.description ?? "Documentation for the Coral ecosystem",
		accent: module?.accent ?? "teal",
		footer: module
			? `docs.getcoral.dev · ${STATUS_LABEL[module.status]} · MIT licensed`
			: "docs.getcoral.dev · MIT licensed · Docker native",
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
