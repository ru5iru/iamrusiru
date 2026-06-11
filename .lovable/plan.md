## Site Scan Summary

- **Security scan**: clean, no issues.
- **SEO scan**: triggered (results land in the SEO tab in ~1 min). Current findings list shows only 1 ignored low-priority Semrush content suggestion (resume guide).
- **Code/manual review**: a few real improvements identified below.

## Identified Improvements

### 1. Per-route head tags (high impact)
Currently SEO is applied client-side via `useSEO` hook (mutates `document.head` after hydration). Social-preview crawlers (LinkedIn, Slack, Facebook) don't execute JS, so every shared link uses the static `index.html` title/description/og:image — not the post's.
- Adopt `react-helmet-async` OR rely on the existing `plugins/prerender-posts.ts` (already in the project) to make sure prerendered HTML contains per-post tags.
- Verify prerender output actually writes correct title/og tags into each post's static HTML.

### 2. Sitemap freshness
`public/sitemap.xml` is hand-edited. Add a build step (or extend prerender plugin) to auto-generate sitemap entries from `src/data/posts/index.ts` so new posts are never missed.

### 3. RSS feed
No `/rss.xml` exists. A simple generated feed (build-time) improves discoverability and lets readers subscribe — fits the "personal blog" pattern.

### 4. Image optimization
Post cover images are JPGs. Add `vite-imagetools` to serve AVIF/WebP variants and shrink LCP payload on the homepage card grid.

### 5. Accessibility polish
- Verify all interactive elements have visible focus rings (custom tokens may have suppressed defaults).
- Confirm header nav has `aria-current="page"` on active link.
- Run a quick axe pass on `/post/*` (reading-progress bar, code blocks, share buttons).

### 6. Content / AEO
- Add an `Article` JSON-LD `mainEntityOfPage` + `wordCount` field to blog posts for richer AI citations.
- Add `BreadcrumbList` JSON-LD per post (Home › Post title).
- Ignored Semrush suggestion (resume guide) — skip unless you want to chase that keyword.

### 7. Minor hygiene
- `index.html` keywords meta is very long and duplicative; trim to ~10 focused terms (Google ignores it, but it bloats the head).
- `robots.txt` disallows `/privacy-policy` and `/cookie-policy` — usually you want these indexed (or at least not blocked) for trust signals. Reconsider.
- Console warning: `Unknown message type: RESET_BLANK_CHECK` from `lovable.js` — harmless, ignore.

## Suggested Order

1. Verify prerender output covers per-post head tags (cheap win, biggest SEO impact).
2. Auto-generate sitemap from post registry.
3. Add RSS feed.
4. Image optimization (vite-imagetools).
5. JSON-LD enrichment (Breadcrumb + wordCount).
6. Cleanup: robots.txt, keywords trim, a11y pass.

Tell me which items you want me to implement and I'll start (recommend 1 + 2 + 6 first — fastest, highest ROI).
