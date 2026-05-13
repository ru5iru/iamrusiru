/**
 * Vite plugin: At build time, generates static HTML for every route with
 * real content injected into <div id="root">, making all pages fully
 * crawlable by search engines and social-media scrapers without JavaScript.
 *
 * Covers: homepage (/), about (/about), contact (/contact), privacy-policy,
 * cookie-policy, and all blog post routes (/post/<slug>).
 *
 * Also auto-generates /sitemap.xml from the post list.
 */

import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

const SITE = "https://iamrusiru.lovable.app";

interface FAQ {
  question: string;
  answer: string;
}

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
  faq?: FAQ[];
}

// ── Load posts via esbuild ──────────────────────────────────────────

async function loadPosts(): Promise<PostMeta[]> {
  const { build } = await import("esbuild");
  const outfile = path.resolve(__dirname, "../.tmp-posts-bundle.mjs");

  // Plugin: resolve image imports to their basename string so we can build
  // a public URL. Avoids loading binary content into the bundle.
  const imageStubPlugin = {
    name: "image-stub",
    setup(b: any) {
      b.onResolve({ filter: /\.(jpg|jpeg|png|webp|svg|gif|avif)$/ }, (args: any) => ({
        path: args.path,
        namespace: "image-stub",
        pluginData: { name: path.basename(args.path) },
      }));
      b.onLoad({ filter: /.*/, namespace: "image-stub" }, (args: any) => ({
        contents: `export default ${JSON.stringify("/assets/" + args.pluginData.name)};`,
        loader: "js",
      }));
    },
  };

  await build({
    entryPoints: [path.resolve(__dirname, "../src/data/posts/index.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    alias: { "@": path.resolve(__dirname, "../src") },
    plugins: [imageStubPlugin],
    logLevel: "silent",
  });

  const mod = await import(`file://${outfile}`);
  const DEFAULT_IMG = `${SITE}/placeholder.svg`;

  const posts: PostMeta[] = (mod.default || mod).map((p: PostMeta) => {
    let img = p.imageUrl || "";
    // Strip control chars defensively
    img = img.replace(/[\x00-\x1F\x7F]/g, "");
    if (!img) {
      img = DEFAULT_IMG;
    } else if (!img.startsWith("http")) {
      img = `${SITE}${img.startsWith("/") ? "" : "/"}${img}`;
    }
    return { ...p, imageUrl: img };
  });

  // Build-time SEO warnings: FAQ answer word count target 40-120
  for (const p of posts) {
    if (!p.faq) continue;
    for (const f of p.faq) {
      const wc = f.answer.trim().split(/\s+/).filter(Boolean).length;
      if (wc < 40 || wc > 120) {
        console.warn(
          `[SEO WARNING] Post "${p.slug}": FAQ answer for "${f.question}" is ${wc} words (target: 40-120)`
        );
      }
    }
  }

  fs.unlinkSync(outfile);
  return posts;
}

// ── Helpers ─────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  const faqHtml = post.faq && post.faq.length > 0
    ? `<section><h2>Frequently Asked Questions</h2>${post.faq.map(f => `<div><h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p></div>`).join("\n")}</section>`
    : "";

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
  ${faqHtml}
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

function buildPrivacyPolicyStaticHtml(): string {
  return `
<header>
  <nav><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
</header>
<main>
  <h1>Privacy Policy</h1>
  <p>Last updated: March 30, 2026</p>
  <section><h2>1. Introduction</h2><p>Welcome to iamrusiru.com, operated by Rusiru Rathmina. This Privacy Policy explains how I collect, use, and protect your personal information.</p></section>
  <section><h2>2. Information I Collect</h2><p>Personal information (name, email) when you subscribe or contact me. Usage data (pages visited, browser type, IP address) via analytics. Cookies for browsing preferences.</p></section>
  <section><h2>3. How I Use Your Information</h2><p>To send newsletter updates, respond to messages, analyze traffic, and maintain site security.</p></section>
  <section><h2>4. Data Sharing</h2><p>I do not sell or rent your data. I may share with trusted analytics and email service providers.</p></section>
  <section><h2>5. Contact</h2><p>Questions? Reach out via the <a href="/contact">Contact page</a>.</p></section>
</main>
<footer><p>&copy; 2025 Rusiru Rathmina. All rights reserved.</p></footer>`;
}

function buildCookiePolicyStaticHtml(): string {
  return `
<header>
  <nav><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
</header>
<main>
  <h1>Cookie Policy</h1>
  <p>Last updated: March 30, 2026</p>
  <section><h2>1. What Are Cookies?</h2><p>Cookies are small text files placed on your device to remember preferences and understand how you interact with the site.</p></section>
  <section><h2>2. How I Use Cookies</h2><p>Essential cookies for site functionality, analytics cookies to understand visitor behavior, and preference cookies for personalization.</p></section>
  <section><h2>3. Managing Cookies</h2><p>You can control cookies through browser settings. Disabling certain cookies may affect site functionality.</p></section>
  <section><h2>4. Contact</h2><p>Questions? Reach out via the <a href="/contact">Contact page</a>.</p></section>
</main>
<footer><p>&copy; 2025 Rusiru Rathmina. All rights reserved.</p></footer>`;
}

// ── Blog post page builder ──────────────────────────────────────────

function buildPostPage(template: string, post: PostMeta): string {
  const url = `${SITE}/post/${post.slug}`;
  const title = `${post.title} | iamrusiru`;

  const graphSchemas: Record<string, unknown>[] = [
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
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".post-summary", "h1", ".post-content p:first-of-type"],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: post.category, item: `${SITE}/` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  // Add FAQPage structured data (AEO/GEO)
  if (post.faq && post.faq.length > 0) {
    graphSchemas.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graphSchemas,
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

  html = injectRoot(html, buildPostStaticHtml(post));
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
      "Read about software engineering, career lessons, side projects, and the human side of building software by Rusiru Rathmina.",
    url: `${SITE}/`,
  });
  html = injectRoot(html, buildHomepageStaticHtml(posts));
  return html;
}

function buildAboutPage(template: string): string {
  let html = replaceMeta(template, {
    title: "About Rusiru Rathmina | iamrusiru",
    description:
      "Rusiru Rathmina, Associate Software Engineer at Omobio in Colombo. Full-stack dev working with React, Java, Spring Boot, AWS, and DevOps.",
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

function buildPrivacyPolicyPage(template: string): string {
  let html = replaceMeta(template, {
    title: "Privacy Policy | iamrusiru",
    description: "Privacy Policy for iamrusiru.com – learn how Rusiru Rathmina collects, uses, and protects your personal information.",
    url: `${SITE}/privacy-policy`,
  });
  html = injectRoot(html, buildPrivacyPolicyStaticHtml());
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "name": "Privacy Policy", "url": `${SITE}/privacy-policy`, "inLanguage": "en" },
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": `${SITE}/privacy-policy` },
      ]},
    ],
  });
  html = injectBeforeHead(html, `<script type="application/ld+json">${jsonLd}</script>`);
  return html;
}

