import { defineTool } from "@lovable.dev/mcp-js";
import { fetchPosts } from "../posts";

export default defineTool({
  name: "list_topics",
  title: "List categories and tags",
  description:
    "List every category and tag used on the blog, with how many posts use each. Useful before filtering list_posts.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const posts = await fetchPosts(ctx.signal);

    const count = (values: string[]) => {
      const map = new Map<string, number>();
      for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, posts]) => ({ name, posts }));
    };

    const categories = count(posts.map((p) => p.category));
    const tags = count(posts.flatMap((p) => p.tags));

    return {
      content: [
        {
          type: "text" as const,
          text: [
            `Categories: ${categories.map((c) => `${c.name} (${c.posts})`).join(", ")}`,
            `Tags: ${tags.map((t) => `${t.name} (${t.posts})`).join(", ")}`,
          ].join("\n\n"),
        },
      ],
      structuredContent: { totalPosts: posts.length, categories, tags },
    };
  },
});
