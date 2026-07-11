from app.schemas.release import (
    AIReleaseItem,
    ReleaseCommit,
    ReleaseGenerateRequest,
    ReleaseNotesResponse,
)

from app.services.ai_release_service import (
    generate_ai_release_content,
)


def _select_commits(
    payload: ReleaseGenerateRequest,
) -> list[ReleaseCommit]:
    commits = list(payload.commits)

    if payload.generate_for == "individual":
        selected_author = (
            payload.selected_author.strip()
        )

        if not selected_author:
            raise ValueError(
                "selected_author is required when "
                "generate_for is individual"
            )

        commits = [
            commit
            for commit in commits
            if commit.author == selected_author
        ]

    if not commits:
        raise ValueError(
            "No commits are available for release generation"
        )

    commit_ids = [
        commit.id
        for commit in commits
    ]

    if len(commit_ids) != len(set(commit_ids)):
        raise ValueError(
            "The request contains duplicate commit IDs"
        )

    return commits


def _unique_strings(
    values: list[str],
) -> list[str]:
    unique_values: list[str] = []
    seen: set[str] = set()

    for value in values:
        cleaned_value = " ".join(
            value.split()
        ).strip()

        if (
            cleaned_value
            and cleaned_value not in seen
        ):
            seen.add(cleaned_value)
            unique_values.append(
                cleaned_value
            )

    return unique_values


def _release_item_texts(
    items: list[AIReleaseItem],
) -> list[str]:
    return _unique_strings(
        [
            item.text
            for item in items
        ]
    )


def _build_release_title(
    payload: ReleaseGenerateRequest,
) -> str:
    title = payload.title.strip()
    version = payload.version.strip()

    if version:
        return f"{title} {version}"

    return title


def _build_summary(
    ai_summary: str,
    payload: ReleaseGenerateRequest,
) -> str:
    cleaned_summary = " ".join(
        ai_summary.split()
    ).strip()

    metadata = (
        f"Repository: {payload.repository}. "
        f"Branch: {payload.branch}. "
        f"Environment: {payload.environment}."
    )

    if not cleaned_summary:
        return metadata

    return (
        f"{cleaned_summary} "
        f"{metadata}"
    )


async def generate_release_notes(
    payload: ReleaseGenerateRequest,
) -> ReleaseNotesResponse:
    commits = _select_commits(payload)

    ai_content = (
        await generate_ai_release_content(
            payload,
            commits,
        )
    )

    contributors = _unique_strings(
        [
            commit.author
            for commit in commits
        ]
    )

    return ReleaseNotesResponse(
        title=_build_release_title(
            payload
        ),
        summary=_build_summary(
            ai_content.summary,
            payload,
        ),
        features=_release_item_texts(
            ai_content.features
        ),
        fixes=_release_item_texts(
            ai_content.fixes
        ),
        improvements=_release_item_texts(
            ai_content.improvements
        ),
        documentation=_release_item_texts(
            ai_content.documentation
        ),
        maintenance=_release_item_texts(
            ai_content.maintenance
        ),
        contributors=contributors,
        total_commits=len(commits),
    )
