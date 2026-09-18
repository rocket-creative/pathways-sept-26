import { Fragment } from "react";
import Link from "next/link";
import { getLocationCards, type LocationCardData } from "@/lib/locations";
import { pickFillPhoto } from "./fillPhoto";
import GridFill from "./GridFill";
import "./directory.css";

/**
 * [LOCATION CARDS: slug, slug]. Name, address, accessibility, link. The
 * accessibility state has three values, because the sheet answers true, false,
 * or [NEEDS]: an office we have not confirmed never shows an accessible mark.
 *
 * `fill` is off when the renderer lays a lone card out beside its copy
 * (PageBody, .page-section--cards-one): the copy fills the row, not a tile.
 */
export default function LocationCards({ slugs, fill = true }: { slugs: string[]; fill?: boolean }) {
  const cards = getLocationCards(slugs);
  if (!cards.length) return null;

  // A shoreline photograph fills the end of the last row (see GridFill).
  const photo = fill ? pickFillPhoto("locations", slugs.join(",")) : undefined;

  return (
    <ul className="location-cards">
      {cards.map((card) => (
        <li key={card.slug} className="location-card">
          <p className="location-card__name">
            <Link href={card.url}>{card.name}</Link>
          </p>
          <address className="location-card__address">{card.addressLine}</address>
          <Accessibility card={card} />
        </li>
      ))}
      <GridFill photo={photo} count={cards.length} />
    </ul>
  );
}

function Accessibility({ card }: { card: LocationCardData }) {
  if (card.accessibility === "unknown") {
    return (
      <p className="location-card__access" data-access="unknown">
        {card.accessibilityNote ? (
          <WithNeeds text={card.accessibilityNote} />
        ) : (
          <Needs value={card.accessibilityNeeds ?? `accessibility for ${card.name}`} />
        )}
      </p>
    );
  }

  return (
    <p className="location-card__access" data-access={card.accessibility}>
      <span className="location-card__access-mark" aria-hidden="true" />
      {card.accessibilityLabel}
    </p>
  );
}

/** A rounded stand in until the client supplies the per office map embed. */
export function LocationMapPlaceholder({ name }: { name: string }) {
  return (
    <div className="location-map" aria-hidden="true">
      <Needs value={`Google Maps embed for ${name}`} />
    </div>
  );
}

/** Sheet sentences can carry their own inline [NEEDS] marker. */
function WithNeeds({ text }: { text: string }) {
  const parts = text.split(/(\[NEEDS:?[^\]]*\])/g).filter(Boolean);

  return (
    <>
      {parts.map((part, position) => {
        const marker = /^\[NEEDS:?([^\]]*)\]$/.exec(part);
        return (
          <Fragment key={position}>
            {marker ? <Needs value={marker[1].trim()} /> : part}
          </Fragment>
        );
      })}
    </>
  );
}

/** Same contract as the renderer's marker: visible in dev, inert in production. */
function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span data-needs={value} hidden />;
  }
  return <mark className="needs">[NEEDS: {value}]</mark>;
}
