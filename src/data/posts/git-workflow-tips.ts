import featuredImage from "@/assets/featured-post.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Git Workflow Tips I Wish I Knew Earlier",
  excerpt:
    "Interactive rebase, bisect, worktrees, and other git features that transformed how I work with version control.",
  date: "November 15, 2025",
  category: "Engineering",
  slug: "git-workflow-tips",
  readTime: "6 min read",
  imageUrl: featuredImage,
  tags: ["#codebits", "#productivity", "#devlife"],
  content: [
    "I used git for three years before I learned interactive rebase. Three years of messy commit histories that could have been clean, readable stories.",
    "## Interactive Rebase\n\nThis is the single most powerful git feature most people ignore:",
    {
      type: "code",
      language: "bash",
      code: `# Squash the last 4 commits into one
git rebase -i HEAD~4

# In the editor, change 'pick' to 'squash' (or 's') for commits to merge
pick abc1234 Add user model
squash def5678 Fix typo in user model
squash ghi9012 Add validation
squash jkl3456 Fix validation edge case`,
    },
    "## Git Bisect\n\nWhen you know something broke but not which commit did it, bisect is your best friend:",
    {
      type: "code",
      language: "bash",
      code: `git bisect start
git bisect bad          # current commit is broken
git bisect good v1.2.0  # this tag was working

# Git checks out a middle commit. Test it, then:
git bisect good  # or 'git bisect bad'
# Repeat until git finds the exact commit`,
    },
    "## Worktrees\n\nNeed to check another branch without stashing your work? Worktrees let you have multiple branches checked out simultaneously in different directories:\n\n```bash\ngit worktree add ../hotfix-branch hotfix/urgent-fix\n```\n\nI use this constantly during code reviews — I can check out the PR branch in a separate directory without disrupting my current work.",
  ],
};

export default post;
