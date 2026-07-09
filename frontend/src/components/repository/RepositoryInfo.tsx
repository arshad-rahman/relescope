import Card from "../ui/Card";
import type { RepositoryValidationResponse } from "../../types/repository";

type Props = {
  repository: RepositoryValidationResponse;
};

export default function RepositoryInfo({ repository }: Props) {
  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-green-400">
        Repository Connected ✅
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <span className="text-slate-400">Owner</span>
          <span className="font-medium text-white">
            {repository.owner}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <span className="text-slate-400">Repository</span>
          <span className="font-medium text-white">
            {repository.repo}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <span className="text-slate-400">Default Branch</span>
          <span className="font-medium text-white">
            {repository.default_branch}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <span className="text-slate-400">Visibility</span>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              repository.private
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {repository.private ? "🔒 Private" : "🌍 Public"}
          </span>
        </div>
      </div>
    </Card>
  );
}
