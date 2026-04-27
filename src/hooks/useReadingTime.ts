import { useMemo } from "react";
import type { ContentBlock } from "@/data/posts/types";

const WORDS_PER_MINUTE = 238;

export function countWords(content: ContentBlock[]): number {
  let words = 0;
  for (const block of content) {
    if (typeof block === "string") {
      words += block.trim().split(/\s+/).filter(Boolean).length;
      continue;
    }
    if (block.type === "code") {
      const lines = block.code.split("\n").filter((l) => l.trim().length > 0);
      words += lines.length * 5;
      continue;
    }
    if (block.type === "heading") {
      words += block.text.trim().split(/\s+/).filter(Boolean).length;
      continue;
    }
    if (block.type === "callout") {
      words += block.text.trim().split(/\s+/).filter(Boolean).length;
      continue;
    }
    if (block.type === "image" && block.caption) {
      words += block.caption.trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

export function useReadingTime(content: ContentBlock[]): string {
  return useMemo(() => {
    const total = countWords(content);
    const minutes = Math.max(1, Math.round(total / WORDS_PER_MINUTE));
    return `${minutes} min read`;
  }, [content]);
}

export default useReadingTime;
