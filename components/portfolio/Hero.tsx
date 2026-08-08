"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { knowledge } from "@/content/knowledge";

export function Hero() {
  const { identity } = knowledge;

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[42%] flex flex-col justify-between px-8 pt-16 pb-10 lg:px-14 lg:pt-20 lg:pb-12 border-b lg:border-b-0 lg:border-r border-[#1A1A1A]/8">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#C4654A]">Portfolio</span>
            <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-[1.08]">{identity.name}</h1>
            <p className="mt-2 text-lg text-[#1A1A1A]/50 font-light">{identity.title}</p>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6 text-[15px] text-[#1A1A1A]/65 leading-[1.8] max-w-[38ch]">
            {identity.oneLiner}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-col gap-1.5">
            <p className="text-xs text-[#1A1A1A]/35 font-medium uppercase tracking-wider">Currently open to</p>
            {["Senior IC roles", "Staff-level roles", "Complex enterprise systems", "AI tooling"].map((tag) => (
              <span key={tag} className="text-sm text-[#1A1A1A]/55 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C4654A] inline-block" />
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 lg:mt-0 text-xs text-[#1A1A1A]/30">
          Scroll to see work below ↓
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 flex flex-col" style={{ height: "100vh" }}>
        <div className="px-8 lg:px-10 pt-10 lg:pt-14 pb-4 border-b border-[#1A1A1A]/8">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#1A1A1A]/35">Ask anything</p>
          <p className="mt-1 text-sm text-[#1A1A1A]/50">Talk to the portfolio directly. Ask about her work, process, or background.</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </motion.div>
    </section>
  );
}
