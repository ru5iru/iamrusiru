# Blogspot benchmark implementation checklist

HTTP snapshot: 6 November 2026; report completed 7 November 2026, Asia/Colombo. **48 controls** compare measured peer features with current Blogger code and fresh live HTML. This is research only: no fixes were applied. [Method and selection](METHODOLOGY.md), [20-site findings](PEER-PROFILES.md), [prioritized actions](ACTION-CHECKLIST.md).

Peer counts are feature presence in one home/article pair per site, not quality scores or evidence of intentional SEO/AEO/GEO optimization. Zero does not prove a site has no such feature anywhere. Image denominators exclude the one sample with no images. “Not measured” requires private/editor/field evidence. Supported means the theme provides a component/workflow but the full acceptance case is not established.

## Crawling and delivery

| ID | Control | Peers observed | Current theme/code | Current live | Action / acceptance |
| --- | --- | ---: | --- | --- | --- |
| T01 | Successful public HTTPS home and sample article | 20/20 | Implemented | Implemented | Preserve: 28/28 current content URLs return 200. HTTPS availability alone does not prove indexing. |
| T02 | Public root/article crawling allowed by robots policy | 20/20 | Platform | Implemented | Maintain Blogger settings; the selected cohort excludes crawler-disallowed roots, so 20/20 here is selection-biased. |
| T03 | Posts sitemap returns URLs | 20/20 | Platform | Implemented | Native current posts sitemap contains 23 URLs. Do not generate fake XML endpoints in the theme. |
| T04 | Pages sitemap contains published Pages | 14/20 | Platform | Implemented | Current Pages sitemap contains four URLs. An empty peer Pages sitemap can be appropriate when it has no Pages. |
| T05 | One matching HTTPS self-canonical on the article | 17/20 | Implemented | Implemented | Preserve 28/28 matching unique core canonicals; do not copy HTTP or duplicate canonical defects. |
| T06 | Mobile ?m=1 consolidates to clean article canonical | 17/20 | Implemented | Implemented | Fresh home/post/About mobile samples all consolidate correctly. This is representative coverage, not every query parameter. |
| T07 | Intended public content has no accidental index/snippet restriction | 20/20 | Implemented | Implemented | 26 public content routes allow indexing/previews; two legal Pages intentionally emit noindex. No restrictive X-Robots-Tag remains. |
| T08 | Actual article text exists in raw server HTML | 20/20 | Implemented | Implemented | Preserve readable posts/FAQs without client rendering. This criterion is also part of cohort inclusion. |

## Titles, descriptions and social metadata

| ID | Control | Peers observed | Current theme/code | Current live | Action / acceptance |
| --- | --- | ---: | --- | --- | --- |
| M01 | Article title differs from homepage title | 18/20 | Implemented | Partial | All titles are unique, but rename Injection and Cryptographic Failures to match their corrected editions/body/description. |
| M02 | One article-specific head description | 4/20 | Implemented | Implemented | 28 distinct current descriptions; all 23 article descriptions equal prepared defaults. Native authored-field priority still needs an editor acceptance test. |
| M03 | OG title/type/description/URL/image fields | 3/20 | Implemented | Implemented | Preserve server output and correct the two native titles, which also feed social titles. No cached social-card rendering was tested. |
| M04 | Twitter card/title/description/image fields | 3/20 | Implemented | Implemented | Already provided; actual platform preview/caching remains separate. |
| M05 | Representative social-image field is supplied | 15/20 | Implemented | Implemented | Image URL presence is measured; peer image fetches, ownership and appropriateness were not certified. Optimize owned assets separately. |
| M06 | HTML language is declared | 14/20 | Implemented | Implemented | Keep Blogger language aligned with the reusable SEO language setting. |
| M07 | Viewport metadata supports mobile layout | 20/20 | Implemented | Implemented | Preserve current responsive design. Viewport presence does not prove responsive usability on peers. |

## Semantic identity and trust destinations

