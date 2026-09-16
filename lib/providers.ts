/**
 * Sheet driven provider profiles. Two providers have hand written pages in
 * content/pages/providers; everyone else renders from _provider-template.md
 * with their row substituted in.
 *
 * Nothing here writes copy. The template supplies every sentence, the sheet
 * supplies every value, and this module decides only which value goes where
 * and which of the template's own documented fallbacks applies.
 *
 * OWNER: providers and locations agent.
 */
import fs from "node:fs";
import path from "node:path";
import {
  CONTENT_ROOT,
  SITE_ORIGIN,
  getAllUrls,
  getPageByUrl,
  getProfileProviders,
  getProvider,
  parseBlocks,
  type FrontMatter,
  type Page,
  type Pillar,
  type Provider,
} from "@/lib/content";

const TEMPLATE_FILE = "pages/_provider-template.md";
const AUTHOR = "Rachel Lessard, LCSW-R";
const AUTHOR_SLUG = "rachel-lessard";
const LAST_REVIEWED = "2026-09-16";

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const META_MIN = 140;
const META_MAX = 155;

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

const renderCache = new Map<string, Page>();

/** Renders content/pages/_provider-template.md against one sheet row. */
export function renderProviderTemplate(provider: Provider): Page {
  const cached = renderCache.get(provider.slug);
  if (cached) return cached;

  const markdown = renderTemplateBody(provider);
  const { blocks } = parseBlocks(markdown);

  const page: Page = {
    frontMatter: buildFrontMatter(provider),
    blocks,
    jsonLd: buildProviderGraph(provider),
    needs: collectNeeds(markdown),
    sourceFile: TEMPLATE_FILE,
  };

  renderCache.set(provider.slug, page);
  return page;
}

export function allProviderUrls(): string[] {
  return getProfileProviders().map((provider) => `/providers/${provider.slug}`);
}

/* ------------------------------------------------------------------ */
/* URL mapping                                                         */
/* ------------------------------------------------------------------ */

let urlSet: Set<string> | undefined;

/** Every URL we emit is checked, so a template page never ships a dead link. */
function urlExists(url: string): boolean {
  if (!urlSet) urlSet = new Set(getAllUrls());
  return urlSet.has(url);
}

/**
 * Modality to service page, per the template notes. Anything absent here has
 * no page of its own and renders as plain text.
 */
const MODALITY_URLS: Record<string, string> = {
  "trauma therapy": "/therapy/trauma-therapy",
  "couples therapy": "/therapy/couples-therapy",
  "medication management": "/medication-management",
  "medical massage": "/wellness/massage",
  massage: "/wellness/massage",
  acupuncture: "/wellness/acupuncture",
  cupping: "/wellness/cupping",
  reiki: "/wellness/energy-work/reiki",
  iet: "/wellness/energy-work/iet",
  "energy work": "/wellness/energy-work",
  coaching: "/coaching",
  ifs: "/therapy/ifs",
  "parts work": "/therapy/ifs",
  somatic: "/therapy/somatic-therapy",
  "somatic therapy": "/therapy/somatic-therapy",
  "somatic experiencing": "/therapy/somatic-therapy",
  hypnotherapy: "/therapy/hypnotherapy",
  "family therapy": "/therapy/family-therapy",
  "child therapy": "/therapy/child-therapy",
  "individual therapy": "/therapy/individual-therapy",
};

/** Specialty wording varies row to row, so concerns match on the key phrase. */
const CONCERN_PATTERNS: [RegExp, string][] = [
  [/anxiety/i, "/concerns/anxiety"],
  [/depression/i, "/concerns/depression"],
  [/ptsd/i, "/concerns/ptsd"],
  [/adhd/i, "/concerns/adhd"],
  [/ocd|obsessive/i, "/concerns/ocd"],
  [/grief/i, "/concerns/grief-and-loss"],
  [/relationship|relational/i, "/concerns/relationship-issues"],
  [/postpartum|perinatal/i, "/concerns/postpartum-and-perinatal"],
  [/stress/i, "/concerns/stress-and-burnout"],
  [/life transitions|life changes/i, "/concerns/life-transitions"],
  [/self esteem/i, "/concerns/self-esteem"],
  [/bipolar/i, "/concerns/bipolar-disorder"],
  [/lgbtq/i, "/concerns/lgbtqia-affirming-therapy"],
  [/substance use|addiction/i, "/concerns/substance-use"],
  [/chronic pain|chronic illness/i, "/concerns/chronic-pain-and-illness"],
];

