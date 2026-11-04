# Reusable Blogger theme

This package installs the existing design with generic branding and an embedded placeholder portrait. It includes no imported posts, Pages or project images. Blogger supplies your blog's own content.

1. Upload `iamrusiru-blogger.xml` through **Blogger → Theme → Restore**.
2. Open **Layout** and edit the five named gadgets: Header, Homepage hero, Topics, Social links and Footer. Use the HTML editor to change text, link destinations and image URLs while retaining classes, SVGs and button/data attributes.
3. Replace the generic name, social-network links and portrait. Header navigation has desktop and mobile lists; update both.
4. Create your About, Contact and legal Pages at the linked paths, or change their links.
5. Configure your blog title/search description/favicon in Blogger Settings. Create your own posts and configure Tags/Blog Archive normally. No content import is needed.

The current colors, fonts, spacing and component styles are preserved. `editable-regions/` contains the generated gadget HTML for editing or recovery.

`editor-templates/` contains a post starter, a Page starter and optional styled-block snippets. See `WRITING.md` for adding new content and setting Blogger's default Post template.

For consistent author biography/portrait updates across the entire theme, use `theme-config.json` with this project's source builder. Its fields and build commands are documented in `CUSTOMIZATION.md`. Keep your edited configuration separate from the supplied presets. You can edit the main sections directly in Blogger without installing any build tools.

This generic preset uses `contentMode: native`, so it contains no source-blog post links, old excerpt/date overrides or curated recommendations. Related posts use Blogger's native feed when enabled. Set `socialImageUrl` to a public HTTPS image for homepage social cards; article cards can use their Blogger featured image.

After installation, verify the five gadgets can save edits, a published post opens, mobile navigation/theme switching work, and comments/search/labels work on your blog. The local preview does not run Google's theme compiler.
