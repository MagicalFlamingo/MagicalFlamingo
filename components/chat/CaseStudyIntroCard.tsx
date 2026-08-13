"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

// Round 25 ("start from scratch" council). Diagnosis three of four
// advisors converged on independently: 24 rounds repainted the same
// hero -> grid -> chat skeleton; the fix isn't a fourth palette, it's
// collapsing the grid into the conversation itself. This is what the
// old CaseStudyGrid.tsx / CaseStudyCard.tsx became - a case-study
// preview that renders as an early message in the chat log instead of
// a separate scrollable section, so real work is visible in the first
// screenful without ever leaving the conversation.
//
// Visual language ("wall label," the Brand/Typography advisor's term):
// hierarchy comes from an oversized serif title and a tiny letterspaced
// metadata line doing the work color used to do - not from card size or
// a competing palette. Chrome stays the same bordered/paper family
// already used by TimelineCard/NDASafeNote so this reads as a sibling
// of the rest of the chat, not a new component system.
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
        <span className="font-serif font-bold text-4xl inline-flex items-baseline" style={{ color: study.color }}>
          <CountUpNumber value={67} />
          <span className="font-sans font-thin text-base ml-0.5" style={{ color: study.color }}>/100</span>
        </span>
      </div>
    );
  }

  const swatches = ["#4A6FA5", "#4E72AB", "#4870A6", "#5175AD", "#496EA2"];
  const sizes = [18, 14, 20, 13, 17];
  return (
    <div className="w-full h-full flex items-center justify-center gap-1.5" style={{ background: study.accentColor }}>
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
  // AWS is the one fully public, shipped, non-NDA story - same reasoning
  // the old bento grid used for giving it more visual weight, now
  // expressed as "the larger object on the wall" rather than a bigger
  // grid cell.
  featured?: boolean;
}

export function CaseStudyIntroCard({ project, onOpen, delay, featured = false }: CaseStudyIntroCardProps) {
  const study = knowledge.caseStudies[project];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.99 }}
      className={`group w-full text-left border border-[#211D1D]/10 bg-[#FFFDF9] rounded-sm overflow-hidden hover:border-[#F2A93C]/50 hover:shadow-[0_16px_36px_-22px_rgba(33,29,29,0.3)] transition-[border-color,box-shadow] duration-200 flex ${
        featured ? "flex-col sm:flex-row" : "flex-row"
      }`}
    >
      <div
        className={`shrink-0 overflow-hidden border-[#211D1D]/10 ${
          featured ? "h-28 sm:h-auto sm:w-[38%] border-b sm:border-b-0 sm:border-r" : "w-20 border-r"
        }`}
      >
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <CardVisual project={project} />
        </div>
      </div>
      <div className={`min-w-0 flex flex-col justify-center ${featured ? "px-5 py-4 sm:w-[62%]" : "px-3.5 py-2.5"}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#211D1D]/40">
          {study.company} &middot; {study.year}
        </p>
        <h4
          className={`mt-1 font-serif text-[#211D1D] leading-[1.05] tracking-tight ${
            featured ? "text-[26px] font-bold" : "text-[15px] font-bold truncate"
          }`}
        >
          {study.title}
        </h4>
        <p className={`text-[#211D1D]/60 leading-snug ${featured ? "mt-2 text-[13.5px]" : "mt-0.5 text-[12px] line-clamp-1"}`}>
          {study.hook.headline}
        </p>
      </div>
    </motion.button>
  );
}
