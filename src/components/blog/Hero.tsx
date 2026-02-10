const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left text */}
          <div className="flex-1 text-center md:text-left">
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-display animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Hi, I'm <span className="text-primary">Sarah</span>
              <br />
              This Is <span className="text-primary">My Blog</span>..
            </h1>

            <p
              className="text-body text-lg mb-8 max-w-lg animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Welcome to my little corner of the internet — personal stories, creative musings, and the occasional recipe that brings me joy.
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

          {/* Right profile image */}
          <div
            className="flex-shrink-0 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="font-display text-7xl md:text-8xl text-display">S</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
