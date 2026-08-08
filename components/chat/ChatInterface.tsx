"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { isToolUIPart, getToolName } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { PromptChips } from "./PromptChips";
import { CaseStudyCard } from "./CaseStudyCard";
import { FrameCarousel } from "./FrameCarousel";
import { SkillsMap } from "./SkillsMap";
import { TimelineCard } from "./TimelineCard";
import { NDASafeNote } from "./NDASafeNote";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

const INITIAL_CHIPS = knowledge.promptSuggestions.slice(0, 6).map((p) => p.label);

type ToolArgs = {
  project?: CaseStudyId;
  suggestions?: string[];
  context?: string;
};

export function ChatInterface() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status } = useChat({
    api: "/api/chat",
  } as Parameters<typeof useChat>[0]);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      sendMessage({ text });
      setInputValue("");
    },
    [sendMessage]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitText(inputValue);
  };

  const renderToolPart = (toolName: string, input: unknown) => {
    const args = (input ?? {}) as ToolArgs;

    switch (toolName) {
      case "showCaseStudyCard":
        return args.project ? (
          <CaseStudyCard
            project={args.project}
            onExpand={(p) =>
              submitText(`Walk me through the full ${knowledge.caseStudies[p].title} case study`)
            }
          />
        ) : null;
      case "showFrameCarousel":
        return args.project ? <FrameCarousel project={args.project} /> : null;
      case "showSkillsMap":
        return <SkillsMap />;
      case "showTimelineCard":
        return <TimelineCard />;
      case "showPromptChips":
        return args.suggestions && args.suggestions.length > 0 ? (
          <PromptChips suggestions={args.suggestions} onSelect={submitText} />
        ) : null;
      case "showNDASafeNote":
        return args.context ? <NDASafeNote context={args.context} /> : null;
      default:
        return null;
    }
  };

  const showInitialChips = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin">
        {showInitialChips && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pb-2"
          >
            <p className="text-sm text-[#1A1A1A]/40 mb-3 font-medium">
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
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={message.role === "user" ? "max-w-[75%]" : "w-full"}>
                {message.role === "user" ? (
                  <div className="bg-[#1A1A1A] text-[#F7F6F3] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                    {message.parts.filter((p) => p.type === "text").map((p, i) => (
                      <span key={i}>{p.type === "text" ? p.text : ""}</span>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {message.parts.map((part, partIdx) => {
                      if (part.type === "text" && part.text.trim()) {
                        return (
                          <p key={partIdx} className="text-sm text-[#1A1A1A] leading-[1.75] whitespace-pre-wrap">
                            {part.text}
                          </p>
                        );
                      }
                      if (isToolUIPart(part)) {
                        const name = getToolName(part);
                        if (part.state === "input-streaming") return null;
                        const input = "input" in part ? part.input : {};
                        return <div key={partIdx}>{renderToolPart(name, input)}</div>;
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[#1A1A1A]/40"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">thinking…</span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#1A1A1A]/10 px-4 py-4 bg-[#F7F6F3]">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-white rounded-full border border-[#1A1A1A]/15 px-4 py-2.5 focus-within:border-[#1A1A1A]/30 transition-colors"
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about her work, process, or background…"
            className="flex-1 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 outline-none bg-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-7 h-7 rounded-full bg-[#C4654A] flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#B55940] transition-colors"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
