import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  articleMeta?: {
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const BASE_URL = "https://blog-heart-craft-97.lovable.app";

export function useSEO({ title, description, canonical, ogType = "website", ogImage, jsonLd, articleMeta }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

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

    // OG tags
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (el) {
        el.setAttribute("content", content);
      }
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

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:type", ogType);
    if (canonical) setMeta("og:url", `${BASE_URL}${canonical}`);
    if (ogImage) setMeta("og:image", ogImage);

    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    // Article meta tags (GEO: helps AI engines understand article context)
    if (articleMeta) {
      if (articleMeta.publishedTime) setOrCreateMeta("article:published_time", articleMeta.publishedTime);
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
      // If array, wrap in @graph for multi-schema injection
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
      // Clean up article meta tags
      document.querySelectorAll('meta[property^="article:"]').forEach((el) => el.remove());
    };
  }, [title, description, canonical, ogType, ogImage, jsonLd, articleMeta]);
}
