import Link from "next/link";
import { getPageByUrl, type Crumb as AuthoredCrumb } from "@/lib/content";
import { getProviderPage } from "@/lib/providers";
import "./site-chrome.css";

/**
 * Visible breadcrumbs on every page. No BreadcrumbList JSON LD here: every
 * page file already carries its own, per SPEC section 6.
 */

/** Segments that are shorthand in a URL but read as initialisms in a label. */
const INITIALISMS = new Map<string, string>([
  ["adhd", "ADHD"],
  ["emdr", "EMDR"],
  ["faq", "FAQ"],
  ["ifs", "IFS"],
  ["iet", "IET"],
  ["iv", "IV"],
  ["lgbtqia", "LGBTQIA"],
  ["nyship", "NYSHIP"],
  ["ocd", "OCD"],
  ["pcit", "PCIT"],
  ["ptsd", "PTSD"],
  ["umr", "UMR"],
  ["va", "VA"],
]);

const MINOR_WORDS = new Set(["a", "and", "at", "for", "in", "of", "or", "the", "to", "with"]);

/** Fallback label for a path segment that has no page of its own. */
function titleCase(segment: string): string {
  return segment
    .split("-")
    .map((word, position) => {
      const initialism = INITIALISMS.get(word);
      if (initialism) return initialism;
      if (position > 0 && MINOR_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

type Crumb = { href: string; label: string; isLink: boolean };

export default function Breadcrumbs({
  url,
  title,
  authored,
}: {
  url: string;
  title: string;
  /** The page's own BreadcrumbList trail, when it has one. */
  authored?: AuthoredCrumb[];
}) {
  if (url === "/") return null;

  const trail = authored?.length ? fromAuthored(authored) : fromUrl(url, title);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {trail.map((crumb, position) => (
          <li key={crumb.href}>
            <span className="breadcrumbs__sep" aria-hidden="true">
              /
            </span>
            {position === trail.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : crumb.isLink ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The authored trail already drops the geo phrase from labels and points
 * /insurance/aetna at /insurance-and-fees, so it wins wherever it exists. Its
 * leading "Home" crumb is dropped because the list above always renders one.
 */
function fromAuthored(authored: AuthoredCrumb[]): Crumb[] {
  return authored
    .filter((crumb) => crumb.url !== "/")
    .map((crumb) => ({
      href: crumb.url ?? "",
      label: crumb.name,
      isLink: Boolean(crumb.url),
    }));
}

/** Only reached by sheet driven provider profiles, which author no trail. */
function fromUrl(url: string, title: string): Crumb[] {
  const segments = url.split("/").filter(Boolean);

  return segments.map((segment, position) => {
    const href = `/${segments.slice(0, position + 1).join("/")}`;
    if (position === segments.length - 1) return { href, label: title, isLink: false };

    // A parent segment such as /insurance has no page of its own, so it is a
    // plain label: linking it would point at a URL the export never emits.
    const page = getPageByUrl(href) ?? getProviderPage(href);
    return {
      href,
      label: page?.frontMatter.h1 ?? titleCase(segment),
      isLink: Boolean(page),
    };
  });
}
