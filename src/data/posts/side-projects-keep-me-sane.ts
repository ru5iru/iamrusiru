import postSideProjects from "@/assets/post-side-projects.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why Side Projects Keep Me Sane",
  excerpt:
    "Work code has constraints. Side projects are where I experiment, fail, and rediscover the joy that got me into programming.",
  date: "December 15, 2025",
  category: "Personal",
  slug: "side-projects-keep-me-sane",
  readTime: "5 min read",
  imageUrl: postSideProjects,
  tags: ["#devlife", "#opensource", "#productivity"],
  content: [
    "At work, I write TypeScript in a monorepo with strict linting rules, mandatory code reviews, and a deployment pipeline that takes 45 minutes. It's good engineering. It's also exhausting.",
    "Side projects are the antidote. They're the space where I can use a language I've never tried, skip tests entirely (don't tell anyone), and deploy by pushing to main. The freedom is intoxicating.",
    "## The Joy of No Stakeholders\n\nNo one is waiting for my side project. No one has opinions about the button colour. No one is asking for an ETA. This absence of pressure creates a kind of creative space that's impossible to replicate at work.\n\nI built a terminal-based Pomodoro timer last month. It took a weekend and serves exactly one user: me. But I learned about terminal UI libraries, ANSI escape codes, and how to publish a crate to cargo. That knowledge has already leaked into my day job in unexpected ways.",
    "## Failure Is the Feature\n\nMost of my side projects are abandoned. My GitHub is a graveyard of half-finished ideas. But each one taught me something. A failed attempt at a real-time chat app taught me WebSockets. An abandoned game taught me about entity-component systems. A broken RSS reader taught me about XML parsing (and why everyone hates it).",
    "## The Rule I Follow\n\nOne rule keeps me from burning out on side projects: **I only work on them when I want to.** The moment it feels like an obligation, I stop. No guilt, no 'I should finish this.' The whole point is joy.\n\nIf you're feeling stuck or uninspired at work, try building something small and silly on the side. A random quote generator. A CLI that insults you when you commit bad code. A website that does one useless thing beautifully. The spark you're looking for might be hiding in the margins.",
  ],
};

export default post;
