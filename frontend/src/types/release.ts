export interface ReleaseNotes {
  title: string;
  summary: string;

  features: string[];
  fixes: string[];
  improvements: string[];
  documentation: string[];
  maintenance: string[];

  contributors: string[];

  totalCommits: number;
}

export type GenerateFor =
  | "all"
  | "individual";

export interface GenerateReleaseNotesInput {
  repository: string;
  branch: string;

  title: string;
  version: string;
  environment: string;

  generateFor: GenerateFor;
  selectedAuthor: string;

  commits: {
    id: string;
    message: string;
    author: string;
    authorEmail: string;
    date: string;
  }[];
}
