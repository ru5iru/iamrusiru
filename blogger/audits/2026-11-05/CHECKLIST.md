# Blogger SEO, AEO and GEO audit checklist

Audit date: **5 November 2026, Asia/Colombo**. Site: **https://ru5iru.blogspot.com/**. This is an audit snapshot, not a list of changes already applied.

**150 controls** cover code, all published content URLs, live HTTP responses, representative browser views, editorial evidence, publishing and measurement. A pass means the named check passed within its stated scope; it does not certify rankings, complete WCAG conformance or AI citations. There is no universal numerical AEO/GEO score or guaranteed markup recipe.

Status: **Pass** = evidence supports the control; **Fail** = a confirmed gap; **Partial** = mixed coverage or a material limitation; **Unverified** = requires unavailable private/field/expert evidence; **N/A** = not applicable to this site's current scope. Recheck every applicable control after fixes. Recommendations and acceptance criteria are in [REPORT.md](REPORT.md); the next-step work is in the [50-item implementation checklist](IMPLEMENTATION-CHECKLIST.md), with sequencing in [FIX-BACKLOG.md](FIX-BACKLOG.md).

Evidence keys: **HTTP** = `evidence.json` requests/pages; **Local** = its localPages fixtures; **Browser** = `browser-evidence.json`; **NoJS** = `no-js-evidence.json`; **Perf** = `performance-evidence.json`; **Content** = `content-inventory.json` and `CONTENT-AUDIT.md`; **Source** = `SOURCE-REVIEW.md`; **Manual** = an owner/expert/private-tool check still needed. Source references for the standards are collected in [SOURCES.md](SOURCES.md).

## 1. Crawling and indexing

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| CR01 | Home, every published post and every Page return genuine successful HTML responses. | Pass — HTTP: 28/28 return 200. |
| CR02 | No login, CAPTCHA, paywall or cookie interaction is needed to read public articles. | Pass — HTTP/NoJS, sampled browser paths. |
| CR03 | Public HTTP response headers permit intended indexing and following. | Pass — fresh 28/28 responses have no X-Robots-Tag after the owner enabled visibility; former F01 resolved. |
| CR04 | HTML robots directives match the intended indexing policy. | **Fail — F03:** legal URLs emit index instead of configured noindex; the prior HTTP contradiction is gone. |
| CR05 | robots.txt returns 200 with the expected text content type. | Pass — HTTP discovery response. |
| CR06 | robots.txt does not accidentally block the public site or essential rendering resources. | Pass — current wildcard allows `/`; the previous blanket block is gone. |
| CR07 | Search and share utility paths have an intentional crawl/index policy. | Partial — robots excludes `/search` and `/share-widget`; sampled utility HTML is noindex, but blocked crawlers cannot reliably read that tag to remove an already-indexed URL. |
| CR08 | Search/archive/error views are intentionally excluded from indexing. | Pass — sampled HTML is noindex,follow; no sitewide restrictive HTTP header remains. |
| CR09 | Private/draft/preview content is protected appropriately without treating robots.txt as authentication. | Unverified — requires Blogger permissions/draft settings; no private URLs were accessed. |
| CR10 | Posts sitemap and Pages sitemap are valid, successful and use final public URLs. | Pass — 23 post URLs and four Page URLs, XML namespaces present. |
| CR11 | Sitemap URLs resolve to canonical content without an accidental sitewide indexing restriction. | Pass — all 27 content targets resolve and self-canonicalize; legal exclusions remain a separate F03 policy task. |
| CR12 | Sitemap lastmod values represent meaningful updates rather than artificial freshness. | Partial — values match native import timestamps; editorial significance needs owner confirmation. |
| CR13 | Unknown post and Page URLs return 404 rather than soft-404 content with 200. | Pass — two synthetic missing routes return 404 and noindex. |
| CR14 | Search Console reports no security issues, manual actions or unintended removals. | Unverified — private reports unavailable. |
| CR15 | URL Inspection confirms the actual Google-selected canonical and indexing eligibility. | Unverified — owner Search Console evidence required; public HTTP eligibility is now clear. |

