import { Link, useNavigate } from "react-router-dom";
import profileHeadshot from "@/assets/profile-headshot.jpg?w=112&format=webp";
import { getThumbnail } from "@/lib/imageVariants";
import TagChip from "@/components/blog/TagChip";

interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  readTime?: string;
  imageUrl?: string;
  tags?: string[];
  destination?: string;
  source?: "iamrusiru" | "blogger";
  author?: string;
}

const PostCard = ({
  title,
  excerpt,
  date,
  category,
  slug,
  readTime = "5 min read",
  imageUrl,
  tags = [],
  destination,
  source = "iamrusiru",
  author = "Rusiru Rathmina",
}: PostCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="group py-6 border-b border-divider flex gap-5 transition-colors hover:border-primary/30">
      <Link
        to={destination || `/post/${slug}`}
        className="contents focus-visible:outline-none"
        aria-label={title}
      >
        {imageUrl && (
          <div className="hidden sm:block flex-shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-lg overflow-hidden">
            <img
              src={getThumbnail(imageUrl)}
              alt=""
              width={192}
              height={128}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <span className="blog-tag mb-2 inline-block">{category}</span>
        {source === "blogger" && category !== "Blogger" && <span className="ml-2 text-xs text-muted-foreground">Blogger</span>}

        <h3 className="font-display text-lg md:text-xl font-medium mb-2 leading-snug line-clamp-2">
          <Link
            to={destination || `/post/${slug}`}
            className="text-foreground group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {title}
          </Link>
        </h3>

        <p className="text-body text-sm leading-relaxed line-clamp-2 mb-3">
          {excerpt}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 4).map((t) => (
              <TagChip
                key={t}
                tag={t}
                onClick={(tag) => navigate(`/?tag=${encodeURIComponent(tag)}`)}
              />
            ))}
          </div>
        )}

        <div className="flex items-start gap-3">
          {source === "iamrusiru" && <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            <img src={profileHeadshot} alt="" width={28} height={28} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={date}>{date}</time>
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
