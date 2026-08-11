"use client";

import { motion } from "framer-motion";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

interface CaseStudyCardProps {
  project: CaseStudyId;
  onOpen: (project: CaseStudyId) => void;
}

// Card backgrounds, per project - confirmed with the user: no fabricated
// screenshots. Qlik has a real one (browse-connections.jpg). AWS and
// Sprout don't have a clean screenshot on disk (the two AWS files that
// exist have hand-drawn annotation marks baked in per existing code
// comments, and no Sprout screenshot exists at all) - both use the same
// real, honest FrameVisual data already established in CaseStudyBeat.tsx
// (67/100 score breakdown; the five real color-drift swatches), just
// rendered large as full-bleed card art instead of a boxed diagram.
function CardBackground({ project }: { project: CaseStudyId }) {
  const study = knowledge.caseStudies[project];

  if (project === "qlik") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/case-studies/qlik/browse-connections.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  if (project === "aws") {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: study.color }}>
        <span className="font-serif font-bold text-[220px] leading-none select-none" style={{ color: "#FAF3E7", opacity: 0.16 }}>
          67
        </span>
      </div>
    );
  }

  // sprout - the real drifted "brand blue" swatches, tiled full-bleed
  const swatches = ["#4A6FA5", "#4E72AB", "#4870A6", "#5175AD", "#496EA2"];
  return (
    <div className="absolute inset-0 flex" style={{ background: study.accentColor }}>
      {swatches.map((hex, i) => (
        <div key={i} className="flex-1 h-full" style={{ background: hex, opacity: 0.85 }} />
      ))}
    </div>
  );
}

export function CaseStudyCard({ project, onOpen }: CaseStudyCardProps) {
  const study = knowledge.caseStudies[project];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg overflow-hidden text-left cursor-pointer"
    >
      <CardBackground project={project} />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors duration-200" />

      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          {study.company} &middot; {study.year}
        </p>
        <h3 className="mt-1.5 font-serif text-2xl font-bold text-white leading-tight">
          {study.title}
        </h3>
        <p className="mt-2 text-sm text-white/85 leading-relaxed">
          {study.hook.headline}
        </p>
        <span className="mt-4 text-sm font-semibold text-white inline-flex items-center gap-1.5">
          Open case study <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </motion.button>
  );
}
