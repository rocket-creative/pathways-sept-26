# SPEC: writing and schema contract for every Pathways Within page

This file is the contract. Every page file in /pages must follow it exactly. Cursor reads it too, so it is written for both writers and the build agent.

## 1. Facts sheet (use these, never invent)

Brand: Pathways Within. Legal/organization name on site: Pathways Within. Old sub brands "Wisdom" (therapy) and "Wellness" (body) become the two pillars of one site, with Medication Management as the third pillar. Never call the old sites "sister sites" again. The organization is one practice.

Production domain: https://pathwayswithinwellness.com
Phone: (631) 371-3825, tel:+16313713825
Welcome Team email: Welcome@pathwayswithin.com (use this everywhere until the bucket email list arrives; mark other addresses [NEEDS: bucket email])
Founder: Rachel Lessard, LCSW-R (Founder). Substack: The Wisdom of Wellness, @the.wisdom.of.wellness
Leadership: Ksusha Cascio, LCSW (Chief Operating Officer); Joe Bush, LCSW (Clinical Director, Nassau); Lee Wasser, LMHC-D (Clinical Director, Suffolk); Christine Cervo, LMT (Wellness leadership). Front desk manager: Gloria Saladino.
Prescriber: Tiffany Roberts, PMHNP, MSN, BSN, RN-BC (psychiatric nurse practitioner; adolescents 10+ and adults)
Acupuncturist: Leonard Ma, L.Ac.
Massage: Christine Cervo, LMT; Danielle Ingenito, LMT
Coach and energy work: Tia Baumohl, Certified Coach and Energy Medicine Practitioner (belongs to both Wisdom and Wellness pillars)
Careers: https://wizehire.com/cmp/pathways-within
CRM: forms are Trust Driven Care (GoHighLevel) iframes. Embed URLs: therapy form https://link.trustdrivencare.com/widget/form/5KmXtKKPzphbLJSdq4Ym ; wellness form https://link.trustdrivencare.com/widget/form/pZyZ5b0IMxCN6FcJq4pF . Use as is. Do not rebuild fields.
Telehealth: New York, New Jersey, North Carolina, Florida.
Never mention: SimplePractice, Jane, IvyPay, Vagaro, "med spa", "medspa", "aestheticians", "Pathways to Beauty", body sculpting, lasers, facials, hair restoration, memberships (unconfirmed).

### Locations (status per the Aug 2026 calls; verify before launch)
| Slug | Name | Address | Status | Accessibility |
|---|---|---|---|---|
| rockville-centre | Rockville Centre | 53 N Park Ave, [NEEDS: new suite number, 3rd floor], Rockville Centre, NY 11570 | Moving to the full 3rd floor of the same building, target opening Sept 1, 2026. Infrared sauna, treatment rooms, multipurpose. | Elevator access [NEEDS: confirm] |
| garden-city | Garden City | 647 Franklin Ave, Lower Level, Garden City, NY 11530 | Stays. Becomes multipurpose (therapy and wellness). The second Garden City office across the street is closed. | Not wheelchair accessible (stairs, no elevator) |
| massapequa | Massapequa | 4160 Merrick Road, [NEEDS: upstairs suite number], Massapequa, NY 11758 | Upstairs stays. Lower level closing end of Aug 2026. | Not wheelchair accessible (stairs) |
| smithtown | Smithtown | 496 Smithtown Bypass, Suite 203, Smithtown, NY 11787 | Stays | Accessible (ground floor or elevator) [NEEDS: confirm which] |
| port-jefferson | Port Jefferson | 1227 Main Street, Suite 101, Port Jefferson, NY 11777 | Listed on the therapy site only. Status not discussed on either call. Build the page, flag it. | [NEEDS] |

ZIP codes for Garden City (11530) and Massapequa (11758) are inferred from the street addresses; confirm.
Hours: [NEEDS: front desk hours per location]. Until supplied, every location page and schema uses the placeholder block in section 6 and the sentence: "Clinician and provider appointment times vary and may fall outside front desk hours, including evenings."
Parking: old site says each location has dedicated parking. Keep that sentence only where the client confirms.

### Services by pillar
Wisdom (therapy): individual, couples, child, teen, family, group, EMDR, trauma, grief, hypnotherapy, IFS, somatic, ketamine assisted therapy, PCIT, veterans and first responders, bariatric surgery support, coaching (Tia; multi level coaching coming, structure to be defined).
Medication Management: Tiffany Roberts.
Wellness: massage (medical, sports, Swedish, pregnancy, hot stone, massage based cupping; NYSHIP accepted for eligible medical massage), acupuncture (Leonard; menu being rebuilt), cupping (massage based and acupuncture based), energy work (Reiki, ITA, IET), cryotherapy, IV vitamin therapy (build, hide, noindex; on hold).
Cut entirely: body sculpting, body treatments, skincare/facials, hair removal and restoration, PRP, laser anything, Lutronic Accufit, payment plans page.

