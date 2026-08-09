"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";

const FRAME_ICONS: Record<string, string> = {
  Hook: "○",
  Friction: "△",
  Pivot: "◇",
  Solution: "□",
  Impact: "★",
};

interface FrameCarouselProps {
  project: CaseStudyId;
}

type FrameData = {
  label: string;
  headline: string;
  body: string;
  nda?: boolean;
  quote?: string;
  extra?: string;
};

function clean(s: string) {
  return s.replace(/[ \t]{2,}/g, " ").replace(/\n[ \t]+/g, "\n").trim();
}

function buildFrames(study: CaseStudy): FrameData[] {
  const frames: FrameData[] = [
    {
      label: "Hook",
      headline: study.hook.headline,
      body: clean(study.hook.context),
      extra: study.hook.scale,
    },
    {
      label: "Friction",
      headline: study.friction.headline,
      body: study.friction.problems.slice(0, 4).map((p) => `• ${p}`).join("\n"),
      quote: study.friction.userVoice?.[0],
      extra: study.friction.researchMethod,
    },
  ];

  if (study.pivot) {
    frames.push({
      label: "Pivot",
      headline: study.pivot.headline,
      body: clean(study.pivot.insight),
    });
  }

  frames.push({
    label: "Solution",
    headline: study.solution.headline,
    body: study.solution.features
      .slice(0, 2)
      .map((f) => `${f.name}\n${f.description}`)
      .join("\n\n"),
    nda: study.ndaLevel === "partial",
  });

  frames.push({
    label: "Impact",
    headline: study.impact.headline,
    body: study.impact.outcomes.slice(0, 4).map((o) => `• ${o}`).join("\n"),
    extra: `What I'd do differently: ${study.impact.whatIDifferently}`,
  });

  return frames;
}

export function FrameCarousel({ project }: FrameCarouselProps) {
  const study = knowledge.caseStudies[project] as CaseStudy;
  const frames = buildFrames(study);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const frame = frames[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-3 rounded-xl overflow-hidden border border-[#211D1D]/10 bg-[#FFFDF9]"
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 border-b border-[#211D1D]/8"
        style={{ borderTopColor: study.color, borderTopWidth: 3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#211D1D]/40">
              {study.company}
            </p>
            <h3 className="text-base font-semibold text-[#211D1D] mt-0.5">
              {study.title}
            </h3>
          </div>
          <span className="text-xs text-[#211D1D]/40">
            {current + 1} / {frames.length}
          </span>
        </div>

        {/* Step pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5 scrollbar-none">
          {frames.map((f, i) => (
            <button
              key={f.label}
              onClick={() => go(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                i === current
                  ? "bg-[#211D1D] text-white"
                  : "bg-[#FAF3E7] text-[#211D1D]/50 hover:text-[#211D1D]/80"
              }`}
            >
              <span className="text-[10px]">{FRAME_ICONS[f.label] ?? "·"}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame content */}
      <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.25 }}
            className="p-5"
          >
            {frame.nda ? (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-[#211D1D]/40">
                  <Lock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    NDA applies to specifics
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-[#211D1D] leading-snug">
                  {frame.headline}
                </h4>
                <p className="text-sm text-[#211D1D]/60 leading-relaxed whitespace-pre-wrap">
                  {frame.body}
                </p>
                <p className="text-xs text-[#211D1D]/40 mt-1 italic">
                  {study.solution.ndaSafeNote}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C1502D] mb-2">
                  {frame.label}
                </p>
                <h4 className="text-lg font-semibold text-[#211D1D] leading-snug mb-3">
                  {frame.headline}
                </h4>
                <p className="text-sm text-[#211D1D]/65 leading-relaxed whitespace-pre-wrap">
                  {frame.body}
                </p>
                {frame.quote && (
                  <p className="mt-3 text-xs text-[#211D1D]/50 italic border-l-2 border-[#C1502D]/30 pl-3 leading-relaxed">
                    {frame.quote}
                  </p>
                )}
                {frame.extra && (
                  <p className="mt-3 pt-3 border-t border-[#211D1D]/8 text-xs text-[#211D1D]/40 italic leading-relaxed">
                    {frame.extra}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#211D1D]/8 bg-[#FAF3E7]/50">
        <button
          onClick={() => go(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex items-center gap-1 text-sm text-[#211D1D]/50 hover:text-[#211D1D] disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <div className="flex gap-1.5">
          {frames.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-150 ${
                i === current ? "bg-[#C1502D] w-4" : "bg-[#211D1D]/20 w-1.5"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(Math.min(frames.length - 1, current + 1))}
          disabled={current === frames.length - 1}
          className="flex items-center gap-1 text-sm text-[#211D1D]/50 hover:text-[#211D1D] disabled:opacity-30 transition-colors"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
