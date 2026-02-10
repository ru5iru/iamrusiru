import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="py-5 border-b border-divider bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="group">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              <span className="text-display">The Quiet</span>{" "}
              <span className="text-primary">Corner</span>
            </h1>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-primary">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-caption hover:text-display transition-colors">
              About me
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2 text-sm font-medium border border-divider rounded-full hover:border-primary hover:text-primary transition-colors text-display"
            >
              Contact Me
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-display"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-divider pt-4">
            <Link to="/" className="text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/about" className="text-sm font-medium text-caption" onClick={() => setMobileOpen(false)}>About me</Link>
            <Link to="/contact" className="text-sm font-medium text-caption" onClick={() => setMobileOpen(false)}>Contact Me</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
