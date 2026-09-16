/**
 * Site constants, free of any Node dependency.
 *
 * lib/content.ts reads the filesystem, so a client component that imports it
 * fails the webpack build with an unhandled "node:" scheme. Anything a client
 * component needs lives here instead. lib/content.ts re-exports all of it, so
 * server code can keep importing from either place.
 */
export const SITE_ORIGIN = "https://pathwayswithinwellness.com";
export const SITE_PHONE = "(631) 371-3825";
export const SITE_PHONE_HREF = "tel:+16313713825";
export const WELCOME_EMAIL = "Welcome@pathwayswithin.com";

export const FORM_EMBEDS = {
  therapy: "https://link.trustdrivencare.com/widget/form/5KmXtKKPzphbLJSdq4Ym",
  wellness: "https://link.trustdrivencare.com/widget/form/pZyZ5b0IMxCN6FcJq4pF",
} as const;

export type FormVariant = keyof typeof FORM_EMBEDS;