## 2. Blogger URLs, canonicalization and architecture

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| UR01 | Canonical pages contain exactly one canonical link in server HTML. | Pass — HTTP: all 28. |
| UR02 | Canonical targets match the final public URLs and return 200. | Pass — all 28 core routes. |
| UR03 | HTTP redirects to HTTPS permanently without changing the post path. | Pass — two first-hop checks return 301 to matching HTTPS URLs. |
| UR04 | Mobile `?m=1`, desktop `?m=0` and tracking variants canonicalize to clean equivalents. | Pass — six representative variants checked. |
| UR05 | Pagination URLs preserve real distinct listing pages and working next/previous links. | Pass — four listing pages collectively expose all 23 posts; source and HTTP links reviewed. |
| UR06 | Search/label/archive URLs avoid uncontrolled index expansion. | Partial — sampled views are noindex and robots excludes `/search`; actual existing index state/removal must be checked in Search Console. |
| UR07 | Every post is reachable through crawlable links without JavaScript. | Pass — home/pagination union contains 23/23 canonical post URLs. |
| UR08 | Header, footer, category and related-post links use Blogger destinations. | Pass — 130 unique discovered internal destinations tested; no linked destination failures. |
| UR09 | Internal links use descriptive anchors and avoid broken fragments. | Partial — links work; raw duplicate heading IDs absent; full keyboard/fragment behavior is not certified across every article. |
| UR10 | Blogger permalink changes have a deliberate native custom-redirect policy. | Unverified — no existing Blogger permalink changes were supplied; document/test redirect handling before changing a published slug. |
| UR11 | The Blogger public host and HTTP/mobile variants consolidate to the intended canonical URL. | Pass — sampled HTTP redirects and mobile/tracking canonical links point to clean HTTPS Blogspot URLs; another-owner/custom-domain reuse still needs its hosted test. |
| UR12 | Slugs are stable, descriptive and match the intended publishing dates/paths. | Pass — all 27 exported content paths match the live sitemap. |
| UR13 | Error pages avoid misleading canonical URLs and successful social previews. | Partial — F16: real 404/noindex works, but canonical paths contain a doubled slash. |
| UR14 | Translated/language variants have reciprocal, accurate hreflang only when needed. | N/A — one English publication; do not invent translated alternates. |
| UR15 | Navigation depth and topic hubs support the intended content strategy. | Partial — category/related navigation exists; keyword/query and user-demand analysis remains unverified. |

## 3. Titles, descriptions, keywords and social previews

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| MD01 | Every indexable route has one nonempty document title in raw HTML. | Pass — all 28 have one title. |
| MD02 | Titles are distinct and describe the actual page. | Pass — 28 distinct core titles; truncation in generated defaults is separately recorded. |
| MD03 | Blogger-generated title defaults preserve complete meaningful phrases. | Partial — F10: 18 exported defaults contain ellipses/mid-word cuts; live native titles are complete. Review before activating corrected route branches. |
| MD04 | Homepage title and visible branding identify the owner and topic clearly. | Pass — live title/hero identify Rusiru and software engineering. |
| MD05 | Each post/Page has a relevant, unique head description. | **Fail — F02:** all 28 share the same site description. |
| MD06 | Native per-post Search descriptions override fallbacks correctly on Blogger itself. | Unverified — F02/F04: local tests pass; no controlled dashboard-authored post was available. |
| MD07 | New native posts without an authored description have an appropriate fallback. | **Fail — F09:** source head fallback can be the site description; only scoped article metadata gets a body snippet. |
| MD08 | Main topic phrases are natural in titles, leads and appropriate headings. | Partial — Content inventory exposes phrase coverage; exact phrase matching is not a ranking requirement. Editorial intent needs review. |
| MD09 | Labels use consistent meaningful taxonomy and have one intended category label. | Pass — all 23 have the configured category; native labels and source topics checked. |
| MD10 | Imported/configured keywords and native Label keywords follow documented priority. | **Fail — F03:** live migrated URLs fall through to native Labels instead of curated route phrases. Missing legacy meta keywords alone is not a ranking failure. |
| MD11 | Keyword stuffing, hidden keyword lists and unsupported ranking claims are absent. | Pass — no hidden keyword-stuffing mechanism found; optional legacy keywords are documented as ignored by Google. |
| MD12 | One OG title/description/URL/type/image and matching Twitter fields are served without scripts. | Partial — counts and image/URL work; descriptions fail relevance (F02). |
| MD13 | Social images are public HTTPS images and appropriate to the actual article. | Pass — core social image URLs return 200 with image MIME types. |
| MD14 | Social image dimensions, alt metadata and real platform previews are checked. | Partial — native dimensions/public images checked; real Facebook/X/LinkedIn cached previews not verified; optional image alt/dimension metadata can improve portability. |
| MD15 | Metadata survives quotes, ampersands, title edits and domain/config changes. | Partial — local escaping/owner tests pass; native DSL route behavior fails live (F03/F04). |

