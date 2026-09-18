import type { ImageGroup } from "@/lib/images/types";

/**
 * /concerns and /concerns/*, /wellness and /wellness/*, /medication-management,
 * /coaching. The old site had no concern pages, so these draw on the general
 * mood photographs in home/, about-us/, 360-degree-wellness/ and the service
 * folders whose subject fits.
 *
 * Editorial notes:
 * - Sensitive concerns (PTSD, substance use, depression, postpartum, bipolar)
 *   use landscapes, backs, hands and ordinary moments, never distress clichés.
 * - Heroes are distinct within /concerns/* and within /wellness/*. Two photos
 *   recur as heroes across those two sections (chair-among-plants, hand in
 *   still water) because the calm-body pool is small; that is allowed.
 * - The wellness services have no honest photographs in the export, so they
 *   carry nature / light / body-at-rest imagery. Cupping has no hero, only a
 *   decorative figure on its first-session card.
 * - Concern pages put the section figure on the long "How we treat ..." card
 *   (or another long card), never on the short "Signs" list, so the Signs
 *   card runs full row instead of stretching beside a taller partner.
 * - A page's hero is og:image only and is not rendered, so a hero asset may
 *   also serve as a section figure on the same page without repeating.
 *
 * OWNER: concerns and wellness curation agent.
 */
