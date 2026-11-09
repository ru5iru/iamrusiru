# Primary sources and how they were used

Research captures: 6 November 2026; report completed 7 November, Asia/Colombo. Peer observations are first-party HTTP/HTML evidence, not claims copied from SEO list articles.

| Source | Use / boundary |
| --- | --- |
| [Pinned Tranco V355N list](https://tranco-list.eu/list/V355N) and [methodology](https://tranco-list.eu/) | Reproducible aggregate popularity selection with subdomains, generated 5 November from 7 October–5 November inputs. It does not measure Google rankings, SEO quality, visits or AI citations. The direct list page was captured when the web index could not retrieve that exact new ID. |
| [Tranco research paper](https://doi.org/10.14722/ndss.2019.23386) | Required authorship/reference: Le Pochat et al., NDSS 2019. Ranking comparability and manipulation/selection limitations. |
| [Majestic Million](https://majestic.com/reports/majestic-million) | Initial candidate source rejected because the downloaded list did not rank the individual Blogspot publications needed here. CC BY 3.0 attribution retained; it supplies none of the final peer ranks. |
| [Google generative AI optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | Search fundamentals, helpful original content, accessible text and clear structure apply to generative discovery. No mandatory special AI schema or guaranteed citation recipe. |
| [Google's supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags) | Description/robots controls; legacy meta keywords are not a Google ranking requirement. |
| [Structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | Distinguish supported microdata/JSON-LD from actual validity and eligibility. Declared types alone prove neither correctness nor enhanced search appearance. |
| [Google robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) | Combine HTTP/meta/snippet policies; public eligibility is not actual indexing. |
| [Google image guidance](https://developers.google.com/search/docs/appearance/google-images) | Discoverable, relevant images and responsive delivery; metadata presence alone is not an image-quality pass. |
| [W3C content structure](https://www.w3.org/WAI/tutorials/page-structure/content/) | Semantic lists/articles/sections improve meaningful, reusable markup and assistive interpretation. Basis for R02. No search ranking effect was measured. |
| [W3C tables guidance](https://www.w3.org/WAI/tutorials/tables/) | Proper data/header cells and relationships. Basis for the OWASP mapping-table recommendation, not an instruction to add tables to every post. |
| [Google Search documentation updates](https://developers.google.com/search/updates) | FAQ rich results retired beginning 7 May 2026; June guidance clarifies that `llms.txt` is not needed for Google Search. Visible useful FAQs can remain. |
| [Search generative AI control](https://support.google.com/webmasters/answer/16908024) and [performance report](https://support.google.com/webmasters/answer/16984139) | Owner-only inclusion/inheritance and measurement verification, separate from training preference. No property values were inspected. |
| [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) | Search, training and user-directed crawler roles differ. Robots permission or a synthetic request does not establish real crawler-IP access or citations. |
| [Blogger settings](https://support.google.com/blogger/answer/9691230?hl=en) | Blogger owns privacy/search settings, robots and editor Search description workflow; restoring XML does not change all account settings. |

All 20 peer home/article URLs, robot/sitemap probes, capture timestamps and exclusions are recorded in `peer-evidence.json`, `peer-comparison.csv` and the request manifests. Every recommendation uses these observations together with the applicable primary guidance; it does not assume a peer's implementation caused its rank.
