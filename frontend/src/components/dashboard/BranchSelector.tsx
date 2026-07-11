import {
  useEffect,
  useState,
} from "react";

import { getBranches } from "../../services/github";

import type { Branch } from "../../types/github";

type Props = {
  token: string;
  repositoryFullName: string;
  value: string;
  onChange: (branch: string) => void;
};

export default function BranchSelector({
  token,
  repositoryFullName,
  value,
  onChange,
}: Props) {
  const [branches, setBranches] =
    useState<Branch[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBranches() {
      if (!token || !repositoryFullName) {
        setBranches([]);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getBranches(
          token,
          repositoryFullName,
        );

        if (!active) {
          return;
        }

        setBranches(data);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setBranches([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load branches.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBranches();

    return () => {
      active = false;
    };
  }, [token, repositoryFullName]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        Branch
      </label>

      <select
        disabled={
          !repositoryFullName || loading
        }
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {!repositoryFullName
            ? "Select repository first"
            : loading
              ? "Loading branches..."
              : "Select a branch"}
        </option>

        {branches.map((branch) => (
          <option
            key={branch.id}
            value={branch.name}
          >
            {branch.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
