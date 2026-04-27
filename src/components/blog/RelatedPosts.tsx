import { Link } from "react-router-dom";
import allPosts from "@/data/posts";

interface RelatedPostsProps {
  slugs: string[];
}

const RelatedPosts = ({ slugs }: RelatedPostsProps) => {
  const related = slugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is (typeof allPosts)[number] => Boolean(p))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="my-12">
      <h2
        id="related-heading"
        className="font-display text-2xl font-semibold text-foreground mb-6"
      >
        You might also like
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <Link
            key={p.slug}
            to={`/post/${p.slug}`}
            className="group flex gap-3 p-3 rounded-lg border border-divider hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={p.imageUrl}
              alt={p.title}
              width={48}
              height={48}
              loading="lazy"
              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="blog-tag text-[10px] mb-1 inline-block">{p.category}</span>
              <h3 className="font-display text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </h3>
              <time dateTime={p.date} className="text-xs text-muted-foreground">
                {p.date}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
