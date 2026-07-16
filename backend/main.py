import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.github import router as github_router
from app.routers.release import router as release_router
from app.routers.saved_release import (
    router as saved_release_router,
)
from app.routers.repository import (
    router as repository_router,
)


DEFAULT_CORS_ORIGINS = (
    "http://localhost:5173",
    "http://localhost:8080",
)


def get_cors_origins() -> list[str]:
    configured_origins = os.getenv(
        "CORS_ORIGINS",
        "",
    )

    if not configured_origins.strip():
        return list(
            DEFAULT_CORS_ORIGINS,
        )

    return [
        origin.strip()
        for origin
        in configured_origins.split(",")
        if origin.strip()
    ]


app = FastAPI(
    title="Relescope API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
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

app.include_router(
    saved_release_router,
    prefix="/api/saved-releases",
    tags=["Saved Releases"],
)


@app.get("/")
def root():
    return {
        "message": "Relescope backend is running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
