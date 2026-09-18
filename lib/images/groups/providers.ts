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
 * Every row is confirmed. The first nine came from the old site's HTML alt
 * text and the sheet's headshot urls. The unlabeled clinicians/Screen Shot*,
 * Screenshot*, Captura*, Lindsey.jpg and IMG_9486.jpg files were mapped from
 * the live Squarespace clinicians page HTML (fetched 2026-09-18), where each
 * image sits directly above the person's name and bio. The wellness-team/*
 * files were downloaded from the sheet's headshot_url column (WebP data
 * regardless of the original extension). Rows follow sheet order.
 *
 * Not assigned: clinicians/Facetune_26-06-2025-14-57-41.jpg is Gloria
 * Saladino (admin, directory listing only, no provider page).
 */
export const HEADSHOTS: HeadshotSource[] = [
  // "attention" drifts to the torso on this frame at some tier sizes; the face sits high, so keep the top.
  { slug: "rachel-lessard", file: "about-us/Rachel+Lessard.JPG", square: "top" },
  { slug: "ksusha-cascio", file: "about-us/Captura+de+pantalla+2026-08-07+144821.png" },
  { slug: "joe-bush", file: "about-us/Captura+de+pantalla+2026-08-07+144948.png" },
  { slug: "lee-wasser", file: "about-us/Captura+de+pantalla+2026-08-07+145117.png", square: "top" },
  { slug: "kaitlyn-kelly", file: "clinicians/Screenshot+2023-03-27+at+2.53.33+PM.png" },
  { slug: "laura-desilva", file: "clinicians/Screenshot+2023-08-31+at+12.54.39+PM.png" },
  { slug: "samantha-juravich", file: "clinicians/Screen+Shot+2022-02-22+at+11.07.14+AM.png" },
  { slug: "beth-gabellini", file: "clinicians/Screen+Shot+2021-11-18+at+9.50.38+AM.png" },
  { slug: "carly-sandstrom", file: "clinicians/Screenshot+2023-09-22+at+8.32.41+AM.png" },
  { slug: "jen-brooks", file: "clinicians/Screen+Shot+2021-11-18+at+10.28.51+AM.png" },
  // IMG_9486.jpg is a square full body shot; the -portrait file is a head and shoulders crop of it.
  { slug: "lauren-hollander", file: "clinicians/IMG_9486-portrait.jpg", square: "center" },
  { slug: "paula-gonthier", file: "clinicians/Screen+Shot+2021-11-18+at+11.15.42+AM.png" },
  { slug: "anna-ostrow", file: "clinicians/Anna+Ostrow_+MHC-LP.png", square: "top" },
  { slug: "charity-meyer", file: "clinicians/Charity+(Valen)+Meyer_+MFT-LP.png", square: "top" },
  // Tall phone screenshot; "attention" and "top" both clip the chin, "center" loses only the hairline.
  { slug: "chelsea-bell", file: "clinicians/Screenshot+2022-12-16+at+6.10.26+PM.png", square: "center" },
  { slug: "frank-tropeano", file: "clinicians/Screenshot+2024-06-07+at+12.02.48+PM.png" },
  { slug: "juliette-squicciarini", file: "clinicians/Screenshot+2024-10-23+102321.png" },
  { slug: "kathleen-dimartino", file: "clinicians/Screenshot+2023-06-05+at+10.50.51+AM.png" },
  { slug: "lindsay-laier", file: "clinicians/Lindsey.jpg" },
  { slug: "maddy-zambri", file: "clinicians/Screenshot+2023-09-06+073548.png" },
  { slug: "mariah-simone", file: "clinicians/Screenshot+2024-06-25+110648.png" },
  { slug: "nicole-duffy", file: "clinicians/NICOLE+DUFFY_+LMSW.png", square: "top" },
  { slug: "kalovna-edmond", file: "clinicians/Captura+de+pantalla+2026-08-07+165910.png" },
  { slug: "madeline-amzler", file: "clinicians/Captura+de+pantalla+2026-08-07+170144.png" },
  { slug: "sofia-marinucci", file: "clinicians/Captura+de+pantalla+2026-08-07+170333.png" },
  { slug: "colm-ashe", file: "clinicians/Captura+de+pantalla+2026-08-07+170455.png" },
  { slug: "karen-hill", file: "clinicians/Captura+de+pantalla+2026-08-07+170627.png" },
  { slug: "tia-baumohl", file: "clinicians/Captura+de+pantalla+2026-08-06+143639.png" },
  { slug: "tiffany-roberts", file: "clinicians/Tiffany+Roberts_+Nurse+Practitioner_+Med+Management.png" },
  { slug: "christine-cervo", file: "wellness-team/Christine+Cervo+LMT.webp" },
  { slug: "danielle-ingenito", file: "wellness-team/Danielle+Ingenito+LMT.webp" },
  { slug: "leonard-ma", file: "wellness-team/Leonard+Ma+LAc.webp" },
];
