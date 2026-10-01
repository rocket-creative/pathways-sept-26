import type { ImageGroup } from "@/lib/images/types";

/**
 * Practice pages: /locations and /locations/*, /faq, /contact, /how-it-works,
 * /insurance-and-fees and /insurance/*, /telehealth, /resources, /careers,
 * and the legal pages (which stay photograph free).
 *
 * Editorial notes
 * - Location and practice-hub photographs come from approved office exports
 *   (pr-ap-* assets under approved/offices/). Each office page aims for
 *   multiple section figures: at least one landscape “band-like” interior and
 *   one circle room shot. Section keys match current markdown h2 ids only
 *   (getting-here, providers-at-this-office, nearby-communities-we-serve,
 *   common-questions, take-the-next-step).
 * - /contact has no hero band: the form is above the fold and loads eagerly.
 * - /resources is a library page whose widget should be the first thing seen,
 *   so it stays photo free.
 * - The 16 insurance plan pages are a family of short utility pages and share
 *   one quiet office-detail hero (declared once, referenced below).
 *
 * OWNER: practice curation agent.
 */

/** One calm hero for every /insurance/<plan> page. */
const PLAN_PAGE: ImageGroup["pages"][string] = {
  hero: {
    asset: "pr-ap-pj-wood-clock",
    alt: "A round wall clock on a textured wood-plank wall at a Pathways Within office",
    focal: "50% 30%",
  },
};

