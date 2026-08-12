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
          {/* Council round 23 ("$1M... 2026-2027, feels flat"): round 22
              made this bigger but the type system was still flat - every
              headline sat at the exact same Lora 700 weight, so "bigger"
              read as "technically bigger," not art-directed. A huge
              serif at medium weight reads more considered than
              bold-everywhere; 700 is reserved for the featured case-study
              headline now, where the contrast means something. */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-[56px] sm:text-[84px] lg:text-[92px] font-medium text-[#211D1D] tracking-tight leading-[0.95]"
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
            className="mt-6 text-[17px] text-[#211D1D]/75 leading-[1.6] mx-auto lg:mx-0 max-w-md"
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

      {/* Scroll indicator - council round 23 caught this as the one
          actually-ambient animation left on the page: an infinite
          `repeat: Infinity` loop that plays regardless of anything the
          visitor does, the exact category of motion CLAUDE.md has twice
          rejected elsewhere (gradient blobs, auto-playing intro). A
          single settle-in on mount, no loop, still reads as "there's
          more below" without becoming the one thing on the page that
          never stops moving. */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <ChevronDown className="h-5 w-5 text-[#211D1D]/30" />
      </motion.div>
    </section>
  );
}
