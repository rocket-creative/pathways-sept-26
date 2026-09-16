import Link from "next/link";
import { getPageByUrl } from "@/lib/content";

/** OWNER: site chrome agent. Visible breadcrumbs on every page below the header. */
export default function Breadcrumbs({ url, title }: { url: string; title: string }) {
  if (url === "/") return null;

  const segments = url.split("/").filter(Boolean);
  const trail = segments.map((_, position) => {
    const href = `/${segments.slice(0, position + 1).join("/")}`;
    const page = getPageByUrl(href);
    return { href, label: page?.frontMatter.h1 ?? title };
  });

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {trail.map((crumb, position) => (
          <li key={crumb.href}>
            {position === trail.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <Link href={crumb.href}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