/**
 * The template notes name the modalities that have no page of their own (CBT,
 * psychodynamic, humanistic, mindfulness, acupressure, electrical stimulation,
 * deep tissue, trigger point). The massage and cupping variants are not on
 * that list: they are sections of the massage and cupping pages, so they link
 * there.
 */
const MODALITY_PATTERNS: [RegExp, string][] = [
  [/massage$/i, "/wellness/massage"],
  [/cupping/i, "/wellness/cupping"],
];

function modalityUrl(modality: string): string | undefined {
  const normalized = modality.trim().toLowerCase();
  const exact = MODALITY_URLS[normalized];
  if (exact) return exact;
  return MODALITY_PATTERNS.find(([pattern]) => pattern.test(normalized))?.[1];
}

interface ModalityLink {
  label: string;
  url: string;
}

/** Modalities that have a service page, in sheet order, deduplicated by URL. */
export function modalityLinks(provider: Provider): ModalityLink[] {
  const seen = new Set<string>();
  const links: ModalityLink[] = [];

  for (const modality of provider.modalities) {
    const url = modalityUrl(modality);
    if (!url || seen.has(url) || !urlExists(url)) continue;
    seen.add(url);
    links.push({ label: modality.trim(), url });
  }

  return links;
}

/** Concern pages matching this row's specialties, deduplicated. */
export function concernUrls(provider: Provider): string[] {
  const urls = new Set<string>();

  for (const specialty of provider.specialties) {
    for (const [pattern, url] of CONCERN_PATTERNS) {
      if (pattern.test(specialty) && urlExists(url)) urls.add(url);
    }
  }

  return [...urls];
}

/* ------------------------------------------------------------------ */
/* Template body                                                       */
/* ------------------------------------------------------------------ */

let templateBody: string | undefined;

/** The template body: front matter, template notes, and JSON fence removed. */
function readTemplateBody(): string {
  if (templateBody !== undefined) return templateBody;

  const raw = fs.readFileSync(path.join(CONTENT_ROOT, TEMPLATE_FILE), "utf8");
  const withoutFrontMatter = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const withoutNotes = withoutFrontMatter.replace(/<!--[\s\S]*?-->/g, "");
  const fence = withoutNotes.indexOf("```json");

  templateBody = (fence === -1 ? withoutNotes : withoutNotes.slice(0, fence)).trim();
  return templateBody;
}

function prose(items: string[]): string {
  return items.join(", ");
}

function substitutions(provider: Provider): Record<string, string> {
  return {
    slug: provider.slug,
    first_name: provider.first_name,
    last_name: provider.last_name,
    credentials: provider.credentials,
    title_line: provider.title_line,
    role: provider.role,
    pillars: prose(provider.pillars),
    specialties: prose(provider.specialties),
    modalities: prose(provider.modalities),
    age_groups: prose(provider.age_groups),
    locations: prose(provider.locations),
    formats: prose(provider.formats),
    headshot_url: provider.headshot_url,
    bio_p1: provider.bio_p1,
    bio_p2: provider.bio_p2,
    bullet_1: provider.bullets[0] ?? "",
    bullet_2: provider.bullets[1] ?? "",
    bullet_3: provider.bullets[2] ?? "",
    active: String(provider.active),
  };
}

function renderTemplateBody(provider: Provider): string {
  let text = readTemplateBody();

  text = renderOffices(text, provider);
  text = renderAreasOfFocus(text, provider);
  text = renderServices(text, provider);

  const values = substitutions(provider);
  text = text.replace(/\{\{([^}]+)\}\}/g, (_match, token: string) => values[token.trim()] ?? "");

  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Every locations cell still reads [NEEDS], so the cards marker comes out and
 * the template's own "[NEEDS: assign {first} to offices in the sheet]" stays.
 */