export const CONCERNS_WELLNESS: ImageGroup = {
  name: "concerns-wellness",
  assets: [
    // Brand motif and nature
    { id: "cw-labyrinth-beach", file: "360-degree-wellness/ashley-batz-betmVWGYcLY-unsplash+(1).jpg" },
    { id: "cw-hand-still-water", file: "360-degree-wellness/yoann-boyer-i14h2xyPr18-unsplash.jpg" },
    { id: "cw-stone-stack-bokeh", file: "360-degree-wellness/deniz-altindas-t1XLQvDqt_4-unsplash+(1).jpg" },
    { id: "cw-sea-foam-stones", file: "360-degree-wellness/quentin-lagache-toRqtc8iP60-unsplash+(1).jpg" },
    { id: "cw-welcome-counter", file: "360-degree-wellness/IMG_0074.jpg", square: "attention" },
    { id: "cw-cairn-shoreline", file: "home/unsplash-image-FO7bKvgETgQ.jpg" },
    { id: "cw-water-drop", file: "individual-therapy/unsplash-image-SFEvfN01-ao.jpg" },
    { id: "cw-lake-dusk", file: "ketamine-assisted-therapy/pexels-lukas-rychvalsky-670720.jpg" },
    { id: "cw-sea-rocks-alone", file: "somatic-therapy/unsplash-image-R3IK5960eDw.jpg" },
    { id: "cw-whitewashed-path", file: "about-us/a-beautiful-white-washed-path-leads-to-an-ocean-se-2026-03-17-21-28-27-utc.jpeg" },
    { id: "cw-coastal-stone-circles", file: "medication-management/coastal-ruins-overlooking-ocean-on-hillside-2026-03-20-04-28-27-utc.jpg" },
    { id: "cw-plant-on-table", file: "ketamine-assisted-therapy/unsplash-image-bIhpiQA009k.jpg" },

    // People: light, rest, backs
    { id: "cw-windy-beach-coat", file: "ifs-therapy-on-long-island/Woman+standing+peacefully+on+a+windy+beach_+eyes+closed+and+hands+holding+her+coat_+representing+calm_+presence_+and+connection+with+the+Self+in+IFS+therapy.jpg" },
    { id: "cw-window-light-glasses", file: "home/unsplash-image-OsC8HauR0e0.jpg" },
    { id: "cw-ledge-from-behind", file: "home/unsplash-image-wWfMg7hRBo0.jpg" },
    { id: "cw-face-to-sun", file: "home/unsplash-image-Id6NYKSBYoc.jpg" },
    { id: "cw-sunrise-stretch", file: "emdr-therapy/unsplash-image-oTHXpT6nJsE.jpg" },
    { id: "cw-ledge-coffee", file: "trauma-therapy/pexels-mentatdgt-937453.jpg" },
    { id: "cw-chair-among-plants", file: "about-us/happy-calm-peaceful-woman-dreaming-with-closed-eye-2025-03-06-15-58-17-utc.jpg" },
    { id: "cw-warm-sunlight", file: "about-us/woman-relaxing-indoors-in-warm-sunlight-2026-03-17-21-37-33-utc.jpg" },
    { id: "cw-sunlit-meditation", file: "about-us/serene-woman-meditating-peacefully-in-bedroom-sunl-2026-01-05-23-32-43-utc.jpg", square: "attention" },
    { id: "cw-self-embrace-yellow", file: "somatic-therapy/unsplash-image-9g3eKycgkcw.jpg", square: "attention" },
    { id: "cw-kitchen-morning", file: "weight-loss-surgery-support/pexels-shvets-production-7525039.jpg", square: "attention" },
    { id: "cw-veteran-cap", file: "home/unsplash-image-4GN3kBR7IMY.jpg", square: "attention" },

    // People together
    { id: "cw-teens-pebble-shore", file: "teen-therapy/unsplash-image-TvsKqeORBl4.jpg" },
    { id: "cw-father-son-car", file: "teen-therapy/pexels-any-lane-5727803.jpg", square: "attention" },
    { id: "cw-couple-reeds", file: "couples-therapy/unsplash-image-FHvpa4-Fpu8.jpg" },
    { id: "cw-riverside-walk", file: "couples-therapy/pexels-samson-katt-5225078.jpg" },
    { id: "cw-pier-couple", file: "couples-therapy/unsplash-image--BjvzKp-Sgw.jpg", square: "attention" },
    { id: "cw-autumn-couple-walk", file: "grief-therapy/ryan-crotty-V7t83TLfBIA-unsplash.jpg", square: "attention" },
    { id: "cw-floor-play", file: "parent-child-interaction-therapy/pexels-mikhail-nilov-6957989.jpg" },
    { id: "cw-rain-boots", file: "child-therapy/unsplash-image-iDCtsz-INHI.jpg" },
    { id: "cw-group-circle", file: "group-therapy/unsplash-image-1GEsAeUv5dU.jpg", square: "attention" },

    // Sessions
    { id: "cw-session-clipboard", file: "home/pexels-alex-green-5699436.jpg", square: "attention" },
    { id: "cw-table-notes", file: "hypnotherapy/pexels-alex-green-5699475.jpg" },
    { id: "cw-prescriber-conversation", file: "medication-management/sitting-and-talking-man-and-woman-are-indoors-in-2026-03-25-04-46-20-utc.JPG" },
    { id: "cw-coaching-conversation", file: "weight-loss-surgery-support/pexels-shvets-production-7176288.jpg" },
    { id: "cw-medication-hands", file: "medication-management/senior-receives-medication-advice-from-healthcare-2026-03-25-08-56-06-utc.jpg" },
    { id: "cw-man-ledge-smile", file: "individual-therapy/unsplash-image-9sEcEcYHgQ0.jpg", square: "attention" },
  ],
  pages: {
    /* ---------------------------------------------------------------- */
    /* Concerns                                                          */
    /* ---------------------------------------------------------------- */
    "/concerns": {
      hero: {
        asset: "cw-labyrinth-beach",
        alt: "A labyrinth of stones laid out on a beach headland, one person walking its path",
        focal: "50% 70%",
      },
      sections: {
        "mood-and-anxiety": {
          asset: "cw-windy-beach-coat",
          alt: "",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/anxiety": {
      hero: {
        asset: "cw-windy-beach-coat",
        alt: "A woman standing on a windy beach with her eyes closed, holding her coat closed at the collar",
        focal: "65% 40%",
      },
      sections: {
        "how-we-treat-anxiety-at-pathways-within": {
          asset: "cw-session-clipboard",
          alt: "A therapist taking notes across from a client",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/depression": {
      hero: {
        asset: "cw-window-light-glasses",
        alt: "A young man in glasses resting his chin on his hand and looking out a window",
        focal: "center",
      },
      sections: {
        "how-we-treat-depression-at-pathways-within": {
          asset: "cw-group-circle",
          alt: "A small group sitting together in a bright room",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/bipolar-disorder": {
      hero: {
        asset: "cw-cairn-shoreline",
        alt: "A tower of balanced stones on a pebble beach with the sea behind",
        focal: "60% 55%",
      },
      sections: {
        // The signs list is a tall full row card on this page; the hero
        // photograph rides beside it, on the left.
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "cw-cairn-shoreline",
          alt: "A tower of balanced stones on a pebble beach with the sea behind",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "60% 55%",
        },
        "how-we-treat-bipolar-disorder-at-pathways-within": {
          asset: "cw-medication-hands",
          alt: "A nurse holding a weekly pill organizer and placing tablets into a client's open palm",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "50% 40%",
        },
        "what-your-first-weeks-look-like": {
          asset: "cw-kitchen-morning",
          alt: "A woman in a yellow shirt arranging flowers at a kitchen table",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/ocd": {
      hero: {
        asset: "cw-table-notes",
        alt: "Two people at a table during a session, one writing on a clipboard",
        focal: "center",
      },
    },
    "/concerns/stress-and-burnout": {
      hero: {
        asset: "cw-ledge-from-behind",
        alt: "A woman seen from behind, sitting on a stone ledge with her bag beside her",
        focal: "50% 55%",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "cw-ledge-from-behind",
          alt: "A woman seen from behind, sitting on a stone ledge with her bag beside her",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "50% 55%",
        },
        "how-we-treat-stress-and-burnout-at-pathways-within": {
          asset: "cw-stone-stack-bokeh",
          alt: "Smooth stones stacked in a tower against sparkling water",
          shape: "rounded",
          aspect: "square",
          side: "end",
        },
      },
    },
    "/concerns/ptsd": {
      hero: {
        asset: "cw-lake-dusk",
        alt: "A person standing at the edge of a still lake at dusk, seen from behind",
        focal: "center",
      },
      sections: {
        "how-we-treat-trauma-and-ptsd-at-pathways-within": {
          asset: "cw-veteran-cap",
          alt: "A veteran in a service cap, seen from behind at a gathering",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/grief-and-loss": {
      hero: {
        asset: "cw-sea-rocks-alone",
        alt: "A woman standing alone on rocks at the edge of the sea",
        focal: "25% 50%",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "cw-sea-rocks-alone",
          alt: "A woman standing alone on rocks at the edge of the sea",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "25% 50%",
        },
        "how-we-treat-grief-and-loss-at-pathways-within": {
          asset: "cw-autumn-couple-walk",
          alt: "An older couple walking away under autumn trees, one arm around the other",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/adhd": {
      hero: {
        asset: "cw-rain-boots",
        alt: "Four children in muddy rain boots standing side by side",
        focal: "50% 55%",
      },
    },
    "/concerns/relationship-issues": {
      hero: {
        asset: "cw-couple-reeds",
        alt: "A couple standing close together by a lake, one leaning her head on the other's shoulder",
        focal: "center",
      },
      sections: {
        "how-we-treat-relationship-issues-at-pathways-within": {
          asset: "cw-father-son-car",
          alt: "A father and his teenage son laughing together beside a car",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/postpartum-and-perinatal": {
      hero: {
        asset: "cw-floor-play",
        alt: "A parent sitting on the floor of a bright living room, playing with a young child",
        focal: "50% 55%",
      },
    },
    "/concerns/self-esteem": {
      hero: {
        asset: "cw-teens-pebble-shore",
        alt: "Four teenagers sitting side by side on a pebble shore, seen from behind",
        focal: "50% 45%",
      },
      sections: {
        "how-we-treat-self-esteem-at-pathways-within": {
          asset: "cw-self-embrace-yellow",
          alt: "A woman in a yellow sweater smiling with her arms wrapped around herself",
          shape: "circle",
          side: "end",
        },
        "what-your-first-weeks-look-like": {
          asset: "cw-man-ledge-smile",
          alt: "A man in a suit jacket sitting on a low stone wall outdoors, smiling",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/lgbtqia-affirming-therapy": {
      hero: {
        asset: "cw-riverside-walk",
        alt: "Two people walking hand in hand along a riverside path beneath a bridge",
        focal: "50% 45%",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "cw-riverside-walk",
          alt: "Two people walking hand in hand along a riverside path beneath a bridge",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "50% 45%",
        },
        "how-we-treat-lgbtqia-clients-at-pathways-within": {
          asset: "cw-pier-couple",
          alt: "Two men smiling together on a wooden pier by a bridge",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/life-transitions": {
      hero: {
        asset: "cw-ledge-coffee",
        alt: "A woman sitting on a concrete ledge with a coffee, looking out and smiling",
        focal: "50% 40%",
      },
      sections: {
        "how-we-treat-life-transitions-at-pathways-within": {
          asset: "cw-whitewashed-path",
          alt: "A whitewashed stone path leading down to the sea",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
        },
      },
    },
    "/concerns/substance-use": {
      hero: {
        asset: "cw-sunrise-stretch",
        alt: "A man seen from behind with his hands behind his head, facing the sunrise",
        focal: "center",
      },
      sections: {
        "how-we-treat-substance-use-at-pathways-within": {
          asset: "cw-sunrise-stretch",
          alt: "A man seen from behind with his hands behind his head, facing the sunrise",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/chronic-pain-and-illness": {
      hero: {
        asset: "cw-chair-among-plants",
        alt: "A woman resting in a wooden chair among houseplants, eyes closed",
        focal: "60% 50%",
      },
      sections: {
        "how-we-treat-chronic-pain-and-illness-at-pathways-within": {
          asset: "cw-hand-still-water",
          alt: "A hand reaching down to touch the surface of still water",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
        },
      },
    },

    /* ---------------------------------------------------------------- */
    /* Wellness                                                          */
    /* ---------------------------------------------------------------- */
    "/wellness": {
      hero: {
        asset: "cw-hand-still-water",
        alt: "A hand reaching down to touch the surface of still water",
        focal: "center",
      },
      sections: {
        "why-wellness-lives-inside-a-mental-health-practice": {
          asset: "cw-welcome-counter",
          alt: "A wooden reception counter at a Pathways Within office with dried grasses and a hanging Welcome sign",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/wellness/massage": {
      hero: {
        asset: "cw-warm-sunlight",
        alt: "A woman with her eyes closed, shoulders relaxed, in a band of warm sunlight",
        focal: "50% 35%",
      },
      sections: {
        "who-it-helps": {
          asset: "cw-warm-sunlight",
          alt: "A woman with her eyes closed, shoulders relaxed, in a band of warm sunlight",
          shape: "circle",
          side: "end",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "cw-stone-stack-bokeh",
          alt: "Smooth stones stacked in a tower against sparkling water",
          shape: "rounded",
          aspect: "square",
          side: "end",
        },
      },
    },
    "/wellness/acupuncture": {
      hero: {
        asset: "cw-water-drop",
        alt: "A single drop landing on still water and sending out rings",
        focal: "center",
      },
      sections: {
        // Three paragraphs on a full row card (the approaches stack before it
        // takes a row of its own): the hero photograph rides beside them.
        "how-care-works-here": {
          asset: "cw-water-drop",
          alt: "",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
      },
    },
    // /wellness/cupping: no honest photograph of cupping in the export, so no
    // hero. The first-session card carries a quiet decorative figure only so
    // that "How care works here" is not left half empty beside it.
    "/wellness/cupping": {
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "cw-plant-on-table",
          alt: "",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
      },
    },
    "/wellness/energy-work": {
      hero: {
        asset: "cw-face-to-sun",
        alt: "",
        focal: "center",
      },
      sections: {
        "the-three-modalities-we-offer": {
          asset: "cw-face-to-sun",
          alt: "A woman with her face turned up toward the sun, eyes closed",
          shape: "circle",
          side: "end",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "cw-sunlit-meditation",
          alt: "A woman sitting cross-legged in a sunlit bedroom with her eyes closed",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/wellness/energy-work/reiki": {
      hero: {
        asset: "cw-chair-among-plants",
        alt: "A woman resting in a wooden chair among houseplants, eyes closed",
        focal: "60% 50%",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "cw-sea-rocks-alone",
          alt: "A woman standing alone on rocks at the edge of the sea",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "25% 50%",
        },
      },
    },
    "/wellness/energy-work/iet": {
      hero: {
        asset: "cw-coastal-stone-circles",
        alt: "Circular stone ruins on a grassy headland above the sea in morning light",
        focal: "center",
      },
    },
    "/wellness/cryotherapy": {
      hero: {
        asset: "cw-sea-foam-stones",
        alt: "",
        focal: "center",
      },
    },
    "/wellness/iv-vitamin-therapy": {
      hero: {
        asset: "cw-plant-on-table",
        alt: "",
        focal: "center",
      },
      sections: {
        "what-iv-vitamin-therapy-is": {
          asset: "cw-water-drop",
          alt: "",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
      },
    },

    /* ---------------------------------------------------------------- */
    /* Standalone services                                               */
    /* ---------------------------------------------------------------- */
    "/medication-management": {
      hero: {
        asset: "cw-prescriber-conversation",
        alt: "A prescriber in a white coat talking with a client in a bright office",
        focal: "50% 45%",
      },
      sections: {
        "how-care-works-here": {
          asset: "cw-coastal-stone-circles",
          alt: "Circular stone ruins on a grassy headland above the sea",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
        },
      },
    },
    "/coaching": {
      hero: {
        asset: "cw-coaching-conversation",
        alt: "A coach with a notebook talking with a client",
        focal: "50% 40%",
      },
      sections: {
        "how-care-works-here": {
          asset: "cw-coaching-conversation",
          alt: "A coach with a notebook talking with a client",
          shape: "circle",
          side: "end",
        },
      },
    },
  },
};
