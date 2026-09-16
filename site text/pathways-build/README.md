# Pathways Within unified site: content and build package

Everything Cursor needs to build pathwayswithinwellness.com. Cursor executes; it does not write copy.

- `00-cursor-master-prompt.md`: paste this into Cursor first. Architecture, design rules, functionality, technical SEO, QA.
- `SPEC.md`: the contract every page follows (facts sheet, page format, section patterns, copy rules, schema).
- `pages/`: one Markdown file per page (85 files): YAML front matter (url, title, meta, h1, author, reviewer, schema hints), full copy in build order, JSON LD block. `_provider-template.md` renders every provider from the sheet.
- `data/url-map.csv`: every URL with page type and file. `data/redirects.csv`: 301 map for both old domains. `data/providers-sheet.csv` and `data/locations-sheet.csv`: the two sheets that drive the directory, location pages, footer, and schema. `data/needs-list.md`: every `[NEEDS]` gap grouped by file, for the client.
- `tools/check-pages.py`: quality gate (title 50 to 60, meta 140 to 155, unique H1, no hyphens or dashes in copy, banned words, word counts, link targets, JSON parse, author block). Run `python3 tools/check-pages.py`; currently 85 files, 0 problems.
- `sources/`: the old site crawl, both call transcripts, and the client's new massage and acupuncture copy, for reference only.
