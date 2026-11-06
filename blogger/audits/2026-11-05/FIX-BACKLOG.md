# Blogger fix handoff - implementation deferred

Use the [50-item implementation checklist](IMPLEMENTATION-CHECKLIST.md) as the authoritative work list. It separates **Fix**, **Improve** and **Verify**, with a measurable completion condition for every item. The [150-control matrix](CHECKLIST.md) is the release/re-audit reference. No work below has been implemented by this audit.

**Already complete:** the owner enabled Visible to search engines; fresh responses on all 28 content URLs have no restrictive HTTP header (former F01 resolved). Public robots policy and native post/Page sitemaps also work. Actual indexing still requires owner evidence.

## Implementation order and dependencies

| Order | Work / checklist IDs | Proposed owner | Acceptance / dependency |
| --- | --- | --- | --- |
| 1 | Native route matching, descriptions and editor priority: T01-T04, T07-T08; F02-F04 | Theme developer + publisher | Prove native URL/DSL/data scope on a test blog. All configured routes select intended branches. Saved Search descriptions win after edits; legal policy and Page semantics match intent. Raw HTML works without scripts. |
| 2 | Hosted release contract: V01-V03; F04 | Theme developer | Back up/version the theme and record deployed config. Saved new-post/Page/FAQ cases and hosted comparisons catch current live metadata failures. Retain 20 useful local checks. |
| 3 | Sources and security facts: P03-P06, P08; F05-F06 | Author + technical reviewer | Replace six published markers, cite evidence and correct OWASP edition/statistical statements in visible content and metadata. Independently execute tutorial examples before certifying them. |
| 4 | All-post metadata/editorial pass: P01-P02, P07, P09-P12, T05-T06; F09-F10 | Publisher + developer for fallbacks | All 23 posts have relevant descriptions, complete titles, clear topic/intent, truthful updates, useful links and images. New native posts have a documented relevant fallback or mandatory authored description. |
| 5 | Page identity/useful discovery Pages: G01-G08; F03/F13 | Owner + Page editor | About/Contact/policies describe this Blogger site. Document Page metadata workflow. Add Start Here/topic hub only if substantial, helpful and maintainable, using existing styled blocks. |
| 6 | Headings, reuse and images: T09-T11, T14-T15; F11/F14/F15/F18 | Theme/gadget developer + asset owner | Contextual utility headings; deliberate widgets; another-owner visible/schema consistency; correct alt and smaller image transfers. Inspect saved Popular gadget because its source is not versioned. |
| 7 | Performance, contrast decision and errors: T12-T13, T16; F07/F12/F16 | Developer + owner for visual changes | Trace shifts, measure proper CLS/repeated lab/available field data. Preserve layout/styles; contrast correction needs explicit visual scope. Missing URLs remain genuine 404/noindex with clean metadata. |
| 8 | Search/AI reporting and ongoing checks: B03-B08, V04-V06; F17 | Verified property owner + developer | Record Search Console/Bing ownership, sitemap processing, URL Inspection, intended generative-search/training choices and query/AI/referral baseline. Distinguish eligibility from actual indexing/citation. |

Priorities: **P1** major correctness/evidence/accessibility/release work; **P2** improvements/conditional reuse/verification; **P3** low-impact cleanup. Roles are suggested. Stable finding IDs remain; the removed comparison finding has no task in this Blogger-only scope.

## Completion rules

1. Preserve existing styling and working Blogger functionality. Back up/export before an authorized fix deployment; this audit does not restore themes or edit content.
2. Review all 23 rows in [post-audit.csv](post-audit.csv) and four Pages in [CONTENT-AUDIT.md](CONTENT-AUDIT.md), rather than fixing only the sample article.
3. Keywords mean clear topic/intent, useful titles/leads/headings and consistent Labels. Legacy meta keywords are optional, not a Google ranking switch. FAQs must answer real questions accurately and match visible schema.
4. Require saved native HTML/Compose round-trips for snippets/descriptions; preview cannot establish hosted compiler/editor behavior.
5. Recheck applicable controls after changes. Do not promise rankings, immediate indexing, AI citations or FAQ rich-result eligibility from markup alone.
