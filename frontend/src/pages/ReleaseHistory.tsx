import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  FileClock,
  GitBranch,
  GitCommit,
  History,
  LoaderCircle,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Background from "../components/layout/Background";

import EditableReleasePreview from "../components/dashboard/EditableReleasePreview";

import {
  useAuth,
} from "../context/AuthContext";

import {
  deleteSavedRelease,
  listSavedReleases,
  updateSavedRelease,
} from "../services/savedRelease";

import type {
  ReleaseNotes,
} from "../types/release";

import type {
  SavedRelease,
  SavedReleaseExperienceMode,
  SavedReleaseStatus,
} from "../types/savedRelease";


type StatusFilter =
  | "all"
  | SavedReleaseStatus;

type ModeFilter =
  | "all"
  | SavedReleaseExperienceMode;


function toReleaseNotes(
  release: SavedRelease,
): ReleaseNotes {
  return {
    title: release.title,
    summary: release.summary,

    features: [
      ...release.features,
    ],

    fixes: [
      ...release.fixes,
    ],

    improvements: [
      ...release.improvements,
    ],

    documentation: [
      ...release.documentation,
    ],

    maintenance: [
      ...release.maintenance,
    ],

    contributors: [
      ...release.contributors,
    ],

    totalCommits:
      release.totalCommits,
  };
}


function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}


function statusClasses(
  status: SavedReleaseStatus,
): string {
  switch (status) {
    case "draft":
      return (
        "border-amber-400/20 " +
        "bg-amber-400/[0.08] " +
        "text-amber-300"
      );

    case "final":
      return (
        "border-emerald-400/20 " +
        "bg-emerald-400/[0.08] " +
        "text-emerald-300"
      );

    case "published":
      return (
        "border-violet-400/20 " +
        "bg-violet-400/[0.08] " +
        "text-violet-300"
      );
  }
}


