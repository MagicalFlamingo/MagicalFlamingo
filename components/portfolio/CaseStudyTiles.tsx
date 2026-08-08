"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";
import { CaseStudyModal } from "./CaseStudyModal";

const PROJECTS: CaseStudyId[] = ["qlik", "aws", "sprout"];

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
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(26,26,26,0.10)" }}
              onClick={() => setOpen(id)}
              className="group text-left rounded-2xl bg-white border border-[#1A1A1A]/10 overflow-hidden transition-colors duration-200 hover:border-[#1A1A1A]/16"
            >
              {/* Color band — thicker on hover */}
              <div
                className="h-1 w-full group-hover:h-[5px] transition-all duration-200"
                style={{ backgroundColor: study.color }}
              />

              <div className="p-6">
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
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F7F6F3] text-[#1A1A1A]/40 border border-[#1A1A1A]/8 font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[#C4654A] group-hover:gap-3 transition-all duration-200">
                  View case study
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
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
