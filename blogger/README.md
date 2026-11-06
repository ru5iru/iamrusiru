# iamrusiru for Blogger

The export keeps the existing warm colors, DM Serif Display / Roboto / JetBrains Mono typography, portrait hero, responsive post lists, topics, social links, footer, static pages, and light/dark themes. Blogger renders posts, pages, metadata, label results, search and pagination. React, Supabase and MCP are not required by the installed theme.

## Generated files

For reuse and editing through Blogger Layout, see [CUSTOMIZATION.md](CUSTOMIZATION.md). The current look is retained as the default. A separate `native` preset avoids copying project-specific content into another blog.

In the downloadable ZIP, the generated files are at the ZIP root rather than inside `output/`. Rebuilding uses the source project and `blogger/config.json`.

| File in `output/` | Purpose |
| --- | --- |
| `iamrusiru-blogger.xml` | Complete theme to upload. Do not upload the source `template.xml`. |
| `feed.atom` | Fresh-blog import of 23 posts/four Pages. Do not reimport into the existing live blog. |
| `about.html`, `contact.html`, `privacy-policy.html`, `cookie-policy.html` | Styled page bodies for manual installation if necessary. |
| `assets/` | Original image files for moving to another public image host. |
| `media-manifest.json` | Image filenames and configured public URLs. |
| `redirects.json` | Old React routes and intended Blogger destinations. |
| `content.json` | Exported data, excerpts and intended permalinks for checking the import. Not a Blogger upload. |
| `preview/` | Local approximation fixtures. Not Blogger upload files. |
| `editable-regions/` | Header, hero, topics, social and footer HTML for Blogger Layout editing/recovery. |
| `CUSTOMIZATION.md` | Named configuration fields, editable gadgets and reuse instructions. |
| `editor-templates/`, `WRITING.md` | New-post/Page starters, reusable styled blocks and publishing instructions. |
| `SEO-GUIDE.md`, `SEO-AUDIT.md` | Keyword/description publishing instructions, crawler setup and the Blogger-only audit. |
| `seo-routes.json`, `robots-txt.example.txt` | Reviewable route metadata defaults and a destination-specific Blogger Settings example; neither is a theme/content import. |

| `APPLY-UPDATES.md`, `post-updates/`, `post-updates.csv`, `post-updates.json` | Existing-post body corrections, suggested native titles/Search descriptions, reader-intent briefs and deployment instructions. Update existing posts in place. |

## Build and review

Use Node 22 or newer and the existing project dependencies:

```sh
npm ci
npm run build:blogger
npm run test:blogger
npm run preview:blogger
```

The preview runs at **http://127.0.0.1:4175**. It evaluates this theme's expressions against exported content; it does not run Google's template compiler. Search, labels and pagination are simulated, and the native comment area is a labeled placeholder. Final platform checks need a Blogger test blog.

Check the public images with `node scripts/check-blogger-media.mjs`.

## Configure the destination

Edit `blogger/config.json`, then rebuild. `blogUrl` currently points to the verified public blog, `https://ru5iru.blogspot.com`; change it if the destination or custom domain changes. Live navigation and canonical URLs use Blogger's own URL data. The configured URL controls the Atom import links and local static fixtures.

The default `assetBaseUrl` points to this project's public GitHub `main/src/assets/` folder. All 24 URLs returned HTTP 200 with image MIME types during verification. They depend on the repository staying public and retaining its filenames. Set `profile.portraitUrl` to change the displayed portrait throughout the theme; the default portrait is embedded. Social preview images require public HTTPS URLs.

For Blogger-hosted images, upload each image through Blogger's editor, copy its full `blogger.googleusercontent.com` URL, and add overrides by filename:

```json
"assetUrls": {
  "profile-headshot.jpg": "https://blogger.googleusercontent.com/YOUR-IMAGE-URL",
  "post-planning.png": "https://blogger.googleusercontent.com/YOUR-OTHER-IMAGE-URL"
}
```

For another host, upload `output/assets/` and change `assetBaseUrl`. Rebuild before importing. Blogger content import does not upload image binaries.

## Install

