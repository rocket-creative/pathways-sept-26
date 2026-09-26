import { SettleImage } from "@/components/motion";
import type { ResolvedPhoto, SectionPhoto, SectionPhotoLayout } from "@/lib/images";
import Picture from "./Picture";

const SIZES: Record<SectionPhotoLayout, string> = {
  /* Split media is the smaller column (~5/12 of the card). */
  split: "(min-width: 1200px) 560px, (min-width: 900px) 42vw, 100vw",
  /* Feature media is the larger column (~7/12 of the card). */
  feature: "(min-width: 1200px) 720px, (min-width: 900px) 58vw, 100vw",
  /* Band spans the bento card (~76rem) edge to edge. */
  band: "(min-width: 1200px) 76rem, (min-width: 900px) 92vw, 100vw",
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
}: {
  photo: ResolvedPhoto;
  shape?: SectionPhoto["shape"];
  aspect?: SectionPhoto["aspect"];
  layout?: SectionPhotoLayout;
}) {
  const resolvedLayout = layout ?? "split";
  /* Bands are immersive landscapes; circles keep their mask when used as primary. */
  const resolvedAspect =
    shape === "circle" ? "square" : resolvedLayout === "band" ? (aspect ?? "landscape") : aspect;

  return (
    <SettleImage
      className={`content-image section-figure__media section-figure__media--${shape}`}
      data-photo="section"
      data-layout={resolvedLayout}
      data-aspect={resolvedAspect}
    >
      <Picture photo={photo} className="section-figure__img" sizes={SIZES[resolvedLayout]} />
    </SettleImage>
  );
}
