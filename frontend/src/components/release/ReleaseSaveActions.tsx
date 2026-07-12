import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  LoaderCircle,
  Save,
} from "lucide-react";

import type {
  SavedReleaseStatus,
} from "../../types/savedRelease";

type Props = {
  status: SavedReleaseStatus | null;

  saving: boolean;
  error: string;

  hasUnsavedChanges: boolean;

  savedAt: string;

  onSaveDraft: () => void;
  onSaveFinal: () => void;
};

function formatSavedAt(
  value: string,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export default function ReleaseSaveActions({
  status,
  saving,
  error,
  hasUnsavedChanges,
  savedAt,
  onSaveDraft,
  onSaveFinal,
}: Props) {
  const savedTime =
    formatSavedAt(savedAt);

  const stateLabel =
    hasUnsavedChanges && status
      ? "Unsaved changes"
      : status === "draft"
        ? "Draft saved"
        : status === "final"
          ? "Final release saved"
          : status === "published"
            ? "Published release"
            : "Not saved yet";

  return (
    <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
            {hasUnsavedChanges ? (
              <Clock3 className="h-5 w-5" />
            ) : status ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
          </span>

          <div>
            <p className="font-semibold text-white">
              {stateLabel}
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {status
                ? "Updates will modify the existing saved release."
                : "Save this release so it remains available after refreshing."}
            </p>

            {savedTime && (
              <p className="mt-1 text-xs text-slate-600">
                Last saved: {savedTime}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={saving}
            onClick={onSaveDraft}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/25 hover:bg-white/[0.08] disabled:cursor-wait disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {status
              ? "Update draft"
              : "Save draft"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onSaveFinal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <FileCheck2 className="h-4 w-4" />
            )}

            {status === "final"
              ? "Update final"
              : "Save as final"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </section>
  );
}
