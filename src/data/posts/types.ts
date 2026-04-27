export type ContentBlock =
  | string
  | { type: "code"; language: string; code: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "callout"; variant: "info" | "warning" | "tip"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
    };

export interface FAQ {
  question: string;
  /** Target answer length: 40 to 120 words for AEO/GEO friendliness. */
  answer: string;
}

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  /** Optional updated date in YYYY-MM-DD or human-readable form. */
  updatedDate?: string;
  category: string;
  slug: string;
  /** Optional. Falls back to useReadingTime when omitted. */
  readTime?: string;
  imageUrl: string;
  tags: string[];
  content: ContentBlock[];
  faq?: FAQ[];
  /** Optional related post slugs. */
  relatedPosts?: string[];
}
