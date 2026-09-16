/**
 * One matching function for every provider filter on the site.
 *
 * Used by the [PROVIDER CARDS: …] marker at build time and by the /providers
 * directory in the browser, so a concern page and the directory can never
 * disagree about who counts as an anxiety therapist. No Node imports here: the
 * client bundle includes this file.
 *
 * Rules (00-cursor-master-prompt section 4, 01-cursor-audit-prompt Part 2):
 *  - values are matched lowercased, display case is untouched;
 *  - specialty matches on substring ("LGBTQ" finds "LGBTQ+ issues" and
 *    "LGBTQIA+"; "ADHD" finds "adult ADHD"), the other facets match whole
 *    values;
 *  - a small alias map covers the pairs substring matching cannot
 *    ("addiction" and "substance use");
 *  - filters AND across facets and OR within one facet.
 */

export type FacetKey = "pillars" | "specialties" | "modalities" | "ageGroups" | "locations" | "formats";

export const FACET_KEYS: FacetKey[] = [
  "pillars",
  "specialties",
  "modalities",
  "ageGroups",
  "locations",
  "formats",
];

/** Query string names, one per facet: ?pillar=wellness&specialty=anxiety */
export const FACET_PARAMS: Record<FacetKey, string> = {
  pillars: "pillar",
  specialties: "specialty",
  modalities: "modality",
  ageGroups: "age",
  locations: "location",
  formats: "format",
};

export interface Filterable {
  pillars: string[];
  specialties: string[];
  modalities: string[];
  ageGroups: string[];
  locations: string[];
  formats: string[];
}

/** One or more wanted values per facet. Empty array or missing key: no filter. */
export type Selection = Partial<Record<FacetKey, string[]>>;

/**
 * Terms that name the same thing in different words. Each entry lists every
 * spelling in the group; asking for any one of them matches all of them.
 * Lowercase; matching is substring, so "lgbtq" already covers "lgbtq+" and
 * "lgbtqia+" and is listed for clarity.
 */
export const SPECIALTY_ALIASES: string[][] = [
  ["lgbtq", "lgbtq+", "lgbtqia+", "lgbtqia"],
  ["addiction", "substance use"],
  ["adhd", "adult adhd"],
];

export function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Every term a wanted value expands to, the value itself included. */
export function expandTerm(wanted: string): string[] {
  const term = normalize(wanted);
  const terms = new Set<string>([term]);
  for (const group of SPECIALTY_ALIASES) {
    if (group.some((alias) => alias === term || term.includes(alias))) {
      for (const alias of group) terms.add(alias);
    }
  }
  return [...terms];
}

/** Turns "rockville-centre" and "Rockville Centre" into the same key. */
function slugKey(value: string): string {
  return normalize(value)
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchesValue(facet: FacetKey, have: string, wanted: string): boolean {
  const value = normalize(have);
  if (facet === "specialties") {
    return expandTerm(wanted).some((term) => value.includes(term));
  }
  if (facet === "locations") {
    return slugKey(have) === slugKey(wanted);
  }
  return value === normalize(wanted);
}

/** True when the provider satisfies at least one wanted value for the facet. */
export function matchesFacet(provider: Filterable, facet: FacetKey, wanted: string[]): boolean {
  const values = wanted.map(normalize).filter(Boolean);
  if (!values.length) return true;
  return values.some((want) => provider[facet].some((have) => matchesValue(facet, have, want)));
}

/** AND across facets, OR within a facet. */
export function matchesSelection(provider: Filterable, selection: Selection): boolean {
  return FACET_KEYS.every((facet) => matchesFacet(provider, facet, selection[facet] ?? []));
}

export function isEmptySelection(selection: Selection): boolean {
  return FACET_KEYS.every((facet) => !(selection[facet] ?? []).length);
}

/* ------------------------------------------------------------------ */
/* Query string                                                        */
/* ------------------------------------------------------------------ */

/** Reads ?pillar=a&specialty=b,c (repeated params and commas both OR). */
export function selectionFromSearch(search: string): Selection {
  const params = new URLSearchParams(search);
  const selection: Selection = {};
  for (const facet of FACET_KEYS) {
    const values = params
      .getAll(FACET_PARAMS[facet])
      .flatMap((raw) => raw.split(","))
      .map((value) => value.trim())
      .filter(Boolean);
    if (values.length) selection[facet] = values;
  }
  return selection;
}

/** Writes the selection back, in facet order, empty facets omitted. */
export function searchFromSelection(selection: Selection): string {
  const params = new URLSearchParams();
  for (const facet of FACET_KEYS) {
    const values = (selection[facet] ?? []).map((value) => value.trim()).filter(Boolean);
    if (values.length) params.set(FACET_PARAMS[facet], values.join(","));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
