import { getProviders } from "@/lib/content";
import { resolveHeadshot, resolvePhoto, type ResolvedPhoto } from "@/lib/images";

/**
 * Photographs that fill the open part of a text card: a rounded bento of
 * approved office rooms and April session portraits, chosen for the service
 * on that page. Trust pages stay empty. A provider bio gets that person's
 * headshot instead of a room.
 *
 * Heading text is only used to match a name. The copy itself is never read.
 */

export type CardFill =
  | { kind: "bento"; photos: ResolvedPhoto[] }
  | { kind: "portrait"; photo: ResolvedPhoto };

type Shot = { asset: string; alt: string };

const SESSION: Shot[] = [
  { asset: "th-ap26-green-vest", alt: "A therapist in a green vest talking with a client on a blue sofa" },
  { asset: "th-ap26-green-quiet", alt: "A therapist in a green vest listening during a session" },
  { asset: "th-ap26-conversation", alt: "A therapist and client in conversation on blue sofas" },
  { asset: "th-ap26-seated", alt: "A client sitting calmly on a blue sofa across from a therapist" },
  { asset: "th-ap26-green-listen", alt: "A therapist listening while a client talks from a blue sofa" },
];

const COUPLES: Shot[] = [
  { asset: "th-ap26-couple", alt: "A couple talking with a therapist in a Pathways Within office" },
  { asset: "th-ap26-green-couple", alt: "A therapist in a green vest meeting with a couple" },
  { asset: "th-ap26-two-women", alt: "Two women sitting together on a blue sofa across from a therapist" },
  { asset: "th-ap26-hands", alt: "Three people leaning in together during a couples session" },
  { asset: "th-ap26-glasses", alt: "A couple talking together on a blue sofa during a session" },
  { asset: "th-ap26-older-couple", alt: "An older couple talking with a therapist in a quiet office" },
];

const FAMILY: Shot[] = [
  { asset: "th-ap26-fam-four", alt: "A family of four talking with a therapist" },
  { asset: "th-ap26-fam-child", alt: "A parent with a young child on their lap during a family session" },
  { asset: "th-ap26-fam-two", alt: "Two adults sitting with a therapist on a blue sofa" },
  { asset: "th-ap26-fam-end", alt: "A family seated together on a blue sofa" },
  { asset: "th-ap26-fam-behind", alt: "A family on a blue sofa, seen past the therapist sitting with them" },
];

const KIDS: Shot[] = [
  { asset: "th-ap26-kids-three", alt: "Three children sitting on a blue sofa across from a therapist" },
  { asset: "th-ap26-kids-point", alt: "A child pointing while talking with a therapist" },
  { asset: "th-ap26-kids-stand", alt: "Children on a blue sofa during a session" },
  { asset: "th-ap26-kids-toy", alt: "A child holding a stuffed animal during a therapy session" },
  { asset: "pr-ap-mpq-child-waiting", alt: "Children's waiting corner at the Massapequa office" },
];

const GROUP: Shot[] = [
  { asset: "th-ap26-group-couch", alt: "A group sitting with a therapist on a blue sofa" },
  { asset: "th-ap26-group-floor", alt: "A group sitting in a circle on the floor of a therapy office" },
  { asset: "th-ap26-group-gesture", alt: "A therapist gesturing while a group sits together" },
  { asset: "th-ap26-group-play", alt: "A group laughing together on the floor of a therapy office" },
];

const TEEN: Shot[] = [
  { asset: "th-ap26-teen", alt: "A teenager talking with a parent and a practitioner" },
  { asset: "cw-ap26-med-teen", alt: "A parent and teenager talking with a practitioner" },
  { asset: "th-ap26-fam-two", alt: "A parent and a young adult sitting with a therapist" },
  { asset: "th-ap26-conversation", alt: "A therapist and client in conversation on blue sofas" },
];

