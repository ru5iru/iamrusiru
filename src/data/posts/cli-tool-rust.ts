import postCliRust from "@/assets/post-cli-rust.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Building a CLI Tool in Rust: A Weekend Adventure",
  excerpt:
    "I spent a weekend building a file organiser in Rust. It was frustrating, enlightening, and oddly satisfying. Here's the full breakdown.",
  date: "January 28, 2026",
  category: "Side Projects",
  slug: "cli-tool-rust",
  readTime: "8 min read",
  imageUrl: postCliRust,
  tags: ["#opensource", "#devlife", "#backend"],
  content: [
    "I've been Rust-curious for a while. Every few months I'd read a blog post about memory safety or zero-cost abstractions and think, 'I should really learn this.' Last weekend, I finally did it: I built something small and useful, a CLI tool that organises messy download folders.",
    "## The Idea\n\nMy Downloads folder is a disaster. Screenshots mixed with PDFs mixed with random `.zip` files from months ago. I wanted a tool that would sort files into subdirectories by type (images, documents, archives, code) and optionally by date.",
    {
      type: "code",
      language: "rust",
      code: `use std::fs;
use std::path::Path;

fn categorize(extension: &str) -> &str {
    match extension {
        "jpg" | "png" | "gif" | "webp" | "svg" => "images",
        "pdf" | "doc" | "docx" | "txt" | "md" => "documents",
        "zip" | "tar" | "gz" | "rar" => "archives",
        "rs" | "ts" | "js" | "py" | "go" => "code",
        _ => "other",
    }
}

fn organize_directory(dir: &Path) -> std::io::Result<u32> {
    let mut count = 0;
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            let ext = path.extension()
                .and_then(|e| e.to_str())
                .unwrap_or("other");
            let category = categorize(ext);
            let target_dir = dir.join(category);
            fs::create_dir_all(&target_dir)?;
            fs::rename(&path, target_dir.join(entry.file_name()))?;
            count += 1;
        }
    }
    Ok(count)
}`,
    },
    "The Rust compiler is famously strict, and it lived up to its reputation. My first attempt had about fifteen errors, mostly around ownership and borrowing. But here's the thing: every single error message was *helpful*. The compiler didn't just tell me what was wrong; it told me *why* and often suggested a fix.",
    "## What I Learned\n\n**Pattern matching is incredible.** Coming from JavaScript's `switch` statements, Rust's `match` feels like a superpower. It's exhaustive by default: if you forget a case, the compiler tells you.\n\n**The ownership model makes sense once it clicks.** For the first hour, I was fighting the borrow checker. By the second hour, I started understanding *why* it was stopping me. By the end of the weekend, I was writing code that passed on the first try.",
    "**Error handling is elegant.** The `Result` type and `?` operator make error propagation clean and explicit. No more try-catch pyramids.\n\nI published the tool on GitHub and it's already gotten a few stars. More importantly, I learned something new and had fun doing it. That's what side projects are for.",
  ],
  faq: [
    { question: "Is Rust good for building CLI tools?", answer: "Yes, Rust is excellent for CLI tools. It compiles to fast native binaries, has a helpful compiler with clear error messages, excellent pattern matching, and elegant error handling with the Result type and ? operator. The Cargo package manager also makes publishing tools easy." },
    { question: "What is the Rust borrow checker?", answer: "The Rust borrow checker is the compiler's system for enforcing memory safety without garbage collection. It tracks ownership and borrowing of values to prevent data races and memory leaks. It can be frustrating initially but makes sense once you understand why it prevents bugs." },
  ],
};

export default post;
