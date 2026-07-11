import type { ChangeEvent } from "react";
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
  onGenerateForChange: (value: "all" | "individual") => void;
  onAuthorChange: (value: string) => void;
};

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
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-6">

      <div>
        <h2 className="text-xl font-semibold">
          Release Configuration
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Configure the release before generating notes.
        </p>
      </div>

      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Release Title
          </label>

          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Version
          </label>

          <input
            value={version}
            onChange={(e) => onVersionChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Environment
          </label>

          <select
            value={environment}
            onChange={(e) => onEnvironmentChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
          >
            <option>Development</option>
[O            <option>Staging</option>
            <option>Production</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Generate For
          </label>

          <select
            value={generateFor}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onGenerateForChange(
                e.target.value as "all" | "individual",
              )
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
          >
            <option value="all">
              All Developers
            </option>

            <option value="individual">
              Individual Developer
            </option>
          </select>
        </div>
[I
        {generateFor === "individual" && (
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Developer
            </label>

            <select
              value={selectedAuthor}
              onChange={(e) =>
                onAuthorChange(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
            >
              <option value="">
[O                Select Developer
              </option>

              {authors.map((author) => (
                <option
                  key={author}
                  value={author}
                >
                  {author}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>

    </div>
  );
}
