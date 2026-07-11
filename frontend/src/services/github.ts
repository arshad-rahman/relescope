import axios from "axios";

import { api } from "./api";

import type {
  Branch,
  Commit,
  GitHubUser,
  Repository,
} from "../types/github";

type ConnectResponse = {
  valid: boolean;
  login: string;
  name: string | null;
  avatar_url: string | null;
  html_url: string | null;
  email: string | null;
  public_repos: number | null;
  message: string;
};

type RepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  default_branch: string;
};

type BranchResponse = {
  name: string;
};

type CommitResponse = {
  id: string;
  message: string;
  author: string;
  author_email: string;
  date: string;
};

function getRequestError(
  error: unknown,
  fallback: string,
): Error {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string" && detail) {
      return new Error(detail);
    }

    if (error.message) {
      return new Error(error.message);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(fallback);
}

function splitRepositoryName(
  fullName: string,
): {
  owner: string;
  repo: string;
} {
  const separatorIndex = fullName.indexOf("/");

  if (
    separatorIndex <= 0 ||
    separatorIndex === fullName.length - 1
  ) {
    throw new Error(
      "Invalid repository name. Expected owner/repository."
    );
  }

  return {
    owner: fullName.slice(0, separatorIndex),
    repo: fullName.slice(separatorIndex + 1),
  };
}

export async function connectGitHub(
  token: string,
): Promise<GitHubUser> {
  try {
    const response = await api.post<ConnectResponse>(
      "/github/connect",
      {
        token,
      },
    );

    return {
      login: response.data.login,
      name: response.data.name,
      avatarUrl: response.data.avatar_url,
      htmlUrl: response.data.html_url,
      email: response.data.email,
      publicRepos: response.data.public_repos,
    };
  } catch (error) {
    throw getRequestError(
      error,
      "Unable to connect to GitHub.",
    );
  }
}

export async function getRepositories(
  token: string,
): Promise<Repository[]> {
  try {
    const response = await api.post<{
      repositories: RepositoryResponse[];
    }>("/github/repositories", {
      token,
    });

    return response.data.repositories.map(
      (repository) => ({
        id: repository.id.toString(),
        name: repository.name,
        fullName: repository.full_name,
        owner: repository.owner,
        private: repository.private,
        defaultBranch: repository.default_branch,
      }),
    );
  } catch (error) {
    throw getRequestError(
      error,
      "Unable to load GitHub repositories.",
    );
  }
}

export async function getBranches(
  token: string,
  repositoryFullName: string,
): Promise<Branch[]> {
  const { owner, repo } = splitRepositoryName(
    repositoryFullName
  );

  try {
    const response = await api.post<{
      branches: BranchResponse[];
    }>("/github/branches", {
      token,
      owner,
      repo,
    });

    return response.data.branches.map((branch) => ({
      id: branch.name,
      name: branch.name,
    }));
  } catch (error) {
    throw getRequestError(
      error,
      "Unable to load repository branches.",
    );
  }
}

export async function getCommits(
  token: string,
  repositoryFullName: string,
  branch: string,
): Promise<Commit[]> {
  const { owner, repo } = splitRepositoryName(
    repositoryFullName
  );

  try {
    const response = await api.post<{
      commits: CommitResponse[];
    }>("/github/commits", {
      token,
      owner,
      repo,
      branch,
      per_page: 100,
    });

    return response.data.commits.map((commit) => ({
      id: commit.id,
      message: commit.message,
      author: commit.author,
      authorEmail: commit.author_email,
      date: commit.date,
    }));
  } catch (error) {
    throw getRequestError(
      error,
      "Unable to load repository commits.",
    );
  }
}
