import postCreativity from "@/assets/post-creativity.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why I Keep a Developer Journal",
  excerpt:
    "Writing down what I learn each day has compounded into the best career decision I ever made. Here's my simple system.",
  date: "November 5, 2025",
  category: "Personal",
  slug: "why-i-journal-as-dev",
  readTime: "4 min read",
  imageUrl: postCreativity,
  tags: ["#productivity", "#career", "#devlife"],
  content: [
    "Every evening, I spend 10 minutes writing down what I worked on, what I learned, and what confused me. I've been doing this for two years. It's the highest-ROI habit I've ever built.",
    "## The Format\n\nI keep it dead simple. A markdown file per week with three sections per day:\n\n- **Did**: What I shipped or worked on\n- **Learned**: Any new concept, trick, or insight\n- **Stuck**: What blocked me and how I unblocked it (or didn't)",
    "## Why It Works\n\nThree reasons:\n\n1. **Performance reviews write themselves.** When review season comes, I have a searchable log of every contribution. No more 'what did I do in March?'\n\n2. **Patterns emerge.** After a few months, I noticed I was consistently stuck on database query optimization. That led me to take a course on it.\n\n3. **Debugging gets faster.** Half the time, a problem I'm stuck on today is something I solved three months ago. A quick search finds my notes.",
    "Start today. Open a text file. Write three lines. Do it again tomorrow. In six months, you'll have a goldmine of personal documentation that no one else can give you.",
  ],
};

export default post;
