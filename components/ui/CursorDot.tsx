"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorDot() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);

  const x = useSpring(mouseX, { damping: 22, stiffness: 400 });
  const y = useSpring(mouseY, { damping: 22, stiffness: 400 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 5);
      mouseY.set(e.clientY - 5);
    };
    const onOver = (e: MouseEvent) => {
      setHovering(!!(e.target as Element).closest("a, button, input, textarea"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full hidden md:block"
      style={{ x, y }}
      animate={{
        width: hovering ? 26 : 10,
        height: hovering ? 26 : 10,
        backgroundColor: hovering ? "rgba(196,101,74,0.25)" : "rgb(196,101,74)",
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    />
  );
}
