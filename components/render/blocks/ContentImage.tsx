import type { Block } from "@/lib/content";

/**
 * Some `[IMAGE:]` markers carry an old Squarespace URL, most do not. With a
 * src we render the image at a reserved box; without one we render the neutral
 * rounded placeholder, and only development sees the alt text as a caption.
 *
 * The intrinsic size is a stand in: the markers give no dimensions, and final
 * imagery comes from the client's Dropbox and the Rockville Centre shoot.
 */
const PLACEHOLDER_WIDTH = 1200;
const PLACEHOLDER_HEIGHT = 800;

export default function ContentImage({ block }: { block: Extract<Block, { kind: "image" }> }) {
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
