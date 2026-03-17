import postBooksEngineer from "@/assets/post-books-engineer.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "The Books That Made Me a Better Engineer",
  excerpt:
    "Not all of them are about code. Some are about thinking, systems, and communication — skills that matter just as much as algorithms.",
  date: "January 20, 2026",
  category: "Reading",
  slug: "books-better-engineer",
  readTime: "6 min read",
  imageUrl: postBooksEngineer,
  tags: ["#career", "#productivity"],
  content: [
    "When people ask me for book recommendations, they usually expect titles like 'Clean Code' or 'Design Patterns.' And yes, those are solid. But the books that truly levelled me up as an engineer weren't always about code.",
    "## The Classics That Deliver\n\n**'A Philosophy of Software Design' by John Ousterhout** — This one reshaped how I think about complexity. Ousterhout's core argument is that the primary job of a software engineer is to manage complexity, and most of us are terrible at it. Deep modules, shallow interfaces, and strategic programming — these ideas stick with you.",
    "**'The Pragmatic Programmer' by Hunt & Thomas** — I re-read this every couple of years. The 'broken windows' metaphor for code quality, the idea of tracer bullets for prototyping, DRY taken to its logical conclusion. It's the book that taught me to think like a craftsperson.",
    "## Beyond Code\n\n**'Thinking in Systems' by Donella Meadows** — Software is systems. Understanding feedback loops, leverage points, and emergent behaviour made me better at designing architectures that scale — not just technically, but organisationally.\n\n**'Nonviolent Communication' by Marshall Rosenberg** — This sounds unrelated, but hear me out. So much of engineering is communication: code reviews, design docs, standups, incident retrospectives. Learning to express observations without judgment and to hear criticism without defensiveness made me a better teammate.",
    "**'Four Thousand Weeks' by Oliver Burkeman** — This one's about time management, but not in the 'productivity hack' sense. It's about accepting that you can't do everything and choosing what matters. It helped me stop saying yes to every interesting project and start finishing the ones that matter.",
    "The best investment you can make as an engineer isn't another framework tutorial — it's reading broadly. History, psychology, design, philosophy. The wider your mental models, the better your code.",
  ],
};

export default post;
