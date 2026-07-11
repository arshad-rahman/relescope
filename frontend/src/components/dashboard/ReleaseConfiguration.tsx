import BeautifulSelect from "../ui/BeautifulSelect";

type Props = {
  title: string;
  version: string;
  environment: string;
  generateFor: "all" | "individual";
  selectedAuthor: string;

  authors: string[];

  onTitleChange: (value: string) => void;
  onVersionChange: (value: string) => void;
  onEnvironmentChange: (value: string) => void;

  onGenerateForChange: (
    value: "all" | "individual",
  ) => void;

  onAuthorChange: (value: string) => void;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white shadow-sm outline-none transition duration-200 placeholder:text-slate-600 hover:border-cyan-400/30 hover:bg-slate-900 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10";

const environmentOptions = [
  {
    value: "Development",
    label: "Development",
  },
  {
    value: "Staging",
    label: "Staging",
  },
  {
    value: "Production",
    label: "Production",
  },
];

const generateForOptions = [
  {
    value: "all",
    label: "All Developers",
  },
  {
    value: "individual",
    label: "Individual Developer",
  },
];

export default function ReleaseConfiguration({
  title,
  version,
  environment,
  generateFor,
  selectedAuthor,
  authors,

  onTitleChange,
  onVersionChange,
  onEnvironmentChange,
  onGenerateForChange,
  onAuthorChange,
}: Props) {
  const developerEnabled =
    generateFor === "individual";

  const developerOptions = authors.map(
    (author) => ({
      value: author,
      label: author,
    }),
  );

  const developerPlaceholder =
    !developerEnabled
      ? "Choose Individual Developer first"
      : authors.length === 0
        ? "No developers available"
        : "Select Developer";

  function handleGenerateForChange(
    value: string,
  ) {
    const nextValue = value as
      | "all"
      | "individual";

    onGenerateForChange(nextValue);

    if (nextValue === "all") {
      onAuthorChange("");
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Release settings
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Release Configuration
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          Configure the release before generating
          notes.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="release-title"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Release Title
          </label>

          <input
            id="release-title"
            type="text"
            value={title}
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
            placeholder="Weekly Release"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="release-version"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Version
          </label>

          <input
            id="release-version"
            type="text"
            value={version}
            onChange={(event) =>
              onVersionChange(event.target.value)
            }
            placeholder="v1.0.0"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Environment
          </label>

          <BeautifulSelect
            id="release-environment"
            value={environment}
            options={environmentOptions}
            placeholder="Select environment"
            ariaLabel="Select release environment"
            onValueChange={
              onEnvironmentChange
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Generate For
          </label>

          <BeautifulSelect
            id="generate-for"
            value={generateFor}
            options={generateForOptions}
            placeholder="Select generation mode"
            ariaLabel="Select release generation mode"
            onValueChange={
              handleGenerateForChange
            }
          />
        </div>

        <div
          className={
            developerEnabled
              ? "transition-opacity"
              : "opacity-60 transition-opacity"
          }
        >
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Developer
          </label>

          <BeautifulSelect
            id="release-developer"
            value={
              developerEnabled
                ? selectedAuthor
                : ""
            }
            options={developerOptions}
            placeholder={developerPlaceholder}
            ariaLabel="Select developer"
            disabled={
              !developerEnabled ||
              developerOptions.length === 0
            }
            onValueChange={onAuthorChange}
          />

          <p className="mt-2 text-xs text-slate-500">
            {developerEnabled
              ? "Only commits from the selected contributor will be included."
              : "Select Individual Developer above to enable this field."}
          </p>
        </div>
      </div>
    </section>
  );
}
