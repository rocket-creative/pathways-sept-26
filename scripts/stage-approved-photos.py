#!/usr/bin/env python3
"""Selectively extract curated approved photos from photographer ZIP exports.

Never extracts DO NOT USE / ***Backdrop / Kelly NO / baby folders.
Picks a small curated set per office folder and one preferred headshot per person
(mid-sequence portrait, which tends to be a finished frame).
Writes into images/pathwayswithin-images/approved/ and a JSON manifest.
"""
from __future__ import annotations

import json
import re
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "pathwayswithin-images" / "approved"
MANIFEST = ROOT / "lib" / "images" / "approved-manifest.json"

ZIPS = {
    "nassau-offices": Path("/Users/rikdawg/Downloads/EXPORT-JPG-Nassau Offices.zip"),
    "suffolk-offices": Path("/Users/rikdawg/Downloads/EXPORT-JPG-Suffolk Offices.zip"),
    "nassau-headshots": Path("/Users/rikdawg/Downloads/EXPORT-JPG-Nassau headshots.zip"),
    "suffolk-headshots": Path("/Users/rikdawg/Downloads/EXPORT-JPG-Suffolk headshots.zip"),
}

SKIP_RE = re.compile(
    r"(DO NOT USE|\*\*\*|Kelly NO|Jen baby|/Ari/|TEASERS)",
    re.I,
)

# Map zip folder names → site location slug keys
OFFICE_SLUG = {
    "Rockville Centre": "rockville-centre",
    "Garden City - Wisdom": "garden-city",
    "Garden City - Wellness": "garden-city-wellness",
    "Massapequa - Wisdom": "massapequa",
    "Massapequa - Wellness": "massapequa-wellness",
    "Smithtown - Wisdom": "smithtown",
    "Smithtown - Wellness": "smithtown-wellness",
    "Smithtown-JPG": "smithtown-extra",
    "Port Jefferson": "port-jefferson",
    "Front Desk": "front-desk",
    "Front Desk/Saul": "front-desk-saul",
    "Front Desk/Christine": "front-desk-christine",
    "Massage and Acupuncture": "massage-acupuncture",
}

# How many office frames to keep per folder (varied placements on site)
OFFICE_KEEP = {
    "rockville-centre": 6,
    "garden-city": 5,
    "garden-city-wellness": 4,
    "massapequa": 5,
    "massapequa-wellness": 4,
    "smithtown": 5,
    "smithtown-wellness": 4,
    "smithtown-extra": 3,
    "port-jefferson": 5,
    "front-desk": 6,
    "front-desk-saul": 2,
    "front-desk-christine": 2,
    "massage-acupuncture": 5,
    "_nassau-root": 4,
    "_suffolk-root": 4,
}

# Folder name → provider slug (only known matches)
HEADSHOT_SLUG = {
    "Rachel Lessard - Nassau": "rachel-lessard",
    "Rachel Lessard - Smithtown": "rachel-lessard",  # prefer nassau if both
    "Ksusha Cascio and Domino": "ksusha-cascio",
    "Joseph Bush": "joe-bush",
    "Lee Wasser": "lee-wasser",
    "Kaitlin Kelly": "kaitlyn-kelly",
    "Laura DeSilva": "laura-desilva",
    "Beth Gabellini": "beth-gabellini",
    "Carly Sandstrom": "carly-sandstrom",
    "Jennifer Brooks": "jen-brooks",
    "Lauren Vanchieri-Hollander and Gypsy": "lauren-hollander",
    "Paula Gonthier": "paula-gonthier",
    "Anna Ostrow": "anna-ostrow",
    "Charity (Valen) Meyer": "charity-meyer",
    "Chelsea Bell": "chelsea-bell",
    "Frank Tropeano": "frank-tropeano",
    "Juliette Squicciarini": "juliette-squicciarini",
    "Kathleen DeMartino": "kathleen-dimartino",
    "Lindsay Laier": "lindsay-laier",
    "Madeline Zambri": "maddy-zambri",
    "Mariah Simone": "mariah-simone",
    "Nicole Duffy": "nicole-duffy",
    "Kalovna Edmond": "kalovna-edmond",
    "Tia Baumohl": "tia-baumohl",
    "Christine Cervo": "christine-cervo",
    "Leonard Ma": "leonard-ma",
    "Gloria Saladino": "gloria-saladino",
    # extras without current slug stay as editorial assets
}


def is_jpg(name: str) -> bool:
    return name.lower().endswith((".jpg", ".jpeg"))


def office_bucket(member: str, kind: str) -> str | None:
    # EXPORT-JPG-Nassau Offices/Rockville Centre/file.jpg
    parts = member.split("/")
    if len(parts) < 2 or not is_jpg(parts[-1]):
        return None
    if SKIP_RE.search(member):
        return None
    # nested Front Desk/Saul
    if len(parts) >= 4 and parts[1] == "Front Desk" and parts[2] in ("Saul", "Christine"):
        key = f"Front Desk/{parts[2]}"
        return OFFICE_SLUG.get(key)
    if len(parts) == 2:
        return "_nassau-root" if kind == "nassau-offices" else "_suffolk-root"
    folder = parts[1]
    return OFFICE_SLUG.get(folder)


