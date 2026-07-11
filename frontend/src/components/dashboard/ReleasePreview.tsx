import {
  useState,
} from "react";

import {
  Check,
  Clipboard,
  Download,
  FileJson,
  Printer,
} from "lucide-react";

import type { ReleaseNotes } from "../../types/release";

import {
  copyReleaseMarkdown,
  downloadReleaseJson,
  downloadReleaseMarkdown,
  printReleaseNotes,
} from "../../utils/releaseExport";

type Props = {
  releaseNotes: ReleaseNotes | null;
};

type SectionProps = {
  title: string;
  color: string;
  items: string[];
};

type ExportStatus =
  | "idle"
  | "copied"
  | "error";

function Section({
  title,
  color,
  items,
}: SectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <h3
        className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] ${color}`}
      >
        {title}
      </h3>

      <ul className="space-y-2 text-sm text-slate-200">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2"
          >
            <span className="mt-0.5 text-slate-500">
              •
            </span>

            <span className="whitespace-pre-wrap">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ReleasePreview({
  releaseNotes,
}: Props) {
  const [exportStatus, setExportStatus] =
    useState<ExportStatus>("idle");

  const [exportError, setExportError] =
    useState("");

  if (!releaseNotes) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center text-slate-500">
        Select commits and click Generate Release Notes.
      </div>
    );
  }

  async function handleCopy() {
    if (!releaseNotes) {
      return;
    }

    setExportError("");
    setExportStatus("idle");

    try {
      await copyReleaseMarkdown(releaseNotes);

      setExportStatus("copied");

      window.setTimeout(() => {
        setExportStatus("idle");
      }, 2000);
    } catch (error) {
      setExportStatus("error");

      setExportError(
        error instanceof Error
          ? error.message
          : "Unable to copy release notes.",
      );
    }
  }

  function handleMarkdownDownload() {
    if (!releaseNotes) {
      return;
    }

    setExportError("");

    downloadReleaseMarkdown(releaseNotes);
  }

  function handleJsonDownload() {
    if (!releaseNotes) {
      return;
    }

    setExportError("");

    downloadReleaseJson(releaseNotes);
  }

  function handlePrint() {
    if (!releaseNotes) {
      return;
    }

    setExportError("");

    try {
      printReleaseNotes(releaseNotes);
    } catch (error) {
      setExportStatus("error");

      setExportError(
        error instanceof Error
          ? error.message
          : "Unable to open the print dialog.",
      );
    }
  }

  return (
    <div className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <div className="border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-white">
            {releaseNotes.title}
          </h2>

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
            {releaseNotes.totalCommits}{" "}
            {releaseNotes.totalCommits === 1
              ? "Commit"
              : "Commits"}
          </span>
        </div>

        <p className="mt-3 leading-6 text-slate-400">
          {releaseNotes.summary}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Export and share
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            {exportStatus === "copied" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}

            {exportStatus === "copied"
              ? "Copied"
              : "Copy"}
          </button>

          <button
            type="button"
            onClick={handleMarkdownDownload}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Download className="h-4 w-4" />
            Markdown
          </button>

          <button
            type="button"
            onClick={handleJsonDownload}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <FileJson className="h-4 w-4" />
            JSON
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Printer className="h-4 w-4" />
            PDF
          </button>
        </div>

        {exportError && (
          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {exportError}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-8 border-t border-white/10 pt-6">
        <Section
          title="✨ Features"
          color="text-cyan-400"
          items={releaseNotes.features}
        />

        <Section
          title="🐞 Bug Fixes"
          color="text-emerald-400"
          items={releaseNotes.fixes}
        />

        <Section
          title="⚡ Improvements"
          color="text-orange-400"
          items={releaseNotes.improvements}
        />

        <Section
          title="📚 Documentation"
          color="text-violet-400"
          items={releaseNotes.documentation}
        />

        <Section
          title="🔧 Maintenance"
          color="text-amber-400"
          items={releaseNotes.maintenance}
        />

        {releaseNotes.contributors.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
              👥 Contributors
            </h3>

            <div className="flex flex-wrap gap-2">
              {releaseNotes.contributors.map(
                (name) => (
                  <span
                    key={name}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200"
                  >
                    {name}
                  </span>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
