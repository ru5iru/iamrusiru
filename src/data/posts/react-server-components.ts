import postReactRsc from "@/assets/post-react-rsc.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "React Server Components: What Actually Changes?",
  excerpt:
    "React Server Components run only on the server, reducing bundle size and simplifying data fetching. Here is how they work, when to use them, and what changes in your existing React applications.",
  date: "January 5, 2026",
  category: "Tutorials",
  slug: "react-server-components",
  readTime: "10 min read",
  imageUrl: postReactRsc,
  tags: ["React", "Server Components", "web development", "frontend", "JavaScript"],
  seoKeywords: ["React Server Components", "RSC explained", "React Server Components vs SSR", "Next.js Server Components", "React 18 server components", "streaming React", "React data fetching", "client vs server components"],
  content: [
    "React Server Components (RSCs) represent the biggest shift in React architecture since hooks. Server Components run only on the server, allowing direct database access and API calls without shipping that code to the client. This reduces JavaScript bundle size and simplifies data fetching patterns.",

    "## The Core Idea\n\nTraditionally, all React components run in the browser. With RSCs, some components run *only on the server*. They can access databases, read files, and call APIs directly, without shipping that code to the client.",
    {
      type: "code",
      language: "typescript",
      code: `// Server Component: runs on the server only
// This code never reaches the browser
async function BlogPosts() {
  const posts = await db.query("SELECT * FROM posts ORDER BY date DESC");

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}`,
    },
    "Notice there is no `useEffect`, no `useState`, no loading spinner. The component fetches data during rendering on the server and sends the result as HTML (plus a serialized component tree) to the client.",

    "## Client vs Server: The Mental Model\n\nThe key question for every component becomes: does this need interactivity? If yes, it is a Client Component (add `'use client'` at the top). If no, it is a Server Component by default.\n\nInteractive elements like buttons, forms, and anything with `useState` or `useEffect` must be Client Components. Everything else can stay on the server, which means less JavaScript shipped to the browser.",
    {
      type: "code",
      language: "typescript",
      code: `'use client';

import { useState } from 'react';

// Client Component: has interactivity
function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked(true);
    await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' });
  };

  return (
    <button onClick={handleLike}>
      {liked ? '❤️' : '🤍'} Like
    </button>
  );
}`,
    },

    "## What React Server Components Mean for Your App\n\n**Bundle size drops.** Server Components do not add to your JavaScript bundle. A markdown renderer, a syntax highlighter, a date formatting library - if they are only used in Server Components, they stay on the server.\n\n**Data fetching simplifies.** No more `useEffect` into loading state into error state dance for data that does not change after page load. Just `await` it directly.\n\n**The learning curve is real.** You need to understand the boundary between server and client, what can be passed across it (serializable data only), and how composition patterns change.",

    "## How to Migrate Existing React Apps\n\nRSCs are not a rewrite of React; they are an evolution. Start by identifying your data-fetching components and see if they can move to the server. The wins compound from there. Components that just render data from an API are strong candidates for conversion to Server Components.",

    "## Key Takeaways\n\n- React Server Components run only on the server, reducing client-side JavaScript\n- Server Components can directly access databases and APIs without useEffect\n- Client Components (marked with 'use client') handle interactivity with hooks\n- Bundle size decreases because server-only libraries are not shipped to the browser\n- Only serializable data can be passed from Server to Client Components\n- Start migration by converting data-fetching components first\n- RSCs are an evolution of React, not a complete rewrite",
  ],
  faq: [
    { question: "What are React Server Components?", answer: "React Server Components (RSCs) are components that run only on the server. They can access databases, read files, and call APIs directly without shipping that code to the client. This reduces bundle size and simplifies data fetching." },
    { question: "What is the difference between Server Components and Client Components?", answer: "Server Components run on the server and cannot use hooks like useState or useEffect. Client Components (marked with 'use client') run in the browser and handle interactivity. If a component needs user interaction, it must be a Client Component." },
    { question: "Do React Server Components reduce bundle size?", answer: "Yes. Server Components do not add to your JavaScript bundle. Libraries used only in Server Components (markdown renderers, syntax highlighters, date formatters) stay on the server, significantly reducing the code sent to the browser." },
    { question: "How do I migrate an existing React app to Server Components?", answer: "Start by identifying data-fetching components that use useEffect to load data. These are strong candidates for conversion to Server Components where you can await data directly. Keep interactive components as Client Components with the 'use client' directive." },
    { question: "Can Server Components use React hooks?", answer: "No. Server Components cannot use useState, useEffect, or other React hooks because they run on the server, not in the browser. Any component that needs hooks must be a Client Component marked with 'use client' at the top of the file." },
  ],
};

export default post;
