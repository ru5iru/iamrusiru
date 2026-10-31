import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPosts, postSummary } from "../lib/mcp/posts";

const post = {
  title: "Access control", excerpt: "A public article", date: "October 31, 2026",
  category: "Security", slug: "access-control", imageUrl: "/cover.webp",
  url: "https://iamrusiru.lovable.app/post/access-control", tags: ["OWASP"],
  body: "Article text", faq: [{ question: "What is it?", answer: "Access checks." }],
};

afterEach(() => vi.unstubAllGlobals());

describe("MCP post loader", () => {
  it("preserves public article data and forwards cancellation", async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify([post])));
    vi.stubGlobal("fetch", request);
    const signal = new AbortController().signal;
    expect(await fetchPosts(signal)).toEqual([post]);
    expect(request).toHaveBeenCalledWith("https://iamrusiru.lovable.app/posts.json", {
      signal, headers: { accept: "application/json" },
    });
    expect(postSummary(post)).toEqual({
      title: post.title, slug: post.slug, url: post.url, date: post.date,
      category: post.category, excerpt: post.excerpt, tags: ["OWASP"],
    });
  });

  it("rejects malformed article fields before tools consume them", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { ...post, tags: [42] },
    ]))));
    await expect(fetchPosts(undefined)).rejects.toThrow();
  });

  it("retains the empty result for a non-array response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}")));
    expect(await fetchPosts(undefined)).toEqual([]);
  });
});