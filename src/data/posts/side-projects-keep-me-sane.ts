import postSideProjects from "@/assets/post-side-projects.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why Side Projects Keep Me Sane as a Developer",
  excerpt:
    "Side projects provide creative freedom that work constraints cannot offer. They let you experiment with new technologies, learn from failure without consequences, and rediscover the joy that got you into programming.",
  date: "December 15, 2025",
  category: "Personal",
  slug: "side-projects-keep-me-sane",
  readTime: "5 min read",
  imageUrl: postSideProjects,
  tags: ["side projects", "developer productivity", "open source", "career growth", "creativity"],
  content: [
    "Side projects are where developers experiment, fail, and rediscover the joy of programming. At work, I write TypeScript in a monorepo with strict linting rules, mandatory code reviews, and a deployment pipeline that takes 45 minutes. It is good engineering. It is also exhausting.",

    "Side projects are the antidote. They are the space where I can use a language I have never tried, skip tests entirely, and deploy by pushing to main. The freedom is essential for staying creative and motivated.",

    "## The Joy of No Stakeholders\n\nNo one is waiting for my side project. No one has opinions about the button color. No one is asking for an ETA. This absence of pressure creates a kind of creative space that is impossible to replicate at work.\n\nI built a terminal-based Pomodoro timer last month. It took a weekend and serves exactly one user: me. But I learned about terminal UI libraries, ANSI escape codes, and how to publish a crate to Cargo. That knowledge has already leaked into my day job in unexpected ways.",

    "## Failure Is the Feature\n\nMost of my side projects are abandoned. My GitHub is a graveyard of half-finished ideas. But each one taught me something. A failed attempt at a real-time chat app taught me WebSockets. An abandoned game taught me about entity-component systems. A broken RSS reader taught me about XML parsing.\n\nThe point is not finishing. The point is learning.",

    "## The Rule That Prevents Burnout\n\nOne rule keeps me from burning out on side projects: **I only work on them when I want to.** The moment it feels like an obligation, I stop. No guilt, no 'I should finish this.' The whole point is joy.\n\nIf you are feeling stuck or uninspired at work, try building something small and silly on the side. A random quote generator. A CLI that insults you when you commit bad code. A website that does one useless thing beautifully. The spark you are looking for might be hiding in the margins.",

    "## Key Takeaways\n\n- Side projects provide creative freedom outside workplace constraints\n- Skills learned on side projects transfer to your day job in unexpected ways\n- Abandoned projects are not failures - each one teaches something valuable\n- Only work on side projects when you genuinely want to, never out of obligation\n- Building something small and fun can reignite motivation when work feels draining\n- Side projects are the best way to experiment with unfamiliar languages and frameworks\n- The absence of stakeholders and deadlines creates space for genuine creativity",
  ],
  faq: [
    { question: "Why are side projects important for developers?", answer: "Side projects provide creative freedom outside work constraints. They let you experiment with new technologies, learn from failure without consequences, and rediscover the joy of programming. Skills learned often transfer back to your day job in unexpected ways." },
    { question: "How do you avoid burnout from side projects?", answer: "The key rule is to only work on side projects when you want to. The moment it feels like an obligation, stop. No guilt about unfinished projects. Most side projects will be abandoned, and that is perfectly fine because each one teaches something valuable." },
    { question: "Is it okay to abandon side projects?", answer: "Yes. Most side projects are abandoned, and that is normal. Each project teaches something valuable regardless of completion. A failed chat app teaches WebSockets, an abandoned game teaches entity-component systems. The point is learning, not finishing." },
    { question: "What side projects should developers build?", answer: "Build whatever interests you. A terminal-based timer, a file organizer CLI, a random quote generator, or a single-purpose website. The best side projects solve a small problem you personally have or let you explore a technology you are curious about." },
    { question: "Do side projects help your career?", answer: "Yes. Side projects build skills in unfamiliar technologies, demonstrate initiative to employers, and keep you motivated and creative. Knowledge gained from personal projects regularly transfers to work in unexpected ways, making you a more versatile engineer." },
  ],
};

export default post;
