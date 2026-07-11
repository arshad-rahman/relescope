import { motion } from "motion/react";
import { FaGithub, FaRobot, FaLock, FaFileAlt } from "react-icons/fa";

import HeroBadge from "./HeroBadge";
import { heroData } from "../../data/hero";

export default function HeroLeft() {
  return (
    <div className="flex flex-col items-start">
      <HeroBadge text={heroData.badge} />

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="mt-6 max-w-[9ch] text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
      >
        <span className="block">Your Git History.</span>
        <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
          Beautifully Summarized.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
        className="mt-6 max-w-lg text-lg leading-8 text-slate-400"
      >
        {heroData.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <button className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25">
          <FaGithub className="mr-2 inline" />
          {heroData.primaryButton}
        </button>

        <button className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">
          {heroData.secondaryButton}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42 }}
        className="mt-10 grid gap-4 sm:grid-cols-2"
      >
        <div className="flex items-center gap-3 text-slate-300">
          <FaLock className="text-cyan-400" />
          <span>Private Repositories</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <FaRobot className="text-cyan-400" />
          <span>AI Summaries</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <FaFileAlt className="text-cyan-400" />
          <span>Markdown Export</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <FaGithub className="text-cyan-400" />
          <span>GitHub Native</span>
        </div>
      </motion.div>
    </div>
  );
}
