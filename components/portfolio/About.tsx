"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { knowledge } from "@/content/knowledge";

export function About() {
  const { identity } = knowledge;

  return (
    <section className="px-8 py-20 lg:px-14 border-t border-[#1A1A1A]/8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
          <div className="md:w-44">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-[#1A1A1A]/8 overflow-hidden">
              <div className="w-full h-full flex items-end justify-center" style={{ background: "linear-gradient(135deg, #E8EEF7 0%, #F0FBF2 100%)" }}>
                <div className="w-16 h-20 rounded-t-full bg-[#C4654A]/20 mb-0" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#C4654A] mb-3">About</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-4">{identity.name}</h2>
            <p className="text-[15px] text-[#1A1A1A]/65 leading-[1.85] max-w-[60ch]">
              {identity.positioning.split("\n\n")[0].trim()}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/danielle-goldberg-cv.pdf" download className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] text-[#F7F6F3] text-sm font-medium hover:bg-[#2D2D2D] transition-colors">
                <Download className="h-3.5 w-3.5" /> Download CV
              </a>
              <a href={`mailto:${identity.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A] text-sm font-medium hover:bg-[#1A1A1A]/5 transition-colors">
                <ExternalLink className="h-3.5 w-3.5" /> Get in touch
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-[#1A1A1A]/8">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#1A1A1A]/35 mb-3">Philosophy</p>
              <p className="text-sm text-[#1A1A1A]/55 leading-relaxed italic max-w-[55ch]">&ldquo;{identity.oneLiner}&rdquo;</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
