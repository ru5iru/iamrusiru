import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import loadConfig from 'tailwindcss/loadConfig.js';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import { renderPreview } from './lib/blogger-preview.mjs';
import { conditionalMarkup, routeCondition, validateBloggerExpressions, validateBloggerWidgetSettings } from './lib/blogger-markup.mjs';
import { resolveThemeConfig, topicExpression, editableRegion } from './lib/blogger-config.mjs';
import { personalizeFragment } from './lib/blogger-personalize.mjs';
import { editorTemplates } from './lib/blogger-editor.mjs';
import { buildBloggerSeo } from './lib/blogger-seo.mjs';
import { prepareBloggerPosts } from './lib/blogger-content.mjs';
import { renderBloggerProse } from './lib/blogger-richtext.mjs';
import { responsiveAttributes } from './lib/blogger-images.mjs';
import { engineeringHub } from './lib/blogger-hub.mjs';

const root = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Build a Blogger theme without changing its styles.\nUsage: node scripts/build-blogger.mjs [--config file.json] [--out directory]\nDefaults: blogger/config.json, blogger/output\nClean reuse preset: npm run build:blogger:reusable');
  process.exit(0);
}
if (args.some((value, index) => index % 2 === 0 && !['--config', '--out'].includes(value)) || args.length % 2) throw new Error('Usage: node scripts/build-blogger.mjs [--config file.json] [--out directory]');
const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, index) => [args[index * 2], args[index * 2 + 1]]));
const out = path.resolve(root, options['--out'] || 'blogger/output');
const config = resolveThemeConfig(JSON.parse(await fs.readFile(path.resolve(root, options['--config'] || 'blogger/config.json'), 'utf8')));
await fs.mkdir(path.join(out, 'assets'), { recursive: true });
const media = new Map();
const portraitBuffer = await sharp(path.join(root, 'src/assets/profile-headshot.jpg')).resize(416, 416).jpeg({ quality: 85 }).toBuffer();
const placeholderPortrait = '<svg xmlns="http://www.w3.org/2000/svg" width="416" height="416" viewBox="0 0 416 416"><rect width="416" height="416" fill="#f1efeb"/><circle cx="208" cy="155" r="65" fill="#a7a39d"/><path d="M68 416v-40a140 140 0 0 1 280 0v40" fill="#a7a39d"/></svg>';
const portrait = config.profile.portraitUrl || (config.contentMode === 'native' ? 'data:image/svg+xml;base64,' + Buffer.from(placeholderPortrait).toString('base64') : 'data:image/jpeg;base64,' + portraitBuffer.toString('base64'));
function mediaUrl(name) {
  const url = config.assetUrls[name] || new URL(name, config.assetBaseUrl.replace(/\/?$/, '/')).href;
  if (new URL(url).protocol !== 'https:') throw new Error(`Image ${name} must use HTTPS`);
  media.set(name, url);
  return url;
}
await build({
  entryPoints: [path.join(root, 'scripts/blogger-source.tsx')],
  bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  outfile: path.join(out, 'source.mjs'),
  alias: { '@': path.join(root, 'src') },
  plugins: [{ name: 'blogger-static-export', setup(b) {
    b.onResolve({ filter: /\.(jpg|jpeg|png|webp|svg|gif|avif)$/ }, args => ({ path: path.basename(args.path), namespace: 'blogger-image' }));
    b.onLoad({ filter: /.*/, namespace: 'blogger-image' }, args => {
      // The embedded portrait still has a public original and generated variants.
      // Register every imported asset before validating activated image mappings.
      const originalUrl = mediaUrl(args.path);
      return { contents: `export default ${JSON.stringify(args.path === 'profile-headshot.jpg' ? portrait : originalUrl)}`, loader: 'js' };
    });
    b.onResolve({ filter: /(?:hooks\/useSEO|components\/blog\/(Header|Footer))$/ }, args => {
      if (args.path.includes('useSEO')) return { path: 'seo', namespace: 'blogger-stub' };
      if (args.importer.replaceAll('\\', '/').includes('/src/pages/')) return { path: 'empty', namespace: 'blogger-stub' };
    });
    b.onLoad({ filter: /.*/, namespace: 'blogger-stub' }, args => ({ contents: args.path === 'seo' ? 'export const useSEO = props => { globalThis.__BLOGGER_SEO__ = props; };' : 'export default () => null;', loader: 'js' }));
    b.onResolve({ filter: /^react-router-dom$/ }, () => ({ path: 'router', namespace: 'blogger-stub-router' }));
    b.onLoad({ filter: /.*/, namespace: 'blogger-stub-router' }, () => ({ contents: `import React from 'react'; export function Link({to,children,...props}) { return React.createElement('a',{...props,href:to},children); }`, loader: 'js', resolveDir: root }));
  } }],
});
const source = await import(pathToFileURL(path.join(out, 'source.mjs')).href + '?v=' + Date.now());
const themePosts = config.contentMode === 'project'
  ? prepareBloggerPosts(source.posts, JSON.parse(await fs.readFile(path.join(root, 'blogger/post-metadata.json'), 'utf8')), JSON.parse(await fs.readFile(path.join(root, 'blogger/editorial-links.json'), 'utf8')))
  : [];
