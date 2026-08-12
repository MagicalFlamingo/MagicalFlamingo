"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Council round 21 ("UI-wise, interactions - check awwwards.com"). The
// dominant 2026 pattern on that showcase is 3D/WebGL scenes that react
// to cursor position - real, but real scope (a rendering engine) and a
// real voice mismatch for a site that has twice rejected ambient/
// decorative motion for reading as "performed." The one piece of that
// trend that's genuinely proportionate here is the plainest version of
// it: a small accent that trails the real cursor and answers back when
// it's over something clickable - "circle follower with a delay" is
// the exact description research used for this, just undersized and
// on-brand (ink at rest, marigold on a target) instead of a gaming-style
// morph. It never moves on its own - only ever in response to real
// input - so it doesn't reopen the ambient-motion question CLAUDE.md
// already settled twice.
export function CursorAccent() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Real pointer + no reduced-motion preference only - touch devices
    // have no persistent cursor to accent, and this is exactly the kind
    // of motion someone with reduced-motion turned on has asked to skip.
    const pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(pointerFine && !reduceMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('button, a, input, [role="button"], [role="tab"]'));
    };
    const onLeave = () => setVisible(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[999] rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: hovering ? 26 : 7,
        height: hovering ? 26 : 7,
        border: hovering ? "1.5px solid #F2A93C" : "none",
        backgroundColor: hovering ? "transparent" : "#211D1D",
        opacity: visible ? (hovering ? 0.9 : 0.45) : 0,
        transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
      }}
    />
  );
}
