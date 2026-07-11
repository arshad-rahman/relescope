import { motion } from "motion/react";

import { stats } from "../../data/stats";

export default function Stats() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-16 md:gap-8 md:py-24 xl:grid-cols-4">
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          whileHover={{ y: -6 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl md:p-8"
        >
          <div className="text-4xl font-black tracking-tight text-white md:text-5xl">
            {item.value}
            {item.suffix}
          </div>

          <div className="mt-3 text-sm text-slate-400 md:text-base">
            {item.label}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
