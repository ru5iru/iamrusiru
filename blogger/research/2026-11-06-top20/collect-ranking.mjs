// Read-only research. Cite the pinned Tranco list and its authors.
import fs from 'node:fs/promises';
const dir = 'blogger/research/2026-11-06-top20';
await fs.mkdir(dir, { recursive: true });
const previous = await fs.readFile(dir + '/ranking-candidates.json', 'utf8').catch(() => '');
if (previous && JSON.parse(previous).source?.includes('majestic')) await fs.writeFile(dir + '/rejected-majestic-source.json', previous);
const idResponse = await fetch('https://tranco-list.eu/top-1m-id?subdomains=true', { signal: AbortSignal.timeout(45000) });
if (!idResponse.ok) throw new Error('Tranco list ID: ' + idResponse.status);
const listId = (await idResponse.text()).trim();
if (!/^[A-Z0-9]+$/.test(listId)) throw new Error('Unexpected Tranco list ID');
const url = `https://tranco-list.eu/download/${listId}/1000000`;
console.log(JSON.stringify({ listId, url }));
const response = await fetch(url, { signal: AbortSignal.timeout(180000) });
if (!response.ok) throw new Error('Ranking download: ' + response.status);
const decoder = new TextDecoder();
const reader = response.body.getReader();
let pending = '', scanned = 0, bytes = 0, complete = false;
const candidates = [];
while (candidates.length < 100) {
  const { done, value } = await reader.read();
  if (done) { complete = true; break; }
  bytes += value.byteLength;
  pending += decoder.decode(value, { stream: true });
  const lines = pending.split(/\r?\n/); pending = lines.pop();
  for (const line of lines) {
    if (!line.trim()) continue;
    scanned++;
    const values = line.split(',').map(value => value.replace(/^"|"$/g, ''));
    const [rank, domain] = values;
    if (/^[a-z0-9-]+\.blogspot\.com$/.test(domain)) candidates.push({ selectionOrder: candidates.length + 1, domain, globalRank: Number(rank) });
    if (candidates.length >= 100) break;
  }
}
await reader.cancel();
const data = { capturedAt: new Date().toISOString(), source: url, listId, sourcePage: 'https://tranco-list.eu/list/' + listId, methodology: 'https://tranco-list.eu/', citation: 'Le Pochat et al. (NDSS 2019), doi:10.14722/ndss.2019.23386', metric: 'Tranco aggregate popularity rank with subdomains; not visits, Google rankings, SEO quality or AI citations', filter: 'single-label *.blogspot.com hostnames; excludes aggregate blogspot.com and custom domains', downloadedBytes: bytes, scannedRows: scanned, fullFileDownloaded: complete, sourceHeaders: Object.fromEntries(response.headers), candidates };
await fs.writeFile(dir + '/ranking-candidates.json', JSON.stringify(data, null, 2));
console.log(JSON.stringify({ scannedRows: scanned, downloadedBytes: bytes, candidates: candidates.length, first30: candidates.slice(0, 30) }));
