// Read-only deployment gate. This does not authenticate, publish or restore.
import fs from 'node:fs/promises';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const args = process.argv.slice(2);
if (args.length % 2 || args.some((arg, i) => i % 2 === 0 && !['--origin', '--out'].includes(arg))) throw new Error('Usage: npm run verify:blogger:live -- [--origin https://your-blog.example] [--out blogger/output]');
const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, i) => [args[i * 2], args[i * 2 + 1]]));
const out = path.resolve(options['--out'] || 'blogger/output');
const { config, posts, pages } = JSON.parse(await fs.readFile(path.join(out, 'content.json'), 'utf8'));
const { buildId } = JSON.parse(await fs.readFile(path.join(out, 'build-manifest.json'), 'utf8'));
const origin = new URL(options['--origin'] || config.blogUrl);
if (origin.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(origin.hostname)) throw new Error('Use an HTTPS public origin');
if (origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('Supply an origin without a path, query, fragment or credentials');
const routes = [{ path: '/', kind: 'home' }, ...posts.map(post => ({ ...post, kind: 'post' })), ...pages.map(page => ({ ...page, kind: 'page' }))];
if (!posts.length) routes.push(...config.seo.routes.filter(route => route.path !== '/').map(route => ({ path: route.path, kind: 'configured', seo: route })));
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < routes.length) {
    const route = routes[cursor++];
    const url = new URL(route.path, origin).href;
    const result = { url, errors: [], warnings: [] };
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'BloggerThemeVerification/1.0 (owner-requested read-only check)' }, signal: AbortSignal.timeout(30000) });
      result.status = response.status;
      result.xRobots = response.headers.get('x-robots-tag') || '';
      const doc = new JSDOM((await response.text()).replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ''), { virtualConsole: new VirtualConsole() }).window.document;
      const one = (selector, field, attribute = 'content') => {
        const values = [...doc.querySelectorAll(selector)].map(node => attribute === 'text' ? node.textContent.trim() : node.getAttribute(attribute));
        result[field] = values[0] || '';
        if (values.length !== 1 || !values[0]) result.errors.push(field + ': expected exactly one nonempty value');
        return values[0] || '';
      };
      const title = one('title', 'title', 'text');
      const canonical = one('link[rel="canonical"]', 'canonical', 'href');
      const description = one('meta[name="description"]', 'description');
      const ogDescription = one('meta[property="og:description"]', 'ogDescription');
      const twitterDescription = one('meta[name="twitter:description"]', 'twitterDescription');
      const robots = one('meta[name="robots"]', 'robots');
      const servedBuild = one('meta[name="blogger-theme-build"]', 'buildId');
      if (servedBuild !== buildId) result.errors.push('Served theme build differs from the local release');
      if (response.status !== 200) result.errors.push('Expected HTTP 200');
      if (canonical !== url) result.errors.push('Canonical differs from expected public URL');
      if (/noindex|nofollow|nosnippet/i.test(result.xRobots)) result.errors.push('Restrictive HTTP robots header: review intended settings');
      if (ogDescription !== description || twitterDescription !== description) result.errors.push('Head/social descriptions disagree');
      if (route.kind !== 'home' && description === config.description) result.errors.push('Single item repeats the generic configured site description');
      const noindex = route.seo?.noIndex ?? config.seo.noindexPaths.includes(route.path);
      if (Boolean(/noindex/.test(robots)) !== Boolean(noindex)) result.errors.push('HTML index policy does not match the configured route');
      if (route.kind === 'post') {
        if (title !== route.seo.title) result.errors.push('Post document title differs from the prepared title; check native editor title/override');
        const article = doc.querySelector('article[itemtype="https://schema.org/BlogPosting"]');
        if (!article) result.errors.push('BlogPosting entity missing');
        const faqCount = doc.querySelectorAll('[itemtype="https://schema.org/Question"]').length;
        if (faqCount !== (route.faq?.length || 0)) result.errors.push('FAQ count differs from the prepared post');
        if (/\[(?:SOURCE|INTERNAL LINK):/.test(article?.textContent || '')) result.errors.push('Published source/link placeholder remains');
        const keywords = [...(article?.querySelectorAll(':scope > meta[itemprop="keywords"]') || [])].map(node => node.content);
        if (route.seo.keywords.some(keyword => !keywords.includes(keyword))) result.errors.push('Configured structured keywords did not select the expected branch');
        const body = doc.querySelector('[data-article-body]');
        const expected = JSDOM.fragment(route.body);
        const text = node => node?.textContent.replace(/\s+/g, ' ').trim() || '';
        if (text(body) !== text(expected)) result.errors.push('Post body differs from the prepared update; merge any newer native edits deliberately');
        result.semanticLists = body?.querySelectorAll('ul,ol').length || 0;
        result.semanticTables = body?.querySelectorAll('table').length || 0;
        if (result.semanticLists < expected.querySelectorAll('ul,ol').length) result.errors.push('Prepared semantic lists are missing');
        if (result.semanticTables !== expected.querySelectorAll('table').length) result.errors.push('Prepared semantic table count differs');
        const liveCode = [...(body?.querySelectorAll('pre code') || [])].map(code => code.textContent);
        const expectedCode = [...expected.querySelectorAll('pre code')].map(code => code.textContent);
        if (JSON.stringify(liveCode) !== JSON.stringify(expectedCode)) result.errors.push('Code example text differs from prepared content');
        const expectedCover = expected.querySelector('img[srcset]');
        if (expectedCover && !body?.querySelector('img[srcset]')) result.errors.push('Activated responsive image candidates are missing');
      }
      if (route.kind === 'home') {
        const thumbnails = [...doc.querySelectorAll('#PopularPosts1 img')];
        result.popularImages = thumbnails.length;
        if (thumbnails.some(image => !image.hasAttribute('alt') || !image.getAttribute('width') || !image.getAttribute('height'))) result.errors.push('Saved Popular Posts widget still omits image alternatives/dimensions; apply widget repair');
      }
      if (route.kind === 'page' && route.slug === 'privacy-policy') {
        const body = doc.querySelector('.page-body');
        if (body?.textContent.includes('iamrusiru.com') && !origin.hostname.includes('iamrusiru.com')) result.errors.push('Privacy Page still uses the previous destination identity');
      }
      if (route.seo?.pageType && route.seo.pageType !== 'WebPage' && !doc.querySelector('meta[itemprop="additionalType"][content="https://schema.org/' + route.seo.pageType + '"]')) result.errors.push('Configured Page specialization missing');
      if (route.seo?.description && description !== route.seo.description) result.warnings.push('Description differs from prepared default; confirm this is an intentional native Search description');
    } catch (error) { result.errors.push(error.message); }
    results.push(result);
    console.log((result.errors.length ? 'FAIL ' : 'PASS ') + url + (result.errors.length ? ': ' + result.errors.join('; ') : ''));
  }
}));
results.sort((a, b) => a.url.localeCompare(b.url));
const report = { capturedAt: new Date().toISOString(), origin: origin.origin, scope: 'Read-only hosted Blogger metadata check; no account/editor/real crawler/indexing certification', checked: results.length, failed: results.filter(result => result.errors.length).length, results };
await fs.mkdir(path.join(out, 'verification'), { recursive: true });
const filename = path.join(out, 'verification', 'live-' + report.capturedAt.replace(/[:.]/g, '-') + '.json');
await fs.writeFile(filename, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checked: report.checked, failed: report.failed, report: filename }));
if (report.failed) process.exitCode = 1;
