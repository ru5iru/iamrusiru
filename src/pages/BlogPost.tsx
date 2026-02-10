import { useParams, Link } from "react-router-dom";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import { ArrowLeft } from "lucide-react";

import featuredImage from "@/assets/featured-post.jpg";
import postSlowMornings from "@/assets/post-slow-mornings.jpg";
import postCreativity from "@/assets/post-creativity.jpg";
import postLetter from "@/assets/post-letter.jpg";
import postBooks from "@/assets/post-books.jpg";

const postData: Record<string, {
  title: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
  content: string[];
}> = {
  "joy-of-writing-by-hand": {
    title: "The Joy of Writing by Hand",
    date: "January 22, 2024",
    category: "Essays",
    readTime: "6 min read",
    imageUrl: featuredImage,
    content: [
      "In an age of keyboards and voice notes, there's a quiet rebellion in picking up a pen. The simple act of pressing ink to paper carries a weight that digital text never quite achieves.",
      "I started journaling five years ago, during a period when my thoughts felt tangled and overwhelming. A friend suggested I try writing them down — not typing, but actually writing. The difference was immediate and profound.",
      "There's a slowness to handwriting that forces you to think differently. You can't type faster than your thoughts, rushing to capture every fleeting idea. With a pen, you must choose your words more carefully, and in that choosing, you often find clarity.",
      "The physical act engages your brain in ways that typing simply doesn't. Studies have shown that handwriting activates areas of the brain associated with memory, creativity, and critical thinking. When you write by hand, you're not just recording — you're processing.",
      "My journals have become a record of my inner life. Flipping through old notebooks, I can see how my handwriting changes with my mood — tight and angular when I'm stressed, flowing and loose when I'm at peace. These visual cues add a dimension that no font can replicate.",
      "If you haven't picked up a pen in a while, I encourage you to try. Start small — a few sentences about your day, a list of things you're grateful for, or even just doodles in the margins. You might be surprised by what flows out when you slow down enough to let it.",
    ],
  },
  "art-of-slow-mornings": {
    title: "On the Art of Slow Mornings",
    date: "January 15, 2024",
    category: "Lifestyle",
    readTime: "6 min read",
    imageUrl: postSlowMornings,
    content: [
      "There's something magical about waking up before the world does. The quiet hum of dawn, the first sip of coffee, and the gentle promise of a new day stretching out before you like an unwritten page.",
      "For years, I was a snooze-button person. My mornings were a blur of rushing, half-eaten toast, and the constant feeling of being behind before the day even started. Then something shifted.",
      "I began setting my alarm thirty minutes earlier — not to be more productive, but to be less rushed. Those thirty minutes became sacred. A cup of coffee made slowly, savored while watching the light change outside my window.",
      "The art of a slow morning isn't about doing nothing. It's about doing things with intention. It's reading a few pages of a book instead of scrolling through your phone. It's stretching instead of stumbling. It's breathing instead of bracing.",
      "What I've found is that the quality of my mornings sets the tone for my entire day. When I start gently, I move through the hours with more grace. Problems feel smaller. Interactions feel warmer. Creativity flows more freely.",
      "You don't need to overhaul your entire routine. Start with just ten minutes of quiet. See what happens when you give yourself the gift of an unhurried beginning.",
    ],
  },
  "creativity-in-mundane": {
    title: "Finding Creativity in the Mundane",
    date: "January 8, 2024",
    category: "Creativity",
    readTime: "4 min read",
    imageUrl: postCreativity,
    content: [
      "We often wait for inspiration to strike like lightning. We imagine creativity as something dramatic — a sudden burst of genius that arrives fully formed. But what if creativity is quieter than that?",
      "I've found my best ideas while washing dishes. There's something about the warm water, the repetitive motion, and the letting-go of trying that opens a door in my mind.",
      "Walking is another wellspring. Not walking with a podcast or audiobook, but walking in silence, letting your eyes wander and your thoughts meander. Some of my most important decisions have been made on long, aimless walks.",
      "The key is to stop treating creativity as a destination and start seeing it as a way of moving through the world. Every conversation is a potential story. Every mundane task is a meditation waiting to happen.",
    ],
  },
  "letter-to-younger-self": {
    title: "A Letter to My Younger Self",
    date: "December 28, 2023",
    category: "Personal",
    readTime: "8 min read",
    imageUrl: postLetter,
    content: [
      "Dear younger me,",
      "I know you're trying so hard to have it all figured out. You think everyone around you has a map and you're the only one wandering without one. I want you to know: nobody has a map. We're all making it up as we go.",
      "Stop comparing your beginning to someone else's middle. The person you admire most has a pile of failures you'll never see. Success isn't linear, and the detours you're taking right now? They're leading somewhere important.",
      "Be kinder to yourself. You're going to make mistakes — spectacular, embarrassing, heartbreaking ones. And you're going to survive all of them. More than survive — you're going to grow from them in ways you can't imagine yet.",
      "Read more. Sleep more. Say 'no' more often. Say 'I love you' more often. Call your grandparents. Take more photos of ordinary days — those are the ones you'll want to remember.",
      "The things that feel like the end of the world right now? They're not. They're the beginning of something better. Trust the process, even when it hurts.",
      "With love and hindsight,\nYour future self",
    ],
  },
  "books-changed-my-life": {
    title: "The Books That Changed My Life",
    date: "December 15, 2023",
    category: "Reading",
    readTime: "7 min read",
    imageUrl: postBooks,
    content: [
      "Some books stay with you long after you've turned the last page. They change the way you see the world, the way you think about yourself, and the way you move through your days.",
      "The first book that truly shook me was 'Man's Search for Meaning' by Viktor Frankl. I read it during a difficult period in my life, and it reframed everything. The idea that we can find meaning in any circumstance — even suffering — gave me a framework for resilience.",
      "'Bird by Bird' by Anne Lamott taught me how to be a writer. Not the craft of writing, exactly, but the courage of it. Her honesty about the messiness of the creative process made me feel less alone in my own struggles.",
      "More recently, 'Four Thousand Weeks' by Oliver Burkeman changed my relationship with time. Instead of trying to optimize every minute, I began to accept the beautiful limitation of a human life. We can't do everything, and that's not a failure — it's a freedom.",
      "Reading is the closest thing we have to telepathy. Through books, we can access the thoughts, experiences, and wisdom of people across centuries and continents. Every book you read adds a new lens through which to view the world.",
      "If you're looking for a place to start, pick up whatever calls to you. There's no wrong choice in reading. The right book finds you at the right time.",
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postData[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-display mb-4">Post not found</h1>
          <p className="text-body mb-8">The post you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary font-medium hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-caption text-sm hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4">
            <span className="blog-tag">{post.category}</span>
            <span className="text-sm text-caption">{post.date}</span>
            <span className="text-sm text-caption">·</span>
            <span className="text-sm text-caption">{post.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-display leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-divider">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="font-display text-lg text-display">S</span>
            </div>
            <div>
              <p className="text-sm font-medium text-display">Sarah Mitchell</p>
              <p className="text-xs text-caption">Writer & Creative</p>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-xl overflow-hidden mb-10">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-body text-lg leading-relaxed whitespace-pre-line"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share / back */}
          <div className="mt-12 pt-8 border-t border-divider flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
            >
              <ArrowLeft size={16} />
              Back to all posts
            </Link>

            <div className="flex items-center gap-2 text-caption text-sm">
              <span>Share this post</span>
              {["T", "I", "L"].map((letter) => (
                <a
                  key={letter}
                  href="#"
                  className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-caption hover:text-primary hover:bg-primary/10 transition-all text-xs font-bold"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
