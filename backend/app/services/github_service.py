import re
from typing import Any

import httpx

GITHUB_API_BASE = "https://api.github.com"

GITHUB_REPO_PATTERN = re.compile(
    r"^https?://github\.com/"
    r"(?P<owner>[^/]+)/"
    r"(?P<repo>[^/]+?)"
    r"(?:\.git)?/?$"
)


def parse_github_repo_url(url: str) -> tuple[str, str]:
    match = GITHUB_REPO_PATTERN.match(url.strip())

    if not match:
        raise ValueError("Invalid GitHub repository URL")

    return match.group("owner"), match.group("repo")


def _github_headers(token: str) -> dict[str, str]:
    return {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ReleasePilot",
    }


def _github_error_message(response: httpx.Response) -> str:
    try:
        payload = response.json()
    except ValueError:
        return "GitHub returned an unexpected response"

    message = payload.get("message")

    if isinstance(message, str) and message:
        return message

    return "GitHub returned an unexpected response"


def _raise_github_error(
    response: httpx.Response,
    not_found_message: str,
) -> None:
    if response.status_code == 401:
        raise PermissionError("GitHub token is invalid or expired")

    if response.status_code == 403:
        message = _github_error_message(response)

        raise PermissionError(
            f"GitHub denied access: {message}"
        )

    if response.status_code == 404:
        raise FileNotFoundError(not_found_message)

    raise RuntimeError(
        "GitHub API request failed with status "
        f"{response.status_code}: "
        f"{_github_error_message(response)}"
    )


async def validate_github_repo(
    owner: str,
    repo: str,
    token: str,
) -> dict[str, Any]:
    api_url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(
            api_url,
            headers=_github_headers(token),
        )

    if response.status_code == 200:
        return response.json()

    _raise_github_error(
        response,
        "Repository not found or access denied",
    )

    raise RuntimeError("Unexpected GitHub repository response")


async def get_authenticated_user(
    token: str,
) -> dict[str, Any]:
    api_url = f"{GITHUB_API_BASE}/user"

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(
            api_url,
            headers=_github_headers(token),
        )

    if response.status_code == 200:
        return response.json()

    _raise_github_error(
        response,
        "GitHub user was not found",
    )

    raise RuntimeError("Unexpected GitHub user response")


async def list_repositories(
    token: str,
) -> list[dict[str, Any]]:
    repositories: list[dict[str, Any]] = []
    page = 1

    async with httpx.AsyncClient(timeout=30) as client:
        while True:
            response = await client.get(
                f"{GITHUB_API_BASE}/user/repos",
                headers=_github_headers(token),
                params={
                    "affiliation": (
                        "owner,collaborator,"
                        "organization_member"
                    ),
                    "visibility": "all",
                    "sort": "updated",
                    "direction": "desc",
                    "per_page": 100,
                    "page": page,
                },
            )

            if response.status_code != 200:
                _raise_github_error(
                    response,
                    "No accessible GitHub repositories were found",
                )

            page_items = response.json()

            if not isinstance(page_items, list):
                raise RuntimeError(
                    "GitHub returned an invalid repository list"
                )

            repositories.extend(page_items)

            if len(page_items) < 100:
                break

            page += 1

    return repositories


async def list_branches(
    owner: str,
    repo: str,
    token: str,
) -> list[dict[str, Any]]:
    branches: list[dict[str, Any]] = []
    page = 1

    async with httpx.AsyncClient(timeout=30) as client:
        while True:
            response = await client.get(
                (
                    f"{GITHUB_API_BASE}/repos/"
                    f"{owner}/{repo}/branches"
                ),
                headers=_github_headers(token),
                params={
                    "per_page": 100,
                    "page": page,
                },
            )

            if response.status_code != 200:
                _raise_github_error(
                    response,
                    "Repository or branches were not found",
                )

            page_items = response.json()

            if not isinstance(page_items, list):
                raise RuntimeError(
                    "GitHub returned an invalid branch list"
                )

            branches.extend(page_items)

            if len(page_items) < 100:
                break

            page += 1

    return branches


async def list_commits(
    owner: str,
    repo: str,
    branch: str,
    token: str,
    per_page: int = 100,
) -> list[dict[str, Any]]:
    api_url = (
        f"{GITHUB_API_BASE}/repos/"
        f"{owner}/{repo}/commits"
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            api_url,
            headers=_github_headers(token),
            params={
                "sha": branch,
                "per_page": per_page,
                "page": 1,
            },
        )

    if response.status_code == 200:
        payload = response.json()

        if not isinstance(payload, list):
            raise RuntimeError(
                "GitHub returned an invalid commit list"
            )

        return payload

    _raise_github_error(
        response,
        "Repository, branch, or commits were not found",
    )

    raise RuntimeError("Unexpected GitHub commit response")