def pick_spread(files: list[tuple[str, int]], keep: int) -> list[tuple[str, int]]:
    """Pick evenly spaced frames preferring larger files within each slot."""
    if not files:
        return []
    files = sorted(files, key=lambda x: x[0])  # by name = shoot order
    if len(files) <= keep:
        return files
    # prefer mid-to-late frames (often more polished edits)
    idxs = []
    for i in range(keep):
        # bias toward middle 60% of the shoot
        t = 0.2 + (0.6 * i / max(keep - 1, 1))
        idxs.append(int(t * (len(files) - 1)))
    # dedupe indices, then fill from largest remaining
    chosen = []
    used = set()
    for i in idxs:
        if i not in used:
            chosen.append(files[i])
            used.add(i)
    remaining = sorted(
        (f for j, f in enumerate(files) if j not in used),
        key=lambda x: -x[1],
    )
    while len(chosen) < keep and remaining:
        chosen.append(remaining.pop(0))
    return chosen


def extract_member(zf: zipfile.ZipFile, member: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with zf.open(member) as src, open(dest, "wb") as out:
        out.write(src.read())


def stage_offices() -> dict:
    result = {"offices": defaultdict(list)}
    for kind in ("nassau-offices", "suffolk-offices"):
        zpath = ZIPS[kind]
        with zipfile.ZipFile(zpath) as zf:
            buckets: dict[str, list[tuple[str, int]]] = defaultdict(list)
            for info in zf.infolist():
                if info.is_dir() or not is_jpg(info.filename):
                    continue
                bucket = office_bucket(info.filename, kind)
                if not bucket:
                    continue
                buckets[bucket].append((info.filename, info.file_size))
            for bucket, files in buckets.items():
                keep = OFFICE_KEEP.get(bucket, 3)
                for member, size in pick_spread(files, keep):
                    fname = Path(member).name
                    # normalize filename
                    safe = re.sub(r"[^\w.\-]+", "-", fname)
                    rel = f"offices/{bucket}/{safe}"
                    dest = OUT / rel
                    if not dest.exists():
                        extract_member(zf, member, dest)
                    result["offices"][bucket].append(
                        {"file": f"approved/{rel}", "bytes": size, "source": member}
                    )
    return {k: dict(v) if isinstance(v, defaultdict) else v for k, v in result.items()}


def stage_headshots() -> dict:
    """One preferred headshot per slug; extras for unmapped people as editorial."""
    picks: dict[str, tuple[str, int, str]] = {}  # slug -> (member, size, county)
    editorial: list[dict] = []
    for kind, county in (("nassau-headshots", "nassau"), ("suffolk-headshots", "suffolk")):
        zpath = ZIPS[kind]
        with zipfile.ZipFile(zpath) as zf:
            by_person: dict[str, list[tuple[str, int]]] = defaultdict(list)
            for info in zf.infolist():
                if info.is_dir() or not is_jpg(info.filename):
                    continue
                if SKIP_RE.search(info.filename):
                    continue
                parts = info.filename.split("/")
                if len(parts) < 3:
                    continue
                person = parts[1]
                # skip nested alternate folders for pick (Paige ok if top-level person)
                if len(parts) > 3 and parts[2] in ("Kelly NO", "Jen baby", "Ari", "Abby"):
                    continue
                by_person[person].append((info.filename, info.file_size))

            for person, files in by_person.items():
                files = sorted(files, key=lambda x: x[0])
                # mid frame
                pick = files[len(files) // 2]
                slug = HEADSHOT_SLUG.get(person)
                safe_person = re.sub(r"[^\w.\-]+", "-", person).strip("-").lower()
                if slug:
                    # prefer nassau for rachel if both
                    if slug in picks and slug == "rachel-lessard" and county == "suffolk":
                        continue
                    if slug in picks and county == "suffolk":
                        continue  # nassau already set
                    picks[slug] = (pick[0], pick[1], county)
                else:
                    # keep one editorial portrait for unmatched people (team collage fuel)
                    rel = f"headshots/editorial/{safe_person}.jpg"
                    dest = OUT / rel
                    if not dest.exists():
                        extract_member(zf, pick[0], dest)
                    editorial.append(
                        {
                            "id": f"ed-{safe_person}",
                            "file": f"approved/{rel}",
                            "person": person,
                            "county": county,
                        }
                    )

    headshots = []
    for slug, (member, size, county) in sorted(picks.items()):
        rel = f"headshots/{slug}.jpg"
        dest = OUT / rel
        with zipfile.ZipFile(
            ZIPS["nassau-headshots"] if county == "nassau" else ZIPS["suffolk-headshots"]
        ) as zf:
            if not dest.exists():
                extract_member(zf, member, dest)
        headshots.append(
            {
                "slug": slug,
                "file": f"approved/{rel}",
                "bytes": size,
                "source": member,
                "county": county,
            }
        )
    return {"headshots": headshots, "editorial_headshots": editorial}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    offices = stage_offices()
    heads = stage_headshots()
    manifest = {
        "note": "Curated subset of approved photographer exports for site use",
        **offices,
        **heads,
    }
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    n_off = sum(len(v) for v in manifest["offices"].values())
    print(f"Staged {n_off} office frames across {len(manifest['offices'])} buckets")
    print(f"Staged {len(manifest['headshots'])} provider headshots")
    print(f"Staged {len(manifest['editorial_headshots'])} editorial portraits")
    print(f"Manifest → {MANIFEST}")


if __name__ == "__main__":
    main()
