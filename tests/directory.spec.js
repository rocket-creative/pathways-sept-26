// @ts-check
const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");
const { parse } = require("csv-parse/sync");

/**
 * Provider directory audit (01-cursor-audit-prompt.md, Part 2).
 * The sheet is the source of truth for what the page must contain.
 */
const SHEET = path.join(__dirname, "..", "content", "data", "providers-sheet.csv");
const rows = parse(fs.readFileSync(SHEET, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
});

const isAdmin = (row) => /admin|front desk/i.test(row.role ?? "");
const isActive = (row) => row.active === "true";
const split = (value) =>
  (value ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

const profileSlugs = rows.filter((row) => isActive(row) && !isAdmin(row)).map((row) => row.slug);
const lgbtqSlugs = rows
  .filter((row) => isActive(row) && !isAdmin(row))
  .filter((row) => split(row.specialties).some((s) => /^LGBTQ(IA)?\+/i.test(s)))
  .map((row) => row.slug);

const DIRECTORY_READY = ".provider-directory[data-directory-ready='true']";

/** Slugs of the cards a reader can currently see in the directory. */
async function visibleSlugs(page) {
  return page.evaluate(() => {
    return [...document.querySelectorAll(".provider-directory .provider-card")]
      .filter((card) => {
        if (card.hidden) return false;
        const cs = getComputedStyle(card);
        return cs.display !== "none" && cs.visibility !== "hidden";
      })
      .map((card) => card.getAttribute("data-slug"));
  });
}

test.describe("provider directory", () => {
  test("(a) raw HTML of /providers links every active, non admin slug", async ({ request }) => {
    const response = await request.get("/providers");
    expect(response.ok()).toBeTruthy();
    const html = await response.text();

    expect(profileSlugs.length).toBeGreaterThan(0);
    const missing = profileSlugs.filter((slug) => !html.includes(`href="/providers/${slug}"`));
    expect(missing, "slugs with no link in the initial HTML").toEqual([]);
  });

  test("(b) Tia Baumohl appears under ?pillar=wellness and under ?pillar=wisdom, once each", async ({
    page,
  }) => {
    for (const pillar of ["wellness", "wisdom"]) {
      await page.goto(`/providers?pillar=${pillar}`);
      await page.waitForSelector(DIRECTORY_READY);
      const slugs = await visibleSlugs(page);
      expect(slugs, `?pillar=${pillar} shows tia-baumohl`).toContain("tia-baumohl");
      expect(slugs.filter((slug) => slug === "tia-baumohl"), `one card for tia-baumohl under ${pillar}`).toHaveLength(1);
    }

    // The "all" view has her exactly once too.
    await page.goto("/providers");
    await page.waitForSelector(DIRECTORY_READY);
    const all = await visibleSlugs(page);
    expect(all.filter((slug) => slug === "tia-baumohl")).toHaveLength(1);
    expect(new Set(all).size, "no duplicated cards in the all view").toBe(all.length);
  });

  test("(c) ?specialty=LGBTQ returns at least the rows tagged LGBTQ+ and LGBTQIA+", async ({ page }) => {
    expect(lgbtqSlugs.length, "sheet has LGBTQ tagged rows").toBeGreaterThan(0);
    await page.goto("/providers?specialty=LGBTQ");
    await page.waitForSelector(DIRECTORY_READY);
    const slugs = await visibleSlugs(page);
    for (const slug of lgbtqSlugs) expect(slugs, `${slug} shown for specialty=LGBTQ`).toContain(slug);
  });

  test("(c2) alias pairs: addiction also returns substance use, ADHD returns adult ADHD", async ({ page }) => {
    const substanceUse = rows
      .filter((row) => isActive(row) && !isAdmin(row))
      .filter((row) => split(row.specialties).some((s) => /substance use|addiction/i.test(s)))
      .map((row) => row.slug);
    const adhd = rows
      .filter((row) => isActive(row) && !isAdmin(row))
      .filter((row) => split(row.specialties).some((s) => /adhd/i.test(s)))
      .map((row) => row.slug);

    await page.goto("/providers?specialty=addiction");
    await page.waitForSelector(DIRECTORY_READY);
    let slugs = await visibleSlugs(page);
    for (const slug of substanceUse) expect(slugs, `${slug} shown for specialty=addiction`).toContain(slug);

    await page.goto("/providers?specialty=ADHD");
    await page.waitForSelector(DIRECTORY_READY);
    slugs = await visibleSlugs(page);
    for (const slug of adhd) expect(slugs, `${slug} shown for specialty=ADHD`).toContain(slug);
  });

  test("(c3) AND across types, OR within a type, cards stay in the DOM when filtered", async ({ page }) => {
    await page.goto("/providers?pillar=wisdom&specialty=anxiety,depression");
    await page.waitForSelector(DIRECTORY_READY);
    const slugs = await visibleSlugs(page);

    const expected = rows
      .filter((row) => isActive(row) && !isAdmin(row))
      .filter((row) => split(row.pillars).some((p) => p.toLowerCase() === "wisdom"))
      .filter((row) => split(row.specialties).some((s) => /anxiety|depression/i.test(s)))
      .map((row) => row.slug)
      .sort();
    expect([...slugs].sort()).toEqual(expected);

    // Every profile card is still in the DOM with its link, only hidden.
    const inDom = await page.evaluate(() =>
      [...document.querySelectorAll(".provider-directory .provider-card")].map((card) => ({
        slug: card.getAttribute("data-slug"),
        href: card.querySelector("a")?.getAttribute("href") ?? null,
      })),
    );
    expect(inDom.map((card) => card.slug).sort()).toEqual([...profileSlugs].sort());
    for (const card of inDom) expect(card.href).toBe(`/providers/${card.slug}`);
  });

  test("(d) canonical on /providers?pillar=wellness is /providers with no query", async ({ page }) => {
    await page.goto("/providers?pillar=wellness");
    const canonical = await page.getAttribute("link[rel='canonical']", "href");
    expect(canonical).toBe("https://pathwayswithinwellness.com/providers");
  });

  test("(d2) choosing a filter writes it to the query string and reload restores it", async ({ page }) => {
    await page.goto("/providers");
    await page.waitForSelector(DIRECTORY_READY);
    await page.selectOption(".provider-directory select[name='pillars']", "wellness");
    await expect.poll(() => new URL(page.url()).searchParams.get("pillar")).toBe("wellness");

    await page.reload();
    await page.waitForSelector(DIRECTORY_READY);
    await expect(page.locator(".provider-directory select[name='pillars']")).toHaveValue("wellness");
    const slugs = await visibleSlugs(page);
    expect(slugs).toContain("tia-baumohl");
    expect(slugs).not.toContain("joe-bush");
  });

  test("(e) no card for gloria-saladino links to a profile page", async ({ page, request }) => {
    const html = await (await request.get("/providers")).text();
    expect(html).not.toContain('href="/providers/gloria-saladino"');
    expect(html, "admin strip names Gloria").toContain("Gloria Saladino");

    await page.goto("/providers");
    await page.waitForSelector(DIRECTORY_READY);
    const state = await page.evaluate(() => ({
      links: document.querySelectorAll("a[href='/providers/gloria-saladino']").length,
      cards: document.querySelectorAll(".provider-card[data-slug='gloria-saladino']").length,
      inAdminStrip: Boolean(
        [...document.querySelectorAll(".provider-directory__admin li")].find((li) =>
          li.textContent?.includes("Gloria Saladino"),
        ),
      ),
      adminStripLinks: document.querySelectorAll(".provider-directory__admin a").length,
    }));
    expect(state.links).toBe(0);
    expect(state.cards).toBe(0);
    expect(state.inAdminStrip).toBe(true);
    expect(state.adminStripLinks).toBe(0);

    const profile = await request.get("/providers/gloria-saladino");
    expect(profile.status(), "no profile page for an admin row").toBe(404);
  });
});
