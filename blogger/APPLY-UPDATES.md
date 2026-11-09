# Apply the Blogger theme and post improvements

Prepared **7 November 2026** from the twenty-site benchmark. This package does not sign in to Blogger or change the public blog. Existing CSS, colors and fonts are retained; lists and the OWASP table now use the existing semantic list/table styles.

## 1. Back up

Download the current theme from **Blogger → Theme** and back up content under **Settings → Manage blog → Back up content**. Keep copies of newer native edits before replacing bodies.

**Do not import feed.atom into the existing live blog.** It is only for an empty/fresh blog and can duplicate entries. Theme restore cannot change saved post bodies, titles, Search descriptions or Pages.

## 2. Restore the theme

In **Theme → Restore**, upload **iamrusiru-blogger.xml** from the extracted package. The project copy is **blogger/output/iamrusiru-blogger.xml**. If Restore hides an error, use **Theme → Edit HTML**, paste that generated XML and Save to see the exact validation message. Do not upload the source template.xml.

The update retains server-rendered metadata, canonicals, social fields, article/author/breadcrumb/FAQ semantics and intended index rules. It adds native responsive thumbnails and a versioned Popular Posts repair using the existing saved widget's styles.

Check **Layout** for the existing header, hero, topics, sidebar and footer. Blogger may retain saved widget settings/custom includables during restore. On home, inspect raw source for **PopularPosts1**: its thumbnails should have empty alt, width 60 and height 60. If old markup remains, find the entire existing PopularPosts1 widget element in **Edit HTML** and replace it with **widget-updates/popular-posts.xml**. Keep its sidebar position and only one widget with that ID. Back up before editing.

## 3. Update all 23 existing posts

All exported bodies now contain semantic lists, one relevant contextual internal link, preserved code/FAQs and, where appropriate, additional primary references. The OWASP guide also contains a proper comparison table. The references do not certify every claim or code example.

For each row in **post-updates.csv** or **post-updates.json**:

1. Match its exact published URL and open that existing entry under **Posts**. Preserve its permalink and original publication date.
2. Back up the current body. In **HTML view**, paste the matching **post-updates/SLUG.html**. If you have newer native edits, merge those deliberately instead of overwriting them. These files contain only body HTML.
3. Set the **Title** and **Search description** from the same row. If the description field is hidden, enable **Settings → Meta tags → Enable search description**. Keep relevant Labels. The intent column is a writing brief, not a keyword list to paste into the description.
4. Preview and **Update**. Check the cover, bullets/steps, code copying, FAQ answers and sources. Check the OWASP table on mobile. After Compose editing, inspect HTML again to confirm the semantic markup survived.

Two titles specifically need native editor updates even if previous body corrections are already live:

| Existing post | Correct Title |
| --- | --- |
| /2026/06/injection.html | Injection OWASP Top 10 2025: A05 Explained for Developers |
| /2026/05/cryptographic-failures.html | Cryptographic Failures: OWASP A04 (2025) and A02 (2021) |

The theme continues to respect native Blogger titles. Installing XML alone cannot rename entries. Native Title also supplies H1, social titles and the structured headline. Blogger records the real modification time; keep publication dates unchanged.

## 4. Update the Privacy Page

Open the existing **Pages → Privacy Policy** entry and preserve its URL. Use **page-updates/privacy-policy.html** for its body and the Search description from **page-updates.json**. This corrects the destination identity and records the identity edit date. About, Contact and Cookie bodies need no replacement for this release.

Review service, contact, newsletter, analytics, cookie and data-handling claims against what you actually operate. This release does not assume they are all accurate or provide legal-compliance certification.

## 5. Upload and activate responsive cover images

Follow [IMAGE-PUBLISHING.md](IMAGE-PUBLISHING.md): upload the generated WebP files, fill their real public URLs, run the verification/activation command, then rebuild and publish the new XML/post bodies. Until activation, covers retain their working originals; native Blogger thumbnails already have responsive support.

You can publish the semantic theme/post fixes first and activate cover variants later. Do not paste blank upload-map URLs into HTML or point to unpublished GitHub files.

## 6. Optional Engineering reading guide

**page-drafts/engineering-start-here.html** is a prepared native Page grouping existing security, delivery, review and tutorial posts. Create it only if useful to readers. Set Title/Search description from **page-drafts.json**, preview and publish. Then add its **actual published URL** to an appropriate existing navigation gadget in Layout. This release adds no link to an unpublished Page.

## 7. Verify the hosted result

From the project directory run:

```powershell
npm run verify:blogger:live
```

The read-only check compares 28 core URLs with the new release: metadata/build ID, titles, canonicals, index rules, structured keywords, FAQ counts, updated body text, semantic lists/table, code examples, widget image attributes and Privacy identity. Dated results are saved under **blogger/output/verification**. A deliberate newer native body/description may need manual reconciliation; do not overwrite it blindly just to pass the check.

Also check home, a post, About and Privacy with **?m=1**; search/label/archive links; an unknown URL returning 404/noindex; and menu, theme toggle, code copying, TOC and comments. A local preview approximates Blogger. Restoring/saving on a test blog and a controlled native post/Page editor round-trip remain final platform checks.

For new content, write a unique native title/Search description, use relevant Labels, and paste optional styled snippets in HTML view. Keep one theme-supplied H1. Use real HTML list/table elements rather than typed Markdown. Keep useful visible FAQs and matching answers. See [WRITING.md](WRITING.md) and [SEO-GUIDE.md](SEO-GUIDE.md).

## 8. Complete owner-only checks

- Keep **Visible to search engines** enabled. Review working robots settings rather than replacing them unnecessarily; robots-txt.example.txt is optional. Theme restore does not change account settings.
- In Search Console/Bing Webmaster Tools, check **/sitemap.xml**, **/sitemap-pages.xml**, actual indexing and selected canonicals. Inspect corrected post URLs after publishing. Legal Pages remain intentionally noindex.
- Review search/generative-search controls separately from training preferences and measure actual search/AI citations/referrals where reports are available. Markup alone does not establish them.
- After image activation, measure PageSpeed/field results and real-device accessibility. Verify layout shifts, LCP and INP using appropriate methods. Color/contrast redesign remains outside this style-preserving release.

The original benchmark is unchanged under **blogger/research/2026-11-06-top20**. Current implementation progress and owner tasks are recorded in [changes/2026-11-07.md](changes/2026-11-07.md).
