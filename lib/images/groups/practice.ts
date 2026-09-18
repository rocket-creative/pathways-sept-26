import type { ImageGroup } from "@/lib/images/types";

/**
 * Practice pages: /locations and /locations/*, /faq, /contact, /how-it-works,
 * /insurance-and-fees and /insurance/*, /telehealth, /resources, /careers,
 * and the legal pages (which stay photograph free).
 *
 * Editorial notes
 * - The export holds no photographs of any office (the client still owes
 *   "photograph after buildout"), so no location page pretends otherwise:
 *   each carries one calm shoreline photograph and nothing else. The five
 *   offices and the hub all have distinct photographs. The hero is only the
 *   og:image, so the same photograph is also placed once on the page as a
 *   figure: on "Getting here" for the offices whose long services list left
 *   that directions card mostly empty glass (Port Jefferson's short list
 *   pairs evenly and needs none), and on "Accessibility" for the hub.
 * - /contact has no hero band: the form is above the fold and loads eagerly.
 * - /resources is a library page whose widget should be the first thing seen,
 *   so it stays photo free.
 * - The 16 insurance plan pages are a family of short utility pages and share
 *   one quiet hero (declared once, referenced below).
 *
 * OWNER: practice curation agent.
 */

/** One calm hero for every /insurance/<plan> page. */
const PLAN_PAGE: ImageGroup["pages"][string] = {
  hero: { asset: "pr-stacked-stones", alt: "", focal: "center" },
};

