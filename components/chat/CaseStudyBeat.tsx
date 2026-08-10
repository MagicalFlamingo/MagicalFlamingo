"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy, type CaseStudyImage, type FrameVisual } from "@/content/knowledge";

export type BeatId = "hook" | "friction" | "pivot" | "solution" | "impact";

interface CaseStudyBeatProps {
  project: CaseStudyId;
  beat: BeatId;
}

type BeatData = {
  image?: CaseStudyImage;
  visual?: FrameVisual;
  nda?: boolean;
};

// Same renderVisual as before - see the "Visual system" comment above
// FrameVisual in knowledge.ts.
function renderVisual(visual: FrameVisual, color: string, accentColor: string) {
  switch (visual.kind) {
    case "bareStat":
      return (
        <div className="px-6 py-14 flex flex-col items-center text-center" style={{ background: color }}>
          <span className="font-serif text-7xl font-bold" style={{ color: "#FAF3E7" }}>{visual.value}</span>
          <span className="mt-4 text-xs tracking-wide" style={{ color: "#FAF3E7", opacity: 0.65 }}>{visual.caption}</span>
        </div>
      );
    case "scoreBreakdown":
      return (
        <div className="rounded-lg border border-[#211D1D]/10 bg-[#FFFDF9] p-6">
          <span className="font-serif text-5xl font-bold" style={{ color }}>{visual.value}</span>
          <div className="mt-5 space-y-3.5">
            {visual.rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs text-[#211D1D]/65 mb-1">
                  <span>{row.label}</span>
                  <span className="font-medium text-[#211D1D]/80">{row.score}/{row.max}</span>
                </div>
                <div className={`${i === 0 ? "h-2.5" : "h-2"} rounded-full overflow-hidden`} style={{ background: accentColor }}>
                  <div className="h-full rounded-full" style={{ width: `${(row.score / row.max) * 100}%`, background: color, opacity: i === 0 ? 1 : 0.65 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "nodes": {
      const main = visual.labels.slice(0, -1);
      const shell = visual.labels[visual.labels.length - 1];
      return (
        <div className="py-10 px-6" style={{ background: accentColor }}>
          <div className="flex flex-wrap gap-4 justify-center">
            {main.map((label) => (
              <div key={label} className="rounded-md px-6 py-5 text-center text-base font-semibold" style={{ background: color, color: "#FAF3E7" }}>
                {label}
              </div>
            ))}
          </div>
          {shell && (
            <div className="flex justify-center mt-4">
              <div className="rounded-md px-4 py-3 text-center text-sm font-semibold opacity-50 translate-y-1" style={{ background: color, color: "#FAF3E7" }}>
                {shell}
              </div>
            </div>
          )}
          <p className="mt-5 text-xs text-center" style={{ color, opacity: 0.7 }}>{visual.caption}</p>
        </div>
      );
    }
    case "duplicateStack":
      return (
        <div className="py-10 px-6" style={{ background: accentColor }}>
          <div className="relative h-24 flex items-center justify-center">
            {Array.from({ length: visual.count }).map((_, idx) => {
              const isTop = idx === visual.count - 1;
              return (
                <div
                  key={idx}
                  className="absolute w-56 h-16 rounded-md flex items-center justify-center text-sm font-semibold"
                  style={{ background: color, opacity: isTop ? 1 : 0.5 - idx * 0.08, color: "#FAF3E7", transform: `translate(${idx * 5}px, ${idx * -5}px)`, zIndex: idx }}
                >
                  {isTop ? visual.label : ""}
                </div>
              );
            })}
            <span className="absolute top-1 right-[calc(50%-6.5rem)] font-serif text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center z-10 shadow-sm" style={{ background: "#FAF3E7", color }}>
              &times;{visual.count}
            </span>
          </div>
          <p className="mt-6 text-xs text-center" style={{ color, opacity: 0.7 }}>{visual.caption}</p>
        </div>
      );
    case "tally": {
      const total = visual.groups * visual.perGroup;
      return (
        <div className="py-8 px-6" style={{ background: accentColor }}>
          <div className="flex items-center gap-6">
            <span className="font-serif text-6xl font-bold shrink-0" style={{ color }}>{total}</span>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: visual.groups }).map((_, g) => (
                <div key={g} className="flex gap-1.5">
                  {Array.from({ length: visual.perGroup }).map((_, s) => (
                    <span key={s} className="w-3.5 h-3.5 rounded-full" style={s === 0 ? { background: color } : { background: "transparent", border: `2px solid ${color}` }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-5 text-xs" style={{ color, opacity: 0.7 }}>{visual.caption}</p>
        </div>
      );
    }
    case "swatchChaos": {
      const offsets = [0, 10, -7, 13, -9];
      const rotations = [0, -6, 4, 0, -5];
      const sizes = [56, 46, 62, 42, 52];
      return (
        <div className="py-12 px-6" style={{ background: accentColor }}>
          <div className="flex items-end justify-center gap-3">
            {visual.swatches.map((hex, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2" style={{ transform: `translateY(${offsets[idx % offsets.length]}px) rotate(${rotations[idx % rotations.length]}deg)` }}>
                <div className="rounded-md shadow-sm" style={{ background: hex, width: sizes[idx % sizes.length], height: sizes[idx % sizes.length] }} />
                <span className="text-[10px] font-mono" style={{ color, opacity: 0.55 }}>{hex}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-center" style={{ color, opacity: 0.7 }}>{visual.caption}</p>
        </div>
      );
    }
    default: {
      const exhaustive: never = visual;
      return exhaustive;
    }
  }
}

function buildBeat(study: CaseStudy, beat: BeatId): BeatData | null {
  const nda = study.ndaLevel === "partial";
  switch (beat) {
    case "hook":
      return study.hook.image || study.hook.visual ? { image: study.hook.image, visual: study.hook.visual } : null;
    case "friction":
      return study.friction.image || study.friction.visual ? { image: study.friction.image, visual: study.friction.visual } : null;
    case "pivot":
      return study.pivot?.image ? { image: study.pivot.image } : null;
    case "solution":
      return study.solution.image || study.solution.visual ? { image: study.solution.image, visual: study.solution.visual, nda } : null;
    case "impact":
      return study.impact.image || study.impact.visual ? { image: study.impact.image, visual: study.impact.visual } : null;
  }
}

// Renders exactly ONE narrative beat of a case study - not as a document
// (headline, body, list, quote, all restating what the reply already
// said), just the one honest visual that goes with it, the same way a
// photo attaches to a text message. Council round 13: "the composition is
// still the same, text, sketch - doesn't feel intuitive and part of the
// agent." The actual bug was duplication - every one of these intents'
// chat responses (content/responses.ts) already says the headline, the
// list items, and the quote as natural prose; the attachment was saying
// the same facts again in a second, document-shaped format stacked under
// it. Cutting the attachment down to just the visual removes the second
// answer instead of trying to make it look more integrated - there's
// nothing left to feel disconnected from the chat around it.
//
// If a beat has no real image or diagram (several Pivot frames don't),
// this renders nothing at all and the reply is plain chat text, same as
// any other intent in this app that doesn't happen to have a visual.
export function CaseStudyBeat({ project, beat }: CaseStudyBeatProps) {
  const study = knowledge.caseStudies[project] as CaseStudy;
  const data = buildBeat(study, beat);
  const [lightboxImage, setLightboxImage] = useState<CaseStudyImage | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxImage]);

  if (!data) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-2">
      {data.image && (
        <button type="button" onClick={() => setLightboxImage(data.image!)} className="block mb-2 group/img relative w-full text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image.src} alt={data.image.alt} className="w-full rounded-lg border border-[#211D1D]/10" />
          {data.nda && (
            <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium">
              <Lock className="h-3 w-3" /> NDA - in-progress prototype
            </span>
          )}
          <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">View full size ↗</span>
        </button>
      )}
      {data.visual && <div className="rounded-lg overflow-hidden">{renderVisual(data.visual, study.color, study.accentColor)}</div>}

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[#211D1D]/80 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxImage.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImage.src} alt={lightboxImage.alt} className="max-w-full max-h-full object-contain rounded-lg" />
            <button type="button" onClick={() => setLightboxImage(null)} aria-label="Close" className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF3E7]/10 text-[#FAF3E7] hover:bg-[#FAF3E7]/20 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
