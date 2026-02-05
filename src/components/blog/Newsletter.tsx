import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-warm">
      <div className="blog-container text-center">
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-4 text-display">
          Stay in the loop
        </h2>
        
        <p className="text-body text-lg mb-8 max-w-lg mx-auto">
          Subscribe to get my latest essays and creative musings delivered straight to your inbox. No spam, ever.
        </p>
        
        {isSubmitted ? (
          <div className="bg-accent/10 text-accent px-6 py-4 rounded-lg inline-block">
            <p className="font-medium">Thanks for subscribing! Check your inbox soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-full border border-divider bg-background text-display placeholder:text-caption focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
        
        <p className="text-caption text-sm mt-6">
          Join 2,400+ readers
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
