"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";
import type { CaseStudyId } from "@/content/knowledge";

interface ChatSectionProps {
  initialQuestion?: string | null;
  onConsumeInitialQuestion?: () => void;
  onOpenCaseStudy?: (project: CaseStudyId) => void;
}

// Round 26 (full aesthetic pivot to a real reference the user pointed
// at). That site is completely flat - no boxes inside boxes, no shadow
// separating one section from another, just content sitting directly
// on one plain background. The dark ink "stage" wrapping a floating,
// heavily-shadowed cream panel (round 23's answer to "chat has the
// least visual distinction of any section") doesn't fit that - it's
// exactly the kind of nested-box chrome the reference has none of. The
// page background is one flat plane now (see app/page.tsx); this
// section just holds the chat directly on it.
export function ChatSection({ initialQuestion, onConsumeInitialQuestion, onOpenCaseStudy }: ChatSectionProps) {
  return (
    <section id="chat" className="pb-16 flex-1 flex flex-col min-h-0">
      <ChatInterface
        initialQuestion={initialQuestion}
        onConsumeInitialQuestion={onConsumeInitialQuestion}
        onOpenCaseStudy={onOpenCaseStudy}
      />
    </section>
  );
}
