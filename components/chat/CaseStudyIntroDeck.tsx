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
//
// Council round 2 ("it feels very condensed"): this grid used to live
// inside the same max-w-[800px] column as the chat prose, which capped
// each tile at ~235px on a 1920px screen - the real AWS/Qlik screenshots,
// the actual evidence of shipped work, were illegible at that size. It
// now renders at the full width of ChatInterface's wider shared
// container (see PAGE_MAX_W there), so tiles genuinely grow with the
// viewport instead of staying phone-sized on a monitor.
export function CaseStudyIntroDeck({ onOpen, startDelay }: CaseStudyIntroDeckProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
      <CaseStudyIntroCard project="aws" onOpen={onOpen} delay={startDelay} />
      <CaseStudyIntroCard project="qlik" onOpen={onOpen} delay={startDelay + 0.1} />
      <CaseStudyIntroCard project="sprout" onOpen={onOpen} delay={startDelay + 0.2} />
    </div>
  );
}
