/**
 * Sitemap data and XML serialisation, shared by the index route and the four
 * section routes.
 *
 * The site is a static export, so the sitemaps are `force-static` route
 * handlers rather than Next's `sitemap.ts` convention: the master prompt asks
 * for an index plus named section files, which the convention cannot express.
 *
 * Rules, from MASTER-PROMPT section 8:
 *  - only `index: true` URLs (the IV vitamin therapy page is index: false and
 *    is excluded until the client launches it),
 *  - `lastmod` from each page's `last_reviewed` front matter,
 *  - provider profiles come from the sheet, not the URL map, because most of
 *    them render from `_provider-template.md`.
 *
 * OWNER: SEO agent.
 */
import {
  SITE_ORIGIN,
  getAllPages,
  getPageByUrl,
  getProfileProviders,
  type Page,
} from "@/lib/content";
import { getProviderPage } from "@/lib/providers";

export type SitemapSection = "pages" | "providers" | "locations" | "blog";

export const SITEMAP_SECTIONS: SitemapSection[] = ["pages", "providers", "locations", "blog"];

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

/** The URL map carries one row for the provider template; it is not a real URL. */
function isTemplateUrl(url: string): boolean {
  return url.includes("{");
}

/**
 * `last_reviewed` is unquoted in the front matter, so YAML hands back a Date.
 * Typed as a string, so both shapes are handled here.
 */
function toLastmod(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value).trim();
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : undefined;
}

function sectionFor(url: string): SitemapSection {
  if (url.startsWith("/providers/")) return "providers";
  if (url.startsWith("/locations/")) return "locations";
  if (url.startsWith("/blog/")) return "blog";
  return "pages";
}

function entryFor(page: Page): SitemapEntry {
  const entry: SitemapEntry = { loc: `${SITE_ORIGIN}${page.frontMatter.url}` };
  const lastmod = toLastmod(page.frontMatter.last_reviewed);
  if (lastmod) entry.lastmod = lastmod;
  return entry;
}

/** Every indexable URL, grouped into the four section files. */
export function sitemapEntries(): Record<SitemapSection, SitemapEntry[]> {
  const grouped: Record<SitemapSection, SitemapEntry[]> = {
    pages: [],
    providers: [],
    locations: [],
    blog: [],
  };
  const seen = new Set<string>();

  const add = (page: Page) => {
    const { url, index } = page.frontMatter;
    if (!url || !index || isTemplateUrl(url) || seen.has(url)) return;
    seen.add(url);
    grouped[sectionFor(url)].push(entryFor(page));
  };

  for (const page of getAllPages()) add(page);

  for (const provider of getProfileProviders()) {
    const url = `/providers/${provider.slug}`;
    const page = getPageByUrl(url) ?? getProviderPage(url);
    if (page) add(page);
  }

  return grouped;
}

export function sectionEntries(section: SitemapSection): SitemapEntry[] {
  return sitemapEntries()[section];
}

export function sectionUrl(section: SitemapSection): string {
  return `${SITE_ORIGIN}/sitemap-${section}.xml`;
}

/* ------------------------------------------------------------------ */
/* XML                                                                 */
/* ------------------------------------------------------------------ */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function urlSetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function sitemapIndexXml(): string {
  const grouped = sitemapEntries();
  const files = SITEMAP_SECTIONS.map((section) => {
    const lastmod = grouped[section]
      .map((entry) => entry.lastmod)
      .filter((value): value is string => Boolean(value))
      .sort()
      .pop();
    return (
      `  <sitemap>\n    <loc>${escapeXml(sectionUrl(section))}</loc>` +
      (lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "") +
      `\n  </sitemap>`
    );
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files}\n</sitemapindex>\n`;
}

/** Shared response shape: XML, cached at the edge, safe for a static export. */
export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
