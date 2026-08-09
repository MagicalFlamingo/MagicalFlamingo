"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { knowledge } from "@/content/knowledge";

const STATS = [
  { target: 8, suffix: "+", label: "years in product design" },
  { target: 400, suffix: "K", label: "monthly users at Menora" },
  { target: 95, suffix: "%", label: "conversion rate achieved" },
];

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1100;
    const steps = 32;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (step >= steps) {
        clearInterval(timer);
        setCount(target);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref}>
      <p className="text-2xl font-bold text-[#1A1A1A] font-serif tracking-tight tabular-nums">
        {count}{suffix}
      </p>
      <p className="mt-0.5 text-[11px] text-[#1A1A1A]/40 leading-snug">
        {label}
      </p>
    </div>
  );
}

export function About() {
  const { identity } = knowledge;
  const bio = identity.positioning.split("\n\n")[0].trim();

  return (
    <section className="px-8 py-20 lg:px-14 border-t border-[#1A1A1A]/8">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#C4654A] mb-6">
            About
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-4 font-serif">
            {identity.name}
          </h2>
          <p className="text-[15px] text-[#1A1A1A]/65 leading-[1.85] max-w-[60ch]">
            {bio}
          </p>

          <div className="mt-8 mb-2 grid grid-cols-3 gap-x-6 py-7 border-t border-b border-[#1A1A1A]/8 max-w-[36ch]">
            {STATS.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>

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
        </motion.div>
      </div>
    </section>
  );
}
