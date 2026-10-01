import Link from "next/link";
import { resolvePhoto, type Photo } from "@/lib/images";
import { getLocationCards } from "@/lib/locations";
import OfficeCrossfade, { type OfficePhoto } from "./OfficeCrossfade";
import "./office-stages.css";

/** Current-office frames already in the approved set. Closed suites are not in this list. */
const STAGES: Record<string, { services: string; photos: Photo[] }> = {
  /* Closed office: the card stays, without photographs of the old suite. */
  "rockville-centre": {
    services: "Therapy, medication management, and wellness",
    photos: [],
  },
  "garden-city": {
    services: "Therapy, medication management, and wellness",
    photos: [
      { asset: "pr-ap-gc-flower-wall", alt: "Waiting area at the Garden City office with a white flower wall" },
      { asset: "pr-ap-gc-waiting-doors", alt: "Waiting nook at the Garden City office" },
      { asset: "pr-ap-gc-wellness-reception", alt: "Wellness reception at the Garden City office" },
    ],
  },
  massapequa: {
    services: "Therapy and medication management",
    photos: [
      { asset: "pr-ap-mpq-sunflower", alt: "Sunflower seating at the Massapequa office" },
      { asset: "pr-ap-mpq-underwater", alt: "Therapy room at the Massapequa office with an underwater mural" },
      { asset: "pr-ap-mpq-mandala-chair", alt: "Therapy room at the Massapequa office" },
    ],
  },
  smithtown: {
    services: "Therapy, medication management, and wellness",
    photos: [
      { asset: "pr-ap-smt-waiting", alt: "Waiting room at the Smithtown office" },
      { asset: "pr-ap-smt-plants-room", alt: "Therapy room with plants at the Smithtown office" },
      { asset: "pr-ap-smt-therapy-window", alt: "Therapy room at the Smithtown office with a window overlooking trees" },
    ],
  },
  "port-jefferson": {
    services: "Therapy",
    photos: [
      { asset: "pr-ap-pj-teal-room", alt: "Therapy room at the Port Jefferson office" },
      { asset: "pr-ap-pj-hallway", alt: "Hallway at the Port Jefferson office" },
      { asset: "pr-ap-pj-hope-seating", alt: "Seating at the Port Jefferson office" },
    ],
  },
};

function builtPhotos(photos: Photo[]): OfficePhoto[] {
  return photos.flatMap((photo) => {
    const resolved = resolvePhoto(photo);
    if (!resolved) return [];
    return [
      {
        src: resolved.src,
        srcSet: resolved.srcSet,
        width: resolved.width,
        height: resolved.height,
        alt: resolved.alt,
      },
    ];
  });
}

/** One visual block per current office: photos, address, services, access, and a next step. */
export default function LocationShowcase({ slugs }: { slugs: string[] }) {
  const cards = getLocationCards(slugs);

  return (
    <div className="office-stages">
      {cards.map((card) => {
        const stage = STAGES[card.slug];
        const photos = builtPhotos(stage?.photos ?? []);
        return (
          <article key={card.slug} className="office-stage">
            {photos.length ? <OfficeCrossfade photos={photos} /> : null}
            <div className="office-stage__copy">
              <h3 className="office-stage__name">
                <Link href={card.url}>{card.name.replace(/^Pathways Within /, "")}</Link>
              </h3>
              <address className="office-stage__address">{card.addressLine}</address>
              {stage ? <p className="office-stage__services">{stage.services}</p> : null}
              {card.accessibilityLabel ? <p className="office-stage__access">{card.accessibilityLabel}</p> : null}
              <p className="office-stage__next">
                <Link href="/contact#send-a-message">Contact Us</Link>
                <span aria-hidden="true"> · </span>
                <Link href={card.url}>Office details</Link>
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
