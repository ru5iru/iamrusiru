import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchPosts, postSummary } from "../posts";

export default defineTool({
  name: "list_posts",
  title: "List blog posts",
  description:
    "List published posts on Rusiru Rathmina's blog, newest first. Optionally filter by category or tag.",
  inputSchema: {
    category: z.string().trim().optional().describe("Filter by category, case-insensitive."),
    tag: z.string().trim().optional().describe("Filter by tag, case-insensitive."),
    limit: z.number().int().min(1).max(50).optional().describe("Max posts to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, tag, limit }, ctx) => {
    const posts = await fetchPosts(ctx.signal);
    const cat = category?.toLowerCase();
    const tg = tag?.toLowerCase();

    const filtered = posts.filter((p) => {
      if (cat && p.category.toLowerCase() !== cat) return false;
      if (tg && !p.tags.some((t) => t.toLowerCase() === tg)) return false;
      return true;
    });

    const items = filtered.slice(0, limit ?? 20).map(postSummary);

    return {
      content: [
        {
          type: "text" as const,
          text:
            items.length === 0
              ? "No posts matched those filters."
              : items
                  .map((p) => `- ${p.title} (${p.category}, ${p.date})\n  ${p.url}\n  ${p.excerpt}`)
                  .join("\n"),
        },
      ],
      structuredContent: { total: filtered.length, posts: items },
    };
  },
});