## 4. Structured data and semantic identity

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| SD01 | Use supported JSON-LD, microdata or RDFa; absence of JSON-LD is not itself a defect. | Pass — server-rendered microdata is present. |
| SD02 | Article entity, headline, URL and mainEntityOfPage identify the visible article. | Pass — 23 BlogPosting entities with matching canonical IDs/headlines. |
| SD03 | Article published/modified timestamps are valid and match native records. | Pass — ISO timestamps present; editorial meaning of the import modification date is separately limited. |
| SD04 | Visible author and author markup agree and link to a real biography. | Pass — native author name and About link match the current owner. |
| SD05 | Publisher/site identity and profile links are factual and consistent. | Pass — current single-owner identity matches visible content; independent credentials not verified. |
| SD06 | Structured descriptions agree with relevant page/head descriptions. | **Fail — F02/F03:** article snippets and generic head descriptions diverge. |
| SD07 | Structured images point to fetchable representative assets. | Pass — direct/proxied image responses checked. |
| SD08 | BreadcrumbList positions, names and canonical items are meaningful. | Pass — Home/current-page paths; sampled Schema.org graph valid. |
| SD09 | CollectionPage/ItemList/ListItem represent real visible listings. | Pass — native item positions and links present on home/listing views. |
| SD10 | Pages use accurate WebPage/appropriate specialization semantics. | Partial — WebPage works; About/Contact additionalType/mainEntity fallbacks do not appear live (F03). |
| SD11 | FAQ questions/answers are visible and match their structured values. | Pass — all 129 are in server HTML; sampled NoJS and schema validator checks pass. |
| SD12 | No fabricated reviews, ratings, credentials, businesses, products or locations are added for SEO. | Pass — no such SEO fabrication mechanism found; biographical truth remains owner-verifiable. |
| SD13 | A general schema validator accepts representative markup. | Pass — Schema.org validator: sampled article graph, zero errors/warnings; BlogPosting is nested in the breadcrumb graph. |
| SD14 | Google-specific rich-result eligibility is independently tested and distinguished from schema validity. | Unverified — Rich Results Test requested sign-in; a general validator pass is not a Google eligibility pass. |
| SD15 | Schema remains correct after native edits, Layout changes and another-owner reuse. | Partial — local owner fixture passes; saved Blogger edits and controlled native new-content cases remain unverified (F04/F15). |

## 5. Content quality, accuracy and trust

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| CT01 | Every published post contains substantial readable original article text. | Pass — 23/23, approximately 535–3,005 whitespace-counted words in raw article bodies; no minimum word-count claim. |
| CT02 | Each article has an identifiable purpose and useful section structure. | Pass — all have substantive headings, summary and FAQ content; intent effectiveness needs audience data. |
| CT03 | First-hand experience and examples are distinguishable from general claims. | Partial — examples and personal narrative exist; authenticity is not independently verifiable. |
| CT04 | Technical claims identify the applicable product/standard edition. | **Fail — F06:** OWASP 2025/A03 mixing in Injection; Cryptographic Failures needs clear 2021/2025 context. |
| CT05 | Claims that need evidence link to relevant primary sources. | **Fail — F05:** zero external body links across the 23 posts. |
| CT06 | Citation placeholders and unfinished references are removed before publication. | **Fail — F05:** six source placeholders across three posts. |
| CT07 | Statistics, security/health/legal statements and attributed research are checked against authoritative evidence. | **Fail — F06:** the Broken Access Control 94% claim misreads testing coverage as vulnerability prevalence; all other high-stakes claims still need expert review. |
| CT08 | Code samples and instructions are tested for supported versions and safe context. | Unverified — theme rendering/code-copy checks pass; all tutorial programs were not executed. |
| CT09 | Important dates are truthful and distinguish original publication from real revisions/imports. | Partial — native timestamps work; source dates and meaningful editorial updates need owner sign-off. |
| CT10 | Author/About/Contact information gives readers a clear accountable identity. | Pass — public biography, name and contact routes are present and reachable. |
| CT11 | Employer, experience, qualification and social profile claims are accurate and current. | Unverified — owner confirmation needed; no new facts inferred from schema. |
| CT12 | Legal/policy pages name the actual site and describe enabled services. | **Fail — F13:** current policies reference `iamrusiru.com`; service/cookie claims need review for Blogger. |
| CT13 | Blogger tracking/mobile duplicates consolidate to the intended content URL. | Pass — sampled variants share clean canonical URLs; no separate application was audited. |
| CT14 | Thin, empty, placeholder or accidentally published article bodies are absent. | Partial — bodies are substantive, but source-citation placeholders remain (F05). |
| CT15 | Content is reviewed for freshness, correction history, accessibility and misleading AI-generated claims. | Unverified — editorial process/analytics are not public; version inconsistency is confirmed separately. |

