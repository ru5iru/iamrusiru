import { useMemo } from "react";
import { Code, Lightbulb, Briefcase, BookOpen, Heart, Terminal, Linkedin, Facebook, Instagram, Github } from "lucide-react";
import allPosts from "@/data/posts";

// X (Twitter) icon as inline SVG since lucide-react doesn't have the new X logo
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const topics = [
  { label: "Engineering", icon: Code },
  { label: "Career", icon: Briefcase },
  { label: "Tutorials", icon: Terminal },
  { label: "Side Projects", icon: Lightbulb },
  { label: "Reading", icon: BookOpen },
  { label: "Personal", icon: Heart },
];

const MAX_TAGS = 12;

interface SidebarProps {
  activeTopic: string | null;
  activeTag: string | null;
  onTopicSelect: (topic: string) => void;
  onTagSelect: (tag: string) => void;
}

const Sidebar = ({ activeTopic, activeTag, onTopicSelect, onTagSelect }: SidebarProps) => {
  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of allPosts) {
      for (const t of post.tags) {
        const key = t.trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_TAGS)
      .map(([tag]) => tag);
  }, []);
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

      {/* Let's connect */}
      <div>
        <h3 className="font-display text-lg font-semibold text-display mb-3">Let's connect</h3>
        <p className="text-body text-sm leading-relaxed mb-4">
          Find me on socials or drop me an email.
        </p>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/ru5iru" },
            { label: "Facebook", icon: Facebook, href: "https://web.facebook.com/ru5iru" },
            { label: "Instagram", icon: Instagram, href: "https://instagram.com/rusiru.rathmina" },
            { label: "GitHub", icon: Github, href: "https://github.com/ru5iru" },
          ].map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
          ))}
          <a
            href="https://x.com/ru5iru"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
            aria-label="X"
          >
            <XIcon size={18} />
          </a>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
