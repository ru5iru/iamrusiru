// Verify actual public image bytes before enabling srcset in a reusable theme.
// Use --map FILE for opaque Blogger URLs, or --base-url HTTPS_DIRECTORY.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { validateResponsiveImages } from './lib/blogger-images.mjs';
const args = process.argv.slice(2);
if (args.length % 2 || args.some((value, index) => index % 2 === 0 && !['--map', '--base-url', '--config'].includes(value))) throw new Error('Use --map hosted-images.json OR --base-url https://your-host/images/, plus optional --config');
const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, index) => [args[index * 2], args[index * 2 + 1]]));
if (Boolean(options['--map']) === Boolean(options['--base-url'])) throw new Error('Supply exactly one of --map or --base-url');
const configFile = path.resolve(options['--config'] || 'blogger/config.json');
const config = JSON.parse(await fs.readFile(configFile, 'utf8'));
let input;
if (options['--base-url']) {
  const base = new URL(options['--base-url']);
  if (base.protocol !== 'https:' || base.search || base.hash || base.username || base.password) throw new Error('Use an HTTPS image directory without query, fragment or credentials');
  base.pathname = base.pathname.replace(/\/?$/, '/');
  const plan = JSON.parse(await fs.readFile('blogger/output/responsive-image-plan.json', 'utf8'));
  input = Object.fromEntries(plan.images.map(image => [image.source, image.variants.map(variant => ({ width: variant.width, url: new URL(path.basename(variant.file), base).href }))]));
} else input = JSON.parse(await fs.readFile(path.resolve(options['--map']), 'utf8'));
const mappings = validateResponsiveImages(input);
if (!Object.keys(mappings).length) throw new Error('Image map is empty');
const results = [];
for (const [source, variants] of Object.entries(mappings)) {
  for (const variant of variants) {
    const response = await fetch(variant.url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'BloggerImageVerification/1.0' } });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Public image unavailable: ' + variant.url);
    if (Number(response.headers.get('content-length')) > 20000000) throw new Error('Image exceeds 20 MB: ' + variant.url);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 20000000) throw new Error('Image exceeds 20 MB: ' + variant.url);
    const info = await sharp(bytes).metadata();
    if (info.width !== variant.width) throw new Error(`Width mismatch: ${variant.url}; expected ${variant.width}, received ${info.width}`);
    results.push({ source, ...variant, height: info.height, bytes: bytes.length, status: response.status });
    console.log('Verified ' + source + ': ' + info.width + 'px, ' + bytes.length + ' bytes');
  }
}
// No config mutation occurs unless every image has passed.
config.responsiveImages = { ...(config.responsiveImages || {}), ...mappings };
await fs.writeFile(configFile, JSON.stringify(config, null, 2) + '\n');
const evidence = path.resolve('blogger/output/verification');
await fs.mkdir(evidence, { recursive: true });
await fs.writeFile(path.join(evidence, 'hosted-images.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), results }, null, 2) + '\n');
console.log('Activated ' + Object.keys(mappings).length + ' image mappings. Rebuild the Blogger package before publishing.');
