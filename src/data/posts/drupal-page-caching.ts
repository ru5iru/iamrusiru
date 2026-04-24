import postDrupalCaching from "@/assets/post-drupal-caching.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Digging Deeper into Drupal Page Caching: A Developer's Guide",
  excerpt:
    "Drupal page caching stores fully rendered HTML for anonymous users so requests skip the bootstrap and database, often cutting response times from hundreds of milliseconds to under 50. Here is how the cache layers work, why they invalidate, and how to debug them in production.",
  date: "April 24, 2026",
  category: "Engineering",
  slug: "drupal-page-caching",
  readTime: "10 min read",
  imageUrl: postDrupalCaching,
  tags: ["Drupal", "CMS", "Drupal developer", "Drupal Cache", "performance"],
  content: [
    "Drupal page caching stores fully rendered HTML responses for anonymous users so subsequent requests skip the bootstrap, routing, and database layers entirely. When tuned well, it can drop average response times from 400ms to under 50ms on a stock LAMP stack. The catch: Drupal's cache system has at least four cooperating layers, and a misconfigured cache tag can silently serve stale content for weeks.",

    "I have been working with Drupal as a CMS for years, both as a backend Drupal developer and as the person paged at 2am when a homepage refuses to update. This post is the guide I wish I had when I started: how the Drupal cache actually works, where it breaks, and the practical patterns I use to keep it honest.",

    "## What Is Drupal Page Caching?\n\nPage caching in Drupal is the mechanism that stores the complete HTML output of a page so it can be served again without re-running the full request pipeline. For anonymous users, this means Drupal can short-circuit on the very first middleware and return a cached response in a few milliseconds.\n\nThere are two main built-in modules involved: the **Internal Page Cache** for anonymous users, and the **Internal Dynamic Page Cache** for both anonymous and authenticated users. They sound similar, but they cache very different things.",

    "## The Four Layers of the Drupal Cache\n\nMost developers think of \"the cache\" as a single thing. In reality, a Drupal request touches several caches before it returns a byte to the browser.",

    "### 1. Internal Page Cache\n\nThis is the fastest layer. It serves a fully rendered HTML page to anonymous users and bypasses almost the entire Drupal kernel. If a request hits this cache, you are looking at sub-10ms responses on most hardware.",

    "### 2. Internal Dynamic Page Cache\n\nThis caches page fragments after personalization placeholders are resolved. It works for logged-in users too, because it splits the response into cacheable and non-cacheable pieces using the **auto-placeholdering** system.",

    "### 3. Render Cache\n\nEvery render array in Drupal can declare its own cache metadata: cache keys, contexts, tags, and max-age. The render cache stores the output of individual blocks, fields, and views rows so they can be reassembled cheaply.",

    "### 4. Cache Backends (Database, Redis, Memcached)\n\nAll of the above layers ultimately read from and write to a cache backend. Out of the box, Drupal uses the database, which is fine for small sites. For anything serious, swap in Redis or Memcached. I have seen p95 latency drop by 60% on a busy editorial site just by moving cache bins out of MySQL.",

    "## Cache Tags, Contexts, and Max-Age\n\nThe Drupal cache is not time-based by default. It is **event-based**, driven by three pieces of metadata attached to every render array.",

    "- **Cache tags** describe what the cached item depends on, for example `node:42` or `user_list`. When the underlying data changes, Drupal invalidates everything tagged with it.\n- **Cache contexts** describe what the cached item varies by, for example `url.path`, `user.roles`, or `cookies:my_cookie`. Different context values produce different cache entries.\n- **Max-age** is the maximum number of seconds the item can be cached. A value of 0 means \"do not cache\", and `Cache::PERMANENT` means \"cache until invalidated by tag\".",

    "Getting these three right is 90% of the job. Most production caching bugs I have debugged came down to a missing cache tag on a custom block or a forgotten cache context on a personalized element.",

    "## A Real Scenario: The Stale Homepage\n\nLast year I inherited a Drupal 10 site where the homepage refused to update after content edits. Editors would publish a new featured article, clear the cache from the UI, and still see yesterday's headline. The fix took me two hours of digging.\n\nThe culprit was a custom block that pulled the latest article via a direct database query instead of an entity query. Because it bypassed Drupal's entity API, no cache tags were attached. The render cache happily stored the block output forever, and only a full cache rebuild would clear it.\n\nThe fix was four lines: wrap the query in `\\Drupal::entityQuery('node')`, add `$build['#cache']['tags'][] = 'node_list:article';` to the build array, and let Drupal handle invalidation automatically.",

    {
      type: "code",
      language: "php",
      code: `public function build() {
  $nids = \\Drupal::entityQuery('node')
    ->condition('type', 'article')
    ->condition('status', 1)
    ->sort('created', 'DESC')
    ->range(0, 5)
    ->accessCheck(TRUE)
    ->execute();

  $nodes = Node::loadMultiple($nids);

  return [
    '#theme' => 'featured_articles',
    '#nodes' => $nodes,
    '#cache' => [
      'tags' => ['node_list:article'],
      'contexts' => ['url.path'],
      'max-age' => Cache::PERMANENT,
    ],
  ];
}`,
    },

    "After this change, publishing any article automatically invalidated the block. No manual cache clears, no stale content, no 2am pages.",

    "## How to Debug Drupal Cache Issues\n\nWhen the cache misbehaves, I work through this checklist in order. It catches the vast majority of issues before I have to attach a debugger.",

    "1. **Check the X-Drupal-Cache header.** Look for `HIT`, `MISS`, or `UNCACHEABLE` in the response. If you see `UNCACHEABLE`, something downstream set max-age to 0.\n2. **Inspect cacheability metadata in the toolbar.** Enable the Web Profiler or the Cache Review module to see which tags, contexts, and max-age values applied to the page.\n3. **Verify cache tags are invalidated.** Use `drush cache:tags node:42` or query the `cachetags` table directly to confirm invalidations are firing.\n4. **Check for renderable arrays without cache metadata.** Custom blocks, preprocess hooks, and Twig extensions are the usual suspects.\n5. **Look at the cache backend.** If you are on Redis, run `redis-cli MONITOR` during a request to see exactly what is being read and written.",

    "## Internal Cache vs Reverse Proxy: When to Use What\n\nDrupal's internal page cache is excellent, but a reverse proxy like Varnish or a CDN sits in front of it and is even faster. They are not mutually exclusive: the typical production setup uses both.\n\nThe key integration point is the **BigPipe** module and Drupal's support for **cache tag headers**. Drupal can emit a `Surrogate-Key` or `Cache-Tag` header on every response, which Varnish and modern CDNs (Fastly, Cloudflare Enterprise) use to invalidate cached pages by tag. This means a content edit in Drupal can purge the matching CDN edge cache in under a second, globally.",

    "If you are running a small site, stick with the internal cache and Redis. If you are serving more than a few hundred requests per second, add Varnish or a tag-aware CDN. [INTERNAL LINK: Drupal performance tuning checklist]",

    "## Common Mistakes Drupal Developers Make\n\nThese are the patterns I see again and again in code reviews and audits.\n\n- **Calling `drupal_flush_all_caches()` in deploy scripts.** It works, but it nukes everything and causes a thundering herd on the next traffic spike. Use targeted `cache_tags` invalidation instead.\n- **Setting `max-age` to 0 to \"fix\" a bug.** This disables caching for the entire page and any parent render array. It is almost never the right answer.\n- **Forgetting `accessCheck()` on entity queries.** Drupal 9.2+ requires it explicitly, and missing it can leak unpublished content into cached output.\n- **Using `\\Drupal::time()->getRequestTime()` in cached output without a `time` cache context.** The first request's timestamp gets baked in and never updates. [SOURCE: Drupal.org cache API documentation]",

    "## Manual vs Automated Cache Invalidation\n\nThere are two schools of thought on cache management in Drupal. Manual invalidation, where developers explicitly clear caches after specific operations, gives precise control but is fragile. Automated invalidation through cache tags is the Drupal way: declare your dependencies, and the system handles the rest.\n\nIn practice, I aim for 95% automated and 5% manual. The manual escape hatch matters for edge cases like third-party API data refreshes or scheduled content publication, but everything else should ride on cache tags.",

    "## Quick Checklist for Drupal Cache Health\n\nBefore shipping any custom module or block, I run through this list:\n\n- Does every render array have appropriate `#cache` metadata?\n- Are cache tags attached to entity-dependent output?\n- Are cache contexts set for any user, URL, or cookie variation?\n- Is max-age either `PERMANENT` or a deliberate time value?\n- Does the response include the right `X-Drupal-Cache-Tags` header?\n- Are reverse proxy purges firing on content updates?",

    "## Key Takeaways\n\n- Drupal page caching is a multi-layer system, not a single switch, and understanding the layers is essential for any Drupal developer working with the CMS at scale.\n- The Internal Page Cache serves anonymous users in under 10ms, while the Dynamic Page Cache handles authenticated users via auto-placeholdering.\n- Cache tags, contexts, and max-age are the three pieces of metadata that drive correct invalidation in the Drupal cache.\n- Most production bugs trace back to custom code that bypasses Drupal's entity API and forgets to attach cache metadata.\n- Always pair the internal Drupal cache with a tag-aware reverse proxy or CDN for sites under real load.\n- Prefer automated, tag-based invalidation over manual cache clears in your deploy and content workflows.\n- Use the X-Drupal-Cache header and Cache Review module as your first debugging stop when content goes stale.",

    "## Final Thoughts\n\nDrupal's cache system has a steep learning curve, but once you understand the four layers and the metadata model, it becomes one of the CMS's biggest strengths. Most Drupal developers I know learned this the hard way, through stale homepages and angry editors. You do not have to.\n\nHave you dealt with a tricky Drupal cache bug? I would love to hear about it. Find me on [LinkedIn](https://www.linkedin.com/in/ru5iru) or [X](https://x.com/ru5iru).",
  ],
  faq: [
    {
      question: "What is Drupal page caching?",
      answer:
        "Drupal page caching is the mechanism that stores fully rendered HTML responses so they can be returned without re-running the full request pipeline. For anonymous users, the Internal Page Cache serves responses in under 10ms by short-circuiting the kernel. For authenticated users, the Dynamic Page Cache caches fragments after resolving personalization placeholders, dramatically reducing database load.",
    },
    {
      question: "What are cache tags in Drupal?",
      answer:
        "Cache tags are strings attached to render arrays that describe what data the cached item depends on, such as node:42 or user_list. When the underlying entity changes, Drupal invalidates every cache entry carrying that tag. Tags are the foundation of Drupal's event-based cache invalidation, and they let the CMS keep content fresh without relying on time-based expiration.",
    },
    {
      question: "What is the difference between Internal Page Cache and Dynamic Page Cache?",
      answer:
        "The Internal Page Cache stores fully rendered HTML pages and only serves anonymous users, bypassing nearly the entire Drupal bootstrap. The Dynamic Page Cache works for both anonymous and authenticated users by caching the page minus personalized fragments, which are filled in on each request through auto-placeholdering. Most production Drupal sites enable both modules together.",
    },
    {
      question: "Why is my Drupal page cache serving stale content?",
      answer:
        "Stale content almost always means a render array is missing cache tags. Custom blocks that query the database directly, instead of using Drupal's entity API, do not get automatic tag attachment. Check the X-Drupal-Cache and X-Drupal-Cache-Tags headers, then audit any custom code for missing #cache metadata. Adding the right tag usually fixes the problem permanently.",
    },
    {
      question: "Should I use Varnish with Drupal if I already have the internal cache?",
      answer:
        "Yes, for any site under real load. The internal Drupal cache is fast, but Varnish or a tag-aware CDN like Fastly sits in front of it and serves cached responses without ever touching PHP. Drupal can emit cache tag headers that these proxies use for surgical invalidation, so a content edit purges only the affected pages globally.",
    },
    {
      question: "How do I clear the Drupal cache without breaking performance?",
      answer:
        "Avoid drupal_flush_all_caches in deploy scripts because it causes a thundering herd on the next traffic spike. Instead, invalidate specific cache tags using Cache::invalidateTags or drush cache:tags. This clears only the affected entries and lets the rest of the cache stay warm, keeping response times stable during deploys and content updates.",
    },
  ],
};

export default post;
