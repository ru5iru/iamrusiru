import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { useSEO } from "@/hooks/useSEO";
import { authorFaqSchema } from "@/data/authorFaq";

const SITE = "https://iamrusiru.lovable.app";

const About = () => {
  useSEO({
    title: "About Rusiru Rathmina | iamrusiru",
    description: "Learn about Rusiru Rathmina, Associate Software Engineer at Omobio, based in Colombo, Sri Lanka. Full-stack developer specializing in React, Java, Spring Boot, AWS, and DevOps.",
    canonical: "/about",
    jsonLd: [
      {
        "@type": "ProfilePage",
        "name": "About Rusiru Rathmina",
        "url": `${SITE}/about`,
        "mainEntity": {
          "@type": "Person",
          "name": "Rusiru Rathmina",
          "jobTitle": "Associate Software Engineer",
          "worksFor": { "@type": "Organization", "name": "Omobio (Pvt) Ltd", "url": "https://www.omobio.com" },
          "address": { "@type": "PostalAddress", "addressLocality": "Colombo", "addressCountry": "LK" },
          "alumniOf": { "@type": "EducationalOrganization", "name": "University of Colombo School of Computing" },
          "knowsAbout": ["React", "Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "PHP", "Drupal", "Node.js", "PostgreSQL"],
          "sameAs": [
            "https://github.com/ru5iru",
            "https://www.linkedin.com/in/ru5iru",
            "https://x.com/ru5iru",
            "https://instagram.com/rusiru.rathmina",
            "https://web.facebook.com/ru5iru"
          ],
          "description": "Rusiru Rathmina is a Full-Stack Software Engineer at Omobio in Colombo, Sri Lanka, specializing in Java, Spring Boot, React, AWS, Docker, and Kubernetes."
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".about-intro"]
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
          { "@type": "ListItem", "position": 2, "name": "About", "item": `${SITE}/about` }
        ]
      }
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Page heading */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">About me</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-display leading-tight">
            Hey, I'm <span className="text-primary">Rusiru</span>.
          </h1>
          <p className="about-intro mt-4 text-lg text-caption leading-relaxed">
            Associate Software Engineer at Omobio. I build things, break things, and write about both.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-14">

          {/* How it all started */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-5">How it all started</h2>
            <p className="text-body leading-relaxed mb-4">
              My journey didn't start with code — it started with curiosity. Growing up in Galle, Sri Lanka, I was the kid who'd take things apart just to see what's inside. That habit never really left me.
            </p>
            <p className="text-body leading-relaxed">
              At the University of Colombo School of Computing, I discovered that the same curiosity could be applied to software. Suddenly, I wasn't just learning syntax — I was learning how to{" "}
              <span className="text-primary font-medium">solve real problems</span> for real people.
            </p>
          </section>

          {/* The first real leap */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-5">The first real leap</h2>
            <p className="text-body leading-relaxed mb-6">
              November 2023 was when theory met reality. I joined Omobio as a Trainee Full-Stack Developer, and honestly? I was terrified. Real production systems. Real users depending on what I built. Real consequences when things broke.
            </p>

            {/* Pull quote */}
            <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-primary/5 rounded-r-lg">
              <p className="text-display italic leading-relaxed text-lg">
                "The gap between writing code that works on your laptop and code that serves thousands of people every day is massive — and that's where the real learning happens."
              </p>
            </blockquote>

            <p className="text-body leading-relaxed">
              Those early months were intense. I spent countless nights debugging Dialog.lk and Dialog BizCare, diving deep into server logs, learning how systems fail in ways you'd never imagine. But slowly, I started shipping features. Features that actual customers used. That feeling never gets old.
            </p>
          </section>

          {/* Where I am now */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-5">Where I am now</h2>
            <p className="text-body leading-relaxed mb-4">
              Today, as an Associate Software Engineer at Omobio, I'm deep in the trenches refactoring Dialog.lk's legacy codebase. It's not glamorous work, but it matters — making systems more secure, faster, and honestly just less scary to work with.
            </p>
            <p className="text-body leading-relaxed mb-4">
              My days are filled with{" "}
              <span className="text-primary font-medium">React</span>,{" "}
              <span className="text-primary font-medium">PHP</span>,{" "}
              <span className="text-primary font-medium">Drupal</span>, and a healthy dose of AWS (S3, SES, CloudWatch). I've learned to love Redis for caching, Docker for deployments, and the satisfaction of seeing response times drop from 8 seconds to under 2.
            </p>
            <p className="text-body leading-relaxed">
              I'm also spending time making sure our applications meet OWASP Top 10 standards — because security isn't something you add later, it's something you build in from the start.
            </p>
          </section>

          {/* What drives me */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-5">What drives me</h2>
            <p className="text-body leading-relaxed mb-4">
              I love the small victories. When a page that used to crawl suddenly flies. When you catch a security vulnerability before it becomes a problem. When you refactor a messy function into something elegant and it just{" "}
              <span className="text-primary font-medium">works</span>.
            </p>
            <p className="text-body leading-relaxed">
              But more than that, I love working with people who care about quality. People who don't just want to ship features, but want to ship{" "}
              <span className="text-primary font-medium">good</span> features. That's the kind of environment where I thrive.
            </p>
          </section>

          {/* What I'm learning */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-display mb-5">What I'm learning</h2>
            <p className="text-body leading-relaxed mb-4">
              Right now, I'm exploring deeper into cloud-native architectures and DevOps practices. I'm learning how to make better technical decisions, how to mentor junior developers without being overwhelming, and how to balance moving fast with doing things right.
            </p>
            <p className="text-body leading-relaxed">
              Every project teaches me something new. Every bug shows me a perspective I hadn't considered. And honestly? That's exactly why I love this field —{" "}
              <span className="text-primary font-medium">there's always something new to learn</span>.
            </p>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-divider text-center">
          <p className="text-caption text-lg mb-2">That's my story so far.</p>
          <p className="text-caption mb-8">
            If you're building something interesting, tackling similar challenges, or just want to chat about tech over coffee...
          </p>
          <a
            href="https://www.linkedin.com/in/ru5iru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Let's connect →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
