# CURSOR AUDIT PROMPT (run on the strongest model, after the main build)

You are auditing a static site another agent built from this folder. Read `00-cursor-master-prompt.md` sections 2a, 3, 4, and 8, and `pages/home.md` from `[HERO]` to the SEO notes at the bottom. Then audit and fix only the two components below. Do not touch copy, titles, meta, schema, or any other page. Every fix must keep the supplied HTML text identical; you are changing CSS, JS, and DOM structure only.

Work in this order: inspect, write the failing checks, fix, rerun, report. Do not report a pass you did not execute.

## Part 1: homepage hero (pinned horizontal scroll, blur, image handoff)

### Inspect
1. Load `/` with JavaScript disabled (or fetch the built HTML and read it). Confirm all six hero stops exist in the source as `<section>` elements, in document order, each with an `<h2 id="...">`, one `<p>`, and one `<a>`. Confirm the `<h1>` precedes them in the source and is outside the pinned wrapper.
2. Grep the hero CSS and JS for every way content can be hidden at rest: `opacity: 0`, `opacity:0`, `autoAlpha: 0`, `visibility: hidden`, `display: none`, `clip-path` that fully clips, `height: 0`, `overflow: hidden` on a card, `transform: scale(0)`. Any of these applied to a stop as its initial or fallback state is a defect. `gsap.from()` calls with `opacity` or `autoAlpha` are the usual offender because if the trigger never fires (bots, reduced motion, JS error) the card stays invisible.
3. Grep for scroll capture: `addEventListener('wheel'`, `'touchmove'`, `preventDefault()` on wheel or touch, `Observer.create`, `scroll-snap-type` on the hero, `overscroll-behavior: none`, `body { overflow: hidden }`, `window.scrollTo(0,0)` on load, `history.replaceState`, `location.hash =`, `scrollRestoration`. Any of these is a defect unless it is inside the reduced motion fallback and does nothing.
4. Confirm the pin uses `ScrollTrigger` with `pin: true` and `scrub` on native scroll, not a custom scroll container. Confirm `ScrollTrigger.refresh()` runs after fonts and images load, so the pin height is correct.
5. Confirm the blur is a CSS `filter` on the image 1 element only, driven by the last 15 percent of the scrub, and that no text node, card, or link is a descendant of the blurred element.
6. Confirm image 2 is a `position: fixed` element behind the content with the white overlay (85 to 92 percent), that it is preloaded at roughly 40 percent of hero scroll progress (not in `<head>`), and that `background-attachment: fixed` is not used anywhere.
7. Confirm `@media (prefers-reduced-motion: reduce)` and `@media (max-width: 767px)` both disable the pin and stack the six stops vertically with image 1 static and unblurred. Confirm `ScrollTrigger.matchMedia` or equivalent is used so the pin is never created in those cases, rather than created and then hidden.
8. Tab through the hero with the keyboard. The six links must receive focus in reading order and each focused card must be visible on screen (use `scrollIntoView` on focus if needed; that is allowed because it responds to user input).
9. Load the page with the hash of the third card (the `id` on its `<h2>`). The browser must land on that card. If the pin swallows the hash, add a `ScrollTrigger` aware hash handler that scrolls to the card's pin progress instead of stripping the hash.
10. Run Lighthouse mobile on `/`. LCP must be the H1 text or image 1, not image 2, and under 2.5s on the default throttled profile. CLS under 0.1: check that the pin spacer does not shift layout when ScrollTrigger initializes.

### Fix rules
- Replace any `gsap.from({opacity})` on stops with `gsap.fromTo` on `x` or `y` only, and set the resting CSS to fully visible.
- Replace any wheel or touch handler with ScrollTrigger scrub.
- If the hash is being cleared, remove that code and add the hash handler from step 9.
- If the pin is created before fonts load, wrap in `document.fonts.ready.then(...)` and call `ScrollTrigger.refresh()`.

### Prove it
Write `tests/hero.spec.js` (Playwright) that asserts: (a) six `section` elements with `h2` are present in the raw HTML response, none with computed `opacity` below 1 or `visibility` hidden after `load`; (b) no `wheel` listener is registered on `window`, `document`, or the hero (use `getEventListeners` in a CDP session or stub `addEventListener` before load); (c) after `page.goto('/#<third-card-id>')`, the third card's bounding box is inside the viewport; (d) with `page.emulateMedia({reducedMotion: 'reduce'})`, the hero has no pin spacer and the six sections are stacked vertically (each `y` greater than the previous); (e) `location.hash` is unchanged after scrolling the whole page. Run it. Include the output in your report.

## Part 2: provider directory filters (many to many)

### Inspect
1. Open the directory data loader. Confirm it reads `data/providers-sheet.csv` (or the published sheet URL) at build time, splits `pillars`, `specialties`, `modalities`, `age_groups`, `locations`, and `formats` on `;`, trims whitespace, and lowercases for matching while preserving display case.
2. Confirm a provider with `pillars: wisdom;wellness` (Tia Baumohl) renders under both pillar filters and is not duplicated in the "all" view.
3. Confirm the specialty filter matches on substring, case insensitive, so `[PROVIDER CARDS: specialty=LGBTQ]` returns rows tagged `LGBTQ+` and `LGBTQIA+`, `specialty=addiction` also returns `substance use`, and `specialty=ADHD` returns `adult ADHD`. Add an explicit alias map for those three pairs if substring matching alone misses any.
4. Confirm rows with `active: false` are excluded everywhere and rows with `role: Admin` appear only in the admin strip with no profile page and no link.
5. Confirm filters combine with AND across filter types and OR within a type (pillar: wisdom AND specialty: anxiety OR depression).
6. Confirm the full unfiltered directory is in the initial HTML, not fetched client side after load, so every provider card and its link to `/providers/{slug}` exists for crawlers. Filtering may hide cards with a class, but the cards must be in the DOM at load with links intact.
7. Confirm filter state is reflected in the URL query string (`?pillar=wellness&specialty=anxiety`) and restored on load, and that filtered URLs carry `<link rel="canonical">` pointing to `/providers` with no query, so filter combinations do not become indexable duplicates.
8. Confirm the `[PROVIDER CARDS: ...]` marker on service, concern, and location pages resolves to the same filter function, and that a marker with zero matches renders the `[NEEDS]` note in dev and nothing in production rather than an empty heading.
9. Confirm each rendered profile page from `_provider-template.md` has a unique title under 60 characters (truncate credentials, never the name), the Person JSON with the correct `@id`, and that `pages/providers/rachel-lessard.md` and `tiffany-roberts.md` override the template rather than producing two pages for the same slug.

### Prove it
Write `tests/directory.spec.js` that asserts: (a) the raw HTML of `/providers` contains a link for every non admin, active slug in the CSV; (b) `?pillar=wellness` shows Tia Baumohl and `?pillar=wisdom` also shows Tia Baumohl; (c) `?specialty=LGBTQ` returns at least the rows tagged `LGBTQ+` and `LGBTQIA+` in the CSV; (d) canonical on `/providers?pillar=wellness` equals `https://pathwayswithinwellness.com/providers`; (e) no card for `gloria-saladino` links to a profile page. Run it. Include the output in your report.

## Report format
Return `AUDIT-REPORT.md` with three sections: Defects found (file, line, what, why it breaks SEO or accessibility), Fixes applied (diff summary per file), Test output (verbatim). Then run `python3 tools/check-pages.py` one last time to confirm no page file changed, and paste its final line.
