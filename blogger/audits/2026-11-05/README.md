# Blogger SEO, AEO and GEO audit - 5 November 2026

Site: **https://ru5iru.blogspot.com/**. Scope: **Blogger theme, posts, Pages and settings only**. Baseline: 712eddfd50f0835133b880286f3fe833dcb0ff73. Dates use Asia/Colombo; captures retain ISO UTC timestamps. Separate-application findings/comparisons have been removed.

**Visibility resolved:** after the owner enabled Visible to search engines, fresh responses for all 28 content URLs have no X-Robots-Tag. Actual indexing needs Search Console evidence. Outstanding priorities are generic descriptions, inactive native route metadata, citation placeholders and factual inconsistencies.

**Start with the [50-item implementation checklist](IMPLEMENTATION-CHECKLIST.md): two verified complete, 48 pending fixes/improvements/verification tasks.** Every task has priority, scope and completion criteria. No theme, style, post or Page fixes were applied.

| Document | Purpose |
| --- | --- |
| [IMPLEMENTATION-CHECKLIST.md](IMPLEMENTATION-CHECKLIST.md) | Next-step settings, theme, posts, Pages and release work. |
| [CHECKLIST.md](CHECKLIST.md) | 150 audit controls with results, evidence and limits. |
| [REPORT.md](REPORT.md) | 16 active findings/gates: six P1, nine P2, one P3; former F01 resolved. |
| [FIX-BACKLOG.md](FIX-BACKLOG.md) | Implementation order, dependencies, owners and completion rules. |
| [CONTENT-AUDIT.md](CONTENT-AUDIT.md) | All 23 posts/four Pages, keywords/descriptions/FAQs/sources and editorial corrections. |
| [SOURCE-REVIEW.md](SOURCE-REVIEW.md) | Blogger code review, local/native differences and test limits. |
| [SOURCES.md](SOURCES.md) | Primary guidance and checked claims. |

## Evidence and verification

Fresh checks cover all 28 core URLs, native sitemaps/robots/feeds, variants/utility/errors, all 130 discovered internal destinations and 40 images. All 23 posts are discoverable through pagination; 129 FAQs are server-readable. Twelve fresh Chrome viewport cases have no overflow/page errors. Three routes are readable without JavaScript. Blogger tests pass **20/20**.

The 150 controls total **71 Pass, 18 Fail, 38 Partial, 19 Unverified and four N/A**. Related failures consolidate into the 16 report findings/gates; they are not 18 independent bugs. All 27 post/Page article-body hashes match the local Blogger fixtures. The fresh HTTP inventory contains **236 requests** and excludes separate-application comparison probes.

| Evidence | Contents |
| --- | --- |
| [summary.json](summary.json) | Exact request groups, coverage, control totals and lab observations. |
| [evidence.json](evidence.json) | Fresh Blogger requests, 49 live HTML cases and 28 local fixtures; raw-response references retained. |
| [post-audit.csv](post-audit.csv) / [post-audit.json](post-audit.json) | Every post's live/intended descriptions/keywords, FAQs, source markers and findings. |
| [content-inventory.json](content-inventory.json) | Exported article structures, topic phrases, images and dates. Phrase counts are not ranking thresholds. |
| [browser-evidence.json](browser-evidence.json) | Fresh responsive/interactions/accessibility candidate checks; logo contrast is exempt from ordinary-text rules. |
| [no-js-evidence.json](no-js-evidence.json) | Fresh home/Injection/About content without scripts. |
| [performance-evidence.json](performance-evidence.json) | Fresh throttled mobile diagnostics; one navigation per URL, observed shift sums, no field INP certification. |
| [native-fixture-evidence.json](native-fixture-evidence.json) | Earlier same-day local unknown-post cases, not saved hosted-editor tests. |
| [widget-accessibility-evidence.json](widget-accessibility-evidence.json) | Earlier same-day Popular gadget capture; missing-alt count also checked in fresh core HTML. |
| [validator-evidence/schema-validator-expanded.txt](validator-evidence/schema-validator-expanded.txt) | Earlier same-day schema sample, zero errors/warnings; not claimed freshly rerun. |

Fresh raw responses/screenshots/logs are retained locally under output/playwright/seo-audit-2026-11-05-blogger-recheck/ (ignored by Git). Historical earlier captures remain separate and are not mixed into current request records. The refreshed [audit ZIP](../../seo-aeo-geo-audit-2026-11-05.zip) includes the reports/data.

Private Search Console/Bing reports, selected canonicals, actual indexing/AI citations, field CWV, all tutorial execution and comprehensive expert fact checking remain unverified. Schema.org accepted one earlier same-day sample; Rich Results Test was unavailable after a sign-in error; fresh PageSpeed API returned quota-limited 429. These are tool limits, not site failures.

## Collection tooling

The read-only audit.mjs modes are fetch, links, probes, outbound and analyze. make-inventory.mjs aggregates saved evidence. Browser scripts use Playwright CLI run-code --filename. No runtime/package dependencies changed. Existing compatibility checks create only ignored verification output.

Collection replaces this dated snapshot: preserve a separate dated copy before a later audit. Scripts do not restore themes, publish content or change settings. Finite coverage does not certify every possible URL, editorial claim, device or search outcome.
