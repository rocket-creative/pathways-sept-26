import type { JSX, ReactNode } from "react";
import type { ResolvedPhoto } from "@/lib/images";
import Picture from "./Picture";

const PLATE_SIZES = {
  /* The side plate is the narrow column, about two fifths of the card. */
  side: "(min-width: 800px) 40vw, 100vw",
  /* A band is the full card, the same slot as a section band. */
  band: "(min-width: 1200px) 76rem, (min-width: 800px) 92vw, 100vw",
} as const;

/**
 * How wide a bento cell is. On a phone the first cell is the full card and
 * the others share the row; from 800px the count decides which cell is large.
 */
function cellSizes(index: number, count: number): string {
  if (count === 1) return "(min-width: 800px) 90vw, 100vw";
  if (count === 2) {
    return index === 0 ? "(min-width: 800px) 52vw, 100vw" : "(min-width: 800px) 36vw, 46vw";
  }
  if (count === 3) {
    return index === 0 ? "(min-width: 800px) 48vw, 100vw" : "(min-width: 800px) 32vw, 46vw";
  }
  if (index === 0) return "(min-width: 800px) 34vw, 100vw";
  if (index === 1) return "(min-width: 800px) 56vw, 46vw";
  return "(min-width: 800px) 28vw, 46vw";
}

/**
 * Magazine break inside a glass card. The opening stays with one plate,
 * the next photographs (four at most) interrupt as an asymmetric bento,
 * and whatever copy is left follows at a reading measure.
 *
 * An empty photo list renders nothing: the section would otherwise be a
 * heading with a hole where the plate should be.
 */
export default function EditorialSpread({
  heading,
  lead,
  rest,
  photos,
  plate = "side",
}: {
  heading: ReactNode;
  lead: ReactNode;
  rest: ReactNode;
  /** photos[0] is the plate. photos.slice(1) is the interrupting bento. Cap the bento at 4 cells. */
  photos: ResolvedPhoto[];
  /** side: plate beside the lead from 800px. band: landscape plate under the lead, full width. */
  plate?: "side" | "band";
}): JSX.Element | null {
  const platePhoto = photos[0];
  if (!platePhoto) return null;

  const cells = photos.slice(1, 5);

  return (
    <div className="editorial-spread content-image" data-plate={plate}>
      <div className="editorial-spread__open">
        <div className="editorial-spread__lead">
          {heading}
          {lead}
        </div>
        <figure className="editorial-spread__plate section-figure__media">
          <Picture className="section-figure__img" photo={platePhoto} sizes={PLATE_SIZES[plate]} />
        </figure>
      </div>
      {cells.length > 0 ? (
        <div className="editorial-spread__bento" data-count={cells.length}>
          {cells.map((photo, index) => (
            <figure key={`${photo.src}-${index}`} className="editorial-spread__cell">
              <Picture className="editorial-spread__img" photo={photo} sizes={cellSizes(index, cells.length)} />
            </figure>
          ))}
        </div>
      ) : null}
      {rest != null ? <div className="editorial-spread__rest">{rest}</div> : null}
    </div>
  );
}
