import { Link } from "react-router-dom";
import profileHeadshot from "@/assets/profile-headshot.jpg";

interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  readTime?: string;
  imageUrl?: string;
}

const PostCard = ({
  title,
  excerpt,
  date,
  category,
  slug,
  readTime = "5 min read",
  imageUrl,
}: PostCardProps) => {
  return (
    <Link to={`/post/${slug}`} className="group block">
      <article className="py-6 border-b border-divider flex gap-5 transition-colors hover:border-primary/30">
        {/* Thumbnail */}
        {imageUrl && (
          <div className="hidden sm:block flex-shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="blog-tag mb-2 inline-block">{category}</span>

          <h3 className="font-display text-lg md:text-xl font-medium mb-2 text-display group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {title}
          </h3>

          <p className="text-body text-sm leading-relaxed line-clamp-2 mb-3">
            {excerpt}
          </p>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
              <img src={profileHeadshot} alt="Alex Chen" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 text-xs text-caption">
              <span className="font-medium text-display">Alex Chen</span>
              <span>·</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
