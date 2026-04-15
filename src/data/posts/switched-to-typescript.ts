import postTypescript from "@/assets/post-typescript.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why I Switched From JavaScript to TypeScript (And Never Looked Back)",
  excerpt:
    "TypeScript catches bugs at compile time that JavaScript misses at runtime, making refactoring fearless, onboarding faster, and codebases dramatically more maintainable. Here is why I switched and what changed.",
  date: "February 5, 2026",
  category: "Engineering",
  slug: "switched-to-typescript",
  readTime: "7 min read",
  imageUrl: postTypescript,
  tags: ["TypeScript", "JavaScript", "web development", "frontend", "type safety"],
  content: [
    "Switching from JavaScript to TypeScript is one of the highest-impact decisions a frontend or full-stack developer can make. TypeScript adds static type checking to JavaScript, catching entire categories of bugs before your code ever runs. After six years of pure JavaScript, I made the switch - and it transformed how I write, refactor, and maintain code.",

    "The trigger was embarrassing. A user's `firstName` was showing up as `undefined` throughout the dashboard because somewhere deep in a utility function, I had written `user.fistName`. No linter caught it. No test covered that exact path. It sailed through code review and into production.",

    "## Getting Started With TypeScript\n\nGetting started was easier than I expected. I ran `npx tsc --init`, tweaked a few settings, and renamed my first `.js` file to `.ts`. The compiler immediately found three bugs I did not know existed.",
    {
      type: "code",
      language: "typescript",
      code: `// Before: JavaScript, looks fine, silently broken
function getFullName(user) {
  return user.fistName + " " + user.lastName; // typo: fistName
}

// After: TypeScript, caught at compile time
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function getFullName(user: User): string {
  return user.firstName + " " + user.lastName;
}`,
    },
    "Within the first week I noticed a shift. I was not just catching bugs earlier; I was *thinking* differently. Types became documentation. Interfaces became contracts. My IDE went from a text editor to a co-pilot, auto-completing properties and warning me about mismatches in real time.",

    "## What Actually Changed After Switching to TypeScript",

    "**Refactoring became fearless.** Renaming a field? TypeScript tells you every file that needs updating. Changing a function signature? The compiler walks you through the cascade. I went from dreading refactors to seeking them out.\n\n**Onboarding got faster.** New team members could read the types and understand the shape of data flowing through the app without digging through runtime logs or asking questions.\n\n**Runtime errors dropped significantly.** Not to zero (TypeScript is not magic) but the class of bugs that slipped through shrank dramatically.",
    {
      type: "code",
      language: "typescript",
      code: `// Discriminated unions changed how I model state
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case "idle":
      return "Waiting...";
    case "loading":
      return "Loading...";
    case "success":
      return \`Got: \${state.data}\`; // TS knows 'data' exists here
    case "error":
      return \`Error: \${state.error.message}\`;
  }
}`,
    },
    "## TypeScript Tradeoffs and Limitations\n\nTypeScript adds compilation time. Some third-party libraries have poor or missing type definitions. Generics can get complex. And there is a learning curve, especially around utility types like `Partial`, `Pick`, and `Record`.\n\nBut every tradeoff has been worth it. I write code with more confidence, ship fewer bugs, and spend less time debugging.",

    "## Key Takeaways\n\n- TypeScript catches entire categories of bugs at compile time that JavaScript misses at runtime\n- Types serve as living documentation, making codebases self-describing\n- Refactoring becomes safe because the compiler identifies every affected file\n- New team members onboard faster by reading type definitions instead of runtime logs\n- The initial learning curve pays for itself within weeks through reduced debugging time\n- Start by converting one file at a time - you do not need to migrate everything at once\n- Discriminated unions and utility types are powerful patterns worth learning early",
  ],
  faq: [
    { question: "Why should I switch from JavaScript to TypeScript?", answer: "TypeScript catches bugs at compile time that JavaScript misses at runtime, such as typos in property names. It makes refactoring fearless, speeds up onboarding for new team members, and significantly reduces runtime errors. Types serve as documentation and interfaces become contracts." },
    { question: "What are the downsides of TypeScript?", answer: "TypeScript adds compilation time, some third-party libraries have poor or missing type definitions, generics can be complex, and there is a learning curve with utility types like Partial, Pick, and Record. Despite these tradeoffs, most developers find the benefits outweigh the costs." },
    { question: "How do I start migrating from JavaScript to TypeScript?", answer: "Run npx tsc --init to create a TypeScript configuration, then rename your first .js file to .ts. The compiler will immediately flag issues. Start with one file at a time and gradually convert your codebase." },
    { question: "Does TypeScript improve code refactoring?", answer: "Yes. When you rename a field or change a function signature, the TypeScript compiler identifies every file that needs updating. This makes large-scale refactoring safe and predictable, turning what used to be risky changes into routine improvements." },
    { question: "What are discriminated unions in TypeScript?", answer: "Discriminated unions are a TypeScript pattern for modeling state with a shared property (like status) that narrows the type. For example, an AsyncState type can have idle, loading, success, and error variants. TypeScript knows which properties exist in each variant, preventing invalid access." },
  ],
};

export default post;
