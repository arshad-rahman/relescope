import { FaGithub } from "react-icons/fa";
import { GitBranch } from "lucide-react";

import ProcessingStep from "./ProcessingStep";
import ReleasePreview from "./ReleasePreview";

import { processing, repository } from "../../data/demoRelease";

export default function AIPreview() {
  return (
    <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-slate-900/60 p-7 shadow-2xl backdrop-blur-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <FaGithub className="text-2xl text-white" />

          <h2 className="text-xl font-semibold text-white">
            Git Repository
          </h2>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Repository</span>
            <span className="text-white">
              {repository.owner}/{repository.repo}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Branch</span>

            <span className="flex items-center gap-2 text-white">
              <GitBranch size={16} />
              {repository.branch}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Commits</span>
            <span className="text-white">{repository.commits}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Pull Requests</span>
            <span className="text-white">{repository.pullRequests}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Contributors</span>
            <span className="text-white">{repository.contributors}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {processing.map((step) => (
          <ProcessingStep
            key={step.title}
            title={step.title}
            status={step.status}
          />
        ))}
      </div>

      <div className="my-8 h-px bg-white/10" />

      <ReleasePreview />
    </div>
  );
}
