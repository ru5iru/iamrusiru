// Run using Playwright CLI run-code --filename. Public/local fixtures only.
async (page) => {
  const directory = 'output/playwright/blogger-fixes-2026-11-07/';
  const routes = [['home', '/'], ['injection', '/2026/06/injection.html'], ['owasp', '/2026/03/owasp-top-ten.html'], ['about', '/p/about.html'], ['contact', '/p/contact.html'], ['privacy', '/p/privacy-policy.html']];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = async () => {
    await page.evaluate(async () => {
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 7000))]);
      document.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
      await Promise.race([Promise.all([...document.images].map(image => image.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 7000))]);
    });
  };
  const results = [];
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, path] of routes) {
      if (width === 768 && !['home', 'injection', 'owasp'].includes(name)) continue;
      const before = errors.length;
      const response = await page.goto('http://127.0.0.1:4177' + path);
      await ready();
      const values = await page.evaluate(() => ({
        title: document.title,
        overflow: document.documentElement.scrollWidth > innerWidth,
        lists: document.querySelectorAll('[data-article-body] ul, [data-article-body] ol').length,
        tables: document.querySelectorAll('[data-article-body] table').length,
        columnHeaders: document.querySelectorAll('[data-article-body] th[scope="col"]').length,
        faq: document.querySelectorAll('[itemtype="https://schema.org/Question"]').length,
        brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
        popularMissingAltOrDimensions: [...document.querySelectorAll('#PopularPosts1 img')].filter(image => !image.hasAttribute('alt') || !image.width || !image.height).length,
        bodyFont: getComputedStyle(document.body).fontFamily,
      }));
      results.push({ name, path, width, status: response.status(), ...values, errors: errors.slice(before) });
      if (width !== 768) await page.screenshot({ path: directory + name + '-' + width + '-after.png', fullPage: true });
      if (['about', 'contact'].includes(name) && width !== 768) {
        await page.goto('http://127.0.0.1:4176' + path);
        await ready();
        await page.screenshot({ path: directory + name + '-' + width + '-before.png', fullPage: true });
      }
    }
  }
  await page.goto('http://127.0.0.1:4177/');
  await page.locator('[data-menu-toggle]').click();
  const menuOpened = await page.locator('#mobile-menu').isVisible();
  await page.keyboard.press('Escape');
  const menuClosed = !(await page.locator('#mobile-menu').isVisible());
  await page.locator('[data-theme-toggle]').click();
  await page.goto('http://127.0.0.1:4177/2026/03/owasp-top-ten.html');
  const darkPersisted = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.screenshot({ path: directory + 'owasp-dark-390.png', fullPage: true });
  const context = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:4177/2026/03/owasp-top-ten.html');
  const noJs = await plain.evaluate(() => ({ lists: document.querySelectorAll('[data-article-body] ul, [data-article-body] ol').length, tables: document.querySelectorAll('[data-article-body] table').length, faq: document.querySelectorAll('[itemtype="https://schema.org/Question"]').length, description: document.querySelector('meta[name="description"]').content }));
  await context.close();
  return { capturedAt: new Date().toISOString(), scope: 'Local Blogger approximation, forced image decoding for visual checks; not native compilation or field CWV certification', results, interactions: { menuOpened, menuClosed, darkPersisted }, noJs, errors };
}
