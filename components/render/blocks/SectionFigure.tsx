import { SettleImage } from "@/components/motion";
import type { ResolvedPhoto, SectionPhoto, SectionPhotoLayout } from "@/lib/images";
import Picture from "./Picture";

const SIZES: Record<SectionPhotoLayout, string> = {
  /* Split media is the smaller column (~5/12 of the card). */
  split: "(min-width: 1200px) 560px, (min-width: 900px) 42vw, 100vw",
  /* Feature media is the larger column (~7/12 of the card). */
  feature: "(min-width: 1200px) 720px, (min-width: 900px) 58vw, 100vw",
  /* Band spans the bento card (~76rem) edge to edge. Cover does too: the
     photograph is the card. */
  band: "(min-width: 1200px) 76rem, (min-width: 900px) 92vw, 100vw",
  cover: "(min-width: 1200px) 76rem, (min-width: 900px) 92vw, 100vw",
  overlay: "(min-width: 1200px) 76rem, (min-width: 900px) 92vw, 100vw",
  /* One cell of a 2×2 collage, half the card on a wide viewport. */
  collage: "(min-width: 700px) 38rem, 100vw",
  /* One column of a two-up profile row; full width once the columns stack. */
  columns: "(min-width: 700px) 36rem, 100vw",
};

/**
 * The photograph half of a section that carries one: copy on one side, the
 * picture on the other (or a full-bleed band under/above the copy), settling
 * into place a beat after the words (motion only when GSAP has loaded and the
 * reader has not asked for less).
 *
 * `content-image` is on the figure on purpose: the bento in backdrop.css
 * treats any section that :has(.content-image) as a full row, which is the
 * room a two column layout needs.
 */
export default function SectionFigure({
  photo,
  shape = "rounded",
  aspect = "portrait",
  layout = "split",
  half = false,
}: {
  photo: ResolvedPhoto;
  shape?: SectionPhoto["shape"];
  aspect?: SectionPhoto["aspect"];
  layout?: SectionPhotoLayout;
  /** Omit content-image so the bento leaves this card on half a row. */
  half?: boolean;
}) {
  const resolvedLayout = layout ?? "split";
  /* Bands are immersive landscapes; circles keep their mask when used as primary. */
  const resolvedAspect =
    shape === "circle" ? "square" : resolvedLayout === "band" || resolvedLayout === "collage" ? (aspect ?? "landscape") : aspect;
  /* The collage wrapper carries content-image so the bento treats the grid as one figure.
     A half card must not: that class is what promotes a section to the full row. */
  const frameClass =
    half || resolvedLayout === "collage" || resolvedLayout === "columns"
      ? `section-figure__media section-figure__media--${shape}`
      : `content-image section-figure__media section-figure__media--${shape}`;

  return (
    <SettleImage
      className={frameClass}
      data-photo="section"
      data-layout={resolvedLayout}
      data-aspect={resolvedAspect}
    >
      <Picture photo={photo} className="section-figure__img" sizes={SIZES[resolvedLayout]} />
    </SettleImage>
  );
}
