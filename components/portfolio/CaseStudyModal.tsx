"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy } from "@/content/knowledge";
import { buildBeat, renderVisual, type BeatId, type BeatData } from "@/components/chat/CaseStudyBeat";

const BEAT_ORDER: BeatId[] = ["hook", "friction", "pivot", "solution", "impact"];

// Council round 23: which beat's image/visual is literally the same
// content CaseStudyCard.tsx previews on the landing grid - qlik's card
// shows the real browse-connections.jpg screenshot (that's the
// `solution` beat, not `hook`), AWS's card shows the 67/100 breakdown
// (also `solution`), sprout's card shows the swatchChaos colors (that's
// `friction`). Opening straight to that beat, with a matching
// `layoutId` on its visual, is what makes the shared-element transition
// below actually connect to what was clicked instead of an unrelated
// diagram morphing in.
const CARD_PREVIEW_BEAT: Record<CaseStudyId, BeatId> = {
  qlik: "solution",
  aws: "solution",
  sprout: "friction",
};

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
// Color, round 26 (full aesthetic pivot to a real reference site the user pointed at):
// this shell was a deliberate dark "focus mode" (ink backdrop, cream
// text, marigold accents) built to differ from the rest of a
// cream-primary page. Round 24 then made ink the primary page
// background everywhere, which made this consistent; round 26 reverses
// that back to cream-primary to match the reference site's flat, all-
// light look. Leaving this modal dark now would be the one inconsistent
// dark surface left on an otherwise all-light site - so it flips too,
// to the same cream/ink/marigold-sparingly palette as everywhere else.
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

  // Council round 23: opening straight to the beat matching the clicked
  // card (CARD_PREVIEW_BEAT) used to be done in a useEffect - which
  // fires *after* the first paint, so the very first frame rendered was
  // always "hook" (frameIndex's stale initial 0) before snapping to the
  // right beat a tick later. A visible flash of the wrong content right
  // as the shared-element transition is trying to prove spatial
  // continuity defeated the whole point. React's own recommended fix
  // for "derive state from a changed prop": compare against the last
  // seen project *during render* and correct frameIndex immediately,
  // so the corrected value is what actually gets painted the first time.
  const [lastProject, setLastProject] = useState<CaseStudyId | null>(null);
  if (project !== lastProject) {
    setLastProject(project);
    if (project) {
      const idx = frames.findIndex((f) => f.beat === CARD_PREVIEW_BEAT[project]);
      setFrameIndex(idx >= 0 ? idx : 0);
    }
  }

  useEffect(() => {
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

  const frame = frames[frameIndex];

  // Council round 21 ("UI-wise, interactions"): this used to be two early
  // `return null`s right here - which meant AnimatePresence below never
  // saw this element unmount; React removed the whole subtree in the
  // same tick, so the `exit` transition that was "defined" on it never
  // actually played on close. The guard now lives inside
  // AnimatePresence's children instead, so closing genuinely animates.
  return (
    <AnimatePresence>
      {study && project && frame && (() => {
        const data = frame.data;
        return (
        <motion.div
          key="case-study-modal"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#FAF3E7] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${study.title} case study`}
        >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#211D1D]/10 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#211D1D]/45">
              {study.company} &middot; {study.year}
            </p>
            <h2 className="text-lg font-bold text-[#211D1D]">{study.title}</h2>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            aria-label="Close"
            className="p-2 rounded-full text-[#211D1D]/60 hover:text-[#211D1D] hover:bg-[#211D1D]/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Frame content gets a real transition on prev/next now instead
            of swapping instantly - "smooth scrolling transitions...
            guide attention" was one of the concrete, applicable pieces
            of the current interaction-design research, unlike the
            3D/cursor-reactive showcases that dominate that research and
            don't fit a text-and-real-screenshots case study. */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={frame.beat}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {data.image || data.visual ? (
                  <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                    <div className="lg:w-[60%] flex items-center justify-center">
                      <FrameVisualPanel
                        data={data}
                        study={study}
                        sharedLayoutId={frame.beat === CARD_PREVIEW_BEAT[project] ? `case-study-image-${project}` : undefined}
                      />
                    </div>
                    <div className="lg:w-[40%] flex flex-col">
                      <FrameNarrative data={data} study={study} />
                    </div>
                  </div>
                ) : (
                  // No image/visual modeled for this beat (typically a
                  // text-only pivot frame) - a single centered column, not
                  // a 60/40 split with nothing real to put on the left.
                  // The 60/40 split previously repeated the same
                  // paragraph on both sides to fill the empty visual slot
                  // - a real content-duplication bug, the exact failure
                  // mode this project spent several earlier rounds fixing
                  // elsewhere.
                  <div className="max-w-xl mx-auto flex flex-col items-center text-center">
                    <FrameNarrative data={data} study={study} centered showSecondParagraph />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-[#211D1D]/10 shrink-0">
          <motion.button
            type="button"
            onClick={() => setFrameIndex((i) => Math.max(i - 1, 0))}
            disabled={frameIndex === 0}
            whileTap={frameIndex === 0 ? undefined : { scale: 0.95, x: -2 }}
            className="flex items-center gap-1 text-sm font-medium text-[#211D1D]/60 hover:text-[#211D1D] disabled:opacity-25 disabled:hover:text-[#211D1D]/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </motion.button>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Frames">
            {frames.map((f, i) => (
              <button
                key={f.beat}
                type="button"
                onClick={() => setFrameIndex(i)}
                aria-label={`${f.data.label} frame`}
                aria-selected={i === frameIndex}
                role="tab"
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === frameIndex ? "bg-[#F2A93C]" : "bg-[#211D1D]/25 hover:bg-[#211D1D]/45"}`}
              />
            ))}
          </div>
          <motion.button
            type="button"
            onClick={() => setFrameIndex((i) => Math.min(i + 1, frames.length - 1))}
            disabled={frameIndex === frames.length - 1}
            whileTap={frameIndex === frames.length - 1 ? undefined : { scale: 0.95, x: 2 }}
            className="flex items-center gap-1 text-sm font-medium text-[#211D1D]/60 hover:text-[#211D1D] disabled:opacity-25 disabled:hover:text-[#211D1D]/60 transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!miniInput.trim()) return;
            onAskAboutProject(project, miniInput.trim());
            setMiniInput("");
          }}
          className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-[#211D1D]/10 bg-[#FAF3E7]"
        >
          <input
            value={miniInput}
            onChange={(e) => setMiniInput(e.target.value)}
            placeholder={`Ask about ${study.title}...`}
            aria-label={`Ask about ${study.title}`}
            className="flex-1 text-sm text-[#211D1D] placeholder:text-[#211D1D]/35 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!miniInput.trim()}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#F2A93C] text-[#FAF3E7] text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-30 hover:bg-[#E0972E] transition-colors"
          >
            Ask
          </button>
        </form>
        </motion.div>
        );
      })()}
    </AnimatePresence>
  );
}

function FrameVisualPanel({ data, study, sharedLayoutId }: { data: BeatData; study: CaseStudy; sharedLayoutId?: string }) {
  if (data.image) {
    return (
      <motion.div layoutId={sharedLayoutId} className="relative w-full max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.image.src}
          alt={data.image.alt}
          className="w-full rounded-sm border border-[#211D1D]/15"
        />
        {data.nda && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-[#FAF3E7]/85 text-[#211D1D] text-[10px] font-medium border border-[#211D1D]/15">
            <Lock className="h-3 w-3" /> NDA &middot; in-progress prototype
          </span>
        )}
      </motion.div>
    );
  }
  // data.visual - the only other case this gets called for (the parent
  // only renders this component at all when image or visual exists; see
  // the centered-single-column branch in the main render for beats with
  // neither).
  return (
    <motion.div layoutId={sharedLayoutId} className="w-full max-w-md rounded-sm overflow-hidden">
      {data.visual && renderVisual(data.visual, study.color, study.accentColor)}
    </motion.div>
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
      <h3 className="mt-2 text-2xl lg:text-3xl font-bold text-[#211D1D] leading-snug">{data.headline}</h3>
      {data.paragraphs[0] && (
        <p className="mt-4 text-[15px] text-[#211D1D]/70 leading-relaxed">{data.paragraphs[0]}</p>
      )}
      {showSecondParagraph && data.paragraphs[1] && (
        <p className="mt-3 text-[15px] text-[#211D1D]/70 leading-relaxed">{data.paragraphs[1]}</p>
      )}
      {data.quote && (
        <p className={`mt-5 text-lg italic text-[#211D1D]/90 leading-snug ${centered ? "" : "border-l-2 border-[#F2A93C]/50 pl-4"}`}>
          &ldquo;{data.quote.replace(/^"|"$/g, "")}&rdquo;
        </p>
      )}
      {data.list && (
        <ol className={`mt-4 space-y-2 ${centered ? "text-left inline-block" : ""}`}>
          {data.list.slice(0, 4).map((item, i) => (
            <li key={item} className="flex gap-2.5 text-sm text-[#211D1D]/70">
              <span className="text-[#F2A93C] font-semibold shrink-0">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      )}
      {data.nda && study.solution.ndaSafeNote && (
        <p className="mt-4 text-xs italic text-[#211D1D]/40">{study.solution.ndaSafeNote}</p>
      )}
      {data.extra && (
        <p className="mt-4 text-sm italic text-[#211D1D]/55 leading-relaxed">{data.extra}</p>
      )}
    </>
  );
}
