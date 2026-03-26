/**
 * Vite plugin: At build time, generates static HTML for every route with
 * real content injected into <div id="root">, making all pages fully
 * crawlable by search engines and social-media scrapers without JavaScript.
 *
 * Covers: homepage (/), about (/about), contact (/contact), and all
 * blog post routes (/post/<slug>).
 *
 * Also auto-generates /sitemap.xml from the post list.
 */

import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

const SITE = "https://iamrusiru.lovable.app";

interface PostMeta {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  content: (string | { type: "code"; language: string; code: string })[];
}

// ── Load posts via esbuild ──────────────────────────────────────────

async function loadPosts(): Promise<PostMeta[]> {
  const { build } = await import("esbuild");
  const outfile = path.resolve(__dirname, "../.tmp-posts-bundle.mjs");

  await build({
    entryPoints: [path.resolve(__dirname, "../src/data/posts/index.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    loader: { ".jpg": "text", ".png": "text", ".webp": "text", ".svg": "text" },
    alias: { "@": path.resolve(__dirname, "../src") },
    logLevel: "silent",
  });

  const mod = await import(`file://${outfile}`);
  const posts: PostMeta[] = (mod.default || mod).map((p: PostMeta) => ({
    ...p,
    imageUrl: p.imageUrl?.startsWith("http")
      ? p.imageUrl
      : `${SITE}${p.imageUrl?.startsWith("/") ? "" : "/"}${p.imageUrl || ""}`,
  }));

  fs.unlinkSync(outfile);
  return posts;
}

// ── Helpers ─────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function setMeta(html: string, sel: string, attr: string, value: string): string {
  const re = new RegExp(`(<${sel}[^>]*${attr}=")[^"]*"`, "i");
  return html.replace(re, `$1${esc(value)}"`);
}

function replaceMeta(html: string, post: { title: string; description: string; url: string; image?: string; ogType?: string }): string {
  let h = html;
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(post.title)}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(post.description)}">`);
  h = h.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(post.url)}" />`);

  const ogType = post.ogType || "website";
  h = h.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(post.title)}">`);
  h = h.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(post.description)}">`);
  h = h.replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${ogType}" />`);
  h = h.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(post.url)}" />`);
  if (post.image) {
    h = h.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(post.image)}">`);
  }

  h = h.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(post.title)}">`);
  h = h.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(post.description)}">`);
  if (post.image) {
    h = h.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${esc(post.image)}">`);
  }

  return h;
}

