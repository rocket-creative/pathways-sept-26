import type { SectionPhoto, SectionPhotoLayout } from "@/lib/images";

/**
 * A quiet stand-in for a photograph the notes asked for and the library does
 * not have. The label names what to supply. It uses the same frame as a
 * section figure so the card layout does not collapse.
 */
export default function MissingPhoto({
  label,
  shape = "rounded",
  aspect = "landscape",
  layout = "split",
}: {
  label: string;
  shape?: SectionPhoto["shape"];
  aspect?: SectionPhoto["aspect"];
  layout?: SectionPhotoLayout;
}) {
  const resolvedLayout = layout ?? "split";
  const resolvedAspect = shape === "circle" ? "square" : aspect ?? "landscape";

  return (
    <div
      className={`content-image section-figure__media section-figure__media--${shape} missing-photo`}
      data-photo="missing"
      data-layout={resolvedLayout}
      data-aspect={resolvedAspect}
      role="img"
      aria-label={`Missing photo. ${label}`}
    >
      <div className="missing-photo__label">
        <p className="missing-photo__title">Missing photo</p>
        <p className="missing-photo__need">{label}</p>
      </div>
    </div>
  );
}
