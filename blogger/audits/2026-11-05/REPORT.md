# Blogger SEO, AEO and GEO audit report

**Site:** https://ru5iru.blogspot.com/  
**Date:** 5 November 2026, Asia/Colombo  
**Source baseline:** `712eddfd50f0835133b880286f3fe833dcb0ff73`  
**Scope:** audit and documentation only. No theme, CSS, JavaScript, published content, configuration or Blogger dashboard settings were changed. New scripts in this audit directory collect/aggregate evidence; they are not product fixes.

## Verdict

**The owner's visibility change is effective.** Fresh public responses for home, all 23 posts and all four Pages have **no X-Robots-Tag**. The former sitewide HTTP noindex/nofollow blocker (F01) is resolved. Public crawl/index eligibility is restored; actual inclusion, selected canonicals and rankings still require Search Console evidence. [Robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

**The next priority is metadata and content quality.** All 28 core routes still share one generic head description. Configured route-specific metadata/legal policy does not activate reliably on native Blogger. Published citation placeholders and confirmed OWASP inconsistencies also remain.

There are **16 active findings and verification gates**: six P1, nine P2 and one P3; no open P0. F15 is a conditional reuse risk and F17 an owner-only verification gate, not a claim that private configurations are broken. Finding IDs remain stable after removing the out-of-scope comparison finding. Start with the [50-item implementation checklist](IMPLEMENTATION-CHECKLIST.md); the [150-control audit](CHECKLIST.md) supplies the broader verification matrix.

| Evidence | Fresh Blogger result |
| --- | --- |
| Published content coverage | Home + 23 posts + four Pages = 28 routes, all HTTP 200 |
| Public routes carrying HTTP noindex/nofollow | **0/28** |
| Distinct core titles / distinct head descriptions | 28 / **1** |
| Matching self-canonical URLs | 28/28 |
| Posts discoverable through home/pagination | 23/23 across four listing pages |
| Discovered internal destinations / additional fetches | 130 / 99; no failed destination |
| Distinct image URLs / failed | 40 / 0 |
| Article entities / visible FAQs | 23 / 129 |
| External article-body source links | **0 across 23 posts** |
| Published source placeholders | Six markers in three posts |
| Fresh Chrome responsive cases / overflow / page errors | 12 / 0 / 0 |
| Blogger automated compatibility checks | **20/20 pass** |

Machine-counted request totals and timestamps are in [summary.json](summary.json) and [evidence.json](evidence.json). All current report data and request records cover Blogger only.

## Method and limits

1. Review the Blogger template, SEO/markup builder, configuration, preview evaluator, editor snippets, styles/enhancements and exported post/Page bodies. Review title/description defaults as Blogger output, without auditing the separate application.
2. Rediscover posts and Pages through native sitemaps; fetch every content URL without scripts. Inspect headers, canonicals, descriptions, social fields, headings, schema, FAQ content, links and images. Follow all four native listing pages.
3. Recheck mobile/desktop/tracking variants, search/empty/label/archive views, two synthetic missing routes, feeds, HTTP first-hop redirects and optional endpoints. Check 130 internal destinations, 40 images and outbound navigation/comment-frame URLs. LinkedIn automated status 999 is a tool/access limitation, not proof of a broken human-facing profile.
4. Recheck Googlebot, bingbot, OAI-SearchBot and Claude-SearchBot user-agent strings on home/Injection. These simulated requests do not authenticate a provider's real crawler IP or prove indexing/citation.
5. Fresh Chrome checks cover home, Injection, About and Contact at 1440, 768 and 390px; navigation/Escape, dark persistence and first keyboard focus are exercised. Three routes are also revisited with JavaScript disabled.
6. Fresh cache-disabled mobile lab navigations cover home, Injection and Planning: 150ms latency, 1.6Mbit/s download, 4x CPU slowdown. Each URL has one navigation in this recheck. Observed layout-shift sums are not official session-window CLS; no field INP or physical-device certification is claimed.
7. The independent Schema.org sample and native-post fixture evidence are retained from the earlier same-day audit and labeled as such; they are not freshly rerun hosted-editor tests. Schema.org accepted Injection with zero errors/warnings. Google's Rich Results Test was unavailable after its sign-in error; the public PageSpeed API quota result is retained in fresh requests. Neither tool limitation is a site failure.

