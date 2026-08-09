"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptChips } from "./PromptChips";
import { CaseStudyCard } from "./CaseStudyCard";
import { FrameCarousel } from "./FrameCarousel";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { knowledge, type CaseStudyId } from "@/content/knowledge";
import { matchIntent } from "@/lib/match-intent";

const INITIAL_CHIPS = knowledge.promptSuggestions.slice(0, 4).map((p) => p.label);

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
      }, 380);
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
            transition={{ delay: 0.5 }}
            className="pb-2"
          >
            <p className="text-sm text-[#211D1D]/40 mb-3 font-medium">
              Start with a question, or try one of these:
            </p>
            <PromptChips suggestions={INITIAL_CHIPS} onSelect={submitText} />
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

        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#211D1D]/25"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="border-t border-[#211D1D]/10 px-5 py-3 bg-[#FAF3E7]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitText(inputValue);
          }}
          className="flex items-center gap-3"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about her work, process, or background…"
            className="flex-1 text-sm text-[#211D1D] placeholder:text-[#211D1D]/30 outline-none bg-transparent py-2"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || !inputValue.trim()}
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2E9B5C] disabled:opacity-30 hover:text-[#227A46] transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
