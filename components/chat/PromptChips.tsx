"use client";

import { motion } from "framer-motion";

interface PromptChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function PromptChips({ suggestions, onSelect }: PromptChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {suggestions.map((s, i) => (
        <motion.button
          key={s}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.05 * i }}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-sm rounded-full border border-[#1A1A1A]/15 bg-white/70 text-[#1A1A1A]/80 hover:border-[#C4654A]/40 hover:text-[#C4654A] hover:bg-[#C4654A]/5 transition-all duration-150 cursor-pointer"
        >
          {s}
        </motion.button>
      ))}
    </motion.div>
  );
}