| ID | Control | Peers observed | Current theme/code | Current live | Action / acceptance |
| --- | --- | ---: | --- | --- | --- |
| S01 | Article/BlogPosting structured entity | 19/20 | Implemented | Implemented | All 23 current posts have BlogPosting. Presence is not a Google eligibility or factual-quality pass. |
| S02 | BreadcrumbList semantic navigation | 2/20 | Implemented | Implemented | Present on current single-item routes. Do not add duplicate JSON-LD merely because peers use that format. |
| S03 | WebSite/Blog semantic identity | 0/20 | Implemented | Implemented | Current site/publisher identities are already rendered server-side. |
| S04 | Structured author property | 9/20 | Implemented | Implemented | Markup and About links exist; the truth/currentness of credentials requires owner confirmation. |
| S05 | Machine-readable datePublished | 15/20 | Implemented | Implemented | Native publication dates exist on all 23 posts; keep original publication dates when correcting content. |
| S06 | Machine-readable dateModified | 7/20 | Implemented | Implemented | Native modification values exist. Do not treat automatic dates or a peer property as evidence of a substantive review. |
| S07 | About/profile destination linked | 9/20 | Implemented | Implemented | Current About returns 200 and specializes to AboutPage. A link alone does not verify expertise. |
| S08 | Contact and policy destinations discoverable | 2/20 | Implemented | Partial | Links work; Privacy still mentions iamrusiru.com. Correct destination identity after reviewing actual services. |

## Answer structure and content

| ID | Control | Peers observed | Current theme/code | Current live | Action / acceptance |
| --- | --- | ---: | --- | --- | --- |
| A01 | Article has H2/H3 section structure | 8/20 | Implemented | Implemented | Keep descriptive headings; avoid adding empty sections to match a numerical score. |
| A02 | Questions are expressed in headings | 0/20 | Implemented | Implemented | Current FAQs provide question headings. Peer count is a punctuation/English-prefix heuristic, not a multilingual comprehension judgment. |
| A03 | Explicit answer summary/TL;DR block | 0/20 | Implemented | Implemented | Current 23 posts have summaries. Peer detection is conservative; an unmarked opening may still answer the question well. |
| A04 | Explicit FAQ section heading | 0/20 | Implemented | Implemented | Current 23 posts expose visible FAQs; retain only useful questions, not keyword variants. |
| A05 | FAQPage semantics match visible Q/A content | 0/20 | Implemented | Implemented | 129 current Q/As retained and post counts match the prepared release. No Google FAQ rich-result promise: the feature was retired. |
| A06 | Semantic list elements in article body | 1/20 | Partial | Partial | Reusable HTML lists are supported, but all 23 exported posts still have literal bullet/number lists in paragraphs. Render real ul/ol/li in prose while preserving appearance; related/source lists are not a substitute. |
| A07 | Semantic comparison/data tables where relevant | 2/20 | Partial | Partial | The table snippet works, but the OWASP guide retains a pipe-delimited Markdown mapping table as paragraph text. Convert that specific table to table/th/td. |
| A08 | Accessible TOC component for longer articles | 0/20 | Implemented | Implemented | Current template has the TOC hook and prior matching-build browser evidence. Peers were not browser-tested; no TOC was detected in sampled raw HTML. |
| A09 | Internal links occur inside article body | 2/20 | Implemented | Partial | Related navigation works; only two current posts have prose-level internal links after excluding related/source/FAQ sections. Add contextual links where useful, or a substantial topic hub. |
| A10 | Outbound links occur inside article body | 17/20 | Partial | Partial | Four current posts contain outbound links, including the corrected references. On peers these can be ads/promotions, not citations. Review primary evidence for claims; never target an arbitrary link count. |

## Images and delivery

