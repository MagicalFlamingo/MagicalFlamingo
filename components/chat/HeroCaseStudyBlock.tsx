"use client";

import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";
import { knowledge, type CaseStudyId, type FrameVisual } from "@/content/knowledge";

// Round 3 council ("home page has a lot of text, a lot of items - very
// hard to understand the layout"). Three of five advisors independently
// proposed the same fix without seeing each other's answers, and peer
// review confirmed the version that survives: this isn't a chat that
// happens to show three case studies - it's one real story, with two
// more real projects a click away. What replaced the 3-up equal grid
// (CaseStudyIntroDeck/CaseStudyIntroCard, retired that round):
//
// One hero beat - AWS, the only knowledge.caseStudies entry with
// impact.status "Shipped" - told as an actual reveal using its own real
// copy verbatim (hook.headline, solution.headline from
// content/knowledge.ts), not an invented connective sentence.
//
// Round 4 ("more visuals from the projects, it should be wow"): the
// visual used to be just the bare "67/100" number - real, but thin.
// Checked whether there were unused real screenshots that could add
// more (public/case-studies/aws/*.jpg) - both existing extras have
// hand-drawn review-annotation marks baked into the pixels (one is a
// console screenshot with arrows drawn on it, the other is a dark
// presentation slide with callout lines), confirmed by looking
// directly at them, not assumed. Using either as-is would read as a
// leaked internal deck, not a cleaner site. The honest lever left is
// depth, not more photos: the real score breakdown (RTO/RPO, Alarms,
// SOPs, FIS - same numbers already in content/knowledge.ts, same ones
// shown inside CaseStudyModal, single-sourced here via
// aws.solution.visual rather than re-typed) renders on the homepage
// itself, with each row's bar filling in on a real stagger - motion
// doing the "more" work no additional image could honestly do.
//
// Council round 4 (Eliminator + Materialist advisors):
// - Only 2 of the 4 real rows render here, not 4 - the strongest
//   (37/40) and the weakest (2/20), on purpose. All 4 near-full-width
//   bars read fine inside the modal, where a reader has already
//   opted into detail; on the homepage, under the word SHIPPED, two
//   mostly-empty bars read as Danielle's own performance, not the
//   customer's starting point. The real contrast - one strong metric,
//   one weak one - is the actual argument ("a breakdown you can act
//   on"), and it survives on 2 rows. All 4 are still one click away,
//   verbatim, inside the modal.
// - This card used to render in aws.color/aws.accentColor - the
//   per-case-study palette that content/knowledge.ts documents as
//   scoped to the modal (Qlik blue, Sprout green, AWS navy). Promoting
//   one case study's palette onto homepage-level chrome meant this
//   card would silently change color if a future round ever led with
//   a different study. Now built from the site's own fixed FrameVisual
//   chrome (rounded-lg border-[#211D1D]/10 bg-[#FFFDF9], no shadow/
//   gradient/icon - the same rule content/knowledge.ts documents for
//   every other diagram) so the front door stays palette-stable.
function CountUpNumber({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    // Council round 4 (Materialist advisor): MotionConfig's
    // reducedMotion="user" only gates Framer's own transform/layout
    // animations - it never reaches this imperative animate() driving
    // plain React state, so a reduced-motion visitor still watched the
    // number count up. Skip the tween entirely instead.
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, reduceMotion]);

  return <span ref={ref}>{display}</span>;
}

