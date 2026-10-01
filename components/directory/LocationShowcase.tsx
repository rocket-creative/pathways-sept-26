import Link from "next/link";
import { resolvePhoto, type Photo } from "@/lib/images";
import { getLocationCards } from "@/lib/locations";
import type { OfficePhoto } from "./OfficeCrossfade";
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
      { asset: "pr-ap-gc-therapy-joy", alt: "Therapy room at the Garden City office with a Today I Choose Joy sign" },
      { asset: "pr-ap-gc-group-sofas", alt: "Group seating at the Garden City office" },
      { asset: "pr-ap-gc-session-chair", alt: "Therapy room at the Garden City office with a charcoal armchair and a writing desk" },
      { asset: "pr-ap-gc-wellness-reception", alt: "Wellness reception at the Garden City office" },
      { asset: "pr-ap-gc-wellness-navy", alt: "Navy velvet chairs in the Garden City wellness waiting room" },
      { asset: "pr-ap-gc-wellness-table", alt: "Treatment table in a calm green room at the Garden City wellness suite" },
    ],
  },
  massapequa: {
    services: "Therapy and medication management",
    photos: [
      { asset: "pr-ap-mpq-sunflower", alt: "Sunflower seating at the Massapequa office" },
      { asset: "pr-ap-mpq-underwater", alt: "Therapy room at the Massapequa office with an underwater mural" },
      { asset: "pr-ap-mpq-mandala-chair", alt: "Therapy room at the Massapequa office" },
      { asset: "pr-ap-mpq-hallway", alt: "Hallway at the Massapequa office" },
      { asset: "pr-ap-mpq-child-waiting", alt: "Children's waiting corner at the Massapequa office with unicorn and elephant paintings" },
      { asset: "pr-ap-mpq-wellness-boutique", alt: "Wellness waiting area at the Massapequa office" },
      { asset: "pr-ap-mpq-wellness-table", alt: "Treatment room at the Massapequa wellness suite" },
      { asset: "pr-ap-mpq-wellness-chairs", alt: "Two pale green chairs in a quiet room at the Massapequa wellness suite" },
    ],
  },
  smithtown: {
    services: "Therapy, medication management, and wellness",
    photos: [
      { asset: "pr-ap-smt-waiting", alt: "Waiting room at the Smithtown office" },
      { asset: "pr-ap-smt-plants-room", alt: "Therapy room with plants at the Smithtown office" },
      { asset: "pr-ap-smt-therapy-window", alt: "Therapy room at the Smithtown office with a window overlooking trees" },
      { asset: "pr-ap-smt-wingback", alt: "Therapy room at the Smithtown office with a wingback chair" },
      { asset: "pr-ap-smt-blue-room", alt: "Therapy room at the Smithtown office with a sofa, a black chair, and a window" },
      { asset: "pr-ap-smt-labyrinth-sign", alt: "Wooden Pathways Within labyrinth sign on the wall at the Smithtown office" },
      { asset: "pr-ap-smt-wellness-table", alt: "Massage room at the Smithtown office with a beach mural" },
      { asset: "pr-ap-smt-beach-table", alt: "Massage table beside a beach mural at the Smithtown wellness suite" },
      { asset: "pr-ap-smt-turtle-room", alt: "Waiting chairs with a sea-turtle pattern at the Smithtown wellness suite" },
      { asset: "pr-ap-smt-dreamcatcher", alt: "Therapy room at the Smithtown office with a dreamcatcher and a white lounge chair" },
      { asset: "pr-ap-smt-blue-sofa", alt: "Therapy room at the Smithtown office with a black sofa and a blue rug" },
    ],
  },
  "port-jefferson": {
    services: "Therapy",
    photos: [
      { asset: "pr-ap-pj-teal-room", alt: "Therapy room at the Port Jefferson office" },
      { asset: "pr-ap-pj-hallway", alt: "Hallway at the Port Jefferson office" },
      { asset: "pr-ap-pj-hope-seating", alt: "Seating at the Port Jefferson office" },
      { asset: "pr-ap-pj-wood-clock", alt: "Round wall clock on a wood-plank wall at the Port Jefferson office" },
      { asset: "pr-ap-pj-pink-room", alt: "Therapy room at the Port Jefferson office with a beige sofa, a palm, and a round window" },
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
        focal: resolved.focal,
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
            {photos.length ? (
              <div className="office-bento">
                {photos.map((photo, index) => (
                  <figure
                    key={photo.src}
                    className={index === 0 ? "office-bento__cell office-bento__cell--lead" : "office-bento__cell"}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      srcSet={photo.srcSet}
                      sizes={index === 0 ? "(max-width: 720px) 70vw, 18rem" : "(max-width: 720px) 30vw, 8rem"}
                      width={photo.width}
                      height={photo.height}
                      alt={photo.alt}
                      decoding="async"
                      style={{ objectPosition: photo.focal }}
                    />
                  </figure>
                ))}
              </div>
            ) : null}
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