## 6. Answer clarity and FAQs (AEO)

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| AE01 | Introductions/summary blocks provide a useful answer or clear article promise. | Pass — 23 TL;DR summaries; editorial relevance checked structurally, not against every possible query. |
| AE02 | Major sections use descriptive headings that support navigation. | Pass — article heading structure and sampled live TOC work. |
| AE03 | Definitions explain important terms without assuming the reader knows them. | Partial — technical articles contain definitions; comprehensibility across all audiences needs editorial testing. |
| AE04 | Procedures, lists, code and comparison tables are semantic and readable. | Pass — exported blocks and live code/table markup checked. |
| AE05 | Answers are complete and preserve caveats, context, edition and scope. | **Fail — F06:** version ambiguity affects security answers; other factual answers need expert review. |
| AE06 | FAQs reflect genuine reader needs instead of duplicating keyword variants. | Partial — 5–7 relevant questions per post; search-demand justification is unverified. |
| AE07 | FAQ question and acceptedAnswer markup matches visible text. | Pass — server HTML extraction and sampled independent schema validation. |
| AE08 | FAQs can be read without expanding inaccessible controls or running scripts. | Pass — 129 server-rendered Q/As; seven on the NoJS article sample. |
| AE09 | FAQ reuse retains styling and valid markup after Blogger editing. | Partial — snippets/local checks pass; controlled saved Compose/HTML round-trip on a test blog remains unverified. |
| AE10 | Answers and important factual statements have reliable supporting sources. | **Fail — F05:** source links are absent, including placeholder references. |
| AE11 | Internal links connect detailed answers to relevant related articles. | Pass — current related links are crawlable; native related-feed behavior has known fallback coverage. |
| AE12 | No unsupported promise of featured snippets, voice answers or FAQ rich results is made. | Pass — FAQ rich-result retirement and lack of guarantees documented; no required answer length imposed. |
| AE13 | Speakable is used only for an applicable supported news/voice use case. | N/A — ordinary engineering blog; do not add it as a generic AEO requirement. |
| AE14 | Page readability remains usable on narrow screens, with keyboard navigation. | Partial — layouts/keyboard work; light contrast fails (F07), text-scaling assessment limited. |
| AE15 | Query intent and actual answer discovery are evaluated with real search/user data. | Unverified — Search Console query data, reader research and answer-engine citations unavailable. |

## 7. Generative discovery, crawler policy and GEO measurement

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| GE01 | Public crawl and HTTP indexing prerequisites permit search discovery. | Pass — wildcard robots allows public paths and restrictive HTTP header is gone; actual indexing remains unverified. |
| GE02 | OAI-SearchBot/Claude-SearchBot and relevant search crawlers are allowed by robots policy. | Pass — current wildcard policy allows public routes; no explicit named allow rule is required. |
| GE03 | Search crawler responses contain the actual article, not a shell/challenge. | Pass — UA-string probes return readable 200 HTML; real crawler IP access is not proven. |
| GE04 | Robots and response index/snippet restrictions are assessed together. | Pass — no current sitewide HTTP restriction contradicts public crawl permission; legal-route HTML policy is separately F03. |
| GE05 | Training preferences are separate from search visibility and user-directed fetching. | Partial — current wildcard allows all; the owner's deliberate training/search choices need confirmation. |
| GE06 | Google Search generative AI inclusion control and inheritance are reviewed. | Unverified — requires Search Console Settings > Search generative AI; default behavior does not prove this property's choice. |
| GE07 | The content remains public, textual, stable and accessible without application JS. | Pass — HTTP and NoJS checks. |
| GE08 | Important entities, author identity and canonical links are consistent. | Partial — current author identity/canonicals work; configured Page specialization still falls back (F03). |
| GE09 | Answers cite verifiable evidence and avoid invented source attribution. | **Fail — F05/F06:** missing source links/placeholders and edition inconsistency. |
| GE10 | Structured data describes visible content; no special fabricated AI schema is added. | Pass — microdata matches actual article/FAQ entities. |
| GE11 | llms.txt/Markdown/citation meta tags are treated as optional, not guaranteed ranking signals. | Pass — missing Blogger llms files are expected; no Google visibility penalty is assumed. |
| GE12 | No keyword stuffing, prompt injection for crawlers or hidden instructions attempt to manipulate AI answers. | Pass — no such mechanism found in the theme or exported content. |
| GE13 | Real AI citations/impressions are measured separately from ordinary search traffic. | Unverified — Google generative AI report/Bing AI Performance/private analytics not available. |
| GE14 | Bot hits are verified using service documentation/IP evidence rather than user-agent strings alone. | Unverified — public UA probes are synthetic; Blogger server logs are unavailable. |
| GE15 | GEO claims distinguish accessibility/eligibility from actual inclusion, citation or ranking. | Pass — this audit makes no citation/ranking guarantee and records provider/tool limits. |

