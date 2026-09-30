import { getProviders, type Provider } from "@/lib/content";
import { resolvePhoto } from "@/lib/images";
import { pickFillPhoto } from "./fillPhoto";
import ProviderDirectoryClient from "./ProviderDirectoryClient";
import { toProviderCardData, type ProviderCardData } from "./types";
import "./directory.css";

/**
 * The full team directory for /providers. The server renders every active
 * provider, including specialized care, so the list is in the HTML, crawlable, and complete without
 * JavaScript; the filters on top of it are client side.
 *
 * Mount this where content/pages/providers.md carries its [PROVIDER DIRECTORY]
 * marker. Admin rows are split out into their own strip with no profile link.
 */
export default function ProviderDirectory() {
  const active = getProviders().filter((provider) => provider.active);
  const profiles = active
    .filter((provider) => !provider.isAdmin && !provider.isFounder)
    .map(toProviderCardData);
  const admin = active.filter((provider) => provider.isAdmin).map(toAdminCard);
  // Resolved here, where the photo registry is, and handed down as plain data:
  // the client works out how many cells it spans from the filtered count.
  const fill = pickFillPhoto("providers", "directory");

  return <ProviderDirectoryClient providers={profiles} admin={admin} fill={fill} />;
}

/** Gloria's welcome-desk portrait. Other admin rows stay name-only until they have one. */
function toAdminCard(provider: Provider): ProviderCardData {
  const card = toProviderCardData(provider);
  if (provider.slug !== "gloria-saladino") return card;
  const photo = resolvePhoto({
    asset: "ha-gloria-saladino",
    alt: "Portrait of Gloria Saladino",
    focal: "center top",
  });
  if (!photo) return card;
  return {
    ...card,
    portrait: { src: photo.src, srcSet: photo.srcSet, width: photo.width, height: photo.height },
  };
}

export { ProviderDirectory };
