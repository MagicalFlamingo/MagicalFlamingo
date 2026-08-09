"use client";

import { motion } from "framer-motion";

interface PromptChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function PromptChips({ suggestions, onSelect }: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((s, i) => (
        <motion.button
          key={s}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.04 * i, type: "spring", stiffness: 300, damping: 24 }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-sm rounded-full border border-[#211D1D]/12 bg-[#FFFDF9]/80 text-[#211D1D]/70 hover:border-[#C1502D]/35 hover:text-[#C1502D] hover:bg-[#C1502D]/5 transition-colors duration-150 cursor-pointer"
        >
          {s}
        </motion.button>
      ))}
    </div>
  );
}
