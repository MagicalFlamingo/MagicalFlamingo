"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { knowledge } from "@/content/knowledge";

// Redesign (full-page pivot, confirmed explicitly): work has to be visible
// with zero clicks before any chat interaction. This replaces the old
// two-pane identity+chat hero with a real above-the-fold hero, followed
// by a case-study grid (CaseStudyGrid) and the chat further down the
// page (see app/page.tsx). Real screenshots, real company names, real
// LinkedIn URL - nothing here is placeholder content.
const COMPANY_BADGES = ["Qlik", "Amazon AWS", "Menora"];

export function Hero() {
  const { identity } = knowledge;

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-16 py-20">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-14 lg:gap-16 max-w-6xl mx-auto w-full">
        {/* Left - identity */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-[42px] sm:text-[56px] font-bold text-[#211D1D] tracking-tight leading-[1.08]"
          >
            {identity.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-base text-[#211D1D]/45 font-medium tracking-[0.04em]"
          >
            {identity.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mt-5 text-lg text-[#211D1D]/75 leading-relaxed mx-auto lg:mx-0 max-w-md"
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
              className="text-[#211D1D]/60 hover:text-[#7A5C12] transition-colors"
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
              className="text-[#211D1D]/60 hover:text-[#7A5C12] transition-colors"
            >
              LinkedIn
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.34 }}
            className="mt-8 flex items-center justify-center lg:justify-start gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#211D1D]/35"
          >
            {COMPANY_BADGES.map((company, i) => (
              <span key={company} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true">&middot;</span>}
                {company}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right - stacked real screenshots, one-time entrance only */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 relative h-[280px] sm:h-[380px] w-full max-w-md"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/case-studies/qlik/wizard-configure-step.jpg"
              alt="Qlik connection wizard, built on Sprout 2.0 components"
              className="absolute w-[74%] rounded-lg border border-[#211D1D]/10 shadow-lg -rotate-[5deg] -translate-x-[8%] translate-y-2"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/case-studies/qlik/browse-connections.jpg"
              alt="Unified connections browse table, all connection types in one view"
              className="absolute w-[74%] rounded-lg border border-[#211D1D]/10 shadow-lg rotate-[4deg] translate-x-[8%] -translate-y-1"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - functional wayfinding for the new scrollable
          page, not ambient decoration; respects reduced-motion via the
          sitewide MotionConfig wrapper. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-[#211D1D]/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
