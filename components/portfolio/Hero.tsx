"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { knowledge } from "@/content/knowledge";

const COMPANY_BADGES = ["Qlik", "Amazon AWS", "Menora"];

// Round 25 ("start from scratch" council - unanimous structural
// diagnosis across all four advisors). This used to be a full-viewport
// hero: name, title, one-liner, links, badges, and a large screenshot
// preview, sitting above a separate case-study grid you had to scroll
// past to reach the actual chat. 24 rounds of real, verified palette
// and motion changes to that exact three-block skeleton still read as
// "the same" - the skeleton itself was the problem, not its paint.
//
// The one-liner and the case studies now live inside the chat's own
// opening (see ChatInterface.tsx's empty-state block and
// CaseStudyIntroDeck) - real work is visible in the first screenful
// without a separate section to scroll through first. What's left here
// is a compact, persistent identity plaque, not a section: name, title,
// contact links, real company names. It never fills the viewport and
// there's nothing below it to imply you should scroll past it.
export function Hero() {
  const { identity } = knowledge;

  return (
    <header className="px-6 lg:px-16 pt-8 pb-4 lg:pt-10">
      <div className="max-w-[800px] mx-auto flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-serif text-2xl sm:text-[28px] font-medium text-[#FAF3E7] tracking-tight"
          >
            {identity.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="text-[13px] text-[#F2A93C] font-semibold tracking-[0.04em]"
          >
            {identity.title}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="flex items-center gap-4 text-[13px] font-medium"
        >
          <a
            href={`mailto:${identity.email}`}
            onClick={() => track("email_tapped")}
            className="text-[#FAF3E7]/55 hover:text-[#F2A93C] transition-colors"
          >
            Email
          </a>
          <span className="text-[#FAF3E7]/20" aria-hidden="true">
            &middot;
          </span>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("linkedin_tapped")}
            className="text-[#FAF3E7]/55 hover:text-[#F2A93C] transition-colors"
          >
            LinkedIn
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="max-w-[800px] mx-auto mt-2 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#FAF3E7]/30"
      >
        {COMPANY_BADGES.map((company, i) => (
          <span key={company} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden="true">&middot;</span>}
            {company}
          </span>
        ))}
      </motion.div>
    </header>
  );
}
