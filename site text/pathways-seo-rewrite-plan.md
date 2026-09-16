# Pathways Within: SEO rewrite plan and page breakdown

Prepared 2026-09-16 for George Stoff. Nothing has been written yet. This is the spec every page will be rewritten against once you approve it.

Source material read: the full crawl export of both sites (49 pages, both forms, dead links), the 08-07-26 kickoff transcript (Jenny), and the part 2 transcript (Jenny + Rachel). The connected "site text" folder is empty.

Claim labels used below: **[V]** verified from a source I read today, **[R]** recalled and unverified, **[I]** my inference or judgment.

---

## 1. What Google is doing right now (verified)

**Core updates.** March 2026 core update ran Mar 27 to Apr 8; May 2026 core update started May 21. Google's only guidance for both is the "creating helpful, reliable, people first content" page. [V] https://searchengineland.com/google-may-2026-core-update-rolling-out-now-478430 and https://developers.google.com/search/updates/core-updates

**FAQ rich results are dead.** FAQPage markup stopped producing rich results on May 7, 2026; Google removed the documentation on June 15, 2026. FAQ content still belongs on the page as visible text, it just gets no markup treatment. [V] https://developers.google.com/search/updates (May 8 and June 15 entries). HowTo rich results were removed in 2023. [V] https://developers.google.com/search/blog/2023/08/howto-faq-changes

**AI Overviews and AI Mode.** Google published a dedicated guide on May 15, 2026 (last updated July 10, 2026). Direct quotes: "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search." "There's no requirement to break your content into tiny pieces for AI to better understand it." "Structured data isn't required for generative AI search." What it does ask for: non commodity content ("unique expert or experienced takes that go beyond common knowledge"), clear sections and headings, supporting images and video, and an accurate Google Business Profile. [V] https://developers.google.com/search/docs/fundamentals/ai-optimization-guide and https://developers.google.com/search/docs/appearance/ai-features

So "AEO" for this site means: answer the question in the first paragraph under each heading, in plain text, on a page that already ranks. No tricks.

**"Read more" deep links** (added April 20, 2026): Google links straight to a section of the page when content is visible on load, not hidden in accordions or tabs, and the URL hash is preserved. This kills the accordion FAQ pattern from the old site. [V] https://developers.google.com/search/docs/appearance/snippet#read-more-deep-links

**Title and meta length.** Google sets no character limit for either; both are truncated "typically to fit the device width." [V] https://developers.google.com/search/docs/appearance/title-link and https://developers.google.com/search/docs/appearance/snippet. The working ceilings I will write to (industry measurement, not Google's) are 60 characters for titles and 155 for descriptions. [R]

**E-E-A-T and YMYL.** Mental health and medication pages are YMYL. Google's self assessment page says its systems give "even more weight to content that aligns with strong E-E-A-T" for YMYL, and that "trust is most important." It asks for clear authorship with bylines linking to author background, and evidence the content is "written or reviewed by an expert." [V] https://developers.google.com/search/docs/fundamentals/creating-helpful-content. The rater guidelines were last revised Sept 11, 2025 (YMYL definitions, AI Overview examples, no change to rating guidance). [V] https://searchengineland.com/google-updates-search-quality-raters-guidelines-adding-ai-overview-examples-ymyl-definitions-461908

**Structured data that still earns a Google feature** (gallery as of June 15, 2026): Local business, Organization, Profile page, Breadcrumb, Article, Review snippet, Video. Not in the gallery: FAQ, HowTo, MedicalBusiness, Physician. [V] https://developers.google.com/search/docs/appearance/structured-data/search-gallery. LocalBusiness requires `name` and `address`; recommended `geo`, `openingHoursSpecification`, `telephone`, `url`, `priceRange`. Each location is its own LocalBusiness node. [V] https://developers.google.com/search/docs/appearance/structured-data/local-business

