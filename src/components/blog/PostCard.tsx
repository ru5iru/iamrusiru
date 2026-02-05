import { Link } from "react-router-dom";

interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  readTime?: string;
}

const PostCard = ({ title, excerpt, date, category, slug, readTime = "5 min read" }: PostCardProps) => {
  return (
    <Link to={`/post/${slug}`} className="group block">
      <article className="py-8 border-b border-divider transition-colors hover:border-primary/30">
        <div className="flex items-center gap-4 mb-3">
          <span className="blog-tag">{category}</span>
          <span className="text-sm text-caption">{date}</span>
          <span className="text-sm text-caption">·</span>
          <span className="text-sm text-caption">{readTime}</span>
        </div>
        
        <h3 className="font-display text-xl md:text-2xl font-medium mb-3 text-display group-hover:text-primary transition-colors leading-snug">
          {title}
        </h3>
        
        <p className="text-body leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      </article>
    </Link>
  );
};

export default PostCard;
