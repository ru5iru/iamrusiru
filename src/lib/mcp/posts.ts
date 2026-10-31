/**
 * Shared loader for the blog's published post data.
 *
 * The site build emits `/posts.json` (see plugins/prerender-posts.ts) with the
 * full content of every published post. MCP tools read it over HTTP so the
 * Edge Function bundle stays free of image imports and React code.
 *
 * Import-safe: no env reads or I/O at module scope.
 */

import { z } from "zod";

const SITE = "https://iamrusiru.lovable.app";

export interface McpFaq {
  question: string;
  answer: string;
}

export interface McpPost {
  title: string;
  excerpt: string;
  date: string;
  updatedDate?: string;
  category: string;
  slug: string;
  readTime?: string;
  imageUrl: string;
  url: string;
  tags: string[];
  seoKeywords?: string[];
  /** Plain-text rendering of the post body. */
  body: string;
  faq?: McpFaq[];
  relatedPosts?: string[];
}

// Runtime schemas survive esbuild's type erasure and provide contextual types
// when Deno checks the SDK-generated TypeScript entry.
export const postSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  updatedDate: z.string().optional(),
  category: z.string(),
  slug: z.string(),
  readTime: z.string().optional(),
  imageUrl: z.string(),
  url: z.string(),
  tags: z.array(z.string()),
  seoKeywords: z.array(z.string()).optional(),
  body: z.string(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  relatedPosts: z.array(z.string()).optional(),
});

export const fetchPosts = z.function({
  input: [z.unknown()],
  output: z.array(postSchema),
}).implementAsync(async (signal) => {
  const res = await fetch(`${SITE}/posts.json`, {
    signal: signal instanceof AbortSignal ? signal : undefined,
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Could not load posts (${res.status} from ${SITE}/posts.json)`);
  }
  const data = await res.json();
  return postSchema.array().parse(Array.isArray(data) ? data : []);
});

export const postSummary = z.function({
  input: [postSchema],
  output: postSchema.pick({
    title: true, slug: true, url: true, date: true, category: true,
    readTime: true, excerpt: true, tags: true,
  }),
}).implement((post) => {
  return {
    title: post.title,
    slug: post.slug,
    url: post.url,
    date: post.date,
    category: post.category,
    readTime: post.readTime,
    excerpt: post.excerpt,
    tags: post.tags,
  };
});