**Spam policy** now explicitly covers content that appears in generative AI responses (May 15, 2026), and "back button hijacking" is a named spam practice (April 13, 2026). [V] https://developers.google.com/search/updates

**What I could not verify:** keyword search volumes. I have no Keyword Planner, Semrush, or GSC access in this session. Target queries below are chosen from page intent and the SERP shape I checked, not from volume data. Send me a GSC export or Keyword Planner CSV and I will tighten them.

---

## 2. What is wrong with the current two sites (measured from the export)

| Problem | Count / detail |
|---|---|
| Pages with no meta description | 30 of 49 |
| Titles over 60 characters | 41 of 49. Every title carries a 45 to 52 character boilerplate suffix ("— Pathways Within Wellness Services on Long Island"), so the page keyword gets cut off on mobile. |
| Meta descriptions over 200 characters | 13 (longest 365). They read as page copy, not a pitch. |
| Duplicate title + description | /teen-therapy and /performance-wellness-coaching share the identical title and description. Google will pick one. |
| Location count conflict | Meta says five locations, body says four, and both are now wrong (Garden City lower level closing, Massapequa lower closing, Rockville Centre moving to floor 3). |
| Dead links | 8 med spa URLs return 404 and are still linked from the Skincare and Body pages; /contact-wellness 404s from the Hypnotherapy CTA; the "Discover your Pathway to Wellness" CTA on most Wisdom pages has an empty href. |
| Nav pointing at the wrong pages | "Family Therapy" and "IFS Therapy" nav items link to /child-therapy and /individual-therapy, orphaning the two dedicated pages. |
| Med spa content still live | Body Sculpting, Body Treatments, Skincare, Hair (priced menus for laser lipo, tattoo removal, HydraFacial). Jenny: "nothing that is med spa." |
| Two domains competing | Both sites target "on Long Island" for overlapping terms, split whatever authority exists, and cross link through a third "360" page. |
| No author or reviewer on any clinical page | Zero bylines, zero "reviewed by," no dates. On YMYL pages this is the biggest single E-E-A-T gap. |
| Copy pattern | Most service pages open with two or three paragraphs of feeling language before naming the service. Answer comes late. |
| FAQs in accordions | Hidden on load; loses "read more" deep links and reads as thin to crawlers. |

Word counts today: service pages run 675 to 2,509 words (median about 1,000). Location pages 177 to 182 words. Provider profiles 156 to 546. Contact 94 to 156. The provider and location pages are the thinnest and matter the most for local rankings.

---

## 3. Site architecture for the unified build

Production domain: pathwayswithinwellness.com (per your note). Both old domains 301 to it, page for page.

Three pillars, one nav: **Wisdom** (therapy), **Wellness** (body), **Medication Management**. Provider directory filters across all three. Welcome team owns intake ("360 intake"), so no insurance gate on any page; insurance is a section, not a filter.

### 3a. Page inventory and disposition

**Keep and rewrite (Wisdom, 17 service pages)**

| New URL | Old URL | Target query [I] | Target words [I] |
|---|---|---|---|
| /therapy/individual-therapy | pathwayswithin.me/individual-therapy | individual therapy Long Island | 1,100 |
| /therapy/couples-therapy | /couples-therapy | couples therapy Long Island | 1,100 |
| /therapy/child-therapy | /child-therapy | child therapist Long Island | 1,000 |
| /therapy/teen-therapy | /teen-therapy | teen therapist Long Island | 1,000 |
| /therapy/family-therapy | /family-therapy-on-long-island | family therapy Long Island | 900 |
| /therapy/emdr | /emdr-therapy | EMDR therapy Long Island | 1,100 |
| /therapy/trauma-therapy | /trauma-therapy | trauma therapist Long Island | 1,100 |
| /therapy/grief-therapy | /grief-therapy | grief counseling Long Island | 900 |
| /therapy/group-therapy | /group-therapy | group therapy Long Island | 900 |
| /therapy/hypnotherapy | /hypnotherapy | hypnotherapy Long Island | 900 |
| /therapy/ifs | /ifs-therapy-on-long-island | IFS therapy Long Island | 900 |
| /therapy/somatic-therapy | /somatic-therapy | somatic therapy Long Island | 900 |
| /therapy/ketamine-assisted-therapy | /ketamine-assisted-therapy | ketamine assisted therapy Long Island | 1,300 (highest YMYL bar) |
| /therapy/pcit | /parent-child-interaction-therapy | PCIT Long Island | 1,000 |
| /therapy/veterans-first-responders | /veterans-first-responders | therapist for first responders Long Island | 1,000 |
| /therapy/bariatric-surgery-support | /weight-loss-surgery-support | bariatric surgery therapist Long Island | 900 |
| /coaching | /performance-wellness-coaching | wellness coach Long Island | 900, rebuilt around Rachel's "multi level coaching" once she defines the levels |

