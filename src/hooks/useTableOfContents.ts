import { useMemo } from "react";
import type { ContentBlock } from "@/data/posts/types";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadings(content: ContentBlock[]): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  const push = (level: 2 | 3, text: string) => {
    const base = slugify(text);
    const n = seen.get(base) ?? 0;
    const id = n === 0 ? base : `${base}-${n}`;
    seen.set(base, n + 1);
    headings.push({ id, text, level });
  };

  for (const block of content) {
    if (typeof block === "string") {
      // Parse markdown-style headings inside string blocks
      const lines = block.split("\n");
      for (const line of lines) {
        if (line.startsWith("### ")) push(3, line.replace(/^###\s+/, "").trim());
        else if (line.startsWith("## ")) push(2, line.replace(/^##\s+/, "").trim());
      }
    } else if (block.type === "heading") {
      push(block.level, block.text);
    }
  }
  return headings;
}

export function useTableOfContents(content: ContentBlock[]): TocHeading[] {
  return useMemo(() => extractHeadings(content), [content]);
}

export default useTableOfContents;
