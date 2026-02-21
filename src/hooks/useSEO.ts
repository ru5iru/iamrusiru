import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://blog-heart-craft-97.lovable.app";

export function useSEO({ title, description, canonical, ogType = "website", ogImage, jsonLd }: SEOProps) {
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

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:type", ogType);
    if (canonical) setMeta("og:url", `${BASE_URL}${canonical}`);
    if (ogImage) setMeta("og:image", ogImage);

    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    // JSON-LD (dynamic, per-page)
    let scriptEl = document.getElementById("dynamic-jsonld");
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "dynamic-jsonld";
        scriptEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Clean up dynamic JSON-LD on unmount
      const el = document.getElementById("dynamic-jsonld");
      if (el) el.remove();
    };
  }, [title, description, canonical, ogType, ogImage, jsonLd]);
}
