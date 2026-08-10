"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { track } from "@vercel/analytics";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { knowledge } from "@/content/knowledge";

export function Hero() {
  const { identity } = knowledge;
  const chars = identity.name.split("");

  return (
    <section className="flex flex-col lg:flex-row">
      {/* Left - identity (desktop only) */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-center px-14 border-r border-[#211D1D]/8 relative overflow-hidden">
        <div className="relative">
          {/* Name - character by character */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h1 className="text-[52px] font-bold text-[#211D1D] tracking-tight leading-[1.15] font-serif overflow-hidden pb-1">
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
              className="mt-2 text-sm text-[#211D1D]/40 font-medium tracking-[0.06em]"
            >
              {identity.title}
            </motion.p>
          </motion.div>
        </div>

      </div>

      {/* Right - chat (full-screen on mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex flex-col h-[100dvh]"
      >
        {/* Mobile header - name + title as agent identity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:hidden px-6 pt-10 pb-5 border-b border-[#211D1D]/8"
        >
          <div className="flex items-center justify-between">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2A93C] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F2A93C]" />
            </span>
            <a
              href={`tel:${identity.phone.replace(/-/g, "")}`}
              onClick={() => track("phone_tapped")}
              aria-label="Call Danielle"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[#211D1D]/45 hover:text-[#2E9B5C] hover:bg-[#2E9B5C]/8 transition-colors text-xs font-medium tracking-wide"
            >
              <Phone className="h-3 w-3" />
              {identity.phone}
            </a>
          </div>
          <h1 className="mt-2 text-[28px] font-bold text-[#211D1D] font-serif tracking-tight leading-tight">
            {identity.name}
          </h1>
          <p className="mt-1 text-sm text-[#211D1D]/40 font-medium tracking-[0.04em]">
            {identity.title}
          </p>
          <p className="mt-2 text-sm text-[#211D1D]/50">
            This is her portfolio, set up so you can ask it questions directly.
          </p>
        </motion.div>

        {/* Desktop header */}
        <div className="hidden lg:block px-10 pt-14 pb-4 border-b border-[#211D1D]/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2A93C] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F2A93C]" />
              </span>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#211D1D]/35">
                Ask anything
              </p>
            </div>
            <a
              href={`tel:${identity.phone.replace(/-/g, "")}`}
              onClick={() => track("phone_tapped")}
              aria-label="Call Danielle"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[#211D1D]/45 hover:text-[#2E9B5C] hover:bg-[#2E9B5C]/8 transition-colors text-xs font-medium tracking-wide"
            >
              <Phone className="h-3 w-3" />
              {identity.phone}
            </a>
          </div>
          <p className="mt-1.5 text-sm text-[#211D1D]/45">
            Ask me about my work, process, or background.
          </p>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <ChatInterface />
        </div>
      </motion.div>
    </section>
  );
}
