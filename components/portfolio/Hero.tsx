"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { knowledge } from "@/content/knowledge";

// Council round 24 (dark gallery pivot, explicit sign-off to loosen
// restraint after five rounds of refinement still read as "the same"):
// ink is now the page's primary background everywhere, not a special
// dark surface reserved for the modal/chat. Cream text, marigold pushed
// to full strength since it's the one warm color in the room now
// instead of one of several competing against cream.
const COMPANY_BADGES = ["Qlik", "Amazon AWS", "Menora"];

export function Hero() {
  const { identity } = knowledge;

  return (
    <section className="relative flex flex-col justify-center px-6 lg:px-16 py-24 lg:py-32">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-14 lg:gap-16 max-w-6xl mx-auto w-full">
        {/* Left - identity */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-[56px] sm:text-[84px] lg:text-[92px] font-medium text-[#FAF3E7] tracking-tight leading-[0.95]"
          >
            {identity.name}
          </motion.h1>
          {/* Round 24: the title used to be a quiet ink/45 line - the
              one real color moment this close to the top used to be the
              starter chip, three sections down. Marigold here instead
              gives the page a punch of real color in the first second,
              not several rounds of restraint waiting to earn one. */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-lg text-[#F2A93C] font-semibold tracking-[0.04em]"
          >
            {identity.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mt-6 text-[17px] text-[#FAF3E7]/75 leading-[1.6] mx-auto lg:mx-0 max-w-md"
          >
            {identity.oneLiner}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
            className="mt-6 flex items-center justify-center lg:justify-start gap-3 text-sm font-medium"
          >
            <a
              href={`mailto:${identity.email}`}
              onClick={() => track("email_tapped")}
              className="text-[#FAF3E7]/60 hover:text-[#F2A93C] transition-colors"
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
              className="text-[#FAF3E7]/60 hover:text-[#F2A93C] transition-colors"
            >
              LinkedIn
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.34 }}
            className="mt-8 flex items-center justify-center lg:justify-start gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF3E7]/35"
          >
            {COMPANY_BADGES.map((company, i) => (
              <span key={company} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true">&middot;</span>}
                {company}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right - the real screenshot, now a lit window rather than a
            photo boxed in cream paper - a plain black drop shadow would
            be invisible on the new ink background, so depth here comes
            from a warm marigold-tinted glow instead, and the border
            goes from a barely-there ink/10 hairline to a real marigold
            frame - the one bright, colorful surface in the whole hero,
            deliberately. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 w-full max-w-md"
        >
          <figure className="border-2 border-[#F2A93C]/70 rounded-sm overflow-hidden bg-[#FFFDF9] shadow-[0_50px_100px_-25px_rgba(242,169,60,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/case-studies/qlik/browse-connections.jpg"
              alt="Unified connections browse table, all connection types in one view"
              className="w-full"
            />
            <figcaption className="px-4 py-3 border-t border-[#211D1D]/10 text-xs text-[#211D1D]/45 bg-[#FFFDF9]">
              Qlik &middot; unified connections browse view
            </figcaption>
          </figure>
        </motion.div>
      </div>

      {/* Scroll indicator - single settle-in on mount, no loop (round 23
          already fixed this from an infinite bounce to a one-shot
          entrance; only the color needed to flip for the dark page). */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <ChevronDown className="h-5 w-5 text-[#FAF3E7]/30" />
      </motion.div>
    </section>
  );
}
