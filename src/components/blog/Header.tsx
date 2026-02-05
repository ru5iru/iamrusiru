import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="py-8 border-b border-divider">
      <div className="blog-container">
        <nav className="flex items-center justify-between">
          <Link to="/" className="group">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-display transition-colors group-hover:text-primary">
              The Quiet Corner
            </h1>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-caption hover:text-display transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-caption hover:text-display transition-colors"
            >
              About
            </Link>
            <Link 
              to="/archive" 
              className="text-sm font-medium text-caption hover:text-display transition-colors"
            >
              Archive
            </Link>
            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
