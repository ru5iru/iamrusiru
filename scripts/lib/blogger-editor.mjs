import { JSDOM } from 'jsdom';

// Body-only HTML: Blogger/theme supply the title, author, date and outer layout.
// Reuse the source block renderers, so editor snippets do not invent new styles.
export function editorTemplates(source) {
  const summary = `<div class="post-summary rounded-xl bg-primary/5 border border-primary/10 px-6 py-5 mb-10">
  <p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
  <p class="text-body text-base leading-relaxed">Replace this with a short summary of your article.</p>
</div>`;
  const code = JSDOM.fragment(source.renderCode({ type: 'code', language: 'javascript', code: 'const message = "Hello, world!";\nconsole.log(message);' }));
  code.firstElementChild.classList.add('code-block');
  code.querySelector('button').setAttribute('data-copy-code', '');
  const holder = code.ownerDocument.createElement('div');
  holder.append(code);
  const faq = `<section class="mt-12" itemscope="itemscope" itemtype="https://schema.org/FAQPage">
  <h2>Frequently Asked Questions</h2>
  <div class="mt-5 rounded-xl border border-divider bg-warm p-5" itemprop="mainEntity" itemscope="itemscope" itemtype="https://schema.org/Question">
    <h3 itemprop="name">Replace this with a question.</h3>
    <div itemprop="acceptedAnswer" itemscope="itemscope" itemtype="https://schema.org/Answer"><p itemprop="text">Replace this with its answer.</p></div>
  </div>
  <div class="mt-5 rounded-xl border border-divider bg-warm p-5" itemprop="mainEntity" itemscope="itemscope" itemtype="https://schema.org/Question">
    <h3 itemprop="name">Replace this with another question.</h3>
    <div itemprop="acceptedAnswer" itemscope="itemscope" itemtype="https://schema.org/Answer"><p itemprop="text">Replace this with its answer.</p></div>
  </div>
</section>`;
  return {
    'post.html': `<!-- SEO/AEO/GEO publishing brief (planning notes, not metadata):
Primary search intent: replace with the question this article answers.
Primary phrase: use naturally in Blogger's Title, the lead and a relevant heading.
Supporting terms: cover the subject naturally; do not repeat a keyword list.
Set Labels and Search description in Blogger's own fields before publishing.
Use accurate sources, examples, author details and dates. Remove unused blocks. -->
${summary}
<h2>Introduction</h2>
<p>Write your introduction here.</p>
<h3>An example</h3>
<p>Explain your example here.</p>
<h2>Key points</h2>
<ul><li>Your first point.</li><li>Your second point.</li></ul>
<h2>Conclusion</h2>
<p>Write your conclusion here.</p>`,
    'page.html': `<!-- Set the Page title in Blogger. The theme adds it once. -->
<p>Write your page introduction here.</p>
<h2>Section heading</h2>
<p>Write your page content here.</p>
<h2>Another section</h2>
<p>Add another section or remove it if unnecessary.</p>`,
    'snippets/summary.html': summary,
    'snippets/code.html': holder.innerHTML,
    'snippets/faq.html': faq,
    'snippets/image.html': source.renderImage({ type: 'image', src: 'YOUR_BLOGGER_IMAGE_URL', alt: 'Describe the image', width: 800, height: 450, caption: 'Replace this with an optional caption.' }),
    'snippets/callout-info.html': source.renderCallout({ type: 'callout', variant: 'info', text: 'Replace this with your information note.' }),
    'snippets/callout-warning.html': source.renderCallout({ type: 'callout', variant: 'warning', text: 'Replace this with your warning.' }),
    'snippets/callout-tip.html': source.renderCallout({ type: 'callout', variant: 'tip', text: 'Replace this with your practical tip.' }),
    'snippets/table.html': '<table><caption>Replace with a descriptive table title</caption><thead><tr><th scope="col">Heading one</th><th scope="col">Heading two</th></tr></thead><tbody><tr><td>First value</td><td>Second value</td></tr></tbody></table>',
    'snippets/lists.html': '<!-- Keep actual list elements in HTML view; do not type Markdown bullets. -->\n<ul><li>Replace with a related point.</li><li>Replace with another point.</li></ul>\n<ol><li>Replace with the first step.</li><li>Replace with the next step.</li></ol>',
    'snippets/quote.html': '<blockquote><p>Replace this with a quotation you have permission to use.</p></blockquote>',
    'snippets/seo-keywords.html': `<!-- Optional structured keywords for a Page, or phrases separate from post Labels.
Append at the END of the body. Replace the examples with relevant phrases.
This is schema.org microdata, not a Google ranking or AI-inclusion directive. -->
<meta itemprop="keywords" content="primary topic phrase, supporting topic phrase" />`,
    'snippets/sources.html': `<h2>Sources and further reading</h2>
<ul><li><a href="REPLACE_WITH_PRIMARY_SOURCE_URL">Replace with a descriptive source title</a> — explain what this source supports.</li></ul>`,
  };
}
