import { useParams, Link } from "react-router-dom";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { ArrowLeft, Linkedin, Facebook, Link2, Check } from "lucide-react";
import ReadingProgress from "@/components/blog/ReadingProgress";
import allPosts from "@/data/posts";
import type { ContentBlock } from "@/data/posts";
import profileHeadshot from "@/assets/profile-headshot.jpg";
import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";

const SITE = "https://iamrusiru.lovable.app";

// WhatsApp icon SVG
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = allPosts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  const postUrl = typeof window !== "undefined" ? window.location.href : "";

  // Estimate word count from content blocks for GEO
  const wordCount = useMemo(() => {
    if (!post) return 0;
    return post.content.reduce((count, block) => {
      if (typeof block === "string") return count + block.split(/\s+/).length;
      if (block.type === "code") return count + block.code.split(/\s+/).length;
      return count;
    }, 0);
  }, [post]);

  const jsonLd = useMemo(() => post ? [
    {
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.imageUrl,
      "datePublished": post.date,
      "dateModified": post.date,
      "wordCount": wordCount,
      "author": {
        "@type": "Person",
        "name": "Rusiru Rathmina",
        "url": `${SITE}/about`,
        "jobTitle": "Associate Software Engineer",
        "sameAs": [
          "https://github.com/ru5iru",
          "https://www.linkedin.com/in/ru5iru",
          "https://x.com/ru5iru",
          "https://instagram.com/rusiru.rathmina"
        ]
      },
      "publisher": {
        "@type": "Person",
        "name": "Rusiru Rathmina"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE}/post/${post.slug}`
      },
      "keywords": post.tags.join(", "),
      "articleSection": post.category,
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".post-summary", "h1", ".post-content p:first-of-type"]
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": post.category, "item": `${SITE}/` },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": `${SITE}/post/${post.slug}` }
      ]
    }
  ] : undefined, [post, wordCount]);

  useSEO({
    title: post ? `${post.title} | iamrusiru` : "Post Not Found | iamrusiru",
    description: post?.excerpt || "The blog post you're looking for doesn't exist.",
    canonical: post ? `/post/${post.slug}` : undefined,
    ogType: "article",
    ogImage: post?.imageUrl,
    jsonLd,
    articleMeta: post ? {
      publishedTime: post.date,
      author: "Rusiru Rathmina",
      section: post.category,
      tags: post.tags,
    } : undefined,
  });

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <ReadingProgress />
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
            <time dateTime={post.date} className="text-sm text-caption">{post.date}</time>
            <span className="text-sm text-caption">·</span>
            <span className="text-sm text-caption">{post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-display leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-divider">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img src={profileHeadshot} alt="Rusiru Rathmina" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-display">Rusiru Rathmina</p>
              <p className="text-xs text-caption">Software Engineer & Writer</p>
            </div>
          </div>

          {/* TL;DR summary for AI engines (GEO: citable snippet) */}
          <div className="post-summary rounded-xl bg-primary/5 border border-primary/10 px-6 py-5 mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
            <p className="text-body text-base leading-relaxed">{post.excerpt}</p>
          </div>

          <div className="rounded-xl overflow-hidden mb-10">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[400px]"
              loading="lazy"
            />
          </div>

          <div className="post-content space-y-6">
            {post.content.map((block, i) => renderBlock(block, i))}
          </div>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">{tag}</span>
            ))}
          </div>

          {/* Author bio for E-E-A-T (GEO) */}
          <div className="mt-12 p-6 rounded-xl bg-muted/30 border border-divider">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <img src={profileHeadshot} alt="Rusiru Rathmina" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display font-semibold text-display">Written by Rusiru Rathmina</p>
                <p className="text-sm text-caption">Associate Software Engineer at Omobio, Colombo, Sri Lanka</p>
              </div>
            </div>
            <p className="text-body text-sm leading-relaxed">
              I build full-stack applications with React, Java, Spring Boot, and AWS. I write about code, career growth, side projects, and the human side of software engineering. 
              <Link to="/about" className="text-primary font-medium ml-1 hover:underline">Learn more about me →</Link>
            </p>
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
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="Share on Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </a>
              <button
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="Copy link"
              >
                {copied ? <Check size={16} className="text-primary" /> : <Link2 size={16} />}
              </button>
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