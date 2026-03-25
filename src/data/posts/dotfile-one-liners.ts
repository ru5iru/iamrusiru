import postDotfiles from "@/assets/post-dotfiles.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Useful One-Liners I Keep in My Dotfiles",
  excerpt:
    "A curated list of bash aliases, git shortcuts, and tiny scripts that save me minutes every day.",
  date: "November 30, 2025",
  category: "Engineering",
  slug: "dotfile-one-liners",
  readTime: "4 min read",
  imageUrl: postDotfiles,
  tags: ["#codebits", "#productivity", "#backend"],
  content: [
    "I've been collecting shell aliases and tiny scripts for years. Here are the ones I actually use every day.",
    "## Git Shortcuts",
    {
      type: "code",
      language: "bash",
      code: `# Quick status + branch info
alias gs='git status -sb'

# Pretty log with graph
alias gl='git log --oneline --graph --decorate -20'

# Amend last commit without editing message
alias gamend='git add -A && git commit --amend --no-edit'

# Interactive rebase on last N commits
gri() { git rebase -i HEAD~\${1:-5}; }

# Delete merged branches
alias gclean='git branch --merged | grep -v "main\\|master\\|\\*" | xargs -n 1 git branch -d'`,
    },
    "## Navigation & Files",
    {
      type: "code",
      language: "bash",
      code: `# Jump to project root (nearest .git directory)
alias root='cd $(git rev-parse --show-toplevel 2>/dev/null || echo ".")'

# Make directory and cd into it
mkcd() { mkdir -p "$1" && cd "$1"; }

# Find files by name (faster than find for most cases)
ff() { find . -name "*$1*" -not -path './node_modules/*'; }

# Quick server for current directory
alias serve='python3 -m http.server 3000'`,
    },
    "## Development",
    {
      type: "code",
      language: "bash",
      code: `# Kill process on port
killport() { lsof -ti:$1 | xargs kill -9 2>/dev/null || echo "No process on port $1"; }

# Node project quick start
alias nr='npm run'
alias ni='npm install'

# Docker cleanup
alias dprune='docker system prune -af --volumes'

# Pretty JSON from clipboard
alias jsonpretty='pbpaste | python3 -m json.tool | pbcopy && echo "✓ Formatted"'`,
    },
    "The key isn't having hundreds of aliases. It's having a few that match your actual workflow. Start by noticing which commands you type most often, then alias those. Your future self will thank you.",
  ],
};

export default post;
