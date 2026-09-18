import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchPosts, postSummary } from "../posts";

export default defineTool({
  name: "search_posts",
  title: "Search blog posts",
  description:
    "Full-text search across titles, excerpts, tags, keywords and body content of the blog's published posts.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Search phrase, for example 'sql injection'."),
    limit: z.number().int().min(1).max(25).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    const posts = await fetchPosts(ctx.signal);
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    const scored = posts
      .map((p) => {
        const title = p.title.toLowerCase();
        const meta = [p.excerpt, p.category, ...p.tags, ...(p.seoKeywords ?? [])]
          .join(" ")
          .toLowerCase();
        const body = p.body.toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 6;
          if (meta.includes(t)) score += 3;
          if (body.includes(t)) score += 1;
        }
        return { post: p, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit ?? 10);

    const results = scored.map((r) => ({ ...postSummary(r.post), score: r.score }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            results.length === 0
              ? `No posts matched "${query}".`
              : results.map((p) => `- ${p.title}\n  ${p.url}\n  ${p.excerpt}`).join("\n"),
        },
      ],
      structuredContent: { query, results },
    };
  },
});
