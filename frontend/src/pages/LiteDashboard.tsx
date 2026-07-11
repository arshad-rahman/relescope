import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Background from "../components/layout/Background";

import LiteRangeStep, {
  type LiteReleaseRange,
} from "../components/lite/LiteRangeStep";

import LiteRepositoryStep from "../components/lite/LiteRepositoryStep";
import LiteStepProgress from "../components/lite/LiteStepProgress";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getRepositories,
} from "../services/github";

import type {
  Repository,
} from "../types/github";

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
    currentStep,
    setCurrentStep,
  ] = useState<1 | 2>(1);

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
  ] = useState<LiteReleaseRange>("7d");

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

    setCurrentStep(1);
  }

  function handleBranchChange(
    nextBranch: string,
  ) {
    setBranch(nextBranch);
    setCurrentStep(1);
  }

  function continueToRange() {
    if (!selectedRepository || !branch) {
      return;
    }

    setCurrentStep(2);
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

          <LiteStepProgress
            currentStep={currentStep}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            {currentStep === 1 ? (
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
            ) : (
              <LiteRangeStep
                repository={
                  selectedRepository?.fullName ??
                  repositoryFullName
                }
                branch={branch}
                value={releaseRange}
                onChange={setReleaseRange}
                onBack={() =>
                  setCurrentStep(1)
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
                        {releaseRange}
                      </span>
                    </p>
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
