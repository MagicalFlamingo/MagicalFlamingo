"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { track } from "@vercel/analytics";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { PromptChips } from "./PromptChips";
import { CaseStudyBeat } from "./CaseStudyBeat";
import { HeroCaseStudyBlock } from "./HeroCaseStudyBlock";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { QuoteCard } from "./QuoteCard";
import { StatCard } from "./StatCard";
import { pick, thinkingPhrases, firstMessagePhrase } from "@/content/responses";
import { knowledge, type CaseStudyId } from "@/content/knowledge";
import type { BeatId } from "./CaseStudyBeat";

// Redesign (confirmed pivot, step 5): the chat now calls the real LLM
// route (app/api/chat) via @ai-sdk/react's useChat instead of the local
// keyword-matching engine (lib/match-intent.ts, content/responses.ts
// intents) - that engine is left in the repo untouched in case of
// rollback, but is no longer imported here. `pick`/`thinkingPhrases`/
// `firstMessagePhrase` are just personality-phrase pools, unrelated to
// the matching logic itself, and are still real content worth reusing.

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
  // Round 25: case studies are no longer a separate page section you
  // scroll past to reach the chat - they're the first thing the chat
  // itself shows you, via HeroCaseStudyBlock below. Opening one still
  // goes through the same full-screen CaseStudyModal as before; this
  // prop is just how that click reaches page.tsx's existing modal state.
  onOpenCaseStudy?: (project: CaseStudyId) => void;
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

