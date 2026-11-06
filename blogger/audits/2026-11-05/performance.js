async (page) => {
  const browser=page.context().browser();
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{
    window.__audit={lcp:[],shifts:[],longTasks:[]};
    for(const [type,key] of [['largest-contentful-paint','lcp'],['layout-shift','shifts'],['longtask','longTasks']])try{new PerformanceObserver(list=>{for(const e of list.getEntries())window.__audit[key].push({startTime:e.startTime,duration:e.duration,value:e.value,hadRecentInput:e.hadRecentInput,element:e.element?.tagName,elementClass:e.element?.className,url:e.url});}).observe({type,buffered:true});}catch{}
  });
  const p=await context.newPage(), cdp=await context.newCDPSession(p), results=[];
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  for(const path of ['/','/2026/06/injection.html','/2026/06/proper-project-planning.html']) {
    await p.goto('https://ru5iru.blogspot.com'+path,{waitUntil:'networkidle',timeout:60000});
    await p.evaluate(()=>document.fonts.ready);
    results.push(await p.evaluate(path=>{
      const nav=performance.getEntriesByType('navigation')[0];const a=window.__audit;
      return {path,title:document.title,navigation:{ttfb:Math.round(nav.responseStart),domContentLoaded:Math.round(nav.domContentLoadedEventEnd),load:Math.round(nav.loadEventEnd),transferSize:nav.transferSize,decodedBodySize:nav.decodedBodySize},lcp:a.lcp.at(-1),clsSum:a.shifts.filter(e=>!e.hadRecentInput).reduce((n,e)=>n+e.value,0),longTaskMs:Math.round(a.longTasks.reduce((n,e)=>n+e.duration,0)),resourceCount:performance.getEntriesByType('resource').length,resources:performance.getEntriesByType('resource').map(e=>({url:e.name,ms:Math.round(e.duration),transferSize:e.transferSize,decodedBytes:e.decodedBodySize}))};
    },path));
  }
  await context.close();return {capturedAt:new Date().toISOString(),method:'Single cold-cache lab navigation per URL; Chrome mobile emulation; 150ms latency, 1.6Mbit/s download, 4x CPU slowdown. CLS is observed sum, not a full session-window CWV assessment. No field INP measured.',results};
}
