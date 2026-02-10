import { useState } from "react";
import Header from "@/components/blog/Header";
import Hero from "@/components/blog/Hero";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import Footer from "@/components/blog/Footer";

import postSlowMornings from "@/assets/post-slow-mornings.jpg";
import featuredImage from "@/assets/featured-post.jpg";
import postCreativity from "@/assets/post-creativity.jpg";
import postLetter from "@/assets/post-letter.jpg";
import postBooks from "@/assets/post-books.jpg";

const blogPosts = [
  {
    title: "Why I Switched From JavaScript to TypeScript (And Never Looked Back)",
    excerpt: "After years of wrestling with runtime errors, I finally made the switch. Here's what changed in my workflow, my confidence, and my codebase.",
    date: "February 5, 2026",
    category: "Engineering",
    slug: "switched-to-typescript",
    readTime: "7 min read",
    imageUrl: featuredImage,
    tags: ["#typescript", "#javascript", "#webdev", "#frontend"],
  },
  {
    title: "Building a CLI Tool in Rust: A Weekend Adventure",
    excerpt: "I spent a weekend building a file organiser in Rust. It was frustrating, enlightening, and oddly satisfying. Here's the full breakdown.",
    date: "January 28, 2026",
    category: "Side Projects",
    slug: "cli-tool-rust",
    readTime: "8 min read",
    imageUrl: postCreativity,
    tags: ["#opensource", "#devlife", "#backend"],
  },
  {
    title: "The Books That Made Me a Better Engineer",
    excerpt: "Not all of them are about code. Some are about thinking, systems, and communication — skills that matter just as much as algorithms.",
    date: "January 20, 2026",
    category: "Reading",
    slug: "books-better-engineer",
    readTime: "6 min read",
    imageUrl: postBooks,
    tags: ["#career", "#productivity"],
  },
  {
    title: "How I Landed My First Remote Dev Job",
    excerpt: "From cold applications to take-home tests — here's an honest recap of what worked, what didn't, and what I'd do differently.",
    date: "January 12, 2026",
    category: "Career",
    slug: "first-remote-dev-job",
    readTime: "9 min read",
    imageUrl: postLetter,
    tags: ["#career", "#devlife", "#productivity"],
  },
  {
    title: "React Server Components: What Actually Changes?",
    excerpt: "RSCs sound great in theory but what do they mean for your existing app? I broke down the mental model shift and migration path.",
    date: "January 5, 2026",
    category: "Tutorials",
    slug: "react-server-components",
    readTime: "10 min read",
    imageUrl: postSlowMornings,
    tags: ["#react", "#webdev", "#frontend", "#javascript"],
  },
  {
    title: "Setting Up a Python FastAPI Backend in 15 Minutes",
    excerpt: "A quick-start guide to spinning up a REST API with FastAPI, complete with validation, docs, and database integration.",
    date: "December 22, 2025",
    category: "Tutorials",
    slug: "fastapi-quickstart",
    readTime: "5 min read",
    imageUrl: featuredImage,
    tags: ["#python", "#backend", "#codebits"],
  },
  {
    title: "Why Side Projects Keep Me Sane",
    excerpt: "Work code has constraints. Side projects are where I experiment, fail, and rediscover the joy that got me into programming.",
    date: "December 15, 2025",
    category: "Personal",
    slug: "side-projects-keep-me-sane",
    readTime: "5 min read",
    imageUrl: postCreativity,
    tags: ["#devlife", "#opensource", "#productivity"],
  },
  {
    title: "Code Review Etiquette: Being Kind and Thorough",
    excerpt: "Good code reviews build trust. Bad ones build resentment. Here are the habits I've adopted to make reviews productive for everyone.",
    date: "December 8, 2025",
    category: "Career",
    slug: "code-review-etiquette",
    readTime: "6 min read",
    imageUrl: postLetter,
    tags: ["#career", "#devlife", "#productivity"],
  },
  {
    title: "Useful One-Liners I Keep in My Dotfiles",
    excerpt: "A curated list of bash aliases, git shortcuts, and tiny scripts that save me minutes every day.",
    date: "November 30, 2025",
    category: "Engineering",
    slug: "dotfile-one-liners",
    readTime: "4 min read",
    imageUrl: postSlowMornings,
    tags: ["#codebits", "#productivity", "#backend"],
  },
  {
    title: "Burnout, Recovery, and What I Learned",
    excerpt: "I hit a wall last year. This is an honest look at what burnout felt like, how I recovered, and the boundaries I set to protect my energy.",
    date: "November 20, 2025",
    category: "Personal",
    slug: "burnout-and-recovery",
    readTime: "8 min read",
    imageUrl: postBooks,
    tags: ["#devlife", "#career", "#productivity"],
  },
];

const Index = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    if (activeTopic && post.category !== activeTopic) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    return true;
  });

  const clearFilters = () => {
    setActiveTag(null);
    setActiveTopic(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Blog listing + Sidebar */}
      <section className="py-12 border-t border-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="font-display text-2xl font-semibold text-display">
              {activeTopic || activeTag ? "Filtered Posts" : "Latest Posts"}
            </h2>
            {(activeTopic || activeTag) && (
              <button
                onClick={clearFilters}
                className="ml-3 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Clear filters ✕
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Posts */}
            <div className="flex-1 min-w-0">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.slug} {...post} />
                ))
              ) : (
                <div className="py-16 text-center">
                  <p className="text-caption text-lg mb-4">No posts found for this filter.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Show all posts
                  </button>
                </div>
              )}

              {filteredPosts.length > 0 && !activeTopic && !activeTag && (
                <div className="mt-10 text-center">
                  <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                    Load more..
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <Sidebar
                activeTopic={activeTopic}
                activeTag={activeTag}
                onTopicSelect={(topic) => {
                  setActiveTopic(activeTopic === topic ? null : topic);
                  setActiveTag(null);
                }}
                onTagSelect={(tag) => {
                  setActiveTag(activeTag === tag ? null : tag);
                  setActiveTopic(null);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
