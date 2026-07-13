import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import BranchSelector from "../components/dashboard/BranchSelector";
import CommitList from "../components/dashboard/CommitList";
import GenerateButton from "../components/dashboard/GenerateButton";
import ReleaseGenerationLoader from "../components/dashboard/ReleaseGenerationLoader";
import ReleaseConfiguration from "../components/dashboard/ReleaseConfiguration";
import EditableReleasePreview from "../components/dashboard/EditableReleasePreview";
import RepositorySelector from "../components/dashboard/RepositorySelector";
import ReleaseSaveActions from "../components/release/ReleaseSaveActions";

import { useAuth } from "../context/AuthContext";

import { getRepositories } from "../services/github";
import { generateReleaseNotes } from "../services/release";

import {
  createSavedRelease,
  getSavedRelease,
  updateSavedRelease,
} from "../services/savedRelease";

import type {
  Commit,
  Repository,
} from "../types/github";

import type {
  ReleaseNotes,
} from "../types/release";

import type {
  SavedReleaseCreateInput,
  SavedReleaseStatus,
} from "../types/savedRelease";

import {
  isAdvancedCommitRange,
  type AdvancedCommitRange,
} from "../utils/advancedCommitRange";


function haveSameCommitIds(
  currentIds: string[],
  nextIds: string[],
): boolean {
  if (
    currentIds.length !==
    nextIds.length
  ) {
    return false;
  }

  const currentIdSet =
    new Set(currentIds);

  return nextIds.every(
    (commitId) =>
      currentIdSet.has(commitId),
  );
}


function getConfigurationTitle(
  title: string,
  version: string,
): string {
  const trimmedVersion =
    version.trim();

  if (!trimmedVersion) {
    return title;
  }

  const suffix =
    ` ${trimmedVersion}`;

  return title.endsWith(suffix)
    ? title.slice(
        0,
        -suffix.length,
      )
    : title;
}


function normalizeAuthorName(
  value: string,
): string {
  return value
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s._-]+/g, "");
}


function toDateInputValue(
  value: string | null,
): string {
  return value
    ? value.slice(0, 10)
    : "";
}


function toUtcDateBoundary(
  value: string,
  endOfDay: boolean,
): string | null {
  if (!value) {
    return null;
  }

  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const date = new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date.toISOString();
}


