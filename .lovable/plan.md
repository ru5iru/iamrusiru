## Site Audit: SEO / AEO / GEO / UI-UX

Inputs: SEO scanner findings, `index.html`, `robots.txt`, `sitemap.xml`, `Index.tsx`, `Hero.tsx`, `Header.tsx`, `PostCard.tsx`, `BlogPost.tsx`.

### Failing / known issues (do first)

1. **LCP slow on homepage (Lighthouse failing).** Hero portrait is the LCP candidate but is a large JPG with no preload. 
   - Convert `src/assets/profile-headshot.jpg` to WebP/AVIF (or wire `vite-imagetools`).
   - Add `<link rel="preload" as="image" fetchpriority="high">` for the hero image in `index.html`.
   - Ensure `@font-face` rules use `font-display: swap` (Playfair + Inter).

2. **Color contrast failing (Lighthouse a11y).** Audit `text-caption`, `text-muted-foreground/50` and similar muted shades on cream background; bump to meet 4.5:1. Also verify dark-mode muted text.

3. **Stale sitemap.** `sitemap.xml` is hand-edited, missing several posts (compare against `src/data/posts/index.ts`). The prerender plugin already builds a generated sitemap — delete the hand-edited `public/sitemap.xml` to stop it shadowing the generated one, OR move generation to `predev`/`prebuild` so the static file always reflects the registry.

4. **Duplicate / brittle JSON-LD on homepage.** `index.html` declares two `WebSite` schema blocks (lines 132-145 and 148-162). Merge into a single `WebSite` with the `potentialAction` nested.

### SEO — structural

5. **`<title>` length.** Homepage title "Rusiru Rathmina | Software Engineer Blog" is fine; per-post titles built by `buildPostTitle` can exceed 60. Re-verify with a check and tighten fallback.
6. **`keywords` meta bloat.** Trim `<meta name="keywords">` in `index.html` to ~6 focused terms (Google ignores it; keeps head tidy).
7. **Robots `Disallow` for `/_next`** is irrelevant (not a Next app). Remove.
8. **Privacy/Cookie pages** are indexable — fine, but add `<meta name="robots" content="noindex">` only if you don't want them ranking. (Recommendation: keep indexable for trust.)
9. **External "Portfolio" link** in Header has `target="_blank"` but no `aria-label` indicating new tab. Add visually hidden "(opens in new tab)" or an icon.
10. **Image alt text** on `PostCard` uses raw title — good. On `BlogPost` header image: `alt="Cover image for {title}"` — good. Profile headshot in PostCard ("Rusiru Rathmina") repeats across cards (mild a11y noise). Mark decorative ones with `alt=""`.

### AEO (Answer Engine Optimization)

11. **FAQ schema coverage.** Posts can include a `faq[]`; most posts don't. Add 2–4 Q&A blocks to the top 5 evergreen posts (OWASP, Injection, Clean Code, Docker Compose, Git Workflow) to unlock FAQ rich results.
12. **HowTo schema** for tutorial posts (FastAPI quickstart, Docker Compose, CLI in Rust, Drupal page caching). Add `@type: HowTo` JSON-LD alongside `BlogPosting`.
13. **Speakable schema** is already declared but selectors target `.post-summary` — good; verify on every post.
14. **TL;DR / answer box.** Every post already has `post-summary` (TL;DR) — good for AEO. Ensure first 40-60 words of the answer directly answer the post title's implicit question.
15. **Author bio** schema on every post — good. Add `knowsAbout` to per-post Person ref or rely on sitewide.

### GEO (Generative Engine Optimization — LLMs / AI crawlers)

16. **`llms.txt` exists.** Verify it summarizes site purpose, top posts, author bio, contact, license/citation policy. Add `llms-full.txt` with full post content for crawlers like ChatGPT/Perplexity (optional but powerful).
17. **AI crawler policy.** `robots.txt` allows all major AI bots — good. Add `Sitemap:` line for `rss.xml` as well? (Not standard; skip.)
18. **Citation metadata** (`citation_author`, `citation_title`) is sitewide only. Add per-post `citation_publication_date`, `citation_pdf_url` (if applicable) via Helmet/`useSEO`.
19. **Stable URLs + dates.** Every post should expose `datePublished` + `dateModified` in JSON-LD — already done; ensure `updatedDate` is bumped when you meaningfully edit content (LLM trust signal).

### UI / UX

20. **Sticky header** has no shadow or blur — when scrolled over content it bleeds. Add subtle `backdrop-blur` + bottom shadow on scroll.
21. **Mobile menu** uses `Link`s without `aria-current`; only desktop nav has it. Mirror the desktop pattern.
22. **Skip-to-content link** for keyboard users (`<a href="#main-content" class="sr-only focus:not-sr-only">`).
23. **Focus rings.** Verify every interactive element has a visible `focus-visible:ring-2 ring-primary`. PostCard's `<Link>` wrapper has none.
24. **Hero CTA contrast.** "Contact me" button uses `bg-primary text-primary-foreground` — fine. "About me" outlined CTA may fail contrast in dark mode; verify.
25. **PostCard tap target.** Inner TagChip buttons are nested inside a `<Link>` → invalid HTML (a > button). Move tag click to PostCard's container or render tags below the link.
26. **Load more pagination.** Button works; for SEO/UX add `?page=N` URL state so deep posts have crawlable URLs.
27. **Reading progress** — already implemented. Add `aria-hidden="true"` on the visual bar.
28. **Table of Contents** — already present when ≥3 headings. Add "Back to top" anchor inside long posts (BackToTop exists — good).
29. **Code blocks** — verify language label + copy button are keyboard-accessible.
30. **404 page** (`NotFound.tsx`) — add helpful links (recent posts, search by tag) instead of dead-end.
31. **Empty state** for filtered posts is friendly — good. Add "Try a related tag" suggestions.
32. **Dark-mode toggle** flashes on first paint. Move theme init to a tiny inline script in `index.html` before React mounts.
33. **Image placeholders.** Cover images on PostCard have no aspect-ratio reservation on the mobile (image hidden < sm). Verify no CLS.
34. **Date format.** "2026-05-02" reads as ISO; humanize ("May 2, 2026") via `Intl.DateTimeFormat`, keep `dateTime=""` ISO.
35. **Related Posts** — already present. Ensure 3 picks per post; fall back to category-match if `relatedPosts` empty.

### Hygiene

36. Drop unused `ICBM` meta or keep — minimal cost.
37. Console warning `RESET_BLANK_CHECK` from `lovable.js` — ignore (platform).
38. `prerender-posts.ts` plugin — confirm it writes per-page `<title>`, `<meta description>`, `<meta og:*>`, `<link canonical>` and JSON-LD into prerendered HTML (so social/LLM crawlers see them without JS).

---

### Suggested execution order

**Phase 1 (highest ROI, ~1 batch):** 1, 2, 3, 4, 6, 22, 25, 33, 38
**Phase 2 (AEO/GEO):** 11, 12, 16, 18
**Phase 3 (UX polish):** 20, 21, 23, 30, 32, 34, 35

Tell me which phase to run, or pick individual items.
