import { z } from "npm:zod@4";
import { parseDocument } from "npm:htmlparser2@12";
import { createBloggerSanitizer, type BloggerArticle, type ImportedImage } from "../_shared/blogger.ts";

export const sanitize = createBloggerSanitizer(parseDocument);
const postSchema = z.object({
  id: z.string().regex(/^\d+$/), title: z.string().max(2000), content: z.string().max(2_000_000),
  url: z.url().refine(v => v.startsWith("https://")),
  published: z.string().refine(v => Number.isFinite(Date.parse(v))),
  updated: z.string().refine(v => Number.isFinite(Date.parse(v))),
  author: z.object({ displayName: z.string() }).optional(),
  labels: z.array(z.string()).optional(),
});
export const pageSchema = z.object({ items: z.array(postSchema).default([]), nextPageToken: z.string().optional() });
export function normalize(raw: z.infer<typeof postSchema>, blogId: string, images: Map<string, ImportedImage>): BloggerArticle {
  const clean = sanitize(raw.content, images);
  const tags = [...new Set((raw.labels ?? []).map(v => v.trim()).filter(Boolean))];
  return {
    blogId, postId: raw.id, title: sanitize(raw.title).text,
    excerpt: clean.text.slice(0, 200), html: clean.html, date: raw.published,
    updatedDate: raw.updated, originalUrl: raw.url, author: raw.author?.displayName ?? "Blogger author",
    tags, category: "Blogger", readTime: `${Math.max(1, Math.ceil(clean.text.split(/\s+/).length / 200))} min read`,
    imageUrl: images.values().next().value?.thumbnail,
  };
}