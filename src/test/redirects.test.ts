import { describe, it, expect } from "vitest";
import { resolveRedirects, normalizePath, type RedirectEntry } from "@/lib/redirects";
import { applyRedirectToHtml, buildDummyHtml } from "../../plugins/prerender-posts";

const SITE = "https://iamrusiru.lovable.app";
const entry = (o: Partial<RedirectEntry>): RedirectEntry => ({
  oldRoute: `${SITE}/post/a`,
  redirectRoute: "https://newsite.com/post/a",
  isRedirectEnabled: true,
  newDummyRoute: `${SITE}/post/a-dummy`,
  ...o,
});

describe("redirect rules", () => {
  it("only enabled entries redirect", () => {
    expect(resolveRedirects([entry({ isRedirectEnabled: false })], SITE)).toHaveLength(0);
    expect(resolveRedirects([entry({})], SITE)[0].target).toBe("https://newsite.com/post/a");
  });

  it("skips a redirect back to the same page (loop)", () => {
    expect(resolveRedirects([entry({ redirectRoute: `${SITE}/post/a/` })], SITE)).toHaveLength(0);
  });

  it("skips a redirect to another redirected old route (chain)", () => {
    const list = [entry({ redirectRoute: `${SITE}/post/b` }), entry({ oldRoute: `${SITE}/post/b`, newDummyRoute: `${SITE}/post/b-dummy` })];
    expect(resolveRedirects(list, SITE).map((r) => r.oldPath)).toEqual(["/post/b"]);
  });

  it("normalizes full URLs to paths", () => {
    expect(normalizePath(`${SITE}/about/`)).toBe("/about");
    expect(normalizePath(`${SITE}/`)).toBe("/");
  });
});

describe("redirect pages", () => {
  const html = `<html><head><link rel="canonical" href="${SITE}/post/a" /><meta property="og:url" content="${SITE}/post/a" /><meta name="robots" content="index, follow" /></head><body></body></html>`;

  it("old page redirects and canonicals to the new URL", () => {
    const out = applyRedirectToHtml(html, "https://newsite.com/post/a");
    expect(out.match(/rel="canonical"/g)).toHaveLength(1);
    expect(out).toContain('<link rel="canonical" href="https://newsite.com/post/a" />');
    expect(out).toContain('http-equiv="refresh" content="0; url=https://newsite.com/post/a"');
    expect(out).toContain('window.location.replace("https://newsite.com/post/a")');
  });

  it("dummy page does not redirect and is noindex", () => {
    const out = buildDummyHtml(html, "https://newsite.com/post/a");
    expect(out).not.toContain("refresh");
    expect(out).not.toContain("location.replace");
    expect(out).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(out).toContain('<link rel="canonical" href="https://newsite.com/post/a" />');
  });
});
