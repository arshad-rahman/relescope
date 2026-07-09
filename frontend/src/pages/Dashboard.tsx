import { useState } from "react";

import Card from "../components/ui/Card";

import RepositoryForm from "../components/repository/RepositoryForm";
import RepositoryInfo from "../components/repository/RepositoryInfo";

import type { RepositoryValidationResponse } from "../types/repository";

export default function Dashboard() {
  const [repository, setRepository] =
    useState<RepositoryValidationResponse | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-5xl px-6 py-16">

        <h1 className="text-5xl font-bold">
          ReleasePilot
        </h1>

        <p className="mt-3 text-slate-400">
          AI Release Notes Generator
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          <Card>
            <RepositoryForm
              onSuccess={setRepository}
            />
          </Card>

          {repository && (
            <RepositoryInfo
              repository={repository}
            />
          )}

        </div>

      </div>

    </div>
  );
}
