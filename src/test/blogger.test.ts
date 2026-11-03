import { describe, it, expect } from "vitest";
import { sanitizeBlogger } from "@/lib/blogger/content";
import { bloggerPath, isFresh, mergeImportedPosts, type BloggerArticle } from "../../supabase/functions/_shared/blogger";
import { combinedListings, filterListings } from "@/lib/blogger/listing";
import type { BlogPost } from "@/data/posts/types";

const article: BloggerArticle = { blogId: "123", postId: "456", title: "Remote", excerpt: "Excerpt", date: "2026-10-01T00:00:00Z", updatedDate: "2026-10-01T00:00:00Z", author: "Original author", originalUrl: "https://example.blogspot.com/post", html: "<p>Article</p>", tags: ["typescript"], category: "Blogger", readTime: "1 min read" };
describe("Blogger rules", () => {
  it("is fresh before, but not at, thirty minutes", () => {
    const time = Date.parse(article.date);
    expect(isFresh(article.date, time + 29 * 60_000)).toBe(true);
    expect(isFresh(article.date, time + 30 * 60_000)).toBe(false);
    expect(isFresh("invalid", time)).toBe(false);
  });
  it("uses stable IDs separate from local post routes", () => {
    expect(bloggerPath(article)).toBe("/blogger/123/456");
  });
  it("deduplicates pagination and keeps updates", () => {
    const merged = mergeImportedPosts([article], [{ ...article, title: "Updated" }]);
    expect(merged).toHaveLength(1);
    expect(merged[0].title).toBe("Updated");
  });
  it("keeps local content and applies both source and tag filters", () => {
    const local: BlogPost = { title: "Local", excerpt: "Local", date: "2026-09-01", category: "Engineering", slug: "456", imageUrl: "", tags: ["typescript"], content: [] };
    const list = combinedListings([local], [article]);
    expect(list.map(p => p.destination)).toEqual(["/blogger/123/456", "/post/456"]);
    expect(filterListings(list, "blogger", null, "typescript")).toHaveLength(1);
    expect(filterListings(list, "iamrusiru", "Blogger", null)).toHaveLength(0);
    expect(combinedListings([local], [])).toHaveLength(1);
  });
  it("removes executable HTML, unsafe links and remote images", () => {
    const clean = sanitizeBlogger('<script>alert(1)</script><iframe src="https://evil.test"></iframe><h1 onclick="evil()">Title</h1><a href="javascript:evil()">Link</a><img src="https://evil.test/a.jpg" onerror="evil()"><p>Safe</p>');
    expect(clean.html).not.toMatch(/script|iframe|onclick|onerror|javascript:|<img|<h1/);
    expect(clean.html).toContain('<h2 id="blogger-heading-1">Title</h2>');
    expect(clean.text).toContain("Safe");
  });
  it("keeps only imported images with explicit dimensions and lazy loading", () => {
    const clean = sanitizeBlogger('<img src="https://blogger.googleusercontent.com/a.jpg" alt="Cover">', new Map([["https://blogger.googleusercontent.com/a.jpg", { url: "https://storage.example/a.jpg", width: 800, height: 400 }]]));
    expect(clean.html).toContain('width="800" height="400" loading="lazy"');
    expect(clean.html).toContain('src="https://storage.example/a.jpg"');
  });
});