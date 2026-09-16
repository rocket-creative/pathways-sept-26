/**
 * Content pipeline for the Pathways Within build package.
 *
 * Everything under /content is authored copy and is never rewritten by the
 * build. This module reads it, parses it into a typed block model, and hands
 * that model to the renderer. Parsing lives here so there is exactly one place
 * that decides what a marker means.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseCsv } from "csv-parse/sync";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const SITE_ORIGIN = "https://pathwayswithinwellness.com";
export const SITE_PHONE = "(631) 371-3825";
export const SITE_PHONE_HREF = "tel:+16313713825";
export const WELCOME_EMAIL = "Welcome@pathwayswithin.com";

export const FORM_EMBEDS = {
  therapy: "https://link.trustdrivencare.com/widget/form/5KmXtKKPzphbLJSdq4Ym",
  wellness: "https://link.trustdrivencare.com/widget/form/pZyZ5b0IMxCN6FcJq4pF",
} as const;

export type PageType =
  | "service"
  | "concern"
  | "insurance"
  | "location"
  | "provider"
  | "hub"
  | "trust"
  | "resource";

export type Pillar = "wisdom" | "wellness" | "medication" | "none";

export interface FrontMatter {
  url: string;
  title: string;
  meta: string;
  h1: string;
  page_type: PageType;
  pillar: Pillar;
  target_query?: string;
  author?: string;
  reviewer?: string;
  last_reviewed?: string;
  index: boolean;
  nav: "primary" | "secondary" | "none";
  related_services?: string[];
  related_concerns?: string[];
  locations?: string[];
  providers?: string[];
  hero_image?: string;
}

/* ------------------------------------------------------------------ */
/* Inline model                                                        */
/* ------------------------------------------------------------------ */

export type InlineNode =
  | { kind: "text"; value: string }
  | { kind: "strong"; children: InlineNode[] }
  | { kind: "em"; children: InlineNode[] }
  | { kind: "code"; value: string }
  | { kind: "link"; href: string; external: boolean; children: InlineNode[] }
  | { kind: "needs"; value: string };

/* ------------------------------------------------------------------ */
/* Block model                                                         */
/* ------------------------------------------------------------------ */

export type Block =
  | { kind: "heading"; level: 1 | 2 | 3 | 4; id: string; text: string; inline: InlineNode[] }
  | { kind: "paragraph"; inline: InlineNode[] }
  | { kind: "list"; ordered: boolean; items: InlineNode[][] }
  | { kind: "quote"; inline: InlineNode[] }
  | { kind: "cta"; label: string; href: string }
  | { kind: "form"; variant: keyof typeof FORM_EMBEDS }
  | { kind: "providerCards"; filter: ProviderCardFilter }
  | { kind: "locationCards"; slugs: string[] }
  | { kind: "image"; alt: string; src?: string }
  | { kind: "needs"; value: string }
  | { kind: "byline"; inline: InlineNode[] };

export type ProviderCardFilter =
  | { by: "slugs"; slugs: string[] }
  | { by: "specialty"; value: string }
  | { by: "pillar"; value: string };

export interface Page {
  frontMatter: FrontMatter;
  blocks: Block[];
  /** Parsed contents of the trailing ```json fence, if the page has one. */
  jsonLd: unknown | null;
  /** Every [NEEDS: x] found anywhere in the page, for BUILD-NOTES.md. */
  needs: string[];
  sourceFile: string;
}

/* ------------------------------------------------------------------ */
/* Sheets                                                              */
/* ------------------------------------------------------------------ */

export interface UrlMapRow {
  url: string;
  page_type: PageType;
  pillar: Pillar;
  index: boolean;
  nav: "primary" | "secondary" | "none";
  file: string;
}

export interface Provider {
  slug: string;
  first_name: string;
  last_name: string;
  credentials: string;
  title_line: string;
  role: string;
  pillars: string[];
  specialties: string[];
  modalities: string[];
  age_groups: string[];
  locations: string[];
  formats: string[];
  headshot_url: string;
  bio_p1: string;
  bio_p2: string;
  bullets: string[];
  active: boolean;
  notes: string;
  /** Full display name with credentials, e.g. "Rachel Lessard, LCSW-R". */
  displayName: string;
  /** True for front desk and admin rows, which get no profile page. */
  isAdmin: boolean;
}

