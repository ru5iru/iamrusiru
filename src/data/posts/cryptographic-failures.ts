import postCover from "@/assets/post-cryptographic-failures.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Cryptographic Failures: The OWASP A02 Risk Hiding in Your Code",
  excerpt:
    "Cryptographic failures are the silent data leaks behind most modern breaches. Here is what they are, why OWASP ranks them A02, and how I prevent them in production.",
  date: "May 15, 2026",
  category: "Engineering",
  slug: "cryptographic-failures",
  readTime: "10 min read",
  imageUrl: postCover,
  tags: [
    "OWASP",
    "cryptography",
    "web security",
    "encryption",
    "TLS",
    "best practices",
  ],
  seoKeywords: [
    "cryptographic failures",
    "what are cryptographic failures",
    "owasp top 10 cryptographic failures",
    "a02 cryptographic failures",
    "what are the causes of cryptographic failures",
    "what is the impact of cryptographic failures",
    "common cryptographic failures",
    "cryptographic failures attack",
    "cryptographic errors",
    "failures of cryptography",
    "sensitive data exposure",
    "weak encryption",
    "TLS misconfiguration",
    "password hashing",
  ],
  content: [
    "Cryptographic failures are any weakness in how an application protects data in transit or at rest, from missing encryption to weak algorithms to leaked keys. They sit at A02 in the OWASP Top 10 because they are the root cause of most headline-grabbing data breaches. In this post I want to walk through what cryptographic failures actually look like in production code, what causes them, and the small set of habits I rely on to keep them out of the systems I build.",

    "## What are cryptographic failures?\n\nCryptographic failures are mistakes in the design or implementation of cryptography that expose sensitive data. The category used to be called Sensitive Data Exposure in the 2017 OWASP Top 10, but the name was changed in 2021 to point at the real cause, which is broken or missing crypto, not the leak itself [SOURCE: OWASP Top 10 2021]. The category covers everything from sending passwords over plain HTTP, to storing them with MD5, to hardcoding an AES key in a Git repo, to using a deprecated TLS version on an internal API.\n\nThe word failure is precise here. Cryptography is one of the few areas of software where doing nothing and doing the wrong thing produce the same outcome: an attacker reads your data.",

    "## Why A02 cryptographic failures matter\n\nThe 2021 OWASP refresh moved cryptographic failures from third place to second, just behind broken access control. The reason is that almost every regulated data type, payment cards, health records, personal identifiers, authentication credentials, depends on cryptography to stay confidential. When the crypto fails, the regulatory and reputational fallout is enormous. GDPR, HIPAA, and PCI DSS all treat unencrypted sensitive data as a reportable incident, even if no attacker is proven to have read it.\n\nIn my own consulting work I see cryptographic errors in about half the codebases I audit, and the failures are almost never exotic. They are forgotten flags, copy-pasted snippets from a 2012 Stack Overflow answer, and secrets checked into version control.",

    "## What are the causes of cryptographic failures?\n\nMost real-world cases I have seen come from a small set of root causes. If you internalise this list you will catch the majority of issues in code review:\n\n1. **No encryption at all** for data that should be protected, especially internal service-to-service traffic and database backups.\n2. **Weak or deprecated algorithms** like MD5, SHA-1, DES, RC4, or RSA with a 1024 bit key.\n3. **Custom or roll-your-own crypto** instead of vetted libraries.\n4. **Hardcoded secrets and keys** in source code, config files, or container images.\n5. **Improper key management**, including keys that never rotate, are shared across environments, or live next to the data they protect.\n6. **Misconfigured TLS**: outdated versions, weak cipher suites, or self-signed certificates trusted in production clients.\n7. **Insecure randomness**, using `Math.random` or `rand()` for tokens, salts, or session ids instead of a cryptographically secure RNG.\n8. **Plaintext password storage** or the use of fast hashes like SHA-256 without a slow key derivation function.",

    "## What is the impact of cryptographic failures?\n\nThe impact ranges from embarrassing to existential. A weak hash leaks the entire user table the moment your database is dumped. A missing TLS check on a mobile client lets a coffee shop attacker steal session tokens. A leaked private key invalidates every signed token in circulation. The 2017 Equifax breach, which exposed 147 million records, started as an unpatched application but propagated because internal traffic and data at rest were not properly encrypted [SOURCE: US GAO Equifax Report].\n\nBeyond the data loss, there is the cleanup. Rotating a leaked symmetric key means re-encrypting every record it protected. Rotating a leaked signing key means invalidating every JWT and forcing every user to log in again. I have lived through both. Neither is a Friday afternoon job.",

    "## Common cryptographic failures, with code\n\nLet me show you a few of the patterns I see most often. The fixes are short, but you would be surprised how often the broken version ships.",

    {
      type: "code",
      language: "typescript",
      code: `// Bad: fast hash, no salt, instant rainbow table victim
import { createHash } from "node:crypto";
const hash = createHash("sha256").update(password).digest("hex");

// Good: argon2id, slow by design, salt and parameters baked in
import argon2 from "argon2";
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
});`,
    },

    {
      type: "code",
      language: "typescript",
      code: `// Bad: predictable token, do not use Math.random for anything secret
const token = Math.random().toString(36).slice(2);

// Good: cryptographically secure random bytes
import { randomBytes } from "node:crypto";
const token = randomBytes(32).toString("base64url");`,
    },

    {
      type: "code",
      language: "typescript",
      code: `// Bad: hardcoded key in source, ECB mode, no auth tag
const key = "supersecretkey123";
const cipher = createCipheriv("aes-128-ecb", key, null);

// Good: key from a managed secret store, GCM mode, random IV
const key = await secrets.get("payments.encryption-key");
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const authTag = cipher.getAuthTag();`,
    },

    "## Cryptographic failures attacks: how the bad version plays out\n\nA cryptographic failures attack rarely looks like a Hollywood scene. It looks like a script that downloads a leaked database dump, runs it through Hashcat with a wordlist, and recovers 70 percent of the passwords by Tuesday morning. It looks like an attacker on a hotel Wi-Fi running mitmproxy against a mobile app that does not pin certificates. It looks like an intern grepping a public GitHub mirror for `AKIA` and finding live AWS keys.\n\nThe pattern is always the same: cheap, automated, and patient. That is why defending against cryptographic failures is mostly about closing the easy doors, not about resisting nation-state cryptanalysis.",

    "## How I prevent cryptographic failures\n\nThere is no single silver bullet, but there is a small playbook that catches the majority of issues. These are the rules I now apply on every project:\n\n- **Classify your data first.** You cannot decide what to encrypt until you know what is sensitive. Tag every field as public, internal, or confidential.\n- **Encrypt in transit, always.** TLS 1.2 minimum, TLS 1.3 preferred, including for internal services. Disable weak ciphers and old protocols.\n- **Encrypt at rest where it matters.** Use platform-native encryption for databases, object storage, and backups. Add field-level encryption for high-sensitivity columns.\n- **Use modern, vetted primitives.** AES-256-GCM or ChaCha20-Poly1305 for symmetric encryption, Ed25519 or RSA-3072 for signatures, Argon2id or scrypt for password hashing.\n- **Never roll your own.** Use libsodium, the platform's standard library, or a well-known wrapper. Custom crypto is how researchers find CVEs.\n- **Manage keys properly.** Store them in a managed KMS or secret manager, never in code or config. Rotate them on a schedule and on suspicion of leak.\n- **Use a CSPRNG for every secret.** Tokens, salts, session ids, password reset codes. If your language has a `crypto` module, use it.\n- **Pin certificates in mobile and desktop clients** that talk to APIs you own.",

    "## Password hashing deserves its own section\n\nThe single most common cryptographic error I see is treating passwords like any other data. Passwords are not encrypted, they are hashed, and the hash function must be slow on purpose. SHA-256 is fast, which is great for file integrity and terrible for passwords. A modern GPU can compute billions of SHA-256 hashes per second, which means a leaked database with SHA-256 password hashes is effectively plaintext for any password under twelve characters.\n\nUse Argon2id, scrypt, or bcrypt with sensible parameters. Tune the cost so a single hash takes around 250 to 500 milliseconds on your production hardware. That is fast enough for a login form and slow enough to make brute-force economically painful.",

    "## TLS misconfiguration is its own quiet disaster\n\nA correctly issued certificate is not the same as a correctly configured server. I have seen production load balancers that still accept TLS 1.0, internal services that trust any certificate signed by a permissive corporate CA, and mobile apps that disable certificate validation in development and never re-enable it in release builds.\n\nTwo tools end most of the guesswork. Run [SOURCE: Qualys SSL Labs] against every public endpoint and aim for an A or A+ grade. For internal services, write an integration test that connects with an intentionally invalid certificate and asserts the connection is refused. If that test passes, your TLS is real.",

    "## What are considered cryptographic failures in code review?\n\nWhen I review pull requests, I treat the following as automatic blockers, no discussion needed:\n\n- Any string that looks like a key, token, or password committed to the repo.\n- Calls to `MD5`, `SHA1`, `DES`, `RC4`, or `ECB` mode anywhere.\n- Use of `Math.random`, `rand`, or any non-CSPRNG function for security tokens.\n- Custom encryption or signature schemes built from primitives.\n- TLS verification disabled in HTTP clients, even with a comment saying it is temporary.\n- Password storage using anything other than a slow KDF.\n- Encryption keys that travel in environment variables across multiple environments without a clear rotation story.\n\nThis list is not exhaustive, but if a PR clears all of these, it has cleared most of A02.",

    "## Logging, error messages, and side channels\n\nCryptography also fails through what surrounds it. Logging a full request body that contains a password, returning a verbose error that distinguishes invalid user from invalid password, or comparing tokens with `===` instead of a constant-time function are all cryptographic errors in spirit. Use timing-safe comparison for any secret. Scrub sensitive fields from logs at the source, not in a downstream pipeline. Treat your error messages as part of your attack surface.",

    "## Key takeaways\n\nCryptographic failures are A02 in the OWASP Top 10 because they sit underneath almost every category of sensitive data your application handles. The fixes are not exotic: classify your data, encrypt it in transit and at rest with modern primitives, hash passwords with a slow KDF, store keys in a managed vault, and use a CSPRNG for every secret. Avoid custom crypto, deprecated algorithms, and hardcoded keys. Most failures of cryptography I see in the wild are not clever attacks, they are tired defaults. Replacing those defaults is the highest-leverage security work you can do this quarter.\n\nIf you want a broader walkthrough of the rest of the list, my [INTERNAL LINK: OWASP Top 10 guide] covers all ten categories, and the [INTERNAL LINK: broken access control deep dive] pairs naturally with this one.\n\nHave you shipped, or caught, a nasty cryptographic failure? I would love to hear the story. Find me on [X / Twitter](https://x.com/ru5iru) or [LinkedIn](https://www.linkedin.com/in/ru5iru) and tell me what tipped you off.",
  ],
  faq: [
    {
      question: "What are cryptographic failures?",
      answer:
        "Cryptographic failures are weaknesses in how an application protects data in transit or at rest. They include missing encryption, weak or deprecated algorithms, hardcoded keys, insecure randomness, and bad password storage. OWASP renamed the 2017 Sensitive Data Exposure category to Cryptographic Failures in 2021 to point at the real cause: broken or missing cryptography, not the data leak itself.",
    },
    {
      question: "What are the causes of cryptographic failures?",
      answer:
        "The most common causes are no encryption at all, weak algorithms like MD5 or SHA-1, custom roll-your-own crypto, hardcoded keys in source code, poor key management, misconfigured TLS, insecure randomness from functions like Math.random, and plaintext password storage. Almost every real-world failure traces back to one of these patterns rather than to a clever cryptanalytic attack on a modern algorithm.",
    },
    {
      question: "Why is A02 cryptographic failures so high on the OWASP Top 10?",
      answer:
        "OWASP moved cryptographic failures to the second spot in 2021 because almost every regulated data type, payment cards, health records, personal identifiers, and credentials, depends on cryptography to stay confidential. GDPR, HIPAA, and PCI DSS all treat unencrypted sensitive data as a reportable incident, so the regulatory and reputational impact of a single failure is enormous, even without a confirmed breach.",
    },
    {
      question: "What is the impact of cryptographic failures?",
      answer:
        "The impact ranges from leaked user tables and stolen session tokens to invalidated signing keys that force every user to log in again. A weak password hash exposes credentials the moment a database is dumped. A leaked symmetric key requires re-encrypting every record it protected. Beyond data loss, organisations face regulatory fines, mandatory breach disclosure, customer churn, and significant engineering cleanup work.",
    },
    {
      question: "What are common cryptographic failures in code?",
      answer:
        "Common failures include using SHA-256 or MD5 for password hashing instead of Argon2id, generating tokens with Math.random instead of a CSPRNG, encrypting with AES in ECB mode, hardcoding keys in source code, disabling TLS certificate verification, and committing secrets to Git. Each of these is a small mistake on its own, but together they account for the majority of real-world cryptographic errors in production systems.",
    },
    {
      question: "How do you prevent cryptographic failures?",
      answer:
        "Start by classifying your data, then encrypt it in transit with TLS 1.2 or higher and at rest with AES-256-GCM or ChaCha20-Poly1305. Hash passwords with Argon2id, scrypt, or bcrypt. Generate every secret with a CSPRNG. Store keys in a managed KMS, rotate them on a schedule, and never hardcode them. Use vetted libraries instead of building your own primitives.",
    },
    {
      question: "What does a cryptographic failures attack look like?",
      answer:
        "A real cryptographic failures attack is rarely sophisticated. It usually means running a leaked database through Hashcat with a wordlist, intercepting a mobile app on public Wi-Fi because it skips certificate pinning, or scanning public GitHub mirrors for hardcoded AWS keys. The pattern is automated, cheap, and patient, which is why defending against these attacks is mostly about closing easy doors rather than resisting elite cryptanalysis.",
    },
  ],
  relatedPosts: ["broken-access-control", "owasp-top-ten"],
};

export default post;
