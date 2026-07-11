import {
  ArrowRight,
  Gauge,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const comparisonRows = [
  {
    area: "Interface",
    lite: "Guided step-by-step wizard",
    advanced: "Complete two-column workspace",
  },
  {
    area: "Page layout",
    lite: "Focused single-column flow",
    advanced: "Configuration and preview side by side",
  },
  {
    area: "Commit selection",
    lite: "Automatic by release range",
    advanced: "Manual commit checkboxes and filters",
  },
  {
    area: "Configuration",
    lite: "Smart defaults with minimal inputs",
    advanced: "Versions, environments and developer controls",
  },
  {
    area: "Loading experience",
    lite: "Guided full-card progress",
    advanced: "Live result-panel generation loader",
  },
  {
    area: "Editing UI",
    lite: "Simple focused editing",
    advanced: "Detailed section editing and controls",
  },
  {
    area: "Responsive focus",
    lite: "Mobile-first",
    advanced: "Desktop-first and responsive",
  },
  {
    area: "Best suited for",
    lite: "Quick releases and first-time users",
    advanced: "Developers, DevOps and release managers",
  },
];

export default function ExperienceSelector() {
  return (
    <section
      id="modes"
      className="scroll-mt-20 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-sm font-medium text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Two experiences. One release engine.
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Choose how you want to work
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Generate the same high-quality release
            notes through a fast guided flow or a
            complete release-management workspace.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/[0.09] via-slate-900/80 to-blue-500/[0.06] p-8 shadow-2xl shadow-cyan-950/20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Gauge className="h-6 w-6" />
                </div>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  Recommended
                </span>
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Relescope Lite
              </p>

              <h3 className="mt-3 text-3xl font-bold text-white">
                Release notes in under one minute
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Follow a clean guided workflow while
                Relescope automatically handles commit
                selection, contributors and release
                configuration.
              </p>

              <div className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <span>✓ Guided step-based UI</span>
                <span>✓ Automatic commit selection</span>
                <span>✓ Smart release defaults</span>
                <span>✓ Mobile-first experience</span>
              </div>

              <Link
                to="/lite"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20"
              >
                Start with Lite
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-violet-400/[0.07] blur-3xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-300">
                <SlidersHorizontal className="h-6 w-6" />
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
                Relescope Advanced
              </p>

              <h3 className="mt-3 text-3xl font-bold text-white">
                Complete control over every release
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Inspect commits, filter contributors,
                configure release metadata and edit every
                generated section from one workspace.
              </p>

              <div className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <span>✓ Manual commit control</span>
                <span>✓ Developer filtering</span>
                <span>✓ Full release configuration</span>
                <span>✓ Detailed editing and exports</span>
              </div>

              <Link
                to="/dashboard"
                className="mt-9 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-6 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/10"
              >
                Open Advanced
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="text-lg font-semibold text-white">
              Lite and Advanced comparison
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Both experiences share the same GitHub,
              AI, editing and export foundation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Area
                  </th>

                  <th className="px-6 py-4 font-semibold text-cyan-300">
                    Lite
                  </th>

                  <th className="px-6 py-4 font-semibold text-violet-300">
                    Advanced
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.07]">
                {comparisonRows.map((row) => (
                  <tr
                    key={row.area}
                    className="transition hover:bg-white/[0.025]"
                  >
                    <th className="px-6 py-4 text-sm font-medium text-white">
                      {row.area}
                    </th>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {row.lite}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {row.advanced}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
