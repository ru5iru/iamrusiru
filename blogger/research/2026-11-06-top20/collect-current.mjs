// Compare the current Blogger build with fresh public responses. No product edits.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { renderPreview } from '../../../scripts/lib/blogger-preview.mjs';
import { analyzeHtml } from './analyze-html.mjs';
const dir = 'blogger/research/2026-11-06-top20';
const raw = 'output/playwright/blogspot-top20-2026-11-06/current';
await fs.mkdir(raw, { recursive: true });
const { config, posts, pages } = JSON.parse(await fs.readFile('blogger/output/content.json', 'utf8'));
const build = JSON.parse(await fs.readFile('blogger/output/build-manifest.json', 'utf8'));
const template = await fs.readFile('blogger/output/iamrusiru-blogger.xml', 'utf8');
const media = new Map(Object.entries(JSON.parse(await fs.readFile('blogger/output/media-manifest.json', 'utf8'))));
const routes = [{ path: '/', kind: 'home' }, ...posts.map(post => ({ ...post, kind: 'post' })), ...pages.map(page => ({ ...page, kind: 'page' }))];
const local = [];
for (const route of routes) {
  const html = renderPreview(template, { config, posts, media, kind: route.kind, post: route.kind === 'home' ? posts[0] : route, localAssets: false, genericViewDescription: true });
  const url = config.blogUrl + route.path;
  const analyzed = analyzeHtml({ url, finalUrl: url, status: 200, headers: {}, text: html, capturedAt: new Date().toISOString(), bytes: Buffer.byteLength(html) });
  local.push({ ...analyzed, routeKind: route.kind, source: 'Local evaluator; not native Blogger compilation', bodySha256: createHash('sha256').update(html).digest('hex') });
}
const live = [], requests = [];
let cursor = 0;
const paths = [...routes.map(route => route.path), '/robots.txt', '/sitemap.xml', '/sitemap-pages.xml'];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < paths.length) {
    const routePath = paths[cursor++], url = config.blogUrl + routePath;
    const record = { url, capturedAt: new Date().toISOString() };
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'BloggerPeerResearch/1.0 (owner-requested current-theme check)' }, signal: AbortSignal.timeout(30000) });
      const html = await response.text();
      Object.assign(record, { finalUrl: response.url, status: response.status, headers: Object.fromEntries(response.headers), bytes: Buffer.byteLength(html), sha256: createHash('sha256').update(html).digest('hex') });
      const file = createHash('sha256').update(url).digest('hex').slice(0, 18) + '.txt';
      await fs.writeFile(raw + '/' + file, html); record.rawFile = raw + '/' + file;
      if (routes.some(route => route.path === routePath)) live.push({ ...analyzeHtml({ ...record, text: html }), buildId: html.match(/<meta\b[^>]*content=['"]([^'"]+)['"][^>]*name=['"]blogger-theme-build['"]/i)?.[1] || html.match(/<meta\b[^>]*name=['"]blogger-theme-build['"][^>]*content=['"]([^'"]+)['"]/i)?.[1] || '', routeKind: routes.find(route => route.path === routePath).kind });
      else record.text = html;
    } catch (error) { record.error = error.message; }
    requests.push(record);
  }
}));
const result = { capturedAt: new Date().toISOString(), build, origin: config.blogUrl, scope: 'Blogger only; current local build compared with fresh public HTML. Private settings/actual indexing and AI citations not inspected.', local, live, requests };
await fs.writeFile(dir + '/current-theme-evidence.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ local: local.length, live: live.length, liveBuilds: [...new Set(live.map(page => page.buildId))], uniqueLocalDescriptions: new Set(local.map(page => page.descriptions[0])).size, uniqueLiveDescriptions: new Set(live.map(page => page.descriptions[0])).size, requests: requests.length }));
