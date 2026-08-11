"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";
import { buildBeat, renderVisual, type BeatId, type BeatData } from "@/components/chat/CaseStudyBeat";

const BEAT_ORDER: BeatId[] = ["hook", "friction", "pivot", "solution", "impact"];

interface CaseStudyModalProps {
  project: CaseStudyId | null;
  onClose: () => void;
  onAskAboutProject: (project: CaseStudyId, question: string) => void;
}

// Full-screen case-study modal (redesign, confirmed pivot back to a
// modal architecture after the chat-native rebuild). Reuses
// buildBeat()/renderVisual() from CaseStudyBeat.tsx directly - one real
// model of "what is beat X of project Y," not a second copy of it.
//
// Frame count is whatever real content exists, not a fixed 5: sprout has
// no `pivot` field in content/knowledge.ts (buildBeat returns null for
// it), so its modal genuinely has 4 frames, not a padded/fabricated 5th.
//
// Color, per council round (light-vs-dark modal): the shell itself
// (backdrop, nav chrome, narrative panel) is ink #211D1D, cream text,
// marigold accents - a deliberate dark "focus mode," not a new neutral
// black. Anything already modeled with its own light chrome (a real
// screenshot, a FrameVisual diagram) keeps that chrome unchanged and
// just sits on top of the dark shell - none of the 6 FrameVisual kinds
// get a parallel dark palette; that's out of scope.
export function CaseStudyModal({ project, onClose, onAskAboutProject }: CaseStudyModalProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [miniInput, setMiniInput] = useState("");

  const study: CaseStudy | null = project ? (knowledge.caseStudies[project] as CaseStudy) : null;

  const frames = useMemo(() => {
    if (!study) return [];
    return BEAT_ORDER.map((beat) => ({ beat, data: buildBeat(study, beat) })).filter(
      (f): f is { beat: BeatId; data: BeatData } => f.data !== null
    );
  }, [study]);

  useEffect(() => {
    setFrameIndex(0);
    setMiniInput("");
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setFrameIndex((i) => Math.min(i + 1, frames.length - 1));
      if (e.key === "ArrowLeft") setFrameIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose, frames.length]);

  if (!study || !project) return null;
  const frame = frames[frameIndex];
  if (!frame) return null;
  const { data } = frame;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-[#211D1D] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`${study.title} case study`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FAF3E7]/10 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FAF3E7]/45">
              {study.company} &middot; {study.year}
            </p>
            <h2 className="font-serif text-lg font-bold text-[#FAF3E7]">{study.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full text-[#FAF3E7]/60 hover:text-[#FAF3E7] hover:bg-[#FAF3E7]/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">
            {data.image || data.visual ? (
              <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                <div className="lg:w-[60%] flex items-center justify-center">
                  <FrameVisualPanel data={data} study={study} />
                </div>
                <div className="lg:w-[40%] flex flex-col">
                  <FrameNarrative data={data} study={study} />
                </div>
              </div>
            ) : (
              // No image/visual modeled for this beat (typically a
              // text-only pivot frame) - a single centered column, not a
              // 60/40 split with nothing real to put on the left. The
              // 60/40 split previously repeated the same paragraph on
              // both sides to fill the empty visual slot - a real
              // content-duplication bug, the exact failure mode this
              // project spent several earlier rounds fixing elsewhere.
              <div className="max-w-xl mx-auto flex flex-col items-center text-center">
                <FrameNarrative data={data} study={study} centered showSecondParagraph />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-[#FAF3E7]/10 shrink-0">
          <button
            type="button"
            onClick={() => setFrameIndex((i) => Math.max(i - 1, 0))}
            disabled={frameIndex === 0}
            className="flex items-center gap-1 text-sm font-medium text-[#FAF3E7]/60 hover:text-[#FAF3E7] disabled:opacity-25 disabled:hover:text-[#FAF3E7]/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Frames">
            {frames.map((f, i) => (
              <button
                key={f.beat}
                type="button"
                onClick={() => setFrameIndex(i)}
                aria-label={`${f.data.label} frame`}
                aria-selected={i === frameIndex}
                role="tab"
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === frameIndex ? "bg-[#F2A93C]" : "bg-[#FAF3E7]/25 hover:bg-[#FAF3E7]/45"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFrameIndex((i) => Math.min(i + 1, frames.length - 1))}
            disabled={frameIndex === frames.length - 1}
            className="flex items-center gap-1 text-sm font-medium text-[#FAF3E7]/60 hover:text-[#FAF3E7] disabled:opacity-25 disabled:hover:text-[#FAF3E7]/60 transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!miniInput.trim()) return;
            onAskAboutProject(project, miniInput.trim());
            setMiniInput("");
          }}
          className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-[#FAF3E7]/10 bg-[#211D1D]"
        >
          <input
            value={miniInput}
            onChange={(e) => setMiniInput(e.target.value)}
            placeholder={`Ask about ${study.title}...`}
            aria-label={`Ask about ${study.title}`}
            className="flex-1 text-sm text-[#FAF3E7] placeholder:text-[#FAF3E7]/35 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!miniInput.trim()}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#F2A93C] text-[#211D1D] text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-30 hover:bg-[#E0972E] transition-colors"
          >
            Ask
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

function FrameVisualPanel({ data, study }: { data: BeatData; study: CaseStudy }) {
  if (data.image) {
    return (
      <div className="relative w-full max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.image.src}
          alt={data.image.alt}
          className="w-full rounded-sm border border-[#FAF3E7]/15"
        />
        {data.nda && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-[#211D1D]/85 text-[#FAF3E7] text-[10px] font-medium border border-[#FAF3E7]/15">
            <Lock className="h-3 w-3" /> NDA &middot; in-progress prototype
          </span>
        )}
      </div>
    );
  }
  // data.visual - the only other case this gets called for (the parent
  // only renders this component at all when image or visual exists; see
  // the centered-single-column branch in the main render for beats with
  // neither).
  return (
    <div className="w-full max-w-md rounded-sm overflow-hidden">
      {data.visual && renderVisual(data.visual, study.color, study.accentColor)}
    </div>
  );
}

// Shared narrative block - used both in the 60/40 split (when a beat has
// a real image/visual) and centered as the sole content (when it
// doesn't). Never rendered twice for the same beat, so nothing here can
// duplicate itself the way the split layout used to when there was
// nothing real to put in the visual slot.
function FrameNarrative({
  data,
  study,
  centered = false,
  showSecondParagraph = false,
}: {
  data: BeatData;
  study: CaseStudy;
  centered?: boolean;
  showSecondParagraph?: boolean;
}) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#F2A93C]">{data.label}</p>
      <h3 className="mt-2 font-serif text-2xl lg:text-3xl font-bold text-[#FAF3E7] leading-snug">{data.headline}</h3>
      {data.paragraphs[0] && (
        <p className="mt-4 text-[15px] text-[#FAF3E7]/70 leading-relaxed">{data.paragraphs[0]}</p>
      )}
      {showSecondParagraph && data.paragraphs[1] && (
        <p className="mt-3 text-[15px] text-[#FAF3E7]/70 leading-relaxed">{data.paragraphs[1]}</p>
      )}
      {data.quote && (
        <p className={`mt-5 text-lg italic text-[#FAF3E7]/90 leading-snug ${centered ? "" : "border-l-2 border-[#F2A93C]/50 pl-4"}`}>
          &ldquo;{data.quote.replace(/^"|"$/g, "")}&rdquo;
        </p>
      )}
      {data.list && (
        <ol className={`mt-4 space-y-2 ${centered ? "text-left inline-block" : ""}`}>
          {data.list.slice(0, 4).map((item, i) => (
            <li key={item} className="flex gap-2.5 text-sm text-[#FAF3E7]/70">
              <span className="text-[#F2A93C] font-semibold shrink-0">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      )}
      {data.nda && study.solution.ndaSafeNote && (
        <p className="mt-4 text-xs italic text-[#FAF3E7]/40">{study.solution.ndaSafeNote}</p>
      )}
      {data.extra && (
        <p className="mt-4 text-sm italic text-[#FAF3E7]/55 leading-relaxed">{data.extra}</p>
      )}
    </>
  );
}
