import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Loader from "../ui/Loader";

import { validateRepository } from "../../services/github";

import type {
  RepositoryValidationRequest,
  RepositoryValidationResponse,
} from "../../types/repository";

type Props = {
  onSuccess: (repo: RepositoryValidationResponse) => void;
};

export default function RepositoryForm({ onSuccess }: Props) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [rememberToken, setRememberToken] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!url.trim()) {
      setError("Repository URL is required.");
      return;
    }

    if (!token.trim()) {
      setError("GitHub Token is required.");
      return;
    }

    setLoading(true);

    try {
      const payload: RepositoryValidationRequest = {
        url,
        token,
        remember_token: rememberToken,
      };

      const repository = await validateRepository(payload);

      onSuccess(repository);

      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 text-sm text-slate-300">
          Repository URL
        </label>

        <Input
          placeholder="https://github.com/org/project"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm text-slate-300">
          GitHub Token
        </label>

        <Input
          type="password"
          placeholder="ghp_xxxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-slate-300">
        <input
          type="checkbox"
          checked={rememberToken}
          onChange={(e) =>
            setRememberToken(e.target.checked)
          }
        />

        Remember Token
      </label>

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-600 p-3 text-red-300">
          {error}
        </div>
      )}

      <Button disabled={loading}>
        {loading ? <Loader /> : "Validate Repository"}
      </Button>
    </form>
  );
}
