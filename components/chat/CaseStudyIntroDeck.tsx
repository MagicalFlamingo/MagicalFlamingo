"use client";

import { CaseStudyIntroCard } from "./CaseStudyIntroCard";
import type { CaseStudyId } from "@/content/knowledge";

interface CaseStudyIntroDeckProps {
  onOpen: (project: CaseStudyId) => void;
  startDelay: number;
}

// Round 26 (full aesthetic pivot to a real reference site the user pointed at): that
// site's "Selected work" section is one plain, equal-width 3-up grid -
// no asymmetric featured tile. Round 25's "salon hang" (AWS bigger,
// Qlik/Sprout smaller) was a real, considered idea, but the reference
// the user actually pointed at doesn't do that, and "much closer to a
// straight copy" was the explicit instruction this round - so this is
// a plain equal grid now, stacking to one column on mobile.
export function CaseStudyIntroDeck({ onOpen, startDelay }: CaseStudyIntroDeckProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <CaseStudyIntroCard project="aws" onOpen={onOpen} delay={startDelay} />
      <CaseStudyIntroCard project="qlik" onOpen={onOpen} delay={startDelay + 0.1} />
      <CaseStudyIntroCard project="sprout" onOpen={onOpen} delay={startDelay + 0.2} />
    </div>
  );
}
