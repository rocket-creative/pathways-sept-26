import { LABYRINTH } from "@/lib/backdropImage";
import "./backdrop.css";

/**
 * The fixed labyrinth backdrop for every page except the homepage, which has
 * the branch hero instead (and shows this same photograph as image 2 after
 * the hero hands off). The photograph is shown whole, never cropped, on its
 * own sky grey.
 *
 * A real <img> with a srcset rather than a CSS background-image, so the
 * browser fetches exactly one tier sized to the viewport and device pixel
 * ratio (image-set() cannot select by width). Rendered as a fixed element
 * rather than `background-attachment: fixed`, which stutters badly on iOS
 * and forces a repaint on every scroll frame.
 */
export default function PageBackdrop() {
  return (
    <div className="page-backdrop" aria-hidden="true">
      <picture>
        <source type="image/webp" srcSet={LABYRINTH.srcSet} sizes={LABYRINTH.sizes} />
        <img
          className="page-backdrop__img"
          src={LABYRINTH.fallback}
          width={LABYRINTH.width}
          height={LABYRINTH.height}
          alt=""
          decoding="async"
        />
      </picture>
    </div>
  );
}
