"use client";

import { useEffect, useRef, useState } from "react";
import type { ThinkingPipeline } from "./types";

/** Random integer in [min, max]. */
function randomDuration(min: number, max: number): number {
  if (max <= min) return min;
  return Math.round(min + Math.random() * (max - min));
}

/** Picks a message, avoiding whichever one this exact step showed last time. */
function pickMessage(stepId: string, messages: string[], lastShown: Map<string, string>): string {
  if (messages.length === 0) return "";
  const previous = lastShown.get(stepId);
  const pool = messages.length > 1 && previous ? messages.filter((m) => m !== previous) : messages;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  lastShown.set(stepId, chosen);
  return chosen;
}

// Module-level so re-entering the same flow later in the session still avoids
// an immediate repeat of the previous run's phrasing for a given step id.
const lastShownByStep = new Map<string, string>();

/**
 * Walks `pipeline` step by step: shows a random (non-repeating) message from
 * each step for a random duration in [minDuration, maxDuration], then
 * advances. Calls `onComplete` once after the final step's hold elapses.
 * Restarts from the top whenever the `pipeline` reference changes.
 */
export function useThinkingPipeline(pipeline: ThinkingPipeline, onComplete?: () => void): string {
  const [text, setText] = useState("");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (pipeline.length === 0) {
      setText("");
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const runStep = (index: number) => {
      if (cancelled) return;
      const step = pipeline[index];
      setText(pickMessage(step.id, step.messages, lastShownByStep));
      const duration = randomDuration(step.minDuration, step.maxDuration);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (index + 1 < pipeline.length) {
          runStep(index + 1);
        } else {
          onCompleteRef.current?.();
        }
      }, duration);
    };

    runStep(0);

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipeline]);

  return text;
}
