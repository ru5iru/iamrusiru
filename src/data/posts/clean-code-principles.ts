import postCleanCode from "@/assets/post-clean-code.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Clean Code Principles Every Developer Should Know",
  excerpt:
    "Clean code is code that is easy to read, maintain, and extend. Here are the essential principles - meaningful names, single responsibility, avoiding magic numbers, DRY, tests as documentation, and the Boy Scout Rule.",
  date: "March 20, 2026",
  category: "Engineering",
  slug: "clean-code-principles",
  readTime: "8 min read",
  imageUrl: postCleanCode,
  tags: ["clean code", "best practices", "software engineering", "code quality", "refactoring"],
  content: [
    "Clean code is code that is easy to read, easy to change, and easy to test. Writing code that works is straightforward. Writing code that others can maintain and extend is the real challenge, and it is what separates junior developers from senior engineers.",

    "We have all inherited a codebase with variable names like `x`, `temp2`, and `data_final_v3`. Functions that span 400 lines. Comments that say 'do not touch this' with no explanation. Clean code is not about perfection. It is about respect for the people who come after you, including future you.",

    "## Meaningful Names\n\nThe most impactful clean code habit is choosing names that reveal intent. A variable called `d` tells you nothing. A variable called `daysSinceLastLogin` tells you everything.\n\nThe same applies to functions. `processData()` is vague. `calculateMonthlyRevenue()` is precise. Good names eliminate the need for most comments.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: What does this do?
function calc(u: any[], d: number) {
  return u.filter(x => x.a > d).map(x => x.b);
}

// Good: Intent is immediately clear
function getActiveUserEmails(users: User[], minLoginDays: number): string[] {
  return users
    .filter(user => user.daysSinceLastLogin > minLoginDays)
    .map(user => user.email);
}`,
    },
    "## Small Functions With Single Responsibility\n\nA function should do one thing, do it well, and do it only. If you find yourself writing a comment to separate sections within a function, those sections should probably be separate functions.\n\nThe ideal function is short enough to read without scrolling. If it takes more than a few seconds to understand what a function does, it is too complex.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: One function doing three things
function processOrder(order: Order) {
  // Validate
  if (!order.items.length) throw new Error("Empty order");
  if (!order.address) throw new Error("No address");

  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
    if (item.discount) total -= item.discount;
  }

  // Send confirmation
  sendEmail(order.customer, \`Your total: \$\${total}\`);
}

// Good: Each function has one job
function validateOrder(order: Order): void {
  if (!order.items.length) throw new Error("Empty order");
  if (!order.address) throw new Error("No address");
}

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) =>
    sum + item.price * item.quantity - (item.discount ?? 0), 0
  );
}

function processOrder(order: Order): void {
  validateOrder(order);
  const total = calculateTotal(order.items);
  sendOrderConfirmation(order.customer, total);
}`,
    },
    "## Avoid Magic Numbers and Strings\n\nScattering raw values through your code is a readability killer. Extract them into well-named constants. This makes intent clear and changes easier.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: What do these numbers mean?
if (password.length < 8) { /* ... */ }
if (retries > 3) { /* ... */ }
setTimeout(fn, 86400000);

// Good: Self-documenting
const MIN_PASSWORD_LENGTH = 8;
const MAX_RETRY_ATTEMPTS = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

if (password.length < MIN_PASSWORD_LENGTH) { /* ... */ }
if (retries > MAX_RETRY_ATTEMPTS) { /* ... */ }
setTimeout(fn, ONE_DAY_MS);`,
    },
    "## DRY: Do Not Repeat Yourself (But Do Not Over-Abstract)\n\nDRY is one of the most cited principles in software, and also one of the most misapplied. Duplication is bad, but premature abstraction is worse. The rule of three is a good guideline: if you see the same pattern three times, extract it. Before that, the duplication might just be coincidental similarity.",

    "## Write Tests as Documentation\n\nGood tests serve double duty: they catch regressions and they document expected behavior. When someone reads your test, they should understand what the function does without reading the implementation.",
    {
      type: "code",
      language: "typescript",
      code: `describe("calculateTotal", () => {
  it("sums item prices multiplied by quantity", () => {
    const items = [
      { price: 10, quantity: 2, discount: 0 },
      { price: 5, quantity: 1, discount: 0 },
    ];
    expect(calculateTotal(items)).toBe(25);
  });

  it("subtracts item-level discounts", () => {
    const items = [
      { price: 100, quantity: 1, discount: 15 },
    ];
    expect(calculateTotal(items)).toBe(85);
  });
});`,
    },
    "## The Boy Scout Rule\n\nLeave the code cleaner than you found it. You do not need to refactor the entire file, but if you touch a function, rename that unclear variable. Extract that duplicated block. Add a missing type annotation. Small improvements compound over time.\n\nClean code is a practice, not a destination. Every codebase has messy corners. The goal is not perfection. It is progress.",

    "## Key Takeaways\n\n- Clean code is about readability, maintainability, and respect for other developers\n- Meaningful names eliminate the need for most comments\n- Functions should do one thing and be short enough to read without scrolling\n- Magic numbers and strings should be extracted into well-named constants\n- The rule of three prevents premature abstraction while avoiding duplication\n- Tests serve as living documentation of expected behavior\n- The Boy Scout Rule (leave code cleaner than you found it) creates compounding improvements",
  ],
  faq: [
    { question: "What are clean code principles?", answer: "Clean code principles are guidelines for writing readable, maintainable software. Key principles include using meaningful names, writing small single-responsibility functions, avoiding magic numbers, following the DRY principle, writing tests as documentation, and applying the Boy Scout Rule of leaving code cleaner than you found it." },
    { question: "What is the DRY principle in programming?", answer: "DRY stands for Do Not Repeat Yourself. It means avoiding code duplication by extracting repeated patterns into reusable abstractions. However, premature abstraction can be worse than duplication. The rule of three suggests extracting only after seeing the same pattern three times." },
    { question: "What is the Boy Scout Rule in software engineering?", answer: "The Boy Scout Rule means leaving the code cleaner than you found it. When you touch a function, rename unclear variables, extract duplicated blocks, and add missing type annotations. Small improvements compound over time into a significantly better codebase." },
    { question: "Why are meaningful variable names important?", answer: "Meaningful names reveal intent and eliminate the need for comments. A variable called daysSinceLastLogin is self-documenting, while d requires additional context to understand. Good naming is the single most impactful clean code habit because it improves readability across the entire codebase." },
    { question: "What is the single responsibility principle for functions?", answer: "The single responsibility principle states that a function should do one thing, do it well, and do it only. If you need comments to separate sections within a function, those sections should be separate functions. Short, focused functions are easier to test, reuse, and understand." },
  ],
};

export default post;
