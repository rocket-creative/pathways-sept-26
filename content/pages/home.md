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
last_reviewed: 2026-09-25
index: true
nav: primary
related_services: [/therapy, /wellness, /medication-management]
related_concerns: [/concerns/anxiety, /concerns/depression]
locations: [rockville-centre, garden-city, massapequa, smithtown, port-jefferson, telehealth]
providers: []
hero_image: "[NEEDS: hero render] The Pathways Within labyrinth path winding through a white landscape with a cairn, a tide pool, and two figures at callout stops"
---

# Therapy, Medication Management, and Wellness on Long Island

Pathways Within is a mental health and wellness practice on Long Island. Therapy, medication management, wellness, and coaching can live in one plan, built around you. Start with one conversation.

[CTA] Contact Us -> /contact

Text (631) 371-3825.

[HERO: pinned horizontal scroll. Service cards, then a closing contact card. The H1 above stays in normal flow before pinning begins.]

## Therapy

Licensed therapists for individuals, couples, children, teens, and families across Nassau and Suffolk County, in person or by video. [Explore therapy](/therapy)

## Medication management

Psychiatric medication management for ages 10 and up, alongside therapy when you want both. [Explore medication management](/medication-management)

## Wellness

Licensed massage, acupuncture, cupping, and energy work, on their own or with the rest of your care. [Explore wellness](/wellness)

## Coaching

Performance and wellness coaching for the changes you want to make now. It is not therapy, and it can sit beside it. [Explore coaching](/coaching)

[HERO CTA: closing card]

## Start here

[CTA] Contact Us -> /contact

[/HERO]

## The Pathways Within 360 experience

You do not have to arrive knowing which door is yours. People come for therapy, medication management, wellness, coaching, or a mix. The 360 Intake is one conversation about your mind, your body, and your daily life. It helps decide where to start, and what can wait.

[CTA] Contact Us -> /contact

## Your path is your own

The labyrinth in our logo is not a maze. There is no wrong turn and no single route through care. You might start with a therapist, a prescriber, a massage, or a coach. What you need can change, and the plan can change with it. The right path is the one that fits you.

## What we believe

People are not one thing, so care should not be either. Mental, physical, and emotional health overlap, and Pathways Within was built so they can be looked at together. Care here is personal. It can start small, and it can evolve.

"Pathways Within is the kind of place I wished existed when I was learning how to find my own path." Rachel Lessard, LCSW-R, founded the practice. [About Pathways Within](/about)

## Where to find us

Five offices across Nassau and Suffolk County: Rockville Centre, Garden City, Massapequa, Smithtown, and Port Jefferson. Therapy and medication management are also available by video when you are in New York.

[CTA] Explore locations -> /locations

## Not sure where to start?

Take the quiz, send a message, or look through the team.

[QUIZ]
The quiz below routes you to a starting point. Every path ends at the same place: Contact Us.
[/QUIZ]

[CTA] Contact Us -> /contact

[CTA] Find a Provider -> /providers

If you are in crisis or thinking about harming yourself, call or text 988 (Veterans: press 1) or call 911.

[SEO AND BUILD NOTES FOR THE HERO, for Cursor]
1. All six stops are real HTML in the DOM at load, in this reading order, as <section> elements with <h2> and <p>. Nothing is injected on scroll. Googlebot renders the page once with a tall viewport and does not scroll, so anything that only exists after a scroll event does not exist to Google.
2. Move cards with transform only (GSAP ScrollTrigger pin + x translate). Never opacity:0, visibility:hidden, or display:none as the resting state. Cards may start slightly offset and settle in, but must be fully visible without JavaScript and after the page load animation finishes. Add a `.no-js` fallback that lays the cards out vertically.
3. The page blur after stop 6 applies to a background layer only (the branch/world render), never to text. Text under the blur is still readable and still selectable.
4. No scroll hijacking: do not change scroll position on load, do not strip or rewrite the URL hash, do not wire wheel events to horizontal movement. Pinning via ScrollTrigger keeps native scroll, which is what Google's "read more" deep link rule requires. Each H2 keeps its id so /#wisdom-therapy lands on that card.
5. `prefers-reduced-motion: reduce` disables the pin and shows the six stops as a vertical stack with the same markup. Mobile under 768px does the same; horizontal pinning is desktop only.
6. Keyboard: the six links are in tab order left to right; focusing a card scrolls it into view. Screen readers read the section as six headings in a row, which is the vertical fallback anyway.
7. LCP: the first paint is the H1 and the branch render. Preload the branch image, serve AVIF/WebP, set width and height. Load GSAP deferred; the hero must be readable before GSAP arrives.
8. The H1 stays in normal document flow above the pinned section so it is the first heading Google sees, not a card.


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
      "lastReviewed": "2026-09-25",
      "inLanguage": "en-US"
    }
  ]
}
```
