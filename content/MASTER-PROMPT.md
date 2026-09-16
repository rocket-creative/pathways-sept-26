# CURSOR MASTER PROMPT: Pathways Within unified site build

You are the build agent. You do not write copy, titles, meta descriptions, alt text, FAQ answers, or schema. All of that is supplied in this folder. Your job is to place it, wire it, and ship it. If a page file is missing something you need, insert the literal text `[NEEDS: x]` in the rendered page and list it in BUILD-NOTES.md. Never invent content, never paraphrase supplied copy, never "improve" a sentence.

## 0. Read first, in this order
1. `SPEC.md` (facts, page format, schema, copy rules)
2. `data/url-map.csv` (every URL, its page type, its file)
3. `data/redirects.csv`, `data/providers-sheet.csv`, `data/locations-sheet.csv`
4. `pages/**` (one file per page, YAML front matter + copy + JSON LD)

## 1. Stack and hosting
- Static HTML, CSS, and JS. No framework runtime required. Build with whatever static generator you already use in this repo; if none, plain HTML with a small Node build script that reads `pages/**.md`, the two CSV sheets, and templates, and emits `/dist`.
- Deploy target: Vercel. Production domain `https://pathwayswithinwellness.com`. Old domain `pathwayswithin.me` (and `www.`) point at the same project and every path is 301 redirected per `data/redirects.csv` (load into `vercel.json` redirects; `200` rows mean the path already exists and needs no redirect).
- One `vercel.json` with redirects, clean URLs, trailing slash off, security headers.

