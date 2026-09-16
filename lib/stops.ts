/**
 * Callout stops along the branch.
 *
 * `x` / `y` are fractions of the branch image (2000 x 1125) and mark where
 * the anchor dot sits on the branch.
 *
 * `dx` / `dy` place the glass card relative to the anchor:
 *   dx — horizontal offset of the card's centre, in vw (positive = right)
 *   dy — vertical offset of the card's top edge, in vh (negative = above)
 * At layout time dy is clamped so the card stays between 14vh from the top
 * and 12vh from the bottom of the viewport. Copy lives here so it can be
 * edited without touching layout code.
 */
export type Stop = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

/**
 * Branch artwork. `src` is the base 2000-wide file; `srcSet`/`sizes` let the
 * browser fetch exactly one larger tier when the rendered size and device
 * pixel ratio call for it (the pinned track renders at 2.15vh × 16/9 wide,
 * the mobile strip at 52vh × 16/9). All tiers share the same aspect ratio.
 */
export const BRANCH = {
  src: "/branch.webp",
  srcSet: [
    "/branch.webp 2000w",
    "/branch-3000.webp 3000w",
    "/branch-4400.webp 4400w",
    "/branch-6000.webp 6000w",
    "/branch-8192.webp 8192w",
    "/branch-10000.webp 10000w",
    "/branch-12000.webp 12000w",
    "/branch-14000.webp 14000w",
    "/branch-16368.webp 16368w",
  ].join(", "),
  // Under 768px (and under reduced motion) the hero stacks and the image runs
  // the content width; pinned, it is 2.15 viewport heights tall.
  sizes: "(max-width: 767px) 100vw, calc(215vh * 16 / 9)",
  width: 2000,
  height: 1125,
} as const;

export const stops: Stop[] = [
  {
    id: "begin",
    x: 0.15,
    y: 0.415,
    dx: 0.16,
    dy: -0.34,
    kicker: "01 · Therapy",
    title: "Begin where you are.",
    body:
      "Individual therapy for anxiety, depression, life transitions and everything in between. One conversation at a time, at your pace.",
    href: "/therapy",
    cta: "Explore therapy",
  },
  {
    id: "still",
    x: 0.362,
    y: 0.52,
    dx: -0.085,
    dy: -0.36,
    kicker: "02 · Wellness",
    title: "Still the water.",
    body:
      "Somatic work, mindfulness and hypnotherapy that help the body settle so the mind can follow. Wellness built around how you actually live.",
    href: "/wellness",
    cta: "Discover wellness",
  },
  {
    id: "labyrinth",
    x: 0.503,
    y: 0.535,
    dx: 0.1,
    dy: -0.32,
    kicker: "03 · Trauma & EMDR",
    title: "Walk the labyrinth.",
    body:
      "Healing rarely moves in a straight line. EMDR, IFS and trauma-informed care for the turns you didn't choose and the ones you did.",
    href: "/therapy",
    cta: "Learn about EMDR",
  },
  {
    id: "sit",
    x: 0.653,
    y: 0.395,
    dx: -0.09,
    dy: 0.24,
    kicker: "04 · Couples, Families & Groups",
    title: "Sit with what's here.",
    body:
      "Couples, family and group therapy for the relationships that hold you. Space to be heard, and to hear each other again.",
    href: "/therapy",
    cta: "See our approach",
  },
  {
    id: "step",
    x: 0.828,
    y: 0.41,
    dx: -0.22,
    dy: 0.2,
    kicker: "05 · Our Team",
    title: "Step forward.",
    body:
      "A collaborative of licensed clinicians across Long Island, in person and by telehealth. Meet the people who will walk beside you.",
    href: "/team",
    cta: "Meet the team",
  },
];
