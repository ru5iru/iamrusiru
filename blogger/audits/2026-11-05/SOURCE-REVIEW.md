# Code-level review and verification record

Scope: Blogger theme, exporter/editor tooling and published content only. The visibility recheck replaces the old restrictive-header result. Independent validator/native fixture records are retained from earlier the same day and not claimed freshly rerun.

Baseline commit: `712eddfd50f0835133b880286f3fe833dcb0ff73`. Review date: 5 November 2026. This file records findings, not code changes.

## Files and contracts reviewed

| Area / source location | What is implemented and what the audit established |
| --- | --- |
| `blogger/template.xml:7` | One native title/canonical/description/social field per key; metadata is server-rendered. Live counts pass, but description relevance fails. |
| `scripts/lib/blogger-seo.mjs:59` | Head description precedence is view description, route, native blog metadata, configured site description. Native global/widget data does not behave like the simplified fixture; head/site versus article/body values differ live. |
| `scripts/lib/blogger-markup.mjs:17` | Route comparisons use native URL data plus concatenated homepage/path expressions. Live route metadata does not activate as it does in JavaScript preview. Exact native DSL root cause needs a hosted probe, deferred to fixes. |
| `scripts/lib/blogger-seo.mjs:66` | Optimized imported document titles only apply when the current native title matches the original. Explicit owner overrides persist. This is sensible intent; actual route selection fails live. |
| `scripts/lib/blogger-seo.mjs:78` | Search/archive/error are noindex; configurable legal paths should be noindex. Utility cases work live; legal URL conditions do not. HTTP headers are outside this module's control. |
| `scripts/lib/blogger-seo.mjs:109` | Scoped descriptions can use a native body snippet, and native Labels can become keywords. This works, but does not repair generic head descriptions. |
| `blogger/template.xml:106` | BlogPosting contains headline, mainEntityOfPage, articleBody, native author and modification time. All 23 articles expose these entities; sampled general schema validation passes. |
| `scripts/lib/blogger-seo.mjs:134` | Native publication timestamp/free-access/section/publisher markup is supported. No invented dateModified is added by the new Blogger helper. |
| `scripts/lib/blogger-seo.mjs:120` | WebPage semantic specialization and owner mainEntity depend on routes; missing live on configured About/Contact paths. |
| `scripts/lib/blogger-config.mjs:36` | Deep configuration/default copies prevent cross-owner leakage; HTTPS, known fields, keyword arrays and route validation are present. Existing separate-owner test passes. |
| `scripts/lib/blogger-personalize.mjs` | Generated identity/gadgets are configurable, with native/project modes. Layout edits and build-time owner schema remain separate sources; single-owner model needs an explicit reuse check. |
| `scripts/lib/blogger-editor.mjs` | Optional post/Page, FAQ, summary, code, source and keyword blocks reuse actual styles. Keyword planning comments are not metadata. Page body meta may be normalized by Compose; only a saved hosted round-trip proves retention. |
| `scripts/build-blogger.mjs:47` | Exporter captures Page metadata and post defaults for Blogger output. Audit checks these generated values rather than the separate application behavior. |
| `scripts/build-blogger.mjs:229` | Content/Atom export includes body/labels/dates, but does not itself populate a dedicated native Search description field. Intended imported description fallback must therefore work on Blogger, or native descriptions need author entry. |
| `scripts/build-blogger.mjs:249` | Route metadata inventory and a domain-specific robots Settings example are generated. Restoring XML does not apply robots.txt or HTTP header settings. |
| `scripts/lib/blogger-preview.mjs:25` | Preview invents view metadata and normalizes dates/labels. It supplies searchDescription directly and cannot prove Blogger's actual scoping/defaults. |
| `scripts/lib/blogger-preview.mjs:45` | Expressions are converted to JavaScript and evaluated with Function. This trusted local-only preview is not Google's compiler; it must never be used for untrusted templates or as a production service. |
| `scripts/test-blogger.mjs` | XML/widget invariants, duplicate tags, all 27 content routes, escaping, snippets, no-JS extraction, native fixture fields and owner isolation are useful. No hosted-header or deployed-response assertion existed before this audit. |
| `blogger/enhancements.js:98` | Repositions FAQ/related content, computes reading tools, repairs known-post display metadata and upgrades navigation. It does not repair crawlable head metadata. JS-disabled content remains available. |
| `blogger/styles.css` and served Blogger CSS | Existing responsive design/token system retained. Light primary/foreground combinations fail measured ordinary-text contrast; reduced-motion CSS exists. No style changes were made. |
| Live saved sidebar markup, headed Popular | Ten thumbnail images omit alt attributes. This block is not in the versioned template/local fixtures; inspect its saved gadget implementation before changing it. Captured in `widget-accessibility-evidence.json` (F18). |
| `blogger/config.json`, `config.reusable.json` | Current-owner project and generic native presets reviewed. Native preset isolation passes locally; true hosted another-owner deployment is still a release check. |
| `blogger/output/content.json` / published post and Page bodies | All 23 records were inventoried for title/description/keywords/headings/summary/FAQ/images/source links/placeholders. High-risk OWASP edition/statistical examples were spot-checked against primary sources; tutorial execution and comprehensive expert fact checking remain separate tasks. |

