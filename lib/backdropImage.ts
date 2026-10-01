/**
 * The labyrinth photograph the whole site sits on: image 2 of the homepage
 * hero (components/hero) and the fixed backdrop of every inner page
 * (components/backdrop/PageBackdrop.tsx).
 *
 * Tiers are cut from the 16384 x 9216 master (`giant-path-bg.png` in the
 * repo root, git-ignored at 189 MB) with no upscaling anywhere. `sizes`
 * is the rendered width of a 16:9 cover of the viewport, which is how
 * image 2 is drawn on the homepage handoff and on every inner page: as
 * far zoomed out as the photograph can go and still fill the screen.
 * The larger of viewport width and (viewport height × 16/9) is what the
 * browser picks from (a 5K display at 2x takes the 7680). The JPEG is
 * the fallback for browsers without WebP.
 *
 * `width` and `height` match the fallback file, which is 16:9 like every
 * tier. They are not the 16384×9216 master. macOS Chrome will not paint an
 * img whose width or height attribute is 16384 or larger, the GPU texture
 * limit (the branch tiers stop at 16368 for the same reason). Image 2 is
 * the element carrying that attribute, so Chrome on a Mac never showed the
 * second background, while image 1 at width 2000 still did.
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
  sizes: "max(100vw, calc(100vh * 16 / 9))",
  width: 2560,
  height: 1440,
} as const;
