export type ContentBlock =
  | string
  | { type: "code"; language: string; code: string };

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  content: ContentBlock[];
}
