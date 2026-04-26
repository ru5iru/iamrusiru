import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { useSEO } from "@/hooks/useSEO";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: "Page Not Found | iamrusiru",
    description: "The page you're looking for doesn't exist. Navigate back to iamrusiru blog.",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="flex items-center justify-center py-32">
        <div className="text-center">
          <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-caption mb-8">Oops! This page doesn't exist.</p>
          <Link
            to="/"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
