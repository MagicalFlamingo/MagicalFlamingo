"use client";

import { useRef, useState } from "react";
import { Hero } from "@/components/portfolio/Hero";
import { CaseStudyGrid } from "@/components/portfolio/CaseStudyGrid";
import { CaseStudyModal } from "@/components/portfolio/CaseStudyModal";
import { ChatSection } from "@/components/portfolio/ChatSection";
import { CursorAccent } from "@/components/portfolio/CursorAccent";
import type { CaseStudyId } from "@/content/knowledge";

// Redesign (full-page pivot, confirmed): Hero -> case-study grid -> chat,
// one scrollable page instead of the old fixed two-pane layout. This is
// now a client component (was a plain server component before) because
// it owns the shared state between the card grid, the modal, and the
// chat's mini "ask about this project" handoff - lifted here since three
// separate components need to coordinate on it.
export default function Home() {
  const [openProject, setOpenProject] = useState<CaseStudyId | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-[#FAF3E7]">
      <CursorAccent />
      <Hero />
      <CaseStudyGrid onOpen={setOpenProject} />
      <div ref={chatSectionRef}>
        <ChatSection
          initialQuestion={pendingQuestion}
          onConsumeInitialQuestion={() => setPendingQuestion(null)}
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
