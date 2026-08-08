"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";
import { CaseStudyModal } from "./CaseStudyModal";

const PROJECTS: CaseStudyId[] = ["qlik", "aws", "sprout"];

const CARD_STATS: Record<CaseStudyId, string> = {
  qlik: "5-month longitudinal study · 4 user groups · roadmap influence",
  aws: "Shipped to AWS production · support tickets dropped",
  sprout: "Component library adopted by the full design team",
};

export function CaseStudyTiles() {
  const [open, setOpen] = useState<CaseStudyId | null>(null);

  return (
    <section className="px-8 py-20 lg:px-14 border-t border-[#1A1A1A]/8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#C4654A] mb-2">
          Selected Work
        </p>
        <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight font-serif">
          Three projects worth understanding
        </h2>
        <p className="mt-2 text-[#1A1A1A]/50 text-[15px] max-w-[50ch]">
          Each represents a different kind of design problem. Click to walk through the story.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROJECTS.map((id, i) => {
          const study = knowledge.caseStudies[id] as CaseStudy;
          const sections = ["Hook", "Friction", study.pivot ? "Pivot" : null, "Solution", "Impact"].filter(Boolean);

          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.1 * i }}
              whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(26,26,26,0.10)" }}
              onClick={() => setOpen(id)}
              className="group text-left rounded-2xl overflow-hidden border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/14 transition-colors duration-300 relative"
              style={{ backgroundColor: study.accentColor }}
            >
              {/* Color band */}
              <div
                className="h-[3px] w-full transition-all duration-300 group-hover:h-[5px]"
                style={{ backgroundColor: study.color }}
              />

              {/* Main card content */}
              <div className="p-6 pb-14 relative">
                {/* Large editorial number */}
                <span
                  className="absolute top-3 right-5 text-[68px] font-bold font-serif leading-none select-none pointer-events-none"
                  style={{ color: study.color, opacity: 0.07 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
                    {study.company}
                  </p>
                  {study.ndaLevel === "partial" && (
                    <span className="flex items-center gap-1 text-[10px] text-[#1A1A1A]/35 bg-[#1A1A1A]/5 px-1.5 py-0.5 rounded-full">
                      <Lock className="h-2.5 w-2.5" /> Partial NDA
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#1A1A1A] leading-snug font-serif">
                  {study.title}
                </h3>
                <p className="mt-2 text-sm text-[#1A1A1A]/50 leading-relaxed">
                  {study.hook.headline}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {sections.map((label) => (
                    <span
                      key={label}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/70 text-[#1A1A1A]/40 border border-[#1A1A1A]/8 font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Default CTA — fades and lifts on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center gap-1.5 transition-all duration-200 group-hover:opacity-0 group-hover:-translate-y-1"
                style={{
                  background: `linear-gradient(to top, ${study.accentColor} 72%, transparent)`,
                }}
              >
                <span className="text-sm font-medium" style={{ color: study.color }}>
                  View case study
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" style={{ color: study.color }} />
              </div>

              {/* Stat reveal strip — slides up from below on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                style={{
                  backgroundColor: study.accentColor,
                  borderColor: `${study.color}22`,
                }}
              >
                <p className="text-[11px] text-[#1A1A1A]/55 leading-snug pr-2">
                  {CARD_STATS[id]}
                </p>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: study.color }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {open && <CaseStudyModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
