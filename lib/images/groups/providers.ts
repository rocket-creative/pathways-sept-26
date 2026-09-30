import type { HeadshotSource } from "@/lib/images/types";

/**
 * Provider headshots, keyed by providers-sheet.csv slug. The build cuts a
 * 320 and a 640 square from each into public/images/providers/{slug}-{w}.webp
 * and ProviderCard / the provider page pick them up over the sheet's remote
 * url. Only rows whose photograph is confirmed belong here; an unconfirmed
 * face is worse than initials.
 *
 * OWNER: Agent ASSETS (approved photographer headshots).
 *
 * Preferred source: approved/headshots/{slug}.jpg from the curated photographer
 * export (see lib/images/approved-manifest.json).
 *
 * Square crop is "top" for approved frames: they are mid-body studio portraits,
 * and sharp's "attention" strategy drifts to torso/tattoo detail and clips faces.
 * Fallback Squarespace screenshots keep the default (attention) unless noted.
 *
 * Gloria Saladino is Admin (directory listing only, no provider page) but has
 * a card on /providers, so she is included.
 */
export const HEADSHOTS: HeadshotSource[] = [
  // Approved photographer headshots — face sits high; keep the top of the frame.
  { slug: "rachel-lessard", file: "approved/headshots/rachel-lessard.jpg", square: "top" },
  { slug: "ksusha-cascio", file: "approved/headshots/ksusha-cascio.jpg", square: "top" },
  { slug: "joe-bush", file: "approved/headshots/joe-bush.jpg", square: "top" },
  { slug: "lee-wasser", file: "approved/headshots/lee-wasser.jpg", square: "top" },
  { slug: "kaitlyn-kelly", file: "approved/headshots/kaitlyn-kelly.jpg", square: "top" },
  { slug: "laura-desilva", file: "approved/headshots/laura-desilva.jpg", square: "top" },
  { slug: "beth-gabellini", file: "approved/headshots/beth-gabellini.jpg", square: "top" },
  { slug: "carly-sandstrom", file: "approved/headshots/carly-sandstrom.jpg", square: "top" },
  { slug: "jen-brooks", file: "approved/headshots/jen-brooks.jpg", square: "top" },
  { slug: "lauren-hollander", file: "approved/headshots/lauren-hollander.jpg", square: "top" },
  { slug: "paula-gonthier", file: "approved/headshots/paula-gonthier.jpg", square: "top" },
  { slug: "anna-ostrow", file: "approved/headshots/anna-ostrow.jpg", square: "top" },
  { slug: "charity-meyer", file: "approved/headshots/charity-meyer.jpg", square: "top" },
  { slug: "chelsea-bell", file: "approved/headshots/chelsea-bell.jpg", square: "top" },
  { slug: "frank-tropeano", file: "approved/headshots/frank-tropeano.jpg", square: "top" },
  { slug: "juliette-squicciarini", file: "approved/headshots/juliette-squicciarini.jpg", square: "top" },
  { slug: "kathleen-dimartino", file: "approved/headshots/kathleen-dimartino.jpg", square: "top" },
  { slug: "lindsay-laier", file: "approved/headshots/lindsay-laier.jpg", square: "top" },
  { slug: "maddy-zambri", file: "approved/headshots/maddy-zambri.jpg", square: "top" },
  { slug: "mariah-simone", file: "approved/headshots/mariah-simone.jpg", square: "top" },
  { slug: "nicole-duffy", file: "approved/headshots/nicole-duffy.jpg", square: "top" },
  { slug: "kalovna-edmond", file: "approved/headshots/kalovna-edmond.jpg", square: "top" },
  { slug: "tia-baumohl", file: "approved/headshots/tia-baumohl.jpg", square: "top" },
  { slug: "christine-cervo", file: "approved/headshots/christine-cervo.jpg", square: "top" },
  { slug: "leonard-ma", file: "approved/headshots/leonard-ma.jpg", square: "top" },
  // Admin directory card on /providers (no provider page)
  { slug: "gloria-saladino", file: "approved/headshots/gloria-saladino.jpg", square: "top" },

  // Lifestyle portraits supplied for the cards that were still on older frames.
  { slug: "madeline-amzler", file: "approved/headshots/madeline-amzler.jpg", square: "top" },
  { slug: "sofia-marinucci", file: "approved/headshots/sofia-marinucci.jpg", square: "top" },
  { slug: "karen-hill", file: "approved/headshots/karen-hill.jpg", square: "top" },
  { slug: "tiffany-roberts", file: "approved/headshots/tiffany-roberts.jpg", square: "top" },

  { slug: "samantha-juravich", file: "approved/headshots/samantha-juravich.jpg", square: "top" },
  { slug: "danielle-ingenito", file: "approved/headshots/danielle-ingenito.jpg", square: "top" },
  { slug: "colm-ashe", file: "approved/headshots/colm-ashe.jpg", square: "top" },
];
