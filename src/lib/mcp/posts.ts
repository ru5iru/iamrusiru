/**
 * Shared loader for the blog's published post data.
 *
 * The site build emits `/posts.json` (see plugins/prerender-posts.ts) with the
 * full content of every published post. MCP tools read it over HTTP so the
 * Edge Function bundle stays free of image imports and React code.
 *
 * Import-safe: no env reads or I/O at module scope.
 */

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

export async function fetchPosts(signal?: AbortSignal): Promise<McpPost[]> {
  const res = await fetch(`${SITE}/posts.json`, {
    signal,
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Could not load posts (${res.status} from ${SITE}/posts.json)`);
  }
  const data = (await res.json()) as McpPost[];
  return Array.isArray(data) ? data : [];
}

export function postSummary(post: McpPost) {
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
}
