import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import { renderPreview } from './lib/blogger-preview.mjs';
import { conditionalMarkup, descriptionMetadata, routeCondition, validateBloggerExpressions, validateBloggerWidgetSettings } from './lib/blogger-markup.mjs';
import { resolveThemeConfig } from './lib/blogger-config.mjs';
import { buildBloggerSeo } from './lib/blogger-seo.mjs';

const out = path.resolve(import.meta.dirname, '../blogger/output');
const xml = await fs.readFile(path.join(out, 'iamrusiru-blogger.xml'), 'utf8');
const template = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
const feed = new JSDOM(await fs.readFile(path.join(out, 'feed.atom'), 'utf8'), { contentType: 'text/xml' }).window.document;
const { config, posts, pages } = JSON.parse(await fs.readFile(path.join(out, 'content.json'), 'utf8'));
const media = new Map(Object.entries(JSON.parse(await fs.readFile(path.join(out, 'media-manifest.json'), 'utf8'))));
const B = 'http://www.google.com/2005/gml/b';
const A = 'http://www.w3.org/2005/Atom';
// CSS is verified in Chrome; jsdom 20 cannot parse some valid Tailwind selectors.
const withoutCss = html => html.replace(/<style>[\s\S]*?<\/style>/g, '');
const preview = options => new JSDOM(withoutCss(renderPreview(xml, { config, posts, media, ...options }))).window.document;

test('theme is valid XML with legal section/widget structure and all includables resolved', () => {
  assert.equal(template.getElementsByTagNameNS(B, 'skin').length, 1);
  const ids = Array.from(template.querySelectorAll('[id]')).filter(el => el.localName !== 'includable').map(el => el.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const section of template.getElementsByTagNameNS(B, 'section')) {
    assert.match(section.id, /^[a-zA-Z0-9]+$/);
    assert.ok(Array.from(section.children).every(el => el.namespaceURI === B && el.localName === 'widget'));
    assert.equal(section.closest('b\\:widget'), null);
  }
  for (const widget of template.getElementsByTagNameNS(B, 'widget')) {
    assert.equal(widget.parentElement.localName, 'section');
    assert.ok(widget.getAttribute('type') === 'BlogArchive' || Array.from(widget.children).some(el => el.localName === 'includable' && el.id === 'main'));
  }
  const includes = new Set(Array.from(template.getElementsByTagNameNS(B, 'includable')).map(el => el.id));
  for (const include of template.getElementsByTagNameNS(B, 'include')) assert.ok(includes.has(include.getAttribute('name')) || include.getAttribute('name') === 'commentPicker');
  assert.doesNotMatch(xml, /@@[A-Z_]+@@|@tailwind|@apply|react-dom|supabase|mcp-js|src\/main\.tsx/);
  assert.match(xml, /--background: 40 30% 97%/);
  assert.match(xml, /DM Serif Display/);
});

test('route-specific text uses native Blogger branches instead of chained expression values', () => {
  validateBloggerExpressions(template);
  assert.equal(template.getElementsByTagNameNS(B, 'with').length, 0);
  const rejectedPattern = new JSDOM(`<root xmlns:b="${B}"><b:with var="description" value='data:view.description ?: (data:view.isPost ? "post" : "home")'/></root>`, { contentType: 'text/xml' }).window.document;
  assert.throws(() => validateBloggerExpressions(rejectedPattern), /native b:if\/b:elseif/);
  const literal = 'A "quoted" title, author\'s note & a backslash \\ ? : data:blog.title';
  const markup = conditionalMarkup([
    { condition: routeCondition('data:blog.canonicalUrl', '/2026/06/example.html'), markup: descriptionMetadata(literal) },
  ], descriptionMetadata('Fallback'));
  const fragment = new JSDOM(`<root xmlns:b="${B}">${markup}</root>`, { contentType: 'text/xml' }).window.document;
  assert.equal(fragment.querySelector('meta').getAttribute('content'), literal);
  assert.equal(fragment.getElementsByTagNameNS(B, 'if')[0].getAttribute('cond'), 'data:blog.canonicalUrl == data:blog.homepageUrl + "2026/06/example.html"');
  validateBloggerExpressions(fragment);
  const unsupportedFunction = new JSDOM(`<root xmlns:expr="http://www.google.com/2005/gml/expr"><a expr:href="urlEncode(data:post.url)"/></root>`, { contentType: 'text/xml' }).window.document;
  assert.throws(() => validateBloggerExpressions(unsupportedFunction), /unsupported Blogger template function urlEncode/);
});