### Insurance (from the intake form and old FAQ)
On the form: 1199, Aetna, Anthem Blue Cross, Carelon Behavioral Health, Cigna, Local 810, Magnacare, Medicare, Northwell Direct, Optum, Oscar, Oxford, UHC, UMR, VA CCN, Not Insured, Other.
Old FAQ also listed: Meritain, Humana, NYSHIP (out of network for therapy; in network for eligible medical massage), Student Resource, Allied Benefit, ComPsych, MVP, Northwell Brighton Health. Magnacare marked out of network on the old FAQ.
Rule for copy: "Coverage varies by provider, service, and plan. The Welcome Team verifies benefits after your 360 intake." Never promise coverage. Sliding scale: "a limited number of sliding scale spots based on need and availability." Payment: cash, major credit cards, HSA and FSA. Cancellation: the old FAQ contradicts itself (72 hours and $75 vs 24 hours). Use: [NEEDS: cancellation policy] and do not state a number.

### The 360 intake (this replaces "tell us your insurance")
1. You contact the Welcome Team (form, call, or text).
2. A Welcome Team member reaches out and schedules a 360 intake, a conversation about what you are experiencing and what you want to change.
3. The team builds a care plan across therapy, medication management, and wellness as needed, and matches you with available providers.
4. Your first appointment is scheduled. The Welcome Team stays your point of contact.

### Verified citations (the only external links allowed; do not add others)
- NIMH Anxiety Disorders: https://www.nimh.nih.gov/health/topics/anxiety-disorders
- NIMH Depression: https://www.nimh.nih.gov/health/topics/depression
- NIMH PTSD: https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd
- NIMH ADHD: https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd
- NIMH OCD: https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd
- NCCIH Acupuncture: Effectiveness and Safety: https://www.nccih.nih.gov/health/acupuncture-effectiveness-and-safety
- NCCIH Massage Therapy: What You Need To Know: https://www.nccih.nih.gov/health/massage-therapy-what-you-need-to-know
- EMDR International Association, About EMDR Therapy: https://www.emdria.org/about-emdr-therapy/
- PCIT International: https://www.pcit.org/
- SAMHSA National Helpline (1-800-662-4357): https://www.samhsa.gov/find-help/national-helpline
- 988 Suicide and Crisis Lifeline: https://988lifeline.org/
- Veterans Crisis Line (dial 988 then press 1, text 838255): https://www.veteranscrisisline.net/
If a page needs a source not on this list, write `[NEEDS: citation for "<claim>"]` inline. Never invent a URL.

## 2. Page file format

Every file in /pages is Markdown with YAML front matter, then the page copy in build order, then a JSON LD block. Cursor renders front matter into `<head>`, copy into the body, and the JSON block into `<script type="application/ld+json">`.

```
---
url: /therapy/emdr
title: "EMDR Therapy on Long Island | Pathways Within"        # 50 to 60 characters
meta: "..."                                                  # 140 to 155 characters
h1: "EMDR Therapy on Long Island"
page_type: service | concern | insurance | location | provider | hub | trust | resource
pillar: wisdom | wellness | medication | none
target_query: "EMDR therapy Long Island"
author: "Rachel Lessard, LCSW-R"                             # provider slug must exist in providers sheet
reviewer: "Rachel Lessard, LCSW-R"
last_reviewed: 2026-09-16
index: true | false
nav: primary | secondary | none
related_services: [/therapy/trauma-therapy, /therapy/ifs]
related_concerns: [/concerns/ptsd, /concerns/anxiety]
locations: [rockville-centre, garden-city, massapequa, smithtown, port-jefferson, telehealth]
providers: [rachel-lessard, carly-sandstrom]                 # slugs from providers sheet
hero_image: "[NEEDS: image] alt text goes here"
---
```