function injectRoot(html: string, content: string): string {
  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

function injectBeforeHead(html: string, extra: string): string {
  return html.replace("</head>", `${extra}\n</head>`);
}

// ── Content renderers for static HTML ───────────────────────────────

function renderPostContent(block: string | { type: "code"; language: string; code: string }): string {
  if (typeof block === "string") {
    if (block.startsWith("## ")) {
      const parts = block.split("\n\n");
      return parts
        .map((p) =>
          p.startsWith("## ")
            ? `<h2>${esc(p.replace("## ", ""))}</h2>`
            : `<p>${esc(p)}</p>`
        )
        .join("\n");
    }
    return `<p>${esc(block)}</p>`;
  }
  return `<pre><code class="language-${esc(block.language)}">${esc(block.code)}</code></pre>`;
}

function buildPostStaticHtml(post: PostMeta): string {
  const contentHtml = post.content.map(renderPostContent).join("\n");
  return `
<article>
  <header>
    <span>${esc(post.category)}</span>
    <time datetime="${post.date}">${post.date}</time>
    <span>${esc(post.readTime)}</span>
    <h1>${esc(post.title)}</h1>
    <p>By Rusiru Rathmina</p>
  </header>
  <section>
    <p><strong>TL;DR:</strong> ${esc(post.excerpt)}</p>
  </section>
  <img src="${esc(post.imageUrl)}" alt="${esc(post.title)}" />
  <section>${contentHtml}</section>
  <footer>
    <p>Tags: ${post.tags.map((t) => esc(t)).join(", ")}</p>
    <p>Written by Rusiru Rathmina, Associate Software Engineer at Omobio, Colombo, Sri Lanka.</p>
  </footer>
</article>`;
}

function buildHomepageStaticHtml(posts: PostMeta[]): string {
  const postCards = posts
    .slice(0, 10)
    .map(
      (p) => `
  <article>
    <a href="/post/${esc(p.slug)}">
      <img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" loading="lazy" />
      <h3>${esc(p.title)}</h3>
    </a>
    <span>${esc(p.category)}</span>
    <time datetime="${p.date}">${p.date}</time>
    <span>${esc(p.readTime)}</span>
    <p>${esc(p.excerpt)}</p>
  </article>`
    )
    .join("\n");

  return `
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
<main>
  <section>
    <h1>iamrusiru - Software Engineering Blog</h1>
    <p>Software engineer by day, tinkerer by night. I write about code, career lessons, side projects, and the human side of building software.</p>
  </section>
  <section>
    <h2>Latest Posts</h2>
    ${postCards}
  </section>
</main>
<footer>
  <p>&copy; 2025 Rusiru Rathmina. All rights reserved.</p>
  <p>Associate Software Engineer at Omobio, Colombo, Sri Lanka.</p>
</footer>`;
}

function buildAboutStaticHtml(): string {
  return `
<header>
  <nav><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
</header>
<main>
  <h1>About Rusiru Rathmina</h1>
  <p>Associate Software Engineer at Omobio. I build things, break things, and write about both.</p>
  <section>
    <h2>How it all started</h2>
    <p>My journey didn't start with code - it started with curiosity. Growing up in Galle, Sri Lanka, I was the kid who'd take things apart just to see what's inside. At the University of Colombo School of Computing, I discovered that the same curiosity could be applied to software.</p>
  </section>
  <section>
    <h2>Where I am now</h2>
    <p>Today, as an Associate Software Engineer at Omobio, I'm deep in the trenches refactoring Dialog.lk's legacy codebase. My days are filled with React, PHP, Drupal, and a healthy dose of AWS (S3, SES, CloudWatch). I've learned to love Redis for caching, Docker for deployments, and the satisfaction of seeing response times drop dramatically.</p>
    <p>I'm also spending time making sure our applications meet OWASP Top 10 standards - because security isn't something you add later, it's something you build in from the start.</p>
  </section>
  <section>
    <h2>Skills</h2>
    <p>Java, JavaScript, PHP, React, Node.js, Spring Boot, Drupal, Laravel, AWS, Docker, Kubernetes, Jenkins, Apache Kafka, MySQL, PostgreSQL, MongoDB, Redis.</p>
  </section>
  <section>
    <h2>Education</h2>
    <p>Bachelor of Science in Computer Science from University of Colombo School of Computing (GPA: 3.01). GCE Advanced Level in Physical Science from Mahinda College, Galle.</p>
  </section>
</main>
<footer><p>&copy; 2025 Rusiru Rathmina. All rights reserved.</p></footer>`;
}

function buildContactStaticHtml(): string {
  return `
<header>
  <nav><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
</header>
<main>
  <h1>Contact Rusiru Rathmina</h1>
  <p>Whether you have a project idea, a question, or just want to say hi, I'd love to hear from you.</p>
  <section>
    <h2>Get in touch</h2>
    <p>Email: <a href="mailto:r.rathmina@gmail.com">r.rathmina@gmail.com</a></p>
    <p>Location: Colombo, Sri Lanka</p>
  </section>
  <section>
    <h2>Find me online</h2>
    <ul>
      <li><a href="https://www.linkedin.com/in/ru5iru" rel="me">LinkedIn</a></li>
      <li><a href="https://github.com/ru5iru" rel="me">GitHub</a></li>
      <li><a href="https://web.facebook.com/ru5iru" rel="me">Facebook</a></li>
      <li><a href="https://instagram.com/rusiru.rathmina" rel="me">Instagram</a></li>
      <li><a href="https://x.com/ru5iru" rel="me">X (Twitter)</a></li>
    </ul>
  </section>
</main>
<footer><p>&copy; 2025 Rusiru Rathmina. All rights reserved.</p></footer>`;
}

// ── Blog post page builder ──────────────────────────────────────────

function buildPostPage(template: string, post: PostMeta): string {
  const url = `${SITE}/post/${post.slug}`;
  const title = `${post.title} | iamrusiru`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: "Rusiru Rathmina",
          url: `${SITE}/about`,
          jobTitle: "Associate Software Engineer",
          sameAs: [
            "https://github.com/ru5iru",
            "https://www.linkedin.com/in/ru5iru",
            "https://x.com/ru5iru",
            "https://instagram.com/rusiru.rathmina",
          ],
        },
        publisher: { "@type": "Person", name: "Rusiru Rathmina" },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: post.tags.join(", "),
        articleSection: post.category,
        inLanguage: "en",
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: post.category, item: `${SITE}/` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  });

  const articleMetaTags = `
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:author" content="Rusiru Rathmina" />
    <meta property="article:section" content="${post.category}" />
    ${post.tags.map((t) => `<meta property="article:tag" content="${esc(t)}" />`).join("\n    ")}
  `;

  let html = replaceMeta(template, {
    title,
    description: post.excerpt,
    url,
    image: post.imageUrl,
    ogType: "article",
  });

  // Inject article content into root div
  html = injectRoot(html, buildPostStaticHtml(post));

  // Inject article meta tags + JSON-LD
  html = injectBeforeHead(
    html,
    `${articleMetaTags}\n<script type="application/ld+json">${jsonLd}</script>`
  );

  return html;
}