1. Create a test blog and back up its current theme/content.
2. Configure the destination URL and image URLs, then run the build.
3. In **Theme**, open the menu beside Customize, choose **Restore**, and upload `output/iamrusiru-blogger.xml`. Alternatively paste its full contents into **Edit HTML**.
4. In **Settings → Manage blog → Import content**, select `output/feed.atom`. Leave automatic publishing off while checking the import. Theme and content are separate uploads.
5. Confirm all 23 posts and four pages imported. Page paths must be `/p/about.html`, `/p/contact.html`, `/p/privacy-policy.html`, and `/p/cookie-policy.html`.
6. Compare post URLs with `redirects.json`. Atom alternate links express intended URLs, but Blogger may normalize/regenerate them. Before publishing, use **Custom Permalink** for the original slug where necessary, and preserve the publication date/month. Related links and metadata fallbacks expect these paths.
7. If a Page is missing or has another slug, create it with the expected slug and paste the corresponding `.html` body in **HTML view**. Keep the `data-migrated-page` wrapper so the theme does not add a second title.
8. Set the homepage to **six posts**. In **Theme → Mobile settings**, select the desktop/custom theme so the same responsive design appears on `?m=1` pages.
9. Enable the blog's **Search description** and set descriptions for posts/pages in Blogger. Native descriptions take precedence over generated route defaults. Follow [SEO-GUIDE.md](SEO-GUIDE.md) for keyword entry, reusable metadata and crawler settings. The currently published blog's wildcard robots group blocks general crawlers; this requires a Blogger Settings change, independently of theme restore.
10. Enable comments in **Settings → Comments**. The theme calls Blogger's inherited v2 `commentPicker`, retaining its native threaded comments/editor. Test submitting, replying and moderation.
11. In **Layout**, configure Tags and Blog Archive, or add more sidebar gadgets. Tags are limited to 12 to preserve the original density. The exporter uses the accepted `ALPHA` gadget setting; JavaScript orders the native label counts by popularity. Add one of the six topic labels to new posts: Engineering, Career, Tutorials, Side Projects, Reading, Personal. Blogger labels serve as both topics and tags.
12. Enable blog feeds for automatic related posts. Imported posts also keep their explicit related links, which work without JavaScript or feeds. RSS/Atom use Blogger's native feed endpoints.
13. Set the favicon in Blogger Settings. Review the imported legal pages against the services/cookies actually enabled on the blog.

Blogger accepts Atom and legacy XML content backups: [import instructions](https://support.google.com/blogger/answer/41387?hl=en). The template follows its [widget tags](https://support.google.com/blogger/answer/46995?hl=en), [layout data](https://support.google.com/blogger/answer/47270?hl=en), and [section/widget structure](https://support.google.com/blogger/answer/46888?hl=en).

## Platform mapping

| Original | Blogger equivalent |
| --- | --- |
| TypeScript post files | Native posts with imported HTML; create future posts in Blogger. |
| `/post/slug` | `/YYYY/MM/slug.html`; import and redirect mappings included. |
| `/about`, `/contact`, legal routes | Native `/p/slug.html` Pages. |
| Client topic/tag filters | Server-rendered label results and clear-filter link. |
| Load more button | Native older/newer links with matching button styles. |
| Local tag counts | Automatically updated Blogger Label gadget. |
| No original comments | Native threaded comments/editor added. |
| React reading tools | Progressive JS for reading time, TOC, progress, code/link copy, sharing, related posts and back to top. |
| Prerendered social tags | One set of server-rendered metadata tags; imported excerpts generated at build time. |
| Article/FAQ JSON-LD | BlogPosting / FAQPage microdata in server-rendered HTML. |
| `/rss.xml` | `/feeds/posts/default?alt=rss` plus native Atom. |
| Static robots/sitemap/LLM files | Blogger manages robots/sitemaps. Themes cannot host arbitrary files such as `llms.txt`. |
| MCP / Supabase | Omitted from Blogger runtime. |

The React application and prerender plugin are retained. `npm run build` still targets that application; `npm run build:blogger` independently creates Blogger artifacts.

## URL migration

Use `redirects.json` in **Settings → Errors and redirects → Custom redirects**, selecting permanent redirects as appropriate. Old `/?tag=...` links should point to native label URLs; path-only redirect entries cannot migrate arbitrary tag query parameters. If the domain changes, redirects also belong at the old host: Blogger cannot redirect traffic that never reaches it.

## Hosted verification

If Restore fails and Edit HTML reports that `Label1` has an unacceptable widget-setting value, use the latest rebuilt XML. The invalid `sorting=FREQ` setting has been replaced with `ALPHA`; popular-tag ordering is preserved by the enhancement script. The build now rejects this invalid exported setting before writing the theme.

For the November UI fixes on the existing live blog, upload only the rebuilt `output/iamrusiru-blogger.xml` through **Theme → Restore**. Do not import `feed.atom` again: the 23 published posts and four Pages are already present. See [UI-COMPARISON.md](UI-COMPARISON.md) for the comparison, fixes and remaining platform differences.

If a previous export reports `b:with has invalid value expression`, replace the installed theme with the rebuilt `output/iamrusiru-blogger.xml`. The exporter now generates native `b:if`/`b:elseif` branches for descriptions, excerpts and reading times instead of long chained conditional expressions. This theme-only fix does not require reimporting posts or pages.

If the homepage works but article pages report `Failed to render gadget 'Blog1'` / `There was an error processing the markup`, install the latest rebuilt theme. Post sharing now uses basic Blogger expressions with working URL-only links; JavaScript adds encoded titles and parameters. The unsupported `urlEncode(...)` template calls have been removed, and the build rejects unknown expression functions. Publishing or importing the posts again is unnecessary for this theme fix.

Local parsing and previews cannot prove Blogger accepts a theme. On the test blog verify save/restore, imported URLs, labels/search/archives, older/newer navigation, Layout gadgets, mobile `?m=1`, comments, RSS, dark mode, sharing and images. Use **View Page Source** with JavaScript disabled to check a post's title, description, canonical and social image. Google Fonts and remote images require network access.
