---
name: blogger
description: Turn supplied content, notes, or an existing draft into a complete Blogger post or Page publishing packet that matches this repository's existing theme and SEO fields. Use for authoring and editorial updates; companion skills cover focused reviews, images, and deployment.
---

# Blogger authoring

Create a useful article from the user's material and deliver ready-to-paste body HTML plus the separate Blogger editor fields. Preserve the user's meaning, voice and personal experience. Match the installed theme rather than designing a new page.

## Read the current project

Resolve paths from this skill's directory; run commands from the repository root.

- Read `../AGENTS.md`, [config.json](config.json), [WRITING.md](WRITING.md) and [SEO-GUIDE.md](SEO-GUIDE.md). Read the user's selected configuration instead of assuming the default owner or topics.
- Read [the publishing-packet contract](references/publishing-packet.md) before producing files.
- Use the current `output/editor-templates/` when available. The maintained snippet source is [blogger-editor.mjs](../scripts/lib/blogger-editor.mjs); theme rules are in [styles.css](styles.css) and [template.xml](template.xml). Copy existing block markup/classes instead of inventing utility classes that the compiled theme might not contain.
- For an update or an internal link, consult the current `output/content.json`, `output/post-updates.json`, `post-metadata.json` and supplied/live URLs as relevant. These inventories cover the source export, not necessarily every native Blogger entry. Do not hardcode a post count or assume an old audit is current.

## Author from supplied content

1. Identify the reader, question/search intent and useful takeaway. Infer routine editorial choices from the material; ask only when missing information changes its meaning or correctness. A short personal account need not become a long tutorial.
2. Preserve the distinction between supplied personal experience and researched facts. Do not invent the author's projects, credentials, results, statistics, dates or quotes. For changing, niche or uncertain factual claims, check current primary sources. If verification is unavailable, qualify or omit the claim and record the limit in the publishing notes.
3. Choose a clear complete title and a concise, unique Search description. Choose a primary phrase and useful supporting phrases naturally; do not truncate titles mechanically or repeat a keyword list. Posts use one suitable configured topic plus relevant consistent Labels. Pages have no Labels.
4. Write a direct opening and logical H2/H3 sections. Use a concise summary block when useful, semantic lists for points/steps, proper tables for comparisons, escaped code, and relevant examples. Include contextual links to real existing entries and primary references where they help the reader. Do not force counts of headings, words, links or citations.
5. Include FAQs only when they answer real follow-up questions supported by the article. Reuse the visible microdata FAQ snippet and keep its questions/answers aligned with `publishing.json`. Do not add a second JSON-LD FAQ graph.
6. Use an appropriate supplied/verified image or provide a specific cover brief and alt-text guidance. A missing public image URL is an explicit publishing task; omit the image element rather than fabricate a URL or leave a template placeholder.
7. Produce the files in the packet contract. Default to `blogger/drafts/SLUG/`, outside generated output. If a draft already exists, preserve newer edits; use a distinct revision folder when ownership of edits is unclear. Do not overwrite exported or live posts merely to create a draft.

## Theme and publishing invariants

- Body HTML only: no document shell, H1, `.post-content` wrapper, head metadata, scripts or new CSS. Blogger supplies the H1, dates, author, reading tools, social fields, article identity and navigation. Keep the theme's fonts, colors, spacing and responsive classes.
- Use actual `ul/ol/li` and `table/thead/tbody/th/td` elements, not Markdown lists/tables inside paragraphs. Retain actual image dimensions and useful alt attributes. Preserve code text and escape HTML characters once.
- New native posts/Pages do not require a theme rebuild. Write metadata into Blogger's editor fields, not into body head tags. Posts' Labels supply native structured keywords; Pages can use the optional existing keyword snippet when justified.
- On imported/configured URLs, check `seo.routes` and `post-metadata.json`: curated keyword/default metadata can outlive a rewrite. Flag a needed override change; do not claim editing Labels replaces a configured keyword list.
- Updating an existing entry preserves its public URL and original publication date. Never create replacement entries or reimport `feed.atom` to perform an update. Do not invent a new post's final dated URL before its publishing date/permalink is known.
- Local drafting does not authorize account publication, image upload, a Git push or account setting changes. Carry out those actions when the user's request authorizes them; do not add a separate approval cycle to already authorized work.

## Validate and deliver

Run the local packet check:

```powershell
node blogger/scripts/validate-draft.mjs blogger/drafts/SLUG
```

Fix errors and review warnings. The check validates local structure and field consistency; it does not certify claims, fetch every URL, render the page, run Blogger's compiler or prove indexing. Preview on the current theme when markup warrants a visual check. Use the available Playwright skill if browser automation is needed.

Return links to the packet, a short copy/paste field summary, actual verification performed and remaining publishing tasks. Make clear whether it is a local draft or published content.

## Related skills

Read only the mode needed for the request:

- [Blogger SEO review](skills/blogger-seo-review/SKILL.md): focused content/metadata/FAQ review for SEO, AEO and GEO.
- [Blogger images](skills/blogger-images/SKILL.md): supplied images, cover briefs, hosted variants and GitHub activation.
- [Blogger publishing](skills/blogger-publishing/SKILL.md): new entries, in-place updates, theme deployment and hosted verification.

These skills are stored in the repository. Invoke by asking to use `blogger/SKILL.md` (or a companion path); their presence here does not automatically install them in the global skill catalog.