function renderOffices(text: string, provider: Provider): string {
  const cards = /^\[LOCATION CARDS: \{\{locations\}\}\]\r?\n\r?\n/m;
  return provider.locations.length
    ? text.replace(cards, `[LOCATION CARDS: ${provider.locations.join(", ")}]\n\n`)
    : text.replace(cards, "");
}

function renderAreasOfFocus(text: string, provider: Provider): string {
  const bullets = /^- \{\{bullet_1\}\}\r?\n- \{\{bullet_2\}\}\r?\n- \{\{bullet_3\}\}$/m;
  return text.replace(
    bullets,
    provider.bullets.length
      ? provider.bullets.map((bullet) => `- ${bullet}`).join("\n")
      : `[NEEDS: areas of focus for ${provider.first_name} in the sheet]`,
  );
}

/**
 * The template lists one linked item per modality that has a page. When a row
 * has no linked modality the list and the sentence that introduces it come
 * out together, rather than leaving a colon pointing at nothing.
 */
function renderServices(text: string, provider: Provider): string {
  const listLine = /^- \{\{modalities -> service URLs[^}]*\}\}\r?\n?/m;
  const intro = "{{first_name}} offers {{modalities}}. Learn more about each approach:";
  const links = modalityLinks(provider);

  if (!provider.modalities.length) {
    return text.replace(listLine, "").replace(`${intro}\n\n`, "");
  }

  if (!links.length) {
    return text.replace(listLine, "").replace(intro, "{{first_name}} offers {{modalities}}.");
  }

  return text.replace(
    listLine,
    `${links.map((link) => `- [${link.label}](${link.url})`).join("\n")}\n`,
  );
}

function collectNeeds(markdown: string): string[] {
  const found = new Set<string>();
  for (const match of markdown.matchAll(/\[NEEDS:?([^\]]*)\]/g)) {
    found.add(match[1].replace(/^:/, "").trim());
  }
  return [...found];
}

/* ------------------------------------------------------------------ */
/* Title and meta, following the template's rules                      */
/* ------------------------------------------------------------------ */

const SUFFIX = " | Pathways Within";

function nameWithCredentials(provider: Provider, credentials: string): string {
  const name = `${provider.first_name} ${provider.last_name}`;
  return credentials ? `${name}, ${credentials}` : name;
}

function firstCredential(credentials: string): string {
  return credentials.split(",")[0].trim();
}

/**
 * "Chief Operating Officer and Licensed Clinical Social Worker" shortens to
 * "Chief Operating Officer", but "Licensed Marriage and Family Therapist"
 * cannot shorten to "Licensed Marriage", so the first half only counts when it
 * ends on a job noun.
 */
const JOB_NOUN =
  /\b(officer|director|worker|therapist|counselor|practitioner|coach|leader|acupuncturist|manager|founder|supervisor|clinician|specialist|nurse)$/i;

function andPrefix(titleLine: string): string {
  const first = titleLine.split(/\s+and\s+/)[0].trim();
  return first && first !== titleLine.trim() && JOB_NOUN.test(first) ? first : "";
}

/** Whole phrases only: a title never ships half of a supplied job title. */
function titlePhrases(provider: Provider): string[] {
  const phrases = [
    provider.title_line.split(",")[0].trim(),
    provider.role.trim(),
    andPrefix(provider.title_line),
    provider.title_line.trim(),
  ];

  return [...new Set(phrases.map((phrase) => phrase.replace(/\|/g, "").trim()).filter(Boolean))];
}

/**
 * Pattern is "{first} {last}, {credentials} | Pathways Within". Over 60 drops
 * to the first credential; under 50 appends the role or title line before the
 * pipe. The suffix carries the only pipe in the title.
 */
