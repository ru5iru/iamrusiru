---
name: blogger-seo-review
description: Review a Blogger draft or published entry for SEO, answer clarity, generative discoverability, metadata, FAQ consistency and evidence. Use for a focused review or requested content optimization without redesigning the theme.
---

# Blogger SEO, AEO and GEO review

Read the active configuration, [SEO-GUIDE.md](../../SEO-GUIDE.md) and the relevant packet/body or live URL. For a packet, use [the contract](../../references/publishing-packet.md). Do not substitute an old audit snapshot for current evidence.

Review the actual reader question and answer first. Check truthful complete titles, unique native Search descriptions, coherent headings, useful summaries, real list/table semantics, escaped code, relevant internal links, authoritative claim support and accurate author/date context. Retain the author's meaning and existing styles. Neither word count nor keyword density is a quality score.

For posts, check the configured topic/Labels and whether imported/configured route phrases override native keyword values. Pages have no Labels. Avoid duplicate head metadata or redundant structured data. The theme already supplies article/site/author/breadcrumb semantics and social fields. New native content normally needs editor fields, not a rebuild.

For FAQs, compare every visible Question/Answer with the packet's `faq` entries and body microdata. Include only useful, supported questions; remove redundant graphs and schema-only answers. Do not promise a rich result or AI citation, or assume every article needs FAQs.

When factual claims, platform rules or current SEO recommendations matter, verify with current primary documentation. Useful starting points are [Google Search fundamentals](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [supported metadata](https://developers.google.com/search/docs/crawling-indexing/special-tags), [AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) and [Blogger settings](https://support.google.com/blogger/answer/9691230). Check current guidance before making feature-availability claims; do not freeze retirement dates into a reusable rule.

For live inspection, separate HTTP status/headers, raw server HTML, rendered behavior and private indexing/analytics evidence. Check canonical/robots/description/OG/Twitter consistency, native dates, image accessibility, schema/content agreement and relevant destinations. Follow the user's tool preferences; no connected account is required for a public HTML review. Do not infer indexing or AI citations from a 200 response, schema type or robots permission.

Deliver a short priority-ordered finding list with affected file/URL/field, evidence, a concrete fix and a way to verify it. Distinguish confirmed defects, optional improvements and unverified owner checks. If fixes are requested, make the scoped local changes and run appropriate checks. Preserve existing published URLs/dates and the theme design. State any remaining source/editor/account limits explicitly.

For local packets run:

```powershell
node blogger/scripts/validate-draft.mjs blogger/drafts/SLUG
```

Use [the authoring skill](../../SKILL.md) for a complete rewrite and [publishing](../blogger-publishing/SKILL.md) when installation or live verification is requested.