export default function Dashboard() {
  const {
    token,
    user,
    logout,
  } = useAuth();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const resumeReleaseId =
    searchParams.get("releaseId");


  const [
    repositories,
    setRepositories,
  ] = useState<Repository[]>([]);


  const [
    repositoriesLoading,
    setRepositoriesLoading,
  ] = useState(true);


  const [
    repositoriesError,
    setRepositoriesError,
  ] = useState("");


  const [
    repositoryFullName,
    setRepositoryFullName,
  ] = useState("");


  const [branch, setBranch] =
    useState("");


  const [
    commitRange,
    setCommitRange,
  ] = useState<AdvancedCommitRange>(
    "all",
  );


  const [
    dateFrom,
    setDateFrom,
  ] = useState("");


  const [
    dateTo,
    setDateTo,
  ] = useState("");


  const [
    selectedCommits,
    setSelectedCommits,
  ] = useState<Commit[]>([]);

  const [
    initialSelectedCommits,
    setInitialSelectedCommits,
  ] = useState<Commit[]>([]);

  const selectedCommitIdsRef =
    useRef<string[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    generationError,
    setGenerationError,
  ] = useState("");


  const [
    releaseNotes,
    setReleaseNotes,
  ] = useState<ReleaseNotes | null>(
    null,
  );


  const [
    releaseTitle,
    setReleaseTitle,
  ] = useState("Weekly Release");


  const [
    version,
    setVersion,
  ] = useState("v1.0.0");


  const [
    environment,
    setEnvironment,
  ] = useState("Development");


  const [
    generateFor,
    setGenerateFor,
  ] = useState<
    "all" | "individual"
  >("all");


  const [
    selectedAuthor,
    setSelectedAuthor,
  ] = useState("");

  const [
    savedReleaseId,
    setSavedReleaseId,
  ] = useState<number | null>(null);

  const [
    savedReleaseStatus,
    setSavedReleaseStatus,
  ] = useState<SavedReleaseStatus | null>(
    null,
  );

  const [
    saveLoading,
    setSaveLoading,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState("");

  const [
    savedAt,
    setSavedAt,
  ] = useState("");

  const [
    hasUnsavedChanges,
    setHasUnsavedChanges,
  ] = useState(false);

  const [
    resumeLoading,
    setResumeLoading,
  ] = useState(
    Boolean(resumeReleaseId),
  );

  const [
    resumeError,
    setResumeError,
  ] = useState("");


  useEffect(() => {
    let active = true;


    async function loadRepositories() {
      setRepositoriesLoading(true);

      setRepositoriesError("");


      try {
        const data =
          await getRepositories(token);


        if (!active) {
          return;
        }


        setRepositories(data);
      } catch (requestError) {
        if (!active) {
          return;
        }


        setRepositories([]);


        setRepositoriesError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load repositories.",
        );
      } finally {
        if (active) {
          setRepositoriesLoading(false);
        }
      }
    }


    void loadRepositories();


    return () => {
      active = false;
    };
  }, [token]);


  useEffect(() => {
    if (!resumeReleaseId) {
      setResumeLoading(false);
      setResumeError("");
      return;
    }

    if (!user) {
      return;
    }

    const ownerLogin =
      user.login;

    const releaseId =
      Number(resumeReleaseId);

    if (
      !Number.isInteger(releaseId) ||
      releaseId <= 0
    ) {
      setResumeLoading(false);

      setResumeError(
        "The saved release ID is invalid.",
      );

      return;
    }

    let active = true;

    async function resumeSavedRelease() {
      setResumeLoading(true);
      setResumeError("");

      try {
        const savedRelease =
          await getSavedRelease(
            releaseId,
            ownerLogin,
          );

        if (!active) {
          return;
        }

        if (
          savedRelease.experienceMode !==
          "advanced"
        ) {
          throw new Error(
            "This release belongs to the " +
            "Lite workspace.",
          );
        }

        selectedCommitIdsRef.current = [
          ...savedRelease.selectedCommitIds,
        ];

        setInitialSelectedCommits([
          ...savedRelease.selectedCommits,
        ]);

        setSelectedCommits([
          ...savedRelease.selectedCommits,
        ]);

        setRepositoryFullName(
          savedRelease.repository,
        );

        setBranch(
          savedRelease.branch,
        );

        const restoredRange =
          isAdvancedCommitRange(
            savedRelease.releaseRange,
          )
            ? savedRelease.releaseRange
            : "all";

        setCommitRange(
          restoredRange,
        );

        setDateFrom(
          restoredRange === "custom"
            ? toDateInputValue(
                savedRelease.dateFrom,
              )
            : "",
        );

        setDateTo(
          restoredRange === "custom"
            ? toDateInputValue(
                savedRelease.dateTo,
              )
            : "",
        );

        setReleaseTitle(
          getConfigurationTitle(
            savedRelease.title,
            savedRelease.version,
          ),
        );

        setVersion(
          savedRelease.version,
        );

        setEnvironment(
          savedRelease.environment,
        );

        setGenerateFor(
          savedRelease.generateFor,
        );

        setSelectedAuthor(
          savedRelease.selectedAuthor,
        );

        setReleaseNotes({
          title: savedRelease.title,
          summary: savedRelease.summary,

          features: [
            ...savedRelease.features,
          ],

          fixes: [
            ...savedRelease.fixes,
          ],

          improvements: [
            ...savedRelease.improvements,
          ],

          documentation: [
            ...savedRelease.documentation,
          ],

          maintenance: [
            ...savedRelease.maintenance,
          ],

          contributors: [
            ...savedRelease.contributors,
          ],

          totalCommits:
            savedRelease.totalCommits,
        });

        setSavedReleaseId(
          savedRelease.id,
        );

        setSavedReleaseStatus(
          savedRelease.status,
        );

        setSavedAt(
          savedRelease.updatedAt,
        );

        setHasUnsavedChanges(false);

        setLoading(false);
        setGenerationError("");

        setSaveLoading(false);
        setSaveError("");
      } catch (requestError) {
        if (!active) {
          return;
        }

        setResumeError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to resume the release.",
        );
      } finally {
        if (active) {
          setResumeLoading(false);
        }
      }
    }

    void resumeSavedRelease();

    return () => {
      active = false;
    };
  }, [
    user,
    resumeReleaseId,
  ]);


  const selectedRepository =
    useMemo(() => {
      return repositories.find(
        (repository) =>
          repository.fullName ===
          repositoryFullName,
      );
    }, [
      repositories,
      repositoryFullName,
    ]);


  const authors = useMemo(() => {
    const groups = new Map<
      string,
      Map<string, number>
    >();

    for (const commit of selectedCommits) {
      const displayName =
        commit.author.trim() ||
        commit.authorEmail.trim() ||
        "Unknown author";

      const identity =
        normalizeAuthorName(displayName);

      if (!identity) {
        continue;
      }

      const variants =
        groups.get(identity) ??
        new Map<string, number>();

      variants.set(
        displayName,
        (variants.get(displayName) ?? 0) + 1,
      );

      groups.set(identity, variants);
    }

    return Array.from(groups.values())
      .map((variants) => {
        return (
          Array.from(variants.entries())
            .sort(
              (
                [nameA, countA],
                [nameB, countB],
              ) =>
                countB - countA ||
                nameA.localeCompare(nameB),
            )[0]?.[0] ?? "Unknown author"
        );
      })
      .sort((nameA, nameB) =>
        nameA.localeCompare(nameB),
      );
  }, [selectedCommits]);


  useEffect(() => {
    if (
      selectedAuthor &&
      !authors.includes(selectedAuthor)
    ) {
      setSelectedAuthor("");
    }
  }, [
    authors,
    selectedAuthor,
  ]);


  function resetGeneratedRelease() {
    setReleaseNotes(null);
    setGenerationError("");
  }

  function resetSavedReleaseIdentity() {
    setSavedReleaseId(null);
    setSavedReleaseStatus(null);

    setSaveLoading(false);
    setSaveError("");

    setSavedAt("");
    setHasUnsavedChanges(false);
  }

  function resetAdvancedResult() {
    resetGeneratedRelease();
    resetSavedReleaseIdentity();
  }

  function handleReleaseNotesChange(
    nextReleaseNotes: ReleaseNotes,
  ) {
    setReleaseNotes(nextReleaseNotes);
    setHasUnsavedChanges(true);
    setSaveError("");
  }

  const handleCommitSelectionChange =
    useCallback(
      (
        nextCommits: Commit[],
      ) => {
        const nextCommitIds =
          nextCommits.map(
            (commit) => commit.id,
          );

        const selectionUnchanged =
          haveSameCommitIds(
            selectedCommitIdsRef.current,
            nextCommitIds,
          );

        selectedCommitIdsRef.current = [
          ...nextCommitIds,
        ];

        setSelectedCommits(
          nextCommits,
        );

        if (selectionUnchanged) {
          return;
        }

        setSelectedAuthor("");

        resetGeneratedRelease();

        setSaveLoading(false);
        setSaveError("");

        setHasUnsavedChanges(true);
      },
      [],
    );


  function handleCommitRangeChange(
    nextRange: AdvancedCommitRange,
    nextDateFrom: string,
    nextDateTo: string,
  ) {
    setCommitRange(
      nextRange,
    );

    setDateFrom(
      nextDateFrom,
    );

    setDateTo(
      nextDateTo,
    );

    setSelectedCommits([]);
    setInitialSelectedCommits([]);

    selectedCommitIdsRef.current = [];

    setSelectedAuthor("");

    resetGeneratedRelease();

    setSaveLoading(false);
    setSaveError("");

    setHasUnsavedChanges(true);
  }


  function handleRepositoryChange(
    fullName: string,
  ) {
    const repository =
      repositories.find(
        (item) =>
          item.fullName === fullName,
      );


    setRepositoryFullName(fullName);


    setBranch(
      repository?.defaultBranch ?? "",
    );

    setCommitRange("all");
    setDateFrom("");
    setDateTo("");


    setSelectedCommits([]);
    setInitialSelectedCommits([]);

    selectedCommitIdsRef.current = [];

    setSelectedAuthor("");

    setSearchParams(
      {},
      {
        replace: true,
      },
    );

    resetAdvancedResult();
  }


  function handleBranchChange(
    nextBranch: string,
  ) {
    setBranch(nextBranch);

    setCommitRange("all");
    setDateFrom("");
    setDateTo("");

    setSelectedCommits([]);
    setInitialSelectedCommits([]);

    selectedCommitIdsRef.current = [];

    setSelectedAuthor("");

    setSearchParams(
      {},
      {
        replace: true,
      },
    );

    resetAdvancedResult();
  }


  async function handleGenerate() {
    if (
      !selectedRepository ||
      !branch ||
      selectedCommits.length === 0
    ) {
      return;
    }


    if (
      generateFor === "individual" &&
      !selectedAuthor
    ) {
      return;
    }


    setLoading(true);

    setGenerationError("");

    setReleaseNotes(null);


    try {
      const notes =
        await generateReleaseNotes({
          repository:
            selectedRepository.fullName,

          branch,

          title: releaseTitle,

          version,

          environment,

          generateFor,

          selectedAuthor,

          commits: selectedCommits,
        });


      setReleaseNotes(notes);
      setHasUnsavedChanges(true);
      setSaveError("");
    } catch (requestError) {
      setGenerationError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate release notes.",
      );
    } finally {
      setLoading(false);
    }
  }


  async function saveAdvancedRelease(
    nextStatus: SavedReleaseStatus,
  ) {
    if (
      !user ||
      !repositoryFullName ||
      !branch ||
      !releaseNotes ||
      selectedCommits.length === 0
    ) {
      return;
    }

    const releaseData: Omit<
      SavedReleaseCreateInput,
      "ownerLogin"
    > = {
      experienceMode: "advanced",
      selectionMode: "manual",
      status: nextStatus,

      repository:
        repositoryFullName,

      branch,

      title:
        releaseNotes.title.trim(),

      version: version.trim(),
      environment,

      generateFor,
      selectedAuthor:
        generateFor === "individual"
          ? selectedAuthor
          : "",

      releaseRange: commitRange,

      dateFrom:
        commitRange === "custom"
          ? toUtcDateBoundary(
              dateFrom,
              false,
            )
          : null,

      dateTo:
        commitRange === "custom"
          ? toUtcDateBoundary(
              dateTo,
              true,
            )
          : null,

      summary: releaseNotes.summary,
      features: releaseNotes.features,
      fixes: releaseNotes.fixes,

      improvements:
        releaseNotes.improvements,

      documentation:
        releaseNotes.documentation,

      maintenance:
        releaseNotes.maintenance,

      contributors:
        releaseNotes.contributors,

      selectedCommitIds:
        selectedCommits.map(
          (commit) => commit.id,
        ),

      selectedCommits,

      totalCommits:
        selectedCommits.length,
    };

    setSaveLoading(true);
    setSaveError("");

    try {
      const savedRelease =
        savedReleaseId === null
          ? await createSavedRelease({
              ownerLogin: user.login,
              ...releaseData,
            })
          : await updateSavedRelease(
              savedReleaseId,
              user.login,
              releaseData,
            );

      setSavedReleaseId(
        savedRelease.id,
      );

      setSavedReleaseStatus(
        savedRelease.status,
      );

      setSavedAt(
        savedRelease.updatedAt,
      );

      setHasUnsavedChanges(false);
    } catch (requestError) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save the release.",
      );
    } finally {
      setSaveLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />


      <main className="mx-auto max-w-7xl px-8 py-14">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Release Generator
            </h1>


            <p className="mt-2 text-slate-400">
              Generate release notes from live
              GitHub repositories and commits.
            </p>
          </div>


          <div className="flex items-center gap-4">
            <Link
              to="/lite"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white md:inline-flex"
            >
              Lite
            </Link>

            <Link
              to="/history"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              History
            </Link>

            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.login}
                className="h-10 w-10 rounded-full border border-white/10"
              />
            )}


            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.name || user?.login}
              </p>


              <p className="text-xs text-slate-500">
                @{user?.login}
              </p>
            </div>


            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Disconnect
            </button>
          </div>
        </div>


        {resumeError && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-5 py-4 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {resumeError}
          </div>
        )}

        {resumeLoading && (
          <section className="mb-8 flex min-h-52 items-center justify-center rounded-2xl border border-cyan-400/15 bg-slate-900/60 p-8">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-cyan-300" />

              <h2 className="mt-5 text-xl font-bold text-white">
                Loading saved release
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Restoring its configuration,
                commits and generated notes.
              </p>
            </div>
          </section>
        )}

        <div
          className={
            resumeLoading
              ? "hidden"
              : "grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          }
        >
          <div className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/50 p-8">
            <RepositorySelector
              repositories={repositories}
              loading={repositoriesLoading}
              error={repositoriesError}
              value={repositoryFullName}
              onChange={
                handleRepositoryChange
              }
            />


            <BranchSelector
              token={token}
              repositoryFullName={
                repositoryFullName
              }
              value={branch}
              onChange={handleBranchChange}
            />


            <CommitList
              token={token}
              repositoryFullName={
                repositoryFullName
              }
              branch={branch}
              range={commitRange}
              dateFrom={dateFrom}
              dateTo={dateTo}
              initialSelectedCommits={
                initialSelectedCommits
              }
              onRangeChange={
                handleCommitRangeChange
              }
              onSelectionChange={
                handleCommitSelectionChange
              }
            />


            <ReleaseConfiguration
              title={releaseTitle}
              version={version}
              environment={environment}
              generateFor={generateFor}
              selectedAuthor={
                selectedAuthor
              }
              authors={authors}
              onTitleChange={
                setReleaseTitle
              }
              onVersionChange={
                setVersion
              }
              onEnvironmentChange={
                setEnvironment
              }
              onGenerateForChange={
                setGenerateFor
              }
              onAuthorChange={
                setSelectedAuthor
              }
            />


            {generationError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {generationError}
              </div>
            )}


            <GenerateButton
              loading={loading}
              disabled={
                !selectedRepository ||
                !branch ||
                selectedCommits.length ===
                  0 ||
                (
                  generateFor ===
                    "individual" &&
                  !selectedAuthor
                )
              }
              onClick={handleGenerate}
            />
          </div>


          {loading ? (
            <ReleaseGenerationLoader
              repository={
                selectedRepository?.fullName ??
                repositoryFullName
              }
              commitCount={
                selectedCommits.length
              }
              mode={generateFor}
              developer={selectedAuthor}
            />
          ) : (
            <div className="space-y-5">
              {releaseNotes && (
                <ReleaseSaveActions
                  status={
                    savedReleaseStatus
                  }
                  saving={saveLoading}
                  error={saveError}
                  hasUnsavedChanges={
                    hasUnsavedChanges
                  }
                  savedAt={savedAt}
                  onSaveDraft={() =>
                    void saveAdvancedRelease(
                      "draft",
                    )
                  }
                  onSaveFinal={() =>
                    void saveAdvancedRelease(
                      "final",
                    )
                  }
                />
              )}

              <EditableReleasePreview
                releaseNotes={releaseNotes}
                onChange={
                  handleReleaseNotesChange
                }
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
