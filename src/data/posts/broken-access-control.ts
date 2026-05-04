import postCover from "@/assets/post-broken-access-control.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Broken Access Control: The OWASP Top 10's Most Dangerous Flaw",
  excerpt:
    "Broken access control is the number one OWASP risk because it is silent, easy to ship, and devastating to recover from. Here is how it happens, how attackers exploit it, and how I prevent it in production code.",
  date: "May 2, 2026",
  category: "Engineering",
  slug: "broken-access-control",
  readTime: "9 min read",
  imageUrl: postCover,
  tags: [
    "OWASP",
    "access control",
    "web security",
    "authorization",
    "API security",
    "best practices",
  ],
  seoKeywords: [
    "broken access control",
    "broken access control vulnerability",
    "access control vulnerabilities",
    "authorization failure",
    "web application access control",
    "OWASP broken access control",
    "broken access control OWASP top 10",
    "insecure direct object reference",
    "IDOR vulnerability",
    "BOLA",
    "BFLA",
    "API authorization",
    "privilege escalation",
    "least privilege access",
  ],
  content: [
    "Broken access control is the kind of bug that does not crash anything. The app works. Tests pass. Users do their jobs. Then one curious person changes a number in a URL and walks straight into someone else's data. That is broken access control, and it has held the number one spot on the OWASP Top 10 for years for a reason. In this post I want to show you what a broken access control vulnerability actually looks like in real code, why it keeps happening, and the patterns I rely on to prevent it.",

    "## What is broken access control in web applications?\n\nBroken access control is any authorization failure that lets a user perform an action or read data outside their intended permissions. That includes viewing another user's invoice, editing a record you do not own, calling an admin endpoint as a regular user, or escalating your role through a hidden API parameter. Authentication asks who you are. Authorization asks what you are allowed to do. Broken access control is always a failure of the second question, never the first.",

    "## Why broken access control sits at the top of the OWASP Top 10\n\nThe 2021 OWASP Top 10 update moved broken access control from fifth place to first, with 94 percent of tested applications showing some form of access control weakness [SOURCE: OWASP Top 10 2021]. The reason is simple. Most teams write authorization rules by hand, scatter them across controllers, and rely on UI hiding to enforce them. The moment someone bypasses the UI with curl or Postman, the rules collapse.\n\nIn my own audits I have found broken access control in roughly two out of every three codebases I review, and it is almost never a sophisticated bug. It is a forgotten check on a copy-pasted endpoint, or a list query that filters by a user id supplied in the request body.",

    "## Authentication vs authorization: the difference that matters\n\nIf you only remember one thing from this post, remember this. Authentication proves identity. Authorization enforces policy. A valid JWT does not mean the bearer is allowed to do what they are asking. I have seen senior engineers conflate the two and write middleware that checks `requireAuth` then trusts every parameter the request carries. That is the moment broken access control is born.",

    "## How broken access control actually happens\n\nMost real-world cases I have seen fall into a small number of patterns. Here are the ones worth memorising:\n\n1. **Insecure Direct Object References (IDOR)**: the URL or body contains an id that the server fetches without checking ownership.\n2. **Missing function level checks**: an admin endpoint exists, the UI hides the button, but the route is reachable by anyone with a valid token.\n3. **Privilege escalation through input**: the client can send a `role` field on user update, and the server happily writes it.\n4. **Force browsing**: predictable URLs like `/invoices/1042` that have no per-request authorization.\n5. **CORS or CSRF misconfiguration** that lets a third-party site act on behalf of the user.\n6. **Caching authorized responses** in a shared cache, leaking them to the next requester.",

    "### A real IDOR I shipped\n\nEarly in my career I built a customer portal. Each customer had a dashboard at `/api/customers/:id/orders`. The middleware checked the JWT was valid. It did not check that `:id` matched the JWT's customer id. A friendly support engineer found it in ten seconds by changing the number in the URL. No alarms went off. No logs flagged anything unusual, because from the server's view a logged-in user made a normal API call. That is the scariest part of broken access control: the system does not know it is being abused.",

    {
      type: "code",
      language: "typescript",
      code: `// Vulnerable: trusts the id in the URL
app.get("/api/customers/:id/orders", requireAuth, async (req, res) => {
  const orders = await db.orders.findMany({
    where: { customerId: req.params.id },
  });
  return res.json(orders);
});

// Fixed: enforce ownership at the data layer
app.get("/api/customers/:id/orders", requireAuth, async (req, res) => {
  if (req.params.id !== req.user.customerId) {
    return res.status(403).json({ error: "forbidden" });
  }
  const orders = await db.orders.findMany({
    where: { customerId: req.user.customerId },
  });
  return res.json(orders);
});`,
    },

    "## Broken object level and function level authorization in APIs\n\nThe OWASP API Security Top 10 splits broken access control into two more specific categories that are worth knowing by name. Broken Object Level Authorization (BOLA) is IDOR for APIs: the server returns or modifies an object without checking that the caller owns it. Broken Function Level Authorization (BFLA) happens when a privileged action, like deleting a user or changing a role, is callable by an account that should not have that power. APIs are especially vulnerable because there is no UI to hide behind. Every endpoint must enforce its own policy on every request.",

    "## How to prevent access control vulnerabilities\n\nThere is no silver bullet, but there is a small set of habits that cut the risk dramatically. These are the rules I now apply on every project:\n\n- **Deny by default.** Every route requires an explicit allow. No allow, no access.\n- **Never trust client-supplied identifiers for ownership decisions.** Use the id from the verified session or token.\n- **Centralise authorization logic.** A single policy module beats authorization checks scattered across controllers.\n- **Apply least privilege access** to roles, service accounts, database users, and API tokens.\n- **Treat the API as the source of truth.** UI hiding is a UX nicety, not a security control.\n- **Write tests for the unhappy path.** For every endpoint, write a test that calls it as the wrong user and asserts a 403.",

    "## Role-based vs attribute-based access control\n\nRole-based access control (RBAC) maps users to roles and roles to permissions. It is simple, easy to reason about, and works well when your access rules are coarse. Attribute-based access control (ABAC) makes decisions from attributes of the user, the resource, and the context: time of day, tenant id, document classification, IP range. Most production systems I work with end up as RBAC with a few ABAC rules layered on top, for example role-based UI plus a tenant id check at the data layer for multi-tenant isolation.",

    {
      type: "code",
      language: "typescript",
      code: `// A small policy module beats scattered if/else checks
type Action = "read" | "update" | "delete";

export function canAccessOrder(
  user: { id: string; role: "admin" | "member"; tenantId: string },
  order: { ownerId: string; tenantId: string },
  action: Action,
): boolean {
  if (user.tenantId !== order.tenantId) return false;
  if (user.role === "admin") return true;
  if (action === "read" || action === "update") {
    return user.id === order.ownerId;
  }
  return false;
}`,
    },

    "## How to test for broken access control\n\nManual testing catches more access control bugs than scanners ever will, because authorization is business logic and scanners do not know your business. Here is the sequence I run on any new endpoint:\n\n1. Call it without a token. Expect 401.\n2. Call it with a valid token but the wrong user. Expect 403.\n3. Call it with a valid token and try to mutate fields you should not own, like `role` or `tenantId`. Expect those fields to be ignored or rejected.\n4. Try IDs that do not belong to you. Expect 403, not 404, since 404 can leak existence.\n5. Replay a previously authorized request after logging out. Expect 401.\n\nAutomated tools like Burp Suite, OWASP ZAP, and the open-source Autorize extension help, but they are most useful as a second pass after your own tests.",

    "## Audit logs, monitoring, and zero trust\n\nEven with good policy code, you need to know when someone is probing. Log every authorization failure with the user id, route, and resource id. Alert on bursts. In a multi-tenant SaaS, alert on any cross-tenant access attempt, period. The zero trust mindset assumes the network and the client are hostile, which forces every service to enforce its own policy and every request to be authorized on its own merits. That mindset is the single biggest cultural shift that cuts broken access control bugs at the source.",

    "## Key takeaways\n\nBroken access control is the number one OWASP Top 10 risk because it hides in plain sight, and the OWASP broken access control category covers everything from IDOR to privilege escalation to misconfigured CORS. Prevent it by denying by default, never trusting client-supplied ids for ownership, centralising your authorization policy, applying least privilege, and writing tests for the unhappy path. Authentication tells you who is knocking. Authorization decides whether to open the door. Get the second one wrong and nothing else you do for security really matters.\n\nHave you dealt with a nasty access control bug in production? I would love to hear the story. Find me on [X / Twitter](https://x.com/ru5iru) or [LinkedIn](https://www.linkedin.com/in/ru5iru) and tell me how you caught it.",
  ],
  faq: [
    {
      question: "What is broken access control in web applications?",
      answer:
        "Broken access control is any authorization failure that lets a user perform actions or read data outside their intended permissions. It covers viewing another user's records, calling admin-only endpoints as a regular user, escalating privileges through hidden parameters, or bypassing UI restrictions with direct API calls. It is always a failure of authorization, not authentication.",
    },
    {
      question: "Why is broken access control number one on the OWASP Top 10?",
      answer:
        "OWASP moved broken access control to the top spot in 2021 after finding weaknesses in 94 percent of tested applications. The reason is that authorization is business logic written by hand, scattered across controllers, and often relies on UI hiding. The moment someone bypasses the UI with curl or Postman, those scattered checks collapse and sensitive data leaks silently.",
    },
    {
      question: "What is the difference between authentication and authorization?",
      answer:
        "Authentication proves who a user is, usually with a password, token, or biometric. Authorization decides what that authenticated user is allowed to do. A valid session does not imply permission. Conflating the two is the most common root cause of broken access control, because middleware that only checks identity will still let users access resources they have no right to.",
    },
    {
      question: "What is an insecure direct object reference (IDOR)?",
      answer:
        "An insecure direct object reference is a broken access control flaw where the server uses an identifier from the request, like a URL parameter or body field, to fetch a resource without checking that the caller owns it. Changing the id in the URL exposes someone else's data. The fix is to enforce ownership at the data layer using the id from the verified session.",
    },
    {
      question: "How do you prevent broken access control vulnerabilities?",
      answer:
        "Deny access by default and require an explicit allow on every route. Never trust client-supplied identifiers for ownership decisions, use the id from the verified session instead. Centralise authorization in a single policy module, apply least privilege to roles and tokens, and write tests that call each endpoint as the wrong user to confirm a 403 response.",
    },
    {
      question: "How do you test for broken access control?",
      answer:
        "Manual testing catches more issues than scanners because authorization is business logic. For each endpoint call it without a token, with the wrong user, and with attempts to mutate protected fields like role or tenantId. Confirm cross-tenant ids return 403, not 404, since 404 can leak existence. Burp Suite, OWASP ZAP, and the Autorize extension help as a second pass.",
    },
    {
      question: "What is the difference between role-based and attribute-based access control?",
      answer:
        "Role-based access control (RBAC) maps users to roles and roles to permissions, which is simple and works well for coarse rules. Attribute-based access control (ABAC) makes decisions from attributes of the user, resource, and context such as tenant id, time of day, or IP range. Most production systems use RBAC with ABAC layered on top for multi-tenant isolation.",
    },
  ],
  relatedPosts: ["owasp-top-ten", "code-review-security-platform"],
};

export default post;
