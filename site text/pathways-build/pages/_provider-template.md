---
url: /providers/{{slug}}
title: "{{first_name}} {{last_name}}, {{credentials}} | Pathways Within"
meta: "{{first_name}} {{last_name}}, {{credentials}}, is a {{title_line}} at Pathways Within on Long Island. Works with {{age_groups}}. In person and by telehealth. Book a 360 intake."
h1: "{{first_name}} {{last_name}}, {{credentials}}"
page_type: provider
pillar: {{pillars}}
target_query: "{{first_name}} {{last_name}} {{credentials}}"
author: "Rachel Lessard, LCSW-R"
reviewer: "Rachel Lessard, LCSW-R"
last_reviewed: 2026-09-16
index: {{active}}
nav: none
related_services: [{{modalities -> service URLs}}]
related_concerns: [{{specialties -> concern URLs}}]
locations: [{{locations}}]
providers: [{{slug}}]
hero_image: "{{headshot_url}} {{first_name}} {{last_name}}, {{credentials}}, {{title_line}} at Pathways Within"
---

<!--
TEMPLATE NOTES FOR CURSOR (do not render)

Source: data/providers-sheet.csv. Render one page per row where active = true and role is not Admin. Rows with role Admin (Gloria Saladino) get a directory listing on /providers only, no page.

Every column in the sheet is used below: slug, first_name, last_name, credentials, title_line, role, pillars, specialties, modalities, age_groups, locations, formats, headshot_url, bio_p1, bio_p2, bullet_1, bullet_2, bullet_3, active, notes.

Title rule: the pattern is "{{first_name}} {{last_name}}, {{credentials}} | Pathways Within". Count the characters. If the title is over 60, truncate credentials to the first credential only (for example "Tiffany Roberts, PMHNP | Pathways Within" or "Lauren Hollander, LCSW | Pathways Within"). If the title is under 50, append the first word of {{role}} or {{title_line}} before the pipe (for example "Joe Bush, LCSW, Clinical Director | Pathways Within"). Never let a pipe appear anywhere else in the title.

Meta rule: 140 to 155 characters. If the rendered meta is over 155, drop "In person and by telehealth." first, then shorten {{title_line}} to {{role}}. If under 140, add the first two items from {{specialties}} after {{age_groups}}: "Works with {{age_groups}} on {{specialty_1}} and {{specialty_2}}."

Semicolon lists ({{pillars}}, {{specialties}}, {{modalities}}, {{age_groups}}, {{locations}}, {{formats}}) render as comma separated text in copy, and as arrays in front matter and JSON.

{{modalities -> service URLs}}: map each modality to its service page in data/url-map.csv (for example "trauma therapy" to /therapy/trauma-therapy, "couples therapy" to /therapy/couples-therapy, "medication management" to /medication-management, "medical massage" to /wellness/massage, "acupuncture" to /wellness/acupuncture, "cupping" to /wellness/cupping, "Reiki" to /wellness/energy-work/reiki, "IET" to /wellness/energy-work/iet, "coaching" to /coaching, "IFS" and "parts work" to /therapy/ifs, "somatic therapy" and "Somatic Experiencing" to /therapy/somatic-therapy, "hypnotherapy" to /therapy/hypnotherapy, "family therapy" to /therapy/family-therapy, "child therapy" to /therapy/child-therapy, "individual therapy" to /therapy/individual-therapy). Modalities with no page (CBT, psychodynamic, humanistic, mindfulness, acupressure, electrical stimulation, deep tissue, trigger point) render as plain text, not links.

{{specialties -> concern URLs}}: map specialties to /concerns/ pages where one exists (anxiety, depression, PTSD, ADHD, OCD, grief, relationship issues, postpartum, stress, life transitions, self esteem, bipolar disorder, LGBTQ+ or LGBTQIA+, substance use or addiction, chronic pain or chronic illness). Others render as plain text.

{{locations}}: every row currently reads [NEEDS]. Until the sheet is filled, render "[NEEDS: assign {{first_name}} to offices in the sheet]" in the Offices section and omit workLocation from the JSON.

{{notes}} is for the build team and is never rendered.

Rachel Lessard and Tiffany Roberts have hand written pages at pages/providers/rachel-lessard.md and pages/providers/tiffany-roberts.md that override this template.
-->

