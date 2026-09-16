# Build plan and file ownership

Six agents work this repo in parallel. Read this before touching anything.

## The rule that matters most

**You do not write copy.** All titles, meta descriptions, headings, body text, alt
text, FAQ answers, and JSON LD are supplied in `content/`. Place it, wire it, style
it. Never paraphrase, never "improve" a sentence, never invent a fact. If something
is missing, the content already carries a `[NEEDS: x]` marker; leave it alone.

Authoritative reading, in order:

1. `content/MASTER-PROMPT.md` — architecture, design rules, SEO, QA
2. `content/SPEC.md` — facts sheet, page format, copy rules, schema contract
3. `content/data/url-map.csv` — every URL, its page type, its source file

## What already exists

`lib/content.ts` is the content pipeline and it is **frozen**. It reads
`content/pages/**` and the CSV sheets and returns a typed block model. If you need a
change there, say so in your final report rather than editing it, so two agents do
not fight over the same file.

**Parser update, after Agent B's report.** Five gaps are fixed, so re-read the
`Block` union if you started before this line existed:

- `[PROVIDER CARDS: location=smithtown]` now parses to `{ by: "location", value }`.
  `selectProviders` must handle it or five location pages render an empty section.
  An unrecognized `key=value` filter now throws instead of silently matching nobody.
- New `widget` block kind for `[QUIZ]…[/QUIZ]`, `[PROVIDER DIRECTORY]`,
  `[RESOURCE LIBRARY]`, and `[BLOG INDEX]`. It carries the wrapped copy in `blocks`
  (the no JavaScript fallback, always rendered) and holds "Routing rules for Cursor"
  build instructions out of the copy in `instructions`.
- New `embed` block kind for `[EMBED: x]`.
- `quote` now carries `paragraphs: InlineNode[][]`, not a single flattened `inline`.
- `last_reviewed` is normalized to a `YYYY-MM-DD` string; YAML was handing back a
  `Date` and breaking the declared type.

Key exports: `getAllPages`, `getPageByUrl`, `getAllUrls`, `getUrlMap`, `getUrlSet`,
`getProviders`, `getProfileProviders`, `getLocations`, `getRedirects`, `parseBlocks`,
`parseInline`, `inlineToText`, `slugify`, `isNeeds`, plus the `Block`, `InlineNode`,
`Page`, `Provider`, and `Location` types and the `SITE_ORIGIN`, `SITE_PHONE`,
`SITE_PHONE_HREF`, `WELCOME_EMAIL`, `FORM_EMBEDS` constants.

`app/[...slug]/page.tsx` is the catch-all that renders every URL except `/`. It is
also frozen; it is the integration point. `/` stays on the existing
`components/stage/HorizontalStage` prototype.

Everything else listed below is a deliberately thin stub for one owner to replace.

## Ownership map

Touch only your files. Do not edit another agent's files, even to fix a bug: report it.

| Agent | Owns |
|---|---|
| A, site chrome | `components/site/**`, `app/not-found.tsx` |
| B, renderer | `components/render/**` |
| C, SEO infra | `lib/schema.ts`, `app/robots.ts`, `app/sitemap*`, `vercel.json`, `scripts/**` |
| D, providers and locations | `lib/providers.ts`, `lib/locations.ts`, `components/directory/**` |
| E, design system | `app/globals.css`, `styles/**`, `components/motion/**`, `lib/fonts.ts` |
| F, quiz | `components/quiz/**` |

Shared and frozen: `lib/content.ts`, `app/[...slug]/page.tsx`, `app/layout.tsx`,
`content/**`, `components/stage/**`, `next.config.ts`.

If you need a class name from another agent's CSS, use the names already referenced
in the stubs (`.site-header`, `.site-footer`, `.breadcrumbs`, `.skip-link`, `.prose`,
`.button`, `.cta`, `.provider-cards`, `.provider-card`, `.location-cards`,
`.location-card`, `.form-embed`, `.content-image`, `.byline`, `.needs`). Add new ones
freely inside your own area.

## Design rules (from the approved concept)

White and near white only: `#FFFFFF`, `#F7F7F7`, `#EBEBEB`. No dark or blue panels.
Everything rounded, mirroring the labyrinth logo; circular masks for people and rooms.
Sections run edge to edge with no hard bordered containers; overlap between sections is
encouraged. GSAP for motion, always behind `prefers-reduced-motion`, never blocking
reading, no scroll hijacking outside the existing homepage hero.

Brand hexes and real fonts are still `[NEEDS]`. Quicksand for display and Nunito for
body are the stand ins, already wired in `lib/fonts.ts`.

## Non negotiables for every agent

- Accessibility WCAG 2.2 AA. Contrast 4.5:1, visible focus rings, landmarks, headings
  in order, `aria-label` on icon buttons, titled iframes, `prefers-reduced-motion`.
- One `<h1>` per page. `##` headings get slug `id`s so deep links work.
- Nothing hidden on load. No accordions, no tabs, no carousels for content.
- Every image has `width` and `height`. Lazy load below the fold.
- No `FAQPage`, no `HowTo`, no review or rating markup, anywhere.
- Internal links are root relative and must exist in `getAllUrls()`.

## Verifying your work

Five other agents are working this repo at the same time, so `.next/` and
`node_modules/` are shared, mutable state. Two rules:

- Verify with `npx tsc --noEmit`. **Do not run `next build`, `next dev`, or `next
  lint`**; concurrent runs corrupt each other's output. The integration pass runs the
  real build once everyone is done.
- **Do not install or remove packages.** If you need a dependency, name it in your
  report instead. Already available: `next` 15, `react` 19, `gsap` 3.12, `tailwindcss`
  4, `gray-matter`, `csv-parse`.

`python3 tools/check-pages.py` is read only against `content/` and is safe to run.

Leave `npx tsc --noEmit` clean. Report any `[NEEDS]` you surface and anything you
could not finish, so it lands in BUILD-NOTES.md.
