async (page) => {
  const context=await page.context().browser().newContext({javaScriptEnabled:false,viewport:{width:390,height:1000}});
  const p=await context.newPage(), results=[];
  for(const path of ['/','/2026/06/injection.html','/p/about.html']) {
    const response=await p.goto('https://ru5iru.blogspot.com'+path);
    results.push(await p.evaluate(({path,status})=>({path,status,title:document.title,h1:[...document.querySelectorAll('h1')].map(el=>el.textContent.trim()),articleText:document.querySelector('[data-article-body]')?.textContent.length,faqQuestions:document.querySelectorAll('[itemtype$="/Question"]').length,mainText:document.querySelector('main')?.textContent.length,description:document.querySelector('meta[name="description"]')?.content,overflow:document.documentElement.scrollWidth>innerWidth}),{path,status:response.status()}));
    if(path.includes('injection'))await p.screenshot({path:'output/playwright/seo-audit-2026-11-05-blogger-recheck/live-article-no-js-390.png',fullPage:true});
  }
  await context.close();return {javaScriptEnabled:false,results};
}
