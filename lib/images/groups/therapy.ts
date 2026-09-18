import type { ImageGroup } from "@/lib/images/types";

/**
 * /therapy and every /therapy/* service page. Source folders: the per
 * service folders (emdr-therapy/, couples-therapy/, …) plus a few mood
 * photographs borrowed from home/, about-us/ and 360-degree-wellness/.
 *
 * Every page gets one hero band and, where a fitting photograph exists, one
 * section figure (teen therapy takes two: one for teens, one for parents).
 * Heroes are distinct across all 17 pages; the same source is never the hero
 * on two of them.
 *
 * OWNER: therapy curation agent.
 */
export const THERAPY: ImageGroup = {
  name: "therapy",
  assets: [
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
  ],
  pages: {
    "/therapy": {
      hero: {
        asset: "th-session-hands",
        alt: "A therapist and client sitting across from each other on a couch during a session",
        focal: "center",
      },
      sections: {
        "therapy-for-who-you-are": {
          asset: "th-family-beach-backs",
          alt: "A family of four standing arm in arm at the edge of the ocean, seen from behind",
          shape: "circle",
          side: "end",
          focal: "50% 60%",
        },
      },
    },

    "/therapy/individual-therapy": {
      hero: {
        asset: "th-session-two-chairs",
        alt: "Two women talking in armchairs across a small table in a bright, white room",
        focal: "center",
      },
      sections: {
        "who-it-helps": {
          asset: "th-woman-plant-chair",
          alt: "A woman resting in a wooden chair with her eyes closed, surrounded by houseplants",
          shape: "circle",
          side: "end",
          focal: "60% 50%",
        },
      },
    },

    "/therapy/couples-therapy": {
      hero: {
        asset: "th-couple-boardwalk",
        alt: "Two partners holding hands at a seaside railing, barefoot, seen from behind",
        focal: "center",
      },
      sections: {
        "who-it-helps": {
          asset: "th-couple-pier",
          alt: "Two men smiling together on a pier, one with an arm around the other",
          shape: "circle",
          side: "end",
          focal: "50% 30%",
        },
      },
    },

    "/therapy/child-therapy": {
      hero: {
        asset: "th-children-rain-boots",
        alt: "Four children in colorful rain boots and coats standing in a row on a muddy path",
        focal: "center",
      },
      sections: {
        "what-child-therapy-is": {
          asset: "th-mother-hugging-child",
          alt: "A mother with her eyes closed hugging her smiling child against a stone wall",
          shape: "circle",
          side: "end",
          focal: "50% 22%",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-parent-toddler-toys",
          alt: "A parent and toddler playing with a wooden toy on the floor of a bright room",
          shape: "circle",
          side: "end",
          focal: "55% 60%",
        },
      },
    },

    "/therapy/teen-therapy": {
      hero: {
        asset: "th-teens-pebble-beach",
        alt: "Four teenagers in flannel shirts sitting side by side on a pebble beach, seen from behind",
        focal: "center",
      },
      sections: {
        "for-teens": {
          asset: "th-teen-denim-jacket",
          alt: "A teenager in glasses, a beanie and a denim jacket laughing in front of a blue wall",
          shape: "circle",
          side: "start",
          focal: "50% 45%",
        },
        "for-parents": {
          asset: "th-parent-teen-car",
          alt: "A father with his hand on his teenage son's shoulder, both smiling, beside a car with a tree on the roof",
          shape: "circle",
          side: "end",
          focal: "35% 45%",
        },
      },
    },

    "/therapy/family-therapy": {
      hero: {
        asset: "th-family-multigen-fire",
        alt: "A multigenerational family sitting together on a beach around a campfire, smiling",
        focal: "50% 47%",
      },
      sections: {
        "who-it-helps": {
          asset: "th-family-blue-door",
          alt: "A mother hugging her two children in front of a teal wooden door",
          shape: "circle",
          side: "end",
          focal: "50% 40%",
        },
      },
    },

    "/therapy/group-therapy": {
      hero: {
        asset: "th-group-loft",
        alt: "A group of adults seated in a loose circle in a bright room, listening to one another",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-group-window-room",
          alt: "Four adults talking together on a couch and chairs beneath tall windows",
          shape: "circle",
          side: "end",
          focal: "50% 60%",
        },
      },
    },

    "/therapy/emdr": {
      hero: { asset: "th-man-sunset", alt: "", focal: "center" },
      sections: {
        "what-emdr-is": {
          asset: "th-water-ripple",
          alt: "",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "50% 60%",
        },
      },
    },

    "/therapy/trauma-therapy": {
      hero: {
        asset: "th-man-window-reflection",
        alt: "A young man in glasses resting his chin on his hand, looking out a window that holds his reflection",
        focal: "50% 40%",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-woman-ledge-sunlight",
          alt: "A woman sitting on a sunlit ledge with a cup of coffee, looking up and smiling",
          shape: "circle",
          side: "end",
          focal: "35% 50%",
        },
      },
    },

    "/therapy/grief-therapy": {
      hero: {
        asset: "th-older-couple-autumn",
        alt: "An older couple walking with their arms around each other under autumn trees, seen from behind",
        focal: "50% 30%",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-comfort-on-couch",
          alt: "Two people sitting close together on a couch, one holding the other's hand",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },

    "/therapy/hypnotherapy": {
      hero: {
        asset: "th-woman-sunlit-wall",
        alt: "A woman with her eyes closed, resting against a wall in warm sunlight",
        focal: "50% 40%",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-session-reclining",
          alt: "A client reclining on a couch with eyes closed while a therapist sits nearby with a notepad",
          shape: "circle",
          side: "end",
          focal: "65% 55%",
        },
      },
    },

    "/therapy/ifs": {
      hero: {
        asset: "th-woman-windy-beach",
        alt: "Woman standing peacefully on a windy beach with eyes closed, representing calm and connection with the Self in IFS therapy",
        focal: "65% 50%",
      },
      sections: {
        "what-ifs-is": {
          asset: "th-woman-gazing-up",
          alt: "A young woman with curly hair looking upward with a thoughtful expression",
          shape: "circle",
          side: "start",
          focal: "50% 35%",
        },
      },
    },

    "/therapy/somatic-therapy": {
      hero: {
        asset: "th-hand-water",
        alt: "A hand reaching down to touch the surface of calm water at dusk",
        focal: "center",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-woman-self-hug",
          alt: "A woman in a yellow top smiling with her arms wrapped around her own shoulders",
          shape: "circle",
          side: "end",
          focal: "50% 35%",
        },
      },
    },

    "/therapy/ketamine-assisted-therapy": {
      hero: {
        asset: "th-quiet-room-plant",
        alt: "A small potted plant on a wooden table in a quiet room with soft window light",
        focal: "40% 50%",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-person-tall-grass",
          alt: "A person sitting calmly on a chair in a field of tall grass",
          shape: "circle",
          side: "end",
          focal: "50% 40%",
        },
      },
    },

    "/therapy/pcit": {
      hero: {
        asset: "th-toddler-blocks-floor",
        alt: "A toddler and a parent playing with wooden blocks on the floor while a small dog watches",
        focal: "center",
      },
      sections: {
        "what-pcit-is": {
          asset: "th-parent-child-piggyback",
          alt: "A mother carrying her laughing daughter piggyback on a beach",
          shape: "circle",
          side: "end",
          focal: "50% 25%",
        },
      },
    },

    "/therapy/veterans-first-responders": {
      hero: {
        asset: "th-veteran-salute",
        alt: "A veteran in a white shirt and garrison cap saluting at an outdoor ceremony, seen from behind",
        focal: "60% 40%",
      },
      sections: {
        "what-this-program-is": {
          asset: "th-veteran-boots-pack",
          alt: "Worn combat boots and a camouflage backpack on the ground beside a person standing in jeans",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        "who-it-helps": {
          asset: "th-flag-city-sky",
          alt: "An American flag on a pole against a blue sky between city buildings",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "55% 45%",
        },
      },
    },

    "/therapy/bariatric-surgery-support": {
      hero: {
        asset: "th-session-therapist-talking",
        alt: "A therapist with a notebook talking with a client in a bright office",
        focal: "35% 40%",
      },
      sections: {
        "what-bariatric-surgery-support-is": {
          asset: "th-kitchen-flowers",
          alt: "A woman in a yellow shirt arranging flowers at a table in a bright kitchen",
          shape: "circle",
          side: "end",
          focal: "70% 55%",
        },
      },
    },
  },
};
