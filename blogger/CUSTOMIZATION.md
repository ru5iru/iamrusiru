# Customize and reuse this theme

The current design is the default: colors, fonts, spacing, breakpoints, icons, card styles and decorative elements are retained. Customization changes content, links and site identity.

Configuration/build commands require this project's source, Node 22 and its installed dependencies. Installing the XML and editing its Blogger Layout gadgets do not require Node. Each build writes `theme-config.json` as a copy of its resolved settings.

Responsive images use the optional root `responsiveImages` map: source filename to an increasing array of `{ "width": 384, "url": "https://your-host/actual-upload.webp" }` entries. Supply at least two genuinely different sizes. [IMAGE-PUBLISHING.md](IMAGE-PUBLISHING.md) explains generation, public upload and validation before activation. The default empty map keeps public originals working.

## Update your existing blog

Upload `output/iamrusiru-blogger.xml` through **Theme → Restore**, then open **Layout**. Do not import the posts again. This export keeps your existing content and its migration fallbacks.

Five named HTML/JavaScript gadgets now expose the existing sections:

| Layout gadget | Editable content | ID |
| --- | --- | --- |
| Header — branding and navigation | Two-color wordmark and desktop/mobile navigation links | HTML101 |
| Homepage hero — text and portrait | Intro, headline, description, buttons, portrait and floating-card text | HTML102 |
| Topics — label links | Topic names and label destinations | HTML103 |
| Social links | Sidebar introduction and social destinations | HTML104 |
| Footer — text and links | Wordmark, description, navigation, legal/social links and copyright | HTML105 |

Open **Edit** on a gadget and use its HTML editor. Change the text between tags, `href` link destinations, or image `src`/`alt` values. Keep existing `class`, `id`, `data-*`, button and SVG markup to retain styling and behavior. For the header, update the desktop and mobile link lists together. Gadget titles identify sections in Layout and do not add visible headings to the site. Gadgets are locked in place so they cannot accidentally be moved out of their intended layout.

Copies of each generated gadget body are in `output/editable-regions/`. They provide a recovery point if a gadget is edited incorrectly. Blogger can retain saved gadget content when restoring another theme build; if newly built defaults do not replace a previous edit, paste the corresponding generated `.html` into that gadget's Content field.

**Tags**, **Blog Archive**, posts, Pages, comments, favicon, blog title and search description remain native Blogger settings. About/contact/legal page bodies remain editable under **Pages**.

For writing new content, see [WRITING.md](WRITING.md). Each build includes `editor-templates/post.html`, `page.html` and reusable body snippets. The post starter can also be saved in Blogger's **Settings → Posts → Post template**.

## Change identity consistently

For changes shared across the site, edit `blogger/config.json` and rebuild. All supported fields are present in that file, with the existing site values as defaults.

| Setting | Effect |
| --- | --- |
| `title`, `author`, `description` | Build defaults and exported content attribution; Blogger Settings controls the live blog title and search description. |
| `branding` | Wordmark's two text portions and Twitter creator handle. |
| `hero` | Intro, three headline portions, description, two floating-card lines and portrait alt text. The space at the end of `headingMain` separates it from the accent word. |
| `profile.portraitUrl` | One HTTPS image URL for the hero, post cards, author row, bio and generated page portraits. Empty preserves the current embedded portrait in project mode; native mode uses a neutral embedded placeholder. |
| `profile.role`, `profile.job`, `profile.bio` | Article author role and biography. These apply to the theme's single-owner bio. Post author names still come from Blogger. |
| `profile.citationName` | Citation name for migrated project posts. New native posts use their Blogger author name. |
| `links` | About/contact/legal/portfolio and social URLs. Use `/p/about.html`-style paths for links that should follow the current blog domain. |
| `footer`, `connect` | Footer and sidebar copy. |
| `topics` | Category names and topic links. Set these together when changing category names, so badges and tag exclusions stay consistent. Icons retain their existing sequence. |
| `socialImageUrl` | Absolute public HTTPS fallback for social cards. Post images take priority. |
| `seo` | Language, optional homepage title/keywords, legacy keyword emission, noindex paths and per-route title/description/keyword/image overrides. See [SEO-GUIDE.md](SEO-GUIDE.md). Native Search description takes priority over generated description defaults. |
| `assetBaseUrl`, `assetUrls` | Image URLs in the optional project-content export. These do not upload binaries or rewrite already-published post bodies. |
| `contentMode` | `project` retains this project's 23 posts, four Pages and route-specific fallbacks; `native` uses only the destination blog's own posts and Pages. |

