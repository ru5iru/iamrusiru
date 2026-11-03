import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import type { ImportedImage } from "../_shared/blogger.ts";

const MAX_BYTES = 5 * 1024 * 1024;
export function allowedImage(url: URL) {
  return url.protocol === "https:" && !url.username && !url.password && !url.port &&
    (url.hostname === "blogger.googleusercontent.com" || /^[1-4]\.bp\.blogspot\.com$/.test(url.hostname));
}
export async function importImage(src: string, blogId: string, client: SupabaseClient): Promise<ImportedImage | null> {
  try {
    const url = new URL(src);
    if (!allowedImage(url)) return null;
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(src));
    const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
    const folder = `${blogId}/${hash}`;
    const bucket = client.storage.from("blogger-media");
    const { data: stored } = await bucket.download(`${folder}/dimensions.json`);
    if (stored) {
      const meta = JSON.parse(await stored.text());
      return { url: bucket.getPublicUrl(`${folder}/article.jpg`).data.publicUrl, thumbnail: bucket.getPublicUrl(`${folder}/card.jpg`).data.publicUrl, width: meta.width, height: meta.height };
    }
    const ips = await Deno.resolveDns(url.hostname, "A");
    if (!ips.length || ips.some(ip => /^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip))) return null;
    const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(8000) });
    if (!response.ok || !/^image\/(jpeg|png)$/.test(response.headers.get("content-type")?.split(";")[0] ?? "")) return null;
    if (Number(response.headers.get("content-length")) > MAX_BYTES) return null;
    const reader = response.body?.getReader();
    if (!reader) return null;
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    // Inspect dimensions before decode, so a tiny decompression bomb is rejected.
    let width = 0, height = 0;
    const view = new DataView(bytes.buffer);
    if (bytes[0] === 137 && bytes[1] === 80 && bytes.length >= 24) {
      width = view.getUint32(16); height = view.getUint32(20);
    } else if (bytes[0] === 255 && bytes[1] === 216) {
      let cursor = 2;
      while (cursor + 9 < bytes.length) {
        if (bytes[cursor] !== 255) break;
        const marker = bytes[cursor + 1], length = view.getUint16(cursor + 2);
        if ([192, 193, 194].includes(marker)) { height = view.getUint16(cursor + 5); width = view.getUint16(cursor + 7); break; }
        if (length < 2) break;
        cursor += length + 2;
      }
    }
    if (!width || !height || width * height > 12_000_000 || width > 10000 || height > 10000) return null;
    const image = await Image.decode(bytes);
    const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
    if (scale < 1) image.resize(Math.max(1, Math.round(image.width * scale)), Math.max(1, Math.round(image.height * scale)));
    const articleWidth = image.width, articleHeight = image.height;
    const full = await image.encodeJPEG(82);
    const thumbScale = Math.min(1, 384 / image.width);
    if (thumbScale < 1) image.resize(Math.max(1, Math.round(image.width * thumbScale)), Math.max(1, Math.round(image.height * thumbScale)));
    const card = await image.encodeJPEG(78);
    for (const [name, body, contentType] of [
      ["article.jpg", full, "image/jpeg"], ["card.jpg", card, "image/jpeg"],
      ["dimensions.json", JSON.stringify({ width: articleWidth, height: articleHeight }), "application/json"],
    ] as const) {
      const { error } = await bucket.upload(`${folder}/${name}`, body, { contentType, upsert: true });
      if (error) return null;
    }
    return { url: bucket.getPublicUrl(`${folder}/article.jpg`).data.publicUrl, thumbnail: bucket.getPublicUrl(`${folder}/card.jpg`).data.publicUrl, width: articleWidth, height: articleHeight };
  } catch { return null; }
}