import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  LoaderCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Background from "../components/layout/Background";

import LiteGenerationStep from "../components/lite/LiteGenerationStep";
import LiteRangeStep from "../components/lite/LiteRangeStep";
import LiteRepositoryStep from "../components/lite/LiteRepositoryStep";
import LiteReviewStep from "../components/lite/LiteReviewStep";
import LiteStepProgress from "../components/lite/LiteStepProgress";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getCommits,
  getRepositories,
} from "../services/github";

import {
  generateReleaseNotes,
} from "../services/release";

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
  getLiteContributors,
  getLiteRangeLabel,
  selectCommitsForLiteRange,
  suggestLiteReleaseTitle,
  type LiteReleaseRange,
} from "../utils/liteRelease";

function isLiteReleaseRange(
  value: string | null,
): value is LiteReleaseRange {
  return [
    "7d",
    "14d",
    "30d",
    "10c",
    "25c",
  ].includes(value ?? "");
}


const automaticFeatures = [
  "Select matching commits automatically",
  "Detect and normalize contributors",
  "Suggest release title and version",
  "Classify changes into clear sections",
  "Prepare an editable release document",
];

export default function LiteDashboard() {
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
    currentStep,
    setCurrentStep,
  ] = useState<1 | 2 | 3 | 4>(1);

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

  const [
    branch,
    setBranch,
  ] = useState("");

  const [
    releaseRange,
    setReleaseRange,
  ] = useState<LiteReleaseRange | null>(
    null,
  );

  const [
    selectedCommits,
    setSelectedCommits,
  ] = useState<Commit[]>([]);

  const [
    commitsLoading,
    setCommitsLoading,
  ] = useState(false);

  const [
    commitsError,
    setCommitsError,
  ] = useState("");

  const [
    releaseTitle,
    setReleaseTitle,
  ] = useState("Weekly Release");

  const [
    version,
    setVersion,
  ] = useState("v1.0.0");

  const [
    generationLoading,
    setGenerationLoading,
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
    savedReleaseId,
    setSavedReleaseId,
  ] = useState<number | null>(
    null,
  );

  const [
    savedReleaseStatus,
    setSavedReleaseStatus,
  ] = useState<
    SavedReleaseStatus | null
  >(null);

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
          "lite"
        ) {
          throw new Error(
            "This release belongs to the " +
            "Advanced workspace.",
          );
        }

        if (
          !isLiteReleaseRange(
            savedRelease.releaseRange,
          )
        ) {
          throw new Error(
            "The saved Lite release range " +
            "is not supported.",
          );
        }

        setRepositoryFullName(
          savedRelease.repository,
        );

        setBranch(
          savedRelease.branch,
        );

        setReleaseRange(
          savedRelease.releaseRange,
        );

        setSelectedCommits(
          savedRelease.selectedCommits,
        );

        setReleaseTitle(
          savedRelease.title,
        );

        setVersion(
          savedRelease.version,
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

        setGenerationLoading(false);
        setGenerationError("");

        setSaveLoading(false);
        setSaveError("");

        setCurrentStep(4);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setResumeError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to resume the release.",
        );

        setCurrentStep(1);
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

  const contributors =
    useMemo(() => {
      return getLiteContributors(
        selectedCommits,
      );
    }, [selectedCommits]);

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

  function resetCommitSelection() {
    setSelectedCommits([]);
    setCommitsError("");

    resetGeneratedRelease();
    resetSavedReleaseIdentity();
  }

  function handleRepositoryChange(
    nextRepositoryFullName: string,
  ) {
    const repository =
      repositories.find(
        (item) =>
          item.fullName ===
          nextRepositoryFullName,
      );

    setRepositoryFullName(
      nextRepositoryFullName,
    );

    setBranch(
      repository?.defaultBranch ?? "",
    );

    resetCommitSelection();
    setCurrentStep(1);
  }

  function handleBranchChange(
    nextBranch: string,
  ) {
    setBranch(nextBranch);
    resetCommitSelection();
    setCurrentStep(1);
  }

  function handleReleaseRangeChange(
    nextRange: LiteReleaseRange,
  ) {
    setReleaseRange(nextRange);
    setReleaseTitle(
      suggestLiteReleaseTitle(nextRange),
    );

    resetCommitSelection();
  }

  function handleReleaseTitleChange(
    nextTitle: string,
  ) {
    setReleaseTitle(nextTitle);
    resetGeneratedRelease();
  }

  function handleVersionChange(
    nextVersion: string,
  ) {
    setVersion(nextVersion);
    resetGeneratedRelease();
  }

  function handleReleaseNotesChange(
    nextReleaseNotes: ReleaseNotes,
  ) {
    setReleaseNotes(
      nextReleaseNotes,
    );

    setHasUnsavedChanges(true);
    setSaveError("");
  }

  function continueToRange() {
    if (!selectedRepository || !branch) {
      return;
    }

    setCurrentStep(2);
  }

  async function continueToReview() {
    if (
      !selectedRepository ||
      !branch ||
      !releaseRange
    ) {
      return;
    }

    setCommitsLoading(true);
    setCommitsError("");
    setSelectedCommits([]);

    try {
      const commits = await getCommits(
        token,
        selectedRepository.fullName,
        branch,
      );

      const matchingCommits =
        selectCommitsForLiteRange(
          commits,
          releaseRange,
        );

      if (matchingCommits.length === 0) {
        setCommitsError(
          `No commits were found for ${getLiteRangeLabel(
            releaseRange,
          )}. Choose another range or branch.`,
        );

        return;
      }

      setSelectedCommits(matchingCommits);
      setCurrentStep(3);
    } catch (requestError) {
      setCommitsError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load repository commits.",
      );
    } finally {
      setCommitsLoading(false);
    }
  }

  async function generateLiteRelease() {
    if (
      !selectedRepository ||
      !branch ||
      !releaseRange ||
      selectedCommits.length === 0 ||
      !releaseTitle.trim()
    ) {
      return;
    }

    setCurrentStep(4);
    setGenerationLoading(true);
    setGenerationError("");
    setReleaseNotes(null);

    try {
      const notes =
        await generateReleaseNotes({
          repository:
            selectedRepository.fullName,

          branch,

          title: releaseTitle.trim(),

          version: version.trim(),

          environment: "Development",

          generateFor: "all",

          selectedAuthor: "",

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
      setGenerationLoading(false);
    }
  }

  async function saveLiteRelease(
    nextStatus: SavedReleaseStatus,
  ) {
    if (
      !user ||
      !repositoryFullName ||
      !branch ||
      !releaseRange ||
      !releaseNotes ||
      selectedCommits.length === 0
    ) {
      return;
    }

    const releaseData: Omit<
      SavedReleaseCreateInput,
      "ownerLogin"
    > = {
      experienceMode: "lite",
      selectionMode: "automatic",
      status: nextStatus,

      repository:
        repositoryFullName,

      branch,

      title:
        releaseNotes.title.trim(),

      version: version.trim(),

      environment: "Development",

      generateFor: "all",
      selectedAuthor: "",

      releaseRange,

      dateFrom: null,
      dateTo: null,

      summary:
        releaseNotes.summary,

      features:
        releaseNotes.features,

      fixes:
        releaseNotes.fixes,

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

  function startAnotherRelease() {
    setSearchParams(
      {},
      {
        replace: true,
      },
    );

    setRepositoryFullName("");
    setBranch("");
    setReleaseRange(null);
    setSelectedCommits([]);

    setCommitsLoading(false);
    setCommitsError("");

    setReleaseTitle("Weekly Release");
    setVersion("v1.0.0");

    setGenerationLoading(false);
    setGenerationError("");
    setReleaseNotes(null);

    resetSavedReleaseIdentity();

    setCurrentStep(1);
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

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
              Lite
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/history"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white"
            >
              History
            </Link>

            <Link
              to="/dashboard"
              className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-white/[0.08] hover:text-white sm:inline-flex"
            >
              Advanced workspace
            </Link>

            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.login}
                className="h-9 w-9 rounded-full border border-white/10"
              />
            )}

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
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-sm font-medium text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Guided release workflow
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Release notes without the setup
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Choose a repository and release range.
              Relescope Lite will handle the technical
              decisions and prepare a polished release
              document.
            </p>
          </div>

          {resumeError && (
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-5 py-4 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {resumeError}
            </div>
          )}

          <LiteStepProgress
            currentStep={currentStep}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            {resumeLoading ? (
              <section className="flex min-h-80 items-center justify-center rounded-3xl border border-cyan-400/15 bg-slate-900/70 p-8">
                <div className="text-center">
                  <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-cyan-300" />

                  <h2 className="mt-5 text-xl font-bold text-white">
                    Loading saved release
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Restoring its repository,
                    commits and generated notes.
                  </p>
                </div>
              </section>
            ) : currentStep === 1 ? (
              <LiteRepositoryStep
                token={token}
                repositories={repositories}
                repositoriesLoading={
                  repositoriesLoading
                }
                repositoriesError={
                  repositoriesError
                }
                repositoryFullName={
                  repositoryFullName
                }
                branch={branch}
                onRepositoryChange={
                  handleRepositoryChange
                }
                onBranchChange={
                  handleBranchChange
                }
                onContinue={continueToRange}
              />
            ) : currentStep === 2 ? (
              <LiteRangeStep
                repository={
                  selectedRepository?.fullName ??
                  repositoryFullName
                }
                branch={branch}
                value={releaseRange}
                loading={commitsLoading}
                error={commitsError}
                onChange={
                  handleReleaseRangeChange
                }
                onBack={() =>
                  setCurrentStep(1)
                }
                onContinue={continueToReview}
              />
            ) : currentStep === 3 ? (
              <LiteReviewStep
                repository={
                  selectedRepository?.fullName ??
                  repositoryFullName
                }
                branch={branch}
                releaseRange={
                  releaseRange ?? "7d"
                }
                selectedCommits={
                  selectedCommits
                }
                contributors={contributors}
                releaseTitle={releaseTitle}
                version={version}
                onReleaseTitleChange={
                  handleReleaseTitleChange
                }
                onVersionChange={
                  handleVersionChange
                }
                onBack={() =>
                  setCurrentStep(2)
                }
                onGenerate={
                  generateLiteRelease
                }
              />
            ) : (
              <LiteGenerationStep
                repository={
                  selectedRepository?.fullName ??
                  repositoryFullName
                }
                branch={branch}
                commitCount={
                  selectedCommits.length
                }
                loading={
                  generationLoading
                }
                error={generationError}
                releaseNotes={releaseNotes}
                onChange={
                  handleReleaseNotesChange
                }
                savedStatus={
                  savedReleaseStatus
                }
                saveLoading={saveLoading}
                saveError={saveError}
                hasUnsavedChanges={
                  hasUnsavedChanges
                }
                savedAt={savedAt}
                onSaveDraft={() =>
                  saveLiteRelease("draft")
                }
                onSaveFinal={() =>
                  saveLiteRelease("final")
                }
                onBackToReview={() => {
                  setGenerationError("");
                  setCurrentStep(3);
                }}
                onRetry={
                  generateLiteRelease
                }
                onStartAnother={
                  startAnotherRelease
                }
              />
            )}

            <aside className="space-y-6">
              {selectedRepository && (
                <section className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04] p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    Current selection
                  </p>

                  <h2 className="mt-3 truncate text-xl font-bold">
                    {selectedRepository.name}
                  </h2>

                  <p className="mt-2 truncate text-sm text-slate-500">
                    {selectedRepository.fullName}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-slate-300">
                    <p>
                      Branch:{" "}
                      <span className="text-cyan-300">
                        {branch}
                      </span>
                    </p>

                    <p>
                      Range:{" "}
                      <span className="text-cyan-300">
                        {releaseRange
                          ? getLiteRangeLabel(
                              releaseRange,
                            )
                          : "Not selected"}
                      </span>
                    </p>

                    {selectedCommits.length > 0 && (
                      <>
                        <p>
                          Commits:{" "}
                          <span className="text-cyan-300">
                            {
                              selectedCommits.length
                            }
                          </span>
                        </p>

                        <p>
                          Contributors:{" "}
                          <span className="text-cyan-300">
                            {contributors.length}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </section>
              )}

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
                  <WandSparkles className="h-6 w-6" />
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  Lite handles the busy work
                </h2>

                <p className="mt-2 leading-7 text-slate-500">
                  The workflow stays simple without
                  reducing the quality of the generated
                  result.
                </p>

                <div className="mt-6 space-y-4">
                  {automaticFeatures.map(
                    (feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                          <Check className="h-3 w-3" />
                        </span>

                        <span className="text-sm leading-6 text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-violet-400/15 bg-violet-400/[0.04] p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">
                  Need full control?
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Switch to Advanced anytime
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manually choose commits, filter
                  developers and configure every release
                  field.
                </p>

                <Link
                  to="/dashboard"
                  className="mt-5 inline-flex text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                >
                  Open Advanced workspace →
                </Link>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
