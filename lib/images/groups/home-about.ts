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
    // April 2026 campaign and front desk. Collage cells on the homepage.
    { id: "ha-ap26-camp-pair", file: "april-2026/campaign/camp-1-solo.jpg" },
    { id: "ha-ap26-camp-tiffany", file: "april-2026/campaign/camp-2-pair.jpg" },
    { id: "ha-ap26-camp-three", file: "april-2026/campaign/camp-3-group.jpg" },
    { id: "ha-ap26-camp-five", file: "april-2026/campaign/camp-4-group.jpg" },
    { id: "ha-ap26-rachel-solo", file: "april-2026/campaign/rachel-solo.jpg" },
    { id: "ha-ap26-rachel-family", file: "april-2026/rachel/family-portrait.jpg" },
    { id: "ha-ap26-woman-smile", file: "april-2026/campaign/woman-beige-smile.jpg" },
    { id: "ha-ap26-desk-talk", file: "april-2026/front-desk/welcome-talk.jpg" },
    { id: "ha-ap26-desk-smile", file: "april-2026/front-desk/welcome-smile.jpg" },
    { id: "ha-ap26-desk-handshake", file: "april-2026/front-desk/handshake.jpg" },

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
        "what-people-come-to-us-for": [
          {
            asset: "ha-ap26-camp-pair",
            alt: "A practitioner in a blue shirt and a woman in a cream sweater smiling together",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "ha-ap26-camp-tiffany",
            alt: "Tiffany Roberts, PMHNP, standing with a colleague in front of a studio backdrop",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "ha-ap26-camp-three",
            alt: "Three people, including a child, posing together during the Pathways Within photo day",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "ha-ap26-camp-five",
            alt: "A group of Pathways Within practitioners and clients smiling together",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
        ],
        "find-a-provider": {
          asset: "ha-ap26-desk-smile",
          alt: "A Pathways Within staff member smiling with a visitor at the front desk",
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
            asset: "ha-ap26-desk-talk",
            alt: "Staff and a visitor talking across the Pathways Within front desk",
            shape: "circle",
            side: "end",
            focal: "center",
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
      hero: { asset: "ha-ap26-rachel-solo", alt: "Rachel Lessard smiling during the April photo day", focal: "center" },
      sections: {
        "who-we-are-and-why-we-are-here": {
          asset: "ha-ap26-rachel-solo",
          alt: "Rachel Lessard, LCSW-R, smiling in a maroon blouse",
          shape: "circle",
          side: "start",
          focal: "center",
        },
        "how-pathways-found-its-way": {
          asset: "ha-ap26-rachel-family",
          alt: "Rachel Lessard standing with a family during the April photo day",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
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
          asset: "ha-ap26-desk-handshake",
          alt: "A visitor shaking hands with a staff member at the Pathways Within front desk",
          shape: "circle",
          side: "end",
          focal: "center",
        },
      },
    },

    "/providers": {
      hero: { asset: "ha-ap26-camp-five", alt: "A group of Pathways Within practitioners and clients smiling together", focal: "center" },
      sections: {
        "pathways-within-wisdom-and-wellness-collaborative-specialists": {
          asset: "ha-ap26-camp-three",
          alt: "Three people, including a child, posing together during the Pathways Within photo day",
          shape: "circle",
          side: "end",
          focal: "center",
        },
        leadership: {
          asset: "ha-ap26-rachel-solo",
          alt: "Rachel Lessard, LCSW-R, founder of Pathways Within",
          shape: "circle",
          side: "start",
          focal: "center",
        },
        "the-welcome-team": {
          asset: "ha-ap26-desk-talk",
          alt: "Staff and a visitor talking across the Pathways Within front desk",
          shape: "circle",
          side: "end",
          focal: "center",
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
          asset: "ha-ap26-rachel-family",
          alt: "Rachel Lessard standing with a family during the April photo day",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
        "the-labyrinth": {
          asset: "th-ap26-fam-four",
          alt: "A family talking with a therapist on a blue sofa in a Pathways Within office",
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
