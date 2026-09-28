#!/usr/bin/env node
/**
 * Fails when a module's `.env.example` names a variable its docs page does not.
 *
 * This exists because the docs drifted badly once: Librarian shipped
 * `LIBRARIAN_REQUIRE_LOGIN=true` — a default that stops a first-run user dead —
 * and the docs never mentioned it, along with four other variables. The module
 * repos change daily; nobody is going to catch this by reading.
 *
 * Deliberately one-directional. Docs legitimately describe variables that are
 * read by code but absent from `.env.example` (`HOST` and `PORT` in most
 * modules), so flagging those would be noise.
 *
 *   node scripts/check-env-drift.mjs
 *   node scripts/check-env-drift.mjs --ref my-branch
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** repo name on GitHub -> docs page slug. They differ for KAPOW. */
const MODULES = [
	["aurora", "aurora"],
	["tide", "tide"],
	["librarian", "librarian"],
	["fathom", "fathom"],
	["marquee", "marquee"],
	["encore", "encore"],
	["KAPOW", "kapow"],
];

/**
 * Declared in a repo's `.env.example` but verified to be read by nothing.
 * Documenting these would imply they work. Each needs a reason and, ideally,
 * an upstream issue to delete it.
 */
const KNOWN_DEAD = {
	aurora: {
		PLEX_URL: "Leftover from a dropped Plex experiment; no reference in aurora/src or server.mjs.",
		PLEX_TOKEN: "Leftover from a dropped Plex experiment; no reference in aurora/src or server.mjs.",
	},
};

const refArg = process.argv.indexOf("--ref");
const REF = refArg === -1 ? "main" : process.argv[refArg + 1];

/** Picks up `FOO=` and commented options like `# FOO=`, which are still real. */
const parseEnvNames = (text) => {
	const names = new Set();
	for (const line of text.split("\n")) {
		const match = /^\s*#?\s*([A-Z][A-Z0-9_]*)\s*=/.exec(line);
		if (match) names.add(match[1]);
	}
	return names;
};

const failures = [];
const missingSources = [];

for (const [repo, slug] of MODULES) {
	const url = `https://raw.githubusercontent.com/Get-Coral/${repo}/${REF}/.env.example`;
	const response = await fetch(url);
	if (!response.ok) {
		missingSources.push(`${repo}: ${url} -> ${response.status}`);
		continue;
	}

	const declared = parseEnvNames(await response.text());
	const docs = await readFile(join(ROOT, "src/content/docs/modules", `${slug}.md`), "utf8");

	// A bare substring match would let `TIDE_MEMORY_LIMIT` pass for
	// `TIDE_MEMORY_LIMIT_MB`, so require a non-word boundary on both sides.
	const dead = KNOWN_DEAD[repo] ?? {};
	const undocumented = [...declared].filter(
		(name) =>
			!(name in dead) &&
			!new RegExp(`(^|[^A-Z0-9_])${name}([^A-Z0-9_]|$)`).test(docs),
	);

	for (const name of Object.keys(dead)) {
		if (!declared.has(name)) {
			console.log(`note  ${repo}: ${name} is gone upstream — drop it from KNOWN_DEAD`);
		}
	}

	if (undocumented.length > 0) {
		failures.push({ repo, slug, undocumented });
	}
	console.log(
		`${undocumented.length === 0 ? "ok  " : "FAIL"}  ${repo.padEnd(10)} ${declared.size} variables declared`,
	);
}

if (missingSources.length > 0) {
	console.error(`\nCould not read .env.example for:\n  ${missingSources.join("\n  ")}`);
	process.exit(2);
}

if (failures.length > 0) {
	console.error("\nEnvironment variables missing from the docs:\n");
	for (const { repo, slug, undocumented } of failures) {
		console.error(`  src/content/docs/modules/${slug}.md is missing, from ${repo}/.env.example:`);
		for (const name of undocumented) console.error(`    - ${name}`);
	}
	console.error("\nDocument them or, if a variable is genuinely gone, remove it upstream.");
	process.exit(1);
}

console.log("\nNo environment drift.");
