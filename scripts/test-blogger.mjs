import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { renderPreview } from './lib/blogger-preview.mjs';
import { conditionalMarkup, descriptionMetadata, routeCondition, validateBloggerExpressions, validateBloggerWidgetSettings } from './lib/blogger-markup.mjs';

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
      assert.equal(doc.querySelector(selector).content, item.excerpt);
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
      assert.equal(doc.querySelector('meta[property="og:description"]').content, item.excerpt);
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
    if (['search', 'label', 'empty', 'error'].includes(kind)) assert.equal(doc.querySelector('meta[name="robots"]').content, 'noindex,follow');
    if (kind === 'empty') assert.match(doc.querySelector('main').textContent, /No posts found/);
    if (kind === 'error') assert.match(doc.querySelector('h1').textContent, /Page not found/);
  }
  const fresh = preview({ kind: 'page', post: { title: 'New page', path: '/p/new.html', body: '<p>New native Blogger page</p>' } });
  assert.equal(fresh.querySelector('h1').textContent, 'New page');
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
  const doc = preview({ kind: 'post', post: { ...posts[0], path: '/2026/11/test.html', title, excerpt: title } });
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
