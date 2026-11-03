import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { isFresh, mergeImportedPosts, type BloggerArticle } from "../_shared/blogger.ts";
import { normalize, pageSchema, sanitize } from "./normalize.ts";
import { importImage } from "./media.ts";

const API = "https://www.googleapis.com/blogger/v3";
class ProviderError extends Error {
  constructor(public status: number, public details: string) { super("Blogger request failed"); }
}
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
async function google(path: string, key: string, params: Record<string, string> = {}) {
  const response = await fetch(`${API}${path}?${new URLSearchParams({ ...params, key })}`, { signal: AbortSignal.timeout(10000), redirect: "error" });
  if (!response.ok) {
    const details = (await response.text()).replaceAll(key, "[redacted]");
    console.error("Blogger provider failed", response.status, details);
    throw new ProviderError(response.status, details);
  }
  return response.json();
}
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Only public reads are supported." }, 405);
  const requestUrl = new URL(req.url);
  if ([...requestUrl.searchParams.keys()].some(k => k !== "mode") || (requestUrl.searchParams.has("mode") && requestUrl.searchParams.get("mode") !== "snapshot"))
    return json({ error: "Invalid parameters." }, 400);
  // Deliberately public: only configured, published and sanitized articles are exposed.
  const key = Deno.env.get("BLOGGER_API_KEY");
  let blogId = Deno.env.get("BLOGGER_BLOG_ID");
  const blogUrl = Deno.env.get("BLOGGER_BLOG_URL");
  if (!key || (!blogId && !blogUrl)) return json({ configured: false, posts: [], refreshedAt: null });
  const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  let lease: string | null = null;
  try {
    if (!blogId) {
      const url = new URL(blogUrl ?? "");
      if (url.protocol !== "https:" || url.username || url.password) return json({ error: "Invalid configured blog URL." }, 400);
      const blog = await google("/blogs/byurl", key, { url: url.href });
      blogId = blog.id;
    }
    if (!blogId || !/^\d+$/.test(blogId)) return json({ error: "Invalid configured blog ID." }, 400);
    const { error: initError } = await client.from("blogger_cache").upsert({ blog_id: blogId }, { onConflict: "blog_id", ignoreDuplicates: true });
    if (initError) throw new Error("Cache initialization failed");
    const { data: row, error: readError } = await client.from("blogger_cache").select("*").eq("blog_id", blogId).single();
    if (readError || !row) throw new Error("Cache read failed");
    const result = { configured: true, posts: row.snapshot.posts ?? [], refreshedAt: row.refreshed_at, refreshing: row.importing };
    if (requestUrl.searchParams.get("mode") === "snapshot" || isFresh(row.refreshed_at)) return json({ ...result, refreshing: false });
    if (row.retry_after && Date.parse(row.retry_after) > Date.now()) return json({ ...result, refreshing: false, warning: "Blogger refresh is temporarily unavailable. Showing saved posts." });
    lease = new Date(Date.now() + 50_000).toISOString();
    const { data: claimed } = await client.from("blogger_cache").update({ lease_until: lease }).eq("blog_id", blogId)
      .or(`lease_until.is.null,lease_until.lt.${new Date().toISOString()}`).select("blog_id");
    if (!claimed?.length) return json({ ...result, refreshing: true });
    const page = pageSchema.parse(await google(`/blogs/${blogId}/posts`, key, {
      status: "live", maxResults: "3", fetchBodies: "true", orderBy: "published",
      ...(row.importing && row.next_page_token ? { pageToken: row.next_page_token } : {}),
    }));
    const imported: BloggerArticle[] = [];
    // Small chunks keep API, HTML parsing and image work within one function invocation.
    for (const raw of page.items) {
      const images = new Map();
      const sources = sanitize(raw.content).imageSources.slice(0, 4);
      await Promise.all(sources.map(async src => { const image = await importImage(src, blogId ?? "", client); if (image) images.set(src, image); }));
      imported.push(normalize(raw, blogId, images));
    }
    const staged = mergeImportedPosts(row.importing ? row.staging_posts : [], imported);
    const done = !page.nextPageToken;
    const now = new Date().toISOString();
    const update = done
      ? { snapshot: { posts: staged }, refreshed_at: now, staging_posts: [], next_page_token: null, importing: false, lease_until: null, retry_after: null }
      : { staging_posts: staged, next_page_token: page.nextPageToken, importing: true, lease_until: null, retry_after: null };
    const { data: saved, error: saveError } = await client.from("blogger_cache").update(update).eq("blog_id", blogId).eq("lease_until", lease).select("blog_id");
    if (saveError || !saved?.length) throw new Error("Cache update failed");
    return json({ configured: true, posts: done ? staged : result.posts, refreshedAt: done ? now : result.refreshedAt, refreshing: !done });
  } catch (error) {
    if (blogId && lease) await client.from("blogger_cache").update({ lease_until: null, retry_after: new Date(Date.now() + 5 * 60_000).toISOString(), importing: false, staging_posts: [], next_page_token: null }).eq("blog_id", blogId).eq("lease_until", lease);
    const failure = error instanceof ProviderError ? { status: error.status, details: error.details } : { status: 502, details: "Blogger import or cache validation failed." };
    return json({ error: "Blogger request failed", ...failure }, failure.status);
  }
});