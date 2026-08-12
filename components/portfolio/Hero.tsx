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
    // Council round 20: this used to be `min-h-screen` regardless of how
    // much content actually filled it, leaving a large dead gap below
    // the fold on most screens - "match hero size to actual content,
    // not a template default" was one of the clearest, most concrete
    // pieces of real research on why AI-generated pages read as
    // templated. Generous padding instead of a forced 100vh.
    <section className="relative flex flex-col justify-center px-6 lg:px-16 py-24 lg:py-32">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-14 lg:gap-16 max-w-6xl mx-auto w-full">
        {/* Left - identity */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          {/* Council round 22 ("it should be 2026, not 2020"): oversized,
              tightly-set display type is one of the concrete, current
              levers for reading as premium rather than a template -
              this was sized like a competent brochure headline before,
              not a real hero statement. Same font (Lora), same weight
              scale, just committed to at real scale. */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-[56px] sm:text-[84px] lg:text-[92px] font-bold text-[#211D1D] tracking-tight leading-[0.95]"
          >
            {identity.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-lg text-[#211D1D]/45 font-medium tracking-[0.04em]"
          >
            {identity.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mt-6 text-xl text-[#211D1D]/75 leading-relaxed mx-auto lg:mx-0 max-w-md"
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

        {/* Right - one real screenshot, captioned like a figure. Council
            round 20 dropped the rotated-overlapping-mockups cliche in
            favor of this flat, bordered treatment - right call, but
            "flat" also meant zero depth anywhere on the page, which is
            part of why round 22 read this as dated rather than
            restrained. One soft, wide, low-opacity shadow (not
            Tailwind's default shadow-lg) puts real depth back without
            reopening the SaaS-hero-mockup question - the image still
            sits flat and uncropped, just with real weight under it. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 w-full max-w-md"
        >
          <figure className="border border-[#211D1D]/10 rounded-sm overflow-hidden bg-[#FFFDF9] shadow-[0_40px_80px_-30px_rgba(33,29,29,0.28)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/case-studies/qlik/browse-connections.jpg"
              alt="Unified connections browse table, all connection types in one view"
              className="w-full"
            />
            <figcaption className="px-4 py-3 border-t border-[#211D1D]/10 text-xs text-[#211D1D]/45">
              Qlik &middot; unified connections browse view
            </figcaption>
          </figure>
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
