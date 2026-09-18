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
 *  - filters AND across facets and OR within one facet;
 *  - a free text query (?q=) is split on whitespace and every token must
 *    appear somewhere in the provider's name, credentials, title, role,
 *    facets or first bullet; tokens go through the same alias map, so
 *    "addiction" finds "substance use". The query ANDs with the facets.
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

/**
 * The text fields a free text query reads, on top of the facets. Every one is
 * optional so a plain Filterable (a provider with no text) still type checks
 * and simply cannot match a query token by name.
 */
export interface Searchable extends Filterable {
  name?: string;
  displayName?: string;
  credentials?: string;
  titleLine?: string;
  role?: string;
  bullet?: string;
}

/** Query string name for the free text query: ?q=anxiety+emdr */
export const QUERY_PARAM = "q";

/**
 * One or more wanted values per facet, plus an optional free text query.
 * Empty array, empty string or missing key: no filter.
 */
export type Selection = Partial<Record<FacetKey, string[]>> & { q?: string };

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

/* ------------------------------------------------------------------ */
/* Free text                                                           */
/* ------------------------------------------------------------------ */

/** "anxiety  EMDR " -> ["anxiety", "emdr"]. An empty query has no tokens. */
export function queryTokens(q: string | undefined): string[] {
  return normalize(q ?? "")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Everything a query can hit, lowercased and joined with a separator so a
 * token cannot straddle the end of one field and the start of the next.
 * Tokens are matched one at a time, so "worker anxiety" finds a social
 * worker with anxiety in her specialties: each word only has to be somewhere.
 */
export function searchText(provider: Searchable): string {
  const parts: string[] = [
    provider.name ?? "",
    provider.displayName ?? "",
    provider.credentials ?? "",
    provider.titleLine ?? "",
    provider.role ?? "",
    ...provider.specialties,
    ...provider.modalities,
    ...provider.ageGroups,
    ...provider.formats,
    ...provider.locations,
    provider.bullet ?? "",
  ];
  return parts.map(normalize).filter(Boolean).join(" | ");
}

/**
 * A query term against the provider's words.
 *
 * A phrase ("substance use", from the alias map) has to appear as written.
 * A word of one or two letters has to be a whole word, so "Ma" finds Leonard
 * Ma and not everyone who offers massage or management. A longer word matches
 * a word or the start of one ("trauma" finds "traumatic") but not a piece
 * buried in the middle, so "Bell" does not find Gabellini.
 */
function termHits(haystack: string, words: string[], term: string): boolean {
  if (/\s/.test(term)) return haystack.includes(term);
  if (term.length < 3) return words.includes(term);
  return words.some((word) => word === term || word.startsWith(term));
}

/** Words a query can hit. Hyphens and plus signs stay, so "LCSW-R" and "LGBTQ+" hold together. */
function searchWords(haystack: string): string[] {
  return haystack.match(/[a-z0-9][a-z0-9+-]*/g) ?? [];
}

/**
 * True when every whitespace separated token of `q` hits the provider's
 * text. Each token expands through SPECIALTY_ALIASES, so any one spelling of
 * a group is enough. An empty query matches everyone.
 */
export function matchesQuery(provider: Searchable, q: string | undefined): boolean {
  const tokens = queryTokens(q);
  if (!tokens.length) return true;
  const haystack = searchText(provider);
  const words = searchWords(haystack);
  return tokens.every((token) => expandTerm(token).some((term) => termHits(haystack, words, term)));
}

/** AND across facets, OR within a facet, AND with the free text query. */
export function matchesSelection(provider: Searchable, selection: Selection): boolean {
  return (
    FACET_KEYS.every((facet) => matchesFacet(provider, facet, selection[facet] ?? [])) &&
    matchesQuery(provider, selection.q)
  );
}

export function isEmptySelection(selection: Selection): boolean {
  return FACET_KEYS.every((facet) => !(selection[facet] ?? []).length) && !queryTokens(selection.q).length;
}

/* ------------------------------------------------------------------ */
/* Query string                                                        */
/* ------------------------------------------------------------------ */

/**
 * Reads ?q=text&pillar=a&specialty=b,c (repeated facet params and commas
 * both OR; the query is one string, whitespace trimmed).
 */
export function selectionFromSearch(search: string): Selection {
  const params = new URLSearchParams(search);
  const selection: Selection = {};
  const q = (params.get(QUERY_PARAM) ?? "").trim();
  if (q) selection.q = q;
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

/** Writes the selection back: q first, then facets in order, empties omitted. */
export function searchFromSelection(selection: Selection): string {
  const params = new URLSearchParams();
  const q = (selection.q ?? "").trim();
  if (q) params.set(QUERY_PARAM, q);
  for (const facet of FACET_KEYS) {
    const values = (selection[facet] ?? []).map((value) => value.trim()).filter(Boolean);
    if (values.length) params.set(FACET_PARAMS[facet], values.join(","));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
