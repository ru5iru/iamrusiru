# Apply the Blogger visibility fixes

Prepared 6 November 2026. These are local theme/post changes. They take effect publicly only after you save the theme and update the existing posts in Blogger. The React application and existing CSS/colors/fonts have not been changed.

## 1. Update the theme

Back up the current theme through Blogger first. In **Theme → Restore**, upload `iamrusiru-blogger.xml` from this package. If Blogger gives a validation error, use **Theme → Edit HTML** to save the XML and capture the exact error. Published posts are separate from the theme.

The update changes native route comparisons to URL-valued `path()` expressions, ignores a repeated site description when selecting an article fallback, uses native Search descriptions, preserves complete titles, improves utility headings and omits malformed error canonical/social URLs. Native compilation and metadata priority still require hosted verification after installation. A successful local preview alone is not proof of that.

## 2. Update existing posts in place

**Do not reimport `feed.atom` into the current live blog.** It is for a fresh blog import and can duplicate existing entries. Theme restore cannot update saved post bodies or their editor fields.

Start with Injection, Cryptographic Failures, Broken Access Control and Work-Life Balance. Their body content has corrections to edition labels, statistics, unsupported generalizations and published source placeholders. No tutorial programs or personal experience claims have been independently certified.

For each existing post:

1. Find its exact published URL in `post-updates.csv` or `post-updates.json` and open that entry under **Blogger → Posts**.
2. Preserve its existing permalink and publication date. Copy its current body elsewhere as a backup, especially if you edited it after the source export.
3. Switch the editor to **HTML view**. Merge the corrections from `post-updates/SLUG.html`, or replace the body only if there are no newer edits to retain. These are body-only files; do not paste a complete document or XML theme into the post.
4. Set the **Title** and **Search description** from the same inventory row. Keep or refine its existing relevant Labels; do not paste the intent/keyword list into the description. The intent column is an editorial brief.
5. Preview, then **Update** the existing entry. Check its cover, code, FAQ answers and source links. If Compose normalized optional markup, inspect saved HTML again.

All 23 posts have a distinct suggested Search description and a reader-intent brief. The four corrected articles retain their existing URLs. Updates use Blogger's real modification timestamp; do not change publication dates to simulate freshness. The exported editorial date records the actual source correction date.

## 3. New posts and Pages

Enable **Settings → Meta tags → Enable search description** if needed. In a new post, write a clear title, set one configured topic Label plus useful related Labels, write a unique Search description, and use the optional styled blocks in `editor-templates`. FAQs should be genuine questions with accurate visible answers. Legacy meta keywords are optional and do not improve Google's ranking.

Without a saved description or configured route, the head falls back to the native title rather than the site-wide summary; article schema can use a body snippet. This is a fallback, not a substitute for writing a useful Search description. Do not add duplicate H1, description tags or FAQ schema to the body.

Pages use the same native description handling. About/Contact and configured legal routes get their configured semantics/index policy. Policy service claims and any new topic hub still need a separate owner/content review.

## 4. Verify the hosted result

After saving, inspect raw page source for home, the four corrected posts, About/Contact, legal Pages and a genuinely new native post/Page. Check one title/canonical/description per applicable key, topic-specific descriptions and OG/Twitter fields, visible/schema FAQ agreement and intended robots policy. Test `?m=1`, labels/search/archives and a missing URL. Missing URLs must stay 404/noindex.

From the project directory, after rebuilding, run:

```powershell
npm run verify:blogger:live
```

This read-only comparison checks the configured public blog against `blogger/output` and writes a dated result under `blogger/output/verification`. It will report the current live site as failing until the relevant theme/post updates are installed. Search Console indexing, actual AI visibility and authenticated editor saves remain owner verification tasks.

The audit baseline is retained under `blogger/audits/2026-11-05`; implementation progress and pending hosted checks are recorded separately under `blogger/changes/2026-11-06.md`.
