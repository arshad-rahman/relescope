import { Rocket, Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-blue-600 p-3 shadow-lg">
        <Rocket className="h-6 w-6 text-white" />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          ReleasePilot
        </h1>

        <p className="text-sm text-slate-400">
          AI Release Notes Generator
        </p>
      </div>

      <Sparkles className="h-5 w-5 text-yellow-400" />
    </div>
  );
}
