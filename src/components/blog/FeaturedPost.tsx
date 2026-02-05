import { Link } from "react-router-dom";

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  imageUrl?: string;
}

const FeaturedPost = ({ title, excerpt, date, category, slug, imageUrl }: FeaturedPostProps) => {
  return (
    <Link to={`/post/${slug}`} className="group block">
      <article className="blog-card overflow-hidden">
        {imageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="blog-tag">{category}</span>
            <span className="text-sm text-caption">{date}</span>
          </div>
          
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-4 text-display group-hover:text-primary transition-colors leading-snug">
            {title}
          </h2>
          
          <p className="text-body leading-relaxed line-clamp-3">
            {excerpt}
          </p>
          
          <div className="mt-6 flex items-center gap-2 text-primary font-medium text-sm">
            <span>Read more</span>
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedPost;
