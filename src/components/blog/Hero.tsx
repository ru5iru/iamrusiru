import { Link } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import profileHeadshot from "@/assets/profile-headshot.jpg";

const Hero = () => {
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center md:text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
              <span className="block w-[3px] h-5 bg-primary rounded-sm" />
              <span className="text-xs md:text-sm font-medium tracking-[0.25em] uppercase text-caption">
                Welcome to my blog
              </span>
            </div>

            <h1 className="font-display font-normal leading-[1.05] mb-8 text-display text-5xl md:text-6xl lg:text-7xl">
              Hi, I&apos;m <span className="text-primary">Rusiru</span>
              <br />
              This is{" "}
              <span className="relative inline-block text-primary">
                My Blog.
                {/* Hand-drawn underline */}
                <svg
                  className="absolute left-0 -bottom-3 w-full"
                  viewBox="0 0 240 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 C 60 2, 140 2, 238 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/80"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-body text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Software engineer by day, tinkerer by night. I write about code,
              career lessons, side projects, and the human side of building
              software.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                <ArrowRight size={18} />
                Contact me
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3 border border-divider text-display rounded-full font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <User size={18} />
                About me
              </Link>
            </div>
          </div>

          {/* Right: portrait composition */}
          <div className="flex-shrink-0 order-first md:order-last">
            <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem]">
              {/* Decorative dot grid - top left of frame */}
              <svg
                className="absolute -top-2 left-2 w-20 h-16 text-primary/40"
                viewBox="0 0 80 64"
                fill="currentColor"
                aria-hidden="true"
              >
                {Array.from({ length: 6 }).map((_, r) =>
                  Array.from({ length: 8 }).map((_, c) => (
                    <circle key={`${r}-${c}`} cx={4 + c * 10} cy={4 + r * 10} r="1.4" />
                  ))
                )}
              </svg>

              {/* Decorative dot grid - bottom right */}
              <svg
                className="absolute bottom-2 -right-2 w-20 h-16 text-primary/40"
                viewBox="0 0 80 64"
                fill="currentColor"
                aria-hidden="true"
              >
                {Array.from({ length: 6 }).map((_, r) =>
                  Array.from({ length: 8 }).map((_, c) => (
                    <circle key={`${r}-${c}`} cx={4 + c * 10} cy={4 + r * 10} r="1.4" />
                  ))
                )}
              </svg>

              {/* Small outline circles & plus marks scattered */}
              <span className="absolute top-10 -left-2 w-3 h-3 rounded-full border border-primary/60" />
              <span className="absolute bottom-16 left-0 w-3 h-3 rounded-full border border-primary/60" />
              <span className="absolute top-1/2 -right-3 w-2.5 h-2.5 rounded-full border border-primary/60" />

              {/* Plus marks */}
              <svg
                className="absolute -bottom-2 right-10 w-4 h-4 text-primary/70"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <svg
                className="absolute top-2 right-16 w-3 h-3 text-primary/70"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              {/* Three short lines bottom-left */}
              <svg
                className="absolute -bottom-4 -left-4 w-16 h-10 text-primary/50"
                viewBox="0 0 64 40"
                aria-hidden="true"
              >
                <line x1="2" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10" y1="20" x2="46" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="32" x2="30" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              {/* Soft blob behind image (left side) */}
              <div className="absolute left-2 top-12 w-40 h-72 rounded-full bg-primary/15 blur-[2px]" />

              {/* Outer thin ring */}
              <div className="absolute inset-2 rounded-full border border-primary/30" />

              {/* White circle background */}
              <div className="absolute inset-6 rounded-full bg-card" />

              {/* Profile image */}
              <div className="absolute inset-6 rounded-full overflow-hidden">
                <img
                  src={profileHeadshot}
                  alt="Rusiru's profile photo"
                  width={416}
                  height={416}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              {/* Code badge top-right */}
              <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg font-mono text-sm font-semibold">
                &lt;/&gt;
              </div>

              {/* Floating "Building ideas" card */}
              <div className="absolute -bottom-2 -left-4 md:-left-10 bg-background border border-divider rounded-lg shadow-lg px-5 py-3">
                <p className="text-sm md:text-base font-medium text-display leading-snug">
                  Building ideas.
                  <br />
                  Sharing knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
