import postOwasp from "@/assets/post-owasp.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "OWASP Top 10: A Developer's Practical Guide",
  excerpt:
    "Security isn't just for the infosec team. Every developer should understand these ten vulnerabilities and how to prevent them in their own code.",
  date: "March 22, 2026",
  category: "Engineering",
  slug: "owasp-top-ten",
  readTime: "10 min read",
  imageUrl: postOwasp,
  tags: ["#security", "#backend", "#bestpractices", "#webdev"],
  content: [
    "The OWASP Top 10 is a standard awareness document for web application security. It represents the most critical security risks to web applications. As developers, we are the first line of defense. Here's a practical breakdown of each vulnerability and how to guard against it.",
    "## A01: Broken Access Control\n\nThis is the number one risk for a reason. It happens when users can act outside their intended permissions: viewing another user's data, modifying records they shouldn't, or escalating privileges.\n\n**How to prevent it:**\n- Deny access by default. Only grant permissions explicitly.\n- Never rely on client-side checks alone. Always validate on the server.\n- Use role-based access control (RBAC) and enforce it at the API layer.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: Trusting the client-supplied user ID
app.get("/api/orders/:userId", (req, res) => {
  const orders = db.getOrders(req.params.userId);
  return res.json(orders);
});

// Good: Use the authenticated session's user ID
app.get("/api/orders", requireAuth, (req, res) => {
  const orders = db.getOrders(req.user.id); // from JWT/session
  return res.json(orders);
});`,
    },
    "## A02: Cryptographic Failures\n\nFormerly called 'Sensitive Data Exposure.' This covers failures related to cryptography that lead to exposure of sensitive data: passwords stored in plain text, data transmitted over HTTP, or weak hashing algorithms.\n\n**How to prevent it:**\n- Always use HTTPS. No exceptions.\n- Hash passwords with bcrypt, scrypt, or Argon2. Never MD5 or SHA-1.\n- Encrypt sensitive data at rest. Use strong, current algorithms (AES-256).\n- Don't store sensitive data you don't need.",
    "## A03: Injection\n\nSQL injection, NoSQL injection, command injection, LDAP injection. Any time user input is sent to an interpreter as part of a command or query without proper sanitisation, you have an injection vulnerability.\n\n**How to prevent it:**\n- Use parameterised queries or prepared statements. Always.\n- Validate and sanitise all user input.\n- Use ORMs, but understand their limitations.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: String concatenation in SQL (injection risk)
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// Good: Parameterised query
const query = "SELECT * FROM users WHERE email = $1";
const result = await db.query(query, [email]);

// Good: Using an ORM with built-in protection
const user = await prisma.user.findUnique({
  where: { email },
});`,
    },
    "## A04: Insecure Design\n\nThis is about fundamental design flaws, not implementation bugs. No amount of perfect code can fix a flawed design. Examples include missing rate limiting on authentication, not considering abuse scenarios, or lacking multi-factor authentication for sensitive operations.\n\n**How to prevent it:**\n- Threat model your application before building.\n- Use secure design patterns (defence in depth, least privilege).\n- Consider what an attacker would do at every user-facing feature.",
    "## A05: Security Misconfiguration\n\nDefault credentials, unnecessary features enabled, overly permissive CORS, verbose error messages in production, missing security headers. These are all configuration issues that attackers love.\n\n**How to prevent it:**\n- Automate your security configuration. Infrastructure as code helps.\n- Disable default accounts and unused features.\n- Set proper security headers: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security.",
    {
      type: "code",
      language: "typescript",
      code: `// Express security headers with helmet
import helmet from "helmet";

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
}));

// Disable X-Powered-By header
app.disable("x-powered-by");`,
    },
    "## A06: Vulnerable and Outdated Components\n\nUsing libraries with known vulnerabilities is like leaving your front door unlocked. The Log4Shell vulnerability (CVE-2021-44228) is a perfect example of how a single outdated dependency can compromise entire systems.\n\n**How to prevent it:**\n- Run `npm audit` regularly (or your package manager's equivalent).\n- Use tools like Dependabot or Snyk for automated vulnerability scanning.\n- Remove unused dependencies. Every dependency is an attack surface.",
    "## A07: Identification and Authentication Failures\n\nWeak passwords, missing brute-force protection, session tokens in URLs, improper session invalidation. Authentication is hard to get right.\n\n**How to prevent it:**\n- Implement multi-factor authentication.\n- Never ship with default credentials.\n- Rate-limit login attempts.\n- Invalidate sessions properly on logout.\n- Use established authentication libraries instead of rolling your own.",
    "## A08: Software and Data Integrity Failures\n\nThis covers assumptions about software updates, critical data, and CI/CD pipelines without verifying integrity. Think supply chain attacks, unsigned updates, or deserialising untrusted data.\n\n**How to prevent it:**\n- Verify digital signatures on software and updates.\n- Use lock files (package-lock.json, yarn.lock) and review dependency changes.\n- Don't deserialise untrusted data without validation.",
    "## A09: Security Logging and Monitoring Failures\n\nIf you can't detect a breach, you can't respond to it. Many organisations discover breaches months after they happen because they lack proper logging and alerting.\n\n**How to prevent it:**\n- Log all authentication events (successes and failures).\n- Log access control failures.\n- Ensure logs aren't vulnerable to injection themselves.\n- Set up alerts for suspicious patterns (multiple failed logins, unusual access patterns).",
    "## A10: Server-Side Request Forgery (SSRF)\n\nSSRF occurs when a web application fetches a remote resource without validating the user-supplied URL. Attackers can use this to access internal services, read cloud metadata, or scan internal networks.\n\n**How to prevent it:**\n- Validate and sanitise all user-supplied URLs.\n- Use allowlists for permitted domains.\n- Block requests to internal IP ranges (127.0.0.1, 10.x, 169.254.x, etc.).\n- Don't expose raw responses from server-side requests to users.",
    "## Putting It All Together\n\nSecurity is not a feature you add at the end. It's a mindset you carry through every line of code. Start by learning these ten categories, then look at your current project through this lens. You'll likely find at least one area to improve.\n\nThe OWASP Top 10 is updated periodically, so bookmark the official site and stay current. The threats evolve, and so should your defenses.",
  ],
  faq: [
    { question: "What is the OWASP Top 10?", answer: "The OWASP Top 10 is a standard awareness document listing the ten most critical web application security risks, published by the Open Web Application Security Project (OWASP). It is updated periodically and serves as a baseline for web security." },
    { question: "What is broken access control?", answer: "Broken access control is the #1 OWASP risk. It occurs when users can act outside their intended permissions, such as viewing other users' data, modifying unauthorized records, or escalating privileges. Prevention includes denying access by default and enforcing server-side validation." },
    { question: "How do you prevent SQL injection?", answer: "SQL injection is prevented by using parameterised queries or prepared statements, validating and sanitising all user input, and using ORMs with built-in protection. Never concatenate user input directly into SQL queries." },
    { question: "Why is security important for developers?", answer: "Developers are the first line of defense against security vulnerabilities. Understanding risks like injection, broken access control, and cryptographic failures allows developers to write secure code from the start rather than patching issues after deployment." },
  ],
};

export default post;
