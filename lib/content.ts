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
import {
  FORM_EMBEDS,
  SITE_ORIGIN,
  SITE_PHONE,
  SITE_PHONE_HREF,
  WELCOME_EMAIL,
  type FormVariant,
} from "@/lib/site";
import { parse as parseCsv } from "csv-parse/sync";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

// Client components must import these from @/lib/site: this module touches the
// filesystem and cannot be bundled for the browser.
export { FORM_EMBEDS, SITE_ORIGIN, SITE_PHONE, SITE_PHONE_HREF, WELCOME_EMAIL };
export type { FormVariant } from "@/lib/site";

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
  | { kind: "quote"; paragraphs: InlineNode[][] }
  | { kind: "cta"; label: string; href: string }
  | { kind: "form"; variant: FormVariant }
  | { kind: "providerCards"; filter: ProviderCardFilter }
  | { kind: "locationCards"; slugs: string[] }
  | { kind: "image"; alt: string; src?: string }
  | { kind: "needs"; value: string }
  | { kind: "byline"; inline: InlineNode[] }
  | { kind: "embed"; label: string; note: InlineNode[] }
  | {
      kind: "widget";
      name: WidgetName;
      /** Copy the widget renders, build instructions already removed. */
      blocks: Block[];
      /** "Routing rules for Cursor" style lines: never rendered as copy. */
      instructions: string[];
    };

export type WidgetName = "quiz" | "providerDirectory" | "resourceLibrary" | "blogIndex";

export type ProviderCardFilter =
  | { by: "slugs"; slugs: string[] }
  | { by: "specialty"; value: string }
  | { by: "pillar"; value: string }
  | { by: "location"; value: string };

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

  // Region markers are written flush against the copy they wrap, so isolate
  // them into their own chunks before splitting on blank lines.
  const isolated = markdown.replace(REGION_MARKER_RE, "\n\n$&\n\n");

  const chunks = isolated
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return { blocks: parseChunks(chunks), jsonLd };
}

const REGION_MARKER_RE =
  /^\[(?:\/?QUIZ|PROVIDER DIRECTORY|RESOURCE LIBRARY|BLOG INDEX)\]$/gim;

/** Markers that stand alone and mount a component in place of copy. */
const STANDALONE_WIDGETS: Record<string, WidgetName> = {
  "[PROVIDER DIRECTORY]": "providerDirectory",
  "[RESOURCE LIBRARY]": "resourceLibrary",
  "[BLOG INDEX]": "blogIndex",
};

/**
 * Lines addressed to the build rather than the reader. They live inside widget
 * regions in the source copy and must never reach the page.
 */
const INSTRUCTION_RE = /^(routing rules|build notes?|notes? for cursor)\b/i;

function parseChunks(chunks: string[]): Block[] {
  const blocks: Block[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];

    const widget = STANDALONE_WIDGETS[chunk.toUpperCase()];
    if (widget) {
      blocks.push({ kind: "widget", name: widget, blocks: [], instructions: [] });
      continue;
    }

    if (/^\[QUIZ\]$/i.test(chunk)) {
      const close = chunks.findIndex(
        (candidate, position) => position > index && /^\[\/QUIZ\]$/i.test(candidate),
      );
      const end = close === -1 ? chunks.length : close;
      const inner = chunks.slice(index + 1, end);

      blocks.push({
        kind: "widget",
        name: "quiz",
        blocks: parseChunks(inner.filter((line) => !INSTRUCTION_RE.test(line))),
        instructions: inner.filter((line) => INSTRUCTION_RE.test(line)),
      });

      index = end;
      continue;
    }

    blocks.push(parseChunk(chunk));
  }

  return blocks;
}

