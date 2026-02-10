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
  },
  {
    title: "On the Art of Slow Mornings",
    excerpt: "There's something magical about waking up before the world does. The quiet hum of dawn, the first sip of coffee, and the gentle promise of a new day.",
    date: "January 15, 2024",
    category: "Lifestyle",
    slug: "art-of-slow-mornings",
    readTime: "6 min read",
    imageUrl: postSlowMornings,
  },
  {
    title: "Finding Creativity in the Mundane",
    excerpt: "We often wait for inspiration to strike like lightning. But what if creativity is hiding in the dishes we wash, the walks we take, and the conversations we have?",
    date: "January 8, 2024",
    category: "Creativity",
    slug: "creativity-in-mundane",
    readTime: "4 min read",
    imageUrl: postCreativity,
  },
  {
    title: "A Letter to My Younger Self",
    excerpt: "If I could send a letter back through time, what would I say? This is an honest reflection on the lessons I wish I'd learned sooner.",
    date: "December 28, 2023",
    category: "Personal",
    slug: "letter-to-younger-self",
    readTime: "8 min read",
    imageUrl: postLetter,
  },
  {
    title: "The Books That Changed My Life",
    excerpt: "Some books stay with you long after you've turned the last page. Here are the stories that shaped my thinking and continue to guide me.",
    date: "December 15, 2023",
    category: "Reading",
    slug: "books-changed-my-life",
    readTime: "7 min read",
    imageUrl: postBooks,
  },
];

const Index = () => {
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
              Latest Blog
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Posts */}
            <div className="flex-1 min-w-0">
              {blogPosts.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}

              <div className="mt-10 text-center">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                  Load more..
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
