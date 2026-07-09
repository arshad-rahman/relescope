import type {
  RepositoryValidationRequest,
  RepositoryValidationResponse,
} from "../types/repository";

const API_URL = "http://127.0.0.1:8000";

export async function validateRepository(
  payload: RepositoryValidationRequest
): Promise<RepositoryValidationResponse> {
  const response = await fetch(
    `${API_URL}/api/repository/validate`,
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
