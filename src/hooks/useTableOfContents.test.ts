import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTableOfContents, extractHeadings, slugify } from "@/hooks/useTableOfContents";
import type { ContentBlock } from "@/data/posts/types";

describe("slugify", () => {
  it("creates url-safe slugs", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("Why I Use TypeScript")).toBe("why-i-use-typescript");
  });
});

describe("extractHeadings", () => {
  it("parses markdown ## and ### in string blocks", () => {
    const content: ContentBlock[] = [
      "## First Section\n\nSome body text",
      "### Sub heading\n\nmore",
    ];
    const out = extractHeadings(content);
    expect(out).toEqual([
      { id: "first-section", text: "First Section", level: 2 },
      { id: "sub-heading", text: "Sub heading", level: 3 },
    ]);
  });

  it("supports heading content blocks", () => {
    const content: ContentBlock[] = [
      { type: "heading", level: 2, text: "Intro" },
      { type: "heading", level: 3, text: "Detail" },
    ];
    expect(extractHeadings(content)).toEqual([
      { id: "intro", text: "Intro", level: 2 },
      { id: "detail", text: "Detail", level: 3 },
    ]);
  });

  it("disambiguates duplicate slugs", () => {
    const content: ContentBlock[] = [
      { type: "heading", level: 2, text: "Notes" },
      { type: "heading", level: 2, text: "Notes" },
    ];
    const out = extractHeadings(content);
    expect(out[0].id).toBe("notes");
    expect(out[1].id).toBe("notes-1");
  });
});

describe("useTableOfContents", () => {
  it("returns headings array memoized", () => {
    const content: ContentBlock[] = [{ type: "heading", level: 2, text: "Hello" }];
    const { result } = renderHook(() => useTableOfContents(content));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].text).toBe("Hello");
  });
});
