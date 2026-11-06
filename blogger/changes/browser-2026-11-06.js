// Run through Playwright CLI --filename. No private/admin browser state is used.
async (page) => {
  const directory = 'output/playwright/blogger-fixes-2026-11-06/';
  const routes = [['home', '/'], ['article', '/2026/06/injection.html'], ['about', '/p/about.html'], ['contact', '/p/contact.html']];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = async () => {
    await page.evaluate(async () => {
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 10000))]);
      document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
      await Promise.race([Promise.all([...document.images].map(img => img.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 10000))]);
    });
  };
  const results = [];
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, path] of routes) {
      const start = errors.length;
      const response = await page.goto('http://127.0.0.1:4175' + path);
      await ready();
      const result = await page.evaluate(() => ({ title: document.title, description: document.querySelector('meta[name="description"]').content, overflow: document.documentElement.scrollWidth > innerWidth, faq: document.querySelectorAll('[itemtype="https://schema.org/Question"]').length, brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src), sourceLinks: [...document.querySelectorAll('[data-article-body] a[href^="https://"]')].map(a => a.href) }));
      results.push({ name, path, width, status: response.status(), ...result, errors: errors.slice(start) });
      if (width !== 768) await page.screenshot({ path: directory + name + '-' + width + '-after.png', fullPage: true });
      if (['about', 'contact'].includes(name) && width !== 768) {
        await page.goto('http://127.0.0.1:4176' + path);
        await ready();
        await page.screenshot({ path: directory + name + '-' + width + '-before.png', fullPage: true });
      }
    }
  }
  await page.goto('http://127.0.0.1:4175/');
  await page.locator('[data-menu-toggle]').click();
  const menuOpened = await page.locator('#mobile-menu').isVisible();
  await page.keyboard.press('Escape');
  const menuClosed = !(await page.locator('#mobile-menu').isVisible());
  await page.locator('[data-theme-toggle]').click();
  await page.goto('http://127.0.0.1:4175/2026/06/injection.html');
  const darkPersisted = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.screenshot({ path: directory + 'article-dark-390.png', fullPage: true });
  await page.evaluate(() => { localStorage.setItem('theme', 'light'); document.documentElement.classList.remove('dark'); });
  const context = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:4175/2026/06/injection.html');
  const noJs = await plain.evaluate(() => ({ description: document.querySelector('meta[name="description"]').content, bodyLength: document.querySelector('[data-article-body]').textContent.length, faq: document.querySelectorAll('[itemtype="https://schema.org/Question"]').length }));
  await plain.screenshot({ path: directory + 'article-no-js-390.png', fullPage: true });
  await context.close();
  return { capturedAt: new Date().toISOString(), scope: 'Local Blogger preview; not native compiler certification', results, interactions: { menuOpened, menuClosed, darkPersisted }, noJs, errors };
}
