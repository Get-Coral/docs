/**
 * Single source of truth for the things that describe this site.
 *
 * The marketing site learned this lesson first: the same facts retyped in
 * every page and in three JSON-LD blocks is how a site ends up describing
 * itself ten different ways across ten URLs. Mirrors
 * getcoral.dev/src/lib/site.ts deliberately — the two sites are one entity.
 */

export const SITE_URL = "https://docs.getcoral.dev";

/** The brand name. The docs are Coral's docs, not a separate product. */
export const SITE_NAME = "Coral Docs";

/** The entity both sites describe. */
export const BRAND_NAME = "Coral";

export const MARKETING_URL = "https://getcoral.dev";

/** Describes the site as a whole. Never swap this for a page description. */
export const SITE_DESCRIPTION =
	"Install, configure and operate Coral's open-source Jellyfin modules. Each one runs as a Docker container, talks to your Jellyfin server, and does one thing brilliantly.";

/** Profile URLs that let search engines and models resolve Coral to one entity. */
export const SAME_AS = [
	"https://github.com/Get-Coral",
	"https://hub.docker.com/u/getcoral",
	"https://www.npmjs.com/org/get-coral",
	"https://discord.gg/M3wzFpGbzp",
];

export const GITHUB_ORG_URL = "https://github.com/Get-Coral";
export const DISCORD_URL = "https://discord.gg/M3wzFpGbzp";
export const SPONSORS_URL = "https://github.com/sponsors/ElianCodes";
export const LICENSE_URL = "https://opensource.org/licenses/MIT";
export const DOCKER_HUB_NAMESPACE = "getcoral";

/**
 * Stable @id anchors. These point at the *marketing* origin on purpose: one
 * Organization and one WebSite shared across both hosts, so a crawler resolves
 * getcoral.dev and docs.getcoral.dev to a single entity rather than two that
 * happen to share a name.
 */
export const ORGANIZATION_ID = `${MARKETING_URL}/#organization`;
export const WEBSITE_ID = `${MARKETING_URL}/#website`;

export const absoluteUrl = (pathOrUrl: string) =>
	new URL(pathOrUrl, SITE_URL).toString();

/**
 * Titles over ~60 chars and descriptions over ~155 get truncated in search
 * results. Warn at build time rather than discovering it in a SERP.
 */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;
