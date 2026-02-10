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
    title: "The Joy of Writing by Hand",
    excerpt: "In an age of keyboards and voice notes, there's a quiet rebellion in picking up a pen. I've been journaling for years, and here's what putting pen to paper has taught me about presence.",
    date: "January 22, 2024",
    category: "Essays",
    slug: "joy-of-writing-by-hand",
    readTime: "6 min read",
    imageUrl: featuredImage,
    tags: ["#writing", "#journaling", "#essays", "#mindfulness"],
  },
  {
    title: "On the Art of Slow Mornings",
    excerpt: "There's something magical about waking up before the world does. The quiet hum of dawn, the first sip of coffee, and the gentle promise of a new day.",
    date: "January 15, 2024",
    category: "Lifestyle",
    slug: "art-of-slow-mornings",
    readTime: "6 min read",
    imageUrl: postSlowMornings,
    tags: ["#slowliving", "#lifestyle", "#mindfulness", "#personal"],
  },
  {
    title: "Finding Creativity in the Mundane",
    excerpt: "We often wait for inspiration to strike like lightning. But what if creativity is hiding in the dishes we wash, the walks we take, and the conversations we have?",
    date: "January 8, 2024",
    category: "Creativity",
    slug: "creativity-in-mundane",
    readTime: "4 min read",
    imageUrl: postCreativity,
    tags: ["#creativity", "#reflection", "#personal"],
  },
  {
    title: "A Letter to My Younger Self",
    excerpt: "If I could send a letter back through time, what would I say? This is an honest reflection on the lessons I wish I'd learned sooner.",
    date: "December 28, 2023",
    category: "Personal",
    slug: "letter-to-younger-self",
    readTime: "8 min read",
    imageUrl: postLetter,
    tags: ["#personal", "#reflection", "#essays", "#writing"],
  },
  {
    title: "The Books That Changed My Life",
    excerpt: "Some books stay with you long after you've turned the last page. Here are the stories that shaped my thinking and continue to guide me.",
    date: "December 15, 2023",
    category: "Reading",
    slug: "books-changed-my-life",
    readTime: "7 min read",
    imageUrl: postBooks,
    tags: ["#books", "#reading", "#reflection"],
  },
  {
    title: "Why I Stopped Chasing Productivity",
    excerpt: "For years I optimized every hour. Then I realized that rest isn't laziness — it's the soil where my best ideas grow.",
    date: "December 5, 2023",
    category: "Lifestyle",
    slug: "stopped-chasing-productivity",
    readTime: "5 min read",
    imageUrl: postSlowMornings,
    tags: ["#lifestyle", "#slowliving", "#mindfulness"],
  },
  {
    title: "Sketching as Meditation",
    excerpt: "I'm not an artist by any stretch. But since I started sketching daily, I've found a kind of peace that no app could ever give me.",
    date: "November 20, 2023",
    category: "Creativity",
    slug: "sketching-as-meditation",
    readTime: "4 min read",
    imageUrl: postCreativity,
    tags: ["#creativity", "#mindfulness", "#personal"],
  },
  {
    title: "My Favourite Poetry Collections",
    excerpt: "Poetry has a way of saying what prose can't. These are the collections I return to again and again when I need to feel something.",
    date: "November 10, 2023",
    category: "Reading",
    slug: "favourite-poetry-collections",
    readTime: "5 min read",
    imageUrl: postBooks,
    tags: ["#books", "#reading", "#writing"],
  },
  {
    title: "Lessons From Living Alone",
    excerpt: "Solitude taught me more about myself than any relationship ever did. Here's what two years of living alone revealed.",
    date: "October 28, 2023",
    category: "Personal",
    slug: "lessons-living-alone",
    readTime: "7 min read",
    imageUrl: postLetter,
    tags: ["#personal", "#reflection", "#lifestyle"],
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
              {activeTopic || activeTag ? "Filtered Posts" : "Latest Blog"}
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
