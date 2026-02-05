import Header from "@/components/blog/Header";
import Hero from "@/components/blog/Hero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostCard from "@/components/blog/PostCard";
import Newsletter from "@/components/blog/Newsletter";
import Footer from "@/components/blog/Footer";
import featuredImage from "@/assets/featured-post.jpg";

const blogPosts = [
  {
    title: "On the Art of Slow Mornings",
    excerpt: "There's something magical about waking up before the world does. The quiet hum of dawn, the first sip of coffee, and the gentle promise of a new day. This essay explores why slowing down might be the key to living more fully.",
    date: "January 15, 2024",
    category: "Lifestyle",
    slug: "art-of-slow-mornings",
    readTime: "6 min read",
  },
  {
    title: "Finding Creativity in the Mundane",
    excerpt: "We often wait for inspiration to strike like lightning. But what if creativity is hiding in the dishes we wash, the walks we take, and the conversations we have?",
    date: "January 8, 2024",
    category: "Creativity",
    slug: "creativity-in-mundane",
    readTime: "4 min read",
  },
  {
    title: "A Letter to My Younger Self",
    excerpt: "If I could send a letter back through time, what would I say? This is an honest reflection on the lessons I wish I'd learned sooner.",
    date: "December 28, 2023",
    category: "Personal",
    slug: "letter-to-younger-self",
    readTime: "8 min read",
  },
  {
    title: "The Books That Changed My Life",
    excerpt: "Some books stay with you long after you've turned the last page. Here are the stories that shaped my thinking and continue to guide me.",
    date: "December 15, 2023",
    category: "Reading",
    slug: "books-changed-my-life",
    readTime: "7 min read",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <div className="blog-divider" />
      
      {/* Featured Post */}
      <section className="py-12">
        <div className="blog-container">
          <h2 className="font-display text-sm uppercase tracking-widest text-caption mb-8">
            Featured Story
          </h2>
          
          <FeaturedPost
            title="The Joy of Writing by Hand"
            excerpt="In an age of keyboards and voice notes, there's a quiet rebellion in picking up a pen. I've been journaling for years, and here's what putting pen to paper has taught me about presence, memory, and the art of thinking slowly."
            date="January 22, 2024"
            category="Essays"
            slug="joy-of-writing-by-hand"
            imageUrl={featuredImage}
          />
        </div>
      </section>
      
      <div className="blog-divider" />
      
      {/* Recent Posts */}
      <section className="py-12">
        <div className="blog-container">
          <h2 className="font-display text-sm uppercase tracking-widest text-caption mb-8">
            Recent Posts
          </h2>
          
          <div>
            {blogPosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 border border-divider text-display font-medium rounded-full hover:border-primary hover:text-primary transition-colors">
              View All Posts
            </button>
          </div>
        </div>
      </section>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
