"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Add, ArrowUp, Microphone, TickCircle } from "iconsax-react";
import type { ComposerSuggestion } from "@/types/space";
import { useVoiceComposer } from "@/hooks/useVoiceComposer";
import { VoiceSpectrum } from "@/components/VoiceSpectrum";
import styles from "./Composer.module.css";

const IS_DEV = process.env.NODE_ENV !== "production";
const MAX_VISIBLE_SUGGESTIONS = 3;
const SUGGESTION_EXIT_MS = 120;
const HREF_TAP_FEEDBACK_MS = 180;

export type ComposerState =
  | "idle"
  | "focused"
  | "requesting_permission"
  | "connecting"
  | "recording"
  | "finalizing"
  | "transcript_ready"
  | "error"
  | "submitting";

type ComposerProps = {
  /** Contextual starter rows shown while focused + empty. */
  suggestions?: ComposerSuggestion[];
  /** Called when a message is sent. If omitted, the composer still animates and resets. */
  onSend?: (text: string) => void;
  onStateChange?: (state: ComposerState) => void;
  placeholder?: string;
  /**
   * "floating" (default): self-positions full-screen, own pill shadows — the
   * original standalone usage. "embedded": renders in-flow with no shadows of
   * its own, for nesting inside another surface that already owns the elevation
   * (e.g. BottomDock's unified dock card).
   */
  variant?: "floating" | "embedded";
  /**
   * Embedded only: reports the live OS-keyboard inset so the parent surface
   * (e.g. BottomDock) can lift its whole card — icons included — above the
   * keyboard, instead of just this composer sliding out from under them.
   */
  onKeyboardInsetChange?: (inset: number) => void;
};

/**
 * Composer state machine: idle → focused_empty → typing → sending → idle, with
 * a parallel voice branch (see useVoiceComposer) that morphs the same pill into
 * recording controls: idle → requesting_permission → connecting → recording →
 * finalizing → transcript_ready → idle (draft replaced with the transcript).
 * The blinking caret and the on-screen keyboard are native (HTML input + OS);
 * we only own the suggestion rows, the mic→send morph, outside-tap dismiss, and
 * reflowing above the keyboard via the visualViewport API.
 */
