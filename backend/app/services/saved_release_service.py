from typing import Any

from sqlalchemy import (
    func,
    select,
)

from sqlalchemy.exc import (
    SQLAlchemyError,
)

from pydantic import ValidationError

from sqlalchemy.orm import Session

from app.models.saved_release import (
    SavedRelease,
)

from app.schemas.saved_release import (
    ExperienceMode,
    ReleaseStatus,
    SavedReleaseBase,
    SavedReleaseCreate,
    SavedReleaseUpdate,
)


NON_NULLABLE_UPDATE_FIELDS = {
    "experience_mode",
    "selection_mode",
    "status",
    "repository",
    "branch",
    "title",
    "version",
    "environment",
    "generate_for",
    "selected_author",
    "summary",
    "features",
    "fixes",
    "improvements",
    "documentation",
    "maintenance",
    "contributors",
    "selected_commit_ids",
    "selected_commits",
    "total_commits",
}


SAVED_RELEASE_DATA_FIELDS = (
    "experience_mode",
    "selection_mode",
    "status",
    "repository",
    "branch",
    "title",
    "version",
    "environment",
    "generate_for",
    "selected_author",
    "release_range",
    "date_from",
    "date_to",
    "summary",
    "features",
    "fixes",
    "improvements",
    "documentation",
    "maintenance",
    "contributors",
    "selected_commit_ids",
    "selected_commits",
    "total_commits",
)


def _normalize_commit_data(
    values: dict[str, Any],
) -> dict[str, Any]:
    selected_commits = values.get(
        "selected_commits"
    )

    selected_commit_ids = values.get(
        "selected_commit_ids"
    )

    if selected_commits is not None:
        commit_ids = [
            commit["id"]
            for commit in selected_commits
        ]

        if len(commit_ids) != len(
            set(commit_ids)
        ):
            raise ValueError(
                "Selected commits contain "
                "duplicate commit IDs"
            )

        values["selected_commit_ids"] = (
            commit_ids
        )

        values["total_commits"] = len(
            commit_ids
        )

    elif selected_commit_ids is not None:
        if len(selected_commit_ids) != len(
            set(selected_commit_ids)
        ):
            raise ValueError(
                "Selected commit IDs contain "
                "duplicates"
            )

        if "total_commits" not in values:
            values["total_commits"] = len(
                selected_commit_ids
            )

    return values


def create_saved_release(
    database: Session,
    payload: SavedReleaseCreate,
) -> SavedRelease:
    values = payload.model_dump()

    values = _normalize_commit_data(
        values
    )

    saved_release = SavedRelease(
        **values,
    )

    try:
        database.add(saved_release)
        database.commit()
        database.refresh(saved_release)

        return saved_release
    except SQLAlchemyError:
        database.rollback()
        raise


def list_saved_releases(
    database: Session,
    owner_login: str,
    *,
    status: ReleaseStatus | None,
    experience_mode: (
        ExperienceMode | None
    ),
    repository: str | None,
    limit: int,
    offset: int,
) -> tuple[list[SavedRelease], int]:
    conditions = [
        SavedRelease.owner_login
        == owner_login
    ]

    if status is not None:
        conditions.append(
            SavedRelease.status == status
        )

    if experience_mode is not None:
        conditions.append(
            SavedRelease.experience_mode
            == experience_mode
        )

    if repository:
        conditions.append(
            SavedRelease.repository
            == repository
        )

    total_statement = (
        select(
            func.count(SavedRelease.id)
        )
        .where(*conditions)
    )

    total = database.execute(
        total_statement
    ).scalar_one()

    statement = (
        select(SavedRelease)
        .where(*conditions)
        .order_by(
            SavedRelease.updated_at.desc(),
            SavedRelease.id.desc(),
        )
        .limit(limit)
        .offset(offset)
    )

    items = list(
        database.execute(
            statement
        ).scalars()
    )

    return items, total


def get_saved_release(
    database: Session,
    release_id: int,
    owner_login: str,
) -> SavedRelease | None:
    statement = select(
        SavedRelease
    ).where(
        SavedRelease.id == release_id,
        SavedRelease.owner_login
        == owner_login,
    )

    return database.execute(
        statement
    ).scalar_one_or_none()


def update_saved_release(
    database: Session,
    saved_release: SavedRelease,
    payload: SavedReleaseUpdate,
) -> SavedRelease:
    changes = payload.model_dump(
        exclude_unset=True,
    )

    if not changes:
        raise ValueError(
            "No release fields were provided"
        )

    for field_name, value in changes.items():
        if (
            field_name
            in NON_NULLABLE_UPDATE_FIELDS
            and value is None
        ):
            raise ValueError(
                f"{field_name} cannot be null"
            )

    changes = _normalize_commit_data(
        changes
    )

    candidate_values = {
        field_name: getattr(
            saved_release,
            field_name,
        )
        for field_name
        in SAVED_RELEASE_DATA_FIELDS
    }

    candidate_values.update(changes)

    try:
        validated_candidate = (
            SavedReleaseBase.model_validate(
                candidate_values
            )
        )
    except ValidationError as error:
        first_error = error.errors()[0]

        raise ValueError(
            first_error.get(
                "msg",
                "Invalid saved-release update",
            )
        ) from error

    validated_values = (
        validated_candidate.model_dump()
    )

    for field_name in changes:
        setattr(
            saved_release,
            field_name,
            validated_values[field_name],
        )

    try:
        database.add(saved_release)
        database.commit()
        database.refresh(saved_release)

        return saved_release
    except SQLAlchemyError:
        database.rollback()
        raise


def delete_saved_release(
    database: Session,
    saved_release: SavedRelease,
) -> None:
    try:
        database.delete(saved_release)
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
