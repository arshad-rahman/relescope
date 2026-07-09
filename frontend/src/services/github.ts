import { API_BASE_URL } from "../config/api";

import type {
  RepositoryValidationRequest,
  RepositoryValidationResponse,
} from "../types/repository";

export async function validateRepository(
  payload: RepositoryValidationRequest
): Promise<RepositoryValidationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/repository/validate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Validation failed");
  }

  return data;
}
