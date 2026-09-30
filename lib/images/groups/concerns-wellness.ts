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
 * - The wellness services now use approved treatment-room and front-desk
 *   photographs (cw-ap-*) for "where we work" and first-session cards.
 *   Lifestyle stock stays on clinical-mood sections when no real photo fits.
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
    // April 2026 medication, acupuncture (Leo), and a hands-only care-team crop.
    { id: "cw-ap26-med-single", file: "april-2026/med/single-patient.jpg" },
    { id: "cw-ap26-med-couples", file: "april-2026/med/couples.jpg" },
    { id: "cw-ap26-med-teen", file: "april-2026/med/parent-teen.jpg" },
    { id: "cw-ap26-med-np", file: "april-2026/med/np-and-therapist.jpg" },
    { id: "cw-ap26-hands", file: "april-2026/med/care-team-hands.jpg" },
    { id: "cw-ap26-acu-needles", file: "april-2026/acupuncture/needles.jpg" },
    { id: "cw-ap26-acu-shoulder", file: "april-2026/acupuncture/shoulder.jpg" },
    { id: "cw-ap26-acu-leo", file: "april-2026/acupuncture/practitioner-smile.jpg" },

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

    // Approved practice interiors (massage / acupuncture rooms + front desk)
    { id: "cw-ap-massage-session", file: "approved/offices/massage-acupuncture/_24M8551-gb-e.jpg" },
    { id: "cw-ap-acupuncture-session", file: "approved/offices/massage-acupuncture/_24M8561-gb-e.jpg" },
    { id: "cw-ap-needle-closeup", file: "approved/offices/massage-acupuncture/_24M8584-gb-e.jpg" },
    { id: "cw-ap-shoulder-needles", file: "approved/offices/massage-acupuncture/_24M8602-gb-e.jpg" },
    { id: "cw-ap-treatment-room", file: "approved/offices/massage-acupuncture/_24M8613-gb-e-1-.jpg" },
    { id: "cw-ap-desk-orchids", file: "approved/offices/front-desk/_24M8640-gb-e-1-.jpg" },
    { id: "cw-ap-waiting-handshake", file: "approved/offices/front-desk/_24M8514-gb-e.jpg" },
  ],
  pages: {
    /* ---------------------------------------------------------------- */
    /* Concerns                                                          */
    /* ---------------------------------------------------------------- */
    "/concerns": {
      hero: {
        asset: "th-ap26-fam-child",
        alt: "A family with a child sitting with a therapist on a blue sofa",
        focal: "center",
      },
      sections: {
        "mood-and-anxiety": {
          asset: "th-ap26-green-vest",
          alt: "A client smiling during a conversation with a therapist in a green vest",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/anxiety": {
      hero: {
        asset: "th-ap26-seated",
        alt: "A client sitting calmly on a blue sofa across from a therapist",
        focal: "center",
      },
      sections: {
        "how-we-treat-anxiety-at-pathways-within": {
          asset: "th-ap26-conversation",
          alt: "A therapist and client in conversation on blue sofas",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/depression": {
      hero: {
        asset: "th-ap26-green-listen",
        alt: "A therapist listening while a client talks from a blue sofa",
        focal: "center",
      },
      sections: {
        "how-we-treat-depression-at-pathways-within": {
          asset: "th-ap26-group-floor",
          alt: "A group sitting in a circle on the floor of a therapy office",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/bipolar-disorder": {
      hero: {
        asset: "missing-photo",
        alt: "",
        missing: "A current photo for bipolar care",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "missing-photo",
          alt: "",
          missing: "A current photo for bipolar care",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
        },
        "how-we-treat-bipolar-disorder-at-pathways-within": {
          asset: "cw-ap26-med-couples",
          alt: "Tiffany Roberts talking with a couple during a visit",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          focal: "center",
        },
        "what-your-first-weeks-look-like": {
          asset: "cw-ap26-med-teen",
          alt: "Tiffany Roberts talking with a teenager and a parent",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/ocd": {
      hero: {
        asset: "th-ap26-green-vest",
        alt: "A therapist in a green vest talking with a client",
        focal: "center",
      },
    },
    "/concerns/stress-and-burnout": {
      hero: {
        asset: "th-ap26-fam-end",
        alt: "A family seated together on a sofa at the close of a session",
        focal: "center",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "missing-photo",
          alt: "",
          missing: "A current photo for stress and burnout",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
        },
        "how-we-treat-stress-and-burnout-at-pathways-within": {
          asset: "th-ap26-seated",
          alt: "A client sitting calmly on a blue sofa across from a therapist",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/ptsd": {
      hero: {
        asset: "th-ap26-fam-behind",
        alt: "A family on a sofa, seen from behind the therapist sitting with them",
        focal: "center",
      },
      sections: {
        "how-we-treat-trauma-and-ptsd-at-pathways-within": {
          asset: "th-ap26-across",
          alt: "Two people talking quietly across a blue sofa in a therapy office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/grief-and-loss": {
      hero: {
        asset: "th-ap26-older-couple",
        alt: "An older couple talking with a therapist in a quiet office",
        focal: "center",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "missing-photo",
          alt: "",
          missing: "A current photo for grief and loss",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
        },
        "how-we-treat-grief-and-loss-at-pathways-within": {
          asset: "th-ap26-older-couple",
          alt: "An older couple talking with a therapist in a quiet office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/adhd": {
      hero: {
        asset: "th-ap26-kids-point",
        alt: "A child talking with a therapist while two other children sit on a sofa",
        focal: "center",
      },
    },
    "/concerns/relationship-issues": {
      hero: {
        asset: "th-ap26-couple",
        alt: "A couple talking with a therapist in a Pathways Within office",
        focal: "center",
      },
      sections: {
        "how-we-treat-relationship-issues-at-pathways-within": {
          asset: "th-ap26-two-women",
          alt: "Two women sitting together on a sofa across from a therapist",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/postpartum-and-perinatal": {
      hero: {
        asset: "th-ap26-fam-child",
        alt: "A parent with a young child on their lap during a session",
        focal: "center",
      },
    },
    "/concerns/self-esteem": {
      hero: {
        asset: "th-ap26-conversation",
        alt: "A therapist and client in conversation on blue sofas",
        focal: "center",
      },
      sections: {
        "how-we-treat-self-esteem-at-pathways-within": {
          asset: "th-ap26-seated",
          alt: "A client sitting with a therapist on a blue sofa",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
        "what-your-first-weeks-look-like": {
          asset: "th-ap26-green-quiet",
          alt: "A therapist and client sitting across from each other on blue sofas",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/lgbtqia-affirming-therapy": {
      hero: {
        asset: "th-ap26-two-women",
        alt: "Two women sitting together on a sofa across from a therapist",
        focal: "center",
      },
      sections: {
        "signs-it-may-be-time-to-talk-to-someone": {
          asset: "th-ap26-two-women",
          alt: "Two women sitting together on a sofa across from a therapist",
          shape: "rounded",
          aspect: "portrait",
          side: "start",
          focal: "center",
        },
        "how-we-treat-lgbtqia-clients-at-pathways-within": {
          asset: "th-ap26-green-couple",
          alt: "A therapist meeting with two people on a blue sofa",
          shape: "circle",
          side: "end",
        },
      },
    },
    "/concerns/life-transitions": {
      hero: {
        asset: "th-ap26-green-listen",
        alt: "A therapist listening while a client talks from a blue sofa",
        focal: "center",
      },
      sections: {
        "how-we-treat-life-transitions-at-pathways-within": {
          asset: "th-ap26-conversation",
          alt: "A therapist and client in conversation on blue sofas",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/substance-use": {
      hero: {
        asset: "th-ap26-across",
        alt: "Two people talking quietly across a blue sofa in a therapy office",
        focal: "center",
      },
      sections: {
        "how-we-treat-substance-use-at-pathways-within": {
          asset: "th-ap26-across",
          alt: "Two people talking quietly across a blue sofa in a therapy office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          focal: "center",
        },
      },
    },
    "/concerns/chronic-pain-and-illness": {
      hero: {
        asset: "cw-ap-massage-session",
        alt: "A massage therapist working with a client beside a beach mural",
        focal: "center",
      },
      sections: {
        "how-we-treat-chronic-pain-and-illness-at-pathways-within": {
          asset: "cw-ap26-med-couples",
          alt: "A practitioner talking with a couple in a Pathways Within office",
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
        asset: "cw-ap-massage-session",
        alt: "A massage therapist working with a client beside a beach mural",
        focal: "center",
      },
      sections: {
        "what-we-offer": {
          asset: "cw-ap-acupuncture-session",
          alt: "A licensed practitioner working with a client on a treatment table in a beach-themed Pathways Within room",
          shape: "rounded",
          aspect: "landscape",
          side: "start",
          focal: "62% 40%",
        },
        "why-wellness-lives-inside-a-mental-health-practice": {
          asset: "cw-ap-desk-orchids",
          alt: "A client talking with Pathways Within staff at the front desk beneath the practice logo",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "45% 40%",
        },
        "what-to-expect": {
          asset: "cw-ap-massage-session",
          alt: "A massage therapist working with a client on a treatment table in a beach-themed Pathways Within room",
          shape: "rounded",
          aspect: "landscape",
          /* Panel on the left, over the window and chair. Faces are on the right. */
          side: "end",
          layout: "overlay",
          focal: "70% 30%",
        },
        "who-provides-it": {
          asset: "ha-ap26-desk-smile",
          alt: "A Pathways Within staff member smiling with a visitor at the front desk",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        where: {
          asset: "pr-ap-smt-wellness-table",
          alt: "Wellness treatment room at the Smithtown office, with a massage table and beach mural",
          shape: "rounded",
          aspect: "landscape",
          /* Empty room. Panel on the left leaves the mural clear. */
          side: "end",
          layout: "overlay",
          focal: "center",
        },
      },
    },
    "/wellness/massage": {
      hero: {
        asset: "cw-ap-massage-session",
        alt: "A massage therapist working with a client on a treatment table in a beach-themed Pathways Within room",
        focal: "70% 30%",
      },
      sections: {
        "who-it-helps": {
          asset: "cw-ap-massage-session",
          alt: "A massage therapist working with a client on a treatment table in a beach-themed Pathways Within room",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "70% 30%",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "cw-ap-massage-session",
          alt: "A massage therapist working with a client on a treatment table in a beach-themed Pathways Within room",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "70% 30%",
        },
      },
    },
    "/wellness/acupuncture": {
      hero: {
        asset: "cw-ap-massage-session",
        alt: "A massage therapist working with a client beside a beach mural",
        focal: "center",
      },
      sections: {
        "what-acupuncture-is": {
          asset: "cw-ap26-med-couples",
          alt: "A practitioner talking with a couple in a Pathways Within office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-green-quiet",
          alt: "A therapist and client sitting across from each other on blue sofas",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        "how-care-works-here": {
          asset: "ha-ap26-desk-talk",
          alt: "Welcome Team members talking with a visitor at the Pathways Within front desk",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          layout: "feature",
          focal: "30% 30%",
        },
        "where-it-is-offered": {
          asset: "cw-ap-treatment-room",
          alt: "A Pathways Within treatment room with a beach mural, where acupuncture is offered",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "band",
          focal: "55% 40%",
        },
      },
    },
    // Cupping shares the massage treatment table; no honest cupping photo yet.
    "/wellness/cupping": {
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "cw-ap-massage-session",
          alt: "A Pathways Within treatment room with a massage table and beach mural, where massage-based cupping is offered",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "70% 30%",
        },
      },
    },
    "/wellness/energy-work": {
      hero: {
        asset: "missing-photo",
        alt: "",
        missing: "April photo of Tia",
      },
      sections: {
        "the-three-modalities-we-offer": {
          asset: "missing-photo",
          alt: "",
          missing: "April photo of Tia",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "missing-photo",
          alt: "",
          missing: "April photo of Tia",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
        },
      },
    },
    "/wellness/energy-work/reiki": {
      hero: {
        asset: "missing-photo",
        alt: "",
        missing: "April photo of Tia",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "missing-photo",
          alt: "",
          missing: "April photo of Tia",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
        },
      },
    },
    "/wellness/energy-work/iet": {
      hero: {
        asset: "missing-photo",
        alt: "",
        missing: "April photo of Tia",
      },
      sections: {
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "missing-photo",
          alt: "",
          missing: "April photo of Tia",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
        },
      },
    },
    "/wellness/cryotherapy": {
      hero: {
        asset: "missing-photo",
        alt: "",
        missing: "A current photo of cryotherapy",
      },
      sections: {
        "what-cryotherapy-is": {
          asset: "missing-photo",
          alt: "",
          missing: "A current photo of cryotherapy",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
        },
      },
    },
    "/wellness/iv-vitamin-therapy": {
      hero: {
        asset: "missing-photo",
        alt: "",
        missing: "A current photo of IV vitamin therapy",
      },
      sections: {
        "what-iv-vitamin-therapy-is": {
          asset: "missing-photo",
          alt: "",
          missing: "A current photo of IV vitamin therapy",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
        },
      },
    },

    /* ---------------------------------------------------------------- */
    /* Standalone services                                               */
    /* ---------------------------------------------------------------- */
    "/medication-management": {
      hero: {
        asset: "cw-ap26-med-couples",
        alt: "Tiffany Roberts talking with a couple during a medication management visit",
        focal: "center",
      },
      sections: {
        "what-medication-management-is": {
          asset: "cw-ap26-med-couples",
          alt: "Tiffany Roberts talking with a couple during a medication management visit",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        "who-it-helps": {
          asset: "cw-ap26-med-teen",
          alt: "Tiffany Roberts talking with a teenager and a parent",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        "what-to-expect-in-your-first-session-at-pathways-within": {
          asset: "th-ap26-teen",
          alt: "Tiffany Roberts speaking with a parent and teenager during a first visit",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        "how-care-works-here": {
          asset: "pr-ap-rvc-navy-room",
          alt: "Therapy room at the Rockville Centre office, where medication management visits are also offered",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "feature",
          focal: "center",
        },
        "where-it-is-offered": {
          asset: "pr-ap-gc-waiting-doors",
          alt: "Waiting area at the Garden City office",
          shape: "rounded",
          aspect: "landscape",
          side: "end",
          layout: "band",
          focal: "center",
        },
      },
    },
    "/coaching": {
      hero: {
        asset: "ha-tia-baumohl",
        alt: "Tia Baumohl, certified coach and energy medicine practitioner",
        focal: "top",
      },
      sections: {
        "tia-baumohl": {
          asset: "ha-tia-baumohl",
          alt: "Portrait of Tia Baumohl, certified coach at Pathways Within",
          shape: "rounded",
          aspect: "portrait",
          side: "end",
          layout: "feature",
          focal: "top",
        },
      },
    },
  },
};
