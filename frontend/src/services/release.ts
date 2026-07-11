import axios from "axios";

import { api } from "./api";

import type {
  GenerateReleaseNotesInput,
  ReleaseNotes,
} from "../types/release";


type ReleaseNotesApiResponse = {
  title: string;
  summary: string;

  features: string[];
  fixes: string[];
  improvements: string[];
  documentation: string[];
  maintenance: string[];

  contributors: string[];

  total_commits: number;
};


function getErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (
      typeof detail === "string" &&
      detail.trim()
    ) {
      return detail;
    }

    if (error.code === "ERR_NETWORK") {
      return (
        "Unable to reach the release generation API."
      );
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to generate release notes.";
}


export async function generateReleaseNotes(
  input: GenerateReleaseNotesInput,
): Promise<ReleaseNotes> {
  try {
    const response =
      await api.post<ReleaseNotesApiResponse>(
        "/releases/generate",
        {
          repository: input.repository,
          branch: input.branch,

          title: input.title,
          version: input.version,
          environment: input.environment,

          generate_for: input.generateFor,

          selected_author:
            input.selectedAuthor,

          commits: input.commits.map(
            (commit) => ({
              id: commit.id,
              message: commit.message,
              author: commit.author,

              author_email:
                commit.authorEmail,

              date: commit.date,
            }),
          ),
        },
      );

    return {
      title: response.data.title,
      summary: response.data.summary,

      features: response.data.features,
      fixes: response.data.fixes,

      improvements:
        response.data.improvements,

      documentation:
        response.data.documentation,

      maintenance:
        response.data.maintenance,

      contributors:
        response.data.contributors,

      totalCommits:
        response.data.total_commits,
    };
  } catch (error) {
    throw new Error(
      getErrorMessage(error),
    );
  }
}