for (const post of themePosts) {
  const name = [...media].find(([, url]) => url === post.imageUrl)?.[0];
  if (name) {
    const dimensions = await sharp(path.join(root, 'src/assets', name)).metadata();
    post.coverDimensions = { width: dimensions.width, height: dimensions.height };
  }
}
if (config.contentMode === 'project') for (const name of Object.keys(config.responsiveImages)) {
  if (!media.has(name)) throw new Error('Responsive image mapping does not match a project asset: ' + name);
}
if (config.contentMode === 'native') media.clear();
await fs.unlink(path.join(out, 'source.mjs'));
const { document } = new JSDOM('').window;
// Correct Blogger policy identity only; service/legal assertions need owner review.
const themeSource = { ...source, pages: source.pages.map(page => page.slug !== 'privacy-policy' ? page : {
  ...page,
  html: page.html.replaceAll('iamrusiru.com', new URL(config.blogUrl).host).replace('Last updated: March 30, 2026', 'Last updated: November 7, 2026'),
  seo: { ...page.seo, description: `Privacy Policy for ${new URL(config.blogUrl).host} - how ${config.author} handles personal information.` },
}) };
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
function fragment(html) {
  const box = document.createElement('div');
  box.innerHTML = html;
  box.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (['/about', '/contact', '/privacy-policy', '/cookie-policy'].includes(href)) a.setAttribute('href', '/p' + href + '.html');
    if (href === '/rss.xml') a.setAttribute('href', '/feeds/posts/default?alt=rss');
  });
  return box;
}
function xmlFragment(html) {
  return Array.from(fragment(html).childNodes).map(node => new document.defaultView.XMLSerializer().serializeToString(node)).join('');
}
const imageVariants = src => config.responsiveImages[[...media].find(([, url]) => url === src)?.[0]];
function responsiveFragment(html, role) {
  const box = fragment(html);
  for (const image of box.querySelectorAll('img[src]')) {
    const variants = imageVariants(image.getAttribute('src'));
    if (variants?.length) {
      const attrs = fragment('<img' + responsiveAttributes(variants, role) + '>').firstElementChild;
      image.setAttribute('srcset', attrs.getAttribute('srcset'));
      image.setAttribute('sizes', attrs.getAttribute('sizes'));
    }
  }
  return box.innerHTML;
}
const sidebar = fragment(source.sidebar).firstElementChild;
const topics = sidebar.children[0];
topics.querySelectorAll('button').forEach(button => {
  const a = document.createElement('a');
  a.className = button.className;
  a.innerHTML = button.innerHTML;
  a.href = '/search/label/' + encodeURIComponent(button.textContent.trim());
  button.replaceWith(a);
});
personalizeFragment(topics, 'topics', config);
const footer = fragment(source.footer);
personalizeFragment(footer, 'footer', config);
footer.querySelector('footer p.text-caption').innerHTML = '© <span data-current-year="">' + new Date().getUTCFullYear() + '</span> ' + escape(config.title) + '. ' + escape(config.footer.copyright);
const hero = fragment(source.hero);
hero.querySelector('.font-mono').innerHTML = source.icons.code;
personalizeFragment(hero, 'hero', config);
const header = personalizeFragment(fragment(await fs.readFile(path.join(root, 'blogger/fragments/header.html'), 'utf8')), 'header', config);
const connect = personalizeFragment(fragment(sidebar.children[2].outerHTML), 'connect', config);
const regions = {
  header: header.innerHTML, hero: hero.innerHTML, topics: topics.outerHTML, connect: connect.innerHTML, footer: footer.innerHTML,
};
const tagClass = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground';
const topicsSet = topicExpression(config);
const nativeTags = limit => `<b:loop values='data:post.labels' var='label' index='i'><b:if cond='${limit ? `data:i &lt; ${limit + 1} and ` : ''}!(data:label.name in ${topicsSet})'><a expr:href='data:label.url' class='${tagClass}'>#<data:label.name/></a></b:if></b:loop>`;
const routeBranches = render => themePosts.map(p => ({ condition: routeCondition('data:post.url', postPath(p)), markup: render(p) }));
const tags = (p, limit) => p.tags.slice(0, limit).map(tag => `<a href='/search/label/${encodeURIComponent(tag)}' class='${tagClass}'>#${escape(tag)}</a>`).join('');
const share = fragment(source.share);
share.querySelectorAll('a').forEach(a => {
  const name = a.getAttribute('aria-label').includes('LinkedIn') ? 'linkedin' : 'twitter';
  a.setAttribute('data-share', name);
  a.removeAttribute('href');
  a.setAttribute('expr:href', JSON.stringify(name === 'twitter' ? 'https://x.com/intent/tweet?url=' : 'https://www.linkedin.com/sharing/share-offsite/?url=') + ' + data:blog.canonicalUrl');
});
const copyLink = share.querySelector('button');
copyLink.setAttribute('data-copy-link', '');
copyLink.setAttribute('hidden', 'hidden');
for (const [name, base, label] of [['facebook', 'https://www.facebook.com/sharer/sharer.php?u=', 'Share on Facebook'], ['email', 'mailto:?body=', 'Share by email']]) {
  const a = document.createElement('a');
  a.className = share.querySelector('a').className;
  a.setAttribute('aria-label', label);
  a.setAttribute('data-share', name);
  a.setAttribute('expr:href', JSON.stringify(base) + ' + data:blog.canonicalUrl');
  a.innerHTML = source.icons[name];
  if (name !== 'email') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  copyLink.before(a);
}
const nativeShare = document.createElement('button');
nativeShare.type = 'button'; nativeShare.className = 'inline-flex items-center gap-2 px-3 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground';
nativeShare.setAttribute('data-native-share', ''); nativeShare.setAttribute('hidden', 'hidden');
nativeShare.innerHTML = source.icons.nativeShare + '<span class="text-sm">Share</span>';
share.querySelector('a').before(nativeShare);
const relatedMarkup = p => {
  const related = fragment(source.renderRelated(p.relatedPosts || []));
  related.querySelectorAll('a[href^="/post/"]').forEach(a => {
    const linked = themePosts.find(item => item.slug === a.getAttribute('href').slice(6));
    if (linked) {
      a.setAttribute('href', postPath(linked));
      const heading = a.querySelector('h3');
      if (heading) heading.textContent = linked.title;
      const image = a.querySelector('img');
      if (image) image.alt = linked.title;
    }
  });
  if (related.firstElementChild) related.firstElementChild.setAttribute('data-curated-related', '');
  const heading = related.querySelector('#related-heading');
  if (heading) { heading.id = 'related-' + p.slug; related.firstElementChild.setAttribute('aria-labelledby', heading.id); }
  return xmlFragment(responsiveFragment(related.innerHTML, 'related'));
};
const uiPosts = themePosts.map(p => ({ path: postPath(p), title: p.title, excerpt: p.excerpt, date: p.date, readTime: source.readingTimes[p.slug], tags: p.tags, category: p.category, imageUrl: p.imageUrl, related: p.relatedPosts || [] }));
const cssConfig = loadConfig(path.join(root, 'tailwind.config.ts'));
cssConfig.content = [path.join(root, 'src/**/*.{ts,tsx}'), path.join(root, 'blogger/template.xml'), path.join(root, 'blogger/fragments/*.html'), path.join(root, 'blogger/enhancements.js')];
const originalCss = (await fs.readFile(path.join(root, 'src/index.css'), 'utf8')).replace(/@import\s+url\([^\r\n]*\);/g, '');
const css = (await postcss([tailwindcss(cssConfig)]).process(originalCss, { from: path.join(root, 'src/index.css') })).css + '\n' + await fs.readFile(path.join(root, 'blogger/styles.css'), 'utf8');
const socialImage = config.socialImageUrl || config.profile.portraitUrl || (config.contentMode === 'project' ? mediaUrl('profile-headshot.jpg') : '');
const seo = buildBloggerSeo(config, themeSource, themePosts, postPath, socialImage);
const templateSource = await fs.readFile(path.join(root, 'blogger/template.xml'), 'utf8');
const enhancementScript = await fs.readFile(path.join(root, 'blogger/enhancements.js'), 'utf8');
const popularMarkup = await fs.readFile(path.join(root, 'blogger/fragments/popular-posts.xml'), 'utf8');
const buildId = createHash('sha256').update(templateSource).update(css).update(enhancementScript).update(popularMarkup).update(JSON.stringify({ config, regions, routes: seo.routes, posts: themePosts })).digest('hex').slice(0, 20);
const substitutions = {
  BUILD_ID: buildId,
  CSS: css,
  HEADER: editableRegion('themeHeader', 'HTML101', 'Header — branding and navigation', regions.header),
  HERO: editableRegion('themeHero', 'HTML102', 'Homepage hero — text and portrait', regions.hero),
  FOOTER: editableRegion('themeFooter', 'HTML105', 'Footer — text and links', regions.footer),
  TOPICS: editableRegion('themeTopics', 'HTML103', 'Topics — label links', regions.topics),
  CONNECT: editableRegion('themeConnect', 'HTML104', 'Social links', regions.connect),
  POPULAR_POSTS: popularMarkup,
  TOPICS_SET: escape(topicsSet),
  PROFILE_ROLE: escape(config.profile.role), PROFILE_JOB: escape(config.profile.job), PROFILE_BIO: escape(config.profile.bio),
  AUTHOR_NAME: escape(config.author), ABOUT_URL: escape(config.links.about),
  TWITTER_CREATOR: escape(config.branding.twitterCreator),
  THEME_DATA: JSON.stringify({ citationName: config.profile.citationName, title: config.title }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'),
  BACK_ICON: xmlFragment(source.icons.back), CLOCK_ICON: xmlFragment(source.icons.clock), UP_ICON: xmlFragment(source.icons.up), SHARE: xmlFragment(share.innerHTML),
  POST_DATA: JSON.stringify(uiPosts).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'),
  CARD_TAGS: conditionalMarkup(routeBranches(p => tags(p, 4)), nativeTags(4)),
  ARTICLE_TAGS: conditionalMarkup(routeBranches(p => tags(p)), nativeTags()),
  // Responsive native Blogger thumbnails use actual hosted image variants.
  CARD_IMAGE: conditionalMarkup(routeBranches(p => `<a href='${postPath(p)}' class='hidden sm:block flex-shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-lg overflow-hidden' tabindex='-1' aria-hidden='true'><img src='${escape(p.imageUrl)}'${responsiveAttributes(imageVariants(p.imageUrl), 'card')} alt='' width='192' height='128' class='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' loading='lazy'/></a>`), `<b:if cond='data:post.featuredImage'><a expr:href='data:post.url' class='hidden sm:block flex-shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-lg overflow-hidden' tabindex='-1' aria-hidden='true'><img expr:src='resizeImage(data:post.featuredImage, 384, "3:2")' expr:srcset='sourceSet(data:post.featuredImage, [192, 384, 768], "3:2")' sizes='(min-width: 768px) 192px, 160px' alt='' width='192' height='128' class='w-full h-full object-cover' loading='lazy'/></a></b:if>`),
  DATE_MARKUP: conditionalMarkup(routeBranches(p => `<time datetime='${date(p.date).slice(0, 10)}'>${escape(p.date)}</time>`), '<time expr:datetime="data:post.date.iso8601"><data:post.date/></time>'),
  RELATED_POSTS: conditionalMarkup(routeBranches(relatedMarkup), `<b:loop values='data:post.labels' var='label' index='i'><b:if cond='data:i == 0'><section class='my-12' data-related='' expr:data-label='data:label.name' hidden='hidden'><h2 class='font-display text-2xl font-semibold mb-6'>You might also like</h2><div class='related-grid' data-related-list=''/></section></b:if></b:loop>`),
  RECENT_POSTS: themePosts.length ? '<section class="mt-16 text-left"><h2 class="font-display text-xl font-semibold mb-4">Recent posts</h2><ul class="space-y-3">' + themePosts.slice(0, 3).map(p => `<li class="border-b border-divider pb-3"><a href="${postPath(p)}" class="block hover:text-primary"><p class="font-display text-base font-medium">${escape(p.title)}</p><time class="text-xs text-muted-foreground">${escape(p.date)}</time></a></li>`).join('') + '</ul></section>' : '',
  SCRIPT: enhancementScript,
  PORTRAIT: escape(portrait),
  EXCERPT_MARKUP: conditionalMarkup(themePosts.map(p => ({
    condition: routeCondition('data:post.url', postPath(p)), markup: escape(p.excerpt),
  })), '<b:eval expr="snippet(data:post.body, {length: 180, links: false, linebreaks: false})"/>'),
  READTIME_MARKUP: conditionalMarkup(themePosts.map(p => ({
    condition: routeCondition('data:post.url', postPath(p)),
    markup: escape(source.readingTimes[p.slug]),
  }))),
  ...seo.replacements,
};
const template = templateSource.replace(/@@([A-Z_]+)@@/g, (_, key) => {
  if (!(key in substitutions)) throw new Error('Missing template replacement ' + key);
  return substitutions[key];
});
// XML parsing catches malformed HTML, ampersands and CDATA boundaries before delivery.
const themeDocument = new JSDOM(template, { contentType: 'text/xml' }).window.document;
validateBloggerExpressions(themeDocument);
validateBloggerWidgetSettings(themeDocument);
await fs.writeFile(path.join(out, 'iamrusiru-blogger.xml'), template);
await fs.writeFile(path.join(out, 'build-manifest.json'), JSON.stringify({ buildId, contentMode: config.contentMode, blogUrl: config.blogUrl, verification: 'Local build; native Blogger compilation and saved-editor behavior require hosted verification' }, null, 2) + '\n');

function date(value) {
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T00:00:00Z' : value + ' 00:00:00 GMT');
  if (!Number.isFinite(parsed.getTime())) throw new Error('Invalid post date: ' + value);
  return parsed.toISOString();
}
function inline(value) {
  // Parse links before escaping, then escape text and attributes independently.
  // Code is an atomic token: never turn an example URL or asterisk into markup.
  const token = /`([^`]+)`|\[([^\]\n]+)\]\((https:\/\/[^\s)]+|\/(?!\/)[^\s)]*)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let output = '', cursor = 0;
  for (const match of String(value).matchAll(token)) {
    output += escape(value.slice(cursor, match.index));
    const [, code, label, href, strong, emphasis] = match;
    output += code !== undefined ? '<code>' + escape(code) + '</code>'
      : href !== undefined ? '<a href="' + escape(href) + '">' + inline(label) + '</a>'
      : strong !== undefined ? '<strong>' + inline(strong) + '</strong>'
      : '<em>' + inline(emphasis) + '</em>';
    cursor = match.index + match[0].length;
  }
  return output + escape(value.slice(cursor));
}
function postPath(post) { return '/' + date(post.date).slice(0, 7).replace('-', '/') + '/' + post.slug + '.html'; }
function body(post) {
  const seen = new Set();
  function heading(level, text) {
    const base = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'section';
    let id = base, i = 1;
    while (seen.has(id)) id = base + '-' + i++;
    seen.add(id);
    return `<h${level} id="${id}">${inline(text)}</h${level}>`;
  }
  const resolveLinks = text => {
    text = text.replace(/\[([^\]]+)\]\(post:([\w-]+)\)/g, (_, label, slug) => {
      const linked = themePosts.find(item => item.slug === slug);
      if (!linked) throw new Error('Unknown contextual Blogger link: ' + slug);
      return '[' + label + '](' + postPath(linked) + ')';
    });
    for (const [marker, slug, label] of [['OWASP_GUIDE_LINK', 'owasp-top-ten', 'OWASP Top 10 2025 guide'], ['ACCESS_CONTROL_LINK', 'broken-access-control', 'broken access control deep dive'], ['BURNOUT_LINK', 'burnout-and-recovery', 'burnout and recovery']]) {
      const linked = themePosts.find(item => item.slug === slug);
      text = text.replaceAll(marker, linked ? '[' + label + '](' + postPath(linked) + ')' : label);
    }
    return text;
  };
  const blocks = post.content.map(block => {
    if (typeof block === 'string') return renderBloggerProse(resolveLinks(block), { inline, heading });
    if (block.type === 'heading') return heading(block.level, block.text);
    if (block.type === 'code') {
      const code = fragment(source.renderCode(block));
      code.firstElementChild.classList.add('code-block');
      code.querySelector('button').setAttribute('data-copy-code', '');
      return code.innerHTML;
    }
    if (block.type === 'callout') return source.renderCallout(block);
    if (block.type === 'image') {
      const src = block.src.startsWith('/assets/') ? mediaUrl(path.basename(block.src)) : block.src;
      return responsiveFragment(source.renderImage({ ...block, src }), 'cover');
    }
    throw new Error('Unhandled content block ' + block.type);
  }).join('\n');
  const faq = post.faq?.length ? `<section class="mt-12" itemscope="itemscope" itemtype="https://schema.org/FAQPage"><h2>Frequently Asked Questions</h2>${post.faq.map(f => `<div class="mt-5 rounded-xl border border-divider bg-warm p-5" itemprop="mainEntity" itemscope="itemscope" itemtype="https://schema.org/Question"><h3 itemprop="name">${escape(f.question)}</h3><div itemprop="acceptedAnswer" itemscope="itemscope" itemtype="https://schema.org/Answer"><p itemprop="text">${inline(f.answer)}</p></div></div>`).join('')}</section>` : '';
  const related = (post.relatedPosts || []).map(slug => themePosts.find(p => p.slug === slug)).filter(Boolean);
  const references = post.references?.length ? '<section class="mt-12"><h2>Sources and further reading</h2><ul>' + post.references.map(reference => '<li><a href="' + escape(reference.url) + '">' + escape(reference.title) + '</a></li>').join('') + '</ul></section>' : '';
  return `<div class="post-summary rounded-xl bg-primary/5 border border-primary/10 px-6 py-5 mb-10"><p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p><p class="text-body text-base leading-relaxed">${escape(post.excerpt)}</p></div>
