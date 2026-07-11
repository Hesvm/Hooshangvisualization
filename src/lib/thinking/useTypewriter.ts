"use client";

import { useEffect, useRef, useState } from "react";

const TYPE_MIN_MS = 15;
const TYPE_MAX_MS = 28;
const DELETE_MIN_MS = 7;
const DELETE_MAX_MS = 13;
const PUNCTUATION_PAUSE_MIN_MS = 28;
const PUNCTUATION_PAUSE_MAX_MS = 56;
const BETWEEN_PAUSE_MIN_MS = 105;
const BETWEEN_PAUSE_MAX_MS = 175;

/** Persian + common sentence-boundary punctuation that earns an extra pause. */
const PUNCTUATION = new Set(["،", ".", ":", "…", "؟", "!"]);

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Animates `target` in as a human-ish typewriter: deletes whatever is
 * currently shown character by character, pauses briefly, then types the new
 * target in — with randomized per-character speed and a longer pause after
 * punctuation. No cursor is rendered; callers just display the returned text.
 * Unicode/emoji-safe (iterates by code point via `Array.from`).
 */
export function useTypewriter(target: string): string {
  const [display, setDisplay] = useState("");
  const displayRef = useRef("");
  const genRef = useRef(0);

  useEffect(() => {
    const gen = ++genRef.current;
    let cancelled = false;
    let timer: number | undefined;

    const targetChars = Array.from(target);

    const commit = (chars: string[]) => {
      const joined = chars.join("");
      displayRef.current = joined;
      setDisplay(joined);
    };

    const typeFrom = (index: number) => {
      if (cancelled || genRef.current !== gen) return;
      if (index >= targetChars.length) return;
      commit(targetChars.slice(0, index + 1));
      const justTyped = targetChars[index];
      const delay = rand(TYPE_MIN_MS, TYPE_MAX_MS) + (PUNCTUATION.has(justTyped) ? rand(PUNCTUATION_PAUSE_MIN_MS, PUNCTUATION_PAUSE_MAX_MS) : 0);
      timer = window.setTimeout(() => typeFrom(index + 1), delay);
    };

    const deleteFrom = (chars: string[]) => {
      if (cancelled || genRef.current !== gen) return;
      if (chars.length === 0) {
        timer = window.setTimeout(() => typeFrom(0), rand(BETWEEN_PAUSE_MIN_MS, BETWEEN_PAUSE_MAX_MS));
        return;
      }
      const next = chars.slice(0, -1);
      commit(next);
      timer = window.setTimeout(() => deleteFrom(next), rand(DELETE_MIN_MS, DELETE_MAX_MS));
    };

    deleteFrom(Array.from(displayRef.current));

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [target]);

  return display;
}
