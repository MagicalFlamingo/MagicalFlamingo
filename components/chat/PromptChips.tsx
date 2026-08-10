"use client";

import { motion } from "framer-motion";

interface PromptChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  // Opt-in only, for the initial starter set: six equal-weight buttons on
  // a cold load is a decision tax, not a nudge - one visually primary
  // option gives a thumb somewhere obvious to go first. Follow-up chips
  // (mid-conversation) don't use this - by then the visitor has context.
  highlightFirst?: boolean;
}

export function PromptChips({ suggestions, onSelect, highlightFirst }: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((s, i) => {
        const primary = highlightFirst && i === 0;
        return (
          <motion.button
            key={s}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, delay: 0.04 * i, type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(s)}
            className={
              primary
                ? "px-3.5 py-1.5 text-[12px] rounded bg-[#2E9B5C] text-[#FAF3E7] hover:bg-[#227A46] transition-colors duration-150 cursor-pointer tracking-wide font-medium"
                : "px-3 py-1.5 text-[12px] rounded border border-[#211D1D]/12 bg-[#FFFDF9]/80 text-[#211D1D]/60 hover:border-[#2E9B5C]/35 hover:text-[#2E9B5C] hover:bg-[#2E9B5C]/5 transition-colors duration-150 cursor-pointer tracking-wide"
            }
          >
            {s}
          </motion.button>
        );
      })}
    </div>
  );
}
