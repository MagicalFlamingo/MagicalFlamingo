"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";

interface ChatSectionProps {
  initialQuestion?: string | null;
  onConsumeInitialQuestion?: () => void;
}

// Council round 23: the Creative Director's read was blunt - hero, grid,
// and chat were "three static, disconnected screens," and chat, the
// site's actual differentiator, had the *least* visual distinction of
// the three (same cream/paper as the grid above it). Rather than
// re-theming every rich component the chat can render (QuoteCard,
// StatCard, SkillsMap, TimelineCard, NDASafeNote, CaseStudyBeat, every
// message bubble and chip) for a dark background - real risk to a lot
// of already-working, already-tested light-mode chrome, for a round
// that's supposed to be adding polish, not regressions - this gives the
// section its own dark "stage" (the same ink/cream focus-mode identity
// already established by CaseStudyModal) with the existing, unchanged
// light chat panel presented as a real object floating on it. Same
// compositional break the council asked for, without touching a single
// line of the chat internals.
export function ChatSection({ initialQuestion, onConsumeInitialQuestion }: ChatSectionProps) {
  return (
    <section id="chat" className="px-6 py-24 lg:py-32 bg-[#211D1D]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="max-w-[800px] mx-auto text-center mb-10"
      >
        <h2 className="font-serif text-[40px] sm:text-[48px] font-semibold text-[#FAF3E7] leading-[1.05] tracking-[-0.01em]">
          Ask me anything
        </h2>
        <p className="mt-3 text-[15px] text-[#FAF3E7]/55">
          Process, decisions, what I&rsquo;d do on day one.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[880px] mx-auto bg-[#FAF3E7] rounded-sm px-2 py-10 sm:px-4 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.45)]"
      >
        <ChatInterface initialQuestion={initialQuestion} onConsumeInitialQuestion={onConsumeInitialQuestion} />
      </motion.div>
    </section>
  );
}
