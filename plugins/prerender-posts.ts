/**
 * Vite plugin: At build time, generates a static HTML file for every blog post
 * route (/post/<slug>/index.html) with the correct <title>, meta description,
 * OG / Twitter tags, and JSON-LD already baked in. This makes every article
 * fully crawlable by search engines and social-media scrapers that don't
 * execute JavaScript.
 *
 * It also auto-generates /sitemap.xml from the same post list.
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
}

/**
 * We import the post metadata at build time by reading the TS source files.
 * To avoid needing a full TS compiler we extract what we need with a simple
 * dynamic import via tsx / esbuild (Vite already bundles esbuild).
 */
async function loadPosts(): Promise<PostMeta[]> {
  // Use Vite's own esbuild to bundle the posts index into a temp CJS file
  const { build } = await import("esbuild");
  const outfile = path.resolve(__dirname, "../.tmp-posts-bundle.mjs");

  await build({
    entryPoints: [path.resolve(__dirname, "../src/data/posts/index.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    // Externalize image imports – we don't need actual images, just metadata
    loader: { ".jpg": "text", ".png": "text", ".webp": "text", ".svg": "text" },
    alias: { "@": path.resolve(__dirname, "../src") },
    logLevel: "silent",
  });

  const mod = await import(`file://${outfile}`);
  const posts: PostMeta[] = (mod.default || mod).map((p: PostMeta) => ({
    ...p,
    // normalise image to an absolute URL for OG tags
    imageUrl: p.imageUrl?.startsWith("http")
      ? p.imageUrl
      : `${SITE}${p.imageUrl?.startsWith("/") ? "" : "/"}${p.imageUrl || ""}`,
  }));

  fs.unlinkSync(outfile);
  return posts;
}

function buildPostHtml(template: string, post: PostMeta): string {
  const url = `${SITE}/post/${post.slug}`;
  const title = `${post.title} | iamrusiru`;
  const description = post.excerpt;
  const image = post.imageUrl;

  // JSON-LD for this article
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image,
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
    ${post.tags.map((t) => `<meta property="article:tag" content="${t}" />`).join("\n    ")}
  `;

  const postJsonLdScript = `<script type="application/ld+json">${jsonLd}</script>`;

  // Replace generic meta tags in the template
  let html = template;

  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  // Meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${description}">`
  );

  // Canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`
  );

  // OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${title}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${description}">`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="article" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );
  if (image) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*">/,
      `<meta property="og:image" content="${image}">`
    );
  }

  // Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${title}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${description}">`
  );
  if (image) {
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*">/,
      `<meta name="twitter:image" content="${image}">`
    );
  }

  // Inject article meta tags + post-specific JSON-LD before </head>
  html = html.replace("</head>", `${articleMetaTags}\n${postJsonLdScript}\n</head>`);

  return html;
}

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

export default function prerenderPosts(): Plugin {
  return {
    name: "prerender-posts",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(__dirname, "../dist");
      const templatePath = path.join(distDir, "index.html");

      if (!fs.existsSync(templatePath)) {
        console.warn("[prerender-posts] dist/index.html not found, skipping.");
        return;
      }

      const template = fs.readFileSync(templatePath, "utf-8");

      let posts: PostMeta[];
      try {
        posts = await loadPosts();
      } catch (e) {
        console.error("[prerender-posts] Failed to load posts:", e);
        return;
      }

      // Generate per-post HTML
      for (const post of posts) {
        const dir = path.join(distDir, "post", post.slug);
        fs.mkdirSync(dir, { recursive: true });
        const html = buildPostHtml(template, post);
        fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
        console.log(`[prerender-posts] ✓ /post/${post.slug}/index.html`);
      }

      // Generate sitemap
      const sitemap = buildSitemap(posts);
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf-8");
      console.log(`[prerender-posts] ✓ sitemap.xml (${posts.length} posts)`);
    },
  };
}
