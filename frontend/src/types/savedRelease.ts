import type {
  Commit,
} from "./github";

export type SavedReleaseExperienceMode =
  | "lite"
  | "advanced";

export type SavedReleaseSelectionMode =
  | "automatic"
  | "manual";

export type SavedReleaseStatus =
  | "draft"
  | "final"
  | "published";

export type SavedReleaseTarget =
  | "all"
  | "individual";

export interface SavedReleaseBaseInput {
  experienceMode: SavedReleaseExperienceMode;
  selectionMode: SavedReleaseSelectionMode;
  status: SavedReleaseStatus;

  repository: string;
  branch: string;

  title: string;
  version: string;
  environment: string;

  generateFor: SavedReleaseTarget;
  selectedAuthor: string;

  releaseRange: string | null;

  dateFrom: string | null;
  dateTo: string | null;

  summary: string;

  features: string[];
  fixes: string[];
  improvements: string[];
  documentation: string[];
  maintenance: string[];

  contributors: string[];

  selectedCommitIds: string[];
  selectedCommits: Commit[];

  totalCommits: number;
}

export interface SavedReleaseCreateInput
  extends SavedReleaseBaseInput {
  ownerLogin: string;
}

export type SavedReleaseUpdateInput =
  Partial<SavedReleaseBaseInput>;

export interface SavedRelease
  extends SavedReleaseBaseInput {
  id: number;
  ownerLogin: string;

  createdAt: string;
  updatedAt: string;
}
