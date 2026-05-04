import type { BlogPost, ContentBlock } from "@/data/posts/types";

/**
 * Stopwords excluded from keyword extraction.
 */
const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","else","for","of","on","in","at",
  "to","from","by","with","as","is","are","was","were","be","been","being","this",
  "that","these","those","it","its","i","you","we","they","he","she","my","your",
  "our","their","not","no","do","does","did","done","have","has","had","will","would",
  "can","could","should","may","might","just","also","than","so","too","very","more",
  "most","some","any","all","one","two","about","into","over","up","down","out","what",
  "why","how","when","where","which","who","whom","there","here","like","get","got",
  "make","made","use","used","using","want","need","know","see","go","going","really",
  "only","even","much","many","still","because","while","after","before","again",
  "way","ways","thing","things","good","bad","new","old","time","times","day","days",
  "post","posts","blog","article","read","reading","write","writing","my","me",
]);

const MIN_TERM_LEN = 3;
const MAX_KEYWORDS = 8;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[`*_~#>]+/g, " ")
    .replace(/[^a-z0-9+\-./\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[-.+/]+|[-.+/]+$/g, ""))
    .filter((t) => t.length >= MIN_TERM_LEN && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => (typeof b === "string" ? b : ""))
    .join("\n\n");
}

function extractHeadings(text: string): string[] {
  return text
    .split("\n")
    .filter((line) => /^#{2,3}\s/.test(line.trim()))
    .map((line) => line.replace(/^#{2,3}\s+/, ""));
}

function firstNWords(text: string, n: number): string {
  return text.split(/\s+/).slice(0, n).join(" ");
}

/**
 * Returns SEO keyword phrases for a post.
 *
 * Priority:
 *   1. `post.seoKeywords` — author-curated long-tail phrases (preferred).
 *   2. Fallback: score-based extraction from title + headings + lead paragraph.
 *
 * UI filter `tags` are intentionally NOT used as meta keywords. Tags drive
 * navigation; seoKeywords drive search intent.
 */
export function extractKeywords(post: BlogPost): string[] {
  if (post.seoKeywords && post.seoKeywords.length > 0) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const k of post.seoKeywords) {
      const key = k.trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push(k.trim());
      }
    }
    return out;
  }

  const titleTokens = tokenize(post.title);
  const bodyText = blocksToText(post.content);
  const headingText = extractHeadings(bodyText).join(" ");
  const headingTokens = tokenize(headingText);
  const firstTokens = tokenize(firstNWords(bodyText, 300));

  const scores = new Map<string, number>();
  const add = (terms: string[], weight: number) => {
    for (const t of terms) scores.set(t, (scores.get(t) || 0) + weight);
  };
  add(titleTokens, 3);
  add(headingTokens, 2);
  add(firstTokens, 1);

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_KEYWORDS)
    .map(([term]) => term);
}

/**
 * Builds an SEO-friendly title following the format:
 *   "[Post Title] - [hook] | iamrusiru"
 * Truncates body title to keep total under 60 chars.
 */
export function buildPostTitle(post: BlogPost, blogName = "iamrusiru"): string {
  const isCareer = /career|lessons|burnout|balance|journal|sane/i.test(
    post.category + " " + post.title
  );
  const hook = isCareer ? "Lessons" : post.tags[0] || "Deep Dive";
  const suffix = ` | ${blogName}`;
  const maxBody = 60 - suffix.length - 3 - hook.length; // 3 = " · "
  const trimmedTitle =
    post.title.length > maxBody ? post.title.slice(0, maxBody - 1).trimEnd() + "…" : post.title;
  const full = `${trimmedTitle} · ${hook}${suffix}`;
  return full.length <= 60 ? full : `${post.title.slice(0, 60 - suffix.length - 1)}…${suffix}`;
}

/**
 * Returns a 140-160 char benefit-led description.
 * Uses post.excerpt as the source and trims at sentence boundary if needed.
 */
export function buildPostDescription(post: BlogPost): string {
  let desc = post.excerpt.replace(/\s+/g, " ").trim();
  if (desc.length <= 160) {
    // Pad lightly if too short (under 140)
    if (desc.length < 140) {
      const tagLine = ` Includes ${post.tags.slice(0, 2).join(" and ")} insights.`;
      if ((desc + tagLine).length <= 160) desc += tagLine;
    }
    return desc;
  }
  // Truncate at last sentence boundary under 157 chars
  const cut = desc.slice(0, 157);
  const lastDot = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (lastDot > 100) return desc.slice(0, lastDot + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return desc.slice(0, lastSpace) + "…";
}