export const PRACTICE: ImageGroup = {
  name: "practice",
  assets: [
    // Shoreline heroes for the locations family.
    { id: "pr-beach-labyrinth", file: "360-degree-wellness/ashley-batz-betmVWGYcLY-unsplash+(1).jpg" },
    { id: "pr-hand-on-water", file: "360-degree-wellness/yoann-boyer-i14h2xyPr18-unsplash.jpg" },
    { id: "pr-white-rocks-surf", file: "360-degree-wellness/quentin-lagache-toRqtc8iP60-unsplash+(1).jpg" },
    { id: "pr-cairn-pebble-beach", file: "home/unsplash-image-FO7bKvgETgQ.jpg" },
    { id: "pr-coastal-headland", file: "medication-management/coastal-ruins-overlooking-ocean-on-hillside-2026-03-20-04-28-27-utc.jpg" },
    { id: "pr-white-path-cove", file: "about-us/a-beautiful-white-washed-path-leads-to-an-ocean-se-2026-03-17-21-28-27-utc.jpeg" },

    // FAQ
    { id: "pr-question-pebble", file: "faq/unsplash-image-PbzntH58GLQ.jpg" },

    // How it works
    { id: "pr-woman-ledge-coffee", file: "trauma-therapy/pexels-mentatdgt-937453.jpg" },
    { id: "pr-intake-clipboard", file: "home/pexels-alex-green-5699436.jpg", square: "center" },

    // Contact
    { id: "pr-still-water-ripple", file: "home/unsplash-image-NBQhCKtg_9Y.jpg" },

    // Telehealth
    { id: "pr-laptop-at-home", file: "ketamine-assisted-therapy/pexels-mizuno-k-12911621.jpg" },

    // Insurance
    { id: "pr-table-clipboard", file: "hypnotherapy/pexels-alex-green-5699475.jpg" },
    { id: "pr-stacked-stones", file: "360-degree-wellness/deniz-altindas-t1XLQvDqt_4-unsplash+(1).jpg" },
  ],
  pages: {
    /* Locations ------------------------------------------------------- */
    "/locations": {
      hero: {
        asset: "pr-beach-labyrinth",
        alt: "A person walking a stone labyrinth laid out on a sandy headland above the sea",
        focal: "50% 62%",
      },
      // "Accessibility" is two paragraphs beside a two line "Hours" card;
      // with the figure it takes a full row and Hours pairs with Telehealth.
      sections: {
        accessibility: {
          asset: "pr-beach-labyrinth",
          alt: "A person walking a stone labyrinth laid out on a sandy headland above the sea",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 62%",
        },
      },
    },
    "/locations/rockville-centre": {
      hero: { asset: "pr-hand-on-water", alt: "", focal: "center" },
      sections: {
        "getting-here": {
          asset: "pr-hand-on-water",
          alt: "",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 55%",
        },
      },
    },
    "/locations/garden-city": {
      hero: { asset: "pr-white-rocks-surf", alt: "", focal: "center" },
      sections: {
        "getting-here": {
          asset: "pr-white-rocks-surf",
          alt: "",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/locations/massapequa": {
      hero: { asset: "pr-cairn-pebble-beach", alt: "Balanced stones on a pebble beach with the sea behind", focal: "75% 55%" },
      sections: {
        "getting-here": {
          asset: "pr-cairn-pebble-beach",
          alt: "Balanced stones on a pebble beach with the sea behind",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "75% 55%",
        },
      },
    },
    "/locations/smithtown": {
      hero: { asset: "pr-coastal-headland", alt: "", focal: "50% 45%" },
      sections: {
        "getting-here": {
          asset: "pr-coastal-headland",
          alt: "",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 45%",
        },
      },
    },
    "/locations/port-jefferson": {
      hero: { asset: "pr-white-path-cove", alt: "", focal: "50% 45%" },
    },

    /* FAQ, contact, how it works ------------------------------------- */
    "/faq": {
      hero: {
        asset: "pr-question-pebble",
        alt: "A pebble marked with a question mark among beach stones",
        focal: "63% 55%",
      },
      // The last two Q&A groups pair up and "Take the next step" (a button
      // and a phone number) stretched to the height of "Medication". The
      // page's question pebble sits beside Medication instead, and the
      // closing card takes a full row like every other page's.
      sections: {
        medication: {
          asset: "pr-question-pebble",
          alt: "",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "63% 55%",
        },
      },
    },
    "/contact": {
      // No hero: the form is above the fold. One quiet figure lower down,
      // beside "You do not need the right words".
      sections: {
        "if-you-are-not-sure-what-to-say": {
          asset: "pr-still-water-ripple",
          alt: "",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 60%",
        },
      },
    },
    "/how-it-works": {
      hero: {
        asset: "pr-woman-ledge-coffee",
        alt: "A woman sitting on a ledge with a coffee, looking out and smiling",
        focal: "45% 35%",
      },
      sections: {
        "step-3-your-360-intake": {
          asset: "pr-intake-clipboard",
          alt: "Two people talking on a couch with an intake form on a clipboard between them",
          shape: "circle",
          side: "end",
          focal: "center",
        },
      },
    },

    /* Telehealth ------------------------------------------------------ */
    "/telehealth": {
      hero: {
        asset: "pr-laptop-at-home",
        alt: "A person at home in an armchair with a laptop, surrounded by houseplants",
        focal: "50% 35%",
      },
      // No section figure: "What telehealth is" runs 145px short of "Who it
      // helps" (23%), and a figure there re-pairs the page so that "Where it
      // is offered" (two lines) lands beside "How care works here" instead,
      // which measured worse (189px, 48%).
    },

    /* Insurance ------------------------------------------------------- */
    "/insurance-and-fees": {
      hero: {
        asset: "pr-table-clipboard",
        alt: "Two people at a table; one takes notes on a clipboard",
        focal: "center",
      },
    },
    "/insurance/1199seiu": PLAN_PAGE,
    "/insurance/aetna": PLAN_PAGE,
    "/insurance/anthem-blue-cross": PLAN_PAGE,
    "/insurance/carelon": PLAN_PAGE,
    "/insurance/cigna": PLAN_PAGE,
    "/insurance/local-810": PLAN_PAGE,
    "/insurance/magnacare": PLAN_PAGE,
    "/insurance/medicare": PLAN_PAGE,
    "/insurance/northwell-direct": PLAN_PAGE,
    "/insurance/nyship": PLAN_PAGE,
    "/insurance/optum": PLAN_PAGE,
    "/insurance/oscar": PLAN_PAGE,
    "/insurance/oxford": PLAN_PAGE,
    "/insurance/umr": PLAN_PAGE,
    "/insurance/unitedhealthcare": PLAN_PAGE,
    "/insurance/va-community-care": PLAN_PAGE,

    // /resources, /careers and the legal pages are deliberately photo free.
  },
};
