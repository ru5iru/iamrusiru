import { escapeXml } from './blogger-markup.mjs';

// Public variants are opt-in. A local generated file is not a hosted URL.
export function validateResponsiveImages(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('responsiveImages must map source filenames to hosted variants');
  for (const [name, variants] of Object.entries(value)) {
    if (!/^[\w.-]+$/.test(name) || !Array.isArray(variants) || variants.length < 2) throw new Error('responsiveImages.' + name + ' needs at least two variants');
    let previous = 0;
    for (const variant of variants) {
      if (!variant || Object.keys(variant).some(key => !['width', 'url'].includes(key)) || !Number.isInteger(variant.width) || variant.width <= previous || variant.width > 4096) throw new Error('Responsive widths must be unique, increasing integers up to 4096');
      const url = new URL(variant.url);
      if (url.protocol !== 'https:' || url.username || url.password || /[\s,]/.test(variant.url)) throw new Error('Responsive image URLs must be public HTTPS URLs with encoded spaces/commas');
      previous = variant.width;
    }
    if (new Set(variants.map(variant => variant.url)).size !== variants.length) throw new Error('Each responsive width needs a different image URL');
  }
  return value;
}

export const imageSizes = {
  cover: '(min-width: 1152px) 800px, (min-width: 1024px) calc(100vw - 352px), calc(100vw - 48px)',
  card: '(min-width: 768px) 192px, 160px',
  related: '48px',
};
export function responsiveAttributes(variants, role = 'cover') {
  if (!variants?.length) return '';
  return ` srcset="${escapeXml(variants.map(({ url, width }) => url + ' ' + width + 'w').join(', '))}" sizes="${escapeXml(imageSizes[role])}"`;
}

// Preview approximation only. Blogger itself evaluates sourceSet/resizeImage.
export function googleImageVariant(value, width) {
  const url = String(value);
  if (!/^https:\/\/(?:[\w-]+\.googleusercontent\.com|[1-4]\.bp\.blogspot\.com)\//.test(url)) return '';
  if (/=[sw]\d+[^/]*$/.test(url)) return url.replace(/=[sw]\d+[^/]*$/, '=w' + width);
  if (/\/[sw]\d+(?:-[\w-]+)?\//.test(url)) return url.replace(/\/[sw]\d+(?:-[\w-]+)?\//, '/w' + width + '/');
  return '';
}
