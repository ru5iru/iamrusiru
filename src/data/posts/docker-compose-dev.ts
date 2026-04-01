import postDocker from "@/assets/post-docker.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Docker Compose for Local Development",
  excerpt:
    "Stop telling new hires to install Postgres, Redis, and Elasticsearch manually. A single docker-compose.yml can spin up your entire stack.",
  date: "October 20, 2025",
  category: "Tutorials",
  slug: "docker-compose-dev",
  readTime: "7 min read",
  imageUrl: postDocker,
  tags: ["#backend", "#codebits", "#devlife"],
  content: [
    "Every project I join has the same onboarding problem: a README with 47 steps to set up the local environment. Docker Compose reduces that to one command.",
    "## The Setup\n\nHere's a real-world compose file for a typical web app:",
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
    "## Tips I've Learned\n\n- **Use `depends_on` with health checks** so your app doesn't crash trying to connect before the database is ready.\n- **Mount source code as a volume** for hot-reloading during development.\n- **Exclude `node_modules`** from the mount to avoid platform-specific binary issues.\n- **Use named volumes** for database data so it persists between restarts.",
  ],
  faq: [
    { question: "What is Docker Compose used for in development?", answer: "Docker Compose lets you define your entire development stack (database, cache, app server) in a single YAML file. Running docker compose up starts everything, reducing new developer onboarding from half a day to five minutes." },
    { question: "How do I set up Docker Compose for a web app?", answer: "Create a docker-compose.yml defining services like PostgreSQL, Redis, and your app. Use environment variables for configuration, depends_on with health checks for service ordering, volume mounts for hot-reloading, and named volumes for persistent data." },
  ],
};

export default post;
