# Blogger repository split

Blogger source, publishing content, packages, documentation, skills, audits and research moved on 2026-11-09:

- Private blog: https://github.com/ru5iru/iamrusiru-blog
- Public reusable MIT template: https://github.com/ru5iru/blogger-template

Local checkouts are sibling folders named iamrusiru-blog and blogger-template. Run npm ci, npm run build and npm test in the appropriate repository. Blogger build/preview/verification commands are no longer part of this React application.

The private blog owns copies of its presentation components, post records, Pages and media under blogger/source. The reusable template owns generic presentation and has no imported personal content. Both include the complete theme engine and authoring skills. The React application retains its own components/data/styles, prerender plugin and images because it still uses them. Its route-specific social metadata remains prerendered at build time.

Existing Blogger images use the public URLs at https://raw.githubusercontent.com/ru5iru/iamrusiru/main/src/assets/. Keep those shared public files available until replacement hosting is verified and deployed. A private repository cannot serve anonymous image URLs. This split does not change the live Blogger theme, posts, permalinks, publication dates or image URLs.

The private standalone build reproduces the previous theme XML, feed, content, SEO inventory and publishing CSV byte-for-byte, with build ID 09e978d6e6220609a162. Its 28 regression tests passed. The generic template passed four independent tests, including native post/Page metadata and second-owner customization without CSS changes. Credentials, environment files, browser sessions and dependency caches were excluded.

Both standalone repositories also passed their GitHub Actions workflows on clean Linux runners. After removing Blogger sources, this React application built successfully, prerendered all 28 routes, and passed all 14 tests, including route-specific metadata checks.

Existing Git history is preserved. This migration removes the Blogger files from the current feature branch; it does not erase files from earlier commits or rewrite public history.
