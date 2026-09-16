import { getProviders } from "@/lib/content";
import ProviderDirectoryClient from "./ProviderDirectoryClient";
import { toProviderCardData } from "./types";
import "./directory.css";

/**
 * The full team directory for /providers. The server renders every active
 * provider, so the list is in the HTML, crawlable, and complete without
 * JavaScript; the filters on top of it are client side.
 *
 * Mount this where content/pages/providers.md carries its [PROVIDER DIRECTORY]
 * marker. Admin rows are split out into their own strip with no profile link.
 */
export default function ProviderDirectory() {
  const active = getProviders().filter((provider) => provider.active);
  const profiles = active.filter((provider) => !provider.isAdmin).map(toProviderCardData);
  const admin = active.filter((provider) => provider.isAdmin).map(toProviderCardData);

  return <ProviderDirectoryClient providers={profiles} admin={admin} />;
}

export { ProviderDirectory };
