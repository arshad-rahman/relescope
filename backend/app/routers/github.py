from fastapi import APIRouter, HTTPException

from app.schemas.github import (
    GitHubBranch,
    GitHubBranchesRequest,
    GitHubBranchesResponse,
    GitHubCommit,
    GitHubCommitsRequest,
    GitHubCommitsResponse,
    GitHubConnectRequest,
    GitHubConnectResponse,
    GitHubRepositoriesResponse,
    GitHubRepository,
)
from app.services.github_service import (
    get_authenticated_user,
    list_branches,
    list_commits,
    list_repositories,
)

router = APIRouter()


def _raise_http_error(error: Exception) -> None:
    if isinstance(error, PermissionError):
        raise HTTPException(
            status_code=403,
            detail=str(error),
        ) from error

    if isinstance(error, FileNotFoundError):
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error

    if isinstance(error, ValueError):
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    if isinstance(error, RuntimeError):
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error

    raise HTTPException(
        status_code=500,
        detail="Unexpected server error",
    ) from error


@router.post(
    "/connect",
    response_model=GitHubConnectResponse,
)
async def connect_github(
    payload: GitHubConnectRequest,
) -> GitHubConnectResponse:
    try:
        user = await get_authenticated_user(payload.token)

        login = user.get("login")

        if not isinstance(login, str) or not login:
            raise RuntimeError(
                "GitHub did not return a valid username"
            )

        return GitHubConnectResponse(
            valid=True,
            login=login,
            name=user.get("name"),
            avatar_url=user.get("avatar_url"),
            html_url=user.get("html_url"),
            email=user.get("email"),
            public_repos=user.get("public_repos"),
            message="GitHub PAT validated successfully",
        )

    except Exception as error:
        _raise_http_error(error)

    raise HTTPException(
        status_code=500,
        detail="Unexpected connection error",
    )


@router.post(
    "/repositories",
    response_model=GitHubRepositoriesResponse,
)
async def github_repositories(
    payload: GitHubConnectRequest,
) -> GitHubRepositoriesResponse:
    try:
        repositories_data = await list_repositories(
            payload.token
        )

        repositories = [
            GitHubRepository(
                id=repo["id"],
                name=repo["name"],
                full_name=repo["full_name"],
                owner=repo["owner"]["login"],
                private=repo["private"],
                default_branch=repo["default_branch"],
            )
            for repo in repositories_data
        ]

        return GitHubRepositoriesResponse(
            repositories=repositories
        )

    except Exception as error:
        _raise_http_error(error)

    raise HTTPException(
        status_code=500,
        detail="Unexpected repository error",
    )


@router.post(
    "/branches",
    response_model=GitHubBranchesResponse,
)
async def github_branches(
    payload: GitHubBranchesRequest,
) -> GitHubBranchesResponse:
    try:
        branches_data = await list_branches(
            owner=payload.owner,
            repo=payload.repo,
            token=payload.token,
        )

        branches = [
            GitHubBranch(name=branch["name"])
            for branch in branches_data
        ]

        return GitHubBranchesResponse(
            branches=branches
        )

    except Exception as error:
        _raise_http_error(error)

    raise HTTPException(
        status_code=500,
        detail="Unexpected branch error",
    )


@router.post(
    "/commits",
    response_model=GitHubCommitsResponse,
)
async def github_commits(
    payload: GitHubCommitsRequest,
) -> GitHubCommitsResponse:
    try:
        commits_data = await list_commits(
            owner=payload.owner,
            repo=payload.repo,
            branch=payload.branch,
            token=payload.token,
            per_page=payload.per_page,
        )

        commits: list[GitHubCommit] = []

        for item in commits_data:
            commit_data = item.get("commit") or {}
            commit_author = commit_data.get("author") or {}
            commit_committer = (
                commit_data.get("committer") or {}
            )
            github_author = item.get("author") or {}

            author_name = (
                commit_author.get("name")
                or github_author.get("login")
                or "Unknown author"
            )

            author_email = (
                commit_author.get("email")
                or ""
            )

            commit_date = (
                commit_author.get("date")
                or commit_committer.get("date")
                or ""
            )

            commits.append(
                GitHubCommit(
                    id=item.get("sha", ""),
                    message=commit_data.get(
                        "message",
                        "Untitled commit",
                    ),
                    author=author_name,
                    author_email=author_email,
                    date=commit_date,
                )
            )

        return GitHubCommitsResponse(
            commits=commits
        )

    except Exception as error:
        _raise_http_error(error)

    raise HTTPException(
        status_code=500,
        detail="Unexpected commit error",
    )
