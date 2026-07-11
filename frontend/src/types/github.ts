export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string | null;
  htmlUrl: string | null;
  email: string | null;
  publicRepos: number | null;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  authorEmail: string;
  date: string;
}
