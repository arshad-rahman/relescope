import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import BeautifulSelect from "../ui/BeautifulSelect";

import { getCommits } from "../../services/github";

import type { Commit } from "../../types/github";

type Props = {
  token: string;
  repositoryFullName: string;
  branch: string;
  onSelectionChange: (commits: Commit[]) => void;
};

type AuthorOption = {
  value: string;
  label: string;
};

function getAuthorIdentity(
  author: string,
  authorEmail: string,
): string {
  const normalizedName = author
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s._-]+/g, "");

  if (normalizedName) {
    return `name:${normalizedName}`;
  }

  return `email:${authorEmail
    .trim()
    .toLocaleLowerCase()}`;
}

export default function CommitList({
  token,
  repositoryFullName,
  branch,
  onSelectionChange,
}: Props) {
  const [commits, setCommits] =
    useState<Commit[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [authorFilter, setAuthorFilter] =
    useState("all");

  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadCommits() {
      if (
        !token ||
        !repositoryFullName ||
        !branch
      ) {
        setCommits([]);
        setLoading(false);
        setError("");
        setAuthorFilter("all");
        setSearch("");
        setSelectedIds([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getCommits(
          token,
          repositoryFullName,
          branch,
        );

        if (!active) {
          return;
        }

        setCommits(data);
        setAuthorFilter("all");
        setSearch("");
        setSelectedIds([]);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setCommits([]);
        setSelectedIds([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load commits.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCommits();

    return () => {
      active = false;
    };
  }, [
    token,
    repositoryFullName,
    branch,
  ]);

  const authorOptions =
    useMemo<AuthorOption[]>(() => {
      const authorGroups = new Map<
        string,
        Map<string, number>
      >();

      for (const commit of commits) {
        const identity = getAuthorIdentity(
          commit.author,
          commit.authorEmail,
        );

        const displayName =
          commit.author.trim() ||
          commit.authorEmail.trim() ||
          "Unknown author";

        const names =
          authorGroups.get(identity) ??
          new Map<string, number>();

        names.set(
          displayName,
          (names.get(displayName) ?? 0) + 1,
        );

        authorGroups.set(identity, names);
      }

      return Array.from(
        authorGroups.entries(),
      )
        .map(([value, names]) => {
          const label =
            Array.from(names.entries())
              .sort(
                (
                  [nameA, countA],
                  [nameB, countB],
                ) =>
                  countB - countA ||
                  nameA.localeCompare(nameB),
              )[0]?.[0] ?? "Unknown author";

          return {
            value,
            label,
          };
        })
        .sort((optionA, optionB) =>
          optionA.label.localeCompare(
            optionB.label,
          ),
        );
    }, [commits]);

  const visibleCommits = useMemo(() => {
    const query = search.trim().toLowerCase();

    return commits.filter((commit) => {
      const matchesAuthor =
        authorFilter === "all" ||
        getAuthorIdentity(
          commit.author,
          commit.authorEmail,
        ) === authorFilter;

      const matchesSearch =
        !query ||
        commit.message
          .toLowerCase()
          .includes(query) ||
        commit.author
          .toLowerCase()
          .includes(query) ||
        commit.authorEmail
          .toLowerCase()
          .includes(query) ||
        commit.id
          .toLowerCase()
          .includes(query);

      return matchesAuthor && matchesSearch;
    });
  }, [
    commits,
    authorFilter,
    search,
  ]);

  const visibleIds = useMemo(() => {
    return visibleCommits.map(
      (commit) => commit.id,
    );
  }, [visibleCommits]);

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) =>
      selectedIds.includes(id),
    );

  const selectedCommits = useMemo(() => {
    return commits.filter((commit) =>
      selectedIds.includes(commit.id),
    );
  }, [commits, selectedIds]);

  useEffect(() => {
    onSelectionChange(selectedCommits);
  }, [
    selectedCommits,
    onSelectionChange,
  ]);

  function handleCommitToggle(
    commitId: string,
  ) {
    setSelectedIds((previous) =>
      previous.includes(commitId)
        ? previous.filter(
            (id) => id !== commitId,
          )
        : [...previous, commitId],
    );
  }

  function handleToggleAllVisible() {
    if (visibleIds.length === 0) {
      return;
    }

    setSelectedIds((previous) =>
      allVisibleSelected
        ? previous.filter(
            (id) => !visibleIds.includes(id),
          )
        : Array.from(
            new Set([
              ...previous,
              ...visibleIds,
            ]),
          ),
    );
  }

  function handleAuthorChange(
    value: string,
  ) {
    setAuthorFilter(value);
    setSelectedIds([]);
  }

  function handleSearchChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setSearch(event.target.value);
    setSelectedIds([]);
  }

  function formatCommitDate(
    date: string,
  ): string {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return date;
    }

    return parsedDate.toLocaleString();
  }

  if (!repositoryFullName || !branch) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-slate-500">
        Select a repository and branch to view commits.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 p-6 text-center text-slate-400">
        Loading live GitHub commits...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-white/10 bg-slate-900/60">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold text-white">
            Recent Commits
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {commits.length} live commits loaded
            from {branch}.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:w-[28rem] sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Author
            </label>

            <BeautifulSelect
              id="commit-author-filter"
              value={authorFilter}
              options={[
                {
                  value: "all",
                  label: "All authors",
                },
                ...authorOptions,
              ]}
              placeholder="Select author"
              ariaLabel="Filter commits by author"
              onValueChange={
                handleAuthorChange
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Message, author or SHA..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 px-5 py-4">
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={handleToggleAllVisible}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900"
          />

          Select all visible commits
        </label>
      </div>

      {visibleCommits.length === 0 ? (
        <div className="px-5 py-8 text-center text-slate-500">
          No commits match the selected filters.
        </div>
      ) : (
        <div className="max-h-[36rem] divide-y divide-white/10 overflow-y-auto">
          {visibleCommits.map((commit) => {
            const checked =
              selectedIds.includes(commit.id);

            return (
              <label
                key={commit.id}
                className="flex cursor-pointer items-start gap-4 px-5 py-4 transition hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    handleCommitToggle(
                      commit.id,
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900"
                />

                <div className="min-w-0 flex-1">
                  <div className="whitespace-pre-wrap font-medium text-white">
                    {commit.message}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-400">
                    <span>
                      {commit.author}
                    </span>

                    {commit.authorEmail && (
                      <>
                        <span>•</span>
                        <span>
                          {commit.authorEmail}
                        </span>
                      </>
                    )}

                    <span>•</span>

                    <span>
                      {formatCommitDate(
                        commit.date,
                      )}
                    </span>

                    <span>•</span>

                    <code className="text-cyan-400">
                      {commit.id.slice(0, 7)}
                    </code>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      <div className="border-t border-white/10 px-5 py-4 text-sm text-slate-300">
        {selectedCommits.length} commit
        {selectedCommits.length === 1
          ? ""
          : "s"}{" "}
        selected
      </div>
    </div>
  );
}