const QUIET: Shot[] = [
  { asset: "th-ap26-seated", alt: "A client sitting calmly on a blue sofa across from a therapist" },
  { asset: "th-ap26-across", alt: "Two people talking quietly across a blue sofa" },
  { asset: "th-ap26-resting", alt: "A client resting on a blue sofa while a therapist sits nearby" },
  { asset: "th-ap26-older-quiet", alt: "A client sitting quietly with a therapist in a sunlit office" },
  { asset: "th-ap26-black-blazer", alt: "A client talking with a therapist in a calm office" },
];

const MED: Shot[] = [
  { asset: "cw-ap26-med-single", alt: "A practitioner talking with one client in a Pathways Within office" },
  { asset: "cw-ap26-med-np", alt: "A psychiatric nurse practitioner talking with a colleague" },
  { asset: "cw-ap26-med-couples", alt: "A practitioner talking with a couple in a Pathways Within office" },
  { asset: "cw-ap26-hands", alt: "A care team seated together, cropped to their hands and laps" },
  { asset: "cw-ap26-med-teen", alt: "A parent and teenager talking with a practitioner" },
];

const MASSAGE: Shot[] = [
  { asset: "cw-ap-massage-session", alt: "A massage therapist working with a client beside a beach mural" },
  { asset: "pr-ap-smt-beach-table", alt: "Massage table beside a beach mural at the Smithtown wellness suite" },
  { asset: "pr-ap-smt-wellness-table", alt: "Massage room at the Smithtown office with a beach mural" },
  { asset: "pr-ap-ns-massage-green", alt: "Massage room with a sage-green treatment table and an In Session sign" },
  { asset: "pr-ap-gc-wellness-table", alt: "Treatment table in a calm green room at the Garden City wellness suite" },
  { asset: "cw-ap-treatment-room", alt: "A treatment room prepared for bodywork at Pathways Within" },
];

const ACU: Shot[] = [
  { asset: "cw-ap26-acu-leo", alt: "Leonard Ma, licensed acupuncturist, during a visit" },
  { asset: "cw-ap26-acu-needles", alt: "Acupuncture needles placed along a client's back" },
  { asset: "cw-ap26-acu-shoulder", alt: "Acupuncture needles at a client's shoulder" },
  { asset: "cw-ap-acupuncture-session", alt: "An acupuncture session in a Pathways Within treatment room" },
  { asset: "cw-ap-needle-closeup", alt: "Close view of acupuncture needles during a session" },
  { asset: "cw-ap-shoulder-needles", alt: "Acupuncture needles along a client's shoulder and back" },
];

const ENERGY: Shot[] = [
  { asset: "pr-ap-gc-wellness-table", alt: "Treatment table in a calm green room at the Garden City wellness suite" },
  { asset: "pr-ap-smt-turtle-room", alt: "Quiet waiting chairs at the Smithtown wellness suite" },
  { asset: "pr-ap-ns-massage-green", alt: "A calm treatment room with a sage-green table" },
  { asset: "pr-ap-gc-wellness-navy", alt: "Navy velvet chairs in a Garden City wellness waiting room" },
  { asset: "cw-ap-treatment-room", alt: "A treatment room at Pathways Within" },
];

const DESK: Shot[] = [
  { asset: "ha-ap-front-desk-welcome", alt: "Gloria Saladino at the Smithtown front desk with a visitor" },
  { asset: "ha-ap-front-desk-team", alt: "Gloria Saladino at the Smithtown front desk with a colleague and a visitor" },
  { asset: "ha-ap26-desk-smile", alt: "A member of the Welcome Team smiling at the front desk" },
  { asset: "ha-ap26-desk-handshake", alt: "A visitor being welcomed at the Pathways Within front desk" },
  { asset: "pr-ap-desk-saul-greeting", alt: "Saul Alvarez welcoming a visitor at the front desk" },
  { asset: "pr-ap-desk-logo", alt: "Reception desk with the Pathways Within labyrinth sign" },
];

