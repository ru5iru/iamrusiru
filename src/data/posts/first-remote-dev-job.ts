import postRemoteJob from "@/assets/post-remote-job.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "How I Landed My First Remote Dev Job",
  excerpt:
    "From cold applications to take-home tests — here's an honest recap of what worked, what didn't, and what I'd do differently.",
  date: "January 12, 2026",
  category: "Career",
  slug: "first-remote-dev-job",
  readTime: "9 min read",
  imageUrl: postRemoteJob,
  tags: ["#career", "#devlife", "#productivity"],
  content: [
    "It took me four months, 73 applications, 12 interviews, and 3 take-home tests to land my first remote developer job. Here's the unfiltered version of what that process looked like.",
    "## The Numbers\n\nI tracked everything in a spreadsheet. Of 73 applications:\n- 48 got no response at all\n- 15 sent automated rejections\n- 10 led to a first-round call\n- 5 moved to technical interviews\n- 3 gave me take-home assignments\n- 1 made an offer\n\nThat's a 1.4% success rate. It felt brutal at the time, but talking to other developers, it's actually pretty normal.",
    "## What Worked\n\n**A portfolio with real projects.** Not tutorials-I-followed, but actual things I built to solve problems I had. My file organiser CLI, a budget tracker, a small API for a Discord bot. Interviewers always asked about these.\n\n**Writing about what I learned.** This blog started as interview prep. I'd write about concepts I was studying — React rendering, database indexing, system design basics. Two interviewers mentioned they'd read my posts before the call.",
    "## What Didn't Work\n\n**Spray-and-pray applications.** My first month, I applied to everything. The response rate was near zero. When I started being selective — targeting companies whose product I actually cared about — my hit rate tripled.\n\n**Over-engineering take-homes.** My first take-home, I spent 20 hours building a perfect architecture. They wanted a simple CRUD app. I learned to match the effort to the ask.",
    "## The Offer\n\nThe company that hired me was a mid-size SaaS startup. The interview process was four stages: a culture call, a pair-programming session, a system design discussion, and a team meet. The pair-programming round was my favourite — we debugged a real issue from their codebase together. It felt collaborative, not adversarial.\n\nIf you're in the middle of your search right now, keep going. It's a numbers game with a heavy dose of luck and timing. But every interview — even the bad ones — makes you better at the next one.",
  ],
};

export default post;
