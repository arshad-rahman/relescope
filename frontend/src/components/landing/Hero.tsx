import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl flex-col items-center justify-center px-6 text-center">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          ✨ AI Powered Release Notes
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          Generate Beautiful
          <br />
          Release Notes
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            From Git Commits
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Connect your GitHub repository, choose a date range,
          and let AI generate release notes your developers,
          QA team, and customers will actually enjoy reading.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <button
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500"
          >
            🚀 Connect Repository
          </button>

          <button
            className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            View Demo
          </button>

        </div>

      </motion.div>

    </section>
  );
}