const ROOMS: Shot[] = [
  { asset: "pr-ap-gc-flower-wall", alt: "Waiting area at the Garden City office with a white flower wall" },
  { asset: "pr-ap-gc-therapy-joy", alt: "Therapy room at the Garden City office" },
  { asset: "pr-ap-mpq-underwater", alt: "Therapy room at the Massapequa office with an underwater mural" },
  { asset: "pr-ap-smt-plants-room", alt: "Therapy room with plants at the Smithtown office" },
  { asset: "pr-ap-pj-teal-room", alt: "Therapy room at the Port Jefferson office" },
  { asset: "pr-ap-smt-dreamcatcher", alt: "Therapy room with a dreamcatcher and a lounge chair" },
  { asset: "pr-ap-pj-pink-room", alt: "Therapy room at the Port Jefferson office with a beige sofa and a palm" },
  { asset: "pr-ap-suffolk-window-chairs", alt: "Therapy room with a window, a sofa, and two armchairs" },
];

const GARDEN: Shot[] = [
  { asset: "pr-ap-gc-flower-wall", alt: "Waiting area at the Garden City office with a white flower wall" },
  { asset: "pr-ap-gc-waiting-doors", alt: "Waiting nook at the Garden City office" },
  { asset: "pr-ap-gc-therapy-joy", alt: "Therapy room at the Garden City office with a Today I Choose Joy sign" },
  { asset: "pr-ap-gc-group-sofas", alt: "Group seating at the Garden City office" },
  { asset: "pr-ap-gc-session-chair", alt: "Therapy room at the Garden City office with a charcoal armchair" },
  { asset: "pr-ap-gc-wellness-navy", alt: "Navy velvet chairs in the Garden City wellness waiting room" },
  { asset: "pr-ap-gc-wellness-table", alt: "Treatment table in the Garden City wellness suite" },
  { asset: "pr-ap-gc-wellness-reception", alt: "Wellness reception at the Garden City office" },
];

const MASSAPEQUA: Shot[] = [
  { asset: "pr-ap-mpq-underwater", alt: "Therapy room at the Massapequa office with an underwater mural" },
  { asset: "pr-ap-mpq-sunflower", alt: "Sunflower seating at the Massapequa office" },
  { asset: "pr-ap-mpq-mandala-chair", alt: "Therapy room at the Massapequa office" },
  { asset: "pr-ap-mpq-hallway", alt: "Hallway at the Massapequa office" },
  { asset: "pr-ap-mpq-child-waiting", alt: "Children's waiting corner at the Massapequa office" },
  { asset: "pr-ap-mpq-wellness-boutique", alt: "Wellness waiting area at the Massapequa office" },
  { asset: "pr-ap-mpq-wellness-table", alt: "Treatment room at the Massapequa wellness suite" },
  { asset: "pr-ap-mpq-wellness-chairs", alt: "Two pale green chairs in the Massapequa wellness suite" },
];

const SMITHTOWN: Shot[] = [
  { asset: "pr-ap-smt-plants-room", alt: "Therapy room with plants at the Smithtown office" },
  { asset: "pr-ap-smt-waiting", alt: "Waiting room at the Smithtown office" },
  { asset: "pr-ap-smt-therapy-window", alt: "Therapy room at the Smithtown office with a window overlooking trees" },
  { asset: "pr-ap-smt-blue-room", alt: "Therapy room at the Smithtown office with a sofa and a window" },
  { asset: "pr-ap-smt-wingback", alt: "Therapy room at the Smithtown office with a wingback chair" },
  { asset: "pr-ap-smt-labyrinth-sign", alt: "Wooden Pathways Within labyrinth sign at the Smithtown office" },
  { asset: "pr-ap-smt-beach-table", alt: "Massage table beside a beach mural at the Smithtown wellness suite" },
  { asset: "pr-ap-smt-turtle-room", alt: "Sea-turtle chairs at the Smithtown wellness suite" },
  { asset: "pr-ap-smt-dreamcatcher", alt: "Therapy room at the Smithtown office with a dreamcatcher" },
  { asset: "pr-ap-smt-blue-sofa", alt: "Therapy room at the Smithtown office with a black sofa" },
];