test('Label gadget settings reject the FREQ value that prevents Blogger restore', () => {
  validateBloggerWidgetSettings(template);
  const invalid = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  const sorting = Array.from(invalid.getElementsByTagNameNS(B, 'widget-setting')).find(setting => setting.getAttribute('name') === 'sorting');
  sorting.textContent = 'FREQ';
  assert.throws(() => validateBloggerWidgetSettings(invalid), /Label1: unsupported exported Label setting sorting=FREQ/);
});

test('native metadata branches cover every imported fallback and prefer Blogger search descriptions', () => {
  for (const item of posts) {
    const doc = preview({ kind: 'post', post: item, searchDescription: '' });
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      assert.equal(doc.querySelectorAll(selector).length, 1);
      assert.equal(doc.querySelector(selector).content, item.seo.description);
    }
    const authorDescription = 'Updated in Blogger: "quotes", author\'s text & symbols.';
    const overridden = preview({ kind: 'post', post: item, searchDescription: authorDescription });
    assert.equal(overridden.querySelector('meta[name="description"]').content, authorDescription);
  }
  const home = preview({});
  const cardExcerpts = Array.from(home.querySelectorAll('article p'));
  assert.deepEqual(cardExcerpts.map(el => el.textContent.trim()), posts.slice(0, 6).map(p => p.excerpt));
  for (const item of [posts[0], posts.at(-1)]) {
    const doc = preview({ kind: 'post', post: item });
    assert.ok(doc.querySelector('[data-reading-time]').textContent.includes(item.readTime));
  }
  const authored = preview({ kind: 'post', post: { ...posts[0], path: '/2026/11/new-native-post.html', body: '<p>A newly authored Blogger post.</p>' }, searchDescription: '' });
  assert.ok(authored.querySelector('meta[name="description"]').content.length > 0);
  assert.equal(authored.querySelector('[data-reading-time]').textContent.trim(), '');
});

test('Atom export contains every post/page, dates, labels, code, FAQs and working migration links', () => {
  const entries = Array.from(feed.getElementsByTagNameNS(A, 'entry'));
  assert.equal(entries.length, posts.length + pages.length);
  const ids = entries.map(el => el.getElementsByTagNameNS(A, 'id')[0].textContent);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of [...posts, ...pages]) {
    const entry = entries.find(el => el.getElementsByTagNameNS(A, 'title')[0].textContent === item.title);
    assert.ok(entry, item.title);
    const html = entry.getElementsByTagNameNS(A, 'content')[0].textContent;
    assert.equal(html, item.body);
    const doc = JSDOM.fragment(html);
    const headings = Array.from(doc.querySelectorAll('h2[id], h3[id]')).map(el => el.id);
    assert.equal(new Set(headings).size, headings.length);
    assert.equal(doc.querySelectorAll('script').length, 0);
    assert.ok(entry.querySelector('link[rel="alternate"]').getAttribute('href').endsWith(item.path));
    if (item.content) {
      const codes = Array.from(doc.querySelectorAll('pre code')).map(el => el.textContent);
      assert.deepEqual(codes, item.content.filter(b => b.type === 'code').map(b => b.code));
      assert.equal(doc.querySelectorAll('[itemtype="https://schema.org/Question"]').length, item.faq?.length || 0);
      for (const label of item.labels) assert.ok(Array.from(entry.getElementsByTagNameNS(A, 'category')).some(el => el.getAttribute('term') === label));
      for (const field of ['published', 'updated']) assert.equal(new Date(entry.getElementsByTagNameNS(A, field)[0].textContent).toISOString(), item[field]);
    }
  }
});

