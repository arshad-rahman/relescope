import axios from "axios";

import {
  api,
} from "./api";

import type {
  Commit,
} from "../types/github";

import type {
  SavedRelease,
  SavedReleaseBaseInput,
  SavedReleaseCreateInput,
  SavedReleaseUpdateInput,
} from "../types/savedRelease";

type SavedReleaseCommitApi = {
  id: string;
  message: string;
  author: string;
  author_email: string;
  date: string;
};

type SavedReleaseApi = {
  id: number;
  owner_login: string;

  experience_mode:
    | "lite"
    | "advanced";

  selection_mode:
    | "automatic"
    | "manual";

  status:
    | "draft"
    | "final"
    | "published";

  repository: string;
  branch: string;

  title: string;
  version: string;
  environment: string;

  generate_for:
    | "all"
    | "individual";

  selected_author: string;

  release_range: string | null;

  date_from: string | null;
  date_to: string | null;

  summary: string;

  features: string[];
  fixes: string[];
  improvements: string[];
  documentation: string[];
  maintenance: string[];

  contributors: string[];

  selected_commit_ids: string[];

  selected_commits:
    SavedReleaseCommitApi[];

  total_commits: number;

  created_at: string;
  updated_at: string;
};

type SavedReleasePayload = {
  experience_mode:
    SavedReleaseBaseInput["experienceMode"];

  selection_mode:
    SavedReleaseBaseInput["selectionMode"];

  status:
    SavedReleaseBaseInput["status"];

  repository: string;
  branch: string;

  title: string;
  version: string;
  environment: string;

  generate_for:
    SavedReleaseBaseInput["generateFor"];

  selected_author: string;

  release_range: string | null;

  date_from: string | null;
  date_to: string | null;

  summary: string;

  features: string[];
  fixes: string[];
  improvements: string[];
  documentation: string[];
  maintenance: string[];

  contributors: string[];

  selected_commit_ids: string[];

  selected_commits:
    SavedReleaseCommitApi[];

  total_commits: number;
};

function getErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const detail =
      error.response?.data?.detail;

    if (
      typeof detail === "string" &&
      detail.trim()
    ) {
      return detail;
    }

    if (
      Array.isArray(detail) &&
      typeof detail[0]?.msg === "string"
    ) {
      return detail[0].msg;
    }

    if (error.code === "ERR_NETWORK") {
      return (
        "Unable to reach the saved-release API."
      );
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to save the release.";
}

function serializeCommit(
  commit: Commit,
): SavedReleaseCommitApi {
  return {
    id: commit.id,
    message: commit.message,
    author:
      commit.author.trim() ||
      commit.authorEmail.trim() ||
      "Unknown contributor",

    author_email:
      commit.authorEmail,

    date: commit.date,
  };
}

function serializeReleaseInput(
  input: SavedReleaseBaseInput,
): SavedReleasePayload {
  return {
    experience_mode:
      input.experienceMode,

    selection_mode:
      input.selectionMode,

    status: input.status,

    repository: input.repository,
    branch: input.branch,

    title: input.title,
    version: input.version,
    environment: input.environment,

    generate_for:
      input.generateFor,

    selected_author:
      input.selectedAuthor,

    release_range:
      input.releaseRange,

    date_from: input.dateFrom,
    date_to: input.dateTo,

    summary: input.summary,

    features: input.features,
    fixes: input.fixes,
    improvements: input.improvements,

    documentation:
      input.documentation,

    maintenance:
      input.maintenance,

    contributors:
      input.contributors,

    selected_commit_ids:
      input.selectedCommitIds,

    selected_commits:
      input.selectedCommits.map(
        serializeCommit,
      ),

    total_commits:
      input.totalCommits,
  };
}

