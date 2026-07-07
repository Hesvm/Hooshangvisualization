"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Entrance wrapper reused by every post this flow appends — small opacity/translate
 * settle, then a gentle scroll-into-view so new content is revealed without a hard jump. */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