**Keep and rewrite (Medication Management, own pillar)**

| /medication-management | /medication-management | psychiatric medication management Long Island | 1,200 |

**Keep and rewrite (Wellness)**

| New URL | Old URL | Target query [I] | Words [I] |
|---|---|---|---|
| /wellness/massage | wellness/massages | therapeutic massage Long Island | 900 |
| /wellness/acupuncture | /acupuncture | acupuncture Long Island (menu being rebuilt; write structure now, prices later) | 1,100 |
| /wellness/cupping | /cupping-therapy | cupping therapy Long Island | 800 |
| /wellness/energy-work | /energy-work | energy healing Long Island | 700 hub |
| /wellness/energy-work/reiki | /reiki | reiki Long Island | 700 |
| /wellness/energy-work/iet | /integrative-energy-therapy | integrative energy therapy Long Island | 700 |
| /wellness/cryotherapy | /cryotherapy-1 | cryotherapy Long Island | 800 |
| /wellness/iv-vitamin-therapy | (form option only) | build, keep noindex and unlinked until the nurse returns | 800 |

**Cut (301 to /wellness)**: /body-sculpting, /body-treatments, /face-treatments, /hair, plus the 8 already dead med spa URLs. Decision needed: Jenny said no med spa, but these are live on the wellness site today. I will treat them as cut unless you say otherwise.

**Merge**: pathwayswithin.me/360-degree-wellness and wellness/new-home-page fold into the new homepage and /about. Both old URLs 301 to /.

**Hub and trust pages (new or rebuilt)**

