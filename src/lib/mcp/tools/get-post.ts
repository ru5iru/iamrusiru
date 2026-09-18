import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchPosts } from "../posts";

export default defineTool({
  name: "get_post",
  title: "Get a blog post",
  description:
    "Fetch the full text of one published blog post by its slug, including tags, FAQ entries and related posts.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Post slug, for example 'git-workflow-tips'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    const posts = await fetchPosts(ctx.signal);
    const post = posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (!post) {
      throw new ToolError(
        `No post found with slug "${slug}". Use list_posts or search_posts to find valid slugs.`
      );
    }

    const faqText = post.faq?.length
      ? `\n\n## FAQ\n${post.faq.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}`
      : "";

    return {
      content: [
        {
          type: "text" as const,
          text: `# ${post.title}\n\n${post.date} · ${post.category} · ${post.url}\n\n${post.body}${faqText}`,
        },
      ],
      structuredContent: JSON.parse(JSON.stringify({ post })),
    };
  },
});
