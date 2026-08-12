"use client";

import { motion } from "framer-motion";
import { CaseStudyCard } from "./CaseStudyCard";
import type { CaseStudyId } from "@/content/knowledge";

const PROJECT_ORDER: CaseStudyId[] = ["aws", "qlik", "sprout"];

interface CaseStudyGridProps {
  onOpen: (project: CaseStudyId) => void;
}

export function CaseStudyGrid({ onOpen }: CaseStudyGridProps) {
  return (
    <section className="px-6 lg:px-16 py-20 max-w-6xl mx-auto">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.4 }}
        className="text-xs font-bold uppercase tracking-[0.12em] text-[#211D1D]/40"
      >
        Case studies
      </motion.p>
      {/* Council round 23: every section on the page used to reveal
          itself once, at mount, regardless of scroll position - a page
          with zero scroll-tied motion is what "closes the window," not
          the color palette. This headline now genuinely responds to
          being scrolled to (a clip-path wipe, not another fade+y), and
          finally carries real weight contrast against the hero (Lora
          600 here vs. 500 on the name, 700 reserved for the featured
          card below) instead of everything sitting at the same bold. */}
      <motion.h2
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 font-serif text-[40px] sm:text-[56px] font-semibold text-[#211D1D] leading-[1.0] tracking-[-0.01em]"
      >
        Real work, real constraints
      </motion.h2>
      {/* Council round 22: three perfectly equal columns is the exact
          "feature grid" shape research names as templated - a bento-
          style asymmetric layout (one larger tile, two stacked) reads as
          considered rather than generated, and it isn't decoration for
          its own sake here: AWS is the one fully public, shipped, non-
          NDA story, so it earning more visual weight is also honest
          about which case study carries the most complete real content. */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-5">
        {PROJECT_ORDER.map((project, i) => (
          <CaseStudyCard key={project} project={project} onOpen={onOpen} featured={i === 0} />
        ))}
      </div>
      <p className="mt-4 text-xs text-[#211D1D]/35">
        Qlik and Sprout are in-progress work, shown NDA-safe.
      </p>
    </section>
  );
}
