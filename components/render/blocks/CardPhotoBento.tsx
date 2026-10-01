import Picture from "./Picture";
import type { CardFill } from "@/lib/images/card-bento";

/**
 * Photo bento that sits in the open side of a text card. The first cell is
 * the wide frame; the rest tile under it. A portrait is one circle, used
 * for a named provider headshot.
 */
export default function CardPhotoBento({ fill }: { fill: CardFill }) {
  if (fill.kind === "portrait") {
    return (
      <div className="card-photo-bento card-photo-bento--portrait">
        <figure className="card-photo-bento__cell card-photo-bento__cell--lead">
          <Picture
            photo={fill.photo}
            className="card-photo-bento__img"
            sizes="(min-width: 900px) 18rem, 70vw"
          />
        </figure>
      </div>
    );
  }

  return (
    <div className="card-photo-bento" data-count={fill.photos.length}>
      {fill.photos.map((photo, index) => (
        <figure
          key={`${photo.src}-${index}`}
          className={index === 0 ? "card-photo-bento__cell card-photo-bento__cell--lead" : "card-photo-bento__cell"}
        >
          <Picture
            photo={photo}
            className="card-photo-bento__img"
            sizes={index === 0 ? "(min-width: 900px) 16rem, 46vw" : "(min-width: 900px) 8rem, 28vw"}
          />
        </figure>
      ))}
    </div>
  );
}
