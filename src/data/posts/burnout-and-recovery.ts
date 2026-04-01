import postBurnout from "@/assets/post-burnout.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Burnout, Recovery, and What I Learned",
  excerpt:
    "I hit a wall last year. This is an honest look at what burnout felt like, how I recovered, and the boundaries I set to protect my energy.",
  date: "November 20, 2025",
  category: "Personal",
  slug: "burnout-and-recovery",
  readTime: "8 min read",
  imageUrl: postBurnout,
  tags: ["#devlife", "#career", "#productivity"],
  content: [
    "Six months ago, I couldn't open my laptop without a knot forming in my stomach. The thought of writing another line of code, something I'd loved since I was fourteen, made me feel physically ill. I was burned out.",
    "## How It Started\n\nIt wasn't dramatic. There was no single moment. It was months of saying yes to everything: extra sprints, on-call rotations, mentoring sessions, side projects, conference talks. Each thing was small and manageable on its own. Together, they were suffocating.",
    "The first sign I ignored was losing my weekends. Not to work, exactly, but to recovery. I'd spend Saturday in bed, not resting but paralysed. Sunday would be consumed by dread about Monday. The weeks blurred together.",
    "## What Burnout Actually Feels Like\n\nFor me, it wasn't exhaustion; it was emptiness. I didn't feel tired; I felt hollow. Things that used to excite me (a new framework, a tricky bug, a clean refactor) felt pointless. My code quality dropped. My patience evaporated. I started dreading standups, not because of the meeting itself, but because I had nothing to say.\n\nThe scariest part was not caring. Not caring about code quality. Not caring about the product. Not caring about the users. When you stop caring, you know something is deeply wrong.",
    "## Recovery\n\nI took two weeks off. Not vacation, but actual rest. No laptop, no Slack, no 'just checking one thing.' I read novels. I cooked elaborate meals. I walked without headphones.\n\nWhen I came back, I set boundaries that felt radical at the time:\n- No Slack after 6 PM\n- One mentoring session per week, max\n- No side projects for three months\n- 'I don't have capacity for that' became my default response\n\nThe world didn't end. My team adjusted. My manager was supportive. And slowly, over about two months, the spark came back.",
    "## What I Learned\n\nBurnout isn't a badge of honour. It's not proof that you work hard or care deeply. It's a signal that something is broken in the system, and often, you're the one who needs to fix it by saying no.\n\nIf you're reading this and recognising yourself in these words, please take it seriously. Talk to someone. Take time off. Set a boundary, even a small one. The code will still be there when you come back. But you need to be there too.",
  ],
  faq: [
    { question: "What does developer burnout feel like?", answer: "Developer burnout often feels like emptiness rather than exhaustion. Signs include losing interest in things that used to excite you (new frameworks, tricky bugs), declining code quality, dreading standups, and not caring about the product or users. The scariest part is the apathy." },
    { question: "How do you recover from burnout as a developer?", answer: "Recovery involves taking genuine time off (no laptop, no Slack), then setting firm boundaries: no messaging after work hours, limiting mentoring sessions, pausing side projects, and making 'I don't have capacity' your default response. The spark typically returns after about two months of maintained boundaries." },
  ],
};

export default post;
