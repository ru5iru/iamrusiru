# Compatibility verification

The conversion targets Blogger's Layouts engine with v2 widgets, v3 layouts and responsive rendering. It is an independent XML theme.

| Check | Result |
| --- | --- |
| XML | Theme and Atom feed parse successfully. |
| Label1 restore rejection | Removed the invalid `sorting=FREQ` gadget value, restored accepted `ALPHA`, and retained popular-tag ordering through native counts plus JavaScript. A new build-time check rejects the reported setting. Hosted restoration still requires retesting. |
| Layout structure | Section/widget IDs, direct widget children and custom include targets checked. `commentPicker` intentionally inherits Blogger's Blog v2 markup. |
| Content | 23 posts, four pages; dates, labels, exact code text, FAQs and related links checked. |
| No-JavaScript metadata/content | All 27 routes checked in local fixtures. One description/canonical/Open Graph/Twitter tag per key. |
| Imported excerpts | Generated into server-side conditions; no client metadata replacement. |
| Reported `b:with` expression error | Replaced long chained expressions with native `b:if`/`b:elseif` branches for metadata, excerpts and reading times. Regression checks exercise all imported description fallbacks and Blogger-authored overrides. |
| Reported article-only markup failure | Public HTML confirmed the homepage renders six articles while the article URL fails in Blog1. Removed unsupported post-share `urlEncode(...)` calls; the build now checks expression function names and the preview no longer supplies an invented implementation. Corrected theme still needs installation on Blogger for hosted retesting. |
| Views | Home, post, imported Page, new Page, label, search, archive, empty results and errors checked locally. |
| Enhancements | Theme persistence, menu/Escape, reading time, TOC, code copy and disabled-feed fallback tested. |
| Live UI audit | Compared the installed Blogger site with the original app. Corrected script CDATA serialization, route matching, page spacing, card metadata, navigation, FAQ/related layout and native sidebar styling. See `UI-COMPARISON.md`. |
| Real browser | Mobile menu opens/closes with Escape; theme persists across navigation; code-copy reports success. Article has no horizontal overflow or broken images. |
| Original application | All 14 Vitest tests pass, including prerender metadata. |
| Original production build / types | Production build and application TypeScript check pass. Existing CSS-import/FAQ-length warnings remain. |
| Remote images | All 24 URLs returned 200 and image MIME types. See `output/media-check.json`. |
| Runtime | No React, Supabase or MCP dependency in the installed theme; CSS compiled and JavaScript embedded. |
| Customization / reuse | Five native HTML Layout gadgets, validated identity/content configuration and a clean native-content preset. All 15 checks pass, including saved widget edits without JavaScript and a different-owner build without project content. New native gadget editing still requires hosted verification after upload. |
| Style preservation | Eight desktop/mobile before/after screenshots have identical dimensions and zero differing pixels; the compiled original CSS is unchanged. New wrapper rules preserve section spacing. |
| New-content authoring | Generated post/Page starters and nine styled-block snippets; fixed plain new-Page width/padding. All 16 checks pass. Fresh native post/Page previews verified at 1440px and 390px without overflow or script errors; code copy, TOC and FAQ placement work. |
| SEO/AEO/GEO extension | All 20 checks pass: 27 route titles/descriptions/keywords/schema without scripts, native publishing fields, Page keyword snippets, escaped overrides, noindex and owner isolation. Includes two additional optional snippets (sources/keywords). See `SEO-AUDIT.md` and `SEO-GUIDE.md`. |
| SEO UI preservation | Eight fresh before/after screenshots of home, code article, About and Contact at 1440/390px have identical dimensions and zero differing pixels. CSS and enhancement scripts are unchanged. |
| Live crawler configuration | Both native sitemaps return 200 with 23 posts/four Pages. Current wildcard robots.txt blocks general crawlers; fix in Blogger Settings separately from XML restore. |
| Repository lint | Pre-existing errors remain in the prerender plugin, UI types, post content, Tailwind config, tracked temporary bundle and MCP function. No conversion files were reported. |

Google's actual theme compiler, comment editor, Atom importer and social crawler fetches require a Blogger test blog and are **not certified by the local preview**. Importer normalization may require correcting post/page permalinks before publication. See `README.md` for installation and hosted checks.

Chrome comparison at 1440, 768 and 390px: corrected representative previews have no horizontal overflow or JavaScript errors. Hero type remains 60/48/36px. Blogger loads the source's declared web fonts; the original Vite app currently falls back because its font import is dropped. The decorative hero, small tag text and callout borders were deliberately retained as requested. Native search/widgets/comments add some page height. See the UI report for hosted-test limits.
