# Optional Blogger source

The existing file-based blog stays independent. No Blogger posts are fabricated or imported until configured.

## Connect later

1. Enable Blogger API v3 in the owner's Google Cloud project. Create an API key restricted to Blogger API v3. Browser-referrer restrictions are unsuitable for server-side requests.
2. Securely store `BLOGGER_API_KEY` and either `BLOGGER_BLOG_ID` (numeric) or `BLOGGER_BLOG_URL` (public HTTPS blog root) as Cloud secrets. Never add the API key to Vite environment variables, checked-in source, or logs.
3. The `blogger-posts` function reads published posts only. Visitors continue chunked imports while the page is open. A complete snapshot is swapped atomically; partial fetches never remove previously cached articles.
4. Open the blog to initiate the first import. Verify real cards, article content, original links and media before publishing. Tests use synthetic inputs, never visible production sample posts.
5. Publish to include the fetched snapshot in crawler HTML. `/blogger-snapshot.json` holds the build's public sanitized snapshot; no secrets are included. Client refreshes may be newer than the static snapshot until the next publish.

## Contracts

Current blocker: the workspace rejected creation of the public `blogger-media` bucket. Image import safely omits images until a permitted media-storage option is selected; do not claim live media integration is verified. The user's blog source/API connection is also deferred.

- Public GET `blogger-posts`: sanitized published snapshot plus configuration/refresh status.
- GET with `mode=snapshot`: read without initiating an import, for prerendering.
- No arbitrary URLs or blog IDs accepted from visitors. All source configuration is server-owned.
- 30-minute freshness; service-only `blogger_cache`, with no browser reads/writes.
- Blogger HTML uses a strict allowlist and article images are copied to `blogger-media`. Unsupported embeds/images are omitted; original article remains linked.
- RSS, sitemap, MCP and AI text exports stay local-only. Imported reading pages canonicalize to Blogger.

## Verification

Run `bunx vitest run src/test/blogger.test.ts src/test/bloggerPrerender.test.ts` and existing related tests. Then verify a real configured source in the browser. Disabled-state checks and fixtures do not establish that live Blogger integration works.