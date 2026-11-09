# Recommended actions after the 20-site comparison

Research began 6 November and was completed **7 November 2026, Asia/Colombo**. No changes below were applied during this research. The [48-control comparison](CHECKLIST.md) distinguishes current code, current live output and peer observations. This list is the implementation handoff, not a requirement to copy every feature used by ranked sites.

## Confirmed fixes

- [ ] **R01 — P1, publishing:** update the existing native **Title** for Injection to `Injection OWASP Top 10 2025: A05 Explained for Developers`, and Cryptographic Failures to `Cryptographic Failures: OWASP A04 (2025) and A02 (2021)`. Their bodies/descriptions/keyword defaults are already corrected, but their live titles/H1/social titles still use the old wording. **Accept when:** title, H1, article headline and social fields agree with the relevant edition. Preserve the URLs and publication dates. Evidence: `content-verification.json`, M01. Do not reimport the posts.

- [ ] **R02 — P1, Blogger exporter + existing post bodies:** render actual `<ul>/<ol>/<li>` for prose lists. All 23 current post bodies retain bullet/number list text in paragraphs; existing related/source lists do not repair that structure. The theme/native editor supports semantic HTML, so this needs a Blogger exporter/content correction rather than a new design. **Accept when:** the intended lists have appropriate list elements, exact code examples/escaping are preserved, and appearance/spacing is verified before updating existing entries. Evidence: A06 and every row in `content-verification.json`; W3C content-structure guidance.

- [ ] **R03 — P1/P2, one post/exporter:** convert the OWASP guide's pipe-delimited edition-mapping table into a real data table with appropriate header/data cells. **Accept when:** the published comparison is a `<table>` with meaningful `<th>/<td>` associations, mobile reading remains usable and current styling is retained. Evidence: A07; the `owasp-top-ten` content row. This is a semantic/accessibility improvement, not a claimed ranking penalty for Markdown.

- [ ] **R04 — P2, image delivery:** add real responsive image variants and `srcset`/`sizes`, starting with heavy covers. Six of 19 image-containing peer samples expose responsive candidates; current output has none. **Accept when:** smaller viewports select genuinely smaller public assets, intrinsic layout is reserved and social images still work. Use actual hosting/URLs; do not substitute nonexistent generated files. Preserve the design. Evidence: P04; existing F11/F12 remain relevant.

- [ ] **R05 — P2, saved Blogger gadget:** fix the ten Popular-sidebar thumbnails with missing alt attributes on the live homepage and review their size reservation. Generated article images already have alternatives/dimensions. **Accept when:** redundant thumbnails explicitly use empty alt, informative images have meaningful alternatives, and served widget markup/layout is verified. Inspect the actual saved Layout/HTML gadget, not an assumed versioned source. Evidence: P01/P02, live home image counts; existing F18.

- [ ] **R06 — P2, Page content/owner:** review Privacy Policy identity: its live text still mentions `iamrusiru.com` while this publication is `ru5iru.blogspot.com`. **Accept when:** the Page describes the actual destination/services and truthful review date. Do not automatically rewrite legal/service claims or infer a Cookie Policy defect from the Privacy finding; the Cookie Page did not match this particular text test. Evidence: S08/G07, `content-verification.json`. This is not a legal-compliance certification.

## Improvements justified by reader needs

- [ ] **R07 — P2, editorial/navigation:** add useful prose-level internal links and, if warranted, a substantial Engineering/Start Here Page. Current related navigation works, but only two posts contain prose internal links after related/reference/FAQ sections are excluded. B07 demonstrates a linked resource-index pattern. **Accept when:** each link or hub solves a real navigation need; no thin keyword-variant Pages or blanket indexing of search/label views are introduced. Reuse existing styles. Evidence: A09/G01 and per-post content rows.

- [ ] **R08 — P2, editorial:** continue claim-specific primary sourcing and version/expert checks. Four current posts contain outbound links, including the corrected references; personal opinion does not need irrelevant citations. Peer outbound-link presence is not proof of trustworthy evidence. **Accept when:** factual claims that need support have relevant authoritative references and edition/context, while personal experience is identified accurately. Preserve the already-corrected bodies and zero-placeholder state. Evidence: A10/G07; all 23 live bodies now match the corrected release.

## Verification and maintenance

- [ ] **R09 — P2, native editor:** create/save/edit a controlled native post and Page on a test blog to verify authored Search description priority, FAQ/snippet retention and native Labels/date behavior. **Accept when:** raw hosted output matches the authored fields before/after editor round-trips. Public matching route fallbacks do not prove this private editor acceptance case. Evidence: G04.

- [ ] **R10 — P2, owner reports:** verify Search Console/Bing indexing, sitemap processing, selected canonicals, Search generative AI inclusion/inheritance and available AI/search/referral metrics. Choose training preferences separately from search discovery. **Accept when:** dated property evidence distinguishes eligibility, actual indexing, AI citations/impressions and clicks. The research inspected none of these private reports. Evidence: G05/G08.

- [ ] **R11 — P2, measured performance/accessibility:** repeat appropriate lab/field checks after image/markup fixes; investigate confirmed shift causes and the existing contrast issue. **Accept when:** results use correct CLS/INP/LCP methodology and style preservation is verified. Any color adjustment remains subject to the existing design constraint. Peer HTML bytes, image attributes and Tranco rank are not performance scores. Evidence: G06 and the prior dated audit.

## Already working — preserve

The live build is `31c41a6463051a21979f`. All 28 core routes return 200 and have distinct descriptions; all 23 post descriptions/structured keyword lists and body text match the prepared release. All 129 FAQs remain, no citation/link placeholders remain, About/Contact specialization works, mobile canonicals consolidate, legal exclusions work, search/label/archive headings are contextual, and missing URLs remain 404/noindex without a malformed canonical.

Do not add redundant FAQ/JSON-LD/“GEO” markup, legacy keyword stuffing, fabricated ratings, hidden AI instructions or a mandatory `llms.txt`. They are not the missing implementation revealed by this comparison. General schema parsing/feature counts do not establish factual accuracy, rich results, indexing or citations.