export interface Location {
  slug: string;
  name: string;
  street: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  status: string;
  wheelchair_accessible: boolean | null;
  accessibility_note: string;
  parking: string;
  front_desk_hours: string;
  services: string[];
  providers: string[];
  latitude: string;
  longitude: string;
  google_maps_url: string;
  gbp_url: string;
  notes: string;
  /** Single line address, suite omitted when the sheet still says [NEEDS]. */
  addressLine: string;
}

export interface RedirectRow {
  from: string;
  to: string;
  status: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const NEEDS_RE = /\[NEEDS:?([^\]]*)\]/g;

/** A sheet cell is "missing" when the content team left a [NEEDS] marker. */
export function isNeeds(value: string | undefined): boolean {
  return !value || /^\s*\[NEEDS/i.test(value);
}

function splitList(value: string | undefined): string[] {
  if (isNeeds(value)) return [];
  return value!
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseBool(value: string | undefined): boolean | null {
  if (isNeeds(value)) return null;
  const normalized = value!.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readFile(relative: string): string {
  return fs.readFileSync(path.join(CONTENT_ROOT, relative), "utf8");
}

function readCsv(relative: string): Record<string, string>[] {
  return parseCsv(readFile(relative), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  }) as Record<string, string>[];
}

/* ------------------------------------------------------------------ */
/* Inline parsing                                                      */
/* ------------------------------------------------------------------ */

/**
 * Handles the small slice of inline Markdown the copy actually uses: links,
 * bold, italic, inline code, and [NEEDS] markers. Anything else is literal.
 */
export function parseInline(raw: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let buffer = "";

  const flush = () => {
    if (buffer) {
      nodes.push({ kind: "text", value: buffer });
      buffer = "";
    }
  };

  let i = 0;
  while (i < raw.length) {
    const rest = raw.slice(i);

    const needs = /^\[NEEDS:?([^\]]*)\]/.exec(rest);
    if (needs) {
      flush();
      nodes.push({ kind: "needs", value: needs[1].trim() });
      i += needs[0].length;
      continue;
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest);
    if (link) {
      flush();
      const href = link[2];
      nodes.push({
        kind: "link",
        href,
        external: /^https?:\/\//.test(href) || href.startsWith("tel:") || href.startsWith("mailto:"),
        children: parseInline(link[1]),
      });
      i += link[0].length;
      continue;
    }

    const strong = /^\*\*([^*]+)\*\*/.exec(rest);
    if (strong) {
      flush();
      nodes.push({ kind: "strong", children: parseInline(strong[1]) });
      i += strong[0].length;
      continue;
    }

    const em = /^\*([^*]+)\*/.exec(rest);
    if (em) {
      flush();
      nodes.push({ kind: "em", children: parseInline(em[1]) });
      i += em[0].length;
      continue;
    }

    const code = /^`([^`]+)`/.exec(rest);
    if (code) {
      flush();
      nodes.push({ kind: "code", value: code[1] });
      i += code[0].length;
      continue;
    }

    buffer += raw[i];
    i += 1;
  }

  flush();
  return nodes;
}

/** Flattens an inline tree back to plain text, for ids, alts, and checks. */
export function inlineToText(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      switch (node.kind) {
        case "text":
        case "code":
          return node.value;
        case "needs":
          return `[NEEDS: ${node.value}]`;
        default:
          return inlineToText(node.children);
      }
    })
    .join("");
}

/* ------------------------------------------------------------------ */
/* Block parsing                                                       */
/* ------------------------------------------------------------------ */

const BYLINE_RE = /^\*\*Written by\*\*/;

export function parseBlocks(body: string): { blocks: Block[]; jsonLd: unknown | null } {
  // Strip HTML comments (template notes) before anything else.
  const withoutComments = body.replace(/<!--[\s\S]*?-->/g, "");

  // Pull the trailing JSON LD fence out of the flow.
  let jsonLd: unknown | null = null;
  let markdown = withoutComments;
  const fence = /```json\s*([\s\S]*?)```\s*$/.exec(withoutComments);
  if (fence) {
    markdown = withoutComments.slice(0, fence.index);
    try {
      jsonLd = JSON.parse(fence[1]);
    } catch (error) {
      throw new Error(`JSON LD block failed to parse: ${(error as Error).message}`);
    }
  }

  const blocks: Block[] = [];
  const chunks = markdown.split(/\n{2,}/);

  for (const chunk of chunks) {
    const text = chunk.trim();
    if (!text) continue;

    const heading = /^(#{1,4})\s+(.*)$/.exec(text);
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3 | 4;
      const inline = parseInline(heading[2].trim());
      const plain = inlineToText(inline);
      blocks.push({ kind: "heading", level, id: slugify(plain), text: plain, inline });
      continue;
    }

    const cta = /^\[CTA\]\s*(.+?)\s*->\s*(\S+)$/.exec(text);
    if (cta) {
      blocks.push({ kind: "cta", label: cta[1], href: cta[2] });
      continue;
    }

    const form = /^\[FORM:\s*(therapy|wellness)\s*\]$/i.exec(text);
    if (form) {
      blocks.push({ kind: "form", variant: form[1].toLowerCase() as keyof typeof FORM_EMBEDS });
      continue;
    }

    const providerCards = /^\[PROVIDER CARDS:\s*([^\]]+)\]$/i.exec(text);
    if (providerCards) {
      blocks.push({ kind: "providerCards", filter: parseProviderFilter(providerCards[1]) });
      continue;
    }

    const locationCards = /^\[LOCATION CARDS:\s*([^\]]+)\]$/i.exec(text);
    if (locationCards) {
      blocks.push({
        kind: "locationCards",
        slugs: locationCards[1]
          .split(",")
          .map((slug) => slug.trim())
          .filter((slug) => slug && !isNeeds(slug)),
      });
      continue;
    }

    const image = /^\[IMAGE:\s*([\s\S]+)\]$/i.exec(text);
    if (image) {
      const value = image[1].trim();
      const withUrl = /^(https?:\/\/\S+)\s+([\s\S]+)$/.exec(value);
      blocks.push(
        withUrl
          ? { kind: "image", src: withUrl[1], alt: withUrl[2].trim() }
          : { kind: "image", alt: value },
      );
      continue;
    }

    const standaloneNeeds = /^\[NEEDS:?([^\]]*)\]$/.exec(text);
    if (standaloneNeeds) {
      blocks.push({ kind: "needs", value: standaloneNeeds[1].trim() });
      continue;
    }

    const lines = text.split("\n").map((line) => line.trim());

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      blocks.push({
        kind: "list",
        ordered: false,
        items: lines.map((line) => parseInline(line.replace(/^[-*]\s+/, ""))),
      });
      continue;
    }

    if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
      blocks.push({
        kind: "list",
        ordered: true,
        items: lines.map((line) => parseInline(line.replace(/^\d+[.)]\s+/, ""))),
      });
      continue;
    }

    if (lines.every((line) => line.startsWith(">"))) {
      blocks.push({
        kind: "quote",
        inline: parseInline(lines.map((line) => line.replace(/^>\s?/, "")).join(" ")),
      });
      continue;
    }

    const inline = parseInline(lines.join(" "));
    blocks.push({ kind: BYLINE_RE.test(text) ? "byline" : "paragraph", inline });
  }

  return { blocks, jsonLd };
}

function parseProviderFilter(raw: string): ProviderCardFilter {
  const specialty = /^specialty\s*=\s*(.+)$/i.exec(raw.trim());
  if (specialty) return { by: "specialty", value: specialty[1].trim() };

  const pillar = /^pillar\s*=\s*(.+)$/i.exec(raw.trim());
  if (pillar) return { by: "pillar", value: pillar[1].trim() };

  return {
    by: "slugs",
    slugs: raw
      .split(",")
      .map((slug) => slug.trim())
      .filter((slug) => slug && !isNeeds(slug)),
  };
}

function collectNeeds(source: string): string[] {
  const found = new Set<string>();
  for (const match of source.matchAll(NEEDS_RE)) {
    found.add(match[1].replace(/^:/, "").trim());
  }
  return [...found];
}

/* ------------------------------------------------------------------ */
/* Loaders (memoized: the build reads each sheet dozens of times)      */
/* ------------------------------------------------------------------ */

function memo<T>(load: () => T): () => T {
  let value: T | undefined;
  return () => (value === undefined ? (value = load()) : value);
}

export const getUrlMap = memo<UrlMapRow[]>(() =>
  readCsv("data/url-map.csv").map((row) => ({
    url: row.url,
    page_type: row.page_type as PageType,
    pillar: row.pillar as Pillar,
    index: row.index === "true",
    nav: row.nav as UrlMapRow["nav"],
    file: row.file,
  })),
);

export const getUrlSet = memo<Set<string>>(() => new Set(getUrlMap().map((row) => row.url)));

export const getRedirects = memo<RedirectRow[]>(() =>
  readCsv("data/redirects.csv")
    .map((row) => ({
      from: row.source ?? "",
      to: row.destination ?? "",
      status: Number(row.status ?? 301),
    }))
    .filter((row) => row.from),
);

export const getProviders = memo<Provider[]>(() =>
  readCsv("data/providers-sheet.csv").map((row) => {
    const credentials = isNeeds(row.credentials) ? "" : row.credentials;
    const role = isNeeds(row.role) ? "" : row.role;
    return {
      slug: row.slug,
      first_name: row.first_name,
      last_name: row.last_name,
      credentials,
      title_line: isNeeds(row.title_line) ? "" : row.title_line,
      role,
      pillars: splitList(row.pillars),
      specialties: splitList(row.specialties),
      modalities: splitList(row.modalities),
      age_groups: splitList(row.age_groups),
      locations: splitList(row.locations),
      formats: splitList(row.formats),
      headshot_url: isNeeds(row.headshot_url) ? "" : row.headshot_url,
      bio_p1: isNeeds(row.bio_p1) ? "" : row.bio_p1,
      bio_p2: isNeeds(row.bio_p2) ? "" : row.bio_p2,
      bullets: [row.bullet_1, row.bullet_2, row.bullet_3].filter(
        (bullet): bullet is string => !isNeeds(bullet),
      ),
      active: row.active === "true",
      notes: row.notes ?? "",
      displayName: credentials
        ? `${row.first_name} ${row.last_name}, ${credentials}`
        : `${row.first_name} ${row.last_name}`,
      isAdmin: /admin|front desk/i.test(role),
    };
  }),
);

export const getLocations = memo<Location[]>(() =>
  readCsv("data/locations-sheet.csv").map((row) => {
    const suite = isNeeds(row.suite) ? "" : row.suite;
    return {
      slug: row.slug,
      name: row.name,
      street: row.street,
      suite,
      city: row.city,
      state: row.state,
      zip: row.zip,
      phone: isNeeds(row.phone) ? SITE_PHONE : row.phone,
      email: isNeeds(row.email) ? WELCOME_EMAIL : row.email,
      status: row.status ?? "",
      wheelchair_accessible: parseBool(row.wheelchair_accessible),
      accessibility_note: row.accessibility_note ?? "",
      parking: row.parking ?? "",
      front_desk_hours: row.front_desk_hours ?? "",
      services: splitList(row.services),
      providers: splitList(row.providers),
      latitude: isNeeds(row.latitude) ? "" : row.latitude,
      longitude: isNeeds(row.longitude) ? "" : row.longitude,
      google_maps_url: isNeeds(row.google_maps_url) ? "" : row.google_maps_url,
      gbp_url: isNeeds(row.gbp_url) ? "" : row.gbp_url,
      notes: row.notes ?? "",
      addressLine: [row.street, suite, `${row.city}, ${row.state} ${row.zip}`]
        .filter(Boolean)
        .join(", "),
    };
  }),
);

export function getProvider(slug: string): Provider | undefined {
  return getProviders().find((provider) => provider.slug === slug);
}

export function getLocation(slug: string): Location | undefined {
  return getLocations().find((location) => location.slug === slug);
}

/** Providers that get a profile page: active, not admin. */
export function getProfileProviders(): Provider[] {
  return getProviders().filter((provider) => provider.active && !provider.isAdmin);
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

function loadPageFile(file: string, url: string): Page {
  const raw = readFile(file);
  const { data, content } = matter(raw);
  const { blocks, jsonLd } = parseBlocks(content);

  return {
    frontMatter: {
      ...(data as Partial<FrontMatter>),
      url: (data.url as string) ?? url,
      index: data.index !== false,
      nav: (data.nav as FrontMatter["nav"]) ?? "none",
    } as FrontMatter,
    blocks,
    jsonLd,
    needs: collectNeeds(content),
    sourceFile: file,
  };
}

export const getAllPages = memo<Page[]>(() =>
  getUrlMap().map((row) => loadPageFile(row.file, row.url)),
);

export function getPageByUrl(url: string): Page | undefined {
  const normalized = url === "" ? "/" : url;
  return getAllPages().find((page) => page.frontMatter.url === normalized);
}

/** Every URL the static export should emit, provider profiles included. */
export function getAllUrls(): string[] {
  const fromMap = getUrlMap().map((row) => row.url);
  const providerUrls = getProfileProviders().map((provider) => `/providers/${provider.slug}`);
  return [...new Set([...fromMap, ...providerUrls])];
}

/** Turns "/therapy/emdr" into ["therapy", "emdr"] for route params. */
export function urlToSegments(url: string): string[] {
  return url.split("/").filter(Boolean);
}

export function segmentsToUrl(segments: string[] | undefined): string {
  return segments && segments.length ? `/${segments.join("/")}` : "/";
}
