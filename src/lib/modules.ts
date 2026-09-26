import { DOCKER_HUB_NAMESPACE, GITHUB_ORG_URL, MARKETING_URL } from "./site";

/**
 * Operational facts about each module, verified against the source repos.
 *
 * `status` is the honest one. It exists because the docs previously described
 * Encore as a working music-request app while its `src/` was still the
 * unmodified template, and described Librarian features that had no code at
 * all. A reader — human or model — needs to be able to tell Aurora from Encore
 * without cloning both.
 *
 *   shipping  Feature-complete enough to run for its stated purpose.
 *   early     Runs and does something useful, but the surface is small and moving.
 *   scaffold  Published image exists, but it serves the template placeholder.
 *
 * Nothing here is aspirational. If a module gains a feature, the repo changes
 * first and this file follows.
 */
export type ModuleStatus = "shipping" | "early" | "scaffold";

export interface CoralModule {
	slug: string;
	name: string;
	/** Repo name on GitHub, where it differs from the slug. */
	repo: string;
	/** One self-contained sentence. Lifted whole by extractors, so it stands alone. */
	summary: string;
	status: ModuleStatus;
	statusNote: string;
	/** Docker Hub image. Every one of these was confirmed to exist on the registry. */
	image: string;
	/** Port inside the container. Every module is EXPOSE 3000. */
	port: number;
	accent: "teal" | "coral";
}

export const modules: CoralModule[] = [
	{
		slug: "aurora",
		name: "Aurora",
		repo: "aurora",
		summary:
			"Aurora is a cinematic web frontend for Jellyfin. It runs as one Docker container, reads your libraries over the Jellyfin API, and reports playback progress back to Jellyfin.",
		status: "shipping",
		statusNote:
			"The most complete module. Rails, detail pages, search, playback reporting, TV mode, EN/NL translations, and PWA and Capacitor wrappers.",
		image: "aurora",
		port: 3000,
		accent: "coral",
	},
	{
		slug: "fathom",
		name: "Fathom",
		repo: "fathom",
		summary:
			"Fathom is a reading interface for books, manga, comics and PDFs that already live in Jellyfin. It runs as one Docker container and presents your reading libraries cover-first.",
		status: "early",
		statusNote:
			"Browsing works: featured shelf, recent additions, libraries, collections, and a title detail view. There is no reading-progress tracking, rating or recommendation engine yet.",
		image: "fathom",
		port: 3000,
		accent: "teal",
	},
	{
		slug: "librarian",
		name: "Librarian",
		repo: "librarian",
		summary:
			"Librarian imports finished downloads into your media tree by hardlinking them, so the file appears in your library at zero extra bytes and the torrent keeps seeding.",
		status: "early",
		statusNote:
			"The import workflow is real and in use: roots, import plans, hardlink-with-copy-fallback, path mappings and scan jobs. Duplicate detection, bulk metadata editing and analytics are not built.",
		image: "librarian",
		port: 3000,
		accent: "teal",
	},
	{
		slug: "kapow",
		name: "KAPOW!",
		repo: "KAPOW",
		summary:
			"KAPOW! is a karaoke queue system for bars, events and parties. The host opens a room, guests join from their own phones, everyone votes songs up the queue, and a separate display view drives the screen.",
		status: "shipping",
		statusNote:
			"Rooms, guest join, search, voting, host controls and the display view all work. Unlike every other module it needs Supabase and a YouTube Data API key, so it is not self-contained.",
		image: "kapow",
		port: 3000,
		accent: "coral",
	},
	{
		slug: "marquee",
		name: "Marquee",
		repo: "marquee",
		summary:
			"Marquee turns a spare TV, tablet or wall panel into an always-on display showing what is playing now and what was recently added to Jellyfin. There is nothing to click.",
		status: "early",
		statusNote:
			"The display and its first-run setup flow work. The surface is deliberately small — it is a screen, not an app.",
		image: "marquee",
		port: 3000,
		accent: "teal",
	},
	{
		slug: "encore",
		name: "Encore",
		repo: "encore",
		summary:
			"Encore is the reference Coral module scaffold. The published image currently serves a placeholder page; the moderated guest music requests it is named for are not built yet.",
		status: "scaffold",
		statusNote:
			"`src/` is the unmodified Coral template. Useful as a starting point for a new module, not as something to deploy.",
		image: "encore",
		port: 3000,
		accent: "coral",
	},
	{
		slug: "tide",
		name: "Tide",
		repo: "tide",
		summary:
			"Tide is a torrent client with a web interface, built for self-hosted download boxes. It enforces real active-download and seeding limits and pauses torrents as it approaches its memory cap.",
		status: "shipping",
		statusNote:
			"Queue controls, per-file piece priorities, swarm visibility, SQLite-backed state, a cgroup-aware memory guard, and optional Jellyfin sign-in.",
		image: "tide",
		port: 3000,
		accent: "teal",
	},
];

export const moduleBySlug = (slug: string) =>
	modules.find((entry) => entry.slug === slug);

/** Matches "modules/aurora" — the Starlight page id — back to its metadata. */
export const moduleForDocId = (id: string) =>
	id.startsWith("modules/") ? moduleBySlug(id.slice("modules/".length)) : undefined;

export const repoUrl = (module: CoralModule) =>
	`${GITHUB_ORG_URL}/${module.repo}`;

export const imageRef = (module: CoralModule) =>
	`${DOCKER_HUB_NAMESPACE}/${module.image}`;

export const containerUrl = (module: CoralModule) =>
	`https://hub.docker.com/r/${DOCKER_HUB_NAMESPACE}/${module.image}`;

/** The marketing page owns positioning; the docs page owns operation. */
export const marketingUrl = (module: CoralModule) =>
	`${MARKETING_URL}/apps/${module.slug}`;

export const STATUS_LABEL: Record<ModuleStatus, string> = {
	shipping: "Shipping",
	early: "Early",
	scaffold: "Scaffold",
};
