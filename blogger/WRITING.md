# Add posts and Pages with the existing styles

New content is written in Blogger. No theme rebuild or post import is needed each time you publish. The theme supplies the outer layout and styles; editor templates supply optional body markup.

## What is automatic?

| Content or feature | How it works |
| --- | --- |
| Post title, date, author, category/tags and outer layout | Rendered from Blogger's fields and labels. Use one configured topic label, such as Engineering, plus ordinary tag labels. |
| Paragraphs, headings, links, lists, quotes, tables and basic code | Inherit `.post-content` styles. Use Blogger's heading options rather than painting text with custom fonts/colors. |
| Contents panel | Generated for articles with at least three H2/H3 headings; shown on desktop. |
| Reading time, reading progress, share controls, citation, back to top | Supplied by the theme; do not paste them into the body. New homepage cards currently use a generic reading-time fallback, while the article calculates from its body. |
| Related posts | New native posts use the label feed when feeds are enabled; no rebuild required. |
| Comments | Blogger's native editor/thread, when enabled. |
| TL;DR, callouts, styled code panels, captioned images and FAQ cards | Paste their snippets in HTML view. These blocks are optional. |
| New Pages | Get a single title and a centered, padded content wrapper. They do not appear in the homepage's post feed. Add their URL to navigation in Layout. |

The Blogger editing canvas may not look like the published theme. Use **Preview** to check the actual site styles. Inline formatting pasted from Word or another website can override theme fonts/colors; paste plain text or clear formatting when needed.

## Write a post

1. Open **Posts → New post** and enter the title in Blogger's Title field.
2. Either write normally in Compose view, or switch to **HTML view** and paste `editor-templates/post.html` as a starter. Replace every placeholder before publishing. Do not paste a full HTML document, `<style>`, another H1, or a second `.post-content` wrapper.
3. Add one configured category under **Labels**, plus any tags. Add images through Blogger and write useful alt text. The first eligible image can supply Blogger's featured thumbnail.
4. Fill in **Search description** for a controlled search/social description and review the permalink/publication date. New listing excerpts come from the body text.
5. Preview, then publish. New posts appear through Blogger's normal listing/search/labels/pagination.

To prefill every future post, paste the contents of `editor-templates/post.html` into **Settings → Posts → Post template**, then save. This is a Blogger setting, not an XML theme restore. It affects future new-post editor bodies, not already-published posts. See [Blogger's post-template instructions](https://support.google.com/blogger/answer/154172?hl=en).

## Use a special block

Open the corresponding file under `editor-templates/snippets/`, copy its contents, and insert it at the desired place in the post's **HTML view**:

- `summary.html`: existing TL;DR panel.
- `code.html`: existing language header, code panel and copy button. Replace the language label/class and code text. In HTML, encode `<` as `&lt;` and `&` as `&amp;` inside code; keep the button/SVG/data attributes.
- `callout-info.html`, `callout-warning.html`, `callout-tip.html`: the original note styles and icons.
- `image.html`: original image/caption layout. Replace `YOUR_BLOGGER_IMAGE_URL` with the full URL from an image uploaded to Blogger, and update its alt text, dimensions and optional caption.
- `faq.html`: original FAQ cards and structured markup. Keep answers and visible question text in sync. On article pages, the script moves this section after related posts and excludes it from the contents panel.
- `table.html`, `quote.html`: ordinary semantic HTML using the existing prose styles.

Keep classes, SVGs, IDs and `data-*` attributes when changing block content. Preview after switching editor modes, since Blogger's visual editor can normalize advanced HTML. Insert these blocks only once; do not include the theme's author/share/related/contents controls in the body.

## Write a Page

1. Open **Pages → New page** and enter its title.
2. Write in Compose view, or paste `editor-templates/page.html` into HTML view and replace the starter text.
3. Preview and publish. The theme supplies the page title, padding, content width and basic prose styles.
4. Add the Page's published URL to the header/footer gadgets in **Layout** if it belongs in navigation. Update both mobile and desktop header links.

These plain Page starters do not duplicate the special About/Contact layouts. For those existing layouts, edit the corresponding Page already in Blogger; exported project-mode body copies remain in `about.html`, `contact.html` and the legal-page files. They include a `data-migrated-page` wrapper and their own H1, so the theme avoids adding another title. Do not add that wrapper to an ordinary Page starter.

Publishing a post or Page requires no local build. Rebuild only when changing the theme or shared build configuration. Existing published posts and imported Pages keep their current styling.

The starter files and snippets were checked with a new native-post/Page fixture at 1440px and 390px: one title, no horizontal overflow or browser JavaScript errors, working code copy, four generated contents links, and FAQ placement after article tools. The plain Page has a 768px maximum wrapper and 24px mobile gutters. All 16 local compatibility and authoring checks pass. Blogger's editor can normalize saved HTML, so Preview remains the final check before publishing.
