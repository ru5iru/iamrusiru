import postDocker from "@/assets/post-docker.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Docker Compose for Local Development",
  excerpt:
    "Docker Compose lets you define your entire development stack in a single YAML file. One command replaces dozens of manual setup steps, reducing new developer onboarding from half a day to five minutes.",
  date: "October 20, 2025",
  category: "Tutorials",
  slug: "docker-compose-dev",
  readTime: "7 min read",
  imageUrl: postDocker,
  tags: ["Docker", "Docker Compose", "local development", "DevOps", "developer onboarding"],
  seoKeywords: [
    "Docker Compose for local development",
    "Docker Compose tutorial",
    "local dev environment with Docker",
    "docker-compose.yml example",
    "developer onboarding with Docker",
    "containerized development environment",
    "Docker for developers",
    "multi-container development",
    "Docker Compose vs Docker run",
    "reproducible dev environments",
    "local Postgres with Docker Compose",
  ],
  content: [
    "Docker Compose simplifies local development by defining your entire stack - database, cache, application server - in a single YAML file. Instead of a README with 47 manual setup steps, new developers run one command and have a working environment in minutes.",

    "## The Setup\n\nHere is a real-world compose file for a typical web application with PostgreSQL, Redis, and a Node.js app:",
    {
      type: "code",
      language: "yaml",
      code: `version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpass
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  app:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      - db
      - redis
    environment:
      DATABASE_URL: postgres://dev:devpass@db:5432/myapp
      REDIS_URL: redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  pgdata:`,
    },
    "Run `docker compose up` and everything starts. Run `docker compose down -v` to tear it all down cleanly. New developer onboarding goes from half a day to five minutes.",

    "## Best Practices for Docker Compose in Development\n\n- **Use `depends_on` with health checks** so your app does not crash trying to connect before the database is ready\n- **Mount source code as a volume** for hot-reloading during development\n- **Exclude `node_modules`** from the mount to avoid platform-specific binary issues\n- **Use named volumes** for database data so it persists between restarts\n- **Keep development and production configurations separate** using override files",

    "## Key Takeaways\n\n- Docker Compose reduces local environment setup from dozens of steps to a single command\n- Define all services (database, cache, app) in one docker-compose.yml file\n- Volume mounts enable hot-reloading for fast development iteration\n- Named volumes persist database data between container restarts\n- Health checks prevent application crashes during service startup\n- New developer onboarding becomes nearly instant with a properly configured compose file\n- Keep development compose files separate from production configurations",
  ],
  faq: [
    { question: "What is Docker Compose used for in development?", answer: "Docker Compose lets you define your entire development stack (database, cache, app server) in a single YAML file. Running docker compose up starts everything, reducing new developer onboarding from half a day to five minutes." },
    { question: "How do I set up Docker Compose for a web app?", answer: "Create a docker-compose.yml defining services like PostgreSQL, Redis, and your app. Use environment variables for configuration, depends_on with health checks for service ordering, volume mounts for hot-reloading, and named volumes for persistent data." },
    { question: "How do I persist database data in Docker Compose?", answer: "Use named volumes in your docker-compose.yml. Define a volume (like pgdata) and mount it to the database's data directory. Named volumes persist between container restarts and are only removed when you explicitly run docker compose down -v." },
    { question: "Why should I exclude node_modules from Docker volume mounts?", answer: "Mounting the entire project directory including node_modules can cause issues with platform-specific binaries. Native modules compiled for your host OS may not work inside the container. Excluding node_modules with a separate anonymous volume forces the container to use its own installed packages." },
    { question: "How does Docker Compose improve developer onboarding?", answer: "Instead of following a long README with manual installation steps for each service (PostgreSQL, Redis, Elasticsearch), new developers clone the repository and run docker compose up. The entire environment starts automatically with correct configuration, reducing setup time from hours to minutes." },
  ],
};

export default post;
