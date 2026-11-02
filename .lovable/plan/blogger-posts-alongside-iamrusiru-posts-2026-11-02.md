# Blogger posts alongside iamrusiru posts

## Goal
Add a second post source using Blogger API v3 without replacing the existing file-based blog. Blogger posts appear alongside existing posts and readers can open their full articles on this website.

This is a parallel content source, not an integration with the Parallel AI service. No Blogger connection, credentials, or live imports are needed during planning.

## Reader experience
- Combine local and Blogger posts in the existing homepage, newest first, preserving category/tag filters and Load more.
- Add an All / iamrusiru / Blogger source filter using the existing design.
- Show a small Blogger source label on imported cards and a link to the original article on imported article pages.
- Give Blogger articles stable URLs such as `/blogger/:blogId/:postId`, avoiding collisions with existing `/post/:slug` routes.
- Reuse article typography, reading time, images, sharing and reading progress. Do not fabricate local FAQs or technical categories for imported content.
- Treat Blogger labels as filtering tags, never SEO keywords. Posts without a mapped category use a Blogger category.
- Keep local posts available if Blogger is disconnected, slow, empty or unavailable. Show a concise unavailable state only where imported content is affected.

## Fetching and refresh
1. When you are ready, supply the public Blogger blog URL or ID. This first version reads one public blog's published posts only, not drafts or private blogs.
2. Check available Google/Blogger connections before requesting credentials. If no suitable connector exists, explain how to enable Blogger API v3 and request its API key through the secure secret form. Never put it in browser code.
3. Use a Lovable Cloud function to resolve the blog, fetch published posts, follow Blogger pagination tokens and normalize the results.
4. Cache a sanitized snapshot in Lovable Cloud so visitors do not trigger a full Blogger import. Retain the last successful snapshot if refresh fails.
5. Refresh stale data when the relevant view opens, with bounded, deduplicated refresh work. Do not assume a background scheduler exists or leave a long import waiting in one request.
6. Start with a documented 30-minute cache freshness target. Display cached content immediately while refreshing. New or updated posts become visible after a successful refresh; remove deleted/unpublished posts only after a complete successful import, never a partial fetch.

## Content safety and images
- Validate Blogger responses and isolate the importer from the local post registry.
- Sanitize Blogger HTML before both browser rendering and prerendering. Remove scripts, event handlers, unsafe URLs and unsupported embedded content.
- Preserve headings, links, lists, quotes, tables and code blocks where supported; keep the original article link available for unsupported embeds.
- Import article media through the project's asset/storage flow instead of blindly hotlinking arbitrary URLs. Restrict fetched URLs, content types and sizes, and handle missing images without breaking the page.
- Generate appropriately sized card images, preserve readable article images, and give every rendered image explicit dimensions and lazy loading.

## Search and shared links
- Include imported articles and homepage listings in build-time prerendering from the sanitized snapshot. Fresh imports can appear immediately in the app, but their static crawler HTML requires a new publish.
- Preserve the Blogger original URL as the canonical by default to avoid competing duplicate copies. Shared-link URLs still point to the corresponding iamrusiru reading page.
- Generate one canonical, one H1, route-specific title/description and deduplicated social metadata in raw HTML. Use Blogger's real author, publication date and update date rather than assigning every imported article to Rusiru.
- Keep canonical-to-Blogger copies out of the iamrusiru sitemap by default.
- Leave the existing RSS, `posts.json`, MCP tools and AI text exports local-only in this phase. Expanding these is separate work and must not silently change their current contracts.

## Technical approach
- Introduce a separate Blogger article model and a shared listing adapter. Keep the required local `BlogPost` shape and file registry unchanged.
- Add focused source-loading, normalization, cache and sanitization modules, a dedicated Blogger reader page, and a route in `src/App.tsx`.
- Update `src/pages/Index.tsx` and post cards for merged ordering, source labels and internal Blogger article links. Reset pagination when source/category/tag filters change.
- Extend `plugins/prerender-posts.ts` using the same sanitized snapshot and rendering rules as the app. An absent connection must not break local-only builds.
- Protect cache storage with RLS and explicit grants. Visitors receive only published, sanitized public data through a read endpoint; browser clients cannot write the cache. Refresh operations use only the configured blog, not visitor-supplied arbitrary URLs.
- Keep Blogger API keys server-only, redact credential-bearing request URLs from logs, and surface useful provider errors without leaking secrets.
- Record the selected architecture in `AGENTS.md` when implementation begins.

## Delivery stages
1. **Foundation:** models, adapter, sanitizer, cache contract, function and tests. Keep the feature disabled until a source is configured.
2. **Reader interface:** merged feed, source filter, Blogger article pages and empty/error states using fixtures for development only.
3. **Live connection:** configure your public blog and credentials when you are ready, then import and verify real posts.
4. **Crawler support:** extend snapshot-based prerendering and verify article HTML, canonical and social metadata before publishing.

## Acceptance checks
- Existing local posts, routes and filters still work with Blogger disabled or failing.
- API pagination retrieves all published posts without duplicates; stable Blogger IDs prevent local slug collisions.
- Sorting and filtering remain correct across both sources, including missing labels and dates.
- Cached posts survive outages; a failed or partial import never erases valid content.
- Malicious HTML and unsafe links cannot execute, and no credential reaches the browser or logs.
- A real Blogger article opens and reads correctly on this site; images load and the original article link works.
- Raw published HTML contains the article and correct, deduplicated metadata.
- Run focused normalization/cache/sanitization tests and existing relevant tests, then check the actual reader flow at desktop and mobile sizes.

## Deferred until you are ready
The public Blogger URL or ID and a working API connection are required for live import and end-to-end verification. No private-blog access, editing Blogger posts, automatic publishing, custom scheduling, or changes to MCP are included.