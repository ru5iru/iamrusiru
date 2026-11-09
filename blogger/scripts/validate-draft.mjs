// Local publishing-packet lint only: no uploads, network requests or file writes.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

export function validateDraft(meta, html, config) {
  const errors = [], warnings = [];
  const fail = message => errors.push(message);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const normal = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const https = value => {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
    catch { return false; }
  };
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return { ok: false, errors: ['publishing.json must be an object'], warnings };
  if (!['post', 'page'].includes(meta.kind)) fail('kind must be post or page');
  for (const key of ['title', 'searchDescription', 'author', 'slug', 'primaryPhrase']) if (!text(meta[key])) fail(key + ' must be nonempty text');
  if (meta.existingUrl === null && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug || '')) fail('New slug must use lowercase words/digits separated by hyphens');
  if (meta.bodyFile !== 'body.html') fail('bodyFile must be body.html');
  for (const key of ['labels', 'supportingPhrases', 'faq', 'sources', 'internalLinks', 'reviewNotes']) if (!Array.isArray(meta[key])) fail(key + ' must be an array');
  for (const key of ['labels', 'supportingPhrases', 'reviewNotes']) if (Array.isArray(meta[key]) && meta[key].some(value => !text(value))) fail(key + ' entries must be nonempty text');
  if (Array.isArray(meta.labels) && new Set(meta.labels).size !== meta.labels.length) fail('Labels must not be duplicated');
  if (meta.kind === 'post') {
    if (!config.topics?.includes(meta.topic)) fail('Post topic must match an active configured topic');
    if (!Array.isArray(meta.labels) || !meta.labels.includes(meta.topic)) fail('Post Labels must include the selected topic');
  }
  if (meta.kind === 'page' && (meta.topic !== null || meta.labels?.length !== 0)) fail('Pages use topic: null and labels: []');
  if (meta.existingUrl !== null && !https(meta.existingUrl)) fail('existingUrl must be an actual HTTPS URL or null');
  if (https(meta.existingUrl)) {
    const url = new URL(meta.existingUrl);
    const existingSlug = decodeURIComponent(path.posix.basename(url.pathname).replace(/\.html$/, ''));
    if (existingSlug !== meta.slug) fail('Retain the slug from the existing published URL');
    if (url.origin !== new URL(config.blogUrl).origin) warnings.push('Existing URL belongs to another origin; verify the selected blog/configuration');
  }
  if (meta.publicationDate !== null) {
    const value = meta.publicationDate;
    const day = text(value) && /^\d{4}-\d{2}-\d{2}(?:T\S+)?$/.test(value) ? value.slice(0, 10) : '';
    const calendar = day ? new Date(day + 'T00:00:00Z') : null;
    if (!calendar || !Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== day || !Number.isFinite(Date.parse(value))) fail('publicationDate must be a valid ISO calendar date/timestamp or null');
  }
  if (meta.imageBrief !== null && !text(meta.imageBrief)) fail('imageBrief must be text or null');
  if (text(meta.searchDescription) && meta.searchDescription.length > 150) warnings.push('Search description exceeds 150 characters; check the native field and edit for clarity');

  const doc = new JSDOM(html, { virtualConsole: new VirtualConsole() }).window.document;
  if (!doc.body.textContent.trim()) fail('Article/Page body needs readable content');
  if (/<!doctype|<\/?(?:html|head|body)(?:\s|>)/i.test(html)) fail('Supply body-only HTML without a document shell');
  if (doc.querySelector('h1, title, style, script, .post-content')) fail('Body must not duplicate H1, document metadata, scripts, CSS or the theme content wrapper');
  if (doc.querySelector('meta[name], meta[property], link[rel="canonical"]')) fail('Set native metadata fields instead of inserting head metadata in the body');
  if (/<\/?(?:b|data|expr):/i.test(html)) fail('Blogger template expressions do not belong in saved post bodies');
  for (const element of doc.body.querySelectorAll('*')) {
    for (const attr of element.attributes) if (/^on/i.test(attr.name)) fail('Inline event handler is not permitted: ' + attr.name);
  }
  const ids = [...doc.body.querySelectorAll('[id]')].map(node => node.id);
  if (new Set(ids).size !== ids.length) fail('Body heading/element IDs must be unique');
  const prose = doc.body.cloneNode(true);
  prose.querySelectorAll('pre,code').forEach(node => node.remove());
  if (/\[(?:SOURCE|INTERNAL LINK):|YOUR_BLOGGER_IMAGE_URL|REPLACE_WITH_PRIMARY_SOURCE_URL|Replace this with|Write your introduction here/i.test(prose.textContent + prose.innerHTML)) fail('Unresolved authoring/source/image placeholder remains');
  for (const p of prose.querySelectorAll('p')) {
    p.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    if (/(?:^|\n)\s*(?:[-*+]\s|\d+[.)]\s)/.test(p.textContent)) fail('Use semantic list elements instead of Markdown list lines in paragraphs');
    if (/^\s*\|/.test(p.textContent) && /\|\s*:?-{3,}/.test(p.textContent)) fail('Use a semantic table instead of a pipe-delimited Markdown table');
  }
  for (const table of doc.querySelectorAll('table')) {
    if (!table.querySelector('th[scope], th[id]')) fail('Data tables need associated header cells (scope or id/headers)');
  }
  for (const image of doc.querySelectorAll('img')) {
    if (!https(image.getAttribute('src'))) fail('Images need actual public HTTPS src URLs');
    if (!image.hasAttribute('alt')) fail('Every image needs alt, including empty alt for a redundant image');
    if (!(Number(image.getAttribute('width')) > 0 && Number(image.getAttribute('height')) > 0)) fail('Images need positive intrinsic width and height');
    if (image.hasAttribute('srcset') && !image.hasAttribute('sizes')) warnings.push('Review srcset: width descriptors need an accurate sizes value');
  }
  if (meta.cover !== null) {
    if (!meta.cover || !https(meta.cover.url) || typeof meta.cover.alt !== 'string' || !Number.isInteger(meta.cover.width) || !Number.isInteger(meta.cover.height) || meta.cover.width <= 0 || meta.cover.height <= 0) fail('cover must contain a real HTTPS URL, alt and actual positive integer dimensions, or be null');
    else {
      const image = [...doc.querySelectorAll('img')].find(image => image.getAttribute('src') === meta.cover.url);
      if (!image || image.getAttribute('alt') !== meta.cover.alt || Number(image.getAttribute('width')) !== meta.cover.width || Number(image.getAttribute('height')) !== meta.cover.height) fail('Cover metadata must match its visible image element');
      if (image?.getAttribute('loading') === 'lazy') warnings.push('Main cover is lazy-loaded; review early discovery');
    }
  } else if (meta.imageBrief) warnings.push('Cover brief supplied; image creation/upload is still a publishing task');

  const links = [...doc.querySelectorAll('a[href]')].map(link => link.getAttribute('href'));
  for (const href of links) if (!/^(?:https:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(href)) fail('Unsupported/unsafe link destination: ' + href);
  for (const href of Array.isArray(meta.internalLinks) ? meta.internalLinks : []) {
    const relative = typeof href === 'string' && /^\/(?!\/)/.test(href);
    if (!relative && !(https(href) && new URL(href).origin === new URL(config.blogUrl).origin)) fail('internalLinks must be root-relative or same-blog HTTPS URLs');
    if (!links.includes(href)) fail('Declared internal link missing from body: ' + href);
  }
  for (const source of Array.isArray(meta.sources) ? meta.sources : []) {
    if (!source || !text(source.title) || !https(source.url) || !text(source.supports) || !text(source.verification)) fail('Sources need title, HTTPS URL, supports and actual verification notes');
    else if (!links.includes(source.url)) fail('Declared source missing from body: ' + source.url);
  }
  const questions = [...doc.querySelectorAll('[itemtype="https://schema.org/Question"]')];
  const faq = Array.isArray(meta.faq) ? meta.faq : [];
  if (questions.length !== faq.length) fail('FAQ count differs between publishing.json and visible microdata');
  const pairs = [];
  for (const [index, entry] of faq.entries()) {
    if (!entry || !text(entry.question) || !text(entry.answer)) { fail('FAQ entries need plain-text question and answer'); continue; }
    pairs.push(normal(entry.question));
    const question = questions[index];
    if (!question || normal(question.querySelector('[itemprop="name"]')?.textContent) !== normal(entry.question) || normal(question.querySelector('[itemprop="acceptedAnswer"] [itemprop="text"]')?.textContent) !== normal(entry.answer)) fail('Visible FAQ question/answer differs from metadata at entry ' + (index + 1));
    if (!question?.closest('[itemtype="https://schema.org/FAQPage"]')) fail('FAQ Question needs a containing FAQPage section');
    if (question?.closest('[hidden],[aria-hidden="true"]') || question?.querySelector('[itemprop="acceptedAnswer"]')?.closest('[hidden],[aria-hidden="true"]')) fail('FAQ questions and answers must be visible');
  }
  if (new Set(pairs).size !== pairs.length) fail('FAQ questions are duplicated');
  return { ok: errors.length === 0, errors: [...new Set(errors)], warnings: [...new Set(warnings)], searchDescriptionCharacters: meta.searchDescription?.length || 0, scope: 'Local syntax/field consistency only; not factual review, network verification, Blogger compilation or indexing' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log('Usage: node blogger/scripts/validate-draft.mjs DRAFT_DIRECTORY [--config blogger/config.json]');
    if (!args.length) process.exitCode = 1;
  } else {
    try {
      if (!(args.length === 1 || (args.length === 3 && args[1] === '--config'))) throw new Error('Use DRAFT_DIRECTORY [--config FILE]');
      const folder = path.resolve(args[0]);
      const [meta, html, config] = await Promise.all([
        fs.readFile(path.join(folder, 'publishing.json'), 'utf8').then(JSON.parse),
        fs.readFile(path.join(folder, 'body.html'), 'utf8'),
        fs.readFile(path.resolve(args[2] || 'blogger/config.json'), 'utf8').then(JSON.parse),
      ]);
      if (!(await fs.readFile(path.join(folder, 'publish.md'), 'utf8')).trim()) throw new Error('publish.md must contain the field summary and publishing instructions');
      const report = validateDraft(meta, html, config);
      console.log(JSON.stringify(report, null, 2));
      if (!report.ok) process.exitCode = 1;
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
