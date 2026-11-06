// Reuse the actual components so the Blogger export follows the original design.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Hero from "../src/components/blog/Hero";
import Footer from "../src/components/blog/Footer";
import Sidebar from "../src/components/blog/Sidebar";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import PrivacyPolicy from "../src/pages/PrivacyPolicy";
import CookiePolicy from "../src/pages/CookiePolicy";
import allPosts from "../src/data/posts";
import CodeBlock from "../src/components/blog/CodeBlock";
import CalloutBlock from "../src/components/blog/CalloutBlock";
import ImageBlock from "../src/components/blog/ImageBlock";
import type { ContentBlock } from "../src/data/posts/types";
import SharePost from "../src/components/blog/SharePost";
import RelatedPosts from "../src/components/blog/RelatedPosts";
import { ArrowLeft, ArrowUp, Clock, CodeXml, Facebook, Mail, Share2 } from "lucide-react";
import { countWords } from "../src/hooks/useReadingTime";
import { extractKeywords } from "../src/lib/seoKeywords";

export const hero = renderToStaticMarkup(<Hero />);
export const footer = renderToStaticMarkup(<Footer />);
export const sidebar = renderToStaticMarkup(<Sidebar activeTopic={null} activeTag={null} onTopicSelect={() => {}} onTagSelect={() => {}} />);
type CapturedSEO = { title?: string; description?: string; keywords?: string[]; noIndex?: boolean };
function page(slug: string, title: string, element: React.ReactElement) {
  const capture = globalThis as typeof globalThis & { __BLOGGER_SEO__?: CapturedSEO };
  delete capture.__BLOGGER_SEO__;
  const html = renderToStaticMarkup(element);
  const seo = capture.__BLOGGER_SEO__ || {};
  delete capture.__BLOGGER_SEO__;
  return { slug, title, html, seo };
}
export const pages = [
  page("about", "About me", <About />), page("contact", "Contact", <Contact />),
  page("privacy-policy", "Privacy Policy", <PrivacyPolicy />), page("cookie-policy", "Cookie Policy", <CookiePolicy />),
];
export const posts = allPosts;
// Blogger keeps complete native titles; it must not inherit mechanical
// character-limit slicing from a separate application's title builder.
export const postSEO = (post: typeof allPosts[number], _blogName: string) => ({ title: post.title, description: (post as typeof post & { searchDescription?: string }).searchDescription || post.excerpt, keywords: extractKeywords(post) });
export const readingTimes = Object.fromEntries(allPosts.map(post => [post.slug, post.readTime || `${Math.max(1, Math.round(countWords(post.content) / 238))} min read`]));
export const share = renderToStaticMarkup(<SharePost title="" url="" />);
export const renderRelated = (slugs: string[]) => renderToStaticMarkup(<RelatedPosts slugs={slugs} />);
export const icons = {
  back: renderToStaticMarkup(<ArrowLeft size={16} aria-hidden="true" />),
  up: renderToStaticMarkup(<ArrowUp size={20} aria-hidden="true" />),
  clock: renderToStaticMarkup(<Clock size={14} aria-hidden="true" />),
  code: renderToStaticMarkup(<CodeXml size={22} aria-hidden="true" />),
  facebook: renderToStaticMarkup(<Facebook size={16} aria-hidden="true" />),
  email: renderToStaticMarkup(<Mail size={16} aria-hidden="true" />),
  nativeShare: renderToStaticMarkup(<Share2 size={16} aria-hidden="true" />),
};
export const renderCode = (block: Extract<ContentBlock, { type: "code" }>) => renderToStaticMarkup(<CodeBlock language={block.language} code={block.code} />);
export const renderCallout = (block: Extract<ContentBlock, { type: "callout" }>) => renderToStaticMarkup(<CalloutBlock variant={block.variant} text={block.text} />);
export const renderImage = (block: Extract<ContentBlock, { type: "image" }>) => renderToStaticMarkup(<ImageBlock {...block} />);
