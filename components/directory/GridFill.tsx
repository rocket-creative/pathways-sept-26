import type { CSSProperties } from "react";
import type { Focal } from "@/lib/images";

/**
 * The decorative tile that fills the last row of a card grid.
 *
 * The provider and location grids run three columns wide on desktop and two
 * on a tablet, so a list of four or five cards leaves one or two cells empty
 * at the end of the last row. Rather than an empty strip of glass, the gap
 * takes a photograph: a room for the provider grids, the shore for offices.
 *
 * The tile is one grid item that spans the empty cells. How many cells are
 * empty depends on the column count, so it carries the remainder for both
 * layouts (`--fill-span-3`, `data-fill-3` for three columns; the `-2` pair for
 * two) and directory.css picks the right one per breakpoint, hiding the tile
 * when the row is already full. Under one column it never shows.
 *
 * Purely decorative: `aria-hidden`, empty alt, lazy. No hooks and no registry
 * import, so it renders from a server component and from the client side
 * directory alike; fillPhoto.ts chooses the picture on the server.
 */

/** Everything the tile needs, serialisable so a client component can render it. */
export interface FillPhoto {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  focal: Focal;
}

/** How many cells the tile spans in a grid of `columns`, given `count` cards. */
export function fillSpan(count: number, columns: number): number {
  const remainder = count % columns;
  return remainder === 0 ? 0 : columns - remainder;
}

/** The tile itself. Renders nothing when every layout's last row is full. */
export default function GridFill({ photo, count }: { photo: FillPhoto | undefined; count: number }) {
  if (!photo) return null;
  const span3 = fillSpan(count, 3);
  const span2 = fillSpan(count, 2);
  if (span3 === 0 && span2 === 0) return null;

  const style = { "--fill-span-3": span3, "--fill-span-2": span2 } as CSSProperties;

  return (
    <li className="card-grid__fill" aria-hidden="true" data-fill-3={span3} data-fill-2={span2} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="card-grid__fill-img"
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="(min-width: 1000px) 800px, (min-width: 600px) 50vw, 100vw"
        alt=""
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: photo.focal }}
      />
    </li>
  );
}
