export interface RepositoryValidationRequest {
  url: string;
  token: string;
  remember_token: boolean;
}

export interface RepositoryValidationResponse {
  valid: boolean;
  owner: string;
  repo: string;
  default_branch: string;
  private: boolean;
  message: string;
}