Copy conventions inside the body:
- `# H1` once. `## H2` sections in the order in section 3. `### H3` for FAQ questions and sub points.
- `[CTA] Label -> /path` for buttons. `[FORM: therapy]` or `[FORM: wellness]` where the Trust Driven Care embed goes. `[PROVIDER CARDS: slug, slug]` where provider cards render from the sheet. `[LOCATION CARDS: slug, slug]` likewise. `[IMAGE: alt text]` for an image slot.
- `[NEEDS: what]` for any fact the client has not supplied. Never fill a gap with a guess.
- Author block at the end of the body, before the JSON, exactly: `**Written by** {author}. **Clinically reviewed by** {reviewer}. **Last reviewed** {Month D, YYYY}.` Names link to their provider page.

## 3. Section pattern by page type

**Service page** (900 to 1,300 words): H1; opening paragraph 40 to 60 words that says what the service is and who it is for in sentence one; `## What {service} is`; `## Who it helps` (named concerns, link to /concerns/ pages); `## What to expect in your first session at Pathways Within`; `## How care works here` (360 intake, welcome team, whole person plan, coordination with other pillars); `## Where it is offered` (location cards, telehealth yes or no); `## Who provides it` (provider cards); `## Insurance and cost` (2 to 3 sentences, link /insurance-and-fees); `## Common questions` (4 to 6 H3 questions, 40 to 80 word answers, visible, no accordions); `## Take the next step` (direct ask, CTA, phone).

**Concern page** (900 to 1,100 words): H1 "{Concern} Therapy on Long Island" or "{Concern} Treatment on Long Island"; opening paragraph; `## Signs it may be time to talk to someone` (plain list, no diagnosis language); `## How we treat {concern} at Pathways Within` (which services and modalities, linked); `## What your first weeks look like`; `## Medication, therapy, or both`; `## Where and how` (locations, telehealth); `## Who you might work with` (provider cards filtered by specialty); `## Common questions`; `## Take the next step`. One verified citation minimum where a matching NIMH page exists.

**Insurance page** (500 to 700 words): H1 "Therapists Who Accept {Insurer} on Long Island"; opening paragraph that says Pathways Within works with {Insurer} for [services] and the Welcome Team verifies benefits; `## What {Insurer} may cover here`; `## How verification works` (360 intake, no insurance gate); `## Out of network and self pay options`; `## Locations and telehealth`; `## Common questions` (3 to 4); `## Take the next step`. Never state copays, deductibles, or guarantees. Magnacare and NYSHIP therapy pages must say out of network for therapy per the old FAQ, and NYSHIP page must say in network for eligible medical massage.

**Location page** (600 to 800 words): H1 "Therapy and Wellness in {Town}, NY"; opening paragraph with full address; `## Services at this office` (linked list, honest to what is offered there); `## Getting here` (address, parking, transit if known, accessibility sentence); `## Hours`; `## Providers at this office`; `## Nearby communities we serve` (3 to 6 real neighboring towns, text only, no links, no separate pages); `## Common questions`; `## Take the next step`.

**Provider page**: rendered from the providers sheet by Cursor. Template in /pages/_provider-template.md. Model page: /pages/providers/rachel-lessard.md.

**Hub and trust pages**: structure given in each file.

