import { conditionalMarkup, descriptionMetadata, escapeXml, routeCondition } from './blogger-markup.mjs';

export const seoDefaults = {
  language: 'en', homeTitle: '', homeKeywords: [], emitLegacyKeywords: true,
  noindexPaths: ['/p/privacy-policy.html', '/p/cookie-policy.html'], routes: [],
};

export function validateSeoConfig(seo) {
  const text = (value, name) => { if (typeof value !== 'string') throw new Error(name + ' must be text'); };
  text(seo.language, 'seo.language'); text(seo.homeTitle, 'seo.homeTitle');
  if (!/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(seo.language)) throw new Error('seo.language must be a language tag such as en or en-US');
  if (typeof seo.emitLegacyKeywords !== 'boolean') throw new Error('seo.emitLegacyKeywords must be true or false');
  const path = value => typeof value === 'string' && (value === '/' || /^\/[a-zA-Z0-9/_-]+\.html$/.test(value));
  const keywords = (values, name) => {
    if (!Array.isArray(values) || values.some(value => typeof value !== 'string' || !value.trim())) throw new Error(name + ' must contain nonempty keyword phrases');
  };
  keywords(seo.homeKeywords, 'seo.homeKeywords');
  if (!Array.isArray(seo.noindexPaths) || seo.noindexPaths.some(value => !path(value))) throw new Error('seo.noindexPaths must contain Blogger paths');
  if (!Array.isArray(seo.routes)) throw new Error('seo.routes must be an array');
  const seen = new Set();
  for (const route of seo.routes) {
    if (!route || typeof route !== 'object' || !path(route.path) || seen.has(route.path)) throw new Error('seo.routes needs unique Blogger paths');
    seen.add(route.path);
    for (const key of Object.keys(route)) if (!['path', 'title', 'description', 'keywords', 'pageType', 'noIndex', 'imageUrl'].includes(key)) throw new Error('Unknown SEO route setting: ' + key);
    for (const key of ['title', 'description']) if (route[key] !== undefined) text(route[key], 'seo.routes.' + key);
    if (route.keywords !== undefined) keywords(route.keywords, 'seo.routes.keywords');
    if (route.noIndex !== undefined && typeof route.noIndex !== 'boolean') throw new Error('seo.routes.noIndex must be true or false');
    if (route.pageType !== undefined && !['WebPage', 'AboutPage', 'ContactPage', 'ProfilePage'].includes(route.pageType)) throw new Error('Unsupported SEO pageType');
    if (route.imageUrl !== undefined && (typeof route.imageUrl !== 'string' || !route.imageUrl.startsWith('https://') || new URL(route.imageUrl).protocol !== 'https:')) throw new Error('SEO route imageUrl must use HTTPS');
  }
}

const unique = values => [...new Map(values.map(value => [value.trim().toLowerCase(), value.trim()])).values()];
const meta = (property, value, expression = false) => `<meta itemprop='${property}' ${expression ? 'expr:content' : 'content'}='${escapeXml(value)}'/>`;
const condition = (expression, path) => path === '/' ? 'data:view.isHomepage' : routeCondition(expression, path);
const urlAttribute = (attribute, value) => value.startsWith('/')
  ? `expr:${attribute}='${escapeXml('data:blog.homepageUrl + ' + JSON.stringify(value.slice(1)))}'`
  : `${attribute}='${escapeXml(value)}'`;

