# iamrusiru — Personal Engineering Blog

A fast, file-based personal blog for **Rusiru Rathmina** built on React 18, Vite 5, TypeScript 5, Tailwind CSS v3, and shadcn/ui. Content is authored as TypeScript files in `src/data/posts/`, prerendered at build time for SEO, and served as a single-page app.

> Live: https://iamrusiru.lovable.app

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Available Scripts](#available-scripts)
6. [How to Add a New Post](#how-to-add-a-new-post)
7. [Ready-to-Paste AI Prompt for Generating a Post](#ready-to-paste-ai-prompt-for-generating-a-post)
8. [Editing an Existing Post](#editing-an-existing-post)
9. [Tags vs SEO Keywords](#tags-vs-seo-keywords)
10. [Sitemap, llms.txt and Static SEO](#sitemap-llmstxt-and-static-seo)
11. [Theming and Design System](#theming-and-design-system)
12. [Testing](#testing)
13. [Conventions and House Rules](#conventions-and-house-rules)
14. [Deployment](#deployment)

---

## Features

- File-based posts: drop a TypeScript file in `src/data/posts/`, register it once, and it appears across the homepage, sidebar, sitemap, related posts, RSS-ready listings, and tag filters.
- Build-time **prerendering** of every post route (`plugins/prerender-posts.ts`) so crawlers and link unfurlers get fully rendered HTML.
- **SEO + AEO + GEO** metadata: per-post `<title>`, meta description, canonical URL, Open Graph + Twitter cards, JSON-LD `Article`, `BreadcrumbList`, and optional `FAQPage` schemas, plus an LLM-friendly `public/llms.txt`.
- Reading experience: dynamic reading-time estimate, table of contents, reading-progress bar, code blocks with copy button, callouts, lazy-loaded images with explicit width/height (no CLS), share buttons, related posts, back-to-top button.
- Tag cloud sidebar derived from real post tags.
- Dark mode with `localStorage` persistence.
- Lazy-loaded routes for fast first paint.
- Vitest + Testing Library setup.

---

## Tech Stack

- React 18, TypeScript 5, Vite 5 (SWC)
- Tailwind CSS v3 + `@tailwindcss/typography`
- shadcn/ui + Radix primitives
- React Router v6
- Vitest

---

## Project Structure

```
.
├── index.html                       # SSR-friendly shell + structured data
├── plugins/prerender-posts.ts       # Build-time post prerendering
├── public/
│   ├── sitemap.xml                  # Generated/maintained sitemap
│   ├── llms.txt                     # Crawlable summary for LLMs
│   └── robots.txt
├── src/
│   ├── App.tsx                      # Lazy routes
│   ├── assets/                      # Post cover images (jpg/png)
│   ├── components/blog/             # Header, Footer, Hero, PostCard, TOC, etc.
│   ├── data/
│   │   ├── posts/
│   │   │   ├── index.ts             # Central registry of all posts
│   │   │   ├── types.ts             # BlogPost, ContentBlock, FAQ
│   │   │   └── *.ts                 # One file per post
│   │   └── authorFaq.ts
│   ├── hooks/                       # useSEO, useReadingTime, useTableOfContents
│   ├── lib/seoKeywords.ts           # Meta keyword extraction
│   ├── pages/                       # Index, BlogPost, About, Contact, legal
│   └── index.css                    # Tailwind layers + design tokens
└── tailwind.config.ts
```

---

## Getting Started

```bash
# install
bun install   # or: npm install

# dev server
bun run dev   # http://localhost:5173

# production build (runs the prerender plugin)
bun run build
bun run preview
```

---

## Available Scripts

| Script | What it does |
|---|---|
| `dev` | Vite dev server |
| `build` | Production build + post prerender |
| `preview` | Preview the built site locally |
| `test` | Run the Vitest suite |
| `lint` | ESLint over the project |

---

## How to Add a New Post

1. **Create a cover image** in `src/assets/` named `post-<slug>.jpg` (or `.png`). Keep it ~1600×900 for good Open Graph rendering.
2. **Create the post file** at `src/data/posts/<slug>.ts`. Use this skeleton:

   ```ts
   import postCover from "@/assets/post-<slug>.jpg";
   import type { BlogPost } from "@/data/posts/types";

   const post: BlogPost = {
     title: "<Post Title>",
     excerpt: "<1-2 sentence summary, 30-60 words, includes primary keyword>",
     date: "Month D, YYYY",
     updatedDate: "YYYY-MM-DD", // optional
     category: "Engineering" /* or "Career", "Personal", "Security", etc. */,
     slug: "<slug>",
     readTime: "<N> min read", // optional; auto-computed if omitted
     imageUrl: postCover,
     tags: ["<UI tag 1>", "<UI tag 2>", "<UI tag 3>"], // drives sidebar + filtering
     seoKeywords: [
       // 10-15 long-tail phrases. Primary keyword first.
       "<primary keyword>",
       "<related phrase 1>",
       "<related phrase 2>",
       // ...
     ],
     content: [
       { type: "heading", level: 2, text: "<H2 section title>" },
       "<Markdown-style paragraph text>",
       { type: "code", language: "ts", code: "// example" },
       { type: "callout", variant: "tip", text: "<short callout>" },
       {
         type: "image",
         src: "<src>",
         alt: "<descriptive alt>",
         width: 1600,
         height: 900,
         caption: "<optional caption>",
       },
     ],
     faq: [
       { question: "<Q1>", answer: "<40-120 word answer>" },
       // 5-7 entries recommended
     ],
     relatedPosts: ["<other-slug-1>", "<other-slug-2>"],
   };

   export default post;
   ```

3. **Register the post** in `src/data/posts/index.ts`:

   ```ts
   import myNewPost from "./<slug>";

   const allPosts = [
     myNewPost, // newest first
     // ...
   ];
   ```

4. **Add it to `public/sitemap.xml`** as a new `<url>` entry with today's `<lastmod>` and bump the homepage `<lastmod>` to today.
5. **Update `public/llms.txt`**: add the new post under "Latest Post" / "Posts" with title, slug URL, and one-line summary.
6. **Verify**: run `bun run dev`, open `/blog/<slug>`, check the meta tags in DevTools, and confirm the post appears on the homepage and in related posts.
7. **Build**: run `bun run build` to confirm the prerender plugin emits the static HTML for the new route.

---

## Ready-to-Paste AI Prompt for Generating a Post

Copy this prompt, fill in the placeholders in `<ANGLE BRACKETS>`, and paste it into your favorite LLM. The output will be ready to drop into a new file in `src/data/posts/`.

````text
You are an expert technical blogger for "iamrusiru", a personal engineering blog by Rusiru Rathmina. The blog covers code, career lessons, side projects, and the human side of building software. Write a complete, publish-ready blog post on the topic below.

TOPIC: <TOPIC>
PRIMARY KEYWORD: <PRIMARY KEYWORD>
RELATED / LONG-TAIL KEYWORDS (10-15): <comma-separated list>
TARGET WORD COUNT: <e.g. 1400-1800 words>
CATEGORY: <Engineering | Career | Personal | Security | ...>
SLUG: <kebab-case-slug>
TODAY'S DATE: <Month D, YYYY>
TONE: First-person, conversational but technically precise. Friendly senior-engineer voice.
AUDIENCE: Working software developers and engineering managers.

STYLE & HOUSE RULES (must follow exactly):
- Do NOT use em dashes (—) anywhere. Use commas, periods, or parentheses instead.
- Do NOT include any newsletter signup, contact form, or "Terms of Use" references.
- Use the primary keyword in the title, the first 100 words, at least one H2, and naturally throughout the body. Avoid keyword stuffing: target ~1% density.
- Naturally weave the related keywords into body copy and headings, NOT just into meta tags.
- Prefer short paragraphs (2-4 sentences). Use lists where they aid scannability.
- Include real, runnable code examples where relevant. Specify the language for each code block.
- Cite sources inline as plain links if you reference external material.
- All images must include explicit width, height, and descriptive alt text.

REQUIRED STRUCTURE (in this exact order):
1. Meta title (<= 60 chars, includes primary keyword) — labeled "META TITLE:"
2. Meta description (<= 160 chars, includes primary keyword, ends with implicit CTA) — labeled "META DESCRIPTION:"
3. H1 title (matches the post title)
4. Direct-answer paragraph (2-3 sentences) that defines the topic and answers the primary search intent in plain language. Include the primary keyword.
5. Body with multiple H2 sections and H3 subsections as needed. Cover:
   - What it is / why it matters
   - How it works (with code or diagrams)
   - Common pitfalls or anti-patterns
   - Practical recommendations / step-by-step guidance
   - At least one numbered or bulleted list
   - At least one code block (where applicable)
6. Conclusion with a clear, actionable takeaway.
7. CTA line (e.g. "Have you dealt with this? Reply below or find me on LinkedIn.")
8. FAQ section: 5-7 question-and-answer pairs. Each answer 40-120 words, complete sentences, no bullet points.

ALSO PRODUCE (after the post body):
A. SITEMAP XML SNIPPET — a single `<url>` block for `https://iamrusiru.lovable.app/blog/<SLUG>` with `<lastmod>` set to today's ISO date and `<changefreq>monthly</changefreq>`, `<priority>0.8</priority>`. Also emit an updated `<lastmod>` line for the homepage URL.
B. LLMS.TXT ENTRY — one line in the format: `- [<Title>](https://iamrusiru.lovable.app/blog/<SLUG>) — <one-sentence summary>`
C. FAQ JSON-LD — a valid `application/ld+json` block for the FAQ section using the `FAQPage` schema. JSON only, double quotes, no trailing commas.
D. POST FILE PAYLOAD — a TypeScript object literal that I can paste directly into `src/data/posts/<SLUG>.ts`, matching the BlogPost type:
   - title, excerpt (30-60 words), date, category, slug, readTime, imageUrl placeholder import, tags (3-6 short UI tags), seoKeywords (10-15 phrases — primary keyword FIRST), content (array of strings + { type: "heading" | "code" | "callout" | "image" } blocks), faq, relatedPosts (2-3 slugs from existing posts).

OUTPUT ORDER (no commentary outside these sections):
1. META TITLE + META DESCRIPTION
2. Full blog post in Markdown (H1, body, FAQ)
3. Sitemap XML snippet
4. llms.txt entry
5. FAQ JSON-LD
6. Post file payload (TypeScript)
````

After the LLM responds, follow the steps in [How to Add a New Post](#how-to-add-a-new-post) to wire the post into the registry, sitemap, and `llms.txt`.

---

## Editing an Existing Post

- Edit the file at `src/data/posts/<slug>.ts`.
- Bump `updatedDate` (optional) and update the matching `<lastmod>` in `public/sitemap.xml`.
- If the title or excerpt changed, update the corresponding line in `public/llms.txt`.

---

## Tags vs SEO Keywords

These are intentionally separate fields on a `BlogPost`:

- **`tags`** — short, human-friendly labels used by the UI (sidebar tag cloud, filtering, post cards). Keep them broad and reusable across posts (e.g. `"React"`, `"career growth"`).
- **`seoKeywords`** — 10-15 long-tail phrases used for `<meta name="keywords">` and JSON-LD `keywords`. The first entry should be the **primary keyword**. These should reflect real search intent and also appear naturally in the post body.

Do not use the same array for both. The tag UI must remain stable even as keyword strategy evolves.

---

## Sitemap, llms.txt and Static SEO

- `public/sitemap.xml` is referenced from `public/robots.txt`. Update it whenever you add or substantially edit a post.
- `public/llms.txt` provides an LLM-friendly map of the site. Keep the "Posts" / "Latest Post" sections in sync with the registry.
- `index.html` contains the SSR-friendly shell. The prerender plugin (`plugins/prerender-posts.ts`) injects per-route HTML and a homepage "Latest Posts" list at build time.
- `src/hooks/useSEO.ts` sets per-page title, meta description, canonical, Open Graph, Twitter, and JSON-LD tags at runtime.

---

## Theming and Design System

- Tokens live in `src/index.css` and `tailwind.config.ts`. All colors are HSL.
- Brand: cream background, terracotta accents. Headings use Playfair Display, body uses Inter.
- Dark mode toggles via the `.dark` class on the root element and persists to `localStorage`.
- Always use semantic Tailwind tokens (`bg-background`, `text-foreground`, `text-primary`, etc.). Do not hardcode colors in components.

---

## Testing

```bash
bun run test
```

Includes unit tests for `useReadingTime` and `useTableOfContents`. Add tests next to the hook or component as `*.test.ts(x)`.

---

## Conventions and House Rules

- **No em dashes (—)** anywhere in content or UI copy.
- **No newsletter subscription**, **no contact form**, **no "Terms of Use" page**.
- All images must include explicit `width`, `height`, and `loading="lazy"` to prevent CLS.
- Posts are file-based — never store post content in `localStorage` or a database.
- Keep components small and presentational; business logic belongs in hooks or `src/lib/`.

---

## Deployment

The site is deployed via Lovable. Pushing to the connected repo or hitting "Publish" in the Lovable editor triggers a production build (`vite build`), which runs the prerender plugin and emits a fully static, crawlable `dist/` ready for any static host.
