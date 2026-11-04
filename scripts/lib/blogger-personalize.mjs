import { themeDefaults } from './blogger-config.mjs';

// Change content only. Keep the source DOM, class names, SVGs and CSS intact.
export function personalizeFragment(box, kind, config) {
  const doc = box.ownerDocument;
  const text = (selector, value, original) => {
    if (value !== original) box.querySelector(selector).textContent = value;
  };
  const links = new Map(Object.entries(themeDefaults.links).map(([key, href]) => [href, config.links[key]]));
  box.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (links.has(href)) link.setAttribute('href', links.get(href));
  });
  if (kind === 'header' || kind === 'footer') {
    const brand = box.querySelector(kind === 'header' ? '[data-home]' : 'h3');
    brand.querySelector('.text-display').textContent = config.branding.prefix;
    brand.querySelector('.text-primary').textContent = config.branding.accent;
    if (kind === 'header') brand.setAttribute('aria-label', config.title + ' home');
  }
  if (kind === 'hero') {
    text('.tracking-\\[0\\.25em\\]', config.hero.eyebrow, themeDefaults.hero.eyebrow);
    text('h1 > span:first-child', config.hero.headingPrefix, themeDefaults.hero.headingPrefix);
    const h1 = box.querySelector('h1');
    if (config.hero.headingMain !== themeDefaults.hero.headingMain) {
      const main = Array.from(h1.childNodes).find(node => node.nodeType === 3 && node.textContent.trim());
      main.textContent = config.hero.headingMain;
    }
    if (config.hero.headingAccent !== themeDefaults.hero.headingAccent) {
      const accent = h1.querySelector('span.relative');
      Array.from(accent.childNodes).filter(node => node.nodeType === 3).forEach(node => node.remove());
      accent.prepend(doc.createTextNode(config.hero.headingAccent));
    }
    text('p.text-body', config.hero.description, themeDefaults.hero.description);
    if (JSON.stringify(config.hero.cardLines) !== JSON.stringify(themeDefaults.hero.cardLines)) {
      const card = box.querySelector('p.font-medium');
      card.replaceChildren(doc.createTextNode(config.hero.cardLines[0]), doc.createElement('br'), doc.createTextNode(config.hero.cardLines[1]));
    }
    const portrait = box.querySelector('img');
    if (config.profile.portraitUrl) portrait.src = config.profile.portraitUrl;
    if (config.hero.portraitAlt !== themeDefaults.hero.portraitAlt) portrait.alt = config.hero.portraitAlt;
  }
  if (kind === 'topics') {
    const list = box.querySelector('.space-y-3');
    const sourceItems = Array.from(list.children);
    if (JSON.stringify(config.topics) !== JSON.stringify(themeDefaults.topics)) {
      list.replaceChildren(...config.topics.map((name, index) => {
        const item = sourceItems[index % sourceItems.length].cloneNode(true);
        item.href = '/search/label/' + encodeURIComponent(name);
        item.querySelector('span').textContent = name;
        return item;
      }));
    }
  }
  if (kind === 'connect') {
    text('h3', config.connect.title, themeDefaults.connect.title);
    text('p', config.connect.description, themeDefaults.connect.description);
  }
  if (kind === 'footer') {
    text('p.text-body', config.footer.description, themeDefaults.footer.description);
    const headings = box.querySelectorAll('h4');
    ['quickTitle', 'legalTitle', 'connectTitle'].forEach((key, index) => {
      if (config.footer[key] !== themeDefaults.footer[key]) headings[index].textContent = config.footer[key];
    });
  }
  return box;
}
