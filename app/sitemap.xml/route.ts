import { sitemapIndexXml, xmlResponse } from "@/app/sitemap-shared";

export const dynamic = "force-static";

export function GET(): Response {
  return xmlResponse(sitemapIndexXml());
}
