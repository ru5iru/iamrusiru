# Selection, fetch method and limitations

HTTP snapshot: **6 November 2026**; report completed **7 November 2026, Asia/Colombo**. The task is a Blogger-only comparative study and checklist verification. No theme, posts, Pages, styles or settings were edited. The separate React application was not audited.

## What “top 20” means here

We use [Tranco list V355N, including subdomains](https://tranco-list.eu/list/V355N), generated **5 November 2026**, aggregating CrUX, Farsight, Majestic, Cloudflare Radar and Umbrella ranks from **7 October–5 November 2026**. The pinned list page was fetched directly and retained locally. Tranco is an aggregate popularity ranking, **not verified visits, Google search rank, content quality or AI-citation frequency**. [Tranco methodology and limitations](https://tranco-list.eu/)

Selection is reproducible:

1. Download the pinned top-million CSV and filter single-label `*.blogspot.com` hosts. This yields **72 candidates**; the aggregate `blogspot.com` domain and custom-domain Blogger publications are excluded from this specific study.
2. Walk candidates in ascending global rank. Require public HTTP 200 HTML on a Blogspot destination, a Blogger footprint and a discoverable same-blog post permalink with readable article-body markup.
3. Exclude unavailable/non-HTML homes, sites redirected away from Blogspot, homes without an auditable post link, and unavailable/empty/off-host sampled articles. Respect root/post robots policy before further crawling; do not interact with content/age/login gates or execute publisher scripts.
4. Stop at 20 eligible sites. **32 candidates** were considered: 20 selected, four unavailable/non-HTML homes, four without a usable post permalink, three without a readable same-blog article body, and one redirected off Blogspot. The full selection ledger is in `peer-evidence.json`.

These are therefore the **20 highest-ranked publicly auditable Blogspot publications under these eligibility rules in this snapshot**. They are not an exhaustive global top 20, a handpicked list of “best SEO blogs,” a niche-matched engineering cohort or endorsements. Some ranked sites are lottery, streaming, adult or short-link publications. Their popularity cannot establish trustworthy sourcing, originality, factual accuracy or optimization intent.

Majestic Million was investigated first but rejected for individual-blog selection: its million-row download yielded only the `bp.blogspot.com` asset host under the chosen filter. That result and attribution are retained in `rejected-majestic-source.json`; it is not used to assign the peer ranks. No paid list, login or paywall was bypassed. No replacement rankings were invented.

## What was fetched

- For each selected site: home, one post discovered from home, robots.txt, posts sitemap, Pages sitemap, `llms.txt` probe and the post's `?m=1` variant. A same-blog About Page was fetched when explicitly discoverable through the sampled navigation. The chosen post is the first usable discovered permalink; it is **not guaranteed to be the newest article**—some homes pin old entries.
- **168 peer/candidate HTTP requests**: 108 initial discovery/selection requests and 60 extra probes. All 20 selected home/post pairs returned 200. Exact URLs, status, headers, capture times, byte sizes and raw-file references are retained in the request manifests.
- For the current project: all **28 local Blogger fixtures**, fresh home/all 23 posts/four Pages, robots and both sitemaps, plus seven mobile/utility/error variants: **38 fresh public requests**. The live build fingerprint matches `31c41a6463051a21979f` on all core routes.
- All 23 live post bodies were normalized and compared with prepared body HTML. Titles, descriptions, structured keywords, FAQ counts, literal Markdown list/table patterns and policy identity were checked separately.

HTML was parsed without executing scripts. No peer images, media, book/application downloads, account pages or gated content were fetched as part of this comparison. Third-party JS redirects were not executed. Raw responses are retained locally under `output/playwright/blogspot-top20-2026-11-06/`, ignored by Git and excluded from the report ZIP. The report republishes feature observations, not article prose.

## Interpretation rules

- “Observed” means a declared feature in sampled HTML/headers, not a proven improvement since an earlier version. Publisher intent, implementation history and causal search/AI gains are unknown.
- HTML snapshots miss JS-created features; an explicit component absent from this sample may exist on other articles. FAQ/summary/TOC detection is conservative. Question-heading detection uses punctuation/English prefixes and is not a full multilingual semantic review.
- Structured-type counts merge microdata and parsed JSON-LD. Presence does not certify a valid graph, meaningful values, truthful authorship or Google rich-result eligibility. JSON-LD is not inherently preferable to supported microdata.
- Outbound links are not automatically citations; many peer links are promotions, profiles or downloads. No count of “verified primary-source articles” is inferred from the 17 outbound-linked samples.
- Image metrics describe HTML attributes, not actual responsive presentation, image content, transfer efficiency or field CWV. Images can reserve space through CSS rather than width/height attributes. One sampled article has no images, so image-control denominators are 19.
- T01/T02/T08 are partly determined by the eligibility rules; their 20/20 counts are selection-biased. Empty Pages sitemaps can be appropriate when no Pages are published.
- No private Search Console/Bing reports, analytics, actual AI citations, Search generative AI property settings, real crawler-IP traffic, full claim/code execution review, peer browser audit or field performance data was available. These stay explicit verification tasks.

## Attribution and reproducibility

Ranking reference: Victor Le Pochat, Tom Van Goethem, Samaneh Tajalizadehkhoob, Maciej Korczyński and Wouter Joosen, **Tranco: A Research-Oriented Top Sites Ranking Hardened Against Manipulation**, NDSS 2019, [doi:10.14722/ndss.2019.23386](https://doi.org/10.14722/ndss.2019.23386). The upstream providers and their licenses are described on [Tranco's site](https://tranco-list.eu/). The rejected Majestic source is attributed to [Majestic Million](https://majestic.com/reports/majestic-million), CC BY 3.0.

Collector scripts use existing project dependencies and only write research/ignored evidence. Re-running network collectors can replace captures; preserve this dated snapshot before a future study. The direct latest-ID lookup selected V355N; cached web-index pages showed older IDs, so the actual downloaded/pinned ID and direct page evidence take precedence.
