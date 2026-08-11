"use client";

import { motion } from "framer-motion";
import { knowledge } from "@/content/knowledge";

// Council round 19: these were also being used directly as text color
// (below) - measured contrast on the real cream background: tools
// (marigold) 1.81:1, core (green) 3.19:1, languages (purple) 3.39:1, all
// failing the 4.5:1 floor for text this size. Fill/border stays bright
// (only needs the 3:1 UI-component floor); SECTION_TEXT is a darkened,
// same-hue variant used only where the color is the text itself.
const SECTION_COLORS: Record<string, string> = {
  core: "#2E9B5C",
  tools: "#F2A93C",
  domains: "#4A6FA5",
  languages: "#9B72CF",
};

const SECTION_TEXT: Record<string, string> = {
  core: "#1F6B45",
  tools: "#7A5C12",
  domains: "#4A6FA5",
  languages: "#6B3FA0",
};

const SECTION_LABELS: Record<string, string> = {
  core: "Core Skills",
  tools: "Tools",
  domains: "Domains",
  languages: "Languages",
};

export function SkillsMap() {
  const { skills } = knowledge;
  const sections = Object.entries(skills) as [keyof typeof skills, string[]][];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-3 rounded-xl border border-[#211D1D]/10 bg-[#FFFDF9] overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-[#211D1D]/8">
        <p className="text-xs font-medium uppercase tracking-wider text-[#211D1D]/40">Design Stack</p>
        <h3 className="text-base font-semibold text-[#211D1D] mt-0.5">How I work & what I work in</h3>
      </div>
      <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(([key, items], groupIdx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * groupIdx, duration: 0.25 }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SECTION_TEXT[key] ?? "#211D1D" }}>
              {SECTION_LABELS[key] ?? key}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <motion.span key={item} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.06 * groupIdx + 0.03 * i, duration: 0.2 }}
                  className="text-xs px-2.5 py-1 rounded-full border text-[#211D1D]/70"
                  style={{ borderColor: `${SECTION_COLORS[key] ?? "#211D1D"}40`, backgroundColor: `${SECTION_COLORS[key] ?? "#211D1D"}0D` }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
