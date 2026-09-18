/**
 * Where each hero stop sits on the branch render (image 1) when the hero is
 * pinned. `sx` / `sy` are fractions of the image's width and height and mark
 * the anchor dot; `place` says which side of the anchor the card hangs on.
 *
 * Copy never lives here. The stops themselves come from content/pages/home.md;
 * this only decides where the supplied cards land on the artwork. Anything
 * past the fifth anchor is spaced evenly along the remaining branch.
 */
export interface Anchor {
  sx: number;
  sy: number;
  place: "above" | "below";
}

export const ANCHORS: Anchor[] = [
  { sx: 0.15, sy: 0.415, place: "below" }, // the cairn
  { sx: 0.362, sy: 0.52, place: "above" }, // the tide pool
  { sx: 0.503, sy: 0.535, place: "above" }, // the labyrinth
  { sx: 0.653, sy: 0.395, place: "below" }, // the seated figure
  { sx: 0.828, sy: 0.41, place: "below" }, // the standing figure
];

export function anchorFor(index: number, total: number): Anchor {
  if (index < ANCHORS.length) return ANCHORS[index];
  const remaining = Math.max(total - ANCHORS.length, 1);
  const step = (0.95 - 0.85) / remaining;
  return { sx: 0.85 + step * (index - ANCHORS.length + 1), sy: 0.41, place: "below" };
}

/**
 * The close up each stacked card carries (under 768px and under reduced
 * motion): the piece of image 1 the card lands on when the hero is pinned.
 * scripts/build-hero-crops.mts cuts them from the largest branch tier with
 * this geometry, so moving an anchor moves its crop on the next run.
 *
 *   window   crop width as a fraction of the image width
 *   aspect   crop width / height
 *   anchorY  where the anchor sits in the crop, as a fraction of its height
 *            (under half, so the branch below the subject fills the frame)
 */
export const STOP_PHOTO = {
  window: 0.18,
  aspect: 3 / 2,
  anchorY: 0.42,
  widths: [480, 800, 1200],
  dir: "/images/hero",
} as const;

export interface StopPhoto {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

/** Paths for stop `index` (0 based); the files come from `npm run hero-crops`. */
export function stopPhoto(index: number): StopPhoto {
  const stem = `${STOP_PHOTO.dir}/stop-${index + 1}`;
  const largest = STOP_PHOTO.widths[STOP_PHOTO.widths.length - 1];
  return {
    src: `${stem}-${STOP_PHOTO.widths[1]}.webp`,
    srcSet: STOP_PHOTO.widths.map((w) => `${stem}-${w}.webp ${w}w`).join(", "),
    // The stacked card runs the content width: the viewport under 768px,
    // the 62rem track above it (reduced motion).
    sizes: "(max-width: 767px) calc(100vw - 2.5rem), min(100vw - 2.5rem, 62rem)",
    width: largest,
    height: Math.round(largest / STOP_PHOTO.aspect),
  };
}

/** Image 1, the branch render. Same tiers as lib/stops.ts so the head preload matches. */
export { BRANCH } from "@/lib/stops";

/**
 * Image 2, the labyrinth close up the rest of the site sits on. Never
 * preloaded in <head>. Same tiers as the inner-page backdrop.
 */
export { LABYRINTH as HANDOFF_IMAGE } from "@/lib/backdropImage";
