# Post and Page content audit

Audit snapshot: 5 November 2026 (Asia/Colombo). All 23 published posts and four Pages were fetched and compared with exported source data. Full fields, intended/live descriptions and keyword lists are in [post-audit.csv](post-audit.csv) and [post-audit.json](post-audit.json).

## Common findings across posts

- **Resolved visibility:** all 23 posts now have no restrictive HTTP X-Robots-Tag. Former F01 is closed; actual indexing requires owner Search Console evidence.
- **F02:** every post uses the same generic head description.
- **F03:** curated route metadata does not activate in the native output; current structured keywords are Blogger Labels. Legacy keyword tags are not a Google ranking requirement.
- **F05:** zero external links in article bodies. Source placeholders are present in three posts. Related internal links and the site's self-citation box are not primary evidence for technical claims.
- Existing summaries, headings, code and **129 FAQs** are server-readable. Word counts describe content scope; they are not SEO quality thresholds.

## Every published post

Keywords column = live structured keyword count / intended curated count. Equal counts do not imply equal phrases. Each row also has the common gaps above.

| Post | Raw body words | FAQs | Distinct source placeholders | Keywords live/intended | Additional review |
| --- | ---: | ---: | ---: | ---: | --- |
| [proper-project-planning](https://ru5iru.blogspot.com/2026/06/proper-project-planning.html) | 3005 | 7 | 0 | 5/15 | Common gaps |
| [injection](https://ru5iru.blogspot.com/2026/06/injection.html) | 1707 | 7 | 0 | 6/13 | F06 |
| [cryptographic-failures](https://ru5iru.blogspot.com/2026/05/cryptographic-failures.html) | 2231 | 7 | 3 | 7/14 | F05-placeholders, F06 |
| [broken-access-control](https://ru5iru.blogspot.com/2026/05/broken-access-control.html) | 1958 | 7 | 1 | 7/14 | F05-placeholders, F06 |
| [work-life-balance-for-developers](https://ru5iru.blogspot.com/2026/04/work-life-balance-for-developers.html) | 2000 | 6 | 2 | 6/11 | F05-placeholders |
| [drupal-page-caching](https://ru5iru.blogspot.com/2026/04/drupal-page-caching.html) | 1996 | 6 | 0 | 6/12 | Common gaps |
| [code-review-security-platform](https://ru5iru.blogspot.com/2026/04/code-review-security-platform.html) | 2163 | 7 | 0 | 9/11 | Common gaps |
| [vibe-coding](https://ru5iru.blogspot.com/2026/04/vibe-coding.html) | 1569 | 5 | 0 | 6/10 | Common gaps |
| [owasp-top-ten](https://ru5iru.blogspot.com/2026/03/owasp-top-ten.html) | 2337 | 7 | 0 | 6/14 | Common gaps |
| [clean-code-principles](https://ru5iru.blogspot.com/2026/03/clean-code-principles.html) | 1030 | 5 | 0 | 6/10 | Common gaps |
| [switched-to-typescript](https://ru5iru.blogspot.com/2026/02/switched-to-typescript.html) | 794 | 5 | 0 | 6/11 | Common gaps |
| [cli-tool-rust](https://ru5iru.blogspot.com/2026/01/cli-tool-rust.html) | 767 | 5 | 0 | 5/11 | Common gaps |
| [books-better-engineer](https://ru5iru.blogspot.com/2026/01/books-better-engineer.html) | 678 | 5 | 0 | 5/11 | Common gaps |
| [react-server-components](https://ru5iru.blogspot.com/2026/01/react-server-components.html) | 762 | 5 | 0 | 6/11 | Common gaps |
| [fastapi-quickstart](https://ru5iru.blogspot.com/2025/12/fastapi-quickstart.html) | 555 | 5 | 0 | 6/11 | Common gaps |
| [side-projects-keep-me-sane](https://ru5iru.blogspot.com/2025/12/side-projects-keep-me-sane.html) | 670 | 5 | 0 | 6/10 | Common gaps |
| [code-review-etiquette](https://ru5iru.blogspot.com/2025/12/code-review-etiquette.html) | 672 | 5 | 0 | 6/11 | Common gaps |
| [dotfile-one-liners](https://ru5iru.blogspot.com/2025/11/dotfile-one-liners.html) | 649 | 5 | 0 | 6/11 | Common gaps |
| [burnout-and-recovery](https://ru5iru.blogspot.com/2025/11/burnout-and-recovery.html) | 817 | 5 | 0 | 6/10 | Common gaps |
| [debugging-production](https://ru5iru.blogspot.com/2025/11/debugging-production.html) | 611 | 5 | 0 | 6/10 | Common gaps |
| [git-workflow-tips](https://ru5iru.blogspot.com/2025/11/git-workflow-tips.html) | 652 | 5 | 0 | 6/11 | Common gaps |
| [why-i-journal-as-dev](https://ru5iru.blogspot.com/2025/11/why-i-journal-as-dev.html) | 595 | 5 | 0 | 6/11 | Common gaps |
| [docker-compose-dev](https://ru5iru.blogspot.com/2025/10/docker-compose-dev.html) | 535 | 5 | 0 | 6/11 | Common gaps |

## Pages

All four have the same generic head description. Fresh HTTP responses contain no X-Robots-Tag. Legal URLs are intended to remain noindex, while About and Contact are intended to be discoverable.

| Page | HTTP | HTML robots | Live semantic specialization | Specific review |
| --- | ---: | --- | --- | --- |
| [About me](https://ru5iru.blogspot.com/p/about.html) | 200 | index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1 | WebPage only | F03 subtype/owner semantics |
| [Contact](https://ru5iru.blogspot.com/p/contact.html) | 200 | index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1 | WebPage only | F03 subtype/owner semantics |
| [Privacy Policy](https://ru5iru.blogspot.com/p/privacy-policy.html) | 200 | index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1 | WebPage only | F03 legal policy; F13 identity |
| [Cookie Policy](https://ru5iru.blogspot.com/p/cookie-policy.html) | 200 | index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1 | WebPage only | F03 legal policy; F13 identity |

## Specific editorial checks

1. **Injection:** the question about OWASP Top 10 2025 answers with “A03 bugs”; the official 2025 list identifies Injection as A05. Label historical 2021 references or update the edition consistently in the title, lead, body, FAQ, descriptions and related anchors.
2. **Cryptographic Failures:** A02 references are valid for 2021, which the body discusses. Because the site's main guide is explicitly 2025 (A04), make that edition distinction clear in its title/lead/FAQ instead of implying a universal current rank.
3. **Cryptographic Failures, Broken Access Control, Work-Life Balance:** replace source-name placeholders with actual verifiable citations, and review unsupported statistics/security/health/legal statements before publishing them as authoritative advice. No claim about an author's personal experience has been independently verified here.
4. **All tutorials:** review relevant framework/runtime versions and actually execute their examples in a separate technical review. This audit checked theme rendering/HTML, not every tutorial program.
5. **Policies:** confirm the destination domain and actual Blogger services/cookies. Existing iamrusiru.com statements are not automatically valid for ru5iru.blogspot.com. This is an identity/content observation, not a legal-compliance certification.
6. **New native post acceptance test, next step:** use a test blog to save a unique title, Search description, Labels, cover, FAQ and Page; inspect raw HTML before/after edits. No public content was added during this audit.

## Limits of editorial verification

Every post was checked for structure, metadata, FAQs, links, images, placeholders and keyword configuration. The OWASP edition conflict was checked against the [official 2025 release](https://top10.owasp.org/2025/). Every technical/legal/health claim, personal anecdote and code example was not independently certified; these remain explicit editorial review tasks. Exact keyword occurrence is informational: synonyms, helpful content and intent matter more than forced repetition.

## Additional confirmed statistical issue

Broken Access Control says 94% of tested applications showed an access-control weakness. The [original OWASP 2021 source](https://top10.owasp.org/2021/A01_2021-Broken_Access_Control/) describes testing coverage and an average incidence rate of 3.81%; coverage must not be presented as vulnerability prevalence. This is part of F06, alongside the edition-labeling review.
