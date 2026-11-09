// Additional finite probes; never execute peer scripts or interact with gates.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { analyzeHtml } from './analyze-html.mjs';
const dir = 'blogger/research/2026-11-06-top20';
const raw = 'output/playwright/blogspot-top20-2026-11-06';
const peers = JSON.parse(await fs.readFile(dir + '/peer-evidence.json', 'utf8'));
let records = await fs.readFile(raw + '/extras.json', 'utf8').then(JSON.parse).catch(() => []);
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < peers.sites.length) {
    const site = peers.sites[cursor++], origin = 'https://' + site.domain;
    site.extra = {};
    for (const [kind, url] of [['pageSitemap', origin + '/sitemap-pages.xml'], ['llms', origin + '/llms.txt'], ['mobile', site.article.url + '?m=1']]) {
      let record = records.find(record => record.url === url);
      if (!record) {
        record = { url, kind, capturedAt: new Date().toISOString() };
        try {
          const response = await fetch(url, { headers: { 'User-Agent': 'BloggerPeerResearch/1.0' }, signal: AbortSignal.timeout(20000) });
          const text = await response.text();
          Object.assign(record, { status: response.status, finalUrl: response.url, headers: Object.fromEntries(response.headers), bytes: Buffer.byteLength(text), file: 'extra-' + createHash('sha256').update(url).digest('hex').slice(0,18) + '.txt' });
          await fs.writeFile(raw + '/' + record.file, text);
        } catch (error) { record.error = error.message; }
        records.push(record); await fs.writeFile(raw + '/extras.json', JSON.stringify(records, null, 2));
      }
      const text = record.file ? await fs.readFile(raw + '/' + record.file, 'utf8') : '';
      site.extra[kind] = { status: record.status, url, finalUrl: record.finalUrl, contentType: record.headers?.['content-type'] || '', locCount: (text.match(/<loc>/g)||[]).length };
      if (kind === 'llms') site.extra[kind].textFile = record.status === 200 && !/<(?:html|!doctype)/i.test(text) && /text\/(?:plain|markdown)/i.test(record.headers?.['content-type'] || '');
      if (kind === 'mobile' && record.status === 200) { const page = analyzeHtml({ ...record, text }); site.extra[kind].canonical = page.canonical; site.extra[kind].robots = page.robots; }
    }
    console.log(JSON.stringify({ site: site.id, pageSitemap: site.extra.pageSitemap.status, llms: site.extra.llms.textFile, mobile: site.extra.mobile.status }));
  }
}));
await fs.writeFile(dir + '/peer-evidence.json', JSON.stringify(peers, null, 2));
await fs.writeFile(dir + '/extra-request-manifest.json', JSON.stringify(records.map(({file,...record})=>({...record,rawFile:file&&raw+'/'+file})), null, 2));
