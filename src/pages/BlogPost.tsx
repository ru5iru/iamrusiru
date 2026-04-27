import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { ArrowLeft, Clock } from "lucide-react";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";
import TagChip from "@/components/blog/TagChip";
import CodeBlock from "@/components/blog/CodeBlock";
import CalloutBlock from "@/components/blog/CalloutBlock";
import ImageBlock from "@/components/blog/ImageBlock";
import SharePost from "@/components/blog/SharePost";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import allPosts from "@/data/posts";
import type { ContentBlock } from "@/data/posts";
import profileHeadshot from "@/assets/profile-headshot.jpg";
import { useEffect, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { useReadingTime, countWords } from "@/hooks/useReadingTime";
import { useTableOfContents, slugify } from "@/hooks/useTableOfContents";
import { extractKeywords, buildPostTitle, buildPostDescription } from "@/lib/seoKeywords";

const SITE = "https://iamrusiru.lovable.app";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = allPosts.find((p) => p.slug === slug);

  const postUrl = typeof window !== "undefined" ? window.location.href : `${SITE}/post/${slug}`;
  const content = post?.content ?? [];
  const calculatedReadTime = useReadingTime(content);
  const headings = useTableOfContents(content);

  // Reset scroll instantly between posts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  // Prefetch the next (older) post
  useEffect(() => {
    if (!post) return;
    const idx = allPosts.findIndex((p) => p.slug === post.slug);
    const next = idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
    if (!next) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `/post/${next.slug}`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [post]);

  const wordCount = useMemo(() => countWords(content), [content]);

  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    const dateModified = post.updatedDate ?? post.date;
    const schemas: Record<string, unknown>[] = [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl,
        datePublished: post.date,
        dateModified,
        wordCount,
        articleSection: post.category,
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
        publisher: { "@type": "Person", name: "Rusiru Rathmina" },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/post/${post.slug}` },
        keywords: post.tags.join(", "),
        inLanguage: "en",
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: post.category, item: `${SITE}/` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${SITE}/post/${post.slug}` },
        ],
      },
      {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".post-summary", ".post-content p:first-of-type"],
      },
    ];

    if (post.faq && post.faq.length > 0) {
      schemas.push({
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }
    return schemas;
  }, [post, wordCount]);

  const seoTitle = post ? buildPostTitle(post) : "Post Not Found | iamrusiru";
  const seoDescription = post ? buildPostDescription(post) : "The blog post you're looking for doesn't exist.";
  const seoKeywords = useMemo(() => (post ? extractKeywords(post) : undefined), [post]);

  useSEO({
    title: seoTitle,
    ogTitle: post?.title,
    description: seoDescription,
    canonical: post ? `/post/${post.slug}` : undefined,
    ogType: "article",
    ogImage: post?.imageUrl,
    twitterCard: post?.imageUrl ? "summary_large_image" : "summary",
    twitterCreator: "@ru5iru",
    keywords: seoKeywords,
    author: "Rusiru Rathmina",
    jsonLd,
    articleMeta: post
      ? {
          publishedTime: post.date,
          modifiedTime: post.updatedDate ?? post.date,
          author: "Rusiru Rathmina",
          section: post.category,
          tags: post.tags,
        }
      : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-4">Post not found</h1>
          <p className="text-body mb-8">The post you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary font-medium hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayedReadTime = post.readTime ?? calculatedReadTime;

  const renderBlock = (block: ContentBlock, i: number) => {
    if (typeof block === "string") {
      // Parse mixed string blocks containing markdown headings
      if (block.startsWith("## ") || block.startsWith("### ") || block.includes("\n## ") || block.includes("\n### ")) {
        const parts = block.split(/\n\n+/);
        return (
          <div key={i} className="space-y-4">
            {parts.map((part, j) => {
              if (part.startsWith("### ")) {
                const text = part.replace(/^###\s+/, "").trim();
                return (
                  <h3
                    key={j}
                    id={slugify(text)}
                    className="font-display text-xl font-semibold text-foreground mt-6 mb-2 scroll-mt-24"
                  >
                    {text}
                  </h3>
                );
              }
              if (part.startsWith("## ")) {
                const text = part.replace(/^##\s+/, "").trim();
                return (
                  <h2
                    key={j}
                    id={slugify(text)}
                    className="font-display text-2xl font-semibold text-foreground mt-8 mb-2 scroll-mt-24"
                  >
                    {text}
                  </h2>
                );
              }
              return (
                <p key={j} className="text-body text-lg leading-relaxed whitespace-pre-line">
                  {renderInlineFormatting(part)}
                </p>
              );
            })}
          </div>
        );
      }
      return (
        <p key={i} className="text-body text-lg leading-relaxed whitespace-pre-line">
          {renderInlineFormatting(block)}
        </p>
      );
    }

    if (block.type === "code") {
      return <CodeBlock key={i} language={block.language} code={block.code} />;
    }
    if (block.type === "heading") {
      const id = slugify(block.text);
      const cls = "font-display font-semibold text-foreground scroll-mt-24";
      return block.level === 2 ? (
        <h2 key={i} id={id} className={`${cls} text-2xl mt-8 mb-2`}>
          {block.text}
        </h2>
      ) : (
        <h3 key={i} id={id} className={`${cls} text-xl mt-6 mb-2`}>
          {block.text}
        </h3>
      );
    }
    if (block.type === "callout") {
      return <CalloutBlock key={i} variant={block.variant} text={block.text} />;
    }
    if (block.type === "image") {
      return (
        <ImageBlock
          key={i}
          src={block.src}
          alt={block.alt}
          width={block.width}
          height={block.height}
          caption={block.caption}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />

      <main id="main-content">
        <article className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to all posts
            </Link>

            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 min-w-0 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="blog-tag">{post.category}</span>
                  <time dateTime={post.date} className="text-sm text-muted-foreground">{post.date}</time>
                  <span className="text-sm text-muted-foreground" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock size={14} aria-hidden="true" />
                    {displayedReadTime}
                  </span>
                </div>

                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
                  {post.title}
                </h1>

                {post.updatedDate && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Updated <time dateTime={post.updatedDate}>{post.updatedDate}</time>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((t) => (
                    <TagChip
                      key={t}
                      tag={t}
                      onClick={(tag) => navigate(`/?tag=${encodeURIComponent(tag)}`)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-10 pb-8 border-b border-divider">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={profileHeadshot} alt="Rusiru Rathmina" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Rusiru Rathmina</p>
                    <p className="text-xs text-muted-foreground">Software Engineer & Writer</p>
                  </div>
                </div>

                <div className="post-summary rounded-xl bg-primary/5 border border-primary/10 px-6 py-5 mb-10">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
                  <p className="text-body text-base leading-relaxed">{post.excerpt}</p>
                </div>

                <div className="rounded-xl overflow-hidden mb-10">
                  <img
                    src={post.imageUrl}
                    alt={`Cover image for ${post.title}`}
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover max-h-[400px]"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>

                <div className="post-content space-y-6">
                  {content.map((block, i) => renderBlock(block, i))}
                </div>

                <SharePost title={post.title} url={postUrl} />

                {post.relatedPosts && post.relatedPosts.length > 0 && (
                  <RelatedPosts slugs={post.relatedPosts} />
                )}

                {post.faq && post.faq.length > 0 && (
                  <section className="mt-12" aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className="font-display text-2xl font-semibold text-foreground mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-5">
                      {post.faq.map((f, i) => (
                        <div key={i} className="rounded-xl border border-divider bg-warm/40 p-5">
                          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                            {f.question}
                          </h3>
                          <p className="text-body text-base leading-relaxed">{f.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-12 p-6 rounded-xl bg-muted/30 border border-divider">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                      <img src={profileHeadshot} alt="Rusiru Rathmina" width={56} height={56} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground">Written by Rusiru Rathmina</p>
                      <p className="text-sm text-muted-foreground">Associate Software Engineer at Omobio, Colombo, Sri Lanka</p>
                    </div>
                  </div>
                  <p className="text-body text-sm leading-relaxed">
                    I build full-stack applications with React, Java, Spring Boot, and AWS. I write about code, career growth, side projects, and the human side of software engineering.
                    <Link to="/about" className="text-primary font-medium ml-1 hover:underline">Learn more about me →</Link>
                  </p>
                </div>
              </div>

              {headings.length >= 3 && (
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <TableOfContents headings={headings} />
                </aside>
              )}
            </div>
          </div>
        </article>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default BlogPost;
