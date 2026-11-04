import fs from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve(import.meta.dirname, '../blogger/output');
const manifest = JSON.parse(await fs.readFile(path.join(output, 'media-manifest.json'), 'utf8'));
const entries = Object.entries(manifest);
const results = [];
for (let index = 0; index < entries.length; index += 4) {
  const batch = await Promise.allSettled(entries.slice(index, index + 4).map(async ([name, url]) => {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
    const type = response.headers.get('content-type') || '';
    return { name, url, status: response.status, contentType: type, ok: response.ok && type.startsWith('image/') };
  }));
  batch.forEach((result, offset) => results.push(result.status === 'fulfilled' ? result.value : { name: entries[index + offset][0], ok: false, error: String(result.reason) }));
}
await fs.writeFile(path.join(output, 'media-check.json'), JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
for (const result of results) console.log(`${result.ok ? 'OK' : 'FAIL'} ${result.name}: ${result.status || result.error}`);
if (results.some(result => !result.ok)) process.exitCode = 1;
