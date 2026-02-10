import { useState } from "react";
import { Link } from "react-router-dom";
import { Code, Lightbulb, Briefcase, BookOpen, Heart, Terminal } from "lucide-react";

const topics = [
  { label: "Engineering", icon: Code },
  { label: "Career", icon: Briefcase },
  { label: "Tutorials", icon: Terminal },
  { label: "Side Projects", icon: Lightbulb },
  { label: "Reading", icon: BookOpen },
  { label: "Personal", icon: Heart },
];

const tags = [
  "#javascript", "#typescript", "#react", "#webdev",
  "#career", "#productivity", "#opensource", "#devlife",
  "#python", "#backend", "#frontend", "#codebits",
];

interface SidebarProps {
  activeTopic: string | null;
  activeTag: string | null;
  onTopicSelect: (topic: string) => void;
  onTagSelect: (tag: string) => void;
}

const Sidebar = ({ activeTopic, activeTag, onTopicSelect, onTagSelect }: SidebarProps) => {
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
            <button
              key={t.label}
              onClick={() => onTopicSelect(t.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors group text-left ${
                activeTopic === t.label
                  ? "border-primary bg-primary/10"
                  : "border-divider hover:border-primary/40"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                activeTopic === t.label
                  ? "bg-primary/20 text-primary"
                  : "bg-warm text-caption group-hover:text-primary"
              }`}>
                <t.icon size={18} />
              </div>
              <span className={`text-sm font-medium ${
                activeTopic === t.label ? "text-primary" : "text-display"
              }`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-display text-lg font-semibold text-display mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-warm text-caption hover:text-primary hover:bg-primary/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Let's talk */}
      <div>
        <h3 className="font-display text-lg font-semibold text-display mb-3">Let's connect</h3>
        <p className="text-body text-sm leading-relaxed mb-4">
          Find me on socials or drop me an email.
        </p>
        <div className="flex gap-3">
          {["GitHub", "Twitter", "Email"].map((s) => (
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
          Subscribe to get my latest posts on code, career, and side projects.
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
