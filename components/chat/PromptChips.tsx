"use client";

import { motion } from "framer-motion";

interface PromptChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  // Opt-in only, for the initial starter set: six equal-weight buttons on
  // a cold load is a decision tax, not a nudge - one visually distinct
  // option gives a thumb somewhere obvious to go first. Follow-up chips
  // (mid-conversation) don't use this - by then the visitor has context.
  //
  // Council round 16: this used to be a solid green fill - the only
  // saturated color block on the whole landing screen, which made it
  // beat the person's own name for attention and read as a "Most
  // Popular"-style nudge rather than a quiet recommendation. Bolder
  // border + colored text keeps the one-obvious-first-click idea without
  // spending the site's single accent color on a suggestion button.
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
                ? "px-3.5 py-1.5 text-[12px] rounded border-2 border-[#2E9B5C] bg-[#FFFDF9] text-[#2E9B5C] font-semibold hover:bg-[#2E9B5C]/8 transition-colors duration-150 cursor-pointer tracking-wide"
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
