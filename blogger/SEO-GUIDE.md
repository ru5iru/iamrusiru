# Publish searchable, reusable Blogger content

The theme renders metadata and structured content in the HTML Blogger serves. It does not depend on JavaScript for discovery. Existing styles and content layouts are unchanged. You can publish normal posts and Pages without rebuilding the theme.

## First fix the live crawling setting

Checked on 5 November 2026: `https://ru5iru.blogspot.com/robots.txt` returns a wildcard group containing `Disallow: /`. Googlebot has a separate allow group, but other compliant crawlers are blocked. This restricts discovery by other search engines and many AI services. The posts sitemap contains 23 URLs and the Pages sitemap contains four; both return HTTP 200. Sitemap availability does not prove indexing.

In **Blogger Settings > Privacy**, enable **Visible to search engines**. In **Crawlers and indexing**, review **Custom robots.txt**. Either disable the custom file to restore Blogger's default, or replace the current rules with the generated `robots-txt.example.txt` after reviewing them. Its sitemap URLs follow the configured `blogUrl`; use your final public/custom domain. The example permits public content while excluding search/share utility paths. Reopen `/robots.txt` to confirm `Disallow: /` has gone. The XML theme cannot change Blogger's HTTP robots file. See [Blogger's settings](https://support.google.com/blogger/answer/9691230?hl=en) and [Google's robots.txt rules](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).

