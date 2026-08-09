"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { knowledge } from "@/content/knowledge";

export function About() {
  const { identity } = knowledge;
  const bio = identity.positioning.split("\n\n")[0].trim();

  return (
    <section className="px-8 py-20 lg:px-14 border-t border-[#211D1D]/8">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#2E9B5C] mb-6">
            About
          </p>

          <h2 className="text-2xl font-bold text-[#211D1D] tracking-tight mb-4 font-serif">
            {identity.name}
          </h2>
          <p className="text-[15px] text-[#211D1D]/65 leading-[1.85] max-w-[60ch]">
            {bio}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/danielle-goldberg-cv.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#211D1D] text-[#FAF3E7] text-sm font-medium hover:bg-[#332D2A] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download CV
            </a>
            <a
              href={`mailto:${identity.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#211D1D]/20 text-[#211D1D] text-sm font-medium hover:bg-[#211D1D]/5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
