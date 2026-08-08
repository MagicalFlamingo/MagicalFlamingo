"use client";

import { motion } from "framer-motion";
import { knowledge } from "@/content/knowledge";

const SECTION_COLORS: Record<string, string> = {
  core: "#C4654A",
  tools: "#59CB74",
  domains: "#4A6FA5",
  languages: "#9B72CF",
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-3 rounded-xl border border-[#1A1A1A]/10 bg-white overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-[#1A1A1A]/8">
        <p className="text-xs font-medium uppercase tracking-wider text-[#1A1A1A]/40">Design Stack</p>
        <h3 className="text-base font-semibold text-[#1A1A1A] mt-0.5">How I work & what I work in</h3>
      </div>
      <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(([key, items], groupIdx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * groupIdx, duration: 0.25 }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SECTION_COLORS[key] ?? "#1A1A1A" }}>
              {SECTION_LABELS[key] ?? key}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <motion.span key={item} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.06 * groupIdx + 0.03 * i, duration: 0.2 }}
                  className="text-xs px-2.5 py-1 rounded-full border text-[#1A1A1A]/70"
                  style={{ borderColor: `${SECTION_COLORS[key] ?? "#1A1A1A"}40`, backgroundColor: `${SECTION_COLORS[key] ?? "#1A1A1A"}0D` }}
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
