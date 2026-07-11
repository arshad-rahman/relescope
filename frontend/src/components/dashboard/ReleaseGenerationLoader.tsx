import {
  FileText,
  GitCommit,
  LoaderCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react";

type Props = {
  repository: string;
  commitCount: number;
  mode: "all" | "individual";
  developer: string;
};

const generationStages = [
  {
    title: "Reading commit history",
    description:
      "Reviewing selected GitHub commits and contributor activity.",
    icon: GitCommit,
  },
  {
    title: "Classifying changes",
    description:
      "Grouping features, fixes, improvements and maintenance work.",
    icon: WandSparkles,
  },
  {
    title: "Writing release summary",
    description:
      "Turning technical commit messages into clear release notes.",
    icon: FileText,
  },
];

function SkeletonLine({
  width,
}: {
  width: string;
}) {
  return (
    <div
      className={`h-2.5 animate-pulse rounded-full bg-white/10 ${width}`}
    />
  );
}

export default function ReleaseGenerationLoader({
  repository,
  commitCount,
  mode,
  developer,
}: Props) {
  return (
    <aside
      aria-live="polite"
      aria-busy="true"
      className="relative min-h-[34rem] overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/10 lg:h-full"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-3xl [animation-delay:500ms]" />

      <div className="relative">
        <div className="flex items-start gap-4 border-b border-white/10 pb-6">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-cyan-400/15" />

            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
              <LoaderCircle className="h-7 w-7 animate-spin" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              AI generation in progress
            </div>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Building your release notes
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Relescope is analysing{" "}
              <span className="font-semibold text-slate-200">
                {commitCount}{" "}
                {commitCount === 1
                  ? "commit"
                  : "commits"}
              </span>{" "}
              from{" "}
              <span className="font-semibold text-slate-200">
                {repository ||
                  "the selected repository"}
              </span>
              .
            </p>

            {mode === "individual" &&
              developer && (
                <p className="mt-1 text-xs text-slate-500">
                  Generating notes for{" "}
                  <span className="text-cyan-300">
                    {developer}
                  </span>
                  .
                </p>
              )}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-full bg-white/5 p-1">
          <div className="h-1.5 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-300" />
        </div>

        <div className="mt-6 space-y-3">
          {generationStages.map(
            (
              {
                title,
                description,
                icon: Icon,
              },
              index,
            ) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
              >
                <div
                  className="flex h-9 w-9 shrink-0 animate-pulse items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300"
                  style={{
                    animationDelay: `${index * 180}ms`,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.06] bg-slate-950/40 p-5">
          <div className="flex items-center justify-between gap-4">
            <SkeletonLine width="w-2/3" />

            <div className="h-6 w-16 animate-pulse rounded-full bg-cyan-400/10" />
          </div>

          <div className="mt-5 space-y-3">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-11/12" />
            <SkeletonLine width="w-4/5" />
          </div>

          <div className="mt-7 space-y-4">
            <SkeletonLine width="w-1/3" />

            <div className="space-y-3 pl-3">
              <SkeletonLine width="w-full" />
              <SkeletonLine width="w-10/12" />
              <SkeletonLine width="w-9/12" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Generation time depends on the number of
          commits and the configured AI provider.
        </p>
      </div>
    </aside>
  );
}
