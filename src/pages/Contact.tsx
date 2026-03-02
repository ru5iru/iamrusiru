import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { useSEO } from "@/hooks/useSEO";
import { Mail, MapPin, Linkedin, Github, Facebook, Instagram } from "lucide-react";

const SITE = "https://iamrusiru.lovable.app";

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/ru5iru" },
  { label: "GitHub", icon: Github, href: "https://github.com/ru5iru" },
  { label: "Facebook", icon: Facebook, href: "https://web.facebook.com/ru5iru" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com/rusiru.rathmina" },
];

const Contact = () => {
  useSEO({
    title: "Contact Rusiru Rathmina | iamrusiru",
    description: "Get in touch with Rusiru Rathmina, Full-Stack Software Engineer based in Colombo, Sri Lanka. Reach out for collaborations, freelance work, or just to say hi.",
    canonical: "/contact",
    jsonLd: [
      {
        "@type": "ContactPage",
        "name": "Contact Rusiru Rathmina",
        "description": "Get in touch with Rusiru Rathmina for collaborations, freelance opportunities, or tech discussions.",
        "url": `${SITE}/contact`,
        "mainEntity": {
          "@type": "Person",
          "name": "Rusiru Rathmina",
          "email": "mailto:r.rathmina@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Colombo",
            "addressCountry": "LK",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${SITE}/contact` }
        ]
      }
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Heading */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Contact</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-display leading-tight">
            Let's <span className="text-primary">talk</span>.
          </h1>
          <p className="mt-4 text-lg text-caption leading-relaxed max-w-xl">
            Whether you have a project idea, a question, or just want to say hi, I'd love to hear from you.
            I'm always open to interesting conversations, new collaborations, and creative opportunities
            that push boundaries. Feel free to drop me an email or connect through any of my social
            channels below. I'll do my best to get back to you as soon as I can.
          </p>
        </div>

        {/* Info */}
        <div className="max-w-lg space-y-8">
          <div>
            <h3 className="font-display text-lg font-semibold text-display mb-4">Get in touch</h3>
            <div className="space-y-4">
              <a href="mailto:r.rathmina@gmail.com" className="flex items-center gap-3 text-body text-sm hover:text-primary transition-colors">
                <div className="w-9 h-9 rounded-lg bg-warm flex items-center justify-center text-caption">
                  <Mail size={16} />
                </div>
                r.rathmina@gmail.com
              </a>
              <div className="flex items-center gap-3 text-body text-sm">
                <div className="w-9 h-9 rounded-lg bg-warm flex items-center justify-center text-caption">
                  <MapPin size={16} />
                </div>
                Colombo, Sri Lanka
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-display mb-4">Find me online</h3>
            <div className="flex gap-3 flex-wrap">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
              <a
                href="https://x.com/ru5iru"
                target="_blank"
                rel="noopener noreferrer me"
                className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="X (Twitter)"
              >
                <XIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
