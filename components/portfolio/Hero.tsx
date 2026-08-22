"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

// Real employers with a real case study to back the link. Menora was
// removed per direct feedback - a peer review earlier in this project
// had already flagged it independently: it appeared once, backed by
// no case study, on a page whose headline promises she can explain
// every decision. Qlik and Amazon AWS both map to a real
// knowledge.caseStudies entry, so clicking either opens that real
// case study instead of just naming it.
const COMPANY_BADGES: { label: string; project: CaseStudyId }[] = [
  { label: "Qlik", project: "qlik" },
  { label: "Amazon AWS", project: "aws" },
];

interface HeroProps {
  onOpenCaseStudy?: (project: CaseStudyId) => void;
}

// Round 26 (full aesthetic pivot to a real reference site the user
// pointed at). That site's nav treats a name as plain, small, unstyled
// sans text - not a serif display moment - so this identity plaque
// drops font-serif entirely. The page background went back to
// light/cream (round 24's ink-primary flip wasn't the
// actual problem per the round-25 council, and it isn't this
// reference's look either); this plaque just needed its colors
// flipped back to match.
//
// Council round 2 ("it feels very condensed"): this used to wrap its
// max-w-[800px] content in header-level px-6 lg:px-16, while
// ChatInterface.tsx centered its own max-w-[800px] directly against the
// full viewport before adding its own inner px-6. Two different
// reference frames for the "same" 800px column - a real, measurable 24px
// left-edge mismatch (confirmed: Hero's name landed at x=560 on a
// 1920px screen, the headline below it at x=584), not a taste question.
// Now both share one page-level container - PAGE_MAX_W, PAGE_PADDING -
// so whatever width the content column ends up at, Hero and the chat
// agree on where its left edge actually is.
export function Hero({ onOpenCaseStudy }: HeroProps) {
  const { identity } = knowledge;

  return (
    <header className="px-6 lg:px-8">
      <div className="max-w-[1160px] mx-auto pt-8 lg:pt-10 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg sm:text-xl font-semibold text-[#211D1D] tracking-tight"
            >
              {identity.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="text-[13px] text-[#7A5C12] font-semibold tracking-[0.04em]"
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
              className="text-[#211D1D]/55 hover:text-[#7A5C12] transition-colors"
            >
              Email
            </a>
            <span className="text-[#211D1D]/20" aria-hidden="true">
              &middot;
            </span>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("linkedin_tapped")}
              className="text-[#211D1D]/55 hover:text-[#7A5C12] transition-colors"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mt-2 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#211D1D]/30"
        >
          {COMPANY_BADGES.map((company, i) => (
            <span key={company.label} className="flex items-center gap-2.5">
              {i > 0 && <span aria-hidden="true">&middot;</span>}
              <button
                type="button"
                onClick={() => {
                  track("case_study_opened", { project: company.project, source: "badge" });
                  onOpenCaseStudy?.(company.project);
                }}
                className="hover:text-[#7A5C12] transition-colors"
              >
                {company.label}
              </button>
            </span>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
