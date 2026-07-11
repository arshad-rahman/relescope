import { Link } from "react-router-dom";

import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";

const features = [
  {
    title: "Private Repository Support",
    description:
      "Connect private GitHub repositories securely using a fine-grained personal access token.",
  },
  {
    title: "AI Release Summaries",
    description:
      "Transform real commit history into clear, professional release notes.",
  },
  {
    title: "Developer Filtering",
    description:
      "Generate notes for the complete team or for an individual contributor.",
  },
  {
    title: "Multiple Export Formats",
    description:
      "Copy or export generated release notes as Markdown, JSON, or PDF.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description:
      "Authenticate securely and select one of your GitHub repositories.",
  },
  {
    number: "02",
    title: "Choose Commits",
    description:
      "Select a branch, filter commits, and configure your release.",
  },
  {
    number: "03",
    title: "Generate and Export",
    description:
      "Generate AI-powered release notes and export them in your preferred format.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617]">
      <Background />
      <Navbar />
      <Hero />

      <section
        id="features"
        className="scroll-mt-16 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Features
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Everything needed for better release notes
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              Turn repository activity into useful release documentation
              without manually reading every commit.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-16 border-y border-white/10 bg-white/[0.02] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              From Git commits to polished release notes
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-7"
              >
                <span className="text-sm font-bold text-cyan-400">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <Link
            to="/connect"
            className="mt-10 inline-flex rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-500"
          >
            Connect GitHub
          </Link>
        </div>
      </section>

      <footer
        id="footer"
        className="scroll-mt-16 px-6 py-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Relescope — AI-powered release notes from Git commits.
          </p>

          <a
            href="https://github.com/arshad-rahman/relescope"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
