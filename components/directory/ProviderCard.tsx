import Link from "next/link";
import type { ProviderCardData } from "./types";

/**
 * One provider card: circular headshot, name, credentials, title line, first
 * bullet, link to the profile. Shared by the sheet driven card lists and the
 * client side directory, so it holds no data loading of its own.
 */
export default function ProviderCard({
  provider,
  hidden = false,
}: {
  provider: ProviderCardData;
  /** Filtered out by the directory. The card stays in the DOM, link intact. */
  hidden?: boolean;
}) {
  return (
    <li className="provider-card" data-slug={provider.slug} hidden={hidden || undefined}>
      <Headshot provider={provider} />
      <p className="provider-card__name">
        {provider.url ? (
          <Link href={provider.url}>{provider.name}</Link>
        ) : (
          <span>{provider.name}</span>
        )}
        {provider.credentials ? (
          <span className="provider-card__credentials">, {provider.credentials}</span>
        ) : null}
      </p>
      {provider.titleLine ? <p className="provider-card__title">{provider.titleLine}</p> : null}
      {provider.bullet ? <p className="provider-card__bullet">{provider.bullet}</p> : null}
    </li>
  );
}

/** Intrinsic size of the square crop. The circle mask is CSS. */
const HEADSHOT_SIZE = 320;

/** The sizes the master prompt asks for. See headshotSrcSet. */
const HEADSHOT_WIDTHS = [320, 640];

/**
 * Local derivatives are named {base}-320.webp and {base}-640.webp. Nothing
 * produces them yet: the sheet still points at remote Squarespace originals,
 * and next.config.ts runs with images.unoptimized, so a remote headshot ships
 * as a single source until the client's Dropbox images land in /images.
 */
function headshotSrcSet(url: string): string | undefined {
  if (!url.startsWith("/images/")) return undefined;
  const base = url.replace(/\.(webp|jpe?g|png)$/i, "");
  return HEADSHOT_WIDTHS.map((width) => `${base}-${width}.webp ${width}w`).join(", ");
}

function Headshot({ provider }: { provider: ProviderCardData }) {
  if (provider.headshot) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="provider-card__photo"
        src={provider.headshot.src}
        srcSet={provider.headshot.srcSet}
        sizes="(min-width: 48rem) 10rem, 7rem"
        alt={`Portrait of ${provider.displayName}`}
        width={HEADSHOT_SIZE}
        height={HEADSHOT_SIZE}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (!provider.headshotUrl) {
    return (
      <span className="provider-card__photo provider-card__initials" aria-hidden="true">
        {provider.initials}
      </span>
    );
  }

  const srcSet = headshotSrcSet(provider.headshotUrl);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="provider-card__photo"
      src={provider.headshotUrl}
      srcSet={srcSet}
      sizes={srcSet ? "(min-width: 48rem) 10rem, 7rem" : undefined}
      alt={`Portrait of ${provider.displayName}`}
      width={HEADSHOT_SIZE}
      height={HEADSHOT_SIZE}
      loading="lazy"
      decoding="async"
    />
  );
}
