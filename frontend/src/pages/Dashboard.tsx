import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
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


function normalizeAuthorName(
  value: string,
): string {
  return value
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s._-]+/g, "");
}


export default function Dashboard() {
  const {
    token,
    user,
    logout,
  } = useAuth();


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
    selectedCommits,
    setSelectedCommits,
  ] = useState<Commit[]>([]);


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
        setSelectedCommits(
          nextCommits,
        );

        setSelectedAuthor("");

        resetGeneratedRelease();

        setSavedReleaseId(null);
        setSavedReleaseStatus(null);

        setSaveLoading(false);
        setSaveError("");

        setSavedAt("");
        setHasUnsavedChanges(false);
      },
      [],
    );


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


    setSelectedCommits([]);

    setSelectedAuthor("");

    resetAdvancedResult();
  }


  function handleBranchChange(
    nextBranch: string,
  ) {
    setBranch(nextBranch);

    setSelectedCommits([]);

    setSelectedAuthor("");

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
      !selectedRepository ||
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
        selectedRepository.fullName,

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

      releaseRange: null,
      dateFrom: null,
      dateTo: null,

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


        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
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