## Verification record

| Command | Result | What it proves / does not prove |
| --- | --- | --- |
| `npm run test:blogger` | 20 passed | Local XML/fixture/behavior checks; does not run Blogger's compiler or validate HTTP/dashboard settings. The existing owner-isolation test builds only ignored verification output. |
| Impeccable source detector on `blogger/template.xml` | One warning: existing Roboto font | Intentional, user-preserved design; not an SEO failure. No font replacement recommended. |
| Public Schema.org validator, Injection URL | Zero schema errors/warnings | General graph validity on one live article. BlogPosting appears nested under BreadcrumbList via shared canonical identity. Not Google eligibility/indexing proof. |
| Google Rich Results Test | Sign-in requested after error dialog | Unverified. No login, CAPTCHA or tool restriction was bypassed. |
| Public PageSpeed API | HTTP 429 quota exhausted | External tool availability limitation, not a performance score. Controlled browser lab evidence is retained separately. |

The audit scope is Blogger only. Separate-application findings/tests/comparisons are excluded. No XML was restored, no posts were imported/edited, and no Blogger account settings were changed.

## Expected/live parity example

| Field | Local generated Injection fixture | Native Blogger response |
| --- | --- | --- |
| Document title | Optimized, ellipsized branded title | Full native post title |
| Head description | Injection-specific generated description | Generic blog description |
| Head keywords | Curated phrases | Absent; not a Google ranking issue by itself |
| Article description | Generated description | Body snippet beginning with TL;DR |
| Article keywords | Curated phrases | Blogger Labels |
| HTTP robots | No hosting header modeled | No X-Robots-Tag after visibility change; former F01 resolved |
| About/Contact specialization | additionalType and owner | WebPage base only |
| Legal HTML robots | noindex | index |

These differences are recorded in `post-audit.json` and `evidence.json`; they must drive the next hosted acceptance checks rather than weakening the local assertions to accept wrong results.

## Items deliberately not treated as defects

- Microdata is supported; absence of JSON-LD is not a failure.
- Generic metadata keyword tags have no Google ranking value. Missing ones are only a diagnostic symptom of route selection.
- FAQPage semantics can remain useful even though Google's FAQ rich result is retired.
- No compulsory llms.txt, arbitrary FAQ word count, keyword density, exact-match phrase quota or new “GEO schema” was imposed.
- Native publication/import-modification timestamps are not automatically false freshness claims; their editorial meaning needs owner review.
- Hidden Header1 creates extra raw heading markup, but the measured core pages still have a clear visible title. Multiple raw H1s alone do not establish a ranking penalty.
- Small inline links are candidates for spacing/target review, not automatic WCAG failures without considering exceptions.

## Blogger-output title default review

Eighteen defaults in `blogger/output/seo-routes.json`/`content.json` contain ellipses, including mid-word cuts. Current live native titles are complete; do not activate poor defaults when correcting F03. Prefer full native titles or meaningful Blogger-specific overrides. No separate-application title code changes are prescribed.
