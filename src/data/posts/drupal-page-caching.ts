import postDrupalCaching from "@/assets/post-drupal-caching.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Drupal Caching: Cache Tags, Contexts and Debugging",
  excerpt:
    "Understand Drupal caching: compare page and render caches, use cache tags, contexts and max-age, and debug stale content with response headers.",
  date: "April 24, 2026",
  updatedDate: "October 25, 2026",
  category: "Engineering",
  slug: "drupal-page-caching",
  readTime: "10 min read",
  imageUrl: postDrupalCaching,
  tags: ["Drupal", "CMS", "Drupal developer", "Drupal Cache", "performance"],
  seoKeywords: [
    "Drupal caching",
    "Drupal page caching",
    "Drupal cache tags",
    "Drupal performance optimization",
    "Drupal internal page cache",
    "Drupal dynamic page cache",
    "CDN with Drupal",
    "Drupal cache contexts",
    "Drupal developer guide",
    "BigPipe Drupal",
    "Drupal cache invalidation",
    "debugging Drupal cache",
  ],
  content: [
    "Drupal caching reuses previously generated output instead of rebuilding it for every request. Internal Page Cache stores complete pages for anonymous visitors; Dynamic Page Cache reuses pages while leaving personalized parts dynamic; Render Cache reuses individual pieces. Cache tags say what data an item depends on, cache contexts say what it varies by, and max-age says how long it may be cached. Correct metadata makes pages faster without showing stale or someone else's content.",

    "I have been working with Drupal as a CMS for years, both as a backend Drupal developer and as the person paged at 2am when a homepage refuses to update. This post is the guide I wish I had when I started: how the Drupal cache actually works, where it breaks, and the practical patterns I use to keep it honest.",

    "## What Is Drupal Page Caching?\n\nPage caching stores reusable page responses, reducing rendering work on subsequent requests. Actual performance depends on your application, cache backend and hosting, so measure before and after a change rather than expecting a fixed response time.\n\nThere are two main built-in modules involved: **Internal Page Cache** for anonymous users and **Internal Dynamic Page Cache** for anonymous and authenticated users. They solve different problems and can be enabled together.",

    "## The Four Layers of the Drupal Cache\n\nMost developers think of \"the cache\" as a single thing. In reality, a Drupal request touches several caches before it returns a byte to the browser.",

    "### 1. Internal Page Cache\n\nThis layer stores complete responses for anonymous visitors and can return a hit early in the request. It assumes anonymous visitors receive the same page. Cache contexts do not make Internal Page Cache safe for per-session anonymous personalization. If anonymous visitors need different output, evaluate whether to disable this module for that use case and use Dynamic Page Cache with correct metadata.",

    "### 2. Internal Dynamic Page Cache\n\nThis caches a page minus its personalized parts. Placeholders let Drupal fill those parts in for each request, while reusing the rest. It works for both anonymous and authenticated users. Correct cache contexts and cacheability metadata still matter: placeholders are not permission checks.",

    "### 3. Render Cache\n\nEvery render array in Drupal can declare its own cache metadata: cache keys, contexts, tags, and max-age. The render cache stores the output of individual blocks, fields, and views rows so they can be reassembled cheaply.",

    "### 4. Cache Backends (Database, Redis, Memcached)\n\nA backend is where cache entries are stored, not another kind of page output. Drupal commonly uses the database; Redis or Memcached integrations offer alternatives. Changing storage does not repair missing tags or contexts. Profile your database load and response times before deciding whether another backend is worthwhile.",

    "## Cache Tags, Contexts, and Max-Age\n\nThink of a cached article list as a saved answer. You need to know when that answer changes, who can reuse it, and when it expires. Drupal combines data dependencies, request variations and time limits through these three metadata types.",

    "- **Cache tags** describe what the cached item depends on, for example `node:42` or `user_list`. When the underlying data changes, Drupal invalidates everything tagged with it.\n- **Cache contexts** describe what the cached item varies by, for example `url.path`, `user.roles`, or `cookies:my_cookie`. Different context values produce different cache entries.\n- **Max-age** is the maximum number of seconds the item can be cached. A value of 0 means \"do not cache\", and `Cache::PERMANENT` means \"cache until invalidated by tag\".",

    "Getting these three right is 90% of the job. Most production caching bugs I have debugged came down to a missing cache tag on a custom block or a forgotten cache context on a personalized element.",

    "## Example: A Stale Featured-Articles Block\n\nSuppose a custom block lists the five newest published articles. It needs a list tag so adding or removing an article invalidates the results, plus dependencies on the loaded entities so editing their fields invalidates the output. An entity query alone does not automatically attach those dependencies to your render array.\n\nThe example below uses CacheableMetadata to merge entity tags and access-result metadata, then applies that metadata to the block. In a real custom module, inject the entity storage and current-user services rather than using static service access.",

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

  $build = [
    '#theme' => 'featured_articles',
    '#nodes' => $nodes,
    '#cache' => [
      'tags' => ['node_list:article'],
      'contexts' => ['user.permissions', 'user.node_grants:view'],
      'max-age' => Cache::PERMANENT,
    ],
  ];

  $cacheability = CacheableMetadata::createFromRenderArray($build);
  foreach ($nodes as $node) {
    $cacheability->addCacheableDependency($node);
    $access = $node->access('view', NULL, TRUE);
    $cacheability->addCacheableDependency($access);
    if (!$access->isAllowed()) {
      unset($build['#nodes'][$node->id()]);
    }
  }
  $cacheability->applyTo($build);
  return $build;
}`,
    },

    "Import Drupal\\node\\Entity\\Node, Drupal\\Core\\Cache\\Cache and Drupal\\Core\\Cache\\CacheableMetadata for this example. The node_list:article tag tracks list membership; individual node tags track changes to already-listed articles. Access checks prevent rendering inaccessible nodes, while their cache metadata controls safe reuse. Other filters or custom access rules may require additional dependencies.",

    "## How to Debug Drupal Cache Issues\n\nWhen the cache misbehaves, I work through this checklist in order. It catches the vast majority of issues before I have to attach a debugger.",

    "1. **Reproduce the problem twice.** Request the same URL as an anonymous visitor, then as the relevant logged-in user. Inspect X-Drupal-Cache and X-Drupal-Dynamic-Cache when present; their availability and values depend on the enabled modules and response. A MISS alone does not prove a metadata bug.\n2. **Enable cacheability debugging locally.** Set the http.response.debug_cacheability_headers container parameter to true in a development services file, ensure that file is loaded, then rebuild the container with drush cr. Inspect X-Drupal-Cache-Tags, X-Drupal-Cache-Contexts and X-Drupal-Cache-Max-Age. Do not assume these debug headers are enabled in production.\n3. **Test an actual edit.** Warm the page cache, edit a listed article, then request the page again. Check that entity and list dependencies invalidate the relevant output.\n4. **Audit custom render arrays.** Look for missing entity dependencies or contexts on custom blocks and preprocess code.\n5. **Check outer caches separately.** If Drupal serves fresh output but the browser still sees old content, inspect browser, reverse proxy and CDN caching before changing Drupal metadata.",
    {
      type: "code",
      language: "yaml",
      code: `# Development services file, loaded by your local settings.
