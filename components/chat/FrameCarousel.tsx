"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy, type CaseStudyImage } from "@/content/knowledge";

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
  image?: CaseStudyImage;
  // Structured feature list for the Solution frame - kept as real
  // {name, description} pairs instead of joined into one paragraph, so a
  // frame with no screenshot still reads as a scannable list rather than
  // a wall of prose. See council round 5.
  features?: { name: string; description: string }[];
  status?: string;
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
      image: study.hook.image,
    },
    {
      label: "Friction",
      headline: study.friction.headline,
      body: study.friction.problems.slice(0, 4).map((p) => `• ${p}`).join("\n"),
      quote: study.friction.userVoice?.[0],
      extra: study.friction.researchMethod,
      image: study.friction.image,
    },
  ];

  if (study.pivot) {
    frames.push({
      label: "Pivot",
      headline: study.pivot.headline,
      body: clean(study.pivot.insight),
      image: study.pivot.image,
    });
  }

  frames.push({
    label: "Solution",
    headline: study.solution.headline,
    body: "",
    features: study.solution.features.slice(0, 2),
    nda: study.ndaLevel === "partial",
    image: study.solution.image,
  });

  frames.push({
    label: "Impact",
    headline: study.impact.headline,
    body: study.impact.outcomes.slice(0, 4).map((o) => `• ${o}`).join("\n"),
    extra: `What I'd do differently: ${study.impact.whatIDifferently}`,
    image: study.impact.image,
    status: study.impact.status,
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
  // A text-only frame gets a taller, accent-bordered headline treatment
  // instead of the same small heading a screenshot frame uses - the
  // headline itself becomes the visual anchor an image would otherwise
  // be. See council round 5: no fabricated charts, just real typographic
  // hierarchy for content that's genuinely screenshot-less.
  const isTextOnly = !frame.image && !frame.nda;

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

        {/* Step pills - a filled dot marks frames with a real screenshot,
            so a visitor can calibrate before clicking instead of feeling
            baited by a frame that turns out to be text-only. */}
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
              {f.image && (
                <span
                  className={`w-1 h-1 rounded-full ${i === current ? "bg-white/70" : "bg-[#2E9B5C]/60"}`}
                  aria-hidden="true"
                />
              )}
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
                {frame.image && (
                  <a
                    href={frame.image.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full group/img relative"
                    aria-label="Open full-size image in a new tab"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={frame.image.src}
                      alt={frame.image.alt}
                      className="w-full rounded-lg border border-[#211D1D]/10"
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">
                      View full size ↗
                    </span>
                  </a>
                )}
                {frame.features && (
                  <div className="w-full space-y-2.5 mt-1">
                    {frame.features.map((f) => (
                      <div key={f.name}>
                        <p className="text-xs font-semibold text-[#211D1D]/70">{f.name}</p>
                        <p className="text-sm text-[#211D1D]/60 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-[#211D1D]/40 mt-1 italic">
                  {study.solution.ndaSafeNote}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#2E9B5C]">
                    {frame.label}
                  </p>
                  {frame.status && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2E9B5C]/10 text-[#2E9B5C]">
                      {frame.status}
                    </span>
                  )}
                </div>
                <h4
                  className={
                    isTextOnly
                      ? "text-xl font-semibold text-[#211D1D] leading-snug mb-3 pl-3 border-l-[3px]"
                      : "text-lg font-semibold text-[#211D1D] leading-snug mb-3"
                  }
                  style={isTextOnly ? { borderColor: study.color } : undefined}
                >
                  {frame.headline}
                </h4>
                {frame.image && (
                  <a
                    href={frame.image.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-3 group/img relative"
                    aria-label="Open full-size image in a new tab"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={frame.image.src}
                      alt={frame.image.alt}
                      className="w-full rounded-lg border border-[#211D1D]/10"
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">
                      View full size ↗
                    </span>
                  </a>
                )}
                {frame.features ? (
                  <div className="space-y-3">
                    {frame.features.map((f) => (
                      <div key={f.name}>
                        <p className="text-sm font-semibold text-[#211D1D]/80">{f.name}</p>
                        <p className="text-sm text-[#211D1D]/60 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#211D1D]/65 leading-relaxed whitespace-pre-wrap">
                    {frame.body}
                  </p>
                )}
                {frame.quote && (
                  <p className="mt-3 text-xs text-[#211D1D]/50 italic border-l-2 border-[#2E9B5C]/30 pl-3 leading-relaxed">
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
                i === current ? "bg-[#2E9B5C] w-4" : "bg-[#211D1D]/20 w-1.5"
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
