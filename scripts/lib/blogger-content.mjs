// Blogger-only editorial changes. Shared application post records are not mutated.
// Replacements are exact and fail on drift so a source revision cannot silently
// leave a factual correction half-applied. Never transform code examples here.
export function prepareBloggerPosts(sourcePosts, metadata, editorialLinks = {}) {
  const posts = structuredClone(sourcePosts);
  const replace = (post, from, to) => {
    let count = 0;
    post.content = post.content.map(block => {
      if (typeof block !== 'string' || !block.includes(from)) return block;
      count++;
      return block.replace(from, to);
    });
    if (count !== 1) throw new Error(`Blogger correction drift: ${post.slug}: ${from.slice(0, 70)}`);
  };
  for (const post of posts) {
    const planned = metadata[post.slug];
    post.searchDescription = planned?.description || post.excerpt;
    post.searchIntent = planned?.intent || '';
    if (post.slug === 'injection') {
      const current = text => text.replace(/\bA03\b/gi, 'A05').replace(/\bA3\b/gi, 'A05');
      post.title = 'Injection OWASP Top 10 2025: A05 Explained for Developers';
      post.excerpt = 'Injection is A05 in the OWASP Top 10 2025, compared with A03 in 2021. Learn how SQL and command injection happen, and how parameterized queries, allowlists and least privilege reduce the risk.';
      post.content = post.content.map(block => typeof block === 'string' ? current(block) : block);
      post.faq = post.faq.map(faq => ({ question: current(faq.question), answer: current(faq.answer) }));
      post.faq[0].answer = post.faq[0].answer.replace('Injection is A05 in the OWASP Top 10', 'Injection is A05 in OWASP Top 10 2025 (A03 in the 2021 edition)');
      post.seoKeywords = post.seoKeywords.map(current);
      replace(post, 'Injection sits at A05 of the OWASP Top 10,', 'Injection is A05 in the OWASP Top 10 2025 (it was A03 in the 2021 edition),');
      replace(post, 'The OWASP Top 10 A05 injection category consistently ranks in the top five risks across automated scans, bug bounty reports, and breach disclosures.', 'The [OWASP Top 10 2025 Injection category](https://top10.owasp.org/2025/A05_2025-Injection/) describes the risk of sending untrusted data to an interpreter. Its rank in that edition is not a universal ranking across scanners or bug-bounty programs.');
      post.references = [{ title: 'OWASP Top 10 2025: A05 Injection', url: 'https://top10.owasp.org/2025/A05_2025-Injection/' }];
    }
    if (post.slug === 'cryptographic-failures') {
      post.title = 'Cryptographic Failures: OWASP A04 (2025) and A02 (2021)';
      post.excerpt = 'Cryptographic failures expose sensitive data through missing or misused cryptography. The category is A04 in OWASP Top 10 2025 and A02 in 2021. Here are practical checks for encryption, TLS, password hashing and keys.';
      post.seoKeywords = post.seoKeywords.map(keyword => /\ba02\b/i.test(keyword) ? 'OWASP Top 10 2021 A02 cryptographic failures' : keyword);
      post.seoKeywords.push('OWASP Top 10 2025 A04 cryptographic failures');
      replace(post, 'They sit at A02 in the OWASP Top 10 because they are the root cause of most headline-grabbing data breaches.', 'OWASP lists the category as A04 in 2025 and A02 in 2021. These edition-specific identifiers describe the same broad area of missing or misused cryptography.');
      replace(post, '## Why A02 cryptographic failures matter', '## Why cryptographic failures matter: A04 in 2025, A02 in 2021');
      replace(post, 'GDPR, HIPAA, and PCI DSS all treat unencrypted sensitive data as a reportable incident, even if no attacker is proven to have read it.', 'Weak protection can increase the consequences of a data incident; a category ranking alone does not establish a legal reporting obligation.');
      replace(post, 'The 2017 Equifax breach, which exposed 147 million records, started as an unpatched application but propagated because internal traffic and data at rest were not properly encrypted [SOURCE: US GAO Equifax Report].', 'The [US GAO investigation of the Equifax breach](https://www.gao.gov/products/gao-18-559) describes an unpatched application, weaknesses in segmentation and monitoring, and an expired inspection certificate. It should not be summarized as proof that unencrypted internal traffic alone caused the breach.');
      replace(post, '[SOURCE: OWASP Top 10 2021]', '[OWASP Top 10 2021: A02 Cryptographic Failures](https://top10.owasp.org/2021/A02_2021-Cryptographic_Failures/)');
      replace(post, '[SOURCE: Qualys SSL Labs]', '[Qualys SSL Labs Server Test](https://www.ssllabs.com/ssltest/)');
      replace(post, 'recovers 70 percent of the passwords by Tuesday morning.', 'attempts to recover weak passwords using offline guesses. The outcome depends on the passwords, hash function and attack resources.');
      replace(post, 'a leaked database with SHA-256 password hashes is effectively plaintext for any password under twelve characters.', 'fast unsalted hashes can make offline guessing much cheaper; there is no universal password-length cutoff at which every hash becomes recoverable.');
      replace(post, 'Cryptographic failures are A02 in the OWASP Top 10 because they sit underneath almost every category of sensitive data your application handles.', 'Cryptographic failures are A04 in OWASP Top 10 2025 and A02 in 2021; use the edition when referring to the category number.');
      replace(post, 'it has cleared most of A02.', 'it has passed a useful starting checklist for cryptographic failures, not a complete security assessment.');
      post.faq = post.faq.map(faq => faq.question.startsWith('Why is A02') ? {
        question: 'Where do cryptographic failures rank in OWASP Top 10 2025 and 2021?',
        answer: 'Cryptographic Failures is A04 in OWASP Top 10 2025 and A02 in the 2021 edition. Always include the edition when quoting the number. Both entries address protecting sensitive data with appropriate cryptography, secure key management and sound implementation. A category ranking is an awareness guide, not evidence that every instance has the same severity or creates the same legal reporting obligation.',
      } : faq);
      post.references = [
        { title: 'OWASP Top 10 2025: A04 Cryptographic Failures', url: 'https://top10.owasp.org/2025/A04_2025-Cryptographic_Failures/' },
        { title: 'OWASP Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
        { title: 'US GAO: Equifax data breach investigation', url: 'https://www.gao.gov/products/gao-18-559' },
      ];
    }
    if (post.slug === 'broken-access-control') {
      replace(post, 'with 94 percent of tested applications showing some form of access control weakness [SOURCE: OWASP Top 10 2021].', 'with 94% of applications in the contributed data tested for this category and an average incidence rate of 3.81%. Testing coverage is not vulnerability prevalence. See the [OWASP 2021 factors and overview](https://top10.owasp.org/2021/A01_2021-Broken_Access_Control/).');
      post.references = [{ title: 'OWASP Authorization Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' }];
      post.faq = post.faq.map(faq => faq.question === 'Why is broken access control number one on the OWASP Top 10?' ? {
        ...faq,
        answer: 'Broken Access Control ranked A01 in OWASP Top 10 2021 and remains A01 in the 2025 edition. In the 2021 contributed data, 94% of applications were tested for this category, with an average incidence rate of 3.81%. That is testing coverage, not a claim that 94% were vulnerable. Authorization rules must be enforced on the server for each relevant action and resource, with tests for permitted and denied access.',
      } : faq);
    }
    if (post.slug === 'work-life-balance-for-developers') {
      post.excerpt = 'Work-life balance means protecting time and energy for life outside work. Here are the boundaries and workload habits I use to support sustainable software development, with research context and a distinction between personal experience and general advice.';
      replace(post, 'A Stanford study found that productivity per hour drops sharply after 50 hours per week and falls off a cliff past 55. [SOURCE: Stanford research on working hours] Working 70 hours produces almost the exact same output as working 55, you just feel worse and write more bugs.', '[John Pencavel\'s study of working hours](https://siepr.stanford.edu/publications/working-paper/productivity-working-hours) found diminishing returns at long hours in historical industrial-worker data. It is not a controlled study of software engineers and does not establish a universal weekly-hour threshold for developers.');
      replace(post, '[SOURCE: WHO ICD-11]', '[WHO explanation of burnout in ICD-11](https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases)');
      replace(post, 'Once you hit the cynicism stage, recovery takes months, not a long weekend.', 'Recovery varies; the personal experience below should not be read as a universal timeline.');
      replace(post, 'Developer productivity per hour drops sharply after 50 hours per week and collapses past 55, so longer hours rarely produce more real output.', 'Historical working-hours research suggests diminishing returns at long hours, but it does not establish a universal weekly limit for software engineers.');
      replace(post, 'Burnout has three stages: exhaustion, cynicism, and reduced efficacy. Catching it at exhaustion is recoverable in days, catching it at cynicism takes months.', 'WHO describes burnout through exhaustion, mental distance or cynicism, and reduced professional efficacy. These are dimensions, not a fixed sequence of stages or a recovery timetable.');
      post.faq = post.faq.map(faq => faq.question === 'Why does work-life balance matter so much for software engineers?' ? {
        ...faq,
        answer: 'Protecting time for rest and life outside work helps me keep a sustainable development routine. Pencavel\'s working-hours research found diminishing returns in historical industrial-worker data; it does not establish a universal 50- or 55-hour threshold for software engineers. WHO describes burnout as an occupational phenomenon, with exhaustion, mental distance or cynicism, and reduced professional efficacy. Individual experiences and recovery times vary.',
      } : faq);
    }
    if (['injection', 'cryptographic-failures', 'broken-access-control', 'work-life-balance-for-developers'].includes(post.slug)) post.updatedDate = '2026-11-06';
    post.content = post.content.map(block => typeof block === 'string' ? block
      .replaceAll('[INTERNAL LINK: OWASP Top 10 guide]', 'OWASP_GUIDE_LINK')
      .replaceAll('[INTERNAL LINK: broken access control deep dive]', 'ACCESS_CONTROL_LINK')
      .replaceAll('[INTERNAL LINK: deep work techniques for developers]', 'For a related personal account, see BURNOUT_LINK.') : block);
    const editorial = editorialLinks[post.slug];
    if (editorial) {
      let matches = 0;
      post.content = post.content.map(block => {
        if (typeof block !== 'string' || !(block === editorial.heading || block.startsWith(editorial.heading + '\n'))) return block;
        matches++;
        const paragraphs = block.split(/\n\n+/);
        // Keep the paragraph in its relevant section, before any following list.
        paragraphs.splice(Math.min(2, paragraphs.length), 0, editorial.text);
        return paragraphs.join('\n\n');
      });
      if (matches !== 1) throw new Error('Blogger editorial link anchor drift: ' + post.slug);
      post.references = [...new Map([...(post.references || []), ...(editorial.references || [])].map(reference => [reference.url, reference])).values()];
      post.updatedDate = '2026-11-07';
    }
  }
  for (const slug of Object.keys(editorialLinks)) if (!posts.some(post => post.slug === slug)) throw new Error('Unknown Blogger editorial post: ' + slug);
  return posts;
}
