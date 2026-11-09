const BLOGGER_NAMESPACE = 'http://www.google.com/2005/gml/b';
const EXPRESSION_NAMESPACE = 'http://www.google.com/2005/gml/expr';

export const escapeXml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[character]));

// Keep content in XML text/attributes, rather than interpolating prose into
// Blogger's expression language. A native branch chain avoids nested ternaries.
export function conditionalMarkup(branches, fallback = '') {
  if (!branches.length) return fallback;
  return branches.map(({ condition, markup }, index) =>
    (index === 0 ? `<b:if cond='${escapeXml(condition)}'>` : `<b:elseif cond='${escapeXml(condition)}'/>`) + '\n' + markup
  ).join('\n') + '\n<b:else/>\n' + fallback + '\n</b:if>';
}

export function routeCondition(urlExpression, route) {
  if (!/^data:(?:blog\.canonicalUrl|post\.url)$/.test(urlExpression)) throw new Error('Unexpected route URL expression');
  if (!/^\/[a-zA-Z0-9/_-]+\.html$/.test(route)) throw new Error('Unsafe Blogger route: ' + route);
  // Keep both operands URL-typed. Concatenating a native URL with text is not
  // equivalent to JavaScript string concatenation in Blogger's compiler.
  // path() also follows the destination blog's custom domain automatically.
  return `${urlExpression} == path(data:blog.homepageUrl, "${route}")`;
}

export function descriptionMetadata(value, { expression = false } = {}) {
  const attribute = expression ? 'expr:content' : 'content';
  const content = escapeXml(value);
  return [
    `<meta ${attribute}='${content}' name='description'/>`,
    `<meta ${attribute}='${content}' property='og:description'/>`,
    `<meta ${attribute}='${content}' name='twitter:description'/>`,
  ].join('\n');
}

// Conservative allow-list for Label settings emitted by this exporter. XML
// parsing cannot catch a gadget enum rejected by Blogger during theme restore.
export function validateBloggerWidgetSettings(document) {
  const labelSettings = new Map([
    ['sorting', new Set(['ALPHA'])],
    ['display', new Set(['LIST', 'CLOUD'])],
    ['showFreqNumbers', new Set(['true', 'false'])],
  ]);
  for (const widget of document.getElementsByTagNameNS(BLOGGER_NAMESPACE, 'widget')) {
    if (widget.getAttribute('type') !== 'Label') continue;
    for (const setting of widget.getElementsByTagNameNS(BLOGGER_NAMESPACE, 'widget-setting')) {
      const name = setting.getAttribute('name');
      if (!labelSettings.get(name)?.has(setting.textContent.trim())) {
        throw new Error(`${widget.id}: unsupported exported Label setting ${name}=${setting.textContent.trim()}`);
      }
    }
  }
}

// This is a conservative generation rule, not a replacement for Google's
// compiler. The old JS-based preview accepted chains rejected by Blogger.
export function validateBloggerExpressions(document) {
  for (const element of document.getElementsByTagName('*')) {
    for (const attribute of element.attributes) {
      const isExpression = attribute.namespaceURI === EXPRESSION_NAMESPACE ||
        (element.namespaceURI === BLOGGER_NAMESPACE && ['cond', 'expr', 'value', 'values'].includes(attribute.name));
      if (!isExpression) continue;
      const withoutStrings = attribute.value.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
      // Only functions actually used and supported by this template are allowed.
      // Never silently invent a Blogger function in the JavaScript preview.
      const supportedFunctions = new Set(['snippet', 'resizeImage', 'sourceSet', 'path']);
      for (const call of withoutStrings.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g)) {
        if (!supportedFunctions.has(call[1])) throw new Error(`${element.nodeName} ${attribute.name}: unsupported Blogger template function ${call[1]}`);
      }
      if ((withoutStrings.match(/\?/g) || []).length > 1) {
        throw new Error(`${element.nodeName} ${attribute.name}: generate native b:if/b:elseif branches instead of chained conditional expressions`);
      }
    }
  }
}