## 2. Design rules (from the approved concept; the prototype in this repo is the reference)
- White and near white backgrounds only (#FFFFFF, #F7F7F7, #EBEBEB ground). No dark panels, no blue panels.
- Everything rounded: cards, image masks, buttons, section corners, mirroring the labyrinth logo. Circular image frames where an image is a person or a room.
- Sections flow edge to edge, no boxed containers with hard borders. Overlaying elements and elements that run into the next section are encouraged.
- GSAP for motion: content drops in, images settle slightly slower than text, thin leader lines draw to callouts. All animation respects `prefers-reduced-motion` and never blocks reading. No scroll hijacking except the approved pinned horizontal scroll on the homepage hero, and that section must (a) work with keyboard and screen readers as a normal vertical document, (b) not alter the URL hash, (c) not force scroll position on load.
- Brand colors: keep the practice's current palette [NEEDS: hex values from brand guide]. Fonts: [NEEDS: real brand fonts]; until supplied use Quicksand for display and Nunito for body as stand ins.
- Logo fixed top right on desktop. Persistent header: logo, primary nav (Therapy, Wellness, Medication Management, Concerns, Providers, Locations, How It Works), phone `(631) 371-3825`, CTA "Start your 360 intake" → `/contact`.
- Footer on every page: logo, one sentence tagline, phone, Welcome Team email, five location addresses (from the locations sheet), links to every pillar hub, /insurance-and-fees, /faq, /resources, /blog, /careers, /privacy-policy, /notice-of-privacy-practices, /terms-of-use, /accessibility-statement, social links `[NEEDS]`. Remove "Created by Theory About That".
- No stock photos of lasers, needles in faces, or spa marketing. Use the old site image URLs in the page files only as placeholders; final imagery comes from the client's Dropbox and the Rockville Centre shoot.

## 3. Page rendering
For each row in `url-map.csv`, render the matching file:
- Front matter → `<title>`, `<meta name="description">`, canonical (`https://pathwayswithinwellness.com{url}`), `og:title`, `og:description`, `og:image` (hero if present, else site default), `robots` (`noindex,nofollow` when `index: false`), and the breadcrumb.
- Body Markdown → semantic HTML. `# ` is the single `<h1>`. `## ` → `<h2>` with an `id` slug so "read more" deep links work. `### ` inside "Common questions" → `<h3>` with the answer in a `<p>` directly below, always visible. No accordions, no tabs, nothing hidden on load.
- Markers:
  - `[CTA] Label -> /path` → rounded button.
  - `[FORM: therapy]` → iframe `https://link.trustdrivencare.com/widget/form/5KmXtKKPzphbLJSdq4Ym`; `[FORM: wellness]` → `https://link.trustdrivencare.com/widget/form/pZyZ5b0IMxCN6FcJq4pF`. Use the exact embed snippets the client already uses on Squarespace (copy them from the live sites); do not alter fields.
  - `[PROVIDER CARDS: slug, slug]` → cards from `providers-sheet.csv` (circular headshot, name, credentials, title line, first bullet, link to `/providers/{slug}`). `[PROVIDER CARDS: specialty=anxiety]` filters by the specialties column. `[PROVIDER CARDS: pillar=wellness]` likewise.
  - `[LOCATION CARDS: slug, slug]` → cards from `locations-sheet.csv` (name, address, accessibility icon, link).
  - `[IMAGE: alt]` → figure with that alt text; if no asset is mapped, render a neutral rounded placeholder with the alt as a visible caption in dev builds only.
  - `[NEEDS: x]` → render visibly in dev, hidden with a `data-needs` attribute in production, and logged in BUILD-NOTES.md.
- Author block (last paragraph before the JSON) renders as a small byline component with links to provider pages and a `<time>` element.
- The JSON fence at the end → `<script type="application/ld+json">`. Also inject the site wide graph from SPEC.md section 6 on every page. Validate every page with a JSON parser at build time; fail the build on a parse error.
- Internal links in copy are root relative (`/therapy/emdr`). Fail the build if a link target is not in `url-map.csv`.

## 4. Providers (sheet driven)
- Source of truth: `data/providers-sheet.csv` now; later a published Google Sheet CSV URL `[NEEDS: sheet URL]`. Build step fetches the CSV, so a sheet edit plus a redeploy updates the site. Wire a Vercel deploy hook the client can trigger from the sheet (Apps Script) `[NEEDS: set up after handover]`.
- `/providers`: directory with filters for pillar, specialty (from `specialties`, split on `;`), modality, age group, location, and format. A provider with `pillars: wisdom;wellness` appears under both. Rows with `active: false` are excluded. Rows with `role: Admin` appear in a small "Welcome and admin team" strip without profile pages.
- `/providers/{slug}`: render `pages/_provider-template.md` with the row's data. `pages/providers/rachel-lessard.md` and `pages/providers/tiffany-roberts.md` override the template for those two.
- Headshots: crop to square, mask to circle, output 320px and 640px WebP, lazy loaded.
- Bio format on the profile: title line, two paragraphs, three bullets. Exactly.

## 5. Locations (sheet driven)
- `data/locations-sheet.csv` drives the footer, `/locations`, `/locations/{slug}`, the location cards, the contact page, and the `MedicalClinic` JSON on each location page.
- Each location page carries the accessibility sentence from the sheet verbatim, the hours block (`[NEEDS]` until supplied), and the standard line: "Clinician and provider appointment times vary and may fall outside front desk hours, including evenings."
- Map embed: `[NEEDS: Google Maps embed per office]`; until then a static rounded map image placeholder.

## 6. Forms, chat, quiz, contact routing
- Forms: only the two Trust Driven Care embeds. They already route to the CRM. Do not build a native form.
- Chat: the LeadConnector text widget from the old Wisdom site (`Hi there, have a question? Text us here.`) goes site wide `[NEEDS: widget script from client]`. Defer its script until after first interaction or 5 seconds, whichever first, to protect LCP.
- Quiz (`/how-it-works#quiz`): rebuild the old quiz as a 5 question router. Questions and answers are in `pages/how-it-works.md`. Every result ends at the same CTA: "Start your 360 intake". No result names a cut service.
- Contact page email buckets: render the `[NEEDS: bucket email]` placeholders; the footer uses `Welcome@pathwayswithin.com` until the list arrives.

## 7. Hidden and future pages
- `index: false` pages (IV vitamin therapy) build to their URL with `noindex,nofollow`, are excluded from the sitemap, and are not linked from nav, hubs, or cards. Flip `index: true` to launch them.

## 8. Technical SEO checklist (must pass before deploy)
- `sitemap.xml` split into `sitemap-pages.xml`, `sitemap-providers.xml`, `sitemap-locations.xml`, `sitemap-blog.xml`, with an index. Only `index: true` URLs. `lastmod` from `last_reviewed`.
- `robots.txt` allows all crawlers, references the sitemap index. No AI crawler blocks.
- Self referencing canonical on every page. One H1 per page. Unique title and meta per page (build fails on duplicates).
- Breadcrumb markup and visible breadcrumbs on every page below the header.
- Core Web Vitals budget: LCP under 2.5s on a mid tier Android over 4G, CLS under 0.1, INP under 200ms. Hero image preloaded, `width` and `height` on every image, AVIF/WebP with JPEG fallback, fonts self hosted with `font-display: swap`, GSAP loaded deferred, no render blocking third party scripts (CRM iframes lazy load below the fold; on `/contact` the form is above the fold and loads eagerly).
- Accessibility WCAG 2.2 AA: contrast 4.5:1 minimum on all text, visible focus rings, skip link, landmark regions, aria labels on icon buttons, `prefers-reduced-motion` honored, form iframes titled, all images have the supplied alt text, headings in order.
- 404 page with search of the URL map and links to the three pillars.
- Security headers, HTTPS only, HSTS.
- `og:image` default: `[NEEDS: 1200x630 brand image]`.
- No `FAQPage`, no `HowTo`, no review markup anywhere.

## 9. QA before handing back
Run the checker in `tools/check-pages.py` (title 50 to 60, meta 140 to 155, H1 length and uniqueness, banned words, hyphen scan, link targets, JSON parse, author block). Then Lighthouse on `/`, `/therapy/emdr`, `/locations/rockville-centre`, `/providers/rachel-lessard`, `/contact`: Performance 90+, Accessibility 100, SEO 100. Then Rich Results Test on one page of each type. Put results in BUILD-NOTES.md with every `[NEEDS]` item grouped by owner (client vs. George).

## 10. Handover
- `README.md` for the client's future maintainer: how to edit the providers sheet and the locations sheet, how to flip a hidden page live, how to add a blog post (`pages/blog/{slug}.md` following the Article pattern), how to redeploy.
- Nothing else is client editable. Copy changes route through George.
