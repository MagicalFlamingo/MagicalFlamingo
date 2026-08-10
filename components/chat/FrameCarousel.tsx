"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, X } from "lucide-react";
import { knowledge, type CaseStudyId, type CaseStudy, type CaseStudyImage, type FrameVisual } from "@/content/knowledge";

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
  visual?: FrameVisual;
};

function clean(s: string) {
  return s.replace(/[ \t]{2,}/g, " ").replace(/\n[ \t]+/g, "\n").trim();
}

// Renders a FrameVisual - an honest, real-data diagram for a frame with
// no usable screenshot. See the "Visual system" comment above the
// FrameVisual type in knowledge.ts for the rules every kind below follows
// (two colors doing different jobs, one serif hero value, exactly one
// controlled asymmetry). `color` is the case study's own strong accent,
// `accentColor` its light tint - never resembling the actual product's UI
// chrome, always reading as "a diagram Danielle made," not a screenshot.
// Exhaustive switch on purpose: a new FrameVisual kind that isn't handled
// here is a compile error, not a silent wrong-render at runtime - this
// repo has no test suite, so that's the only safety net available.
function renderVisual(visual: FrameVisual, color: string, accentColor: string) {
  switch (visual.kind) {
    case "bareStat":
      // Full color-block, not a tint - the boldest single statement this
      // set makes on purpose, since this is the Hook frame's one visual
      // and the first thing a visitor sees of the whole case study.
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
                {/* The lead metric (first row) gets a taller, full-strength
                    bar; the rest step down slightly - one real hierarchy
                    instead of four uniform bars. */}
                <div className={`${i === 0 ? "h-2.5" : "h-2"} rounded-full overflow-hidden`} style={{ background: accentColor }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(row.score / row.max) * 100}%`, background: color, opacity: i === 0 ? 1 : 0.65 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "nodes": {
      // Each product as its own filled, saturated block in the study's
      // own palette - no connecting lines, which is the point. The last
      // label (the shell/platform meant to unify the others) renders
      // smaller and dropped a notch: the one that's supposed to connect
      // everything is itself the most disconnected.
      const main = visual.labels.slice(0, -1);
      const shell = visual.labels[visual.labels.length - 1];
      return (
        <div className="py-10 px-6" style={{ background: accentColor }}>
          <div className="flex flex-wrap gap-4 justify-center">
            {main.map((label) => (
              <div
                key={label}
                className="rounded-md px-6 py-5 text-center text-base font-semibold"
                style={{ background: color, color: "#FAF3E7" }}
              >
                {label}
              </div>
            ))}
          </div>
          {shell && (
            <div className="flex justify-center mt-4">
              <div
                className="rounded-md px-4 py-3 text-center text-sm font-semibold opacity-50 translate-y-1"
                style={{ background: color, color: "#FAF3E7" }}
              >
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
                  style={{
                    background: color,
                    opacity: isTop ? 1 : 0.5 - idx * 0.08,
                    color: "#FAF3E7",
                    transform: `translate(${idx * 5}px, ${idx * -5}px)`,
                    zIndex: idx,
                  }}
                >
                  {isTop ? visual.label : ""}
                </div>
              );
            })}
            {/* The one deliberate break from the container's grid - a
                serif count badge overlapping the top card's own edge. */}
            <span
              className="absolute top-1 right-[calc(50%-6.5rem)] font-serif text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center z-10 shadow-sm"
              style={{ background: "#FAF3E7", color }}
            >
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
                  {/* Two-tone per session, not identical dots - a filled
                      mark for the first session, an outline for the
                      second, so "2 iterations" is a real distinction. */}
                  {Array.from({ length: visual.perGroup }).map((_, s) => (
                    <span
                      key={s}
                      className="w-3.5 h-3.5 rounded-full"
                      style={
                        s === 0
                          ? { background: color }
                          : { background: "transparent", border: `2px solid ${color}` }
                      }
                    />
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
      // Deterministic (index-keyed, not random-per-render) size/rotation/
      // offset variation - the point being illustrated is drift and
      // disorder, so the layout itself should look disordered instead of
      // being the most orderly, gridded diagram in the set.
      const offsets = [0, 10, -7, 13, -9];
      const rotations = [0, -6, 4, 0, -5];
      const sizes = [56, 46, 62, 42, 52];
      return (
        <div className="py-12 px-6" style={{ background: accentColor }}>
          <div className="flex items-end justify-center gap-3">
            {visual.swatches.map((hex, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2"
                style={{
                  transform: `translateY(${offsets[idx % offsets.length]}px) rotate(${rotations[idx % rotations.length]}deg)`,
                }}
              >
                <div
                  className="rounded-md shadow-sm"
                  style={{ background: hex, width: sizes[idx % sizes.length], height: sizes[idx % sizes.length] }}
                />
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

function buildFrames(study: CaseStudy): FrameData[] {
  const frames: FrameData[] = [
    {
      label: "Hook",
      headline: study.hook.headline,
      body: clean(study.hook.context),
      extra: study.hook.scale,
      image: study.hook.image,
      visual: study.hook.visual,
    },
    {
      label: "Friction",
      headline: study.friction.headline,
      body: study.friction.problems.slice(0, 4).map((p) => `• ${p}`).join("\n"),
      quote: study.friction.userVoice?.[0],
      extra: study.friction.researchMethod,
      image: study.friction.image,
      visual: study.friction.visual,
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
    visual: study.solution.visual,
  });

  frames.push({
    label: "Impact",
    headline: study.impact.headline,
    body: study.impact.outcomes.slice(0, 4).map((o) => `• ${o}`).join("\n"),
    extra: `What I'd do differently: ${study.impact.whatIDifferently}`,
    image: study.impact.image,
    status: study.impact.status,
    visual: study.impact.visual,
  });

  return frames;
}

