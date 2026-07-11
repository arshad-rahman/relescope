from datetime import datetime
from typing import Any

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Index,
    Integer,
    JSON,
    String,
    Text,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database import Base


class SavedRelease(Base):
    __tablename__ = "saved_releases"

    __table_args__ = (
        CheckConstraint(
            "experience_mode IN "
            "('lite', 'advanced')",
            name=(
                "ck_saved_releases_"
                "experience_mode"
            ),
        ),
        CheckConstraint(
            "selection_mode IN "
            "('automatic', 'manual')",
            name=(
                "ck_saved_releases_"
                "selection_mode"
            ),
        ),
        CheckConstraint(
            "status IN "
            "('draft', 'final', 'published')",
            name=(
                "ck_saved_releases_status"
            ),
        ),
        CheckConstraint(
            "generate_for IN "
            "('all', 'individual')",
            name=(
                "ck_saved_releases_"
                "generate_for"
            ),
        ),
        Index(
            "ix_saved_releases_"
            "owner_updated",
            "owner_login",
            "updated_at",
        ),
        Index(
            "ix_saved_releases_"
            "repository_updated",
            "repository",
            "updated_at",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    owner_login: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    experience_mode: Mapped[str] = (
        mapped_column(
            String(16),
            nullable=False,
            index=True,
        )
    )

    selection_mode: Mapped[str] = (
        mapped_column(
            String(16),
            nullable=False,
        )
    )

    status: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default="draft",
        index=True,
    )

    repository: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    branch: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    version: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        default="",
    )

    environment: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="Development",
    )

    generate_for: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default="all",
    )

    selected_author: Mapped[str] = (
        mapped_column(
            String(255),
            nullable=False,
            default="",
        )
    )

    release_range: Mapped[
        str | None
    ] = mapped_column(
        String(32),
        nullable=True,
    )

    date_from: Mapped[
        datetime | None
    ] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    date_to: Mapped[
        datetime | None
    ] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    features: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    fixes: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    improvements: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    documentation: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    maintenance: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    contributors: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    selected_commit_ids: Mapped[
        list[str]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    selected_commits: Mapped[
        list[dict[str, Any]]
    ] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    total_commits: Mapped[int] = (
        mapped_column(
            Integer,
            nullable=False,
            default=0,
        )
    )

    created_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
