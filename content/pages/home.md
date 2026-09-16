---
url: /
title: "Therapy and Wellness on Long Island | Pathways Within"
meta: "Pathways Within offers therapy, medication management, and wellness care at five Long Island offices and by telehealth. One intake, one care plan."
h1: "Therapy, Medication Management, and Wellness on Long Island"
page_type: hub
pillar: none
target_query: "therapy Long Island"
author: "Rachel Lessard, LCSW-R"
reviewer: "Rachel Lessard, LCSW-R"
last_reviewed: 2026-09-16
index: true
nav: primary
related_services: [/therapy, /wellness, /medication-management]
related_concerns: [/concerns/anxiety, /concerns/depression]
locations: [rockville-centre, garden-city, massapequa, smithtown, port-jefferson, telehealth]
providers: []
hero_image: "[NEEDS: hero render] The Pathways Within labyrinth path winding through a white landscape with a cairn, a tide pool, and two figures at callout stops"
---

# Therapy, Medication Management, and Wellness on Long Island

Pathways Within is a mental health and wellness practice with five offices across Nassau and Suffolk County and telehealth in four states. Therapy, psychiatric medication management, massage, acupuncture, and energy work live under one roof, so your care plan can be built around the whole of you. Start with one conversation.

[CTA] Start your 360 intake -> /contact

Or call (631) 371-3825.