## 4. Copy rules (hard)
- No hyphens or dashes anywhere in copy, including compound modifiers. Write "whole person", "long term", "in person", "follow up", "first responders", "one on one", "self esteem", "well being", "e stim" (or "electrical stimulation"). Exception: credentials like LCSW-R, MHC-LP, RN-BC, and product names like "Parent Child Interaction Therapy" written without the hyphen.
- No AI telltale phrasing. Banned: seamless, robust, leverage, streamline, happy to, through line, operationally, journey (except when quoting the client's brand line "healing is not a straight line" or the labyrinth passage), holistic (use "whole person"), delve, tapestry, unlock, unleash, empower, foster, navigate, elevate, harness, transformative, comprehensive, cutting edge, "it's important to note", "in today's", "look no further".
- No stacked short fragments. No rhetorical question openers. No "Are you ready to discover your best self?"
- Sentences under 25 words, mean 12 to 16. Paragraphs 1 to 4 sentences. Reading level around grade 8.
- Active voice, named actor ("Your therapist reviews", not "your history will be reviewed").
- Authority, Education, Direct Ask on every page. Say the credential, explain the thing, ask for the call.
- YMYL rules: no cure claims, no "immediate results", no "the only treatment", no "FDA approved" unless a citation is on the list, no dosage or protocol detail beyond what the client wrote. Medication and ketamine pages say "your prescriber" and never "your therapist gives you the dose." Cryotherapy page carries a contraindication sentence and no mental health treatment claims. Energy work pages describe the practice and what clients report, with the sentence "Energy work is not a substitute for medical or mental health treatment."
- Crisis line: every Wisdom service, concern, teen, and veterans page ends its opening section with: "If you are in crisis or thinking about harming yourself, call or text 988 (Veterans: press 1) or call 911."
- Client language wins. Where the client supplied copy (massage, acupuncture, about, Rachel, medication management, coaching, family, IFS, cupping), keep their sentences and fix only hyphens, banned words, structure, and length.
- Localize: "Long Island", "Nassau County", "Suffolk County", town names where true. No "near me" in copy.

## 5. Title and meta rules
- Title 50 to 60 characters, pattern `{Page keyword} | Pathways Within` (suffix 18 chars). Count them. No pipe elsewhere in the title.
- Meta 140 to 155 characters. Sentence one: what and who. Sentence two: Long Island, in person or telehealth, next step. No exclamation points.
- H1 under 70 characters, contains the target phrase, not identical to the title.
- Every title, meta, and H1 unique across the site.

## 6. JSON LD

Site wide (Cursor injects on every page; do not repeat in page files):
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"MedicalOrganization","@id":"https://pathwayswithinwellness.com/#org","name":"Pathways Within","url":"https://pathwayswithinwellness.com/","logo":"https://pathwayswithinwellness.com/images/logo.png","telephone":"+1-631-371-3825","email":"Welcome@pathwayswithin.com","founder":{"@id":"https://pathwayswithinwellness.com/providers/rachel-lessard#person"},"medicalSpecialty":["Psychiatric","Psychotherapy"],"areaServed":[{"@type":"AdministrativeArea","name":"Nassau County, NY"},{"@type":"AdministrativeArea","name":"Suffolk County, NY"}],"sameAs":["https://wizehire.com/cmp/pathways-within","[NEEDS: Instagram URL]","[NEEDS: Facebook URL]","[NEEDS: LinkedIn URL]"]},
 {"@type":"WebSite","@id":"https://pathwayswithinwellness.com/#website","url":"https://pathwayswithinwellness.com/","name":"Pathways Within","publisher":{"@id":"https://pathwayswithinwellness.com/#org"}}
]}
```

Per page (in the page file, at the end, inside a ```json fence):
- Every page: `BreadcrumbList` and a `WebPage` (or `MedicalWebPage` for service and concern pages) with `isPartOf` #website, `about`, `reviewedBy` (Person @id), `lastReviewed`, `author` (Person @id).
- Service page: add `MedicalTherapy` (or `MedicalProcedure` for acupuncture, cupping) as the `about` node with `name`, `description`, `provider` #org, `availableService` not needed.
- Concern page: `about` is a `MedicalCondition` with `name` and, where an NIMH link exists, `sameAs`.
- Insurance page: `WebPage` only; `about` is the org; add `"acceptedPaymentMethod"` nothing. Do not mark up insurers as organizations you do not control.
- Location page: `MedicalClinic` node with `@id` `.../locations/{slug}#place`, `name` "Pathways Within {Town}", `parentOrganization` #org, `address` (PostalAddress), `telephone`, `url`, `geo` ([NEEDS: lat/long to 5 decimals]), `openingHoursSpecification` placeholder:
  ```json
  "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"[NEEDS]","closes":"[NEEDS]"}]
  ```
  plus `amenityFeature` with `LocationFeatureSpecification` `name: "Wheelchair accessible", value: true|false`, and `hasMap` "[NEEDS: Google Maps URL]".
- Provider page: `ProfilePage` with `mainEntity` a `Person` `@id` `.../providers/{slug}#person`, `name`, `jobTitle`, `honorificSuffix`, `hasCredential` (EducationalOccupationalCredential per license), `worksFor` #org, `knowsAbout` (specialties), `image`, `url`, `workLocation` (place @ids).
- Article and resource pages: `Article` with `author`, `datePublished`, `dateModified`, `publisher` #org.
- No `FAQPage`. No `HowTo`. No `AggregateRating`.

## 7. Internal linking minimums
Service page: 2 related services, all locations offering it, its providers, /how-it-works, /insurance-and-fees, 2 concern pages. Concern page: 2 to 4 services, /medication-management where relevant, /how-it-works, providers. Location page: every service offered there, /how-it-works, /contact. Insurance page: /insurance-and-fees, /how-it-works, 3 top services, /locations. Every page links back to its pillar hub.

## 8. Quality gate (script checks these before delivery)
Title 50 to 60 chars; meta 140 to 155; H1 under 70 and unique; no hyphen or dash characters in body copy outside credentials, URLs, and the JSON block; no banned words; word count in range for page type; every internal link target exists in the URL map; author block present; JSON parses.
