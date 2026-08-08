"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";

const FRAME_ICONS: Record<string, string> = { Hook: "○", Friction: "△", Pivot: "◇", Solution: "□", Impact: "★" };

interface CaseStudyModalProps { project: CaseStudyId; onClose: () => void; }

type FrameData = { label: string; headline: string; body: string; nda?: boolean; extra?: string; };

function clean(s: string) {
  return s.replace(/[ \t]{2,}/g, " ").replace(/\n[ \t]+/g, "\n").trim();
}

function buildFrames(study: CaseStudy): FrameData[] {
  const frames: FrameData[] = [
    { label: "Hook", headline: study.hook.headline, body: clean(study.hook.context), extra: study.hook.scale },
    { label: "Friction", headline: study.friction.headline, body: study.friction.problems.map((p) => `• ${p}`).join("\n") },
  ];
  if (study.pivot) {
    frames.push({ label: "Pivot", headline: study.pivot.headline, body: clean(study.pivot.insight) });
  }
  frames.push({
    label: "Solution",
    headline: study.solution.headline,
    body: study.solution.features.slice(0, 3).map((f) => `${f.name}\n${f.description}`).join("\n\n"),
    nda: study.ndaLevel === "partial",
    extra: study.solution.ndaSafeNote,
  });
  frames.push({
    label: "Impact",
    headline: study.impact.headline,
    body: study.impact.outcomes.map((o) => `• ${o}`).join("\n"),
    extra: `What I'd do differently: ${study.impact.whatIDifferently}`,
  });
  return frames;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const study = knowledge.caseStudies[project] as CaseStudy;
  const frames = buildFrames(study);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (idx: number) => { setDirection(idx > current ? 1 : -1); setCurrent(idx); };
  const frame = frames[current];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ duration: 0.25 }} className="relative z-10 w-full max-w-2xl bg-[#F7F6F3] rounded-2xl overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1A1A1A]/8 hover:bg-[#1A1A1A]/15 flex items-center justify-center transition-colors">
          <X className="h-4 w-4 text-[#1A1A1A]/60" />
        </button>

        <div className="px-7 pt-7 pb-5" style={{ borderTopColor: study.color, borderTopWidth: 4 }}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#1A1A1A]/40">{study.company}</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1A1A1A] tracking-tight font-serif">{study.title}</h2>
          <p className="mt-1 text-sm text-[#1A1A1A]/50">{study.hook.headline}</p>
          <div className="flex gap-2 mt-5 overflow-x-auto pb-0.5 scrollbar-none">
            {frames.map((f, i) => (
              <button key={f.label} onClick={() => go(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border ${i === current ? "border-transparent bg-[#1A1A1A] text-white" : "border-[#1A1A1A]/12 text-[#1A1A1A]/50 hover:text-[#1A1A1A]/80 bg-white"}`}>
                <span className="text-[10px]">{FRAME_ICONS[f.label] ?? "·"}</span>{f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden bg-white" style={{ minHeight: 260 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={current} initial={{ opacity: 0, x: direction * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -40 }} transition={{ duration: 0.22 }} className="px-7 py-7">
              {frame.nda ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#1A1A1A]/40">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">NDA applies</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] leading-snug font-serif">{frame.headline}</h3>
                  <p className="text-[15px] text-[#1A1A1A]/60 leading-relaxed whitespace-pre-wrap">{frame.body}</p>
                  {frame.extra && <p className="text-xs text-[#1A1A1A]/40 italic mt-2">{frame.extra}</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#C4654A]">{frame.label}</p>
                  <h3 className="text-xl font-bold text-[#1A1A1A] leading-snug font-serif">{frame.headline}</h3>
                  <p className="text-[15px] text-[#1A1A1A]/60 leading-relaxed whitespace-pre-wrap">{frame.body}</p>
                  {frame.extra && frame.label === "Impact" && (
                    <p className="text-xs text-[#1A1A1A]/45 italic border-t border-[#1A1A1A]/8 pt-3 mt-3">{frame.extra}</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-7 py-4 border-t border-[#1A1A1A]/8">
          <button onClick={() => go(Math.max(0, current - 1))} disabled={current === 0} className="flex items-center gap-1.5 text-sm text-[#1A1A1A]/50 hover:text-[#1A1A1A] disabled:opacity-30 transition-colors font-medium">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex gap-1.5 items-center">
            {frames.map((_, i) => (
              <button key={i} onClick={() => go(i)} className={`rounded-full transition-all duration-150 ${i === current ? "bg-[#C4654A] w-5 h-1.5" : "bg-[#1A1A1A]/15 w-1.5 h-1.5"}`} />
            ))}
          </div>
          <button onClick={() => go(Math.min(frames.length - 1, current + 1))} disabled={current === frames.length - 1} className="flex items-center gap-1.5 text-sm text-[#1A1A1A]/50 hover:text-[#1A1A1A] disabled:opacity-30 transition-colors font-medium">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
