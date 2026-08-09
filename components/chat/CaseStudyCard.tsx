"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";

interface CaseStudyCardProps {
  project: CaseStudyId;
  onExpand?: (project: CaseStudyId) => void;
}

export function CaseStudyCard({ project, onExpand }: CaseStudyCardProps) {
  const study = knowledge.caseStudies[project] as CaseStudy;
  const sections = ["Hook", "Friction", study.pivot ? "Pivot" : null, "Solution", "Impact"].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-3 rounded-xl overflow-hidden border border-[#211D1D]/10 bg-[#FFFDF9]"
      style={{ borderLeftColor: study.color, borderLeftWidth: 3 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-[#211D1D]/40 mb-1">
              {study.company}
            </p>
            <h3 className="text-lg font-semibold text-[#211D1D] leading-tight">{study.title}</h3>
            <p className="mt-2 text-sm text-[#211D1D]/60 leading-relaxed">{study.hook.headline}</p>
          </div>
          {study.ndaLevel === "partial" && (
            <span className="flex items-center gap-1 text-xs text-[#211D1D]/40 bg-[#211D1D]/5 px-2 py-1 rounded-full shrink-0">
              <Lock className="h-3 w-3" />
              Partial NDA
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {sections.map((label) => (
            <span key={label} className="text-xs px-2 py-1 rounded bg-[#FAF3E7] text-[#211D1D]/60 border border-[#211D1D]/8">
              {label}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[#211D1D]/8">
          <p className="text-sm text-[#211D1D]/50 italic">&ldquo;{study.impact.headline}&rdquo;</p>
        </div>

        {onExpand && (
          <button
            onClick={() => onExpand(project)}
            className="mt-4 flex items-center gap-1.5 text-sm text-[#C1502D] hover:gap-2.5 transition-all duration-150 font-medium"
          >
            See full walkthrough <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
