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
      className="w-full rounded-xl bg-cyan-600 px-5 py-4 font-semibold text-white transition-all duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Generating Release Notes..."
        : "Generate Release Notes"}
    </button>
  );
}
