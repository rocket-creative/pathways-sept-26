/**
 * JSON LD. The site wide graph goes on every page; each page file carries its
 * own graph in a trailing json fence, which we emit alongside it.
 *
 * Two rules are enforced here rather than trusted:
 *  - Nothing with an unresolved `[NEEDS: x]` marker ever reaches a
 *    `application/ld+json` script. A property whose whole value is a marker is
 *    dropped, a marker embedded in a longer string is removed and the rest of
 *    the string kept, and a node that loses a property it cannot do without is
 *    dropped whole.
 *  - `FAQPage`, `HowTo`, and rating or review markup are banned sitewide, so a
 *    page file that grows one fails the build instead of shipping.
 *
 * OWNER: SEO agent.
 */
import { SITE_ORIGIN, WELCOME_EMAIL, type Page } from "@/lib/content";

/**
 * A JSON LD string cannot carry a hidden marker, so unknown profile URLs are
 * left out of `sameAs` rather than emitted as placeholder text. Instagram,
 * Facebook, and LinkedIn are [NEEDS] items in the build notes.
 */
const SAME_AS: string[] = ["https://wizehire.com/cmp/pathways-within"];

/** Unresolved content markers. Neither may reach the rendered page. */
const NEEDS_MARKER = /\[NEEDS[^\]]*\]/gi;
const TEMPLATE_MARKER = /\{\{[^}]*\}\}/g;

/** Banned by SPEC.md section 6 and the master prompt, everywhere, no exceptions. */
const BANNED_TYPES = new Set([
  "FAQPage",
  "HowTo",
  "HowToStep",
  "HowToSection",
  "AggregateRating",
  "Rating",
  "Review",
  "UserReview",
  "CriticReview",
  "EmployerAggregateRating",
]);

/** Properties that only exist to carry rating or review data. */
const BANNED_KEYS = new Set(["aggregateRating", "review", "reviews", "reviewRating", "ratingValue"]);

/**
 * Nodes that say nothing once these properties are pruned, so the whole node
 * goes rather than shipping an empty shell. Everything else survives on its
 * remaining properties.
 */
const REQUIRED_PROPS: Record<string, string[]> = {
  GeoCoordinates: ["latitude", "longitude"],
  OpeningHoursSpecification: ["opens", "closes"],
  LocationFeatureSpecification: ["value"],
  PostalAddress: ["streetAddress"],
};

/** Keys that carry no information on their own. `@id` does: it is a reference. */
const STRUCTURAL_KEYS = new Set(["@type", "@context"]);

export function siteGraph(): unknown {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": `${SITE_ORIGIN}/#org`,
        name: "Pathways Within",
        url: `${SITE_ORIGIN}/`,
        logo: `${SITE_ORIGIN}/logo.webp`,
        telephone: "+1-631-371-3825",
        email: WELCOME_EMAIL,
        founder: { "@id": `${SITE_ORIGIN}/providers/rachel-lessard#person` },
        medicalSpecialty: ["Psychiatric", "Psychotherapy"],
        areaServed: [
          { "@type": "AdministrativeArea", name: "Nassau County, NY" },
          { "@type": "AdministrativeArea", name: "Suffolk County, NY" },
        ],
        sameAs: SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: "Pathways Within",
        publisher: { "@id": `${SITE_ORIGIN}/#org` },
      },
    ],
  };
}

/** Site wide graph plus the page's own graph, pruned and checked. */
export function buildPageGraph(page: Page): unknown[] {
  const where = `${page.frontMatter.url} (${page.sourceFile})`;
  const nodes: unknown[] = [siteGraph()];

  if (page.jsonLd !== null && page.jsonLd !== undefined) {
    assertNoBannedMarkup(page.jsonLd, where);
    const pruned = prune(page.jsonLd);
    if (pruned !== undefined) nodes.push(pruned);
  }

  for (const node of nodes) assertEmittable(node, where);
  return nodes;
}

/* ------------------------------------------------------------------ */
/* Pruning                                                             */
/* ------------------------------------------------------------------ */

function hasMarker(value: string): boolean {
  return /\[NEEDS/i.test(value) || value.includes("{{");
}

/**
 * Removes markers from a string. A string that was nothing but a marker, or
 * that has no words left, is dropped by returning undefined.
 */
function cleanString(value: string): string | undefined {
  if (!hasMarker(value)) return value;

  const cleaned = value
    .replace(NEEDS_MARKER, "")
    .replace(TEMPLATE_MARKER, "")
    .replace(/\s+/g, " ")
    .replace(/(,\s*)+,/g, ",")
    .replace(/^[\s,;:.\-]+/, "")
    .replace(/[\s,;:]+$/, "")
    .trim();

  return /[A-Za-z0-9]/.test(cleaned) ? cleaned : undefined;
}

function prune(value: unknown): unknown {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") return cleanString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    const items = value.map(prune).filter((item) => item !== undefined);
    return items.length ? items : undefined;
  }

  if (typeof value !== "object") return undefined;

  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(source)) {
    const cleaned = prune(raw);
    if (cleaned !== undefined) result[key] = cleaned;
  }

  const type = typeof result["@type"] === "string" ? (result["@type"] as string) : "";
  for (const required of REQUIRED_PROPS[type] ?? []) {
    if (result[required] === undefined) return undefined;
  }

  const informative = Object.keys(result).filter((key) => !STRUCTURAL_KEYS.has(key));
  return informative.length ? result : undefined;
}

/* ------------------------------------------------------------------ */
/* Assertions (these run during the static export, so they gate the build) */
/* ------------------------------------------------------------------ */

function typeNames(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

function assertNoBannedMarkup(value: unknown, where: string): void {
  if (Array.isArray(value)) {
    for (const item of value) assertNoBannedMarkup(item, where);
    return;
  }
  if (typeof value !== "object" || value === null) return;

  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (BANNED_KEYS.has(key)) {
      throw new Error(
        `Banned schema property "${key}" in the graph for ${where}. No review or rating markup anywhere.`,
      );
    }
    if (key === "@type") {
      for (const name of typeNames(raw)) {
        if (BANNED_TYPES.has(name)) {
          throw new Error(
            `Banned schema @type "${name}" in the graph for ${where}. No FAQPage, HowTo, or rating markup anywhere.`,
          );
        }
      }
    }
    assertNoBannedMarkup(raw, where);
  }
}

function assertEmittable(node: unknown, where: string): void {
  let serialised: string;
  try {
    serialised = JSON.stringify(node);
  } catch (error) {
    throw new Error(`JSON LD for ${where} does not serialise: ${(error as Error).message}`);
  }

  if (typeof serialised !== "string") {
    throw new Error(`JSON LD for ${where} serialised to nothing.`);
  }

  // Marker shaped only: a bracketed marker in any case, or a bare all caps
  // NEEDS left behind by a stripped bracket. Ordinary prose ("rooted in real
  // world needs") is not a leak.
  const leak =
    /.{0,40}\[\s*needs.{0,40}/i.exec(serialised) ?? /.{0,40}\bNEEDS\b.{0,40}/.exec(serialised);
  if (leak) {
    throw new Error(
      `JSON LD for ${where} still contains a NEEDS marker after pruning: ...${leak[0]}... ` +
        `Fix the page file or extend REQUIRED_PROPS in lib/schema.ts.`,
    );
  }
}
