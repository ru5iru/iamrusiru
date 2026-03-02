import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-14 border-t border-divider bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">
              <span className="text-display">iam</span><span className="text-primary">rusiru</span>
            </h3>
            <p className="text-body text-sm leading-relaxed">
              Subscribe to stay up to date with my latest posts and creative musings.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-display mb-4 text-sm">Quick Links</h4>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
              <Link to="/" className="text-body text-sm hover:text-primary transition-colors">Home</Link>
              <Link to="/about" className="text-body text-sm hover:text-primary transition-colors">About me</Link>
              <Link to="/contact" className="text-body text-sm hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-medium text-display mb-4 text-sm">Legal Stuff</h4>
            <nav aria-label="Legal links" className="flex flex-col gap-2.5">
              <a href="#" className="text-body text-sm hover:text-primary transition-colors">Privacy Notice</a>
              <a href="#" className="text-body text-sm hover:text-primary transition-colors">Cookie Policy</a>
              <a href="#" className="text-body text-sm hover:text-primary transition-colors">Terms of Use</a>
            </nav>
          </div>

          <div>
            <h4 className="font-medium text-display mb-4 text-sm">Connect</h4>
            <nav aria-label="Social links" className="flex flex-col gap-2.5">
              <a href="https://x.com/ru5iru" target="_blank" rel="noopener noreferrer me" className="text-body text-sm hover:text-primary transition-colors">Twitter / X</a>
              <a href="https://github.com/ru5iru" target="_blank" rel="noopener noreferrer me" className="text-body text-sm hover:text-primary transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/ru5iru" target="_blank" rel="noopener noreferrer me" className="text-body text-sm hover:text-primary transition-colors">LinkedIn</a>
              <a href="https://web.facebook.com/ru5iru" target="_blank" rel="noopener noreferrer me" className="text-body text-sm hover:text-primary transition-colors">Facebook</a>
              <a href="https://instagram.com/rusiru.rathmina" target="_blank" rel="noopener noreferrer me" className="text-body text-sm hover:text-primary transition-colors">Instagram</a>
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-divider text-center">
          <p className="text-caption text-sm">
            © {new Date().getFullYear()} iamrusiru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;