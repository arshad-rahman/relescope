from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


ReleaseTarget = Literal[
    "all",
    "individual",
]


class ReleaseCommit(BaseModel):
    id: str = Field(
        ...,
        min_length=1,
    )

    message: str = Field(
        ...,
        min_length=1,
    )

    author: str = Field(
        ...,
        min_length=1,
    )

    author_email: str = ""
    date: str = ""


class ReleaseGenerateRequest(BaseModel):
    repository: str = Field(
        ...,
        min_length=1,
    )

    branch: str = Field(
        ...,
        min_length=1,
    )

    title: str = Field(
        ...,
        min_length=1,
    )

    version: str = ""

    environment: str = Field(
        ...,
        min_length=1,
    )

    generate_for: ReleaseTarget = "all"

    selected_author: str = ""

    commits: list[ReleaseCommit] = Field(
        ...,
        min_length=1,
        max_length=100,
    )


class AIReleaseItem(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
    )

    text: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    commit_ids: list[str] = Field(
        ...,
        min_length=1,
        max_length=100,
    )


class AIReleaseContent(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
    )

    summary: str = Field(
        ...,
        min_length=1,
        max_length=1500,
    )

    features: list[AIReleaseItem]
    fixes: list[AIReleaseItem]
    improvements: list[AIReleaseItem]
    documentation: list[AIReleaseItem]
    maintenance: list[AIReleaseItem]


class ReleaseNotesResponse(BaseModel):
    title: str
    summary: str

    features: list[str]
    fixes: list[str]
    improvements: list[str]
    documentation: list[str]
    maintenance: list[str]

    contributors: list[str]

    total_commits: int
