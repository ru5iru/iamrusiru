import { JSDOM, VirtualConsole } from 'jsdom';
const cleanText = node => {
  if (!node) return '';
  const copy = node.cloneNode(true); copy.querySelectorAll?.('script,style,noscript').forEach(node => node.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
};
const doc = (html, url) => new JSDOM(html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ''), { url, virtualConsole: new VirtualConsole() }).window.document;
export function analyzeHtml(record) {
  const d = doc(record.text, record.finalUrl || record.url);
  const body = d.querySelector('[itemprop="articleBody"],.post-body,.entry-content,[data-article-body]') || d.querySelector('article') || d.querySelector('main');
  const types = new Set([...d.querySelectorAll('[itemtype]')].flatMap(node => node.getAttribute('itemtype').split(/\s+/).map(type => type.split('/').pop())));
  const jsonFields = new Set();
  let invalidJsonLd = 0;
  const walk = value => {
    if (!value || typeof value !== 'object') return;
    for (const type of [value['@type']].flat().filter(Boolean)) types.add(String(type).split('/').pop());
    for (const key of ['author','publisher','datePublished','dateModified','sameAs']) if (value[key]) jsonFields.add(key);
    for (const child of Object.values(value)) if (typeof child === 'object') for (const item of [child].flat()) walk(item);
  };
  for (const script of d.querySelectorAll('script[type="application/ld+json"]')) { try { walk(JSON.parse(script.textContent)); } catch { invalidJsonLd++; } }
  const metas = key => [...d.querySelectorAll(`meta[name="${key}"],meta[property="${key}"]`)].map(node => node.content);
  const links = [...d.querySelectorAll('a[href]')].map(node => ({ url: node.href, text: cleanText(node).slice(0, 100), inBody: Boolean(body?.contains(node)), rel: node.rel }));
  const internal = links.filter(link => { try { return new URL(link.url).hostname === new URL(record.finalUrl || record.url).hostname; } catch { return false; } });
  const headings = [...(body?.querySelectorAll('h2,h3') || [])];
  return {
    url: record.url, finalUrl: record.finalUrl, status: record.status, capturedAt: record.capturedAt, bytes: record.bytes,
    title: d.title.trim(), descriptions: metas('description'), canonical: [...d.querySelectorAll('link[rel="canonical"]')].map(node => node.href),
    robots: metas('robots'), xRobots: record.headers?.['x-robots-tag'] || '', viewport: metas('viewport'), lang: d.documentElement.lang,
    og: Object.fromEntries(['title','description','url','type','image'].map(key => [key, metas('og:' + key)])),
    twitter: Object.fromEntries(['card','title','description','image'].map(key => [key, metas('twitter:' + key)])),
    socialImageDetails: { ogAlt: metas('og:image:alt'), width: metas('og:image:width'), height: metas('og:image:height'), twitterAlt: metas('twitter:image:alt') },
    legacyKeywords: metas('keywords').length > 0, types: [...types].sort(), invalidJsonLd,
    jsonLdCount: d.querySelectorAll('script[type="application/ld+json"]').length, microdataCount: d.querySelectorAll('[itemscope]').length,
    h1Count: d.querySelectorAll('h1').length, bodyChars: cleanText(body).length, bodyWords: cleanText(body).split(/\s+/).filter(Boolean).length,
    headingCount: headings.length, questionHeadings: headings.filter(node => /\?|^(?:what|why|how|when|where|which)\b/i.test(cleanText(node))).length,
    lists: body?.querySelectorAll('ol,ul').length || 0, tables: body?.querySelectorAll('table').length || 0, code: body?.querySelectorAll('pre').length || 0,
    hasSummary: [...(body?.querySelectorAll('.post-summary,[data-summary],.tldr') || [])].some(node => cleanText(node).length > 20) || /\bTL;DR\b|\bkey takeaways\b/i.test(cleanText(body)),
    toc: Boolean(d.querySelector('[data-toc],#toc,.toc,#toc_container,.table-of-contents,[aria-label="Table of contents"]')),
    faqSchema: types.has('FAQPage'), questionSchema: types.has('Question'), visibleFaqHeading: headings.some(node => /frequently asked|\bFAQs?\b/i.test(cleanText(node))),
    byline: Boolean(d.querySelector('[rel="author"],[itemprop="author"],.post-author,.entry-author,.author-name')), dates: Boolean(d.querySelector('time,[itemprop="datePublished"],.date-header,.published')),
    modified: Boolean(d.querySelector('[itemprop="dateModified"],meta[property="article:modified_time"],time.updated')),
    semanticPublished: jsonFields.has('datePublished') || Boolean(d.querySelector('[itemprop="datePublished"],meta[property="article:published_time"]')),
    semanticModified: jsonFields.has('dateModified') || Boolean(d.querySelector('[itemprop="dateModified"],meta[property="article:modified_time"]')),
    semanticAuthor: jsonFields.has('author') || Boolean(d.querySelector('[itemprop="author"]')),
    additionalTypes: [...d.querySelectorAll('[itemprop="additionalType"]')].map(node => node.getAttribute('content') || node.getAttribute('href') || ''),
    buildId: d.querySelector('meta[name="blogger-theme-build"]')?.content || '',
    placeholders: (cleanText(body).match(/\[(?:SOURCE|INTERNAL LINK):[^\]]+\]/g) || []).length,
    structuredKeywords: [...d.querySelectorAll('meta[itemprop="keywords"]')].map(node => node.content),
    articleDescription: d.querySelector('article > meta[itemprop="description"]')?.content || '',
    faqCount: d.querySelectorAll('[itemtype$="/Question"]').length,
    externalBodyLinks: links.filter(link => link.inBody && /^https?:/.test(link.url) && !internal.includes(link)).map(link => ({ url: link.url, rel: link.rel })),
    internalBodyLinks: internal.filter(link => link.inBody).length,
    postLinks: [...new Set(internal.filter(link => /\/\d{4}\/\d{2}\/[^?#]+\.html(?:[?#]|$)/.test(link.url)).map(link => link.url.split(/[?#]/)[0]))],
    aboutLinks: [...new Set(links.filter(link => /(?:about|author|profile)/i.test(link.text + ' ' + link.url) && !/share|login|signin/i.test(link.url)).map(link => link.url))].slice(0, 5),
    contact: links.some(link => /contact/i.test(link.text + ' ' + link.url) || link.url.startsWith('mailto:')),
    policy: links.some(link => /privacy|cookie|disclosure|editorial policy/i.test(link.text + ' ' + link.url)),
    labels: links.some(link => /\/search\/label\//.test(link.url)), pagination: Boolean(d.querySelector('[rel="next"],.blog-pager-older-link')),
    feeds: [...d.querySelectorAll('link[rel="alternate"]')].filter(node => /rss|atom/.test(node.type)).map(node => node.href),
    images: { count: d.images.length, missingAlt: [...d.images].filter(node => !node.hasAttribute('alt')).length, withDimensions: [...d.images].filter(node => node.hasAttribute('width') && node.hasAttribute('height')).length, responsive: [...d.images].filter(node => node.srcset).length, lazy: [...d.images].filter(node => node.getAttribute('loading') === 'lazy').length },
    preconnect: d.querySelectorAll('link[rel="preconnect"]').length, externalScripts: [...d.scripts].filter(node => node.src).length,
    inlineCssBytes: [...record.text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].reduce((n, match) => n + Buffer.byteLength(match[1]), 0),
    bloggerFootprint: /blogger\.com|feeds\/posts\/default|"blogId"|id=['"]Blog1/i.test(record.text),
  };
}
