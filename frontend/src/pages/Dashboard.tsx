import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import Card from "../components/ui/Card";
import RepositoryForm from "../components/repository/RepositoryForm";
import RepositoryInfo from "../components/repository/RepositoryInfo";
import type { RepositoryValidationResponse } from "../types/repository";

export default function Dashboard() {
  const [repository, setRepository] =
    useState<RepositoryValidationResponse | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl px-8 py-14">

        <div className="mb-12">

          <h2 className="text-5xl font-bold leading-tight">
            Generate Release Notes
            <br />
            in Seconds 🚀
          </h2>

          <p className="mt-5 max-w-2xl text-lg text-slate-400">
            Connect your GitHub repository, fetch commits,
            and generate beautiful AI-powered release notes
            for your team.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <Card>
            <RepositoryForm
              onSuccess={setRepository}
            />
          </Card>

          {repository ? (
            <RepositoryInfo
              repository={repository}
            />
          ) : (
            <Card>
              <div className="flex h-full min-h-[300px] items-center justify-center text-slate-500">
                Repository information will appear here.
              </div>
            </Card>
          )}

        </div>

      </main>

    </div>
  );
}
