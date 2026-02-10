const Hero = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
          {/* Profile image - shows first on mobile */}
          <div
            className="flex-shrink-0 animate-fade-in order-first md:order-last"
            style={{ animationDelay: "0.3s" }}
          >
              <div className="relative w-40 h-40 md:w-56 md:h-56">
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="font-display text-5xl md:text-7xl text-display">A</span>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-display animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Hi, I'm <span className="text-primary">Alex</span>
              <br />
              This Is <span className="text-primary">My Blog</span>..
            </h1>

            <p
              className="text-body text-lg mb-8 max-w-lg animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Software engineer by day, tinkerer by night. I write about code, career lessons, side projects, and the human side of building software.
            </p>

            <div
              className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <button className="px-7 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                Contact me
              </button>
              <button className="px-7 py-3 border border-divider text-display rounded-full font-medium hover:border-primary hover:text-primary transition-colors">
                About me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
