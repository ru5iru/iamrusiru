import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import allPosts from "@/data/posts";
import { useSEO } from "@/hooks/useSEO";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: "Page Not Found | iamrusiru",
    description: "The page you're looking for doesn't exist. Navigate back to the iamrusiru blog homepage to find recent posts.",
  });

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const prev = robots?.getAttribute("content") ?? null;
    if (robots) robots.setAttribute("content", "noindex, follow");
    return () => {
      if (robots && prev !== null) robots.setAttribute("content", prev);
    };
  }, []);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const recent = allPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-display text-6xl font-bold text-primary mb-3">404</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-8">
            This page does not exist or may have moved.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go to homepage
          </Link>

          <section className="mt-16 text-left" aria-labelledby="recent-heading">
            <h2 id="recent-heading" className="font-display text-xl font-semibold text-foreground mb-4">
              Recent posts
            </h2>
            <ul className="space-y-3">
              {recent.map((p) => (
                <li key={p.slug} className="border-b border-divider pb-3">
                  <Link
                    to={`/post/${p.slug}`}
                    className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <p className="font-display text-base font-medium text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </p>
                    <time dateTime={p.date} className="text-xs text-muted-foreground">
                      {p.date}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
