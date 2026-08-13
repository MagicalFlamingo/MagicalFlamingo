"use client";

import { useRef, useState } from "react";
import { Hero } from "@/components/portfolio/Hero";
import { CaseStudyModal } from "@/components/portfolio/CaseStudyModal";
import { ChatSection } from "@/components/portfolio/ChatSection";
import { CursorAccent } from "@/components/portfolio/CursorAccent";
import type { CaseStudyId } from "@/content/knowledge";

// Round 25 ("start from scratch" council): the standalone case-study
// grid is gone - case studies now surface inline in the chat's own
// opening (ChatInterface's empty-state block -> CaseStudyIntroDeck), so
// this is Hero (a compact identity plaque, not a full-viewport section)
// -> ChatSection, effectively the whole page. Still a client component:
// it owns the shared state between the chat's inline case-study cards,
// the full-screen modal they open, and the modal's own "ask about this
// project" handoff back into the same chat.
export default function Home() {
  const [openProject, setOpenProject] = useState<CaseStudyId | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-[#FAF3E7] flex flex-col">
      <CursorAccent />
      <Hero />
      <div ref={chatSectionRef} className="flex-1 flex flex-col min-h-0">
        <ChatSection
          initialQuestion={pendingQuestion}
          onConsumeInitialQuestion={() => setPendingQuestion(null)}
          onOpenCaseStudy={setOpenProject}
        />
      </div>
      <CaseStudyModal
        project={openProject}
        onClose={() => setOpenProject(null)}
        onAskAboutProject={(_project, question) => {
          // Full case-study context injection into the answer itself
          // lands in step 5 (real LLM route, system-prompt hint) - for
          // now this hands the real typed question to the same chat the
          // visitor would otherwise type into directly.
          setOpenProject(null);
          setPendingQuestion(question);
          requestAnimationFrame(() => {
            chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
          });
        }}
      />
    </main>
  );
}
