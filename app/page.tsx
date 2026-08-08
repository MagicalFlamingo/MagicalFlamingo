import { Hero } from "@/components/portfolio/Hero";
import { CaseStudyTiles } from "@/components/portfolio/CaseStudyTiles";
import { About } from "@/components/portfolio/About";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F6F3]">
      <Hero />
      <CaseStudyTiles />
      <About />
      <footer className="px-8 lg:px-14 py-8 border-t border-[#1A1A1A]/8">
        <p className="text-xs text-[#1A1A1A]/30">
          &copy; 2026 Danielle Goldberg
        </p>
      </footer>
    </main>
  );
}
