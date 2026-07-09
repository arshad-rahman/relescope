import Card from "../ui/Card";
import type { RepositoryValidationResponse } from "../../types/repository";

type Props = {
  repository: RepositoryValidationResponse;
};

export default function RepositoryInfo({
  repository,
}: Props) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-5">
        Repository Information
      </h2>

      <div className="space-y-3 text-slate-300">

        <p>
          <strong>Owner:</strong>{" "}
          {repository.owner}
        </p>

        <p>
          <strong>Repository:</strong>{" "}
          {repository.repo}
        </p>

        <p>
          <strong>Default Branch:</strong>{" "}
          {repository.default_branch}
        </p>

        <p>
          <strong>Visibility:</strong>{" "}
          {repository.private
            ? "Private"
            : "Public"}
        </p>

      </div>
    </Card>
  );
}
