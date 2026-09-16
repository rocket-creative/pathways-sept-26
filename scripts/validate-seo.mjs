/**
 * SEO and deploy contract check. Read only against content/ and vercel.json,
 * safe to run while other agents work, and safe to run in CI before the build.
 *
 *   node --experimental-strip-types scripts/validate-seo.mjs
 *
 * Fatal (exit 1):
 *   - title 50 to 60 characters, meta 140 to 155, h1 under 70 and present
 *   - title, meta, and h1 unique across every URL the site emits
 *   - every internal link target exists in the URL map
 *   - every page graph builds, prunes, and serialises with no NEEDS marker left
 *   - sitemaps contain only indexable, real URLs
 *   - vercel.json redirects resolve to real pages and cannot loop
 *
 * Warnings (reported, exit 0): checks that belong to another owner, such as the
 * titles the provider template generates from the sheet.
 */
import { register } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

register(new URL("./alias-hook.mjs", import.meta.url));

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(ROOT);

const content = await import("../lib/content.ts");
const schema = await import("../lib/schema.ts");
const sitemap = await import("../app/sitemap-shared.ts");
const providers = await import("../lib/providers.ts");

const TITLE_RANGE = [50, 60];
const META_RANGE = [140, 155];
const H1_MAX = 70;

const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

/* ------------------------------------------------------------------ */
/* The page set                                                        */
/* ------------------------------------------------------------------ */

const isTemplateUrl = (url) => !url || url.includes("{");

/** Pages authored as files, minus the provider template row. */
const authored = content.getAllPages().filter((page) => !isTemplateUrl(page.frontMatter.url));

/** Provider profiles rendered from the sheet through the template. */
const generated = [];
for (const provider of content.getProfileProviders()) {
  const url = `/providers/${provider.slug}`;
  if (content.getPageByUrl(url)) continue;
  const page = providers.getProviderPage(url);
  if (!page) {
    fail(`providers: getProviderPage("${url}") returned nothing for an active provider.`);
    continue;
  }
  generated.push(page);
}

const allPages = [...authored, ...generated];

/** Every URL a link is allowed to point at. */
const validUrls = new Set(content.getAllUrls().filter((url) => !isTemplateUrl(url)));

/* ------------------------------------------------------------------ */
/* 1. Titles, metas, h1s                                               */
/* ------------------------------------------------------------------ */

const counts = {
  authored: { title: 0, meta: 0, h1: 0 },
  generated: { title: 0, meta: 0, h1: 0 },
};

function checkLengths(page, tally, report) {
  const { title = "", meta = "", h1 = "", url } = page.frontMatter;

  if (title.length < TITLE_RANGE[0] || title.length > TITLE_RANGE[1]) {
    tally.title += 1;
    report(`${url}: title ${title.length} chars (want ${TITLE_RANGE[0]} to ${TITLE_RANGE[1]}) "${title}"`);
  }
  if (meta.length < META_RANGE[0] || meta.length > META_RANGE[1]) {
    tally.meta += 1;
    report(`${url}: meta ${meta.length} chars (want ${META_RANGE[0]} to ${META_RANGE[1]})`);
  }
  if (!h1 || h1.length >= H1_MAX) {
    tally.h1 += 1;
    report(`${url}: h1 ${h1.length} chars (want 1 to ${H1_MAX - 1}) "${h1}"`);
  }
  if (h1 && title && h1 === title) {
    warn(`${url}: h1 is identical to the title (SPEC section 5 wants them different).`);
  }
}

for (const page of authored) checkLengths(page, counts.authored, fail);
for (const page of generated) {
  checkLengths(page, counts.generated, (message) =>
    warn(`sheet driven provider page, owner providers agent: ${message}`),
  );
}

