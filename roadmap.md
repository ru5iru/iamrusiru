# SEO fixes
- [x] Clarify the homepage H1 in the visible page and raw HTML.
- [x] Strengthen and fact-check the existing Drupal caching article.
- [x] Correct per-route static social preview metadata and verify it.

# MCP build repair
- [x] Fix erased helper types in original MCP source without editing the generated function.
- [x] Regenerate from a clean output directory twice, verify Deno checks and tests, and extract the manifest.

# Image optimization
- [x] Compress source images without changing the design or breaking social previews.
- [x] Serve smaller card thumbnails and portraits, then verify image loading on home and article pages.

# Blogger integration
- [x] Plan Blogger posts alongside local posts, with full articles readable on this website.
- [x] Prepare importer, safe HTML, merged feed, reader routes, and snapshot prerendering; verify tests and disabled state.
- [ ] Connect and verify real Blogger posts when the user supplies the blog URL/ID and API key.
- [ ] Enable imported article images after an allowed storage option is available; workspace blocks public buckets.