import postDotfiles from "@/assets/post-dotfiles.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Useful One-Liners I Keep in My Dotfiles",
  excerpt:
    "Dotfiles are configuration files that customize your shell and development environment. Here is a curated list of bash aliases, git shortcuts, and utility scripts that save developers minutes every day.",
  date: "November 30, 2025",
  category: "Engineering",
  slug: "dotfile-one-liners",
  readTime: "4 min read",
  imageUrl: postDotfiles,
  tags: ["dotfiles", "bash aliases", "git shortcuts", "developer productivity", "terminal"],
  seoKeywords: [
    "useful dotfile one-liners",
    "bash aliases for developers",
    "git shortcuts",
    "terminal productivity tips",
    "developer dotfiles",
    "zsh configuration",
    "shell productivity",
    "command line tricks",
    "dotfiles repository",
    "useful bash functions",
    "developer command line setup",
  ],
  content: [
    "Dotfiles are the configuration files that define your shell environment, and a well-curated set of aliases and scripts can save significant time every day. I have been collecting shell aliases and tiny scripts for years. Here are the ones I actually use daily.",

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
    "## Navigation and File Management",
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
    "## Development Utilities",
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
alias jsonpretty='pbpaste | python3 -m json.tool | pbcopy && echo "Formatted"'`,
    },
    "## How to Build Your Own Dotfiles\n\nThe key is not having hundreds of aliases. It is having a few that match your actual workflow. Start by noticing which commands you type most often, then alias those. Your future self will thank you.\n\nStore your dotfiles in a Git repository so you can sync them across machines. Many developers host their dotfiles on GitHub for easy setup on new environments.",

    "## Key Takeaways\n\n- Dotfiles are configuration files (.bashrc, .zshrc) that customize your shell environment\n- Git aliases like gs, gl, and gamend eliminate repetitive typing in daily workflows\n- Navigation helpers like root and mkcd reduce directory management friction\n- The killport function solves the common problem of orphaned processes blocking ports\n- Start with a few aliases that match your actual workflow, not hundreds you will forget\n- Store dotfiles in a Git repository to sync across machines\n- Review and update your aliases quarterly as your workflow evolves",
  ],
  faq: [
    { question: "What are dotfiles?", answer: "Dotfiles are configuration files in your home directory (like .bashrc, .zshrc, .gitconfig) that customize your shell and development environment. They typically contain aliases, functions, and settings that speed up your workflow." },
    { question: "What are the most useful bash aliases for developers?", answer: "Useful aliases include git shortcuts (gs for git status, gl for pretty log), navigation helpers (root to jump to project root, mkcd to create and enter a directory), and development tools (killport to kill processes on a port, dprune for Docker cleanup)." },
    { question: "How do I set up dotfiles on a new machine?", answer: "Store your dotfiles in a Git repository on GitHub. On a new machine, clone the repository and create symlinks from your home directory to the repository files. Many developers use tools like GNU Stow or custom install scripts to automate this process." },
    { question: "What is the best way to organize dotfiles?", answer: "Create a dedicated Git repository with separate files for shell configuration (.bashrc or .zshrc), git configuration (.gitconfig), and editor settings. Use a README to document what each alias does. Keep aliases focused on commands you actually use daily." },
    { question: "How do git aliases improve developer productivity?", answer: "Git aliases reduce repetitive typing for common operations. Instead of typing git status -sb every time, gs saves keystrokes and mental effort. Over a day of frequent git operations, these small savings add up to significant time reduction." },
  ],
};

export default post;
