import { expect, it } from "vitest";
import { buildBloggerPage } from "../../plugins/blogger-pages";
import type { BloggerArticle } from "../../supabase/functions/_shared/blogger";

it("uses the original canonical and local sharing URL with sanitized raw content", () => {
  const post: BloggerArticle = { blogId: "123", postId: "456", title: "Blogger title", excerpt: "Blogger description", date: "2026-10-01T00:00:00Z", updatedDate: "2026-10-01T00:00:00Z", author: "Blogger writer", originalUrl: "https://example.blogspot.com/article", html: '<h1>Section</h1><p>Full article</p><script>evil()</script>', tags: ["not-a-keyword"], category: "Blogger", readTime: "1 min read" };
  const html = buildBloggerPage('<html><head><title>Old</title><link rel="canonical" href="https://iamrusiru.lovable.app/" /><meta name="keywords" content="old" /></head><body><div id="root"></div></body></html>', post, "https://storage.example/");
  expect(html.match(/rel="canonical"/g)).toHaveLength(1);
  expect(html).toContain('href="https://example.blogspot.com/article"');
  expect(html).toContain('property="og:url" content="https://iamrusiru.lovable.app/blogger/123/456"');
  expect(html.match(/<h1>/g)).toHaveLength(1);
  expect(html).toContain("Full article");
  expect(html).not.toContain("evil()");
  expect(html).not.toContain('name="keywords"');
  expect(html).toContain('content="Blogger writer"');
});