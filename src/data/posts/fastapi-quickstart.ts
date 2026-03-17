import postFastapi from "@/assets/post-fastapi.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Setting Up a Python FastAPI Backend in 15 Minutes",
  excerpt:
    "A quick-start guide to spinning up a REST API with FastAPI, complete with validation, docs, and database integration.",
  date: "December 22, 2025",
  category: "Tutorials",
  slug: "fastapi-quickstart",
  readTime: "5 min read",
  imageUrl: featuredImage,
  tags: ["#python", "#backend", "#codebits"],
  content: [
    "FastAPI has become my go-to for spinning up backends quickly. It's fast (obviously), has automatic OpenAPI docs, and the developer experience is excellent. Here's a 15-minute quickstart.",
    "## Install & Scaffold\n\nCreate a virtual environment and install FastAPI with uvicorn:",
    {
      type: "code",
      language: "bash",
      code: `python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn[standard] sqlmodel`,
    },
    "## Your First Endpoint\n\nCreate `main.py`:",
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
    "Run it with `uvicorn main:app --reload` and visit `http://localhost:8000/docs`. You'll see auto-generated Swagger documentation for every endpoint — including request/response schemas derived from your Pydantic models.",
    "## Adding a Database\n\nSQLModel (by the same creator as FastAPI) bridges SQLAlchemy and Pydantic beautifully:",
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
    "That's it. In 15 minutes you have a validated, documented, database-backed REST API. FastAPI handles serialisation, validation, error responses, and documentation automatically. For quick prototypes or microservices, it's hard to beat.",
  ],
};

export default post;
