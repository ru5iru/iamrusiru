import postDebugging from "@/assets/post-debugging.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "The Art of Debugging in Production",
  excerpt:
    "Debugging production issues requires structured logging, systematic investigation, and a clear incident playbook. Here is what I have learned from years of on-call rotations about finding and fixing bugs in live systems.",
  date: "November 28, 2025",
  category: "Engineering",
  slug: "debugging-production",
  readTime: "7 min read",
  imageUrl: postDebugging,
  tags: ["debugging", "production", "structured logging", "incident management", "DevOps"],
  seoKeywords: ["debugging in production", "production debugging techniques", "structured logging", "incident response", "observability", "distributed tracing", "error monitoring", "root cause analysis", "SRE practices", "debugging live systems"],
  content: [
    "Debugging production issues is fundamentally different from debugging in development. Your beautiful stack traces are gone, replaced by cryptic error codes and urgent Slack messages. The key difference is that you need structured logging, a systematic approach, and a clear incident playbook before problems occur.",

    "## Structured Logging Saves Lives\n\nThe single best investment I made was switching from `console.log` to structured JSON logging. Every log entry now has a correlation ID, timestamp, service name, and severity level. This makes logs searchable, filterable, and useful when tracing issues across distributed systems.",
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

    "## The Incident Playbook\n\nEvery on-call rotation taught me something. Here is the systematic approach I follow for every production incident:\n\n1. **Do not panic.** Breathe. Read the alert carefully.\n2. **Check the dashboards** before touching any code.\n3. **Communicate early.** A quick 'investigating' message buys goodwill.\n4. **Roll back first, debug later.** If a deploy caused it, revert immediately.\n5. **Write a post-mortem.** Not to blame, but to learn.",

    "## Systematic Debugging Approach\n\nThe best debuggers I know are not the smartest engineers. They are the most systematic. They form hypotheses, test them one at a time, and document what they find. It is science, not magic.\n\nBefore touching code, ask these questions:\n- What changed recently? (deploys, config changes, traffic spikes)\n- What is the blast radius? (one user, one region, everyone)\n- Is this a new issue or a recurring pattern?\n- What do the logs and metrics show?",

    "## Key Takeaways\n\n- Structured JSON logging with correlation IDs is the single most important debugging investment\n- Always check dashboards and metrics before touching code during an incident\n- Roll back first and debug later when a deploy is the likely cause\n- Communicate early with a brief status update to buy time and build trust\n- Write post-mortems focused on learning, not blame\n- Systematic investigation (forming and testing hypotheses) beats intuition\n- Prepare your logging and monitoring before incidents happen, not during them",
  ],
  faq: [
    { question: "How do you debug production issues?", answer: "Use structured JSON logging with correlation IDs, check dashboards before touching code, communicate early with a quick 'investigating' message, roll back first if a deploy caused it, and write post-mortems to learn. The best debuggers are systematic, forming hypotheses and testing them one at a time." },
    { question: "What is structured logging?", answer: "Structured logging outputs log entries as JSON objects with consistent fields like correlation ID, timestamp, service name, and severity level. This makes logs searchable and filterable, which is critical for debugging production issues across distributed systems." },
    { question: "What should an incident playbook include?", answer: "An incident playbook should include steps for initial assessment (read the alert, check dashboards), communication protocols (notify the team early), remediation steps (roll back if deploy-related), investigation procedures (form and test hypotheses systematically), and post-mortem requirements." },
    { question: "When should you roll back a production deployment?", answer: "Roll back immediately when a recent deploy is the likely cause of a production issue. Fix the problem in a calm environment after service is restored. The priority during an incident is restoring service, not debugging the root cause in real time." },
    { question: "How do you write a good post-mortem?", answer: "A good post-mortem documents what happened, when it was detected, how it was resolved, the root cause, and action items to prevent recurrence. Focus on systemic improvements rather than individual blame. Share it with the team so everyone learns from the incident." },
  ],
};

export default post;
