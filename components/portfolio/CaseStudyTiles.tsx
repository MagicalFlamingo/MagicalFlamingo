"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";
import { CaseStudyModal } from "./CaseStudyModal";

const PROJECTS: CaseStudyId[] = ["qlik", "aws", "sprout"];

const CARD_STATS: Record<CaseStudyId, string> = {
  qlik: "5-month longitudinal study · 4 user groups · roadmap influence",
  aws: "Shipped to AWS production · support tickets dropped",
  sprout: "Component library adopted by the full design team",
};

function TiltCard({
  id,
  i,
  onOpen,
}: {
  id: CaseStudyId;
  i: number;
  onOpen: () => void;
}) {
  const study = knowledge.caseStudies[id] as CaseStudy;
  const sections = ["Hook", "Friction", study.pivot ? "Pivot" : null, "Solution", "Impact"].filter(Boolean);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 20, stiffness: 250 });
  const sRotY = useSpring(rotY, { damping: 20, stiffness: 250 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(-ry * 7);
    rotY.set(rx * 7);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: 0.1 * i }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformPerspective: 900,
        backgroundColor: study.accentColor,
      }}
      whileHover={{ boxShadow: "0 24px 56px rgba(26,26,26,0.12)" }}
      className="group text-left rounded-2xl overflow-hidden border border-[#211D1D]/10 hover:border-[#211D1D]/14 transition-colors duration-300 relative"
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
          className="absolute top-3 right-5 text-[68px] font-bold font-serif leading-none select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.12]"
          style={{ color: study.color, opacity: 0.07 }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>

        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#211D1D]/35">
            {study.company}
          </p>
          {study.ndaLevel === "partial" && (
            <span className="flex items-center gap-1 text-[10px] text-[#211D1D]/35 bg-[#211D1D]/5 px-1.5 py-0.5 rounded-full">
              <Lock className="h-2.5 w-2.5" /> Partial NDA
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#211D1D] leading-snug font-serif">
          {study.title}
        </h3>
        <p className="mt-2 text-sm text-[#211D1D]/50 leading-relaxed">
          {study.hook.headline}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {sections.map((label) => (
            <span
              key={label}
              className="text-[10px] px-2 py-0.5 rounded bg-[#FFFDF9]/70 text-[#211D1D]/40 border border-[#211D1D]/8 font-medium"
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
        <p className="text-[11px] text-[#211D1D]/55 leading-snug pr-2">
          {CARD_STATS[id]}
        </p>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: study.color }}
        />
      </div>
    </motion.button>
  );
}

export function CaseStudyTiles() {
  const [open, setOpen] = useState<CaseStudyId | null>(null);

  return (
    <section className="px-8 py-20 lg:px-14 border-t border-[#211D1D]/8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#C1502D] mb-2">
          Selected Work
        </p>
        <h2 className="text-3xl font-bold text-[#211D1D] tracking-tight font-serif">
          Three projects worth understanding
        </h2>
        <p className="mt-2 text-[#211D1D]/50 text-[15px] max-w-[50ch]">
          Each represents a different kind of design problem. Click to walk through the story.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROJECTS.map((id, i) => (
          <TiltCard key={id} id={id} i={i} onOpen={() => setOpen(id)} />
        ))}
      </div>

      <AnimatePresence>
        {open && <CaseStudyModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
