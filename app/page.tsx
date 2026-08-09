import { Hero } from "@/components/portfolio/Hero";
import { CaseStudyTiles } from "@/components/portfolio/CaseStudyTiles";
import { About } from "@/components/portfolio/About";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF3E7]">
      <Hero />
      <CaseStudyTiles />
      <About />
      <footer className="px-8 lg:px-14 py-8 border-t border-[#211D1D]/8">
        <p className="text-xs text-[#211D1D]/30">
          &copy; 2026 Danielle Goldberg
        </p>
      </footer>
    </main>
  );
}