function buildCookiePolicyPage(template: string): string {
  let html = replaceMeta(template, {
    title: "Cookie Policy | iamrusiru",
    description: "Cookie Policy for iamrusiru.com – learn what cookies are used, how they work, and how to manage them.",
    url: `${SITE}/cookie-policy`,
  });
  html = injectRoot(html, buildCookiePolicyStaticHtml());
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "name": "Cookie Policy", "url": `${SITE}/cookie-policy`, "inLanguage": "en" },
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Cookie Policy", "item": `${SITE}/cookie-policy` },
      ]},
    ],
  });
  html = injectBeforeHead(html, `<script type="application/ld+json">${jsonLd}</script>`);
  return html;
}

// ── Sitemap ─────────────────────────────────────────────────────────

function buildSitemap(posts: PostMeta[]): string {
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${SITE}/about`, priority: "0.8", changefreq: "monthly" },
    { loc: `${SITE}/contact`, priority: "0.8", changefreq: "monthly" },
    { loc: `${SITE}/privacy-policy`, priority: "0.3", changefreq: "yearly" },
    { loc: `${SITE}/cookie-policy`, priority: "0.3", changefreq: "yearly" },
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
    <priority>0.8</priority>
    <image:image>
      <image:loc>${esc(p.imageUrl)}</image:loc>
      <image:title>${esc(p.title)}</image:title>
      <image:caption>${esc(p.excerpt)}</image:caption>
    </image:image>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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

      // Resolve image basenames to actual hashed asset filenames in dist/assets
      const assetsDir = path.join(distDir, "assets");
      const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
      const resolveAsset = (urlPath: string): string => {
        const m = urlPath.match(/\/assets\/(.+?)\.([a-z0-9]+)$/i);
        if (!m) return urlPath;
        const [, base, ext] = m;
        const re = new RegExp(
          `^${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-[A-Za-z0-9_-]+\\.${ext}$`
        );
        const hit = assetFiles.find((f) => re.test(f));
        return hit ? `/assets/${hit}` : urlPath;
      };
      posts = posts.map((p) => {
        if (p.imageUrl.startsWith(`${SITE}/assets/`)) {
          const local = p.imageUrl.replace(SITE, "");
          return { ...p, imageUrl: `${SITE}${resolveAsset(local)}` };
        }
        return p;
      });

      // 1. Prerender homepage
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

      // 4. Prerender /privacy-policy
      const privacyDir = path.join(distDir, "privacy-policy");
      fs.mkdirSync(privacyDir, { recursive: true });
      fs.writeFileSync(path.join(privacyDir, "index.html"), buildPrivacyPolicyPage(template), "utf-8");
      console.log("[prerender] ✓ /privacy-policy");

      // 5. Prerender /cookie-policy
      const cookieDir = path.join(distDir, "cookie-policy");
      fs.mkdirSync(cookieDir, { recursive: true });
      fs.writeFileSync(path.join(cookieDir, "index.html"), buildCookiePolicyPage(template), "utf-8");
      console.log("[prerender] ✓ /cookie-policy");

      // 6. Prerender blog posts
      for (const post of posts) {
        const dir = path.join(distDir, "post", post.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), buildPostPage(template, post), "utf-8");
        console.log(`[prerender] ✓ /post/${post.slug}`);
      }

      // 7. Generate sitemap
      const sitemap = buildSitemap(posts);
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf-8");
      console.log(`[prerender] ✓ sitemap.xml (${posts.length} posts)`);

      console.log(`[prerender] Done! ${5 + posts.length} pages prerendered.`);
    },
  };
}