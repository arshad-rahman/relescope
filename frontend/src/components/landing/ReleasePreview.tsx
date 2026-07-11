import { releaseNotes } from "../../data/demoRelease";

export default function ReleasePreview() {
  return (
    <div className="space-y-5 rounded-2xl bg-slate-950/50 p-5">

      <div>

        <h3 className="text-lg font-semibold text-white">
          Weekly Release
        </h3>

        <p className="text-sm text-slate-500">
          {releaseNotes.version} • {releaseNotes.date}
        </p>

      </div>

      <div>

        <h4 className="mb-2 text-cyan-400">
          ✨ Features
        </h4>

        <ul className="space-y-2">
          {releaseNotes.features.map((item) => (
            <li
              key={item}
              className="text-sm text-slate-300"
            >
              • {item}
            </li>
          ))}
        </ul>

      </div>

      <div>

        <h4 className="mb-2 text-emerald-400">
          🐞 Bug Fixes
        </h4>

        <ul className="space-y-2">
          {releaseNotes.fixes.map((item) => (
            <li
              key={item}
              className="text-sm text-slate-300"
            >
              • {item}
            </li>
          ))}
        </ul>

      </div>

      <div>

        <h4 className="mb-2 text-orange-400">
          ⚡ Improvements
        </h4>

        <ul className="space-y-2">
          {releaseNotes.improvements.map((item) => (
            <li
              key={item}
              className="text-sm text-slate-300"
            >
              • {item}
            </li>
          ))}
        </ul>

      </div>

    </div>
  );
}
