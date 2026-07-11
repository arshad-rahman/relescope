import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  GitBranch,
  GitCommit,
  Tag,
  Users,
} from "lucide-react";

import type {
  Commit,
} from "../../types/github";

import {
  formatLiteCommitDate,
  getLiteRangeLabel,
  type LiteReleaseRange,
} from "../../utils/liteRelease";

type Props = {
  repository: string;
  branch: string;
  releaseRange: LiteReleaseRange;
  selectedCommits: Commit[];
  contributors: string[];
  releaseTitle: string;
  version: string;
  onReleaseTitleChange: (
    value: string,
  ) => void;
  onVersionChange: (
    value: string,
  ) => void;
  onBack: () => void;
  onGenerate: () => void;
};

export default function LiteReviewStep({
  repository,
  branch,
  releaseRange,
  selectedCommits,
  contributors,
  releaseTitle,
  version,
  onReleaseTitleChange,
  onVersionChange,
  onBack,
  onGenerate,
}: Props) {
  const visibleCommits =
    selectedCommits.slice(0, 8);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-7 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.07] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Step 3 of 4
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Review your release
            </h2>

            <p className="mt-2 max-w-xl leading-7 text-slate-400">
              Lite selected the matching commits and
              prepared sensible release defaults.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-200">
            Automatic selection complete
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <GitCommit className="h-5 w-5 text-cyan-300" />

            <p className="mt-3 text-2xl font-bold text-white">
              {selectedCommits.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Selected commits
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <Users className="h-5 w-5 text-cyan-300" />

            <p className="mt-3 text-2xl font-bold text-white">
              {contributors.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Contributors
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <CalendarDays className="h-5 w-5 text-cyan-300" />

            <p className="mt-3 text-sm font-semibold text-white">
              {getLiteRangeLabel(
                releaseRange,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Release range
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <GitBranch className="h-5 w-5 text-cyan-300" />

            <p className="mt-3 truncate text-sm font-semibold text-white">
              {branch}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Branch
            </p>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-950/35 p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-300" />

            <h3 className="font-semibold text-white">
              Release details
            </h3>
          </div>

          <p className="mt-2 truncate text-xs text-slate-500">
            {repository}
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_180px]">
            <div>
              <label
                htmlFor="lite-release-title"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Release title
              </label>

              <input
                id="lite-release-title"
                type="text"
                value={releaseTitle}
                onChange={(event) =>
                  onReleaseTitleChange(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="lite-release-version"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Version
              </label>

              <div className="relative">
                <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  id="lite-release-version"
                  type="text"
                  value={version}
                  onChange={(event) =>
                    onVersionChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-950/35 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Automatically selected commits
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Showing up to eight commits in this
                review.
              </p>
            </div>

            <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1 text-xs text-cyan-300">
              {selectedCommits.length} included
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {visibleCommits.map((commit) => (
              <article
                key={commit.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
              >
                <div className="flex items-start gap-3">
                  <GitCommit className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {commit.message
                        .split("\n")[0] ||
                        "Untitled commit"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>
                        {commit.author}
                      </span>

                      <span>
                        {formatLiteCommitDate(
                          commit.date,
                        )}
                      </span>

                      <span className="font-mono">
                        {commit.id.slice(0, 7)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {selectedCommits.length >
            visibleCommits.length && (
            <p className="mt-4 text-center text-xs text-slate-600">
              +
              {selectedCommits.length -
                visibleCommits.length}{" "}
              additional commits will also be included.
            </p>
          )}
        </div>

        <div className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-950/35 p-5">
          <h3 className="font-semibold text-white">
            Contributors
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {contributors.map((contributor) => (
              <span
                key={contributor}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
              >
                {contributor}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            disabled={
              !releaseTitle.trim() ||
              selectedCommits.length === 0
            }
            onClick={onGenerate}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-4 font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/15 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
          >
            Generate release notes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-slate-600">
          Lite will classify the selected commits and
          build an editable release document.
        </p>
      </div>
    </section>
  );
}
