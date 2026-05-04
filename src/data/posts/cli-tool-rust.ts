import postCliRust from "@/assets/post-cli-rust.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Building a CLI Tool in Rust: A Weekend Adventure",
  excerpt:
    "Rust is an excellent language for building fast, reliable CLI tools. I spent a weekend building a file organizer in Rust and learned about ownership, pattern matching, and error handling along the way.",
  date: "January 28, 2026",
  category: "Side Projects",
  slug: "cli-tool-rust",
  readTime: "8 min read",
  imageUrl: postCliRust,
  tags: ["Rust", "CLI tools", "systems programming", "side projects", "open source"],
  seoKeywords: ["building CLI tools in Rust", "Rust CLI tutorial", "Rust for beginners", "Rust ownership", "clap crate", "Rust pattern matching", "Rust error handling", "systems programming with Rust", "weekend project Rust"],
  content: [
    "Rust is one of the best languages for building command-line tools. It compiles to fast native binaries, has a helpful compiler, and its ownership model guarantees memory safety without a garbage collector. I spent a weekend building a file organizer CLI in Rust, and this is what I learned.",

    "## The Idea\n\nMy Downloads folder was a disaster. Screenshots mixed with PDFs mixed with random `.zip` files from months ago. I wanted a tool that would sort files into subdirectories by type (images, documents, archives, code) and optionally by date.",
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
    "The Rust compiler is famously strict, and it lived up to its reputation. My first attempt had about fifteen errors, mostly around ownership and borrowing. But every single error message was *helpful*. The compiler did not just tell me what was wrong; it told me *why* and often suggested a fix.",

    "## What I Learned About Rust\n\n**Pattern matching is incredible.** Coming from JavaScript's `switch` statements, Rust's `match` feels like a superpower. It is exhaustive by default: if you forget a case, the compiler tells you.\n\n**The ownership model makes sense once it clicks.** For the first hour, I was fighting the borrow checker. By the second hour, I started understanding *why* it was stopping me. By the end of the weekend, I was writing code that passed on the first try.\n\n**Error handling is elegant.** The `Result` type and `?` operator make error propagation clean and explicit. No more try-catch pyramids.",

    "## Publishing and Sharing\n\nI published the tool on GitHub and it has already gotten a few stars. Cargo, Rust's package manager, makes publishing straightforward. More importantly, I learned something new and had fun doing it. That is what side projects are for.",

    "## Key Takeaways\n\n- Rust is an excellent choice for CLI tools due to fast native binaries and memory safety\n- The Rust compiler's error messages are unusually helpful and often suggest fixes\n- Pattern matching with `match` is exhaustive by default, catching missed cases at compile time\n- The ownership and borrowing model prevents memory bugs without a garbage collector\n- The `Result` type and `?` operator make error handling clean and explicit\n- Side projects are the best way to learn a new language because you have a concrete goal\n- Cargo makes publishing and sharing Rust tools simple",
  ],
  faq: [
    { question: "Is Rust good for building CLI tools?", answer: "Yes, Rust is excellent for CLI tools. It compiles to fast native binaries, has a helpful compiler with clear error messages, excellent pattern matching, and elegant error handling with the Result type and ? operator. The Cargo package manager also makes publishing tools easy." },
    { question: "What is the Rust borrow checker?", answer: "The Rust borrow checker is the compiler's system for enforcing memory safety without garbage collection. It tracks ownership and borrowing of values to prevent data races and memory leaks. It can be frustrating initially but makes sense once you understand why it prevents bugs." },
    { question: "How does Rust pattern matching work?", answer: "Rust's match expression compares a value against a series of patterns and executes code for the matching branch. Unlike switch statements in other languages, Rust match is exhaustive by default. The compiler will error if you miss a case, preventing bugs from unhandled scenarios." },
    { question: "What is the Result type in Rust?", answer: "The Result type in Rust represents either success (Ok) or failure (Err). Combined with the ? operator, it provides clean error propagation without try-catch blocks. If a function returns an error, the ? operator automatically returns it to the caller, making error handling explicit and readable." },
    { question: "How do I publish a Rust CLI tool?", answer: "Use Cargo, Rust's built-in package manager. Create your project with cargo init, build with cargo build --release, and publish to crates.io with cargo publish. You can also distribute the compiled binary directly since Rust produces standalone executables with no runtime dependencies." },
  ],
};

export default post;
