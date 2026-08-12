"use client";

import { CaseStudyCard } from "./CaseStudyCard";
import type { CaseStudyId } from "@/content/knowledge";

const PROJECT_ORDER: CaseStudyId[] = ["aws", "qlik", "sprout"];

interface CaseStudyGridProps {
  onOpen: (project: CaseStudyId) => void;
}

export function CaseStudyGrid({ onOpen }: CaseStudyGridProps) {
  return (
    <section className="px-6 lg:px-16 py-20 max-w-6xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#211D1D]/40">
        Case studies
      </p>
      <h2 className="mt-2 font-serif text-3xl font-bold text-[#211D1D]">
        Real work, real constraints
      </h2>
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
