// Refresh derived fields from retained HTML, without more network requests.
import fs from 'node:fs/promises';
import { renderPreview } from '../../../scripts/lib/blogger-preview.mjs';
import { analyzeHtml } from './analyze-html.mjs';
const dir = 'blogger/research/2026-11-06-top20';
const raw = 'output/playwright/blogspot-top20-2026-11-06';
const peers = JSON.parse(await fs.readFile(dir + '/peer-evidence.json', 'utf8'));
const requests = JSON.parse(await fs.readFile(raw + '/requests.json','utf8'));
for (const site of peers.sites) for (const kind of ['home','article','about']) {
  if (!site[kind]) continue;
  const record = requests.find(record => record.url === site[kind].url && record.purpose === kind);
  if (!record) throw new Error('Missing raw peer response ' + site.id + ' ' + kind);
  site[kind] = analyzeHtml({ ...record, text: await fs.readFile(raw + '/' + record.file, 'utf8') });
}
await fs.writeFile(dir + '/peer-evidence.json', JSON.stringify(peers,null,2));
const current = JSON.parse(await fs.readFile(dir + '/current-theme-evidence.json','utf8'));
for (const [i, page] of current.live.entries()) {
  const record = current.requests.find(record => record.url === page.url);
  current.live[i] = { ...analyzeHtml({ ...record,text:await fs.readFile(record.rawFile,'utf8') }),routeKind:page.routeKind };
}
const { config, posts, pages } = JSON.parse(await fs.readFile('blogger/output/content.json','utf8'));
const template = await fs.readFile('blogger/output/iamrusiru-blogger.xml','utf8');
const media = new Map(Object.entries(JSON.parse(await fs.readFile('blogger/output/media-manifest.json','utf8'))));
for (const [i,page] of current.local.entries()) {
  const post = [...posts,...pages].find(post => config.blogUrl+post.path===page.url) || posts[0];
  const text = renderPreview(template,{config,posts,media,kind:page.routeKind,post,localAssets:false,genericViewDescription:true});
  current.local[i] = {...analyzeHtml({url:page.url,finalUrl:page.url,status:200,headers:{},text,bytes:Buffer.byteLength(text),capturedAt:page.capturedAt}),routeKind:page.routeKind,source:page.source,bodySha256:page.bodySha256};
}
await fs.writeFile(dir+'/current-theme-evidence.json',JSON.stringify(current,null,2));
console.log(JSON.stringify({peers:peers.sites.length,currentLive:current.live.length,currentLocal:current.local.length,livePlaceholders:current.live.reduce((n,p)=>n+p.placeholders,0),localPlaceholders:current.local.reduce((n,p)=>n+p.placeholders,0)}));
