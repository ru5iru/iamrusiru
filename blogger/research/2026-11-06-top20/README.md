# Twenty-site Blogspot SEO, AEO and GEO benchmark

Started **6 November**, completed **7 November 2026, Asia/Colombo**. This is research and verification only: no theme, post, Page, style or Blogger setting was changed.

**The current theme already provides most of the useful technical features observed in the peers.** The main actionable gaps are two stale native titles, exported lists/table markup, responsive image delivery, saved-widget image alternatives and Privacy identity. Adding more FAQ or generic “GEO” schema is not the priority.

## Deliverables

- [Implementation comparison: 48 controls](CHECKLIST.md) — peer adoption counts, current theme/code status, fresh live status and action/acceptance criteria. [CSV](checklist.csv) / [JSON](checklist.json).
- [Prioritized action checklist](ACTION-CHECKLIST.md) — eleven proposed fixes/improvements/owner checks. No fixes applied.
- [All twenty peer profiles](PEER-PROFILES.md) — observed implementations and defects to avoid. [Comparison CSV](peer-comparison.csv) / [JSON](peer-comparison.json).
- [Selection and limitations](METHODOLOGY.md) — exact ranking, inclusion rules, exclusions, sampling and interpretation.
- [Primary references](SOURCES.md).

## Ranking and coverage

The sample uses [Tranco V355N including subdomains](https://tranco-list.eu/list/V355N), generated 5 November, rather than inventing a global traffic ranking. The top-million list contained 72 single-label Blogspot hosts. Walking them by rank required 32 candidates to obtain **20 publicly auditable Blogspot publications**. Twelve exclusions are documented. Custom-domain Blogger sites are outside this narrowly defined cohort.

“Top” means aggregate popularity rank under the stated eligibility rules. It does not mean best SEO, largest verified traffic, trusted content or proven AI visibility. Topics include education, news, crosswords, software, lottery and adult/link publications; this is a technical sample, not recommendations. Only HTML/headers were inspected. No peer scripts/media/downloads or gates were executed.

**168 peer/candidate requests**, plus **38 current-site requests**, support the comparison. Peer coverage includes home and one post per site, robots, native post/Page sitemaps, `llms.txt` and a mobile URL; a discoverable same-blog About Page was inspected when available. Current coverage includes 28 core routes, discovery endpoints and seven variants, plus 28 local fixtures. Not every article, device or private setting was audited.

## Key observations

| Observable feature in the sampled article | Peers | Current implementation |
| --- | ---: | --- |
| Matching single HTTPS canonical | 17/20 | 28/28 core routes |
| Article-specific description | 4/20 | 28 distinct live route descriptions; all 23 posts match prepared metadata |
| Article/BlogPosting entity | 19/20 | All 23 posts |
| BreadcrumbList entity | 2/20 | All single-item routes |
| Explicit FAQPage / detected TOC / explicit summary component | 0/20 each | 23 summaries, 129 Q/As and TOC support |
| Responsive image candidates | 6/19 image-containing articles | Missing in current output |
| Images all have an alt attribute | 2/19 image-containing articles | Generated article images pass; ten live home-sidebar images still omit alt |
| Genuine `llms.txt` in the probe | 0/20 | Optional/absent; not a Google SEO requirement |

Counts are sampled feature presence, not an SEO/AEO/GEO score. A zero can mean a different content style, a feature on another page or a detection limitation. Outbound links on 17 peers include promotions/social/download destinations; they are not seventeen verified citation strategies. Structured markup was not independently validated for every peer.

## Current-site verification

The live build now matches **`31c41a6463051a21979f`** on all 28 core routes. The theme has been installed since the earlier release handoff. Fresh responses verify unique descriptions, route keyword selection, About/Contact specialization, intended legal noindex, clean mobile canonicals, contextual utility headings and correct 404/noindex handling.

All **23 live post bodies exactly match** the normalized corrected release; all 129 FAQs remain, all structured keyword lists/descriptions match and no source/link placeholders remain. The remaining publishing inconsistency is the native titles for Injection and Cryptographic Failures: they still use the old edition wording even though their body/metadata corrections are live.

A deeper structure check also finds **literal prose lists in all 23 posts** and **one literal Markdown table in the OWASP guide**. HTML list/table starters exist, but the exporter has not converted those particular source strings into semantic list/table elements. This newly confirmed gap refines the earlier broad content-structure checks; it does not mean the text is absent or uncrawlable.

The 48 live control statuses are **32 Implemented, nine Partial, one Missing, two Optional and four Unverified**. Partial includes real publishing/content work; these totals are not rankings or a count of independent defects. Account/editor/field checks remain unverified rather than assumed broken.

## Evidence and reproducibility

- `ranking-candidates.json`: pinned list ID, source dates/headers and all 72 matching candidates.
- `peer-evidence.json`, `request-manifest.json`, `extra-request-manifest.json`: all peer feature extractions, selection ledger and raw response references.
- `current-theme-evidence.json`, `current-variants.json`: local versus fresh public Blogger observations.
- `content-verification.json`: per-post body/title/description/keyword/FAQ/list/table checks and policy identity test.
- `summary.json`, `checklist.csv`, `peer-comparison.csv`: machine-readable coverage/results.
- Collector/analysis scripts in this directory write research evidence only. Raw HTML remains local under `output/playwright/blogspot-top20-2026-11-06/` and is excluded from the shareable report package.

Actual Google indexing, selected canonicals, AI citations, private analytics, new native editor round-trips and field Core Web Vitals remain owner/measurement tasks. No claim that a peer feature caused rank/traffic/AI gains is made. Recommendations are cross-checked against [primary guidance](SOURCES.md), rather than copied simply because a ranked site uses them.
