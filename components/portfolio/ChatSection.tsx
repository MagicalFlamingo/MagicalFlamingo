"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";

interface ChatSectionProps {
  initialQuestion?: string | null;
  onConsumeInitialQuestion?: () => void;
}

export function ChatSection({ initialQuestion, onConsumeInitialQuestion }: ChatSectionProps) {
  return (
    <section id="chat" className="px-6 py-20 bg-[#FFFDF9] border-t border-[#211D1D]/8">
      <div className="max-w-[800px] mx-auto text-center mb-8">
        <h2 className="font-serif text-2xl font-bold text-[#211D1D]">Ask me anything</h2>
        <p className="mt-2 text-sm text-[#211D1D]/55">Process, decisions, what I&rsquo;d do on day one.</p>
      </div>
      <ChatInterface initialQuestion={initialQuestion} onConsumeInitialQuestion={onConsumeInitialQuestion} />
    </section>
  );
}
