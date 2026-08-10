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
  label: string;
  headline: string;
  body: string;
  nda?: boolean;
  quote?: string;
  extra?: string;
  image?: CaseStudyImage;
  features?: { name: string; description: string }[];
  status?: string;
  visual?: FrameVisual;
};

function clean(s: string) {
  return s.replace(/[ \t]{2,}/g, " ").replace(/\n[ \t]+/g, "\n").trim();
}

// Same renderVisual as before - see the "Visual system" comment above
// FrameVisual in knowledge.ts. Unchanged by the chat-native rebuild
// (council round 11): the diagrams themselves tested fine, only the
// container they lived in (a paginated multi-beat card, then a single
// long scroll) was ever the problem.
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
  switch (beat) {
    case "hook":
      return { label: "Hook", headline: study.hook.headline, body: clean(study.hook.context), extra: study.hook.scale, image: study.hook.image, visual: study.hook.visual };
    case "friction":
      return { label: "Friction", headline: study.friction.headline, body: study.friction.problems.slice(0, 4).map((p) => `• ${p}`).join("\n"), quote: study.friction.userVoice?.[0], extra: study.friction.researchMethod, image: study.friction.image, visual: study.friction.visual };
    case "pivot":
      if (!study.pivot) return null;
      return { label: "Pivot", headline: study.pivot.headline, body: clean(study.pivot.insight), extra: study.pivot.designDecision, image: study.pivot.image };
    case "solution":
      return { label: "Solution", headline: study.solution.headline, body: "", features: study.solution.features.slice(0, 2), nda: study.ndaLevel === "partial", image: study.solution.image, visual: study.solution.visual };
    case "impact":
      return { label: "Impact", headline: study.impact.headline, body: study.impact.outcomes.slice(0, 4).map((o) => `• ${o}`).join("\n"), extra: `What I'd do differently: ${study.impact.whatIDifferently}`, image: study.impact.image, status: study.impact.status, visual: study.impact.visual };
  }
}

// Renders exactly ONE narrative beat of a case study, as its own
// self-contained chat-message attachment - no pagination, no multi-beat
// card, no "1 of 5" anything. Council round 11: two earlier attempts
// (a paginated slideshow card, then a single long continuous scroll)
// were both rejected. The actual fix was structural, not visual - a case
// study should exist as separate chat turns the way any other multi-part
// answer in this chat does, each with its own message, its own diagram,
// its own followups, letting a visitor type a real question or click
// "continue" at every step instead of consuming a bundled artifact.
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
  const isMoment = data.label === "Hook" || data.label === "Impact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-2 rounded-lg overflow-hidden border border-[#211D1D]/10 bg-[#FFFDF9]"
      style={{ borderTopColor: study.color, borderTopWidth: 3 }}
    >
      <div className="px-5 pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#211D1D]/40">{study.company} · {study.title}</p>
      </div>
      <div className="p-5">
        {data.nda ? (
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 text-[#211D1D]/40">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">NDA applies to specifics</span>
            </div>
            <h4 className="text-lg font-semibold text-[#211D1D] leading-snug">{data.headline}</h4>
            {data.image && (
              <button type="button" onClick={() => setLightboxImage(data.image!)} className="block w-full group/img relative text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.image.src} alt={data.image.alt} className="w-full rounded-lg border border-[#211D1D]/10" />
                <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">View full size ↗</span>
              </button>
            )}
            {data.visual && <div className="w-full -mx-5 mb-4 overflow-hidden" style={{ width: "calc(100% + 2.5rem)" }}>{renderVisual(data.visual, study.color, study.accentColor)}</div>}
            {data.features && (
              <div className="w-full space-y-2.5 mt-1">
                {data.features.map((f) => (
                  <div key={f.name}>
                    <p className="text-xs font-semibold text-[#211D1D]/70">{f.name}</p>
                    <p className="text-sm text-[#211D1D]/60 leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-[#211D1D]/40 mt-1 italic">{study.solution.ndaSafeNote}</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: study.color }}>{data.label}</p>
              {data.status && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2E9B5C]/10 text-[#2E9B5C]">{data.status}</span>
              )}
            </div>
            <h4 className={isMoment ? "font-serif text-2xl font-semibold text-[#211D1D] leading-snug mb-4" : "text-lg font-semibold text-[#211D1D] leading-snug mb-3"}>
              {data.headline}
            </h4>
            {data.image && (
              <button type="button" onClick={() => setLightboxImage(data.image!)} className="block mb-3 group/img relative w-full text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.image.src} alt={data.image.alt} className="w-full rounded-lg border border-[#211D1D]/10" />
                <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">View full size ↗</span>
              </button>
            )}
            {data.visual && <div className="-mx-5 mb-4 overflow-hidden">{renderVisual(data.visual, study.color, study.accentColor)}</div>}
            {data.features ? (
              <div className="space-y-3">
                {data.features.map((f) => (
                  <div key={f.name}>
                    <p className="text-sm font-semibold text-[#211D1D]/80">{f.name}</p>
                    <p className="text-sm text-[#211D1D]/60 leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#211D1D]/65 leading-relaxed whitespace-pre-wrap">{data.body}</p>
            )}
            {data.quote && (
              <p className="mt-3 text-xs text-[#211D1D]/50 italic border-l-2 border-[#2E9B5C]/30 pl-3 leading-relaxed">{data.quote}</p>
            )}
            {data.extra && (
              data.label === "Hook" ? (
                <p className="mt-4 text-xs font-medium text-[#211D1D]/75 leading-relaxed bg-[#F2A93C]/12 border-l-2 border-[#F2A93C] rounded-r px-3 py-2">{data.extra}</p>
              ) : (
                <p className="mt-3 pt-3 border-t border-[#211D1D]/8 text-xs text-[#211D1D]/40 italic leading-relaxed">{data.extra}</p>
              )
            )}
          </div>
        )}
      </div>

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
