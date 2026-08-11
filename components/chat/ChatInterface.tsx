"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { track } from "@vercel/analytics";
import { PromptChips } from "./PromptChips";
import { CaseStudyBeat } from "./CaseStudyBeat";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { QuoteCard } from "./QuoteCard";
import { StatCard } from "./StatCard";
import { matchIntent } from "@/lib/match-intent";
import { pick, thinkingPhrases, firstMessagePhrase, type ChatTool } from "@/content/responses";

// Redesign (confirmed pivot): the chat moved from being the whole
// right-hand pane of a fixed-height two-pane hero to a normal section
// further down a single scrollable page - real work now shows up above
// it with zero clicks (Hero + CaseStudyGrid). Curated to 4 chips instead
// of 6 per the new brief; these 4 specifically surface QuoteCard (via
// "research process") and the art-history background angle, since a
// cold visitor won't otherwise discover those without already knowing
// to ask.
const INITIAL_CHIPS = [
  "What makes you different from other designers?",
  "How does art history show up in your work?",
  "Walk me through your research process",
  "What would you do in your first 30 days here?",
];

// Every reply gets a length-aware pause instead of one fixed
// number for every message. A flat delay is one of the most obvious
// "this is a script" tells - a real person answering "how can I get in
// touch" takes less time than answering a full case-study question.
// Small random jitter keeps it from feeling metronomic on repeat use.
function estimateReplyDelay(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const jitter = Math.random() * 220 - 60;
  return Math.min(1600, Math.max(450, 380 + words * 45 + jitter));
}

const dotVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    opacity: [0.35, 1, 0.35],
    transition: { duration: 0.7, delay: i * 0.14, repeat: Infinity, ease: "easeInOut" },
  }),
};

// Council round 18: "I'm missing some movement... animation on the
// screen, eye candy - something that shows it's live." Not a typewriter
// (an open-ended, slowly-generating reveal reads as "an LLM is composing
// this," which fights the whole "no LLM to blame" positioning) - a fast,
// bounded stagger instead. Every word is already fully "there," it just
// arrives in a quick ripple instead of one flat instant block.
function RevealText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="text-sm text-[#211D1D] leading-[1.75]">
      {words.map((w, i) => (
        <span key={i}>
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: i * 0.014, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

type AppMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  toolCall?: ChatTool;
  chips?: string[];
};

interface ChatInterfaceProps {
  // Handoff from the case-study modal's mini "Ask about this project..."
  // input (redesign) - a real question lands here and gets submitted
  // through the exact same submitText() path as anything typed directly.
  initialQuestion?: string | null;
  onConsumeInitialQuestion?: () => void;
}

export function ChatInterface({ initialQuestion, onConsumeInitialQuestion }: ChatInterfaceProps = {}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhrase, setThinkingPhrase] = useState(thinkingPhrases[0]);

  useEffect(() => {
    // Guarded on real content, not a "first render" ref flag - a ref-based
    // guard doesn't survive React Strict Mode's double-effect-invocation
    // in dev, which was silently scrolling the whole page to the (still
    // empty) chat section on every load once this component stopped
    // owning its own bounded overflow-y-auto pane (redesign).
    if (messages.length === 0 && !isThinking) return;
    // The chat now lives in a normal, page-scrolling section rather than
    // owning a fixed-height pane - scroll the newest message into view
    // within the page instead of scrolling an inner container.
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  // One shared "think, then reveal" transition - the intro and every
  // real reply both go through this instead of duplicating the
  // pick-phrase/set-thinking/timeout/clear sequence. Delay is passed in
  // per-call rather than fixed, so pacing can vary by what's coming.
  // `phraseOverride` lets a specific call skip the random pick - used for
  // the first-message moment below.
  const think = useCallback((delayMs: number, reveal: () => void, phraseOverride?: string) => {
    setThinkingPhrase(phraseOverride ?? pick(thinkingPhrases));
    setIsThinking(true);
    const t = setTimeout(() => {
      reveal();
      setIsThinking(false);
    }, delayMs);
    return () => clearTimeout(t);
  }, []);

  const submitText = useCallback(
    (text: string) => {
      if (!text.trim() || isThinking) return;
      setInputValue("");
      track("agent_question_asked", { text });

      // No new state - `messages` already tells us if this is the very
      // first thing a visitor has sent this session, before we push the
      // new user message onto it.
      const isFirstMessage = messages.length === 0;

      const userMsg: AppMessage = {
        id: Date.now().toString(),
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);

      // Matching is synchronous and instant either way - computing the
      // result up front just lets the pause length reflect what she's
      // actually about to say, like a person pausing longer mid-thought
      // for a longer answer instead of a stopwatch-perfect fixed beat.
      const result = matchIntent(text);
      think(estimateReplyDelay(result.response), () => {
        const assistantMsg: AppMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: result.response,
          toolCall: result.toolCall,
          chips: result.chips,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (result.toolCall?.tool === "showCaseStudyBeat") {
          track("case_study_opened", { project: result.toolCall.toolArgs.project, beat: result.toolCall.toolArgs.beat });
        }
      }, isFirstMessage ? firstMessagePhrase : undefined);
    },
    [isThinking, think, messages.length]
  );

  useEffect(() => {
    if (!initialQuestion) return;
    submitText(initialQuestion);
    onConsumeInitialQuestion?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const renderTool = (toolCall: ChatTool) => {
    switch (toolCall.tool) {
      case "showCaseStudyBeat":
        return <CaseStudyBeat project={toolCall.toolArgs.project} beat={toolCall.toolArgs.beat} />;
      case "showSkillsMap":
        return <SkillsMap />;
      case "showTimelineCard":
        return <TimelineCard />;
      case "showNDASafeNote":
        return <NDASafeNote context={toolCall.toolArgs.context} />;
      case "showQuoteCard":
        return <QuoteCard quote={toolCall.toolArgs.quote} attribution={toolCall.toolArgs.attribution} />;
      case "showStatCard":
        return <StatCard value={toolCall.toolArgs.value} label={toolCall.toolArgs.label} />;
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-6">
      <div role="log" aria-live="polite" aria-label="Conversation with Danielle" className="space-y-5">
        {messages.length === 0 && !isThinking && (
          <div>
            <PromptChips suggestions={INITIAL_CHIPS} onSelect={submitText} highlightFirst />
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={message.role === "user" ? "max-w-[75%]" : "w-full"}>
                {message.role === "user" ? (
                  <div className="bg-[#211D1D] text-[#FAF3E7] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                    {message.text}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <RevealText text={message.text} />
                    {message.toolCall && renderTool(message.toolCall)}
                    {message.chips && message.chips.length > 0 && (
                      <PromptChips suggestions={message.chips} onSelect={submitText} />
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
                  <motion.span key={i} custom={i} variants={dotVariants} animate="animate" className="w-2 h-2 rounded-full bg-[#F2A93C]" />
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
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitText(inputValue);
        }}
        className="mt-6 sticky bottom-4 flex items-center gap-3 bg-[#FFFDF9] rounded-full border border-[#211D1D]/15 px-5 py-3 shadow-md focus-within:border-[#F2A93C]/60 transition-all"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Message"
          className="flex-1 text-[15px] text-[#211D1D] placeholder:text-[#211D1D]/35 outline-none bg-transparent"
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={isThinking || !inputValue.trim()}
          className="shrink-0 px-4 py-1.5 rounded-full bg-[#211D1D] text-[#FAF3E7] text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-30 hover:bg-[#332D2A] transition-colors"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
