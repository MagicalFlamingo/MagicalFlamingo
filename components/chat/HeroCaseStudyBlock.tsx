"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

// Round 3 council ("home page has a lot of text, a lot of items - very
// hard to understand the layout"). Three of five advisors independently
// proposed the same fix without seeing each other's answers, and peer
// review confirmed the version that survives: this isn't a chat that
// happens to show three case studies - it's one real story, with two
// more real projects a click away. What replaced the 3-up equal grid
// (CaseStudyIntroDeck/CaseStudyIntroCard, retired this round):
//
// One hero beat - AWS, the only knowledge.caseStudies entry with
// impact.status "Shipped" - told as an actual reveal using its own real
// copy verbatim (hook.headline, solution.headline from
// content/knowledge.ts), not an invented connective sentence. Peer
// review caught something the original advisors missed: this visual is
// an honest data diagram (a real 67/100, traceable to real component
// scores), not a product screenshot - it's still the strongest EVIDENCE
// on the site, just not the best photo. Framed that way, not oversold.
//
// Then one quiet line for the other two real, in-progress projects -
// still full click-throughs into the same CaseStudyModal (with the same
// real ?case= deep link from round 28), just not competing for equal
// visual weight with the one finished, provable story.
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

interface HeroCaseStudyBlockProps {
  onOpen: (project: CaseStudyId) => void;
  delay: number;
}

export function HeroCaseStudyBlock({ onOpen, delay }: HeroCaseStudyBlockProps) {
  const aws = knowledge.caseStudies.aws;
  const qlik = knowledge.caseStudies.qlik;
  const sprout = knowledge.caseStudies.sprout;

  // Round 3 council (peer review, verified in code): the old tiles had
  // zero click tracking of their own - case_study_opened only fired
  // from inside the chat's showCaseStudyBeat tool calls, so there was
  // never any data on whether a homepage click did anything. Fixed
  // here and on the demoted links below, not just on the hero.
  const openWithTracking = (project: CaseStudyId, source: "hero" | "secondary") => {
    track("case_study_opened", { project, source });
    onOpen(project);
  };

  return (
    <div className="space-y-4">
      <motion.button
        type="button"
        onClick={() => openWithTracking("aws", "hero")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
        className="group w-full text-left flex flex-col sm:flex-row gap-6 sm:items-center"
      >
        <div
          className="w-full sm:w-[38%] aspect-[4/3] shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: aws.accentColor }}
        >
          <span className="font-bold text-6xl inline-flex items-baseline" style={{ color: aws.color }}>
            <CountUpNumber value={67} />
            <span className="font-normal text-2xl ml-1 opacity-60" style={{ color: aws.color }}>
              /100
            </span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">
            <span className="text-[#211D1D]">Shipped</span>
            <span className="text-[#211D1D]/20" aria-hidden="true">
              &middot;
            </span>
            <span className="text-[#211D1D]/40">
              {aws.company} &middot; {aws.year}
            </span>
          </p>
          <h3 className="mt-1.5 text-xl sm:text-2xl font-bold text-[#211D1D] leading-snug tracking-tight group-hover:text-[#7A5C12] transition-colors">
            {aws.hook.headline}
          </h3>
          <p className="mt-2 text-[15px] text-[#211D1D]/60 leading-relaxed">
            {aws.solution.headline}
          </p>
          <p className="mt-3 text-xs font-semibold text-[#F2A93C] group-hover:underline underline-offset-2">
            See the full case study
          </p>
        </div>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.15 }}
        className="text-[13px] text-[#211D1D]/45"
      >
        Also real, in progress:{" "}
        <button
          type="button"
          onClick={() => openWithTracking("qlik", "secondary")}
          className="text-[#211D1D]/70 font-medium hover:text-[#7A5C12] underline underline-offset-2 decoration-[#211D1D]/20 transition-colors"
        >
          {qlik.title}
        </button>{" "}
        &middot;{" "}
        <button
          type="button"
          onClick={() => openWithTracking("sprout", "secondary")}
          className="text-[#211D1D]/70 font-medium hover:text-[#7A5C12] underline underline-offset-2 decoration-[#211D1D]/20 transition-colors"
        >
          {sprout.title}
        </button>
      </motion.p>
    </div>
  );
}
