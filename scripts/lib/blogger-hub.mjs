// Optional native Page body. Publish it before adding its URL to navigation.
export function engineeringHub(posts, postPath, escape) {
  const groups = [
    ['Application security', 'Start with the edition overview, then use the focused guides to inspect query handling, authorization and cryptography. These are learning aids, not a complete security assessment.', ['owasp-top-ten', 'injection', 'broken-access-control', 'cryptographic-failures']],
    ['Delivery and production', 'Use these when planning a migration, narrowing down a production failure or diagnosing stale Drupal output. Record the actual environment and failure before applying a fix.', ['proper-project-planning', 'debugging-production', 'drupal-page-caching', 'docker-compose-dev']],
    ['Maintainable code and reviews', 'Combine automated checks with clear naming, tests and respectful review comments. The posts explain different parts of that workflow; no tool replaces understanding the change.', ['clean-code-principles', 'code-review-security-platform', 'code-review-etiquette', 'git-workflow-tips']],
    ['Small practical experiments', 'Pick a tutorial that matches your stack and check the linked official documentation for your installed versions. Keep experiments small enough to understand and verify.', ['fastapi-quickstart', 'cli-tool-rust', 'react-server-components', 'switched-to-typescript']],
  ];
  return '<!-- Native Page body. Set Title and Search description in Blogger; do not add a second H1. -->\n<p>Use this reading guide to find a starting point for a concrete engineering problem. The articles combine practical examples and personal lessons; follow the source links for the underlying platform guidance.</p>\n' + groups.map(([title, intro, slugs]) => {
    const entries = slugs.map(slug => posts.find(post => post.slug === slug)).filter(Boolean);
    return '<section><h2>' + escape(title) + '</h2><p>' + escape(intro) + '</p><ul>' + entries.map(post => '<li><a href="' + postPath(post) + '">' + escape(post.title) + '</a><p>' + escape(post.excerpt) + '</p></li>').join('') + '</ul></section>';
  }).join('\n') + '\n<h2>How to use the examples</h2><p>Read the explanation before copying code, adapt it to your environment, and test both the expected behavior and relevant failure cases. Use publication dates and explicit edition numbers for context. Personal accounts describe individual experience rather than universal outcomes.</p>';
}
