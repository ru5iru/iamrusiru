# Blogger UI comparison — 4 November 2026

Compared the original React application, the public application at `iamrusiru.lovable.app`, the installed theme at `ru5iru.blogspot.com`, and the corrected Blogger preview. This is a preservation pass: original components, colors, assets, copy and responsive layouts remain the reference.

## Surfaces reviewed

| Surface | Comparison and corrections |
| --- | --- |
| Header / mobile navigation | Restored working theme/menu buttons, collapsed mobile menu, Escape handling, source button spacing and correct current-page highlighting. External Portfolio links are not highlighted as Home. |
| Hero | Kept source portrait, composition and responsive type scale; replaced the code badge text that Blogger rendered blank with the equivalent SVG icon. |
| Homepage / post cards | Restored original excerpts, reading times, cover images, source dates, muted hashtag chips and author metadata spacing. Category labels are not repeated as hashtag chips. |
| Sidebar | Topics first and aligned with the post list; source-like tag density and frequency sorting. Kept native search/archive/widgets; styled their text and spacing. Suppressed the duplicate Header gadget and an unconfigured, empty Profile gadget. |
| Articles | Restored back arrow, clock, category/date/tag hierarchy, source reading measure, author role and avatar sizes. Imported dates no longer show the preceding calendar day because of the blog timezone. |
| Contents panel | Restored the source card, heading, indentation, active-section state and viewport-height scrolling. FAQ questions and duplicate related links no longer enter the article TOC. |
| Code / prose / callouts | Kept exact code text, source colors, blocks, image assets and prose styling; restored working copy buttons and reading progress. Code scrolls inside its block. |
| Sharing / citation | Reused source share controls and citation framing. Added working encoded Blogger links, copy-link feedback and native sharing where available. |
| Related posts / FAQ / author bio | Reused source related-post cards; restored thumbnail sizing, responsive columns and author bio. Moved the already-imported FAQ after related posts, restored question/answer sizes and card spacing, removed the duplicate imported related section. |
| About | Removed the extra Blogger page container padding and constrained width; retained source sections, portrait and links. |
| Contact | Restored source horizontal spacing and page geometry; retained original contact links. |
| Privacy / Cookie Policy | Removed doubled mobile padding and incorrect page width; retained source legal content. |
| Search / labels / archive / pagination | Retained native Blogger result pages and older/newer navigation, source-style controls, active topic/tag highlighting, clear-filter and empty-result links. |
| Error page | Restored the original 404 composition, return button and recent-post cards. |
| Footer / back to top | Kept original links and footer styling; restored the source icon and working scroll control. |
| Comments | Kept Blogger's native threaded comment include/editor, styled headings and container, and added an accessible iframe title. No comments were submitted during this review. |

## Root cause affecting multiple controls

The installed page contained literal `<![CDATA[` markers at the beginning of inline scripts. Chrome reported `Unexpected token '<'`, preventing theme switching, menu collapse and article tools from initializing. The theme now uses JavaScript-commented CDATA delimiters. The local renderer preserves Blogger's serialization behavior, and regression checks execute the serialized scripts rather than hiding the problem.

Route-specific display branches also compared URL objects using `contains`. They now compare against the blog homepage plus the intended path. Source metadata is rendered in native Blogger branches; a small client manifest additionally reconciles already-published imports. Social metadata still renders on the server without JavaScript.

## Verification

- Screenshot comparisons for home, long-form article, code article, all four Pages and 404 at 1440px and 390px; result, filter and empty views also captured. Additional responsive checks at 768px.
- All 23 currently published Blogger articles opened successfully at mobile width, with article bodies present and no markup-failure message or horizontal overflow.
- All 23 corrected article previews compared with their corresponding React routes at desktop and mobile widths, including titles, exact code text, TOC and FAQ placement.
- Corrected representative previews have no browser JavaScript errors or horizontal overflow. Checked menu/Escape, theme persistence, code/link copy, TOC, search/filter links and pagination.
- Automated XML, native expression, imported-content and no-JavaScript social metadata checks cover all 27 content routes. Additional regressions cover serialized scripts, external navigation and unavailable related feeds.
- Screenshot evidence is in the repository's `output/playwright/`: `audit-source-*`, `audit-live-*`, `fixed-*` and `final-*`. The screenshot files are review artifacts and are not part of the theme upload.

## Intentional platform differences and limits

Native Blogger search, archives, pagination and comments are retained. Their additional UI changes page height compared with React, which has no equivalent comment editor. Cross-origin comment-frame internals remain controlled by Blogger.

The original application declares DM Serif Display, Roboto and JetBrains Mono, but its Google Fonts import follows Tailwind directives and is dropped by Vite; the deployed original consequently uses fallback faces. The Blogger theme loads the declared fonts. This can change text wrapping relative to a screenshot of the fallback fonts. The original application was not changed as part of this Blogger repair.

The design detector reports the original Roboto choice and colored blockquote border. Both are deliberately retained to preserve the supplied design.

Follow-up restore fix: Blogger rejected the Tags widget's `sorting=FREQ` enum. The theme now exports `ALPHA`, orders the native counts by popularity in JavaScript, and rejects the invalid setting at build time. With JavaScript disabled, the tag list uses alphabetical ordering. No styles or published content were removed for this fix.

These changes are packaged locally. They require restoring the new theme on Blogger before the live site reflects them. The local preview does not implement Google's theme compiler or comment service; native save/restore and hosted interaction checks remain necessary after upload. Published posts and Pages do not need reimporting.
