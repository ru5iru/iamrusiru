// Public HTML only: no logins, scripts, redirects via JavaScript, downloads or images.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { analyzeHtml as extract } from './analyze-html.mjs';
const dir = 'blogger/research/2026-11-06-top20';
const raw = 'output/playwright/blogspot-top20-2026-11-06';
await fs.mkdir(raw, { recursive: true });
const ranking = JSON.parse(await fs.readFile(dir + '/ranking-candidates.json', 'utf8'));
let requests = await fs.readFile(raw + '/requests.json', 'utf8').then(JSON.parse).catch(() => []);
const save = () => fs.writeFile(raw + '/requests.json', JSON.stringify(requests, null, 2));
async function get(url, purpose) {
  const cached = requests.find(record => record.url === url && record.purpose === purpose);
  if (cached) return { ...cached, text: cached.file ? await fs.readFile(raw + '/' + cached.file, 'utf8') : '' };
  const record = { url, purpose, capturedAt: new Date().toISOString() };
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'BloggerPeerResearch/1.0 (public HTML benchmark)' }, signal: AbortSignal.timeout(30000) });
    Object.assign(record, { status: response.status, finalUrl: response.url, headers: Object.fromEntries(response.headers) });
    const bytes = Buffer.from(await response.arrayBuffer());
    record.bytes = bytes.length;
    record.sha256 = createHash('sha256').update(bytes).digest('hex');
    record.file = createHash('sha256').update(url).digest('hex').slice(0, 18) + '.txt';
    await fs.writeFile(raw + '/' + record.file, bytes);
  } catch (error) { record.error = error.message; }
  requests.push(record); await save();
  return { ...record, text: record.file ? await fs.readFile(raw + '/' + record.file, 'utf8') : '' };
}
function allowed(robots, urlPath) {
  const groups = []; let group = { agents: [], rules: [] }, rulesStarted = false;
  for (const line of robots.split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').match(/^\s*(user-agent|allow|disallow)\s*:\s*(.*?)\s*$/i);
    if (!match) continue;
    if (match[1].toLowerCase() === 'user-agent') {
      if (rulesStarted) { groups.push(group); group = { agents: [], rules: [] }; rulesStarted = false; }
      group.agents.push(match[2].toLowerCase());
    } else { group.rules.push({ allow: match[1].toLowerCase() === 'allow', value: match[2] }); rulesStarted = true; }
  }
  groups.push(group);
  const exact = groups.filter(group => group.agents.some(agent => agent !== '*' && 'bloggerpeerresearch'.includes(agent)));
  const rules = (exact.length ? exact : groups.filter(group => group.agents.includes('*'))).flatMap(group => group.rules).filter(rule => rule.value);
  const matches = rules.filter(rule => {
    const pattern = rule.value.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$');
    return new RegExp('^' + pattern).test(urlPath);
  }).sort((a,b) => b.value.length - a.value.length || Number(b.allow) - Number(a.allow));
  return !matches.length || matches[0].allow;
}
const selected = [], ledger = [];
for (const candidate of ranking.candidates) {
  if (selected.length === 20) break;
  const origin = 'https://' + candidate.domain;
  const robots = await get(origin + '/robots.txt', 'robots');
  const home = await get(origin + '/', 'home');
  const row = { ...candidate, homeStatus: home.status, finalUrl: home.finalUrl };
  const skip = reason => { ledger.push({ ...row, selected: false, reason }); console.log(JSON.stringify({ domain: candidate.domain, skip: reason })); };
  if (home.status !== 200 || !/text\/html/.test(home.headers?.['content-type'] || '')) { skip('Unavailable/non-HTML home'); continue; }
  if (!new URL(home.finalUrl).hostname.endsWith('.blogspot.com')) { skip('Redirected away from Blogspot'); continue; }
  if (/blogger\.com\/blogin|adult-content|content warning|sensitive content/i.test(home.text.slice(0, 50000)) && !/class=['"][^'"]*post-body/.test(home.text)) { skip('Age/content gate; no bypass attempted'); continue; }
  if (robots.status === 200 && !allowed(robots.text, '/')) { skip('Wildcard research crawler disallowed'); continue; }
  const h = extract(home);
  if (!h.bloggerFootprint || !h.postLinks.length) { skip('No auditable Blogger post permalink in home'); continue; }
  const articleUrl = h.postLinks.find(url => robots.status !== 200 || allowed(robots.text, new URL(url).pathname));
  if (!articleUrl) { skip('Discovered posts disallowed by robots'); continue; }
  const article = await get(articleUrl, 'article');
  if (article.status !== 200 || !/text\/html/.test(article.headers?.['content-type'] || '')) { skip('Sample post unavailable'); continue; }
  const a = extract(article);
  if (!a.bodyChars || new URL(a.finalUrl).hostname !== new URL(h.finalUrl).hostname) { skip('No readable same-blog article body'); continue; }
  const sitemap = await get(origin + '/sitemap.xml', 'sitemap');
  const aboutUrl = h.aboutLinks.find(url => { try { return new URL(url).hostname === new URL(h.finalUrl).hostname && /\/p\//.test(url) && (robots.status !== 200 || allowed(robots.text, new URL(url).pathname)); } catch { return false; } });
  const about = aboutUrl ? await get(aboutUrl, 'about') : null;
  const site = { id: 'B' + String(selected.length + 1).padStart(2, '0'), ...candidate, home: h, article: a,
    robots: { status: robots.status, text: robots.text, source: robots.url },
    sitemap: { status: sitemap.status, locCount: (sitemap.text.match(/<loc>/g) || []).length, source: sitemap.url },
    about: about && about.status === 200 ? extract(about) : null };
  selected.push(site); ledger.push({ ...row, selected: true, id: site.id, articleUrl });
  await fs.writeFile(dir + '/peer-evidence.json', JSON.stringify({ capturedAt: new Date().toISOString(), ranking: { listId: ranking.listId, sourcePage: ranking.sourcePage }, scope: 'First 20 publicly auditable native Blogspot publications in ascending Tranco rank; ranking is not SEO/AI success', sites: selected, selectionLedger: ledger }, null, 2));
  console.log(JSON.stringify({ selected: site.id, domain: candidate.domain, rank: candidate.globalRank, title: h.title.slice(0, 80), bodyChars: a.bodyChars }));
}
await fs.writeFile(dir + '/request-manifest.json', JSON.stringify(requests.map(({ file, ...record }) => ({ ...record, rawFile: file && raw + '/' + file })), null, 2));
console.log(JSON.stringify({ selected: selected.length, considered: ledger.length, requests: requests.length }));
if (selected.length !== 20) process.exitCode = 2;
