"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/portfolio/Hero";
import { CaseStudyModal } from "@/components/portfolio/CaseStudyModal";
import { ChatSection } from "@/components/portfolio/ChatSection";
import { CursorAccent } from "@/components/portfolio/CursorAccent";
import { knowledge, type CaseStudyId } from "@/content/knowledge";

// Round 25 ("start from scratch" council): the standalone case-study
// grid is gone - case studies now surface inline in the chat's own
// opening (ChatInterface's empty-state block -> HeroCaseStudyBlock), so
// this is Hero (a compact identity plaque, not a full-viewport section)
// -> ChatSection, effectively the whole page. Still a client component:
// it owns the shared state between the chat's inline case-study cards,
// the full-screen modal they open, and the modal's own "ask about this
// project" handoff back into the same chat.
function isCaseStudyId(value: string | null): value is CaseStudyId {
  return value !== null && value in knowledge.caseStudies;
}

export default function Home() {
  // Council review: no case study had its own URL, so nothing about
  // this site could be forwarded - not to a hiring panel, not in a
  // Slack thread, not back to the recruiter who found it. `openProject`
  // now doubles as real, shareable state: a `?case=aws` link opens
  // straight to that modal, and opening/closing one updates the URL bar
  // via plain history.replaceState (no next/navigation useSearchParams -
  // that hook forces a Suspense boundary on this route for static
  // generation).
  //
  // The initial read has to happen in an effect, not a useState lazy
  // initializer - a lazy initializer runs during the client's first
  // render too, so it would open the modal one render before hydration
  // reconciles against the server's HTML (which always renders closed,
  // since the server doesn't see the URL's search string here). That
  // mismatch is exactly what caused a real hydration error the first
  // time this was written this way - confirmed in the dev console, not
  // theoretical. An effect runs after hydration, so the first paint
  // always matches the server, and the modal opens a tick later.
  const [openProject, setOpenProject] = useState<CaseStudyId | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const project = new URLSearchParams(window.location.search).get("case");
    if (isCaseStudyId(project)) setOpenProject(project);
    // Read once, on mount - deliberately not re-run on openProject
    // changes (that's the write-back effect below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (openProject) {
      url.searchParams.set("case", openProject);
    } else {
      url.searchParams.delete("case");
    }
    window.history.replaceState(null, "", url.toString());
  }, [openProject]);

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
