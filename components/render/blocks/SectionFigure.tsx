import { SettleImage } from "@/components/motion";
import type { ResolvedPhoto, SectionPhoto } from "@/lib/images";
import Picture from "./Picture";

/**
 * The photograph half of a section that carries one: copy on one side, the
 * picture on the other, settling into place a beat after the words (motion
 * only when GSAP has loaded and the reader has not asked for less).
 *
 * `content-image` is on the figure on purpose: the bento in backdrop.css
 * treats any section that :has(.content-image) as a full row, which is the
 * room a two column layout needs.
 */
export default function SectionFigure({
  photo,
  shape = "rounded",
  aspect = "portrait",
}: {
  photo: ResolvedPhoto;
  shape?: SectionPhoto["shape"];
  aspect?: SectionPhoto["aspect"];
}) {
  return (
    <SettleImage
      className={`content-image section-figure__media section-figure__media--${shape}`}
      data-photo="section"
      data-aspect={shape === "circle" ? "square" : aspect}
    >
      <Picture
        photo={photo}
        className="section-figure__img"
        sizes="(min-width: 1200px) 560px, (min-width: 900px) 42vw, 100vw"
      />
    </SettleImage>
  );
}
