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
const isFounder = (row) => /^founder$/i.test((row.role ?? "").trim());
const isSpecialist = (row) => row.slug === "tia-baumohl" || row.slug === "tiffany-roberts";
const isActive = (row) => row.active === "true";
const inDirectory = (row) => isActive(row) && !isAdmin(row) && !isFounder(row) && !isSpecialist(row);
const split = (value) =>
  (value ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

const profileSlugs = rows.filter((row) => isActive(row) && !isAdmin(row)).map((row) => row.slug);
const directorySlugs = rows.filter(inDirectory).map((row) => row.slug);
const lgbtqSlugs = rows
  .filter(inDirectory)
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

  test("(b) Tia and Tiffany sit in Specialists, not the clinician directory", async ({ page }) => {
    for (const pillar of ["wellness", "wisdom", "medication"]) {
      await page.goto(`/providers?pillar=${pillar}`);
      await page.waitForSelector(DIRECTORY_READY);
      const slugs = await visibleSlugs(page);
      expect(slugs, `?pillar=${pillar} keeps Tia out of clinicians`).not.toContain("tia-baumohl");
      expect(slugs, `?pillar=${pillar} keeps Tiffany out of clinicians`).not.toContain("tiffany-roberts");
    }

    await page.goto("/providers");
    await page.waitForSelector(DIRECTORY_READY);
    const all = await visibleSlugs(page);
    expect(all).not.toContain("tia-baumohl");
    expect(all).not.toContain("tiffany-roberts");
    expect(new Set(all).size, "no duplicated cards in the all view").toBe(all.length);
    await expect(page.getByRole("heading", { name: /Collaborative Specialists/ })).toBeVisible();
    await expect(page.locator("a[href='/providers/tia-baumohl']").first()).toBeVisible();
    await expect(page.locator("a[href='/providers/tiffany-roberts']").first()).toBeVisible();
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
      .filter(inDirectory)
      .filter((row) => split(row.specialties).some((s) => /substance use|addiction/i.test(s)))
      .map((row) => row.slug);
    const adhd = rows
      .filter(inDirectory)
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
      .filter(inDirectory)
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
    expect(inDom.map((card) => card.slug).sort()).toEqual([...directorySlugs].sort());
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

/**
 * Free text search in the directory (lib/provider-filter.ts matchesQuery).
 * The field is the one <input type="search" name="q"> in the filter form.
 */
const SEARCH_INPUT = ".provider-directory input[type='search'][name='q']";

/** The sheet columns the search reads, joined the way lib/provider-filter.ts joins them. */
const sheetSearchText = (row) =>
  [
    row.first_name,
    row.last_name,
    row.credentials,
    row.title_line,
    row.role,
    row.specialties,
    row.modalities,
    row.age_groups,
    row.formats,
    row.locations,
    row.bullet_1,
  ]
    .join(" | ")
    .toLowerCase();

/** Active profile rows whose searched text contains `word`, sorted by slug. */
const slugsMentioning = (word) =>
  rows
    .filter(inDirectory)
    .filter((row) => sheetSearchText(row).includes(word.toLowerCase()))
    .map((row) => row.slug)
    .sort();

test.describe("provider directory text search", () => {
  test("(f) typing a surname shows only that provider's card", async ({ page }) => {
    // A surname no other searched field (title, role, facets, bullet) repeats.
    const surname = "Squicciarini";
    const expected = rows
      .filter(inDirectory)
      .filter((row) => row.last_name === surname)
      .map((row) => row.slug);
    expect(expected, "sheet has exactly one row with that surname").toHaveLength(1);

    await page.goto("/providers");
    await page.waitForSelector(DIRECTORY_READY);
    expect(await visibleSlugs(page)).toHaveLength(directorySlugs.length);

    await page.fill(SEARCH_INPUT, surname);
    await expect.poll(() => visibleSlugs(page)).toEqual(expected);
    await expect(page.locator(".provider-directory__status")).toHaveText(
      `Showing 1 of ${directorySlugs.length} providers`,
    );

    // The query is in the URL, as ?q=, and nothing else is set.
    await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe(surname);
    expect([...new URL(page.url()).searchParams.keys()]).toEqual(["q"]);

    // Enter does nothing: no navigation (a real submit would add the six
    // select names to the URL), still one card.
    await page.press(SEARCH_INPUT, "Enter");
    await page.waitForTimeout(300);
    expect(new URL(page.url()).pathname).toBe("/providers");
    expect([...new URL(page.url()).searchParams.keys()]).toEqual(["q"]);
    expect(await visibleSlugs(page)).toEqual(expected);

    // Every other card is still in the DOM with its link, only hidden.
    const inDom = await page.evaluate(() =>
      [...document.querySelectorAll(".provider-directory .provider-card")].map((card) =>
        card.getAttribute("data-slug"),
      ),
    );
    expect(inDom.sort()).toEqual([...directorySlugs].sort());
  });

  test("(f2) /providers?q=acupuncture restores the query and shows leonard-ma", async ({ page }) => {
    await page.goto("/providers?q=acupuncture");
    await page.waitForSelector(DIRECTORY_READY);

    await expect(page.locator(SEARCH_INPUT)).toHaveValue("acupuncture");
    const slugs = await visibleSlugs(page);
    expect(slugs).toContain("leonard-ma");

    // Everyone shown really carries the word somewhere the search reads.
    expect([...slugs].sort()).toEqual(slugsMentioning("acupuncture"));
    expect(slugs).not.toContain("joe-bush");

    // A query counts as a filter: the Clear button is offered.
    await expect(page.locator(".provider-directory__clear")).toBeVisible();
  });

  test("(f3) clearing the query restores every card and the clean URL", async ({ page }) => {
    await page.goto("/providers?q=acupuncture");
    await page.waitForSelector(DIRECTORY_READY);
    expect((await visibleSlugs(page)).length).toBeLessThan(directorySlugs.length);

    // Emptying the field brings everyone back and drops ?q=.
    await page.fill(SEARCH_INPUT, "");
    await expect.poll(async () => (await visibleSlugs(page)).length).toBe(directorySlugs.length);
    await expect.poll(() => new URL(page.url()).search).toBe("");
    await expect(page.locator(".provider-directory__clear")).toHaveCount(0);

    // The Clear button does the same when a query and a facet are both set.
    await page.goto("/providers?q=acupuncture&pillar=wellness");
    await page.waitForSelector(DIRECTORY_READY);
    await page.click(".provider-directory__clear");
    await expect.poll(async () => (await visibleSlugs(page)).length).toBe(directorySlugs.length);
    await expect(page.locator(SEARCH_INPUT)).toHaveValue("");
    await expect(page.locator(".provider-directory select[name='pillars']")).toHaveValue("");
    expect(new URL(page.url()).search).toBe("");
  });

  test("(f4) query and facet AND together, and the alias map applies to typed words", async ({ page }) => {
    // "addiction" must find the rows tagged "substance use" (SPECIALTY_ALIASES).
    const substanceUse = rows
      .filter(inDirectory)
      .filter((row) => split(row.specialties).some((s) => /substance use|addiction/i.test(s)))
      .map((row) => row.slug);
    expect(substanceUse.length).toBeGreaterThan(0);

    await page.goto("/providers?q=addiction");
    await page.waitForSelector(DIRECTORY_READY);
    const slugs = await visibleSlugs(page);
    for (const slug of substanceUse) expect(slugs, `${slug} shown for q=addiction`).toContain(slug);

    // A query that matches nobody in the chosen pillar shows nobody, and the
    // status line says so.
    await page.goto("/providers?q=acupuncture&pillar=wisdom");
    await page.waitForSelector(DIRECTORY_READY);
    const wisdom = new Set(
      rows
        .filter(inDirectory)
        .filter((row) => split(row.pillars).some((p) => p.toLowerCase() === "wisdom"))
        .map((row) => row.slug),
    );
    const none = slugsMentioning("acupuncture").filter((slug) => wisdom.has(slug));
    expect(none, "no wisdom pillar acupuncturist in the sheet").toHaveLength(0);
    expect(await visibleSlugs(page)).toEqual([]);
    await expect(page.locator(".provider-directory__status")).toHaveText(
      `Showing 0 of ${directorySlugs.length} providers`,
    );
  });

  test("(f5) a short surname matches that person, not words that contain it", async ({ page }) => {
    await page.goto("/providers?q=Ma");
    await page.waitForSelector(DIRECTORY_READY);
    expect(await visibleSlugs(page)).toEqual(["leonard-ma"]);

    await page.goto("/providers?q=Bell");
    await page.waitForSelector(DIRECTORY_READY);
    expect(await visibleSlugs(page)).toEqual(["chelsea-bell"]);
  });
});

test.describe("provider pages link to each other", () => {
  test("(g) clinician profiles link to each other", async ({ request }) => {
    for (const slug of directorySlugs) {
      const response = await request.get(`/providers/${slug}`);
      expect(response.status(), slug).toBe(200);
      const html = await response.text();
      for (const other of directorySlugs) {
        if (other === slug) continue;
        expect(html, `${slug} should link to ${other}`).toContain(`href="/providers/${other}"`);
      }
    }
    for (const slug of ["rachel-lessard", "tia-baumohl", "tiffany-roberts"]) {
      const response = await request.get(`/providers/${slug}`);
      expect(response.status(), slug).toBe(200);
    }
  });
});
