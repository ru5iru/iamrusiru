import postDebugging from "@/assets/post-debugging.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "The Art of Debugging in Production",
  excerpt:
    "When things break at 2 AM, your logging strategy matters more than your architecture. Here's what I've learned from years of on-call rotations.",
  date: "November 28, 2025",
  category: "Engineering",
  slug: "debugging-production",
  readTime: "7 min read",
  imageUrl: postSlowMornings,
  tags: ["#devlife", "#backend", "#productivity"],
  content: [
    "Production bugs are a different beast. Your beautiful stack traces are gone, replaced by cryptic error codes and angry Slack messages. Here's how I've learned to tame them.",
    "## Structured Logging Saves Lives\n\nThe single best investment I made was switching from `console.log` to structured JSON logging. Every log entry now has a correlation ID, timestamp, service name, and severity level.",
    {
      type: "code",
      language: "typescript",
      code: `import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'api-gateway',
    env: process.env.NODE_ENV,
  },
});

// Usage
logger.info({ userId, action: 'checkout', cartSize: items.length }, 'User initiated checkout');`,
    },
    "## The Incident Playbook\n\nEvery on-call rotation taught me something:\n\n1. **Don't panic.** Breathe. Read the alert carefully.\n2. **Check the dashboards** before touching any code.\n3. **Communicate early.** A quick 'investigating' message buys goodwill.\n4. **Roll back first, debug later.** If a deploy caused it, revert immediately.\n5. **Write a post-mortem.** Not to blame, but to learn.",
    "The best debuggers I know aren't the smartest engineers — they're the most systematic. They form hypotheses, test them one at a time, and document what they find. It's science, not magic.",
  ],
};

export default post;