const seen = { title: new Map(), meta: new Map(), h1: new Map() };
for (const page of allPages) {
  for (const field of ["title", "meta", "h1"]) {
    const value = page.frontMatter[field];
    if (!value) continue;
    const previous = seen[field].get(value);
    if (previous) {
      fail(`${page.frontMatter.url}: duplicate ${field} shared with ${previous}`);
    } else {
      seen[field].set(value, page.frontMatter.url);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 2. Internal links                                                   */
/* ------------------------------------------------------------------ */

function collectHrefs(nodes, out) {
  for (const node of nodes) {
    if (node.kind === "link") {
      if (!node.external) out.push(node.href);
      collectHrefs(node.children, out);
    } else if (node.children) {
      collectHrefs(node.children, out);
    }
  }
  return out;
}

/** Walks blocks, including nested ones such as the quiz widget's children. */
function collectBlockHrefs(blocks, out) {
  for (const block of blocks) {
    if (block.kind === "cta") out.push(block.href);
    if (block.inline) collectHrefs(block.inline, out);
    if (block.items) for (const item of block.items) collectHrefs(item, out);
    if (Array.isArray(block.blocks)) collectBlockHrefs(block.blocks, out);
  }
  return out;
}

let linkCount = 0;
for (const page of allPages) {
  const hrefs = collectBlockHrefs(page.blocks, []);

  for (const href of hrefs) {
    linkCount += 1;
    if (href.startsWith("#")) continue;
    if (!href.startsWith("/")) {
      fail(`${page.frontMatter.url}: internal link "${href}" is not root relative.`);
      continue;
    }
    const target = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
    if (!validUrls.has(target)) {
      fail(`${page.frontMatter.url}: link target "${href}" is not in the URL map.`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 3. Graphs                                                           */
/* ------------------------------------------------------------------ */

let graphNodes = 0;
for (const page of allPages) {
  try {
    const graph = schema.buildPageGraph(page);
    for (const node of graph) {
      JSON.parse(JSON.stringify(node));
      graphNodes += 1;
    }
  } catch (error) {
    fail(`${page.frontMatter.url}: graph rejected: ${error.message}`);
  }
}

/* ------------------------------------------------------------------ */
/* 4. Sitemaps                                                         */
/* ------------------------------------------------------------------ */

const grouped = sitemap.sitemapEntries();
const noindexUrls = new Set(
  content
    .getAllPages()
    .filter((page) => !page.frontMatter.index)
    .map((page) => page.frontMatter.url),
);

const sitemapUrls = new Set();
let sitemapTotal = 0;
let missingLastmod = 0;

for (const section of sitemap.SITEMAP_SECTIONS) {
  for (const entry of grouped[section]) {
    sitemapTotal += 1;
    if (!entry.loc.startsWith(`${content.SITE_ORIGIN}/`) && entry.loc !== `${content.SITE_ORIGIN}/`) {
      fail(`sitemap-${section}: "${entry.loc}" is not an absolute production URL.`);
      continue;
    }
    const url = entry.loc.slice(content.SITE_ORIGIN.length) || "/";
    if (sitemapUrls.has(url)) fail(`sitemap: "${url}" appears in more than one section file.`);
    sitemapUrls.add(url);
    if (!validUrls.has(url)) fail(`sitemap-${section}: "${url}" is not a URL the site emits.`);
    if (noindexUrls.has(url)) fail(`sitemap-${section}: "${url}" is index: false and must be excluded.`);
    if (!entry.lastmod) missingLastmod += 1;
  }
}

for (const url of noindexUrls) {
  if (sitemapUrls.has(url)) fail(`sitemap: noindex URL "${url}" leaked into a sitemap.`);
}

const indexXml = sitemap.sitemapIndexXml();
for (const section of sitemap.SITEMAP_SECTIONS) {
  if (!indexXml.includes(sitemap.sectionUrl(section))) {
    fail(`sitemap.xml index does not reference sitemap-${section}.xml`);
  }
}

/* ------------------------------------------------------------------ */
/* 5. vercel.json                                                      */
/* ------------------------------------------------------------------ */

let vercel = null;
try {
  vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
} catch (error) {
  fail(`vercel.json: ${error.message}`);
}

let redirectCount = 0;
if (vercel) {
  if (vercel.cleanUrls !== true) fail("vercel.json: cleanUrls must be true.");
  if (vercel.trailingSlash !== false) fail("vercel.json: trailingSlash must be false.");

  const required = [
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "X-Frame-Options",
    "Permissions-Policy",
  ];
  const present = new Set(
    (vercel.headers ?? []).flatMap((rule) => (rule.headers ?? []).map((header) => header.key)),
  );
  for (const key of required) {
    if (!present.has(key)) fail(`vercel.json: missing security header ${key}`);
  }
  if (present.has("Content-Security-Policy")) {
    warn("vercel.json: a CSP is set. Confirm it allows link.trustdrivencare.com iframes and GSAP.");
  }

  const csvRows = content.getRedirects();
  const expected = csvRows.filter((row) => row.status !== 200);
  const sources = new Set((vercel.redirects ?? []).map((entry) => entry.source));
  redirectCount = (vercel.redirects ?? []).length;

  for (const row of expected) {
    const sourcePath = new URL(row.from).pathname;
    if (!sources.has(sourcePath)) {
      fail(`vercel.json: redirects.csv row "${row.from}" has no redirect for path ${sourcePath}`);
    }
  }
  for (const row of csvRows.filter((row) => row.status === 200)) {
    const sourcePath = new URL(row.from).pathname;
    const conflicting = (vercel.redirects ?? []).find(
      (entry) => entry.source === sourcePath && !entry.has,
    );
    if (conflicting) {
      fail(
        `vercel.json: ${sourcePath} is a status 200 row in redirects.csv but has an unconditional redirect, which would loop.`,
      );
    }
  }

  for (const entry of vercel.redirects ?? []) {
    const destination = String(entry.destination);
    const destPath = destination.startsWith("http") ? new URL(destination).pathname : destination;
    if (destPath.includes(":")) continue;
    const target = destPath.replace(/\/$/, "") || "/";
    if (!validUrls.has(target)) {
      fail(`vercel.json: redirect ${entry.source} points at "${destination}", which is not a real page.`);
    }
    if (entry.source === destPath && !entry.has) {
      fail(`vercel.json: redirect ${entry.source} points at itself with no host condition, so it loops.`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const line = "-".repeat(72);
console.log(line);
console.log("Pathways Within SEO and deploy contract");
console.log(line);
console.log(`pages checked                ${allPages.length} (${authored.length} authored, ${generated.length} from the sheet)`);
console.log(`internal links checked       ${linkCount}`);
console.log(`schema nodes emitted         ${graphNodes}`);
console.log(`sitemap URLs                 ${sitemapTotal} across ${sitemap.SITEMAP_SECTIONS.length} section files`);
for (const section of sitemap.SITEMAP_SECTIONS) {
  console.log(`  sitemap-${section}.xml${" ".repeat(Math.max(1, 20 - section.length))}${grouped[section].length}`);
}
console.log(`sitemap URLs without lastmod ${missingLastmod}`);
console.log(`noindex URLs held back       ${noindexUrls.size} (${[...noindexUrls].join(", ") || "none"})`);
console.log(`vercel.json redirects        ${redirectCount}`);
console.log(
  `title length failures        ${counts.authored.title} authored, ${counts.generated.title} from the sheet`,
);
console.log(
  `meta length failures         ${counts.authored.meta} authored, ${counts.generated.meta} from the sheet`,
);
console.log(
  `h1 length failures           ${counts.authored.h1} authored, ${counts.generated.h1} from the sheet`,
);
console.log(
  `duplicate title, meta, h1    ${failures.filter((message) => message.includes("duplicate")).length}`,
);

if (warnings.length) {
  console.log(`\n${warnings.length} warning${warnings.length === 1 ? "" : "s"}:`);
  for (const message of warnings) console.log(`  - ${message}`);
}

if (failures.length) {
  console.log(`\n${failures.length} failure${failures.length === 1 ? "" : "s"}:`);
  for (const message of failures) console.log(`  x ${message}`);
  console.log(`\n${line}\nFAIL\n${line}`);
  process.exit(1);
}

console.log(`\n${line}\nPASS\n${line}`);
