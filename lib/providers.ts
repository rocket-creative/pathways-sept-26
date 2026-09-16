/**
 * Sheet driven provider profiles. Two providers have hand written pages in
 * content/pages/providers; everyone else renders from _provider-template.md
 * with their row substituted in.
 *
 * OWNER: providers and locations agent. Fill in renderTemplate.
 */
import {
  getPageByUrl,
  getProfileProviders,
  getProvider,
  parseBlocks,
  type Page,
  type Provider,
} from "@/lib/content";

/** Resolves /providers/{slug} to a page, hand written override winning. */
export function getProviderPage(url: string): Page | undefined {
  const match = /^\/providers\/([a-z0-9-]+)$/.exec(url);
  if (!match) return undefined;

  const override = getPageByUrl(url);
  if (override) return override;

  const provider = getProvider(match[1]);
  if (!provider || !provider.active || provider.isAdmin) return undefined;

  return renderProviderTemplate(provider);
}

export function renderProviderTemplate(provider: Provider): Page {
  // Placeholder until the template renderer lands: a minimal but valid page so
  // the route type checks and the static export has every provider URL.
  const body = [
    `# ${provider.displayName}`,
    "",
    provider.bio_p1,
    "",
    provider.bio_p2,
    "",
    "[CTA] Book with " + provider.first_name + " -> /contact",
  ].join("\n");

  const { blocks, jsonLd } = parseBlocks(body);

  return {
    frontMatter: {
      url: `/providers/${provider.slug}`,
      title: `${provider.displayName} | Pathways Within`,
      meta: `${provider.displayName} is a ${provider.title_line} at Pathways Within on Long Island. In person and by telehealth. Book a 360 intake.`,
      h1: provider.displayName,
      page_type: "provider",
      pillar: "none",
      index: provider.active,
      nav: "none",
      author: "Rachel Lessard, LCSW-R",
      reviewer: "Rachel Lessard, LCSW-R",
      last_reviewed: "2026-09-16",
    },
    blocks,
    jsonLd,
    needs: [],
    sourceFile: "content/pages/_provider-template.md",
  };
}

export function allProviderUrls(): string[] {
  return getProfileProviders().map((provider) => `/providers/${provider.slug}`);
}
