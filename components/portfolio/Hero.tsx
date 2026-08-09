"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { knowledge } from "@/content/knowledge";

export function Hero() {
  const { identity } = knowledge;
  const chars = identity.name.split("");

  return (
    <section className="flex flex-col lg:flex-row">
      {/* Left — identity (desktop only) */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between px-14 pt-20 pb-12 border-r border-[#1A1A1A]/8 relative overflow-hidden">
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
          {/* Eyebrow + rule */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C4654A]"
          >
            Portfolio
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0, 0.1, 1] }}
            style={{ transformOrigin: "left center" }}
            className="mt-2 h-px w-10 bg-[#C4654A]/35"
          />

          {/* Name — character by character */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4"
          >
            <h1 className="text-[52px] font-bold text-[#1A1A1A] tracking-tight leading-[1.04] font-serif overflow-hidden">
              {chars.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: "60%" }}
                  animate={{ opacity: 1, y: "0%" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.16 + i * 0.028,
                    ease: [0.25, 0, 0.1, 1],
                  }}
                  className={char === " " ? "inline-block w-[0.28em]" : "inline-block"}
                >
                  {char !== " " ? char : null}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-2 text-sm text-[#1A1A1A]/40 font-medium tracking-[0.06em]"
            >
              {identity.title}
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-[#1A1A1A]/22 tracking-wide"
        >
          Scroll to see work below{" "}
          <motion.span
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>

      {/* Right — chat (full-screen on mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex flex-col h-[100dvh]"
      >
        {/* Mobile header — name + title as agent identity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:hidden px-6 pt-10 pb-5 border-b border-[#1A1A1A]/8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59CB74] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59CB74]" />
            </span>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#1A1A1A]/35">
              Portfolio
            </p>
          </div>
          <h1 className="text-[28px] font-bold text-[#1A1A1A] font-serif tracking-tight leading-tight">
            {identity.name}
          </h1>
          <p className="mt-1 text-sm text-[#1A1A1A]/40 font-medium tracking-[0.04em]">
            {identity.title}
          </p>
        </motion.div>

        {/* Desktop header */}
        <div className="hidden lg:block px-10 pt-14 pb-4 border-b border-[#1A1A1A]/8">
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

        <div className="flex-1 overflow-hidden min-h-0">
          <ChatInterface />
        </div>
      </motion.div>
    </section>
  );
}
