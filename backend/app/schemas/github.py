from typing import Optional

from pydantic import BaseModel, Field


class GitHubConnectRequest(BaseModel):
    token: str = Field(..., min_length=10)


class GitHubConnectResponse(BaseModel):
    valid: bool
    login: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    html_url: Optional[str] = None
    email: Optional[str] = None
    public_repos: Optional[int] = None
    message: str


class GitHubRepository(BaseModel):
    id: int
    name: str
    full_name: str
    owner: str
    private: bool
    default_branch: str


class GitHubRepositoriesResponse(BaseModel):
    repositories: list[GitHubRepository]


class GitHubBranchesRequest(BaseModel):
    token: str = Field(..., min_length=10)
    owner: str = Field(..., min_length=1)
    repo: str = Field(..., min_length=1)


class GitHubBranch(BaseModel):
    name: str


class GitHubBranchesResponse(BaseModel):
    branches: list[GitHubBranch]


class GitHubCommitsRequest(BaseModel):
    token: str = Field(..., min_length=10)
    owner: str = Field(..., min_length=1)
    repo: str = Field(..., min_length=1)
    branch: str = Field(..., min_length=1)
    per_page: int = Field(default=100, ge=1, le=100)


class GitHubCommit(BaseModel):
    id: str
    message: str
    author: str
    author_email: str
    date: str


class GitHubCommitsResponse(BaseModel):
    commits: list[GitHubCommit]
