import {
  Check,
} from "lucide-react";

type StepNumber = 1 | 2 | 3 | 4;

type Props = {
  currentStep: StepNumber;
};

const steps = [
  {
    number: 1,
    title: "Repository",
    description: "Choose the source",
  },
  {
    number: 2,
    title: "Release range",
    description: "Select the timeframe",
  },
  {
    number: 3,
    title: "Review",
    description: "Confirm smart defaults",
  },
  {
    number: 4,
    title: "Generate",
    description: "Create and export",
  },
] as const;

export default function LiteStepProgress({
  currentStep,
}: Props) {
  return (
    <div className="mt-10 grid gap-3 md:grid-cols-4">
      {steps.map((step) => {
        const active =
          step.number === currentStep;

        const completed =
          step.number < currentStep;

        return (
          <div
            key={step.number}
            className={
              active
                ? "rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.08] p-4 shadow-lg shadow-cyan-950/10"
                : completed
                  ? "rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4"
                  : "rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
            }
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={
                  active
                    ? "text-xs font-bold text-cyan-300"
                    : completed
                      ? "text-xs font-bold text-emerald-300"
                      : "text-xs font-bold text-slate-600"
                }
              >
                {String(step.number).padStart(
                  2,
                  "0",
                )}
              </span>

              {active && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              )}

              {completed && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>

            <p
              className={
                active
                  ? "mt-3 text-sm font-semibold text-white"
                  : completed
                    ? "mt-3 text-sm font-semibold text-emerald-100"
                    : "mt-3 text-sm font-semibold text-slate-400"
              }
            >
              {step.title}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
