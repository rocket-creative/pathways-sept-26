import type { ImageGroup } from "@/lib/images/types";

/**
 * Homepage, About, Providers hub, Blog, and the two hand written provider
 * pages. Source folders: home/, about-us/, 360-degree-wellness/, news folders,
 * plus approved/offices and approved/headshots from the photographer export.
 *
 * OWNER: home and about curation agent.
 *
 * Editorial notes
 * - "/" keeps its own pinned hero; only the lower sections take a figure.
 * - After-hero homepage cards use approved office and editorial photographs
 *   (ha-ap-*) so the glass bento reads as the real practice, not stock.
 * - The two provider pages (/providers/rachel-lessard, /providers/tiffany-roberts)
 *   resolve their [IMAGE: Portrait …] marker from HEADSHOTS. Rachel's page also
 *   takes two section figures below (scenes, not a second portrait).
 * - The news* folders hold Instagram templates and a logo only; the podcast
 *   page's "Long Island therapist Rachel Lessard" webp is the same template
 *   PNG under another name, so Rachel's real portrait is used instead.
 */
export const HOME_ABOUT: ImageGroup = {
  name: "home-about",
  assets: [
    // --- Approved photographer exports (ha-ap-*) -----------------------
    // Rachel Lessard approved headshot (4000x6000). Square "top" keeps the face.
    {
      id: "ha-ap-rachel-lessard",
      file: "approved/headshots/rachel-lessard.jpg",
      square: "top",
    },
    // Editorial portraits for warm team figures (not HEADSHOTS registry).
    {
      id: "ha-ap-editorial-emily",
      file: "approved/headshots/editorial/emily-dugan.jpg",
      square: "top",
    },
    {
      id: "ha-ap-editorial-amanda",
      file: "approved/headshots/editorial/amanda-baylis.jpg",
      square: "top",
    },
    {
      id: "ha-ap-editorial-saul",
      file: "approved/headshots/editorial/saul-alvarez.jpg",
      square: "top",
    },
    // Massapequa Wisdom: plum walls, sunflower seating, confidentiality sign.
    {
      id: "ha-ap-therapy-massapequa",
      file: "approved/offices/massapequa/_24M6896-gb-e.jpg",
    },
    // Smithtown Wisdom: seafoam waiting room with elephant and owl art.
    {
      id: "ha-ap-waiting-smithtown",
      file: "approved/offices/smithtown/_24M8717-gb-e.jpg",
    },
    // Garden City Wisdom: three white chairs around a dark wood table.
    {
      id: "ha-ap-waiting-garden-city",
      file: "approved/offices/garden-city/_24M6878-gb-e.jpg",
    },
    // Garden City Wisdom: navy sofas, emoji pillows, pride flags.
    {
      id: "ha-ap-group-room-garden-city",
      file: "approved/offices/garden-city/_24M6885-gb-e.jpg",
    },
    // Front desk: receptionist greeting a visitor under the Pathways sign.
    {
      id: "ha-ap-front-desk-welcome",
      file: "approved/offices/front-desk/_24M8456-gb-e.jpg",
    },
    // Front desk: two staff members and a visitor at the wood reception desk.
    {
      id: "ha-ap-front-desk-team",
      file: "approved/offices/front-desk/_24M8647-gb-e-1-.jpg",
    },
    // Waiting area: clinician in scrubs greeting a seated visitor.
    {
      id: "ha-ap-waiting-greeting",
      file: "approved/offices/front-desk/_24M8514-gb-e.jpg",
    },
    // Smithtown Wellness: massage table, beach mural, sea-turtle chair.
    {
      id: "ha-ap-massage-room",
      file: "approved/offices/smithtown-wellness/_24M8744-gb-e.jpg",
    },
    // Garden City Wellness: navy velvet chairs and product shelving.
    {
      id: "ha-ap-wellness-lobby",
      file: "approved/offices/garden-city-wellness/_24M6853-gb-e.jpg",
    },
    // Rockville Centre: coffee bar under the Pathways Within wall sign.
    {
      id: "ha-ap-coffee-bar",
      file: "approved/offices/rockville-centre/_24M6835-gb-e.jpg",
    },
    // Rockville Centre: pale hallway looking into a teal therapy room.
    {
      id: "ha-ap-hallway-rvc",
      file: "approved/offices/rockville-centre/_24M6840-gb-e.jpg",
    },
    // Port Jefferson: blue hallway with teal chairs and a tall petal lamp.
    {
      id: "ha-ap-waiting-port-jefferson",
      file: "approved/offices/port-jefferson/_24M8795-gb-e.jpg",
    },

    // --- Legacy / still-used sources -----------------------------------
    // White-washed stone path leading down to the sea at dusk (2268x4032).
    { id: "ha-path-to-the-sea", file: "about-us/a-beautiful-white-washed-path-leads-to-an-ocean-se-2026-03-17-21-28-27-utc.jpeg" },
    // Hand touching still water at sunrise (2500x1667).
    { id: "ha-hand-on-water", file: "360-degree-wellness/yoann-boyer-i14h2xyPr18-unsplash.jpg" },
    // Gypsy, one of the two therapy dogs (596x868; small, but the real dog).
    { id: "ha-gypsy-therapy-dog", file: "clinicians/Gypsy+Therapy+Dog+on+Long+Island.jpg", square: "top" },
    // /providers/rachel-lessard also uses th-session-hands (therapy.ts) and
    // cw-labyrinth-beach (concerns-wellness.ts); ids resolve across groups.
  ],
  pages: {
    "/": {
      sections: {
        // Warm therapy interior — oversized media column, plus a waiting band.
        "what-people-come-to-us-for": [
          {
            asset: "ha-ap-therapy-massapequa",
            alt: "A therapy office corner with plum walls, sunflower arrangements, and a mustard yellow chair beside a confidentiality sign",
            shape: "circle",
            side: "end",
            layout: "feature",
            focal: "center",
          },
          {
            asset: "ha-ap-waiting-port-jefferson",
            alt: "A Port Jefferson office hallway with teal chairs, a tall white floor lamp, and light blue walls",
            shape: "rounded",
            aspect: "landscape",
            layout: "band",
            focal: "center",
          },
        ],
        // Circle portrait feel for finding a clinician.
        "find-a-provider": {
          asset: "ha-ap-editorial-amanda",
          alt: "Amanda Baylis, smiling in a sunlit office with plants behind her",
          shape: "circle",
          side: "end",
          focal: "center",
        },
        // Real office waiting rooms as immersive bands.
        "five-offices-and-telehealth": [
          {
            asset: "ha-ap-waiting-smithtown",
            alt: "A Pathways Within waiting room with grey chairs, a lattice wood coffee table, and colorful animal paintings on seafoam walls",
            shape: "rounded",
            aspect: "landscape",
            side: "start",
            layout: "band",
            focal: "center",
          },
          {
            asset: "ha-ap-group-room-garden-city",
            alt: "A therapy group room with navy sofas, emoji pillows, and a blue-and-gold abstract painting",
            shape: "rounded",
            aspect: "landscape",
            layout: "band",
            focal: "center",
          },
        ],
        // Quiet waiting nook detail.
        insurance: {
          asset: "ha-ap-waiting-garden-city",
          alt: "Three white chairs and a dark wood coffee table in a quiet office waiting corner",
          shape: "circle",
          side: "end",
          focal: "center",
        },
        "from-the-founder": {
          asset: "ha-ap-rachel-lessard",
          alt: "Rachel Lessard, LCSW-R, founder of Pathways Within",
          shape: "circle",
          side: "start",
          focal: "center",
        },
        // Inviting front desk, plus a calm massage-room band to close the page.
        "take-the-next-step": [
          {
            asset: "ha-ap-front-desk-welcome",
            alt: "A receptionist smiling at a visitor across the dark wood front desk under the Pathways Within wall sign",
            shape: "circle",
            side: "end",
            focal: "38% 32%",
          },
          {
            asset: "ha-ap-massage-room",
            alt: "A calm massage and acupuncture room with a beach mural, sea-turtle chair, and draped treatment table",
            shape: "rounded",
            aspect: "landscape",
            layout: "band",
            focal: "center",
          },
        ],
      },
    },

    "/about": {
      hero: { asset: "ha-ap-wellness-lobby", alt: "", focal: "center" },
      sections: {
        "who-we-are-and-why-we-are-here": {
          asset: "ha-ap-editorial-emily",
          alt: "Emily Dugan smiling in a plant-filled office, wearing a light blue cardigan",
          shape: "circle",
          side: "start",
          focal: "center",
        },
        "how-pathways-found-its-way": {
          asset: "ha-path-to-the-sea",
          alt: "A white-washed stone path leading down to the sea at dusk",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "bottom",
        },
        "the-labyrinth": {
          asset: "cw-labyrinth-beach",
          alt: "A stone labyrinth laid out on a headland above the sea, with one person walking it",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          focal: "center",
        },
        "what-we-believe": {
          asset: "ha-ap-coffee-bar",
          alt: "A coffee and tea station under a wooden Pathways Within wall sign in the Rockville Centre office",
          shape: "circle",
          side: "end",
          focal: "center",
        },
        "the-people-helping-lead-the-way": {
          asset: "ha-ap-editorial-saul",
          alt: "Saul Alvarez in a white shirt, standing among green plants in the office",
          shape: "circle",
          side: "start",
          focal: "center",
        },
        "take-the-next-step": {
          asset: "ha-ap-front-desk-team",
          alt: "Two Pathways Within staff members greeting a visitor at the front desk",
          shape: "circle",
          side: "end",
          focal: "42% 28%",
        },
      },
    },

    "/providers": {
      hero: { asset: "ha-ap-group-room-garden-city", alt: "", focal: "center" },
      sections: {
        "pathways-within-wisdom-and-wellness-collaborative-specialists": {
          asset: "ha-ap-waiting-port-jefferson",
          alt: "A Port Jefferson office hallway with teal chairs, a tall white floor lamp, and light blue walls",
          shape: "circle",
          side: "end",
          focal: "center",
        },
        leadership: {
          asset: "ha-ap-waiting-greeting",
          alt: "A clinician in blue scrubs greeting a visitor seated in a turtle-patterned armchair",
          shape: "circle",
          side: "start",
          focal: "42% 28%",
        },
        "the-welcome-team": {
          asset: "ha-ap-front-desk-welcome",
          alt: "A receptionist smiling at a visitor across the dark wood front desk under the Pathways Within wall sign",
          shape: "circle",
          side: "end",
          focal: "38% 32%",
        },
        "our-therapy-dogs": {
          asset: "ha-gypsy-therapy-dog",
          alt: "Gypsy, a curly-haired therapy dog, sitting on a rug",
          shape: "circle",
          side: "start",
          focal: "top",
        },
        "take-the-next-step": {
          asset: "ha-ap-massage-room",
          alt: "A calm massage and acupuncture room with a beach mural, sea-turtle chair, and draped treatment table",
          shape: "circle",
          side: "end",
          focal: "center",
        },
      },
    },

    "/blog": {
      hero: { asset: "ha-hand-on-water", alt: "", focal: "center" },
    },

    "/blog/a-new-way-podcast": {
      sections: {
        "about-rachel": {
          asset: "ha-ap-rachel-lessard",
          alt: "Rachel Lessard, LCSW-R, founder of Pathways Within",
          shape: "circle",
          side: "end",
          focal: "center",
        },
      },
    },

    "/careers": {
      hero: { asset: "ha-ap-waiting-greeting", alt: "", focal: "42% 28%" },
      sections: {
        // Takes the long card out of its pair so the two short ones
        // ("How hiring works", "Questions") pair with each other.
        "why-people-stay": {
          asset: "ha-ap-editorial-emily",
          alt: "Emily Dugan smiling in a plant-filled office, wearing a light blue cardigan",
          shape: "circle",
          side: "end",
          focal: "center",
        },
        "how-hiring-works": {
          asset: "ha-ap-hallway-rvc",
          alt: "A light blue office hallway with wood floors looking into a teal therapy room",
          shape: "circle",
          side: "start",
          focal: "center",
        },
      },
    },

    // Rachel's headshot already sits in the page lockup, so the section
    // figures are scenes, not her portrait. The long quote takes a figure
    // (which leaves "What Rachel does clinically" a full row on its own) and
    // the labyrinth section gets the beach labyrinth (cw-labyrinth-beach), so
    // "Leadership" is never paired against a shorter card.
    "/providers/rachel-lessard": {
      sections: {
        "in-rachel-s-words": {
          asset: "th-session-hands",
          alt: "A therapist listening to a client who sits with clasped hands on a couch",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "68% 50%",
        },
        "the-labyrinth": {
          asset: "cw-labyrinth-beach",
          alt: "A stone labyrinth laid out on a headland above the sea, with one person walking it",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          focal: "center",
        },
        // Three paragraphs and a list on a full row card: the team beside it.
        "leadership-and-the-practice-s-values": {
          asset: "ha-ap-group-room-garden-city",
          alt: "A therapy group room with navy sofas, emoji pillows, and a blue-and-gold abstract painting",
          shape: "circle",
          side: "end",
          focal: "center",
        },
      },
    },
  },
};
