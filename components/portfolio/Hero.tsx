"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { knowledge } from "@/content/knowledge";

const COMPANY_BADGES = ["Qlik", "Amazon AWS", "Menora"];

// Round 26 (full aesthetic pivot to a real reference site the user
// pointed at). That site's nav treats a name as plain, small, unstyled
// sans text - not a serif display moment - so this identity plaque
// drops font-serif entirely. The page background went back to
// light/cream (round 24's ink-primary flip wasn't the
// actual problem per the round-25 council, and it isn't this
// reference's look either); this plaque just needed its colors
// flipped back to match.
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
        className="max-w-[800px] mx-auto mt-2 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#211D1D]/30"
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
