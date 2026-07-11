import type { Repository } from "../../types/github";

type Props = {
  repositories: Repository[];
  loading: boolean;
  error: string;
  value: string;
  onChange: (fullName: string) => void;
};

export default function RepositorySelector({
  repositories,
  loading,
  error,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        Repository
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={loading}
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {loading
            ? "Loading repositories..."
            : "Select a repository"}
        </option>

        {repositories.map((repository) => (
          <option
            key={repository.id}
            value={repository.fullName}
          >
            {repository.fullName}
            {repository.private ? " · Private" : ""}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        repositories.length === 0 && (
          <p className="text-sm text-slate-500">
            No accessible repositories were found.
          </p>
        )}
    </div>
  );
}