// ── Static page builders ────────────────────────────────────────────

function buildHomepage(template: string, posts: PostMeta[]): string {
  let html = replaceMeta(template, {
    title: "iamrusiru | Rusiru Rathmina - Full-Stack Software Engineer Blog",
    description:
      "Software engineer by day, tinkerer by night. I write about code, career lessons, side projects, and the human side of building software.",
    url: `${SITE}/`,
  });
  html = injectRoot(html, buildHomepageStaticHtml(posts));
  return html;
}

function buildAboutPage(template: string): string {
  let html = replaceMeta(template, {
    title: "About Rusiru Rathmina | iamrusiru",
    description:
      "Learn about Rusiru Rathmina, Associate Software Engineer at Omobio, based in Colombo, Sri Lanka. Full-stack developer specializing in React, Java, Spring Boot, AWS, and DevOps.",
    url: `${SITE}/about`,
  });
  html = injectRoot(html, buildAboutStaticHtml());
  return html;
}

function buildContactPage(template: string): string {
  let html = replaceMeta(template, {
    title: "Contact Rusiru Rathmina | iamrusiru",
    description:
      "Get in touch with Rusiru Rathmina, Full-Stack Software Engineer based in Colombo, Sri Lanka.",
    url: `${SITE}/contact`,
  });
  html = injectRoot(html, buildContactStaticHtml());
  return html;
}

// ── Sitemap ─────────────────────────────────────────────────────────

function buildSitemap(posts: PostMeta[]): string {
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${SITE}/about`, priority: "0.8", changefreq: "monthly" },
    { loc: `${SITE}/contact`, priority: "0.8", changefreq: "monthly" },
  ];

  const urls = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...posts.map(
      (p) => `  <url>
    <loc>${SITE}/post/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

// ── Plugin ──────────────────────────────────────────────────────────

export default function prerenderPosts(): Plugin {
  return {
    name: "prerender-posts",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(__dirname, "../dist");
      const templatePath = path.join(distDir, "index.html");

      if (!fs.existsSync(templatePath)) {
        console.warn("[prerender] dist/index.html not found, skipping.");
        return;
      }

      const template = fs.readFileSync(templatePath, "utf-8");

      let posts: PostMeta[];
      try {
        posts = await loadPosts();
      } catch (e) {
        console.error("[prerender] Failed to load posts:", e);
        return;
      }

      // 1. Prerender homepage (overwrite dist/index.html with content-filled version)
      const homepageHtml = buildHomepage(template, posts);
      fs.writeFileSync(templatePath, homepageHtml, "utf-8");
      console.log("[prerender] ✓ / (homepage with content)");

      // 2. Prerender /about
      const aboutDir = path.join(distDir, "about");
      fs.mkdirSync(aboutDir, { recursive: true });
      fs.writeFileSync(path.join(aboutDir, "index.html"), buildAboutPage(template), "utf-8");
      console.log("[prerender] ✓ /about");

      // 3. Prerender /contact
      const contactDir = path.join(distDir, "contact");
      fs.mkdirSync(contactDir, { recursive: true });
      fs.writeFileSync(path.join(contactDir, "index.html"), buildContactPage(template), "utf-8");
      console.log("[prerender] ✓ /contact");

      // 4. Prerender blog posts
      for (const post of posts) {
        const dir = path.join(distDir, "post", post.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), buildPostPage(template, post), "utf-8");
        console.log(`[prerender] ✓ /post/${post.slug}`);
      }

      // 5. Generate sitemap
      const sitemap = buildSitemap(posts);
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf-8");
      console.log(`[prerender] ✓ sitemap.xml (${posts.length} posts)`);

      console.log(`[prerender] Done! ${3 + posts.length} pages prerendered.`);
    },
  };
}
