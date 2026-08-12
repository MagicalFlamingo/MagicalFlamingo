"use client";

import { motion } from "framer-motion";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

interface CaseStudyCardProps {
  project: CaseStudyId;
  onOpen: (project: CaseStudyId) => void;
}

// Council round 20 ("looks over-generic - check how AI websites look and
// remove those tokens"). Real research confirmed the previous version
// against its own screenshot: full-bleed background image, 40% dark
// overlay, bold white heading, "Open case study →" - that's the single
// most common "SaaS feature card" / portfolio-template convention there
// is, independent of any color choice. The fix isn't a new invented
// style, it's dropping the borrowed template in favor of the chrome
// this site already has and had already been praised for elsewhere -
// the same bordered, ink-on-paper "object label" treatment used by
// TimelineCard, NDASafeNote, and every image/diagram inside
// CaseStudyBeat.tsx. An image sits in its own bordered box at the top,
// same as everywhere else in the app; the text below reads like the
// rest of the site, not like white text stamped over a photo.
function CardVisual({ project }: { project: CaseStudyId }) {
  const study = knowledge.caseStudies[project];

  if (project === "qlik") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/case-studies/qlik/browse-connections.jpg"
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }

  if (project === "aws") {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: study.accentColor }}>
        <span className="font-serif font-bold text-7xl" style={{ color: study.color }}>
          67<span className="text-2xl align-top">/100</span>
        </span>
      </div>
    );
  }

  // sprout - the real drifted "brand blue" swatches. Sizes deliberately
  // irregular, not ascending - ascending heights read as a bar chart
  // implying a trend, which isn't what this is: five near-identical
  // colors, not five increasing values.
  const swatches = ["#4A6FA5", "#4E72AB", "#4870A6", "#5175AD", "#496EA2"];
  const sizes = [40, 32, 46, 30, 38];
  return (
    <div className="w-full h-full flex items-center justify-center gap-2.5" style={{ background: study.accentColor }}>
      {swatches.map((hex, i) => (
        <div key={i} className="rounded-sm" style={{ background: hex, width: sizes[i], height: sizes[i] }} />
      ))}
    </div>
  );
}

export function CaseStudyCard({ project, onOpen }: CaseStudyCardProps) {
  const study = knowledge.caseStudies[project];

  return (
    // Council round 21 ("UI-wise, interactions - check awwwards.com"):
    // the previous pass fixed the card's look but left its feel flat -
    // a color-only border change on hover barely registers as feedback.
    // A real lift + a slow image pan (not a snap-scale) is the
    // restrained version of the "feels interactive, not just looks
    // impressive" shift current award-winning sites are judged on -
    // without reaching for the WebGL/cursor-reactive-3D treatments that
    // dominate that showcase, which would be real scope and a real
    // voice mismatch for a site whose whole pitch is directness, not a
    // performance (ambient/decorative motion has been rejected here
    // twice already for exactly that reason).
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="group text-left cursor-pointer border border-[#211D1D]/10 bg-[#FFFDF9] rounded-sm overflow-hidden hover:border-[#211D1D]/25 transition-colors"
    >
      <div className="aspect-[4/3] border-b border-[#211D1D]/10 overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <CardVisual project={project} />
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#211D1D]/40">
          {study.company} &middot; {study.year}
        </p>
        <h3 className="mt-1.5 font-serif text-xl font-bold text-[#211D1D] leading-tight">
          {study.title}
        </h3>
        <p className="mt-2 text-sm text-[#211D1D]/65 leading-relaxed">
          {study.hook.headline}
        </p>
        <p className="mt-3 text-xs font-semibold text-[#7A5C12] group-hover:underline underline-offset-2">
          Open case study
        </p>
      </div>
    </motion.button>
  );
}
