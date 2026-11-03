import { parseDocument } from "htmlparser2";
import { createBloggerSanitizer, escapeHtml as esc, bloggerPath, type BloggerArticle, type BloggerSnapshot } from "../supabase/functions/_shared/blogger";
import { replaceMeta } from "./prerender-posts";

const SITE = "https://iamrusiru.lovable.app";
const sanitize = createBloggerSanitizer(parseDocument);
export async function loadBloggerSnapshot(backendUrl?: string, publishableKey?: string): Promise<BloggerSnapshot> {
  const empty = { configured: false, posts: [], refreshedAt: null };
  if (!backendUrl || !publishableKey) return empty;
  const response = await fetch(`${backendUrl}/functions/v1/blogger-posts?mode=snapshot`, { headers: { apikey: publishableKey }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Blogger snapshot unavailable (${response.status})`);
  const snapshot = await response.json();
  if (!Array.isArray(snapshot.posts)) throw new Error("Invalid Blogger snapshot");
  const prefix = `${backendUrl}/storage/v1/object/public/blogger-media/`;
  return { ...snapshot, posts: snapshot.posts.map((p: BloggerArticle) => ({ ...p, html: sanitize(p.html, undefined, prefix).html })) };
}
export function buildBloggerPage(template: string, post: BloggerArticle, prefix: string): string {
  const safe = sanitize(post.html, undefined, prefix);
  let html = replaceMeta(template, { title: `${post.title} | iamrusiru`, description: post.excerpt, url: `${SITE}${bloggerPath(post)}`, image: post.imageUrl, ogType: "article" });
  html = html.replace(/<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/gi, "");
  html = html.replace("</head>", `<link rel="canonical" href="${esc(post.originalUrl)}" />\n</head>`);
  html = html.replace(/<meta\b(?=[^>]*\bname\s*=\s*["'](?:keywords|author)["'])[^>]*>/gi, "");
  html = html.replace(/<link\b(?=[^>]*\brel\s*=\s*["']author["'])[^>]*>/gi, "");
  const graph = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, dateModified: post.updatedDate, author: { "@type": "Person", name: post.author }, mainEntityOfPage: post.originalUrl, url: `${SITE}${bloggerPath(post)}` };
  const metadata = `<meta name="author" content="${esc(post.author)}" /><meta property="article:published_time" content="${esc(post.date)}" /><meta property="article:modified_time" content="${esc(post.updatedDate)}" /><meta property="article:author" content="${esc(post.author)}" /><meta name="twitter:card" content="${post.imageUrl ? "summary_large_image" : "summary"}" />`;
  html = html.replace(/<meta\b(?=[^>]*\bname\s*=\s*["']twitter:card["'])[^>]*>/gi, "");
  html = html.replace("</head>", `${metadata}<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>\n</head>`);
  return html.replace('<div id="root"></div>', `<div id="root"><header><nav><a href="/">iamrusiru</a><a href="/about">About</a><a href="/contact">Contact</a></nav></header><main id="main-content"><article><a href="/">Back to all posts</a><span>Blogger</span><h1>${esc(post.title)}</h1><time datetime="${esc(post.date)}">${esc(post.date)}</time><p>${esc(post.author)} · ${esc(post.readTime)}</p><a href="${esc(post.originalUrl)}" rel="noopener noreferrer">Original on Blogger</a><div class="blogger-content">${safe.html}</div></article></main><footer><a href="/">iamrusiru</a></footer></div>`);
}
export function importedListingHtml(posts: BloggerArticle[]) {
  return posts.map(p => `<article><a href="${esc(bloggerPath(p))}">${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="" width="192" height="128" loading="lazy" />` : ""}<h3>${esc(p.title)}</h3></a><span>Blogger</span><time datetime="${esc(p.date)}">${esc(p.date)}</time><p>${esc(p.excerpt)}</p></article>`).join("\n");
}