import {
  ArrowRight,
  Check,
  Clock3,
  GitBranch,
  LockKeyhole,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  FaGithub,
} from "react-icons/fa";

import Background from "../components/layout/Background";

import {
  useAuth,
} from "../context/AuthContext";

const steps = [
  {
    number: "01",
    title: "Repository",
    description: "Choose the source",
    active: true,
  },
  {
    number: "02",
    title: "Release range",
    description: "Select the timeframe",
    active: false,
  },
  {
    number: "03",
    title: "Review",
    description: "Confirm smart defaults",
    active: false,
  },
  {
    number: "04",
    title: "Generate",
    description: "Create and export",
    active: false,
  },
];

const automaticFeatures = [
  "Select matching commits automatically",
  "Detect and normalize contributors",
  "Suggest release title and version",
  "Classify changes into clear sections",
  "Prepare an editable release document",
];

export default function LiteDashboard() {
  const {
    user,
    logout,
  } = useAuth();

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

          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={
                  step.active
                    ? "rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.08] p-4 shadow-lg shadow-cyan-950/10"
                    : "rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={
                      step.active
                        ? "text-xs font-bold text-cyan-300"
                        : "text-xs font-bold text-slate-600"
                    }
                  >
                    {step.number}
                  </span>

                  {step.active && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  )}
                </div>

                <p
                  className={
                    step.active
                      ? "mt-3 text-sm font-semibold text-white"
                      : "mt-3 text-sm font-semibold text-slate-400"
                  }
                >
                  {step.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-7 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-9">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-3xl" />

              <div className="relative">
                <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      Step 1 of 4
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                      Select your repository
                    </h2>

                    <p className="mt-2 max-w-xl leading-7 text-slate-400">
                      Lite will use the default branch
                      automatically. You can change it
                      later when needed.
                    </p>
                  </div>

                  <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1.5 text-xs text-amber-200">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Shell preview
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Repository
                    </label>

                    <div className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-4 text-slate-500">
                      <span className="flex items-center gap-3">
                        <FaGithub className="h-5 w-5" />
                        Select a GitHub repository
                      </span>

                      <span className="text-xs">
                        Coming next
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Branch
                    </label>

                    <div className="flex min-h-14 items-center justify-between rounded-xl border border-white/[0.07] bg-slate-950/40 px-4 text-slate-600">
                      <span className="flex items-center gap-3">
                        <GitBranch className="h-5 w-5" />
                        Default branch selected automatically
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        <Clock3 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-200">
                          Release range comes next
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          The next step will include
                          Last 7 Days, Last 14 Days,
                          Last 30 Days and latest-commit
                          presets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-4 font-semibold text-slate-950 opacity-45"
                >
                  Continue to release range
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-xs text-slate-600">
                  Repository integration will be connected
                  in the next Lite milestone.
                </p>
              </div>
            </section>

            <aside className="space-y-6">
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
                  {automaticFeatures.map((feature) => (
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
                  ))}
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
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                >
                  Open Advanced workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
