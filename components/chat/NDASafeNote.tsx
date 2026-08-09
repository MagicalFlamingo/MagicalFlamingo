"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface NDASafeNoteProps {
  context: string;
}

export function NDASafeNote({ context }: NDASafeNoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-3 rounded-xl border border-[#211D1D]/12 bg-[#FAF3E7] p-4 flex gap-3"
    >
      <div className="shrink-0 mt-0.5">
        <ShieldCheck className="h-4 w-4 text-[#211D1D]/40" />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#211D1D]/50 uppercase tracking-wider mb-1">
          NDA applies here
        </p>
        <p className="text-sm text-[#211D1D]/65 leading-relaxed">{context}</p>
        <p className="text-xs text-[#211D1D]/40 mt-2 italic">
          Happy to discuss what changed, how we'd measure it, and what I'd do differently - without surfacing client-specific data.
        </p>
      </div>
    </motion.div>
  );
}
