"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { NumericText } from "@/components/NumericText";

type AnimatedNumberProps = {
  value: number;
  format: (value: number) => string;
  durationS?: number;
  className?: string;
};

/** Count-up number, e.g. an account balance settling in on first mount. */
export function AnimatedNumber({ value, format, durationS = 0.9, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const lastValue = useRef(value);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const controls = animate(lastValue.current, value, {
      duration: durationS,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    lastValue.current = value;

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <NumericText className={className}>{format(prefersReducedMotion ? value : display)}</NumericText>;
}
