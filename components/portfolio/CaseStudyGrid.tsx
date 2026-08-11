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
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PROJECT_ORDER.map((project) => (
          <CaseStudyCard key={project} project={project} onOpen={onOpen} />
        ))}
      </div>
      <p className="mt-4 text-xs text-[#211D1D]/35">
        Qlik and Sprout are in-progress work, shown NDA-safe.
      </p>
    </section>
  );
}
