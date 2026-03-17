import postTypescript from "@/assets/post-typescript.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why I Switched From JavaScript to TypeScript (And Never Looked Back)",
  excerpt:
    "After years of wrestling with runtime errors, I finally made the switch. Here's what changed in my workflow, my confidence, and my codebase.",
  date: "February 5, 2026",
  category: "Engineering",
  slug: "switched-to-typescript",
  readTime: "7 min read",
  imageUrl: featuredImage,
  tags: ["#typescript", "#javascript", "#webdev", "#frontend"],
  content: [
    "I'd been writing JavaScript for nearly six years before I seriously considered TypeScript. It always felt like extra ceremony — more syntax, more configuration, more things to learn. But after one particularly brutal production bug caused by a typo in a property name, I decided to give it a real shot.",
    "The bug was embarrassing. A user's `firstName` was showing up as `undefined` throughout the dashboard because somewhere deep in a utility function, I'd written `user.fistName`. No linter caught it. No test covered that exact path. It sailed through code review and into production.",
    "## The Setup\n\nGetting started was easier than I expected. I ran `npx tsc --init`, tweaked a few settings, and renamed my first `.js` file to `.ts`. The compiler immediately found three bugs I didn't know existed.",
    {
      type: "code",
      language: "typescript",
      code: `// Before: JavaScript — looks fine, silently broken
function getFullName(user) {
  return user.fistName + " " + user.lastName; // typo: fistName
}

// After: TypeScript — caught at compile time
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function getFullName(user: User): string {
  return user.firstName + " " + user.lastName;
}`,
    },
    "Within the first week I noticed a shift. I wasn't just catching bugs earlier — I was *thinking* differently. Types became documentation. Interfaces became contracts. My IDE went from a text editor to a co-pilot, auto-completing properties and warning me about mismatches in real time.",
    "## What Actually Changed\n\n**Refactoring became fearless.** Renaming a field? TypeScript tells you every file that needs updating. Changing a function signature? The compiler walks you through the cascade. I went from dreading refactors to seeking them out.\n\n**Onboarding got faster.** New team members could read the types and understand the shape of data flowing through the app without digging through runtime logs or asking questions.\n\n**Runtime errors dropped significantly.** Not to zero — TypeScript isn't magic — but the class of bugs that slipped through shrank dramatically.",
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
    "## The Tradeoffs\n\nIt's not all sunshine. TypeScript adds compilation time. Some third-party libraries have poor or missing type definitions. Generics can get gnarly. And there's a learning curve — especially around utility types like `Partial`, `Pick`, and `Record`.\n\nBut every tradeoff has been worth it. I write code with more confidence, ship fewer bugs, and spend less time debugging. If you're on the fence, just try converting one file. You might not look back either.",
  ],
};

export default post;
