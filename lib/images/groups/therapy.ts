import type { ImageGroup } from "@/lib/images/types";

/**
 * /therapy and every /therapy/* service page. Source folders: the per
 * service folders (emdr-therapy/, couples-therapy/, …) plus a few mood
 * photographs borrowed from home/, about-us/ and 360-degree-wellness/,
 * plus approved front-desk interiors (th-ap-*) on the /therapy hub.
 *
 * Every page gets one hero band and, where a fitting photograph exists, one
 * section figure (teen therapy takes two: one for teens, one for parents).
 * Heroes are distinct across all 17 pages; the same source is never the hero
 * on two of them. Real interiors go on "where we work" / intake sections;
 * clinical-mood stock stays on modality and grief/trauma cards.
 *
 * OWNER: therapy curation agent.
 */
export const THERAPY: ImageGroup = {
  name: "therapy",
  assets: [
    // April 2026 shoot. One keeper per scene; collage pages use four distinct frames.
    { id: "th-ap26-older-man", file: "april-2026/therapy/session-older-man.jpg" },
    { id: "th-ap26-black-blazer", file: "april-2026/therapy/session-black-blazer.jpg" },
    { id: "th-ap26-resting", file: "april-2026/therapy/client-resting.jpg" },
    { id: "th-ap26-green-vest", file: "april-2026/therapy/session-green-vest.jpg" },
    { id: "th-ap26-green-quiet", file: "april-2026/therapy/session-green-vest-quiet.jpg" },
    { id: "th-ap26-green-listen", file: "april-2026/therapy/session-green-vest-listen.jpg" },
    { id: "th-ap26-seated", file: "april-2026/therapy/session-seated-calm.jpg" },
    { id: "th-ap26-across", file: "april-2026/therapy/session-across-couch.jpg" },
    { id: "th-ap26-older-quiet", file: "april-2026/therapy/session-older-man-quiet.jpg" },
    { id: "th-ap26-conversation", file: "april-2026/therapy/session-conversation.jpg" },
    { id: "th-ap26-two-women", file: "april-2026/couples/two-women.jpg" },
    { id: "th-ap26-couple", file: "april-2026/couples/couple-and-therapist.jpg" },
    { id: "th-ap26-green-couple", file: "april-2026/couples/green-vest-couple.jpg" },
    { id: "th-ap26-glasses", file: "april-2026/couples/therapist-glasses.jpg" },
    { id: "th-ap26-hands", file: "april-2026/couples/hands-together.jpg" },
    { id: "th-ap26-older-couple", file: "april-2026/couples/older-couple-quiet.jpg" },
    { id: "th-ap26-fam-two", file: "april-2026/family/two-adults.jpg" },
    { id: "th-ap26-fam-child", file: "april-2026/family/child-on-lap.jpg" },
    { id: "th-ap26-fam-four", file: "april-2026/family/four-people.jpg" },
    { id: "th-ap26-fam-end", file: "april-2026/family/family-end.jpg" },
    { id: "th-ap26-fam-behind", file: "april-2026/family/from-behind.jpg" },
    { id: "th-ap26-kids-three", file: "april-2026/kids/three-girls.jpg" },
    { id: "th-ap26-kids-point", file: "april-2026/kids/pointing.jpg" },
    { id: "th-ap26-kids-stand", file: "april-2026/kids/one-standing.jpg" },
    { id: "th-ap26-kids-toy", file: "april-2026/kids/stuffed-animal.jpg" },
    { id: "th-ap26-group-couch", file: "april-2026/group/on-couch.jpg" },
    { id: "th-ap26-group-floor", file: "april-2026/group/floor-circle.jpg" },
    { id: "th-ap26-group-gesture", file: "april-2026/group/gesturing.jpg" },
    { id: "th-ap26-group-play", file: "april-2026/group/playing.jpg" },
    { id: "th-ap26-teen", file: "april-2026/med/parent-teen-arms.jpg" },

    // Sessions and rooms
    { id: "th-session-hands", file: "hypnotherapy/pexels-alex-green-5699434.jpg" },
    { id: "th-session-two-chairs", file: "individual-therapy/pexels-cottonbro-4098368.jpg" },
    { id: "th-session-therapist-talking", file: "weight-loss-surgery-support/pexels-shvets-production-7176288.jpg" },
    { id: "th-session-reclining", file: "hypnotherapy/pexels-alex-green-5699454.jpg" },
    { id: "th-group-loft", file: "group-therapy/pexels-rodnae-productions-7889241.jpg" },
    { id: "th-group-window-room", file: "group-therapy/unsplash-image-1GEsAeUv5dU.jpg" },
    { id: "th-quiet-room-plant", file: "ketamine-assisted-therapy/unsplash-image-bIhpiQA009k.jpg" },
    { id: "th-kitchen-flowers", file: "weight-loss-surgery-support/pexels-shvets-production-7525039.jpg" },

    // People, calm
    { id: "th-woman-plant-chair", file: "about-us/happy-calm-peaceful-woman-dreaming-with-closed-eye-2025-03-06-15-58-17-utc.jpg" },
    { id: "th-woman-sunlit-wall", file: "about-us/woman-relaxing-indoors-in-warm-sunlight-2026-03-17-21-37-33-utc.jpg" },
    { id: "th-woman-windy-beach", file: "ifs-therapy-on-long-island/Woman+standing+peacefully+on+a+windy+beach_+eyes+closed+and+hands+holding+her+coat_+representing+calm_+presence_+and+connection+with+the+Self+in+IFS+therapy.jpg" },
    { id: "th-woman-gazing-up", file: "ifs-therapy-on-long-island/Young+woman+with+curly+hair+gazing+upward+with+a+thoughtful+expression_+symbolizing+self-reflection+and+internal+exploration+in+IFS+therapy.jpg" },
    { id: "th-woman-self-hug", file: "somatic-therapy/unsplash-image-9g3eKycgkcw.jpg" },
    { id: "th-woman-ledge-sunlight", file: "trauma-therapy/pexels-mentatdgt-937453.jpg" },
    { id: "th-man-window-reflection", file: "home/unsplash-image-OsC8HauR0e0.jpg" },
    { id: "th-man-sunset", file: "emdr-therapy/unsplash-image-oTHXpT6nJsE.jpg" },
    { id: "th-person-tall-grass", file: "ketamine-assisted-therapy/pexels-anastasiia-chaikovska-12916964.jpg" },

    // Couples, families, children, teens
    { id: "th-couple-boardwalk", file: "couples-therapy/unsplash-image-SPTwFiz2U44.jpg" },
    { id: "th-couple-pier", file: "couples-therapy/unsplash-image--BjvzKp-Sgw.jpg" },
    { id: "th-family-beach-backs", file: "family-therapy-on-long-island/unsplash-image-6UyWK8mDcWo.jpg" },
    { id: "th-family-multigen-fire", file: "family-therapy-on-long-island/multi-generation-family-sitting-by-fire-on-winter-2024-10-19-16-40-16-utc.jpg" },
    { id: "th-family-blue-door", file: "parent-child-interaction-therapy/pexels-ketut-subiyanto-4473314.jpg" },
    { id: "th-children-rain-boots", file: "child-therapy/unsplash-image-iDCtsz-INHI.jpg" },
    { id: "th-mother-hugging-child", file: "child-therapy/unsplash-image-zQQ6Y5_RtHE.jpg" },
    { id: "th-parent-toddler-toys", file: "parent-child-interaction-therapy/pexels-mikhail-nilov-6957989.jpg" },
    { id: "th-toddler-blocks-floor", file: "parent-child-interaction-therapy/pexels-karolina-grabowska-7269602.jpg" },
    { id: "th-parent-child-piggyback", file: "parent-child-interaction-therapy/pexels-olya-kobruseva-5711985.jpg" },
    { id: "th-teens-pebble-beach", file: "teen-therapy/unsplash-image-TvsKqeORBl4.jpg" },
    { id: "th-teen-denim-jacket", file: "teen-therapy/unsplash-image-ANNsvl-6AG0.jpg" },
    { id: "th-parent-teen-car", file: "teen-therapy/pexels-any-lane-5727803.jpg" },

    // Grief, veterans, atmosphere
    { id: "th-older-couple-autumn", file: "grief-therapy/ryan-crotty-V7t83TLfBIA-unsplash.jpg" },
    { id: "th-comfort-on-couch", file: "grief-therapy/unsplash-image-e92L8PwcHD4.jpg" },
    { id: "th-veteran-salute", file: "home/unsplash-image-4GN3kBR7IMY.jpg" },
    { id: "th-veteran-boots-pack", file: "veterans-first-responders/unsplash-image-xOUs1VJnIP0.jpg" },
    { id: "th-flag-city-sky", file: "veterans-first-responders/unsplash-image-BdgWxoO-jbc.jpg" },
    { id: "th-hand-water", file: "360-degree-wellness/yoann-boyer-i14h2xyPr18-unsplash.jpg" },
    { id: "th-water-ripple", file: "home/unsplash-image-NBQhCKtg_9Y.jpg" },

    // Approved practice interiors (front desk leftovers; practice owns the
    // primary desk trio and location folders).
    { id: "th-ap-waiting-greeting", file: "approved/offices/front-desk/_24M8521-gb-e.jpg" },
    { id: "th-ap-desk-hallway", file: "approved/offices/front-desk/_24M8647-gb-e-1-.jpg" },
  ],
  pages: {
    "/therapy": {
      hero: {
        asset: "th-ap26-green-vest",
        alt: "A therapist in a green vest talking with a client who is smiling on a blue sofa",
        focal: "center",
      },
      sections: {
        "therapy-for-who-you-are": [
          {
            asset: "th-ap26-green-quiet",
            alt: "A therapist in a green vest listens during a session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-fam-child",
            alt: "A family with a child sitting with a therapist on a blue sofa",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-group-couch",
            alt: "Children on a sofa and the floor during a session with a therapist",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-couple",
            alt: "A couple talking with a therapist in a Pathways Within office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-glasses",
            alt: "A couple talking together on a blue sofa during a session",
            shape: "rounded",
            aspect: "landscape",
            side: "end",
            /* Beside the list, in the empty stretch to its right. Not a collage cell. */
            layout: "split",
            focal: "50% 42%",
          },
        ],
        "how-therapy-starts-here": {
          asset: "ha-ap-front-desk-team",
          alt: "Gloria Saladino at the Smithtown front desk with a colleague and a visitor",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          layout: "overlay",
          focal: "center",
        },
        /* Same card as medication management and wellness. Heading id is "insurance". */
        insurance: {
          asset: "cw-ap-desk-orchids",
          alt: "Gloria Saladino at the Smithtown front desk with a colleague and a visitor",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          layout: "feature",
          focal: "center",
        },
        "take-the-next-step": {
          asset: "ha-ap-front-desk-welcome",
          alt: "Gloria Saladino at the Smithtown front desk with a visitor",
          shape: "rounded",
          aspect: "landscape",
          /* Same closing card as the rest of the site: copy on the left, photo on the right. */
          side: "end",
          layout: "split",
          focal: "center",
        },
        where: [
          {
            asset: "pr-ap-mpq-underwater",
            alt: "Therapy room at the Massapequa Pathways Within office with an underwater mural, blue walls, and cream and teal chairs",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "pr-ap-gc-flower-wall",
            alt: "A dark leather sofa against a white flower wall in a Pathways Within office waiting area",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "pr-ap-smt-waiting",
            alt: "Waiting room at the Smithtown office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "pr-ap-pj-teal-room",
            alt: "Therapy room at the Port Jefferson office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
        ],
      },
    },

    "/therapy/individual-therapy": {
      hero: {
        asset: "th-ap26-green-quiet",
        alt: "A therapist and client sitting across from each other on blue sofas",
        focal: "center",
      },
      sections: {
        "what-individual-therapy-is": {
          asset: "th-ap26-green-quiet",
          alt: "A therapist and client sitting across from each other on blue sofas",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "center",
        },
        "who-it-helps": {
          asset: "th-ap26-green-listen",
          alt: "A therapist listening while a client talks from a blue sofa",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/couples-therapy": {
      hero: {
        asset: "th-ap26-couple",
        alt: "A couple talking with a therapist in a Pathways Within office",
        focal: "center",
      },
      sections: {
        "what-couples-therapy-is": [
          {
            asset: "th-ap26-couple",
            alt: "A couple talking with a therapist in a Pathways Within office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-green-couple",
            alt: "A therapist in a green vest meeting with a couple on a blue sofa",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-glasses",
            alt: "A therapist with glasses talking with a couple during a session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-hands",
            alt: "Three people leaning in together, hands close, during a couples session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
        ],
        "who-it-helps": {
          asset: "th-ap26-two-women",
          alt: "Two women sitting together on a blue sofa across from a therapist",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/child-therapy": {
      hero: {
        asset: "th-ap26-kids-three",
        alt: "Three children sitting on a blue sofa across from a therapist",
        focal: "center",
      },
      sections: {
        "what-child-therapy-is": [
          {
            asset: "th-ap26-kids-three",
            alt: "Three children sitting on a blue sofa across from a therapist",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-kids-point",
            alt: "A child pointing while talking with a therapist and two other children",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-kids-stand",
            alt: "Children on a blue sofa, one leaning forward during a session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-kids-toy",
            alt: "A child holding a stuffed animal on a blue sofa during a therapy session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
        ],
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-fam-child",
          alt: "A parent with a young child on their lap, talking with a therapist",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/teen-therapy": {
      hero: {
        asset: "th-ap26-teen",
        alt: "A teenager talking with a parent and a practitioner in a Pathways Within office",
        focal: "center",
      },
      sections: {
        "for-teens": {
          asset: "th-ap26-teen",
          alt: "A teenager talking with a parent and a practitioner in a Pathways Within office",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          focal: "50% 42%",
        },
        "for-parents": {
          asset: "th-ap26-fam-two",
          alt: "A parent and a young adult sitting with a therapist on a blue sofa",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/family-therapy": {
      hero: {
        asset: "th-ap26-fam-four",
        alt: "A family of four talking with a therapist in a Pathways Within office",
        focal: "center",
      },
      sections: {
        "what-family-therapy-is": [
          {
            asset: "th-ap26-fam-two",
            alt: "Two adults sitting with a therapist on a blue sofa",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-fam-child",
            alt: "A parent with a young child on their lap during a family session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-fam-four",
            alt: "A family of four talking with a therapist in a Pathways Within office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-fam-end",
            alt: "A family seated together on a blue sofa at the end of a session",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
        ],
        "who-it-helps": {
          asset: "th-ap26-fam-behind",
          alt: "A family on a blue sofa, seen past the therapist sitting with them",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/group-therapy": {
      hero: {
        asset: "th-ap26-group-couch",
        alt: "A group of children and teens gathered with a therapist in a bright office",
        focal: "center",
      },
      sections: {
        "what-group-therapy-is": [
          {
            asset: "th-ap26-group-couch",
            alt: "A group sitting on a blue sofa and the floor with a therapist",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-group-floor",
            alt: "A group sitting in a circle on the floor of a therapy office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-group-gesture",
            alt: "A therapist gesturing while a group sits together on the floor",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
          {
            asset: "th-ap26-group-play",
            alt: "A group laughing together on the floor of a therapy office",
            layout: "collage",
            aspect: "landscape",
            focal: "center",
          },
        ],
      },
    },

    "/therapy/emdr": {
      hero: { asset: "th-ap26-seated", alt: "A client sitting calmly on a blue sofa across from a therapist", focal: "center" },
      sections: {
        "what-emdr-is": {
          asset: "th-ap26-seated",
          alt: "A client sitting calmly on a blue sofa across from a therapist",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
      },
    },

    "/therapy/trauma-therapy": {
      hero: {
        asset: "th-ap26-across",
        alt: "Two people talking quietly across a blue sofa in a therapy office",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-across",
          alt: "Two people talking quietly across a blue sofa in a therapy office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/grief-therapy": {
      hero: {
        asset: "th-ap26-older-couple",
        alt: "An older couple talking with a therapist in a quiet office",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-older-couple",
          alt: "An older couple talking with a therapist in a quiet office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },

    "/therapy/hypnotherapy": {
      hero: {
        asset: "th-ap26-resting",
        alt: "A client resting on a blue sofa while a therapist sits nearby",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-resting",
          alt: "A client resting on a blue sofa while a therapist sits nearby",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/ifs": {
      hero: {
        asset: "th-ap26-conversation",
        alt: "A therapist and client in conversation on blue sofas",
        focal: "center",
      },
      sections: {
        "what-ifs-is": {
          asset: "th-ap26-conversation",
          alt: "A therapist and client in conversation on blue sofas",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/somatic-therapy": {
      hero: {
        asset: "th-ap26-black-blazer",
        alt: "A client in a black blazer talking with a therapist in a calm office",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-black-blazer",
          alt: "A client in a black blazer talking with a therapist in a calm office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/ketamine-assisted-therapy": {
      hero: {
        asset: "th-ap26-older-quiet",
        alt: "A client sitting quietly with a therapist in a sunlit office",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-older-quiet",
          alt: "A client sitting quietly with a therapist in a sunlit office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/pcit": {
      hero: {
        asset: "th-ap26-fam-child",
        alt: "A parent and young child together on a sofa during a session",
        focal: "center",
      },
      sections: {
        "what-pcit-is": {
          asset: "th-ap26-fam-child",
          alt: "A parent and young child together on a sofa during a session",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },

    "/therapy/veterans-first-responders": {
      hero: {
        asset: "th-ap26-green-listen",
        alt: "A therapist listening while a client talks from a blue sofa",
        focal: "center",
      },
      sections: {
        "what-this-program-is": {
          asset: "th-ap26-green-listen",
          alt: "A therapist listening while a client talks from a blue sofa",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        "who-it-helps": {
          asset: "th-ap26-glasses",
          alt: "A therapist meeting with a client on a blue sofa",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
      },
    },

    "/therapy/bariatric-surgery-support": {
      hero: {
        asset: "th-ap26-green-vest",
        alt: "A therapist talking with a client during a session",
        focal: "center",
      },
      sections: {
        "what-bariatric-surgery-support-is": {
          asset: "th-ap26-green-vest",
          alt: "A therapist talking with a client during a session",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "50% 42%",
        },
      },
    },
  },
};
