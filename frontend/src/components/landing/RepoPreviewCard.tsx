import { motion } from "motion/react";
import {
  FaGithub,
  FaCheckCircle,
  FaCodeBranch,
  FaLock,
} from "react-icons/fa";

export default function RepoPreviewCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-200 shadow-2xl backdrop-blur-3xl"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <FaGithub size={26} className="text-white" />
        <span className="text-lg font-semibold text-white">
          Repository Connected
        </span>
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Repository</span>
          <span className="font-medium text-white">clubtravalet/backend</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Branch</span>
          <span className="flex items-center gap-2 font-medium text-white">
            <FaCodeBranch className="text-cyan-400" />
            main
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Visibility</span>
          <span className="flex items-center gap-2 font-medium text-white">
            <FaLock className="text-yellow-400" />
            Private
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Status</span>
          <span className="flex items-center gap-2 font-semibold text-emerald-400">
            <FaCheckCircle />
            Ready
          </span>
        </div>
      </div>
    </motion.div>
  );
}