| ID | Control | Peers observed | Current theme/code | Current live | Action / acceptance |
| --- | --- | ---: | --- | --- | --- |
| P01 | Every sampled image has an alt attribute | 2/19 | Implemented | Partial | Current article images have alt; ten live Popular-sidebar thumbnails on home still omit it. Inspect the saved widget; use empty alt for redundant thumbnails. |
| P02 | Images declare intrinsic width and height | 5/19 | Implemented | Partial | Current generated images have dimensions; the saved home thumbnails need a reservation review. CSS aspect-ratio can also reserve space; missing attributes alone do not prove CLS. |
| P03 | Lazy-loading attributes are present for images | 7/19 | Implemented | Implemented | Already supported. Raw attributes do not establish correct above/below-fold selection; preserve early LCP discovery. |
| P04 | Responsive srcset variants exist | 6/19 | Missing | Missing | No current srcset was found. Add owned, genuinely fetchable size variants/sizes and optimize the heavy covers; do not invent unhosted URLs. |
| P05 | ImageObject semantic detail is present | 7/20 | Optional | Optional | Current image URL properties are supported schema. ImageObject/dimensions/alt metadata can improve portability if accurate; it is not required simply because peers emit it. |
| P06 | Preconnect hints for external resources | 2/20 | Implemented | Implemented | Font preconnects already exist. Resource hints are not a substitute for measured LCP/CLS/INP. |

## Discovery, generative visibility and owner verification

| ID | Control | Peers observed | Current theme/code | Current live | Action / acceptance |
| --- | --- | ---: | --- | --- | --- |
| G01 | Label/topic navigation is discoverable | 8/20 | Implemented | Implemented | Current label navigation exists; do not index every search/label archive automatically. Consider a genuinely useful curated native Page instead. |
| G02 | Feed discovery links and pagination exist | 16/20 | Implemented | Implemented | Current feeds and listing navigation are present. This research counts peer links, not successful feed subscription or every pagination page. |
| G03 | llms.txt treated as optional rather than a ranking requirement | 0/20 | Optional | Optional | No genuine llms.txt detected among 20 peers. Google does not require it; themes cannot publish arbitrary root text files. No mandatory fix. |
| G04 | Saved native post/Page description and FAQ round-trip | Not measured | Supported | Unverified | Existing hosted route fallbacks work, but a controlled newly saved native post/Page is still needed to prove editor-field priority/retention. |
| G05 | Search Console/Bing actual indexing and AI reports | Not measured | Outside theme | Unverified | Owner verifies selected canonicals, sitemap processing, search queries and AI reports. HTML/schema/Tranco ranks cannot establish citations. |
| G06 | Field performance and real-device/accessibility checks | Not measured | Partial | Unverified | Prior local diagnostics identify heavy assets/shifts/contrast. No fresh peer browser/CWV, field INP, screen-reader or physical-device certification was performed here. |
| G07 | Claims, author identity and policy text are accurate | Not measured | Partial | Partial | All 23 live post bodies match the corrected local bodies and no placeholders remain. Two titles conflict with corrected content; Privacy identity and comprehensive expert checks remain. |
| G08 | Search access, training preference and generative-search controls are deliberate | Not measured | Supported | Unverified | Public robots permits discovery. Review owner Search Console generative-AI choice and separate training preference; user-agent text alone is not verified crawler access. |
| G09 | No ranking myths, hidden AI prompts or forced schema formats | Not measured | Implemented | Implemented | Keep microdata, natural topic phrases and useful answers. Do not copy legacy keywords, schema stuffing, fake ratings or fabricated update dates from peers. No style changes are required by this research. |

## Evidence and code map

- `current-theme-evidence.json`: all 28 local fixtures and live core pages; raw-file references, metadata, schema, images and discovery fields.
- `current-variants.json`: current mobile, utility and 404 cases.
- `content-verification.json`: every live post compared with prepared content, plus title/list/table/policy checks.
- `peer-evidence.json`, `request-manifest.json`, `extra-request-manifest.json`: every peer and its public response provenance.
- [Metadata builder](../../../scripts/lib/blogger-seo.mjs), [native URL conditions](../../../scripts/lib/blogger-markup.mjs), [theme](../../../blogger/template.xml), [body exporter](../../../scripts/build-blogger.mjs), [styled editor snippets](../../../scripts/lib/blogger-editor.mjs), [enhancements](../../../blogger/enhancements.js), [publishing defaults](../../../blogger/post-metadata.json).
- [Current release record](../../../blogger/changes/2026-11-06.md) supplies prior same-build local tests/browser evidence; this research did not rerun a production build or change styles.

Schema counts describe declared types/properties, not graph validity, content accuracy or rich-result eligibility. Outbound links can be promotions, social profiles or downloads; 17/20 is not a count of trustworthy citations.
