import {
	absoluteUrl,
	BRAND_NAME,
	LICENSE_URL,
	MARKETING_URL,
	ORGANIZATION_ID,
	SAME_AS,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	WEBSITE_ID,
} from "./site";
import {
	type CoralModule,
	containerUrl,
	marketingUrl,
	repoUrl,
	STATUS_LABEL,
} from "./modules";

type Node = Record<string, unknown>;

/** A reference to another node in the same graph, rather than a duplicate of it. */
export const ref = (id: string) => ({ "@id": id });

/**
 * Both hosts emit the same Organization @id. That is the point: one entity,
 * two sites, rather than two entities that happen to share a name.
 */
export const organizationNode = (): Node => ({
	"@type": "Organization",
	"@id": ORGANIZATION_ID,
	name: BRAND_NAME,
	alternateName: "Get Coral",
	url: `${MARKETING_URL}/`,
	logo: {
		"@type": "ImageObject",
		"@id": `${MARKETING_URL}/#logo`,
		url: `${MARKETING_URL}/icon-512.png`,
		width: 512,
		height: 512,
		caption: BRAND_NAME,
	},
	sameAs: SAME_AS,
});

/** The docs are a part of the Coral site, not a sibling website. */
export const webSiteNode = (): Node => ({
	"@type": "WebSite",
	"@id": `${SITE_URL}/#website`,
	name: SITE_NAME,
	url: `${SITE_URL}/`,
	description: SITE_DESCRIPTION,
	inLanguage: "en",
	publisher: ref(ORGANIZATION_ID),
	isPartOf: ref(WEBSITE_ID),
});

export const breadcrumbNode = (
	pageUrl: string,
	trail: { name: string; url: string }[],
): Node => ({
	"@type": "BreadcrumbList",
	"@id": `${pageUrl}#breadcrumb`,
	itemListElement: trail.map((crumb, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: crumb.name,
		item: crumb.url,
	})),
});

/**
 * Documentation pages are TechArticle, not WebPage. It is the narrower type and
 * it is what an assistant looking for install instructions expects to find.
 */
export const techArticleNode = (opts: {
	url: string;
	name: string;
	description: string;
	image: string;
	breadcrumbId?: string;
	dateModified?: string;
	about?: string;
}): Node => {
	const node: Node = {
		"@type": "TechArticle",
		"@id": `${opts.url}#article`,
		url: opts.url,
		name: opts.name,
		headline: opts.name,
		description: opts.description,
		inLanguage: "en",
		isPartOf: ref(`${SITE_URL}/#website`),
		author: ref(ORGANIZATION_ID),
		publisher: ref(ORGANIZATION_ID),
		license: LICENSE_URL,
		isAccessibleForFree: true,
		primaryImageOfPage: {
			"@type": "ImageObject",
			url: opts.image,
			width: 1200,
			height: 630,
		},
	};
	if (opts.about) node.about = ref(opts.about);
	if (opts.breadcrumbId) node.breadcrumb = ref(opts.breadcrumbId);
	if (opts.dateModified) node.dateModified = opts.dateModified;
	return node;
};

/**
 * Deliberately has no aggregateRating. Google's Software App rich result
 * effectively requires one, but Coral has no real ratings and inventing them
 * is a manual action. The markup still earns its keep with LLMs.
 */
export const softwareApplicationNode = (module: CoralModule): Node => {
	const url = `${SITE_URL}/modules/${module.slug}/`;
	return {
		"@type": "SoftwareApplication",
		"@id": `${url}#software`,
		name: module.name,
		alternateName: `${module.name} for Jellyfin`,
		description: module.summary,
		url: marketingUrl(module),
		applicationCategory: "MultimediaApplication",
		applicationSubCategory: "Self-hosted media server module",
		// "Docker" is not an operating system. The container runs anywhere
		// Docker does; the Docker requirement belongs in softwareRequirements.
		operatingSystem: "Linux, macOS, Windows",
		softwareRequirements: "Docker, a running Jellyfin server",
		// Honest release stage rather than an implied "1.0 everywhere".
		creativeWorkStatus: STATUS_LABEL[module.status],
		codeRepository: repoUrl(module),
		softwareHelp: { "@type": "CreativeWork", url },
		installUrl: containerUrl(module),
		downloadUrl: containerUrl(module),
		license: LICENSE_URL,
		isAccessibleForFree: true,
		author: ref(ORGANIZATION_ID),
		publisher: ref(ORGANIZATION_ID),
		maintainer: ref(ORGANIZATION_ID),
		image: absoluteUrl(`/modules/${module.slug}/og.png`),
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
	};
};

export const faqNode = (
	pageUrl: string,
	faq: { question: string; answer: string }[],
): Node => ({
	"@type": "FAQPage",
	"@id": `${pageUrl}#faq`,
	mainEntity: faq.map((item) => ({
		"@type": "Question",
		name: item.question,
		acceptedAnswer: { "@type": "Answer", text: item.answer },
	})),
});

/** Wraps nodes into the single @graph the whole site shares. */
export const graph = (nodes: Node[]) => ({
	"@context": "https://schema.org",
	"@graph": nodes,
});