## 8. Images, feeds and performance

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| PF01 | Article/social image URLs resolve with image MIME types. | Pass — 40 unique URLs checked, all 200. |
| PF02 | Images use HTTPS and have stable, owner-controlled hosting. | Partial — HTTPS works; GitHub `main` URLs/proxies depend on repository and filenames remaining available (F11). |
| PF03 | Image payloads are proportionate to their display size and use efficient formats. | **Fail — F11:** planning cover 1,792,064 bytes; profile source 823,356 bytes. |
| PF04 | Width/height or equivalent aspect-ratio reservation minimizes layout shifts. | Partial — many dimensions are present; observed shifts remain (F12). |
| PF05 | Responsive source selection, caching and below-fold lazy loading are appropriate. | Partial — proxy thumbnails/lazy listing images help; original body images lack a complete responsive-source strategy (F11). |
| PF06 | The LCP candidate is discoverable early and not unnecessarily lazy-loaded. | Pass — homepage portrait is inline; article title is the sampled mobile LCP candidate. |
| PF07 | Render-blocking CSS/font dependencies and repeated inline payloads are assessed. | Partial — F11/F12: 86,567 bytes of inline CSS and about 41 KB inline JS recur; font loading is external. |
| PF08 | Repeated cold-cache lab measurements have clear device/network methodology. | Partial — one controlled navigation per each of three URLs; diagnostic baseline only, not statistically repeated RUM. |
| PF09 | LCP, CLS and INP are assessed with field data at the appropriate percentile. | Unverified — PSI API quota failure; no CrUX/owner field report; no field INP measurement. |
| PF10 | Lab layout shifts are investigated with correct measurement limits. | **Fail — F12:** fresh observed sums are about 0.00–0.19; causal tracing/session-window and field validation still needed. |
| PF11 | JavaScript errors, failed resources and excessive long tasks are assessed. | Partial — no page errors in 12 fresh browser cases; individual long-task/resource details are in performance-evidence.json; no field responsiveness claim. |
| PF12 | Every image has appropriate descriptive alt text or an intentional decorative empty alt. | **Fail — F18:** ten live Popular-sidebar thumbnails omit alt. Redundant thumbnails can use explicit empty alt; informative images need meaningful alternatives. |
| PF13 | RSS/Atom feeds are reachable, current and intentionally expose the chosen content scope. | Pass — RSS and native JSON feeds work; native source feed setting should still be owner-reviewed. |
| PF14 | Sitemap image/video extensions are used when applicable rather than treated as mandatory. | Partial — images are discoverable in HTML; a dedicated image sitemap is optional, video is not currently applicable. |
| PF15 | HTTP compression, asset caching, secure delivery and mixed content are checked. | Pass — gzip responses, HTTPS images and working asset caching observed; no critical mixed-content failure in sampled views. |

