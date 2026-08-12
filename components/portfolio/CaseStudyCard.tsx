"use client";

import { motion } from "framer-motion";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

interface CaseStudyCardProps {
  project: CaseStudyId;
  onOpen: (project: CaseStudyId) => void;
  // Council round 22: the bento-style "one bigger tile" layout in
  // CaseStudyGrid.tsx. AWS gets it - it's the one fully public, shipped,
  // non-NDA story, so more visual weight here is honest about which
  // case study actually carries the most complete real content, not
  // just decoration.
  featured?: boolean;
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

export function CaseStudyCard({ project, onOpen, featured = false }: CaseStudyCardProps) {
  const study = knowledge.caseStudies[project];

  return (
    // Council round 21/22: hover feedback went from a bare border-color
    // change to a real lift + slow image pan, then round 22 added one
    // controlled layer of real depth on top - a soft, wide, low-opacity
    // shadow on hover, not the flat border-only look that (correctly)
    // replaced the old dark-overlay cards but (over-correctly) left
    // zero sense of the card lifting off the page.
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      whileHover={{ y: -4 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`group text-left cursor-pointer border border-[#211D1D]/10 bg-[#FFFDF9] rounded-sm overflow-hidden hover:border-[#211D1D]/20 hover:shadow-[0_24px_48px_-24px_rgba(33,29,29,0.25)] transition-[border-color,box-shadow] duration-200 ${
        featured ? "sm:col-span-2 sm:row-span-2 flex flex-col sm:flex-row" : ""
      }`}
    >
      <div
        className={`overflow-hidden border-[#211D1D]/10 ${
          featured ? "aspect-[4/3] sm:aspect-auto sm:w-[55%] sm:h-full border-b sm:border-b-0 sm:border-r" : "aspect-[4/3] border-b"
        }`}
      >
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <CardVisual project={project} />
        </div>
      </div>
      <div className={`p-5 ${featured ? "sm:w-[45%] flex flex-col justify-center" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#211D1D]/40">
          {study.company} &middot; {study.year}
        </p>
        <h3 className={`mt-1.5 font-serif font-bold text-[#211D1D] leading-tight ${featured ? "text-2xl lg:text-3xl" : "text-xl"}`}>
          {study.title}
        </h3>
        <p className={`mt-2 text-[#211D1D]/65 leading-relaxed ${featured ? "text-base" : "text-sm"}`}>
          {study.hook.headline}
        </p>
        <p className="mt-3 text-xs font-semibold text-[#7A5C12] group-hover:underline underline-offset-2">
          Open case study
        </p>
      </div>
    </motion.button>
  );
}
