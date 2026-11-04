import { useEffect, useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeBlogger, bloggerMediaPrefix } from "@/lib/blogger/content";
import type { BloggerSnapshot } from "../../supabase/functions/_shared/blogger";

const EMPTY: BloggerSnapshot = { configured: false, posts: [], refreshedAt: null };
let cached: BloggerSnapshot = EMPTY;
let inflight: Promise<BloggerSnapshot> | null = null;

async function loadSnapshot(): Promise<BloggerSnapshot> {
  if (inflight) return inflight;
  inflight = (async () => {
    if (!cached.configured) {
      try {
        const response = await fetch("/blogger-snapshot.json");
        if (response.ok && response.headers.get("content-type")?.includes("json")) {
          const snapshot = await response.json();
          if (snapshot && Array.isArray(snapshot.posts)) cached = snapshot;
        }
      } catch { /* Build snapshot is optional in development. */ }
    }
    const { data, error } = await supabase.functions.invoke("blogger-posts", { method: "GET" });
    if (error) {
      // Read the provider context, but never render arbitrary service text as HTML.
      const details = error instanceof FunctionsHttpError ? await error.context.text() : error.message;
      console.warn("Blogger read unavailable", error instanceof FunctionsHttpError ? error.context.status : "network", details);
      return { ...cached, warning: "Blogger posts are temporarily unavailable." };
    }
    if (!data || !Array.isArray(data.posts)) return { ...cached, warning: "Blogger posts are temporarily unavailable." };
    const prefix = bloggerMediaPrefix(import.meta.env.VITE_SUPABASE_URL);
    cached = { ...data, posts: data.posts.map((post: BloggerSnapshot["posts"][number]) => ({ ...post, html: sanitizeBlogger(post.html, undefined, prefix).html })) };
    return cached;
  })().catch(() => ({ ...cached, warning: "Blogger posts are temporarily unavailable." })).finally(() => { inflight = null; });
  return inflight;
}

export function useBloggerPosts() {
  const [snapshot, setSnapshot] = useState(cached);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      const next = await loadSnapshot();
      if (cancelled) return;
      setSnapshot(next);
      setLoading(false);
      // Continue a chunked import only while the view is open.
      if (next.refreshing) timer = setTimeout(load, 5000);
    };
    void load();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);
  return { ...snapshot, loading };
}