const PORT_JEFF: Shot[] = [
  { asset: "pr-ap-pj-hallway", alt: "Waiting hallway at the Port Jefferson office" },
  { asset: "pr-ap-pj-teal-room", alt: "Therapy room at the Port Jefferson office with teal seating" },
  { asset: "pr-ap-pj-hope-seating", alt: "Seating at the Port Jefferson office" },
  { asset: "pr-ap-pj-wood-clock", alt: "Round wall clock on a wood-plank wall at the Port Jefferson office" },
  { asset: "pr-ap-pj-pink-room", alt: "Therapy room at the Port Jefferson office with a beige sofa and a palm" },
];

const HOME: Shot[] = [
  SESSION[0],
  FAMILY[1],
  KIDS[0],
  MASSAGE[0],
  MED[1],
  ROOMS[0],
  ROOMS[2],
  ROOMS[4],
  DESK[2],
];

const ABOUT: Shot[] = [
  { asset: "ha-ap-rachel-lessard", alt: "Rachel Lessard, LCSW-R, founder of Pathways Within" },
  { asset: "ha-ap26-rachel-family", alt: "Rachel Lessard with her family" },
  DESK[0],
  FAMILY[0],
  { asset: "pr-ap-smt-labyrinth-sign", alt: "Wooden Pathways Within labyrinth sign" },
  ROOMS[0],
  { asset: "ha-gloria-saladino", alt: "Gloria Saladino of the Welcome Team" },
];

const EXACT: Record<string, Shot[]> = {
  "/": HOME,
  "/about": ABOUT,
  "/contact": DESK,
  "/how-it-works": DESK,
  "/faq": [...DESK.slice(0, 3), ...ROOMS.slice(0, 3)],
  "/locations": [...GARDEN.slice(0, 2), ...MASSAPEQUA.slice(0, 2), ...SMITHTOWN.slice(0, 2), ...PORT_JEFF.slice(0, 2)],
  "/locations/garden-city": GARDEN,
  "/locations/massapequa": MASSAPEQUA,
  "/locations/smithtown": SMITHTOWN,
  "/locations/port-jefferson": PORT_JEFF,
  "/therapy": [...SESSION, ...FAMILY.slice(0, 2), ...KIDS.slice(0, 2), ...COUPLES.slice(0, 2)],
  "/therapy/individual-therapy": SESSION,
  "/therapy/couples-therapy": COUPLES,
  "/therapy/family-therapy": FAMILY,
  "/therapy/child-therapy": KIDS,
  "/therapy/pcit": [...KIDS, FAMILY[1]],
  "/therapy/teen-therapy": TEEN,
  "/therapy/group-therapy": GROUP,
  "/therapy/emdr": QUIET,
  "/therapy/trauma-therapy": QUIET,
  "/therapy/ifs": QUIET,
  "/therapy/somatic-therapy": QUIET,
  "/therapy/hypnotherapy": QUIET,
  "/therapy/grief-therapy": [COUPLES[5], QUIET[3], QUIET[0], QUIET[1]],
  "/therapy/ketamine-assisted-therapy": QUIET,
  "/therapy/veterans-first-responders": [SESSION[4], SESSION[2], QUIET[4], ROOMS[3]],
  "/therapy/bariatric-surgery-support": SESSION,
  "/medication-management": MED,
  "/coaching": [SESSION[2], SESSION[4], DESK[2], MED[3], SESSION[0]],
  "/telehealth": [SESSION[2], SESSION[0], MED[0], DESK[0], QUIET[0]],
  "/wellness": [...MASSAGE.slice(0, 3), ...ACU.slice(0, 2), ENERGY[1]],
  "/wellness/massage": MASSAGE,
  "/wellness/acupuncture": ACU,
  "/wellness/cupping": [...ACU.slice(3), MASSAGE[4]],
  "/wellness/energy-work": ENERGY,
  "/wellness/reiki": ENERGY,
  "/wellness/iet": ENERGY,
  "/concerns": [...SESSION.slice(0, 2), COUPLES[0], KIDS[0], MASSAGE[0]],
  "/concerns/anxiety": SESSION,
  "/concerns/depression": QUIET,
  "/concerns/ptsd": QUIET,
  "/concerns/ocd": QUIET,
  "/concerns/grief-and-loss": [COUPLES[5], QUIET[3], QUIET[0], SESSION[2]],
  "/concerns/relationship-issues": COUPLES,
  "/concerns/adhd": [...TEEN, KIDS[0]],
  "/concerns/stress-and-burnout": [...QUIET.slice(0, 3), ENERGY[0]],
  "/concerns/self-esteem": SESSION,
  "/concerns/life-transitions": SESSION,
  "/concerns/bipolar-disorder": QUIET,
  "/concerns/substance-use": QUIET,
  "/concerns/postpartum-and-perinatal": [FAMILY[1], FAMILY[2], SESSION[2], QUIET[0]],
  "/concerns/chronic-pain-and-illness": [...MASSAGE.slice(0, 3), ACU[1]],
  "/concerns/lgbtqia-affirming-therapy": SESSION,
  "/careers": [...DESK.slice(0, 3), ROOMS[3], ROOMS[0]],
  "/blog": [ABOUT[0], ROOMS[0], SESSION[0], DESK[0]],
  "/blog/a-new-way-podcast": [ABOUT[0], ABOUT[1], SESSION[0], FAMILY[0]],
  "/providers/rachel-lessard": [ABOUT[0], ABOUT[1], FAMILY[1], FAMILY[0]],
  "/providers/tiffany-roberts": MED,
};

