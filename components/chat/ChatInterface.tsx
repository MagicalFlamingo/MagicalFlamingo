"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { PromptChips } from "./PromptChips";
import { CaseStudyCard } from "./CaseStudyCard";
import { FrameCarousel } from "./FrameCarousel";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { CaseStudyTiles } from "@/components/portfolio/CaseStudyTiles";
import { knowledge, type CaseStudyId } from "@/content/knowledge";
import { matchIntent } from "@/lib/match-intent";
import { pick, thinkingPhrases } from "@/content/responses";

const INITIAL_CHIPS = knowledge.promptSuggestions.slice(0, 4).map((p) => p.label);
const bio = knowledge.identity.positioning.split("\n\n")[0].trim();

type AppMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tool?: string;
  toolArgs?: Record<string, unknown>;
  chips?: string[];
};

export function ChatInterface() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhrase, setThinkingPhrase] = useState(thinkingPhrases[0]);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isThinking]);

  const submitText = useCallback(
    (text: string) => {
      if (!text.trim() || isThinking) return;
      setInputValue("");

      const userMsg: AppMessage = {
        id: Date.now().toString(),
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setThinkingPhrase(pick(thinkingPhrases));
      setIsThinking(true);

      setTimeout(() => {
        const result = matchIntent(text);
        const assistantMsg: AppMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: result.response,
          tool: result.tool,
          toolArgs: result.toolArgs,
          chips: result.chips,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
      }, 900);
    },
    [isThinking]
  );

  const renderTool = (tool: string, args: Record<string, unknown>) => {
    switch (tool) {
      case "showFrameCarousel":
        return args.project ? (
          <FrameCarousel project={args.project as CaseStudyId} />
        ) : null;
      case "showCaseStudyCard":
        return args.project ? (
          <CaseStudyCard
            project={args.project as CaseStudyId}
            onExpand={(p) =>
              submitText(
                `Walk me through the full ${knowledge.caseStudies[p].title} case study`
              )
            }
          />
        ) : null;
      case "showSkillsMap":
        return <SkillsMap />;
      case "showTimelineCard":
        return <TimelineCard />;
      case "showNDASafeNote":
        return args.context ? (
          <NDASafeNote context={args.context as string} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scrollbar-thin"
      >
        {messages.length === 0 && !isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pb-2 space-y-7"
          >
            <div>
              <p className="text-[15px] text-[#211D1D]/70 leading-[1.7] max-w-[60ch]">
                {bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <a
                  href="/danielle-goldberg-cv.pdf"
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#211D1D] text-[#FAF3E7] text-xs font-medium hover:bg-[#332D2A] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CV
                </a>
                <a
                  href={`mailto:${knowledge.identity.email}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#211D1D]/20 text-[#211D1D] text-xs font-medium hover:bg-[#211D1D]/5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Get in touch
                </a>
              </div>
            </div>

            <CaseStudyTiles />

            <div>
              <p className="text-sm text-[#211D1D]/40 mb-3 font-medium">
                Start with a question, or try one of these:
              </p>
              <PromptChips suggestions={INITIAL_CHIPS} onSelect={submitText} />
            </div>

            <p className="text-[11px] text-[#211D1D]/25 pt-2">
              &copy; 2026 Danielle Goldberg
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={
                  message.role === "user" ? "max-w-[75%]" : "w-full"
                }
              >
                {message.role === "user" ? (
                  <div className="bg-[#211D1D] text-[#FAF3E7] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                    {message.text}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-[#211D1D] leading-[1.75]">
                      {message.text}
                    </p>
                    {message.tool &&
                      renderTool(message.tool, message.toolArgs ?? {})}
                    {message.chips && message.chips.length > 0 && (
                      <PromptChips
                        suggestions={message.chips}
                        onSelect={submitText}
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
              className="flex items-center gap-2.5"
            >
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#2E9B5C]"
                    animate={{ y: [0, -6, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.14,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[11px] tracking-[0.02em] text-[#211D1D]/40 font-medium italic"
              >
                {thinkingPhrase}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#211D1D]/10 px-4 py-4 bg-[#FAF3E7]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitText(inputValue);
          }}
          className="flex items-center gap-3 bg-[#FFFDF9] rounded-xl border border-[#211D1D]/15 px-4 py-3 shadow-sm focus-within:border-[#2E9B5C]/50 focus-within:shadow-md transition-all"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Danielle anything…"
            className="flex-1 text-[15px] text-[#211D1D] placeholder:text-[#211D1D]/35 outline-none bg-transparent"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || !inputValue.trim()}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#211D1D] text-[#FAF3E7] text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-30 hover:bg-[#332D2A] transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
