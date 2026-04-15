import postBurnout from "@/assets/post-burnout.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Burnout, Recovery, and What I Learned",
  excerpt:
    "Developer burnout often feels like emptiness rather than exhaustion. Here is an honest account of what burnout felt like, how I recovered by setting firm boundaries, and the lessons that apply to every developer.",
  date: "November 20, 2025",
  category: "Personal",
  slug: "burnout-and-recovery",
  readTime: "8 min read",
  imageUrl: postBurnout,
  tags: ["developer burnout", "mental health", "work-life balance", "career growth", "productivity"],
  content: [
    "Developer burnout is a real and growing problem in the software industry. Six months ago, I could not open my laptop without a knot forming in my stomach. The thought of writing another line of code - something I had loved since I was fourteen - made me feel physically ill. I was burned out, and this is what I learned from it.",

    "## How Burnout Starts\n\nIt was not dramatic. There was no single moment. It was months of saying yes to everything: extra sprints, on-call rotations, mentoring sessions, side projects, conference talks. Each thing was small and manageable on its own. Together, they were suffocating.\n\nThe first sign I ignored was losing my weekends. Not to work exactly, but to recovery. I would spend Saturday in bed, not resting but paralyzed. Sunday would be consumed by dread about Monday. The weeks blurred together.",

    "## What Developer Burnout Actually Feels Like\n\nFor me, burnout was not exhaustion. It was emptiness. I did not feel tired. I felt hollow. Things that used to excite me (a new framework, a tricky bug, a clean refactor) felt pointless. My code quality dropped. My patience evaporated. I started dreading standups.\n\nThe scariest part was not caring. Not caring about code quality. Not caring about the product. Not caring about the users. When you stop caring, you know something is deeply wrong.",

    "## How I Recovered From Burnout\n\nI took two weeks off. Not vacation, but actual rest. No laptop, no Slack, no 'just checking one thing.' I read novels. I cooked elaborate meals. I walked without headphones.\n\nWhen I came back, I set boundaries that felt radical at the time:\n- No Slack after 6 PM\n- One mentoring session per week, maximum\n- No side projects for three months\n- 'I do not have capacity for that' became my default response\n\nThe world did not end. My team adjusted. My manager was supportive. And slowly, over about two months, the spark came back.",

    "## Lessons Learned About Burnout Prevention\n\nBurnout is not a badge of honor. It is not proof that you work hard or care deeply. It is a signal that something is broken in the system, and often you are the one who needs to fix it by saying no.\n\nIf you are reading this and recognizing yourself in these words, please take it seriously. Talk to someone. Take time off. Set a boundary, even a small one. The code will still be there when you come back. But you need to be there too.",

    "## Key Takeaways\n\n- Developer burnout often presents as emptiness and apathy rather than physical exhaustion\n- Saying yes to every request is the most common path to burnout\n- Recovery requires genuine rest - no laptop, no Slack, no 'just checking one thing'\n- Setting firm boundaries (no messaging after hours, limiting commitments) is essential\n- 'I do not have capacity for that' is a complete and valid response\n- Burnout is a signal that something is broken, not proof of dedication\n- The spark comes back after consistent boundary-setting, typically within two months",
  ],
  faq: [
    { question: "What does developer burnout feel like?", answer: "Developer burnout often feels like emptiness rather than exhaustion. Signs include losing interest in things that used to excite you (new frameworks, tricky bugs), declining code quality, dreading standups, and not caring about the product or users. The scariest part is the apathy." },
    { question: "How do you recover from burnout as a developer?", answer: "Recovery involves taking genuine time off (no laptop, no Slack), then setting firm boundaries: no messaging after work hours, limiting mentoring sessions, pausing side projects, and making 'I do not have capacity' your default response. The spark typically returns after about two months of maintained boundaries." },
    { question: "What causes developer burnout?", answer: "The most common cause is saying yes to too many commitments: extra sprints, on-call rotations, mentoring, side projects, and conference talks. Each is manageable alone, but together they become suffocating. The gradual nature makes it hard to recognize until you are already burned out." },
    { question: "How do you prevent developer burnout?", answer: "Set clear boundaries before you need them: limit after-hours communication, cap the number of commitments, protect your weekends, and practice saying no. Monitor early warning signs like losing weekends to recovery, dreading Mondays, and declining interest in things you used to enjoy." },
    { question: "Should I take time off if I feel burned out?", answer: "Yes. Taking genuine time off is the most important first step in recovery. This means no laptop, no work messaging, and no checking in. Even one to two weeks of complete rest can begin the recovery process, but it must be followed by lasting boundary changes." },
  ],
};

export default post;
