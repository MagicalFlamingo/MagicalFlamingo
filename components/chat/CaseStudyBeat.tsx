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

// Exported (redesign, confirmed pivot): the new full-screen CaseStudyModal
// reuses this exact shape and buildBeat()/renderVisual() below rather
// than re-modeling case-study content a second time - one real
// representation of "what is beat X of project Y," two different shells
// around it (inline chat message here, paginated modal there).
export type BeatData = {
  label: string;
  headline: string;
  paragraphs: string[];
  list?: string[];
  nda?: boolean;
  quote?: string;
  extra?: string;
  image?: CaseStudyImage;
  features?: { name: string; description: string }[];
  status?: string;
  visual?: FrameVisual;
};

function paragraphsOf(s: string): string[] {
  return s.split(/\n\n+/).map((p) => p.replace(/[ \t]{2,}/g, " ").replace(/\n[ \t]+/g, " ").trim()).filter(Boolean);
}

// Splits the first sentence off a paragraph so it can run larger/bolder
// as a lede - real body copy underneath, not a small-caps trick on a
// single letter (which does nothing visible on an already-uppercase
// first character).
function splitLede(paragraph: string): { lede: string; rest: string } {
  const match = paragraph.match(/^(.+?[.!?])(\s+|$)/);
  if (!match) return { lede: paragraph, rest: "" };
  return { lede: match[1], rest: paragraph.slice(match[0].length) };
}

