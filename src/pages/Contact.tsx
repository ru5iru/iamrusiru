import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { useSEO } from "@/hooks/useSEO";
import { Mail, MapPin, Linkedin, Github, Facebook, Instagram, Send } from "lucide-react";

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/ru5iru" },
  { label: "GitHub", icon: Github, href: "https://github.com/ru5iru" },
  { label: "Facebook", icon: Facebook, href: "https://web.facebook.com/ru5iru" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com/ru5iru" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useSEO({
    title: "Contact Rusiru Rathmina | iamrusiru",
    description: "Get in touch with Rusiru Rathmina – Full-Stack Software Engineer based in Colombo, Sri Lanka. Reach out for collaborations, freelance work, or just to say hi.",
    canonical: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Rusiru Rathmina",
      "description": "Get in touch with Rusiru Rathmina for collaborations, freelance opportunities, or tech discussions.",
      "url": "https://blog-heart-craft-97.lovable.app/contact",
      "mainEntity": {
        "@type": "Person",
        "name": "Rusiru Rathmina",
        "email": "mailto:rusirurathmina@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Colombo",
          "addressCountry": "LK",
        },
      },
    },
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length > 100) errs.name = "Name must be under 100 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Invalid email address";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length > 1000) errs.message = "Message must be under 1000 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // For now, simulate submission
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

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
            Whether you have a project idea, a question, or just want to say hi — I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Send size={20} className="text-accent" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-display mb-2">Message sent!</h2>
                <p className="text-body mb-6">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-display mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg border border-divider bg-background text-display placeholder:text-caption text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-display mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    maxLength={255}
                    className="w-full px-4 py-3 rounded-lg border border-divider bg-background text-display placeholder:text-caption text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-display mb-2">Message</label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What's on your mind?"
                    rows={5}
                    maxLength={1000}
                    className="w-full px-4 py-3 rounded-lg border border-divider bg-background text-display placeholder:text-caption text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                    <p className="text-caption text-xs ml-auto">{form.message.length}/1000</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  <Send size={16} />
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <aside className="md:col-span-2 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-display mb-4">Get in touch</h3>
              <div className="space-y-4">
                <a href="mailto:rusirurathmina@gmail.com" className="flex items-center gap-3 text-body text-sm hover:text-primary transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-warm flex items-center justify-center text-caption">
                    <Mail size={16} />
                  </div>
                  rusirurathmina@gmail.com
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
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
                <a
                  href="https://x.com/ru5iru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="X (Twitter)"
                >
                  <XIcon size={18} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
