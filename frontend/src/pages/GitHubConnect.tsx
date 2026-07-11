import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import PatSecurityGuide from "../components/auth/PatSecurityGuide";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { connectGitHub } from "../services/github";

export default function GitHubConnect() {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedPath = (
    location.state as {
      from?: string;
    } | null
  )?.from;

  const destination =
    requestedPath === "/lite"
      ? "/lite"
      : "/dashboard";

  const {
    connect,
    isAuthenticated,
  } = useAuth();

  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const token = tokenInput.trim();

    if (!token) {
      setError("GitHub PAT is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await connectGitHub(token);

      connect(token, user);

      navigate(destination, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to connect to GitHub.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      <Background />

      <div className="relative z-10">
        <Navbar page="connect" />

        <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-start gap-6 px-6 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
            <Link
              to="/"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              ← Back to home
            </Link>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                GitHub connection
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Connect your GitHub account
              </h1>

              <p className="mt-3 leading-7 text-slate-400">
                Use a fine-grained personal access token with
                read access to the repositories you want to
                analyse.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="github-token"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  GitHub personal access token
                </label>

                <input
                  id="github-token"
                  type="password"
                  value={tokenInput}
                  onChange={(event) =>
                    setTokenInput(event.target.value)
                  }
                  placeholder="github_pat_..."
                  autoComplete="off"
                  spellCheck={false}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 disabled:opacity-60"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || !tokenInput.trim()
                }
                className="w-full rounded-xl bg-cyan-600 px-5 py-4 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Connecting to GitHub..."
                  : "Connect GitHub"}
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3">
              <p className="text-xs leading-5 text-slate-500">
                Your token is kept in this browser tab for the
                current session. Relescope does not require
                repository write permissions.
              </p>
            </div>
          </div>

          <PatSecurityGuide />
        </section>
      </div>
    </main>
  );
}
