async (page) => {
  const results = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const contrast = () => {
    const parse = s => { const m=s.match(/[\d.]+/g); return m ? m.map(Number) : [0,0,0,0]; };
    const blend = (fg,bg) => {const a=fg[3]??1; return fg.slice(0,3).map((n,i)=>n*a+bg[i]*(1-a));};
    const lum = rgb => rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const failures=[], seen=new Set(); let tested=0, skipped=0;
    for(const el of document.querySelectorAll('h1,h2,h3,p,a,button,label,span,li,code')) {
      if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||!el.getClientRects().length)continue;
      const cs=getComputedStyle(el); const chain=[];let complex=false;
      for(let node=el;node;node=node.parentElement){const c=getComputedStyle(node); if(Number(c.opacity)<1||c.backgroundImage!=='none')complex=true;chain.unshift(c);}
      if(complex){skipped++;continue;}
      let bg=[255,255,255];for(const c of chain)bg=blend(parse(c.backgroundColor),bg);
      const fg=blend(parse(cs.color),bg), a=lum(fg), b=lum(bg), ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      const size=parseFloat(cs.fontSize), weight=parseInt(cs.fontWeight)||400, large=size>=24||(size>=18.667&&weight>=700), required=large?3:4.5;
      tested++; const text=el.textContent.trim().replace(/\s+/g,' ').slice(0,100), key=text+cs.color+bg;
      if(ratio+.01<required&&!seen.has(key)){seen.add(key);failures.push({text,tag:el.tagName,class:el.className,ratio:+ratio.toFixed(2),required,fontSize:size,weight,foreground:cs.color,background:bg.map(Math.round)});}
    }
    return {tested,skipped,failures};
  };
  for(const width of [1440,768,390]) {
    await page.setViewportSize({width,height:1000});
    for(const [name,path] of Object.entries({home:'/',article:'/2026/06/injection.html',about:'/p/about.html',contact:'/p/contact.html'})) {
      const startErrors=errors.length;
      const response=await page.goto('https://ru5iru.blogspot.com'+path,{waitUntil:'networkidle'});
      await page.evaluate(async()=>{localStorage.setItem('theme','light');document.documentElement.classList.remove('dark');await document.fonts.ready;});
      const data=await page.evaluate(()=>({
        title:document.title,canonical:document.querySelector('link[rel="canonical"]')?.href,description:document.querySelector('meta[name="description"]')?.content,
        h1:[...document.querySelectorAll('h1')].map(el=>el.textContent.trim()),overflow:document.documentElement.scrollWidth>innerWidth,
        headingOrder:[...document.querySelectorAll('h1,h2,h3,h4')].map(el=>({tag:el.tagName,text:el.textContent.trim()})),
        images:[...document.images].map(i=>({src:i.currentSrc.slice(0,250),complete:i.complete,naturalWidth:i.naturalWidth,width:i.width,height:i.height,alt:i.alt})),
        faqQuestions:document.querySelectorAll('[data-post-faq] [itemtype$="/Question"]').length,tocLinks:document.querySelectorAll('[data-toc-list] a').length,
        codeButtons:document.querySelectorAll('[data-copy-code]').length,author:document.querySelector('[data-post-author]')?.textContent.trim(),
        targets:[...document.querySelectorAll('a,button,input')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;}).map(el=>{const r=el.getBoundingClientRect();return{text:(el.textContent.trim()||el.getAttribute('aria-label')||el.getAttribute('title')||'').slice(0,65),tag:el.tagName,width:Math.round(r.width),height:Math.round(r.height)};}).filter(el=>el.width<24||el.height<24),
        unnamedControls:[...document.querySelectorAll('button,input:not([type="hidden"])')].filter(el=>!el.textContent.trim()&&!el.getAttribute('aria-label')&&!el.getAttribute('aria-labelledby')&&!el.labels?.length).map(el=>el.outerHTML.slice(0,200)),
        lang:document.documentElement.lang,
        resources:performance.getEntriesByType('resource').map(r=>({name:r.name,transferSize:r.transferSize,decodedBodySize:r.decodedBodySize,duration:Math.round(r.duration)})),
      }));
      data.contrast=await page.evaluate(contrast);
      if(width!==768)await page.screenshot({path:`output/playwright/seo-audit-2026-11-05-blogger-recheck/live-${name}-${width}.png`,fullPage:true});
      results.push({name,path,width,status:response.status(),xRobots:response.headers()['x-robots-tag'],...data,errors:errors.slice(startErrors)});
    }
  }
  // Keyboard navigation, menu state and theme persistence in an emulated mobile viewport.
  await page.goto('https://ru5iru.blogspot.com/');
  await page.locator('[data-menu-toggle]').click();
  const menuOpened=await page.locator('#mobile-menu').isVisible();
  await page.keyboard.press('Escape');
  const menuClosed=!(await page.locator('#mobile-menu').isVisible());
  await page.locator('[data-theme-toggle]').click();
  const darkEnabled=await page.evaluate(()=>document.documentElement.classList.contains('dark'));
  await page.goto('https://ru5iru.blogspot.com/2026/06/injection.html');
  const darkPersisted=await page.evaluate(()=>document.documentElement.classList.contains('dark'));
  const darkContrast=await page.evaluate(contrast);
  await page.screenshot({path:'output/playwright/seo-audit-2026-11-05-blogger-recheck/live-article-dark-390.png',fullPage:true});
  await page.evaluate(()=>{localStorage.setItem('theme','light');document.documentElement.classList.remove('dark');});
  await page.goto('https://ru5iru.blogspot.com/');
  await page.keyboard.press('Tab');
  const firstFocus=await page.evaluate(()=>({text:document.activeElement.textContent.trim(),href:document.activeElement.getAttribute('href')}));
  return {capturedAt:new Date().toISOString(),results,interactions:{menuOpened,menuClosed,darkEnabled,darkPersisted,firstFocus},darkContrast};
}
