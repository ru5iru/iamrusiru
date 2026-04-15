import postGitWorkflow from "@/assets/post-git-workflow.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Git Workflow Tips I Wish I Knew Earlier",
  excerpt:
    "Interactive rebase, bisect, and worktrees are powerful git features that most developers learn years too late. Here is how they work and how they transform version control workflows.",
  date: "November 15, 2025",
  category: "Engineering",
  slug: "git-workflow-tips",
  readTime: "6 min read",
  imageUrl: postGitWorkflow,
  tags: ["Git", "version control", "developer workflow", "git rebase", "productivity"],
  content: [
    "Git has powerful features that most developers do not discover for years. Interactive rebase, bisect, and worktrees transformed how I work with version control. I used git for three years before I learned interactive rebase - three years of messy commit histories that could have been clean, readable stories.",

    "## Interactive Rebase\n\nInteractive rebase is the single most powerful git feature most people ignore. It lets you rewrite commit history by squashing, reordering, editing, or dropping commits:",
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
    "The result is a single clean commit that tells a coherent story instead of four commits that expose your trial-and-error process. Clean commit history makes code review, debugging, and git bisect far more effective.",

    "## Git Bisect for Finding Bugs\n\nWhen you know something broke but not which commit did it, bisect uses binary search to find the exact commit:",
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
    "Bisect turns a search through hundreds of commits into a handful of steps. It is especially powerful with automated test scripts that can mark commits as good or bad automatically.",

    "## Git Worktrees for Parallel Work\n\nWorktrees let you have multiple branches checked out simultaneously in different directories. Need to check another branch without stashing your work?\n\n```bash\ngit worktree add ../hotfix-branch hotfix/urgent-fix\n```\n\nI use this constantly during code reviews. I can check out the PR branch in a separate directory without disrupting my current work. When done, remove it with `git worktree remove ../hotfix-branch`.",

    "## Key Takeaways\n\n- Interactive rebase (git rebase -i) creates clean, readable commit history from messy work\n- Git bisect uses binary search to find the exact commit that introduced a bug\n- Worktrees let you work on multiple branches simultaneously without stashing\n- Clean commit history improves code review, debugging, and collaboration\n- Automated bisect with test scripts can find bugs without manual testing\n- These features are built into git but rarely taught in beginner tutorials\n- Learning these tools early saves years of inefficient version control habits",
  ],
  faq: [
    { question: "What is git interactive rebase?", answer: "Git interactive rebase (git rebase -i HEAD~N) lets you rewrite commit history by squashing, reordering, editing, or dropping commits. It is the most powerful git feature for keeping clean, readable commit histories." },
    { question: "What is git bisect used for?", answer: "Git bisect helps find the exact commit that introduced a bug. You mark the current commit as bad and a known-good commit, then git binary-searches through commits. You test each and mark good or bad until the problematic commit is found." },
    { question: "What are git worktrees?", answer: "Git worktrees let you have multiple branches checked out simultaneously in different directories. This is useful during code reviews because you can check out a PR branch in a separate directory without stashing or disrupting your current work." },
    { question: "How does git bisect work with automated tests?", answer: "You can automate git bisect by providing a test script: git bisect run ./test.sh. Git will automatically check out commits and run the script, marking each as good or bad based on the exit code. This finds the breaking commit without any manual intervention." },
    { question: "When should you use interactive rebase?", answer: "Use interactive rebase before merging a feature branch to clean up your commit history. Squash fix-it commits, reorder for logical flow, and write clear commit messages. This makes the main branch history readable and makes future debugging with git bisect more effective." },
  ],
};

export default post;
