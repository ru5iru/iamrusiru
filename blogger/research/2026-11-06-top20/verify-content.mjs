import fs from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';
const dir='blogger/research/2026-11-06-top20';
const current=JSON.parse(await fs.readFile(dir+'/current-theme-evidence.json','utf8'));
const {posts,pages}=JSON.parse(await fs.readFile('blogger/output/content.json','utf8'));
const clean = node => { const copy=node.cloneNode(true);copy.querySelectorAll('script,style,noscript').forEach(n=>n.remove());return copy.textContent.replace(/\s+/g,' ').trim(); };
const rows=[];
for(const post of posts){
  const live=current.live.find(page=>page.url.endsWith(post.path));
  const request=current.requests.find(record=>record.url===live.url);
  const doc=new JSDOM(await fs.readFile(request.rawFile,'utf8'),{virtualConsole:new VirtualConsole()}).window.document;
  const body=doc.querySelector('[data-article-body]');
  const expected=JSDOM.fragment(post.body);
  const prose=body.cloneNode(true);
  for(const section of prose.querySelectorAll('section'))if(/^(?:More from the blog|Sources and further reading|Frequently Asked Questions)$/i.test(section.querySelector('h2')?.textContent.trim()||''))section.remove();
  const paragraphs=[...prose.querySelectorAll('p')].map(p=>{const node=p.cloneNode(true);node.querySelectorAll('br').forEach(br=>br.replaceWith('\n'));return node.textContent;});
  rows.push({slug:post.slug,url:live.url,titleMatches:live.title===post.seo.title,liveTitle:live.title,preparedTitle:post.seo.title,bodyTextMatches:clean(body)===clean(expected),descriptionMatches:live.descriptions[0]===post.seo.description,keywordsMatch:post.seo.keywords.every(keyword=>live.structuredKeywords.includes(keyword)),faqMatches:live.faqCount===post.faq.length,placeholders:live.placeholders,literalListParagraphs:paragraphs.filter(text=>/(?:^|\n)\s*(?:[-*]\s|\d+\.\s)/.test(text)).length,literalTableParagraphs:paragraphs.filter(text=>/^\s*\|/.test(text)&&/\|\s*:?-{3,}/.test(text)).length,proseSemanticLists:prose.querySelectorAll('ul,ol').length,semanticTables:prose.querySelectorAll('table').length,proseInternalLinks:[...prose.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href').startsWith('/')||a.href.startsWith(current.origin+'/')).length});
}
const policy=[];
for(const page of pages.filter(page=>['privacy-policy','cookie-policy'].includes(page.slug))){
 const record=current.requests.find(record=>record.url.endsWith(page.path));
 const doc=new JSDOM(await fs.readFile(record.rawFile,'utf8'),{virtualConsole:new VirtualConsole()}).window.document;
 policy.push({slug:page.slug,url:record.url,mentionsOtherDomain:clean(doc.querySelector('.page-body')).includes('iamrusiru.com')});
}
const result={capturedAt:new Date().toISOString(),postCount:rows.length,exactBodyTextMatches:rows.filter(row=>row.bodyTextMatches).length,titleMismatches:rows.filter(row=>!row.titleMatches).length,descriptionMatches:rows.filter(row=>row.descriptionMatches).length,keywordMatches:rows.filter(row=>row.keywordsMatch).length,faqMatchPosts:rows.filter(row=>row.faqMatches).length,postsWithLiteralLists:rows.filter(row=>row.literalListParagraphs).length,postsWithLiteralTables:rows.filter(row=>row.literalTableParagraphs).length,rows,policy};
await fs.writeFile(dir+'/content-verification.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,rows:rows.filter(row=>!row.titleMatches||row.literalTableParagraphs||row.literalListParagraphs).map(({slug,titleMatches,literalListParagraphs,literalTableParagraphs,proseSemanticLists})=>({slug,titleMatches,literalListParagraphs,literalTableParagraphs,proseSemanticLists}))}));
