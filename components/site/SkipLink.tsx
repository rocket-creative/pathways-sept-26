import "./site-chrome.css";

/** Off screen until focused, then pinned to the top of the viewport. */
export default function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to main content
    </a>
  );
}
