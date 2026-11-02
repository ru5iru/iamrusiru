// Pure contracts shared by the importer, browser and prerender plugin.
export const BLOGGER_FRESHNESS_MS = 30 * 60 * 1000;
export interface BloggerArticle {
  blogId: string;
  postId: string;
  title: string;
  excerpt: string;
  date: string;
  updatedDate: string;
  author: string;
  originalUrl: string;
  html: string;
  tags: string[];
  category: string;
  readTime: string;
  imageUrl?: string;
}
export interface BloggerSnapshot {
  configured: boolean;
  posts: BloggerArticle[];
  refreshedAt: string | null;
  refreshing?: boolean;
  warning?: string;
}
export const bloggerPath = (p: Pick<BloggerArticle, "blogId" | "postId">) =>
  `/blogger/${p.blogId}/${p.postId}`;
export function isFresh(refreshedAt: string | null, now = Date.now()): boolean {
  if (!refreshedAt) return false;
  const age = now - Date.parse(refreshedAt);
  return Number.isFinite(age) && age >= 0 && age < BLOGGER_FRESHNESS_MS;
}
export function mergeImportedPosts(existing: BloggerArticle[], incoming: BloggerArticle[]): BloggerArticle[] {
  return [...new Map([...existing, ...incoming].map(p => [`${p.blogId}:${p.postId}`, p])).values()]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.postId.localeCompare(b.postId));
}
export function safeHttps(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

// Structural parser interface keeps one sanitizer usable in Deno, Vite and Node.
export interface HtmlNode {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  children?: HtmlNode[];
}
export interface ImportedImage { url: string; width: number; height: number; thumbnail?: string }
const allowed = new Set("p div span br hr h2 h3 h4 h5 h6 ul ol li blockquote pre code strong em b i u s a table thead tbody tr th td figure figcaption img sup sub".split(" "));
const blocked = new Set("script style iframe object embed form input button textarea select svg math video audio link meta base template noscript".split(" "));
export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export function createBloggerSanitizer(parse: (html: string) => HtmlNode) {
  return (html: string, images: Map<string, ImportedImage> = new Map(), trustedImagePrefix?: string) => {
    let headingIndex = 0;
    let text = "";
    const imageSources: string[] = [];
    const render = (node: HtmlNode): string => {
      if (node.type === "text") {
        const data = (node.data ?? "").replace(/\u2014/g, ", ");
        text += data + " ";
        return escapeHtml(data);
      }
      const originalTag = node.name?.toLowerCase();
      if (originalTag && blocked.has(originalTag)) return "";
      const tag = originalTag === "h1" ? "h2" : originalTag;
      const attrs = node.attribs ?? {};
      if (tag === "img") {
        const src = safeHttps(attrs.src ?? "");
        if (!src) return "";
        imageSources.push(src);
        let image = images.get(src);
        if (!image && trustedImagePrefix && src.startsWith(trustedImagePrefix)) {
          const width = Number(attrs.width), height = Number(attrs.height);
          if (Number.isInteger(width) && width > 0 && width <= 4096 && Number.isInteger(height) && height > 0 && height <= 4096)
            image = { url: src, width, height };
        }
        if (!image) return "";
        return `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(attrs.alt ?? "")}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" />`;
      }
      const inner = (node.children ?? []).map(render).join("");
      if (!tag || !allowed.has(tag)) return inner;
      if (tag === "br" || tag === "hr") return `<${tag} />`;
      let extra = "";
      if (tag === "a") {
        const href = safeHttps(attrs.href ?? "");
        if (href) extra = ` href="${escapeHtml(href)}" rel="noopener noreferrer"`;
      }
      if (/^h[2-6]$/.test(tag)) extra = ` id="blogger-heading-${++headingIndex}"`;
      return `<${tag}${extra}>${inner}</${tag}>`;
    };
    const cleanHtml = render(parse(html));
    return { html: cleanHtml, text: text.replace(/\s+/g, " ").trim(), imageSources: [...new Set(imageSources)] };
  };
}