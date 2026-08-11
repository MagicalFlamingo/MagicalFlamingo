"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { track } from "@vercel/analytics";
import { PromptChips } from "./PromptChips";
import { CaseStudyBeat } from "./CaseStudyBeat";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { knowledge } from "@/content/knowledge";
import { matchIntent } from "@/lib/match-intent";
import { pick, thinkingPhrases, firstMessagePhrase, type ChatTool } from "@/content/responses";

const INITIAL_CHIPS = knowledge.promptSuggestions.slice(0, 6).map((p) => p.label);

// No auto-playing intro: a design council round found that a chat opening
// with thinking-dots + a first-person message before anyone asked
// anything reads as a performed "chatbot demo," not a dry, direct person.
// The chips just sit there, ready, until she's actually asked something -
// the first reply goes through the exact same think()/submitText() path
// as every later one instead of being a scripted special case.

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
// arrives in a quick ripple instead of one flat instant block. Total
// added time for a typical one-sentence reply is well under a third of
// a second.
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
    // Council round 18: this used to be an instant `scrollTop` jump - the
    // moment a reply landed, the log just snapped, no visible motion at
    // all. `behavior: "smooth"` is the one-line difference between "the
    // page updated" and "the conversation moved."
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
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
        {messages.length === 0 && !isThinking && (
          <div>
            <p className="text-sm text-[#211D1D]/40 mb-1 font-medium">
              Start with a question, or pick one:
            </p>
            <PromptChips
              suggestions={INITIAL_CHIPS}
              onSelect={submitText}
              highlightFirst
            />
          </div>
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
                    <RevealText text={message.text} />
                    {message.toolCall && renderTool(message.toolCall)}
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
                    className="w-2 h-2 rounded-full bg-[#F2A93C]"
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
          className="flex items-center gap-3 bg-[#FFFDF9] rounded-xl border border-[#211D1D]/15 px-4 py-3 shadow-sm focus-within:border-[#F2A93C]/60 focus-within:shadow-md transition-all"
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
