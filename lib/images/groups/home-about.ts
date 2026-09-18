import type { ImageGroup } from "@/lib/images/types";

/**
 * Homepage, About, Providers hub, Blog, and the two hand written provider
 * pages. Source folders: home/, about-us/, 360-degree-wellness/, news folders.
 *
 * OWNER: home and about curation agent.
 *
 * Editorial notes
 * - "/" keeps its own pinned hero; only the lower sections take a figure.
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
    // Rachel Lessard's real portrait (2500x3750). Square cut for circle figures;
    // "top" because the attention crop drifts to the torso at some tier sizes.
    { id: "ha-rachel-lessard-portrait", file: "about-us/Rachel+Lessard.JPG", square: "top" },
    // Woman resting against a sunlit wall, eyes closed (2500x1667).
    { id: "ha-warm-sunlight-rest", file: "about-us/woman-relaxing-indoors-in-warm-sunlight-2026-03-17-21-37-33-utc.jpg" },
    // White-washed stone path leading down to the sea at dusk (2268x4032).
    { id: "ha-path-to-the-sea", file: "about-us/a-beautiful-white-washed-path-leads-to-an-ocean-se-2026-03-17-21-28-27-utc.jpeg" },
    // Hand touching still water at sunrise (2500x1667).
    { id: "ha-hand-on-water", file: "360-degree-wellness/yoann-boyer-i14h2xyPr18-unsplash.jpg" },
    // Four people talking in a bright room with yellow chairs (2500x1667).
    { id: "ha-team-bright-room", file: "group-therapy/unsplash-image-6awfTPLGaCE.jpg" },
    // Four people in conversation under tall windows (1702x1702).
    { id: "ha-team-tall-windows", file: "group-therapy/unsplash-image-1GEsAeUv5dU.jpg" },
    // The practice's own front desk with its hanging "Welcome" sign (1124x1499).
    { id: "ha-welcome-desk", file: "360-degree-wellness/IMG_0074.jpg" },
    // Gypsy, one of the two therapy dogs (596x868; small, but the real dog).
    { id: "ha-gypsy-therapy-dog", file: "clinicians/Gypsy+Therapy+Dog+on+Long+Island.jpg", square: "top" },
    // /providers/rachel-lessard also uses th-session-hands (therapy.ts) and
    // pr-beach-labyrinth (practice.ts); ids resolve across groups, so the
    // same source is not cut into tiers twice.
  ],
  pages: {
    "/": {
      sections: {
        "from-the-founder": {
          asset: "ha-rachel-lessard-portrait",
          alt: "Rachel Lessard, LCSW-R, founder of Pathways Within",
          shape: "circle",
          side: "start",
          focal: "center",
        },
      },
    },

    "/about": {
      hero: { asset: "ha-warm-sunlight-rest", alt: "", focal: "top" },
      sections: {
        "how-pathways-found-its-way": {
          asset: "ha-path-to-the-sea",
          alt: "A white-washed stone path leading down to the sea at dusk",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "bottom",
        },
      },
    },

    "/providers": {
      hero: { asset: "ha-team-bright-room", alt: "", focal: "center" },
      sections: {
        "the-welcome-team": {
          asset: "ha-welcome-desk",
          alt: "A wooden front desk with a hanging Welcome sign and a vase of dried grasses",
          shape: "rounded",
          aspect: "portrait",
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
      },
    },

    "/blog": {
      hero: { asset: "ha-hand-on-water", alt: "", focal: "center" },
    },

    "/blog/a-new-way-podcast": {
      sections: {
        "about-rachel": {
          asset: "ha-rachel-lessard-portrait",
          alt: "Rachel Lessard, LCSW-R, founder of Pathways Within",
          shape: "circle",
          side: "end",
          focal: "center",
        },
      },
    },

    "/careers": {
      hero: { asset: "ha-team-tall-windows", alt: "", focal: "50% 60%" },
      sections: {
        // Takes the long card out of its pair so the two short ones
        // ("How hiring works", "Questions") pair with each other.
        "why-people-stay": {
          asset: "ha-team-bright-room",
          alt: "Four colleagues talking in a bright room with yellow armchairs",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
      },
    },

    // Rachel's headshot already sits in the page lockup, so the section
    // figures are scenes, not her portrait. The long quote takes a figure
    // (which leaves "What Rachel does clinically" a full row on its own) and
    // the labyrinth section gets the real beach labyrinth, so "Leadership"
    // is never paired against a shorter card.
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
          asset: "pr-beach-labyrinth",
          alt: "A stone labyrinth laid out on a headland above the sea, with one person walking it",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          focal: "center",
        },
        // Three paragraphs and a list on a full row card: the team beside it.
        "leadership-and-the-practice-s-values": {
          asset: "ha-team-tall-windows",
          alt: "The Pathways Within team gathered in a room with tall windows",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "50% 60%",
        },
      },
    },
  },
};
