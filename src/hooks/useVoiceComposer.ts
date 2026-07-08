"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRecording } from "@soniox/react";
import { AudioDeviceError, AudioPermissionError, AudioUnavailableError } from "@soniox/client";
import { fetchSonioxSessionConfig } from "@/services/soniox/tempKeyConfig";
import { SharedMicrophoneSource } from "@/services/soniox/sharedMicrophoneSource";
import { useAudioSpectrum } from "./useAudioSpectrum";

export type VoiceMode =
  | "idle"
  | "requesting_permission"
  | "connecting"
  | "recording"
  | "finalizing"
  | "transcript_ready"
  | "error";

export type VoiceError = {
  code: "permission_denied" | "no_microphone" | "connection_failed" | "empty_transcript";
  message: string;
};

const FINALIZE_SLOW_MS = 1500;

function normalizeTranscript(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function mapError(err: unknown): VoiceError {
  if (err instanceof AudioPermissionError) {
    return { code: "permission_denied", message: "برای استفاده از ورودی صوتی، دسترسی میکروفون لازمه." };
  }
  if (err instanceof AudioDeviceError) {
    return { code: "no_microphone", message: "میکروفونی پیدا نشد." };
  }
  if (err instanceof AudioUnavailableError) {
    return { code: "no_microphone", message: "ورودی صوتی روی این مرورگر پشتیبانی نمی‌شه." };
  }
  return { code: "connection_failed", message: "اتصال صوتی برقرار نشد." };
}

type UseVoiceComposerOptions = {
  getDraft: () => string;
  setDraft: (text: string) => void;
  onRecordingStart?: () => void;
};

export function useVoiceComposer({ getDraft, setDraft, onRecordingStart }: UseVoiceComposerOptions) {
  const [mode, setMode] = useState<VoiceMode>("idle");
  const [error, setError] = useState<VoiceError | null>(null);
  const [isFinalizingSlow, setIsFinalizingSlow] = useState(false);

  const draftBeforeRecordingRef = useRef("");
  const sessionIdRef = useRef(0);
  const finalizeSlowTimerRef = useRef<number | null>(null);
  const pendingSubmitSessionRef = useRef<number | null>(null);
  const pathname = usePathname();

  const spectrum = useAudioSpectrum();
  const attachStreamRef = useRef(spectrum.attachStream);
  const detachStreamRef = useRef(spectrum.detachStream);
  attachStreamRef.current = spectrum.attachStream;
  detachStreamRef.current = spectrum.detachStream;

  const sourceRef = useRef<SharedMicrophoneSource | null>(null);
  if (!sourceRef.current) {
    sourceRef.current = new SharedMicrophoneSource({
      onStreamReady: (stream) => attachStreamRef.current(stream),
      onStreamEnded: () => detachStreamRef.current(),
    });
  }

  function clearFinalizeSlowTimer() {
    if (finalizeSlowTimerRef.current !== null) {
      window.clearTimeout(finalizeSlowTimerRef.current);
      finalizeSlowTimerRef.current = null;
    }
    setIsFinalizingSlow(false);
  }

  const rec = useRecording({
    config: fetchSonioxSessionConfig,
    model: "stt-rt-v5",
    language_hints: ["fa"],
    source: sourceRef.current,
    resetOnStart: true,
    onStateChange: ({ new_state }) => {
      if (new_state === "starting") setMode("requesting_permission");
      else if (new_state === "connecting") setMode("connecting");
      else if (new_state === "recording") setMode("recording");
      else if (new_state === "stopping") setMode("finalizing");
    },
    onError: (err) => {
      pendingSubmitSessionRef.current = null;
      clearFinalizeSlowTimer();
      setError(mapError(err));
      setMode("error");
      setDraft(draftBeforeRecordingRef.current);
    },
  });

  const recRef = useRef(rec);
  recRef.current = rec;

  // `rec.stop()` resolving does not guarantee this component has re-rendered
  // with the final transcript yet — `rec` here is only fresh once React has
  // actually committed the "stopped" state. Reading the transcript from this
  // effect (instead of synchronously after an awaited `rec.stop()`) removes
  // that race entirely: an effect body only ever runs against the render it
  // was scheduled from.
  useEffect(() => {
    if (pendingSubmitSessionRef.current === null) return;
    if (pendingSubmitSessionRef.current !== sessionIdRef.current) {
      pendingSubmitSessionRef.current = null;
      return;
    }
    if (rec.state === "error" || rec.state === "canceled") {
      pendingSubmitSessionRef.current = null;
      return;
    }
    if (rec.state !== "stopped") return;

    pendingSubmitSessionRef.current = null;
    clearFinalizeSlowTimer();
    sourceRef.current?.stop();

    const resolved = normalizeTranscript(rec.text);
    if (!resolved) {
      setError({ code: "empty_transcript", message: "صدایی تشخیص داده نشد." });
      setDraft(draftBeforeRecordingRef.current);
      setMode("idle");
      return;
    }

    setDraft(resolved);
    setMode("transcript_ready");
    setMode("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.state, rec.text]);

  const start = useCallback(() => {
    setError(null);
    sessionIdRef.current += 1;
    draftBeforeRecordingRef.current = getDraft();
    onRecordingStart?.();
    setMode("requesting_permission");
    rec.start();
  }, [rec, getDraft, onRecordingStart]);

  const cancel = useCallback(() => {
    sessionIdRef.current += 1;
    clearFinalizeSlowTimer();
    rec.cancel();
    sourceRef.current?.stop();
    setError(null);
    setMode("idle");
    setDraft(draftBeforeRecordingRef.current);
  }, [rec, setDraft]);

  const submit = useCallback(() => {
    const session = sessionIdRef.current;
    pendingSubmitSessionRef.current = session;
    setMode("finalizing");
    finalizeSlowTimerRef.current = window.setTimeout(() => setIsFinalizingSlow(true), FINALIZE_SLOW_MS);

    // The transcript itself is picked up by the `rec.state === "stopped"`
    // effect above, once React has actually rendered that final state —
    // not here, right after the promise settles.
    rec.stop().catch(() => {
      // Swallow — the effect above still resolves the outcome from
      // whatever `rec.state` ends up settling to (stopped/error/canceled).
    });
  }, [rec]);

  const retry = useCallback(() => {
    setError(null);
    setMode("idle");
  }, []);

  // Route change mid-recording: discard, restore the original draft, never send.
  const lastPathnameRef = useRef(pathname);
  useEffect(() => {
    if (lastPathnameRef.current !== pathname && mode !== "idle" && mode !== "error") {
      cancel();
    }
    lastPathnameRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      recRef.current.cancel();
      sourceRef.current?.stop();
      clearFinalizeSlowTimer();
    };
  }, []);

  return {
    mode,
    error,
    isFinalizingSlow,
    amplitudeSamples: spectrum.samples,
    start,
    cancel,
    submit,
    retry,
  };
}
