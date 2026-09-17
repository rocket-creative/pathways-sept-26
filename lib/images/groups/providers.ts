import type { HeadshotSource } from "@/lib/images/types";

/**
 * Provider headshots, keyed by providers-sheet.csv slug. The build cuts a
 * 320 and a 640 square from each into public/images/providers/{slug}-{w}.webp
 * and ProviderCard / the provider page pick them up over the sheet's remote
 * url. Only rows whose photograph is confirmed belong here; an unconfirmed
 * face is worse than initials.
 *
 * OWNER: home and about curation agent.
 *
 * Confirmed by the old site's HTML alt text and the sheet's headshot urls.
 * Not assigned (unconfirmed): clinicians/Lindsey.jpg (spelling differs from
 * lindsay-laier) and the unlabeled clinicians/Screen Shot*.png, Screenshot*.png,
 * Captura*.png (other than 143639), Facetune*.jpg and IMG_9486.jpg files.
 */
export const HEADSHOTS: HeadshotSource[] = [
  // "attention" drifts to the torso on this frame at some tier sizes; the face sits high, so keep the top.
  { slug: "rachel-lessard", file: "about-us/Rachel+Lessard.JPG", square: "top" },
  { slug: "ksusha-cascio", file: "about-us/Captura+de+pantalla+2026-08-07+144821.png" },
  { slug: "joe-bush", file: "about-us/Captura+de+pantalla+2026-08-07+144948.png" },
  { slug: "lee-wasser", file: "about-us/Captura+de+pantalla+2026-08-07+145117.png", square: "top" },
  { slug: "tia-baumohl", file: "clinicians/Captura+de+pantalla+2026-08-06+143639.png" },
  { slug: "tiffany-roberts", file: "clinicians/Tiffany+Roberts_+Nurse+Practitioner_+Med+Management.png" },
  { slug: "anna-ostrow", file: "clinicians/Anna+Ostrow_+MHC-LP.png", square: "top" },
  { slug: "charity-meyer", file: "clinicians/Charity+(Valen)+Meyer_+MFT-LP.png", square: "top" },
  { slug: "nicole-duffy", file: "clinicians/NICOLE+DUFFY_+LMSW.png", square: "top" },
];
