import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import Header from "@/components/blog/Header";
import Hero from "@/components/blog/Hero";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import Footer from "@/components/blog/Footer";
import allPosts from "@/data/posts";
import { useSEO } from "@/hooks/useSEO";
import { authorFaqSchema } from "@/data/authorFaq";

const POSTS_PER_PAGE = 6;
const SITE = "https://iamrusiru.lovable.app";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagParam = searchParams.get("tag");
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Sync URL tag param to state
  useEffect(() => {
    setActiveTag(tagParam);
    setVisibleCount(POSTS_PER_PAGE);
  }, [tagParam]);

  useSEO({
    title: "Rusiru Rathmina | Software Engineer Blog",
    description:
      "Read about software engineering, career lessons, side projects, and the human side of building software by Rusiru Rathmina.",
    canonical: "/",
    jsonLd: [
      {
        "@type": "CollectionPage",
        name: "iamrusiru Blog",
        description: "Software engineering blog by Rusiru Rathmina covering code, career, side projects, and developer life.",
        url: `${SITE}/`,
        author: { "@type": "Person", name: "Rusiru Rathmina" },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: allPosts.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/post/${p.slug}`,
            name: p.title,
          })),
        },
      },
      {
        "@type": "Blog",
        name: "iamrusiru",
        description: "A personal blog by Rusiru Rathmina about software engineering, career growth, side projects, and developer life.",
        url: `${SITE}/`,
        author: {
          "@type": "Person",
          name: "Rusiru Rathmina",
          url: `${SITE}/about`,
          jobTitle: "Associate Software Engineer",
          sameAs: [
            "https://github.com/ru5iru",
            "https://www.linkedin.com/in/ru5iru",
            "https://x.com/ru5iru",
            "https://instagram.com/rusiru.rathmina",
          ],
        },
        inLanguage: "en",
        blogPost: allPosts.slice(0, 10).map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date,
          url: `${SITE}/post/${p.slug}`,
          author: { "@type": "Person", name: "Rusiru Rathmina" },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }],
      },
      authorFaqSchema,
    ],
  });

  const filteredPosts = allPosts.filter((post) => {
    if (activeTopic && post.category !== activeTopic) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    return true;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const clearTagParam = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("tag");
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setActiveTopic(null);
    clearTagParam();
    setVisibleCount(POSTS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <Hero />

        <section className="py-12 border-t border-divider">
          <div className="max-w-6xl mx-auto px-6">
            {activeTag && (
              <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
                <p className="text-sm text-foreground">
                  Showing posts tagged: <span className="font-semibold text-primary">#{activeTag}</span>
                </p>
                <button
                  type="button"
                  onClick={clearTagParam}
                  aria-label="Clear tag filter"
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {activeTopic || activeTag ? "Filtered Posts" : "Latest Posts"}
              </h2>
              {(activeTopic || activeTag) && (
                <button
                  onClick={clearFilters}
                  className="ml-3 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Clear filters ✕
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 min-w-0">
                {visiblePosts.length > 0 ? (
                  visiblePosts.map((post) => <PostCard key={post.slug} {...post} />)
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-muted-foreground text-lg mb-4">No posts found for this filter.</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Show all posts
                    </button>
                  </div>
                )}

                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Load more ({filteredPosts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-72 flex-shrink-0">
                <Sidebar
                  activeTopic={activeTopic}
                  activeTag={activeTag}
                  onTopicSelect={(topic) => {
                    setActiveTopic(activeTopic === topic ? null : topic);
                    clearTagParam();
                    setVisibleCount(POSTS_PER_PAGE);
                  }}
                  onTagSelect={(tag) => {
                    const cleaned = tag.replace(/^#/, "");
                    if (activeTag === cleaned) {
                      clearTagParam();
                    } else {
                      const params = new URLSearchParams(searchParams);
                      params.set("tag", cleaned);
                      setSearchParams(params, { replace: true });
                    }
                    setActiveTopic(null);
                    setVisibleCount(POSTS_PER_PAGE);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
