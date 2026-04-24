import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogTitle?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterCreator?: string;
  keywords?: string[];
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const BASE_URL = "https://iamrusiru.lovable.app";

export function useSEO({
  title,
  description,
  canonical,
  ogType = "website",
  ogTitle,
  ogImage,
  twitterCard,
  twitterCreator,
  keywords,
  author,
  jsonLd,
  articleMeta,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Keywords (AEO supplementary signal)
    if (keywords && keywords.length > 0) {
      let kw = document.querySelector('meta[name="keywords"]');
      if (!kw) {
        kw = document.createElement("meta");
        kw.setAttribute("name", "keywords");
        document.head.appendChild(kw);
      }
      kw.setAttribute("content", keywords.join(", "));
    }

    // Author per-page
    if (author) {
      let a = document.querySelector('meta[name="author"]');
      if (!a) {
        a = document.createElement("meta");
        a.setAttribute("name", "author");
        document.head.appendChild(a);
      }
      a.setAttribute("content", author);
    }

    // Robots: ensure index,follow on every public page
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
      robots.setAttribute(
        "content",
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      );
    }

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = `${BASE_URL}${canonical}`;
    }

    const setMeta = (property: string, content: string) => {
      const el =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (el) el.setAttribute("content", content);
    };

    const setOrCreateMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const ogTitleVal = ogTitle || title;
    setMeta("og:title", ogTitleVal);
    setMeta("og:description", description);
    setMeta("og:type", ogType);
    if (canonical) setMeta("og:url", `${BASE_URL}${canonical}`);
    if (ogImage) setMeta("og:image", ogImage);

    setMeta("twitter:title", ogTitleVal);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    // Twitter card type
    const cardType = twitterCard || (ogImage ? "summary_large_image" : "summary");
    let cardEl = document.querySelector('meta[name="twitter:card"]');
    if (!cardEl) {
      cardEl = document.createElement("meta");
      cardEl.setAttribute("name", "twitter:card");
      document.head.appendChild(cardEl);
    }
    cardEl.setAttribute("content", cardType);

    if (twitterCreator) {
      let tc = document.querySelector('meta[name="twitter:creator"]');
      if (!tc) {
        tc = document.createElement("meta");
        tc.setAttribute("name", "twitter:creator");
        document.head.appendChild(tc);
      }
      tc.setAttribute("content", twitterCreator);
    }

    // Article meta tags (GEO: helps AI engines understand article context)
    if (articleMeta) {
      if (articleMeta.publishedTime)
        setOrCreateMeta("article:published_time", articleMeta.publishedTime);
      if (articleMeta.modifiedTime)
        setOrCreateMeta("article:modified_time", articleMeta.modifiedTime);
      else if (articleMeta.publishedTime)
        setOrCreateMeta("article:modified_time", articleMeta.publishedTime);
      if (articleMeta.author) setOrCreateMeta("article:author", articleMeta.author);
      if (articleMeta.section) setOrCreateMeta("article:section", articleMeta.section);
      articleMeta.tags?.forEach((tag, i) => {
        setOrCreateMeta(`article:tag:${i}`, tag);
      });
    }

    // JSON-LD (dynamic, per-page — supports single or array)
    let scriptEl = document.getElementById("dynamic-jsonld");
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "dynamic-jsonld";
        scriptEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptEl);
      }
      const payload = Array.isArray(jsonLd)
        ? { "@context": "https://schema.org", "@graph": jsonLd }
        : jsonLd;
      scriptEl.textContent = JSON.stringify(payload);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const el = document.getElementById("dynamic-jsonld");
      if (el) el.remove();
      document.querySelectorAll('meta[property^="article:"]').forEach((m) => m.remove());
    };
  }, [
    title,
    description,
    canonical,
    ogType,
    ogTitle,
    ogImage,
    twitterCard,
    twitterCreator,
    keywords,
    author,
    jsonLd,
    articleMeta,
  ]);
}
