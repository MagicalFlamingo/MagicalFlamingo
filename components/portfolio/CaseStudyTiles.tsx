"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";
import { CaseStudyModal } from "./CaseStudyModal";

const PROJECTS: CaseStudyId[] = ["qlik", "aws", "sprout"];

const CARD_QUOTES: Partial<Record<CaseStudyId, string>> = {
  qlik: "I created a duplicate Snowflake connection without realizing an equivalent one already existed.",
  aws: "It is not clear to me how Resilience Hub calculated those numbers.",
};

const CARD_STATS: Record<CaseStudyId, string> = {
  qlik: "5-month longitudinal study · 4 user groups · roadmap influence",
  aws: "Shipped to AWS production · support tickets dropped",
  sprout: "Component library adopted by the full design team",
};

function QlikHero() {
  return (
    <div
      className="relative h-48 overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#E8EEF7" }}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,111,165,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(74,111,165,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative text-center select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.04]">
        <span
          className="block font-bold font-serif leading-none"
          style={{ color: "#4A6FA5", opacity: 0.14, fontSize: "96px" }}
        >
          ×3
        </span>
        <span
          className="block text-[10px] font-semibold uppercase tracking-[0.22em] mt-1"
          style={{ color: "#4A6FA5", opacity: 0.42 }}
        >
          the same connection
        </span>
      </div>
    </div>
  );
}

function AWSHero() {
  return (
    <div
      className="relative h-48 overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#1B2733" }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 65%)",
        }}
      />
      <div className="relative flex items-end gap-7 select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.04]">
        <div className="text-center">
          <span
            className="block font-bold font-serif leading-none"
            style={{
              color: "rgba(255,255,255,0.18)",
              fontSize: "56px",
              textDecoration: "line-through",
              textDecorationColor: "rgba(255,255,255,0.1)",
            }}
          >
            13%
          </span>
          <span
            className="block text-[9px] uppercase tracking-widest mt-2 font-medium"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Before
          </span>
        </div>
        <span
          className="text-xl font-light mb-7"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          →
        </span>
        <div className="text-center">
          <span
            className="block font-bold font-serif leading-none"
            style={{ color: "rgba(255,255,255,0.72)", fontSize: "56px" }}
          >
            67
            <span
              style={{
                fontSize: "34px",
                color: "rgba(255,255,255,0.36)",
                fontWeight: 400,
              }}
            >
              /100
            </span>
          </span>
          <span
            className="block text-[9px] uppercase tracking-widest mt-2 font-medium"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            After
          </span>
        </div>
      </div>
    </div>
  );
}

function SproutHero() {
  const labels = ["Input", "Response", "Loading", "Retry", "Error", "Action"];
  return (
    <div
      className="relative h-48 overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#F0FBF2" }}
    >
      <div className="grid grid-cols-3 gap-2 select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.04]">
        {labels.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 36,
              borderRadius: 4,
              border: "1px solid rgba(46,155,92,0.28)",
              backgroundColor: "rgba(255,255,255,0.75)",
            }}
          >
            <span
              className="text-[10px] font-medium"
              style={{ color: "rgba(46,155,92,0.65)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <span
        className="absolute bottom-3 right-4 text-[9px] font-semibold uppercase tracking-widest"
        style={{ color: "rgba(46,155,92,0.38)" }}
      >
        Component Library
      </span>
    </div>
  );
}

const HEROES: Record<CaseStudyId, React.FC> = {
  qlik: QlikHero,
  aws: AWSHero,
  sprout: SproutHero,
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
  const Hero = HEROES[id];
  const quote = CARD_QUOTES[id];

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 20, stiffness: 250 });
  const sRotY = useSpring(rotY, { damping: 20, stiffness: 250 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rotX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 5);
    rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 5);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.12 * i, ease: [0.25, 0, 0.1, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      style={{ rotateX: sRotX, rotateY: sRotY, transformPerspective: 900 }}
      whileHover={{ boxShadow: "0 28px 64px rgba(26,26,26,0.13)" }}
      className="group text-left rounded-xl overflow-hidden border border-[#211D1D]/10 hover:border-[#211D1D]/18 transition-colors duration-300 relative bg-[#FFFDF9] flex flex-col"
    >
      <Hero />

      <div
        className="h-[3px] w-full transition-all duration-300 group-hover:h-[4px] shrink-0"
        style={{ backgroundColor: study.color }}
      />

      <div className="px-6 pt-5 pb-16 flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#211D1D]/35">
            {study.company}
          </p>
          {study.ndaLevel === "partial" && (
            <span className="flex items-center gap-1 text-[10px] text-[#211D1D]/30 bg-[#211D1D]/5 px-1.5 py-0.5 rounded">
              <Lock className="h-2.5 w-2.5" /> NDA
            </span>
          )}
        </div>

        <h3 className="text-[17px] font-bold text-[#211D1D] leading-snug font-serif">
          {study.title}
        </h3>
        <p className="mt-1.5 text-sm text-[#211D1D]/45 leading-relaxed">
          {study.hook.headline}
        </p>
      </div>

      {/* Default CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-between transition-all duration-200 group-hover:opacity-0 group-hover:-translate-y-1"
        style={{ background: "linear-gradient(to top, #FFFDF9 60%, transparent)" }}
      >
        <span className="text-sm font-medium text-[#211D1D]/40">Read the story</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-[#211D1D]/30" />
      </div>

      {/* Hover reveal — user voice quote or fallback stat */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out border-t"
        style={{
          backgroundColor: study.accentColor,
          borderColor: `${study.color}20`,
        }}
      >
        <p
          className="text-[11px] leading-snug pr-2 italic"
          style={{ color: `${study.color}cc` }}
        >
          {quote ? `"${quote}"` : CARD_STATS[id]}
        </p>
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
        className="mb-10"
      >
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#2E9B5C] mb-2">
          Selected Work
        </p>
        <h2 className="text-3xl font-bold text-[#211D1D] tracking-tight font-serif">
          Three problems worth understanding
        </h2>
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