For a portrait change across the entire theme, use `profile.portraitUrl` and rebuild. Editing only the hero gadget's image updates that section alone.

```sh
npm run build:blogger
npm run test:blogger
```

The source application and its prerender plugin are not modified. Configuration cannot change fonts, colors or CSS rules. Keep visible identity and SEO identity consistent when reusing the theme: Layout-only text changes do not rewrite build-time owner/profile metadata. Update your configuration and rebuild when changing the owner. `seo-routes.json` records defaults, while `robots-txt.example.txt` is a Settings example rather than part of the XML.

## Reuse on another blog

1. Copy `blogger/config.reusable.json` to a new configuration file and fill in the new owner's identity, blog URL, page paths, links and portrait. The supplied values are placeholders. Keep `contentMode` set to `native`.
2. Build into a separate output directory:

   ```sh
   node scripts/build-blogger.mjs --config blogger/my-blog.json --out blogger/output/my-blog
   node scripts/serve-blogger.mjs --out blogger/output/my-blog --port 4175
   ```

3. Upload that directory's `iamrusiru-blogger.xml` through Blogger **Theme → Restore**. Create/edit the destination blog's own posts and Pages normally. Do not import this project's content.
4. Create About, Contact, Privacy Policy and Cookie Policy Pages at the configured paths, or update links to the pages you use. Replace the social-network placeholder URLs with your profiles.
5. In Layout, review the five content gadgets and configure Tags/Blog Archive. Match post category labels to `topics`. Keep the homepage's existing six-post setting for the original density.
6. Check desktop/mobile navigation, images, a native post, search/labels, comments and `?m=1` on the destination blog. New native gadgets still need hosted save/edit verification; the local preview does not implement Google's theme compiler.

For a ready-to-edit generic preset:

```sh
npm run build:blogger:reusable
```

Its theme is at `output/reusable/iamrusiru-blogger.xml`. It contains no project post paths, curated recommendations, old excerpt/date overrides or migration manifest entries, and exports no project posts, Pages or media. Its neutral portrait is embedded; set `profile.portraitUrl` for your own photo. If no social fallback image is set, posts use their Blogger featured image and the homepage omits empty image metadata.

The output directory can contain an empty `feed.atom` for consistent build tooling; it is not needed for native mode. Build into a fresh directory when switching a previous project export to native mode, since old files are not deleted automatically.

## Preserve edits safely

Before replacing the installed theme, use Blogger's theme backup to keep saved gadget settings. Keep your own configuration file separate from the supplied presets. Rebuild from that file for future versions, then review any gadget contents Blogger retained. No post reimport is required for content-gadget or configuration changes to the theme.

The widgets use Blogger's documented [HTML gadget content](https://support.google.com/blogger/answer/47270?hl=en) and [Layout sections/widgets](https://support.google.com/blogger/answer/46888?hl=en). Their custom include renders the saved HTML while keeping the supplied component markup intact.

## Preservation verification

Eight before/after Chrome screenshots of the default home, code article, About and Contact pages at 1440px and 390px had identical dimensions and zero differing pixels. The compiled original CSS is unchanged; added rules only neutralize the new gadget wrappers and expose the gadgets in Layout editing. All 15 compatibility/customization checks passed, including a separate owner/native-mode build and saved gadget edits without JavaScript. Both default and native presets passed mobile menu/Escape and theme persistence checks with no browser JavaScript errors or horizontal overflow. Native gadget save/edit behavior still needs verification after uploading to Blogger.
