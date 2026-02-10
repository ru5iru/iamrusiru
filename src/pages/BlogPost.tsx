import { useParams, Link } from "react-router-dom";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { ArrowLeft } from "lucide-react";
import allPosts from "@/data/posts";
import type { ContentBlock } from "@/data/posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-display mb-4">Post not found</h1>
          <p className="text-body mb-8">The post you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary font-medium hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const renderBlock = (block: ContentBlock, i: number) => {
    if (typeof block === "string") {
      // Render markdown-ish headings and paragraphs
      if (block.startsWith("## ")) {
        const parts = block.split("\n\n");
        return (
          <div key={i} className="space-y-4">
            {parts.map((part, j) =>
              part.startsWith("## ") ? (
                <h2 key={j} className="font-display text-2xl font-semibold text-display mt-8 mb-2">
                  {part.replace("## ", "")}
                </h2>
              ) : (
                <p key={j} className="text-body text-lg leading-relaxed whitespace-pre-line">
                  {renderInlineFormatting(part)}
                </p>
              )
            )}
          </div>
        );
      }
      return (
        <p key={i} className="text-body text-lg leading-relaxed whitespace-pre-line">
          {renderInlineFormatting(block)}
        </p>
      );
    }

    // Code block
    return (
      <div key={i} className="my-6 rounded-xl overflow-hidden border border-divider">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-divider">
          <span className="text-xs font-mono text-caption">{block.language}</span>
        </div>
        <pre className="p-4 overflow-x-auto bg-muted/30 text-sm leading-relaxed">
          <code className="font-mono text-body">{block.code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-caption text-sm hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="blog-tag">{post.category}</span>
            <span className="text-sm text-caption">{post.date}</span>
            <span className="text-sm text-caption">·</span>
            <span className="text-sm text-caption">{post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-display leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-divider">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="font-display text-lg text-display">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-display">Alex Chen</p>
              <p className="text-xs text-caption">Software Engineer & Writer</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden mb-10">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>

          <div className="space-y-6">
            {post.content.map((block, i) => renderBlock(block, i))}
          </div>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">{tag}</span>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-divider flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
            >
              <ArrowLeft size={16} />
              Back to all posts
            </Link>

            <div className="flex items-center gap-2 text-caption text-sm">
              <span>Share this post</span>
              {["T", "I", "L"].map((letter) => (
                <a
                  key={letter}
                  href="#"
                  className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all text-xs font-bold"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

/** Simple inline formatting: **bold** and *italic* */
function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-display">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default BlogPost;
