import postOwasp from "@/assets/post-owasp.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "OWASP Top 10 (2025): A Developer's Practical Guide",
  excerpt:
    "The OWASP Top 10 was updated in 2025 with new categories like Software Supply Chain Failures and Mishandling of Exceptional Conditions. Here is a beginner-friendly guide to every category, a 2017 to 2025 mapping, and code examples you can apply today.",
  date: "March 22, 2026",
  updatedDate: "September 30, 2026",
  category: "Engineering",
  slug: "owasp-top-ten",
  readTime: "14 min read",
  imageUrl: postOwasp,
  tags: ["OWASP", "web security", "application security", "SQL injection", "best practices"],
  seoKeywords: [
    "OWASP Top 10",
    "OWASP Top 10 2025",
    "OWASP Top 10 explained",
    "OWASP 2025 vs 2017",
    "web application security",
    "software supply chain failures",
    "broken access control prevention",
    "SQL injection prevention",
    "security misconfiguration",
    "secure coding practices",
    "OWASP for developers",
    "application security checklist",
    "SSRF prevention",
    "secure web development",
  ],
  content: [
    "The OWASP Top 10 is the standard reference for the most critical web application security risks. In 2025, OWASP published a major update to the list. Some categories moved, some were renamed, and two are entirely new: Software Supply Chain Failures and Mishandling of Exceptional Conditions. If you learned the 2017 or 2021 list, this guide brings you up to date. If you are new to security, everything here is explained from the ground up, with plain-language examples and code you can apply today.",

    "## What changed in 2025?\n\nThe 2025 list reflects how modern attacks actually happen: through dependencies, CI/CD pipelines, and misconfigured cloud services, not just through bad input handling. Here is how the 2021/2017-era categories map to the 2025 list:\n\n| 2017/2021 era | 2025 edition |\n| --- | --- |\n| A01 Broken Access Control | A01:2025 Broken Access Control (unchanged, still #1) |\n| A02 Cryptographic Failures | A04:2025 Cryptographic Failures (moved down) |\n| A03 Injection | A05:2025 Injection (moved down) |\n| A04 Insecure Design | A06:2025 Insecure Design |\n| A05 Security Misconfiguration | A02:2025 Security Misconfiguration (moved up) |\n| A06 Vulnerable and Outdated Components | A03:2025 Software Supply Chain Failures (expanded and renamed) |\n| A07 Identification and Authentication Failures | A07:2025 Authentication Failures (renamed) |\n| A08 Software and Data Integrity Failures | A08:2025 Software or Data Integrity Failures |\n| A09 Security Logging and Monitoring Failures | A09:2025 Security Logging and Alerting Failures (renamed) |\n| A10 Server-Side Request Forgery | Folded into other categories; replaced by A10:2025 Mishandling of Exceptional Conditions (new) |\n\nThe big story: misconfiguration jumped to number two, supply chain risk got its own expanded category, and SSRF was absorbed into broader categories to make room for a new entry about how applications fail.",

    "## A01:2025 Broken Access Control\n\nBroken access control keeps the top spot. It happens when users can act outside their intended permissions: viewing another user's data, modifying records they should not, or escalating themselves to admin.\n\n**A simple example:** an app shows orders at `/api/orders/1234`. If changing the number to `1235` shows someone else's order, access control is broken. The server checked that you were logged in, but never checked that the order belongs to you.\n\n**How to prevent it:**\n- Deny access by default. Only grant permissions explicitly.\n- Never rely on client-side checks alone. Always validate on the server.\n- Check ownership on every request, not just authentication.\n- Use role-based access control (RBAC) and enforce it at the API layer.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: trusting the client-supplied user ID
app.get("/api/orders/:userId", (req, res) => {
  const orders = db.getOrders(req.params.userId);
  return res.json(orders);
});

// Good: use the authenticated session's user ID
app.get("/api/orders", requireAuth, (req, res) => {
  const orders = db.getOrders(req.user.id); // from JWT/session
  return res.json(orders);
});`,
    },

    "## A02:2025 Security Misconfiguration\n\nSecurity misconfiguration jumped from fifth to second place because modern apps have so many moving parts: cloud buckets, containers, serverless functions, CDNs, and frameworks. Every one of them ships with defaults, and defaults are rarely secure.\n\n**Common examples:** default admin credentials left enabled, an S3 bucket set to public, overly permissive CORS (`Access-Control-Allow-Origin: *` on an authenticated API), verbose stack traces shown to users in production, and missing security headers.\n\n**How to prevent it:**\n- Automate your security configuration. Infrastructure as code makes settings reviewable and repeatable.\n- Disable default accounts, sample apps, and unused features.\n- Set proper security headers: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security.\n- Review cloud permissions regularly. Least privilege applies to infrastructure too.",
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

    "## A03:2025 Software Supply Chain Failures\n\nThis is the expanded successor to Vulnerable and Outdated Components, and it is the biggest conceptual change in the 2025 list. The old category covered using a library with a known vulnerability. The new one covers the entire supply chain: your dependencies, your build system, your CI/CD pipeline, and the updates you install.\n\n**Why the change?** Because attackers stopped waiting for you to use a vulnerable library and started attacking the supply chain itself. The xz Utils backdoor (2024) showed a maintainer account being compromised to ship malicious code in a trusted package. The Log4Shell vulnerability (CVE-2021-44228) showed how one outdated dependency can compromise entire systems.\n\n**How to prevent it:**\n- Run `npm audit` regularly (or your package manager's equivalent) and act on the results.\n- Use tools like Dependabot or Snyk for automated vulnerability scanning.\n- Pin dependencies with lock files and review what changes in every update.\n- Remove unused dependencies. Every dependency is attack surface.\n- Verify the integrity of what you install: signatures, checksums, and provenance where available.",

    "## A04:2025 Cryptographic Failures\n\nFormerly called Sensitive Data Exposure, this covers failures related to cryptography that lead to exposure of sensitive data: passwords stored in plain text, data transmitted over HTTP, weak hashing algorithms, or hardcoded keys in source code.\n\n**A simple test:** if your database leaked tomorrow, what would attackers read? If the answer includes plain-text passwords, unencrypted card numbers, or API keys, you have a cryptographic failure.\n\n**How to prevent it:**\n- Always use HTTPS. No exceptions.\n- Hash passwords with bcrypt, scrypt, or Argon2. Never MD5 or SHA-1.\n- Encrypt sensitive data at rest using strong algorithms (AES-256).\n- Keep secrets in a secrets manager or environment variables, never in git.\n- Do not store sensitive data you do not need.",

    "## A05:2025 Injection\n\nSQL injection, NoSQL injection, command injection, LDAP injection, and now prompt injection for AI-powered features. Any time user input is sent to an interpreter as part of a command or query without proper handling, you have an injection vulnerability.\n\n**A simple example:** a login form that builds a SQL query by gluing strings together. An attacker types `' OR '1'='1` as the email, and the query returns every user in the database.\n\n**How to prevent it:**\n- Use parameterized queries or prepared statements. Always.\n- Validate and sanitize all user input.\n- Use ORMs, but understand their limitations.\n- For AI features, treat user input as untrusted instructions and separate it from system prompts.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: string concatenation in SQL (injection risk)
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// Good: parameterised query
const query = "SELECT * FROM users WHERE email = $1";
const result = await db.query(query, [email]);

// Good: using an ORM with built-in protection
const user = await prisma.user.findUnique({
  where: { email },
});`,
    },

    "## A06:2025 Insecure Design\n\nInsecure design is about fundamental design flaws, not implementation bugs. No amount of perfect code can fix a flawed design. Examples include missing rate limiting on authentication, not considering abuse scenarios, or letting a password reset flow reveal whether an email address is registered.\n\n**The difference from a bug:** a bug is a mistake in the code. A design flaw is a mistake in the plan. If your design says 'users can reset their password with just their email', an attacker can lock out any account by requesting resets in a loop. The code can be perfect and the design is still broken.\n\n**How to prevent it:**\n- Threat model your application before building. Ask: how would I abuse this feature?\n- Use secure design patterns: defense in depth, least privilege, fail securely.\n- Write abuse cases alongside your user stories.",

    "## A07:2025 Authentication Failures\n\nPreviously called Identification and Authentication Failures, this covers weak passwords, missing brute-force protection, session tokens in URLs, and sessions that stay valid after logout. Authentication is genuinely difficult to implement correctly, which is why you should not build it yourself.\n\n**How to prevent it:**\n- Implement multi-factor authentication.\n- Never ship with default credentials.\n- Rate-limit login attempts and add exponential backoff.\n- Invalidate sessions properly on logout and on password change.\n- Use established authentication libraries or managed auth providers instead of rolling your own.",

    "## A08:2025 Software or Data Integrity Failures\n\nThis covers assumptions about software updates, critical data, and CI/CD pipelines without verifying integrity. Think unsigned updates, deserializing untrusted data, or a build pipeline that anyone can push to.\n\n**A simple example:** if your app auto-updates by downloading a file from a server and running it, what stops an attacker who compromises that server from shipping malware to every user? Without signature verification, nothing.\n\n**How to prevent it:**\n- Verify digital signatures on software and updates.\n- Use lock files (package-lock.json, yarn.lock) and review dependency changes.\n- Protect your CI/CD pipeline: require reviews, restrict who can modify build configs, sign artifacts.\n- Do not deserialize untrusted data without validation.",

    "## A09:2025 Security Logging and Alerting Failures\n\nRenamed from Logging and Monitoring Failures to put the emphasis where it belongs: alerting. Logs nobody reads are just disk usage. If you cannot detect a breach, you cannot respond to it, and many organizations discover breaches months after they happen.\n\n**How to prevent it:**\n- Log all authentication events (successes and failures).\n- Log access control failures and input validation failures.\n- Ensure logs are not vulnerable to injection themselves (attackers will try to forge log entries).\n- Set up alerts for suspicious patterns: multiple failed logins, unusual access volume, requests from unexpected locations.\n- Test your alerts. An alert that has never fired is an alert you cannot trust.",

    "## A10:2025 Mishandling of Exceptional Conditions\n\nThis is the brand-new category, replacing SSRF. It covers how applications behave when things go wrong: unhandled exceptions, error messages that leak internals, and code that fails open instead of failing closed.\n\n**A simple example:** a payment flow where an exception in the fraud check lets the payment proceed anyway. The system failed open: when the safety check crashed, the default behavior was 'allow'. Secure systems fail closed: when in doubt, deny.\n\n**Common mistakes:**\n- Showing stack traces or database errors to users (leaks internal structure to attackers).\n- Catch blocks that swallow errors and let execution continue in an unknown state.\n- Timeouts and error paths that skip authorization checks.\n\n**How to prevent it:**\n- Fail closed. When a security check errors out, deny the action.\n- Show users generic error messages; log the details server-side.\n- Handle exceptions at every boundary, and never let an error bypass a security control.",
    {
      type: "code",
      language: "typescript",
      code: `// Bad: failing open - if the fraud check throws, the payment proceeds
async function processPayment(payment: Payment) {
  try {
    await fraudCheck(payment);
  } catch (err) {
    console.error("fraud check failed", err);
  }
  return chargeCard(payment); // runs even when the check failed
}

// Good: failing closed - an error in the check blocks the payment
async function processPayment(payment: Payment) {
  try {
    await fraudCheck(payment);
  } catch (err) {
    logger.error("fraud check failed", { err, paymentId: payment.id });
    throw new PaymentRejectedError("Payment could not be verified");
  }
  return chargeCard(payment);
}`,
    },

    "## Where did SSRF go?\n\nServer-Side Request Forgery did not stop mattering. In the 2025 list it was folded into broader categories rather than keeping its own slot, because the data showed it overlapping heavily with access control and configuration issues. The defenses are unchanged: validate user-supplied URLs, use allowlists for permitted domains, block requests to internal IP ranges (127.0.0.1, 10.x, 169.254.x), and never expose raw responses from server-side fetches to users.",

    "## Key Takeaways\n\n- The OWASP Top 10 was updated in 2025: misconfiguration rose to #2, supply chain failures got an expanded category, and Mishandling of Exceptional Conditions is brand new\n- Broken access control is still the number one risk: check ownership on every request, not just login state\n- Your dependencies, build pipeline, and updates are part of your attack surface: pin, audit, and verify them\n- Use parameterized queries to prevent injection, never string concatenation\n- Hash passwords with bcrypt, scrypt, or Argon2 and always use HTTPS\n- Fail closed: when a security check errors, deny the action\n- Log security events and, more importantly, alert on them\n- Security is not a feature you add at the end: it is a mindset for every line of code",
  ],
  faq: [
    { question: "What is the OWASP Top 10?", answer: "The OWASP Top 10 is a standard awareness document listing the ten most critical web application security risks, published by the Open Web Application Security Project. It is updated periodically to reflect how real attacks happen and serves as a baseline for web security best practices. The latest edition is the 2025 release." },
    { question: "What changed in the OWASP Top 10 2025?", answer: "The 2025 update moved Security Misconfiguration up to number two, expanded Vulnerable and Outdated Components into Software Supply Chain Failures, renamed Authentication Failures and Logging and Alerting Failures, folded SSRF into broader categories, and added a new category: Mishandling of Exceptional Conditions. Broken Access Control remains number one." },
    { question: "What is broken access control?", answer: "Broken access control is the number one OWASP risk. It occurs when users can act outside their intended permissions, such as viewing other users' data, modifying unauthorized records, or escalating privileges. Prevention includes denying access by default and checking ownership on every server-side request." },
    { question: "What are software supply chain failures?", answer: "Software supply chain failures cover risks across your entire dependency and build chain: vulnerable libraries, compromised packages, tampered updates, and insecure CI/CD pipelines. The 2025 OWASP list expanded the old Vulnerable and Outdated Components category into this broader one after attacks like the xz Utils backdoor." },
    { question: "How do you prevent SQL injection?", answer: "SQL injection is prevented by using parameterized queries or prepared statements, validating and sanitizing all user input, and using ORMs with built-in protection. Never concatenate user input directly into SQL queries." },
    { question: "What does 'fail closed' mean?", answer: "Failing closed means that when a security check errors out, the system denies the action by default. The opposite, failing open, lets actions proceed when checks crash, which attackers exploit. The 2025 OWASP category Mishandling of Exceptional Conditions covers this class of mistakes." },
    { question: "What password hashing algorithm should I use?", answer: "Use bcrypt, scrypt, or Argon2 for password hashing. Never use MD5 or SHA-1 because they are too fast and vulnerable to brute-force attacks. Modern hashing algorithms are intentionally slow to make password cracking computationally expensive." },
  ],
  relatedPosts: ["broken-access-control", "cryptographic-failures", "injection"],
};

export default post;
