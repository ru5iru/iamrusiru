import profileHeadshot from "@/assets/profile-headshot.jpg";

const Hero = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-display animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Hi, I'm <span className="text-primary">Rusiru</span>
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

          {/* Profile image with decorative shapes */}
          <div
            className="flex-shrink-0 animate-fade-in order-first md:order-last"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Scattered geometric shapes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Triangles */}
                <polygon points="18,30 26,46 10,46" stroke="currentColor" strokeWidth="1.5" className="text-primary/25" fill="none"/>
                <polygon points="285,55 293,71 277,71" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <polygon points="42,265 50,281 34,281" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <polygon points="270,255 278,271 262,271" stroke="currentColor" strokeWidth="1.5" className="text-primary/25" fill="none"/>
                <polygon points="300,160 308,176 292,176" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" fill="none"/>
                <polygon points="10,145 18,161 2,161" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" fill="none"/>

                {/* Rectangles / squares */}
                <rect x="295" y="100" width="14" height="14" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <rect x="10" y="200" width="14" height="14" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <rect x="60" y="20" width="10" height="10" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" fill="none"/>
                <rect x="250" y="285" width="10" height="10" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" fill="none"/>

                {/* Circles */}
                <circle cx="290" cy="200" r="7" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <circle cx="30" cy="100" r="7" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <circle cx="160" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" fill="none"/>
                <circle cx="160" cy="310" r="5" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" fill="none"/>

                {/* X marks */}
                <line x1="70" y1="285" x2="80" y2="295" stroke="currentColor" strokeWidth="1.5" className="text-primary/25"/>
                <line x1="80" y1="285" x2="70" y2="295" stroke="currentColor" strokeWidth="1.5" className="text-primary/25"/>
                <line x1="240" y1="18" x2="250" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-primary/20"/>
                <line x1="250" y1="18" x2="240" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-primary/20"/>
                <line x1="302" y1="240" x2="312" y2="250" stroke="currentColor" strokeWidth="1.5" className="text-primary/15"/>
                <line x1="312" y1="240" x2="302" y2="250" stroke="currentColor" strokeWidth="1.5" className="text-primary/15"/>
                <line x1="8" y1="58" x2="18" y2="68" stroke="currentColor" strokeWidth="1.5" className="text-primary/15"/>
                <line x1="18" y1="58" x2="8" y2="68" stroke="currentColor" strokeWidth="1.5" className="text-primary/15"/>

                {/* Angle brackets / chevrons */}
                <polyline points="120,8 112,16 120,24" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
                <polyline points="200,296 208,304 200,312" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" fill="none"/>
              </svg>

              {/* Light circle background */}
              <div className="absolute inset-6 rounded-full bg-primary/8" />

              {/* Profile image */}
              <div className="absolute inset-8 rounded-full overflow-hidden">
                <img
                  src={profileHeadshot}
                  alt="Rusiru's profile photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