Enable **Meta tags > Enable search description** and set a useful blog description. This exposes the Search description field when editing content. If custom robots header tags are enabled, avoid extra restrictions that contradict the theme: public home/posts/Pages should not have `noindex`, `nosnippet` or `noimageindex`. The theme already marks search, archive, error and the configured legal URLs `noindex,follow`. Keep pages crawlable so a crawler can read their `noindex` instruction. [Blogger search setup](https://support.google.com/blogger/answer/41373?hl=en)

## Keywords when publishing a post

Blogger has no separate focus-keyword field. Choose a phrase that describes the question the post answers, then use these existing fields:

1. **Title:** describe the actual answer, naturally including the main phrase. The theme creates the page H1, document title and social title; do not put another H1 in the body.
2. **Body:** answer the question near the beginning. Use clear H2/H3 headings, concrete examples, accurate dates, useful internal links and primary sources where relevant. Put the phrase where it helps the reader; do not repeat it mechanically.
3. **Labels:** add one configured topic for the category badge, then a few relevant topic phrases. Every native post label becomes a server-rendered `BlogPosting.keywords` value. Labels also create navigation/filter links; use consistent spelling.
4. **Search description:** write a unique, readable summary explaining what the reader will learn. Include the main phrase naturally. Around 140–160 characters is a writing aid, not a search-engine limit or ranking target. The same text feeds description, Open Graph, Twitter and structured description metadata.
5. **Permalink:** before first publishing, use a short descriptive slug in Blogger's Custom Permalink setting. Preserve existing published URLs when updating posts. Upload images through Blogger, add descriptive alt text, and preview the public result.

Example:

| Field | Example |
| --- | --- |
| Primary phrase, kept in your writing brief | Drupal cache tags |
| Title | Drupal Cache Tags Explained with Practical Examples |
| Labels | Engineering, Drupal caching, Cache tags |
| Search description | Learn how Drupal cache tags invalidate related content, with practical examples and checks to help you troubleshoot stale pages. |
| Custom permalink | drupal-cache-tags |
| Opening | Explain what cache tags do, when invalidation happens, and which example the post demonstrates. |

Choose a label from your configured `topics`; Engineering is only a default example. A new post uses its native title, author, published/modified dates, image, description and labels automatically. No local build or import is required. The native editor workflow is documented in [Blogger's publishing guide](https://support.google.com/blogger/answer/154172?hl=en).

**Important:** Google ignores `<meta name="keywords">` for indexing and ranking. Keywords are a content-planning and topic-description aid, not a ranking switch. This theme retains optional legacy head keywords for configured/imported routes, and uses schema keywords for native Labels. The new post's Labels live inside the Blog widget, so the template does not pretend they are available in the global head. A missing legacy keyword tag on a new post is expected. [Google's supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)

## Pages, descriptions and keyword overrides

Create Pages through **Pages > New page**. Enter a title, write the body, fill in Search description, preview, and add the public URL to navigation when appropriate. Pages do not have post Labels. The theme supplies `WebPage` markup and the same description/social handling as posts. Configured About/Contact URLs receive additional semantic types and owner details.

For a Page needing structured keyword phrases, append `editor-templates/snippets/seo-keywords.html` at the **end** of its body in HTML view and replace the placeholders. It adds no visible content. Append at the end to preserve prose spacing. Blogger's Compose editor may normalize metadata, so recheck HTML after saving; the configuration below is the reliable option for generated head metadata. Optional body metadata is not needed for search ranking.

For a custom title, description fallback, head/schema keywords, image or index policy, add the exact public path to `seo.routes` in your build configuration:

```json
"seo": {
  "language": "en",
  "homeTitle": "Your Name | Research Notes",
  "homeKeywords": ["research methods", "technical writing"],
  "emitLegacyKeywords": true,
  "noindexPaths": ["/p/privacy-policy.html", "/p/cookie-policy.html"],
  "routes": [
    {
      "path": "/p/research.html",
      "title": "Research Methods | Your Blog",
      "description": "How I evaluate sources, test ideas and document research methods.",
      "keywords": ["research methods", "source evaluation"],
      "pageType": "WebPage",
      "noIndex": false
    }
  ]
}
```

This is a fragment of the full JSON configuration; keep its other fields. Use absolute HTTPS `imageUrl` when overriding a social image. Supported Page types: WebPage, AboutPage, ContactPage and ProfilePage. The schema always has a WebPage base with `additionalType` for the specialization. Use factual owner details. Do not add a second keywords snippet when the route already supplies the same phrases.

Rebuild and restore the new XML for configuration changes. `seo.routes` replaces the previous array, so retain any overrides you still need. `seo-routes.json` records imported/configured route defaults for review; it is not a Blogger upload. Set `emitLegacyKeywords` to false to omit legacy head keyword tags while retaining structured keywords. Leave `homeTitle` empty to use Blogger's blog title. Keep the HTML language configured in Blogger aligned with `seo.language`.

Metadata priority:

| Value | Priority |
| --- | --- |
| Description | Native `data:view.description` (Search description), route fallback, native blog meta description, configured blog description. Fill Search description for every new post/Page; otherwise it can receive a generic site fallback in the head. Article schema alone can fall back to a body snippet. |
| Document title | Explicit route override; matching imported optimized title; native view title. Homepage can use `homeTitle`. Renaming an imported post in Blogger stops its old automatic title fallback. Explicit overrides persist until removed/rebuilt. |
| Social title | Full native view title, preserving the visible post/Page wording. |
| Image | Explicit route image; native post image; imported route image; configured `socialImageUrl` fallback. Empty images are omitted. |
| Structured keywords | Imported/configured route phrases; otherwise native post Labels. Optional Page body snippet can supply phrases when no route is configured. |
| Index policy | Utility search/archive/error pages are noindex; then route/noindexPaths policy; public content otherwise permits indexing and previews. Blogger settings/HTTP headers may further restrict it. |

Imported posts reuse the React application's curated `seoKeywords`, title builder and description builder. Imported Page defaults come from their source `useSEO` data. If you substantially rewrite an imported article, set a fresh Search description and either update/remove its configured imported keyword fallback by rebuilding, or explicitly override that URL's keywords. Changing only Labels on an imported route does not replace its curated keyword list. Normal new URLs need no route entry.

## AEO and GEO writing blocks

Use `post.html`'s comment-only planning brief for intent, primary/supporting phrases, Labels and Search description. It is not visible in the article. Optional snippets retain the original styles:

- `summary.html`: a concise, accurate answer/summary near the start.
- `faq.html`: real reader questions with direct, visible answers, plus matching FAQ schema.
- `sources.html`: supporting primary-source links when your claims need evidence.
- `table.html`, `code.html`, callouts and image captions: concrete explanations and examples.

The server HTML exposes the actual article, author, dates, canonical link, breadcrumb, section and image. Existing FAQ/summary content is readable without scripts; JavaScript only enhances navigation and placement. Keep author identity and source claims accurate, and update the post when the underlying facts change. Do not fabricate statistics, reviews or citations.

There is no special Google AI schema or required AEO/GEO tag. Core SEO, accessible crawlable pages, helpful content and clear evidence remain the basis; inclusion in an AI answer is never guaranteed. [Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

FAQ markup is retained for semantic compatibility and existing presentation. Google retired FAQ rich results in May 2026, so this theme makes no FAQ rich-result promise. Google's June 2026 clarification also says it ignores `llms.txt`; Blogger themes cannot publish arbitrary root `.txt` files. The React app's `llms.txt`, `llms-full.txt` and `posts.json` are not copied as fake XML endpoints. A standalone SpeakableSpecification was also not copied: Google's speakable support is a limited beta for particular news/voice use cases. [Search documentation updates](https://developers.google.com/search/updates), [Speakable documentation](https://developers.google.com/search/docs/appearance/structured-data/speakable)

## Verify after restoring the theme

1. Restore only `iamrusiru-blogger.xml`; do not reimport published posts.
2. View the public **page source** of home, one imported post, one new post and a Page. Check one document title, canonical, description, OG/Twitter description and robots tag; inspect keyword/date/author microdata in the body. JavaScript-disabled viewing should retain the article and metadata.
3. Check `/robots.txt`, `/sitemap.xml` and `/sitemap-pages.xml` on your final domain. The generated robots example needs a Settings update; theme restore does not apply it.
4. Submit the two sitemaps in Search Console and use URL Inspection for the actual served/indexed page. Validate articles with [Google's Rich Results Test](https://search.google.com/test/rich-results) and general microdata with [Schema.org Validator](https://validator.schema.org/). Test live URLs after saving; local XML checks do not run Google's Blogger compiler or prove indexing.
5. Check search descriptions and image previews for newly published content. Search engines may rewrite titles/snippets; these fields provide candidates rather than guaranteed display text.

The implementation audit and its React/Blogger differences are in [SEO-AUDIT.md](SEO-AUDIT.md).
