import {
  LoaderCircle,
  Sparkles,
} from "lucide-react";

type Props = {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

export default function GenerateButton({
  disabled,
  loading,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-live="polite"
      className="group relative w-full overflow-hidden rounded-xl bg-cyan-600 px-5 py-4 font-semibold text-white shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
    >
      {loading && (
        <>
          <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-600 via-cyan-400/30 to-cyan-600" />

          <span className="absolute -left-20 top-0 h-full w-20 -skew-x-12 bg-white/15 blur-lg transition-transform duration-1000 group-disabled:translate-x-[42rem]" />
        </>
      )}

      <span className="relative flex items-center justify-center gap-3">
        {loading ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />

            <span>
              Generating Release Notes
            </span>

            <span
              aria-hidden="true"
              className="flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
            </span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            Generate Release Notes
          </>
        )}
      </span>
    </button>
  );
}
