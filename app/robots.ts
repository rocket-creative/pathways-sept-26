import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/content";

export const dynamic = "force-static";

/**
 * Every crawler is allowed, AI crawlers included: no GPTBot, CCBot,
 * ClaudeBot, or Google-Extended blocks, per MASTER-PROMPT section 8. The one
 * hidden page (IV vitamin therapy) is held back with `noindex, nofollow` and by
 * being absent from the sitemaps, not by a Disallow, so crawlers can see the
 * directive.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
