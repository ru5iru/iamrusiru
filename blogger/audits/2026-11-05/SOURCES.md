# Audit standards and primary sources

Reviewed 5 November 2026. These sources define the audit's technical expectations; actual site findings come from captured HTTP/browser/source evidence. No third-party “SEO score” or purported AI ranking metric was treated as authoritative.

| Source | Used for |
| --- | --- |
| [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical) | Public access, successful responses and indexable content; eligibility versus actual indexing. |
| [Robots meta and X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) | Restrictive HTTP/meta controls and their precedence. |
| [robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) | Crawl groups/path rules; robots permission is not an indexing guarantee. |
| [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Blogger canonical URLs, tracking/mobile duplicates and future permalink-change policy. |
| [Titles](https://developers.google.com/search/docs/appearance/title-link) and [descriptions](https://developers.google.com/search/docs/appearance/snippet) | Relevant, clear title/snippet candidates; search presentation can be rewritten. |
| [Supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags) | Google ignores legacy meta keywords for indexing/ranking. |
| [Article markup](https://developers.google.com/search/docs/appearance/structured-data/article), [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [general schema policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) | Accurate visible-content entities and supported formats; general validity versus Google-specific eligibility. |
| [Image guidance](https://developers.google.com/search/docs/appearance/google-images) | Fetchability, descriptive alternatives, responsive delivery and image context. |
| [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Reliable evidence, useful original explanations and accountable authorship. |
| [Current generative AI optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | Foundational SEO, non-commodity helpful content, no special AI markup/llms.txt requirement or ideal word count. |
| [Google Search AI features](https://developers.google.com/search/docs/appearance/ai-features) | Crawl/index/snippet prerequisites; read together with the newer guide/control documentation. |
| [Search generative AI control](https://support.google.com/webmasters/answer/16908024) | Current Search Console inclusion/inheritance choice, separate from training policy. |
| [Generative AI performance report](https://support.google.com/webmasters/answer/16984139) | Owner-only AI visibility measurement; absence of data does not prove no technical implementation. |
| [Search documentation changes](https://developers.google.com/search/updates) | FAQ rich-result retirement beginning May 7, 2026 and June llms.txt clarifications. |
| [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) | OAI-SearchBot versus GPTBot versus ChatGPT-User; search/training/user-directed roles differ. |
| [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) | Claude-SearchBot, ClaudeBot and Claude-User distinctions and owner controls. |
| [Bing AI Performance introduction](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) and [expanded visibility insights](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/) | Citations and visibility are distinct from ordinary click/ranking measurements. Private property data was unavailable. |
| [Blogger settings](https://support.google.com/blogger/answer/9691230?hl=en), [search guidance](https://support.google.com/blogger/answer/41373?hl=en), [publishing](https://support.google.com/blogger/answer/154172?hl=en), [layout data](https://support.google.com/blogger/answer/47270?hl=en) | Native Settings/editor/Labels/description/publishing and data scoping; local JavaScript is not the native compiler. |
| [Web Vitals](https://web.dev/articles/vitals) | Lab/field distinction; CWV measurement requires appropriate aggregation, including field INP. |
| [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 4.5:1 ordinary text and 3:1 qualifying large text. |
| [WCAG non-text content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) | Meaningful image alternatives or explicit handling as decorative/redundant content. |
| [OWASP Top 10 2025](https://top10.owasp.org/2025/) | Injection A05 and Cryptographic Failures A04 in the current cited edition. |
| [OWASP 2021 Broken Access Control](https://top10.owasp.org/2021/A01_2021-Broken_Access_Control/) | Testing coverage versus vulnerability incidence; context for the 94% claim. |

General schema validation used [Schema.org Validator](https://validator.schema.org/); Google's [Rich Results Test](https://search.google.com/test/rich-results) required sign-in during this run. PageSpeed's public API returned quota-exhausted HTTP 429. Those external-tool limits are recorded explicitly and are not fabricated pass/fail results for the site.