export function Composer({
  suggestions,
  onSend,
  onStateChange,
  placeholder = "چیکار میتونم برات کنم؟",
  variant = "floating",
  onKeyboardInsetChange,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const [kbInset, setKbInset] = useState(0);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [devKeyboardHeight, setDevKeyboardHeight] = useState(0);
  const [renderedSuggestions, setRenderedSuggestions] = useState<ComposerSuggestion[]>([]);
  const [suggestionsExiting, setSuggestionsExiting] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const devKeyboardRef = useRef<HTMLImageElement>(null);
  const suggestionExitTimerRef = useRef<number | null>(null);
  const valueRef = useRef(value);
  const visibleSuggestions = useMemo(
    () => suggestions?.slice(0, MAX_VISIBLE_SUGGESTIONS) ?? [],
    [suggestions],
  );

  const voice = useVoiceComposer({
    getDraft: () => valueRef.current,
    setDraft: setValue,
    getMockTranscript: () => {
      const firstSuggestion = visibleSuggestions[0];
      return firstSuggestion?.prompt || firstSuggestion?.label || "";
    },
    onRecordingStart: () => {
      inputRef.current?.blur();
      hideSuggestionRows();
    },
    onTranscriptReady: () => {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    },
  });

  const isSend = value.trim().length > 0;
  const isVoiceActive = voice.mode !== "idle" && voice.mode !== "error";
  const state: ComposerState = sending ? "submitting" : voice.mode !== "idle" ? voice.mode : focused ? "focused" : "idle";
  const shouldRenderSuggestions = renderedSuggestions.length > 0 && !isVoiceActive;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onStateChange?.(state);
  }, [onStateChange, state]);

  useEffect(() => {
    return () => {
      if (suggestionExitTimerRef.current !== null) {
        window.clearTimeout(suggestionExitTimerRef.current);
      }
    };
  }, []);

  // Reflow above the OS keyboard. No-op on desktop (visualViewport doesn't shrink).
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      setKbInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  // Dev-only stand-in: real touch devices always get the real OS keyboard, so
  // this only ever shows on a fine-pointer (desktop/preview) dev build where
  // there's no OS keyboard to reflow above otherwise.
  useEffect(() => {
    if (!IS_DEV || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: fine)");
    const frame = window.requestAnimationFrame(() => setIsFinePointer(mq.matches));
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener("change", handler);
    return () => {
      window.cancelAnimationFrame(frame);
      mq.removeEventListener("change", handler);
    };
  }, []);

  const showDevKeyboard = IS_DEV && isFinePointer && focused && kbInset === 0;

  useLayoutEffect(() => {
    if (!showDevKeyboard) return;
    const img = devKeyboardRef.current;
    if (!img) return;
    // The <img> mounts before its src finishes loading, so a same-tick measure
    // reads height 0 (no intrinsic size yet) — remeasure once it actually loads.
    const measure = () => setDevKeyboardHeight(img.getBoundingClientRect().height);
    if (img.complete) measure();
    img.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, [showDevKeyboard]);

  const effectiveKbInset = showDevKeyboard ? devKeyboardHeight : kbInset;

  useEffect(() => {
    if (variant !== "embedded") return;
    onKeyboardInsetChange?.(effectiveKbInset);
  }, [variant, effectiveKbInset, onKeyboardInsetChange]);

  function clearSuggestionExitTimer() {
    if (suggestionExitTimerRef.current === null) return;
    window.clearTimeout(suggestionExitTimerRef.current);
    suggestionExitTimerRef.current = null;
  }

  function showSuggestionRows() {
    if (!visibleSuggestions.length) return;
    clearSuggestionExitTimer();
    setRenderedSuggestions(visibleSuggestions);
    setSuggestionsExiting(false);
  }

  function hideSuggestionRows() {
    if (!renderedSuggestions.length) return;
    clearSuggestionExitTimer();
    setSuggestionsExiting(true);
    suggestionExitTimerRef.current = window.setTimeout(() => {
      setRenderedSuggestions([]);
      setSuggestionsExiting(false);
      suggestionExitTimerRef.current = null;
    }, SUGGESTION_EXIT_MS);
  }

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    hideSuggestionRows();
    setSending(true);
    onSend?.(trimmed);
    // Brief disabled/loading beat, then reset to idle.
    window.setTimeout(() => {
      setValue("");
      setSending(false);
      inputRef.current?.blur();
    }, 220);
  }

  function handleSuggestionPick(suggestion: ComposerSuggestion) {
    if (suggestion.href) {
      setValue(suggestion.prompt);
      hideSuggestionRows();
      window.setTimeout(() => router.push(suggestion.href!), HREF_TAP_FEEDBACK_MS);
      return;
    }
    setValue(suggestion.prompt);
    hideSuggestionRows();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleInputChange(nextValue: string) {
    if (voice.error) voice.retry();
    setValue(nextValue);
    if (nextValue.trim().length > 0) {
      hideSuggestionRows();
    } else if (focused) {
      showSuggestionRows();
    }
  }

  function handleInputFocus() {
    setFocused(true);
    if (!value.trim()) showSuggestionRows();
  }

  function handleInputBlur() {
    setFocused(false);
    hideSuggestionRows();
  }

  function handleTrailingTap() {
    if (isSend) {
      handleSend(value);
    } else if (voice.mode === "idle") {
      voice.start();
    }
  }

  const canSubmitVoice = voice.mode === "recording";

  return (
    <>
      {/* Outside-tap dismiss: only present while focused; blurs the input so the
          OS keyboard closes naturally. Transparent — no dimming. */}
      {focused && (
        <div
          className={styles.backdrop}
          aria-hidden
          onPointerDown={() => inputRef.current?.blur()}
        />
      )}

      {showDevKeyboard && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={devKeyboardRef} src="/images/dev-keyboard-reference.png" alt="" aria-hidden className={styles.devKeyboard} />
      )}

      <div
        className={`${styles.dock} ${variant === "embedded" ? styles.embedded : ""} ${shouldRenderSuggestions ? styles.hasSuggestions : ""}`}
        style={{ "--kb-inset": `${effectiveKbInset}px` } as CSSProperties}
      >
        {/* Bottom edge fade/blur — content dissolves downward beneath the sharp composer. */}
        <div className={styles.bottomEdge} aria-hidden />

        {shouldRenderSuggestions && (
          <div className={`${styles.suggestions} ${suggestionsExiting ? styles.suggestionsExiting : ""}`}>
            {renderedSuggestions.map((suggestion, index) => {
              return (
                <button
                  key={suggestion.id}
                  type="button"
                  className={styles.suggestionRow}
                  style={{ "--suggestion-index": index } as CSSProperties}
                  aria-label={suggestion.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionPick(suggestion)}
                >
                  <span className={styles.suggestionLabel}>{suggestion.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {voice.mode !== "error" && voice.mode !== "idle" && (
          <div className={styles.spectrumRow} role="status" aria-live="polite">
            <VoiceSpectrum samples={voice.amplitudeSamples} />
            {voice.isFinalizingSlow && (
              <span className={styles.finalizingHint}>دارم متن رو آماده می‌کنم…</span>
            )}
          </div>
        )}

        {voice.error && (
          <div className={styles.errorBanner} role="alert">
            <span>{voice.error.message}</span>
            <button
              type="button"
              className={styles.errorRetry}
              onClick={() => {
                voice.retry();
                voice.start();
              }}
            >
              دوباره تلاش کن
            </button>
          </div>
        )}

        <div className={`${styles.controlsRow} ${isVoiceActive ? styles.isVoiceActive : ""}`}>
          <button type="button" className={styles.plusButton} aria-label="افزودن" tabIndex={isVoiceActive ? -1 : 0}>
            <Add variant="Linear" size={24} color="var(--color-icon-line)" />
          </button>

          <div className={`${styles.composer} ${isVoiceActive ? styles.composerVoice : ""}`}>
            <div className={styles.composerContent} aria-hidden={isVoiceActive}>
              {/* First child in the RTL row = visual right (leading) edge. */}
              <button
                type="button"
                className={`${styles.trailingButton} ${isSend ? styles.isSend : ""}`}
                aria-label={isSend ? "ارسال" : "ورودی صوتی"}
                disabled={sending}
                tabIndex={isVoiceActive ? -1 : 0}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleTrailingTap}
              >
                <span className={`${styles.iconLayer} ${styles.iconMic}`} aria-hidden>
                  <Microphone variant="Linear" size={20} color="currentColor" />
                </span>
                <span className={`${styles.iconLayer} ${styles.iconSend}`} aria-hidden>
                  <ArrowUp variant="Linear" size={20} color="currentColor" />
                </span>
              </button>

              <input
                ref={inputRef}
                type="text"
                className={styles.composerText}
                placeholder={placeholder}
                value={value}
                disabled={isVoiceActive}
                tabIndex={isVoiceActive ? -1 : 0}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(value);
                }}
                enterKeyHint="send"
              />
            </div>

            <div className={styles.voiceCapsule} aria-hidden={!isVoiceActive}>
              <button
                type="button"
                className={styles.voiceCancel}
                aria-label="لغو ضبط صدا"
                tabIndex={isVoiceActive ? 0 : -1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={voice.cancel}
              >
                <span className={styles.voiceCancelIcon}>
                  <Add variant="Linear" size={22} color="var(--color-gray-neutral-800)" />
                </span>
              </button>

              <button
                type="button"
                className={styles.voiceSubmit}
                aria-label="تبدیل صدا به متن"
                disabled={!canSubmitVoice}
                tabIndex={isVoiceActive ? 0 : -1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={voice.submit}
              >
                <TickCircle variant="Bold" size={48} color="var(--color-primary)" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
