"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { knowledge } from "@/content/knowledge";

export function About() {
  const { identity } = knowledge;
  const bio = identity.positioning.split("\n\n")[0].trim();

  return (
    <section className="px-8 py-20 lg:px-14 border-t border-[#1A1A1A]/8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#C4654A] mb-6">
            About
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10 md:gap-16 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-4 font-serif">
                {identity.name}
              </h2>
              <p className="text-[15px] text-[#1A1A1A]/65 leading-[1.85] max-w-[60ch]">
                {bio}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/danielle-goldberg-cv.pdf"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] text-[#F7F6F3] text-sm font-medium hover:bg-[#2D2D2D] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CV
                </a>
                <a
                  href={`mailto:${identity.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A] text-sm font-medium hover:bg-[#1A1A1A]/5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Get in touch
                </a>
              </div>
            </div>

            {/* Philosophy pull-quote */}
            <div className="border-l-2 border-[#C4654A]/25 pl-5 py-1">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A]/28 mb-2.5">
                The question I return to
              </p>
              <p className="text-sm text-[#1A1A1A]/58 leading-relaxed italic">
                &ldquo;What is this actually saying to the person looking at it?&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