export const PRACTICE: ImageGroup = {
  name: "practice",
  assets: [
    /* Garden City (+ wellness suite) -------------------------------- */
    { id: "pr-ap-gc-waiting-nook", file: "approved/offices/garden-city/_24M6878-gb-e.jpg", square: "center" },
    { id: "pr-ap-gc-waiting-doors", file: "approved/offices/garden-city/_24M6880-gb-e.jpg" },
    { id: "pr-ap-gc-therapy-joy", file: "approved/offices/garden-city/_24M6882-gb-e.jpg", square: "center" },
    { id: "pr-ap-gc-group-sofas", file: "approved/offices/garden-city/_24M6885-gb-e.jpg" },
    { id: "pr-ap-gc-wellness-reception", file: "approved/offices/garden-city-wellness/_24M6853-gb-e.jpg" },
    { id: "pr-ap-gc-flower-wall", file: "approved/offices/garden-city-wellness/_24M6860-gb-e.jpg", square: "center" },

    /* Massapequa (+ wellness suite) --------------------------------- */
    { id: "pr-ap-mpq-sunflower", file: "approved/offices/massapequa/_24M6896-gb-e.jpg", square: "center" },
    { id: "pr-ap-mpq-underwater", file: "approved/offices/massapequa/_24M6902-gb-e.jpg", square: "center" },
    { id: "pr-ap-mpq-hallway", file: "approved/offices/massapequa/_24M6908-gb-e.jpg" },
    { id: "pr-ap-mpq-mandala-chair", file: "approved/offices/massapequa/_24M6912-gb-e.jpg", square: "center" },
    { id: "pr-ap-mpq-wellness-boutique", file: "approved/offices/massapequa-wellness/_24M6934-gb-e.jpg" },

    /* Smithtown (+ wellness + extra) -------------------------------- */
    { id: "pr-ap-smt-wingback", file: "approved/offices/smithtown/_24M8687-gb-e.jpg", square: "center" },
    { id: "pr-ap-smt-plants-room", file: "approved/offices/smithtown/_24M8707-gb-e.jpg" },
    { id: "pr-ap-smt-waiting", file: "approved/offices/smithtown/_24M8717-gb-e.jpg" },
    { id: "pr-ap-smt-therapy-window", file: "approved/offices/smithtown-extra/_24M8756-gb-e.jpg", square: "center" },
    { id: "pr-ap-smt-wellness-table", file: "approved/offices/smithtown-wellness/_24M8744-gb-e.jpg", square: "center" },

    /* Port Jefferson ------------------------------------------------ */
    { id: "pr-ap-pj-hallway", file: "approved/offices/port-jefferson/_24M8795-gb-e.jpg" },
    { id: "pr-ap-pj-wood-clock", file: "approved/offices/port-jefferson/_24M8804-gb-e.jpg" },
    { id: "pr-ap-pj-teal-room", file: "approved/offices/port-jefferson/_24M8813-gb-e.jpg", square: "center" },
    { id: "pr-ap-pj-hope-seating", file: "approved/offices/port-jefferson/_24M8822-gb-e.jpg", square: "center" },

    /* Front desk / welcome (shared practice hubs) ------------------- */
    { id: "pr-ap-desk-logo", file: "approved/offices/front-desk/_24M8456-gb-e.jpg" },
    { id: "pr-ap-desk-waiting", file: "approved/offices/front-desk/_24M8507-gb-e.jpg" },
    { id: "pr-ap-desk-greeting", file: "approved/offices/front-desk/_24M8514-gb-e.jpg" },
    { id: "pr-ap-desk-saul", file: "approved/offices/front-desk-saul/_24M8528-gb-e-1-.jpg" },

    /* Extra interiors for hubs / telehealth ------------------------- */
    { id: "pr-ap-suffolk-yellow-pillows", file: "approved/offices/_suffolk-root/_24M8774-gb-e.jpg", square: "center" },
  ],
  pages: {
    /* Locations ------------------------------------------------------- */
    "/locations": {
      hero: {
        asset: "pr-ap-desk-logo",
        alt: "Reception desk at a Pathways Within office, with the lit labyrinth logo on the wall behind the Welcome Team",
        focal: "38% 32%",
      },
      sections: {
        telehealth: {
          asset: "pr-ap-gc-flower-wall",
          alt: "A dark leather sofa against a white flower wall in a Pathways Within office waiting area",
          shape: "circle",
          side: "start",
          focal: "50% 55%",
        },
      },
    },
    "/locations/garden-city": {
      hero: {
        asset: "pr-ap-gc-flower-wall",
        alt: "A dark leather sofa against a white flower wall in a Pathways Within office waiting area",
        focal: "center",
      },
      sections: {
        "getting-here": {
          asset: "pr-ap-gc-waiting-doors",
          alt: "Modern waiting nook at the Garden City Pathways Within office with three wood-and-white chairs between office doors",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "band",
          focal: "50% 60%",
        },
        "providers-at-this-office": {
          asset: "pr-ap-gc-therapy-joy",
          alt: "Therapy room at the Garden City Pathways Within office with charcoal armchairs, a blue ottoman, and a Today I Choose Joy sign",
          shape: "circle",
          side: "start",
          focal: "45% 50%",
        },
        "nearby-communities-we-serve": {
          asset: "pr-ap-gc-wellness-reception",
          alt: "Reception and waiting area at the Garden City Pathways Within wellness suite with navy velvet chairs and a curved desk",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "55% 45%",
        },
        "common-questions": {
          asset: "pr-ap-gc-waiting-nook",
          alt: "Three modern chairs around a small round table in a seating nook at the Garden City Pathways Within office",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "40% 55%",
        },
      },
    },
    "/locations/massapequa": {
      hero: {
        asset: "pr-ap-mpq-underwater",
        alt: "Therapy room at the Massapequa Pathways Within office with an underwater mural, blue walls, and cream and teal chairs",
        focal: "center",
      },
      sections: {
        "getting-here": {
          asset: "pr-ap-mpq-mandala-chair",
          alt: "Quiet therapy room corner at a Pathways Within office with a floral armchair and carved wood wall art",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "band",
          focal: "center",
        },
        "providers-at-this-office": {
          asset: "pr-ap-mpq-underwater",
          alt: "Therapy room at the Massapequa Pathways Within office with an underwater mural, blue walls, and cream and teal chairs",
          shape: "circle",
          side: "start",
          focal: "55% 50%",
        },
        "nearby-communities-we-serve": {
          asset: "pr-ap-mpq-wellness-boutique",
          alt: "Wellness product display and waiting chairs at the Massapequa Pathways Within wellness suite",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "35% 40%",
        },
        "common-questions": {
          asset: "pr-ap-mpq-sunflower",
          alt: "Therapy room corner at the Massapequa Pathways Within office with plum walls, sunflower accents, and a confidentiality sign",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "60% 55%",
        },
      },
    },
    "/locations/smithtown": {
      hero: {
        asset: "pr-ap-smt-plants-room",
        alt: "Therapy room at the Smithtown Pathways Within office with a dark sofa, yellow armchair, and plants on a sunlit windowsill",
        focal: "center",
      },
      sections: {
        "getting-here": {
          asset: "pr-ap-smt-waiting",
          alt: "Waiting room at the Smithtown Pathways Within office with grey seating, light wood tables, and colorful animal artwork",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "band",
          focal: "50% 45%",
        },
        "providers-at-this-office": {
          asset: "pr-ap-smt-wingback",
          alt: "Therapy room at the Smithtown Pathways Within office with a brown wingback chair, rustic wood side table, and round wall mirror",
          shape: "circle",
          side: "start",
          focal: "45% 50%",
        },
        "nearby-communities-we-serve": {
          asset: "pr-ap-smt-therapy-window",
          alt: "Therapy room at the Smithtown Pathways Within office with cream armchairs, a dark sofa, and a window overlooking trees",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        "common-questions": {
          asset: "pr-ap-gc-wellness-reception",
          alt: "Reception and waiting area at the Garden City Pathways Within wellness suite with navy velvet chairs and a curved desk",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "center",
        },
      },
    },
    "/locations/port-jefferson": {
      hero: {
        asset: "pr-ap-pj-hallway",
        alt: "Waiting hallway at the Port Jefferson Pathways Within office with teal chairs, light blue walls, and a view into a session room",
        focal: "50% 50%",
      },
      sections: {
        "getting-here": {
          asset: "pr-ap-pj-hallway",
          alt: "Waiting hallway at the Port Jefferson Pathways Within office with teal chairs, light blue walls, and a view into a session room",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "band",
          focal: "45% 50%",
        },
        "providers-at-this-office": {
          asset: "pr-ap-pj-teal-room",
          alt: "Therapy room at the Port Jefferson Pathways Within office with teal velvet seating, terracotta walls, and a sunflower arrangement",
          shape: "circle",
          side: "start",
          focal: "center",
        },
        "nearby-communities-we-serve": {
          asset: "pr-ap-pj-hope-seating",
          alt: "Seating area at the Port Jefferson Pathways Within office with a teal wall, tufted sofa, and a Hope shelf",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        "common-questions": {
          asset: "pr-ap-pj-wood-clock",
          alt: "Round wall clock on a textured wood-plank wall at the Port Jefferson Pathways Within office",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "50% 30%",
        },
      },
    },

    /* FAQ, contact, how it works ------------------------------------- */
    "/faq": {
      hero: {
        asset: "pr-ap-desk-waiting",
        alt: "Reception desk at a Pathways Within office with the Welcome Team and the practice logo on the wall",
        focal: "50% 40%",
      },
      sections: {
        offices: {
          asset: "pr-ap-gc-therapy-joy",
          alt: "Therapy room at the Garden City office with a blue chaise, grey chairs, and a Today I Choose Joy sign",
          shape: "circle",
          side: "end",
          focal: "45% 50%",
        },
        medication: {
          asset: "pr-ap-mpq-mandala-chair",
          alt: "Quiet therapy room corner at a Pathways Within office with a floral armchair and carved wood wall art",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "40% 55%",
        },
      },
    },
    "/contact": {
      // No hero: the form is above the fold. Front-desk figures lower down.
      sections: {
        "call-or-text": {
          asset: "ha-ap-front-desk-team",
          alt: "Gloria Saladino at the Smithtown front desk with a colleague and a visitor",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        /* Two frames across the top of the card: the desk, then a waiting room.
           The second stays a split figure so it sits beside the first, not as a
           full-width band under it. */
        "our-offices": [
          {
            asset: "ha-ap-front-desk-welcome",
            alt: "Gloria Saladino at the Smithtown front desk with a visitor",
            shape: "rounded",
            aspect: "landscape",
            side: "start",
            layout: "split",
            focal: "center",
          },
          {
            asset: "ha-ap-waiting-smithtown",
            alt: "A Pathways Within waiting room with grey chairs, a lattice wood coffee table, and colorful animal paintings on seafoam walls",
            shape: "rounded",
            aspect: "landscape",
            layout: "split",
            focal: "center",
          },
        ],
      },
    },
    "/how-it-works": {
      hero: {
        asset: "ha-ap-front-desk-team",
        alt: "Gloria Saladino at the Smithtown front desk with a colleague and a visitor",
        focal: "center",
      },
      sections: {
        "step-2-the-welcome-team-calls-you-back": {
          asset: "ha-ap-front-desk-welcome",
          alt: "Gloria Saladino at the Smithtown front desk with a visitor",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        "step-3-your-360-intake": {
          asset: "pr-ap-suffolk-yellow-pillows",
          alt: "Therapy room at a Pathways Within office with a tan sofa, navy chairs, and soft window light",
          shape: "circle",
          side: "end",
          focal: "50% 55%",
        },
      },
    },

    /* Telehealth ------------------------------------------------------ */
    "/telehealth": {
      hero: {
        asset: "pr-ap-smt-waiting",
        alt: "Calm waiting room at a Pathways Within office with grey seating and soft overhead light",
        focal: "50% 45%",
      },
      // No section figure: pairing measurements favored leaving body cards alone.
    },

    /* Insurance ------------------------------------------------------- */
    "/insurance-and-fees": {
      hero: {
        asset: "pr-ap-pj-wood-clock",
        alt: "A round wall clock on a textured wood-plank wall at a Pathways Within office",
        focal: "50% 30%",
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
