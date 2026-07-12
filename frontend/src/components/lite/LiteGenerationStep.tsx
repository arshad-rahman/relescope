import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

import EditableReleasePreview from "../dashboard/EditableReleasePreview";
import ReleaseGenerationLoader from "../dashboard/ReleaseGenerationLoader";
import ReleaseSaveActions from "../release/ReleaseSaveActions";

import type {
  ReleaseNotes,
} from "../../types/release";

import type {
  SavedReleaseStatus,
} from "../../types/savedRelease";

type Props = {
  repository: string;
  branch: string;
  commitCount: number;
  loading: boolean;
  error: string;
  releaseNotes: ReleaseNotes | null;
  onChange: (
    releaseNotes: ReleaseNotes,
  ) => void;
  onBackToReview: () => void;
  onRetry: () => void;
  onStartAnother: () => void;

  savedStatus:
    SavedReleaseStatus | null;

  saveLoading: boolean;
  saveError: string;

  hasUnsavedChanges: boolean;
  savedAt: string;

  onSaveDraft: () => void;
  onSaveFinal: () => void;
};

export default function LiteGenerationStep({
  repository,
  branch,
  commitCount,
  loading,
  error,
  releaseNotes,
  onChange,
  onBackToReview,
  onRetry,
  onStartAnother,
  savedStatus,
  saveLoading,
  saveError,
  hasUnsavedChanges,
  savedAt,
  onSaveDraft,
  onSaveFinal,
}: Props) {
  if (loading) {
    return (
      <ReleaseGenerationLoader
        repository={repository}
        commitCount={commitCount}
        mode="all"
        developer=""
      />
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-red-400/20 bg-slate-900/70 p-7 shadow-2xl shadow-red-950/10 backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-400/[0.08] blur-3xl" />

        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.08] text-red-300">
            <AlertCircle className="h-7 w-7" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
            Generation failed
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Relescope could not generate this release
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-slate-400">
            Your repository, branch and commit selection
            are still available. Review the error and try
            the generation again.
          </p>

          <div className="mt-6 rounded-2xl border border-red-400/15 bg-red-400/[0.06] px-5 py-4 text-sm leading-6 text-red-200">
            {error}
          </div>

          <div className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-950/35 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              Generation source
            </p>

            <p className="mt-2 truncate text-sm font-medium text-slate-200">
              {repository}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
              <span>Branch: {branch}</span>
              <span>
                {commitCount}{" "}
                {commitCount === 1
                  ? "commit"
                  : "commits"}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBackToReview}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to review
            </button>

            <button
              type="button"
              onClick={onRetry}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-4 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/15"
            >
              <RefreshCw className="h-4 w-4" />
              Try generation again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!releaseNotes) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center backdrop-blur-xl">
        <AlertCircle className="mx-auto h-8 w-8 text-slate-500" />

        <h2 className="mt-4 text-xl font-bold text-white">
          No generated release is available
        </h2>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <RefreshCw className="h-4 w-4" />
          Generate release notes
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.045] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Release generated
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Review, edit and export your result
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Generated from {commitCount}{" "}
                {commitCount === 1
                  ? "commit"
                  : "commits"}{" "}
                on the {branch} branch.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onBackToReview}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Review settings
            </button>

            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/[0.1]"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>

            <button
              type="button"
              onClick={onStartAnother}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/[0.06] px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-400/[0.1]"
            >
              <RotateCcw className="h-4 w-4" />
              New release
            </button>
          </div>
        </div>
      </section>

      <ReleaseSaveActions
        status={savedStatus}
        saving={saveLoading}
        error={saveError}
        hasUnsavedChanges={
          hasUnsavedChanges
        }
        savedAt={savedAt}
        onSaveDraft={onSaveDraft}
        onSaveFinal={onSaveFinal}
      />

      <EditableReleasePreview
        releaseNotes={releaseNotes}
        onChange={onChange}
      />
    </div>
  );
}
