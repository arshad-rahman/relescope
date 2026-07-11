import {
  useEffect,
  useState,
} from "react";

import BeautifulSelect from "../ui/BeautifulSelect";

import {
  getBranches,
} from "../../services/github";

import type {
  Branch,
} from "../../types/github";

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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

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
  }, [
    token,
    repositoryFullName,
  ]);

  const options = branches.map(
    (branch) => ({
      value: branch.name,
      label: branch.name,
    }),
  );

  const placeholder =
    !repositoryFullName
      ? "Select repository first"
      : loading
        ? "Loading branches..."
        : branches.length === 0
          ? "No branches available"
          : "Select a branch";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        Branch
      </label>

      <BeautifulSelect
        id="branch-selector"
        value={value}
        options={options}
        placeholder={placeholder}
        ariaLabel="Select repository branch"
        disabled={
          !repositoryFullName ||
          loading ||
          branches.length === 0
        }
        onValueChange={onChange}
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