function serializeUpdateInput(
  input: SavedReleaseUpdateInput,
): Record<string, unknown> {
  const payload: Record<
    string,
    unknown
  > = {};

  function assign(
    key: string,
    value: unknown,
  ) {
    if (value !== undefined) {
      payload[key] = value;
    }
  }

  assign(
    "experience_mode",
    input.experienceMode,
  );

  assign(
    "selection_mode",
    input.selectionMode,
  );

  assign("status", input.status);

  assign(
    "repository",
    input.repository,
  );

  assign("branch", input.branch);
  assign("title", input.title);
  assign("version", input.version);

  assign(
    "environment",
    input.environment,
  );

  assign(
    "generate_for",
    input.generateFor,
  );

  assign(
    "selected_author",
    input.selectedAuthor,
  );

  assign(
    "release_range",
    input.releaseRange,
  );

  assign(
    "date_from",
    input.dateFrom,
  );

  assign(
    "date_to",
    input.dateTo,
  );

  assign("summary", input.summary);
  assign("features", input.features);
  assign("fixes", input.fixes);

  assign(
    "improvements",
    input.improvements,
  );

  assign(
    "documentation",
    input.documentation,
  );

  assign(
    "maintenance",
    input.maintenance,
  );

  assign(
    "contributors",
    input.contributors,
  );

  assign(
    "selected_commit_ids",
    input.selectedCommitIds,
  );

  if (
    input.selectedCommits !== undefined
  ) {
    assign(
      "selected_commits",
      input.selectedCommits.map(
        serializeCommit,
      ),
    );
  }

  assign(
    "total_commits",
    input.totalCommits,
  );

  return payload;
}

function mapSavedRelease(
  release: SavedReleaseApi,
): SavedRelease {
  return {
    id: release.id,

    ownerLogin:
      release.owner_login,

    experienceMode:
      release.experience_mode,

    selectionMode:
      release.selection_mode,

    status: release.status,

    repository:
      release.repository,

    branch: release.branch,

    title: release.title,
    version: release.version,

    environment:
      release.environment,

    generateFor:
      release.generate_for,

    selectedAuthor:
      release.selected_author,

    releaseRange:
      release.release_range,

    dateFrom:
      release.date_from,

    dateTo:
      release.date_to,

    summary: release.summary,

    features: release.features,
    fixes: release.fixes,

    improvements:
      release.improvements,

    documentation:
      release.documentation,

    maintenance:
      release.maintenance,

    contributors:
      release.contributors,

    selectedCommitIds:
      release.selected_commit_ids,

    selectedCommits:
      release.selected_commits.map(
        (commit) => ({
          id: commit.id,
          message: commit.message,
          author: commit.author,

          authorEmail:
            commit.author_email,

          date: commit.date,
        }),
      ),

    totalCommits:
      release.total_commits,

    createdAt:
      release.created_at,

    updatedAt:
      release.updated_at,
  };
}

export async function createSavedRelease(
  input: SavedReleaseCreateInput,
): Promise<SavedRelease> {
  try {
    const response =
      await api.post<SavedReleaseApi>(
        "/saved-releases",
        {
          owner_login:
            input.ownerLogin,

          ...serializeReleaseInput(
            input,
          ),
        },
      );

    return mapSavedRelease(
      response.data,
    );
  } catch (error) {
    throw new Error(
      getErrorMessage(error),
    );
  }
}

export async function updateSavedRelease(
  releaseId: number,
  ownerLogin: string,
  input: SavedReleaseUpdateInput,
): Promise<SavedRelease> {
  try {
    const response =
      await api.patch<SavedReleaseApi>(
        `/saved-releases/${releaseId}`,
        serializeUpdateInput(input),
        {
          params: {
            owner_login:
              ownerLogin,
          },
        },
      );

    return mapSavedRelease(
      response.data,
    );
  } catch (error) {
    throw new Error(
      getErrorMessage(error),
    );
  }
}

export async function listSavedReleases(
  ownerLogin: string,
  filters: import(
    "../types/savedRelease"
  ).SavedReleaseListFilters = {},
): Promise<
  import(
    "../types/savedRelease"
  ).SavedReleaseListResult
> {
  try {
    const response = await api.get<{
      items: SavedReleaseApi[];
      total: number;
      limit: number;
      offset: number;
    }>("/saved-releases", {
      params: {
        owner_login: ownerLogin,

        status:
          filters.status,

        experience_mode:
          filters.experienceMode,

        repository:
          filters.repository,

        limit:
          filters.limit ?? 100,

        offset:
          filters.offset ?? 0,
      },
    });

    return {
      items:
        response.data.items.map(
          mapSavedRelease,
        ),

      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset,
    };
  } catch (error) {
    throw new Error(
      getErrorMessage(error),
    );
  }
}

export async function deleteSavedRelease(
  releaseId: number,
  ownerLogin: string,
): Promise<void> {
  try {
    await api.delete(
      `/saved-releases/${releaseId}`,
      {
        params: {
          owner_login: ownerLogin,
        },
      },
    );
  } catch (error) {
    throw new Error(
      getErrorMessage(error),
    );
  }
}
