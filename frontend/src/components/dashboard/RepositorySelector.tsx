import BeautifulSelect from "../ui/BeautifulSelect";

import type {
  Repository,
} from "../../types/github";

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
  const options = repositories.map(
    (repository) => ({
      value: repository.fullName,
      label:
        repository.fullName +
        (
          repository.private
            ? " · Private"
            : ""
        ),
    }),
  );

  const placeholder = loading
    ? "Loading repositories..."
    : repositories.length === 0
      ? "No repositories available"
      : "Select a repository";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        Repository
      </label>

      <BeautifulSelect
        id="repository-selector"
        value={value}
        options={options}
        placeholder={placeholder}
        ariaLabel="Select GitHub repository"
        disabled={
          loading ||
          repositories.length === 0
        }
        onValueChange={onChange}
      />

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
