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
    'post.html': `<!-- Set the title, labels and search description in Blogger's own fields. -->
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
    'snippets/table.html': '<table><thead><tr><th>Heading one</th><th>Heading two</th></tr></thead><tbody><tr><td>First value</td><td>Second value</td></tr></tbody></table>',
    'snippets/quote.html': '<blockquote><p>Replace this with a quotation you have permission to use.</p></blockquote>',
  };
}
