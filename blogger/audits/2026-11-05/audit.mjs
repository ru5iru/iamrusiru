// Read-only audit harness. Writes evidence only; never builds/restores a theme.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';
const root = process.cwd();
const dir = path.join(root, 'blogger/audits/2026-11-05');
const raw = path.join(root, 'output/playwright/seo-audit-2026-11-05-blogger-recheck');
const origin = 'https://ru5iru.blogspot.com';
const mode = process.argv[2] || 'fetch';
await fs.mkdir(path.join(raw, 'responses'), { recursive: true });
const manifestPath = path.join(raw, 'manifest.json');
let records = await fs.readFile(manifestPath, 'utf8').then(JSON.parse).catch(() => []);
const save = () => fs.writeFile(manifestPath, JSON.stringify(records, null, 2));
const local = JSON.parse(await fs.readFile(path.join(root, 'blogger/output/content.json'), 'utf8'));
const key = url => createHash('sha256').update(url).digest('hex').slice(0, 16);
async function get(url, group = 'route', headers = {}) {
  const record = { url, group, fetchedAt: new Date().toISOString() };
  const start = performance.now();
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'BloggerSEOAudit/1.0 (owner-requested public-site audit)', ...headers }, signal: AbortSignal.timeout(45000) });
    record.status = response.status; record.finalUrl = response.url;
    record.headers = Object.fromEntries(response.headers);
    const bytes = Buffer.from(await response.arrayBuffer());
    record.decodedBytes = bytes.length; record.ms = Math.round(performance.now() - start);
    record.file = 'responses/' + key(url + JSON.stringify(headers)) + '.txt';
    await fs.writeFile(path.join(raw, record.file), bytes);
  } catch (error) { record.error = error.message; record.ms = Math.round(performance.now() - start); }
  records = records.filter(r => !(r.url === url && r.group === group));
  records.push(record); await save();
  console.log(JSON.stringify({ group, status: record.status, url, error: record.error }));
  return record;
}
async function batch(urls, group = 'route') {
  let cursor = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < urls.length) { const url = urls[cursor++]; await get(url, group); }
  }));
}
const read = record => fs.readFile(path.join(raw, record.file), 'utf8');
const vc = new VirtualConsole();
const dom = html => new JSDOM(html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ''), { virtualConsole: vc, url: origin }).window.document;
const text = node => {
  if (!node) return '';
  const copy = node.cloneNode(true); copy.querySelectorAll?.('script,style,noscript').forEach(el => el.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
};
const words = value => value.split(/\s+/).filter(Boolean).length;
const value = el => el.getAttribute('content') ?? el.getAttribute('href') ?? el.getAttribute('src') ?? el.getAttribute('datetime') ?? text(el);
function item(scope) {
  const properties = {};
  for (const el of scope.querySelectorAll('[itemprop]')) {
    if (el.parentElement.closest('[itemscope]') !== scope) continue;
    for (const prop of el.getAttribute('itemprop').split(/\s+/)) (properties[prop] ||= []).push(el.hasAttribute('itemscope') ? item(el) : value(el));
  }
  return { type: scope.getAttribute('itemtype'), id: scope.getAttribute('itemid'), properties };
}
function analyze(record, html) {
  const d = dom(html), metas = {};
  for (const m of d.querySelectorAll('meta[name],meta[property]')) (metas[m.name || m.getAttribute('property')] ||= []).push(m.content);
  const article = d.querySelector('[data-article-body]');
  const body = article || d.querySelector('.page-body') || d.querySelector('main');
  const content = text(body);
  const nodes = [...d.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(el => ({ level: Number(el.tagName.slice(1)), text: text(el), id: el.id }));
  const links = [...d.querySelectorAll('a[href]')].map(el => ({ href: el.href, text: text(el) || el.getAttribute('aria-label') || '', rel: el.rel, inBody: Boolean(article?.contains(el)) }));
  const schema = [...d.querySelectorAll('[itemscope]')].filter(el => !el.parentElement?.closest('[itemscope]')).map(item);
  const jsonLd = [...d.querySelectorAll('script[type="application/ld+json"]')].map(el => { try { return JSON.parse(el.textContent); } catch (error) { return { parseError: error.message }; } });
  const ids = [...d.querySelectorAll('[id]')].map(el => el.id);
  const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  const faq = [...d.querySelectorAll('[itemtype$="/Question"]')].map(q => ({ question: text(q.querySelector('[itemprop="name"]')), answer: text(q.querySelector('[itemprop="text"]')) }));
  return {
    url: record.url, finalUrl: record.finalUrl, status: record.status, group: record.group,
    ms: record.ms, decodedBytes: record.decodedBytes, headers: record.headers,
    titles: [...d.querySelectorAll('title')].map(el => el.textContent), metas,
    canonical: [...d.querySelectorAll('link[rel="canonical"]')].map(el => el.href), lang: d.documentElement.lang,
    feeds: [...d.querySelectorAll('link[rel="alternate"]')].map(el => ({ type: el.type, href: el.href, hreflang: el.hreflang })),
    headings: nodes, wordCount: words(content), contentStart: content.slice(0, 1000), contentHash: createHash('sha256').update(content).digest('hex'),
    mainPresent: Boolean(d.querySelector('main')), articlePresent: Boolean(article), summary: text(d.querySelector('.post-summary')), faq,
    links, images: [...d.images].map(el => ({ src: el.src.startsWith('data:') ? el.src.slice(0,el.src.indexOf(',')+1)+'[hashed-inline-image]' : el.src, inlineDataBytes: el.src.startsWith('data:') ? Buffer.byteLength(el.src) : undefined, inlineDataSha256: el.src.startsWith('data:') ? createHash('sha256').update(el.src).digest('hex') : undefined, alt: el.getAttribute('alt'), width: el.getAttribute('width'), height: el.getAttribute('height'), loading: el.loading || el.getAttribute('loading'), srcset: el.srcset, inBody: Boolean(article?.contains(el)) })),
    schema, jsonLd, duplicateIds: duplicates,
    visibleDate: [...d.querySelectorAll('.article-meta time')].map(el => ({ text: text(el), datetime: el.dateTime })),
    visibleAuthor: text(d.querySelector('[data-post-author]')),
    inlineStyleBytes: [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].reduce((sum, m) => sum + Buffer.byteLength(m[1]), 0),
    inlineScriptBytes: [...d.scripts].filter(el => !el.src).reduce((sum, el) => sum + Buffer.byteLength(el.textContent), 0),
    scripts: [...d.scripts].filter(el => el.src).map(el => ({ src: el.src, async: el.async, defer: el.defer })),
    unexpectedLinks: links.filter(l => /\/(post\/|about$|contact$|privacy-policy$|cookie-policy$)/.test(l.href)),
    placeholders: [...content.matchAll(/\[SOURCE:[^\]]+\]|REPLACE_WITH|YOUR_BLOGGER_IMAGE_URL|Write your introduction here|Replace this with|lorem ipsum/gi)].map(m => m[0]),
  };
}
if (mode === 'fetch') {
  await batch(['/robots.txt', '/sitemap.xml', '/sitemap-pages.xml', '/feeds/posts/default?alt=rss', '/feeds/posts/default?alt=json&max-results=150', '/feeds/pages/default?alt=json&max-results=150'].map(p => origin + p), 'discovery');
  const sitemapUrls = new Set();
  for (const r of records.filter(r => r.group === 'discovery' && r.url.includes('sitemap') && r.file)) {
    for (const match of (await read(r)).matchAll(/<loc>(.*?)<\/loc>/g)) if (match[1].startsWith(origin + '/')) sitemapUrls.add(match[1]);
  }
  await batch([origin + '/', ...sitemapUrls], 'route');
  const post = local.posts.find(p => p.slug === 'injection') || local.posts[0];
  await batch([
    origin + '/?m=1', origin + post.path + '?m=1', origin + '/p/about.html?m=1', origin + '/?m=0',
    origin + '/?utm_source=seo-audit', origin + post.path + '?utm_source=seo-audit',
    origin + '/search?q=Drupal', origin + '/search?q=zz-audit-no-results-20261105',
    origin + '/search/label/Engineering', origin + '/search/label/Drupal', origin + '/2026/06/',
    origin + '/seo-audit-missing-20261105.html', origin + '/p/seo-audit-missing-20261105.html',
    origin + '/rss.xml',
    'http://ru5iru.blogspot.com/', 'http://ru5iru.blogspot.com' + post.path,
  ], 'variant');
  // Follow actual pagination links until the home feed has exhausted its pages.
  let next = origin + '/', seen = new Set();
  while (next && !seen.has(next) && seen.size < 10) {
    seen.add(next);
    let r = records.find(r => r.url === next && ['route','pagination'].includes(r.group));
    if (!r) r = await get(next, 'pagination');
    if (!r.file || r.status !== 200) break;
    next = dom(await read(r)).querySelector('a[rel="next"]')?.href;
    if (next && !next.startsWith(origin)) break;
  }
  await batch([origin + '/llms.txt', origin + '/llms-full.txt', origin + '/ads.txt'], 'optional');
}
if (['fetch','analyze'].includes(mode)) {
  const pages = [];
  for (const r of records.filter(r => r.file && /text\/html/.test(r.headers?.['content-type'] || '') && ['route','variant','pagination','optional'].includes(r.group))) pages.push(analyze(r, await read(r)));
  const localPages = [];
  const template = await fs.readFile(path.join(root, 'blogger/output/iamrusiru-blogger.xml'), 'utf8');
  const { renderPreview } = await import('../../../scripts/lib/blogger-preview.mjs');
  const media = new Map(Object.entries(JSON.parse(await fs.readFile(path.join(root, 'blogger/output/media-manifest.json'), 'utf8'))));
  for (const entry of [{ path: '/', kind: 'home' }, ...local.posts.map(p => ({ ...p, kind: 'post' })), ...local.pages.map(p => ({ ...p, kind: 'page' }))]) {
    const html = renderPreview(template, { config: local.config, posts: local.posts, media, kind: entry.kind, post: entry.kind === 'home' ? local.posts[0] : entry, localAssets: false });
    localPages.push(analyze({ url: origin + entry.path, finalUrl: origin + entry.path, group: 'local-fixture', status: 200 }, html));
  }
  const evidence = { capturedAt: new Date().toISOString(), scope: 'Blogger theme, posts, Pages and public settings only', origin, pages, localPages, requests: records.map(({ file, ...r }) => ({ ...r, rawFile: file && 'output/playwright/seo-audit-2026-11-05-blogger-recheck/' + file })) };
  await fs.writeFile(path.join(dir, 'evidence.json'), JSON.stringify(evidence, null, 2));
  const contentRows = local.posts.map(p => {
    const d = dom(p.body); const content = text(d.body);
    const links = [...d.querySelectorAll('a[href]')].map(a => a.href);
    const keywordCoverage = (p.seo?.keywords || []).map(k => ({ keyword: k, inTitle: p.title.toLowerCase().includes(k.toLowerCase()), inBody: content.toLowerCase().includes(k.toLowerCase()) }));
    return { slug: p.slug, path: p.path, title: p.title, seoTitle: p.seo?.title, description: p.seo?.description, keywords: p.seo?.keywords, labels: p.labels, wordCount: words(content), faqCount: d.querySelectorAll('[itemtype$="/Question"]').length, summary: text(d.querySelector('.post-summary')), externalBodyLinks: [...new Set(links.filter(h => h.startsWith('https://') && !h.startsWith(origin)))], headingCount: d.querySelectorAll('h2,h3').length, keywordCoverage, published: p.published, updated: p.updated, imageUrl: p.imageUrl, inlineImages: d.images.length };
  });
  await fs.writeFile(path.join(dir, 'content-inventory.json'), JSON.stringify(contentRows, null, 2));
  console.log(JSON.stringify({ analyzedLive: pages.length, localRoutes: localPages.length, posts: contentRows.length, evidence: path.relative(root, dir) }));
}
if (mode === 'links') {
  const evidence = JSON.parse(await fs.readFile(path.join(dir, 'evidence.json'), 'utf8'));
  const bodyLinks = new Set(), imageLinks = new Set(), internals = new Set();
  for (const p of evidence.pages.filter(p => p.group === 'route')) {
    for (const a of p.links) {
      if (a.href.startsWith(origin + '/') && !a.href.includes('#') && !a.href.includes('?')) internals.add(a.href);
      if (a.inBody && a.href.startsWith('https://') && !a.href.startsWith(origin)) bodyLinks.add(a.href);
    }
    for (const image of p.images) if (image.src.startsWith('https://')) imageLinks.add(image.src);
    for (const image of p.metas['og:image'] || []) if (image.startsWith('https://')) imageLinks.add(image);
  }
  const already = new Set(records.filter(r => r.status === 200).map(r => r.url));
  await batch([...internals].filter(url => !already.has(url)), 'internal-link');
  await batch([...bodyLinks], 'external-link');
  await batch([...imageLinks], 'asset');
  console.log(JSON.stringify({ uniqueInternals: internals.size, uniqueExternalBodyLinks: bodyLinks.size, uniqueImages: imageLinks.size }));
}
if (mode === 'probes') {
  for (const agent of ['Googlebot','bingbot','OAI-SearchBot','Claude-SearchBot']) {
    for (const url of [origin+'/',origin+'/2026/06/injection.html']) await get(url, 'ua:'+agent, {'User-Agent':agent});
  }
  await get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url='+encodeURIComponent(origin+'/')+'&strategy=mobile', 'pagespeed-api');
  // Preserve the first redirect, separately from the normal followed response.
  for (const url of ['http://ru5iru.blogspot.com/','http://ru5iru.blogspot.com/2026/06/injection.html']) {
    const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(30000)});
    records.push({url,group:'redirect-hop',status:r.status,headers:Object.fromEntries(r.headers),fetchedAt:new Date().toISOString()});
  }
  await save();
}
if (mode === 'outbound') {
  const e=JSON.parse(await fs.readFile(path.join(dir,'evidence.json'),'utf8'));
  const urls=new Set(e.pages.filter(p=>p.group==='route').flatMap(p=>p.links.map(a=>a.href)).filter(h=>h.startsWith('https://')&&!h.startsWith(origin)&&!/\/intent\/|\/sharing\/|\/sharer|accounts\.google|\/signin|\/login/.test(h)));
  await batch([...urls], 'outbound-navigation');
}
