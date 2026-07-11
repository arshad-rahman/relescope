from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.github import router as github_router
from app.routers.release import router as release_router
from app.routers.repository import (
    router as repository_router,
)


app = FastAPI(
    title="ReleasePilot API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    repository_router,
    prefix="/api/repository",
    tags=["Repository"],
)

app.include_router(
    github_router,
    prefix="/api/github",
    tags=["GitHub"],
)

app.include_router(
    release_router,
    prefix="/api/releases",
    tags=["Releases"],
)


@app.get("/")
def root():
    return {
        "message": "ReleasePilot backend is running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
