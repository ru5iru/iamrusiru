import postLetter from "@/assets/post-letter.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Code Review Etiquette: Being Kind and Thorough",
  excerpt:
    "Good code reviews build trust. Bad ones build resentment. Here are the habits I've adopted to make reviews productive for everyone.",
  date: "December 8, 2025",
  category: "Career",
  slug: "code-review-etiquette",
  readTime: "6 min read",
  imageUrl: postLetter,
  tags: ["#career", "#devlife", "#productivity"],
  content: [
    "Early in my career, I got a code review that simply said: 'This is wrong. Redo it.' No explanation, no suggestion, no context. I spent two hours trying to figure out what was wrong, only to discover the reviewer disagreed with a naming convention.",
    "That experience shaped how I approach code reviews today. Here are the principles I follow.",
    "## Lead with Questions, Not Commands\n\nInstead of 'This should be a `map`', try 'Have you considered using `map` here? It might make the intent clearer.' The difference is subtle but significant. Questions invite dialogue. Commands invite defensiveness.",
    "## Explain the Why\n\nIf you suggest a change, explain why. 'This could cause a memory leak because the event listener isn't cleaned up in the effect's return function' is infinitely more useful than 'Add a cleanup function.'",
    "## Distinguish Preferences from Problems\n\nNot every comment is a blocker. I use a simple prefix system:\n- **[nit]** — Style preference, take it or leave it\n- **[suggestion]** — I think this would be better, but your call\n- **[issue]** — This is a bug or will cause problems\n- **[question]** — I'm genuinely asking, not hinting",
    "## Praise Good Work\n\nCode reviews aren't just for criticism. When someone writes an elegant solution, say so. 'Nice use of discriminated unions here — really clean' costs you three seconds and might make someone's day.",
    "## Review the PR, Not the Person\n\nSay 'This function could be simplified' instead of 'You overcomplicated this.' It's a tiny shift in language that makes a big difference in how feedback lands.\n\nGood code reviews are an act of generosity. You're spending your time to make someone else's code — and someone else — better. Treat it that way.",
  ],
};

export default post;
