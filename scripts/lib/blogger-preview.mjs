// Local-only approximation of the expressions used by our own template.
// Never run this evaluator against an untrusted template or use it as a server.
import { JSDOM } from 'jsdom';
import { googleImageVariant } from './blogger-images.mjs';

export function renderPreview(template, { config, posts, media, kind = 'home', post = posts[0], localAssets = true, assetPrefix = '../assets/', viewTitle, searchDescription, nativeMetaDescription, genericViewDescription = false, requestUrl }) {
  const doc = new JSDOM(template, { contentType: 'text/xml' }).window.document;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = requestUrl || config.blogUrl + (kind === 'post' || kind === 'page' ? post.path : kind === 'search' ? '/search?q=TypeScript' : kind === 'label' ? '/search/label/Engineering' : kind === 'archive' ? '/2026/06/' : kind === 'error' ? '/missing.html' : '/');
  function normalize(p) {
    let body = p.body;
    if (localAssets) for (const [name, src] of media) body = body.replaceAll(src, assetPrefix + name);
    return {
      ...p, body, url: config.blogUrl + p.path,
      featuredImage: p.imageUrl ? localAssets && [...media].some(([, src]) => src === p.imageUrl) ? assetPrefix + [...media].find(([, src]) => src === p.imageUrl)[0] : p.imageUrl : '',
      author: { name: config.author, profileUrl: config.blogUrl + '/p/about.html' },
      date: p.published || p.date ? { iso8601: p.published, toString: () => p.date } : '',
      lastUpdated: { iso8601: p.updated },
      labels: (p.labels || []).map(name => ({ name, url: config.blogUrl + '/search/label/' + encodeURIComponent(name) })),
      allowComments: true,
      emailPostUrl: 'mailto:?subject=' + encodeURIComponent(p.title) + '&body=' + encodeURIComponent(config.blogUrl + p.path),
    };
  }
  const listing = kind === 'search' ? posts.filter(p => p.title.includes('TypeScript')) : kind === 'empty' ? [] : kind === 'label' ? posts.filter(p => p.labels.includes('Engineering')) : posts;
  const title = viewTitle || (kind === 'post' || kind === 'page' ? post.title : kind === 'search' ? 'Search results for TypeScript' : kind === 'label' ? 'Engineering' : kind === 'archive' ? 'June 2026' : kind === 'error' ? 'Page not found' : config.title);
  const context = {
    blog: { title: config.title, homepageUrl: config.blogUrl + '/', canonicalUrl: url.split('?')[0], pageName: kind === 'archive' ? title : '', languageDirection: 'ltr', locale: 'en', postImageUrl: kind === 'post' ? post.imageUrl : '', metaDescription: nativeMetaDescription ?? searchDescription ?? config.description ?? '' },
    view: { url, title, description: genericViewDescription ? config.description : searchDescription ?? '', isHomepage: kind === 'home', isPost: kind === 'post', isPage: kind === 'page', isSingleItem: ['post', 'page'].includes(kind), isMultipleItems: !['post', 'page', 'error'].includes(kind), isSearch: ['search', 'label', 'empty', 'listing'].includes(kind), isArchive: kind === 'archive', isError: kind === 'error', search: { query: kind === 'search' ? 'TypeScript' : '', label: kind === 'label' ? 'Engineering' : '' } },
    posts: (['post', 'page'].includes(kind) ? [post] : listing.slice(0, 6)).map(normalize),
    labels: [...new Set(posts.flatMap(p => p.labels))].map(name => ({ name, count: posts.filter(p => p.labels.includes(name)).length, url: config.blogUrl + '/search/label/' + encodeURIComponent(name) })).sort((a, b) => a.name.localeCompare(b.name)),
    title: 'Tags', olderPageUrl: posts.length > 6 && (kind === 'home' || kind === 'archive') ? config.blogUrl + '/search?updated-max=2026-04-01T00:00:00Z&max-results=6' : '', newerPageUrl: '',
  };
  const includes = new Map(Array.from(doc.getElementsByTagName('b:includable')).map(el => [el.getAttribute('id'), el]));
  function evaluate(expression, scope) {
    if (Object.hasOwn(scope, expression)) return scope[expression];
    function get(key) {
      const parts = key.split('.').filter(p => p !== 'escaped');
      let value = scope;
      for (const part of parts) {
        if (part === 'empty' && Array.isArray(value)) value = value.length === 0;
        else value = value?.[part];
      }
      return value ?? '';
    }
    const strings = [];
    const js = expression.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, value => { strings.push(value); return '__s' + (strings.length - 1) + '__'; })
      .replace(/data:([\w.]+)\s+in\s+\{([^}]+)\}/g, '[$2].includes(get("$1"))')
      .replace(/data:([\w.]+)\s+contains\s+(__s\d+__)/g, 'String(get("$1")).includes($2)')
      .replace(/data:([\w.]+)/g, 'get("$1")').replace(/\?:/g, '||').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
      .replace(/__s(\d+)__/g, (_, index) => strings[Number(index)]);
    const snippet = (html, options) => JSDOM.fragment(html).textContent.replace(/\s+/g, ' ').trim().slice(0, options.length);
    const urlPath = (base, pathname) => new URL(pathname, String(base)).href;
    const resize = (value, width) => googleImageVariant(value, width) || value;
    const sourceSet = (value, widths) => googleImageVariant(value, widths[0]) ? widths.map(width => resize(value, width) + ' ' + width + 'w').join(', ') : '';
    return Function('get', 'snippet', 'resizeImage', 'sourceSet', 'path', 'return (' + js + ');')(get, snippet, resize, sourceSet, urlPath);
  }
  const children = (node, scope) => Array.from(node.childNodes).map(child => render(child, scope)).join('');
  function render(node, scope) {
    if (node.nodeType === 3) return escape(node.nodeValue);
    if (node.nodeType === 4) return node.nodeValue;
    if (node.nodeType !== 1) return '';
    const name = node.nodeName;
    if (name === 'b:skin') return '<style>' + node.textContent + '</style>';
    if (name === 'b:with') return children(node, { ...scope, [node.getAttribute('var')]: evaluate(node.getAttribute('value'), scope) });
    if (name === 'b:includable' || name === 'b:else' || name === 'b:elseif') return '';
    if (name === 'b:if') {
      let active = Boolean(evaluate(node.getAttribute('cond'), scope));
      let taken = active;
      let html = '';
      for (const child of node.childNodes) {
        if (child.nodeName === 'b:else') { active = !taken; taken = true; }
        else if (child.nodeName === 'b:elseif') { active = !taken && Boolean(evaluate(child.getAttribute('cond'), scope)); taken ||= active; }
        else if (active) html += render(child, scope);
      }
      return html;
    }
    if (name === 'b:loop') return (evaluate(node.getAttribute('values'), scope) || []).map((value, index) => children(node, { ...scope, [node.getAttribute('var')]: value, [node.getAttribute('index') || '_index']: index })).join('');
    if (name === 'b:eval') return escape(evaluate(node.getAttribute('expr'), scope));
    if (name === 'b:include') {
      const id = node.getAttribute('name');
      if (id === 'commentPicker') return '<section class="comments"><h2 class="font-display text-2xl mb-4">Comments</h2><p>Blogger supplies the native comment thread and editor here.</p></section>';
      if (!includes.has(id)) throw new Error('Unknown template include ' + id);
      const inc = includes.get(id);
      const value = node.hasAttribute('data') ? evaluate(node.getAttribute('data'), scope) : scope;
      return children(inc, { ...scope, [inc.getAttribute('var') || '_include']: value });
    }
    if (name.startsWith('data:')) {
      const value = evaluate(name, scope);
      return name === 'data:post.body' || name === 'data:content' ? value : escape(value);
    }
    if (name === 'b:widget') {
      if (node.getAttribute('visible') === 'false') return '';
      const main = Array.from(node.children).find(el => el.nodeName === 'b:includable' && el.getAttribute('id') === 'main');
      const settings = Object.fromEntries(Array.from(node.getElementsByTagName('b:widget-setting')).map(el => [el.getAttribute('name'), el.textContent]));
      const widgetScope = { ...scope, title: node.getAttribute('title'), ...settings };
      if (node.getAttribute('type') === 'PopularPosts') widgetScope.posts = posts.slice(0, 10).map(normalize);
      if (!main && node.getAttribute('type') === 'BlogArchive') {
        const months = [...new Set(posts.map(p => p.path.slice(0, 8)))];
        return '<div class="widget" id="BlogArchive1"><h2>Blog Archive</h2><ul>' + months.map(month => '<li><a href="' + escape(config.blogUrl + month + '/') + '">' + escape(month.slice(1).replace('/', ' / ')) + '</a></li>').join('') + '</ul></div>';
      }
      return '<div class="widget ' + node.getAttribute('type') + '" id="' + node.id + '">' + (main ? children(main, widgetScope) : '') + '</div>';
    }
    const tag = name === 'b:section' ? 'div' : name;
    let attrs = '';
    for (const attr of node.attributes) {
      if (attr.name.startsWith('xmlns') || attr.name.startsWith('b:') || ['maxwidgets', 'showaddelement'].includes(attr.name)) continue;
      const key = attr.name.startsWith('expr:') ? attr.name.slice(5) : attr.name;
      const value = attr.name.startsWith('expr:') ? evaluate(attr.value, scope) : attr.value;
      attrs += ' ' + key + '="' + escape(value) + '"';
    }
    const voids = new Set(['meta', 'link', 'img', 'input', 'br', 'hr', 'source', 'wbr']);
    if (voids.has(tag)) return '<' + tag + attrs + '>';
    // Blogger preserves CDATA markers in inline scripts. Keep them here too so
    // a preview cannot conceal a browser SyntaxError in the installed theme.
    const scriptText = () => Array.from(node.childNodes).map(child => child.nodeType === 4 ? '<![CDATA[' + child.nodeValue + ']]>' : child.nodeValue || '').join('');
    return '<' + tag + attrs + '>' + (tag === 'script' ? scriptText() : tag === 'style' ? node.textContent : children(node, scope)) + '</' + tag + '>';
  }
  let html = '<!DOCTYPE html>\n' + render(doc.documentElement, context);
  // Static source fragments (card covers, author portraits and related posts)
  // need the same local media mapping as imported post bodies.
  if (localAssets) for (const [name, src] of media) html = html.replaceAll('src="' + escape(src) + '"', 'src="' + escape(assetPrefix + name) + '"');
  return html;
}
