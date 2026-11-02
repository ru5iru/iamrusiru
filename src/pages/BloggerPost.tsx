import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";
import SharePost from "@/components/blog/SharePost";
import TagChip from "@/components/blog/TagChip";
import { Button } from "@/components/ui/button";
import { useBloggerPosts } from "@/hooks/useBloggerPosts";
import { useSEO } from "@/hooks/useSEO";
import { bloggerPath } from "../../supabase/functions/_shared/blogger";

const SITE = "https://iamrusiru.lovable.app";
export default function BloggerPost() {
  const { blogId, postId } = useParams();
  const { posts, loading, configured, warning, refreshing } = useBloggerPosts();
  const post = posts.find(p => p.blogId === blogId && p.postId === postId);
  useSEO({
    title: post ? `${post.title} | iamrusiru` : "Blogger article | iamrusiru",
    description: post?.excerpt ?? "Read articles from Blogger on iamrusiru.",
    canonical: post?.originalUrl,
    pageUrl: post ? bloggerPath(post) : `/blogger/${blogId}/${postId}`,
    ogType: "article", author: post?.author ?? "Blogger",
    authorUrl: post?.originalUrl, ogImage: post?.imageUrl,
    keywords: [], noIndex: !post,
    articleMeta: post ? { publishedTime: post.date, modifiedTime: post.updatedDate, author: post.author } : undefined,
    jsonLd: post ? { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, dateModified: post.updatedDate, author: { "@type": "Person", name: post.author }, mainEntityOfPage: post.originalUrl, url: `${SITE}${bloggerPath(post)}` } : undefined,
  });
  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress /><Header />
      <main id="main-content" className="max-w-3xl mx-auto px-6 py-12">
        <Button asChild variant="link" className="px-0 mb-8"><Link to="/"><ArrowLeft />Back to all posts</Link></Button>
        {post ? <article>
          <div className="flex flex-wrap gap-3 items-center mb-4 text-sm text-muted-foreground">
            <span className="blog-tag">Blogger</span><time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time><span>{post.readTime}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground break-words mb-6">{post.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">{post.author}</p>
          <Button asChild variant="link" className="px-0 mb-6"><a href={post.originalUrl} target="_blank" rel="noopener noreferrer">Original on Blogger<ExternalLink /></a></Button>
          <div className="flex flex-wrap gap-2 mb-8">{post.tags.map(tag => <TagChip key={tag} tag={tag} />)}</div>
          {warning && <p role="status" className="text-sm text-muted-foreground mb-6">{warning}</p>}
          <div className="blogger-content post-content text-body text-lg leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: post.html }} />
          <SharePost title={post.title} url={`${SITE}${bloggerPath(post)}`} />
        </article> : <section className="py-12 text-center">
          <h1 className="font-display text-3xl mb-4">{loading || refreshing ? "Loading article" : "Article unavailable"}</h1>
          <p role="status" className="text-muted-foreground">{loading || refreshing ? "Fetching Blogger posts." : warning || (!configured ? "Blogger is not connected yet." : "This article could not be found.")}</p>
        </section>}
      </main><Footer /><BackToTop />
    </div>
  );
}