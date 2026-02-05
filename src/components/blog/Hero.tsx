const Hero = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="blog-container text-center">
        <p className="text-caption text-sm uppercase tracking-widest mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Personal Essays & Reflections
        </p>
        
        <h1 
          className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8 text-display animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Thoughts on life,<br />
          <span className="italic text-primary">creativity</span>, and everything in between
        </h1>
        
        <p 
          className="text-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          Welcome to my little corner of the internet. Here, I share personal stories, 
          creative musings, and the occasional recipe that brings me joy.
        </p>
        
        <div 
          className="flex items-center justify-center gap-6 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="w-16 h-16 rounded-full bg-warm overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="font-display text-2xl text-display">S</span>
            </div>
          </div>
          <div className="text-left">
            <p className="font-medium text-display">Sarah Mitchell</p>
            <p className="text-sm text-caption">Writer & Creative</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