function ScoreBar({ score, max, index, isInView, reduceMotion }: {
  score: number;
  max: number;
  index: number;
  isInView: boolean;
  reduceMotion: boolean;
}) {
  const pct = `${(score / max) * 100}%`;
  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-[#211D1D]/10">
      <motion.div
        className="h-full rounded-full bg-[#211D1D]"
        initial={{ width: reduceMotion ? pct : "0%" }}
        animate={reduceMotion ? { width: pct } : isInView ? { width: pct } : {}}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.3 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

interface HeroCaseStudyBlockProps {
  onOpen: (project: CaseStudyId) => void;
  delay: number;
}

// Direct feedback ("layout wise, it's still not airbnb like"): Airbnb's
// card language is soft elevation (rounded-2xl, a warm drop shadow, a
// hover lift) and image-forward listing cards - a real reversal of
// round 26's "never a shadow" flat rule, adopted deliberately here, not
// by accident. SecondaryCard borrows that shape for Qlik/Sprout without
// promoting them to the AWS hero's weight: smaller, a plain title/meta
// stack instead of a headline+body, still clearly secondary.
function SecondaryCard({
  onClick,
  visual,
  title,
  meta,
  delay,
}: {
  onClick: () => void;
  visual: ReactNode;
  title: string;
  meta: string;
  delay: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group text-left rounded-2xl bg-[#FFFDF9] shadow-[0_2px_10px_-2px_rgba(33,29,29,0.08)] hover:shadow-[0_14px_32px_-8px_rgba(33,29,29,0.16)] hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300 overflow-hidden"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">{visual}</div>
      <div className="p-3.5">
        <p className="text-[13px] font-semibold text-[#211D1D] group-hover:text-[#7A5C12] transition-colors leading-snug">{title}</p>
        <p className="mt-0.5 text-[11px] text-[#211D1D]/45">{meta}</p>
      </div>
    </motion.button>
  );
}

export function HeroCaseStudyBlock({ onOpen, delay }: HeroCaseStudyBlockProps) {
  const aws = knowledge.caseStudies.aws;
  const qlik = knowledge.caseStudies.qlik;
  const sprout = knowledge.caseStudies.sprout;
  const awsVisual = aws.solution.visual as Extract<FrameVisual, { kind: "scoreBreakdown" }>;
  // Stakeholder Translator advisor (round 4): the strongest real visual
  // asset in the repo was buried behind a 12px grey link - a real
  // screenshot, not a diagram. Promoted into a real card image instead.
  const qlikImage = qlik.solution.image!;
  const sproutVisual = sprout.friction.visual as Extract<FrameVisual, { kind: "swatchChaos" }>;
  // Council round 4 (Eliminator advisor): 2 of the 4 real rows, not 4
  // - see the comment above ScoreBar for why. rows[0] is always the
  // strongest and rows[length-1] the weakest in this dataset's real
  // order (RTO/RPO 37/40 ... FIS 2/20), so this reads off the array
  // rather than re-typing either row's numbers.
  const heroRows = [awsVisual.rows[0], awsVisual.rows[awsVisual.rows.length - 1]];

  const visualRef = useRef<HTMLDivElement>(null);
  const visualInView = useInView(visualRef, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();

  // Round 3 council (peer review, verified in code): the old tiles had
  // zero click tracking of their own - case_study_opened only fired
  // from inside the chat's showCaseStudyBeat tool calls, so there was
  // never any data on whether a homepage click did anything. Fixed
  // here and on the demoted links below, not just on the hero.
  const openWithTracking = (project: CaseStudyId, source: "hero" | "secondary") => {
    track("case_study_opened", { project, source });
    onOpen(project);
  };

  return (
    <div className="space-y-4">
      <motion.button
        type="button"
        onClick={() => openWithTracking("aws", "hero")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
        className="group w-full text-left flex flex-col sm:flex-row gap-6 sm:items-center"
      >
        {/* Council round 4 (Materialist advisor): fixed house chrome
            instead of aws.color/aws.accentColor - see the block
            comment above ScoreBar. The "67" itself is now the card's
            one dominant mark (text-7xl/8xl, not the same 48px as the
            headline above it), so it reads as a genuine second beat
            instead of competing with the headline for the same size.

            Direct feedback ("layout wise, it's still not airbnb
            like"): rounded-lg -> rounded-2xl and a real soft warm
            shadow with a hover lift replace the flat bordered box -
            round 26's "never a shadow" rule, deliberately reversed
            here, not forgotten. Marigold stays as a real solid fill
            (the top rule), now sitting on a softer, more elevated
            card instead of a flat one. */}
        <div
          ref={visualRef}
          className="w-full sm:w-[42%] shrink-0 overflow-hidden rounded-2xl border-t-4 border-t-[#F2A93C] bg-[#FFFDF9] p-6 shadow-[0_4px_20px_-4px_rgba(33,29,29,0.10)] group-hover:shadow-[0_16px_40px_-8px_rgba(33,29,29,0.18)] group-hover:-translate-y-1 transition-[box-shadow,transform] duration-300"
        >
          <span className="font-bold text-7xl lg:text-8xl text-[#211D1D] inline-flex items-baseline">
            <CountUpNumber value={67} reduceMotion={!!reduceMotion} />
            <span className="font-normal text-2xl ml-1 text-[#211D1D]/50">/100</span>
          </span>
          <div className="mt-5 space-y-3">
            {heroRows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[11px] mb-1 text-[#211D1D]/60">
                  <span>{row.label}</span>
                  <span className="font-semibold text-[#211D1D]/80">
                    {row.score}/{row.max}
                  </span>
                </div>
                <ScoreBar score={row.score} max={row.max} index={i} isInView={visualInView} reduceMotion={!!reduceMotion} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {/* Council round 4: dropped the duplicate company/year -
              "Amazon AWS" already names itself as the headline's first
              word, and "2021 - 2024" only advertised how stale the
              lead story is. SHIPPED alone is the one fact this line
              needs to add. */}
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#211D1D]">Shipped</p>
          {/* Council round 4 (Value & Friction advisor): this whole
              card is one ~700px-tall button with no resting
              affordance - nothing here read as clickable before a
              visitor happened to hover it. A permanent underline on
              the headline gives it one, without adding a second,
              competing "See the full case study" link (Eliminator's
              cut - the whole block is already the click target). */}
          {/* Enhanced richness pass: font-display (Fraunces) here too -
              this headline is the page's other real display moment
              (see ChatInterface.tsx's h2), so it gets the same
              typographic treatment rather than sitting in plain Inter
              next to it.

              Direct feedback ("the layout is very strange"): this real
              sentence ("...and expected them to trust it.") was
              leaving "it." stranded alone on its own line at several
              real widths - the same orphan problem as the h2 above,
              same fix (text-balance). */}
          <h3 className="font-display text-balance mt-1.5 text-xl sm:text-2xl font-medium text-[#211D1D] leading-snug tracking-tight underline decoration-[#211D1D]/15 underline-offset-4 group-hover:text-[#7A5C12] group-hover:decoration-[#7A5C12]/40 transition-colors">
            {aws.hook.headline}
          </h3>
          <p className="mt-2 text-[15px] text-[#211D1D]/60 leading-relaxed">
            {aws.solution.headline}
          </p>
        </div>
      </motion.button>

      {/* Council round 4 (Eliminator advisor): "Also real, in progress"
          hedged twice, so the label stays plain ("Also:").

          Direct feedback ("layout wise, it's still not airbnb like" +
          round 4's own Stakeholder Translator finding that the
          strongest real visual asset in the repo, the Qlik screenshot,
          was buried behind a 12px grey link): these are now real
          image-forward listing cards, not text links - Airbnb's
          actual signature move. Still clearly secondary to the AWS
          hero (smaller, a plain title+meta stack, no headline/body
          copy, no marigold) - the hierarchy fix from round 4 holds,
          this only changes the chrome, not the weight. */}
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.15 }}
          className="text-[12px] text-[#211D1D]/40 mb-2"
        >
          Also:
        </motion.p>
        <div className="grid grid-cols-2 gap-3 max-w-[420px]">
          <SecondaryCard
            onClick={() => openWithTracking("qlik", "secondary")}
            delay={delay + 0.18}
            title={qlik.title}
            meta={`${qlik.company} · ${qlik.year}`}
            visual={
              <img src={qlikImage.src} alt={qlikImage.alt} className="w-full h-full object-cover" />
            }
          />
          <SecondaryCard
            onClick={() => openWithTracking("sprout", "secondary")}
            delay={delay + 0.24}
            title={sprout.title}
            meta={`${sprout.company} · ${sprout.year}`}
            visual={
              // No clean screenshot exists for Sprout (see the
              // council round-4 comments on the AWS extras for why
              // that bar is real, not skipped by accident) - the real
              // swatches from its own friction beat (the "same brand
              // blue, hardcoded 5 different ways" problem) stand in
              // as an honest visual instead of a fabricated photo.
              <div className="w-full h-full grid grid-cols-5">
                {sproutVisual.swatches.map((hex, i) => (
                  <div key={i} style={{ background: hex }} />
                ))}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