test('all 27 routes expose unique social metadata and readable content with scripts disabled', () => {
  for (const item of [...posts, ...pages]) {
    const doc = preview({ kind: item.content ? 'post' : 'page', post: item });
    for (const key of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image']) assert.equal(doc.querySelectorAll(`meta[property="${key}"]`).length, 1, key);
    for (const key of ['description', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:card', 'robots']) assert.equal(doc.querySelectorAll(`meta[name="${key}"]`).length, 1, key);
    assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1);
    assert.equal(doc.querySelector('meta[property="og:url"]').content, config.blogUrl + item.path);
    assert.equal(doc.querySelector('meta[property="og:title"]').content, item.title);
    assert.equal(doc.querySelectorAll('h1').length, 1, item.title);
    assert.ok(doc.querySelector('main').textContent.length > 100);
    assert.equal(doc.querySelectorAll('a[href^="/post/"], a[href="/about"], a[href="/contact"], a[href="/rss.xml"]').length, 0);
    if (item.content) {
      assert.equal(doc.querySelector('meta[property="og:image"]').content, item.imageUrl);
      assert.equal(doc.querySelector('meta[property="og:description"]').content, item.seo.description);
      assert.equal(doc.querySelector('[data-article-body]').querySelectorAll('pre code').length, item.content.filter(b => b.type === 'code').length);
      assert.ok(doc.querySelector('[itemtype="https://schema.org/BlogPosting"]'));
    }
  }
});

test('home/search/labels/archive/empty/error and new Blogger pages render appropriate branches', () => {
  const home = preview({});
  assert.ok(home.querySelector('.hero'));
  assert.equal(home.querySelectorAll('article').length, 6);
  assert.ok(home.querySelector('[rel="next"]'));
  assert.equal(home.querySelector('form[role="search"]').method, 'get');
  assert.ok(home.querySelectorAll('.blogger-labels a').length > 0);
  assert.ok(home.querySelector('#BlogArchive1'));
  for (const kind of ['search', 'label', 'archive', 'empty', 'error']) {
    const doc = preview({ kind });
    assert.equal(doc.querySelector('.hero'), null);
    assert.equal(doc.querySelectorAll('h1').length, 1);
    if (['search', 'label', 'archive', 'empty', 'error'].includes(kind)) assert.equal(doc.querySelector('meta[name="robots"]').content, 'noindex,follow');
    if (kind === 'empty') assert.match(doc.querySelector('main').textContent, /No posts found/);
    if (kind === 'error') assert.match(doc.querySelector('h1').textContent, /Page not found/);
  }
  const fresh = preview({ kind: 'page', post: { title: 'New page', path: '/p/new.html', body: '<p>New native Blogger page</p>' } });
  assert.equal(fresh.querySelector('h1').textContent, 'New page');
  assert.ok(fresh.querySelector('.page-body.max-w-3xl.mx-auto > h1'));
});

test('editor starters and original-style snippets work in a new native post and Page', async () => {
  const read = name => fs.readFile(path.join(out, 'editor-templates', name), 'utf8');
  const starter = await read('post.html');
  const code = await read('snippets/code.html');
  const faq = await read('snippets/faq.html');
  const tip = await read('snippets/callout-tip.html');
  const page = await read('page.html');
  assert.equal(JSDOM.fragment(starter).querySelector('h1'), null);
  assert.equal(JSDOM.fragment(page).querySelector('h1'), null);
  const freshPost = { ...posts[0], path: '/2026/11/editor-starter.html', title: 'Editor starter', body: starter + code + tip + faq };
  const dom = new JSDOM(withoutCss(renderPreview(xml, { config, posts: [freshPost], media, kind: 'post', post: freshPost })), { url: config.blogUrl + freshPost.path, runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.matchMedia = () => ({ matches: false });
  dom.window.fetch = () => Promise.reject(new Error('Feed disabled'));
  let copied = '';
  dom.window.navigator.clipboard = { writeText: async text => { copied = text; } };
  dom.window.eval(await fs.readFile(new URL('../blogger/enhancements.js', import.meta.url), 'utf8'));
  const doc = dom.window.document;
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelectorAll('[data-copy-code]').length, 1);
  assert.ok(doc.querySelector('[role="note"][aria-label="Tip"] svg'));
  assert.ok(doc.querySelector('[data-post-faq] [itemtype="https://schema.org/FAQPage"]'));
  assert.equal(doc.querySelectorAll('[data-toc-list] a').length, 4);
  doc.querySelector('[data-copy-code]').click();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(copied, 'const message = "Hello, world!";\nconsole.log(message);');
  const pageDoc = preview({ kind: 'page', post: { title: 'Starter Page', path: '/p/starter.html', body: page } });
  assert.equal(pageDoc.querySelectorAll('h1').length, 1);
  assert.ok(pageDoc.querySelector('.page-body > .post-content h2'));
  dom.window.close();
});

test('theme, menu, table of contents, copy controls and unavailable feeds work progressively', async () => {
  const post = posts.find(p => p.content.some(b => b.type === 'code'));
  const dom = new JSDOM(withoutCss(renderPreview(xml, { config, posts, media, kind: 'post', post })), { url: config.blogUrl + post.path, runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.document.querySelector('[data-article-body]').insertAdjacentHTML('beforeend', '<pre><code>first native block</code></pre><pre><code>second native block</code></pre>');
  window.matchMedia = () => ({ matches: false });
  window.fetch = () => Promise.reject(new Error('Disabled feed'));
  window.scrollTo = () => {};
  let copied = '';
  window.navigator.clipboard = { writeText: async text => { copied = text; } };
  window.eval(await fs.readFile(new URL('../blogger/enhancements.js', import.meta.url), 'utf8'));
  const doc = window.document;
  assert.equal(doc.querySelector('[data-theme-toggle]').hidden, false);
  doc.querySelector('[data-theme-toggle]').click();
  assert.ok(doc.documentElement.classList.contains('dark'));
  assert.equal(window.localStorage.getItem('theme'), 'dark');
  assert.equal(doc.querySelector('#mobile-menu').hidden, true);
  doc.querySelector('[data-menu-toggle]').click();
  assert.equal(doc.querySelector('#mobile-menu').hidden, false);
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(doc.querySelector('#mobile-menu').hidden, true);
  assert.equal(doc.querySelector('[data-toc-list]').children.length, doc.querySelector('[data-article-body]').querySelectorAll('h2, h3').length);
  doc.querySelector('[data-copy-code]').click();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(copied, doc.querySelector('pre').textContent);
  assert.equal(doc.querySelectorAll('[data-copy-code]').length, doc.querySelectorAll('[data-article-body] pre').length);
  Array.from(doc.querySelectorAll('[data-copy-code]')).at(-1).click();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(copied, 'second native block');
  assert.match(doc.querySelector('[data-reading-time]').textContent, /\d+ min read/);
  const related = doc.querySelector('[data-related]');
  if (related) assert.equal(related.hidden, true);
  else assert.ok(doc.querySelector('[data-curated-related]'));
  assert.ok(doc.querySelector('[data-article-body]').textContent.length > 100);
  assert.equal(new URL(doc.querySelector('[data-share="twitter"]').href).searchParams.get('text'), post.title);
  assert.equal(new URL(doc.querySelector('[data-share="twitter"]').href).searchParams.get('url'), config.blogUrl + post.path);
  assert.equal(new URL(doc.querySelector('[data-share="email"]').href).searchParams.get('subject'), post.title);
  dom.window.close();
});

test('post titles and metadata escape quotes, markup and ampersands', () => {
  const title = 'A "quote" & </title><script>bad()</script>';
  const doc = preview({ kind: 'post', post: { ...posts[0], path: '/2026/11/test.html', title, excerpt: title }, searchDescription: title });
  assert.equal(doc.querySelector('h1').textContent, title);
  assert.equal(doc.querySelector('meta[name="description"]').content, title);
  assert.equal(doc.querySelectorAll('title').length, 1);
  assert.equal(doc.querySelector('h1 script'), null);
  assert.equal(new URL(doc.querySelector('[data-share="twitter"]').href).searchParams.get('url'), config.blogUrl + '/2026/11/test.html');
});

test('Blogger-serialized inline scripts execute without raw CDATA syntax errors', () => {
  const html = withoutCss(renderPreview(xml, { config, posts, media, kind: 'post', post: posts[0] }));
  const parsed = new JSDOM(html).window.document;
  for (const script of parsed.querySelectorAll('script[type="text/javascript"]')) {
    assert.match(script.textContent, /^\s*\/\/<!\[CDATA\[/);
    assert.doesNotThrow(() => new Function(script.textContent));
  }
  assert.throws(() => new Function('<![CDATA[\nvar oldScript = true;\n]]>'), SyntaxError);
  const errors = [];
  const dom = new JSDOM(html, {
    url: config.blogUrl + posts[0].path, runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: false });
      window.fetch = () => Promise.reject(new Error('Feed disabled'));
      window.addEventListener('error', event => errors.push(event.message));
    },
  });
  assert.deepEqual(errors, []);
  const doc = dom.window.document;
  assert.equal(doc.querySelector('[data-theme-toggle]').hidden, false);
  assert.equal(doc.querySelector('[data-menu-toggle]').hidden, false);
  assert.equal(doc.querySelector('#mobile-menu').hidden, true);
  assert.ok(doc.querySelector('[data-toc-list] [aria-current="location"]'));
  assert.ok(doc.querySelector('[data-post-faq] [itemtype="https://schema.org/FAQPage"]'));
  assert.equal(doc.querySelector('[data-article-body] [itemtype="https://schema.org/FAQPage"]'), null);
  assert.equal(doc.querySelector('[data-article-body]').textContent.includes('More from the blog'), false);
  assert.ok(doc.querySelector('[data-citation]').textContent.includes('Rathmina, R. (2026).'));
  dom.window.close();
});

test('an unregistered native post keeps reading tools when its related feed is disabled', async () => {
  const html = withoutCss(renderPreview(xml, { config, posts, media, kind: 'post', post: { ...posts[0], path: '/2026/11/new-native-post.html' } }));
  const dom = new JSDOM(html, { url: config.blogUrl + '/2026/11/new-native-post.html', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.matchMedia = () => ({ matches: false });
  dom.window.fetch = () => Promise.reject(new Error('Feed disabled'));
  dom.window.eval(await fs.readFile(new URL('../blogger/enhancements.js', import.meta.url), 'utf8'));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(dom.window.document.querySelector('[data-related]').hidden, true);
  assert.match(dom.window.document.querySelector('[data-reading-time]').textContent, /\d+ min read/);
  dom.window.close();
});

test('homepage navigation does not mark an external portfolio as the current page', () => {
  const html = withoutCss(renderPreview(xml, { config, posts, media }));
  const dom = new JSDOM(html, {
    url: config.blogUrl + '/', runScripts: 'dangerously',
    beforeParse(window) { window.matchMedia = () => ({ matches: false }); },
  });
  const links = Array.from(dom.window.document.querySelectorAll('nav a'));
  assert.ok(links.some(link => link.href === config.blogUrl + '/' && link.getAttribute('aria-current') === 'page'));
  for (const link of links.filter(link => new URL(link.href).origin !== config.blogUrl)) assert.equal(link.getAttribute('aria-current'), null);
  const counts = Array.from(dom.window.document.querySelectorAll('.blogger-labels a')).map(link => Number(link.getAttribute('data-label-count')));
  assert.ok(counts.length > 12);
  assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
  dom.window.close();
});

test('Blogger Layout edits render saved region content without JavaScript or CSS changes', () => {
  const edited = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  const widgets = Array.from(edited.getElementsByTagNameNS(B, 'widget')).filter(widget => widget.getAttribute('type') === 'HTML');
  assert.equal(widgets.length, 5);
  for (const widget of widgets) {
    assert.equal(widget.getAttribute('mobile'), 'yes');
    assert.equal(widget.getAttribute('locked'), 'yes');
    assert.equal(widget.getElementsByTagNameNS(B, 'widget-setting')[0].getAttribute('name'), 'content');
  }
  const content = widgets.find(widget => widget.id === 'HTML102').getElementsByTagNameNS(B, 'widget-setting')[0];
  const fragment = JSDOM.fragment(content.textContent);
  fragment.querySelector('p.text-body').textContent = 'A new owner, with "quotes" & ideas.';
  const holder = new JSDOM('').window.document.createElement('div');
  holder.append(fragment);
  content.textContent = holder.innerHTML;
  const updatedXml = new edited.defaultView.XMLSerializer().serializeToString(edited);
  const updated = new JSDOM(withoutCss(renderPreview(updatedXml, { config, posts, media }))).window.document;
  assert.equal(updated.querySelector('.hero p.text-body').textContent, 'A new owner, with "quotes" & ideas.');
  assert.ok(updated.querySelector('.hero svg'));
  assert.equal(updated.querySelectorAll('h1').length, 1);
  assert.equal(edited.getElementsByTagNameNS(B, 'skin')[0].textContent, template.getElementsByTagNameNS(B, 'skin')[0].textContent);
  assert.equal(updated.querySelector('[data-menu-toggle]').hidden, true); // Progressive initialization is still optional.
});

test('configuration rejects unsafe URLs, misspelled fields and ambiguous content modes', () => {
  assert.throws(() => resolveThemeConfig({ ...config, links: { portfolio: 'javascript:alert(1)' } }), /links.portfolio/);
  assert.throws(() => resolveThemeConfig({ ...config, branding: { accentt: 'typo' } }), /Unknown theme setting/);
  assert.throws(() => resolveThemeConfig({ ...config, contentMode: 'sample' }), /contentMode/);
  assert.throws(() => resolveThemeConfig({ ...config, socialImageUrl: '/relative.png' }), /absolute HTTPS/);
  assert.throws(() => resolveThemeConfig({ ...config, topics: ['News', 'News'] }), /unique/);
});

test('SEO configuration is isolated between owners and validates reusable route overrides', () => {
  const { seo, ...base } = config;
  const first = resolveThemeConfig(base);
  first.seo.homeTitle = 'Private identity';
  first.seo.routes.push({ path: '/p/example.html', title: 'Private page' });
  first.hero.cardLines[0] = 'Private line';
  const second = resolveThemeConfig(base);
  assert.equal(second.seo.homeTitle, '');
  assert.deepEqual(second.seo.routes, []);
  assert.notEqual(second.hero.cardLines[0], 'Private line');
  for (const invalid of [
    { routes: [{ path: 'https://example.com/a.html' }] },
    { routes: [{ path: '/p/a.html' }, { path: '/p/a.html' }] },
    { routes: [{ path: '/p/a.html', descriptionn: 'typo' }] },
    { routes: [{ path: '/p/a.html', noIndex: 'false' }] },
    { routes: [{ path: '/p/a.html', keywords: 'one, two' }] },
    { routes: [{ path: '/p/a.html', imageUrl: 'javascript:alert(1)' }] },
    { language: 'English language' },
  ]) assert.throws(() => resolveThemeConfig({ ...base, seo: invalid }), /SEO|seo|Unknown/);
});

test('all migrated routes have crawlable descriptions, keywords, identity and breadcrumbs without scripts', () => {
  for (const item of [...posts, ...pages]) {
    const doc = preview({ kind: item.content ? 'post' : 'page', post: item, localAssets: false });
    assert.equal(doc.title, item.seo.title);
    assert.equal(doc.querySelector('meta[name="description"]').content, item.seo.description);
    assert.equal(doc.querySelector('meta[name="keywords"]').content, item.seo.keywords.join(', '));
    const scope = doc.querySelector(item.content ? 'article[itemtype="https://schema.org/BlogPosting"]' : 'article[itemtype="https://schema.org/WebPage"]');
    assert.equal(scope.getAttribute('itemid'), config.blogUrl + item.path);
    assert.equal(scope.querySelector('meta[itemprop="description"]').content, item.seo.description);
    assert.deepEqual([...scope.querySelectorAll('meta[itemprop="keywords"]')].map(el => el.content), item.seo.keywords);
    assert.equal(scope.querySelector('meta[itemprop="inLanguage"]').content, config.seo.language);
    assert.ok(doc.querySelector('[itemtype="https://schema.org/WebSite"] [itemtype="https://schema.org/Blog"] [itemprop="publisher"]'));
    const crumbs = doc.querySelector('[itemtype="https://schema.org/BreadcrumbList"]');
    assert.deepEqual([...crumbs.querySelectorAll('[itemprop="item"]')].map(el => el.href), [config.blogUrl + '/', config.blogUrl + item.path]);
    if (item.content) {
      assert.equal(scope.querySelector('meta[itemprop="datePublished"]').content, item.published);
      assert.equal(scope.querySelector('meta[itemprop="dateModified"]').content, item.updated);
      assert.equal(scope.querySelector('link[itemprop="image"]').href, item.imageUrl);
      assert.equal(scope.querySelector('[itemprop="author"] [itemprop="name"]').textContent, config.author);
    }
  }
});

test('native post metadata uses Search description, current labels and dates; native edits override migration defaults', () => {
  const fresh = { ...posts[0], title: 'Drupal cache tags explained', path: '/2026/11/drupal-cache-tags.html', labels: ['Engineering', 'Drupal caching', 'Cache tags'], published: '2026-11-05T08:00:00.000Z', updated: '2026-11-06T08:00:00.000Z' };
  const description = 'Learn how Drupal cache tags invalidate related content, with examples and practical checks for stale pages.';
  const doc = preview({ kind: 'post', post: fresh, searchDescription: description, localAssets: false });
  assert.equal(doc.title, fresh.title);
  for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]', 'article > meta[itemprop="description"]']) assert.equal(doc.querySelector(selector).content, description);
  assert.equal(doc.querySelector('meta[name="keywords"]'), null); // Labels are scoped to Blog1, not the global head.
  assert.deepEqual([...doc.querySelectorAll('article > meta[itemprop="keywords"]')].map(el => el.content), fresh.labels);
  assert.equal(doc.querySelector('meta[itemprop="datePublished"]').content, fresh.published);
  assert.equal(doc.querySelector('meta[itemprop="dateModified"]').content, fresh.updated);
  assert.equal(doc.querySelector('meta[itemprop="articleSection"]').content, 'Engineering');
  const renamed = preview({ kind: 'post', post: { ...posts[0], title: 'A new native title' }, searchDescription: description });
  assert.equal(renamed.title, 'A new native title');
  assert.equal(renamed.querySelector('meta[name="description"]').content, description);
});

test('Pages support native descriptions, semantic keywords and escaped build overrides', async () => {
  const keywords = await fs.readFile(path.join(out, 'editor-templates/snippets/seo-keywords.html'), 'utf8');
  const fresh = { title: 'Research methods', path: '/p/research.html', body: '<p>How I evaluate evidence.</p>' + keywords.replace('primary topic phrase, supporting topic phrase', 'research methods, evidence quality') };
  const doc = preview({ kind: 'page', post: fresh, searchDescription: 'How I evaluate sources, check evidence and document research methods.' });
  assert.equal(doc.querySelector('meta[name="description"]').content, 'How I evaluate sources, check evidence and document research methods.');
  assert.equal(doc.querySelector('article meta[itemprop="keywords"]').content, 'research methods, evidence quality');
  const title = 'Evidence & "sources" <checked>';
  const configured = resolveThemeConfig({ ...config, seo: { routes: [{ path: fresh.path, title, description: 'A "quoted" & useful description.', keywords: ['evidence quality'], pageType: 'AboutPage', imageUrl: 'https://example.com/cover.png', noIndex: true }] } });
  const { replacements } = buildBloggerSeo(configured, { pages: [] }, [], post => post.path, '');
  const templateSource = await fs.readFile(new URL('../blogger/template.xml', import.meta.url), 'utf8');
  const mini = templateSource.slice(0, templateSource.indexOf('  <b:skin>')).replaceAll('@@SEO_TITLE@@', replacements.SEO_TITLE).replaceAll('@@DESCRIPTION_METADATA@@', replacements.DESCRIPTION_METADATA).replaceAll('@@SEO_KEYWORDS@@', replacements.SEO_KEYWORDS).replaceAll('@@SOCIAL_IMAGES@@', replacements.SOCIAL_IMAGES).replaceAll('@@SEO_ROBOTS@@', replacements.SEO_ROBOTS).replaceAll('@@SEO_AUTHOR_LINK@@', replacements.SEO_AUTHOR_LINK).replaceAll('@@TWITTER_CREATOR@@', '') + '</head><body>' + replacements.SEO_PAGE + '</body></html>';
  const rendered = new JSDOM(renderPreview(mini, { config: configured, posts: [], media: new Map(), kind: 'page', post: fresh })).window.document;
  assert.equal(rendered.title, title);
  assert.equal(rendered.querySelectorAll('title').length, 1);
  assert.equal(rendered.querySelector('meta[name="description"]').content, 'A "quoted" & useful description.');
  assert.equal(rendered.querySelector('meta[name="robots"]').content, 'noindex,follow');
  assert.equal(rendered.querySelector('meta[property="og:image"]').content, 'https://example.com/cover.png');
  const authored = new JSDOM(renderPreview(mini, { config: configured, posts: [], media: new Map(), kind: 'page', post: fresh, searchDescription: 'Newly edited in Blogger.' })).window.document;
  assert.equal(authored.querySelector('meta[name="description"]').content, 'Newly edited in Blogger.');
});

test('a different owner can build a native theme without project content or styling changes', async () => {
  const preset = JSON.parse(await fs.readFile(new URL('../blogger/config.reusable.json', import.meta.url), 'utf8'));
  const custom = {
    ...preset, title: 'Notes & "Research"', author: 'A. Example', topics: ['Research', 'Updates'],
    hero: { ...preset.hero, headingPrefix: '<New> & "ideas"', headingMain: 'Research ', headingAccent: 'Notes.' },
    profile: { ...preset.profile, portraitUrl: 'https://example.org/photo.jpg?a=1&b=2' },
    socialImageUrl: 'https://example.org/social.png',
  };
  const fixture = path.join(out, 'reuse-config.test.json');
  const nativeOut = path.join(out, 'reuse-verification');
  await fs.writeFile(fixture, JSON.stringify(custom));
  execFileSync(process.execPath, ['scripts/build-blogger.mjs', '--config', fixture, '--out', nativeOut], { cwd: path.resolve(import.meta.dirname, '..'), stdio: 'pipe' });
  const nativeXml = await fs.readFile(path.join(nativeOut, 'iamrusiru-blogger.xml'), 'utf8');
  assert.doesNotMatch(nativeXml, /ru5iru|Rusiru|Omobio|proper-project-planning|post-planning\.png/);
  const nativeDoc = new JSDOM(nativeXml, { contentType: 'text/xml' }).window.document;
  validateBloggerExpressions(nativeDoc);
  validateBloggerWidgetSettings(nativeDoc);
  assert.equal(nativeDoc.getElementsByTagNameNS(B, 'skin')[0].textContent, template.getElementsByTagNameNS(B, 'skin')[0].textContent);
  const data = JSON.parse(await fs.readFile(path.join(nativeOut, 'content.json'), 'utf8'));
  assert.equal(data.posts.length, 0);
  assert.equal(data.pages.length, 0);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(nativeOut, 'redirects.json'), 'utf8')), []);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(nativeOut, 'media-manifest.json'), 'utf8')), {});
  const feed = new JSDOM(await fs.readFile(path.join(nativeOut, 'feed.atom'), 'utf8'), { contentType: 'text/xml' }).window.document;
  assert.equal(feed.getElementsByTagNameNS(A, 'entry').length, 0);
  const doc = new JSDOM(withoutCss(renderPreview(nativeXml, { config: data.config, posts: [], media: new Map() }))).window.document;
  assert.equal(doc.querySelector('.hero h1 span').textContent, custom.hero.headingPrefix);
  assert.equal(doc.querySelector('.hero img').getAttribute('src'), custom.profile.portraitUrl);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, custom.socialImageUrl);
  assert.equal(doc.querySelector('script#blogger-post-data').textContent, '[]');
  assert.equal(doc.querySelector('a[rel="next"]'), null);
  assert.equal(doc.querySelector('nav [data-home]').textContent, 'YourBlog');
  const freshPost = { ...posts[0], path: '/2026/11/first-post.html', title: 'A native post', labels: ['Research'], excerpt: 'New text' };
  const article = new JSDOM(withoutCss(renderPreview(nativeXml, { config: data.config, posts: [freshPost], media: new Map(), kind: 'post', post: freshPost }))).window.document;
  assert.equal(article.querySelector('.blog-tag').textContent, 'Research');
  assert.equal(article.querySelector('[data-post-author]').textContent, custom.author);
  assert.ok(article.querySelector('[data-related]'));
});
