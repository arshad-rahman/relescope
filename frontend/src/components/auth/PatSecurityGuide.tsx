import {
  FaCheckCircle,
  FaExternalLinkAlt,
  FaGithub,
  FaShieldAlt,
} from "react-icons/fa";

const TOKEN_CREATION_URL =
  "https://github.com/settings/personal-access-tokens/new?name=Relescope&description=Read-only+repository+access+for+release+note+generation&expires_in=30&contents=read&metadata=read";

const OFFICIAL_GUIDE_URL =
  "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token";

const steps = [
  {
    number: "01",
    title: "Open GitHub’s token creator",
    description:
      "Use the button below. Relescope’s token name, 30-day expiration, and read-only access are prefilled.",
  },
  {
    number: "02",
    title: "Select only the repositories you need",
    description:
      "Under Repository access, choose “Only select repositories” and select the repositories you want to analyse.",
  },
  {
    number: "03",
    title: "Keep permissions read-only",
    description:
      "Under Repository permissions, keep Contents set to Read-only. Do not enable write or administration permissions.",
  },
];

const protections = [
  "Restricted to repositories you select",
  "No write or administration access required",
  "Stored only in the current browser tab",
  "Removed locally when you disconnect",
];

export default function PatSecurityGuide() {
  return (
    <aside className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-b from-cyan-500/[0.08] to-slate-900/70 p-7 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <FaShieldAlt className="text-xl" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Safe connection
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Create a secure, read-only token
            </h2>
          </div>
        </div>

        <p className="mt-5 leading-7 text-slate-400">
          A personal access token sounds powerful, but you control
          exactly which repositories and permissions it receives.
          Relescope only needs read access.
        </p>

        <div className="mt-7 space-y-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-300">
                {step.number}
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={TOKEN_CREATION_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-50"
        >
          <FaGithub />
          Create read-only token
          <FaExternalLinkAlt className="text-xs" />
        </a>

        <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <FaShieldAlt />
            How Relescope protects your token
          </div>

          <ul className="mt-4 space-y-3">
            {protections.map((protection) => (
              <li
                key={protection}
                className="flex items-start gap-3 text-sm text-slate-300"
              >
                <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-400" />
                <span>{protection}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-col gap-2 text-xs leading-5 text-slate-500">
          <p>
            Treat every access token like a password. Never send it
            through chat, email, or screenshots.
          </p>

          <a
            href={OFFICIAL_GUIDE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            Read GitHub’s official token guide
            <FaExternalLinkAlt />
          </a>
        </div>
      </div>
    </aside>
  );
}