[HERO: pinned horizontal scroll, 5 stops + CTA. Build rules in section 3 of 00-cursor-master-prompt.md and the SEO notes at the end of this file. Each stop below is one card: the H2 is the card heading, the paragraph is the card body, the link is the card's one action. The H1 above is stop 0 and stays in normal flow before pinning begins.]

## Healing is not a straight line

The labyrinth in our logo is not a maze. There are no wrong turns and no dead ends. The path winds, pauses, circles inward, and opens back out, but it keeps moving. You start where you are and choose the support that fits now, knowing it may change. [How care works](/how-it-works)

## Wisdom: therapy

Licensed therapists for individuals, couples, children, teens, and families across Nassau and Suffolk County. Trauma work including EMDR, IFS, and somatic therapy. Group therapy, hypnotherapy, support for veterans and first responders, and bariatric surgery evaluations. [Explore therapy](/therapy)

## Medication management

A psychiatric nurse practitioner who takes the time to understand what is going on before anything is prescribed. Ages 10 and up, in person or by telehealth. Works alongside your therapist when you have one, so medication and therapy pull in the same direction. [Explore medication management](/medication-management)

## Wellness: the body

New York State licensed massage therapists, a licensed acupuncturist, cupping, and energy work. Book on their own or add them to a plan that includes therapy, because stress and grief live in the body too. NYSHIP accepted for eligible medical massage. [Explore wellness](/wellness)

## One conversation starts everything

You do not need to know which service you need. You tell the Welcome Team what you are experiencing. They schedule a 360 intake, a conversation that looks at your mind, your body, and your daily life together, then build one plan and match you with available providers. [See every step](/how-it-works)

[HERO CTA: stop 6, full width]

## Ready when you are

[CTA] Start your 360 intake -> /contact

Or call (631) 371-3825. Five Long Island offices and telehealth in four states.

[/HERO]

## What people come to us for

[Anxiety](/concerns/anxiety) · [Depression](/concerns/depression) · [Trauma and PTSD](/concerns/ptsd) · [ADHD](/concerns/adhd) · [Relationship issues](/concerns/relationship-issues) · [Grief and loss](/concerns/grief-and-loss) · [Stress and burnout](/concerns/stress-and-burnout) · [Life transitions](/concerns/life-transitions) · [Chronic pain and illness](/concerns/chronic-pain-and-illness) · [All concerns](/concerns)

## Find a provider

Search our clinicians and wellness practitioners by concern, modality, age group, office, and format. One provider can appear under more than one pillar, because that is how people actually get better. [Browse providers](/providers).

[PROVIDER CARDS: rachel-lessard, tiffany-roberts, leonard-ma, christine-cervo]

## Five offices and telehealth

Rockville Centre, Garden City, Massapequa, Smithtown, and Port Jefferson, plus telehealth for clients in New York, New Jersey, North Carolina, and Florida. Two offices are fully accessible; two are reached by stairs. Details on each [location page](/locations).

[LOCATION CARDS: rockville-centre, garden-city, massapequa, smithtown, port-jefferson]

## Insurance

We work with most major plans, including Aetna, Cigna, Optum, UnitedHealthcare, Oxford, Oscar, 1199SEIU, Medicare, and Northwell Direct. Coverage varies by provider, service, and plan, and the Welcome Team verifies benefits after your intake. A limited number of sliding scale spots are available. [Insurance and fees](/insurance-and-fees).

## From the founder

"Pathways Within is the kind of place I wished existed when I was learning how to find my own path." Rachel Lessard, LCSW-R, founded the practice as a small therapy office and grew it into a collaborative organization across Long Island. [Meet Rachel](/providers/rachel-lessard).

## Take the next step

Tell the Welcome Team what is going on. They will handle the rest.

[CTA] Start your 360 intake -> /contact

Call or text (631) 371-3825. If you are in crisis or thinking about harming yourself, call or text 988 (Veterans: press 1) or call 911.

[SEO AND BUILD NOTES FOR THE HERO, for Cursor]
1. All six stops are real HTML in the DOM at load, in this reading order, as <section> elements with <h2> and <p>. Nothing is injected on scroll. Googlebot renders the page once with a tall viewport and does not scroll, so anything that only exists after a scroll event does not exist to Google.
2. Move cards with transform only (GSAP ScrollTrigger pin + x translate). Never opacity:0, visibility:hidden, or display:none as the resting state. Cards may start slightly offset and settle in, but must be fully visible without JavaScript and after the page load animation finishes. Add a `.no-js` fallback that lays the cards out vertically.
3. The page blur after stop 6 applies to a background layer only (the branch/world render), never to text. Text under the blur is still readable and still selectable.
4. No scroll hijacking: do not change scroll position on load, do not strip or rewrite the URL hash, do not wire wheel events to horizontal movement. Pinning via ScrollTrigger keeps native scroll, which is what Google's "read more" deep link rule requires. Each H2 keeps its id so /#wisdom-therapy lands on that card.
5. `prefers-reduced-motion: reduce` disables the pin and shows the six stops as a vertical stack with the same markup. Mobile under 768px does the same; horizontal pinning is desktop only.
6. Keyboard: the six links are in tab order left to right; focusing a card scrolls it into view. Screen readers read the section as six headings in a row, which is the vertical fallback anyway.
7. LCP: the first paint is the H1 and the branch render. Preload the branch image, serve AVIF/WebP, set width and height. Load GSAP deferred; the hero must be readable before GSAP arrives.
8. The H1 stays in normal document flow above the pinned section so it is the first heading Google sees, not a card.

**Written by** [Rachel Lessard, LCSW-R](/providers/rachel-lessard). **Clinically reviewed by** [Rachel Lessard, LCSW-R](/providers/rachel-lessard). **Last reviewed** September 16, 2026.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://pathwayswithinwellness.com/#webpage",
      "url": "https://pathwayswithinwellness.com/",
      "name": "Therapy and Wellness on Long Island | Pathways Within",
      "isPartOf": {"@id": "https://pathwayswithinwellness.com/#website"},
      "about": {"@id": "https://pathwayswithinwellness.com/#org"},
      "author": {"@id": "https://pathwayswithinwellness.com/providers/rachel-lessard#person"},
      "reviewedBy": {"@id": "https://pathwayswithinwellness.com/providers/rachel-lessard#person"},
      "lastReviewed": "2026-09-16",
      "inLanguage": "en-US"
    }
  ]
}
```