parameters:
  http.response.debug_cacheability_headers: true`,
    },
    {
      type: "code",
      language: "bash",
      code: `# Rebuild after changing container configuration.
drush cr

# Compare response headers on two requests.
curl -sD - -o /dev/null https://your-site.example/articles
curl -sD - -o /dev/null https://your-site.example/articles`,
    },

    "## Internal Cache vs Reverse Proxy: When to Use What\n\nA reverse proxy such as Varnish or a CDN can serve suitable responses before a request reaches PHP. It complements Drupal's caches, but needs explicit rules for cookies, authenticated responses and invalidation. Tag-based purging depends on the chosen integration and configuration; Drupal does not guarantee instant global purges.\n\nBigPipe streams personalized placeholders to the browser. It is not itself a CDN purge mechanism. Test both freshness after edits and isolation between users before enabling shared caching.",

    "Start with correct Drupal metadata, then measure where requests spend their time. Add Redis, Varnish or a CDN only when your workload and operational needs justify them. A fixed traffic threshold is not a substitute for profiling.",

    "## Common Mistakes Drupal Developers Make\n\n- **Clearing everything instead of declaring dependencies.** A rebuild may be needed after configuration or deployment changes, but repeated full clears are not a fix for missing cache tags.\n- **Setting max-age to 0 without understanding propagation.** Uncacheable child metadata can affect parent output; placeholders can keep dynamic parts separate. Diagnose the dependency before disabling caching.\n- **Treating caching as authorization.** Use explicit access checks and carry access-result metadata into rendered output.\n- **Caching a request timestamp forever.** Use a deliberate finite max-age or a dynamic placeholder for time-dependent output. Do not invent a universal time cache context.\n- **Assuming entity queries attach output metadata.** Merge dependencies from entities, lists and access results into the render array.",

    "## Manual vs Automated Cache Invalidation\n\nThere are two schools of thought on cache management in Drupal. Manual invalidation, where developers explicitly clear caches after specific operations, gives precise control but is fragile. Automated invalidation through cache tags is the Drupal way: declare your dependencies, and the system handles the rest.\n\nIn practice, I aim for 95% automated and 5% manual. The manual escape hatch matters for edge cases like third-party API data refreshes or scheduled content publication, but everything else should ride on cache tags.",

    "## Quick Checklist for Drupal Cache Health\n\n- Are entity and list dependencies attached to custom output?\n- Are contexts set for permissions, URL or other relevant variations?\n- Is max-age permanent or a deliberate time limit?\n- Does anonymous personalization avoid unsafe Internal Page Cache reuse?\n- In development, do debug headers show the expected metadata?\n- Do content edits refresh both Drupal output and any outer cache?\n- Do different users receive only content they can access?",

    "## Key Takeaways\n\nDrupal caching is about safe reuse, not only speed. Internal Page Cache serves shared anonymous pages; Dynamic Page Cache leaves personalized parts dynamic; Render Cache reuses smaller pieces. Tags control data dependencies, contexts control variations, and max-age controls time limits. Debug the layer serving stale output, test real edits and user access, and measure performance rather than relying on universal latency promises.",
    "## Official Drupal Documentation\n\nCache tags: https://www.drupal.org/docs/develop/drupal-apis/cache-api/cache-tags\n\nCache contexts: https://www.drupal.org/docs/develop/drupal-apis/cache-api/cache-contexts\n\nCacheability and debug headers: https://www.drupal.org/docs/8/api/responses/cacheableresponseinterface\n\nInternal Page Cache: https://www.drupal.org/docs/administering-a-drupal-site/internal-page-cache\n\nDynamic Page Cache: https://www.drupal.org/docs/8/core/modules/dynamic-page-cache/overview\n\nClearing and rebuilding caches: https://www.drupal.org/docs/user_guide/en/prevent-cache-clear.html",

    "## Final Thoughts\n\nDrupal's cache system has a steep learning curve, but once you understand the four layers and the metadata model, it becomes one of the CMS's biggest strengths. Most Drupal developers I know learned this the hard way, through stale homepages and angry editors. You do not have to.\n\nHave you dealt with a tricky Drupal cache bug? I would love to hear about it. Find me on [LinkedIn](https://www.linkedin.com/in/ru5iru) or [X](https://x.com/ru5iru).",
  ],
  faq: [
    {
      question: "What is Drupal page caching?",
      answer:
        "Drupal page caching reuses page output to reduce repeated rendering work. Internal Page Cache stores complete responses for anonymous visitors; Dynamic Page Cache reuses pages while leaving personalized parts dynamic. Performance depends on the site and environment. Neither cache replaces access checks, and correct tags, contexts and max-age are needed for safe reuse.",
    },
    {
      question: "What are cache tags in Drupal?",
      answer:
        "Cache tags are strings attached to render arrays that describe what data the cached item depends on, such as node:42 or user_list. When the underlying entity changes, Drupal invalidates every cache entry carrying that tag. Tags are the foundation of Drupal's event-based cache invalidation, and they let the CMS keep content fresh without relying on time-based expiration.",
    },
    {
      question: "What is the difference between Internal Page Cache and Dynamic Page Cache?",
      answer:
        "Internal Page Cache stores complete responses for anonymous visitors and assumes those visitors receive the same page. Dynamic Page Cache works for anonymous and authenticated users by caching the page minus personalized parts, which can be filled through placeholders. Per-session anonymous personalization requires special care because Internal Page Cache does not honor cache contexts for that variation.",
    },
    {
      question: "Why is my Drupal page cache serving stale content?",
      answer:
        "Stale output can come from missing dependencies in custom render arrays, a reverse proxy, a CDN or browser caching. Identify the layer first. In development, enable cacheability debug headers, inspect tags and contexts, then warm the page and edit its data. Entity queries alone do not attach all output dependencies; merge entity and list metadata explicitly.",
    },
    {
      question: "Should I use Varnish with Drupal if I already have the internal cache?",
      answer:
        "Not necessarily. Varnish or a CDN can reduce requests reaching PHP, but adds configuration and invalidation responsibilities. Choose based on measured load and operational needs. Verify cookie and authenticated-response rules, configure purging through the chosen integration, and test freshness after edits. Drupal's internal caches remain useful even without an external proxy.",
    },
    {
      question: "How do I clear the Drupal cache without breaking performance?",
      answer:
        "Use drush cr when a full cache and container rebuild is needed, such as after relevant configuration changes. For application data updates, declare cache dependencies and let Drupal invalidate them, or call Cache::invalidateTags with the affected tags. Rebuilding everything repeatedly is not a substitute for fixing missing metadata and can temporarily increase rendering work.",
    },
  ],
};

export default post;