<img class="rounded-xl w-full mb-10" style="max-height:400px;object-fit:cover" src="${escape(post.imageUrl)}"${responsiveAttributes(imageVariants(post.imageUrl))} alt="${escape('Cover image for ' + post.title)}" width="${post.coverDimensions?.width || 800}" height="${post.coverDimensions?.height || 400}" fetchpriority="high"/>
${blocks}\n${references}\n${faq}
${related.length ? '<section class="mt-12"><h2>More from the blog</h2><ul>' + related.map(p => `<li><a href="${postPath(p)}">${escape(p.title)}</a></li>`).join('') + '</ul></section>' : ''}`;
}
const posts = themePosts.map(p => ({ ...p, seo: seo.routes.find(route => route.path === postPath(p)), path: postPath(p), published: date(p.date), updated: date(p.updatedDate || p.date), body: body(p), labels: [...new Set([p.category, ...p.tags])] }));
const pages = (config.contentMode === 'project' ? themeSource.pages : []).map(page => {
  const main = fragment(page.html).querySelector('main');
  const box = fragment(main.innerHTML);
  return { ...page, seo: seo.routes.find(route => route.path === '/p/' + page.slug + '.html'), path: '/p/' + page.slug + '.html', body: `<div data-migrated-page="true" class="page-body ${main.className.replace('px-6', '').replace('py-16', '')}">${box.innerHTML}</div>` };
});
function entry(item, isPage = false) {
  const id = BigInt('0x' + createHash('sha256').update(item.slug).digest('hex').slice(0, 15)).toString();
  return `<entry><id>tag:blogger.com,1999:blog-1.${isPage ? 'page' : 'post'}-${id}</id><published>${item.published || '2026-11-04T00:00:00.000Z'}</published><updated>${item.updated || '2026-11-04T00:00:00.000Z'}</updated><category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/blogger/2008/kind#${isPage ? 'page' : 'post'}"/>${(item.labels || []).map(label => `<category scheme="http://www.blogger.com/atom/ns#" term="${escape(label)}"/>`).join('')}<title type="text">${escape(item.title)}</title><content type="html">${escape(item.body)}</content><link rel="alternate" type="text/html" href="${escape(config.blogUrl + item.path)}"/><author><name>${escape(config.author)}</name></author><app:control><app:draft>no</app:draft></app:control></entry>`;
}
const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://purl.org/atom/app#"><id>tag:blogger.com,1999:blog-1</id><updated>${posts.reduce((a, p) => a > p.updated ? a : p.updated, '1970-01-01T00:00:00.000Z')}</updated><title type="text">${escape(config.title)}</title><generator version="7.00" uri="https://www.blogger.com">Blogger</generator>${posts.map(p => entry(p)).join('\n')}${pages.map(p => entry(p, true)).join('\n')}</feed>`;
new JSDOM(feed, { contentType: 'text/xml' });
await fs.writeFile(path.join(out, 'feed.atom'), feed);
await fs.writeFile(path.join(out, 'media-manifest.json'), JSON.stringify(Object.fromEntries(media), null, 2) + '\n');
const redirects = [...posts.map(p => ({ from: '/post/' + p.slug, to: p.path })), ...pages.map(p => ({ from: '/' + p.slug, to: p.path }))];
await fs.writeFile(path.join(out, 'redirects.json'), JSON.stringify(redirects, null, 2) + '\n');
for (const [name] of media) await fs.copyFile(path.join(root, 'src/assets', name), path.join(out, 'assets', name));
// Generate real uploadable assets, but never activate fictional public URLs.
const imagePlan = [];
for (const [name, originalUrl] of media) {
  const input = path.join(root, 'src/assets', name);
  const info = await sharp(input).metadata();
  const variants = [];
  for (const width of [...new Set([384, 768, Math.min(1280, info.width)])].filter(width => width <= info.width).sort((a, b) => a - b)) {
    const filename = path.parse(name).name + '-' + width + '.webp';
    const target = path.join(out, 'assets', filename);
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
    const actual = await sharp(target).metadata();
    variants.push({ width: actual.width, height: actual.height, file: 'assets/' + filename, bytes: (await fs.stat(target)).size, url: config.responsiveImages[name]?.find(variant => variant.width === actual.width)?.url || '' });
  }
  imagePlan.push({ source: name, originalUrl, originalBytes: (await fs.stat(input)).size, variants, active: Boolean(config.responsiveImages[name]?.length) });
}
await fs.writeFile(path.join(out, 'responsive-image-plan.json'), JSON.stringify({ note: 'Upload the files, fill their public HTTPS URLs, then activate with scripts/activate-blogger-images.mjs. Empty URLs are never emitted into posts.', images: imagePlan }, null, 2) + '\n');
await fs.writeFile(path.join(out, 'responsive-images.upload.json'), JSON.stringify(Object.fromEntries(imagePlan.map(image => [image.source, image.variants.map(({ width, url }) => ({ width, url }))])), null, 2) + '\n');
for (const page of pages) await fs.writeFile(path.join(out, page.slug + '.html'), page.body);
await fs.mkdir(path.join(out, 'page-updates'), { recursive: true });
for (const page of pages) await fs.writeFile(path.join(out, 'page-updates', page.slug + '.html'), page.body + '\n');
await fs.writeFile(path.join(out, 'page-updates.json'), JSON.stringify(pages.map(page => ({ slug: page.slug, url: config.blogUrl + page.path, title: page.title, searchDescription: page.seo.description, htmlFile: 'page-updates/' + page.slug + '.html', updateRequired: page.slug === 'privacy-policy', note: page.slug === 'privacy-policy' ? 'Destination identity corrected. Owner must review actual service/data-handling claims.' : 'Reference copy; no body update required by this release.' })), null, 2) + '\n');
if (themePosts.length) {
  await fs.mkdir(path.join(out, 'page-drafts'), { recursive: true });
  await fs.writeFile(path.join(out, 'page-drafts/engineering-start-here.html'), engineeringHub(themePosts, postPath, escape) + '\n');
  await fs.writeFile(path.join(out, 'page-drafts.json'), JSON.stringify([{ title: 'Engineering: Start Here', suggestedPath: '/p/engineering-start-here.html', searchDescription: 'Find practical guides to application security, delivery, production debugging, code reviews and small engineering experiments.', htmlFile: 'page-drafts/engineering-start-here.html', status: 'Optional unpublished draft; publish before adding its actual URL to navigation.' }], null, 2) + '\n');
}
// Existing publications must be edited in place. These are body-only update
// files, not a second import feed; metadata fields are supplied separately.
await fs.mkdir(path.join(out, 'post-updates'), { recursive: true });
for (const post of posts) await fs.writeFile(path.join(out, 'post-updates', post.slug + '.html'), post.body + '\n');
const publishing = posts.map(post => ({ slug: post.slug, url: config.blogUrl + post.path, title: post.title, searchDescription: post.searchDescription, intent: post.searchIntent, labels: post.labels, htmlFile: 'post-updates/' + post.slug + '.html', editorialRevision: post.updatedDate || null }));
await fs.writeFile(path.join(out, 'post-updates.json'), JSON.stringify(publishing, null, 2) + '\n');
const csv = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
const publishingCsv = '\uFEFF' + ['url', 'title', 'searchDescription', 'intent', 'labels', 'htmlFile', 'editorialRevision'].map(csv).join(',') + '\r\n' + publishing.map(post => [post.url, post.title, post.searchDescription, post.intent, post.labels.join(', '), post.htmlFile, post.editorialRevision].map(csv).join(',')).join('\r\n');
const csvPath = path.join(out, 'post-updates.csv');
const previousCsv = await fs.readFile(csvPath, 'utf8').catch(error => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
// Excel can lock this reference sheet while the owner updates existing posts.
// Image activation does not change its fields, so avoid an unnecessary write.
if (previousCsv !== publishingCsv) {
  try { await fs.writeFile(csvPath, publishingCsv); }
  catch (error) {
    if (['EBUSY', 'EPERM', 'EACCES'].includes(error.code)) throw new Error(`Cannot update ${csvPath}. Close the CSV in Excel or rebuild with --out blogger/output-new.`, { cause: error });
    throw error;
  }
}
await fs.writeFile(path.join(out, 'content.json'), JSON.stringify({ config, posts, pages }, null, 2));
await fs.writeFile(path.join(out, 'theme-config.json'), JSON.stringify(config, null, 2) + '\n');
await fs.writeFile(path.join(out, 'seo-routes.json'), JSON.stringify({ language: config.seo.language, homeTitle: config.seo.homeTitle, routes: seo.routes }, null, 2) + '\n');
// Blogger serves robots.txt itself; this file is pasted into Settings, never
// embedded in the XML. Derive sitemap origins for each reusable destination.
await fs.writeFile(path.join(out, 'robots-txt.example.txt'), `# Optional Blogger Settings > Crawlers and indexing > Custom robots.txt\n# Review before saving; this allows public content to be crawled.\nUser-agent: *\nDisallow: /search\nDisallow: /share-widget\nAllow: /\n\nSitemap: ${config.blogUrl}/sitemap.xml\nSitemap: ${config.blogUrl}/sitemap-pages.xml\n`);
await fs.mkdir(path.join(out, 'editable-regions'), { recursive: true });
for (const [name, html] of Object.entries(regions)) await fs.writeFile(path.join(out, 'editable-regions', name + '.html'), html);
await fs.mkdir(path.join(out, 'widget-updates'), { recursive: true });
await fs.copyFile(path.join(root, 'blogger/fragments/popular-posts.xml'), path.join(out, 'widget-updates/popular-posts.xml'));
for (const [name, html] of Object.entries(editorTemplates(source))) {
  const target = path.join(out, 'editor-templates', name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html + '\n');
}
// Previews evaluate the same XML branches; they are fixtures, not Blogger's renderer.
await fs.mkdir(path.join(out, 'preview'), { recursive: true });
for (const [name, options] of Object.entries({ home: {}, post: { kind: 'post', post: posts[0] }, about: { kind: 'page', post: pages[0] }, search: { kind: 'search' }, empty: { kind: 'empty' }, archive: { kind: 'archive' }, label: { kind: 'label' }, error: { kind: 'error' } })) {
  if ((options.kind === 'post' || options.kind === 'page') && !options.post) continue;
  await fs.writeFile(path.join(out, 'preview', name + '.html'), renderPreview(template, { config, posts, media, ...options }));
}
await fs.copyFile(path.join(root, config.contentMode === 'native' ? 'blogger/REUSABLE.md' : 'blogger/README.md'), path.join(out, 'README.md'));
await fs.copyFile(path.join(root, 'blogger/COMPATIBILITY.md'), path.join(out, 'COMPATIBILITY.md'));
await fs.copyFile(path.join(root, 'blogger/UI-COMPARISON.md'), path.join(out, 'UI-COMPARISON.md'));
await fs.copyFile(path.join(root, 'blogger/CUSTOMIZATION.md'), path.join(out, 'CUSTOMIZATION.md'));
await fs.copyFile(path.join(root, 'blogger/WRITING.md'), path.join(out, 'WRITING.md'));
await fs.copyFile(path.join(root, 'blogger/SEO-GUIDE.md'), path.join(out, 'SEO-GUIDE.md'));
await fs.copyFile(path.join(root, 'blogger/IMAGE-PUBLISHING.md'), path.join(out, 'IMAGE-PUBLISHING.md'));
if (config.contentMode === 'project') {
  await fs.copyFile(path.join(root, 'blogger/SEO-AUDIT.md'), path.join(out, 'SEO-AUDIT.md'));
  await fs.cp(path.join(root, 'blogger/audits'), path.join(out, 'audits'), { recursive: true });
  await fs.cp(path.join(root, 'blogger/changes'), path.join(out, 'changes'), { recursive: true });
  await fs.cp(path.join(root, 'blogger/research'), path.join(out, 'research'), { recursive: true });
} else {
  await fs.writeFile(path.join(out, 'SEO-AUDIT.md'), '# Verify this Blogger theme\n\nThis clean native-content package has no imported project articles or project audit data. After restore, verify native titles/Search descriptions, canonical/social fields, Labels, FAQ markup, robots policy and new post/Page editing on your own blog. Local tests do not certify Blogger compilation, indexing or AI citations. See [APPLY-UPDATES.md](APPLY-UPDATES.md) and [SEO-GUIDE.md](SEO-GUIDE.md).\n');
}
await fs.copyFile(path.join(root, 'blogger', config.contentMode === 'native' ? 'REUSABLE.md' : 'APPLY-UPDATES.md'), path.join(out, 'APPLY-UPDATES.md'));
console.log(`Blogger export (${config.contentMode}): ${posts.length} posts, ${pages.length} pages, ${media.size} images.\nTheme: ${path.relative(root, path.join(out, 'iamrusiru-blogger.xml'))}\n${config.contentMode === 'project' ? 'Optional content: ' + path.relative(root, path.join(out, 'feed.atom')) : 'Native mode: use the destination blog\'s own posts and Pages; no content import needed.'}`);