export function providerTitle(provider: Provider): string {
  const full = `${nameWithCredentials(provider, provider.credentials)}${SUFFIX}`;
  const short = `${nameWithCredentials(provider, firstCredential(provider.credentials))}${SUFFIX}`;
  const base =
    full.length > TITLE_MAX && short.length <= TITLE_MAX
      ? nameWithCredentials(provider, firstCredential(provider.credentials))
      : nameWithCredentials(provider, provider.credentials);

  const plain = `${base}${SUFFIX}`;
  if (plain.length >= TITLE_MIN && plain.length <= TITLE_MAX) return plain;

  const candidates = titlePhrases(provider).map((phrase) => `${base}, ${phrase}${SUFFIX}`);
  const inWindow = candidates.find(
    (candidate) => candidate.length >= TITLE_MIN && candidate.length <= TITLE_MAX,
  );
  if (inWindow) return inWindow;

  if (plain.length > TITLE_MAX) return plain;

  const underMax = candidates
    .filter((candidate) => candidate.length <= TITLE_MAX)
    .sort((a, b) => b.length - a.length)[0];

  return underMax ?? plain;
}

interface MetaShape {
  credentials: string;
  job: string;
  telehealth: boolean;
  /** How many specialties the "Works with" sentence names: 0, 1, or 2. */
  specialties: 0 | 1 | 2;
}

function composeMeta(provider: Provider, shape: MetaShape): string {
  const opener = `${nameWithCredentials(provider, shape.credentials)}, is a ${shape.job} at Pathways Within on Long Island.`;
  const ages = prose(provider.age_groups);
  const [first, second] = provider.specialties;

  let worksWith = `Works with ${ages}.`;
  if (shape.specialties === 2 && first && second) worksWith = `Works with ${ages} on ${first} and ${second}.`;
  if (shape.specialties === 1 && first) worksWith = `Works with ${ages} on ${first}.`;

  const parts = [opener, worksWith];
  if (shape.telehealth) parts.push("In person and by telehealth.");
  parts.push("Book a 360 intake.");

  return parts.join(" ");
}

/**
 * 140 to 155 characters. Over 155 drops "In person and by telehealth." first,
 * then shortens the title line to the role. Under 140 names the first two
 * specialties, or the first one where two overshoot. Rows whose formats do not
 * include telehealth never claim it.
 */
export function providerMeta(provider: Provider): string {
  const telehealth = provider.formats.some((format) => /telehealth/i.test(format));
  const jobs = [
    provider.title_line,
    andPrefix(provider.title_line),
    provider.title_line.split(",")[0].trim(),
    provider.role,
  ].filter(Boolean);
  const shapes: MetaShape[] = [];

  for (const credentials of [...new Set([provider.credentials, firstCredential(provider.credentials)])]) {
    for (const nextJob of [...new Set(jobs)]) {
      for (const nextTelehealth of telehealth ? [true, false] : [false]) {
        for (const count of [0, 2, 1] as const) {
          shapes.push({ credentials, job: nextJob, telehealth: nextTelehealth, specialties: count });
        }
      }
    }
  }

  const candidates = shapes.map((shape) => composeMeta(provider, shape));
  const inWindow = candidates.find(
    (candidate) => candidate.length >= META_MIN && candidate.length <= META_MAX,
  );
  if (inWindow) return inWindow;

  return [...candidates].sort((a, b) => metaDistance(a) - metaDistance(b))[0];
}

function metaDistance(value: string): number {
  if (value.length < META_MIN) return META_MIN - value.length;
  if (value.length > META_MAX) return value.length - META_MAX;
  return 0;
}

/* ------------------------------------------------------------------ */
/* Front matter                                                        */
/* ------------------------------------------------------------------ */

const PILLARS: Pillar[] = ["wisdom", "wellness", "medication"];

/** One pillar is the page's pillar; a provider on several is filed as none. */
function primaryPillar(provider: Provider): Pillar {
  if (provider.pillars.length !== 1) return "none";
  const pillar = provider.pillars[0].trim().toLowerCase() as Pillar;
  return PILLARS.includes(pillar) ? pillar : "none";
}

function heroImage(provider: Provider): string {
  const alt = `${nameWithCredentials(provider, provider.credentials)}, ${provider.title_line} at Pathways Within`;
  return provider.headshot_url
    ? `${provider.headshot_url} ${alt}`
    : `[NEEDS: headshot for ${provider.first_name} ${provider.last_name}] ${alt}`;
}

