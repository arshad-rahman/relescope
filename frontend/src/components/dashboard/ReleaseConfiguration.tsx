import type {
  ChangeEvent,
  ReactNode,
} from "react";

import {
  ChevronDown,
} from "lucide-react";

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

type SelectContainerProps = {
  children: ReactNode;
};

function SelectContainer({
  children,
}: SelectContainerProps) {
  return (
    <div className="relative">
      {children}

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10";

const selectClassName =
  "w-full appearance-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-11 text-white outline-none transition hover:border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10";

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
          <label
            htmlFor="release-environment"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Environment
          </label>

          <SelectContainer>
            <select
              id="release-environment"
              value={environment}
              onChange={(event) =>
                onEnvironmentChange(
                  event.target.value,
                )
              }
              className={selectClassName}
            >
              <option
                value="Development"
                className="bg-slate-950 text-white"
              >
                Development
              </option>

              <option
                value="Staging"
                className="bg-slate-950 text-white"
              >
                Staging
              </option>

              <option
                value="Production"
                className="bg-slate-950 text-white"
              >
                Production
              </option>
            </select>
          </SelectContainer>
        </div>

        <div>
          <label
            htmlFor="generate-for"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Generate For
          </label>

          <SelectContainer>
            <select
              id="generate-for"
              value={generateFor}
              onChange={(
                event: ChangeEvent<HTMLSelectElement>,
              ) =>
                onGenerateForChange(
                  event.target.value as
                    | "all"
                    | "individual",
                )
              }
              className={selectClassName}
            >
              <option
                value="all"
                className="bg-slate-950 text-white"
              >
                All Developers
              </option>

              <option
                value="individual"
                className="bg-slate-950 text-white"
              >
                Individual Developer
              </option>
            </select>
          </SelectContainer>
        </div>

        {generateFor === "individual" && (
          <div>
            <label
              htmlFor="release-developer"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Developer
            </label>

            <SelectContainer>
              <select
                id="release-developer"
                value={selectedAuthor}
                onChange={(event) =>
                  onAuthorChange(
                    event.target.value,
                  )
                }
                className={selectClassName}
              >
                <option
                  value=""
                  disabled
                  className="bg-slate-950 text-slate-500"
                >
                  Select Developer
                </option>

                {authors.map((author) => (
                  <option
                    key={author}
                    value={author}
                    className="bg-slate-950 text-white"
                  >
                    {author}
                  </option>
                ))}
              </select>
            </SelectContainer>

            <p className="mt-2 text-xs text-slate-500">
              Only commits from the selected
              contributor will be included.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
