import { describe, expect, it } from "vitest";
import posts from "@/data/posts";
import redirects from "@/data/redirects.json";
import { resolveRedirects } from "@/lib/redirects";
import { buildSitemap, buildNewSitemap } from "../../plugins/prerender-posts";

const SITE = "https://iamrusiru.lovable.app";
const locations = (xml: string) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

describe("migration sitemaps", () => {
  it("keeps all 28 original URLs discoverable when every redirect is enabled", () => {
    const enabled = redirects.map((entry) => ({ ...entry, isRedirectEnabled: true }));
    expect(resolveRedirects(enabled, SITE)).toHaveLength(28);
    const urls = locations(buildSitemap(posts));
    expect(urls).toHaveLength(28);
    expect(urls).toContain(`${SITE}/`);
    expect(urls).toContain(`${SITE}/post/proper-project-planning`);
    expect(enabled.every((entry) => urls.includes(entry.oldRoute))).toBe(true);
  });

  it("never includes dummy routes in either sitemap", () => {
    const active = resolveRedirects(redirects, SITE);
    const urls = [...locations(buildSitemap(posts)), ...locations(buildNewSitemap(active))];
    expect(redirects.every((entry) => !urls.includes(entry.newDummyRoute))).toBe(true);
  });

  it("lists only unique enabled destinations in the new sitemap", () => {
    const active = resolveRedirects(redirects, SITE);
    expect(active.length).toBeGreaterThan(0);
    expect(locations(buildNewSitemap([...active, active[0]]))).toEqual([...new Set(active.map((entry) => entry.target))]);
    expect(locations(buildNewSitemap(resolveRedirects(redirects.map((entry) => ({ ...entry, isRedirectEnabled: false })), SITE)))).toEqual([]);
  });

  it("does not invent lastmod timestamps for either sitemap", () => {
    expect(buildSitemap(posts)).not.toContain("<lastmod>");
    expect(buildNewSitemap(resolveRedirects(redirects, SITE))).not.toContain("<lastmod>");
  });
});