function buildFrontMatter(provider: Provider): FrontMatter {
  return {
    url: `/providers/${provider.slug}`,
    title: providerTitle(provider),
    meta: providerMeta(provider),
    h1: nameWithCredentials(provider, provider.credentials),
    page_type: "provider",
    pillar: primaryPillar(provider),
    target_query: `${provider.first_name} ${provider.last_name} ${provider.credentials}`.trim(),
    author: AUTHOR,
    reviewer: AUTHOR,
    last_reviewed: LAST_REVIEWED,
    index: provider.active,
    nav: "none",
    related_services: modalityLinks(provider).map((link) => link.url),
    related_concerns: concernUrls(provider),
    locations: provider.locations,
    providers: [provider.slug],
    hero_image: heroImage(provider),
  };
}

/* ------------------------------------------------------------------ */
/* JSON LD                                                             */
/* ------------------------------------------------------------------ */

type JsonObject = Record<string, unknown>;

/** Keeps [NEEDS] markers and empty cells out of the graph entirely. */
function put(target: JsonObject, key: string, value: string | undefined): void {
  if (!value) return;
  if (/\[NEEDS/i.test(value)) return;
  target[key] = value;
}

export function buildProviderGraph(provider: Provider): JsonObject {
  const url = `${SITE_ORIGIN}/providers/${provider.slug}`;
  const personId = `${url}#person`;
  const authorId = `${SITE_ORIGIN}/providers/${AUTHOR_SLUG}#person`;
  const title = providerTitle(provider);

  const person: JsonObject = {
    "@type": "Person",
    "@id": personId,
    name: `${provider.first_name} ${provider.last_name}`,
    givenName: provider.first_name,
    familyName: provider.last_name,
  };

  put(person, "honorificSuffix", provider.credentials);
  put(person, "jobTitle", provider.title_line);
  put(person, "description", provider.bio_p1);
  put(person, "image", provider.headshot_url);
  person.url = url;
  person.worksFor = { "@id": `${SITE_ORIGIN}/#org` };

  if (provider.title_line) {
    person.hasCredential = [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: `${provider.title_line}, New York`,
      },
    ];
  }

  const knowsAbout = provider.specialties.filter((item) => item && !/\[NEEDS/i.test(item));
  if (knowsAbout.length) person.knowsAbout = knowsAbout;

  // workLocation stays out while every locations cell reads [NEEDS].
  const workLocation = provider.locations.map((slug) => ({
    "@id": `${SITE_ORIGIN}/locations/${slug}#place`,
  }));
  if (workLocation.length) person.workLocation = workLocation;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Providers", item: `${SITE_ORIGIN}/providers` },
          {
            "@type": "ListItem",
            position: 3,
            name: `${provider.first_name} ${provider.last_name}`,
            item: url,
          },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        author: { "@id": authorId },
        reviewedBy: { "@id": authorId },
        lastReviewed: LAST_REVIEWED,
        inLanguage: "en-US",
      },
      person,
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Diagnostics for BUILD-NOTES                                         */
/* ------------------------------------------------------------------ */

export interface ProviderSeoRow {
  slug: string;
  source: "template" | "override";
  title: string;
  titleLength: number;
  meta: string;
  metaLength: number;
  titleInWindow: boolean;
  metaInWindow: boolean;
}

/** Title and meta character counts for every provider profile. */
export function auditProviderSeo(): ProviderSeoRow[] {
  return getProfileProviders().map((provider) => {
    const url = `/providers/${provider.slug}`;
    const override = getPageByUrl(url);
    const page = override ?? renderProviderTemplate(provider);
    const { title, meta } = page.frontMatter;

    return {
      slug: provider.slug,
      source: override ? "override" : "template",
      title,
      titleLength: title.length,
      meta,
      metaLength: meta.length,
      titleInWindow: title.length >= TITLE_MIN && title.length <= TITLE_MAX,
      metaInWindow: meta.length >= META_MIN && meta.length <= META_MAX,
    };
  });
}
