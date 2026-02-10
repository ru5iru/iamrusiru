import { useState } from "react";
import Header from "@/components/blog/Header";
import Hero from "@/components/blog/Hero";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import Footer from "@/components/blog/Footer";
import allPosts from "@/data/posts";

const Index = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const filteredPosts = allPosts.filter((post) => {
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
