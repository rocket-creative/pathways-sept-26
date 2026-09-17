import type { Block } from "@/lib/content";
import { resolveHeadshot } from "@/lib/images";
import type { RenderContext } from "../context";
import Picture from "./Picture";

/**
 * `[IMAGE: alt]` in the copy. Resolution order:
 *
 *  1. On a provider page, a locally built headshot for that provider renders
 *     as the circular portrait the design calls for.
 *  2. A photograph the registry mapped to this marker (ctx.inlinePhotos).
 *  3. A marker that carries its own src (old Squarespace url) renders it at a
 *     reserved box.
 *  4. Otherwise the neutral rounded placeholder, alt as a caption in dev only.
 *
 * The intrinsic size on 3 is a stand in: those markers give no dimensions.
 */
const PLACEHOLDER_WIDTH = 1200;
const PLACEHOLDER_HEIGHT = 800;

type ImageBlock = Extract<Block, { kind: "image" }>;

export default function ContentImage({ block, ctx }: { block: ImageBlock; ctx?: RenderContext }) {
  const providerSlug = ctx ? /^\/providers\/([a-z0-9-]+)$/.exec(ctx.url)?.[1] : undefined;
  const headshot = providerSlug ? resolveHeadshot(providerSlug) : undefined;
  if (headshot) {
    return (
      <figure className="content-image content-image--portrait">
        <Picture
          photo={{ ...headshot, alt: block.alt }}
          className="content-image__img content-image__img--portrait"
          sizes="(min-width: 900px) 14rem, 11rem"
          priority
        />
      </figure>
    );
  }

  const mapped = ctx?.inlinePhotos?.get(block);
  if (mapped) {
    return (
      <figure className="content-image">
        <Picture
          photo={{ ...mapped, alt: block.alt }}
          className="content-image__img"
          sizes="(min-width: 1200px) 720px, (min-width: 900px) 60vw, 100vw"
        />
      </figure>
    );
  }

  if (block.src) {
    return (
      <figure className="content-image">
        {/* next/image cannot take arbitrary remote hosts under output: export. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="content-image__img"
          src={block.src}
          alt={block.alt}
          width={PLACEHOLDER_WIDTH}
          height={PLACEHOLDER_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      </figure>
    );
  }

  return (
    <figure className="content-image content-image--placeholder">
      <div
        className="content-image__placeholder"
        role="img"
        aria-label={block.alt}
        style={{ aspectRatio: `${PLACEHOLDER_WIDTH} / ${PLACEHOLDER_HEIGHT}` }}
      />
      {process.env.NODE_ENV === "production" ? null : (
        <figcaption className="content-image__caption">{block.alt}</figcaption>
      )}
    </figure>
  );
}
