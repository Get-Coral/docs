#!/usr/bin/env node
/**
 * Verifies every internal link in the built site resolves to a real page.
 *
 * Run after `pnpm build`. Catches the ordinary failure mode for a docs site
 * with hand-written cross-links: a page gets renamed and six other pages keep
 * pointing at the old slug.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const walk = async (dir) => {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await walk(full)));
		else out.push(full);
	}
	return out;
};

const exists = async (path) => {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
};

const files = await walk(DIST);
const pages = files.filter((f) => f.endsWith(".html"));

const broken = [];
let checked = 0;

for (const page of pages) {
	const html = await readFile(page, "utf8");
	const source = page.slice(DIST.length) || "/";

	for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
		const target = match[1];
		// Hashed build assets and the search index are generated, not authored.
		if (target.startsWith("/_astro/") || target.startsWith("/pagefind/")) continue;
		checked++;

		const candidates = target.endsWith("/")
			? [join(DIST, target, "index.html")]
			: [join(DIST, target), join(DIST, `${target}.html`), join(DIST, target, "index.html")];

		let ok = false;
		for (const candidate of candidates) {
			// Guard against a traversal escaping dist.
			if (!resolve(candidate).startsWith(DIST)) continue;
			if (await exists(candidate)) {
				ok = true;
				break;
			}
		}
		if (!ok) broken.push({ source, target });
	}
}

console.log(`Checked ${checked} internal links across ${pages.length} pages.`);

if (broken.length > 0) {
	console.error("\nBroken internal links:\n");
	for (const { source, target } of broken) console.error(`  ${source} -> ${target}`);
	process.exit(1);
}

console.log("No broken internal links.");
