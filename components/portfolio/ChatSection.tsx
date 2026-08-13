"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import type { CaseStudyId } from "@/content/knowledge";

interface ChatSectionProps {
  initialQuestion?: string | null;
  onConsumeInitialQuestion?: () => void;
  onOpenCaseStudy?: (project: CaseStudyId) => void;
}

// Round 25 ("start from scratch" council): this used to be the third of
// three stacked sections (hero, case-study grid, chat) - real work sat
// two full scrolls below the fold, behind the site's least distinctive
// screen. It's effectively the whole page now: the identity plaque
// above it (Hero.tsx) is deliberately compact, and this section fills
// the rest of the viewport so the conversation - already mid-thought,
// real case studies included via ChatInterface's own empty-state block
// - is what a visitor sees without scrolling past anything to reach it.
// The separate "Ask me anything" heading this section used to carry is
// gone; the chat's own opening line does that job now, in Danielle's
// voice instead of a section label repeating what's obviously a chat.
export function ChatSection({ initialQuestion, onConsumeInitialQuestion, onOpenCaseStudy }: ChatSectionProps) {
  return (
    <section id="chat" className="px-6 pb-8 lg:pb-12 bg-[#211D1D] flex-1 flex flex-col min-h-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-[880px] w-full mx-auto bg-[#FAF3E7] rounded-sm px-2 py-8 sm:px-4 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.45)]"
      >
        <ChatInterface
          initialQuestion={initialQuestion}
          onConsumeInitialQuestion={onConsumeInitialQuestion}
          onOpenCaseStudy={onOpenCaseStudy}
        />
      </motion.div>
    </section>
  );
}