function parseChunk(text: string): Block {
  const heading = /^(#{1,4})\s+(.*)$/.exec(text);
  if (heading) {
    const level = heading[1].length as 1 | 2 | 3 | 4;
    const inline = parseInline(heading[2].trim());
    const plain = inlineToText(inline);
    return { kind: "heading", level, id: slugify(plain), text: plain, inline };
  }

  const cta = /^\[CTA\]\s*(.+?)\s*->\s*(\S+)$/.exec(text);
  if (cta) {
    return { kind: "cta", label: cta[1], href: cta[2] };
  }

  const form = /^\[FORM:\s*(therapy|wellness)\s*\]$/i.exec(text);
  if (form) {
    return { kind: "form", variant: form[1].toLowerCase() as FormVariant };
  }

  const providerCards = /^\[PROVIDER CARDS:\s*([^\]]+)\]$/i.exec(text);
  if (providerCards) {
    return { kind: "providerCards", filter: parseProviderFilter(providerCards[1]) };
  }

  const locationCards = /^\[LOCATION CARDS:\s*([^\]]+)\]$/i.exec(text);
  if (locationCards) {
    return {
      kind: "locationCards",
      slugs: locationCards[1]
        .split(",")
        .map((slug) => slug.trim())
        .filter((slug) => slug && !isNeeds(slug)),
    };
  }

  const embed = /^\[EMBED:\s*([^\]]+)\]\s*([\s\S]*)$/i.exec(text);
  if (embed) {
    return { kind: "embed", label: embed[1].trim(), note: parseInline(embed[2].trim()) };
  }

  const image = /^\[IMAGE:\s*([\s\S]+)\]$/i.exec(text);
  if (image) {
    const value = image[1].trim();
    const withUrl = /^(https?:\/\/\S+)\s+([\s\S]+)$/.exec(value);
    return withUrl
      ? { kind: "image", src: withUrl[1], alt: withUrl[2].trim() }
      : { kind: "image", alt: value };
  }

  const standaloneNeeds = /^\[NEEDS:?([^\]]*)\]$/.exec(text);
  if (standaloneNeeds) {
    return { kind: "needs", value: standaloneNeeds[1].trim() };
  }

  const lines = text.split("\n").map((line) => line.trim());

  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return {
      kind: "list",
      ordered: false,
      items: lines.map((line) => parseInline(line.replace(/^[-*]\s+/, ""))),
    };
  }

  if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
    return {
      kind: "list",
      ordered: true,
      items: lines.map((line) => parseInline(line.replace(/^\d+[.)]\s+/, ""))),
    };
  }

  if (lines.every((line) => line.startsWith(">"))) {
    // A bare "> " line is a paragraph break inside the quote, not a blank line
    // in the document, so the split has to happen here.
    const paragraphs: string[][] = [[]];
    for (const line of lines) {
      const stripped = line.replace(/^>\s?/, "").trim();
      if (stripped) paragraphs[paragraphs.length - 1].push(stripped);
      else if (paragraphs[paragraphs.length - 1].length) paragraphs.push([]);
    }

    return {
      kind: "quote",
      paragraphs: paragraphs
        .filter((paragraph) => paragraph.length)
        .map((paragraph) => parseInline(paragraph.join(" "))),
    };
  }

  const inline = parseInline(lines.join(" "));
  return { kind: BYLINE_RE.test(text) ? "byline" : "paragraph", inline };
}

const PROVIDER_FILTER_KEYS = ["specialty", "pillar", "location"] as const;

function parseProviderFilter(raw: string): ProviderCardFilter {
  const keyed = /^([a-z_]+)\s*=\s*(.+)$/i.exec(raw.trim());
  if (keyed) {
    const key = keyed[1].toLowerCase();
    // A typo here would otherwise fall through to the slug branch, match no one,
    // and render an empty section with no warning.
    if (!PROVIDER_FILTER_KEYS.includes(key as (typeof PROVIDER_FILTER_KEYS)[number])) {
      throw new Error(
        `Unknown PROVIDER CARDS filter "${key}". Expected one of: ${PROVIDER_FILTER_KEYS.join(", ")}.`,
      );
    }
    return {
      by: key as (typeof PROVIDER_FILTER_KEYS)[number],
      value: keyed[2].trim(),
    };
  }

  return {
    by: "slugs",
    slugs: raw
      .split(",")
      .map((slug) => slug.trim())
      .filter((slug) => slug && !isNeeds(slug)),
  };
}

/** Normalizes a front matter date to "YYYY-MM-DD", whatever YAML handed us. */
function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.trim()) return value.trim().slice(0, 10);
  return undefined;
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
  readCsv("data/url-map.csv")
    // "/providers/{slug}" is the template's placeholder row, not a page. The
    // real provider URLs come from the sheet.
    .filter((row) => !row.url.includes("{"))
    .map((row) => ({
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
      // YAML parses an unquoted 2026-09-16 into a Date, so normalize it here
      // rather than making every consumer handle both shapes.
      last_reviewed: toIsoDate(data.last_reviewed),
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

export interface Crumb {
  name: string;
  /** Root relative, or undefined for the current page. */
  url?: string;
}

/**
 * The visible breadcrumbs come from the page's own BreadcrumbList so the trail
 * a reader sees and the one a crawler reads can never disagree. The authored
 * trail also carries short labels ("Anxiety", not "Anxiety Therapy on Long
 * Island") and routes /insurance/aetna up to /insurance-and-fees, which has no
 * URL segment of its own.
 */
export function getBreadcrumbTrail(page: Page): Crumb[] {
  const graph = (page.jsonLd as { "@graph"?: Record<string, unknown>[] } | null)?.["@graph"] ?? [];
  const list = graph.find((node) => node["@type"] === "BreadcrumbList");
  const items = (list?.itemListElement ?? []) as { name?: string; item?: string; position?: number }[];

  if (!items.length) return [];

  return [...items]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item, index, all) => ({
      name: item.name ?? "",
      url: index === all.length - 1 ? undefined : item.item?.replace(SITE_ORIGIN, "") || "/",
    }))
    .filter((crumb) => crumb.name);
}

/** Turns "/therapy/emdr" into ["therapy", "emdr"] for route params. */
export function urlToSegments(url: string): string[] {
  return url.split("/").filter(Boolean);
}

export function segmentsToUrl(segments: string[] | undefined): string {
  return segments && segments.length ? `/${segments.join("/")}` : "/";
}