export function FrameCarousel({ project }: FrameCarouselProps) {
  const study = knowledge.caseStudies[project] as CaseStudy;
  const frames = buildFrames(study);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  // In-page viewer for screenshots, replacing target="_blank". On mobile
  // web a new tab doesn't fit-to-screen the raw image the way a native
  // photo viewer would - it opens at native size with no zoom applied,
  // mostly letterboxed black. This is a plain fixed overlay, not the
  // Radix Dialog removed as dead code in round 7 - no focus trap needed
  // for a single non-interactive image, just Escape/backdrop-tap to close.
  const [lightboxImage, setLightboxImage] = useState<CaseStudyImage | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxImage]);

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const frame = frames[current];
  // Council round 6: "bigger sans headline + colored border" (round 5)
  // still read as one undifferentiated text block - same font throughout,
  // emphasis instead of a real mode-switch. The fix isn't decorating every
  // frame, it's concentrating typographic weight on the two frames that
  // are actual narrative beats - the open and the landing - and leaving
  // Friction/Pivot/Solution quiet, so the loud ones read as loud. Hook and
  // Impact reuse the site's one existing serif flourish (currently only
  // Danielle's name in the hero) - not a new typeface, just a second,
  // disciplined use of the one the site already committed to. This is
  // independent of whether the frame also has a real screenshot.
  const isMoment = frame.label === "Hook" || frame.label === "Impact";

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
                  <button
                    type="button"
                    onClick={() => setLightboxImage(frame.image!)}
                    className="block w-full group/img relative text-left"
                    aria-label="View full size"
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
                  </button>
                )}
                {frame.visual && (
                  <div className="-mx-5 mb-4 overflow-hidden">{renderVisual(frame.visual, study.color, study.accentColor)}</div>
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
                    isMoment
                      ? "font-serif text-2xl md:text-3xl font-semibold text-[#211D1D] leading-snug mb-4"
                      : "text-lg font-semibold text-[#211D1D] leading-snug mb-3"
                  }
                >
                  {frame.headline}
                </h4>
                {frame.image && (
                  <button
                    type="button"
                    onClick={() => setLightboxImage(frame.image!)}
                    className="block mb-3 group/img relative w-full text-left"
                    aria-label="View full size"
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
                  </button>
                )}
                {frame.visual && (
                  <div className="-mx-5 mb-4 overflow-hidden">{renderVisual(frame.visual, study.color, study.accentColor)}</div>
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
                  frame.label === "Hook" ? (
                    // The Hook's "extra" is real-world scale/credibility
                    // (who actually uses this) - the most concrete,
                    // trust-bearing line in the frame, previously styled
                    // to look like the least important one (gray italic
                    // footnote). Marigold is otherwise unused inside a
                    // case-study card - give it this one functional job.
                    <p className="mt-4 text-xs font-medium text-[#211D1D]/75 leading-relaxed bg-[#F2A93C]/12 border-l-2 border-[#F2A93C] rounded-r px-3 py-2">
                      {frame.extra}
                    </p>
                  ) : (
                    <p className="mt-3 pt-3 border-t border-[#211D1D]/8 text-xs text-[#211D1D]/40 italic leading-relaxed">
                      {frame.extra}
                    </p>
                  )
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
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF3E7]/10 text-[#FAF3E7] hover:bg-[#FAF3E7]/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
