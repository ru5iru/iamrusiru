import fs from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';
const origin='https://ru5iru.blogspot.com';
const paths=['/?m=1','/2026/06/injection.html?m=1','/p/about.html?m=1','/search?q=Drupal','/search/label/Engineering','/2026/06/','/research-missing-20261106.html'];
const results=[];
for(const path of paths){
 const response=await fetch(origin+path,{headers:{'User-Agent':'BloggerPeerResearch/1.0'},signal:AbortSignal.timeout(30000)});
 const html=await response.text();
 const doc=new JSDOM(html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,''),{virtualConsole:new VirtualConsole()}).window.document;
 results.push({url:origin+path,status:response.status,canonical:[...doc.querySelectorAll('link[rel="canonical"]')].map(n=>n.href),title:doc.title,mainHeadings:[...doc.querySelectorAll('main h1')].map(n=>n.textContent.trim()),robots:doc.querySelector('meta[name="robots"]')?.content||'',xRobots:response.headers.get('x-robots-tag')||'',buildId:doc.querySelector('meta[name="blogger-theme-build"]')?.content||''});
}
await fs.writeFile('blogger/research/2026-11-06-top20/current-variants.json',JSON.stringify({capturedAt:new Date().toISOString(),scope:'Fresh public Blogger variants, no private editor or browser interaction',results},null,2));
console.log(JSON.stringify(results));