Private Search Console/Bing reports, selected canonicals, actual indexed URLs, AI citations, field Core Web Vitals, authenticated editor behavior and complete expert fact checking remain unverified. All 23 posts were structurally checked; every tutorial program and personal/health/legal claim was not independently certified. No account setting, theme, post, Page or style was changed by this audit.

## Resolved setting: former F01

The owner enabled **Visible to search engines**. The recheck confirms no restrictive HTTP X-Robots-Tag on all 28 content routes, the 12 Chrome cases and sampled crawler-string responses. Keep this as a regression check; do not list the previous restriction as an outstanding fix. Search Console confirmation remains B03/B04, because index eligibility does not guarantee indexing. Legal-page HTML policy still needs F03 correction.

## Active findings

### F02 — P1: all posts and Pages share one generic head description

**Confirmed:** all 28 core routes serve the same 91-character site description in description/OG/Twitter fields. For example, Injection's head describes the general software-engineering blog instead of Injection. Its structured article description is instead a body snippet starting with `TL;DR`. The description actually has 91 characters as counted from captured text, independent of whitespace around the HTML tag.

**Location:** `scripts/lib/blogger-seo.mjs:59`, head/global versus Blog-widget description context; native settings/imported Search descriptions are not publicly inspectable. Source output contains distinct defaults, but live output does not select them. **Impact:** poor relevance and repetitive candidates for search/social snippets; search engines may still generate their own snippets. [Description guidance](https://developers.google.com/search/docs/appearance/snippet)

**Acceptance:** distinct relevant server-rendered descriptions for all 27 content URLs; a saved native Search description wins after publication and later edits; home retains its site description. Do not solve this solely by client-side mutation.

### F03 — P1: route-specific conditions diverge on native Blogger

**Confirmed symptoms:** curated head keywords appear only on home; migrated post schema uses Labels instead of curated phrases; About/Contact lack configured additionalType/mainEntity; legal URLs emit the default index HTML tag instead of configured noindex. Imported optimized document titles also fall back to native originals. Missing legacy keywords alone is not a ranking defect; the combined differences demonstrate inactive route behavior.

**Location:** `scripts/lib/blogger-markup.mjs:17` and `scripts/lib/blogger-seo.mjs:35`. Generated comparisons concatenate `data:blog.homepageUrl` with a path and compare native URL data; the preview evaluates them as JavaScript strings. **Root cause status:** native URL/DSL evaluation is the leading suspect, not an experimentally proven operator fix. No hosted diagnostic theme was installed in this audit.

**Acceptance:** verify URL-aware route matching in a Blogger test blog; every configured route selects its intended branch in raw HTML on normal/mobile/custom-domain cases. Validate legal exclusions and native author overrides before rollout.

### F04 — P1: local tests cannot establish hosted SEO correctness

**Confirmed:** 20 local tests pass while F02/F03 fail live. `blogger-preview.mjs:25` invents the data context and evaluates expressions using JavaScript at line 51; it does not reproduce Google's URL types, HTTP headers, widget retention or global/widget data scoping. The tests check expected fixture strings, not native deployment behavior.

**Impact:** false confidence during theme releases, including reoccurrence of previously observed Blogger compatibility issues. **Acceptance:** keep useful local tests, add a read-only hosted response comparison after restore, and require actual newly saved post/Page/description/FAQ cases on a test blog. Record the deployed source/config version. An XML parse or screenshot match is insufficient.

### F05 — P1: source evidence is absent and placeholders are published

**Confirmed:** zero external links in all 23 article bodies. Six `[SOURCE: …]` markers occur in Cryptographic Failures (three), Broken Access Control (one), and Work-Life Balance (two). Related internal links and “Cite this post” help navigation/attribution but do not substantiate the post's factual claims.

**Impact:** readers and answer systems cannot conveniently verify standards, research or incident/statistical claims. The marker text looks unfinished. Evidence supports reliability; links do not guarantee citations or rankings. [Helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**Acceptance:** replace markers with actual primary-source links, link claims that need evidence, and distinguish personal experience from general data. Review supplied snippets for leftover placeholders after saving. Preserve the present visual components.

### F06 — P1: security content contains edition/statistical inconsistencies

**Confirmed:** Injection's question about the 2025 release answers with A03 terminology. The official 2025 list has Injection at A05 and Cryptographic Failures at A04; A03/A02 describe their 2021 positions. Crypto's body explicitly discusses 2021, so its historical content is not categorically wrong, but the edition needs consistent labeling across title/lead/FAQ/metadata. [OWASP 2025](https://top10.owasp.org/2025/)

Broken Access Control says 94% of tested applications showed a weakness. OWASP's 2021 figure describes applications **tested for** that category, with an average incidence rate of 3.81%; testing coverage must not be rewritten as prevalence. [OWASP's original factors and overview](https://top10.owasp.org/2021/A01_2021-Broken_Access_Control/)

**Location:** the published Injection, Cryptographic Failures and Broken Access Control posts and their exported bodies in `blogger/output/content.json`. **Acceptance:** correct or explicitly contextualize edition/statistical claims and synchronize visible answers, titles, descriptions, schema, keywords and related anchors. Independent expert review remains needed for other high-stakes claims.

### F07 — P1: light-theme contrast falls below AA text requirements

**Confirmed examples:** homepage Contact me/Older posts/Search text is approximately **3.40:1** at 16px against the primary button color; the article's 14px TL;DR label is approximately **3.22:1**. These ordinary-size texts need 4.5:1 under WCAG 1.4.3. The sampled dark article had no failures in the same flat-color calculation; gradients/opacity complexities were skipped, so this is not a full accessibility certification.

**Location:** primary/foreground token combinations in the served Blogger stylesheet; `browser-evidence.json` contains computed colors, sizes and examples. **Impact:** reduced readability and accessibility; this is not a direct claim about a ranking penalty. [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

**Acceptance:** approve the smallest visual-compatible contrast adjustment in the next fix phase and remeasure both themes. No colors/styles were altered by this audit.



### F09 — P2: new native posts without Search description get a generic head fallback

**Code/fixture confirmed:** a fresh unknown URL with unique body text and no authored description gets the blog description in the head, while structured description gets the unique body snippet. A populated fixture Search description produces the desired text. See `native-fixture-evidence.json`; this is a local behavioral limitation, not a newly published live test post.

**Acceptance:** document/enforce a unique Search description at publishing and consider a tested native content-specific fallback. Routine posts should not require a configuration rebuild merely to have relevant descriptions. Test the actual saved editor fields on Blogger.

### F10 — P2: Blogger-generated title defaults cut meaningful text

**Confirmed in the Blogger artifact:** 18 exported post metadata defaults contain ellipses, including mid-word cuts. Examples include `Why Proper Planning Is a Must in a S…` and `Injection OWASP Top 10: A03 Explained f…`. Current native Blogger titles are complete because configured route overrides fall back (F03); this is a latent default-quality issue that could become visible when route matching is repaired.

**Location:** `blogger/output/seo-routes.json` and `content.json` generated defaults. **Acceptance:** preserve full native titles or supply meaningful Blogger-specific editorial overrides; do not activate mechanically truncated defaults when fixing F03. Avoid a rigid 60-character rule. [Google title guidance](https://developers.google.com/search/docs/appearance/title-link)

### F11 — P2: heavy image payloads and repeated page overhead

**Confirmed:** planning cover is **1,792,064 bytes**; the profile source is **823,356 bytes**. All 40 image URLs work, but raw GitHub `main` paths depend on repository/filename permanence. Body images lack a complete responsive-variant strategy. Fresh home HTML is 370,879 decoded bytes; article samples are about 220–226 KB. Each core page repeats 86,567 bytes of inline CSS and about 40–42 KB inline JS. Decoded sizes are not compressed transfer sizes.

**Impact:** avoidable mobile load/parse cost and hosting fragility, particularly for the Planning article. Fresh throttled load timings are recorded in the performance table below. **Acceptance:** optimize/resize images and review shared overhead/caching while retaining the exact visual design; recheck social images and native-host constraints. [Image guidance](https://developers.google.com/search/docs/appearance/google-images)

### F12 — P2: observed layout shifts need diagnosis and field validation

Fresh single-navigation measurements under the methodology above:

| Blogger route | LCP observation (ms) | Observed shift sum | Load event (ms) | Long tasks total (ms) |
| --- | ---: | ---: | ---: | ---: |
| / | 1932 | 0.186 | 3147 | 396 |
| /2026/06/injection.html | 1248 | 0.190 | 6363 | 1037 |
| /2026/06/proper-project-planning.html | 1660 | 0.000 | 11371 | 178 |

These are diagnostic observations, **not** official session-window CLS, percentile field CWV or repeated-run statistics. Font swaps and DOM relocation are suspects, not proven causes.

**Acceptance:** trace shift sources, stabilize relevant layout/font/image reservations, then measure proper CLS/INP/LCP using repeated lab and available real-user data. Static screenshots alone cannot measure loading stability. [Web Vitals methodology](https://web.dev/articles/vitals)

### F13 — P2: policy identity and service claims need destination review

**Confirmed:** current Privacy/Cookie content references `iamrusiru.com`, while this site is `ru5iru.blogspot.com`. Legal pages carry March 30, 2026 dates inherited from source. Their actual applicability to Blogger's comments, cookies, feeds and analytics has not been confirmed.

**Location:** published Privacy/Cookie Pages and their exported HTML in `blogger/output/content.json`. **Acceptance:** owner reviews actual domain/services, obtains appropriate policy review if needed, and updates truthful content/dates. This audit does not certify legal compliance.

### F14 — P2: utility-view headings are generic; inherited Header widget remains

**Confirmed:** sampled search/label/archive views display the blog title as their main heading rather than the query/category/month context. An inherited `Header1` adds a second raw H1 on listing views and is hidden by existing sidebar CSS. The extra hidden H1 is cleanup, not an automatic SEO penalty or a second visible title.

**Location:** `blogger/template.xml:78` uses `data:view.title`; retained native `Header1` is visible in raw captured HTML but absent from the local fixture. **Acceptance:** meaningful native utility headings and deliberate widget retention without altering design or removing useful existing Layout content.

### F15 — P2 conditional reuse risk: visible identity and schema can drift

**Confirmed architecture:** Layout gadgets edit visible branding/links; build configuration separately supplies owner/publisher/profile schema and shared author biography. A new owner who only changes gadgets can retain the previous owner's semantic/bio values. The current site's owner fields match; a multi-author model is not currently supported independently per author.

**Acceptance:** provide a single-owner reuse acceptance checklist or synchronize intended identity fields, prove another-owner native deployment and clearly state multi-author limitations. Do not claim the current site's author is wrong. Existing local isolation tests should remain.

### F16 — P3: 404 canonical paths contain doubled slashes

**Confirmed:** the two synthetic missing URLs return real 404/noindex, but canonical values look like `https://ru5iru.blogspot.com//seo-audit-missing-20261105.html`. **Impact:** low because the response is already excluded; clean error metadata is desirable.

**Acceptance:** omit or normalize error canonicals/associated social URL metadata while preserving real 404 behavior. Check Blogger-provided URL data rather than hiding the problem with a successful response.

### F17 — P2 verification gate: operational visibility and ownership are unverified

No private account was inspected. Verify Search Console ownership/indexing/crawl/security/manual-action reports, sitemap submission, actual selected canonicals, Bing Webmaster/AI Performance, analytics and referral/conversion baselines, backups and change monitoring. Do not assume that absent public evidence means these are unconfigured.

Google now documents **Settings > Search generative AI** inclusion/inheritance and a dedicated generative AI performance report. Their values for this property are unverified. These are separate from training crawler policy. [Control](https://support.google.com/webmasters/answer/16908024), [performance report](https://support.google.com/webmasters/answer/16984139), [Bing AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)

**Acceptance:** owner-reviewed settings/reports and baseline exports; distinguish confirmed eligibility, actual indexing, AI impressions/citations, clicks and conversions.

### F18 — P2: live Popular-sidebar thumbnails omit text alternatives

**Confirmed:** ten images in the live sidebar block headed “Popular” have no alt attribute. They sit beside named post links, rather than being image-only links. The block is not present in the versioned template/local fixtures, so its exact saved Layout implementation needs owner/developer inspection. See `widget-accessibility-evidence.json` for the captured image elements.

**Impact:** assistive technology may announce filenames or other unhelpful image information. **Acceptance:** use explicit empty alt for redundant decorative thumbnails, or meaningful alternatives where an image conveys additional information; preserve layout and named post links. Confirm zero missing alt attributes in served markup after the appropriate gadget/theme update. [WCAG non-text content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)

## Interface audit required by the Impeccable audit workflow

**Implementation-integrity verdict: release-readiness fails** because live metadata contradicts the fixture expectations. The visual system itself is coherent and deliberately preserved. The detector's only source finding was the existing Roboto choice; that is a brief-approved stylistic preference, not an SEO defect.

| Dimension | Limited evidence-based score | Reason |
| --- | ---: | --- |
| Accessibility | 2/4 | Names/skip/menu work; ordinary-size light text contrast fails. |
| Performance | 2/4 | Heavy assets, observed shifts/long tasks; field performance unverified. |
| Theming | 3/4 | Token system and dark persistence work; light contrast needs attention. |
| Responsive design | 3/4 | 12 cases fit; full reflow/target-spacing/physical-device audit incomplete. |
| Implementation integrity | 2/4 | Consistent components, but native metadata and test/deploy contract diverge. |
| Total | **12/20 — significant work remains** | An interface-audit judgment, **not** an SEO ranking/AEO/GEO score or WCAG certification. |

Applicable follow-up UI commands, only when the user starts fixes: `$impeccable harden` for native edge states/identity, `$impeccable optimize` for image/layout-shift work, `$impeccable adapt` if target/reflow checks confirm issues, then `$impeccable polish`. Re-run `$impeccable audit` afterward. These commands are optional workflow mappings, not changes made now; they can be requested individually or in a chosen order.

## Good behavior to preserve

- Public articles, all FAQs and main navigation remain readable without scripts.
- Titles/canonicals/social image fields are server-rendered and deduplicated on all core routes.
- Native dates, visible author, article/body semantics, WebSite/Blog identity and breadcrumbs exist.
- Schema.org accepts the sampled article graph without errors/warnings.
- All core/linked internal destinations and all checked images load; real missing routes return 404.
- Mobile menu/Escape, dark persistence, skip link, TOC/code controls and responsive layouts work in the tested scope.
- The generic configuration passes another-owner isolation checks, and existing styles remain untouched.

## Avoid unnecessary “SEO fixes”

Do not add legacy keyword stuffing, artificial review/rating markup, hidden AI prompts, mandatory FAQ lengths or word-count quotas. Microdata does not need replacement simply because JSON-LD is popular. Missing Blogger `llms.txt` is not a Google defect; no special AI schema is required. FAQ cards remain useful to readers, but Google retired FAQ rich results in May 2026. [Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [FAQ retirement](https://developers.google.com/search/updates)

OpenAI and Anthropic distinguish search crawlers from training/user-directed agents. Current wildcard rules permit public crawling, but access is not proof of indexing or citation. Any later training preference should be an explicit owner choice. [OpenAI bots](https://developers.openai.com/api/docs/bots), [Anthropic bots](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

Blocking utility paths in robots.txt also prevents compliant crawlers from reliably reading those pages' noindex tags. If any such URLs are already indexed, confirm the appropriate removal/index-control approach through URL Inspection; the current crawl block alone is not proof of delisting.

## Next step

Use the implementation checklist to start the fix phase: prove native route/description behavior, correct source accuracy/evidence, improve publishing defaults, then address measured accessibility/performance and private-tool verification. The visibility setting is already resolved. **No fixes have been applied in this audit.**