export function ChatInterface({ initialQuestion, onConsumeInitialQuestion, onOpenCaseStudy }: ChatInterfaceProps = {}) {
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

  // Round 27 (council: "layout is not so good") vertically centered this
  // whole block to fix dead space that used to sit only below it.
  //
  // Council round 2 ("it feels very condensed" - 5/5 advisors, same
  // diagnosis): centering treated the symptom. The real cause was a
  // single max-w-[800px] measure doing two incompatible jobs - a
  // reading width for prose/chat, and the frame for a 3-up work
  // gallery. On a 1920px screen that shrank each case-study tile to
  // ~235px (the AWS/Qlik screenshots - the actual proof of shipped
  // work - became genuinely illegible) while the headline, a claim,
  // stayed the visually dominant element. Backwards for a portfolio.
  //
  // Fix: two measures instead of one. PAGE_MAX_W (1160px) is the outer
  // container width - what the case-study gallery is allowed to use.
  // TEXT_MAX_W (720px) is what the headline/subtext/chips/input cap
  // themselves to *without their own centering*, so they hug the same
  // left edge as the gallery instead of re-centering into their own
  // smaller box. `justify-center` is gone - top-anchored with
  // deliberate lead space instead, so emptiness (if any) reads as
  // "page continues," not "this is the whole thing."
  const isEmpty = messages.length === 0 && !isThinking;

  // Council round 4 (Materialist advisor, measured not guessed): this
  // was a flat max-w-[1160px], which measured identically - 711px of
  // actual content width - at both 1440px and 1920px viewports. Same
  // scale-invariance bug the density rule in CLAUDE.md was written to
  // catch, regressed into this fixed cap. min(1440px, 92vw) grows with
  // the viewport up to a real ceiling instead of stepping once and
  // going flat; kept identical in Hero.tsx so the two containers' left
  // edges stay locked together at every width, not just some.
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-[min(1440px,92vw)] mx-auto px-6 lg:px-8 justify-start">
      {/* Council review (Eliminator advisor, confirmed): this whole block
          used to sit inside the role="log" region below, which meant a
          screen reader announced the static headline, case-study tiles,
          and starter chips as live chat traffic the instant the page
          loaded - they're not messages, nothing "arrived." Moved outside
          role="log" entirely; only the real, changing conversation
          (messages, thinking state, errors) is a log. */}
      {isEmpty && (
        <div className="space-y-6 lg:space-y-8 pt-[6vh] lg:pt-[8vh]">
          {/* Round 25 ("start from scratch" council): the page used to
              make you scroll past a hero and a case-study grid before
              reaching this. Three of four advisors converged
              independently on the same diagnosis - repainting that
              same three-block skeleton for 24 rounds is why it kept
              reading as "the same" no matter the palette. This is the
              fix: the conversation opens already mid-thought, real
              work included, nothing to scroll past to get here.

              Round 26 (full pivot to a real reference site the user pointed at): that
              site's whole identity is one huge, plain, confident
              sans headline with a single accent-colored phrase inside
              it - not a small paragraph. oneLiner is split on its own
              existing " - " (not a hardcoded substring of the words
              themselves, so this doesn't break if the real copy in
              knowledge.ts changes) so the second clause gets the
              site's one accent color, echoing that exact device.

              Council round 2: headline now scales up past the old
              32px cap (48px+ at desktop, matching Materialist's "a
              headline should be sized like a headline, not a blog h2"),
              capped at max-w-[720px] so it still wraps to real lines
              instead of running the full 1160px width.

              Council round 3 ("a lot of text, a lot of items - hard to
              understand the layout"): the subtext line ("Here's the
              real work - or ask me anything") is gone - pure narration
              of a layout that should be self-evident, per the
              Eliminator's cut list. The starter chips are gone from
              cold load too - they already exist mid-conversation via
              the LLM's own showPromptChips tool call once there's real
              context to react to; four of them competing with the
              headline and the case study for attention on first paint
              was one invitation too many, confirmed independently by
              3 of 5 advisors and the peer-review pass.

              Council round 4: two real, measured defects, both from the
              same span. First, oneLiner used to be split on its own
              " - " and everything after the dash got marigold
              #F2A93C - which happened to be 3 of the headline's 4
              lines. Marigold-on-cream measures 1.81:1 contrast, under
              WCAG's 3:1 floor for large text, and globals.css already
              documents ochre #7A5C12 (5.65:1) as the token for exactly
              this case. Second, the fixed text-[..48px] steps and the
              max-w-[720px] cap render the exact same line breaks at
              1440px and 1920px - the same scale-invariance bug round 2
              fixed elsewhere, regressed here. Fixed by highlighting
              only the real claim ("make sense") in ochre instead of an
              entire clause, and by sizing with clamp() so the headline
              actually grows with the viewport instead of stepping once
              and stopping. */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-[clamp(720px,72vw,1000px)] text-[clamp(1.75rem,4.4vw,3rem)] font-semibold text-[#211D1D] leading-[1.15] tracking-tight"
          >
            {(() => {
              const line = knowledge.identity.oneLiner;
              const accent = "make sense";
              const idx = line.indexOf(accent);
              if (idx === -1) return line;
              return (
                <>
                  {line.slice(0, idx)}
                  <span className="text-[#7A5C12]">{accent}</span>
                  {line.slice(idx + accent.length)}
                </>
              );
            })()}
          </motion.h2>
          <HeroCaseStudyBlock onOpen={(p) => onOpenCaseStudy?.(p)} delay={0.12} />
        </div>
      )}

      <div role="log" aria-live="polite" aria-label="Conversation with Danielle" className="max-w-[clamp(720px,72vw,1000px)] space-y-5">
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

      {/* Council round 20: a rounded-full pill with an inline round send
          button is the exact shape every AI chat product uses (ChatGPT,
          Perplexity, Intercom) - recognizable as "AI chat input" on
          sight, independent of color. A plain bordered field with a
          bottom accent rule reads as an inquiry field, not a chatbot
          widget, and matches the sharp-cornered chrome used everywhere
          else on the site now (CaseStudyCard, the hero figure).

          Sticky is now conditional on a real conversation existing.
          Round 2's density fix (removing justify-center, adding real
          top padding) pushed the empty state's total content height
          close enough to typical viewport heights that `sticky bottom-4`
          started triggering on first paint - no scrolling needed to
          reach the "stuck" threshold, so the input rendered pinned mid-
          page, overlapping the chips above it. Caught in a real
          screenshot at 1440x900, not theoretical. Sticky only matters
          once there's something to scroll past - a real, growing
          message log - so it's off during the empty state and on once
          messages exist.

          Council round 4 (Value & Friction advisor): at cold load,
          isEmpty is true and inputValue is "", so the Ask button used
          to render permanently at disabled:opacity-30 - the loudest
          filled control on the page arrived looking broken. Cold load
          now uses a bare hairline underline (no box, no button) so the
          field reads as an open invitation, not a form; the filled Ask
          pill only appears once there's real text to submit, and the
          full bordered/boxed chrome only returns once a real
          conversation exists. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitText(inputValue);
        }}
        className={`mt-6 max-w-[clamp(720px,72vw,1000px)] flex items-center gap-3 transition-colors ${
          isEmpty
            ? "border-b border-[#211D1D]/15 focus-within:border-[#211D1D]/40 px-1 py-2.5"
            : "bg-[#FFFDF9] rounded-sm border border-[#211D1D]/15 px-4 py-3 focus-within:border-[#F2A93C]/60 sticky bottom-4"
        }`}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Message"
          className="flex-1 text-[15px] text-[#211D1D] placeholder:text-[#211D1D]/35 outline-none bg-transparent"
          disabled={isThinking}
        />
        {(!isEmpty || inputValue.trim()) && (
          <button
            type="submit"
            disabled={isThinking || !inputValue.trim()}
            className="shrink-0 px-4 py-1.5 rounded-sm bg-[#211D1D] text-[#FAF3E7] text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-30 hover:bg-[#332D2A] transition-colors"
          >
            Ask
          </button>
        )}
      </form>
    </div>
  );
}
