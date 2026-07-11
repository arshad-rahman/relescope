from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


ExperienceMode = Literal[
    "lite",
    "advanced",
]

SelectionMode = Literal[
    "automatic",
    "manual",
]

ReleaseStatus = Literal[
    "draft",
    "final",
    "published",
]

ReleaseTarget = Literal[
    "all",
    "individual",
]


class SavedReleaseCommit(BaseModel):
    id: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )

    author: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    author_email: str = Field(
        default="",
        max_length=320,
    )

    date: str = Field(
        default="",
        max_length=100,
    )


class SavedReleaseBase(BaseModel):
    experience_mode: ExperienceMode

    selection_mode: SelectionMode

    status: ReleaseStatus = "draft"

    repository: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    branch: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    version: str = Field(
        default="",
        max_length=64,
    )

    environment: str = Field(
        default="Development",
        min_length=1,
        max_length=32,
    )

    generate_for: ReleaseTarget = "all"

    selected_author: str = Field(
        default="",
        max_length=255,
    )

    release_range: str | None = Field(
        default=None,
        max_length=32,
    )

    date_from: datetime | None = None
    date_to: datetime | None = None

    summary: str = Field(
        default="",
        max_length=10000,
    )

    features: list[str] = Field(
        default_factory=list,
    )

    fixes: list[str] = Field(
        default_factory=list,
    )

    improvements: list[str] = Field(
        default_factory=list,
    )

    documentation: list[str] = Field(
        default_factory=list,
    )

    maintenance: list[str] = Field(
        default_factory=list,
    )

    contributors: list[str] = Field(
        default_factory=list,
    )

    selected_commit_ids: list[str] = Field(
        default_factory=list,
    )

    selected_commits: list[
        SavedReleaseCommit
    ] = Field(
        default_factory=list,
        max_length=100,
    )

    total_commits: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    @model_validator(
        mode="after",
    )
    def validate_release_dates(
        self,
    ) -> "SavedReleaseBase":
        if (
            self.date_from is not None
            and self.date_to is not None
            and self.date_from > self.date_to
        ):
            raise ValueError(
                "date_from cannot be later "
                "than date_to"
            )

        if (
            self.generate_for == "individual"
            and not self.selected_author.strip()
        ):
            raise ValueError(
                "selected_author is required "
                "for individual releases"
            )

        return self


class SavedReleaseCreate(
    SavedReleaseBase,
):
    owner_login: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )


class SavedReleaseUpdate(BaseModel):
    experience_mode: (
        ExperienceMode | None
    ) = None

    selection_mode: (
        SelectionMode | None
    ) = None

    status: ReleaseStatus | None = None

    repository: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    branch: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    version: str | None = Field(
        default=None,
        max_length=64,
    )

    environment: str | None = Field(
        default=None,
        min_length=1,
        max_length=32,
    )

    generate_for: (
        ReleaseTarget | None
    ) = None

    selected_author: str | None = Field(
        default=None,
        max_length=255,
    )

    release_range: str | None = Field(
        default=None,
        max_length=32,
    )

    date_from: datetime | None = None
    date_to: datetime | None = None

    summary: str | None = Field(
        default=None,
        max_length=10000,
    )

    features: list[str] | None = None
    fixes: list[str] | None = None

    improvements: list[str] | None = None

    documentation: list[str] | None = None

    maintenance: list[str] | None = None

    contributors: list[str] | None = None

    selected_commit_ids: (
        list[str] | None
    ) = None

    selected_commits: (
        list[SavedReleaseCommit] | None
    ) = Field(
        default=None,
        max_length=100,
    )

    total_commits: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )


class SavedReleaseResponse(
    SavedReleaseBase,
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    owner_login: str

    created_at: datetime
    updated_at: datetime


class SavedReleaseListResponse(
    BaseModel,
):
    items: list[SavedReleaseResponse]

    total: int
    limit: int
    offset: int
