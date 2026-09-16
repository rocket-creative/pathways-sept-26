import "./backdrop.css";

/**
 * The fixed labyrinth backdrop for every page except the homepage, which has
 * the branch hero instead. Two layers: the image, then a white veil that keeps
 * the glass panels above it legible wherever the photograph runs dark.
 *
 * Rendered as a fixed element rather than `background-attachment: fixed`,
 * which stutters badly on iOS and forces a repaint on every scroll frame.
 */
export default function PageBackdrop() {
  return <div className="page-backdrop" aria-hidden="true" />;
}