export function buildBloggerSeo(config, source, posts, postPath, socialImage) {
  const routeMap = new Map();
  for (const post of posts) {
    routeMap.set(postPath(post), { path: postPath(post), originalTitle: post.title, ...source.postSEO(post, config.title), imageUrl: post.imageUrl, category: post.category, kind: 'post' });
  }
  if (config.contentMode === 'project') for (const page of source.pages) {
    routeMap.set('/p/' + page.slug + '.html', {
      path: '/p/' + page.slug + '.html', originalTitle: page.title, kind: 'page',
      title: (page.seo.title || page.title).replace(/\| iamrusiru$/, '| ' + config.title),
      description: page.seo.description || config.description, keywords: page.seo.keywords || [],
      pageType: page.slug === 'about' ? 'AboutPage' : page.slug === 'contact' ? 'ContactPage' : 'WebPage',
      noIndex: page.seo.noIndex || false,
    });
  }
  // Explicit owner settings override imported defaults, without hardcoding an origin.
  for (const override of config.seo.routes) routeMap.set(override.path, { ...(routeMap.get(override.path) || {}), ...override, explicitTitle: override.title !== undefined, explicitImage: override.imageUrl !== undefined });
  const routes = [...routeMap.values()].map(route => ({ ...route, keywords: unique(route.keywords || []) }));
  const branches = (expression, render, filter = () => true) => routes.filter(filter).map(route => ({ condition: condition(expression, route.path), markup: render(route) }));

  const descriptions = conditionalMarkup([
    // A freshly edited Blogger Search description always wins over migration defaults.
    { condition: 'data:view.description', markup: descriptionMetadata('data:view.description', { expression: true }) },
    ...branches('data:blog.canonicalUrl', route => descriptionMetadata(route.description), route => Boolean(route.description)),
    { condition: 'data:blog.metaDescription', markup: descriptionMetadata('data:blog.metaDescription', { expression: true }) },
  ], descriptionMetadata(config.description));
  const titles = conditionalMarkup([
    ...((routeMap.get('/')?.title || config.seo.homeTitle) ? [{ condition: 'data:view.isHomepage', markup: escapeXml(routeMap.get('/')?.title || config.seo.homeTitle) }] : []),
    ...routes.filter(route => route.title && route.path !== '/').map(route => ({
      condition: condition('data:blog.canonicalUrl', route.path) + (route.explicitTitle || !route.originalTitle ? '' : ' and data:view.title == ' + JSON.stringify(route.originalTitle)),
      markup: escapeXml(route.title),
    })),
  ], '<data:view.title.escaped/>');
  const legacy = values => values.length && config.seo.emitLegacyKeywords ? `<meta name='keywords' content='${escapeXml(values.join(', '))}'/>` : '';
  const keywords = conditionalMarkup([
    ...branches('data:blog.canonicalUrl', route => legacy(route.keywords), route => route.keywords.length > 0),
    ...(config.seo.homeKeywords.length ? [{ condition: 'data:view.isHomepage', markup: legacy(unique(config.seo.homeKeywords)) }] : []),
  ]);
  const noindex = '<meta name="robots" content="noindex,follow"/>';
  const index = '<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>';
  const robotsRoutes = new Map(config.seo.noindexPaths.map(path => [path, true]));
  for (const route of routes) if (route.noIndex !== undefined) robotsRoutes.set(route.path, route.noIndex);
  const robots = conditionalMarkup([
    { condition: 'data:view.isSearch or data:view.isArchive or data:view.isError', markup: noindex },
    ...[...robotsRoutes].map(([path, noIndex]) => ({ condition: condition('data:blog.canonicalUrl', path), markup: noIndex ? noindex : index })),
  ], index);
  const imageTags = expression => `<meta expr:content='${escapeXml(expression)}' property='og:image'/><meta expr:content='${escapeXml(expression)}' name='twitter:image'/>`;
  const images = conditionalMarkup([
    ...branches('data:blog.canonicalUrl', route => imageTags(JSON.stringify(route.imageUrl)), route => route.explicitImage),
    { condition: 'data:blog.postImageUrl', markup: imageTags('data:blog.postImageUrl') },
    ...branches('data:blog.canonicalUrl', route => imageTags(JSON.stringify(route.imageUrl)), route => Boolean(route.imageUrl) && !route.explicitImage),
  ], socialImage ? imageTags(JSON.stringify(socialImage)) : '');

  const owner = property => `<div${property ? ` itemprop='${property}'` : ''} itemscope='itemscope' itemtype='https://schema.org/Person'>
${meta('name', config.author)}<link itemprop='url' ${urlAttribute('href', config.links.about)}/>${meta('jobTitle', config.profile.role)}
${Object.values(config.links).filter(href => href.startsWith('https://') && new URL(href).pathname !== '/' && href !== config.links.portfolio).map(href => `<link itemprop='sameAs' href='${escapeXml(href)}'/>`).join('')}
</div>`;
  const site = `<!-- SEO/AEO/GEO: server-rendered identity; values match the visible owner and blog. -->
<div itemscope='itemscope' itemtype='https://schema.org/WebSite' expr:itemid='data:blog.homepageUrl + "#website"'>
${meta('name', 'data:blog.title', true)}<link itemprop='url' expr:href='data:blog.homepageUrl'/>${meta('inLanguage', config.seo.language)}
<div itemprop='hasPart' itemscope='itemscope' itemtype='https://schema.org/Blog' expr:itemid='data:blog.homepageUrl + "#blog"'>
${meta('name', 'data:blog.title', true)}<link itemprop='url' expr:href='data:blog.homepageUrl'/>${meta('inLanguage', config.seo.language)}${owner('publisher')}
</div></div>`;
  const breadcrumbs = `<!-- SEO: canonical Home/current-page breadcrumbs, with no extra visible navigation. -->
<b:if cond='data:view.isSingleItem and !data:view.isError'><div itemscope='itemscope' itemtype='https://schema.org/BreadcrumbList'>
<div itemprop='itemListElement' itemscope='itemscope' itemtype='https://schema.org/ListItem'>${meta('position', '1')}${meta('name', 'Home')}<link itemprop='item' expr:href='data:blog.homepageUrl'/></div>
<div itemprop='itemListElement' itemscope='itemscope' itemtype='https://schema.org/ListItem'>${meta('position', '2')}${meta('name', 'data:view.title', true)}<link itemprop='item' expr:href='data:blog.canonicalUrl'/></div>
</div></b:if>`;

  const scopedDescription = conditionalMarkup([
    { condition: 'data:view.description', markup: meta('description', 'data:view.description', true) },
    ...branches('data:post.url', route => meta('description', route.description), route => Boolean(route.description)),
  ], meta('description', 'snippet(data:post.body, {length: 160, links: false, linebreaks: false})', true));
  const scopedKeywords = conditionalMarkup(branches('data:post.url', route => route.keywords.map(keyword => meta('keywords', keyword)).join(''), route => route.keywords.length > 0),
    `<b:loop values='data:post.labels' var='keyword'>${meta('keywords', 'data:keyword.name', true)}</b:loop>`);
  const scopedImage = conditionalMarkup([
    ...branches('data:post.url', route => `<link itemprop='image' href='${escapeXml(route.imageUrl)}'/>`, route => route.explicitImage),
    { condition: 'data:post.featuredImage', markup: `<link itemprop='image' expr:href='data:post.featuredImage'/>` },
    ...branches('data:post.url', route => `<link itemprop='image' href='${escapeXml(route.imageUrl)}'/>`, route => Boolean(route.imageUrl) && !route.explicitImage),
    { condition: 'data:blog.postImageUrl', markup: `<link itemprop='image' expr:href='data:blog.postImageUrl'/>` },
  ]);
  const scopedCommon = `${scopedDescription}${scopedKeywords}${meta('inLanguage', config.seo.language)}<link itemprop='url' expr:href='data:post.url'/>`;
  const pageTypes = new Map([[config.links.about, 'AboutPage'], [config.links.contact, 'ContactPage']]);
  for (const route of routes) if (route.pageType) pageTypes.set(route.path, route.pageType);
  const pageSemantics = conditionalMarkup([...pageTypes].filter(([path]) => path.startsWith('/') && path.endsWith('.html')).map(([path, type]) => ({
    condition: condition('data:post.url', path), markup: meta('additionalType', 'https://schema.org/' + type) + (['AboutPage', 'ProfilePage', 'ContactPage'].includes(type) ? owner('mainEntity') : ''),
  })));
  return {
    routes,
    replacements: {
      SEO_TITLE: titles, DESCRIPTION_METADATA: descriptions, SEO_KEYWORDS: keywords, SEO_ROBOTS: robots, SOCIAL_IMAGES: images,
      SEO_SITE_ENTITIES: site + breadcrumbs,
      SEO_AUTHOR_LINK: `<link rel='author' ${urlAttribute('href', config.links.about)}/>`,
      SEO_COLLECTION: `${meta('name', 'data:view.title', true)}<link itemprop='url' expr:href='data:blog.canonicalUrl'/>${meta('inLanguage', config.seo.language)}`,
      SEO_ARTICLE: `<!-- SEO: native dates/labels remain correct for newly published Blogger posts. -->${scopedCommon}${scopedImage}
<b:if cond='data:post.date'>${meta('datePublished', 'data:post.date.iso8601', true)}</b:if>${meta('isAccessibleForFree', 'true')}
<b:loop values='data:post.labels' var='section'><b:if cond='data:section.name in ${escapeXml('{' + config.topics.map(topic => JSON.stringify(topic)).join(', ') + '}')}'>${meta('articleSection', 'data:section.name', true)}</b:if></b:loop>
${owner('publisher')}`,
      SEO_PAGE: `<!-- SEO: WebPage semantics; optional About/Contact subtype and owner details. -->${meta('name', 'data:post.title', true)}${scopedCommon}${pageSemantics}`,
      SEO_POST_AUTHOR: meta('jobTitle', config.profile.role),
    },
  };
}