# {{first_name}} {{last_name}}, {{credentials}}

**{{title_line}}** at Pathways Within on Long Island. {{role}}. Part of the {{pillars}} team.

[IMAGE: {{headshot_url}} Portrait of {{first_name}} {{last_name}}, {{credentials}}]

{{first_name}} works with {{age_groups}} and sees clients {{formats}}. Every new client begins with a 360 intake with the Welcome Team, who then matches you with {{first_name}} or another provider who fits what you need.

[CTA] Book with {{first_name}} -> /contact

## About {{first_name}}

{{bio_p1}}

{{bio_p2}}

## Areas of focus

- {{bullet_1}}
- {{bullet_2}}
- {{bullet_3}}

{{first_name}}'s specialties include {{specialties}}.

## Works with

**Age groups:** {{age_groups}}

**Formats:** {{formats}}

Telehealth is available to clients in New York, New Jersey, North Carolina, and Florida. Wellness services such as massage and acupuncture are in person only.

## Offices

[LOCATION CARDS: {{locations}}]

[NEEDS: assign {{first_name}} to offices in the sheet]

See all [locations](/locations).

## Services

{{first_name}} offers {{modalities}}. Learn more about each approach:

- {{modalities -> service URLs, one linked list item per modality with a page}}

Read more about [how care works here](/how-it-works), including the 360 intake and how the Welcome Team coordinates therapy, medication management, and wellness.

## Book with {{first_name}}

Tell the Welcome Team you would like to work with {{first_name}} {{last_name}}. They will schedule your 360 intake, confirm availability, and set up your first appointment. If {{first_name}} does not have openings, they will suggest another provider with a similar focus.

[CTA] Book with {{first_name}} -> /contact

Or call (631) 371-3825.

**Written by** [Rachel Lessard, LCSW-R](/providers/rachel-lessard). **Clinically reviewed by** [Rachel Lessard, LCSW-R](/providers/rachel-lessard). **Last reviewed** September 16, 2026. Profile reviewed by Rachel Lessard, LCSW-R.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://pathwayswithinwellness.com/"},
        {"@type": "ListItem", "position": 2, "name": "Providers", "item": "https://pathwayswithinwellness.com/providers"},
        {"@type": "ListItem", "position": 3, "name": "{{first_name}} {{last_name}}", "item": "https://pathwayswithinwellness.com/providers/{{slug}}"}
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://pathwayswithinwellness.com/providers/{{slug}}#webpage",
      "url": "https://pathwayswithinwellness.com/providers/{{slug}}",
      "name": "{{first_name}} {{last_name}}, {{credentials}} | Pathways Within",
      "isPartOf": {"@id": "https://pathwayswithinwellness.com/#website"},
      "mainEntity": {"@id": "https://pathwayswithinwellness.com/providers/{{slug}}#person"},
      "about": {"@id": "https://pathwayswithinwellness.com/providers/{{slug}}#person"},
      "author": {"@id": "https://pathwayswithinwellness.com/providers/rachel-lessard#person"},
      "reviewedBy": {"@id": "https://pathwayswithinwellness.com/providers/rachel-lessard#person"},
      "lastReviewed": "2026-09-16",
      "inLanguage": "en-US"
    },
    {
      "@type": "Person",
      "@id": "https://pathwayswithinwellness.com/providers/{{slug}}#person",
      "name": "{{first_name}} {{last_name}}",
      "givenName": "{{first_name}}",
      "familyName": "{{last_name}}",
      "honorificSuffix": "{{credentials}}",
      "jobTitle": "{{title_line}}",
      "description": "{{bio_p1}}",
      "image": "{{headshot_url}}",
      "url": "https://pathwayswithinwellness.com/providers/{{slug}}",
      "worksFor": {"@id": "https://pathwayswithinwellness.com/#org"},
      "hasCredential": [{"@type": "EducationalOccupationalCredential", "credentialCategory": "license", "name": "{{title_line}}, New York"}],
      "knowsAbout": ["{{specialties as array}}"],
      "workLocation": [{"@id": "https://pathwayswithinwellness.com/locations/{{location slug}}#place"}]
    }
  ]
}
```