## 9. Responsive usability and accessibility

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| UX01 | Main content renders at desktop, tablet and mobile widths without horizontal overflow. | Pass — four routes × 1440/768/390 px, 12/12 cases. |
| UX02 | Main article text, headings, code and tables remain readable on mobile. | Pass — representative article and Page screenshots; all tutorials not visually inspected individually. |
| UX03 | Mobile navigation opens, closes and supports Escape. | Pass — live interaction checks. |
| UX04 | Theme switching works and persists across navigation. | Pass — live light/dark persistence test. |
| UX05 | Light/dark text contrast meets applicable WCAG AA requirements. | **Fail — F07:** light CTA/link text ~3.22–3.40:1 where 4.5:1 is needed; sampled dark article had no measured failures. |
| UX06 | Keyboard users can skip repeated navigation and see meaningful focus. | Partial — first Tab reaches Skip to main content; full focus/reading-order certification not performed. |
| UX07 | Controls and search inputs have accessible names/labels. | Pass — no unnamed controls found in representative browser DOM checks. |
| UX08 | Touch target sizing/spacing meets applicable minimums and inline exceptions are considered. | Partial — many small inline links; size-only candidates are not declared WCAG failures without spacing/exception review. |
| UX09 | One clear visible page title and a coherent heading hierarchy exist. | Partial — article/Page titles clear; inherited hidden Header1 and generic utility headings require cleanup (F14). |
| UX10 | Landmarks, links, buttons and table semantics support assistive navigation. | Pass — main/skip/search/semantic elements present; screen-reader-specific testing remains limited. |
| UX11 | Important functionality/content does not depend exclusively on JS. | Pass — readable articles/FAQs/navigation without JS; enhanced TOC/theme switching appropriately require scripts. |
| UX12 | Text resizing, 320px reflow and physical-device behavior are tested. | Unverified — 390px emulation is not a full 320px/400%-zoom or physical-device certification. |
| UX13 | Reduced-motion preferences avoid disruptive transitions/scrolling. | Partial — source has a reduce-motion override; live assistive preference testing not comprehensive. |
| UX14 | Ads, comments, overlays and third-party widgets do not obstruct reading. | Partial — no obstructive overlays observed; comments submission/moderation and future ads not exercised. |
| UX15 | Screen readers, cross-engine compatibility and assistive technologies are included in release validation. | Unverified — Chrome automated audit only; no Firefox/Safari or physical assistive-technology certification. |

## 10. Blogger publishing, reuse and operations

| ID | Audit control and how to verify it | Result and evidence |
| --- | --- | --- |
| OP01 | Generated XML/widgets are valid and avoid previously rejected settings/functions. | Pass — existing 20-check suite passes, with its local-compiler limitations. |
| OP02 | A hosted regression suite compares Blogger expectations with native output. | **Fail — F04:** current local tests miss live description/route behavior; keep HTTP restriction as a future regression check. |
| OP03 | Native Posts and Pages can be added without source edits or content reimport. | Pass — supported by template and starters; no native content was created during this audit. |
| OP04 | Search description availability and publishing instructions are clear. | Partial — guide exists; native override behavior requires controlled hosted verification (F02/F04). |
| OP05 | Native Labels/category and keyword priority are documented accurately. | Partial — intended source behavior is documented, but migrated live keyword branches diverge (F03). |
| OP06 | FAQ/summary/source/code snippets are reusable and their placeholders obvious. | Pass — 13 starter/snippet files; live article blocks readable. Saved-editor round-trip remains a manual check. |
| OP07 | Build configurations are isolated and a generic preset does not leak source identity. | Pass — separate-owner local build test passes. |
| OP08 | Layout-only edits cannot silently leave stale owner/profile/SEO metadata unnoticed. | Partial — F15: visible gadget text and build-time schema are separate sources; docs warn, but synchronization is manual. |
| OP09 | Multi-author profiles/schema support the intended publishing model. | N/A for current single-owner site; a future multi-author reuse needs explicit profile/schema work (F15). |
| OP10 | Theme backups, version control and an identifiable deployed build exist. | Partial — source commit known; precise hosted build provenance and dashboard backups are unverified (F04). |
| OP11 | Search Console/Bing ownership, sitemap submission and indexing/crawl reports are reviewed. | Unverified — private account/settings required. |
| OP12 | Search, AI, referral and conversion measurement has a consent-appropriate baseline. | Unverified — private analytics/consent configuration unavailable; public snippets alone cannot prove reporting works. |
| OP13 | Indexing/crawl/error/content-change monitoring and a maintenance owner are defined. | Unverified — F17: no operational evidence supplied; add an owner-reviewed process next. |
| OP14 | LocalBusiness/Product/Review/Video/News enhancements are used only when genuinely applicable. | N/A — no store, local-service listing, review inventory, video library or news publication requiring those enhancements identified. |
| OP15 | Future fixes have owners, severity, dependencies and measurable acceptance criteria, with audit evidence retained. | Pass — this snapshot, report, evidence files and fix backlog provide that handoff; no product fixes applied. |
