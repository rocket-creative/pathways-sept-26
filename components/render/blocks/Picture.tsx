import type { CSSProperties } from "react";
import type { ResolvedPhoto } from "@/lib/images";

/**
 * The one <img> every photograph on the site goes through. Width and height
 * hold the layout before the bytes arrive, the srcset lets the browser pick a
 * tier for its own viewport and pixel ratio, and the focal point drives
 * object-position so a cover crop never loses the subject.
 *
 * next/image is not used: the site is a static export with images.unoptimized,
 * and the tiers are already cut by scripts/build-images.mts.
 */
export default function Picture({
  photo,
  sizes,
  className,
  priority = false,
  style,
}: {
  photo: ResolvedPhoto;
  /** The sizes attribute: how wide the slot is at each breakpoint. */
  sizes: string;
  className?: string;
  /** Above the fold: eager, high fetch priority. Everything else lazy loads. */
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={{ objectPosition: photo.focal, ...style }}
    />
  );
}
