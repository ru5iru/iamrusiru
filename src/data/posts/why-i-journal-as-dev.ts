import postJournaling from "@/assets/post-journaling.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why I Keep a Developer Journal",
  excerpt:
    "A developer journal is a simple daily habit that compounds into one of the most valuable career tools you can build. Writing down what you learn each day improves performance reviews, reveals learning patterns, and speeds up debugging.",
  date: "November 5, 2025",
  category: "Personal",
  slug: "why-i-journal-as-dev",
  readTime: "4 min read",
  imageUrl: postJournaling,
  tags: ["developer journal", "productivity", "career growth", "learning", "knowledge management"],
  content: [
    "A developer journal is the highest-ROI habit I have ever built. Every evening, I spend 10 minutes writing down what I worked on, what I learned, and what confused me. I have been doing this for two years, and it has transformed how I track progress, prepare for reviews, and solve problems.",

    "## The Format\n\nI keep it simple. A markdown file per week with three sections per day:\n\n- **Did**: What I shipped or worked on\n- **Learned**: Any new concept, trick, or insight\n- **Stuck**: What blocked me and how I unblocked it (or did not)\n\nNo special tools needed. A plain text file works perfectly.",

    "## Why Developer Journaling Works\n\nThree reasons make this habit transformative:\n\n1. **Performance reviews write themselves.** When review season comes, I have a searchable log of every contribution. No more 'what did I do in March?' panic.\n\n2. **Patterns emerge.** After a few months, I noticed I was consistently stuck on database query optimization. That led me to take a course on it, which directly improved my work.\n\n3. **Debugging gets faster.** Half the time, a problem I am stuck on today is something I solved three months ago. A quick search finds my notes and the solution.",

    "## How to Start a Developer Journal\n\nStart today. Open a text file. Write three lines. Do it again tomorrow. In six months, you will have a goldmine of personal documentation that no one else can give you. The key is consistency, not perfection. Even a single sentence per day adds up over time.",

    "## Key Takeaways\n\n- A developer journal takes only 10 minutes per day and compounds into an invaluable career tool\n- Use a simple Did/Learned/Stuck format for each daily entry\n- Searchable journal entries make performance reviews effortless\n- Recurring patterns in your 'Stuck' section reveal skill gaps worth addressing\n- Past solutions become instantly findable, speeding up future debugging\n- Consistency matters more than detail - even one sentence per day is valuable\n- Plain markdown files are the simplest and most portable format",
  ],
  faq: [
    { question: "Why should developers keep a journal?", answer: "A developer journal helps with performance reviews (searchable log of contributions), reveals learning patterns (identifying consistent knowledge gaps), and speeds up debugging (searchable notes of past solutions). It is a high-ROI habit that takes only 10 minutes per day." },
    { question: "What format should a developer journal use?", answer: "A simple markdown file per week with three sections per day: Did (what you shipped), Learned (new concepts or insights), and Stuck (what blocked you and how you resolved it). Keep it simple because the goal is consistency, not perfection." },
    { question: "What tools should I use for a developer journal?", answer: "A plain text or markdown file works perfectly. No special tools are needed. Some developers use Obsidian, Notion, or a private GitHub repository. The best tool is whatever you will actually use consistently every day." },
    { question: "How does a developer journal help with performance reviews?", answer: "When review season comes, you have a searchable log of every contribution, bug fix, feature shipped, and lesson learned. Instead of trying to remember months of work, you search your journal and compile a comprehensive list of accomplishments in minutes." },
    { question: "How long should a developer journal entry be?", answer: "Aim for 5 to 10 minutes of writing per day. Even a single sentence per section (Did, Learned, Stuck) is valuable. Consistency matters more than length. Short daily entries compound into a comprehensive personal knowledge base over months." },
  ],
};

export default post;
