import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import auth, applications, emails, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Intelligent Job Application Tracker API", version="0.1.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(emails.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}