| URL | Purpose | Words [I] |
|---|---|---|
| / | Home: 360 approach, three pillars, welcome team intake, locations strip, provider search entry | 700 |
| /about | Practice story, MSO structure in plain language, values, editorial and review policy | 1,200 |
| /about/rachel-lessard | Founder page (Rachel is writing it; I rewrite to spec). Becomes the site's primary author entity. | 700 |
| /how-it-works | The 360 intake explained step by step. This replaces the insurance-first flow and is the page every CTA points at. | 800 |
| /providers | Directory with pillar, specialty, modality, location, and format filters. Sheet driven. | 300 + listings |
| /providers/[slug] | One page per clinician. Title, credentials, specialties, modalities, locations, formats, bio, "what a first session with me is like." | 300 to 450 each |
| /locations | Hub | 400 |
| /locations/rockville-centre, /garden-city, /massapequa, /smithtown, (/port-jefferson if still open) | One page per office: address, map, parking, accessibility, services offered here, providers here, hours, photos | 600 each |
| /telehealth | NY, NJ, NC, FL virtual therapy. Currently a 113 word news post; this is a real service page. | 800 |
| /insurance-and-fees | Insurers accepted (the 16 on the form), out of network, superbills, sliding scale if any. Not a gate, an answer. | 700 |
| /faq | Visible Q and A, no accordions, grouped by pillar | 1,200 |
| /resources | Virtual library the team asked for: downloadable handouts, post appointment guides | 400 + items |
| /blog | News and articles with author bylines (Rachel's Substack material can be republished here with canonical pointing to the site) | |
| /contact | Trust Driven Care form embed (Form 1 fields, minus the insurance requirement), bucket emails once Rachel sends the list, phone | 250 |
| /careers | Link out to WizeHire | 150 |
| /privacy, /terms, /accessibility-statement | Required trust pages | |

Total: about 52 indexable pages at launch, plus provider profiles.

### 3b. Redirect map
I will deliver a full old URL to new URL 301 list (both domains, all 49 crawled pages, the 8 dead URLs, and the 5 existing Squarespace redirects) as a CSV with the copy.

---

## 4. The rules every page gets written to

**Title tag**: 50 to 60 characters. Pattern: `{Service} on Long Island | Pathways Within` (suffix is 18 characters, leaving 42 for the keyword phrase). Location pages: `Therapy and Wellness in {Town}, NY | Pathways Within`. Provider pages: `{Name}, {Credentials} | Pathways Within`. No repeated words, one page one title.

**Meta description**: 140 to 155 characters. Sentence one answers what the page is and who it is for. Sentence two names Long Island, the format (in person or telehealth), and the next step. No exclamation points, no "Are you ready to discover your best self?"

**H1**: One per page, under 70 characters, contains the target phrase, not identical to the title tag.

**Opening paragraph**: 40 to 60 words, directly under the H1, answers "what is this and who is it for" in the first sentence. This is the sentence AI Overviews and snippets lift.

**Section pattern for service pages** (H2s, in this order):
1. What {service} is (definition, 60 to 90 words, plain language)
2. Who it helps (named concerns, not feelings language)
3. What to expect in your first session at Pathways Within
4. How our approach works (the 360 intake, welcome team, whole person plan)
5. Where it is offered (which offices, telehealth yes or no) with links to location pages
6. Who provides it (linked provider cards from the sheet)
7. Insurance and cost (link to /insurance-and-fees)
8. Common questions (3 to 6 visible H3 questions, 40 to 80 word answers)
9. Take the next step (the direct ask)

Every page: Authority (credentials, who reviewed it), Education (the definition and what to expect), Direct Ask (the intake CTA). No slow funnel.

**Author and review block** on every clinical page: "Written by {clinician}, {credentials}. Clinically reviewed by Rachel Lessard, LCSW. Last reviewed {date}." Names link to /providers/[slug]. Medication management and ketamine pages are reviewed by the prescriber, not Rachel.

**Citations**: condition and treatment claims on YMYL pages cite a primary source (NIMH, APA, SAMHSA, peer reviewed journal) inline. Two to four per page. No "studies show."

**Copy rules** (your house rules): no hyphens or dashes in copy, no AI telltale phrasing, reading level around grade 8, short paragraphs, sentences under 25 words, active voice. No med spa language, no "Simple Practice," no "Jane," no working hours claims that conflict with what the location pages say.

**Internal links**: every service page links to 2 related services, its locations, its providers, /how-it-works, and /insurance-and-fees. Every location page links to every service offered there. Every provider page links to their services and locations. Breadcrumbs on all pages.

**Images**: every image gets descriptive alt text naming the service and, where true, the office. Real office photos replace stock once Rockville Centre is shot.

**Hours**: I am going to push back on "no hours," as I did on the call, and Jenny agreed to feedback once locations settle. Each location page and its LocalBusiness node will carry standard front desk hours plus a line: "Clinician and provider appointment times vary by schedule and may fall outside these hours." That satisfies Google and is true.

---

## 5. Structured data plan

All JSON LD, one block per page, generated from the same data the pages use.

| Page | Types | Notes |
|---|---|---|
| Every page | `Organization` (site wide, with `logo`, `sameAs`, `contactPoint`), `BreadcrumbList`, `WebSite` on home | Organization is in Google's gallery. [V] |
| Each location page | `MedicalClinic` (a `LocalBusiness` subtype) with `name`, `address`, `geo`, `telephone`, `url`, `openingHoursSpecification`, `parentOrganization`, `hasMap`, `amenityFeature` for accessibility, `availableService` | Google's local business feature accepts LocalBusiness subtypes; `MedicalClinic` is a valid schema.org subtype [R, ~85% confident on the exact subtype name; will validate in the Rich Results Test before shipping]. Required props are `name` and `address`. [V] |
| Each provider page | `ProfilePage` wrapping a `Person` with `jobTitle`, `hasCredential`, `worksFor`, `knowsAbout`, `image` | Profile page is in Google's gallery and is the E-E-A-T signal for authorship. [V] |
| Each service page | `MedicalWebPage` with `about` a `MedicalTherapy` or `MedicalProcedure`, `reviewedBy` Person, `lastReviewed`, `provider` Organization | No rich result, but it is the machine readable version of the author and review block. [I] |
| Blog and resources | `Article` with `author` Person, `datePublished`, `dateModified` | In gallery. [V] |
| FAQ sections | none | FAQPage produces nothing as of May 7, 2026. [V] |
| Reviews | `AggregateRating` only if reviews are collected and displayed on the site itself, never from Google reviews | Google's July 24, 2026 snippet guideline on fake and incentivized reviews. [V] |

---

## 6. Local search (this is where the rankings actually come from)

Therapy and wellness queries on Long Island resolve to the map pack and to directories (Psychology Today, longisland.com, Zocdoc). [V, SERP checked today] A practice with four offices wins by having four correct Google Business Profiles pointing at four real location pages, not by one homepage.

Plan: one GBP per office, category "Mental health clinic" primary with "Massage therapist," "Acupuncture clinic," etc. as secondary per what is offered there; each GBP website field points at its own /locations/{town} page; NAP identical across site, schema, GBP, Apple Maps, Bing Places; close or move the GBPs for the Garden City lower level and Massapequa lower suite; open the Rockville Centre floor 3 profile on move in with photos. Practitioner profiles (Rachel, prescribers) as separate GBP listings attached to their primary office. [I, standard GBP guidance; I will verify the current GBP guidelines page before executing.]

You asked about this on the call and Jenny said yes to feedback once locations are solid. This section is the deliverable for that.

---

## 7. What I need from you or the client before writing

1. Final location list with status, suite numbers, and front desk hours. Port Jefferson is on the Wisdom site only; is it open?
2. Rachel's about, founder, and FAQ drafts (Jenny said Rachel is writing them).
3. Clinician bios and the ideal listing columns so the provider pages and the sheet match.
4. The bucket email list (billing@, welcome@, rockvillecentre@ etc.).
5. Confirmation: med spa pages cut, IV therapy built but hidden, coaching levels TBD.
6. Any GSC or Keyword Planner export. Without it, targets in section 3 stand on intent and SERP shape only.
7. Brand fonts and the SWOT / source of truth doc Jenny mentioned, for voice.

Items 1 and 5 block the location and wellness pages. Everything else I can draft with placeholders marked `[NEEDS: x]`.

---

## 8. Delivery order

1. Global: title and meta table for all 52 pages, redirect CSV, schema templates, provider sheet columns.
2. Home, /how-it-works, /about, /insurance-and-fees, /telehealth, /contact.
3. The 17 Wisdom service pages plus medication management.
4. Wellness pages.
5. Location pages (once item 1 arrives), provider page template plus Rachel's page as the model.
6. FAQ, resources, blog templates, trust pages.
7. QA pass: every title and description measured, every internal link resolved, schema validated in the Rich Results Test, reading level checked, house copy rules scanned.

Each batch lands in the "site text" folder as one markdown file per page: front matter (url, title, meta, h1, schema type, author, reviewer, target query) followed by the page copy in build order.

Assumptions I made: production domain is pathwayswithinwellness.com; Medication Management is a top level pillar with its own URL rather than nested under /therapy; med spa is cut; Port Jefferson stays until told otherwise.
