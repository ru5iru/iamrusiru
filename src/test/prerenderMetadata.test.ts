import { describe, expect, it } from "vitest";
import { replaceMeta } from "../../plugins/prerender-posts";

describe("prerendered route metadata", () => {
  it("replaces inherited metadata regardless of Vite serialization", () => {
    const template = `<html><head><title>Home</title>
      <meta content="Home description" name="description" />
      <meta property="og:title" content="Home" />
      <meta content="Duplicate" property="og:title">
      <meta property="og:description" content="Home description" />
      <meta property="og:url" content="https://iamrusiru.lovable.app/" />
      <meta name="twitter:title" content="Home" />
      <meta name="twitter:description" content="Home description" />
      </head><body></body></html>`;
    const page = { title: "Drupal caching | iamrusiru", description: "Understand cache tags & contexts.", url: "https://iamrusiru.lovable.app/post/drupal-page-caching" };
    const doc = new DOMParser().parseFromString(replaceMeta(template, page), "text/html");
    expect(doc.title).toBe(page.title);
    expect(doc.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(page.title);
    expect(doc.querySelector('meta[property="og:description"]')?.getAttribute("content")).toBe(page.description);
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(page.url);
    expect(doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content")).toBe(page.title);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(page.description);
  });

  it("creates missing social preview values for a route", () => {
    const page = { title: "About Rusiru", description: "Meet the author.", url: "https://iamrusiru.lovable.app/about" };
    const doc = new DOMParser().parseFromString(replaceMeta("<html><head><title>Home</title></head></html>", page), "text/html");
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(page.url);
    expect(doc.querySelector('meta[name="twitter:description"]')?.getAttribute("content")).toBe(page.description);
  });
});