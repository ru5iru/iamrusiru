# Blogger publishing packet

Use this contract for a new post, new Page or a requested editorial update. Read the active configuration and actual user content; sample titles and topic names in older guides are not new article requirements.

## Files

Save under `blogger/drafts/SLUG/` unless the user names another destination:

| File | Contents |
| --- | --- |
| `body.html` | Complete body-only HTML ready for Blogger's HTML view. All intended sections, useful FAQs and references are in this file, not detached snippets that the owner must assemble. |
| `publishing.json` | Separate editor fields and editorial/image/source information using the keys below. |
| `publish.md` | Copyable native fields, exact installation/update steps, verification results and outstanding actions. |

Do not populate `blogger/output/post-updates/` or edit shared React post data simply to author a native Blogger entry. Those paths belong to a different source-export workflow. If the user explicitly requests source integration, preserve existing paths and update the Blogger-specific layer; follow the project's build/test requirements.

## publishing.json

Use these keys. JSON values are actual article data, not instructional placeholders.

| Key | Type / use |
| --- | --- |
| `kind` | `post` or `page`. |
| `title` | Complete native Title, plain text. Social/document/H1 wording follows the native field unless an explicit route override exists. |
| `searchDescription` | Unique plain-text summary. Aim for a concise field-friendly description, usually up to 150 characters; report length for review rather than claiming a ranking threshold. |
| `author` | Supplied author name or configured default. Do not fabricate credentials or first-person experience. |
| `slug` | For a new entry, lowercase descriptive words separated by hyphens. For an existing entry retain its exact current slug, including any legacy spelling. |
| `existingUrl` | Actual existing HTTPS post/Page URL for updates; otherwise `null`. |
| `publicationDate` | Supplied/verified original ISO date/timestamp or requested new publication date; otherwise `null`. Do not manufacture one from the current date or URL month. |
| `topic` | One suitable configured topic for posts; `null` for Pages. |
| `labels` | Relevant consistent native Labels, including `topic`, for posts; `[]` for Pages. |
| `primaryPhrase` | Main question/topic phrase for editorial planning; Blogger has no focus-keyword field. |
| `supportingPhrases` | Relevant supporting phrases, as an array. Do not paste this array into Search description. |
| `bodyFile` | `body.html`. |
| `cover` | `null`, or `{ "url": "actual public HTTPS image URL", "alt": "accurate alternative", "width": actualWidth, "height": actualHeight }`. The cover must appear in `body.html` with matching attributes. |
| `imageBrief` | Specific subject/composition/alt guidance when a cover still needs creating/uploading; otherwise `null`. Do not describe an unseen image as if inspected. |
| `faq` | Array of `{ "question": "plain text", "answer": "plain text" }`, or `[]`. Exact visible text must match body microdata after whitespace normalization. No mandatory question count. |
| `sources` | Array of `{ "title": "source title", "url": "HTTPS URL", "supports": "claim or section", "verification": "what was actually checked" }`, or `[]` when sources are not needed. Distinguish further reading from direct claim support. |
| `internalLinks` | Array of actual root-relative or same-site HTTPS destinations used contextually in the body, or `[]`. Check current inventory/live destinations when available. |
| `reviewNotes` | Array describing material uncertainties, required uploads, editorial decisions or missing evidence; otherwise `[]`. Do not claim publication-ready status while hiding a material gap. |

For a Page, optional structured keyword phrases can use the existing end-of-body snippet when no route already supplies them. Do not insert legacy head metadata or pretend Pages have Labels.

## Body composition

Match the existing components rather than requiring a fixed article outline:

- Summary/answer near the beginning when useful, using the existing `summary.html` classes.
- Descriptive H2/H3 sections. Blogger creates the only article H1; avoid a duplicate article title inside the body.
- Native list/table semantics; use column/row header associations for data tables. A caption can provide useful context.
- Code as escaped `pre/code`, or the existing styled code snippet. Preserve exact code content and language. Use callouts only where they help explain a warning, tip or distinction.
- A cover only when its real public URL is known. Preserve original art/crop, accurate intrinsic dimensions and responsive variants where available. No speculative raw GitHub URL, fake size descriptor or unresolved image placeholder.
- Useful contextual internal links, and source references for claims that need evidence. Do not turn every article into an arbitrary quota of links.
- A relevant FAQ section using the maintained snippet if needed. Each Question has visible `name` and an accepted Answer with visible `text`. No schema-only hidden answers or duplicate JSON-LD.
- A clear takeaway/next step that fits the supplied material. Personal accounts remain personal; do not turn them into unsupported universal or medical/legal claims.

Keep unused starter text, instruction comments, raw Markdown syntax and source/link placeholders out of finished body HTML. Illustrative code samples can contain intentional literal tokens; explain them in the prose.

## publish.md handoff

Start with copyable **Title**, **Search description** (and its character count), **Labels/topic**, **permalink slug** and **author/date information**. Separate the primary/supporting phrases as writing notes. Explain that the native title/description supply social fields automatically.

Then give the appropriate workflow:

- **New post:** Posts → New post; set Title/Labels/Search description; paste `body.html` in HTML view; choose the slug before first publish; upload any pending image; Preview and publish when authorized.
- **New Page:** Pages → New page; no Labels; paste body without H1; set Title/Search description; publish before linking its actual URL in Layout.
- **Existing entry:** identify the exact existing URL; back up/merge newer edits; replace only the intended body/fields; keep permalink and original publication date; Preview → Update. Preserve comments and entry identity. Never reimport the feed.

If the Search description field is absent, enable Settings → Meta tags → Enable search description. Do not paste keyword arrays into that field.

State which local checks, source checks, URL checks or visual previews actually ran. After saving on Blogger, inspect raw source and mobile rendering, metadata/robots/canonical values, links, images, code and FAQs. A newly authored native URL may not appear in the source-export verifier's inventory: inspect it separately rather than claiming `verify:blogger:live` covered it. Run that verifier for a deployed source export when applicable. Indexing and AI citations require owner reports, not inference from a local pass.
