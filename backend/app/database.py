import os
from collections.abc import Generator
from pathlib import Path

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    DeclarativeBase,
    Session,
    sessionmaker,
)


BACKEND_DIRECTORY = (
    Path(__file__).resolve().parent.parent
)

load_dotenv(
    BACKEND_DIRECTORY / ".env",
)

DATA_DIRECTORY = (
    BACKEND_DIRECTORY / "data"
)

DATA_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True,
)

DATABASE_PATH = (
    DATA_DIRECTORY / "relescope.db"
)

DEFAULT_DATABASE_URL = (
    f"sqlite:///{DATABASE_PATH.as_posix()}"
)


def resolve_database_url() -> str:
    configured_url = os.getenv(
        "DATABASE_URL",
        "",
    ).strip()

    if not configured_url:
        return DEFAULT_DATABASE_URL

    sqlite_prefix = "sqlite:///"

    if not configured_url.startswith(
        sqlite_prefix
    ):
        return configured_url

    sqlite_location = configured_url[
        len(sqlite_prefix):
    ]

    if sqlite_location in {
        "",
        ":memory:",
    }:
        return configured_url

    sqlite_path = Path(
        sqlite_location
    )

    if sqlite_path.is_absolute():
        return configured_url

    resolved_path = (
        BACKEND_DIRECTORY
        / sqlite_path
    ).resolve()

    resolved_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    return (
        f"sqlite:///"
        f"{resolved_path.as_posix()}"
    )


DATABASE_URL = resolve_database_url()


class Base(DeclarativeBase):
    pass


engine_options: dict[str, object] = {
    "pool_pre_ping": True,
}

if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {
        "check_same_thread": False,
    }


engine = create_engine(
    DATABASE_URL,
    **engine_options,
)


SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[
    Session,
    None,
    None,
]:
    database = SessionLocal()

    try:
        yield database
    finally:
        database.close()
