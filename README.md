# iamrusiru — Personal Blog of Rusiru Rathmina

A fast, SEO-optimized personal blog covering **code, career lessons, side projects, and the human side of building software**. Built and maintained by [Rusiru Rathmina](https://www.linkedin.com/in/ru5iru), a Full-Stack Software Engineer based in Colombo, Sri Lanka.

- **Live site:** https://iamrusiru.lovable.app
- **Lovable project:** https://lovable.dev/projects/d97d423e-45f1-466a-8cb8-b0d4d3116140

---

## ✨ Overview

`iamrusiru` is a personal engineering blog with a warm, editorial aesthetic (cream background, terracotta accents, Playfair Display headings). It's a fully static, prerendered React app — no backend, no database — designed to be fast, crawlable, and friendly to humans, search engines, and AI answer engines alike.

### Key features

- 📝 **File-based blog engine** — posts live as TypeScript modules in `src/data/posts/`, auto-indexed via a central registry.
- 🧱 **Block-based content model** — alternating text and language-aware code snippets per post.
- 🔍 **SEO / AEO / GEO optimized** — JSON-LD (Person, WebSite, BreadcrumbList, BlogPosting, FAQPage), canonical URLs, geo meta tags, AI citation meta.
- 🗺️ **Auto-generated sitemap** — built at compile time from the post registry via a custom Vite plugin (`plugins/prerender-posts.ts`).
- 🌗 **Dark mode** — `.dark` class on root, persisted in `localStorage`, defaults to system preference.
- 📊 **Reading progress bar** on article pages.
- ♾️ **"Load more" pagination** on the homepage feed.
- 🏷️ **Category filtering** via developer-centric topics (Engineering, Tutorials, Side Projects, etc.).
- ⚡ **Performance** — explicit image dimensions + `loading="lazy"` to eliminate CLS, preconnect hints for external assets.
- 📱 **Responsive two-column layout** with sticky sidebar navigation.
- ❓ **FAQ schema** per post for richer Google snippets and AI citations.

---

## 🛠️ Tech Stack

| Layer        | Tool                                     |
|--------------|------------------------------------------|
| Framework    | React 18 + TypeScript 5                  |
| Build tool   | Vite 5 (with SWC)                        |
| Styling      | Tailwind CSS v3 + `@tailwindcss/typography` |
| UI primitives| shadcn/ui + Radix UI                     |
| Routing      | React Router v6                          |
| Data fetching| TanStack Query                           |
| Forms        | React Hook Form + Zod                    |
| Icons        | lucide-react                             |
| Charts       | Recharts                                 |
| Testing      | Vitest + Testing Library + jsdom         |
| Linting      | ESLint 9 + typescript-eslint             |
| Prerendering | Custom Vite plugin (`plugins/prerender-posts.ts`) |

> **No backend.** This is a fully static client-side app. There is no Lovable Cloud / Supabase integration.

---

## 📁 Project Structure

```
.
├── index.html                     # Root HTML w/ meta tags + JSON-LD schema
├── plugins/
│   └── prerender-posts.ts         # Custom Vite plugin: builds sitemap.xml + per-post HTML
├── public/
│   ├── llms.txt                   # AI crawler hints
│   ├── robots.txt
│   ├── sitemap.xml                # Auto-generated at build time
│   └── site.webmanifest
├── src/
│   ├── App.tsx                    # Routes definition
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Design tokens (HSL semantic colors)
│   ├── components/
│   │   ├── blog/                  # Header, Footer, Hero, PostCard, Sidebar, ReadingProgress, etc.
│   │   └── ui/                    # shadcn primitives
│   ├── data/
│   │   ├── authorFaq.ts           # Author-level FAQ for /about
│   │   └── posts/
│   │       ├── index.ts           # Central post registry
│   │       ├── types.ts           # BlogPost / ContentBlock / FAQ types
│   │       └── *.ts               # One file per post
│   ├── hooks/
│   │   └── useSEO.ts              # Per-page meta + JSON-LD injection
│   ├── lib/
│   │   ├── seoKeywords.ts
│   │   └── utils.ts
│   └── pages/
│       ├── Index.tsx              # Homepage (post feed)
│       ├── BlogPost.tsx           # Single post w/ FAQ + breadcrumbs
│       ├── About.tsx
│       ├── Contact.tsx
│       ├── PrivacyPolicy.tsx
│       ├── CookiePolicy.tsx
│       └── NotFound.tsx
├── tailwind.config.ts
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

Requires Node.js 18+ and a package manager (bun, npm, or pnpm).

```sh
# 1. Install dependencies
bun install        # or: npm install

# 2. Start the dev server (auto-reload + instant preview)
bun run dev        # or: npm run dev

# 3. Build for production (also generates sitemap + prerendered post HTML)
bun run build

# 4. Preview the production build locally
bun run preview

# 5. Run tests
bun run test       # one-shot
bun run test:watch # watch mode

# 6. Lint
bun run lint
```

---

## ✍️ Adding a New Blog Post

Posts are plain TypeScript files — no CMS, no markdown frontmatter, no database.

1. **Create a new file** in `src/data/posts/`, e.g. `src/data/posts/my-new-post.ts`:

   ```ts
   import type { BlogPost } from "./types";
   import cover from "@/assets/my-cover.jpg";

   const post: BlogPost = {
     title: "My New Post",
     excerpt: "A one-sentence hook for cards, OG tags, and the post feed.",
     date: "2026-04-26",                 // YYYY-MM-DD — keep this format consistent
     category: "Engineering",            // Engineering | Tutorials | Side Projects | Career | …
     slug: "my-new-post",                // URL: /post/my-new-post
     readTime: "6 min read",
     imageUrl: cover,                    // Imported asset — handled by the prerender plugin
     tags: ["typescript", "react"],
     content: [
       "Opening paragraph as plain string.",
       { type: "code", language: "ts", code: "const hello = 'world';" },
       "Another paragraph.",
     ],
     faq: [
       { question: "Why does this matter?", answer: "Because…" },
     ],
   };

   export default post;
   ```

2. **Register it** in `src/data/posts/index.ts` by importing it and adding it to the top of the `allPosts` array (newest first).

3. That's it — the post appears on the homepage, gets its own route, is added to `sitemap.xml` on the next build, and gets full JSON-LD `BlogPosting` + optional `FAQPage` schema injected automatically.

### Content block model

The `content` array supports two block types:

- **String** — rendered as a paragraph (Tailwind Typography styling).
- **Code block** — `{ type: "code", language: string, code: string }` — syntax-highlighted snippet.

Constraints (project-wide):
- ❌ **No em dashes** (—) anywhere in copy.
- ❌ No newsletter signup, no contact form, no Terms of Use page.
- ✅ All images must include explicit `width`/`height` and `loading="lazy"`.

---

## 🎨 Design System

Defined in `src/index.css` and `tailwind.config.ts` as HSL semantic tokens. **Never use raw color classes** (`text-white`, `bg-black`) in components — always go through tokens (`text-foreground`, `bg-background`, `text-primary`, etc.).

| Token       | Role                                         |
|-------------|----------------------------------------------|
| Background  | Cream (light) / near-black (dark)            |
| Primary     | Terracotta accent                            |
| Heading font| Playfair Display (serif)                     |
| Body font   | Inter (sans-serif)                           |

Brand mark: **iam**rusiru — `iam` in the body color, `rusiru` in terracotta.

---

## 🔍 SEO / AEO / GEO

- **`useSEO` hook** sets per-page `<title>`, meta description, canonical, OG/Twitter tags, and JSON-LD.
- **Person, WebSite, and BreadcrumbList schema** in `index.html`.
- **BlogPosting + FAQPage schema** injected per post.
- **Geo meta tags** (`geo.region=LK`, `geo.placename=Colombo, Sri Lanka`).
- **AI citation meta** (`citation_author`, `citation_title`).
- **`public/llms.txt`** for AI crawler guidance.
- **`public/robots.txt`** + **auto-generated `sitemap.xml`** (built from the post registry — never edit by hand).

---

## 🌐 Deployment

This project is hosted on Lovable.

- **Publish:** open the [Lovable project](https://lovable.dev/projects/d97d423e-45f1-466a-8cb8-b0d4d3116140) and click **Share → Publish**.
- **Custom domain:** **Project → Settings → Domains → Connect Domain**. See [docs](https://docs.lovable.dev/features/custom-domain#custom-domain).

You can also clone the repo and deploy the static `dist/` output to any host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.) after running `bun run build`.

---

## 🤝 Connect

- 🌐 **Website:** https://iamrusiru.lovable.app
- 💼 **LinkedIn:** [in/ru5iru](https://www.linkedin.com/in/ru5iru)
- 🐙 **GitHub:** [@ru5iru](https://github.com/ru5iru)
- 🐦 **X / Twitter:** [@ru5iru](https://x.com/ru5iru)
- 📸 **Instagram:** [@rusiru.rathmina](https://instagram.com/rusiru.rathmina)
- ✉️ **Email:** r.rathmina@gmail.com

---

© 2025 Rusiru Rathmina. All rights reserved.
