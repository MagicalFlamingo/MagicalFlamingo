"use client";

import { motion } from "framer-motion";
import { knowledge } from "@/content/knowledge";

export function TimelineCard() {
  const { career } = knowledge;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-3 rounded-xl border border-[#211D1D]/10 bg-[#FFFDF9] overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-[#211D1D]/8">
        <p className="text-xs font-medium uppercase tracking-wider text-[#211D1D]/40">Career Arc</p>
        <h3 className="text-base font-semibold text-[#211D1D] mt-0.5">Art history → interior design → senior product design</h3>
      </div>
      <div className="p-5">
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#211D1D]/10" />
          <div className="flex flex-col gap-5">
            {career.map((item, i) => (
              <motion.div key={`${item.company}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.07 * i, duration: 0.25 }} className="flex gap-4 relative">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#C1502D] bg-[#FFFDF9] shrink-0 mt-0.5 z-10" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-[#211D1D]">{item.company}</h4>
                    <span className="text-xs text-[#211D1D]/40 shrink-0">{item.period}</span>
                  </div>
                  <p className="text-xs text-[#211D1D]/55 mt-0.5">{item.role}</p>
                  {"highlight" in item && item.highlight && (
                    <p className="text-xs text-[#211D1D]/45 mt-1 leading-relaxed">{item.highlight}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
