"use client";

import { motion } from "framer-motion";

interface QuoteCardProps {
  quote: string;
  attribution: string;
}

// Real research quotes only - every call site passes a string already
// in content/knowledge.ts (userVoice arrays) or content/responses.ts,
// never invented copy. Chrome matches TimelineCard/NDASafeNote's
// established pattern (rounded-xl border bg-[#FFFDF9]).
export function QuoteCard({ quote, attribution }: QuoteCardProps) {
  const clean = quote.replace(/^"|"$/g, "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-3 rounded-xl border border-[#211D1D]/10 bg-[#FFFDF9] px-6 py-5"
    >
      <p className="text-lg italic text-[#211D1D] leading-snug">&ldquo;{clean}&rdquo;</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-[#211D1D]/40">{attribution}</p>
    </motion.div>
  );
}
