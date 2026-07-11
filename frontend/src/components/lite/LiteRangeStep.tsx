import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  GitCommit,
  LoaderCircle,
} from "lucide-react";

import {
  liteRangeOptions,
  type LiteReleaseRange,
} from "../../utils/liteRelease";

type Props = {
  repository: string;
  branch: string;
  value: LiteReleaseRange | null;
  loading: boolean;
  error: string;
  onChange: (
    value: LiteReleaseRange,
  ) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function LiteRangeStep({
  repository,
  branch,
  value,
  loading,
  error,
  onChange,
  onBack,
  onContinue,
}: Props) {
  return (
    <section
      aria-busy={loading}
      className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-7 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-9"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-400/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Step 2 of 4
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Choose a release range
            </h2>

            <p className="mt-2 max-w-xl leading-7 text-slate-400">
              Select how much Git history Lite should
              include when automatically choosing
              commits.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-xs text-cyan-200">
            <Clock3 className="h-3.5 w-3.5" />
            Smart selection
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-slate-950/40 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            Selected source
          </p>

          <p className="mt-2 truncate text-sm font-medium text-slate-200">
            {repository}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Branch: {branch}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {liteRangeOptions.map((option) => {
            const selected =
              option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={loading}
                aria-pressed={selected}
                onClick={() =>
                  onChange(option.value)
                }
                className={
                  selected
                    ? "relative rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.08] p-5 text-left shadow-lg shadow-cyan-950/10 transition disabled:cursor-wait disabled:opacity-60"
                    : "relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.045] disabled:cursor-wait disabled:opacity-60"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={
                      selected
                        ? "flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"
                        : "flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500"
                    }
                  >
                    {option.type === "days" ? (
                      <CalendarDays className="h-5 w-5" />
                    ) : (
                      <GitCommit className="h-5 w-5" />
                    )}
                  </span>

                  {selected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                <p
                  className={
                    selected
                      ? "mt-5 font-semibold text-white"
                      : "mt-5 font-semibold text-slate-300"
                  }
                >
                  {option.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            disabled={loading}
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-wait disabled:opacity-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            disabled={
              loading || value === null
            }
            onClick={onContinue}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-4 font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/15 disabled:cursor-wait disabled:translate-y-0 disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Finding matching commits...
              </>
            ) : value === null ? (
              <>
                Select a release range
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Analyse commits and continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-slate-600">
          {value === null
            ? "Choose one release range to continue."
            : "Lite analyses up to 100 recent commits from the selected branch."}
        </p>
      </div>
    </section>
  );
}
