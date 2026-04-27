import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReadingTime, countWords } from "@/hooks/useReadingTime";
import type { ContentBlock } from "@/data/posts/types";

describe("countWords", () => {
  it("counts words in string blocks", () => {
    const content: ContentBlock[] = ["one two three", "four five"];
    expect(countWords(content)).toBe(5);
  });

  it("counts code lines as 5 words each", () => {
    const content: ContentBlock[] = [
      { type: "code", language: "ts", code: "const a = 1;\nconst b = 2;" },
    ];
    expect(countWords(content)).toBe(10);
  });

  it("includes heading and callout text", () => {
    const content: ContentBlock[] = [
      { type: "heading", level: 2, text: "Hello world" },
      { type: "callout", variant: "info", text: "tip one two" },
    ];
    expect(countWords(content)).toBe(2 + 3);
  });

  it("includes image caption when present", () => {
    const content: ContentBlock[] = [
      { type: "image", src: "/x.jpg", alt: "x", width: 1, height: 1, caption: "a b c" },
    ];
    expect(countWords(content)).toBe(3);
  });
});

describe("useReadingTime", () => {
  it("returns at least 1 minute for short content", () => {
    const { result } = renderHook(() => useReadingTime(["short text here"]));
    expect(result.current).toBe("1 min read");
  });

  it("scales with content length", () => {
    const longText = "word ".repeat(2380).trim();
    const { result } = renderHook(() => useReadingTime([longText]));
    expect(result.current).toBe("10 min read");
  });
});
