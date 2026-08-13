"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

// Round 25 ("start from scratch" council). Case studies render inline
// as an early part of the chat instead of a separate scrollable
// section, so real work is visible in the first screenful.
//
// Round 26 (full aesthetic pivot to talilupovichportfolio.com, a real
// reference the user pointed at): that site's case-study tiles have no
// chrome at all - no border, no background box, no shadow, no rounded
// container. Just a full-bleed image, a tiny uppercase tag, and a bold
// title underneath. The previous "wall label" bordered-card treatment
// (round 25) is gone - this is a much closer, more literal match to the
// reference than "borrow the idea of oversized type" was.
function CountUpNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

function CardVisual({ project }: { project: CaseStudyId }) {
  const study = knowledge.caseStudies[project];

  if (project === "qlik") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/case-studies/qlik/browse-connections.jpg"
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }

  if (project === "aws") {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: study.accentColor }}>
        <span className="font-bold text-5xl inline-flex items-baseline" style={{ color: study.color }}>
          <CountUpNumber value={67} />
          <span className="font-normal text-xl ml-0.5 opacity-60" style={{ color: study.color }}>/100</span>
        </span>
      </div>
    );
  }

  const swatches = ["#4A6FA5", "#4E72AB", "#4870A6", "#5175AD", "#496EA2"];
  const sizes = [26, 20, 30, 19, 25];
  return (
    <div className="w-full h-full flex items-center justify-center gap-2" style={{ background: study.accentColor }}>
      {swatches.map((hex, i) => (
        <div key={i} className="rounded-[2px]" style={{ background: hex, width: sizes[i], height: sizes[i] }} />
      ))}
    </div>
  );
}

interface CaseStudyIntroCardProps {
  project: CaseStudyId;
  onOpen: (project: CaseStudyId) => void;
  delay: number;
}

export function CaseStudyIntroCard({ project, onOpen, delay }: CaseStudyIntroCardProps) {
  const study = knowledge.caseStudies[project];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group w-full text-left"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <CardVisual project={project} />
        </div>
      </div>
      <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#211D1D]/40">
        {study.company} &middot; {study.year}
      </p>
      <h4 className="mt-1 text-[15px] font-bold text-[#211D1D] leading-tight tracking-tight group-hover:text-[#7A5C12] transition-colors">
        {study.title}
      </h4>
    </motion.button>
  );
}
