"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { track } from "@vercel/analytics";
import { PromptChips } from "./PromptChips";
import { FrameCarousel } from "./FrameCarousel";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { knowledge, type CaseStudyId } from "@/content/knowledge";
import { matchIntent } from "@/lib/match-intent";
import { pick, thinkingPhrases, introMessage, type ToolName } from "@/content/responses";

const INITIAL_CHIPS = knowledge.promptSuggestions.slice(0, 6).map((p) => p.label);

// Single source of truth for the fake-latency pause - was duplicated as a
// literal in two places (intro + submitText), tuned by hand five times.
const THINKING_DELAY_MS = 1500;

const dotVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    opacity: [0.35, 1, 0.35],
    transition: { duration: 0.7, delay: i * 0.14, repeat: Infinity, ease: "easeInOut" },
  }),
};

type AppMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tool?: ToolName;
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
  const hasIntroed = useRef(false);

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

  // One shared "think, then reveal" transition - the intro and every
  // real reply both go through this instead of duplicating the
  // pick-phrase/set-thinking/timeout/clear sequence.
  const think = useCallback((reveal: () => void) => {
    setThinkingPhrase(pick(thinkingPhrases));
    setIsThinking(true);
    const t = setTimeout(() => {
      reveal();
      setIsThinking(false);
    }, THINKING_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Agent greets first: thinking indicator, then a first-person intro
  // with chips to pick where to dig in - nothing sits static on load.
  useEffect(() => {
    if (hasIntroed.current) return;
    hasIntroed.current = true;
    track("agent_intro_shown");
    return think(() => {
      setMessages([
        {
          id: "intro",
          role: "assistant",
          text: introMessage,
          chips: INITIAL_CHIPS,
        },
      ]);
    });
  }, [think]);

  const submitText = useCallback(
    (text: string) => {
      if (!text.trim() || isThinking) return;
      setInputValue("");
      track("agent_question_asked", { text });

      const userMsg: AppMessage = {
        id: Date.now().toString(),
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);

      think(() => {
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
        if (result.tool === "showFrameCarousel" && result.toolArgs?.project) {
          track("case_study_opened", { project: String(result.toolArgs.project) });
        }
      });
    },
    [isThinking, think]
  );

  const renderTool = (tool: ToolName, args: Record<string, unknown>) => {
    switch (tool) {
      case "showFrameCarousel":
        return args.project ? (
          <FrameCarousel project={args.project as CaseStudyId} />
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
        role="log"
        aria-live="polite"
        aria-label="Conversation with Danielle"
        className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scrollbar-thin"
      >
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
                    custom={i}
                    variants={dotVariants}
                    animate="animate"
                    className="w-2 h-2 rounded-full bg-[#2E9B5C]"
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
            placeholder="Type a question - I'll actually answer it…"
            aria-label="Message"
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
