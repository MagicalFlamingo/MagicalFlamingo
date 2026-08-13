"use client";

import { CaseStudyIntroCard } from "./CaseStudyIntroCard";
import type { CaseStudyId } from "@/content/knowledge";

interface CaseStudyIntroDeckProps {
  onOpen: (project: CaseStudyId) => void;
  // Staggered from wherever the intro sequence's own delay left off, so
  // this reads as one continuous assembly (greeting -> deck -> chips),
  // not three independently-timed animations racing each other.
  startDelay: number;
}

// Round 25: replaces the standalone CaseStudyGrid section. AWS (the one
// fully public, shipped story) renders full-width and larger - the same
// "salon hang" idea the Brand/Typography advisor proposed, unequal
// weight instead of a uniform 3-up grid, just built at chat-message
// scale instead of a full page section.
export function CaseStudyIntroDeck({ onOpen, startDelay }: CaseStudyIntroDeckProps) {
  return (
    <div className="space-y-2.5">
      <CaseStudyIntroCard project="aws" onOpen={onOpen} delay={startDelay} featured />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <CaseStudyIntroCard project="qlik" onOpen={onOpen} delay={startDelay + 0.12} />
        <CaseStudyIntroCard project="sprout" onOpen={onOpen} delay={startDelay + 0.22} />
      </div>
    </div>
  );
}
