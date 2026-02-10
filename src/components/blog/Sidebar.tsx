import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Palette, Heart } from "lucide-react";

const topics = [
  { label: "Lifestyle", icon: Heart },
  { label: "Creativity", icon: Palette },
  { label: "Reading", icon: BookOpen },
];

const tags = [
  "#writing", "#creativity", "#slowliving", "#books",
  "#journaling", "#mindfulness", "#personal", "#essays",
  "#lifestyle", "#reflection",
];

const Sidebar = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <aside className="space-y-10">
      {/* Topics */}
      <div>
        <h3 className="font-display text-lg font-semibold text-display mb-4">Topics</h3>
        <div className="space-y-3">
          {topics.map((t) => (
            <Link
              key={t.label}
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-divider hover:border-primary/40 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-warm flex items-center justify-center text-caption group-hover:text-primary transition-colors">
                <t.icon size={18} />
              </div>
              <span className="text-sm font-medium text-display">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-display text-lg font-semibold text-display mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-warm text-caption hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Let's talk */}
      <div>
        <h3 className="font-display text-lg font-semibold text-display mb-3">Let's talk</h3>
        <p className="text-body text-sm leading-relaxed mb-4">
          Want to connect or share your thoughts? I'd love to hear from you.
        </p>
        <div className="flex gap-3">
          {["Twitter", "Instagram", "Email"].map((s) => (
            <a
              key={s}
              href="#"
              className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
              aria-label={s}
            >
              <span className="text-xs font-bold">{s[0]}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="font-display text-lg font-semibold text-primary mb-3">Newsletter</h3>
        <p className="text-body text-sm leading-relaxed mb-4">
          Subscribe to get my latest essays delivered straight to your inbox.
        </p>
        {subscribed ? (
          <p className="text-sm text-accent font-medium">Thanks for subscribing! ✓</p>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-2.5 rounded-lg border border-divider bg-background text-display placeholder:text-caption text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
