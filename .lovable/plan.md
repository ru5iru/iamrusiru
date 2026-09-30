# Improvement Plan — iamrusiru

## Phase 1: Finish pending work
1. **OWASP Top 10 post rewrite** — Update `src/data/posts/owasp-top-ten.ts` with the 2025 mapping (A01 Broken Access Control → A10 Mishandling of Exceptional Conditions), a 2017→2025 mapping table, beginner-friendly explanations and examples per item, updated FAQ JSON-LD, and refreshed sitemap/llms entries.
2. **Publish** — Lovable Cloud is enabled and the MCP connector is ready; publish so the MCP link goes live and recent fixes (duplicate H1 removal, canonical fixes) reach the live site.

## Phase 2: SEO / AEO / GEO
3. **Custom domain** — Move off the shared `lovable.app` subdomain so the blog builds its own backlink profile and authority (per backlink strategy).
4. **llms-full.txt** — Add a full-content companion file for AI crawlers (GEO), linked from `llms.txt`.
5. **"Cite this post" block** — Add a copyable citation snippet at the end of each post to earn attribution links (supports backlink strategy).
6. **Person/author JSON-LD** — Consolidate author schema sitewide with `sameAs` links to social profiles for entity recognition.
7. **HowTo schema** — Add to tutorial-style posts (FastAPI quickstart, Docker Compose, CLI tool) where steps exist.
8. **Internal linking pass** — Ensure every post links to at least 2 related posts in-body, not just the related-posts widget.

## Phase 3: Performance
9. **Image optimization** — Serve cover images as responsive WebP/AVIF via vite-imagetools (already installed); generate srcset variants for hero and post cards.
10. **Font subsetting** — Self-host or subset Google Fonts (DM Serif Display, Playfair Display, Roboto, JetBrains Mono) to cut render-blocking requests.
11. **Prerender validation** — Add a build-time check that each prerendered page contains exactly one canonical, one H1, and full article text.

## Phase 4: UI/UX & accessibility
12. **Skip-to-content link** — Add for keyboard users.
13. **Focus rings** — Audit visible focus states on nav, tag chips, and buttons.
14. **Theme flash fix** — Apply the dark-mode class before first paint via a tiny inline script to avoid light flash.
15. **Mobile nav audit** — Verify tap targets (44px+) and menu focus trapping.
16. **404 page** — Add a friendly not-found page with popular posts and search.

## Phase 5: Content & growth
17. **RSS promotion** — Link `/rss.xml` in the footer (feed already generated at build).
18. **Post series navigation** — OWASP posts (A01, A02, A03, Top 10) get prev/next series links.
19. **Backlink strategy execution** — Dev.to/Medium syndication with canonical links, "cite this post" rollout, 5-10 new referring domains/month target.

## Technical notes
- All changes respect house rules: no em dashes, tags for filtering only, `seoKeywords` separate (10+ per post), explicit image dimensions + lazy loading, no newsletter/contact form/Terms of Use.
- Sitemap, RSS, llms.txt, and posts.json regenerate automatically at build via `plugins/prerender-posts.ts`.
