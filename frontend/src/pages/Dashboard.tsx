import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "../components/layout/Navbar";

import BranchSelector from "../components/dashboard/BranchSelector";
import CommitList from "../components/dashboard/CommitList";
import GenerateButton from "../components/dashboard/GenerateButton";
import ReleaseConfiguration from "../components/dashboard/ReleaseConfiguration";
import ReleasePreview from "../components/dashboard/ReleasePreview";
import RepositorySelector from "../components/dashboard/RepositorySelector";

import { useAuth } from "../context/AuthContext";

import { getRepositories } from "../services/github";
import { generateReleaseNotes } from "../services/release";

import type {
  Commit,
  Repository,
} from "../types/github";

import type {
  ReleaseNotes,
} from "../types/release";


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
    return Array.from(
      new Set(
        selectedCommits.map(
          (commit) => commit.author,
        ),
      ),
    ).sort();
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

    resetGeneratedRelease();
  }


  function handleBranchChange(
    nextBranch: string,
  ) {
    setBranch(nextBranch);

    setSelectedCommits([]);

    setSelectedAuthor("");

    resetGeneratedRelease();
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
                setSelectedCommits
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


          <ReleasePreview
            releaseNotes={releaseNotes}
          />
        </div>
      </main>
    </div>
  );
}