const PREFIX: [string, Shot[]][] = [
  ["/insurance", [...DESK.slice(0, 2), ROOMS[4], { asset: "pr-ap-pj-wood-clock", alt: "A round wall clock on a wood-plank wall at a Pathways Within office" }]],
  ["/wellness", ENERGY],
  ["/therapy", SESSION],
  ["/concerns", SESSION],
  ["/locations", ROOMS],
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function poolFor(url: string): Shot[] {
  if (EXACT[url]) return EXACT[url];
  return PREFIX.find(([prefix]) => url.startsWith(prefix))?.[1] ?? [];
}

function words(value: string): Set<string> {
  return new Set(value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean));
}

function portraitFor(headingText: string): ResolvedPhoto | undefined {
  const heading = words(headingText);
  const provider = getProviders().find((person) => {
    const first = person.first_name.toLowerCase();
    const last = person.last_name.toLowerCase();
    return heading.has(first) && heading.has(last);
  });
  if (!provider) return undefined;
  const shot = resolveHeadshot(provider.slug);
  if (!shot) return undefined;
  return { ...shot, alt: `Portrait of ${provider.displayName}` };
}

function resolveShots(shots: Shot[], seed: string): ResolvedPhoto[] {
  const ready = shots.flatMap((shot) => {
    try {
      const photo = resolvePhoto({ asset: shot.asset, alt: shot.alt, focal: "center" });
      return photo ? [photo] : [];
    } catch {
      return [];
    }
  });
  if (ready.length < 2) return ready;
  const count = Math.min(5, ready.length);
  const start = hash(seed) % ready.length;
  return Array.from({ length: count }, (_, index) => ready[(start + index) % ready.length]);
}

const SKIP_HEADING = /privacy|terms|accessibility|complain/;

/**
 * What belongs in the open part of this card. Undefined leaves the card as copy.
 * Provider bios on the team and about pages take that person's circle.
 */
export function cardFillFor(url: string, headingId: string, headingText: string): CardFill | undefined {
  if (SKIP_HEADING.test(headingId)) return undefined;
  if (url === "/providers" || url === "/about") {
    const portrait = portraitFor(headingText);
    if (portrait) return { kind: "portrait", photo: portrait };
  }
  const photos = resolveShots(poolFor(url), `${url}:${headingId}`);
  if (photos.length < 2) return undefined;
  return { kind: "bento", photos };
}
