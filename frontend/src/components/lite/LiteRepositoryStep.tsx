import {
  ArrowRight,
  GitBranch,
  LockKeyhole,
} from "lucide-react";

import BranchSelector from "../dashboard/BranchSelector";
import RepositorySelector from "../dashboard/RepositorySelector";

import type {
  Repository,
} from "../../types/github";

type Props = {
  token: string;
  repositories: Repository[];
  repositoriesLoading: boolean;
  repositoriesError: string;
  repositoryFullName: string;
  branch: string;
  onRepositoryChange: (
    repositoryFullName: string,
  ) => void;
  onBranchChange: (branch: string) => void;
  onContinue: () => void;
};

export default function LiteRepositoryStep({
  token,
  repositories,
  repositoriesLoading,
  repositoriesError,
  repositoryFullName,
  branch,
  onRepositoryChange,
  onBranchChange,
  onContinue,
}: Props) {
  const selectedRepository =
    repositories.find(
      (repository) =>
        repository.fullName ===
        repositoryFullName,
    );

  const canContinue = Boolean(
    selectedRepository &&
      branch &&
      !repositoriesLoading,
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-7 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Step 1 of 4
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Select your repository
            </h2>

            <p className="mt-2 max-w-xl leading-7 text-slate-400">
              Choose a GitHub repository. Lite
              automatically selects its default branch,
              while still allowing you to change it.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-200">
            <LockKeyhole className="h-3.5 w-3.5" />
            Live GitHub data
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <RepositorySelector
            repositories={repositories}
            loading={repositoriesLoading}
            error={repositoriesError}
            value={repositoryFullName}
            onChange={onRepositoryChange}
          />

          <BranchSelector
            token={token}
            repositoryFullName={
              repositoryFullName
            }
            value={branch}
            onChange={onBranchChange}
          />

          {selectedRepository && branch && (
            <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <GitBranch className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-200">
                    Repository ready
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-400">
                    {selectedRepository.fullName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      Branch: {branch}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      {selectedRepository.private
                        ? "Private repository"
                        : "Public repository"}
                    </span>

                    {branch ===
                      selectedRepository.defaultBranch && (
                      <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1 text-xs text-cyan-300">
                        Default branch
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-4 font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/15 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
        >
          Continue to release range
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-3 text-center text-xs text-slate-600">
          Select a repository and branch to continue.
        </p>
      </div>
    </section>
  );
}
