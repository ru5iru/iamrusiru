import type { BlogPost } from "@/data/posts/types";
import { bloggerPath, type BloggerArticle } from "../../../supabase/functions/_shared/blogger";

export type PostSource = "all" | "iamrusiru" | "blogger";
export type ListingPost = Pick<BlogPost, "title" | "excerpt" | "date" | "category" | "slug" | "readTime" | "imageUrl" | "tags"> & {
  source: Exclude<PostSource, "all">;
  destination: string;
  author: string;
};
export function combinedListings(local: BlogPost[], imported: BloggerArticle[]): ListingPost[] {
  const posts: ListingPost[] = [
    ...local.map(p => ({ ...p, source: "iamrusiru" as const, destination: `/post/${p.slug}`, author: "Rusiru Rathmina" })),
    ...imported.map(p => ({ ...p, slug: `blogger:${p.blogId}:${p.postId}`, imageUrl: p.imageUrl ?? "", source: "blogger" as const, destination: bloggerPath(p) })),
  ];
  const timestamp = (date: string) => Number.isFinite(Date.parse(date)) ? Date.parse(date) : 0;
  return posts.sort((a, b) => timestamp(b.date) - timestamp(a.date) || a.slug.localeCompare(b.slug));
}
export function filterListings(posts: ListingPost[], source: PostSource, topic: string | null, tag: string | null) {
  return posts.filter(p => (source === "all" || p.source === source) && (!topic || p.category === topic) && (!tag || p.tags.includes(tag)));
}