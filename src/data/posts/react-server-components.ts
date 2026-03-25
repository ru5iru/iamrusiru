import postReactRsc from "@/assets/post-react-rsc.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "React Server Components: What Actually Changes?",
  excerpt:
    "RSCs sound great in theory but what do they mean for your existing app? I broke down the mental model shift and migration path.",
  date: "January 5, 2026",
  category: "Tutorials",
  slug: "react-server-components",
  readTime: "10 min read",
  imageUrl: postReactRsc,
  tags: ["#react", "#webdev", "#frontend", "#javascript"],
  content: [
    "React Server Components (RSCs) represent the biggest shift in React's architecture since hooks. But cutting through the hype, what do they actually mean for developers working on real apps?",
    "## The Core Idea\n\nTraditionally, all React components run in the browser. With RSCs, some components run *only on the server*. They can access databases, read files, and call APIs directly, without shipping that code to the client.",
    {
      type: "code",
      language: "typescript",
      code: `// Server Component — runs on the server only
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
    "Notice there's no `useEffect`, no `useState`, no loading spinner. The component fetches data during rendering on the server and sends the result as HTML (plus a serialised component tree) to the client.",
    "## Client vs Server: The Mental Model\n\nThe key question for every component becomes: does this need interactivity? If yes, it's a Client Component (add `'use client'` at the top). If no, it's a Server Component by default.\n\nInteractive elements like buttons, forms, and anything with `useState` or `useEffect` must be Client Components. Everything else can stay on the server, which means less JavaScript shipped to the browser.",
    {
      type: "code",
      language: "typescript",
      code: `'use client';

import { useState } from 'react';

// Client Component — has interactivity
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
    "## What This Means for Your App\n\n**Bundle size drops.** Server Components don't add to your JavaScript bundle. A markdown renderer, a syntax highlighter, a date formatting library: if they're only used in Server Components, they stay on the server.\n\n**Data fetching simplifies.** No more `useEffect` into loading state into error state dance for data that doesn't change after page load. Just `await` it directly.\n\n**The learning curve is real.** You need to understand the boundary between server and client, what can be passed across it (serialisable data only), and how composition patterns change.\n\nRSCs aren't a rewrite of React; they're an evolution. Start by identifying your data-fetching components and see if they can move to the server. The wins compound from there.",
  ],
};

export default post;