export default function ReleaseHistory() {
  const {
    user,
    logout,
  } = useAuth();

  const [
    releases,
    setReleases,
  ] = useState<SavedRelease[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");

  const [
    modeFilter,
    setModeFilter,
  ] = useState<ModeFilter>("all");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    selectedRelease,
    setSelectedRelease,
  ] = useState<SavedRelease | null>(
    null,
  );

  const [
    detailNotes,
    setDetailNotes,
  ] = useState<ReleaseNotes | null>(
    null,
  );

  const [
    detailStatus,
    setDetailStatus,
  ] = useState<SavedReleaseStatus>(
    "draft",
  );

  const [
    detailDirty,
    setDetailDirty,
  ] = useState(false);

  const [
    detailSaving,
    setDetailSaving,
  ] = useState(false);

  const [
    detailError,
    setDetailError,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(
    null,
  );


  const loadReleases =
    useCallback(async () => {
      if (!user) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result =
          await listSavedReleases(
            user.login,
            {
              status:
                statusFilter === "all"
                  ? undefined
                  : statusFilter,

              experienceMode:
                modeFilter === "all"
                  ? undefined
                  : modeFilter,

              limit: 100,
              offset: 0,
            },
          );

        setReleases(result.items);
      } catch (requestError) {
        setReleases([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load release history.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      user,
      statusFilter,
      modeFilter,
    ]);


  useEffect(() => {
    void loadReleases();
  }, [loadReleases]);


  const visibleReleases =
    useMemo(() => {
      const normalizedQuery =
        searchQuery
          .trim()
          .toLocaleLowerCase();

      if (!normalizedQuery) {
        return releases;
      }

      return releases.filter(
        (release) => {
          return (
            release.title
              .toLocaleLowerCase()
              .includes(
                normalizedQuery,
              ) ||
            release.repository
              .toLocaleLowerCase()
              .includes(
                normalizedQuery,
              ) ||
            release.branch
              .toLocaleLowerCase()
              .includes(
                normalizedQuery,
              )
          );
        },
      );
    }, [
      releases,
      searchQuery,
    ]);


  function openRelease(
    release: SavedRelease,
  ) {
    setSelectedRelease(release);

    setDetailNotes(
      toReleaseNotes(release),
    );

    setDetailStatus(
      release.status,
    );

    setDetailDirty(false);
    setDetailError("");
  }


  function handleNotesChange(
    notes: ReleaseNotes,
  ) {
    setDetailNotes(notes);
    setDetailDirty(true);
    setDetailError("");
  }


  function handleStatusChange(
    status: SavedReleaseStatus,
  ) {
    setDetailStatus(status);
    setDetailDirty(true);
    setDetailError("");
  }


  async function saveReleaseChanges() {
    if (
      !user ||
      !selectedRelease ||
      !detailNotes
    ) {
      return;
    }

    setDetailSaving(true);
    setDetailError("");

    try {
      const updatedRelease =
        await updateSavedRelease(
          selectedRelease.id,
          user.login,
          {
            status: detailStatus,

            title:
              detailNotes.title,

            summary:
              detailNotes.summary,

            features:
              detailNotes.features,

            fixes:
              detailNotes.fixes,

            improvements:
              detailNotes.improvements,

            documentation:
              detailNotes.documentation,

            maintenance:
              detailNotes.maintenance,

            contributors:
              detailNotes.contributors,
          },
        );

      setSelectedRelease(
        updatedRelease,
      );

      setDetailNotes(
        toReleaseNotes(
          updatedRelease,
        ),
      );

      setDetailStatus(
        updatedRelease.status,
      );

      setDetailDirty(false);

      setReleases(
        (currentReleases) =>
          currentReleases.map(
            (release) =>
              release.id ===
              updatedRelease.id
                ? updatedRelease
                : release,
          ),
      );
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update the release.",
      );
    } finally {
      setDetailSaving(false);
    }
  }


  async function handleDelete(
    release: SavedRelease,
  ) {
    if (!user) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${release.title}"? ` +
        "This action cannot be undone.",
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(release.id);
    setError("");

    try {
      await deleteSavedRelease(
        release.id,
        user.login,
      );

      setReleases(
        (currentReleases) =>
          currentReleases.filter(
            (item) =>
              item.id !== release.id,
          ),
      );

      if (
        selectedRelease?.id ===
        release.id
      ) {
        setSelectedRelease(null);
        setDetailNotes(null);
        setDetailDirty(false);
        setDetailError("");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete the release.",
      );
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      <Background />

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xl font-bold transition hover:text-cyan-300"
            >
              Relescope
            </Link>

            <span className="rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
              History
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/lite"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Lite
            </Link>

            <Link
              to="/dashboard"
              className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white sm:inline-flex"
            >
              Advanced
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Disconnect
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-sm font-medium text-violet-300">
                <History className="h-4 w-4" />
                Shared release history
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                Saved releases
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Review and manage releases created
                from both Lite and Advanced workflows.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                void loadReleases()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-wait disabled:opacity-50"
            >
              <RefreshCw
                className={
                  loading
                    ? "h-4 w-4 animate-spin"
                    : "h-4 w-4"
                }
              />
              Refresh
            </button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_170px_170px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                placeholder="Search title, repository or branch"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
              />
            </label>

            <select
              value={modeFilter}
              onChange={(event) =>
                setModeFilter(
                  event.target
                    .value as ModeFilter,
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="all">
                All modes
              </option>

              <option value="lite">
                Lite
              </option>

              <option value="advanced">
                Advanced
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="all">
                All statuses
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="final">
                Final
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">
                  Releases
                </h2>

                <span className="text-sm text-slate-500">
                  {visibleReleases.length}
                  {" "}
                  {visibleReleases.length === 1
                    ? "record"
                    : "records"}
                </span>
              </div>

              {loading ? (
                <div className="flex min-h-72 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/60">
                  <div className="text-center">
                    <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-cyan-300" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading release history...
                    </p>
                  </div>
                </div>
              ) : visibleReleases.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
                  <FileClock className="mx-auto h-9 w-9 text-slate-600" />

                  <h3 className="mt-4 font-semibold text-white">
                    No saved releases found
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Save a release from Lite or
                    Advanced to see it here.
                  </p>
                </div>
              ) : (
                visibleReleases.map(
                  (release) => {
                    const selected =
                      selectedRelease?.id ===
                      release.id;

                    return (
                      <article
                        key={release.id}
                        className={
                          selected
                            ? "rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.06] p-5"
                            : "rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 transition hover:border-white/15"
                        }
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClasses(
                                  release.status,
                                )}`}
                              >
                                {release.status}
                              </span>

                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                                {release.experienceMode}
                              </span>
                            </div>

                            <h3 className="mt-4 truncate text-lg font-bold text-white">
                              {release.title}
                            </h3>

                            <p className="mt-2 truncate text-sm text-slate-500">
                              {release.repository}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              release.id
                            }
                            onClick={() =>
                              void handleDelete(
                                release,
                              )
                            }
                            aria-label={`Delete ${release.title}`}
                            className="rounded-xl border border-red-400/15 bg-red-400/[0.06] p-2.5 text-red-300 transition hover:bg-red-400/10 disabled:cursor-wait disabled:opacity-50"
                          >
                            {deletingId ===
                            release.id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <GitBranch className="h-3.5 w-3.5" />
                            {release.branch}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <GitCommit className="h-3.5 w-3.5" />
                            {release.totalCommits}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {formatDate(
                              release.updatedAt,
                            )}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              openRelease(
                                release,
                              )
                            }
                            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                          >
                            Open release
                          </button>

                          <Link
                            to={
                              release.experienceMode ===
                              "lite"
                                ? `/lite?releaseId=${release.id}`
                                : `/dashboard?releaseId=${release.id}`
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                          >
                            Continue in{" "}
                            {release.experienceMode ===
                            "lite"
                              ? "Lite"
                              : "Advanced"}

                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    );
                  },
                )
              )}
            </section>

            <section>
              {!selectedRelease ||
              !detailNotes ? (
                <div className="flex min-h-[32rem] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
                  <div>
                    <History className="mx-auto h-10 w-10 text-slate-600" />

                    <h2 className="mt-5 text-xl font-bold">
                      Select a release
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Open a saved release to inspect,
                      edit, change its status or export it.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                          Selected release
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          Updated{" "}
                          {formatDate(
                            selectedRelease.updatedAt,
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                          value={detailStatus}
                          onChange={(event) =>
                            handleStatusChange(
                              event.target
                                .value as SavedReleaseStatus,
                            )
                          }
                          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500"
                        >
                          <option value="draft">
                            Draft
                          </option>

                          <option value="final">
                            Final
                          </option>

                          <option value="published">
                            Published
                          </option>
                        </select>

                        <button
                          type="button"
                          disabled={
                            detailSaving ||
                            !detailDirty
                          }
                          onClick={() =>
                            void saveReleaseChanges()
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {detailSaving ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}

                          Save changes
                        </button>
                      </div>
                    </div>

                    {detailDirty && (
                      <p className="mt-3 text-xs text-amber-300">
                        This release has unsaved changes.
                      </p>
                    )}

                    {detailError && (
                      <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
                        {detailError}
                      </div>
                    )}
                  </section>

                  <EditableReleasePreview
                    releaseNotes={
                      detailNotes
                    }
                    onChange={
                      handleNotesChange
                    }
                  />
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
