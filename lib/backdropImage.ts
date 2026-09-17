/**
 * The labyrinth photograph the whole site sits on: image 2 of the homepage
 * hero (components/hero) and the fixed backdrop of every inner page
 * (components/backdrop/PageBackdrop.tsx).
 *
 * Tiers are cut from the 16384 x 9216 master (`giant-path-bg.png` in the
 * repo root, git-ignored at 189 MB) with no upscaling anywhere. The image
 * covers the viewport (`object-fit: cover`), so on a wide screen it renders
 * at the viewport width and on a tall one at the height scaled by the 16:9
 * aspect; `sizes` is the larger of the two so the browser picks the tier
 * that covers the viewport at its device pixel ratio (a 5K display at 2x
 * takes the 7680). The JPEG is the fallback for browsers without WebP.
 *
 * Regenerate with sharp (see the widths below) if the master changes.
 */
export const LABYRINTH = {
  src: "/labyrinth-2560.webp",
  srcSet: [
    "/labyrinth-1280.webp 1280w",
    "/labyrinth-1920.webp 1920w",
    "/labyrinth-2560.webp 2560w",
    "/labyrinth-3840.webp 3840w",
    "/labyrinth-5120.webp 5120w",
    "/labyrinth-7680.webp 7680w",
  ].join(", "),
  fallback: "/labyrinth.jpg",
  sizes: "max(100vw, 177.78vh)",
  width: 16384,
  height: 9216,
} as const;
