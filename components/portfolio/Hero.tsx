"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { knowledge } from "@/content/knowledge";

const OPEN_TO = ["Senior IC roles", "Staff-level roles", "Complex enterprise", "AI tooling"];

export function Hero() {
  const { identity } = knowledge;
  const tagline = identity.oneLiner.replace(" — and", ". And");

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — identity */}
      <div className="lg:w-[42%] flex flex-col justify-between px-8 pt-16 pb-10 lg:px-14 lg:pt-20 lg:pb-12 border-b lg:border-b-0 lg:border-r border-[#1A1A1A]/8 relative overflow-hidden">
        {/* Decorative soft orbs */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(196,101,74,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 -left-16 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(196,101,74,0.04) 0%, transparent 70%)" }}
        />

        <div className="relative">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C4654A]"
          >
            Portfolio
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-3"
          >
            <h1 className="text-4xl lg:text-[52px] font-bold text-[#1A1A1A] tracking-tight leading-[1.04] font-serif">
              {identity.name}
            </h1>
            <p className="mt-2 text-sm text-[#1A1A1A]/40 font-medium tracking-[0.06em]">
              {identity.title}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-6 text-[15px] text-[#1A1A1A]/60 leading-[1.85] max-w-[36ch]"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="mt-8"
          >
            <p className="text-[10px] font-semibold text-[#1A1A1A]/28 uppercase tracking-[0.18em] mb-3">
              Currently open to
            </p>
            <div className="flex flex-wrap gap-2">
              {OPEN_TO.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.44 + i * 0.07, type: "spring", stiffness: 280, damping: 22 }}
                  className="text-xs text-[#1A1A1A]/55 border border-[#1A1A1A]/10 rounded-full px-3 py-1 bg-white/50"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72 }}
          className="mt-10 lg:mt-0 text-xs text-[#1A1A1A]/22 tracking-wide"
        >
          Scroll to see work below ↓
        </motion.div>
      </div>

      {/* Right — chat */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex flex-col"
        style={{ height: "100vh" }}
      >
        <div className="px-8 lg:px-10 pt-10 lg:pt-14 pb-4 border-b border-[#1A1A1A]/8">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59CB74] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59CB74]" />
            </span>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#1A1A1A]/35">
              Ask anything
            </p>
          </div>
          <p className="mt-1.5 text-sm text-[#1A1A1A]/45">
            Talk to the portfolio directly. Ask about her work, process, or background.
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </motion.div>
    </section>
  );
}
