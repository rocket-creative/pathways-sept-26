// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Homepage hero audit (01-cursor-audit-prompt.md, Part 1).
 *
 * The six stops come from content/pages/home.md between [HERO] and [/HERO].
 * Their ids are the slugs the parser gives the h2 headings.
 */
const STOP_IDS = [
  "healing-is-not-a-straight-line",
  "wisdom-therapy",
  "medication-management",
  "wellness-the-body",
  "one-conversation-starts-everything",
  "ready-when-you-are",
];
const THIRD_CARD_ID = STOP_IDS[2];

/** Wrapper the hero marks once its layout mode is decided and, if pinned, ScrollTrigger is live. */
const HERO_READY = "[data-hero][data-hero-ready='true']";

/** A scroll capturing listener is one that can call preventDefault: anything not passive. */
const CAPTURE_EVENTS = new Set(["wheel", "mousewheel", "touchmove", "touchstart"]);

/**
 * Tracks parsed scripts so a listener can be attributed to the file that added
 * it. Playwright injects its own hit target interceptor (touchstart, touchend,
 * touchcancel on window, non passive) into every page it drives; that script
 * has no URL, while every script of the page under test is served from the
 * site, so listeners from URL-less scripts are the harness and are ignored.
 */
async function trackScripts(cdp) {
  const urls = new Map();
  cdp.on("Debugger.scriptParsed", (event) => urls.set(event.scriptId, event.url));
  await cdp.send("Debugger.enable");
  return urls;
}

async function listenersOn(cdp, scriptUrls, expression, depth = 1) {
  const { result } = await cdp.send("Runtime.evaluate", { expression });
  if (!result.objectId) return [];
  const { listeners } = await cdp.send("DOMDebugger.getEventListeners", {
    objectId: result.objectId,
    depth,
  });
  return listeners
    .filter((listener) => CAPTURE_EVENTS.has(listener.type))
    .map((listener) => ({
      type: listener.type,
      passive: listener.passive,
      useCapture: listener.useCapture,
      script: `${scriptUrls.get(listener.scriptId) ?? ""}:${listener.lineNumber}:${listener.columnNumber}`,
    }))
    .filter((listener) => !listener.script.startsWith(":"));
}

