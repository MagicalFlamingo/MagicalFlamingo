"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
}

// Real numbers only, sourced from content/knowledge.ts outcomes. Where
// the real data is qualitative ("no specific numbers available - but the
// internal signal was unambiguous"), `value` should carry a short honest
// phrase in the same slot rather than a fabricated percentage - never
// invent a number to fill this component.
export function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-3 rounded-xl border border-[#211D1D]/10 bg-[#FFFDF9] px-6 py-7 text-center"
    >
      <p className="font-serif text-5xl font-bold text-[#211D1D]">{value}</p>
      <p className="mt-2 text-sm text-[#211D1D]/55 leading-relaxed">{label}</p>
    </motion.div>
  );
}