// Council round 15: the previous nodes/duplicateStack/tally diagrams read
// fine with their caption attached, but failed the test that actually
// matters - cropped out of context (as the user's own screenshots did),
// none of them explained themselves. A diagram that only works with its
// caption glued on isn't a diagram, it's an illustration waiting for a
// sentence to do the real work. Each of the three redesigned cases below
// now has to carry its own meaning: nodes shows the connections literally
// breaking, duplicateStack flags itself as a mistake instead of a neutral
// count, tally states its number in words instead of counting dots.
//
// Structural fix from the same round: caption rendering used to be a
// separate <figcaption> mechanism living in CaseStudyBeat, which meant a
// future visual.caption could silently go unrendered if a new tool call
// site forgot the figcaption block. renderVisual() now returns the
// diagram and its caption as one inseparable unit - there's no path that
// gets one without the other.
export function renderVisual(visual: FrameVisual, color: string, accentColor: string) {
  const diagram = (() => {
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
      // A vertical chain instead of a wrapped grid - it reads in order
      // top-to-bottom in a narrow column, and it leaves room for the
      // thing the old version was missing: a visible break between each
      // pair. Each product still gets its own labeled box; each gap
      // between boxes is a dashed line interrupted by a red x, standing
      // in for "someone tried to connect these and hit a wall" without
      // needing a caption to say so.
      case "nodes":
        return (
          <div className="py-8 px-6" style={{ background: accentColor }}>
            <div className="flex flex-col items-center">
              {visual.labels.map((label, i) => (
                <div key={label} className="w-full max-w-[240px]">
                  <div className="rounded-md px-5 py-3.5 text-center text-sm font-semibold" style={{ background: color, color: "#FAF3E7" }}>
                    {label}
                  </div>
                  {i < visual.labels.length - 1 && (
                    <div className="flex flex-col items-center gap-0.5 py-1.5" aria-hidden="true">
                      <div className="w-0 h-3 border-l-2 border-dashed" style={{ borderColor: color, opacity: 0.35 }} />
                      <span className="text-sm font-bold leading-none" style={{ color: "#C23B3B" }}>&times;</span>
                      <div className="w-0 h-3 border-l-2 border-dashed" style={{ borderColor: color, opacity: 0.35 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      // Same irregular-mistake framing for the stack: a clean, evenly-fanned
      // deck reads as "organized," which is the opposite of what actually
      // happened. Each card gets its own off-kilter rotation and offset,
      // and the neutral round badge is now a warning triangle - a
      // duplicate nobody noticed, not a tidy total.
      case "duplicateStack": {
        const rotations = [-7, 4, -3, 6, -5];
        const shiftX = [-9, 11, -4, 14, 7];
        const shiftY = [5, -7, 8, -4, 6];
        return (
          <div className="py-10 px-6" style={{ background: accentColor }}>
            <div className="relative h-28 flex items-center justify-center">
              {Array.from({ length: visual.count }).map((_, idx) => {
                const isTop = idx === visual.count - 1;
                return (
                  <div
                    key={idx}
                    className="absolute w-52 h-16 rounded-md flex items-center justify-center text-sm font-semibold shadow-sm"
                    style={{
                      background: color,
                      opacity: isTop ? 1 : 0.45 - idx * 0.07,
                      color: "#FAF3E7",
                      transform: `translate(${shiftX[idx % shiftX.length]}px, ${shiftY[idx % shiftY.length]}px) rotate(${rotations[idx % rotations.length]}deg)`,
                      zIndex: idx,
                    }}
                  >
                    {isTop ? visual.label : ""}
                  </div>
                );
              })}
              <span className="absolute -top-1 right-[calc(50%-6.25rem)] z-10 flex items-center justify-center w-11 h-11" style={{ filter: "drop-shadow(0 1px 2px rgba(33,29,29,0.2))" }}>
                <svg viewBox="0 0 24 24" width="42" height="42" aria-hidden="true">
                  <path d="M12 2.5 L22.5 21 L1.5 21 Z" fill="#FAF3E7" stroke="#C23B3B" strokeWidth="1.75" strokeLinejoin="round" />
                </svg>
                <span className="absolute font-serif text-xs font-bold mt-[3px]" style={{ color: "#C23B3B" }}>&times;{visual.count}</span>
              </span>
            </div>
          </div>
        );
      }
      // A stat block, not a dot grid: the number and its unit sit on the
      // same baseline as one phrase ("8 real research sessions"), and the
      // four groups are named outright instead of implied by unlabeled
      // rows of dots. The dots stay, but only as a small tally mark next
      // to a label that already says what it's counting.
      case "tally": {
        const total = visual.groups * visual.perGroup;
        return (
          <div className="py-7 px-6" style={{ background: accentColor }}>
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-6xl font-bold" style={{ color }}>{total}</span>
              <span className="text-sm font-semibold" style={{ color, opacity: 0.7 }}>real research {visual.unit}s</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {visual.groupLabels.map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex gap-1 shrink-0">
                    {Array.from({ length: visual.perGroup }).map((_, s) => (
                      <span key={s} className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color, opacity: 0.75 }}>{label}</span>
                </div>
              ))}
            </div>
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
          </div>
        );
      }
      default: {
        const exhaustive: never = visual;
        return exhaustive;
      }
    }
  })();

  // bareStat and tally both bake their caption's exact content into the
  // diagram itself now (the sub-label under the number; the "N real
  // research sessions" phrase beside the numeral) - appending the same
  // sentence again below would just repeat it. Every other kind that
  // carries a caption gets it appended here, once, so there's no second
  // place in the codebase that has to remember to render it.
  const bakesOwnCaption = visual.kind === "bareStat" || visual.kind === "tally";
  const caption = !bakesOwnCaption && "caption" in visual ? visual.caption : undefined;

  return (
    <>
      <div className="rounded-sm overflow-hidden">{diagram}</div>
      {caption && <p className="mt-2 text-xs italic text-[#211D1D]/45">{caption}</p>}
    </>
  );
}

export function buildBeat(study: CaseStudy, beat: BeatId): BeatData | null {
  switch (beat) {
    case "hook":
      return { label: "Hook", headline: study.hook.headline, paragraphs: paragraphsOf(study.hook.context), extra: study.hook.scale, image: study.hook.image, visual: study.hook.visual };
    case "friction":
      return { label: "Friction", headline: study.friction.headline, paragraphs: [], list: study.friction.problems.slice(0, 4), quote: study.friction.userVoice?.[0], image: study.friction.image, visual: study.friction.visual };
    case "pivot":
      if (!study.pivot) return null;
      return { label: "Pivot", headline: study.pivot.headline, paragraphs: paragraphsOf(study.pivot.insight), extra: study.pivot.designDecision, image: study.pivot.image };
    case "solution":
      return { label: "Solution", headline: study.solution.headline, paragraphs: [], features: study.solution.features.slice(0, 2), nda: study.ndaLevel === "partial", image: study.solution.image, visual: study.solution.visual };
    case "impact":
      return { label: "Impact", headline: study.impact.headline, paragraphs: [], list: study.impact.outcomes.slice(0, 4), image: study.impact.image, status: study.impact.status, visual: study.impact.visual };
  }
}

// Renders one narrative beat as a real newspaper article, not a document
// bolted under the chat reply. Council round 14: rounds 11-13 fixed the
// structure (each beat its own chat turn) and then over-corrected on
// duplication (stripped the attachment down to bare visuals, which also
// stripped out all the editorial typography, leaving the actual answer
// sitting in a plain, undifferentiated chat bubble - "still bulks of
// text... make it look like a newspaper"). The fix is both at once: the
// spoken chat reply (content/responses.ts) is now a short one-line tease,
// and the substance lives here, laid out like an actual article - a
// serif headline, a dek, a lead figure with a real caption, serif body
// copy, hairline rules instead of boxes, a genuine pull-quote. Nothing
// duplicates the tease anymore because the tease no longer says the
// answer, it points at it.
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
    <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-2 max-w-[560px]">
      {/* Kicker - byline-style, not a boxed label */}
      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: study.color }}>{study.company} &middot; {data.label}</p>
        {data.status && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#211D1D]/40">&mdash; {data.status}</span>
        )}
      </div>

      {/* Headline - every beat is its own article now, serif throughout */}
      <h4 className="font-serif text-[26px] font-bold text-[#211D1D] leading-[1.15] mb-3">
        {data.headline}
      </h4>

      <div className="h-px bg-[#211D1D]/12 mb-4" />

      {/* Lead figure - real screenshot or honest diagram, captioned like
          an actual newspaper photo instead of restating it in prose */}
      {data.image && (
        <figure className="mb-4">
          <button type="button" onClick={() => setLightboxImage(data.image!)} className="block w-full group/img relative text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image.src} alt={data.image.alt} className="w-full rounded-sm border border-[#211D1D]/10" />
            {data.nda && (
              <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium">
                <Lock className="h-3 w-3" /> NDA - in-progress prototype
              </span>
            )}
            <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#211D1D]/70 text-[#FAF3E7] text-[10px] font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">View full size ↗</span>
          </button>
        </figure>
      )}
      {data.visual && (
        <figure className="mb-4">{renderVisual(data.visual, study.color, study.accentColor)}</figure>
      )}

      {/* Body - serif throughout, a real newspaper column, not a chat
          bubble. The first paragraph's opening sentence runs larger and
          bolder as a lede - a real drop cap needs more vertical room
          than a ~340-560px column reliably has, and gets clumsy this
          narrow, so the sentence-level version does the same job. */}
      {data.paragraphs.length > 0 && (
        <div className="space-y-3">
          {data.paragraphs.map((p, i) => {
            if (i !== 0) {
              return <p key={i} className="font-serif text-[15px] leading-[1.6] text-[#211D1D]/70">{p}</p>;
            }
            const { lede, rest } = splitLede(p);
            return (
              <p key={i} className="font-serif text-[15px] leading-[1.6] text-[#211D1D]">
                <span className="text-[17px] font-semibold">{lede}</span>
                {rest && <span className="text-[#211D1D]/70"> {rest}</span>}
              </p>
            );
          })}
        </div>
      )}

      {(data.list || data.features) && (
        <>
          <div className="h-px bg-[#211D1D]/10 my-4" />
          {data.list && (
            <ol className="space-y-2.5">
              {data.list.map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="font-serif text-sm font-semibold shrink-0 w-4" style={{ color: study.color }}>{i + 1}</span>
                  <span className="font-serif text-[15px] leading-[1.55] text-[#211D1D]/75">{item}</span>
                </li>
              ))}
            </ol>
          )}
          {data.features && (
            <div className="space-y-3">
              {data.features.map((f) => (
                <div key={f.name}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: study.color }}>{f.name}</p>
                  <p className="font-serif text-[15px] text-[#211D1D]/70 leading-[1.55] mt-0.5">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {data.nda && (
        <p className="mt-4 text-xs italic text-[#211D1D]/40">{study.solution.ndaSafeNote}</p>
      )}

      {data.quote && (
        <>
          <div className="h-px bg-[#211D1D]/10 my-5 max-w-[80px]" />
          <p className="font-serif text-xl italic leading-snug text-[#211D1D]">
            &ldquo;{data.quote.replace(/^"|"$/g, "")}&rdquo;
          </p>
        </>
      )}

      {data.extra && (
        data.label === "Hook" ? (
          <p className="mt-4 text-xs font-medium text-[#211D1D]/75 leading-relaxed bg-[#F2A93C]/12 border-l-2 border-[#F2A93C] rounded-r px-3 py-2">{data.extra}</p>
        ) : (
          <p className="mt-4 pt-3 border-t border-[#211D1D]/8 text-xs text-[#211D1D]/40 italic leading-relaxed">{data.extra}</p>
        )
      )}

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
    </motion.article>
  );
}
