import postFastapi from "@/assets/post-fastapi.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Setting Up a Python FastAPI Backend in 15 Minutes",
  excerpt:
    "FastAPI is a modern Python framework for building REST APIs with automatic validation, OpenAPI documentation, and database integration. This quickstart guide gets you from zero to a working API in 15 minutes.",
  date: "December 22, 2025",
  category: "Tutorials",
  slug: "fastapi-quickstart",
  readTime: "5 min read",
  imageUrl: postFastapi,
  tags: ["FastAPI", "Python", "REST API", "backend development", "web framework"],
  seoKeywords: [
    "FastAPI quickstart",
    "Python FastAPI tutorial",
    "FastAPI backend setup",
    "building REST API with FastAPI",
    "FastAPI vs Flask",
    "async Python API",
    "Pydantic validation",
    "FastAPI for beginners",
    "FastAPI project structure",
    "FastAPI OpenAPI docs",
    "Python REST API framework",
  ],
  content: [
    "FastAPI is a modern Python web framework for building REST APIs quickly and reliably. It provides automatic OpenAPI documentation, request validation via Pydantic models, and async support out of the box. Here is a complete quickstart to get a validated, documented API running in 15 minutes.",

    "## Install and Scaffold\n\nCreate a virtual environment and install FastAPI with uvicorn:",
    {
      type: "code",
      language: "bash",
      code: `python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn[standard] sqlmodel`,
    },
    "## Your First Endpoint\n\nCreate `main.py` with a basic CRUD structure:",
    {
      type: "code",
      language: "python",
      code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    in_stock: bool = True

items: list[Item] = []

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/items")
def list_items():
    return items

@app.post("/items", status_code=201)
def create_item(item: Item):
    items.append(item)
    return item`,
    },
    "Run it with `uvicorn main:app --reload` and visit `http://localhost:8000/docs`. You will see auto-generated Swagger documentation for every endpoint, including request and response schemas derived from your Pydantic models.",

    "## Adding a Database With SQLModel\n\nSQLModel (by the same creator as FastAPI) bridges SQLAlchemy and Pydantic, letting you define database models that also serve as API schemas:",
    {
      type: "code",
      language: "python",
      code: `from sqlmodel import SQLModel, Field, Session, create_engine, select

class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    price: float
    in_stock: bool = True

engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)

@app.post("/items", status_code=201)
def create_item(item: Item):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
        return item`,
    },
    "In 15 minutes you have a validated, documented, database-backed REST API. FastAPI handles serialization, validation, error responses, and documentation automatically. For quick prototypes or microservices, it is hard to beat.",

    "## Key Takeaways\n\n- FastAPI provides automatic OpenAPI documentation from your Python type hints\n- Pydantic models handle request validation and serialization with zero extra code\n- SQLModel bridges SQLAlchemy and Pydantic for clean database integration\n- The uvicorn server supports hot-reloading for fast development iteration\n- FastAPI supports async endpoints for high-concurrency workloads\n- Auto-generated Swagger UI lets you test endpoints directly in the browser\n- The framework is one of the fastest Python web frameworks available",
  ],
  faq: [
    { question: "What is FastAPI?", answer: "FastAPI is a modern Python web framework for building REST APIs. It features automatic OpenAPI documentation, request validation via Pydantic models, async support, and excellent developer experience. It is one of the fastest Python frameworks available." },
    { question: "How do I get started with FastAPI?", answer: "Create a virtual environment, install FastAPI and uvicorn with pip, create a main.py file with your endpoints and Pydantic models, then run uvicorn main:app --reload. Visit /docs to see auto-generated Swagger documentation." },
    { question: "Can FastAPI connect to a database?", answer: "Yes. SQLModel (by the same creator) bridges SQLAlchemy and Pydantic, letting you define database models that also serve as API schemas. It supports SQLite, PostgreSQL, MySQL, and other databases through SQLAlchemy." },
    { question: "How does FastAPI handle request validation?", answer: "FastAPI uses Pydantic models to validate incoming requests automatically. Define your data model as a Pydantic class with type annotations, and FastAPI validates request bodies, returns clear error messages for invalid data, and generates schema documentation automatically." },
    { question: "Is FastAPI suitable for production applications?", answer: "Yes. FastAPI is used in production by companies like Microsoft, Netflix, and Uber. It supports async operations for high concurrency, integrates with production databases through SQLAlchemy, and provides built-in security utilities for authentication and authorization." },
  ],
};

export default post;
