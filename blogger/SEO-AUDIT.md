# React to Blogger SEO/AEO/GEO audit

Reviewed 5 November 2026. This audit distinguishes source-code behavior from live Blogger settings. React source metadata and its prerender plugin are preserved; this change extends only the Blogger exporter/template and reusable publishing tools.

## Source application checked

- `src/hooks/useSEO.ts`: browser title/description/canonical, Open Graph/Twitter, robots, keywords, author/article/citation fields and JSON-LD graph.
- `src/lib/seoKeywords.ts`: curated keyword deduplication, token fallback, branded title builder and description builder.
- `src/pages/Index.tsx`, `BlogPost.tsx`, `About.tsx`, `Contact.tsx`, `PrivacyPolicy.tsx`, `CookiePolicy.tsx`: route schemas, visible content, FAQs, author data and legal noindex policy.
- `plugins/prerender-posts.ts`: build-time readable route HTML; format-independent, deduplicating metadata upserts; canonical/social data, JSON-LD, feeds/sitemaps and discovery exports.
- `public/robots.txt`, `public/llms.txt`: source hosting's crawler/discovery configuration.

The browser hook alone is not the crawler implementation. The prerender plugin emits route-specific metadata in static HTML and must continue to do so under AGENTS.md. It uses the raw excerpt for some descriptions where the client uses the description builder, and publication time for some modified-date fields. Client article tags use numbered keys while the static plugin uses repeated standard `article:tag`. These source differences were recorded rather than copied into Blogger or changed outside scope.

## Parity and platform decisions

| Feature | React application | Blogger implementation |
| --- | --- | --- |
| Crawlable title/canonical/social tags | Build-time prerender upserts plus client navigation updates | Native XML branches render one tag per key on every response, independent of scripts. Canonical uses Blogger's domain/URL. |
| Optimized imported titles/descriptions | Curated helper functions and route `useSEO` calls | Post helpers reused during export; Page `useSEO` values captured during SSR. Current visible wording remains intact; explicit per-URL overrides supported. |
| Newly published content | Requires a source content/build cycle | Native title/Search description, author, dates, image and Labels; no source build for routine publishing. Set a unique Search description. |
| Keywords | Curated post keywords, helper fallback and Page lists | Deduplicated imported/configured phrases; native post Labels as schema keywords; optional Page HTML snippet; optional legacy head tags for known URLs. Google ignores meta keywords for ranking. |
| Article structure | BlogPosting JSON-LD and readable article content | Server-rendered BlogPosting microdata with canonical ID/mainEntityOfPage, headline, description, language, URL, author, publisher, native timestamps, image, section, keywords and free-access flag. No fragile JSON escaping of dynamic Blogger HTML. |
| Identity and listings | Blog, Person, CollectionPage/ItemList | WebSite/Blog/Person plus CollectionPage/ItemList/ListItem in server HTML. Reusable owner role, profiles and Page links come from config. Single-owner bio/role model matches the existing theme. |
| About/Contact/Pages | About ProfilePage/Person, ContactPage and WebPage graphs | WebPage base plus semantic additionalType and owner mainEntity on configured About/Contact paths. Ordinary native Pages get WebPage. No invented employer, education or location claims. |
| Breadcrumbs | Route-specific BreadcrumbList | Canonical Home/current item BreadcrumbList on posts/Pages. Adds no visible navigation or spacing. |
| FAQ/answers | Visible FAQ/TL;DR and FAQPage schema | Existing styled FAQ/TL;DR preserved; optional snippets for new content. FAQ rich results are retired; schema is not a visibility guarantee. |
| Speakable | A standalone SpeakableSpecification | Not copied as a generic GEO feature; the source's orphan entity is not needed for ordinary blog discovery. |
| Citation/discovery | Citation meta, visible citation panel, `llms*`/posts.json | Existing visible citation UI, author evidence, source-link snippet, native RSS/Atom and sitemaps. No invented scholarly citation dates or author claims. No fake Blogger root text endpoints. |
| Robots/noindex | Route robots metadata and host robots.txt | Server meta policy with configurable noindex paths and full snippet permissions. Host robots/settings require dashboard configuration; a generated destination-specific example is supplied. |
| Images/internal links | Static route image data and source routes | Native featured image with import/fallback support; Blogger permalinks, native label links, existing related content and RSS/Atom. Sitemap generation remains Blogger-owned. |
| Performance/presentation | Existing compiled design and JS app | Existing CSS/enhancements preserved. New semantic nodes contain only metadata; no font, color, spacing, layout or content redesign. |

The limited differences are intentional: source-only employer/education fields may not match another owner; word count is not injected as stale build data into native posts; native dates are preferred; article category/keywords are scoped inside Blog1 instead of inventing global post variables. Full social titles use native wording while document titles may use imported optimization. See [Google's Article markup formats](https://developers.google.com/search/docs/appearance/structured-data/article) and [AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Reuse architecture

`scripts/lib/blogger-seo.mjs` builds the commented metadata/semantic sections. `seo` config controls language, homepage title/keywords, legacy keyword emission, noindex paths and per-route metadata. Defaults and input arrays are copied independently between builds to prevent identity leakage. The generic native preset contains no source-owner SEO data or project routes. `seo-routes.json` makes imported/configured defaults reviewable.

Head descriptions prioritize native Search description over generated fallbacks. Imported optimized titles are used only while Blogger's native title still matches the original; explicit overrides remain deliberate. New native Labels provide structured keywords; imported route phrases take priority on migrated URLs. Paths and metadata are validated and XML-escaped, including quotes/ampersands.

Comments in `blogger/template.xml` identify SEO titles/descriptions/canonical, legacy keywords, social previews, robots, identity/breadcrumbs, Page semantics, listing semantics and article/answer content. These are invisible sections that preserve the UI.

## Verification and remaining live actions

The local suite checks all 23 post and four Page routes without script execution, one canonical/description/social tag per key, imported keyword parity, schema identity/dates/images, native Labels/descriptions, title edits, escaped overrides, noindex, new Page snippets and a separate generic owner build. Existing XML/widget compatibility and progressive reading-tool checks remain included.

All 20 checks passed. Eight Chrome before/after screenshots (home, code article, About, Contact at 1440px and 390px) have identical dimensions and zero differing pixels, with no horizontal overflow. The original CSS and enhancement JavaScript files are unchanged. The design detector only flagged the existing Roboto choice, deliberately retained under the style-preservation requirement.

Live endpoints checked: `/robots.txt`, `/sitemap.xml`, `/sitemap-pages.xml` returned HTTP 200; the sitemaps list 23 posts/four Pages. **The current wildcard `Disallow: /` is a discovery blocker for many non-Google crawlers.** It must be changed through Blogger Settings; the theme cannot remove it. No authenticated dashboard changes, Search Console submissions, hosted theme compilation or ranking/indexing claims are made by this local build. Follow [SEO-GUIDE.md](SEO-GUIDE.md) when installing and publishing.