test.describe("homepage hero", () => {
  test("(a) six section stops with h2 are in the raw HTML and fully visible after load", async ({
    page,
    request,
  }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    const html = await response.text();

    // Raw HTML, no JavaScript: six <section> elements carrying an <h2 id>.
    const sections = html.match(/<section\b[^>]*class="[^"]*\bhero-stop\b[^"]*"[^>]*>[\s\S]*?<\/section>/g) ?? [];
    expect(sections, "six hero-stop sections in the raw HTML").toHaveLength(6);

    const idsInOrder = sections.map((section) => {
      const match = /<h2\b[^>]*\bid="([^"]+)"/.exec(section);
      return match ? match[1] : null;
    });
    expect(idsInOrder).toEqual(STOP_IDS);

    for (const [index, section] of sections.entries()) {
      expect((section.match(/<p\b/g) ?? []).length, `stop ${index + 1} has one <p>`).toBe(1);
      expect((section.match(/<a\b/g) ?? []).length, `stop ${index + 1} has one <a>`).toBe(1);
    }

    // The h1 comes before every stop in source order.
    const h1At = html.search(/<h1\b/);
    const firstStopAt = html.indexOf(sections[0]);
    expect(h1At).toBeGreaterThan(-1);
    expect(h1At).toBeLessThan(firstStopAt);
    expect((html.match(/<h1\b/g) ?? []).length, "exactly one h1").toBe(1);

    // After load (JS on), nothing is hidden at rest.
    await page.goto("/");
    await page.waitForSelector(HERO_READY);
    // Give any load animation time to settle before checking the resting state.
    await page.waitForTimeout(1500);

    const state = await page.evaluate(() => {
      const pin = document.querySelector("[data-hero-pin]");
      const h1 = document.querySelector("h1");
      const stops = [...document.querySelectorAll("section.hero-stop")];
      return {
        h1InsidePin: Boolean(pin && h1 && pin.contains(h1)),
        stops: stops.map((section) => {
          const parts = [section, section.querySelector("h2"), section.querySelector("p"), section.querySelector("a")];
          return parts.map((el) => {
            if (!el) return { missing: true };
            const cs = getComputedStyle(el);
            return {
              tag: el.tagName,
              opacity: Number(cs.opacity),
              visibility: cs.visibility,
              display: cs.display,
              clip: cs.clipPath,
            };
          });
        }),
      };
    });

    expect(state.h1InsidePin, "h1 is outside the pinned wrapper").toBe(false);
    expect(state.stops).toHaveLength(6);
    for (const [index, parts] of state.stops.entries()) {
      for (const part of parts) {
        expect(part.missing, `stop ${index + 1} has section, h2, p, a`).toBeFalsy();
        expect(part.opacity, `stop ${index + 1} ${part.tag} opacity`).toBeGreaterThanOrEqual(1);
        expect(part.visibility, `stop ${index + 1} ${part.tag} visibility`).toBe("visible");
        expect(part.display, `stop ${index + 1} ${part.tag} display`).not.toBe("none");
      }
    }
  });

  test("(b) no scroll capturing wheel or touch listener on window, document, or the hero", async ({
    page,
  }) => {
    const cdp = await page.context().newCDPSession(page);
    const scriptUrls = await trackScripts(cdp);
    await page.goto("/");
    await page.waitForSelector(HERO_READY);

    const onWindow = await listenersOn(cdp, scriptUrls, "window");
    const onDocument = await listenersOn(cdp, scriptUrls, "document");
    const onHero = await listenersOn(cdp, scriptUrls, "document.querySelector('[data-hero]')", -1);

    // Nothing at all inside the hero, passive or not.
    expect(onHero, "wheel/touch listeners inside the hero").toEqual([]);

    // React registers passive wheel/touch delegates on the root container. A
    // passive listener cannot preventDefault, so it cannot capture scroll.
    const capturing = [...onWindow, ...onDocument].filter((listener) => listener.passive !== true);
    expect(capturing, "non passive wheel/touch listeners on window or document").toEqual([]);
  });

  test("(c) loading /#<third-card-id> lands on the third card", async ({ page }) => {
    await page.goto(`/#${THIRD_CARD_ID}`);
    await page.waitForSelector(HERO_READY);
    // The hash handler runs after ScrollTrigger.refresh(); allow the scrub to settle.
    await page.waitForTimeout(1200);

    const box = await page.evaluate((id) => {
      const heading = document.getElementById(id);
      const card = heading?.closest("section.hero-stop");
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, vw: innerWidth, vh: innerHeight };
    }, THIRD_CARD_ID);

    expect(box, "third card exists").not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(box.vw);
    expect(box.bottom).toBeLessThanOrEqual(box.vh);
    expect(page.url().endsWith(`#${THIRD_CARD_ID}`), "hash preserved").toBeTruthy();
  });

  test("(d) reduced motion: no pin spacer, six stops stacked vertically", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForSelector(HERO_READY);
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => ({
      pinSpacers: document.querySelectorAll(".pin-spacer").length,
      pinned: document.querySelector("[data-hero]")?.getAttribute("data-hero-pinned"),
      ys: [...document.querySelectorAll("section.hero-stop")].map(
        (section) => section.getBoundingClientRect().top + window.scrollY,
      ),
      branchFilter: getComputedStyle(document.querySelector("[data-hero-image-1]") ?? document.body).filter,
    }));

    expect(state.pinSpacers).toBe(0);
    expect(state.pinned).not.toBe("true");
    expect(state.ys).toHaveLength(6);
    for (let index = 1; index < state.ys.length; index += 1) {
      expect(state.ys[index], `stop ${index + 1} below stop ${index}`).toBeGreaterThan(state.ys[index - 1]);
    }
    expect(state.branchFilter === "none" || state.branchFilter === "", "image 1 unblurred").toBeTruthy();
  });

  test("(d2) under 768px: no pin spacer, six stops stacked vertically", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForSelector(HERO_READY);
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => ({
      pinSpacers: document.querySelectorAll(".pin-spacer").length,
      ys: [...document.querySelectorAll("section.hero-stop")].map(
        (section) => section.getBoundingClientRect().top + window.scrollY,
      ),
    }));
    expect(state.pinSpacers).toBe(0);
    expect(state.ys).toHaveLength(6);
    for (let index = 1; index < state.ys.length; index += 1) {
      expect(state.ys[index]).toBeGreaterThan(state.ys[index - 1]);
    }
  });

  test("(e) location.hash is unchanged after scrolling the whole page", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(HERO_READY);
    expect(new URL(page.url()).hash).toBe("");
    const startY = await page.evaluate(() => window.scrollY);
    expect(startY, "no forced scroll position on load").toBe(0);

    await page.mouse.move(700, 450);
    for (let step = 0; step < 80; step += 1) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(600);
    const atBottom = await page.evaluate(
      () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2,
    );
    expect(atBottom, "native scroll reached the bottom of the document").toBeTruthy();
    expect(new URL(page.url()).hash).toBe("");

    // And a hash the reader arrived with survives the same scroll.
    await page.goto(`/#${STOP_IDS[1]}`);
    await page.waitForSelector(HERO_READY);
    await page.waitForTimeout(800);
    for (let step = 0; step < 80; step += 1) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(400);
    expect(new URL(page.url()).hash).toBe(`#${STOP_IDS[1]}`);
  });

  test("(f) keyboard: the six links take focus in reading order and each focused card is on screen", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector(HERO_READY);

    // Start from the first hero link, then Tab through the rest.
    await page.focus("section.hero-stop a");
    const seen = [];
    for (let index = 0; index < 6; index += 1) {
      await page.waitForTimeout(700);
      const info = await page.evaluate(() => {
        const active = document.activeElement;
        const card = active?.closest("section.hero-stop");
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        return {
          id: card.querySelector("h2")?.id,
          inView: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight,
        };
      });
      expect(info, `focus ${index + 1} is inside a hero card`).not.toBeNull();
      expect(info.inView, `card ${info.id} is on screen while its link has focus`).toBeTruthy();
      seen.push(info.id);
      await page.keyboard.press("Tab");
    }
    expect(seen).toEqual(STOP_IDS);
  });
});
