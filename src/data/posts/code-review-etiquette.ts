import postCodeReview from "@/assets/post-code-review.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Code Review Etiquette: Being Kind and Thorough",
  excerpt:
    "Good code reviews build trust and improve code quality. Bad ones build resentment. Here are practical habits for giving constructive, respectful, and productive code review feedback.",
  date: "December 8, 2025",
  category: "Career",
  slug: "code-review-etiquette",
  readTime: "6 min read",
  imageUrl: postCodeReview,
  tags: ["code review", "team collaboration", "software engineering", "career growth", "best practices"],
  content: [
    "Good code reviews improve code quality and build team trust. Bad code reviews create resentment and slow teams down. The difference comes down to etiquette: how you frame feedback, what you prioritize, and whether you treat the review as a collaboration or a judgment.",

    "Early in my career, I got a code review that simply said: 'This is wrong. Redo it.' No explanation, no suggestion, no context. I spent two hours trying to figure out what was wrong, only to discover the reviewer disagreed with a naming convention. That experience shaped how I approach code reviews today.",

    "## Lead with Questions, Not Commands\n\nInstead of 'This should be a `map`', try 'Have you considered using `map` here? It might make the intent clearer.' The difference is subtle but significant. Questions invite dialogue. Commands invite defensiveness.",

    "## Explain the Why Behind Every Suggestion\n\nIf you suggest a change, explain why. 'This could cause a memory leak because the event listener is not cleaned up in the effect's return function' is infinitely more useful than 'Add a cleanup function.' Context turns feedback into a learning opportunity.",

    "## Distinguish Preferences from Problems\n\nNot every comment is a blocker. I use a simple prefix system:\n- **[nit]**: Style preference, take it or leave it\n- **[suggestion]**: I think this would be better, but your call\n- **[issue]**: This is a bug or will cause problems\n- **[question]**: I am genuinely asking, not hinting\n\nThis system removes ambiguity and helps the author prioritize feedback efficiently.",

    "## Praise Good Work\n\nCode reviews are not just for criticism. When someone writes an elegant solution, say so. 'Nice use of discriminated unions here, really clean' costs you three seconds and might make someone's day. Positive feedback reinforces good patterns across the team.",

    "## Review the Code, Not the Person\n\nSay 'This function could be simplified' instead of 'You overcomplicated this.' It is a tiny shift in language that makes a big difference in how feedback lands.\n\nGood code reviews are an act of generosity. You are spending your time to make someone else's code - and someone else - better. Treat it that way.",

    "## Key Takeaways\n\n- Frame feedback as questions to invite dialogue instead of defensiveness\n- Always explain the reasoning behind suggestions to create learning opportunities\n- Use a prefix system ([nit], [suggestion], [issue], [question]) to clarify intent\n- Praise good work to reinforce positive patterns across the team\n- Review the code, not the person - use 'this function' instead of 'you'\n- Good code reviews are collaborative, not adversarial\n- The goal is shared improvement, not catching mistakes",
  ],
  faq: [
    { question: "How do you give good code reviews?", answer: "Lead with questions instead of commands, explain the reasoning behind suggestions, distinguish preferences from problems using prefixes like [nit], [suggestion], [issue], praise good work, and review the code not the person. Use language like 'This function could be simplified' rather than 'You overcomplicated this.'" },
    { question: "What is a code review prefix system?", answer: "A prefix system categorizes code review comments: [nit] for style preferences (take it or leave it), [suggestion] for recommended improvements, [issue] for bugs or problems that must be fixed, and [question] for genuine questions. This helps authors prioritize feedback." },
    { question: "Why are code reviews important?", answer: "Code reviews catch bugs before they reach production, spread knowledge across the team, maintain consistent coding standards, and build trust between team members. They are one of the most effective practices for improving overall code quality." },
    { question: "How do you handle negative code review feedback?", answer: "Focus on the code, not the person. If feedback is unclear, ask for clarification. If it is a preference rather than a problem, discuss it briefly and move on. Good teams establish shared standards so reviews focus on objective criteria rather than personal opinions." },
    { question: "How often should teams do code reviews?", answer: "Every pull request should be reviewed before merging. Reviews should happen promptly, ideally within a few hours. Long review delays slow the entire team. Keep pull requests small and focused to make reviews faster and more effective." },
  ],
};

export default post;
