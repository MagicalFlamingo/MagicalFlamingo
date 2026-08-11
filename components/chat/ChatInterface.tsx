"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { track } from "@vercel/analytics";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { PromptChips } from "./PromptChips";
import { CaseStudyBeat } from "./CaseStudyBeat";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { QuoteCard } from "./QuoteCard";
import { StatCard } from "./StatCard";
import { pick, thinkingPhrases, firstMessagePhrase } from "@/content/responses";
import type { CaseStudyId } from "@/content/knowledge";
import type { BeatId } from "./CaseStudyBeat";

// Redesign (confirmed pivot, step 5): the chat now calls the real LLM
// route (app/api/chat) via @ai-sdk/react's useChat instead of the local
// keyword-matching engine (lib/match-intent.ts, content/responses.ts
// intents) - that engine is left in the repo untouched in case of
// rollback, but is no longer imported here. `pick`/`thinkingPhrases`/
// `firstMessagePhrase` are just personality-phrase pools, unrelated to
// the matching logic itself, and are still real content worth reusing.
//
// Curated to 4 starter chips (was 6); these specifically surface
// QuoteCard/art-history angles a cold visitor wouldn't otherwise find.
const INITIAL_CHIPS = [
  "What makes you different from other designers?",
  "How does art history show up in your work?",
  "Walk me through your research process",
  "What would you do in your first 30 days here?",
];

const dotVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    opacity: [0.35, 1, 0.35],
    transition: { duration: 0.7, delay: i * 0.14, repeat: Infinity, ease: "easeInOut" },
  }),
};

interface ChatInterfaceProps {
  // Handoff from the case-study modal's mini "Ask about this project..."
  // input - a real question lands here and gets sent through the exact
  // same sendMessage() path as anything typed directly.
  initialQuestion?: string | null;
  onConsumeInitialQuestion?: () => void;
}

// Loosely-typed tool-part narrowing rather than full generic inference
// across the client/server boundary (InferUITools<ChatTools> etc.) - a
// reasonable simplification for a first real wiring pass in a repo with
// no test suite; the exhaustive switch below still catches a genuinely
// unknown tool name by falling through to null, and every args shape is
// read directly from the AI SDK's own `part.input`, not re-declared here.
type ToolPart = {
  type: string;
  toolCallId: string;
  input?: unknown;
};

function renderToolPart(part: ToolPart) {
  const input = part.input as Record<string, unknown> | undefined;
  if (!input) return null;
  switch (part.type) {
    case "tool-showCaseStudyBeat":
      return <CaseStudyBeat key={part.toolCallId} project={input.project as CaseStudyId} beat={input.beat as BeatId} />;
    case "tool-showSkillsMap":
      return <SkillsMap key={part.toolCallId} />;
    case "tool-showTimelineCard":
      return <TimelineCard key={part.toolCallId} />;
    case "tool-showNDASafeNote":
      return <NDASafeNote key={part.toolCallId} context={input.context as string} />;
    case "tool-showQuoteCard":
      return <QuoteCard key={part.toolCallId} quote={input.quote as string} attribution={input.attribution as string} />;
    case "tool-showStatCard":
      return <StatCard key={part.toolCallId} value={input.value as string} label={input.label as string} />;
    default:
      return null;
  }
}

export function ChatInterface({ initialQuestion, onConsumeInitialQuestion }: ChatInterfaceProps = {}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [thinkingPhrase, setThinkingPhrase] = useState(thinkingPhrases[0]);
  const trackedCaseStudyOpens = useRef(new Set<string>());
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));

  const { messages, sendMessage, status, regenerate } = useChat({ transport });
  const isThinking = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (status === "submitted") {
      setThinkingPhrase(messages.length === 0 ? firstMessagePhrase : pick(thinkingPhrases));
    }
  }, [status, messages.length]);

  // Analytics parity with the old renderTool switch - fires once per
  // real showCaseStudyBeat tool call, not once per re-render.
  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type !== "tool-showCaseStudyBeat") continue;
        const toolPart = part as unknown as ToolPart;
        if (trackedCaseStudyOpens.current.has(toolPart.toolCallId)) continue;
        const input = toolPart.input as { project?: string; beat?: string } | undefined;
        if (!input?.project || !input?.beat) continue;
        trackedCaseStudyOpens.current.add(toolPart.toolCallId);
        track("case_study_opened", { project: input.project, beat: input.beat });
      }
    }
  }, [messages]);

  const submitText = (text: string) => {
    if (!text.trim() || isThinking) return;
    setInputValue("");
    track("agent_question_asked", { text });
    sendMessage({ text });
  };

  useEffect(() => {
    if (!initialQuestion) return;
    submitText(initialQuestion);
    onConsumeInitialQuestion?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

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
                    {message.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return part.text.trim() ? (
                          <p key={i} className="text-sm text-[#211D1D] leading-[1.75] whitespace-pre-wrap">
                            {part.text}
                          </p>
                        ) : null;
                      }
                      if (part.type === "tool-showPromptChips") {
                        const input = (part as unknown as ToolPart).input as { suggestions?: string[] } | undefined;
                        return input?.suggestions ? (
                          <PromptChips key={i} suggestions={input.suggestions} onSelect={submitText} />
                        ) : null;
                      }
                      return renderToolPart(part as unknown as ToolPart);
                    })}
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

        {/* Real fetch/API failure (e.g. no ANTHROPIC_API_KEY configured
            in this environment yet) - an honest inline error, not a
            silent fallback to the old canned engine. That would leave a
            visitor unable to tell which system just answered them, and
            contradicts the point of committing to the real-LLM pivot. */}
        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-sm">
            {/* Friendly text for visitors, not the raw SDK error - that
                detail belongs in server logs / the network tab for
                whoever's actually debugging it, not on the live page. */}
            <p className="text-[#211D1D]/50 italic">Something went wrong on that one.</p>
            <button
              type="button"
              onClick={() => regenerate()}
              className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[#7A5C12] hover:text-[#211D1D] transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
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
